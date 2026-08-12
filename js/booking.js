(function(){
const {
  Button,
  Card,
  Badge,
  Icon,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  AppointmentSlot,
  Dialog,
  Toast
} = window.LexaHukukDesignSystem_93e85e;
const DAYS = [{
  key: '13',
  label: 'Pzt',
  date: '13 Nis'
}, {
  key: '14',
  label: 'Sal',
  date: '14 Nis'
}, {
  key: '15',
  label: 'Çar',
  date: '15 Nis'
}, {
  key: '16',
  label: 'Per',
  date: '16 Nis'
}, {
  key: '17',
  label: 'Cum',
  date: '17 Nis'
}];
const TIMES = ['09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
const FULL = ['11:00', '14:00', '15:30'];
const CHANNELS = [{
  key: 'office',
  icon: 'building-2',
  title: 'Ofiste görüşme',
  desc: 'Meltem Mah. İ. B. Sürelsan Cad. No:21 K:8 D:25, Muratpaşa (Gobu Cafe üstü) · 45 dk'
}, {
  key: 'video',
  icon: 'video',
  title: 'Görüntülü görüşme',
  desc: 'Görüşme bağlantısı e-posta ve uygulama üzerinden tarafınıza iletilir · 30 dk'
}, {
  key: 'phone',
  icon: 'phone',
  title: 'Sesli görüşme',
  desc: 'Belirlenen saatte tarafımızca aranırsınız · 20 dk · WhatsApp üzerinden de görüşülebilir'
}];
function BookingScreen({
  go
}) {
  const [step, setStep] = React.useState(1);
  const [channel, setChannel] = React.useState('video');
  const [day, setDay] = React.useState('14');
  const [time, setTime] = React.useState('10:30');
  const [kvkk, setKvkk] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [ad, setAd] = React.useState('');
  const [tel, setTel] = React.useState('');
  const [konu, setKonu] = React.useState('');
  const ch = CHANNELS.find(c => c.key === channel);
  const dayObj = DAYS.find(d => d.key === day);
  const calUrl = window.BURO.calLink ? window.BURO.calLink + '?layout=month_view' : null;
  const gonder = () => {
    const metin = ['Randevu talebi', '', 'Ad Soyad: ' + ad, 'Telefon: ' + tel, 'Görüşme türü: ' + ch.title, 'Tarih: ' + dayObj.date + ' 2026', 'Saat: ' + time, konu.trim() ? '' : null, konu.trim() ? 'Konu: ' + konu.trim() : null, '', 'KVKK aydınlatma metnini okudum, onayladım.'].filter(x => x !== null).join('\n');
    window.open(window.BURO.wa(metin), '_blank');
    setDone(true);
  };
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 960,
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "RANDEVU"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-2)',
      letterSpacing: 'var(--tracking-display)',
      marginTop: 'var(--space-3)'
    }
  }, "G\xF6r\xFC\u015Fme t\xFCr\xFCn\xFC ve saatini belirleyiniz"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)',
      maxWidth: '62ch',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "G\xF6r\xFC\u015Fme t\xFCr\xFCn\xFC belirledikten sonra takvimden uygun saati se\xE7meniz yeterlidir; se\xE7ti\u011Finiz saat taraf\u0131n\u0131za ayr\u0131l\u0131r. Takvimi kullanmak istemedi\u011Finiz takdirde talebinizi WhatsApp \xFCzerinden de iletebilirsiniz. \u0130vedi h\xE2llerde ", /*#__PURE__*/React.createElement("a", {
    href: window.BURO.telHref
  }, window.BURO.tel), " numaral\u0131 telefondan taraf\u0131m\u0131za ula\u015Fabilirsiniz."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      margin: 'var(--space-8) 0 var(--space-6)'
    }
  }, ['Görüşme türü', 'Takvimden saat', 'Bilgileriniz'].map((s, i) => {
    const n = i + 1,
      active = step === n,
      past = step > n;
    return /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-control)',
        background: active ? 'var(--surface-card)' : 'transparent',
        border: '1px solid ' + (active ? 'var(--border-default)' : 'transparent'),
        boxShadow: active ? 'var(--shadow-card)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
        background: past ? 'var(--brass-500)' : active ? 'var(--ink-800)' : 'var(--paper-3)',
        color: past || active ? 'var(--paper-0)' : 'var(--text-faint)'
      }
    }, past ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 13
    }) : n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-body-sm)',
        fontWeight: active ? 600 : 500,
        color: active ? 'var(--text-heading)' : 'var(--text-muted)'
      }
    }, s));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr .6fr',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, step === 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, CHANNELS.map(c => /*#__PURE__*/React.createElement(Radio, {
    key: c.key,
    name: "ch",
    label: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16,
      color: 'var(--channel-' + c.key + ')'
    }), c.title),
    description: c.desc,
    checked: channel === c.key,
    onChange: () => setChannel(c.key)
  })), /*#__PURE__*/React.createElement(Select, {
    label: "Konu ba\u015Fl\u0131\u011F\u0131",
    hint: "Emin de\u011Filseniz \u201CDi\u011Fer\u201D se\xE7ene\u011Fini i\u015Faretlemeniz yeterlidir; konu g\xF6r\xFC\u015Fme s\u0131ras\u0131nda birlikte belirlenir.",
    style: {
      marginTop: 'var(--space-3)'
    },
    options: [{
      value: 'ticaret',
      label: 'Özel Hukuk · Ticaret ve Şirketler'
    }, {
      value: 'is',
      label: 'Özel Hukuk · İş Hukuku'
    }, {
      value: 'icra',
      label: 'Özel Hukuk · İcra ve İflas'
    }, {
      value: 'alacak',
      label: 'Özel Hukuk · Alacak ve Tazminat'
    }, {
      value: 'gayrimenkul',
      label: 'Özel Hukuk · Gayrimenkul ve Taşınmaz'
    }, {
      value: 'kira',
      label: 'Özel Hukuk · Kira'
    }, {
      value: 'miras',
      label: 'Özel Hukuk · Miras'
    }, {
      value: 'aile',
      label: 'Özel Hukuk · Aile ve Boşanma'
    }, {
      value: 'sozlesme',
      label: 'Özel Hukuk · Sözleşmeler'
    }, {
      value: 'tuketici',
      label: 'Özel Hukuk · Tüketici'
    }, {
      value: 'sigorta',
      label: 'Özel Hukuk · Sigorta'
    }, {
      value: 'kisilik',
      label: 'Özel Hukuk · Kişilik Hakları'
    }, {
      value: 'ceza',
      label: 'Kamu Hukuku · Ceza'
    }, {
      value: 'idare',
      label: 'Kamu Hukuku · İdare'
    }, {
      value: 'vergi',
      label: 'Kamu Hukuku · Vergi'
    }, {
      value: 'sgk',
      label: 'Kamu Hukuku · Sosyal Güvenlik'
    }, {
      value: 'diger',
      label: 'Diğer / emin değilim'
    }]
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconEnd: "arrow-right",
    style: {
      alignSelf: 'flex-end',
      marginTop: 'var(--space-4)'
    },
    onClick: () => setStep(2)
  }, "Devam")) : step === 2 && calUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 16,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "A\u015Fa\u011F\u0131daki takvimde yaln\u0131zca ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-heading)'
    }
  }, "fiilen uygun olan"), " saatler g\xF6r\xFCnt\xFClenir. Se\xE7ti\u011Finiz saat taraf\u0131n\u0131za ayr\u0131l\u0131r ve teyit iletisi hem taraf\u0131n\u0131za hem b\xFCromuza g\xF6nderilir.")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    src: calUrl,
    title: "Randevu takvimi",
    style: {
      width: '100%',
      height: 620,
      border: 0,
      display: 'block'
    },
    loading: "lazy"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'var(--space-5)',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "arrow-left",
    onClick: () => setStep(1)
  }, "Geri"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)'
    }
  }, "Takvim g\xF6r\xFCnt\xFClenmiyorsa ", /*#__PURE__*/React.createElement("a", {
    href: calUrl,
    target: "_blank",
    rel: "noopener"
  }, "yeni sekmede a\xE7abilirsiniz"), "."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconEnd: "arrow-right",
    onClick: () => setStep(3)
  }, "Takvim yerine WhatsApp \xFCzerinden iletmek istiyorum"))) : step === 2 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 16,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, "Nisan 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "chevron-left"
  }, " "), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "chevron-right"
  }, " "))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gap: 'var(--space-2)'
    }
  }, DAYS.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.key,
    onClick: () => setDay(d.key),
    style: {
      padding: 'var(--space-3)',
      borderRadius: 'var(--radius-control)',
      cursor: 'pointer',
      font: 'inherit',
      border: '1px solid ' + (day === d.key ? 'var(--ink-800)' : 'var(--border-default)'),
      background: day === d.key ? 'var(--ink-800)' : 'var(--surface-card)',
      color: day === d.key ? 'var(--text-on-dark)' : 'var(--text-heading)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-micro)',
      letterSpacing: '.1em',
      opacity: .7
    }
  }, d.label.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      marginTop: 2
    }
  }, d.date)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      margin: 'var(--space-6) 0 var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "UYGUN SAATLER"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-hairline)'
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, TIMES.length - FULL.length, " bo\u015F")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--space-2)'
    }
  }, TIMES.map(t => /*#__PURE__*/React.createElement(AppointmentSlot, {
    key: t,
    time: t,
    channel: channel,
    duration: channel === 'office' ? '45 dk' : channel === 'video' ? '30 dk' : '20 dk',
    selected: time === t,
    disabled: FULL.includes(t),
    onClick: () => setTime(t)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "arrow-left",
    onClick: () => setStep(1)
  }, "Geri"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconEnd: "arrow-right",
    onClick: () => setStep(3)
  }, "Devam"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Ad Soyad",
    value: ad,
    onChange: e => setAd(e.target.value),
    placeholder: "Ad\u0131n\u0131z\u0131 ve soyad\u0131n\u0131z\u0131 yaz\u0131n\u0131z",
    icon: "user"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Telefon",
    value: tel,
    onChange: e => setTel(e.target.value),
    placeholder: "05xx xxx xx xx",
    icon: "phone"
  })), /*#__PURE__*/React.createElement(Textarea, {
    label: "Talebinizin konusu",
    rows: 4,
    counterMax: 800,
    value: konu,
    onChange: e => setKonu(e.target.value),
    hint: "Belgelerinizi g\xF6r\xFC\u015Fme \xF6ncesinde WhatsApp \xFCzerinden iletebilirsiniz."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "KVKK Ayd\u0131nlatma Metni'ni okudum ve i\u015Flenmesine onay veriyorum.",
    description: "Verileriniz yaln\u0131zca randevu ve dosya s\xFCreciniz kapsam\u0131nda i\u015Flenmektedir.",
    checked: kvkk,
    onChange: e => setKvkk(e.target.checked)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 16,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Onay vermeniz h\xE2linde randevu talebiniz WhatsApp \xFCzerinden b\xFCromuza iletilir; teyit ayn\u0131 yaz\u0131\u015Fma \xFCzerinden taraf\u0131n\u0131za bildirilir.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "arrow-left",
    onClick: () => setStep(2)
  }, "Geri"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "message-circle",
    disabled: !kvkk || !ad.trim() || !tel.trim(),
    onClick: gonder
  }, "Randevu Talebini \u0130letiniz")))), /*#__PURE__*/React.createElement(Card, {
    padding: "sm",
    tone: "flat",
    style: {
      position: 'sticky',
      top: 96
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "\xD6ZET"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)'
    }
  }, [['Görüşme', ch.title, ch.icon], ['Tarih', dayObj.date + ' 2026', 'calendar-days'], ['Saat', time, 'clock'], ['Süre', channel === 'office' ? '45 dakika' : channel === 'video' ? '30 dakika' : '20 dakika', 'timer']].map(([k, v, ic]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 15,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)',
      width: 56
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-heading)',
      fontWeight: 500
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)',
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "\u0130lk on be\u015F dakikal\u0131k \xF6n g\xF6r\xFC\u015Fme \xFCcretsizdir. Randevunuzu, g\xF6r\xFC\u015Fme saatinden yirmi d\xF6rt saat \xF6ncesine kadar bedelsiz olarak erteleyebilirsiniz."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "DO\u011ERUDAN \u0130LET\u0130\u015E\u0130M"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.telHref,
    variant: "secondary",
    size: "sm",
    block: true,
    icon: "phone"
  }, window.BURO.tel), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.BURO.whatsapp,
    target: "_blank",
    rel: "noopener",
    variant: "secondary",
    size: "sm",
    block: true,
    icon: "message-circle"
  }, "WhatsApp \xFCzerinden yaz\u0131n\u0131z")))), /*#__PURE__*/React.createElement(Dialog, {
    open: done,
    title: "Randevu talebiniz taraf\u0131m\u0131za iletildi",
    description: dayObj.date + ' 2026, ' + time + ' · ' + ch.title,
    onClose: () => setDone(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      as: "a",
      href: window.BURO.telHref,
      icon: "phone"
    }, "Aray\u0131n"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setDone(false)
    }, "Tamam"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      background: 'var(--brass-50)',
      border: '1px solid var(--brass-200)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16,
    color: "var(--brass-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--brass-800)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "WhatsApp penceresi a\xE7\u0131lmad\u0131ysa bilgileriniz haz\u0131r mesaj olarak kopyalanmam\u0131\u015F olabilir; ", window.BURO.tel, " numaras\u0131ndan yazabilir ya da arayabilirsiniz. Saatin uygunlu\u011Fu teyit edildikten sonra randevunuz kesinle\u015Fir."))), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    title: "Hat\u0131rlatma kuruldu",
    description: "24 saat \xF6nce SMS g\xF6nderilecek."
  })) : null);
}
Object.assign(window, {
  BookingScreen
});
})();