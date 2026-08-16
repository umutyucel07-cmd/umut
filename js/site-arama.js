// Site içi arama + dil seçimi + hızlı erişim — paylaşılan bileşenler (derleme gerektirmez).
(function () {
  var e = React.createElement;
  function DS() { return window.LexaHukukDesignSystem_93e85e || {}; }

  var ARAMA_KAYNAK = [
    ['Çalışma alanları', 'home', 'iş hukuku kira icra aile miras sözleşme gayrimenkul tüketici'],
    ['Büro ve ekip', 'buro', 'avukat umut yücel özgeçmiş baro sicil antalya misyon vizyon değerler'],
    ['Yazılar ve analizler', 'articles', 'analiz makale yazı hukuk güncel karar'],
    ['Randevu alınız', 'booking', 'randevu görüşme ön görüşme takvim saat ofis görüntülü'],
    ['Müvekkil portalı', 'login', 'giriş erişim kodu portal dosya takibi oturum'],
    ['Mobil uygulama', 'uygulama', 'uygulama telefon android ios kurulum bildirim'],
    ['Sık sorulan sorular', 'sss', 'soru cevap ücret vekâletname belge ödeme adres'],
    ['Hesaplama araçları', 'mevzuat', 'hesap süre kıdem ihbar tazminat faiz harç vekâlet ücreti hesaplama'],
    ['Ücret tarifeleri', 'mevzuat', 'ücret tarife asgari aaüt antalya barosu tavsiye fiyat'],
    ['Mevzuat', 'mevzuat', 'kanun yönetmelik meslek kuralları avukatlık kanunu hmk cmk iik tck tmk'],
    ['Bilgi edinme', 'mevzuat', 'bilgi edinme cimer başvuru kvkk şikâyet'],
    ['KVKK aydınlatma metni', 'legal:kvkk', 'kvkk aydınlatma kişisel veri gizlilik'],
    ['Kullanım koşulları', 'legal:kosullar', 'kullanım koşulları sözleşme şartlar'],
    ['Çerez politikası', 'legal:cerez', 'çerez cookie'],
  ];

  function SiteArama(props) {
    var _a = React.useState(''), q = _a[0], setQ = _a[1];
    var _b = React.useState(false), acik = _b[0], setAcik = _b[1];
    var kutu = React.useRef(null);
    var Icon = DS().Icon;
    React.useEffect(function () {
      if (!acik) return;
      var kapat = function (ev) { if (kutu.current && !kutu.current.contains(ev.target)) setAcik(false); };
      document.addEventListener('mousedown', kapat);
      return function () { document.removeEventListener('mousedown', kapat); };
    }, [acik]);
    if (!Icon) return null;
    var sonuc = q.trim().length < 2 ? [] : ARAMA_KAYNAK.filter(function (x) {
      var t = (x[0] + ' ' + x[2]).toLocaleLowerCase('tr-TR');
      return t.indexOf(q.toLocaleLowerCase('tr-TR')) > -1;
    }).slice(0, 6);
    function git(hedef) {
      setQ(''); setAcik(false);
      if (hedef.indexOf('legal:') === 0) props.go('legal', hedef.slice(6)); else props.go(hedef);
    }
    return e('div', { ref: kutu, style: { position: 'relative', flexShrink: 0 } },
      e('button', { onClick: function () { setAcik(!acik); }, 'aria-label': 'Sitede arama', title: 'Sitede arayınız', style: { width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-control)', border: 0, background: acik ? (props.dark ? 'rgba(255,255,255,.1)' : 'var(--surface-sunken)') : 'none', cursor: 'pointer', color: props.dark ? 'var(--ink-100)' : 'var(--text-muted)' } },
        e(Icon, { name: 'search', size: 17 })),
      acik ? e('div', { style: { position: 'absolute', top: 42, right: 0, width: 330, background: 'var(--surface-card, #fff)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg, 0 12px 32px rgba(0,0,0,.14))', overflow: 'hidden', zIndex: 90 } },
        e('input', {
          value: q, placeholder: 'Sitede arayınız', autoFocus: true, 'aria-label': 'Arama terimi',
          onChange: function (ev) { setQ(ev.target.value); },
          onKeyDown: function (ev) { if (ev.key === 'Enter' && sonuc.length) git(sonuc[0][1]); if (ev.key === 'Escape') setAcik(false); },
          style: { display: 'block', width: '100%', boxSizing: 'border-box', padding: '12px 16px', border: 0, borderBottom: sonuc.length ? '1px solid var(--border-hairline)' : 0, outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)' },
        }),
        sonuc.map(function (s, i) {
          return e('button', { key: s[0], onMouseDown: function () { git(s[1]); }, style: { display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', border: 0, borderTop: i ? '1px solid var(--border-hairline)' : 0, background: 'none', cursor: 'pointer', font: 'inherit', fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)' } }, s[0]);
        }),
        q.trim().length >= 2 && !sonuc.length ? e('div', { style: { padding: '12px 16px', fontSize: 'var(--text-caption)', color: 'var(--text-faint)' } }, 'Sonuç bulunamadı.') : null) : null);
  }

  var DILLER = [['tr', 'Türkçe'], ['en', 'English'], ['ru', 'Русский'], ['de', 'Deutsch'], ['ar', 'العربية']];
  var DIL_METIN = {
    en: { b: 'Legal services in Antalya', p: 'Our office provides representation and advisory services in labour law, tenancy and real estate disputes, enforcement proceedings, family law and contract law. Consultations are held at our office, by video call or by telephone. Correspondence in English is welcome.', c: 'Request an appointment' },
    ru: { b: 'Юридические услуги в Анталье', p: 'Наше бюро оказывает юридическую помощь по трудовым спорам, аренде и недвижимости, исполнительному производству, семейному и договорному праву. Консультации проводятся в офисе, по видеосвязи или по телефону. Возможна переписка на русском языке.', c: 'Записаться на приём' },
    de: { b: 'Rechtsberatung in Antalya', p: 'Unsere Kanzlei vertritt und berät in den Bereichen Arbeitsrecht, Miet- und Immobilienrecht, Zwangsvollstreckung, Familienrecht und Vertragsrecht. Beratungen finden in der Kanzlei, per Videogespräch oder telefonisch statt. Korrespondenz auf Deutsch ist möglich.', c: 'Termin vereinbaren' },
    ar: { b: 'خدمات قانونية في أنطاليا', p: 'يقدّم مكتبنا التمثيل والاستشارة في قانون العمل، ونزاعات الإيجار والعقارات، والتنفيذ والإفلاس، وقانون الأسرة، وقانون العقود. تُعقد الاستشارات في المكتب أو عبر مكالمة مرئية أو هاتفياً. يمكن المراسلة باللغة العربية.', c: 'طلب موعد' },
  };

  function DilSecici(props) {
    var _a = React.useState(false), acik = _a[0], setAcik = _a[1];
    var Icon = DS().Icon;
    if (!Icon) return null;
    return e('div', { style: { position: 'relative', flexShrink: 0 } },
      e('button', { onClick: function () { setAcik(!acik); }, 'aria-label': 'Dil seçiniz', style: { display: 'inline-flex', alignItems: 'center', gap: 5, height: 34, padding: '0 10px', borderRadius: 'var(--radius-control)', border: '1px solid ' + (props.dark ? 'rgba(255,255,255,.16)' : 'var(--border-default)'), background: 'none', cursor: 'pointer', font: 'inherit', fontSize: 'var(--text-caption)', fontWeight: 600, color: props.dark ? 'var(--paper-1)' : 'var(--text-heading)' } },
        e(Icon, { name: 'globe', size: 14 }), (props.dil || 'tr').toLocaleUpperCase('tr-TR')),
      acik ? e('div', { style: { position: 'absolute', top: 40, right: 0, width: 150, background: 'var(--surface-card, #fff)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg, 0 12px 32px rgba(0,0,0,.14))', overflow: 'hidden', zIndex: 90 } },
        DILLER.map(function (d, i) {
          var secili = (props.dil || 'tr') === d[0];
          return e('button', { key: d[0], onClick: function () { setAcik(false); props.setDil(d[0]); }, style: { display: 'flex', width: '100%', alignItems: 'center', gap: 8, textAlign: 'left', padding: '9px 14px', border: 0, borderTop: i ? '1px solid var(--border-hairline)' : 0, background: secili ? 'var(--surface-sunken)' : 'none', cursor: 'pointer', font: 'inherit', fontSize: 'var(--text-body-sm)', fontWeight: secili ? 600 : 400, color: 'var(--text-heading)' } },
            e('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-faint)', width: 18 } }, d[0].toLocaleUpperCase('tr-TR')), d[1]);
        })) : null);
  }

  function DilBandi(props) {
    var m = DIL_METIN[props.dil];
    var Button = DS().Button, Icon = DS().Icon;
    if (!m || !Button) return null;
    var rtl = props.dil === 'ar';
    return e('div', { dir: rtl ? 'rtl' : 'ltr', style: { background: 'var(--ink-950)', color: 'var(--paper-1)', padding: 'var(--space-8) var(--gutter-page-lg)' } },
      e('div', { style: { maxWidth: 'var(--max-content)', margin: '0 auto', display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start' } },
        e('div', { style: { flex: 1 } },
          e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-title-2)', color: 'var(--paper-1)' } }, m.b),
          e('p', { style: { fontSize: 'var(--text-body)', color: 'var(--ink-100)', marginTop: 'var(--space-3)', lineHeight: 'var(--leading-relaxed)', maxWidth: '70ch' } }, m.p)),
        e(Button, { variant: 'accent', icon: rtl ? null : 'calendar-plus', onClick: function () { props.go('booking'); } }, m.c)));
  }

  function HizliErisim(props) {
    var Icon = DS().Icon;
    if (!Icon) return null;
    var KISAYOL = [
      ['calendar-plus', 'Randevu alınız', function () { props.go('booking'); }],
      ['folder-lock', 'Müvekkil girişi', function () { props.go('login'); }],
      ['calculator', 'Hesaplama araçları', function () { props.go('mevzuat', 'araclar'); }],
      ['scale', 'Ücret tarifeleri', function () { props.go('mevzuat', 'tarife'); }],
      ['book-open', 'Mevzuat', function () { props.go('mevzuat', 'mevzuat'); }],
      ['help-circle', 'Sık sorulanlar', function () { props.go('sss'); }],
    ];
    return e('div', { style: { background: 'var(--paper-2)', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' } },
      e('div', { style: { maxWidth: 'var(--max-content)', margin: '0 auto', padding: 'var(--space-5) var(--gutter-page-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' } },
        e('span', { className: 'eyebrow', style: { flexShrink: 0 } }, 'HIZLI ERİŞİM'),
        e('div', { style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' } },
          KISAYOL.map(function (k) {
            return e('button', { key: k[1], onClick: k[2], style: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 999, border: '1px solid var(--border-default)', background: 'var(--surface-card, #fff)', cursor: 'pointer', font: 'inherit', fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--text-heading)' } },
              e(Icon, { name: k[0], size: 15, color: 'var(--brass-600)' }), k[1]);
          }))));
  }

  var FAYDALI = [
    ['Adalet Bakanlığı', 'https://www.adalet.gov.tr/'],
    ['Türkiye Barolar Birliği', 'https://www.barobirlik.org.tr/'],
    ['Antalya Barosu', 'https://www.antalyabarosu.org.tr/'],
    ['UYAP Vatandaş Portalı', 'https://vatandas.uyap.gov.tr/'],
    ['Resmî Gazete', 'https://www.resmigazete.gov.tr/'],
    ['Anayasa Mahkemesi', 'https://www.anayasa.gov.tr/'],
    ['Yargıtay', 'https://www.yargitay.gov.tr/'],
    ['Danıştay', 'https://www.danistay.gov.tr/'],
    ['e-Devlet Kapısı', 'https://www.turkiye.gov.tr/'],
    ['KVKK', 'https://www.kvkk.gov.tr/'],
  ];

  function FaydaliLinkler() {
    var Icon = DS().Icon;
    if (!Icon) return null;
    return e('div', { style: { maxWidth: 'var(--max-content)', margin: 'var(--space-10) auto 0', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-inverse)' } },
      e('div', { style: { fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: 'var(--tracking-eyebrow)', color: 'var(--brass-400)' } }, 'FAYDALI BAĞLANTILAR'),
      e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-5)', marginTop: 'var(--space-3)' } },
        FAYDALI.map(function (f) {
          return e('a', { key: f[0], href: f[1], target: '_blank', rel: 'noopener', style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-body-sm)', color: 'var(--ink-300)', textDecoration: 'none', borderBottom: 0 } },
            f[0], e(Icon, { name: 'external-link', size: 11, color: 'var(--ink-300)' }));
        })));
  }

  Object.assign(window, { SiteArama, DilSecici, DilBandi, HizliErisim, FaydaliLinkler, SITE_DILLER: DILLER });
})();
