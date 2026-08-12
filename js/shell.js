(function(){
const A = f => window.UY_ASSETS && window.UY_ASSETS[f] || (window.ASSET_BASE || '../../assets') + '/' + f;
const {
  Button,
  IconButton,
  Icon,
  Avatar
} = window.LexaHukukDesignSystem_93e85e;
const NAV = [['Çalışma Alanları', 'home'], ['Büro', 'buro'], ['Yazılar', 'articles'], ['Uygulama', 'uygulama'], ['İletişim', 'home']];
function SiteHeader({
  route,
  go,
  signedIn
}) {
  const dark = route === 'home';
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: dark ? 'rgba(11,22,38,.86)' : 'rgba(251,249,245,.88)',
      backdropFilter: 'var(--blur-glass)',
      borderBottom: '1px solid ' + (dark ? 'var(--border-inverse)' : 'var(--border-hairline)')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: '0 var(--gutter-page-lg)',
      height: 76,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('home'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      textAlign: 'left',
      padding: 0,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: dark ? A('logo-light.png') : A('logo.png'),
    alt: "",
    style: {
      height: 40,
      width: 'auto',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      letterSpacing: '.1em',
      color: dark ? 'var(--paper-1)' : 'var(--ink-900)'
    }
  }, "UMUT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brass-500)'
    }
  }, "Y\xDCCEL")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 9,
      letterSpacing: '.22em',
      color: dark ? 'var(--ink-300)' : 'var(--text-faint)',
      marginTop: 2
    }
  }, "AVUKAT \xB7 ANTALYA BAROSU"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      marginLeft: 'var(--space-6)',
      flexShrink: 0,
      whiteSpace: 'nowrap'
    }
  }, NAV.map(([n, r]) => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go(r);
    },
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: route === r && r !== 'home' ? 600 : 500,
      borderBottom: route === r && r !== 'home' ? '2px solid var(--brass-500)' : 0,
      paddingBottom: 2,
      color: dark ? 'var(--ink-100)' : route === r && r !== 'home' ? 'var(--text-heading)' : 'var(--text-body)'
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: window.BURO.telHref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      fontSize: 'var(--text-caption)',
      borderBottom: 0,
      color: dark ? 'var(--ink-300)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 14
  }), window.BURO.tel), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 2,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: window.BURO.whatsapp,
    target: "_blank",
    rel: "noopener",
    title: "WhatsApp \xFCzerinden yaz\u0131n\u0131z",
    "aria-label": "WhatsApp \xFCzerinden yaz\u0131n\u0131z",
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-control)',
      borderBottom: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: dark ? 'var(--ink-100)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 17
  })), /*#__PURE__*/React.createElement("a", {
    href: window.BURO.instagram,
    target: "_blank",
    rel: "noopener",
    title: 'Instagram · ' + window.BURO.instagramAd,
    "aria-label": "Instagram",
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-control)',
      borderBottom: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: dark ? 'var(--ink-100)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "instagram",
    size: 17
  })), /*#__PURE__*/React.createElement("a", {
    href: window.BURO.linkedin,
    target: "_blank",
    rel: "noopener",
    title: "LinkedIn",
    "aria-label": "LinkedIn",
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-control)',
      borderBottom: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: dark ? 'var(--ink-100)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "linkedin",
    size: 17
  }))), signedIn ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Bildirimler",
    tone: dark ? 'inverse' : 'quiet'
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('portal'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Elif \u015Eahin",
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: dark ? 'var(--paper-1)' : 'var(--text-heading)'
    }
  }, "Elif \u015Eahin"))) : /*#__PURE__*/React.createElement(Button, {
    variant: dark ? 'inverse' : 'secondary',
    size: "sm",
    icon: "folder-lock",
    onClick: () => go('login')
  }, "M\xFCvekkil Giri\u015Fi"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu Talebi"))));
}
function SiteFooter({
  go
}) {
  const col = (title, items) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--brass-400)'
    }
  }, title), items.map(i => i === 'Sık sorulanlar' ? /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => go && go('sss'),
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      font: 'inherit',
      textAlign: 'left',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-300)',
      textDecoration: 'underline',
      textDecorationColor: 'rgba(255,255,255,.3)',
      textUnderlineOffset: 3
    }
  }, i) : /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-300)'
    }
  }, i)));
  const legalLink = (label, doc) => /*#__PURE__*/React.createElement("button", {
    onClick: () => go && go('legal', doc),
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      font: 'inherit',
      fontSize: 'var(--text-caption)',
      color: 'var(--ink-100)',
      textDecoration: 'underline',
      textDecorationColor: 'rgba(255,255,255,.3)',
      textUnderlineOffset: 3
    }
  }, label);
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink-950)',
      color: 'var(--text-on-dark)',
      padding: 'var(--space-16) var(--gutter-page-lg) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: A('logo-light.png'),
    alt: "",
    style: {
      height: 56,
      width: 'auto',
      display: 'block',
      marginBottom: 'var(--space-4)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      letterSpacing: '.1em'
    }
  }, "UMUT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brass-500)'
    }
  }, "Y\xDCCEL")), /*#__PURE__*/React.createElement("hr", {
    className: "rule-brass",
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-300)',
      lineHeight: 'var(--leading-relaxed)',
      maxWidth: '34ch'
    }
  }, "Antalya Barosu'na kay\u0131tl\u0131 avukatl\u0131k b\xFCrosu \xB7 Sicil No 6448. Randevu olu\u015Fturma, dosya takibi ve yaz\u0131\u015Fma tek hesap \xFCzerinden y\xFCr\xFCt\xFClmektedir.")), col('BÜRO', ['Çalışma alanları', 'Ekip', 'Yazılar ve analizler', 'Sık sorulanlar']), col('MÜVEKKİL', ['Portal girişi', 'Randevu al', 'Dosya takibi', 'Belge yükleme']), col('İLETİŞİM', [window.BURO.adresKisa, window.BURO.tarif, window.BURO.tel, window.BURO.mail, 'KEP: ' + window.BURO.kep, window.BURO.site])), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: 'var(--space-10) auto 0',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, [['message-circle', "WhatsApp üzerinden yazınız", window.BURO.whatsapp], ['instagram', 'Instagram ' + window.BURO.instagramAd, window.BURO.instagram], ['linkedin', 'LinkedIn', window.BURO.linkedin]].map(([ic, label, href]) => /*#__PURE__*/React.createElement("a", {
    key: href,
    href: href,
    target: "_blank",
    rel: "noopener",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: '9px var(--space-4)',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-inverse)',
      borderBottom: '1px solid var(--border-inverse)',
      background: 'rgba(255,255,255,.06)',
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      color: 'var(--paper-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 15,
    color: "var(--brass-400)"
  }), label))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      marginTop: 'var(--space-12)',
      paddingTop: 'var(--space-6)',
      borderTop: '1px solid var(--border-inverse)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--text-caption)',
      color: 'var(--ink-300)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Av. Umut Y\xFCcel \xB7 Antalya Barosu Sicil No 6448 \xB7 TBB Sicil No 160505"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, legalLink('KVKK Aydınlatma Metni', 'kvkk'), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .4
    }
  }, "\xB7"), legalLink('Çerez Politikası', 'cerez'), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .4
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "TBB Reklam Yasa\u011F\u0131 Y\xF6netmeli\u011Fi'ne uygundur"))));
}
function SectionHead({
  eyebrow,
  title,
  sub,
  align = 'left'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: align === 'center' ? '62ch' : '56ch',
      margin: align === 'center' ? '0 auto' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-display-2)',
      letterSpacing: 'var(--tracking-display)',
      marginTop: 'var(--space-3)',
      lineHeight: 1.15
    }
  }, title), sub ? /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--text-body-lg)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)',
      textWrap: 'pretty'
    }
  }, sub) : null);
}
function PhotoSlot({
  label,
  height = 320,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper-2)',
      border: '1px dashed var(--sand-400)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      color: 'var(--text-faint)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)'
    }
  }, label));
}
function CookieBanner({
  go
}) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const read = () => {
      try {
        return localStorage.getItem('uy-cerez');
      } catch (e) {
        return 'x';
      }
    };
    setShow(!read());
    const again = () => setShow(true);
    window.addEventListener('uy-cerez-sifirla', again);
    return () => window.removeEventListener('uy-cerez-sifirla', again);
  }, []);
  const decide = v => {
    try {
      localStorage.setItem('uy-cerez', v);
    } catch (e) {}
    setShow(false);
    window.dispatchEvent(new Event('uy-cerez-karar'));
  };
  if (!show) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: 'var(--space-6)',
      right: 'var(--space-6)',
      bottom: 'var(--space-6)',
      zIndex: 80,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      maxWidth: 900,
      padding: 'var(--space-4) var(--space-5)',
      background: 'var(--ink-900)',
      border: '1px solid var(--border-inverse)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-overlay)',
      animation: 'lexa-rise var(--dur-base) var(--ease-enter)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cookie",
    size: 20,
    color: "var(--brass-400)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-100)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Oturumunuzu a\xE7\u0131k tutmak i\xE7in zorunlu \xE7erezleri kullan\u0131yorum. Tercihlerinizi hat\u0131rlamak i\xE7inse onay\u0131n\u0131z\u0131 istiyorum. Ziyaret istatisti\u011Fi \xE7erez kullanmaz; reklam \xE7erezi hi\xE7 kullanm\u0131yorum.", ' ', /*#__PURE__*/React.createElement("button", {
    onClick: () => go && go('legal', 'cerez'),
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      font: 'inherit',
      color: 'var(--brass-400)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, "\xC7erez Politikas\u0131")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "sm",
    onClick: () => decide('zorunlu')
  }, "Yaln\u0131z zorunlu"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    onClick: () => decide('tumu')
  }, "Kabul et"))));
}
function WhatsAppFab() {
  const [hover, setHover] = React.useState(false);
  const [bandVar, setBandVar] = React.useState(false);
  React.useEffect(() => {
    const oku = () => {
      try {
        setBandVar(!localStorage.getItem('uy-cerez'));
      } catch (e) {
        setBandVar(false);
      }
    };
    oku();
    window.addEventListener('uy-cerez-karar', oku);
    window.addEventListener('uy-cerez-sifirla', oku);
    return () => {
      window.removeEventListener('uy-cerez-karar', oku);
      window.removeEventListener('uy-cerez-sifirla', oku);
    };
  }, []);
  return /*#__PURE__*/React.createElement("a", {
    href: window.BURO.whatsapp,
    target: "_blank",
    rel: "noopener",
    "aria-label": "WhatsApp \xFCzerinden yaz\u0131n\u0131z",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'fixed',
      right: 'var(--space-6)',
      bottom: bandVar ? 'calc(var(--space-6) + 116px)' : 'var(--space-6)',
      zIndex: 70,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      height: 52,
      padding: hover ? '0 var(--space-5) 0 var(--space-4)' : 0,
      width: hover ? 'auto' : 52,
      justifyContent: 'center',
      borderRadius: 'var(--radius-pill)',
      borderBottom: 0,
      background: 'var(--ink-800)',
      color: 'var(--paper-1)',
      boxShadow: 'var(--shadow-overlay)',
      overflow: 'hidden',
      transition: 'width var(--dur-base) var(--ease-standard), padding var(--dur-base) var(--ease-standard), bottom var(--dur-base) var(--ease-standard), background var(--dur-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 22,
    color: "var(--brass-400)"
  }), hover ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, "WhatsApp \xFCzerinden yaz\u0131n\u0131z") : null);
}
Object.assign(window, {
  SiteHeader,
  SiteFooter,
  SectionHead,
  PhotoSlot,
  CookieBanner,
  WhatsAppFab
});
})();