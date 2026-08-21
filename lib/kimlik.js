// ============================================================================
//  lib/kimlik.js — müvekkil kimliği ve erişim kodu: ortak çekirdek
//  Av. Umut Yücel · 13.08.2026
//
//  BU DOSYA YAYINLANMAZ. functions/ altındaki uçlar derleme sırasında bunu
//  içine gömer (wrangler/esbuild). Yayın dizini beyaz listesinde lib/ YOKTUR;
//  tools/yayin-dogrula.sh bunu her çalıştırmada sınar.
//
//  ── TASARIM KARARI: kod YENİLEME (B seçeneği) ─────────────────────────────
//  A seçeneği 472 müvekkilin {ad, telefon, kod} listesini KODLAR ortam
//  değişkeninde DÜZ METİN tutacaktı. B seçeneği o değişkeni hiç oluşturmaz:
//
//    · Dizinde düz metin ad/telefon YOK — yalnız biberli özet (mv:<özet>).
//    · Kod hiçbir yerde düz metin DURMAZ — yalnız özeti saklanır (kod:<özet>).
//    · Kod talebinde YENİ kod üretilir; eski kodun özeti silinir.
//      Yani "kodumu unuttum" ile "kodum çalındı" aynı işlemdir.
//    · Kod hiçbir HTTP yanıtında, hiçbir günlükte görünmez. Yalnız
//      müvekkilin kayıtlı WhatsApp numarasına gider.
//
//  ── BİBER (pepper) ────────────────────────────────────────────────────────
//  Özetler bibersiz olsaydı ad+telefon tahmin edilebilir olduğu için sözlük
//  saldırısına açık olurdu. Biber, ilk kullanımda SUNUCUDA üretilir ve KV'de
//  durur: hiçbir insanın eline geçmez, hiçbir sohbete düşmez, panele elle
//  girilmez. Sınırı da açıkça söyleyelim: KV'nin TAMAMI sızarsa biber de
//  sızar. Biber sözlük saldırısına ve kısmi sızıntıya karşıdır, tam dökümüne
//  karşı değildir.
// ============================================================================

export const KOD_ONEK = 'MY';
// Eski dağıtılmış kodlar (13.08 öncesi) UY- önekini kullanıyordu. Her iki
// önek de kabul edilir; önek KORUNUR (normalize edilmiş halde değiştirilmez)
// çünkü kod anahtarı önekle birlikte hashlendiği için eski kayıtlar
// eşleşmeye devam eder. Yeni üretim KOD_ONEK (MY-XXXX-XXXX) olur.
export const ESKI_KOD_ONEK = 'UY';

// Karışması kolay harf/rakam yok: I, O, 0, 1 alfabede bulunmaz.
const ALFABE = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Ad normalizasyonu — Türkçe büyük harf kuralı ve fazla boşluk temizliği.
 * "i" → "İ" dönüşümü kritik: tr-TR olmadan "İnci" ile "inci" eşleşmez.
 */
export function adNormalize(v) {
  return String(v || '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('tr-TR');
}

/** Telefonun yalnız son 10 hanesi kullanılır (0/90/+90 önekleri düşer). */
export function telNormalize(v) {
  return String(v || '').replace(/\D/g, '').slice(-10);
}

/**
 * Kod normalizasyonu. MY-XXXX-XXXX (yeni), UY-XXXX-XXXX (eski uzun),
 * UY-0000 (eski kısa) kabul eder. Önek korunur; eski kodlar yeniden
 * üretilmez ama eski hash'ler eşleşmeye devam eder.
 */
export function kodNormalize(v) {
  let t = String(v || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/[\s\-–—._]+/g, '');
  if (/^\d{4}$/.test(t)) t = KOD_ONEK + t;                    // "4182" → "MY4182"
  const onek = t.startsWith(KOD_ONEK)
    ? KOD_ONEK
    : t.startsWith(ESKI_KOD_ONEK) ? ESKI_KOD_ONEK : '';
  if (!onek) return '';
  const govde = t.slice(onek.length);
  if (/^\d{4}$/.test(govde)) return `${onek}-${govde}`;        // eski kısa biçim
  if (new RegExp(`^[${ALFABE}]{8}$`).test(govde)) {
    return `${onek}-${govde.slice(0, 4)}-${govde.slice(4)}`;
  }
  return '';
}

/**
 * Yeni erişim kodu üretir: MY-XXXX-XXXX.
 *
 * NEDEN DÖRT HANE YETMİYOR: MY-0000..MY-9999 = 10.000 olasılık. 472 müvekkile
 * kod verildiğinde rastgele TEK bir tahmin %4,7 ihtimalle BİRİNİN hesabına
 * düşer. Sunucu tarafı deneme sınırı bunu yavaşlatır ama olasılığı kabul
 * edilebilir yapmaz. Bu alfabede 32^8 ≈ 1,1 × 10^12 olasılık var.
 *
 * Kodlar HENÜZ DAĞITILMADI; biçimi genişletmek için doğru an burasıdır.
 */
export function kodUret() {
  const bayt = new Uint8Array(8);
  crypto.getRandomValues(bayt);
  let s = '';
  for (let i = 0; i < 8; i++) s += ALFABE[bayt[i] % ALFABE.length];
  return `${KOD_ONEK}-${s.slice(0, 4)}-${s.slice(4)}`;
}

/** Sabit zamanlı karşılaştırma — özet karşılaştırmasında zamanlama sızıntısını kapatır. */
export function esitMi(a, b) {
  const x = String(a || '');
  const y = String(b || '');
  if (x.length !== y.length) return false;
  let fark = 0;
  for (let i = 0; i < x.length; i++) fark |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return fark === 0;
}

/**
 * Biberi getirir; yoksa SUNUCUDA üretir ve saklar.
 * Elle girilmez, sohbete düşmez, panelde görünmez.
 */
export async function biberAl(kv) {
  const mevcut = await kv.get('sys:biber');
  if (mevcut) return mevcut;
  const bayt = new Uint8Array(32);
  crypto.getRandomValues(bayt);
  const yeni = [...bayt].map((b) => b.toString(16).padStart(2, '0')).join('');
  // İki istek aynı anda gelirse ikisi de yazabilir; sonra okuyan tek değeri
  // görür. Yazımdan sonra TEKRAR OKUYUP dönüyoruz ki iki uç ayrı bibere
  // kilitlenmesin.
  await kv.put('sys:biber', yeni);
  return (await kv.get('sys:biber')) || yeni;
}

async function ozetle(biber, alan, deger) {
  const veri = new TextEncoder().encode(`${biber}|${alan}|${deger}`);
  const buf = await crypto.subtle.digest('SHA-256', veri);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Dizin anahtarı: ad + telefonun son 10 hanesi. Düz metin hiç saklanmaz. */
export async function muvekkilAnahtari(biber, ad, tel) {
  const ozet = await ozetle(biber, 'mv', `${adNormalize(ad)}|${telNormalize(tel)}`);
  return `mv:${ozet}`;
}

/** Kod anahtarı. Kodun kendisi değil, özeti saklanır. */
export async function kodAnahtari(biber, kod) {
  const ozet = await ozetle(biber, 'kod', kodNormalize(kod));
  return `kod:${ozet}`;
}

/** JSON yanıt yardımcısı — tüm uçlar aynı biçimi döndürür. */
export function json(veri, durum = 200) {
  return new Response(JSON.stringify(veri), {
    status: durum,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

/**
 * IP başına pencere sayacı.
 *
 * KV eventual consistent'tır: bir yazım küresel olarak okunur hale gelene
 * kadar ~60 saniye geçebilir. Bu yüzden pencere süresi (saniye) yayılma
 * süresinden BELİRGİN BİÇİMDE UZUN olmalıdır. 13.08.2026 ölçümü: eski
 * kodun `expirationTtl: 60` ile tuttuğu sayaç hiç devreye girmiyordu —
 * anahtar okunabilir hale gelmeden sona eriyordu. 60 saniyelik bir KV
 * sayacı fiilen ölü koddur.
 *
 * Bu haliyle bile SIKI bir sınır değil, kaba bir frendir. Asıl koruma kod
 * uzayının büyüklüğüdür (32^8 ≈ 1,1 × 10^12).
 */
export async function frenAsildiMi(kv, anahtar, tavan, saniye) {
  if (!kv) return false;
  const sayi = Number((await kv.get(anahtar)) || '0');
  if (sayi >= tavan) return true;
  await kv.put(anahtar, String(sayi + 1), { expirationTtl: saniye });
  return false;
}
