(function(){
const A = f => window.UY_ASSETS && window.UY_ASSETS[f] || (window.ASSET_BASE || '../../assets') + '/' + f;
const {
  Button,
  Card,
  Badge,
  Tag,
  Icon,
  Avatar
} = window.LexaHukukDesignSystem_93e85e;
const DENEYIM = [{
  yil: 'Ara 2019 — bugün',
  unvan: 'Avukat',
  yer: 'Umut Yücel Hukuk Bürosu',
  sehir: 'Antalya',
  note: 'Kendi bürosunda serbest avukatlık; Antalya Barosu Sicil No 6448.'
}, {
  yil: 'Oca — Kas 2019',
  unvan: 'Stajyer Avukat',
  yer: 'Betül Sertbaş Hukuk Bürosu',
  sehir: 'Antalya'
}, {
  yil: 'May — Ara 2018',
  unvan: 'Stajyer Avukat',
  yer: 'Pelin Uçar Hukuk Bürosu',
  sehir: 'Antalya'
}, {
  yil: '2015 — 2018',
  unvan: 'Katip',
  yer: 'Kapullu ve Efe Hukuk Bürosu',
  sehir: 'İstanbul',
  note: 'Üç buçuk yıl boyunca dosya takibi, icra ve alacak süreçleri.'
}];
const EGITIM = [{
  yil: '2018 — 2020',
  ad: 'Özel Hukuk Yüksek Lisansı',
  kurum: 'Antalya Bilim Üniversitesi'
}, {
  yil: '2014 — 2018',
  ad: 'Hukuk Lisansı',
  kurum: 'Beykent Üniversitesi Hukuk Fakültesi'
}, {
  yil: '2018 — 2020',
  ad: 'Adalet Ön Lisansı',
  kurum: 'Atatürk Üniversitesi'
}, {
  yil: '2017 — 2022',
  ad: 'Kamu Yönetimi ve Sosyoloji Lisansları',
  kurum: 'Anadolu Üniversitesi · İstanbul Üniversitesi'
}];
function BuroScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-sunken)',
      padding: 'var(--space-16) var(--gutter-page-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '.85fr 1.15fr',
      gap: 'var(--space-16)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-0)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-2)',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A('portre-avukat.jpg'),
    alt: "Av. Umut Y\xFCcel",
    style: {
      width: '100%',
      height: 440,
      objectFit: 'cover',
      objectPosition: 'center 12%',
      borderRadius: 'var(--radius-sm)',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "B\xDCRO"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-2)',
      letterSpacing: 'var(--tracking-display)',
      marginTop: 'var(--space-3)',
      lineHeight: 1.12
    }
  }, "Av. Umut Y\xFCcel"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-lg)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-4)',
      lineHeight: 'var(--leading-relaxed)',
      maxWidth: '52ch',
      textWrap: 'pretty'
    }
  }, "2019'dan bu yana Antalya'da serbest avukatl\u0131k yap\u0131yorum. \xD6ncesinde \u0130stanbul'da \xFC\xE7 bu\xE7uk y\u0131l bir hukuk b\xFCrosunda katiplik yapt\u0131m; dosyan\u0131n hangi a\u015Famada t\u0131kand\u0131\u011F\u0131n\u0131 oradan biliyorum. B\xFCrodaki \xE7al\u0131\u015Fma d\xFCzenini de buna g\xF6re kurdum: her ad\u0131m yaz\u0131l\u0131, her tarih \xF6nceden bildirilir."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, [['scale', 'Antalya Barosu · Sicil 6448'], ['file-text', 'TBB Sicil 160505'], ['graduation-cap', 'Özel Hukuk Yüksek Lisansı']].map(([ic, t]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 12px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 13,
    color: "var(--brass-600)"
  }), t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu Al"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "message-square",
    onClick: () => go('login')
  }, "Soru Sor"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "DENEY\u0130M",
    title: "Nerede \xE7al\u0131\u015Ft\u0131m"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, DENEYIM.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d.yer,
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) 0',
      borderTop: i ? '1px solid var(--border-hairline)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      width: 124,
      flex: '0 0 auto',
      paddingTop: 2,
      whiteSpace: 'nowrap',
      fontSize: 12
    }
  }, d.yil), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, d.unvan), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, d.yer, " \xB7 ", d.sehir), d.note ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)',
      marginTop: 6,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, d.note) : null))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "E\u011E\u0130T\u0130M",
    title: "Nerede okudum"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, EGITIM.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: e.ad,
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) 0',
      borderTop: i ? '1px solid var(--border-hairline)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      width: 124,
      flex: '0 0 auto',
      paddingTop: 2,
      whiteSpace: 'nowrap',
      fontSize: 12
    }
  }, e.yil), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, e.ad), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, e.kurum))))), /*#__PURE__*/React.createElement(Card, {
    tone: "flat",
    padding: "sm",
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "D\u0130LLER"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)'
    }
  }, "T\xFCrk\xE7e (ana dil) \xB7 \u0130ngilizce (A2) \xB7 Frans\u0131zca (A1)"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "inverse",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--brass-400)'
    }
  }, "B\xDCRO"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-2)',
      color: 'var(--paper-1)',
      marginTop: 'var(--space-3)'
    }
  }, "Umut Y\xFCcel Hukuk B\xFCrosu"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-6)'
    }
  }, [['map-pin', window.BURO.adres + '\n' + window.BURO.tarif], ['phone', window.BURO.tel], ['mail', window.BURO.mail], ['shield-check', 'KEP: ' + window.BURO.kep]].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 16,
    color: "var(--brass-400)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-100)',
      lineHeight: 'var(--leading-relaxed)',
      whiteSpace: 'pre-line'
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.whatsapp,
    target: "_blank",
    rel: "noopener",
    variant: "accent",
    size: "sm",
    icon: "message-circle"
  }, "WhatsApp"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.telHref,
    variant: "inverse",
    size: "sm",
    icon: "phone"
  }, "Ara"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.harita,
    target: "_blank",
    rel: "noopener",
    variant: "inverse",
    size: "sm",
    icon: "map"
  }, "Haritada a\xE7"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.instagram,
    target: "_blank",
    rel: "noopener",
    variant: "inverse",
    size: "sm",
    icon: "instagram"
  }, "Instagram"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.linkedin,
    target: "_blank",
    rel: "noopener",
    variant: "inverse",
    size: "sm",
    icon: "linkedin"
  }, "LinkedIn"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      minHeight: 320
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A('portre-editoryel.jpg'),
    alt: "Antalya",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 30%',
      display: 'block',
      position: 'absolute',
      inset: 0
    }
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-sunken)',
      padding: 'var(--space-16) var(--gutter-page-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "PRAT\u0130K B\u0130LG\u0130",
    title: "Vek\xE2let ve \xF6deme",
    sub: "S\xFCreci ba\u015Flatmak i\xE7in gereken iki ad\u0131m. \u0130kisini de bir kez yap\u0131yorsunuz."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    topRule: true
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--brass-50)',
      border: '1px solid var(--brass-200)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-signature",
    size: 20,
    color: "var(--brass-700)"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "Vek\xE2letname nas\u0131l \xE7\u0131kar\u0131l\u0131r?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)',
      lineHeight: 'var(--leading-relaxed)',
      textWrap: 'pretty'
    }
  }, window.BURO.vekalet), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)',
      display: 'grid',
      gridTemplateColumns: '96px 1fr',
      gap: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--text-body-sm)',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "Notere s\xF6yleyin"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)'
    }
  }, window.BURO.ad, " \xB7 Antalya Barosu"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "Baro sicil"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-heading)'
    }
  }, window.BURO.baroSicil), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "T.C. kimlik"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-heading)'
    }
  }, window.BURO.tcNo)), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "upload",
    style: {
      marginTop: 'var(--space-4)'
    },
    onClick: () => go('login')
  }, "Vek\xE2leti portalden y\xFCkle")), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-default)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "credit-card",
    size: 20,
    color: "var(--ink-700)"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "\xD6deme"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Kartla \xF6demeler Moka United g\xFCvenli \xF6deme sayfas\u0131 \xFCzerinden al\u0131n\u0131r; kart bilgileriniz b\xFCroda saklanmaz. Havale/EFT de yapabilirsiniz."), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.odemeLink,
    target: "_blank",
    rel: "noopener",
    variant: "accent",
    iconEnd: "external-link",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "Kartla \xF6de"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)',
      display: 'grid',
      gridTemplateColumns: '96px 1fr',
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
  }, window.BURO.banka), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "Al\u0131c\u0131"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)'
    }
  }, window.BURO.ibanHesap), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "IBAN"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-heading)',
      fontSize: 14
    }
  }, window.BURO.iban)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)',
      marginTop: 'var(--space-3)'
    }
  }, "Havalede a\xE7\u0131klama k\u0131sm\u0131na ad\u0131n\u0131z\u0131 ve dosya numaran\u0131z\u0131 yaz\u0131n."))))));
}
Object.assign(window, {
  BuroScreen
});
})();