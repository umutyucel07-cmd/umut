(function(){
const A = f => window.UY_ASSETS && window.UY_ASSETS[f] || (window.ASSET_BASE || '../../assets') + '/' + f;
const {
  Button,
  Card,
  Badge,
  Tag,
  Icon,
  Avatar,
  Input
} = window.LexaHukukDesignSystem_93e85e;
const ARTICLES = [{
  id: 1,
  area: 'İş Hukuku',
  title: 'İhtarname geldiğinde ilk günler: ne yapmalı, ne yapmamalı?',
  excerpt: 'İhtarnamede yazan süre, tebliğ tarihinden itibaren işlemeye başlar. Süreyi kaçırmamak için önce zarfı ve tebliğ şerhini saklamak gerekir.',
  date: '2 Nisan 2026',
  read: '6 dk',
  body: ['İhtarname, karşı tarafın sizden bir şey talep ettiğini ve bunu yazılı olarak kayda geçirdiğini gösterir. Kanunda "ihtarnameye şu kadar günde cevap verilir" diye genel bir süre yoktur; süre, ihtarnamenin kendi içinde yazan süredir ve çoğu zaman 7 ya da 15 gün olarak belirtilir. Bu süre, ihtarnamenin size usulüne uygun tebliğ edildiği günü saymayarak ertesi gün işlemeye başlar.', 'Cevap vermemek her zaman aleyhinize sonuç doğurmaz; bazı dosyalarda sessiz kalmak daha doğrudur. Ancak bu, dosyanın niteliğine göre değişir. Bu yüzden ilk yapılacak şey cevap yazmak değil, belgeyi bir avukata göstermektir.'],
  hatalar: [['Zarfı ve tebliğ şerhini atmak', 'Tebliğ tarihine itiraz etmeniz gerekirse en güçlü belge zarfın üzerindeki şerhtir. Zarfı saklayın, fotoğrafını çekin.'], ['Karşı tarafla yazışmayı sürdürmek', 'İyi niyetle atılan mesajlar ileride aleyhe delil olarak sunulabiliyor. Yazışmayı durdurun, elinizdekileri toplayın.'], ['Süreyi gözle hesaplamak', 'Son gün hafta sonuna ya da resmî tatile denk gelirse süre ilk iş gününde biter. Adli tatil de süreleri etkileyebilir; hesabı takvimle yapın.']],
  alinti: 'Cevap vermek de vermemek de bir karardır. Kararı belgeyi görmeden vermeyin.'
}, {
  id: 2,
  area: 'İş Hukuku',
  title: 'Kıdem tazminatı hesabında dikkat edilen kalemler',
  excerpt: 'Hesap yalnız çıplak ücretle yapılmaz. Yol, yemek ve düzenli ödenen ikramiyeler de hesaba girer; buna giydirilmiş brüt ücret denir.',
  date: '18 Mart 2026',
  read: '7 dk',
  body: ['Kıdem tazminatı, çalışılan her tam yıl için 30 günlük giydirilmiş brüt ücret üzerinden hesaplanır (1475 sayılı Kanun m.14, yürürlükte kalan hüküm). "Giydirilmiş" ifadesi, hesabın yalnız bordroda görünen çıplak ücretle yapılmadığı anlamına gelir: işverenin süreklilik arz edecek biçimde sağladığı yol yardımı, yemek, konut, yakıt ve düzenli ikramiyeler de ücrete eklenir.', 'İki nokta çoğu dosyada gözden kaçıyor. Birincisi, kıdem tazminatına kanunla belirlenmiş bir tavan uygulanır ve bu tavan altı ayda bir güncellenir; hesabın yapıldığı tarihteki tavan esas alınır. İkincisi, ihbar tazminatı ve yıllık izin alacağı kıdem tazminatından ayrı kalemlerdir — biri ödendi diye diğeri kapanmış olmaz.'],
  hatalar: [['Yalnız bordrodaki ücrete bakmak', 'Yol ve yemek yardımı düzenli ödeniyorsa hesaba girer. Banka hareketlerinizi ve varsa yemek kartı kayıtlarını saklayın.'], ['Elden ödemeyi belgesiz bırakmak', 'Ücretin bir kısmı elden ödeniyorsa bunun ispatı size düşer. Tanık, mesaj ve hesap hareketleri birlikte değerlendirilir.'], ['İbraname imzalarken okumamak', 'İşten ayrılırken imzalatılan belgeler bazı alacakları kapatabilir. İmzalamadan önce metni okuyun, bir kopyasını isteyin.']],
  alinti: 'Bilirkişi raporu, kendisine sunulan belgeler kadar isabetlidir. Belge toplamak hesabın yarısıdır.'
}, {
  id: 3,
  area: 'Aile Hukuku',
  title: 'Anlaşmalı boşanmada protokolün eksik kalan maddeleri',
  excerpt: 'Taraflarca hazırlanan protokoller çoğu zaman nafaka artışı ve kişisel ilişki düzenlemesi bakımından yetersiz kalıyor.',
  date: '5 Mart 2026',
  read: '6 dk',
  body: ['Anlaşmalı boşanma için evliliğin en az bir yıl sürmüş olması, tarafların birlikte başvurması ve hâkimin tarafları bizzat dinleyerek iradelerini serbestçe açıkladığına kanaat getirmesi gerekir (TMK m.166/3). Hâkim, protokolü uygun bulmazsa değişiklik isteyebilir; taraflar kabul etmezse anlaşmalı boşanma gerçekleşmez.', 'Protokolün asıl işlevi boşanmayı sağlamak değil, boşanmadan sonraki yılları düzenlemektir. Uygulamada en çok sorun çıkaran üç konu şudur: nafakanın her yıl nasıl artacağı, çocukla kişisel ilişkinin tatil ve bayramlarda nasıl kurulacağı, ve ortak malların devir masraflarının kime ait olacağı. Bunlar yazılmadığında, boşanma bittikten sonra yeni davalar açılıyor.'],
  hatalar: [['Nafaka artış oranını yazmamak', 'Artış ölçütü belirtilmezse her yıl yeniden anlaşmak ya da dava açmak gerekir. Ölçütü ve uygulanma zamanını açıkça yazın.'], ['Kişisel ilişkiyi genel ifadelerle geçmek', '"Uygun zamanlarda görüşür" gibi ifadeler uyuşmazlığı büyütür. Gün, saat, teslim yeri ve tatil düzeni yazılmalıdır.'], ['Mal paylaşımını ayrı bırakmak', 'Protokolde çözülmeyen mal rejimi tasfiyesi ayrı bir dava konusu olur; süreç yıllara yayılabilir.']],
  alinti: 'İyi protokol, boşanmayı değil boşanmadan sonraki on yılı düzenler.'
}, {
  id: 4,
  area: 'Gayrimenkul',
  title: 'Kira tespit davasında emsal araştırması nasıl yapılır?',
  excerpt: 'Beş yıllık dönem sonunda artış oranı sözleşmeyle değil, emsal kira bedeli ve hakkaniyet ölçütüyle belirlenir.',
  date: '20 Şubat 2026',
  read: '8 dk',
  body: ['Kira artışı kural olarak sözleşmede yazan orana ve tüketici fiyat endeksinin on iki aylık ortalamasına bağlıdır; bu oranı aşan artış geçersizdir (TBK m.344). Beş yıllık dönem sonunda ise durum değişir: artık endeks tek başına ölçüt olmaz, hâkim emsal kira bedellerini ve taşınmazın durumunu gözeterek hakkaniyete uygun bir bedel belirler.', 'Emsal araştırması bu davanın kalbidir. Aynı bölgede, benzer büyüklükte, benzer yaşta ve benzer nitelikte taşınmazların güncel kira bedelleri toplanır; bilirkişi de yerinde inceleme yapar. Emsal seçimi tartışmaya açık olduğu için hem kiracı hem kiraya veren kendi emsallerini sunar. Belirlenen bedele genellikle taşınmazın eskimesi ve kiracının uzun süreli oluşu gözetilerek bir indirim uygulanır.'],
  hatalar: [['İlan sitelerindeki fiyatları emsal saymak', 'İlan bedeli, fiilen sözleşme kurulan bedel değildir. Mümkünse gerçekleşmiş kira sözleşmelerini toplayın.'], ['Farklı nitelikte taşınmazı emsal göstermek', 'Aynı sokakta olması yetmez; kat, cephe, yaş, asansör ve site içi olup olmaması sonucu değiştirir.'], ['Dava zamanını kaçırmak', 'Yeni dönem başlangıcından belirli bir süre önce ihtarname gönderilmesi ya da davanın zamanında açılması sonucu etkiler; takvimi baştan kurun.']],
  alinti: 'Kira tespit davası bir pazarlık değil, belgeyle yapılan bir kıyaslamadır.'
}, {
  id: 5,
  area: 'Tazminat Hukuku',
  title: 'Trafik kazası sonrası tazminat: ilk hafta ne toplanmalı?',
  excerpt: 'Kaza tespit tutanağı, hastane kayıtları ve sigorta başvurusu. Eksik belge dosyayı aylarca geciktiriyor.',
  date: '21 Şubat 2026',
  read: '7 dk',
  body: ['Bedensel zarara yol açan trafik kazalarında ilk günlerde toplanan belgeler, dosyanın bütün seyrini belirler. Kaza tespit tutanağı, varsa alkol raporu, ambulans ve acil servis kayıtları, sonraki tüm doktor raporları ve iş göremezlik belgeleri bir arada tutulmalıdır. Tedavi devam ederken alınan her rapor, kalıcı sakatlık oranının belirlenmesinde kullanılır.', 'Zorunlu trafik sigortası bulunan araçlar için, dava açmadan önce sigorta şirketine yazılı başvuru yapılması gerekir. Şirketin yanıt vermesi için kanunda öngörülen süre beklendikten sonra dava ya da Sigorta Tahkim Komisyonu yolu açılır. Sıralamayı bozmak, açılan davanın usulden reddine yol açabilir.'],
  hatalar: [['Tedavi bitmeden dosyayı kapatmak', 'Kalıcı sakatlık oranı ancak tedavi tamamlandığında netleşir. Erken yapılan uzlaşma, sonradan çıkan zararı kapsamaz.'], ['Sigortaya başvurmadan dava açmak', 'Doğrudan dava açılması usul yönünden sorun yaratır. Yazılı başvuruyu ve tebliğ belgesini saklayın.'], ['Kazadan sonra araç onarımını belgesiz yapmak', 'Maddi zarar için fatura ve hasar fotoğrafları gerekir. Onarım öncesi fotoğraf çekmeyi ihmal etmeyin.']],
  alinti: 'Bu dosyalarda kaybedilen şey çoğu zaman hak değil, belgedir.'
}, {
  id: 6,
  area: 'İcra ve İflas',
  title: 'Ödeme emrine itiraz süresini kaçırdıysanız',
  excerpt: 'Gecikmiş itiraz belirli hallerde mümkündür; ancak engelin ortadan kalkmasından sonra çok kısa bir süre içinde başvurulması gerekir.',
  date: '8 Şubat 2026',
  read: '6 dk',
  body: ['İlamsız icra takibinde ödeme emrine itiraz süresi, tebliğden itibaren yedi gündür (İİK m.62). Bu süre geçtiğinde takip kesinleşir ve haciz aşamasına geçilir. Ancak borçlu, kusuru olmaksızın bir engel nedeniyle süresinde itiraz edememişse gecikmiş itiraz yolu vardır (İİK m.65): engelin ortadan kalkmasından itibaren üç gün içinde icra mahkemesine başvurulur ve engel belgelenir.', 'Gecikmiş itiraz her gecikmeyi mazur göstermez. Hastalık, tutukluluk, yurt dışında bulunma gibi somut ve belgelenebilir engeller kabul edilir; "fark etmedim" ya da "meşguldüm" kabul edilmez. Ayrıca borcun tamamen ödenmiş olması ya da zamanaşımına uğraması gibi durumlarda, süreden bağımsız olarak icranın geri bırakılması istenebilir.'],
  hatalar: [['Süreyi kaçırdım diye hiç başvurmamak', 'Gecikmiş itiraz ve icranın geri bırakılması ayrı yollardır. Dosyayı bir kez inceletmeden vazgeçmeyin.'], ['Engeli belgelemeden başvurmak', 'Mahkeme somut belge ister: hastane kaydı, giriş-çıkış kaydı, tutukluluk belgesi. Sözlü açıklama yeterli olmaz.'], ['Haciz gelene kadar beklemek', 'Takip kesinleştikten sonra seçenekler daralır. Tebligatı aldığınız gün harekete geçmek en ucuz yoldur.']],
  alinti: 'İcra dosyasında en pahalı gün, hiçbir şey yapılmayan gündür.'
}, {
  id: 7,
  area: 'Vergi Hukuku',
  title: 'Vergi ceza ihbarnamesi geldi: uzlaşma mı, dava mı?',
  excerpt: 'Otuz günlük süre içinde birden fazla yol var. Hangisinin uygun olduğu tarhiyatın niteliğine ve tutarına göre değişir.',
  date: '30 Ocak 2026',
  read: '8 dk',
  body: ['Vergi ceza ihbarnamesinin tebliğinden itibaren otuz gün içinde karar vermeniz gerekir. Bu süre içinde üç ana yol vardır: uzlaşma talebinde bulunmak, cezada indirim talep etmek (VUK m.376) veya doğrudan vergi mahkemesinde iptal davası açmak. Süre geçtiğinde tarhiyat kesinleşir ve tahsilat süreci başlar.', 'Uzlaşma, vergi ve cezanın bir kısmının kaldırılması yönünde idareyle anlaşmayı sağlar; sonuç kesindir ve uzlaşılan kısım için dava açılamaz. Dava yolu ise daha uzundur ama hukuka aykırılık iddianız güçlüyse tarhiyatın tamamının kaldırılmasını mümkün kılar. Uzlaşma talebi süreyi durdurduğu için, uzlaşma sağlanamazsa dava açma hakkınız korunur — bu nedenle çoğu dosyada önce uzlaşma denenir.'],
  hatalar: [['Otuz günü beklemeye almak', 'Süre hak düşürücüdür. İhbarnameyi aldığınız gün yol haritanızı belirleyin.'], ['Uzlaşma ile indirimi karıştırmak', 'İkisi ayrı kurumdur ve sonuçları farklıdır. Biri seçildiğinde diğerinden yararlanma imkânı kısıtlanabilir.'], ['Tebliğ usulünü sorgulamamak', 'İhbarnamenin usulüne uygun tebliğ edilmemesi, süreyi başlatmaz. Tebligat evrakını inceletin.']],
  alinti: 'Vergi uyuşmazlığında ilk otuz gün, dosyanın hangi yoldan yürüyeceğini belirler.'
}, {
  id: 8,
  area: 'Ceza Hukuku',
  title: 'İfadeye çağrıldınız: müdafi olmadan ifade vermek',
  excerpt: 'Şüpheli sıfatıyla ifade, tanık ifadesinden farklıdır. İlk ifade dosyanın tamamını etkileyebilir.',
  date: '15 Ocak 2026',
  read: '7 dk',
  body: ['Şüpheli veya sanık olarak ifadeye çağrıldığınızda iki temel hakkınız vardır: müdafi yardımından yararlanmak ve susma hakkını kullanmak (CMK m.147). Müdafi talebiniz kayda geçirilir ve müdafi gelmeden ifade alınamaz; masrafını karşılayamıyorsanız barodan ücretsiz müdafi görevlendirilmesini isteyebilirsiniz. Bu haklar size hatırlatılmak zorundadır; hatırlatılmadan alınan ifade hukuka aykırı hâle gelebilir.', 'İlk ifade, dosyanın geri kalanının okunma biçimini belirler. İyi niyetle ve savunma amacıyla söylenen ayrıntılar, sonradan ifadede çelişki olarak değerlendirilebilir. Susma hakkını kullanmak aleyhe yorumlanamaz; dosyayı görmeden konuşmamak çoğu zaman en doğru tercihtir.'],
  hatalar: [['"Anlatıp kurtulurum" diye düşünmek', 'Dosyada ne olduğunu bilmeden verilen ifade, sonradan düzeltilmesi güç bir metne dönüşür.'], ['Müdafi hakkını kullanmamak', 'Müdafi talebi ifadeyi geciktirir ama dosyayı görme imkânı sağlar. Bu gecikme aleyhinize sonuç doğurmaz.'], ['İfade tutanağını okumadan imzalamak', 'Tutanak sizin cümlelerinizi birebir yazmayabilir. Okumadan, düzeltme talep etmeden imzalamayın.']],
  alinti: 'Susma hakkı bir suçlama değil, bir savunma aracıdır.'
}];
const AREA_FILTERS = ['Tümü', 'İcra ve İflas', 'İş Hukuku', 'Aile Hukuku', 'Gayrimenkul', 'Tazminat Hukuku', 'Vergi Hukuku', 'Ceza Hukuku'];
function ArticleDetail({
  item,
  back,
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-sunken)',
      padding: 'var(--space-12) var(--gutter-page-lg) var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "arrow-left",
    onClick: back,
    style: {
      marginLeft: -12
    }
  }, "Yaz\u0131lar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, item.area), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)'
    }
  }, item.date, " \xB7 ", item.read)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-2)',
      letterSpacing: 'var(--tracking-display)',
      marginTop: 'var(--space-4)',
      lineHeight: 1.15,
      textWrap: 'balance'
    }
  }, item.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Umut Y\xFCcel",
    tone: "brass",
    src: A('portre-avukat-kare.jpg')
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, "Av. Umut Y\xFCcel"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-faint)'
    }
  }, "Antalya Barosu \xB7 Sicil No 6448"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-12) var(--gutter-page-lg) var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-lg)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-heading)',
      textWrap: 'pretty'
    }
  }, item.excerpt), item.body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, p)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-2)',
      marginTop: 'var(--space-4)'
    }
  }, "S\u0131k yap\u0131lan \xFC\xE7 hata"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, item.hatalar.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--brass-600)',
      width: 22,
      flex: '0 0 auto'
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body)',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      marginTop: 4,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, d))))), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 'var(--space-4) 0',
      paddingLeft: 'var(--space-6)',
      borderLeft: '2px solid var(--brass-500)',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-title-3)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-heading)'
    }
  }, item.alinti), /*#__PURE__*/React.createElement(Card, {
    tone: "flat",
    padding: "sm",
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
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
  }, "Bu yaz\u0131 genel bilgilendirme amac\u0131yla haz\u0131rlanm\u0131\u015Ft\u0131r; somut olay\u0131n\u0131za uygulanacak hukuk, belgelerinize ve tarihlere g\xF6re de\u011Fi\u015Fir. Yaz\u0131n\u0131n tarihinden sonra mevzuat de\u011Fi\u015Fmi\u015F olabilir. Kendi dosyan\u0131z i\xE7in hukuki g\xF6r\xFC\u015F almadan i\u015Flem yapmay\u0131n.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      background: 'var(--ink-800)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-8)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-2)',
      color: 'var(--paper-1)'
    }
  }, "Bu konu sizin dosyan\u0131za da uyuyor mu?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-100)',
      marginTop: 6
    }
  }, "15 dakikal\u0131k \xF6n g\xF6r\xFC\u015Fmede belgelerinizi birlikte de\u011Ferlendirelim.")), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    icon: "calendar-plus",
    onClick: () => go('booking')
  }, "Randevu Al"))));
}
function ArticlesScreen({
  go
}) {
  const [open, setOpen] = React.useState(null);
  const [filter, setFilter] = React.useState('Tümü');
  const [ara, setAra] = React.useState('');
  if (open) return /*#__PURE__*/React.createElement(ArticleDetail, {
    item: open,
    back: () => {
      setOpen(null);
      window.scrollTo(0, 0);
    },
    go: go
  });
  const q = ara.trim().toLocaleLowerCase('tr-TR');
  const list = ARTICLES.filter(a => (filter === 'Tümü' || a.area === filter) && (!q || (a.title + ' ' + a.excerpt + ' ' + a.area).toLocaleLowerCase('tr-TR').includes(q)));
  const featured = list[0];
  const rest = list.slice(1);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--max-content)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter-page-lg) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "YAZILAR VE ANAL\u0130ZLER",
    title: "S\u0131k kar\u015F\u0131la\u015Ft\u0131\u011F\u0131m\u0131z konular\u0131 yaz\u0131yoruz",
    sub: "Dosyalarda tekrar eden sorulara verdi\u011Fimiz yan\u0131tlar\u0131 burada topluyoruz. Reklam de\u011Fil, bilgilendirme amac\u0131 ta\u015F\u0131r."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, AREA_FILTERS.map(a => /*#__PURE__*/React.createElement(Tag, {
    key: a,
    selected: filter === a,
    onClick: () => setFilter(a)
  }, a)), /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Yaz\u0131larda ara",
    size: "sm",
    value: ara,
    onChange: e => setAra(e.target.value),
    style: {
      marginLeft: 'auto',
      minWidth: 220
    }
  })), !featured ? /*#__PURE__*/React.createElement(Card, {
    tone: "flat",
    padding: "lg",
    style: {
      marginTop: 'var(--space-6)',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }
  }, "Bu filtreye uyan yaz\u0131 yok. Arad\u0131\u011F\u0131n\u0131z konuyu bize yazarsan\u0131z \xFCzerine bir yaz\u0131 haz\u0131rlayabiliriz.") : /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    padding: "none",
    onClick: () => setOpen(featured),
    style: {
      marginTop: 'var(--space-6)',
      display: 'grid',
      gridTemplateColumns: '1.05fr .95fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, featured.area), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-title-1)',
      marginTop: 'var(--space-4)',
      lineHeight: 'var(--leading-snug)',
      textWrap: 'pretty'
    }
  }, featured.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-4)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, featured.excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Umut Y\xFCcel",
    tone: "brass",
    size: "sm",
    src: A('portre-avukat-kare.jpg')
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)'
    }
  }, featured.date, " \xB7 ", featured.read), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      color: 'var(--text-accent)'
    }
  }, "Yaz\u0131y\u0131 oku", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderLeft: '1px solid var(--border-hairline)',
      background: 'var(--paper-1)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A('terazi-cizim.jpg'),
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      display: 'block'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-4)'
    }
  }, rest.map(a => /*#__PURE__*/React.createElement(Card, {
    key: a.id,
    interactive: true,
    padding: "md",
    onClick: () => setOpen(a),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, a.area), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-title-3)',
      lineHeight: 'var(--leading-snug)',
      textWrap: 'pretty'
    }
  }, a.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, a.excerpt), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--text-faint)',
      marginTop: 'auto',
      paddingTop: 'var(--space-2)'
    }
  }, a.date, " \xB7 ", a.read)))));
}
Object.assign(window, {
  ArticlesScreen
});
})();