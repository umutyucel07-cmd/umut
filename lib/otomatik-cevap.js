// ============================================================================
//  lib/otomatik-cevap.js — otomatik yanıt metinlerinin TEK kaynağı
//  Av. Umut Yücel · 21.08.2026
//
//  ── BU DOSYA NEDEN VAR ────────────────────────────────────────────────────
//  07_Buro-Duzeni/_Araclar/rapor_uret.py yerel makinede
//  _Veri/otomatik_cevap.json üretiyordu, ama bu JSON'un git'e giren hiçbir
//  karşılığı yoktu (07_Buro-Duzeni tamamen .gitignore'lu — müvekkil verisi
//  içeren bir klasör). Sonuç: metinler yalnız avukatın Mac'inde durıyordu;
//  site/Worker bunlara hiç erişemiyordu, "otomatik cevap sistemi" fiilen
//  yalnız bir DOKÜMAN üretiyordu.
//
//  Bu dosya AYNI metinleri (kişisel veri İÇERMEZ — reklam yasağı ve KVKK
//  gereği zaten öyle tasarlandı) canlı depoya taşır. Artık:
//    · /api/otomatik-cevap ucu bunları JSON olarak sunar (site/mobil için)
//    · Worker'a eklenecek route bunları KV'ye YAZMADAN, doğrudan buradan
//      okuyabilir (bkz. tools/worker-otomatik-cevap-modulu.js)
//
//  ── DEĞİŞTİRME KURALI ─────────────────────────────────────────────────────
//  Metin değişirse: (1) burada değiştir, (2) rapor_uret.py'deki
//  OTOMATIK_CEVAPLAR sözlüğünü AYNI şekilde güncelle (iki kaynak birbirinden
//  bağımsız kopyadır, elle senkron tutulur), (3) reklam yasağı denetiminden
//  geçir (hukuk-dijital:reklam-yasagi-denetcisi).
// ============================================================================

export const OTOMATIK_CEVAP_SURUM = 1;

// Reklam yasağı gereği: iş çağrısı yok, hizmet sayımı yok, ücret ibaresi yok
// ("ücretsiz" dahil), müvekkil adı yok, dava sonucu yok. Yalnızca
// bilgilendirme ve yönlendirme.
export const OTOMATIK_CEVAPLAR = {
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

export const OTOMATIK_CEVAP_UYARI =
  "Bu metinler TBB Reklam Yasağı Yönetmeliği'ne göre hazırlanmıştır: iş " +
  'çağrısı, hizmet sayımı, ücret ibaresi (ücretsiz dahil), müvekkil adı ' +
  've dava sonucu YOKTUR. Değiştirilirse yeniden denetlenmelidir.';

export const OTOMATIK_CEVAP_KURAL = {
  kisisel_veri:
    'Otomatik cevaplarda müvekkil adı, T.C., dosya numarası ve dava ' +
    'bilgisi geçmez.',
  yonlendirme:
    'Dosya durumu soruları portala yönlendirilir; portal girişi kişiye ' +
    'özeldir.',
  hukuki_soru:
    "Hukuki içerikli her yanıt 'Bu bir ön bilgilendirmedir; hukuki " +
    "görüş yerine geçmez.' ibaresi taşır.",
};

export const OTOMATIK_CEVAP_KANAL = ['whatsapp', 'web', 'mobil'];

/** /api/otomatik-cevap ucunun döndüreceği tam gövde. */
export function otomatikCevapGovdesi() {
  return {
    surum: OTOMATIK_CEVAP_SURUM,
    uyari: OTOMATIK_CEVAP_UYARI,
    kanal: OTOMATIK_CEVAP_KANAL,
    cevaplar: OTOMATIK_CEVAPLAR,
    kural: OTOMATIK_CEVAP_KURAL,
  };
}
