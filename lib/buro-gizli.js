// ============================================================================
//  lib/buro-gizli.js — büro kimlik ve ödeme bilgileri · GİRİŞİN ARKASINDA
//  Av. Umut Yücel · 16.08.2026
//
//  ── NEDEN BURADA ──────────────────────────────────────────────────────────
//  Bu alanlar 16.08'e kadar js/buro-bilgi.js içindeydi ve o dosya HER SAYFADA
//  tarayıcıya iniyordu. Yani ad + T.C. kimlik + IBAN üçlüsü, siteyi açan
//  herkesin indirebileceği bir dosyada duruyordu. Üçü bir arada, birebir
//  doğru görünen sahte bir "ödeme talimatı" kurmaya yeter; müvekkil farkı
//  anlayamaz. Reklam yasağı tarafında da bunların hiçbiri Yön. m.7/d kapalı
//  listesinde yok.
//
//  ── NEDEN lib/ ────────────────────────────────────────────────────────────
//  tools/yayin-hazirla.sh beyaz listesi yalnız şunları yayınlar:
//    js · vendor · assets · functions · yonetim-uy2608
//  lib/ o listede YOKTUR — yani bu dosya hiçbir zaman web'e çıkmaz.
//  Pages Functions derleme sırasında import ile çözer; dosyanın yayın
//  dizininde bulunmasına gerek yoktur (lib/kimlik.js aylardır böyle çalışıyor).
//
//  ── KİM OKUR ──────────────────────────────────────────────────────────────
//  Yalnız functions/api/giris.js — ve yalnız erişim kodu SUNUCUDA doğrulandıktan
//  SONRA, doğrulanmış müvekkile ait yanıtın içinde. Giriş yapmamış ziyaretçi
//  bu değerlerin hiçbirini hiçbir yoldan alamaz.
//
//  ── DEĞİŞTİRMEK GEREKİRSE ─────────────────────────────────────────────────
//  Burayı düzenleyin, commit edin, yayınlayın. js/buro-bilgi.js'e GERİ TAŞIMAYIN.
//  tools/reklam-sizinti-denetle.sh yayınlanan JS'te bu alan adlarını arar ve
//  bulursa uyarır.
// ============================================================================
export const BURO_GIZLI = {
  tcNo: "18116177394",
  odemeLink: "https://pos.mokaunited.com/CustomerPos/PaymentRequest?uppc=%2bTFuwp08UTmoxr2BuxPp6g%3d%3d",
  banka: "T.C. Vakıflar Bankası T.A.O.",
  ibanHesap: "UMUT YÜCEL",
  iban: "TR08 0001 5001 5800 7307 2879 94",
  ibanDuz: "TR080001500158007307287994",
};
