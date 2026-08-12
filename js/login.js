(function(){
const {
  Button,
  Card,
  Icon,
  Input,
  Badge
} = window.LexaHukukDesignSystem_93e85e;
function LoginScreen({
  go,
  girisYap
}) {
  const [kod, setKod] = React.useState('');
  const [hata, setHata] = React.useState(null);
  const [bekle, setBekle] = React.useState(false);
  const dogrula = e => {
    if (e) e.preventDefault();
    const t = kod.trim().toLocaleUpperCase('tr-TR');
    if (!t) {
      setHata('Lütfen tarafımızca size bildirilen erişim kodunu giriniz.');
      return;
    }
    setBekle(true);
    setHata(null);
    setTimeout(() => {
      const m = (window.MUVEKKILLER || []).find(x => x.kod.toLocaleUpperCase('tr-TR') === t);
      setBekle(false);
      if (m) {
        girisYap(m);
      } else setHata('Girilen kod kayıtlarımızla eşleşmemektedir. Kodunuzu tarafımızdan yeniden talep edebilirsiniz.');
    }, 450);
  };
  const kanallar = [{
    icon: 'message-circle',
    baslik: 'WhatsApp üzerinden',
    metin: 'Dosyanıza ilişkin soru ve belge taleplerinizi bu kanaldan iletebilirsiniz. Tarafımızca en geç bir iş günü içinde dönüş yapılmaktadır.',
    dugme: 'Yazışma başlatınız',
    href: window.BURO.wa('Merhaba, dosyamın durumu hakkında bilgi almak istiyorum.')
  }, {
    icon: 'phone',
    baslik: 'Telefon ile',
    metin: 'İvedi konularda en hızlı iletişim yoludur. Mesai saatleri içinde tarafımıza doğrudan ulaşabilirsiniz.',
    dugme: window.BURO.tel,
    href: window.BURO.telHref
  }, {
    icon: 'shield-check',
    baslik: 'KEP ile',
    metin: 'Resmî tebligat ve yazılı beyan gerektiren hâllerde kayıtlı elektronik posta adresimiz kullanılmaktadır.',
    dugme: window.BURO.kep,
    href: 'mailto:' + window.BURO.mail
  }];
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "M\xDCVEKK\u0130L PORTALI"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-2)',
      letterSpacing: 'var(--tracking-display)',
      marginTop: 'var(--space-3)'
    }
  }, "Dosya takip sistemine giri\u015F"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-lg)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-4)',
      maxWidth: '68ch',
      lineHeight: 'var(--leading-relaxed)',
      textWrap: 'pretty'
    }
  }, "Vek\xE2letname tanzim edilerek taraf\u0131m\u0131za tevkil edilen dosyalar\u0131n\u0131z\u0131n g\xFCncel durumunu, i\u015Flem tarihlerini ve yakla\u015Fan duru\u015Fma g\xFCnlerini bu b\xF6l\xFCmden takip edebilirsiniz. Eri\u015Fim kodunuz, vek\xE2let ili\u015Fkisinin kurulmas\u0131n\u0131n ard\u0131ndan taraf\u0131m\u0131zca size bildirilmektedir."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr .9fr',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-10)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "lg",
    topRule: true
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: dogrula,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-3)'
    }
  }, "Eri\u015Fim kodunuz ile giri\u015F yap\u0131n\u0131z"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-2)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Kodunuz ", /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "UY-0000"), " bi\xE7imindedir. Kodunuzu bilmiyorsan\u0131z a\u015Fa\u011F\u0131daki kanallardan taraf\u0131m\u0131za ba\u015Fvurman\u0131z yeterlidir.")), /*#__PURE__*/React.createElement(Input, {
    label: "Eri\u015Fim kodu",
    placeholder: "UY-0000",
    size: "lg",
    icon: "folder-lock",
    value: kod,
    onChange: e => {
      setKod(e.target.value);
      setHata(null);
    },
    error: hata || undefined
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    block: true,
    type: "submit",
    loading: bekle,
    iconEnd: "arrow-right",
    onClick: dogrula
  }, bekle ? 'Doğrulanıyor' : 'Dosyalarımı görüntüle'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16,
    color: "var(--text-faint)",
    style: {
      marginTop: 2,
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Bu b\xF6l\xFCmde yaln\u0131zca dosyan\u0131z\u0131n ", /*#__PURE__*/React.createElement("b", null, "durum bilgisi"), " yer almaktad\u0131r. Dilek\xE7e, bilirki\u015Fi raporu ve mahkeme yaz\u0131\u015Fmalar\u0131 gibi belgeler, gizlili\u011Fin korunmas\u0131 amac\u0131yla taraf\u0131n\u0131za WhatsApp ya da kay\u0131tl\u0131 elektronik posta yoluyla iletilmektedir. Eri\u015Fim kodunuzu \xFC\xE7\xFCnc\xFC ki\u015Filerle payla\u015Fmaman\u0131z\u0131 \xF6nemle rica ederiz.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "TARAFIMIZA ULA\u015EMANIN YOLLARI"), kanallar.map(k => /*#__PURE__*/React.createElement(Card, {
    key: k.baslik,
    padding: "sm",
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-default)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: k.icon,
    size: 16,
    color: "var(--ink-700)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, k.baslik), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      marginTop: 2,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, k.metin), /*#__PURE__*/React.createElement("a", {
    href: k.href,
    target: k.href.indexOf('http') === 0 ? '_blank' : undefined,
    rel: "noopener",
    style: {
      display: 'inline-block',
      marginTop: 6,
      fontSize: 'var(--text-caption)',
      fontWeight: 600
    }
  }, k.dugme)))), /*#__PURE__*/React.createElement(Card, {
    tone: "accent",
    padding: "sm"
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
    name: "file-signature",
    size: 14
  }), "HEN\xDCZ VEK\xC2LET VERMED\u0130YSEN\u0130Z"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--brass-800)',
      marginTop: 6,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "\xD6ncelikle bir \xF6n g\xF6r\xFC\u015Fme yap\u0131lmas\u0131, ard\u0131ndan vek\xE2letname tanzim edilmesi gerekmektedir. Vek\xE2letname i\xE7in izlenecek usul B\xFCro sayfam\u0131zda a\xE7\u0131klanm\u0131\u015Ft\u0131r."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu talebi"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => go('buro')
  }, "Vek\xE2let usul\xFC"))))));
}
Object.assign(window, {
  LoginScreen
});
})();