(function(){
const A = f => window.UY_ASSETS && window.UY_ASSETS[f] || (window.ASSET_BASE || '../../assets') + '/' + f;
const {
  Button,
  Card,
  Badge,
  Icon
} = window.LexaHukukDesignSystem_93e85e;
const OZELLIKLER = [['calendar-clock', 'Randevu talebi ve takvim', 'Ofiste, görüntülü veya sesli görüşme için uygun saatleri görüntüleyebilir, randevunuzu doğrudan oluşturabilirsiniz. Randevunuz yaklaştığında uygulama tarafından hatırlatma yapılır.'], ['folder-open', 'Dosya durumu takibi', 'Tarafımıza tevkil ettiğiniz dosyaların bulunduğu aşamayı, yaklaşan duruşma günlerini ve tamamlanan işlemleri erişim kodunuzla görüntüleyebilirsiniz.'], ['message-circle', 'Soru ve belge iletimi', 'Dosyanıza ilişkin sorularınızı ve belgelerinizi uygulama üzerinden tarafımıza iletebilirsiniz. Tarafımızca en geç bir iş günü içinde dönüş yapılmaktadır.'], ['credit-card', 'Ödeme ve hesap bilgileri', 'Vekâlet ücreti ve masraflara ilişkin ödemelerinizi kartla gerçekleştirebilir, banka hesap bilgilerimizi tek dokunuşla kopyalayabilirsiniz.'], ['video', 'Görüşmeye katılım', 'Görüntülü görüşme randevularınıza, bağlantı aramanıza gerek kalmaksızın uygulama içinden katılabilirsiniz.'], ['bell', 'Bildirimler', 'Duruşma günü belirlendiğinde, dosyanıza yeni bir belge sunulduğunda ve tarafımızca yanıt verildiğinde bilgilendirilirsiniz.']];
function UygulamaScreen({
  go
}) {
  const [kurulum, setKurulum] = React.useState(null);
  const [kurulu, setKurulu] = React.useState(false);
  React.useEffect(() => {
    const yakala = e => {
      e.preventDefault();
      setKurulum(e);
    };
    window.addEventListener('beforeinstallprompt', yakala);
    const mq = window.matchMedia('(display-mode: standalone)');
    setKurulu(mq.matches || window.navigator.standalone === true);
    const kuruldu = () => {
      setKurulu(true);
      setKurulum(null);
    };
    window.addEventListener('appinstalled', kuruldu);
    return () => {
      window.removeEventListener('beforeinstallprompt', yakala);
      window.removeEventListener('appinstalled', kuruldu);
    };
  }, []);
  const kur = () => {
    if (kurulum) {
      kurulum.prompt();
      setKurulum(null);
    }
  };
  const adimlar = [{
    p: 'iPhone ve iPad',
    ic: 'apple',
    a: ['Bu sayfayı Safari tarayıcısı ile açınız.', 'Ekranın alt kısmındaki Paylaş simgesine dokununuz.', 'Açılan listeden "Ana Ekrana Ekle" seçeneğini seçiniz.', 'Sağ üstteki "Ekle" düğmesine dokununuz. Uygulama ana ekranınıza yerleşecektir.']
  }, {
    p: 'Android',
    ic: 'smartphone',
    a: ['Bu sayfayı Chrome tarayıcısı ile açınız.', 'Sağ üstteki üç nokta simgesine dokununuz.', '"Uygulamayı yükle" ya da "Ana ekrana ekle" seçeneğini seçiniz.', 'Onay verdiğinizde uygulama telefonunuza kurulacaktır.']
  }];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink-900)',
      color: 'var(--text-on-dark)',
      padding: 'var(--space-20) var(--gutter-page-lg) var(--space-16)'
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
  }, "MOB\u0130L UYGULAMA"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-1)',
      lineHeight: 1.06,
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--paper-1)',
      marginTop: 'var(--space-5)',
      textWrap: 'balance'
    }
  }, "Dosyan\u0131z telefonunuzda"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-6)',
      fontSize: 'var(--text-body-lg)',
      color: 'var(--ink-100)',
      lineHeight: 'var(--leading-relaxed)',
      maxWidth: '56ch',
      textWrap: 'pretty'
    }
  }, "B\xFCromuzun mobil uygulamas\u0131, web sitesiyle ayn\u0131 hesap \xFCzerinden \xE7al\u0131\u015Fmaktad\u0131r. Randevular\u0131n\u0131z\u0131 olu\u015Fturabilir, dosyan\u0131z\u0131n durumunu takip edebilir, sorular\u0131n\u0131z\u0131 iletebilir ve \xF6demelerinizi ger\xE7ekle\u015Ftirebilirsiniz. Uygulama ma\u011Fazas\u0131ndan indirme yap\u0131lmas\u0131 gerekmez; telefonunuzun taray\u0131c\u0131s\u0131 \xFCzerinden birka\xE7 dokunu\u015Fla kurulur."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, kurulu ? /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: "check"
  }, "Uygulama bu cihaza kurulmu\u015Ftur") : kurulum ? /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "download",
    onClick: kur
  }, "Uygulamay\u0131 telefonuma kur") : /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "smartphone",
    as: "a",
    href: "#kurulum"
  }, "Kurulum ad\u0131mlar\u0131n\u0131 g\xF6r\xFCnt\xFCle"), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    icon: "folder-lock",
    onClick: () => go('login')
  }, "M\xFCvekkil giri\u015Fi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-10)',
      flexWrap: 'wrap'
    }
  }, [['Uygulama mağazası gerekmez', 'Tarayıcıdan doğrudan kurulur'], ['Yer kaplamaz', 'Cihazınızda birkaç megabayt yer tutar'], ['Çevrimdışı çalışır', 'İnternet bağlantısı olmadığında da açılır']].map(([b, a]) => /*#__PURE__*/React.createElement("div", {
    key: b
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--brass-400)'
    }
  }, b), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--ink-300)',
      marginTop: 2
    }
  }, a))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      padding: 10,
      borderRadius: 44,
      background: 'var(--ink-950)',
      border: '1px solid var(--border-inverse)',
      boxShadow: 'var(--shadow-overlay)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 36,
      overflow: 'hidden',
      background: 'var(--surface-page)',
      height: 560,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink-900)',
      padding: '30px var(--space-5) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A('logo-light.png'),
    alt: "",
    style: {
      height: 28,
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '.1em',
      color: 'var(--paper-1)'
    }
  }, "UMUT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brass-500)'
    }
  }, "Y\xDCCEL")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      letterSpacing: '.2em',
      color: 'var(--ink-300)'
    }
  }, "AVUKAT \xB7 ANTALYA BAROSU"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      padding: 'var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      background: 'rgba(255,255,255,.06)',
      border: '1px solid var(--border-inverse)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 9,
      letterSpacing: '.14em',
      color: 'var(--brass-400)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "video",
    size: 11
  }), "YAKLA\u015EAN RANDEVU"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      color: 'var(--paper-1)',
      marginTop: 4
    }
  }, "Yar\u0131n 10:30"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-300)'
    }
  }, "G\xF6r\xFCnt\xFCl\xFC g\xF6r\xFC\u015Fme \xB7 30 dakika"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, [['Eri\u015Fim kodu ile giri\u015F', 'Kod, vek\xE2let ili\u015Fkisi kuruldu\u011Funda taraf\u0131m\u0131zca bildirilir.'], ['Dosya durumu', 'Yaln\u0131z durum bilgisi ve yakla\u015Fan duru\u015Fma g\xFCn\xFC g\xF6r\xFCn\xFCr.'], ['Belge payla\u015F\u0131m\u0131', 'Belge bu kanaldan payla\u015F\u0131lmaz; KEP ya da WhatsApp kullan\u0131l\u0131r.']].map(([t, aciklama]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      padding: 'var(--space-3)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      color: 'var(--text-heading)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'var(--text-faint)',
      marginTop: 3,
      lineHeight: 1.45
    }
  }, aciklama))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, ['calendar-plus', 'message-square', 'upload'].map(ic => /*#__PURE__*/React.createElement("div", {
    key: ic,
    style: {
      flex: 1,
      height: 46,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 15,
    color: "var(--brass-600)"
  })))))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "UYGULAMADA NELER VAR",
    title: "Uygulama ile yapabilecekleriniz",
    sub: "Web sitesi ve mobil uygulama ayn\u0131 kay\u0131tlar \xFCzerinde \xE7al\u0131\u015F\u0131r; birinde yap\u0131lan i\u015Flem di\u011Ferinde de g\xF6r\xFCn\xFCr."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-10)'
    }
  }, OZELLIKLER.map(([ic, t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    padding: "md",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
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
    name: ic,
    size: 20,
    color: "var(--brass-700)"
  })), /*#__PURE__*/React.createElement("h3", null, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)',
      textWrap: 'pretty'
    }
  }, d)))))), /*#__PURE__*/React.createElement("section", {
    id: "kurulum",
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
    eyebrow: "KURULUM",
    title: "Telefonunuza nas\u0131l kurulur?",
    sub: "Uygulama ma\u011Fazas\u0131na girmeniz gerekmez. A\u015Fa\u011F\u0131daki ad\u0131mlar\u0131 izlemeniz yeterlidir."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-10)'
    }
  }, adimlar.map(k => /*#__PURE__*/React.createElement(Card, {
    key: k.p,
    padding: "md",
    topRule: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: k.ic === 'apple' ? 'smartphone' : 'tablet-smartphone',
    size: 20,
    color: "var(--ink-700)"
  }), /*#__PURE__*/React.createElement("h3", null, k.p)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-5)'
    }
  }, k.a.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      flex: '0 0 auto',
      borderRadius: 999,
      background: 'var(--ink-800)',
      color: 'var(--paper-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 600
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, a))))))), /*#__PURE__*/React.createElement(Card, {
    tone: "flat",
    padding: "sm",
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 16,
    color: "var(--brass-600)",
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
  }, "Uygulama, telefonunuzdaki rehber, konum ve galeri gibi bilgilere eri\u015Fmez. Yaln\u0131zca taraf\u0131n\u0131zca girilen bilgiler i\u015Flenir. Ki\u015Fisel verilerinizin i\u015Flenmesine ili\u015Fkin a\xE7\u0131klamalar KVKK Ayd\u0131nlatma Metni'nde yer almaktad\u0131r.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", {
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
  }, "Eri\u015Fim kodunuz yok mu?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body)',
      color: 'var(--ink-100)',
      marginTop: 'var(--space-3)',
      maxWidth: '58ch',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Dosya takibi i\xE7in eri\u015Fim kodu, vek\xE2let ili\u015Fkisinin kurulmas\u0131n\u0131n ard\u0131ndan taraf\u0131m\u0131zca taraf\u0131n\u0131za bildirilir. Hen\xFCz m\xFCvekkilimiz de\u011Filseniz \xF6ncelikle bir \xF6n g\xF6r\xFC\u015Fme yap\u0131lmas\u0131 gerekmektedir.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu talebi olu\u015Fturunuz"), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    icon: "message-circle",
    as: "a",
    href: window.BURO.whatsapp,
    target: "_blank",
    rel: "noopener"
  }, "WhatsApp ile yaz\u0131n\u0131z")))));
}
Object.assign(window, {
  UygulamaScreen
});
})();
