(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  IconButton,
  Card,
  Badge,
  Tag,
  Icon,
  Avatar,
  Tabs,
  Input,
  Textarea,
  Switch,
  CaseStatusCard,
  MessageBubble,
  AppointmentSlot,
  Dialog,
  Toast
} = window.LexaHukukDesignSystem_93e85e;
// ── TEMSİLÎ DOSYA VERİSİ KALDIRILDI · 16.08.2026 ─────────────────────────────
//  Burada iki temsilî dizi vardı; biri dosya kartlarını, biri zaman
//  çizelgesini dolduruyordu. Üç sebeple kaldırıldı:
//   1) Yön. m.7/c — çizelge kayıtlarından biri sonucu olumlu niteleyen bir
//      ifade taşıyordu. Bu dosya kamuya açık bir JS varlığıdır (curl ile
//      okunur), dolayısıyla yayımlanmış sayılır.
//   2) Yön. m.7/d — dava aşaması rozeti, ilerleme yüzdesi ve okunmamış
//      sayacı kapalı listede yoktur.
//   3) Av.K. m.34 — dosyası henüz işlenmemiş GERÇEK müvekkil, kendi
//      ekranında bu temsilî kartı görüyordu. Müvekkile işinin durumu
//      hakkında yanlış izlenim vermek, bilgi vermemekten ağırdır.
//
//  NOT — bu yorum bilerek ifadesizdir: kaldırılan metin buraya ÖRNEK OLARAK
//  DAHİ yazılmaz. Yorum satırı da yayına çıkar; yasak ifadeyi açıklamak için
//  tekrar etmek, ifadeyi yayında bırakmakla aynı yüzeyi doğurur.
//  Ayrıntılı gerekçe ve kaldırılan metnin tam hâli, yayına çıkmayan
//  ORTAK-HAFIZA/topics/reklam-yasagi.md dosyasındadır.
//
//  Veri yoksa diziler BOŞ kalır ve aşağıdaki dürüst boş durum gösterilir.
//  Bir daha temsilî dosya verisi EKLENMEYECEK — maket gerekiyorsa yayın
//  beyaz listesi dışında ayrı bir dosyada tutulur.
// ─────────────────────────────────────────────────────────────────────────────
const CASES = [];
const TIMELINE = [];
function PortalScreen({
  go,
  muvekkil,
  cikis
}) {
  const mv = muvekkil || (window.MUVEKKILLER || [])[0] || {
    ad: 'Müvekkil',
    sicil: '—',
    dosyalar: []
  };
  const DOSYALAR = mv.dosyalar && mv.dosyalar.length ? mv.dosyalar : CASES;
  // CASES artık boş; dosyası işlenmemiş müvekkilde DOSYALAR = [] olur.
  // active bilerek null olabilir — aşağıdaki her okuma optional chaining ile
  // korunur ve dosya yoksa kart yerine dürüst boş durum gösterilir.
  const [tab, setTab] = React.useState('akis');
  const [active, setActive] = React.useState(DOSYALAR[0] || null);
  const [draft, setDraft] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [pay, setPay] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const [msgs, setMsgs] = React.useState([{
    from: 'client',
    time: '09:12',
    text: 'İhtarname geldi, cevap süresi ne kadar?',
    attachment: 'ihtarname.pdf'
  }, {
    from: 'ai',
    text: 'Belgede 7 günlük cevap süresi görünüyor. Süre, tebliğ tarihinden itibaren işler. Avukatınız 1 iş günü içinde teyit edecek.',
    note: 'Bu bir ön bilgilendirmedir; hukuki görüş yerine geçmez.'
  }, {
    from: 'lawyer',
    time: '11:40',
    author: 'Av. Umut Yücel',
    text: 'Teyit ediyorum: 7 gün. Cevabı ben hazırlayacağım, cuma günü sizinle paylaşacağım.'
  }]);
  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, {
      from: 'client',
      time: 'şimdi',
      text: draft
    }]);
    setDraft('');
  };
  return /*#__PURE__*/React.createElement("main", {
    style: {
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      minHeight: 720,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      borderRight: '1px solid var(--border-hairline)',
      padding: 'var(--space-6) var(--space-4)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: mv.ad
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, mv.ad), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      fontSize: 11
    }
  }, mv.sicil)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "log-out",
    label: "Oturumu kapat\u0131n\u0131z",
    size: "sm",
    onClick: cikis
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      marginTop: 'var(--space-6)'
    }
  }, [['folder-open', 'Dosyalarım', 3, true], ['calendar-days', 'Randevularım', 1], ['message-square', 'Sorularım', 2], ['file-text', 'Belgeler'], ['credit-card', 'Ödemeler'], ['settings', 'Ayarlar']].map(([ic, l, n, sel]) => /*#__PURE__*/React.createElement("button", {
    key: l,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: '10px var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      border: 0,
      cursor: 'pointer',
      font: 'inherit',
      fontSize: 'var(--text-body-sm)',
      textAlign: 'left',
      background: sel ? 'var(--surface-selected)' : 'transparent',
      color: sel ? 'var(--ink-800)' : 'var(--text-body)',
      fontWeight: sel ? 600 : 500
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 16,
    color: sel ? 'var(--ink-700)' : 'var(--text-faint)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, l), n ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--brass-700)'
    }
  }, n) : null))), /*#__PURE__*/React.createElement(Card, {
    tone: "accent",
    padding: "sm",
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      color: 'var(--brass-800)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "video",
    size: 14
  }), "S\u0131radaki randevu"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      color: 'var(--ink-900)',
      marginTop: 6
    }
  }, "Yar\u0131n 10:30"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--brass-800)',
      marginTop: 2
    }
  }, "G\xF6r\xFCnt\xFCl\xFC \xB7 30 dk"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    block: true,
    variant: "primary",
    style: {
      marginTop: 'var(--space-3)'
    },
    icon: "video"
  }, "G\xF6r\xFC\u015Fmeye kat\u0131l"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-8) var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "M\xDCVEKK\u0130L PORTALI"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-title-1)',
      marginTop: 6
    }
  }, "Dosyalar\u0131m")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "upload"
  }, "Belge y\xFCkle"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu al"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, DOSYALAR.map(c => /*#__PURE__*/React.createElement(CaseStatusCard, _extends({
    key: c.id
  }, c, {
    onClick: () => setActive(c),
    style: active && active.id === c.id ? {
      outline: '2px solid var(--ink-800)',
      outlineOffset: -1
    } : null
  })))), !active ? /*#__PURE__*/React.createElement(Card, {
    padding: "lg",
    style: {
      marginTop: 'var(--space-8)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-3)',
      marginBottom: 'var(--space-3)'
    }
  }, "Adınıza kayıtlı, portalda g\xF6r\xFCnt\xFClenebilir dosya bulunmuyor."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      maxWidth: '52ch',
      margin: '0 auto var(--space-3)'
    }
  }, "Dosya bilgileri b\xFCromuzca sisteme işlendik\xE7e bu alanda g\xF6r\xFCn\xFCr."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-faint)',
      fontSize: 'var(--text-body-sm)',
      maxWidth: '58ch',
      margin: '0 auto'
    }
  }, "Bu ekran bilgilendirme ama\xE7lıdır; resm\xEE tebligat, s\xFCre ve usul işlemleri bakımından esas alınamaz.")) : /*#__PURE__*/React.createElement(Card, {
    padding: "none",
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5) var(--space-6) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-2)'
    }
  }, active.title || "—"), /*#__PURE__*/React.createElement(Tag, {
    icon: "scale"
  }, active.court || "—"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      marginLeft: 'auto'
    }
  }, active.fileNo || "—")), /*#__PURE__*/React.createElement(Tabs, {
    style: {
      marginTop: 'var(--space-4)'
    },
    value: tab,
    onChange: setTab,
    items: [{
      value: 'akis',
      label: 'Süreç akışı',
      icon: 'activity'
    }, {
      value: 'sorular',
      label: 'Sorularım',
      count: 3
    }, {
      value: 'belge',
      label: 'Belgeler',
      count: 12
    }, {
      value: 'odeme',
      label: 'Ödemeler'
    }, {
      value: 'randevu',
      label: 'Randevular'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6)'
    }
  }, tab === 'akis' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, ((active && active.akis) ? active.akis.map(([icon, title, date, tone, note]) => ({
    icon,
    title,
    date,
    tone,
    note
  })) : TIMELINE).map((t, i, ARR) => /*#__PURE__*/React.createElement("div", {
    key: t.title,
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 999,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-hairline)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 15,
    color: "var(--ink-700)"
  })), i < ARR.length - 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      width: 1,
      background: 'var(--border-default)',
      minHeight: 28
    }
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, t.title), /*#__PURE__*/React.createElement(Badge, {
    tone: t.tone
  }, t.date)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, t.note))))) : tab === 'sorular' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, window.HizliTalepler ? /*#__PURE__*/React.createElement(window.HizliTalepler, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      maxHeight: 320,
      overflowY: 'auto',
      padding: 'var(--space-2)'
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement(MessageBubble, {
    key: i,
    from: m.from,
    author: m.author,
    time: m.time,
    attachment: m.attachment,
    aiNote: m.note
  }, m.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-end',
      borderTop: '1px solid var(--border-hairline)',
      paddingTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 2,
    style: {
      flex: 1
    },
    value: draft,
    onChange: e => setDraft(e.target.value),
    hint: "Yan\u0131tlar 1 i\u015F g\xFCn\xFC i\xE7inde avukat\u0131n\u0131z taraf\u0131ndan verilir."
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "paperclip",
    label: "Belge ekle",
    tone: "outline",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    icon: "send",
    onClick: send
  }, "G\xF6nder"))) : tab === 'belge' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, [['ihtarname.pdf', '12 Şubat 2026', '240 KB', 'Müvekkil'], ['dava-dilekcesi.pdf', '2 Şubat 2026', '1.1 MB', 'Büro'], ['bilirkisi-raporu.pdf', '28 Mart 2026', '3.4 MB', 'Mahkeme'], ['is-sozlesmesi.pdf', '12 Şubat 2026', '820 KB', 'Müvekkil']].map(([n, d, s, who], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-3) var(--space-2)',
      borderTop: i ? '1px solid var(--border-hairline)' : 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 18,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-heading)',
      fontWeight: 500
    }
  }, n), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, who), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)'
    }
  }, d), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      width: 64,
      textAlign: 'right'
    }
  }, s), /*#__PURE__*/React.createElement(IconButton, {
    icon: "download",
    label: "\u0130ndir",
    size: "sm"
  })))) : tab === 'odeme' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, [{
    n: 'Vekâlet ücreti — 1. taksit',
    a: '—',
    d: '14.02.2026',
    s: 'paid'
  }, {
    n: 'Bilirkişi masrafı',
    a: '—',
    d: '28.03.2026',
    s: 'paid'
  }, {
    n: 'Vekâlet ücreti — 2. taksit',
    a: '—',
    d: '30.04.2026',
    s: 'due'
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) var(--space-2)',
      borderTop: i ? '1px solid var(--border-hairline)' : 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "credit-card",
    size: 18,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 500,
      color: 'var(--text-heading)'
    }
  }, r.n), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      fontSize: 11
    }
  }, "Son \xF6deme ", r.d)), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-heading)',
      fontSize: 15
    }
  }, r.a), r.s === 'paid' ? /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "\xD6dendi") : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "accent",
    icon: "credit-card",
    onClick: () => setPay(true)
  }, "\xD6de")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--brass-50)',
      border: '1px solid var(--brass-200)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 16,
    color: "var(--brass-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-caption)',
      color: 'var(--brass-800)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "\xD6demeler Moka United altyap\u0131s\u0131 \xFCzerinden al\u0131n\u0131r; kart bilgileriniz b\xFCroda saklanmaz. Havale/EFT ile de \xF6deyebilirsiniz.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      padding: 'var(--space-4)',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--text-body-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Kalan bakiye"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-heading)',
      fontWeight: 500
    }
  }, "\u2014"))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(AppointmentSlot, {
    time: "10:30",
    channel: "video",
    selected: true,
    duration: "30 dk"
  }), /*#__PURE__*/React.createElement(AppointmentSlot, {
    time: "09:40",
    channel: "office",
    duration: "Duru\u015Fma"
  }), /*#__PURE__*/React.createElement(AppointmentSlot, {
    time: "16:00",
    channel: "phone",
    duration: "20 dk"
  })), /*#__PURE__*/React.createElement(Switch, {
    style: {
      marginTop: 'var(--space-6)',
      maxWidth: 420
    },
    label: "Duru\u015Fma hat\u0131rlatmalar\u0131",
    description: "24 saat \xF6nce SMS ve uygulama bildirimi",
    checked: true,
    onChange: () => {}
  })))), /*#__PURE__*/React.createElement(Dialog, {
    open: pay,
    title: "\xD6deme",
    description: "Vek\xE2let \xFCcreti \u2014 2. taksit",
    width: 540,
    onClose: () => setPay(false),
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setPay(false)
    }, "Kapat")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "accent",
    padding: "sm"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "credit-card",
    size: 18,
    color: "var(--brass-700)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--ink-900)'
    }
  }, "Kartla \xF6de"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--brass-800)',
      marginTop: 2
    }
  }, "Moka United g\xFCvenli \xF6deme sayfas\u0131 \xB7 3D Secure"))), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.odemeLink || '#/login',
    target: "_blank",
    rel: "noopener",
    variant: "accent",
    block: true,
    iconEnd: "external-link",
    style: {
      marginTop: 'var(--space-3)'
    },
    onClick: () => setPaid(true)
  }, "\xD6deme sayfas\u0131n\u0131 a\xE7")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-hairline)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)'
    }
  }, "veya havale / EFT"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-hairline)'
    }
  })), /*#__PURE__*/React.createElement(Card, {
    tone: "flat",
    padding: "sm"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '82px 1fr',
      gap: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--text-body-sm)',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "Banka"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)'
    }
  }, window.BURO.banka || "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "Al\u0131c\u0131"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)'
    }
  }, window.BURO.ibanHesap || "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "IBAN"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-heading)',
      fontSize: 14
    }
  }, window.BURO.iban || "Oturum yenilendi\u011Finde g\xF6r\xFCn\xFCr")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: copied ? 'check' : 'copy',
    style: {
      marginTop: 'var(--space-3)'
    },
    onClick: () => {
      navigator.clipboard && navigator.clipboard.writeText(window.BURO.ibanDuz || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, copied ? 'IBAN kopyalandı' : 'IBAN’ı kopyala'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "A\xE7\u0131klama k\u0131sm\u0131na dosya numaran\u0131z\u0131 (", (active && active.fileNo) || "—", ") yaz\u0131n; \xF6demeniz otomatik e\u015Fle\u015Fsin.")))), paid ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "info",
    title: "\xD6deme sayfas\u0131 a\xE7\u0131ld\u0131",
    description: "\u0130\u015Flem tamamland\u0131\u011F\u0131nda makbuz e-postan\u0131za g\xF6nderilir."
  })) : null));
}
Object.assign(window, {
  PortalScreen
});
})();
