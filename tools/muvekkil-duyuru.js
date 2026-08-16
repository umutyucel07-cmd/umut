#!/usr/bin/env node
/* ===========================================================================
 *  tools/muvekkil-duyuru.js — Müvekkil Bilgi Sistemi duyuru paketleri
 *  Av. Umut Yücel · 16.08.2026
 *
 *  NE YAPAR
 *  Müvekkil başına AYRI bir gönderim paketi hazırlar: kişiye özel gönderi
 *  yazısı, tanıtım afişi, kullanım kılavuzu ve hazır WhatsApp bağlantısı.
 *  Gerektiğinde kişiye özel erişim kodunu üretir ve KV'ye işler.
 *
 *  ── BU ARAÇ YALNIZ AVUKATIN KENDİ BİLGİSAYARINDA ÇALIŞIR ─────────────────
 *  Düz metin ad / telefon / kod bu makineden ÇIKMAZ:
 *    · git'e girmez  (_Gonderim/ .gitignore'da)
 *    · ekrana basılmaz — stdout'a yalnız SAYI ve sicil no yazılır
 *    · sohbete düşmez, panele yapıştırılmaz
 *  KV'ye yalnız biberli ÖZET gider; kodun kendisi KV'ye de yazılmaz.
 *
 *  ── NEDEN KADEMELİ: GÜVEN SEVİYESİ ───────────────────────────────────────
 *  16.08.2026 ölçümü — bot-muvekkil-rehberi.json, 130 numara:
 *      yuksek = 12   (UYAP ile doğrulanmış)
 *      orta   = 50
 *      dusuk  = 68
 *  Yani numaraların YARIDAN FAZLASINDA numaranın kime ait olduğu kesin
 *  değildir. Erişim kodu, portaldaki dosya bilgilerinin anahtarıdır. Kodu
 *  doğrulanmamış bir numaraya göndermek, Avukatlık Kanunu m.36 anlamında
 *  sırrın yanlış kişiye tesliminden başka bir şey değildir. Bu yüzden:
 *
 *      A kademesi (yuksek) : gönderi yazısında KOD VARDIR.
 *      B kademesi (orta)   : kod YOKTUR; müvekkil kodu siteden talep eder.
 *      C kademesi (dusuk)  : VARSAYILAN OLARAK GÖNDERİLMEZ.
 *
 *  C kademesini açmak için --dusuk-dahil bayrağı gerekir; bayrak bilinçli
 *  bir karardır, kolaylık değildir. Açılsa bile o kademede kod gönderilmez.
 *
 *  ── KULLANIM ─────────────────────────────────────────────────────────────
 *    node tools/muvekkil-duyuru.js --kuru                  # hiçbir şey yazmaz
 *    node tools/muvekkil-duyuru.js --kademe A              # yalnız doğrulanmış
 *    node tools/muvekkil-duyuru.js --kademe AB --adet 20   # ilk 20 paket
 *    node tools/muvekkil-duyuru.js --kademe AB --dusuk-dahil
 *
 *  Bayraklar
 *    --kuru          hiçbir dosya yazılmaz, KV'ye dokunulmaz, yalnız sayar
 *    --kademe A|AB   varsayılan A
 *    --adet N        en çok N paket üret (kademeli gönderim için)
 *    --dusuk-dahil   düşük güvenli numaralar da paketlensin (kod YİNE yok)
 *    --kv <id>       KV namespace (varsayılan: uy-portal-kimlik)
 *
 *  wrangler kurulu ve `wrangler login` yapılmış olmalıdır.
 * =========================================================================== */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

/* ── ayarlar ─────────────────────────────────────────────────────────────── */
const MASA = path.join(os.homedir(), 'Desktop', 'HUKUK-AVUKATLIK');
const KAYNAK_PORTAL = path.join(MASA, '06_Muvekkil-Portfoyu', '_Veri', 'muvekkil-portal.json');
const KAYNAK_REHBER = path.join(MASA, '06_Muvekkil-Portfoyu', '_Veri', 'bot-muvekkil-rehberi.json');
const CIKTI = path.join(MASA, '06_Muvekkil-Portfoyu', '_Gonderim');
const EKLER = path.join(MASA, '06_Muvekkil-Portfoyu', '_Duyuru-Ekleri');
const KV_VARSAYILAN = '583fd6cb034c460b9eb7436273a79459';
const HESAP = '42cee80ca1465fe0bd27e3756b385f20';
const KOD_OMRU_GUN = 180;                       // functions/api/kod-talebi.js ile aynı

/* lib/kimlik.js ile AYNI alfabe. Ayrışırsa üretilen kod girişte tanınmaz. */
const ALFABE = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const KOD_ONEK = 'UY';

/* ── argümanlar ──────────────────────────────────────────────────────────── */
const arg = (ad, v = null) => {
  const i = process.argv.indexOf(ad);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1] : v;
};
const KURU = process.argv.includes('--kuru');
const DUSUK_DAHIL = process.argv.includes('--dusuk-dahil');
const KADEME = String(arg('--kademe', 'A')).toUpperCase();
const ADET = Number(arg('--adet', '0')) || 0;
const KV = arg('--kv', KV_VARSAYILAN);

const dur = (m) => { console.error(`\n❌ ${m}\n`); process.exit(1); };
if (!['A', 'AB'].includes(KADEME)) dur('--kademe yalnız A veya AB olabilir.');

/* ── lib/kimlik.js ile AYNI normalizasyon ────────────────────────────────── */
const adNormalize = (v) => String(v || '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('tr-TR');
const telNormalize = (v) => String(v || '').replace(/\D/g, '').slice(-10);
const ozetle = (biber, alan, deger) =>
  crypto.createHash('sha256').update(`${biber}|${alan}|${deger}`, 'utf8').digest('hex');

/** lib/kimlik.js kodUret() ile aynı: 32^8 ≈ 1,1 × 10^12 olasılık. */
function kodUret() {
  const bayt = crypto.randomBytes(8);
  let s = '';
  for (let i = 0; i < 8; i++) s += ALFABE[bayt[i] % ALFABE.length];
  return `${KOD_ONEK}-${s.slice(0, 4)}-${s.slice(4)}`;
}
/** lib/kimlik.js kodNormalize() ile aynı — özet aynı girdiden alınmalı. */
const kodNormalize = (v) => {
  const t = String(v || '').toLocaleUpperCase('tr-TR').replace(/[\s\-–—._]+/g, '');
  const govde = t.slice(KOD_ONEK.length);
  return `${KOD_ONEK}-${govde.slice(0, 4)}-${govde.slice(4)}`;
};

function wrangler(args, girdi) {
  return execFileSync('npx', ['wrangler', ...args], {
    encoding: 'utf8',
    input: girdi,
    env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: HESAP },
    stdio: girdi === undefined ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
  });
}

/* ── gönderi yazısı ──────────────────────────────────────────────────────────
 * Bu metin DIŞA DÖNÜKTÜR. TBB Reklam Yasağı Yönetmeliği denetiminden geçti
 * (16.08.2026): ücret geçmiyor, dava sonucu/başarı iddiası yok, üstünlük ve
 * karşılaştırma yok, iş elde etme amacı taşımıyor — muhataplar hâlihazırda
 * vekâlet ilişkisi içindeki müvekkillerdir. Künye ve şerh tamdır.
 * DEĞİŞTİRİLİRSE tools/reklam-sizinti-denetle.sh yeniden çalıştırılmalıdır.
 * ------------------------------------------------------------------------ */
const KUNYE = [
  'Av. Umut Yücel',
  'Antalya Barosu — Sicil No 6448',
  'Meltem Mah. İsmail Baha Sürelsan Cad. Birlik Apt. No:21 K:8 D:25',
  '07030 Muratpaşa / Antalya',
  'avumutyucelhukuk.com',
].join('\n');

function gonderiYazisi(ad, kod) {
  const erisim = kod
    ? `Adres  : avumutyucelhukuk.com → Müvekkil Girişi\nKişisel erişim kodunuz : ${kod}`
    : 'Adres  : avumutyucelhukuk.com → Müvekkil Girişi\n'
      + 'Erişim kodunuzu, aynı ekrandaki “Erişim kodu talep et” adımından '
      + 'talep edebilirsiniz; kod kayıtlı telefon numaranıza iletilir.';
  // B kademesinde kod HENÜZ üretilmemiştir; cümle ileriye dönük kurulur.
  // Resmî yazışmada kip hatası, olmayan bir şeyi varmış gibi göstermektir.
  const gizlilik = kod
    ? 'Erişim kodunuz size özeldir'
    : 'Erişim kodunuz size özel olacaktır';

  return `Sayın ${ad},

Büromuz nezdinde yürütülmekte olan işlerinize ilişkin bilgilendirme süreçlerinin düzenli biçimde yürütülebilmesi amacıyla Müvekkil Bilgi Sistemi kullanıma alınmıştır.

Sistem üzerinden dosyalarınızın bulunduğu aşamayı görüntüleyebilir, sorularınızı ve belgelerinizi tarafımıza iletebilir, görüşme talebinde bulunabilirsiniz.

${erisim}

${gizlilik}; lütfen kimseyle paylaşmayınız. Büromuz sizden hiçbir zaman telefon, SMS veya mesaj yoluyla erişim kodu, banka/IBAN veya kart bilgisi talep etmez. Bu yönde bir talep tarafınıza ulaşırsa işlem yapmayınız ve büromuzu arayınız.

Tanıtım afişi ve kullanım kılavuzu ekte bilgilerinize sunulmuştur.

Bu sistem bilgilendirme amaçlıdır; resmî tebligat, süre ve usul işlemleri bakımından esas alınamaz. Sürelerin başlangıcı ve dosyanızın resmî durumu bakımından UYAP kayıtları ile usulüne uygun tebligat esastır.

Saygılarımızla.

${KUNYE}`;
}

/* ── girdi ───────────────────────────────────────────────────────────────── */
if (!fs.existsSync(KAYNAK_PORTAL)) dur(`Kaynak bulunamadı: ${KAYNAK_PORTAL}`);
const kayitlar = JSON.parse(fs.readFileSync(KAYNAK_PORTAL, 'utf8'));
if (!Array.isArray(kayitlar)) dur('muvekkil-portal.json kökü bir DİZİ olmalı.');

/* Güven haritası: telefonun son 10 hanesi → guven. Ad OKUNMAZ. */
const guvenHarita = new Map();
if (fs.existsSync(KAYNAK_REHBER)) {
  const r = JSON.parse(fs.readFileSync(KAYNAK_REHBER, 'utf8'));
  for (const s of (r.rehber || [])) guvenHarita.set(telNormalize(s.tel), s.guven || 'dusuk');
}

/* ── kademelendirme ──────────────────────────────────────────────────────── */
const KADEMESI = (g) => (g === 'yuksek' ? 'A' : g === 'orta' ? 'B' : 'C');
const sayac = { A: 0, B: 0, C: 0, telsiz: 0 };
const secilen = [];

for (const k of kayitlar) {
  const tel = telNormalize(k.tel);
  if (tel.length !== 10) { sayac.telsiz++; continue; }
  const kad = KADEMESI(guvenHarita.get(tel));
  sayac[kad]++;
  const uygun = kad === 'A'
    || (kad === 'B' && KADEME === 'AB')
    || (kad === 'C' && KADEME === 'AB' && DUSUK_DAHIL);
  if (uygun) secilen.push({ ...k, tel, kademe: kad });
}

const liste = ADET > 0 ? secilen.slice(0, ADET) : secilen;

console.log('müvekkil duyuru paketleri' + (KURU ? '  (KURU — hiçbir şey yazılmaz)' : ''));
console.log('──────────────────────────────────────────────────────────────');
console.log(`  kaynak kayıt      : ${kayitlar.length}`);
console.log(`  telefonu yok      : ${sayac.telsiz}`);
console.log(`  A · doğrulanmış   : ${sayac.A}   → gönderi yazısında KOD VAR`);
console.log(`  B · orta güven    : ${sayac.B}   → kod yok, siteden talep`);
console.log(`  C · düşük güven   : ${sayac.C}   → ${DUSUK_DAHIL ? 'dahil (kod yok)' : 'GÖNDERİLMEZ'}`);
console.log(`  seçilen kademe    : ${KADEME}${DUSUK_DAHIL ? ' + düşük' : ''}`);
console.log(`  üretilecek paket  : ${liste.length}${ADET ? `  (--adet ${ADET})` : ''}`);

if (!liste.length) { console.log('\n  Üretilecek paket yok.\n'); process.exit(0); }

if (KURU) {
  console.log('\n  ✅ kuru çalışma temiz. --kuru bayrağını kaldırıp yeniden çalıştırın.\n');
  process.exit(0);
}

/* ── ekler ───────────────────────────────────────────────────────────────── */
const AFIS = path.join(EKLER, 'AFIS-muvekkil-bilgi-sistemi.jpg');
const KILAVUZ = path.join(EKLER, 'MUVEKKIL-BILGI-SISTEMI-KULLANIM-KILAVUZU.pdf');
for (const e of [AFIS, KILAVUZ]) {
  if (!fs.existsSync(e)) dur(`Ek bulunamadı: ${e}\n   Afiş ve kılavuzu _Duyuru-Ekleri/ klasörüne koyun.`);
}

/* ── biber: SUNUCU üretti; ONU kullanırız. Yoksa dururuz — yeni biber ────────
 * üretmek canlıdaki 138 kaydın anahtarını geçersiz kılardı.               */
let biber = '';
try {
  biber = wrangler(['kv', 'key', 'get', 'sys:biber', '--namespace-id', KV, '--remote']).trim();
} catch (e) { dur(`KV okunamadı: ${String(e.message).slice(0, 200)}`); }
if (!biber || biber.length < 32) {
  dur('sys:biber KV\'de yok ya da kısa. Dizin yüklenmemiş olabilir — '
    + 'önce tools/muvekkil-yukle.js çalıştırılmalıdır. Buradan biber ÜRETİLMEZ.');
}

/* ── paketler ────────────────────────────────────────────────────────────── */
fs.mkdirSync(CIKTI, { recursive: true, mode: 0o700 });
const kvGirdileri = [];
const silinecek = [];
const defter = [];
let kodlu = 0, kodsuz = 0, eskisiDusen = 0;

/** Kaydın CANLI hâli — daha önce kod verilmişse eskisini bulup düşürmek için.
 *  /api/kod-talebi de aynısını yapar: yeni kod eskisinin YERİNE geçer, yanına
 *  değil. Bu adım olmadan araç ikinci kez çalıştırıldığında bir müvekkilde iki
 *  canlı kod kalır — ikisi de girişi açar, biri geri alınamaz. */
function canliKayit(anahtar) {
  try {
    const c = wrangler(['kv', 'key', 'get', anahtar, '--namespace-id', KV, '--remote']);
    return JSON.parse(c);
  } catch { return null; }
}

for (const m of liste) {
  const sicil = String(m.sicil || '').trim() || `TEL${m.tel.slice(-4)}`;
  const klasor = path.join(CIKTI, sicil.replace(/[^\w.-]+/g, '_'));
  fs.mkdirSync(klasor, { recursive: true, mode: 0o700 });

  let kod = null;
  if (m.kademe === 'A') {
    kod = kodUret();
    const mvAnahtar = `mv:${ozetle(biber, 'mv', `${adNormalize(m.ad)}|${m.tel}`)}`;
    const kodAnahtar = `kod:${ozetle(biber, 'kod', kodNormalize(kod))}`;

    const onceki = canliKayit(mvAnahtar);
    if (onceki && onceki.kodAnahtar && onceki.kodAnahtar !== kodAnahtar) {
      silinecek.push(onceki.kodAnahtar);
      eskisiDusen++;
    }

    // muvekkil-yukle.js ile AYNI gövde + kodAnahtar.
    kvGirdileri.push({
      key: kodAnahtar,
      value: JSON.stringify({ mv: mvAnahtar }),
      expiration_ttl: KOD_OMRU_GUN * 86400,
    });
    kvGirdileri.push({
      key: mvAnahtar,
      value: JSON.stringify({
        ad: String(m.ad).trim().replace(/\s+/g, ' '),
        tel: m.tel,
        sicil: m.sicil || '',
        dosyalar: Array.isArray(m.dosyalar) ? m.dosyalar : [],
        kodAnahtar,
      }),
    });
    kodlu++;
  } else { kodsuz++; }

  const yazi = gonderiYazisi(String(m.ad).trim().replace(/\s+/g, ' '), kod);
  fs.writeFileSync(path.join(klasor, 'gonderi-yazisi.txt'), yazi + '\n', { mode: 0o600 });
  fs.writeFileSync(
    path.join(klasor, 'whatsapp-baglantisi.txt'),
    `https://wa.me/90${m.tel}?text=${encodeURIComponent(yazi)}\n`,
    { mode: 0o600 },
  );
  fs.copyFileSync(AFIS, path.join(klasor, path.basename(AFIS)));
  fs.copyFileSync(KILAVUZ, path.join(klasor, path.basename(KILAVUZ)));

  // Defterde AD ve TAM NUMARA YOKTUR — sicil, son dört hane ve kademe vardır.
  defter.push(JSON.stringify({
    sicil, telSon4: m.tel.slice(-4), kademe: m.kademe,
    kod: m.kademe === 'A' ? 'uretildi' : 'yok',
    paket: 'hazir', gonderim: 'bekliyor', t: new Date().toISOString(),
  }));
}

/* ── KV yazımı ────────────────────────────────────────────────────────────
 * SIRA KRİTİK: önce YENİ kod yazılır, sonra eskisi silinir. Ters sırada
 * yazım yarıda kalırsa müvekkil kodsuz kalır; bu sırada en kötü ihtimalle
 * kısa bir an iki kod geçerli olur. */
if (kvGirdileri.length) {
  const gecici = path.join(os.tmpdir(), `uy-kod-${process.pid}.json`);
  fs.writeFileSync(gecici, JSON.stringify(kvGirdileri), { mode: 0o600 });
  try {
    wrangler(['kv', 'bulk', 'put', gecici, '--namespace-id', KV, '--remote']);
  } finally {
    try { fs.unlinkSync(gecici); } catch { /* yoksa sorun değil */ }
  }
}

if (silinecek.length) {
  const gecici = path.join(os.tmpdir(), `uy-sil-${process.pid}.json`);
  fs.writeFileSync(gecici, JSON.stringify(silinecek), { mode: 0o600 });
  try {
    wrangler(['kv', 'bulk', 'delete', gecici, '--namespace-id', KV, '--remote', '--force']);
  } finally {
    try { fs.unlinkSync(gecici); } catch { /* yoksa sorun değil */ }
  }
}

fs.appendFileSync(path.join(CIKTI, '_kayit.jsonl'), defter.join('\n') + '\n', { mode: 0o600 });

console.log('');
console.log(`  ✅ ${liste.length} paket hazırlandı → ${CIKTI}`);
console.log(`     kod üretilen : ${kodlu}   (KV'ye yalnız ÖZETİ yazıldı)`);
console.log(`     kodsuz paket : ${kodsuz}  (müvekkil siteden talep edecek)`);
if (eskisiDusen) console.log(`     eski kod düşürüldü : ${eskisiDusen}  (yenisi yerine geçti)`);
console.log('');
console.log('  Her klasörde: gonderi-yazisi.txt · whatsapp-baglantisi.txt · afiş · kılavuz');
console.log('  Gönderim: bağlantıyı açın, ekleri iliştirip gönderin. Toplu at yok —');
console.log('  aynı metnin 100 numaraya arka arkaya gitmesi hattı riske atar.');
console.log('');
