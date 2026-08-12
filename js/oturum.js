// Erişim kodu oturum sistemi — geliştirme (ui_kits) ve yayın (js/) aynı dosyayı kullanır.
// Kod doğrulama + kalıcı oturum (30 gün) + hatalı deneme kilidi (5 deneme → 60 sn).
(function () {
  var OTURUM = 'uy-oturum', KILIT = 'uy-giris-kilit', SINIR = 5, KILIT_SN = 60, OTURUM_GUN = 30;
  function oku(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function sil(k) { try { localStorage.removeItem(k); } catch (e) {} }
  window.UYOturum = {
    normalize: function (g) {
      var t = String(g || '').toLocaleUpperCase('tr-TR').replace(/[\s\-–—.]+/g, '');
      if (/^\d{4}$/.test(t)) t = 'UY' + t;
      if (/^UY\d{4}$/.test(t)) return 'UY-' + t.slice(2);
      return t;
    },
    kilitliSn: function () {
      var k = oku(KILIT);
      if (!k || !k.until) return 0;
      var sn = Math.ceil((k.until - Date.now()) / 1000);
      return sn > 0 ? sn : 0;
    },
    dogrula: function (girilen) {
      var sn = this.kilitliSn();
      if (sn) return { ok: false, hata: 'Güvenlik nedeniyle giriş geçici olarak kilitlidir. Lütfen ' + sn + ' saniye sonra yeniden deneyiniz.' };
      var kod = this.normalize(girilen);
      if (!kod) return { ok: false, hata: 'Lütfen tarafımızca size bildirilen erişim kodunu giriniz.' };
      if (!/^UY-\d{4}$/.test(kod)) return { ok: false, hata: 'Kodunuz UY-0000 biçimindedir; harf ve dört rakamı kontrol ediniz.' };
      var m = (window.MUVEKKILLER || []).filter(function (x) { return x.kod === kod; })[0];
      if (m) { sil(KILIT); yaz(OTURUM, { kod: kod, t: Date.now() }); return { ok: true, muvekkil: m }; }
      var k = oku(KILIT) || { n: 0, until: 0 };
      if (k.until && k.until < Date.now()) k = { n: 0, until: 0 };
      k.n += 1;
      if (k.n >= SINIR) {
        k.until = Date.now() + KILIT_SN * 1000; k.n = 0; yaz(KILIT, k);
        return { ok: false, hata: 'Çok sayıda hatalı deneme yapıldı; giriş ' + KILIT_SN + ' saniye süreyle kilitlenmiştir.' };
      }
      yaz(KILIT, k);
      return { ok: false, hata: 'Girilen kod kayıtlarımızla eşleşmemektedir. Kalan deneme hakkınız: ' + (SINIR - k.n) + '. Kodunuzu tarafımızdan yeniden talep edebilirsiniz.' };
    },
    aktif: function () {
      var o = oku(OTURUM);
      if (!o || !o.kod) return null;
      if (Date.now() - (o.t || 0) > OTURUM_GUN * 864e5) { sil(OTURUM); return null; }
      var m = (window.MUVEKKILLER || []).filter(function (x) { return x.kod === o.kod; })[0];
      if (!m) sil(OTURUM);
      return m || null;
    },
    cikis: function () { sil(OTURUM); },
  };
})();
