(function(){
const {
  Card,
  Icon,
  Button,
  Input,
  Tag,
  Badge,
  Tabs
} = window.LexaHukukDesignSystem_93e85e;
const UCRET_ASGARI = [['Büro içi danışma (ilk bir saate kadar)', '5.500 TL'], ['Çağrı üzerine gidilen yerde danışma (ilk bir saate kadar)', '11.000 TL'], ['Yazılı danışma (ilk bir saate kadar)', '11.000 TL'], ['İhtarname, protesto düzenlenmesi', '9.000 TL'], ['Sözleşme, vasiyetname ve benzeri belge düzenlenmesi', '20.000 TL'], ['İcra dairelerinde yapılan işler', '7.500 TL'], ['Sulh hukuk mahkemelerinde takip edilen davalar', '30.000 TL'], ['Asliye hukuk mahkemelerinde takip edilen davalar', '45.000 TL'], ['İş mahkemelerinde takip edilen davalar', '35.000 TL'], ['Aile mahkemelerinde takip edilen davalar', '40.000 TL'], ['İdare ve vergi mahkemelerinde duruşmalı işler', '45.000 TL'], ['Ağır ceza mahkemelerinde takip edilen davalar', '75.000 TL']];
const MEVZUAT = [['Temel meslek mevzuatı', [['1136 sayılı Avukatlık Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.1136.pdf'], ['Türkiye Barolar Birliği Meslek Kuralları', 'barobirlik.org.tr', 'https://www.barobirlik.org.tr/Mevzuat/meslek-kurallari'], ['Avukatlık Asgari Ücret Tarifesi', 'barobirlik.org.tr', 'https://www.barobirlik.org.tr/Mevzuat/avukatlik-asgari-ucret-tarifesi'], ['Türkiye Barolar Birliği Avukatlık Kanunu Yönetmeliği', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5023&MevzuatTur=7&MevzuatTertip=5'], ['Avukatlık Kanunu Yönetmeliği (Reklam Yasağı)', 'barobirlik.org.tr', 'https://www.barobirlik.org.tr/Mevzuat/reklam-yasagi-yonetmeligi']]], ['Usul kanunları', [['6100 sayılı Hukuk Muhakemeleri Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6100.pdf'], ['5271 sayılı Ceza Muhakemesi Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5271.pdf'], ['2004 sayılı İcra ve İflas Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf'], ['2577 sayılı İdari Yargılama Usulü Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.2577.pdf'], ['7201 sayılı Tebligat Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.3.7201.pdf']]], ['Maddi hukuk', [['4721 sayılı Türk Medenî Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4721.pdf'], ['6098 sayılı Türk Borçlar Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6098.pdf'], ['4857 sayılı İş Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4857.pdf'], ['6102 sayılı Türk Ticaret Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6102.pdf'], ['5237 sayılı Türk Ceza Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5237.pdf'], ['6502 sayılı Tüketicinin Korunması Hakkında Kanun', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6502.pdf'], ['6698 sayılı Kişisel Verilerin Korunması Kanunu', 'mevzuat.gov.tr', 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf']]], ['İçtihat ve bilgi kaynakları', [['Anayasa Mahkemesi — Bireysel Başvuru Kararları', 'anayasa.gov.tr', 'https://kararlarbilgibankasi.anayasa.gov.tr/'], ['Yargıtay Karar Arama', 'yargitay.gov.tr', 'https://karararama.yargitay.gov.tr/'], ['Danıştay Karar Arama', 'danistay.gov.tr', 'https://karararama.danistay.gov.tr/'], ['Resmî Gazete', 'resmigazete.gov.tr', 'https://www.resmigazete.gov.tr/'], ['UYAP Vatandaş Portalı', 'vatandas.uyap.gov.tr', 'https://vatandas.uyap.gov.tr/'], ['e-Devlet Kapısı', 'turkiye.gov.tr', 'https://www.turkiye.gov.tr/']]]];
const BILGI_EDINME = [['CİMER — Cumhurbaşkanlığı İletişim Merkezi', 'https://www.cimer.gov.tr/'], ['Adalet Bakanlığı Bilgi Edinme', 'https://www.adalet.gov.tr/bilgiedinme'], ['KVKK Başvuru ve Şikâyet', 'https://www.kvkk.gov.tr/'], ['Tüketici Hakem Heyeti Başvurusu (e-Devlet)', 'https://tuketicisikayeti.ticaret.gov.tr/']];
function AracKarti({
  baslik,
  aciklama,
  children
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, baslik), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      margin: '4px 0 var(--space-4)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, aciklama), children);
}
function SonucSatiri({
  etiket,
  deger
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: '7px 0',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, etiket), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, deger));
}
function SureHesabi() {
  const [tarih, setTarih] = React.useState('');
  const [gun, setGun] = React.useState('7');
  const s = React.useMemo(() => {
    if (!tarih) return null;
    const t = new Date(tarih + 'T00:00:00');
    if (isNaN(t)) return null;
    let son = new Date(t.getTime() + Number(gun || 0) * 864e5);
    const ay = son.getMonth(),
      g = son.getDate();
    const adliTatilde = ay === 6 && g >= 20 || ay === 7;
    if (adliTatilde) son = new Date(son.getFullYear(), 8, 7);
    while (son.getDay() === 0 || son.getDay() === 6) son = new Date(son.getTime() + 864e5);
    const kalan = Math.ceil((son - new Date().setHours(0, 0, 0, 0)) / 864e5);
    return {
      son: son.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      kalan,
      adliTatilde
    };
  }, [tarih, gun]);
  return /*#__PURE__*/React.createElement(AracKarti, {
    baslik: "S\xFCre hesaplay\u0131c\u0131",
    aciklama: "Tebli\u011F tarihinden itibaren son g\xFCn\xFC hesaplar; adli tatil ve hafta sonu uzamas\u0131n\u0131 dikkate al\u0131r."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 120px',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Tebli\u011F tarihi",
    type: "date",
    value: tarih,
    onChange: e => setTarih(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "S\xFCre (g\xFCn)",
    inputMode: "numeric",
    value: gun,
    onChange: e => setGun(e.target.value.replace(/\D/g, ''))
  })), s ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "Son g\xFCn",
    deger: s.son
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "Kalan",
    deger: s.kalan > 0 ? s.kalan + ' gün' : 'Süre doldu'
  }), s.adliTatilde ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--brass-700)',
      marginTop: 'var(--space-3)'
    }
  }, "S\xFCre adli tatile denk geldi\u011Finden 7 Eyl\xFCl'e uzat\u0131lm\u0131\u015Ft\u0131r (HMK m.104).") : null) : null);
}
function KidemHesabi() {
  const [giris, setGiris] = React.useState('');
  const [cikis, setCikis] = React.useState('');
  const [ucret, setUcret] = React.useState('');
  const s = React.useMemo(() => {
    if (!giris || !cikis || !ucret) return null;
    const g = new Date(giris + 'T00:00:00'),
      c = new Date(cikis + 'T00:00:00');
    if (isNaN(g) || isNaN(c) || c <= g) return null;
    const gunSayisi = (c - g) / 864e5;
    const yil = gunSayisi / 365;
    const brut = Number(String(ucret).replace(/\./g, '').replace(',', '.'));
    if (!brut) return null;
    const tavan = 53919.68;
    const esas = Math.min(brut, tavan);
    const kidem = esas * yil;
    const ihbarHafta = yil < 0.5 ? 2 : yil < 1.5 ? 4 : yil < 3 ? 6 : 8;
    const ihbar = brut / 30 * 7 * ihbarHafta;
    const fmt = n => n.toLocaleString('tr-TR', {
      maximumFractionDigits: 0
    }) + ' TL';
    return {
      sure: Math.floor(yil) + ' yıl ' + Math.floor(yil % 1 * 12) + ' ay',
      kidem: fmt(kidem),
      ihbar: fmt(ihbar),
      hafta: ihbarHafta,
      tavanAsti: brut > tavan
    };
  }, [giris, cikis, ucret]);
  return /*#__PURE__*/React.createElement(AracKarti, {
    baslik: "K\u0131dem ve ihbar tazminat\u0131",
    aciklama: "Br\xFCt giydirilmi\u015F \xFCcret \xFCzerinden yakla\u015F\u0131k tutar verir; kesintiler ve y\u0131ll\u0131k izin alaca\u011F\u0131 ayr\u0131ca hesaplan\u0131r."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u0130\u015Fe giri\u015F",
    type: "date",
    value: giris,
    onChange: e => setGiris(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\xC7\u0131k\u0131\u015F",
    type: "date",
    value: cikis,
    onChange: e => setCikis(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Ayl\u0131k br\xFCt \xFCcret (TL)",
    inputMode: "decimal",
    placeholder: "35.000",
    value: ucret,
    onChange: e => setUcret(e.target.value)
  })), s ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "\xC7al\u0131\u015Fma s\xFCresi",
    deger: s.sure
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "K\u0131dem tazminat\u0131 (yakla\u015F\u0131k)",
    deger: s.kidem
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: 'İhbar tazminatı (' + s.hafta + ' hafta)',
    deger: s.ihbar
  }), s.tavanAsti ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--brass-700)',
      marginTop: 'var(--space-3)'
    }
  }, "K\u0131dem tazminat\u0131 hesab\u0131nda yasal tavan (53.919,68 TL) uygulanm\u0131\u015Ft\u0131r.") : null) : null);
}
function FaizHesabi() {
  const [anapara, setAnapara] = React.useState('');
  const [bas, setBas] = React.useState('');
  const [bit, setBit] = React.useState('');
  const [oran, setOran] = React.useState('24');
  const s = React.useMemo(() => {
    const a = Number(String(anapara).replace(/\./g, '').replace(',', '.'));
    if (!a || !bas || !bit) return null;
    const g1 = new Date(bas + 'T00:00:00'),
      g2 = new Date(bit + 'T00:00:00');
    if (isNaN(g1) || isNaN(g2) || g2 <= g1) return null;
    const gun = Math.round((g2 - g1) / 864e5);
    const faiz = a * (Number(oran) / 100) * (gun / 365);
    const fmt = n => n.toLocaleString('tr-TR', {
      maximumFractionDigits: 2
    }) + ' TL';
    return {
      gun,
      faiz: fmt(faiz),
      toplam: fmt(a + faiz)
    };
  }, [anapara, bas, bit, oran]);
  return /*#__PURE__*/React.createElement(AracKarti, {
    baslik: "Faiz hesaplay\u0131c\u0131",
    aciklama: "Basit faiz esas\u0131na g\xF6re hesaplar. Yasal faiz oran\u0131 d\xF6nemsel olarak de\u011Fi\u015Fir; g\xFCncel oran\u0131 teyit ediniz."
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Anapara (TL)",
    inputMode: "decimal",
    placeholder: "50.000",
    value: anapara,
    onChange: e => setAnapara(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 90px',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Ba\u015Flang\u0131\xE7",
    type: "date",
    value: bas,
    onChange: e => setBas(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Biti\u015F",
    type: "date",
    value: bit,
    onChange: e => setBit(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Oran %",
    inputMode: "numeric",
    value: oran,
    onChange: e => setOran(e.target.value.replace(/\D/g, ''))
  })), s ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "G\xFCn say\u0131s\u0131",
    deger: s.gun + ' gün'
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "\u0130\u015Fleyen faiz",
    deger: s.faiz
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "Toplam",
    deger: s.toplam
  })) : null);
}
function VekaletUcretiHesabi() {
  const [tutar, setTutar] = React.useState('');
  const s = React.useMemo(() => {
    const t = Number(String(tutar).replace(/\./g, '').replace(',', '.'));
    if (!t) return null;
    const dilimler = [[400000, 0.16], [400000, 0.15], [800000, 0.14], [1200000, 0.11], [1600000, 0.08], [2000000, 0.05], [2400000, 0.03], [2800000, 0.02]];
    let kalan = t,
      ucret = 0;
    for (const [dilim, o] of dilimler) {
      if (kalan <= 0) break;
      const k = Math.min(kalan, dilim);
      ucret += k * o;
      kalan -= k;
    }
    if (kalan > 0) ucret += kalan * 0.01;
    const asgari = 45000;
    return {
      ucret: Math.max(ucret, asgari).toLocaleString('tr-TR', {
        maximumFractionDigits: 0
      }) + ' TL',
      altSinir: ucret < asgari
    };
  }, [tutar]);
  return /*#__PURE__*/React.createElement(AracKarti, {
    baslik: "Nispi vek\xE2let \xFCcreti",
    aciklama: "Konusu para olan davalarda kar\u015F\u0131 tarafa y\xFCkletilecek vek\xE2let \xFCcretini AA\xDCT dilimlerine g\xF6re hesaplar."
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Dava de\u011Feri (TL)",
    inputMode: "decimal",
    placeholder: "250.000",
    value: tutar,
    onChange: e => setTutar(e.target.value)
  }), s ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "Nispi vek\xE2let \xFCcreti",
    deger: s.ucret
  }), s.altSinir ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--brass-700)',
      marginTop: 'var(--space-3)'
    }
  }, "Hesaplanan tutar tarifedeki maktu \xFCcretin alt\u0131nda kald\u0131\u011F\u0131ndan maktu \xFCcret esas al\u0131nm\u0131\u015Ft\u0131r.") : null) : null);
}
function HarcHesabi() {
  const [deger, setDeger] = React.useState('');
  const s = React.useMemo(() => {
    const d = Number(String(deger).replace(/\./g, '').replace(',', '.'));
    if (!d) return null;
    const nispi = d * 0.06831;
    const pesin = nispi / 4;
    const basvurma = 1300;
    const fmt = n => n.toLocaleString('tr-TR', {
      maximumFractionDigits: 2
    }) + ' TL';
    return {
      nispi: fmt(nispi),
      pesin: fmt(pesin),
      basvurma: fmt(basvurma),
      toplam: fmt(pesin + basvurma)
    };
  }, [deger]);
  return /*#__PURE__*/React.createElement(AracKarti, {
    baslik: "Dava harc\u0131",
    aciklama: "Konusu para olan davalarda binde 68,31 nispi har\xE7 esas\u0131na g\xF6re yakla\u015F\u0131k tutar\u0131 verir; pe\u015Fin har\xE7 d\xF6rtte birdir."
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Dava de\u011Feri (TL)",
    inputMode: "decimal",
    placeholder: "250.000",
    value: deger,
    onChange: e => setDeger(e.target.value)
  }), s ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "Nispi karar ve ilam harc\u0131",
    deger: s.nispi
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "Pe\u015Fin har\xE7 (1/4)",
    deger: s.pesin
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "Ba\u015Fvurma harc\u0131",
    deger: s.basvurma
  }), /*#__PURE__*/React.createElement(SonucSatiri, {
    etiket: "A\xE7\u0131l\u0131\u015Fta \xF6denecek (yakla\u015F\u0131k)",
    deger: s.toplam
  })) : null);
}
function MevzuatScreen({
  go,
  sekme
}) {
  const [tab, setTab] = React.useState(sekme || 'araclar');
  React.useEffect(() => {
    if (sekme) setTab(sekme);
  }, [sekme]);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "MEVZUAT VE ARA\xC7LAR",
    title: "Hesaplama ara\xE7lar\u0131, \xFCcret tarifeleri ve mevzuat",
    sub: "A\u015Fa\u011F\u0131daki ara\xE7lar ve tarifeler bilgilendirme ama\xE7l\u0131d\u0131r; dosyan\u0131za \xF6zg\xFC hesap ve de\u011Ferlendirme i\xE7in taraf\u0131m\u0131za ba\u015Fvurunuz."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      value: 'araclar',
      label: 'Hesaplama araçları',
      icon: 'calculator'
    }, {
      value: 'tarife',
      label: 'Ücret tarifeleri',
      icon: 'scale'
    }, {
      value: 'mevzuat',
      label: 'Mevzuat',
      icon: 'book-open'
    }, {
      value: 'bilgi',
      label: 'Bilgi edinme',
      icon: 'info'
    }],
    value: tab,
    onChange: setTab
  })), tab === 'araclar' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(SureHesabi, null), /*#__PURE__*/React.createElement(KidemHesabi, null), /*#__PURE__*/React.createElement(FaizHesabi, null), /*#__PURE__*/React.createElement(VekaletUcretiHesabi, null), /*#__PURE__*/React.createElement(HarcHesabi, null), /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    tone: "inverse"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--brass-400)'
    }
  }, "\xD6NEML\u0130 A\xC7IKLAMA"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-100)',
      marginTop: 'var(--space-3)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Bu ara\xE7lar yakla\u015F\u0131k sonu\xE7 \xFCretir; mevzuattaki oran, tavan ve tarife de\u011Fi\u015Fiklikleri sonucu etkiler. Hak kayb\u0131 ya\u015Famaman\u0131z i\xE7in s\xFCre ve tutar hesaplar\u0131n\u0131z\u0131 taraf\u0131m\u0131za teyit ettirmenizi \xF6neririz."), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    icon: "calendar-plus",
    style: {
      marginTop: 'var(--space-4)'
    },
    onClick: () => go('booking')
  }, "\xD6n g\xF6r\xFC\u015Fme talep ediniz"))) : null, tab === 'tarife' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "AVUKATLIK ASGAR\u0130 \xDCCRET TAR\u0130FES\u0130 \u2014 2026"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      margin: '6px 0 var(--space-4)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "T\xFCrkiye Barolar Birli\u011Fi taraf\u0131ndan belirlenen ve Resm\xEE Gazete'de yay\u0131mlanan tarifedeki maktu \xFCcretlerden se\xE7ilmi\u015F kalemlerdir. Tarife, alt\u0131na inilemeyecek asgari tutarlar\u0131 g\xF6sterir."), UCRET_ASGARI.map(([is, tl], i) => /*#__PURE__*/React.createElement("div", {
    key: is,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: '9px 0',
      borderTop: i ? '1px solid var(--border-hairline)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)'
    }
  }, is), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)',
      whiteSpace: 'nowrap'
    }
  }, tl))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "https://www.barobirlik.org.tr/Mevzuat/avukatlik-asgari-ucret-tarifesi",
    target: "_blank",
    rel: "noopener",
    variant: "secondary",
    size: "sm",
    iconEnd: "external-link"
  }, "Resm\xEE tarife metni"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "https://www.resmigazete.gov.tr/",
    target: "_blank",
    rel: "noopener",
    variant: "ghost",
    size: "sm",
    iconEnd: "external-link"
  }, "Resm\xEE Gazete"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "ANTALYA BAROSU TAVS\u0130YE TAR\u0130FES\u0130"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)',
      marginTop: 'var(--space-3)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Antalya Barosu, asgari tarifenin \xFCzerinde tavsiye niteli\u011Finde bir \xFCcret tarifesi yay\u0131mlamaktad\u0131r. Tavsiye tarifesi ba\u011Flay\u0131c\u0131 de\u011Fildir; i\u015Fin kapsam\u0131, s\xFCresi ve niteli\u011Fine g\xF6re \xFCcret s\xF6zle\u015Fmeyle belirlenir."), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "https://www.antalyabarosu.org.tr/",
    target: "_blank",
    rel: "noopener",
    variant: "secondary",
    size: "sm",
    iconEnd: "external-link",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "Antalya Barosu tarifesi")), /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    tone: "flat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "\xDCCRET NASIL BEL\u0130RLEN\u0130R"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Avukatl\u0131k \xFCcreti, Avukatl\u0131k Kanunu m.163 uyar\u0131nca yaz\u0131l\u0131 avukatl\u0131k s\xF6zle\u015Fmesiyle kararla\u015Ft\u0131r\u0131l\u0131r. Tarifedeki tutarlar\u0131n alt\u0131nda \xFCcret kararla\u015Ft\u0131r\u0131lamaz. Dava sonunda kar\u015F\u0131 tarafa y\xFCkletilen vek\xE2let \xFCcreti, taraf\u0131m\u0131zca al\u0131nan \xFCcretten ayr\u0131d\u0131r.")))) : null, tab === 'mevzuat' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-6)'
    }
  }, MEVZUAT.map(([grup, satirlar]) => /*#__PURE__*/React.createElement("div", {
    key: grup
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, grup.toLocaleUpperCase('tr-TR')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-3)'
    }
  }, satirlar.map(([ad, kaynak, href]) => /*#__PURE__*/React.createElement("a", {
    key: ad,
    href: href,
    target: "_blank",
    rel: "noopener",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "scale",
    size: 16,
    color: "var(--brass-600)",
    style: {
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, ad), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      display: 'block',
      fontSize: 11,
      color: 'var(--text-faint)',
      marginTop: 2
    }
  }, kaynak)), /*#__PURE__*/React.createElement(Icon, {
    name: "external-link",
    size: 14,
    color: "var(--text-faint)",
    style: {
      flex: '0 0 auto'
    }
  }))))))) : null, tab === 'bilgi' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "B\u0130LG\u0130 ED\u0130NME VE BA\u015EVURU KANALLARI"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      margin: '6px 0 var(--space-4)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "4982 say\u0131l\u0131 Bilgi Edinme Hakk\u0131 Kanunu kapsam\u0131nda kamu kurumlar\u0131na ba\u015Fvuru yapabilece\u011Finiz resm\xEE kanallar a\u015Fa\u011F\u0131da yer almaktad\u0131r."), BILGI_EDINME.map(([ad, href], i) => /*#__PURE__*/React.createElement("a", {
    key: ad,
    href: href,
    target: "_blank",
    rel: "noopener",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) 0',
      borderTop: i ? '1px solid var(--border-hairline)' : 0,
      textDecoration: 'none',
      borderBottom: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 15,
    color: "var(--brass-600)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-heading)'
    }
  }, ad), /*#__PURE__*/React.createElement(Icon, {
    name: "external-link",
    size: 13,
    color: "var(--text-faint)"
  })))), /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    tone: "flat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "B\xDCROMUZA B\u0130LG\u0130 ED\u0130NME BA\u015EVURUSU"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Ki\u015Fisel verilerinize ili\u015Fkin taleplerinizi (bilgi talebi, d\xFCzeltme, silme) KEP adresimiz \xFCzerinden ya da yaz\u0131l\u0131 olarak b\xFCromuza iletebilirsiniz. Ba\u015Fvurular\u0131n\u0131z en ge\xE7 otuz g\xFCn i\xE7inde sonu\xE7land\u0131r\u0131l\u0131r."), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)',
      marginTop: 'var(--space-3)'
    }
  }, window.BURO.kep))) : null);
}
Object.assign(window, {
  MevzuatScreen
});
})();
