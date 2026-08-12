> # ⛔ BU BELGE ESKİMİŞTİR — UYGULAMAYIN
>
> **13.08.2026.** Bu dosya, sitenin **eski yayın modelini** anlatıyor: tek dosyalık
> `index.html`'i Cloudflare paneline **elle sürükleyip bırakmak**.
>
> **Site artık öyle yayınlanmıyor.** Doğru model:
> `umutyucel07-cmd/umut` deposu → **git push** → Cloudflare Pages otomatik dağıtır.
>
> **Bu belgeyi uygularsanız ne olur:** `yayin/dagitim/index.html` **1,5 MB'lik**,
> her şeyi içine gömen eski pakettir. Canlı sitenin üzerine yüklenirse çok dosyalı
> ve optimize sürüm (JS 106 KB, ayrı `assets/`, `vendor/`, `Person` JSON-LD) **yok olur.**
> Ayrıca tarif ettiği `dagitim/` klasörü **bu depoda yok** — belge burada anlamsız.
>
> **Doğru yayın talimatı:** `COPILOT-YAYIN.md`
> **Değişmez kurallar:** `CLAUDE.md` · `~/.agents/skills/umut-yucel-sistem/SKILL.md`

# 3 adımda yayına al

## 1 — Yükle
Cloudflare panelinde: **Workers & Pages → Create → Pages → Upload assets**
Proje adı: `avumutyucelhukuk`
Bu klasörün **içindeki 6 dosyayı** seçip sürükleyin → **Deploy**.
Site `avumutyucelhukuk.pages.dev` adresinde açılır.

## 2 — Alan adını bağla
Aynı projede **Custom domains → Set up a domain** → `avumutyucelhukuk.com` → Activate.
Sonra **SSL/TLS → Edge Certificates → Always Use HTTPS** düğmesini açın.
Sertifika birkaç dakikada gelir; sonra adres tarayıcıda çalışır.

## 3 — Google'a bildir
search.google.com/search-console → **Add property → URL prefix** → `https://avumutyucelhukuk.com`
Doğrulama yönteminde **Cloudflare**'i seçin (tek tık, otomatik).
Sol menü **Sitemaps** → `sitemap.xml` yazıp **Submit**.

---

## Klasördeki dosyalar
| Dosya | Ne yapar |
|---|---|
| `index.html` | Sitenin tamamı — görseller, yazı tipleri, kod içine gömülü |
| `manifest.webmanifest` | Telefona uygulama olarak kurulmasını sağlar (ad, ikon, tam ekran) |
| `sw.js` | Çevrimdışı çalışma — internet yokken de site açılır |
| `icon-192.png` `icon-512.png` `icon-maskable-512.png` `apple-touch-icon.png` | Uygulama ikonları |
| `_headers` | Güvenlik başlıkları (HSTS, çerçeveleme koruması, nosniff) |
| `_redirects` | `www` adresini ana adrese çevirir |
| `robots.txt` | Arama motorlarına izin verir, site haritasını gösterir |
| `sitemap.xml` | Google site haritası |

## Telefona uygulama olarak kurma
Yükleme bittikten sonra siteyi telefonda açıp deneyin:

**iPhone (Safari):** Paylaş simgesi → **Ana Ekrana Ekle** → Ekle. Ana ekranda arma ikonu çıkar, tam ekran açılır, adres çubuğu görünmez.
**Android (Chrome):** Sağ üst ⋮ → **Uygulamayı yükle** (ya da ekranda çıkan "Yükle" bandı).

Müvekkillerinize bunu tarif edin — App Store'a gerek yok, mağaza ücreti ve onay süreci de yok.

## Yükledikten sonra
- **Plausible:** plausible.io hesabınızda site adı `avumutyucelhukuk.com` olmalı. Ölçüm yalnız ziyaretçi "Tümünü kabul et" derse çalışır.
- **`.av.tr` yönlendirmesi:** `../ALAN-ADI.md` 3. bölüm.
- **Panel dosyasını buraya koymayın** — `umut-yucel-avukat-paneli.html` halka açık olmamalı.

## Sitede canlı çalışanlar
Kartla ödeme (Moka), IBAN kopyalama, telefon, WhatsApp, Instagram, harita, çerez rızası, Plausible.

## Hâlâ gösterim olanlar
Randevu formu ve SMS ile giriş bir sunucuya bağlı değil. Dosya numaraları, müvekkil adları, yazılar ve analiz rakamları örnektir.
