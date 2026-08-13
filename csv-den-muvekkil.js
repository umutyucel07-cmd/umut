#!/usr/bin/env node
/* ===========================================================================
*  csv-den-muvekkil.js — CSV'den muvekkil-portal.json üretir (YEREL)
*  Av. Umut Yücel · 14.08.2026
*
*  BU ARAÇ YALNIZ AVUKATIN BİLGİSAYARINDA ÇALIŞIR. Hiçbir veri ağa çıkmaz,
*  hiçbir ad/telefon ekrana TAM basılmaz (sorun bildirimleri satır no +
*  telefonun son 4 hanesiyle yapılır). Çıktı, girdiyle AYNI klasöre yazılır.
*
*  Excel/Numbers'tan: Dosya → Dışa Aktar → CSV deyin, sonra:
*      node csv-den-muvekkil.js --csv "/yol/liste.csv"
*  Çıktı:  /yol/muvekkil-portal.json   (tools/muvekkil-yukle.js girdisi)
*
*  Kolonlar başlıktan otomatik bulunur:
*    ad  : AD SOYAD / ADI SOYADI / AD / ADI / İSİM / MÜVEKKİL / MUVEKKIL ADI
*    tel : TELEFON / TEL / GSM / CEP / CEP TELEFONU / NUMARA / TELEFON NO
*    sicil (isteğe bağlı): SİCİL / SICIL / DOSYA NO / MÜVEKKİL NO
*  Ayraç (, veya ;) kendiliğinden algılanır. "kod" kolonu varsa araç DURUR.
* =========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

function arg(ad) { const i = process.argv.indexOf(ad); return i > -1 ? process.argv[i + 1] : null; }
function dur(m) { console.error(`\n❌ ${m}\n`); process.exit(1); }

const CSV = arg('--csv');
if (!CSV) dur('--csv verilmedi.  Örnek: node csv-den-muvekkil.js --csv "/Users/.../liste.csv"');
const yol = CSV.startsWith('~') ? path.join(require('os').homedir(), CSV.slice(1)) : CSV;
if (!fs.existsSync(yol)) dur(`Dosya bulunamadı: ${yol}`);

let ham = fs.readFileSync(yol, 'utf8');
if (ham.charCodeAt(0) === 0xFEFF) ham = ham.slice(1);            // BOM (Excel)

/* --- ayraç algıla: başlık satırında hangisi çoksa o ----------------------- */
const ilkSatir = ham.split(/\r?\n/, 1)[0] || '';
const AYRAC = (ilkSatir.split(';').length > ilkSatir.split(',').length) ? ';' : ',';

/* --- RFC4180-lite ayrıştırıcı (tırnaklı alan + gömülü ayraç/yenisatır) ---- */
function csvOku(metin, ayrac) {
  const satirlar = []; let alan = '', satir = [], tirnak = false;
  for (let i = 0; i < metin.length; i++) {
    const c = metin[i];
    if (tirnak) {
      if (c === '"') { if (metin[i + 1] === '"') { alan += '"'; i++; } else tirnak = false; }
      else alan += c;
    } else if (c === '"') tirnak = true;
    else if (c === ayrac) { satir.push(alan); alan = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && metin[i + 1] === '\n') i++;
      satir.push(alan); alan = '';
      if (satir.some((h) => h.trim() !== '')) satirlar.push(satir);
      satir = [];
    } else alan += c;
  }
  if (alan !== '' || satir.length) { satir.push(alan); if (satir.some((h) => h.trim() !== '')) satirlar.push(satir); }
  return satirlar;
}

const tablo = csvOku(ham, AYRAC);
if (tablo.length < 2) dur('CSV boş görünüyor (başlık + en az 1 kayıt bekleniyor).');

/* --- kolonları başlıktan bul --------------------------------------------- */
const norm = (s) => String(s || '').trim().toLocaleUpperCase('tr-TR').replace(/[\s._-]+/g, ' ');
const baslik = tablo[0].map(norm);
const bul = (adaylar) => baslik.findIndex((b) => adaylar.includes(b));

const K_KOD = bul(['KOD', 'ERİŞİM KODU', 'ERISIM KODU', 'ŞİFRE', 'SIFRE', 'PAROLA']);
if (K_KOD > -1) dur(`"${tablo[0][K_KOD]}" kolonu var — kodlar hiçbir dosyada tutulmaz. Kolonu silip yeniden deneyin.`);

const K_AD  = bul(['AD SOYAD', 'ADI SOYADI', 'AD', 'ADI', 'İSİM', 'ISIM', 'MÜVEKKİL', 'MUVEKKIL', 'MÜVEKKİL ADI', 'MUVEKKIL ADI', 'AD SOYADI']);
const K_TEL = bul(['TELEFON', 'TEL', 'GSM', 'CEP', 'CEP TELEFONU', 'NUMARA', 'TELEFON NO', 'TEL NO', 'GSM NO']);
const K_SIC = bul(['SİCİL', 'SICIL', 'SİCİL NO', 'SICIL NO', 'DOSYA NO', 'MÜVEKKİL NO', 'MUVEKKIL NO']);
if (K_AD < 0)  dur(`Ad kolonu bulunamadı. Başlıklar: ${tablo[0].join(' | ')}`);
if (K_TEL < 0) dur(`Telefon kolonu bulunamadı. Başlıklar: ${tablo[0].join(' | ')}`);

/* --- kayıtları kur + muvekkil-yukle.js ile AYNI doğrulama ----------------- */
const telNorm = (v) => String(v || '').replace(/\D/g, '').slice(-10);
const adNorm  = (v) => String(v || '').trim().replace(/\s+/g, ' ');
const kayitlar = []; const sorunlar = []; const gorulen = new Map();

tablo.slice(1).forEach((satir, i) => {
  const no = i + 2;
  const ad = adNorm(satir[K_AD]);
  const tel = telNorm(satir[K_TEL]);
  if (!ad && !tel) return;
  if (!ad) { sorunlar.push(`satır ${no}: ad boş (tel …${tel.slice(-4)})`); return; }
  if (tel.length !== 10) { sorunlar.push(`satır ${no}: telefon 10 haneye inmiyor (${tel.length} hane)`); return; }
  const im = `${ad.toLocaleUpperCase('tr-TR')}|${tel}`;
  if (gorulen.has(im)) { sorunlar.push(`satır ${no}: satır ${gorulen.get(im)} ile aynı ad+telefon`); return; }
  gorulen.set(im, no);
  const k = { ad, tel, sicil: K_SIC > -1 ? String(satir[K_SIC] || '').trim() : '', dosyalar: [] };
  kayitlar.push(k);
});

console.log('CSV → muvekkil-portal.json');
console.log('──────────────────────────────────────────────');
console.log(`  kaynak   : ${yol}`);
console.log(`  ayraç    : "${AYRAC}"   kolonlar: ad=${tablo[0][K_AD]} tel=${tablo[0][K_TEL]}${K_SIC > -1 ? ' sicil=' + tablo[0][K_SIC] : ''}`);
console.log(`  okunan   : ${tablo.length - 1} satır → geçerli ${kayitlar.length}, sorunlu ${sorunlar.length}`);
if (sorunlar.length) {
  console.log('\n  Sorunlu satırlar (düzeltilmeden YAZILMAZ):');
  sorunlar.slice(0, 30).forEach((s) => console.log('   · ' + s));
  if (sorunlar.length > 30) console.log(`   · … ve ${sorunlar.length - 30} tane daha`);
  dur('Önce CSV\'deki bu satırları düzeltin; araç yarım liste yazmaz.');
}
if (!kayitlar.length) dur('Geçerli kayıt çıkmadı.');

const cikti = path.join(path.dirname(yol), 'muvekkil-portal.json');
fs.writeFileSync(cikti, JSON.stringify(kayitlar, null, 1), { mode: 0o600 });
console.log(`\n  ✅ yazıldı: ${cikti}  (${kayitlar.length} kayıt · yalnız bu bilgisayarda)`);
console.log('\n  Sıradaki adım:');
console.log(`  node tools/muvekkil-yukle.js --dosya "${cikti}" --kv 583fd6cb034c460b9eb7436273a79459 --kuru`);
