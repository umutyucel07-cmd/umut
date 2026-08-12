# Bu depo hakkında — önce oku

`umutyucel07-cmd/umut` · Cloudflare Pages → **https://avumutyucelhukuk.com** (canlı).
Tam sistem durumu: `~/.agents/skills/umut-yucel-sistem/SKILL.md`.

## ⛔ Yapılmayacaklar

- **Eski bir `site-dagitim/` klasörünü buraya kopyalama.** Depo doludur ve yayındadır.
  Bir görev belgesi "depo boş" diyorsa **o belge eskimiştir.**
- `js/varliklar.js` **619 bayttır** (eşleme tablosu). 440 KB'lik gömülü sürüm geri gelmez.
- `unpkg.com` veya başka dış origin eklenmez — dış kaynak sayısı **sıfır**.
- `cloudflareinsights` kaynak dosyaya yazılmaz; Cloudflare yayında kendisi ekler
  (iki kez girer).
- `umut-yucel-avukat-paneli.html` bu depoya **asla** konmaz — halka açık olur.

## ✅ `index.html`'de bulunması zorunlu

| Kalem | Neden |
|---|---|
| **Her harici script'te `defer`** (12.08 itibarıyla 19 adet) | Ayrıştırmayı bloklamamak. Sayı dosya eklendikçe artar; **oran sabit: `src` sayısı = `defer` sayısı** |
| `vendor/react-18.3.1.min.js`, `vendor/react-dom-18.3.1.min.js` | Dış origin yok |
| `vendor/lucide-alt-1.js` (79 ikon, 497/497 eşleşme) | 88 KB tasarruf |
| `Person` JSON-LD | **Sitenin dizine girmesini sağlayan bloklardan biri** |
| `<noscript>` künye | Googlebot'un gördüğü metin 10 → **170 karakter** |
| Açılış perdesi kapatıcısı `DOMContentLoaded` içinde | Dışındaysa React yüklenmeden perde kalkar → **beyaz ekran** |

Ölçüm: JS **514 KB → 106 KB gzip**. Site **12.08.2026'da Google dizinine girdi.**

## Şema kısıtı (reklam yasağı)

JSON-LD'de **yalnız `Person`**. Bunlar eklenmez: `Attorney` / `LocalBusiness`
(yerel sonuç → Yön. m.7/e), `sameAs`, `priceRange`, `aggregateRating`, `review`,
`areaServed`, `knowsAbout`, `serviceType`, `addressLocality`, `telephone`.

## Doğrulama

```bash
grep -c 'application/ld+json' index.html   # 1
grep -c '<noscript>' index.html            # 1
grep -c 'script defer src' index.html      # 17
grep -c 'unpkg' index.html                 # 0
grep -c 'cloudflareinsights' index.html    # 0
wc -c js/varliklar.js                      # ~619
```

## Ortak hafıza
Geçmiş kararlar ve oturum arşivi: `~/05_Bellek_Arsivi/ORTAK-HAFIZA/` (protokol:
`~/.agents/skills/ortak-hafiza/SKILL.md`). Bulut aynası: https://app.notion.com/p/3ba91ffb6a54818eb9bdd787d94723db

## 🛡️ Commit guard'ı — 12.08.2026'da kuruldu

`.git/hooks/pre-commit` → `tools/index-denetle.sh` (**engelleyici**) +
`tools/kunye-denetle.sh` (**şimdilik uyarı modunda**).

**Neden kuruldu:** `8c1c772` "Indeksleme: Person JSON-LD + noscript kunye" bu iki bloğu
ekledi ve site Google dizinine bu sayede girdi. Bir sonraki commit — `7488fdf`
"müvekkil girişi: kalıcı oturum" — **ikisini de, `defer`'i de sessizce geri aldı** ve
`unpkg`'yi geri getirdi. Commit başlığı bunu anlatmıyordu; eski bir `index.html` kopyası
üzerine yazılmıştı. Aylarca fark edilmeyebilirdi.

Denetimi elle çalıştırmak için: `tools/index-denetle.sh`
Bilinçli istisna: `git commit --no-verify`

`tools/kunye-denetle.sh` künye refaktörü (`COPILOT-KUNYE-TEK-KAYNAK.md` Adım 1)
bitene kadar **uyarı** verir, engellemez — engelleyici olsaydı her commit durur,
`--no-verify` alışkanlık olur ve index.html guard'ı da devre dışı kalırdı.
Refaktör bitince o dosyada `ZORUNLU=1` yapın.

## 🔁 13.08.2026 — GÖREV-5 yayını dört regresyon getirdi

`36dce2e` "mevzuat ve araçlar sayfası, site içi arama, çoklu dil, kullanım koşulları,
misyon-vizyon" gerçek değer ekledi (2 yeni ekran) **ama dört şeyi geri götürdü**:

| Regresyon | Etki |
|---|---|
| `js/varliklar.js` 619 B → **440.178 B** | 6 görsel yeniden gömüldü; sayfa +440 KB |
| `index.html`'de `unpkg` ×3 geri geldi, `vendor/` gitti | Dış origin sıfır kuralı çiğnendi |
| `noscript` + `Person` JSON-LD yine yok | Googlebot'un gördüğü metin 170 → 10 karakter |
| `js/buro.js`'ye **yeni** ücret ibaresi girdi | "Ön görüşmenin ücretsiz olması" — m.7/d + AK m.135/2-n |

Dördü de onarıldı. **Asıl ders:** önceki onarımlar **commit edilmemişti** ve yayın
sırasında silindi. *Commit edilmemiş onarım, onarım değildir.*

**Kanca atlandı.** `.git/hooks/pre-commit` 21:32'de kuruluydu; `36dce2e` 00:40'ta
atıldı ve kanca çalışmadı — yayın aracı kancaları çalıştırmayan bir yolla commit
ediyor (`--no-verify` ya da libgit2/isomorphic-git). **Kanca tek başına yetmiyor:**
yayın akışının kendisi `tools/index-denetle.sh` çağırmalı, aksi hâlde aynı regresyon
tekrar eder.

## 📌 Yayın

Yayın işlemi için tek geçerli belge: **`COPILOT-YAYIN.md`**.
`OKU.md` ve `yayin/` altındaki kurulum belgeleri **eskimiştir** (tek dosya sürükle-bırak modeli).
