#!/usr/bin/env node
/* ===========================================================================
 *  tools/muvekkil-yukle.js — müvekkil dizinini KV'ye yükler
 *  Av. Umut Yücel · 13.08.2026
 *
 *  BU ARAÇ YALNIZ AVUKATIN KENDİ BİLGİSAYARINDA ÇALIŞIR.
 *  Düz metin müvekkil listesi bu makineden ÇIKMAZ:
 *    · git'e girmez  (_Veri/ ve *.json kalıpları .gitignore'da)
 *    · sohbete düşmez
 *    · Cloudflare paneline yapıştırılmaz
 *    · KODLAR diye bir ortam değişkeni OLUŞTURULMAZ
 *  KV'ye yalnız BİBERLİ ÖZET anahtarlar ve müvekkilin kendi kaydı gider.
 *
 *  ── ERİŞİM KODLARI BURADA ÜRETİLMEZ ──────────────────────────────────────
 *  Kod, müvekkil talep ettiği anda /api/kod-talebi tarafından üretilir ve
 *  doğrudan WhatsApp'ına gider. Hiçbir yerde düz metin kod durmaz; bu araç
 *  da kod yazmaz, okumaz, göstermez.
 *
 *  ── GİRDİ ────────────────────────────────────────────────────────────────
 *  JSON dizisi. Zorunlu alanlar: ad, tel. İsteğe bağlı: sicil, dosyalar.
 *
 *    [
 *      { "ad": "Ayşe Yılmaz", "tel": "0532 000 00 00", "sicil": "MV-2026-0001",
 *        "dosyalar": [ { "id":1, "title":"...", "fileNo":"2025/123 E.",
 *                        "court":"...", "status":"active", "nextDate":"...",
 *                        "progress":40, "akis":[ ... ] } ] }
 *    ]
 *
 *  ── KULLANIM ─────────────────────────────────────────────────────────────
 *    node tools/muvekkil-yukle.js --dosya ~/…/_Veri/muvekkil-portal.json \
 *                                 --kv <KV_NAMESPACE_ID>
 *    node tools/muvekkil-yukle.js … --kuru      # hiçbir şey yazmaz, sayar
 *
 *  wrangler kurulu ve `wrangler login` yapılmış olmalıdır.
 * =========================================================================== */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ALFABE_AD = /\s+/g;

function arg(ad, varsayilan = null) {
  const i = process.argv.indexOf(ad);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : varsayilan;
}
const KURU = process.argv.includes('--kuru');
const DOSYA = arg('--dosya');
const KV = arg('--kv');

function dur(mesaj) {
  console.error(`\n❌ ${mesaj}\n`);
  process.exit(1);
}

if (!DOSYA) dur('--dosya verilmedi.  Örnek: --dosya ~/…/_Veri/muvekkil-portal.json');
if (!KV && !KURU) dur('--kv verilmedi.  Cloudflare → Workers KV → namespace ID.');

const yol = DOSYA.startsWith('~') ? path.join(os.homedir(), DOSYA.slice(1)) : DOSYA;
if (!fs.existsSync(yol)) dur(`Dosya bulunamadı: ${yol}`);

let kayitlar;
try {
  kayitlar = JSON.parse(fs.readFileSync(yol, 'utf8'));
} catch (e) {
  dur(`JSON okunamadı: ${e.message}`);
}
if (!Array.isArray(kayitlar)) dur('Dosyanın kökü bir DİZİ olmalı.');

/* ---- lib/kimlik.js ile AYNI normalizasyon. İkisi ayrışırsa eşleşme kırılır. --- */
const adNormalize = (v) => String(v || '').trim().replace(ALFABE_AD, ' ').toLocaleUpperCase('tr-TR');
const telNormalize = (v) => String(v || '').replace(/\D/g, '').slice(-10);
const ozetle = (biber, alan, deger) =>
  crypto.createHash('sha256').update(`${biber}|${alan}|${deger}`, 'utf8').digest('hex');

function wrangler(args, girdi) {
  return execFileSync('npx', ['wrangler', ...args], {
    encoding: 'utf8',
    input: girdi,
    stdio: girdi === undefined ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
  });
}

/* ---- Biber: SUNUCU üretmiş olabilir; varsa ONU kullan, yoksa üret. --------- */
function biberAl() {
  if (KURU) return 'KURU-CALISMA-BIBERI';
  let mevcut = '';
  try {
    mevcut = wrangler(['kv', 'key', 'get', 'sys:biber', '--namespace-id', KV, '--remote']).trim();
  } catch { mevcut = ''; }
  if (mevcut && mevcut.length >= 32) return mevcut;

  // Uç henüz hiç çalışmadıysa biber yoktur; burada üretiyoruz. Uç da aynı
  // anahtarı okuyacağı için ikisi aynı bibere kilitlenir.
  const yeni = crypto.randomBytes(32).toString('hex');
  wrangler(['kv', 'key', 'put', 'sys:biber', yeni, '--namespace-id', KV, '--remote']);
  console.log('  biber üretildi ve KV\'ye yazıldı (ekrana yazılmaz).');
  return yeni;
}

/* ---- Doğrulama: yüklemeden ÖNCE. Yarım yükleme en kötü sonuçtur. ---------- */
const hatalar = [];
const gorulen = new Map();
kayitlar.forEach((k, i) => {
  const ad = adNormalize(k?.ad);
  const tel = telNormalize(k?.tel);
  if (!ad) hatalar.push(`#${i + 1}: ad boş`);
  if (tel.length !== 10) hatalar.push(`#${i + 1}: telefon 10 haneye inmiyor (${tel.length})`);
  if (k?.kod) hatalar.push(`#${i + 1}: "kod" alanı var — kodlar burada tutulmaz, kaldırın`);
  const im = `${ad}|${tel}`;
  if (gorulen.has(im)) hatalar.push(`#${i + 1}: ${gorulen.get(im)} ile aynı ad+telefon — eşleşme belirsiz olur`);
  else gorulen.set(im, `#${i + 1}`);
});
if (hatalar.length) {
  console.error(`\n❌ ${hatalar.length} sorun bulundu — hiçbir şey yazılmadı:\n`);
  hatalar.slice(0, 25).forEach((h) => console.error('   ' + h));
  if (hatalar.length > 25) console.error(`   … ve ${hatalar.length - 25} tane daha`);
  console.error('');
  process.exit(1);
}

console.log(`müvekkil dizini yükleme${KURU ? ' (KURU — hiçbir şey yazılmaz)' : ''}`);
console.log('──────────────────────────────────────────────────────────────');
console.log(`  kaynak     : ${yol}`);
console.log(`  kayıt      : ${kayitlar.length}`);

const biber = biberAl();
const girdiler = kayitlar.map((k) => {
  const ad = adNormalize(k.ad);
  const tel = telNormalize(k.tel);
  return {
    key: `mv:${ozetle(biber, 'mv', `${ad}|${tel}`)}`,
    value: JSON.stringify({
      ad: String(k.ad).trim().replace(ALFABE_AD, ' '),
      tel,
      sicil: k.sicil || '',
      dosyalar: Array.isArray(k.dosyalar) ? k.dosyalar : [],
    }),
  };
});

const benzersiz = new Set(girdiler.map((g) => g.key));
if (benzersiz.size !== girdiler.length) dur('Özet çakışması — aynı anahtar iki kez üretildi.');

if (KURU) {
  console.log(`  üretilen anahtar: ${benzersiz.size} (hepsi benzersiz)`);
  console.log('  ✅ kuru çalışma temiz. --kuru bayrağını kaldırıp yeniden çalıştırın.');
  process.exit(0);
}

const gecici = path.join(os.tmpdir(), `uy-kv-${process.pid}.json`);
fs.writeFileSync(gecici, JSON.stringify(girdiler), { mode: 0o600 });
try {
  wrangler(['kv', 'bulk', 'put', gecici, '--namespace-id', KV, '--remote']);
  wrangler([
    'kv', 'key', 'put', 'sys:dizin',
    JSON.stringify({ adet: girdiler.length, t: new Date().toISOString() }),
    '--namespace-id', KV, '--remote',
  ]);
} finally {
  // Geçici dosyada DÜZ METİN müvekkil kaydı var; her hâlükârda silinir.
  try { fs.unlinkSync(gecici); } catch {}
}

console.log(`  ✅ ${girdiler.length} müvekkil KV'ye yazıldı.`);
console.log('     Düz metin liste bu bilgisayardan çıkmadı; KV\'de yalnız');
console.log('     biberli özet anahtarlar ve müvekkilin kendi kaydı var.');
console.log('');
console.log('  Sıradaki adım: müvekkil siteden kod talep ettiğinde kod O AN');
console.log('  üretilip WhatsApp\'ına gider. Toplu kod dağıtımı yapılmaz.');
