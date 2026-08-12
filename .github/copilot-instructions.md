# Depo bağlamı — GitHub Copilot için

> Bu dosyanın yeri: `.github/copilot-instructions.md`
> Copilot Chat bu dosyayı bu depoda **kendiliğinden okur**. Her seferinde bağlam anlatmanız gerekmez.

---

## ⚠️ ÖNCE OKU — çakışma önleme

Bu depo, Av. Umut Yücel Hukuk Bürosu'nun daha büyük bir dijital sisteminin parçasıdır. Aynı sistem üzerinde **Claude da çalışır**. İki yapay zekâ aynı yerlere yazarsa hasar sessiz olur: hata vermez, bir şey çalışmayı bırakır.

**Tek doğru kaynak:** `~/.agents/skills/umut-yucel-sistem/SKILL.md`

Bu dosyayla, elinizdeki bir görev belgesiyle, README ile veya eski bir task dosyasıyla çelişirse **SKILL.md geçerlidir** — diğeri eskimiştir.

### Yazma yetkisi

**Copilot'un yazma yetkisi olan tek yer bu depodur.**

Şunlara **dokunma** — Claude'un alanı:

| Yol | Ne var |
|---|---|
| `~/.agents/skills/` | Beceriler, tasarım sistemi, büro ajanları |
| `~/Claude/Scheduled/` | 12 zamanlanmış görev |
| `~/Claude/Artifacts/` | 10 canlı pano |
| `~/05_Bellek_Arsivi/ORTAK-HAFIZA/` | Ortak hafıza konu grafiği |
| `~/05_Bellek_Arsivi/oturum-arsivi/` | Oturum değişiklik kayıtları |

Şunları **hiç açma** — KVKK + Avukatlık Kanunu m.36 meslek sırrı:

- `~/Desktop/HUKUK-AVUKATLIK`
- `~/05_Bellek_Arsivi/MÜVEKKİL DOSYALARI`
- `~/05_Bellek_Arsivi/00_GUVENLIK`

### Bu depoda mutlak yasaklar

| Yasak | Sebep |
|---|---|
| **`git push` yapma** | Push = anında canlı yayın. Kararı insan verir |
| **`git add .` kullanma** | Depo kökünde commit edilmemesi gereken `.zip` ve belge dosyaları var. Dosyalar tek tek eklenir |
| **`index.html`'i biçimlendirme (prettify)** | Sıkışık yapı bilinçli. Bozulursa JSON-LD ve `noscript` blokları gider, site Google dizininden düşer |
| **`js/` altında `varliklar.js` dışındakileri düzenleme** | Diğerleri üretilmiş dosyadır, derleyici gerekir |
| **`site-dagitim/` benzeri eski klasörü buraya kopyalama** | Depo doludur ve yayındadır. "Depo boş" diyen belge eskimiştir |
| **`umut-yucel-avukat-paneli.html` dosyasını depoya ekleme** | Halka açık olur |
| **`unpkg.com` veya başka dış origin ekleme** | Dış kaynak sayısı sıfırdır, sıfır kalır |
| **`npm install`, `npx`, bundler çalıştırma** | Yapı adımı yoktur ve olmamalıdır |

### Bu depo dışında mutlak yasaklar

Bunlar kodla ilgili görünse de canlı hattı kesintiye uğratır:

- **İkinci webhook sunucusu kurma** (Render, Railway, Vercel, yerel). Meta'da uygulama başına tek callback URL vardır; yenisi Cloudflare Worker'ı sessizce düşürür.
- **WhatsApp callback URL'ine dokunma.** Değiştirmek Notion yakalamayı, kişi rehberi filtresini, otomatik teyidi ve Cevap Robotu beslemesini aynı anda susturur — üstelik Meta hata vermez.
- **İkinci otomatik yanıt kaynağı kurma** (Zapier, Business Suite otomasyonu, telefon karşılama mesajı). Aynı kişiye iki mesaj gider.

### Dışa dönük metin yazma

Site içeriği, başlık, açıklama, meta etiketi, sosyal medya metni — **hiçbirini kendiliğinden yazma veya değiştirme.**

Türkiye Barolar Birliği Reklam Yasağı Yönetmeliği bu metinleri sıkı biçimde sınırlar; ihlali kınama, tekerrürde 23.790–237.900 TL para cezasıdır. Denetim Claude tarafındaki `reklam-yasagi-denetcisi` ajanındadır.

Metin değişikliği gerekiyorsa: **öner, uygulama.** Onaylanmış metni size verirler, siz yerleştirirsiniz.

Özellikle şunlar hiç yazılmaz: iş çağrısı ("bize ulaşın", "danışmak için yazın") · hizmet sayımı · ücret, indirim, ücretsiz görüşme · dava sonucu, başarı oranı, müvekkil adı, referans · "uzman", "en iyi", "lider" · ikinci adres/şehir.

**Büro unvanı:** dışa dönük metinde kullanılmaz. Ortalıkta 6 varyant dolaşıyor, baroya kayıtlı ad teyit edilmedi. Yalnız `Av. Umut Yücel — Antalya Barosu, sicil no 6448` yazılır. **Yeni varyant üretilmez.**

---

## Bu depo nedir?

Av. Umut Yücel Hukuk Bürosu'nun (Antalya) **canlı** web sitesi: <https://avumutyucelhukuk.com>

**Cloudflare Pages, depo kökünden yayınlar. `main`'e push = anında yayın.** Aşama (staging) ortamı yoktur. Bu bir hukuk bürosunun müvekkil portalı barındıran sitesidir; bozulması iş kaybıdır.

Site 12.08.2026'da Google dizinine girdi. Bunu sağlayan bloklar aşağıda "zorunlu" olarak işaretlidir — hiçbiri silinmez.

## Yapı

```
index.html          tek sayfa; tüm script'ler defer'li, üç satır içi <script> var
styles.css          tokens/ dosyalarını içeri alır
tokens/*.css        tasarım belirteçleri (renk, tipografi, boşluk, gölge, hareket)
js/*.js             ÜRETİLMİŞ DOSYALAR — components/ klasöründen derlenir, elle düzenlenmez
js/components.jsx   components.js'in JSX kaynağı
js/varliklar.js     görsel eşleme tablosu (window.UY_ASSETS) — js/ altında elle düzenlenebilen TEK dosya
vendor/*.js         React, ReactDOM, Lucide ikon alt kümesi — yerelde barındırılır
assets/*            görseller (.webp + özgün .png/.jpg yedekleri)
sw.js               Service Worker — çevrimdışı önbellek
_headers            güvenlik başlıkları + vendor/ önbellek kuralı
_redirects          Cloudflare Pages yönlendirmeleri
```

## Mimarî — bilinmesi zorunlu üç şey

**1. Yapı adımı (build) yoktur.** `package.json`, `node_modules`, bundler yok ve olmamalı. Tarayıcıya ne gidiyorsa depoda o duruyor. `npm install` veya `npx` çalıştırmayın.

**2. React, JSX derlemesi olmadan çalışır.** `js/*.js` dosyaları önceden derlenmiş `React.createElement` çağrıları içerir. Bir bileşen değişecekse kaynak `js/components.jsx`'tir; ama `js/components.js` elle güncellenemez — derleyici gerektirir. **Bileşen değişikliği isteniyorsa önce sorun.**

**3. Görsel çözümleyicisi dolaylıdır.** Birçok `js/*.js` dosyasının başında şu satır vardır:

```js
const A = f => window.UY_ASSETS && window.UY_ASSETS[f] || (window.ASSET_BASE || '../../assets') + '/' + f;
```

`index.html` `window.ASSET_BASE = 'assets'` atar. `js/varliklar.js` de `window.UY_ASSETS` eşlemesini kurar. Yani bir görselin yolunu değiştirmek için **yalnız `varliklar.js`'i** düzenlemek yeterlidir; bileşen dosyalarına dokunmaya gerek yoktur.

## `index.html`'de bulunması zorunlu

Hiçbiri silinmez, taşınmaz, sarmalaması bozulmaz:

| Kalem | Neden |
|---|---|
| 17 script'te `defer` | Ayrıştırmayı bloklamamak |
| `vendor/react-18.3.1.min.js`, `vendor/react-dom-18.3.1.min.js` | Dış origin yok |
| `vendor/lucide-alt-1.js` (79 ikon) | 88 KB tasarruf |
| `Person` JSON-LD | **Sitenin dizine girmesini sağlayan bloklardan biri** |
| `<noscript>` künye | Googlebot'un gördüğü metin 10 → **170 karakter** |
| Açılış perdesi kapatıcısı `DOMContentLoaded` içinde | Dışındaysa React yüklenmeden perde kalkar → **beyaz ekran** |

Ölçüm: JS **514 KB → 106 KB gzip**. Dış origin sayısı: **0**.

## Şema kısıtı (reklam yasağı)

JSON-LD'de **yalnız `Person`**. Bunlar eklenmez — yerel sonuçlarda çıkmak Yön. m.7/e ihlalidir:

`Attorney` · `LocalBusiness` · `sameAs` · `priceRange` · `aggregateRating` · `review` · `areaServed` · `knowsAbout` · `serviceType` · `addressLocality` · `telephone`

## Diğer değişmez kurallar

- **`async` kullanılmaz, yalnız `defer`.** `defer` çalışma sırasını korur; `async` korumaz ve React'ten önce ReactDOM yüklenirse site açılmaz.
- **Satır içi `<script>` bloklarına `defer` eklenmez.** Üçü de anında çalışmalıdır.
- **`assets/logo.png` silinmez** — `index.html`'de favicon olarak doğrudan kullanılır (`A()` üzerinden değil).
- **`vendor/` dosya adlarında sürüm numarası vardır** (`react-18.3.1.min.js`, `lucide-alt-1.js`). `_headers` bunlara bir yıllık kalıcı önbellek verir. **İçeriği değişecekse dosya adı da değişmelidir**, yoksa ziyaretçiler bir yıl boyunca eski kopyayı kullanır.
- **`sw.js` içindeki `SURUM` sabiti**, önbelleklenen bir dosyanın içeriği değiştiğinde artırılmalıdır. Artırılmazsa geri dönen ziyaretçiler eski dosyayı kullanmaya devam eder.
- **`cloudflareinsights` kaynak dosyaya yazılmaz** — Cloudflare yayında kendisi ekler; yazılırsa iki kez girer.

## Lucide ikonları

`vendor/lucide-alt-1.js`, Lucide v0.462.0'ın **üretilmiş alt kümesidir** — 1500+ ikondan sitede kullanılan 79'unu içerir. Elle düzenlemeyin.

Yeni bir ikon kullanılacaksa alt kümede yoktur; tarayıcı konsoluna şunu yazar:

```
[lucide-alt] ALT KÜMEDE YOK: <ikon-adı> — paketi yeniden üretin
```

Sayfa çökmez, yalnız o ikon boş kalır. Paketin yeniden üretilmesi gerekir; bunu Copilot yapamaz.

## Test

Yapı adımı olmadığı için test = **yerel sunucu + tarayıcı**:

```bash
python3 -m http.server 8080     # sonra http://localhost:8080
```

`index.html`'i çift tıklayarak açmayın — `file://` protokolünde `js/`, `styles.css` ve `assets/` bulunamaz, sayfa boş görünür. Bu bir hata değildir.

Kontrol listesi: açılış perdesi görünüyor mu · menüler geziliyor mu · ikonlar ve görseller çiziliyor mu · konsolda kırmızı hata var mı · Network sekmesinde `unpkg.com`'a istek var mı (**olmamalı**).

## Değişiklik sonrası doğrulama

Her değişiklikten sonra, commit önerisinden **önce** çalıştırın. Hepsi beklenen değeri vermelidir:

```bash
grep -c 'application/ld+json' index.html   # 1
grep -c '<noscript>' index.html            # 1
grep -c 'script defer src' index.html      # 17
grep -c 'unpkg' index.html                 # 0
grep -c 'cloudflareinsights' index.html    # 0
wc -c js/varliklar.js                      # ~619
git status                                 # beklenmeyen dosya var mı
```

Biri tutmuyorsa **commit edilmez** — önce sebep bulunur. Sayı düştüyse bir blok silinmiş demektir.

## Bilinen tuzaklar

| Belirti | Sebep |
|---|---|
| Sayfa boş, konsolda hata yok | `index.html` `file://` ile açıldı. Yerel sunucu kullanın |
| Beyaz ekran, sonra site geliyor | Açılış perdesini kapatan script `DOMContentLoaded` sarmalamasını kaybetmiş |
| `React is not defined` | Script sırası bozulmuş veya `defer` yerine `async` kullanılmış |
| Bir ikon boş kare | Lucide alt kümesinde yok — konsola bakın |
| Değişiklik yayında görünmüyor | Service Worker eski kopyayı sunuyor. `sw.js` içindeki `SURUM` artırılmalı |
| Görsel 404 | `varliklar.js` eşlemesindeki yol ile `assets/` içindeki dosya adı uyuşmuyor |
| Site Google'dan düştü | `index.html`'den JSON-LD veya `noscript` bloğu silinmiş |

## Durdurulmuş görev belgeleri — uygulanmaz

Depoda ve indirilenlerde duran şu belgeler **denetlendi ve durduruldu.** İçlerindeki adımlar uygulanmaz; sebepleri yanlarındaki durdurma belgesinde yazılıdır:

| Belge | Neden durduruldu | Gerekçe dosyası |
|---|---|---|
| `vscode-gorev/GOREVLER.md` | "Depo boş, siteyi yükle" diyor — depo dolu. Uygulansa JS 106 KB → 514 KB, JSON-LD ve `noscript` silinir | `vscode-gorev/00-DURDUR-ONCE-BUNU-OKU.md` |
| `CLAUDE-TAMAMLANDI-ISLEM-LISTESI.md` | Hedef uç yayında değil, yeni uçta HMAC yok, MailChannels ücretsiz yolu kapandı, istenen SPF değişikliği `-all` korumasını zayıflatır | `00-DURDUR-WEBHOOK-GOREVI.md` |
| `FACEBOOK-CROSSPOST-TASK.md` | Yayınlanması reklam yasağını ihlal eden metin içeriyor | — |

Bunlardan birini uygulamanız istenirse: **önce `~/.agents/skills/umut-yucel-sistem/SKILL.md` ile karşılaştırın**, çelişiyorsa uygulamayın ve durumu bildirin.

## Bekleyen iş

`COPILOT-KUNYE-TEK-KAYNAK.md` — künye tek kaynağa bağlama refaktörü.

**Sorun:** `window.BURO.buro` tanımlı ama depoda hiçbir yerde okunmuyor. Künye bilgisi **8 dosyada sabit yazılmış**, `index.html` `<title>` dâhil.

**İş:** künye okumalarını `window.BURO` üzerinden tek kaynağa bağlamak.

**Dikkat:** unvan konusu çözülmemiştir. Refaktörde **yeni varyant üretilmez** — mevcut değer neyse `window.BURO`'ya o yazılır, karar avukata bırakılır.

## Ortak hafıza

Geçmiş kararlar, neyin neden yapıldığı ve neyin **reddedildiği**:
`~/05_Bellek_Arsivi/ORTAK-HAFIZA/` — okuyun, yazmayın.

Bir işin daha önce denenip reddedilip reddedilmediğini merak ederseniz oraya bakın; aynı tuzağa ikinci kez düşmeyi engeller.

---

*Bu dosya `~/.agents/skills/umut-yucel-sistem/SKILL.md` (12.08.2026) canlı durumundan üretilmiştir. Çelişkide SKILL.md geçerlidir.*

## 📌 YAYIN — tek geçerli belge

Yayınla ilgili **her iş** için: **`COPILOT-YAYIN.md`**

O belge, depoda ve tasarım sisteminde dağınık duran yayın talimatlarını birleştirir ve
eskiyenleri açıkça geçersiz kılar. Başka bir yayın belgesi onunla çelişirse **o geçerlidir**.

**En kritik üç kural (13.08.2026'da üç ayrı olaydan çıktı):**

1. **`yayin/dagitim/index.html` canlıya YÜKLENMEZ** — 1,5 MB'lik eski tek dosya sürümü;
   çok dosyalı optimize siteyi yok eder. Yayın modeli: commit → `git push` → Pages.
2. **Commit edilmemiş onarım, onarım değildir.** İş biter bitmez commit edilir;
   çalışma ağacında bekleyen düzeltmeler bir yayın sırasında silindi.
3. **`tools/index-denetle.sh` her commit öncesi çalışır.** Kanca kuruldu ama bir kez
   atlandı — **yayın akışının kendisi de bu scripti çağırmalı**:
   `tools/index-denetle.sh || exit 1`

Metin ararken **escape biçimlerini de arayın** (`\xFCcretsiz`) — `js/*.js` derlenmiş
React dosyalarıdır, düz `grep ücretsiz` yakalamaz.
