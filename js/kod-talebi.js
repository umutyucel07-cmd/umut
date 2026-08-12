// Erişim kodu talebi + portal hazır talepler — paylaşılan bileşenler (derleme gerektirmez).
// Kod talebi: müvekkil ad + kayıtlı telefon ile kimliğini doğrular; eşleşirse kod OTOMATİK gönderilir
// (sunucu ucu varsa: /api/kod-talebi ya da window.UY_KOD_ENDPOINT). Uç yoksa talep kuyruğa düşer.
(function () {
  var e = React.createElement;
  function DS() { return window.LexaHukukDesignSystem_93e85e || {}; }

  function KodTalebiFormu() {
    var _s = React.useState({ ad: '', tel: '', bekle: false, sonuc: null });
    var s = _s[0], set = _s[1];
    var Input = DS().Input, Button = DS().Button, Card = DS().Card, Icon = DS().Icon;
    if (!Input) return null;
    function gonder(ev) {
      if (ev) ev.preventDefault();
      if (s.bekle) return;
      set(function (p) { return Object.assign({}, p, { bekle: true, sonuc: null }); });
      window.UYOturum.kodTalep(s.ad, s.tel).then(function (r) {
        set(function (p) { return Object.assign({}, p, { bekle: false, sonuc: r }); });
      });
    }
    var iyi = s.sonuc && (s.sonuc.durum === 'gonderildi' || s.sonuc.durum === 'kuyruk');
    return e(Card, { padding: 'sm', topRule: true },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-caption)', fontWeight: 700, letterSpacing: '.08em', color: 'var(--brass-700)' } }, e(Icon, { name: 'key-round', size: 14 }), 'ERİŞİM KODU TALEBİ'),
      e('p', { style: { fontSize: 'var(--text-caption)', color: 'var(--text-muted)', marginTop: 6, lineHeight: 'var(--leading-relaxed)' } }, 'Kodunuzu bilmiyorsanız ad soyadınızı ve büromuza kayıtlı telefon numaranızı yazınız. Bilgileriniz kayıtlarımızla eşleşirse kodunuz kayıtlı WhatsApp numaranıza gönderilir; kod ekranda gösterilmez.'),
      e('form', { onSubmit: gonder, style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' } },
        e(Input, { label: 'Ad Soyad', placeholder: 'Adınız Soyadınız', value: s.ad, onChange: function (ev) { var v = ev.target.value; set(function (p) { return Object.assign({}, p, { ad: v, sonuc: null }); }); } }),
        e(Input, { label: 'Kayıtlı telefon', placeholder: '05xx xxx xx xx', inputMode: 'tel', value: s.tel, onChange: function (ev) { var v = ev.target.value; set(function (p) { return Object.assign({}, p, { tel: v, sonuc: null }); }); } }),
        e(Button, { type: 'submit', size: 'sm', block: true, variant: 'secondary', icon: 'send', loading: s.bekle, onClick: gonder }, s.bekle ? 'İletiliyor' : 'Kodumu gönder')),
      s.sonuc ? e('div', { style: { display: 'flex', gap: 8, marginTop: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)' } },
        e(Icon, { name: iyi ? 'check-circle-2' : 'alert-circle', size: 15, color: iyi ? 'var(--brass-700)' : 'var(--text-faint)', style: { flex: '0 0 auto', marginTop: 2 } }),
        e('span', { style: { fontSize: 'var(--text-caption)', color: 'var(--text-body)', lineHeight: 'var(--leading-relaxed)' } }, s.sonuc.mesaj,
          s.sonuc.durum === 'yok' ? e('a', { href: window.BURO.wa('Merhaba, portal erişim kodu talebimde bilgilerim eşleşmedi; yardımcı olur musunuz?'), target: '_blank', rel: 'noopener', style: { display: 'inline-block', marginLeft: 6, fontWeight: 600 } }, 'WhatsApp ile ulaşınız') : null)) : null);
  }

  function HizliTalepler() {
    var _s = React.useState([]);
    var liste = _s[0], set = _s[1];
    var Icon = DS().Icon, Badge = DS().Badge;
    if (!Icon) return null;
    var mv = window.UYOturum && window.UYOturum.aktif();
    var dosya = mv && mv.dosyalar && mv.dosyalar[0];
    var TIPLER = [
      ['calendar-days', 'Yaklaşan duruşmam ne zaman?', function () { return dosya && dosya.nextDate ? 'Kayıtlarımıza göre en yakın işlem tarihi: ' + dosya.nextDate + ' (' + dosya.title + ' — ' + dosya.court + ').' : 'Dosyanızda planlanmış bir duruşma günü görünmemektedir; tarih belirlendiğinde bilgilendirilirsiniz.'; }, false],
      ['landmark', 'Ödeme ve IBAN bilgisi', function () { return 'Kartla ödeme için Ödemeler sekmesini kullanabilirsiniz. Havale/EFT: ' + window.BURO.iban + ' (Alıcı: ' + (window.BURO.ibanHesap || 'UMUT YÜCEL') + '). Açıklamaya dosya numaranızı yazmanız yeterlidir.'; }, false],
      ['map-pin', 'Adres ve yol tarifi', function () { return window.BURO.adres + ' — ' + window.BURO.tarif; }, false],
      ['file-text', 'Belge sureti talep ediyorum', function () { return 'Talebiniz alınmıştır. Belgeler gizlilik gereği portalde tutulmaz; en geç bir iş günü içinde WhatsApp ya da KEP üzerinden tarafınıza iletilir.'; }, true],
      ['calendar-clock', 'Randevumu değiştirmek istiyorum', function () { return 'Talebiniz alınmıştır. Dilerseniz Randevular sekmesinden uygun saat seçebilirsiniz; aksi hâlde en geç bir iş günü içinde yeni saat önerisiyle dönüş yapılır.'; }, true],
    ];
    function tikla(t) {
      var cevap = t[2]();
      if (t[3]) {
        try {
          var g = JSON.parse(localStorage.getItem('uy-gorevler') || '[]');
          g.unshift({ t: new Date().toISOString(), kim: (mv && mv.ad) || 'Müvekkil', tur: t[1], durum: 'acik' });
          localStorage.setItem('uy-gorevler', JSON.stringify(g.slice(0, 50)));
        } catch (err) {}
      }
      set(function (p) { return [{ baslik: t[1], cevap: cevap, gorev: t[3] }].concat(p).slice(0, 4); });
    }
    return e('div', { style: { border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', background: 'var(--surface-sunken)' } },
      e('div', { style: { fontSize: 'var(--text-micro, 11px)', fontWeight: 700, letterSpacing: '.1em', color: 'var(--brass-700)' } }, 'HAZIR TALEPLER — ANINDA YANIT'),
      e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' } },
        TIPLER.map(function (t) {
          return e('button', { key: t[1], onClick: function () { tikla(t); }, style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, border: '1px solid var(--border-default)', background: 'var(--surface-card, #fff)', cursor: 'pointer', font: 'inherit', fontSize: 'var(--text-caption)', color: 'var(--text-heading)' } },
            e(Icon, { name: t[0], size: 13, color: 'var(--ink-700)' }), t[1]);
        })),
      liste.map(function (m, i) {
        return e('div', { key: i, style: { marginTop: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface-card, #fff)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)' } },
          e('div', { style: { fontSize: 'var(--text-caption)', fontWeight: 600, color: 'var(--text-heading)' } }, m.baslik),
          e('p', { style: { fontSize: 'var(--text-caption)', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 'var(--leading-relaxed)' } }, m.cevap),
          m.gorev ? e('div', { style: { marginTop: 6 } }, e(Badge, { tone: 'pending', dot: true }, 'Avukatın görev listesine eklendi')) : null);
      }));
  }

  window.KodTalebiFormu = KodTalebiFormu;
  window.HizliTalepler = HizliTalepler;
})();
