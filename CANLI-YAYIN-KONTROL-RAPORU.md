```text
CANLI YAYIN KONTROL RAPORU
Tarih: 12.08.2026, 23:55
URL: https://avumutyucelhukuk.com
Durum: BLOKELI
```

Talimat: `CLAUDE-CANLI-YAYIN-KONTROLU.md` · Ölçüt: `umut-yucel-sistem/SKILL.md` + depo `CLAUDE.md`
Yöntem notu: `curl` yerine tarayıcı üzerinden `fetch` kullanıldı (aynı ham yanıt, önbelleksiz).
**Hiçbir şey değiştirilmedi.** §3 yasakları uygulandı; §6 gereği blokaj raporu yazıldı.

---

## 1. Erişilebilirlik

- **OK.** `HTTP 200`. Ana belge 3.493 bayt, `<title>` dolu, sayfa boş değil.
- Alt kaynaklar 200: `js/varliklar.js` (597 B) · `js/buro-bilgi.js` (5.620 B) · `manifest.webmanifest` (1.043 B) · tüm ekran JS'leri.

## 2. Dış kaynaklar

- **HATA.** Canlı `index.html` **üç dış origin** yüklüyor:
  - `https://unpkg.com/react@18.3.1/umd/react.production.min.js`
  - `https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js`
  - `https://unpkg.com/lucide@0.462.0/dist/umd/lucide.js`
  - ayrıca `fonts.gstatic` preconnect
- `vendor/react-18.3.1.min.js`, `vendor/react-dom-18.3.1.min.js`, `vendor/lucide-alt-1.js` **canlıda hiç çağrılmıyor.**
- `static.cloudflareinsights.com` var — bu **beklenen**; Cloudflare yayında kendisi ekliyor, kaynakta yok (`CLAUDE.md` bunu zaten söylüyor).
- Dayanak: `CLAUDE.md` → *"`unpkg.com` veya başka dış origin eklenmez — dış kaynak sayısı sıfır."*

## 3. Zorunlu HTML blokları

| Kalem | Beklenen | Canlı | Yerel depo (HEAD) | Yerel çalışma ağacı |
|---|---|---|---|---|
| `<noscript>` künye | 1 | **0** ❌ | **0** ❌ | **0** ❌ |
| `application/ld+json` (`Person`) | 1 | **0** ❌ | **0** ❌ | **0** ❌ |
| `script defer src` | 17 | **0** ❌ | **0** ❌ | 0 |
| `unpkg` | 0 | **3** ❌ | 3 ❌ | 0 ✅ |
| `vendor/` | 3 | **0** ❌ | 0 ❌ | 3 ✅ |
| `js/varliklar.js` | ~619 B | 597 B ✅ | 619 B ✅ | 619 B ✅ |
| `<title>` | var | var ✅ | var ✅ | var ✅ |

- **HATA.** İndekslemeyi sağlayan iki blok (`noscript` künyesi ve `Person` JSON-LD) **canlıda yok.**
- `varliklar.js` **597 bayt** — 440 KB'lik gömülü sürüm geri gelmemiş. Bu regresyon **yaşanmamış**, tek olumlu kalem.

### Blokların ne zaman kaybolduğu — git kanıtı

`index.html` commit geçmişi (her commit'te blok sayıları ölçüldü):

| Commit | Konu | noscript | ld+json | defer | unpkg |
|---|---|---|---|---|---|
| `8c1c772` | **Indeksleme: Person JSON-LD + noscript kunye** | **1** | **1** | **17** | **0** |
| `7488fdf` | müvekkil girişi: kalıcı oturum + deneme kilidi | **0** | **0** | **0** | **3** |
| `9f17634` | kod talebi otomasyonu + portal hazır talepler *(canlı olan)* | 0 | 0 | 0 | 3 |

**Bulgu:** `8c1c772` bu blokları ekledi ve site 12.08'de Google dizinine bu sayede girdi.
Bir sonraki commit **`7488fdf` üçünü birden geri aldı** ve `unpkg`'yi yeniden getirdi.
Konu başlığı ("müvekkil girişi: kalıcı oturum") bu geri almayı **anlatmıyor** — büyük
olasılıkla eski bir `index.html` kopyası üzerine yazıldı. Yayında olan `9f17634` de
aynı bozuk hâli taşıyor.

### Çalışma ağacında commit edilmemiş kısmi onarım var

`git diff index.html`: `unpkg` × 3 → `vendor/` × 3 değiştirilmiş, `fonts.gstatic`
preconnect kaldırılmış (**benim yapmadığım**, önceden duran bir düzeltme) + benim
`meta description` düzeltmem. **Ama `noscript` ve `Person` JSON-LD bu onarıma dâhil
değil — çalışma ağacında da yok.**

## 4. Reklam yasağı / metin kontrolü

- **HATA.** Talimattaki 4.4 komutu yalnız `index.html`'i tarıyor; **site bir React SPA'dır**,
  görünen metin `js/*.js` içinde. Yalnız HTML taransaydı sonuç yanlış biçimde "temiz" çıkardı.
  Tarama ekran JS dosyaları üzerinden yapıldı:

| Dosya | Bulgu |
|---|---|
| `js/home.js` | **"On beş dakikalık ücretsiz ön görüşme…"** — ana sayfa alt bandı |
| `js/booking.js` | **"İlk on beş dakikalık ön görüşme ücretsizdir… bedelsiz olarak erteleyebilirsiniz"** |
| `js/sss.js` | **"İlk 15 dakikalık ön görüşme ücretsizdir…"** |
| `manifest.webmanifest` | **"Randevu alın, dosyanızı takip edin, sorunuzu iletin."** — emir kipi iş çağrısı |

- Dayanak: Yön. **m.7/d** kapalı liste (ücret bilgisi listede yok) + **AK m.135/2-n**;
  manifest için **m.7/c** (iş elde etme amacıyla çağrı). Kontrol listesinde **bariz durdurucu**.
- Yaptırım: **kınama** (AK m.135/2-a); 5 yıl içinde tekerrürde bir derece ağırlaşır →
  **23.790 – 237.900 TL** (TBB Duyuru 2026/5). Takip Merkezi (Yön. m.12/A) **re'sen** tarıyor.
- **Bu metinler yerel depoda 12.08 akşamı temizlendi**, tasarım sistemi kopyaları da dâhil.
  **Yayına gitmediği için canlıda duruyorlar.**
- Temiz: "uzman", "lider", dava sonucu, ikinci adres/şehir, müvekkil referansı — **yok**.
- Meşru sayılıp dokunulmayanlar: `articles.js` "barodan ücretsiz müdafi" (CMK m.150),
  `legal.js` "KVKK başvurusu ücretsiz yanıtlanır" (KVKK m.13) — **mevzuat bilgisi**, ücret politikası değil.

## 5. Unvan / isim kontrolü

- **UYARI (çelişki yok, teyit yok).** Canlı `index.html`: `Umut Yücel Hukuk Bürosu` ×2
  (`<title>`, `og:title`), `Av. Umut Yücel` ×3. Manifest adı: `Av. Umut Yücel — Umut Yücel Hukuk Bürosu`.
  `js/buro-bilgi.js` → `buro: 'Umut Yücel Hukuk Bürosu'`.
- **Canlıda tek varyant kullanılıyor** — birbiriyle çelişen iki ad **yok**, yeni varyant **üretilmemiş**. Bu yönüyle ölçüt karşılanıyor.
- Ancak kullanılan ad **baroca teyit edilmiş değil**; `SKILL.md` §2.5 teyide dek dışa dönük
  metinde büro unvanı kullanılmamasını, yalnız `Av. Umut Yücel — Antalya Barosu, sicil no 6448`
  biçiminin kullanılmasını söylüyor. Teyitsiz unvan şu an **sayfa başlığında ve Google dizininde**.
- Hazır araç: `~/.agents/skills/umut-yucel-sistem/araclar/unvan-degistir.sh` — teyit tarihi
  verilmeden yazmıyor; teyit gelince altı varyantı tek komutla eşitler.

## 6. Notlar

- **Webhook / Meta tarafına dokunulmadı, bakılmadı bile** — §3 gereği. Bilgi olarak:
  12.08'de doğrulanmıştı; WhatsApp callback `uyhukuk-webhook.onrender.com` → Worker'a
  iletiyor, Instagram callback doğrudan Worker. Kuyruk 0, son gönderim 12.08 15:37 başarılı.
  Bu kontrolde **değiştirilmedi, kapatılmadı, açılmadı.**
- `js/buro-bilgi.js` içinde `window.MUVEKKILLER` **2 örnek kayıt** taşıyor ve dış kaynak
  kullanmıyor ✅. **Uyarı:** müvekkil doğrulaması hâlâ istemci tarafında. 472 gerçek kodun
  buraya konması hâlinde tüm kodlar sayfa kaynağından okunabilir olur — `PORTAL-KURULUM.md`
  Adım 3 bunu sunucu doğrulamasına taşıyor. **Kodlar bu dosyaya yazılmamalıdır.**
- `<meta name="viewport" content="width=1280">` sabit — telefonda site küçültülmüş masaüstü
  gibi görünüyor. Reklam yasağıyla ilgisi yok; bilinçli tercihse dokunulmaz.
- **Talimattaki 4.4 kontrol tekniği eksiktir** ve düzeltilmelidir: SPA olduğu için
  `index.html` taraması yanlış "temiz" sonucu verir. Doğrusu `js/*.js` dosyalarını,
  **escape biçimleriyle birlikte** taramaktır (`ücretsiz`, `\xFCcretsiz`, `ücretsiz`).
  Bugünkü üç kopya tam bu yüzden daha önce gözden kaçmıştı.

## 7. Öneri

**Durum: BLOKELİ.** §7 doğrulama kriterinin altı maddesinden **üçü olumsuz**
(dış kaynak var · `noscript`/`Person` yok · reklam yasağı ihlali canlıda). İnsan onayı
olmadan hiçbir değişiklik yapılmadı.

Önerilen eylem sırası — **her adım sizin onayınızla**:

1. **`index.html`'e `noscript` künyesi + `Person` JSON-LD geri konsun.** İkisi de
   `8c1c772` commit'inde hazır duruyor; oradan alınabilir. Bu, sitenin dizinde kalmasını
   sağlayan bloklardır — şu an yok, indeksleme geri gidebilir.
   *(Onay verirseniz bloğu `8c1c772`'den çıkarıp uygularım.)*
2. **Çalışma ağacındaki `unpkg` → `vendor/` düzeltmesi commit'lensin** (zaten hazır).
   Bu, dış kaynak sayısını sıfıra indirir.
3. **`defer` kararı verilsin.** `8c1c772` 17 script'te `defer` kullanıyordu; bugünkü
   dosya script'leri `</body>` sonunda senkron yüklüyor. İkisi de çalışır. `defer`'e
   dönülecekse açılış perdesi kapatıcısı **`DOMContentLoaded` içine alınmalı** — dışında
   kalırsa beyaz ekran olur (`CLAUDE.md` bu tuzağı yazıyor).
4. **Yayına alın.** Reklam yasağı düzeltmeleri (üç dosyadaki ücret ibaresi + manifest
   açıklaması) yerel depoda hazır; deploy edilmeden canlıdaki ihlal sürer. **Aciliyet
   sırası bu maddededir** — disiplin riski taşıyan tek kalem budur.
5. Deploy sonrası doğrulama:
   ```
   /js/home.js  · /js/booking.js · /js/sss.js   → "xFCcretsiz" sayısı 0
   /                                            → noscript 1, ld+json 1, unpkg 0
   /manifest.webmanifest                        → açıklamada emir kipi yok
   ```
6. **`7488fdf` regresyonunun tekrarını önleyin.** `COPILOT-KUNYE-TEK-KAYNAK.md` Adım 2'deki
   commit guard'ına `index.html` için de bir kontrol eklenmeli: `noscript`, `application/ld+json`
   ve `unpkg=0` şartını sağlamayan commit reddedilsin. Bugünkü olay, guard olmadığı için
   sessizce geçmiş.

---

**Değiştirilmeyenler:** webhook · Meta callback · WhatsApp otomatik yanıt · Notion · KV ·
kişi rehberi · Worker · git (`push`/`add`/`commit` yok) · npm/npx/build yok · depoya yeni
kaynak dosyası eklenmedi. Bu rapor dışında bu kontrol kapsamında **hiçbir yazma yapılmadı.**
