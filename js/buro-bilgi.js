(function(){
var window = typeof globalThis.window !== 'undefined' ? globalThis.window : (globalThis.window = {});
window.BURO = {
  ad: 'Av. Umut Yücel',
  buro: 'Umut Yücel Hukuk Bürosu',
  baroSicil: '6448',
  tbbSicil: '160505',
  tcNo: '18116177394',
  tel: '0531 735 63 82',
  telHref: 'tel:+905317356382',
  mail: 'umutyucel07@gmail.com',
  kep: 'umut.yucel@hs02.kep.tr',
  adres: 'Meltem Mah. İsmail Baha Sürelsan Cad.\nBirlik Apt. No:21 K:8 D:25 · 07030 Muratpaşa / Antalya',
  adresKisa: 'Meltem Mah. İ. B. Sürelsan Cad. No:21 K:8 D:25, Muratpaşa',
  tarif: 'Gobu Cafe üstü, Güneş Fırını yanı',
  harita: 'https://www.google.com/maps/search/?api=1&query=Meltem+Mah.+%C4%B0smail+Baha+S%C3%BCrelsan+Cad.+No:21+Murat%C5%9Fa+Antalya',
  odemeLink: 'https://pos.mokaunited.com/CustomerPos/PaymentRequest?uppc=%2bTFuwp08UTmoxr2BuxPp6g%3d%3d',
  banka: 'T.C. Vakıflar Bankası T.A.O.',
  ibanHesap: 'UMUT YÜCEL',
  iban: 'TR08 0001 5001 5800 7307 2879 94',
  ibanDuz: 'TR080001500158007307287994',
  site: 'avumutyucelhukuk.com',
  siteUrl: 'https://avumutyucelhukuk.com',
  instagram: 'https://www.instagram.com/av.umuttyucel?utm_source=qr',
  instagramAd: '@av.umuttyucel',
  whatsapp: 'https://wa.me/905317356382',
  whatsappNo: '905317356382',
  // Hazır metinli WhatsApp bağlantısı üretir (randevu/soru talepleri buradan gelir).
  wa(metin) {
    return 'https://wa.me/' + this.whatsappNo + '?text=' + encodeURIComponent(metin);
  },
  // Cal.com hesabı açıldığında buraya bağlantı yazılır; boşsa randevu WhatsApp'tan alınır.
  calLink: 'https://cal.com/umut-yucel-ape9yr',
  // Müvekkile özel belge klasörü (Google Drive) kurulduğunda buraya yazılır.
  driveLink: null,
  linkedin: 'https://www.linkedin.com/in/umut-y%C3%BCcel-2210841a4',
  linkedinAd: 'Umut Yücel',
  vekalet: 'En yakın notere gidip “genel avukatlık vekâletnamesi” demeniz yeterlidir. Vekâletin düz, dik ve okunaklı fotoğrafı ya da PDF taraması işimizi görür.'
};

// ---- Müvekkil erişim kayıtları ----
//
//  ⛔ BURAYA MÜVEKKİL YAZILMAZ.  13.08.2026'da kaldırıldı.
//
//  Bu dosya HERKESE AÇIK yayınlanır (js/buro-bilgi.js). Eskiden burada
//  window.MUVEKKILLER dizisi vardı ve js/oturum.js girilen erişim kodunu
//  DOĞRUDAN bu diziyle karşılaştırıyordu. Dosyanın kendi yorumu da
//  "yeni müvekkil eklemek için bu listeye bir satır yazıp siteyi yeniden
//  derlemek yeterlidir" diyordu.
//
//  O satır yazıldığı an 472 müvekkilin adı, erişim kodu, telefon son dördü,
//  sicil numarası ve dava geçmişi herkesin indirebileceği bir dosyaya
//  girecekti. Kaldırıldığında listede yalnız iki ÖRNEK kayıt vardı
//  (Elif Şahin · Murat Kaya); ikisi de büro kayıtlarında arandı, bulunamadı.
//  Yani fiilî bir sızıntı doğmadı — kurulmuş ama patlamamış bir tuzaktı.
//
//  YENİ DÜZEN: doğrulama sunucuda.
//    · /api/giris        — kodu doğrular, YALNIZ o müvekkilin kaydını döner
//    · /api/kod-talebi   — ad+telefon eşleştirir, YENİ kod üretip gönderir
//    · Müvekkil kayıtları Cloudflare KV'de, biberli özet anahtarlarla durur
//    · Yükleme aracı: tools/muvekkil-yukle.js (düz metin bilgisayarınızdan çıkmaz)
//
//  Boş dizi, eski çağıranların (js/portal.js) çökmemesi için bırakıldı.
//  tools/index-denetle.sh bu dizinin boş kalmasını her commit'te sınar.
window.MUVEKKILLER = [];

// ---- Ölçüm ----
// Cloudflare tarafında çalışan izleme, kaynak dosyada doğrudan eklenmez.
// Bu dosya dış bağımlılık içermemelidir.
if (typeof module !== 'undefined' && module.exports) { module.exports = window.BURO; }
})();