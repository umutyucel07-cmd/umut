(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const A = f => window.UY_ASSETS && window.UY_ASSETS[f] || (window.ASSET_BASE || '../../assets') + '/' + f;
const {
  Button,
  Card,
  Badge,
  Icon,
  PracticeAreaCard,
  CaseStatusCard,
  MessageBubble
} = window.LexaHukukDesignSystem_93e85e;
const OZEL_HUKUK = [{
  icon: 'building-2',
  title: 'Ticaret ve Şirketler Hukuku',
  description: 'Şirket kuruluşu ve ortaklık uyuşmazlıkları, ticari sözleşmeler, çek ve senet takibi, haksız rekabet.'
}, {
  icon: 'briefcase',
  title: 'İş Hukuku',
  description: 'İşe iade, kıdem ve ihbar tazminatı, fazla mesai alacakları, mobbing, iş kazası.'
}, {
  icon: 'landmark',
  title: 'İcra ve İflas Hukuku',
  description: 'İlamlı ve ilamsız takip, itirazın iptali, haciz ve satış, istihkak, konkordato.'
}, {
  icon: 'hand-coins',
  title: 'Alacak ve Tazminat',
  description: 'Maddi ve manevi tazminat, trafik ve iş kazası, sözleşmeden doğan alacaklar.'
}, {
  icon: 'house',
  title: 'Gayrimenkul ve Taşınmaz',
  description: 'Tapu iptali ve tescil, kat karşılığı inşaat, ortaklığın giderilmesi, kamulaştırmasız el atma.'
}, {
  icon: 'key-round',
  title: 'Kira Hukuku',
  description: 'Tahliye, kira tespit ve uyarlama davaları, depozito ve tahliye taahhüdü.'
}, {
  icon: 'scroll-text',
  title: 'Miras Hukuku',
  description: 'Veraset ilamı, tenkis, muris muvazaası, mirasın reddi, vasiyetname.'
}, {
  icon: 'heart-handshake',
  title: 'Aile ve Boşanma Hukuku',
  description: 'Anlaşmalı ve çekişmeli boşanma, velayet, nafaka, mal rejiminin tasfiyesi.'
}, {
  icon: 'file-signature',
  title: 'Sözleşmeler Hukuku',
  description: 'Sözleşme hazırlama ve inceleme, ihtarname, fesih, cayma ve uyarlama.'
}, {
  icon: 'shopping-bag',
  title: 'Tüketici Hukuku',
  description: 'Ayıplı mal ve hizmet, hakem heyeti başvurusu, abonelik ve kredi uyuşmazlıkları.'
}, {
  icon: 'umbrella',
  title: 'Sigorta Hukuku',
  description: 'Kasko ve trafik poliçesi uyuşmazlıkları, hasar bedeli, rücu ve tahkim başvurusu.'
}, {
  icon: 'user-round-check',
  title: 'Kişilik Hakları',
  description: 'Hakaret ve iftira, internet içeriğinin kaldırılması, unutulma hakkı başvuruları.'
}];
const KAMU_HUKUKU = [{
  icon: 'shield-check',
  title: 'Ceza Hukuku',
  description: 'Soruşturma ve kovuşturmada müdafilik, katılan vekilliği, istinaf ve temyiz.'
}, {
  icon: 'gavel',
  title: 'İdare Hukuku',
  description: 'İptal ve tam yargı davaları, disiplin cezaları, imar ve kamulaştırma, ihale uyuşmazlıkları.'
}, {
  icon: 'receipt',
  title: 'Vergi Hukuku',
  description: 'Vergi ve ceza ihbarnamesine itiraz, uzlaşma, vergi mahkemesinde dava, ödeme emri iptali.'
}, {
  icon: 'heart-pulse',
  title: 'Sosyal Güvenlik (SGK)',
  description: 'Hizmet tespiti, emeklilik ve prim uyuşmazlıkları, iş göremezlik ve rücu davaları.'
}];
const STEPS = [{
  icon: 'calendar-plus',
  title: 'Randevunuzu oluşturunuz',
  text: 'Ofiste, görüntülü veya sesli görüşme seçeneklerinden birini tercih edebilirsiniz; uygun saatler anlık olarak görüntülenir.'
}, {
  icon: 'file-text',
  title: 'Belgelerinizi tarafımıza iletiniz',
  text: 'Sözleşme, ihtarname ve dosyanıza esas teşkil eden diğer belgeleri WhatsApp veya kayıtlı elektronik posta yoluyla iletebilirsiniz.'
}, {
  icon: 'message-square',
  title: 'Süreci takip ediniz',
  text: 'Duruşma tarihleri, sunulan dilekçeler ve ödeme bilgileri müvekkil portalı üzerinden tarafınıza sunulmaktadır.'
}];
function HomeScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink-900)',
      color: 'var(--text-on-dark)',
      padding: 'var(--space-24) var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.15fr .85fr',
      gap: 'var(--space-16)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--brass-400)'
    }
  }, "ANTALYA \xB7 HUKUK B\xDCROSU"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-1)',
      lineHeight: 1.05,
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--paper-1)',
      marginTop: 'var(--space-5)',
      textWrap: 'balance'
    }
  }, "Dosyan\u0131z\u0131n hangi a\u015Famada oldu\u011Funu her an bilmenizi sa\u011Fl\u0131yoruz"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-6)',
      fontSize: 'var(--text-body-lg)',
      color: 'var(--ink-100)',
      lineHeight: 'var(--leading-relaxed)',
      maxWidth: '52ch'
    }
  }, "G\xF6r\xFC\u015Fme randevunuzu ofiste, g\xF6r\xFCnt\xFCl\xFC veya sesli olarak olu\u015Fturabilir; taraf\u0131m\u0131za tevkil etti\u011Finiz dosyalar\u0131n her a\u015Famas\u0131n\u0131 web sitesi ve mobil uygulama \xFCzerinden ayn\u0131 hesapla takip edebilirsiniz."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu Talebi"), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    icon: "folder-lock",
    onClick: () => go('login')
  }, "M\xFCvekkil Giri\u015Fi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-12)'
    }
  }, [['2019', "Antalya Barosu'na kayıtlı"], ['Sicil 6448', 'Baro sicil numarası'], ['1 iş günü', 'ortalama yanıt süresi']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--brass-400)'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--ink-300)',
      marginTop: 2
    }
  }, l))))), /*#__PURE__*/React.createElement(Card, {
    tone: "inverse",
    padding: "sm",
    style: {
      background: 'rgba(255,255,255,.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--ink-300)',
      marginBottom: 'var(--space-3)'
    }
  }, "Yakla\u015Fan uygun g\xF6r\xFC\u015Fme saatleri"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, [['Bugün', '16:30', 'Görüntülü', 'video', 'var(--channel-video)'], ['Yarın', '09:30', 'Ofiste', 'building-2', 'var(--brass-400)'], ['Perşembe', '11:00', 'Sesli', 'phone', 'var(--green-100)']].map(([d, t, l, ic, c]) => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => go('booking'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      background: 'rgba(255,255,255,.06)',
      border: '1px solid var(--border-inverse)',
      color: 'var(--paper-1)',
      cursor: 'pointer',
      font: 'inherit',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 16,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      flex: 1
    }
  }, d, " \xB7 ", l), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--brass-400)'
    }
  }, t)))), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    block: true,
    size: "sm",
    iconEnd: "arrow-right",
    style: {
      marginTop: 'var(--space-3)'
    },
    onClick: () => go('booking')
  }, "T\xFCm saatleri g\xF6r\xFCnt\xFCleyiniz")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-20) var(--gutter-page-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "\xC7ALI\u015EMA ALANLARI",
    title: "Hangi konuda hukuki destek talep ediyorsunuz?",
    sub: "\xD6zel hukuk ve kamu hukuku alanlar\u0131n\u0131n tamam\u0131nda dosya al\u0131yoruz. \u0130lgili \xE7al\u0131\u015Fma alan\u0131n\u0131 se\xE7meniz h\xE2linde, ilk g\xF6r\xFC\u015Fme \xF6ncesinde haz\u0131rlaman\u0131z gereken belgeler taraf\u0131m\u0131zca yaz\u0131l\u0131 olarak bildirilir."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--text-heading)'
    }
  }, "\xD6ZEL HUKUK"), /*#__PURE__*/React.createElement("span", {
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
  }, OZEL_HUKUK.length, " alan")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-5)'
    }
  }, OZEL_HUKUK.map(a => /*#__PURE__*/React.createElement(PracticeAreaCard, _extends({
    key: a.title
  }, a, {
    meta: "Ayr\u0131nt\u0131l\u0131 bilgi",
    onClick: () => go('booking')
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--text-heading)'
    }
  }, "KAMU HUKUKU"), /*#__PURE__*/React.createElement("span", {
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
  }, KAMU_HUKUKU.length, " alan")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-5)'
    }
  }, KAMU_HUKUKU.map(a => /*#__PURE__*/React.createElement(PracticeAreaCard, _extends({
    key: a.title
  }, a, {
    meta: "Ayr\u0131nt\u0131l\u0131 bilgi",
    onClick: () => go('booking')
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-sunken)',
      padding: 'var(--space-20) var(--gutter-page-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '.9fr 1.1fr',
      gap: 'var(--space-16)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "NASIL \u0130\u015EL\u0130YOR",
    title: "S\xFCre\xE7 \xFC\xE7 a\u015Famada i\u015Flemektedir"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-8)'
    }
  }, STEPS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.title,
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--ink-800)',
      color: 'var(--brass-400)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-title-3)',
      color: 'var(--text-heading)'
    }
  }, i + 1, ". ", s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 4,
      lineHeight: 'var(--leading-relaxed)',
      maxWidth: '46ch'
    }
  }, s.text)))))), /*#__PURE__*/React.createElement(Card, {
    padding: "sm",
    tone: "raised"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "M\xDCVEKK\u0130L PORTALI"), /*#__PURE__*/React.createElement(Badge, {
    tone: "pending",
    dot: true
  }, "Haz\u0131rlan\u0131yor")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(CaseStatusCard, {
    title: "\u00D6rnek Dosya",
    fileNo: "0000/0000 E.",
    court: "\u00D6rnek Mahkeme",
    status: "hearing",
    nextDate: "14 Nisan 2026, 09:40",
    progress: 62,
    unread: 2,
    onClick: () => go('login')
  }), /*#__PURE__*/React.createElement(MessageBubble, {
    from: "ai",
    aiNote: "Bu bir \xF6n bilgilendirmedir; hukuki g\xF6r\xFC\u015F yerine ge\xE7mez."
  }, "Y\xFCkledi\u011Finiz ihtarnamede 7 g\xFCnl\xFCk cevap s\xFCresi g\xF6r\xFCn\xFCyor. Avukat\u0131n\u0131z 1 i\u015F g\xFCn\xFC i\xE7inde teyit edecek."))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-20) var(--gutter-page-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-16)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A('portre-editoryel.jpg'),
    alt: "Av. Umut Y\xFCcel, Antalya",
    style: {
      width: '100%',
      height: 380,
      objectFit: 'cover',
      objectPosition: 'center 25%',
      borderRadius: 'var(--radius-md)',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "B\xDCRO",
    title: "Antalya'da, s\xFCrecin her a\u015Famas\u0131nda taraf\u0131n\u0131z\u0131 temsil ediyoruz",
    sub: "Meltem Mahallesi'nde bulunan b\xFCromuzda ve \xE7evrim i\xE7i kanallar arac\u0131l\u0131\u011F\u0131yla, dosyan\u0131z\u0131 y\xFCr\xFCten avukatla do\u011Frudan g\xF6r\xFC\u015Fme imk\xE2n\u0131 bulunmaktad\u0131r. Randevunuzdan \xF6nce haz\u0131r bulundurman\u0131z gereken belgeler taraf\u0131m\u0131zca yaz\u0131l\u0131 olarak bildirilir."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconEnd: "arrow-right",
    style: {
      marginTop: 'var(--space-6)'
    },
    onClick: () => go('buro')
  }, "B\xFCro ve \xF6zge\xE7mi\u015F bilgileri"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, ['Antalya Barosu · Sicil 6448', 'KVKK uyumlu', 'Uçtan uca şifreli belge'].map(t => /*#__PURE__*/React.createElement("span", {
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
    name: "shield-check",
    size: 13,
    color: "var(--brass-600)"
  }), t)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "YAZILAR VE ANAL\u0130ZLER",
    title: "S\u0131k kar\u015F\u0131la\u015Ft\u0131\u011F\u0131m\u0131z konular\u0131 yaz\u0131yoruz"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconEnd: "arrow-right",
    onClick: () => go('articles')
  }, "T\xFCm yaz\u0131lar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-8)'
    }
  }, [['İş Hukuku', 'İhtarname geldiğinde ilk 7 gün: ne yapmalı, ne yapmamalı?', '8 Nisan 2026 · 6 dk'], ['Aile Hukuku', 'Anlaşmalı boşanmada protokolün eksik kalan maddeleri', '19 Mart 2026 · 5 dk'], ['Gayrimenkul', 'Kira tespit davasında emsal araştırması nasıl yapılır?', '4 Mart 2026 · 7 dk']].map(([ar, t, m]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    interactive: true,
    padding: "md",
    onClick: () => go('articles'),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, ar), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-title-3)',
      lineHeight: 'var(--leading-snug)',
      textWrap: 'pretty'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      marginTop: 'auto',
      paddingTop: 'var(--space-2)'
    }
  }, m))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      background: 'var(--ink-800)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-12)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-1)',
      color: 'var(--paper-1)',
      letterSpacing: 'var(--tracking-display)'
    }
  }, "\xD6ncelikle bir \xF6n g\xF6r\xFC\u015Fme yap\u0131lmas\u0131n\u0131 \xF6neriyoruz"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body)',
      color: 'var(--ink-100)',
      marginTop: 'var(--space-3)',
      maxWidth: '56ch'
    }
  }, "\xD6n g\xF6r\xFC\u015Fmede dosyan\u0131z\u0131n yol haritas\u0131 de\u011Ferlendirilir. Talebinizin hukuken elveri\u015Fli olmad\u0131\u011F\u0131 kanaatine var\u0131lmas\u0131 h\xE2linde bu husus taraf\u0131n\u0131za a\xE7\u0131k\xE7a bildirilir.")), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu Talebi"))));
}
Object.assign(window, {
  HomeScreen
});
})();
