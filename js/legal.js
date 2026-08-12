(function(){
const A = f => window.UY_ASSETS && window.UY_ASSETS[f] || (window.ASSET_BASE || '../../assets') + '/' + f;
const {
  Card,
  Icon,
  Tabs,
  Button
} = window.LexaHukukDesignSystem_93e85e;
const KVKK_TABLO = [['Kimlik', 'Ad, soyad, T.C. kimlik numarası, doğum tarihi', 'Vekâletname düzenlenmesi, dosya açılması, kimlik teyidi'], ['İletişim', 'Telefon, e-posta, adres, KEP adresi', 'Randevu teyidi, duruşma hatırlatması, tebligat bilgisi'], ['Müvekkil dosyası', 'Dava/icra dosya bilgileri, dilekçeler, mahkeme yazışmaları, deliller', 'Avukatlık sözleşmesinin ifası, dava ve takip süreçlerinin yürütülmesi'], ['Finansal', 'Vekâlet ücreti ve masraf kayıtları, IBAN, ödeme işlem kayıtları', 'Ücret tahsilatı, muhasebe ve vergi yükümlülükleri'], ['Özel nitelikli', 'Sağlık raporu, ceza/adli sicil kaydı, biyometrik fotoğraf (yalnız dosya gerektiriyorsa)', 'Dava konusu hakkın tesisi, kullanılması veya korunması'], ['İşlem güvenliği', 'IP adresi, giriş kayıtları, oturum bilgisi', 'Portal hesabınızın güvenliği, yetkisiz erişimin önlenmesi']];
const ALICILAR = [['Mahkemeler, icra daireleri, savcılıklar', 'Dosyanızın açılması ve yürütülmesi (UYAP üzerinden)', 'Türkiye'], ['Karşı taraf vekili, bilirkişi, tanık', 'Usul hukukunun zorunlu kıldığı ölçüde tebliğ ve dosya paylaşımı', 'Türkiye'], ['Mali müşavir', 'Vekâlet ücreti ve masraf kayıtlarının muhasebeleştirilmesi', 'Türkiye'], ['T.C. Vakıflar Bankası', 'Havale/EFT ile ücret tahsilatı', 'Türkiye'], ['Moka Ödeme Kuruluşu A.Ş. (Moka United)', 'Kartla ödeme. Kart numaranız büroya hiç iletilmez; yalnız ödeme kuruluşunda işlenir', 'Türkiye'], ['Google LLC (Gmail)', 'Büro e-posta yazışmalarının iletilmesi ve saklanması', 'Yurt dışı'], ['Cloudflare, Inc. (Cloudflare Pages)', 'Sitenin ve portalın barındırılması, HTTPS sertifikası, saldırı koruması', 'Yurt dışı'], ['Cloudflare Web Analytics', 'İsimsiz ziyaret istatistiği. Çerez yazmaz, IP adresi kaydetmez, ziyaretçileri siteler arası izlemez', 'Yurt dışı'], ['Anthropic PBC (Claude)', 'Yalnız portalden gönderdiğiniz sorunun ön değerlendirmesi. Rızanız olmadan çalışmaz', 'Yurt dışı']];
const KVKK_HAKLAR = ['Kişisel verilerinizin işlenip işlenmediğini öğrenme', 'İşlenmişse buna ilişkin bilgi talep etme', 'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme', 'Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme', 'Eksik veya yanlış işlenmişse düzeltilmesini isteme', 'Kanundaki şartlar çerçevesinde silinmesini veya yok edilmesini isteme', 'Düzeltme, silme ve yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme', 'Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç doğmasına itiraz etme', 'Hukuka aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme'];
const COOKIES = [{
  tur: 'Zorunlu çerezler',
  sure: 'Oturum süresi',
  ornek: 'Oturum kimliği, güvenlik jetonu',
  aciklama: 'Portalde oturumunuzun açık kalması ve güvenlik doğrulaması için gereklidir. Kapatılamaz; kapatılırsa portal çalışmaz.',
  zorunlu: true
}, {
  tur: 'İşlevsel çerezler',
  sure: '12 ay',
  ornek: 'Dil tercihi, bildirim tercihleri, en son görüntülenen dosya',
  aciklama: 'Tercihlerinizi hatırlar; her girişte yeniden ayarlamanızı önler.',
  zorunlu: false
}, {
  tur: 'Ölçüm — çerez kullanılmıyor',
  sure: '—',
  ornek: 'Sayfa görüntüleme sayısı, giriş yapılan sayfa, ülke düzeyinde konum',
  aciklama: 'Hangi sayfaların işe yaradığını anlamak için Cloudflare Web Analytics kullanıyorum. Bu araç çerez yazmaz, IP adresinizi kaydetmez, parmak izi çıkarmaz ve sizi siteler arasında izlemez; yalnız toplu sayı üretir. Kişisel veri işlemediği için onaya bağlı değildir.',
  zorunlu: true
}];
function LegalDoc({
  children,
  updated
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "lg",
    style: {
      maxWidth: '78ch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)',
      paddingBottom: 'var(--space-5)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 14
  }), "Son g\xFCncelleme: ", updated), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)'
    }
  }, children));
}
function LegalH({
  children
}) {
  return /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-3)',
      marginTop: 'var(--space-3)'
    }
  }, children);
}
function LegalP({
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body)',
      color: 'var(--text-body)',
      lineHeight: 'var(--leading-relaxed)',
      textWrap: 'pretty'
    }
  }, children);
}
function LegalList({
  items,
  ordered
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, items.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 20,
      textAlign: 'right',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--brass-600)',
      fontFamily: ordered ? 'var(--font-mono)' : 'inherit',
      paddingTop: 1
    }
  }, ordered ? i + 1 + '.' : '—'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, t))));
}
function LegalScreen({
  go,
  doc,
  setDoc
}) {
  const [durum, setDurum] = React.useState(null);
  React.useEffect(() => {
    const oku = () => {
      try {
        setDurum(localStorage.getItem('uy-cerez'));
      } catch (e) {
        setDurum(null);
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
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "HUKUK\u0130 B\u0130LG\u0130LEND\u0130RME"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-2)',
      letterSpacing: 'var(--tracking-display)',
      marginTop: 'var(--space-3)'
    }
  }, doc === 'kvkk' ? 'KVKK Aydınlatma Metni' : 'Çerez Politikası'), /*#__PURE__*/React.createElement(Tabs, {
    style: {
      margin: 'var(--space-6) 0 var(--space-8)'
    },
    value: doc,
    onChange: setDoc,
    items: [{
      value: 'kvkk',
      label: 'Aydınlatma Metni',
      icon: 'shield-check'
    }, {
      value: 'cerez',
      label: 'Çerez Politikası',
      icon: 'cookie'
    }]
  }), doc === 'kvkk' ? /*#__PURE__*/React.createElement(LegalDoc, {
    updated: "10 A\u011Fustos 2026"
  }, /*#__PURE__*/React.createElement(LegalP, null, "Bu metin, 6698 say\u0131l\u0131 Ki\u015Fisel Verilerin Korunmas\u0131 Kanunu'nun 10. maddesi uyar\u0131nca, veri sorumlusu olarak", /*#__PURE__*/React.createElement("strong", null, " Av. Umut Y\xFCcel"), " (Antalya Barosu Sicil No ", window.BURO.baroSicil, ") taraf\u0131ndan haz\u0131rlanm\u0131\u015Ft\u0131r. Bu web sitesini ve mobil uygulamay\u0131 kullan\u0131rken hangi verilerinizin, neden ve ne kadar s\xFCreyle i\u015Flendi\u011Fini a\xE7\u0131klar."), /*#__PURE__*/React.createElement(LegalH, null, "1. Veri sorumlusu"), /*#__PURE__*/React.createElement(LegalP, null, "Av. Umut Y\xFCcel \xB7 ", window.BURO.adresKisa, " \xB7 Tel ", window.BURO.tel, " \xB7 E-posta ", window.BURO.mail, " \xB7 KEP ", window.BURO.kep), /*#__PURE__*/React.createElement(LegalH, null, "2. Hangi veriler, hangi ama\xE7la i\u015Flenir?"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '150px 1.2fr 1.2fr',
      gap: 0,
      background: 'var(--surface-sunken)',
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "KATEGOR\u0130"), /*#__PURE__*/React.createElement("span", null, "VER\u0130"), /*#__PURE__*/React.createElement("span", null, "AMA\xC7")), KVKK_TABLO.map(([k, v, a], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'grid',
      gridTemplateColumns: '150px 1.2fr 1.2fr',
      gap: 'var(--space-4)',
      padding: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)',
      fontSize: 'var(--text-body-sm)',
      background: i % 2 ? 'var(--paper-1)' : 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)',
      lineHeight: 'var(--leading-normal)'
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-normal)'
    }
  }, a)))), /*#__PURE__*/React.createElement(LegalH, null, "3. \u0130\u015Flemenin hukuki sebebi"), /*#__PURE__*/React.createElement(LegalList, {
    items: ['Avukatlık sözleşmesinin kurulması ve ifası (KVKK m.5/2-c)', 'Avukatlık Kanunu, Vergi Usul Kanunu ve Türk Ticaret Kanunu\'ndan doğan saklama ve bildirim yükümlülükleri (m.5/2-a ve 5/2-ç)', 'Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması (m.5/2-e) — dava dosyasındaki özel nitelikli veriler bu sebebe dayanır (m.6/3)', 'Zorunlu olmayan çerezler ve tanıtım iletileri için açık rızanız (m.5/1)']
  }), /*#__PURE__*/React.createElement(LegalH, null, "4. Verileriniz kimlerle payla\u015F\u0131l\u0131r?"), /*#__PURE__*/React.createElement(LegalP, null, "Yaln\u0131zca i\u015Fin gere\u011Fi kadar ve yaln\u0131zca \u015Fu taraflarla:"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1.3fr 108px',
      background: 'var(--surface-sunken)',
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "ALICI"), /*#__PURE__*/React.createElement("span", null, "NEDEN"), /*#__PURE__*/React.createElement("span", null, "VER\u0130 NEREDE")), ALICILAR.map(([alici, neden, yer], i) => /*#__PURE__*/React.createElement("div", {
    key: alici,
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1.3fr 108px',
      gap: 'var(--space-4)',
      padding: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)',
      fontSize: 'var(--text-body-sm)',
      background: i % 2 ? 'var(--paper-1)' : 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, alici), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-normal)'
    }
  }, neden), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      color: yer === 'Türkiye' ? 'var(--status-success-fg)' : yer === 'AB' ? 'var(--status-info-fg)' : 'var(--status-pending-fg)'
    }
  }, yer)))), /*#__PURE__*/React.createElement(LegalP, null, "Verileriniz pazarlama amac\u0131yla hi\xE7bir \xFC\xE7\xFCnc\xFC ki\u015Fiye sat\u0131lmaz veya devredilmez. Yurt d\u0131\u015F\u0131na aktar\u0131m, yaln\u0131z kullan\u0131lan bar\u0131nd\u0131rma/e-posta altyap\u0131s\u0131n\u0131n sunucular\u0131n\u0131n yurt d\u0131\u015F\u0131nda olmas\u0131 h\xE2linde ve KVKK m.9'daki \u015Fartlarla ger\xE7ekle\u015Fir."), /*#__PURE__*/React.createElement(LegalH, null, "5. Yurt d\u0131\u015F\u0131na aktar\u0131m"), /*#__PURE__*/React.createElement(LegalP, null, "Tabloda T\xFCrkiye d\u0131\u015F\u0131nda i\u015Faretlenen hizmetler \u015Funlard\u0131r: b\xFCro e-postas\u0131 ", /*#__PURE__*/React.createElement("strong", null, "Gmail"), " \xFCzerinden y\xFCr\xFCr; web sitesi ve portal ", /*#__PURE__*/React.createElement("strong", null, "Cloudflare Pages"), " \xFCzerinde bar\u0131nd\u0131r\u0131l\u0131r; ziyaret istatisti\u011Fi", /*#__PURE__*/React.createElement("strong", null, " Cloudflare Web Analytics"), " ile isimsiz olarak say\u0131l\u0131r; portaldeki yapay zek\xE2 \xF6n de\u011Ferlendirmesi", /*#__PURE__*/React.createElement("strong", null, " Anthropic"), " altyap\u0131s\u0131n\u0131 kullan\u0131r. Bu aktar\u0131mlar KVKK m.9 kapsam\u0131nda, a\xE7\u0131k r\u0131zan\u0131za ve/veya s\xF6zle\u015Fmenin ifas\u0131 i\xE7in zorunlu olmas\u0131na dayan\u0131r. Dosyan\u0131za ili\u015Fkin belgeleri yurt d\u0131\u015F\u0131 hizmet kullan\u0131lmadan iletmek isterseniz KEP adresime (", window.BURO.kep, ") g\xF6nderebilir veya b\xFCroya elden teslim edebilirsiniz \u2014 bu yol her zaman a\xE7\u0131kt\u0131r."), /*#__PURE__*/React.createElement(LegalH, null, "6. Yapay zek\xE2 destekli \xF6n de\u011Ferlendirme"), /*#__PURE__*/React.createElement(LegalP, null, "Portal \xFCzerinden iletti\u011Finiz soru ve belgeler, size daha h\u0131zl\u0131 d\xF6n\xFC\u015F yapabilmek i\xE7in yapay zek\xE2 destekli bir \xF6n de\u011Ferlendirmeden ge\xE7ebilir. Bu de\u011Ferlendirme ", /*#__PURE__*/React.createElement("strong", null, "hukuki g\xF6r\xFC\u015F de\u011Fildir"), ", her zaman \"\xD6n De\u011Ferlendirme\" olarak i\u015Faretlenir ve taraf\u0131mdan teyit edilmeden sonu\xE7 do\u011Furmaz. Bu i\u015Fleme onay vermek istemezseniz sorunuzu do\u011Frudan telefon, WhatsApp veya e-posta ile iletmeniz yeterlidir. \xD6n de\u011Ferlendirme \xE7\u0131kt\u0131lar\u0131 dosyan\u0131zla birlikte saklan\u0131r; sorunuz ve belgeniz model e\u011Fitimi i\xE7in kullan\u0131lmaz ve sa\u011Flay\u0131c\u0131da kal\u0131c\u0131 olarak saklanmaz."), /*#__PURE__*/React.createElement(LegalH, null, "7. Saklama s\xFCresi"), /*#__PURE__*/React.createElement(LegalList, {
    items: ['Dosya ve vekâlet evrakı: Avukatlık Kanunu m.39 uyarınca işin bitiminden itibaren 3 yıl; dava zamanaşımı daha uzunsa o süre boyunca', 'Ticari defter ve mali kayıtlar: 10 yıl (TTK m.82), vergisel kayıtlar 5 yıl (VUK m.253)', 'Randevu kayıtları: randevu tarihinden itibaren 2 yıl', 'Portal giriş ve işlem kayıtları: 2 yıl', 'Zorunlu olmayan çerezler: tabloda belirtilen süreler; rızanızı geri aldığınızda derhal silinir']
  }), /*#__PURE__*/React.createElement(LegalP, null, "S\xFCre sonunda veriler silinir, yok edilir veya anonim h\xE2le getirilir."), /*#__PURE__*/React.createElement(LegalH, null, "8. Veri g\xFCvenli\u011Fi"), /*#__PURE__*/React.createElement(LegalP, null, "Portal eri\u015Fimi tek kullan\u0131ml\u0131k kod ile do\u011Frulan\u0131r; belgeler \u015Fifreli olarak saklan\u0131r ve yaln\u0131z siz ile b\xFCro g\xF6r\xFCnt\xFCleyebilir. Kart bilgileri hi\xE7bir a\u015Famada b\xFCroda tutulmaz. Site ve portal HTTPS \xFCzerinden yay\u0131nlan\u0131r. Avukat\u0131n s\u0131r saklama y\xFCk\xFCml\xFCl\xFC\u011F\xFC (Avukatl\u0131k Kanunu m.36) KVKK'dan ba\u011F\u0131ms\u0131z olarak ayr\u0131ca ge\xE7erlidir; bu y\xFCk\xFCml\xFCl\xFCk vek\xE2let ili\u015Fkisi sona erdikten sonra da devam eder."), /*#__PURE__*/React.createElement(LegalH, null, "9. Haklar\u0131n\u0131z"), /*#__PURE__*/React.createElement(LegalP, null, "KVKK m.11 uyar\u0131nca \u015Fu haklara sahipsiniz:"), /*#__PURE__*/React.createElement(LegalList, {
    ordered: true,
    items: KVKK_HAKLAR
  }), /*#__PURE__*/React.createElement(LegalP, null, "Taleplerinizi yaz\u0131l\u0131 olarak b\xFCro adresine, ", window.BURO.mail, " adresine ya da KEP adresime iletebilirsiniz. Ba\u015Fvurunuz en ge\xE7 30 g\xFCn i\xE7inde \xFCcretsiz olarak yan\u0131tlan\u0131r. Yan\u0131ttan memnun kalmazsan\u0131z Ki\u015Fisel Verileri Koruma Kurulu'na \u015Fik\xE2yette bulunabilirsiniz.")) : /*#__PURE__*/React.createElement(LegalDoc, {
    updated: "10 A\u011Fustos 2026"
  }, /*#__PURE__*/React.createElement(LegalP, null, "\xC7erez, bir web sitesini ziyaret etti\u011Finizde taray\u0131c\u0131n\u0131za kaydedilen k\xFC\xE7\xFCk bir metin dosyas\u0131d\u0131r. Bu sitede ve mobil uygulamada \xE7erezleri yaln\u0131z iki ama\xE7la kullan\u0131yorum: oturumunuzu a\xE7\u0131k tutmak ve tercihlerinizi hat\u0131rlamak. Ziyaret istatisti\u011Fi i\xE7in kulland\u0131\u011F\u0131m ara\xE7 hi\xE7 \xE7erez yazmaz. Reklam \xE7erezi, sosyal medya piksel kodu ve ziyaret\xE7ileri siteler aras\u0131 izleyen \xFC\xE7\xFCnc\xFC taraf takip kodu kullan\u0131lmaz."), /*#__PURE__*/React.createElement(LegalH, null, "Kullan\u0131lan \xE7erezler"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, COOKIES.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.tur,
    tone: "flat",
    padding: "sm"
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
      color: 'var(--text-heading)',
      flex: 1
    }
  }, c.tur), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      color: c.zorunlu ? 'var(--status-info-fg)' : 'var(--status-success-fg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.zorunlu ? 'lock' : 'check',
    size: 13
  }), c.zorunlu ? 'Zorunlu' : 'Rızaya bağlı'), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)'
    }
  }, c.sure)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-2)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, c.aciklama), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)',
      marginTop: 6
    }
  }, "\xD6rnek: ", c.ornek)))), /*#__PURE__*/React.createElement(Card, {
    tone: "flat",
    padding: "sm",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: durum === 'tumu' ? 'circle-check-big' : durum === 'zorunlu' ? 'shield-check' : 'circle-help',
    size: 18,
    color: durum === 'tumu' ? 'var(--status-success-fg)' : 'var(--text-muted)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, durum === 'tumu' ? 'Şu anki tercihiniz: işlevsel çerezlere izin verdiniz' : durum === 'zorunlu' ? 'Şu anki tercihiniz: yalnız zorunlu çerezler' : 'Henüz bir tercih belirtmediniz'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, durum === 'tumu' ? 'Tercihleriniz tarayıcınızda hatırlanıyor.' : 'Tercihleriniz hatırlanmıyor; her girişte yeniden ayarlamanız gerekir.'))), /*#__PURE__*/React.createElement(LegalH, null, "\xC7erezleri nas\u0131l y\xF6netirsiniz?"), /*#__PURE__*/React.createElement(LegalP, null, "Siteye ilk giri\u015Finizde \xE7\u0131kan bandda \"Yaln\u0131z zorunlu\" veya \"T\xFCm\xFCn\xFC kabul et\" se\xE7ebilirsiniz. Karar\u0131n\u0131z\u0131 daha sonra a\u015Fa\u011F\u0131daki d\xFC\u011Fmeyle de\u011Fi\u015Ftirebilirsiniz. Ayr\u0131ca taray\u0131c\u0131n\u0131z\u0131n ayarlar\u0131ndan t\xFCm \xE7erezleri silebilir ya da engelleyebilirsiniz \u2014 bu durumda portal oturumu a\xE7\u0131k kalmayaca\u011F\u0131 i\xE7in her sayfada yeniden giri\u015F yapman\u0131z gerekir."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "cookie",
    style: {
      alignSelf: 'flex-start'
    },
    onClick: () => {
      try {
        localStorage.removeItem('uy-cerez');
      } catch (e) {}
      window.UYAnaliz && window.UYAnaliz.temizle();
      window.dispatchEvent(new Event('uy-cerez-sifirla'));
    }
  }, "\xC7erez tercihimi yeniden sor"), /*#__PURE__*/React.createElement(LegalH, null, "Kay\u0131t tutulan veriler"), /*#__PURE__*/React.createElement(LegalP, null, "\xD6l\xE7\xFCm arac\u0131 toplu ve isimsiz say\u0131lar \xFCretir; IP adresiniz kaydedilmez, kim oldu\u011Funuzu tan\u0131mlamaz, portaldeki dosya i\xE7eri\u011Finize eri\u015Fmez. Portal giri\u015F kay\u0131tlar\u0131 (IP, tarih) g\xFCvenlik amac\u0131yla ayr\u0131ca 2 y\u0131l saklan\u0131r. Ayr\u0131nt\u0131 i\xE7in", /*#__PURE__*/React.createElement("strong", null, " KVKK Ayd\u0131nlatma Metni"), "'ne bakabilirsiniz.")));
}
Object.assign(window, {
  LegalScreen
});
})();