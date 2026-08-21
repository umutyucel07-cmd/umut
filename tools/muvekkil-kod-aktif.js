#!/usr/bin/env node
/* ===========================================================================
 *  tools/muvekkil-kod-aktif.js — dağıtılmış MY-/UY- erişim kodlarını KV'ye
 *  aktive eder (kod:<özet> → { mv: "mv:<özet>" } haritası).
 *
 *  NİÇİN: /api/kod-talebi YENİ kod üretir → WA'ya gönderir. 21.08 itibarıyla
 *  Meta WA gönderimini `API access blocked` (error 200) ile reddediyor, yani
 *  kod talebi üretiyor ama müvekkile ULASAMIYOR. Ayrıca müvekkillerin HEMİN
 *  elinde zaten dağıtılmış bir erişim kodu (muvekkiller.json → erisim_kodu,
 *  hepsi MY-XXXX-XXXX); ama bunların KV'ye `kod:` haritası yok (KV'de yalnızca
 *  12 kadar). /api/giris bunu "kayıtlarımızla eşleşmedi / 503" diye döndürüyor.
 *
 *  Bu araç, elindeki kodunu olan 139 (telefonu da olan) müvekkiline KV'de
 *  zaten bir kod olduğunu izler gibi gösterir — kodu TELEFON'dan (WA) gerek
 *  duymaz. Meta engibi ustası geçici çözüm: kodu elinden iltifazla giriş;
 *  kodu WA gönderimi gerekmez.
 *
 *  GÜVENLİK:
 *   · Düz kod ASLA KV'ye, asla stdout'a, asla dosyaya (düz metin) geçmez.
 *     KV'de yalnız SHA-256 özet (+ biber). Araç da kodu basmaz; yalnızca
 *     ad / telSon4 / harita yönünde "aktif" bilgi verir.
 *   · 360 telefonsuz müvekkil için mv: anahtarı YOKTUR → kod: → mv: zincirinin
 *     mv ucu kırık olur, /api/giris 503 "Kaydınıza ulaşılamadı" der. Bu yüzden
 *     araç 360'ı ATLAR; onlar için önce telefon toplayıp muvekkil-yukle.js ile
 *     mv: eklemeniz gerekir.
 *   · kod: kaydı 180 g TTL (kod-talebiyle aynı). mv: kaydı da aynı anda
 *     (kod-talebi post-send şemasını takip eder) güncellenir — böylece Meta
 *     engeli kalktığında müvekkil "Kodumu gönder" dediğinde üretilen YENİ kod,
 *     bu seed'lenmiş kodu `mv.kodAnahtar` → delete ederek geçersiz kılar
 *     (çifte geçerli kod kalmaz).
 *
 *  KULLANIM:
 *    node tools/muvekkil-kod-aktif.js --kuru
 *    node tools/muvekkil-kod-aktif.js --dry
 *    node tools/muvekkil-kod-aktif.js --apply --kv <NS>
 *  wrangler kurulu + `wrangler login` yapılmış olmalı (yazmak için).
 * ============================================================================ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

/* ---- lib/kimlik.js ile AYNI normalizasyon. İkisi ayrışsa eşleşme kırılır. ---- */
const KOD_ONEK = 'MY';
const ESKI_KOD_ONEK = 'UY';
const ALFABE = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // I O 0 1 yok
const adNormalize = (v) => String(v || '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('tr-TR');
const telNormalize = (v) => String(v || '').replace(/\D/g, '').slice(-10);
// muvekkil_portal_hazirla.py:norm() ile AYNI — Türkçe karakter sadeleştirme.
// Portal dosyasındaki `ad` alanı bu dönüşümle üretildi; aynı dönüşümü burada da
// uygulamazsak raw kaydın kimliği portal kaydıyla eşleşmez.
function normAscii(v) {
  let s = String(v || '');
  s = s.replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i');
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return s;
}
function portalAdi(m) {
  const parca = [m.ad, m.soyad].filter(Boolean).join(' ') || m.klasor || '';
  return normAscii(parca).trim().toUpperCase();
}
function kodNormalize(v) {
  let t = String(v || '').toLocaleUpperCase('tr-TR').replace(/[\s\-–—._]+/g, '');
  if (/^\d{4}$/.test(t)) t = KOD_ONEK + t;
  const onek = t.startsWith(KOD_ONEK)
    ? KOD_ONEK
    : t.startsWith(ESKI_KOD_ONEK) ? ESKI_KOD_ONEK : '';
  if (!onek) return '';
  const govde = t.slice(onek.length);
  if (/^\d{4}$/.test(govde)) return `${onek}-${govde}`;
  if (new RegExp(`^[${ALFABE}]{8}$`).test(govde)) {
    return `${onek}-${govde.slice(0, 4)}-${govde.slice(4)}`;
  }
  return '';
}
function ozetle(biber, alan, deger) {
  return crypto.createHash('sha256').update(`${biber}|${alan}|${deger}`, 'utf8').digest('hex');
}

/* ---- CLI argümanları ---- */
function arg(ad, varsayilan = null) {
  const i = process.argv.indexOf(ad);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : varsayilan;
}
const flags = process.argv.slice(2);
const KURU = flags.includes('--kuru');
const DRY = flags.includes('--dry');
const APPLY = flags.includes('--apply');
if (!KURU && !DRY && !APPLY) {
  console.error('❌ Hiçbir mod verilmedi.  kuru | dry | apply  belirtin. - muvekkil-kod-aktif.js:93');
  console.error('(varsayılan apply değildir; önce kuru/dry deneyin)\n - muvekkil-kod-aktif.js:94');
  process.exit(1);
}
const biberOverride = arg('--biber');
const KV = arg('--kv', '');

const HUKUK = path.resolve(process.env.HUKUK_AUBRO || path.join(os.homedir(), 'Desktop', 'HUKUK-AVUKATLIK'));
const DOSYA_RAW = arg('--dosya-raw', path.join(HUKUK, '06_Muvekkil-Portfoyu', '_Veri', 'muvekkiller.json'));
const DOSYA_PORTAL = arg('--portal', path.join(HUKUK, '07_Buro-Duzeni', '_Veri', 'muvekkil-portal.json'));
if (!fs.existsSync(DOSYA_RAW)) process.exit(`❌ Ham müvekkil dosyası yok: ${DOSYA_RAW}`);
if (!fs.existsSync(DOSYA_PORTAL)) process.exit(`❌ Portal hazırlık dosyası yok: ${DOSYA_PORTAL}\n   Önce: python3 ${path.join(HUKUK, '07_Buro-Duzeni/_Araclar/muvekkil_portal_hazirla.py')}`);
if (APPLY && !KV) process.exit('❌ --apply için --kv <namespace-id> zorunlu.');

let muvekkiller;
try { muvekkiller = JSON.parse(fs.readFileSync(DOSYA_RAW, 'utf8')); }
catch (e) { process.exit(`❌ Ham JSON okunamadı: ${e.message}`); }
let portalRaw;
try { portalRaw = JSON.parse(fs.readFileSync(DOSYA_PORTAL, 'utf8')); }
catch (e) { process.exit(`❌ Portal JSON okunamadı: ${e.message}`); }
if (!Array.isArray(muvekkiller)) process.exit('❌ ham dosyanın kök dizini değil.');
if (!Array.isArray(portalRaw)) process.exit('❌ portal dosyasının kök dizini değil.');

/* ---- portal (tel|ad_normASCII) → kayıt indexi. Yalnız tel yeterli DEĞİL:
   4 telefon numarası birden fazla kişi/dosya tarafından paylaşılıyor (avukatın
   kendi şahsi dosyaları + iki ayrı aile ferdi). Yalnız telle indekslemek yanlış
   kişinin mv: kaydına kod bağlar — KVKK/gizlilik açısından ciddi hata. ---- */
const byTelAd = new Map();
let cakisanTel = new Set();
const telSayisi = new Map();
for (const r of portalRaw) {
  const t = telNormalize(r.tel);
  if (!t) continue;
  telSayisi.set(t, (telSayisi.get(t) || 0) + 1);
  const anahtar = `${t}|${normAscii(r.ad || '').trim().toUpperCase()}`;
  byTelAd.set(anahtar, r);
}
for (const [t, n] of telSayisi) if (n > 1) cakisanTel.add(t);


/* ---- biber (yazmak/okumak için gerekir) ---- */
function wrangler(args, girdi) {
  return execFileSync('npx', ['wrangler', ...args], {
    encoding: 'utf8', input: girdi,
    stdio: girdi === undefined ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
  });
}
function biberAl() {
  if (biberOverride) return biberOverride;
  if (KURU || !KV) return 'KURU-BIBER-SABIT';
  try {
    const m = wrangler(['kv', 'key', 'get', 'sys:biber', '--namespace-id', KV, '--remote']).trim();
    if (m && m.length >= 32) return m;
  } catch {}
  return 'KURU-BIBER-SABIT';
}
const biber = biberAl();

/* ---- eşleştir: raw (499) → portal (139) ---- */
const KOD_OMRU_GUN = 180;
const girdi = [];
let matched = 0, skipNoTel = 0, skipKodYok = 0, skipKodBozuk = [];
const ozetOniz = [];

for (const m of muvekkiller) {
  const tel = telNormalize(m.telefon);
  if (!tel || tel.length !== 10) { skipNoTel++; continue; }
  // (tel|ad) ikilisi ile ara — yalnız tel ile aramak, paylaşılan numaralarda
  // yanlış kişinin mv: kaydına kod bağlar (KVKK/gizlilik hatası).
  const rawAd = normAscii([m.ad, m.soyad].filter(Boolean).join(' ') || m.klasor || '').trim().toUpperCase();
  const rec = byTelAd.get(`${tel}|${rawAd}`);
  if (!rec) {
    skipNoTel++;   // telefonu var ama (tel,ad) ikilisi portalda yok
    continue;
  }
  if (!m.erisim_kodu) { skipKodYok++; continue; }
  const kod = kodNormalize(m.erisim_kodu);
  if (!kod) {
    skipKodBozuk.push({ ad: rawAd, telSon4: tel.slice(-4), kod: String(m.erisim_kodu).slice(0, 20) });
    continue;
  }
  const ad = adNormalize(rec.ad);
  const mvOzet = ozetle(biber, 'mv', `${adNormalize(ad)}|${telNormalize(rec.tel)}`);
  const kodOzet = ozetle(biber, 'kod', kodNormalize(kod));
  const mvKey = `mv:${mvOzet}`;
  const kodKey = `kod:${kodOzet}`;

  const mvDeger = {
    ad: rec.ad,
    tel: telNormalize(rec.tel),
    sicil: rec.sicil || '',
    dosyalar: Array.isArray(rec.dosyalar) ? rec.dosyalar : [],
    kodAnahtar: kodKey,
    kodVerilis: new Date().toISOString(),
  };
  const kodDeger = { mv: mvKey };            // düz kod YOK — yalnızca mv yönü

  girdi.push({ key: kodKey, value: JSON.stringify(kodDeger), expirationTTL: KOD_OMRU_GUN * 86400 });
  girdi.push({ key: mvKey,  value: JSON.stringify(mvDeger) });  // TTL yok (kod-talebi davranışı)
  matched++;
  if (KURU || DRY) ozetOniz.push({ ad, telSon4: tel.slice(-4), kodKey, mvKey, telPaylasimli: cakisanTel.has(tel) });
}

/* ---- rapor ---- */
const kodlu = muvekkiller.filter((m) => String(m.erisim_kodu || '').trim().startsWith('MY')).length;
console.log(`\nmuvekkilkodaktif  ·  mod: ${APPLY ? 'apply (YAZILIYOR)' : (DRY ? 'dry (okuma)' : 'kuru (sayılır)')} - muvekkil-kod-aktif.js:198`);
console.log('────────────────────────────────────────────────────────────── - muvekkil-kod-aktif.js:199');
console.log(`ham kayıt      : ${muvekkiller.length} - muvekkil-kod-aktif.js:200`);
console.log(`portal (telli) : ${byTelAd.size}  (uniq numara: ${telSayisi.size}) - muvekkil-kod-aktif.js:201`);
console.log(`MY erişim kodu : ${kodlu} - muvekkil-kod-aktif.js:202`);
console.log('eşleşme sonuçları - muvekkil-kod-aktif.js:203');
console.log(`eşleştirilecek (telli + MY kodlu): ${matched} - muvekkil-kod-aktif.js:204`);
console.log(`atlandı (telefonsuz / portalda yok): ${skipNoTel} - muvekkil-kod-aktif.js:205`);
console.log(`atlandı (kod boş): ${skipKodYok} - muvekkil-kod-aktif.js:206`);
if (skipKodBozuk.length) {
  console.log(`⚠ kodu biçimsiz (${skipKodBozuk.length}): - muvekkil-kod-aktif.js:208`);
  for (const b of skipKodBozuk.slice(0, 20)) console.log(`${b.ad} · tel…${b.telSon4} · kod="${b.kod}" - muvekkil-kod-aktif.js:209`);
}
if (cakisanTel.size) {
  const paylasimli = ozetOniz.filter((o) => o.telPaylasimli).length;
  console.log(`⚠ paylaşılan telefon: ${cakisanTel.size} numara - muvekkil-kod-aktif.js:213`);
  console.log(`bu numaralardaki ${paylasimli} kayıt (tel|ad) ikilisiyle ayrıştırıldı - muvekkil-kod-aktif.js:214`);
}
if (biber === 'KURU-BIBER-SABIT') {
  console.log("ℹ biber: KURUSABIT (KV hash'leri gerçek değil; sadece format/count). - muvekkil-kod-aktif.js:217");
}

if (KURU || DRY) {
  console.log(`üretilen harita çifti: ${matched * 2}  (kod:${matched} + mv:${matched}) - muvekkil-kod-aktif.js:221`);
  console.log('örnek hash (ilk 3  düz kod gösterilmez): - muvekkil-kod-aktif.js:222');
    for (const o of ozetOniz.slice(0, 3)) {
    console.log(`${o.ad} · tel…${o.telSon4} · ${o.kodKey.slice(0, 24)}  ${o.mvKey.slice(0, 24)} - muvekkil-kod-aktif.js:224`);
  }
  if (DRY && KV && biber !== 'KURU-BIBER-SABIT') {
    console.log('KV doğrulama (okuma) - muvekkil-kod-aktif.js:227');
    let mvVar = 0, mvYok = 0, kodVar = 0, kodYok = 0;
    for (const o of ozetOniz) {
      let mv = '', kd = '';
      try { mv = wrangler(['kv', 'key', 'get', o.mvKey, '--namespace-id', KV, '--remote']).trim(); } catch {}
      try { kd = wrangler(['kv', 'key', 'get', o.kodKey, '--namespace-id', KV, '--remote']).trim(); } catch {}
      if (mv) mvVar++; else mvYok++;
      if (kd) kodVar++; else kodYok++;
    }
    console.log(`zaten var mv: ${mvVar}  ·  eksik mv: ${mvYok} - muvekkil-kod-aktif.js:236`);
    console.log(`zaten var kod: ${kodVar} ·  eksik kod: ${kodYok} - muvekkil-kod-aktif.js:237`);
    if (mvYok) console.log(`⚠ ${mvYok} kod için mv: kaydı yok  önce "node tools/muvekkilyukle.js" çalıştırın. - muvekkil-kod-aktif.js:238`);
  }
  console.log('');
  console.log("✅ kuru çalışma temiz. apply ile KV'ye yazmak için teyit alın. - muvekkil-kod-aktif.js:241");
  process.exit(0);
}

/* ---- --apply: bulk put ---- */
const tmp = path.join(os.tmpdir(), `kod-aktif-${process.pid}.json`);
fs.writeFileSync(tmp, JSON.stringify(girdi), { mode: 0o600 });
try {
  wrangler(['kv', 'bulk', 'put', tmp, '--namespace-id', KV, '--remote']);
  console.log(`✅ ${girdi.length} kayıt KV'ye yazıldı (${matched} kod + ${matched} mv). - muvekkil-kod-aktif.js:250`);
  console.log('kod: anahtarları 180 g TTL (kodtalebiyle aynı). - muvekkil-kod-aktif.js:251');
  console.log('mv: kayıtları güncellendi; kodAnahtar alanı eklendi. - muvekkil-kod-aktif.js:252');
  console.log('Düz kod hiçbir yerde saklanmadı / basılmadı. - muvekkil-kod-aktif.js:253');
} finally {
  try { fs.unlinkSync(tmp); } catch {}
}



