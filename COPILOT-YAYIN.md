# GitHub Copilot — Yayın Talimatı (tek geçerli belge)

**13.08.2026** · Depo: `umutyucel07-cmd/umut` · Canlı: https://avumutyucelhukuk.com

Bu belge, depoda ve tasarım sisteminde dağınık duran yayın talimatlarını **birleştirir
ve eskiyenleri geçersiz kılar**. Yayınla ilgili başka bir belge bununla çelişirse
**bu belge geçerlidir**.

> **Tek doğru kaynak sıralaması:**
> 1. `~/.agents/skills/umut-yucel-sistem/SKILL.md` — canlı sistem durumu
> 2. `CLAUDE.md` — depo koruma kuralları
> 3. **bu belge** — yayın işlemi
>
> Bir görev belgesi bunlarla çelişiyorsa **uygulama, önce raporla.**

---

## 0. Geçersiz kılınan belgeler — bunları UYGULAMAYIN

| Belge | Neden geçersiz |
|---|---|
| `OKU.md` (depo kökü) | Var olmayan bir `dagitim/` klasörünü sürükle-bırak yüklemeyi anlatıyor |
| `yayin/README.md`, `yayin/KURULUM.md`, `yayin/OKU.md` | Tek dosyalık HTML + elle yükleme modeli — terk edildi |
| `yayin/YOL-1-KURULUM.md`, `yayin/ADIM-ADIM-KURULUM.md`, `yayin/pwa-ekle.md` | Aynı eski model |
| `CLAUDE-TAMAMLANDI-ISLEM-LISTESI.md` | Webhook adresini değiştirmeyi istiyordu — canlı hattı koparırdı (`00-DURDUR-WEBHOOK-GOREVI.md`) |
| `Downloads/vscode-gorev/GOREVLER.md` | "Depo boş" diyordu; dolu ve yayında (`00-DURDUR-ONCE-BUNU-OKU.md`) |

### ⛔ En tehlikeli olan

`~/.agents/skills/umut-yucel-hukuk-design/yayin/dagitim/index.html` **1.552.814 bayttır**
— her şeyi (görseller, stiller, kod) içine gömen **eski tek dosya sürümü**.

**Bu dosya canlıya yüklenmez.** Yüklenirse: çok dosyalı optimize sürüm (JS 106 KB gzip,
ayrı `assets/`, yerel `vendor/`, `Person` JSON-LD, `noscript` künyesi) **yok olur** ve
sitenin Google dizinindeki yeri riske girer.

**Doğru model tek cümle:** depoya commit → `git push` → **Cloudflare Pages kendisi
dağıtır.** Panele elle dosya yüklenmez.

---

## 1. Yayından önce — zorunlu denetim

```bash
cd ~/Documents/GitHub/umut
tools/index-denetle.sh
```

**On kalemin onu da ✅ olmadan push edilmez.** Denetlenenler ve neden:

| Kalem | Beklenen | Neden |
|---|---|---|
| `Person` JSON-LD | 1 | Sitenin dizine girmesini sağlayan bloklardan biri |
| `<noscript>` künye | 1 | Googlebot'un gördüğü metin bu blok olmadan 170 → 10 karakter |
| `unpkg` | 0 | Dış origin sayısı sıfır olmalı |
| `cloudflareinsights` | 0 | Cloudflare yayında kendi ekler; kaynağa yazılırsa iki kez girer |
| `vendor/` | 3 | react + react-dom + lucide yerel |
| `defer` | `src` sayısına eşit | Ayrıştırmayı bloklamamak |
| `DOMContentLoaded` | ≥1 | Açılış perdesi kapatıcısı **içinde** olmalı; dışındaysa **beyaz ekran** |
| yasak şema | 0 | `Attorney`/`LocalBusiness` → yerel paket (Yön. m.7/e); `review`/`rating` → m.11 |
| iş çağrısı / ücret | 0 | Emir kipi çağrı m.7/c; ücret ibaresi m.7/d + AK m.135/2-n |
| `js/varliklar.js` | <2000 bayt | 440 KB'lik gömülü sürüm geri gelmemeli |

Kanca da aynı denetimi yapar (`.git/hooks/pre-commit`). **Ama kancaya güvenmeyin** —
§5'e bakın.

---

## 2. Yayın adımları

```bash
cd ~/Documents/GitHub/umut

# 0) bayat kilit varsa temizle (Cowork köprüsü silemiyor, bu adım insanda)
rm -f .git/index.lock

# 1) denetim — 10/10 vermeli
tools/index-denetle.sh

# 2) neyin gideceğini gör
git status
git diff --stat

# 3) ekle (yedek dosyaları ALMA)
git add index.html js/ manifest.webmanifest tools/ CLAUDE.md COPILOT-YAYIN.md
git status --short | grep -E "yedek-|oncesi-|gomulu-" && echo "!! yedek eklenmiş, git reset ile çıkar"

# 4) commit — kanca burada da denetler
git commit -m "yayin: indeksleme bloklari + reklam yasagi temizligi + varliklar.js geri"

# 5) yayınla
git push
```

`git push` **doğrudan canlı yayındır.** Kararı insan verir; Copilot kendi başına push
etmez (`.github/copilot-instructions.md` mutlak yasak listesi).

---

## 3. Yayından sonra — doğrulama

Tarayıcıda `https://avumutyucelhukuk.com/` açıp kaynağı görüntüleyin ve şunları arayın:

| Aranan | Beklenen |
|---|---|
| `noscript` | **1** kez geçmeli |
| `application/ld+json` | **1** kez, `"@type":"Person"` |
| `unpkg` | **hiç** geçmemeli |
| `vendor/react-18.3.1.min.js` | geçmeli |

Sonra bu dosyaları açıp `ücretsiz` arayın — **hiçbirinde çıkmamalı**:
`/js/home.js` · `/js/booking.js` · `/js/sss.js` · `/js/buro.js`

`/js/varliklar.js` açın → **~619 bayt** olmalı (440 KB ise regresyon geri gelmiş).

WhatsApp bağlantısını tıklayın → **"Av. Umut YÜCEL"** sohbeti açılmalı.
*"Bağlantı artık geçerli değil"* görürseniz `wa.me/message/` kısa linki geri gelmiş demektir.

Son adım: **Search Console → URL denetimi → Dizine eklenmesini iste.**
İndeksleme blokları bir süre eksikti; taze tarama istemek gerekir.

---

## 4. Yayında olan içerik — reklam yasağı sınırları

Bu depo bir **avukat** sitesini besliyor. Yön. m.7/d **kapalı listedir**: listede
olmayan bilgi siteye konmaz. Yaptırım **kınama**; 5 yıl içinde tekerrürde
**23.790 – 237.900 TL**. TBB Takip Merkezi **re'sen tarıyor**.

**Asla eklenmez:** ücret / "ücretsiz ilk görüşme" / indirim · "uzman", "en iyi", "lider" ·
dava sonucu (beraat, tahliye, kazanılan dava) · müvekkil adı, referans, logo ·
emir kipi iş çağrısı ("randevu alın", "hemen ara", "bize yazın") · ikinci şehir adresi ·
`Attorney`/`LocalBusiness` şeması · yorum/puan modülü.

**Meşru sayılanlar — kaldırmayın:** `js/articles.js`'te "barodan ücretsiz müdafi"
(CMK m.150) ve `js/legal.js`'te "KVKK başvurusu ücretsiz yanıtlanır" (KVKK m.13).
Bunlar **mevzuat bilgisi**, büronun ücret politikası değil.

### ⚠️ Metin ararken escape biçimlerini de arayın

`js/*.js` derlenmiş React dosyalarıdır; Türkçe karakterler kaçış dizisine dönüşür.
Düz `grep ücretsiz` **yakalamaz**. Doğrusu:

```bash
grep -rnoE "ücretsiz|\\\\xFCcretsiz|\\\\u00FCcretsiz|bedelsiz" js/*.js
```

12.08'de üç canlı ihlal tam bu yüzden gözden kaçmıştı.

### Karar bekleyen gri alan

`js/buro.js`'deki **Misyon / Vizyon / Amacımız** bloğu m.7/d kapalı listesinde **yok**.
Metin ölçülü (üstünlük iddiası, çağrı, ücret içermiyor) ve avukat açıkça istedi;
**kaldırılmadı, riskli olarak işaretlendi.** Baro yazısı gelirse **derhal kaldırmak**
takdiri indirim sebebidir (Yön. m.12/2).

---

## 5. Neden bu belge var — üç kez tekrarlanan hata

| Tarih | Ne oldu |
|---|---|
| `7488fdf` | "müvekkil girişi: kalıcı oturum" commit'i, `noscript` + `Person` JSON-LD + `defer`'i **sessizce sildi**, `unpkg`'yi geri getirdi. Başlık bunu anlatmıyordu |
| `36dce2e` (GÖREV-5) | Yeni ekranlar getirdi **ama** `varliklar.js`'i 619 B → **440.178 B** yaptı, `unpkg`'yi geri getirdi, blokları yine sildi, `js/buro.js`'ye **yeni ücret ibaresi** ekledi |
| aynı gün | Onarımlar **commit edilmemişti**; yayın sırasında silindiler |

**Üç kural bu üç olaydan çıktı:**

1. **Commit edilmemiş onarım, onarım değildir.** İş biter bitmez commit edilir.
2. **Kanca tek başına yetmiyor.** `.git/hooks/pre-commit` 21:32'de kuruluydu; `36dce2e`
   00:40'ta atıldı ve **kanca çalışmadı** — yayın aracı kancaları çalıştırmayan bir
   yolla commit ediyor. **Yayın akışının kendisi `tools/index-denetle.sh` çağırmalı:**
   ```bash
   tools/index-denetle.sh || exit 1
   ```
   Bu satır, design bölümündeki yayın görevinin commit adımından **önce** olmalı.
3. **Bir dosyayı "güncellemek" için eski bir kopyayı üzerine yazmayın.** Üç regresyonun
   üçü de böyle oldu. Değişiklik **hedef dosyada** yapılır.

---

## 6. Sırada bekleyen işler — yayınla ilgili olanlar

| İş | Durum | Belge |
|---|---|---|
| Müvekkil portalı: 472 kodu KV'ye yükle + Worker modülü + sunucu doğrulaması | Hazır, kurulum bekliyor | `PORTAL-KURULUM.md` |
| **Kritik:** `js/oturum.js` müvekkili **istemci tarafında** doğruluyor | 472 kod client'a **konmamalı** | `PORTAL-KURULUM.md` Adım 3 |
| Künye tek kaynağa bağlama (`{{BURO}}` + `kunye-bas.js`) | Guard kuruldu, **refaktör yapılmadı** | `COPILOT-KUNYE-TEK-KAYNAK.md` |
| `tools/kunye-denetle.sh` uyarı modunda | Refaktör bitince `ZORUNLU=1` | aynı |
| Büro unvanı baro teyidi | Teyit yok; 6 varyant dolaşıyor | `araclar/unvan-degistir.sh` |
| `viewport width=1280` sabit | Telefonda küçültülmüş masaüstü görünüyor | karar avukatta |
| `functions/` klasörü | Git'te **takipsiz**, hiç deploy edilmedi | `00-DURDUR-WEBHOOK-GOREVI.md` |

### Webhook'a dokunulmaz

Meta callback zinciri çalışıyor: WhatsApp → `uyhukuk-webhook.onrender.com` → Cloudflare
Worker; Instagram → doğrudan Worker. **Callback URL değiştirilmez, ikinci webhook
kurulmaz, `functions/api/wa-webhook.js` yayına alınmaz.** Gerekçe:
`00-DURDUR-WEBHOOK-GOREVI.md`.

---

## 7. Copilot için kısa özet

**Yapabilirsin:** depo içi dosya düzenleme · `tools/index-denetle.sh` çalıştırma ·
commit hazırlama (denetim geçtiyse) · bu belgedeki işleri uygulama.

**Yapmayacaksın:** `git push` · `dagitim/index.html`'i canlıya taşıma ·
Meta/Cloudflare/Worker ayarına dokunma · `~/.agents/`, `~/05_Bellek_Arsivi/`,
`~/Desktop/HUKUK-AVUKATLIK` içine yazma · reklam yasağı denetiminden geçmemiş
dışa dönük metin ekleme · müvekkil erişim kodlarını istemci tarafına koyma.

**Şüphedeysen:** uygulama, `SKILL.md` ile karşılaştır, farkı raporla.
