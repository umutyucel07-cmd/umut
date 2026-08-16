// ============================================================================
//  js/oturum.js — müvekkil oturumu (SUNUCU TARAFLI doğrulama)
//  Av. Umut Yücel · 13.08.2026
//
//  ── ÖNCEKİ TASARIMIN SORUNU ───────────────────────────────────────────────
//  Doğrulama BURADA yapılıyordu: girilen kod window.MUVEKKILLER listesiyle
//  karşılaştırılıyordu ve o liste herkese açık js/buro-bilgi.js içinde
//  yayınlanıyordu. Bugün listede yalnız iki ÖRNEK kayıt vardı, o yüzden
//  fiilî bir zarar doğmadı. Ama dosyanın kendi yorumu "yeni müvekkil eklemek
//  için bu listeye bir satır yazıp siteyi yeniden derlemek yeterlidir"
//  diyordu. O satır yazıldığı an 472 müvekkilin adı, erişim kodu, telefon
//  son dördü ve dava geçmişi indirilebilir hale gelecekti.
//
//  Ayrıca kod talebi de burada eşleştiriliyordu: tarayıcı "bu ad+telefon
//  kayıtlı mı" sorusunu KENDİ BAŞINA yanıtlıyordu. Bu bir sayım aracıdır —
//  liste olmasa bile kimin müvekkil olduğu tek tek sınanabilirdi.
//
//  ── YENİ ──────────────────────────────────────────────────────────────────
//  Doğrulama /api/giris ucunda. Eşleştirme /api/kod-talebi ucunda.
//  Tarayıcıya YALNIZ giriş yapan müvekkilin KENDİ kaydı iner.
// ============================================================================
(function () {
  var OTURUM = 'uy-oturum', KILIT = 'uy-giris-kilit', SINIR = 5, KILIT_SN = 60, OTURUM_GUN = 30;

  function oku(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function sil(k) { try { localStorage.removeItem(k); } catch (e) {} }

  // Sunucu yanıtı doğrulaması. _redirects içindeki tek sayfa yedeği
  // (/* -> /index.html 200) uç YOKKEN de 200 döndürür; yalnız r.ok'a bakmak
  // müvekkile YALAN söyletir. İçerik türü de sınanır.
  function jsonAl(r) {
    var tur = r.headers.get('content-type') || '';
    if (tur.indexOf('application/json') === -1) throw new Error('uc-yok');
    return r.json();
  }

  window.UYOturum = {
    normalize: function (g) {
      var t = String(g || '').toLocaleUpperCase('tr-TR').replace(/[\s\-–—._]+/g, '');
      if (/^\d{4}$/.test(t)) t = 'UY' + t;
      if (/^UY\d{4}$/.test(t)) return 'UY-' + t.slice(2);                       // eski biçim
      if (/^UY[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(t)) {
        return 'UY-' + t.slice(2, 6) + '-' + t.slice(6);                        // yeni biçim
      }
      return t;
    },

    kilitliSn: function () {
      var k = oku(KILIT);
      if (!k || !k.until) return 0;
      var sn = Math.ceil((k.until - Date.now()) / 1000);
      return sn > 0 ? sn : 0;
    },

    // Promise<{ok:true, muvekkil} | {ok:false, hata}>
    // ESKİDEN SENKRONDU. Doğrulama sunucuya taşındığı için artık Promise
    // döndürür; çağıran taraf (js/login.js) .then ile kullanır.
    dogrula: function (girilen) {
      var sn = this.kilitliSn();
      if (sn) {
        return Promise.resolve({ ok: false, hata: 'Güvenlik nedeniyle giriş geçici olarak kilitlidir. Lütfen ' + sn + ' saniye sonra yeniden deneyiniz.' });
      }
      var kod = this.normalize(girilen);
      if (!kod) {
        return Promise.resolve({ ok: false, hata: 'Lütfen tarafımızca size bildirilen erişim kodunu giriniz.' });
      }

      return fetch(window.UY_GIRIS_ENDPOINT || '/api/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kod: kod }),
      }).then(jsonAl).then(function (c) {
        if (c && c.ok && c.muvekkil) {
          sil(KILIT);
          // c.buro — büro kimlik/ödeme alanları. 16.08'de js/buro-bilgi.js'ten
          // çıkarıldı; artık yalnız doğrulanmış yanıtla geliyor.
          yaz(OTURUM, { kod: kod, t: Date.now(), muvekkil: c.muvekkil, buro: c.buro || null });
          window.UYOturum.buroBirlestir();
          return { ok: true, muvekkil: c.muvekkil };
        }

        // Yapılandırma eksiği kullanıcı hatası DEĞİLDİR: deneme hakkı yakılmaz.
        if (c && (c.durum === 'hazir-degil' || c.durum === 'kilit')) {
          return { ok: false, hata: c.mesaj || 'Giriş şu anda yapılamıyor. Lütfen kısa süre sonra yeniden deneyiniz.' };
        }

        var k = oku(KILIT) || { n: 0, until: 0 };
        if (k.until && k.until < Date.now()) k = { n: 0, until: 0 };
        k.n += 1;
        if (k.n >= SINIR) {
          k.until = Date.now() + KILIT_SN * 1000; k.n = 0; yaz(KILIT, k);
          return { ok: false, hata: 'Çok sayıda hatalı deneme yapıldı; giriş ' + KILIT_SN + ' saniye süreyle kilitlenmiştir.' };
        }
        yaz(KILIT, k);
        var temel = (c && c.mesaj) || 'Girilen kod kayıtlarımızla eşleşmemektedir.';
        return { ok: false, hata: temel + ' Kalan deneme hakkınız: ' + (SINIR - k.n) + '.' };
      }).catch(function () {
        // Ağ/uç hatası da kullanıcı hatası değildir; deneme hakkı yakılmaz.
        return { ok: false, hata: 'Bağlantı kurulamadı. İnternet bağlantınızı denetleyip yeniden deneyiniz.' };
      });
    },

    // SENKRON KALMALI — js/shell.js, js/app.js ve js/kod-talebi.js doğrudan
    // çağırıyor. Oturumda YALNIZ giriş yapan müvekkilin kendi kaydı durur.
    aktif: function () {
      var o = oku(OTURUM);
      if (!o || !o.kod || !o.muvekkil) return null;
      if (Date.now() - (o.t || 0) > OTURUM_GUN * 864e5) { sil(OTURUM); return null; }
      return o.muvekkil;
    },

    // Oturumdaki büro alanlarını window.BURO üzerine ekler.
    // Sayfa yüklenirken ve giriş başarılı olduğunda çağrılır.
    // Giriş yoksa hiçbir şey yapmaz — window.BURO.girisGerekli() true kalır.
    buroBirlestir: function () {
      try {
        var o = oku(OTURUM);
        if (!o || !o.buro || !window.BURO) return false;
        if (Date.now() - (o.t || 0) > OTURUM_GUN * 864e5) return false;
        for (var k in o.buro) {
          if (Object.prototype.hasOwnProperty.call(o.buro, k)) window.BURO[k] = o.buro[k];
        }
        return true;
      } catch (e) { return false; }
    },

    cikis: function () {
      sil(OTURUM);
      // Çıkışta büro alanları da tarayıcıdan silinir — açık kalmasın.
      try {
        if (window.BURO) {
          ['tcNo', 'iban', 'ibanDuz', 'banka', 'ibanHesap', 'odemeLink'].forEach(function (k) {
            delete window.BURO[k];
          });
        }
      } catch (e) {}
    },

    adNorm: function (a) { return String(a || '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('tr-TR'); },

    // Kod talebi. Eşleştirme ARTIK SUNUCUDA yapılır; tarayıcı kimin müvekkil
    // olduğunu bilmez ve öğrenemez.
    // Dönen: {durum: gonderildi|kuyruk|yok|eksik|sik|kanal-yok|hazir-degil, mesaj}
    // 'hazir-degil' = KV bağlı değil ya da müvekkil dizini henüz yüklenmemiş.
    // Bu durumda söz VERİLMEZ; ekranda "hazırlanmaktadır" yazar.
    kodTalep: function (ad, tel, kanal) {
      kanal = kanal === 'eposta' ? 'eposta' : 'whatsapp';
      var hedef = kanal === 'eposta' ? 'kayıtlı e-posta adresinize' : 'kayıtlı WhatsApp numaranıza';
      var son = oku('uy-kod-talep-son');
      if (son && Date.now() - son < 300000) {
        return Promise.resolve({ durum: 'sik', mesaj: 'Kısa süre önce bir talep oluşturdunuz. Lütfen birkaç dakika sonra yeniden deneyiniz.' });
      }
      var rakam = String(tel || '').replace(/\D/g, '');
      if (!String(ad || '').trim() || rakam.length < 10) {
        return Promise.resolve({ durum: 'eksik', mesaj: 'Lütfen ad soyadınızı ve telefon numaranızı eksiksiz yazınız.' });
      }
      yaz('uy-kod-talep-son', Date.now());

      // Yerel talep günlüğü: yalnız kullanıcının KENDİ tarayıcısında, kendi
      // girdiği bilgilerle. "eslesti" alanı KALDIRILDI — tarayıcı bunu
      // bilmemeli, bilirse sayım aracına dönüşür.
      var kayit = { t: new Date().toISOString(), ad: String(ad).trim(), son4: rakam.slice(-4), kanal: kanal, durum: 'bekliyor' };
      try {
        var q = JSON.parse(localStorage.getItem('uy-kod-talepleri') || '[]');
        q.unshift(kayit);
        localStorage.setItem('uy-kod-talepleri', JSON.stringify(q.slice(0, 20)));
      } catch (e2) {}

      var uc = window.UY_KOD_ENDPOINT || '/api/kod-talebi';
      var istek = fetch(uc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad: this.adNorm(ad), tel: rakam, kanal: kanal, kaynak: location.hostname }),
      }).then(jsonAl).then(function (c) {
        if (!c || typeof c.durum !== 'string') throw new Error('uc-bicim');
        kayit.durum = c.durum;
        return { durum: c.durum, mesaj: c.mesaj || 'Talebiniz alınmıştır.' };
      });

      var zamanAsimi = new Promise(function (res) { setTimeout(function () { res(null); }, 6000); });
      return Promise.race([istek, zamanAsimi]).catch(function () { return null; }).then(function (r) {
        if (r) return r;
        return { durum: 'kuyruk', mesaj: 'Talebiniz alınmıştır. Kodunuz ' + hedef + ' en geç mesai saatleri içinde iletilecektir.' };
      });
    },
  };

  // Sayfa açılışında oturumdaki büro alanlarını geri yükle.
  // buro-bilgi.js bu dosyadan ÖNCE yüklendiği için window.BURO hazırdır;
  // yine de defer sırası değişirse diye DOMContentLoaded'da bir kez daha denenir.
  window.UYOturum.buroBirlestir();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.UYOturum.buroBirlestir(); });
  }
})();
