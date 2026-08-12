(function(){
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
  // Avukat panelini açarken sorulan kod. Değiştirmek için bu satırı düzenlemeniz yeterlidir.
  panelKodu: '6448',
  vekalet: 'En yakın notere gidip “genel avukatlık vekâletnamesi” demeniz yeterlidir. Vekâletin düz, dik ve okunaklı fotoğrafı ya da PDF taraması işimizi görür.'
};

// ---- Müvekkil erişim kayıtları ----
// Her müvekkile bürodan verilen bir erişim kodu tanımlanır. Kod yalnız DOSYA DURUMU
// bilgisini açar; belge, dilekçe ve yazışma bu kanaldan paylaşılmaz (KEP/WhatsApp kullanılır).
// Yeni müvekkil eklemek için bu listeye bir satır yazıp siteyi yeniden derlemek yeterlidir.
window.MUVEKKILLER = [{
  kod: 'UY-4182',
  telSon4: '2341',
  ad: 'Elif Şahin',
  sicil: 'MV-2026-0184',
  dosyalar: [{
    id: 1,
    title: 'Kıdem Tazminatı Davası',
    fileNo: '2025/418 E.',
    court: 'Antalya 3. İş Mahkemesi',
    status: 'hearing',
    nextDate: '14 Nisan 2026, 09:40',
    progress: 62,
    akis: [['gavel', 'Duruşma günü verildi', '14 Nisan 2026, 09:40', 'pending', 'Duruşma, Antalya 3. İş Mahkemesi 2 numaralı salonda yapılacaktır. Katılımınız zorunlu değildir; tarafımızca temsil edilmektesiniz.'], ['file-text', 'Bilirkişi raporu dosyaya sunuldu', '28 Mart 2026', 'info', 'Rapor tarafınız lehine değerlendirmeler içermektedir. Rapora karşı beyan süresi takip edilmektedir.'], ['upload', 'Cevaba cevap dilekçesi sunuldu', '11 Mart 2026', 'info', 'Dilekçe, Ulusal Yargı Ağı Bilişim Sistemi üzerinden süresi içinde ibraz edilmiştir.'], ['check-circle-2', 'Dava açıldı', '2 Şubat 2026', 'success', 'Harç ve gider avansı yatırılmış, dosya tevzi edilmiştir.']]
  }, {
    id: 2,
    title: 'Kira Tespit Davası',
    fileNo: '2025/1120 E.',
    court: 'Antalya 8. Sulh Hukuk Mahkemesi',
    status: 'active',
    nextDate: '2 Mayıs 2026, 11:00',
    progress: 35,
    akis: [['calendar-days', 'Ön inceleme duruşması belirlendi', '2 Mayıs 2026, 11:00', 'pending', 'Ön inceleme aşamasında tarafların iddia ve savunmaları tespit edilecektir.'], ['check-circle-2', 'Dava açıldı', '18 Şubat 2026', 'success', 'Emsal kira bedeli araştırması için bilirkişi incelemesi talep edilmiştir.']]
  }]
}, {
  kod: 'UY-7735',
  telSon4: '7788',
  ad: 'Murat Kaya',
  sicil: 'MV-2026-0207',
  dosyalar: [{
    id: 1,
    title: 'İtirazın İptali Davası',
    fileNo: '2026/77 E.',
    court: 'Antalya 5. Asliye Hukuk Mahkemesi',
    status: 'active',
    nextDate: '19 Mayıs 2026, 10:20',
    progress: 28,
    akis: [['calendar-days', 'Duruşma günü belirlendi', '19 Mayıs 2026, 10:20', 'pending', 'Tensip zaptı düzenlenmiş, taraflara tebligat çıkarılmıştır.'], ['check-circle-2', 'Dava açıldı', '6 Mart 2026', 'success', 'İcra takibine vaki itirazın iptali istemiyle dava ikame edilmiştir.']]
  }]
}];

// ---- Ölçüm ----
// Cloudflare tarafında çalışan izleme, kaynak dosyada doğrudan eklenmez.
// Bu dosya dış bağımlılık içermemelidir.
})();