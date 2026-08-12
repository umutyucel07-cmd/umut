# Depo bağlamı — GitHub Copilot için

> Bu dosyanın yeri: `.github/copilot-instructions.md`
> Copilot Chat bu dosyayı bu depoda **kendiliğinden okur**. Her seferinde bağlam anlatmanız gerekmez.

## Bu depo nedir?

Av. Umut Yücel Hukuk Bürosu'nun (Antalya) **canlı** web sitesi: <https://avumutyucelhukuk.com>

**Cloudflare Pages, depo kökünden yayınlar. `main`'e push = anında yayın.** Aşama (staging) ortamı yoktur. Bu bir hukuk bürosunun müvekkil portalı barındıran sitesidir; bozulması iş kaybıdır.

## Yapı

```
index.html          tek sayfa; tüm script'ler defer'li, üç satır içi <script> var
styles.css          tokens/ dosyalarını içeri alır
tokens/*.css        tasarım belirteçleri (renk, tipografi, boşluk, gölge, hareket)
js/*.js             ÜRETİLMİŞ DOSYALAR — components/ klasöründen derlenir, elle düzenlenmez
js/components.jsx   components.js'in JSX kaynağı
js/varliklar.js     görsel eşleme tablosu (window.UY_ASSETS)
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

## Değişmez kurallar

- **`js/` altında yalnız `varliklar.js` elle düzenlenebilir.** Diğerleri üretilmiş dosyadır.
- **`index.html` biçimlendirilmez.** Tek satırlık, sıkışık yapısı bilinçlidir; prettify etmeyin.
- **Satır içi `<script>` bloklarına `defer` eklenmez.** Üçü de anında çalışmalıdır.
- **`async` kullanılmaz, yalnız `defer`.** `defer` çalışma sırasını korur; `async` korumaz ve React'ten önce ReactDOM yüklenirse site açılmaz.
- **Son satır içi script `DOMContentLoaded` dinler.** Açılış perdesini (`#uy-acilis`) kaldıran koddur. `defer`'li script'ler `DOMContentLoaded`'dan **önce** çalışır; bu sarmalama kaldırılırsa perde React yüklenmeden kalkar ve beyaz ekran oluşur. **Sarmalamayı kaldırmayın.**
- **`assets/logo.png` silinmez** — `index.html`'de favicon olarak doğrudan kullanılır (`A()` üzerinden değil).
- **`vendor/` dosya adlarında sürüm numarası vardır** (`react-18.3.1.min.js`, `lucide-alt-1.js`). `_headers` bunlara bir yıllık kalıcı önbellek verir. **İçeriği değişecekse dosya adı da değişmelidir**, yoksa ziyaretçiler bir yıl boyunca eski kopyayı kullanır.
- **`sw.js` içindeki `SURUM` sabiti**, önbelleklenen bir dosyanın içeriği değiştiğinde artırılmalıdır. Artırılmazsa geri dönen ziyaretçiler eski dosyayı kullanmaya devam eder.
- **`git add .` kullanılmaz.** Depo kökünde commit edilmemesi gereken `.zip` ve belge dosyaları bulunabilir. Dosyalar tek tek eklenir.
- **`git push` asla Copilot tarafından yapılmaz.** Push = canlı yayın; kararı insan verir.

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

## Bilinen tuzaklar

| Belirti | Sebep |
|---|---|
| Sayfa boş, konsolda hata yok | `index.html` `file://` ile açıldı. Yerel sunucu kullanın |
| Beyaz ekran, sonra site geliyor | Açılış perdesini kapatan script `DOMContentLoaded` sarmalamasını kaybetmiş |
| `React is not defined` | Script sırası bozulmuş veya `defer` yerine `async` kullanılmış |
| Bir ikon boş kare | Lucide alt kümesinde yok — konsola bakın |
| Değişiklik yayında görünmüyor | Service Worker eski kopyayı sunuyor. `sw.js` içindeki `SURUM` artırılmalı |
| Görsel 404 | `varliklar.js` eşlemesindeki yol ile `assets/` içindeki dosya adı uyuşmuyor |
