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
    adNorm: function (a) { return String(a || '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('tr-TR'); },
    // Kod talebi: ad + kayıtlı telefon eşleşirse kod OTOMATİK gönderilir (sunucu ucu üzerinden).
    // Kod hiçbir durumda ekranda gösterilmez. Dönen: {durum: gonderildi|kuyruk|yok|eksik|sik, mesaj}
    kodTalep: function (ad, tel, kanal) {
      kanal = kanal === 'eposta' ? 'eposta' : 'whatsapp';
      var hedef = kanal === 'eposta' ? 'kayıtlı e-posta adresinize' : 'kayıtlı WhatsApp numaranıza';
      var son = oku('uy-kod-talep-son');
      if (son && Date.now() - son < 300000) return Promise.resolve({ durum: 'sik', mesaj: 'Kısa süre önce bir talep oluşturdunuz. Lütfen birkaç dakika sonra yeniden deneyiniz.' });
      var rakam = String(tel || '').replace(/\D/g, '');
      if (!String(ad || '').trim() || rakam.length < 10) return Promise.resolve({ durum: 'eksik', mesaj: 'Lütfen ad soyadınızı ve telefon numaranızı eksiksiz yazınız.' });
      yaz('uy-kod-talep-son', Date.now());
      var adN = this.adNorm(ad), son4 = rakam.slice(-4);
      var m = (window.MUVEKKILLER || []).filter(function (x) { return window.UYOturum.adNorm(x.ad) === adN && x.telSon4 === son4; })[0];
      var kayit = { t: new Date().toISOString(), ad: String(ad).trim(), son4: son4, kanal: kanal, eslesti: !!m, durum: m ? 'bekliyor' : 'reddedildi' };
      try { var q = JSON.parse(localStorage.getItem('uy-kod-talepleri') || '[]'); q.unshift(kayit); localStorage.setItem('uy-kod-talepleri', JSON.stringify(q.slice(0, 20))); } catch (e2) {}
      if (!m) return Promise.resolve({ durum: 'yok', mesaj: 'Bilgileriniz kayıtlarımızla eşleşmedi. Yazım denetimi yapıp yeniden deneyebilir ya da tarafımıza ulaşabilirsiniz.' });
      var uc = window.UY_KOD_ENDPOINT || '/api/kod-talebi';
      var istek = fetch(uc, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ad: adN, tel: rakam, kanal: kanal, kaynak: location.hostname }) }).then(function (r) {
        if (!r.ok) throw new Error('uc-hata');
        kayit.durum = 'gonderildi';
        return { durum: 'gonderildi', mesaj: 'Kodunuz ' + hedef + ' gönderilmiştir; birkaç dakika içinde ulaşır.' };
      });
      var zamanAsimi = new Promise(function (res) { setTimeout(function () { res(null); }, 6000); });
      return Promise.race([istek, zamanAsimi]).catch(function () { return null; }).then(function (r) {
        if (r) return r;
        return { durum: 'kuyruk', mesaj: 'Talebiniz alınmıştır. Kodunuz ' + hedef + ' en geç mesai saatleri içinde iletilecektir.' };
      });
    },
  };
})();
