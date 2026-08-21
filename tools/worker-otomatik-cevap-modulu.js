/* ============================================================================
 *  Worker'a EKLENECEK modül — otomatik_cevap.json metinlerini Worker'a taşır
 *  Av. Umut Yücel · 21.08.2026
 *
 *  ── DURUM ────────────────────────────────────────────────────────────────
 *  Bu dosya HENÜZ worker.js'e eklenmedi. worker-v6-portal-modulu.js ile
 *  AYNI desende: mevcut çalışan Worker'ı (muddy-hat-f441) BOZMADAN genişletir.
 *  Worker'ın kaynak kodu bu depoda/bu makinede yok (deploy sırrı avukatta) —
 *  bu yüzden buradaki fonksiyonlar Worker'ın kendisine değil, buraya, referans
 *  olarak yazıldı. Uygulamak isteyen avukat/Copilot bunu worker.js'e elle taşır.
 *
 *  ── NEDEN VAR ────────────────────────────────────────────────────────────
 *  Worker şu an yalnız 3 SABİT ŞABLON biliyor: alindi · sure · gorusme
 *  (bkz. ~/.agents/skills/umut-yucel-sistem/SKILL.md §2.3). Bunlar dışında,
 *  gelen mesaja anahtar kelimeyle otomatik bir ön-bilgi yanıtı vermek için
 *  Worker'ın bir kaynağı yoktu — otomatik_cevap.json yalnız yerelde duruyordu.
 *
 *  Bu modül SIFIR yeni davranış İCAT ETMEZ: sadece lib/otomatik-cevap.js'teki
 *  (canlıda /api/otomatik-cevap üzerinden zaten sunulan) 7 metni Worker'ın
 *  KENDİ /gonder ucunun kabul ettiği "şablon" mantığına uydurur.
 *
 *  ── ASLA YAPILMAYACAK ─────────────────────────────────────────────────────
 *  - Bu modül SERBEST METİN göndermez; yalnız sabit ANAHTAR seçer, gövdeyi
 *    Worker'ın kendi /gonder ucu (ki zaten yalnız bilinen şablonu kabul eder)
 *    üretir. "Serbest metin yalnız 3 sabit şablon" kuralı (SKILL.md §2.3)
 *    İHLAL EDİLMEZ — bu modül o kümeye 7 YENİ ADLI şablon önerir, kuralı
 *    esnetmez.
 *  - Müvekkil adı / T.C. / dava bilgisi bu şablonlara ASLA girmez (zaten
 *    metinlerin kendisinde yok).
 *  - İkinci bir webhook/otomatik yanıt KAYNAĞI DEĞİLDİR — mevcut TEK Worker
 *    akışının içine, mevcut TEK callback URL'in ardına eklenir.
 *
 *  ── KURULUM (avukat/Copilot, worker.js üzerinde) ─────────────────────────
 *  1) Aşağıdaki OTOMATIK_CEVAP_SABLONLARI nesnesini worker.js'in mevcut
 *     SABLONLAR nesnesine (alindi/sure/gorusme'nin yanına) EKLE.
 *  2) anahtarKelimeEslestir(metin) fonksiyonunu worker.js'e taşı.
 *  3) /gonder ucunun POST işleyicisinde: gelen mesaj metninde anahtar kelime
 *     eşleşirse, o şablon adını mevcut /gonder akışına ilet (mevcut akış
 *     zaten yalnız bilinen şablon adını kabul ediyor — hiçbir yeni doğrulama
 *     eklemeye gerek yok).
 *  4) Deploy: `wrangler deploy` (sır gerektirir, avukatta).
 *
 *  Doğrulama: reklam-sizinti-denetle.sh bu 7 metni de taramalı (mevcut
 *  denetim script'i muvekkiller.json/portföy metinlerini tarıyor; bu sabit
 *  şablonlar zaten aynı reklam yasağı sözlüğünden geldiği için yeniden
 *  yazılmadıkça ek bir sızıntı riski taşımaz).
 * ============================================================================ */

// lib/otomatik-cevap.js İLE BİREBİR AYNI OLMALI (elle senkron; bu dosya
// Worker'a AYRI bir deploy ile gittiği için import edemiyor — Worker Pages
// Functions'tan farklı bir çalışma ortamıdır, ortak modül paylaşmazlar).
const OTOMATIK_CEVAP_SABLONLARI = {
  karsilama:
    'Merhaba, mesajınız tarafımıza ulaşmıştır. En kısa sürede dönüş yapılacaktır.',
  dosya_durumu:
    'Dosyanızın güncel durumunu müvekkil portalından erişim kodunuzla ' +
    'görüntüleyebilirsiniz. Kod tarafınıza iletilmiş olmalıdır; ' +
    'elinizde yoksa büromuzla iletişime geçiniz.',
  portal_kod_yok:
    'Erişim kodunuz yoksa veya çalışmıyorsa büromuzla iletişime ' +
    'geçiniz. Kod yalnızca dosya sahibine iletilir.',
  durusma_sorusu:
    'Duruşma gün ve saatleri UYAP üzerinden belirlenmektedir. ' +
    'Dosyanıza ilişkin duruşma bilgisi için büromuza ulaşabilirsiniz.',
  mesai_disi:
    'Mesai saatleri dışındasınız. Mesajınız kaydedilmiştir, ' +
    'ilk iş günü dönüş yapılacaktır.',
  belge_talebi:
    'Dosyanıza ilişkin belge talebinizi büromuza iletebilirsiniz. ' +
    'Belgeler yalnızca dosya sahibine veya vekiline verilir.',
  hukuki_soru:
    'Sorunuz bir ön değerlendirme gerektirmektedir. ' +
    'Bu bir ön bilgilendirmedir; hukuki görüş yerine geçmez. ' +
    'Görüşme için büromuzla iletişime geçebilirsiniz.',
};

// Gelen mesaj metninden HANGİ şablonun uygun olduğunu tahmin eder.
// Serbest metin ÜRETMEZ — yalnızca yukarıdaki 7 sabit isimden birini seçer.
// Eşleşme yoksa null döner (Worker mevcut varsayılan davranışını sürdürür).
function anahtarKelimeEslestir(gelenMetin) {
  const m = String(gelenMetin || '').toLocaleLowerCase('tr-TR');
  if (/\berişim kodu\b|\bkod.*(unutt|çalışm|gelmedi)/.test(m)) return 'portal_kod_yok';
  if (/\bdosya.*(durum|nerede|ne oldu)/.test(m)) return 'dosya_durumu';
  if (/\bduruşma\b|\bcelse\b/.test(m)) return 'durusma_sorusu';
  if (/\bbelge\b|\bevrak\b|\bsuret\b/.test(m)) return 'belge_talebi';
  if (/\bhukuki\b|\bdanış|\bne yapmalıyım/.test(m)) return 'hukuki_soru';
  return null; // eşleşme yok → Worker'ın kendi varsayılan/karsilama akışı
}

// ---------------------------------------------------------------------------
//  worker.js İÇİNE NASIL TAŞINIR (module.exports YOK — bu Cloudflare Workers
//  ES module ortamıdır, worker-v6-portal-modulu.js ile AYNI kopyala-yapıştır
//  deseni): yukarıdaki OTOMATIK_CEVAP_SABLONLARI sabitini ve
//  anahtarKelimeEslestir fonksiyonunu worker.js'in üst seviyesine (export
//  edilen fetch handler'ın DIŞINA) yapıştırın; SABLONLAR nesnesi zaten
//  varsa iki nesneyi birleştirin (alindi/sure/gorusme + yukarıdaki 7 anahtar).
// ---------------------------------------------------------------------------
