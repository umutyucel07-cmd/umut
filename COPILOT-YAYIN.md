# GitHub Copilot — Yayın Talimatı

**Sürüm 2 · 13.08.2026** · Av. Umut Yücel · Antalya Barosu, sicil no 6448
Depo: `umutyucel07-cmd/umut` → Cloudflare Pages → https://avumutyucelhukuk.com/

> **Bu belge yayın konusunda tek geçerli kaynaktır.** Depoda ve tasarım
> sisteminde yayınla ilgili başka belgeler var; hepsi geçersizdir ve §0'da
> tek tek sayılmıştır. Çelişki hâlinde bu belge esas alınır.

---

## 0. Geçersiz kılınan belgeler — bunları UYGULAMAYIN

| Belge | Neden geçersiz |
|---|---|
| `OKU.md` (depo kökündeki kopya) | Depoda var olmayan bir `dagitim/` klasörü tarif ediyor |
| `CLAUDE-TAMAMLANDI-ISLEM-LISTESI.md` | İkinci bir WhatsApp webhook'u kurdurur → müvekkile çift cevap. Gerekçe: `00-DURDUR-WEBHOOK-GOREVI.md` |
| `FACEBOOK-CROSSPOST-TASK.md` | Reklam yasağı m.11 (üçüncü kişi içeriği engellenmeli) ile çelişiyor |
| `CLAUDE-CANLI-YAYIN-KONTROLU.md` | Sonucu `CANLI-YAYIN-KONTROL-RAPORU.md`'de; talimat kısmı tükendi |
| Tasarım sistemindeki `yayin/` belgeleri | Terk edilmiş "sürükle-bırak yayın" modelini anlatıyor |

### ⛔ İki tuzak dosya sınıfı — yayın kaynağı sanılıyor, değil

**1. `yayin/dagitim/index.html` — 1.552.814 bayt.** Her şey tek dosyaya gömülü.

**2. Tasarım aracının "dışa aktar" çıktısı — ~1.58 MB.** `__bundler_loading` /
`__bundler_thumbnail` sarmalayıcıları taşır; 370. satırı 1.539.922 baytlık
base64 PNG'dir; içindeki `<script src>` değerleri UUID'dir
(`6c8b2255-479f-46c5-8483-d8918ea96835` gibi). İçinde `mevzuat`, `Misyon`,
`6448` ve `wa.me` **hiç geçmez** — canlı siteden eski bir önizlemedir.

Ortak işaret: **noscript yok, JSON-LD yok, `vendor/` yok, `defer` yok.**
Bu dördü yoksa dosya yayınlanabilir site değildir.

**Yayınlanan gerçek yapı:** `index.html` (≈3,9 KB) + `js/` + `vendor/` +
`_headers` + `_redirects` + `functions/`. Başka hiçbir şey.

`tools/index-denetle.sh` artık her iki tuzağı da otomatik yakalar
(`paketleyici çıktısı` ve `200 KB üstü HTML` kalemleri).

---

## 1. Yayından önce — zorunlu denetim

```bash
cd ~/Documents/GitHub/umut
./tools/index-denetle.sh     # 14/14 vermeli, çıkış kodu 0
```

14 kalem ve her birinin gerçek gerekçesi:

| # | Kalem | Neden var |
|---|---|---|
| 1 | Person JSON-LD ≥ 1 | Sitenin Google dizinine girmesini sağlayan iki bloktan biri |
| 2 | noscript künye ≥ 1 | Bu blok olmadan Googlebot'un gördüğü metin 10 karaktere düşer |
| 3 | unpkg = 0 | Dış origin sıfır olmalı |
| 4 | cloudflareinsights = 0 | Cloudflare yayında kendi ekler; kaynağa yazılırsa iki kez girer |
| 5 | `vendor/` = 3 | react + react-dom + lucide yerel |
| 6 | defer sayısı = src sayısı | Her harici script defer almalı |
| 7 | DOMContentLoaded ≥ 1 | Açılış perdesi kapatıcısı bunun İÇİNDE olmalı; dışındaysa beyaz ekran |
| 8 | yasak şema = 0 | `Attorney`/`LocalBusiness` yerel paket açar (Yön. m.7/e); `aggregateRating`/`review` m.11 |
| 9 | iş çağrısı / ücret = 0 | Emir kipi çağrı m.7/c; ücret ibaresi m.7/d + AK m.135/2-n |
| 10 | `varliklar.js` < 2000 bayt | 440.178 baytlık gömülü sürüm bir kez canlıya çıktı |
| 11 | paketleyici çıktısı = 0 | §0'daki iki tuzak sınıfı |
| 12 | 200 KB üstü HTML = 0 | Şişkin HTML = her şeyin gömüldüğü tuzak |
| 13 | uç yanıtı doğrulama ≥ 1 | §3'teki sahte başarı arızası — açıklama aşağıda |
| 14 | karantina ucu = 0 | §4'teki iki webhook dosyası |

Denetim başarısızsa **commit etmeyin.** `--no-verify` yalnız denetçinin
kendisini düzeltirken kullanılır.

---

## 2. Yayın adımları

```bash
cd ~/Documents/GitHub/umut

# 0) bayat kilit varsa temizle — Cowork köprüsü silemiyor, bu adım insanda
rm -f .git/index.lock .git/HEAD.lock .git/refs/heads/main.lock
rm -f .git/index.lock.atik-* .git/HEAD.lock.atik*        # köprünün bıraktığı artıklar
rm -f .git/objects/*/tmp_obj_*                            # yarım kalan geçici nesneler

# 1) denetim — 14/14 vermeli
./tools/index-denetle.sh

# 2) neyin gideceğini gör
git status --short
git diff --stat

# 3) ekle — yedek dosyaları ALMA (.gitignore zaten süzüyor)
git add -A

# 4) commit — kanca burada da denetler
git commit -m "açıklayıcı başlık"

# 5) yayınla
git push origin main
```

**Adım 5 insanda kalmalıdır.** Cowork köprüsünün (`device_bash`) ağ erişimi
yoktur; `git push` orada `HTTP 403 from proxy after CONNECT` ile başarısız olur.
Depoya commit atılabilir, gönderilemez.

**Şu an bekleyen:** `main` dalı `origin/main`'in **2 commit önünde**.

```
1d2a4eb  kunye denetci: karantina ve gomulu yedek dosyalari muaf tut
0e5b517  onarim: kod talebi ucu + sahte basari mesaji + bekci genislemesi
```

Tek yapılacak: `git push origin main`. Cloudflare Pages gerisini kendi yapar.

---

## 3. Bugün onarılan canlı arıza — müvekkile yalan başarı mesajı

**Bu, sitedeki en ciddi kusurdu ve müvekkile doğrudan dokunuyordu.**

Zincir şöyleydi:

1. `js/oturum.js` → erişim kodu talebini `/api/kod-talebi` adresine POST ediyordu.
2. Ama `functions/` klasörü **hiç commit edilmemişti** (`git log --all -- functions` boş). Uç canlıda yoktu.
3. `_redirects` içindeki tek sayfa yedeği — `/*  /index.html  200` — bilinmeyen her yolu **HTTP 200 ve HTML** ile karşılıyor.
4. `oturum.js` yalnız `r.ok`'a bakıyordu. 200 geldiği için koşul geçiyordu.
5. Müvekkile şu yazılıyordu: **"Kodunuz kayıtlı WhatsApp numaranıza gönderilmiştir."**
6. Hiçbir kod gönderilmemişti.

Bir arıza değil, **yanlış beyandı.** Kullanıcı hiçbir hata görmediği için
sorunu bildiremezdi; bekler ve kod hiç gelmezdi.

**Onarım (commit `0e5b517`):**

- `js/oturum.js` artık yanıtın `content-type`'ını ve gövdedeki `durum` alanını doğruluyor. Uç yoksa dürüstçe *"Talebiniz alınmıştır… en geç mesai saatleri içinde iletilecektir"* diyor.
- `functions/api/kod-talebi.js` yayına alındı.
- `KODLAR` ortam değişkeni tanımsızken uç artık `"eşleşmedi"` demiyor — `"kuyruk"` diyor. Yapılandırma eksiği müvekkile suç gibi yansıtılmaz.
- Denetim kalemi 13 bu davranışın geri gitmesini engelliyor.

### Copilot'un tamamlaması gereken kısım — Cloudflare Pages ortam değişkenleri

Uç yayında ama **henüz kod göndermiyor**; üç değişken eksik.
Cloudflare Dashboard → Workers & Pages → proje → **Settings → Environment variables**:

| Değişken | İçerik | Tür |
|---|---|---|
| `KODLAR` | `[{"ad":"...","tel":"...","eposta":"...","kod":"..."}, …]` JSON dizisi | **Secret** |
| `WA_PHONE_ID` | `109650188830111` | Plain |
| `WA_TOKEN` | WhatsApp Cloud API kalıcı jetonu | **Secret** |

İsteğe bağlı: `KOD_KV` adında bir KV binding → IP başına dakikada 3 istek sınırı devreye girer.

> ⚠️ **Jeton ve müvekkil listesi girişini Copilot ya da Claude yapamaz.**
> `KODLAR` 472 müvekkilin adı, telefonu ve kodunu taşır — kişisel veridir.
> `WA_TOKEN` bir kimlik bilgisidir. İkisini de **yalnız Av. Umut Yücel kendisi**
> Cloudflare arayüzüne girer. Bu belge sadece nereye ve hangi biçimde
> gireceğini söyler.

Üç değişken girilene kadar davranış **dürüst ve güvenlidir**: müvekkil
"talebiniz alındı" mesajını görür, kod elle iletilir.

---

## 4. Karantinaya alınan iki uç — geri koymayın

`functions/api/webhook.js` ve `functions/api/wa-webhook.js` hiç commit
edilmemişti; `.KARANTINA` uzantısıyla etkisizleştirildi, kopyaları
`05_Bellek_Arsivi/KARANTINA-UCLAR/` altında. Üç sebep:

**1. İkinci WhatsApp webhook'u.** Meta'daki geri çağırma adresi şu an
`https://uyhukuk-webhook.onrender.com/webhook` → Worker `muddy-hat-f441`.
Site üzerinde ikinci uç yayınlamak, adres yanlışlıkla oraya çevrildiğinde
**müvekkile çift otomatik cevap** gönderir.

**2. Serbest metin — reklam yasağı kontrolünü deliyor.** `webhook.js`
`type: 'text'` ile serbest metin yolluyor. Worker'ın `/gonder` ucu yalnız üç
sabit şablonu (`alindi` · `sure` · `gorusme`) kabul eder, serbest metni
reddeder. Bu sınır Yön. m.7/c yüzünden bilerek konuldu.

**3. Sabit yedek doğrulama jetonu.**
`env.WA_VERIFY_TOKEN || env.VERIFY_TOKEN || 'WA_VERIFY_TOKEN'` — değişken
tanımsızsa beklenen jeton `WA_VERIFY_TOKEN` düz metninin kendisi olur.
Bu dizgeyi tahmin eden herkes ucu abone ettirebilir.

Geri konacaksa üçü birden çözülmeli. Tam gerekçe:
`05_Bellek_Arsivi/KARANTINA-UCLAR/NEDEN-KARANTINADA.md`

---

## 5. Yayından sonra — doğrulama

Tarayıcıdan değil, **ölçerek** doğrulayın:

```bash
curl -s https://avumutyucelhukuk.com/ -o /tmp/c.html
wc -c /tmp/c.html                       # ≈4075 bayt (3861 + Cloudflare beacon)
grep -c '<noscript'            /tmp/c.html   # 1
grep -c 'application/ld+json'  /tmp/c.html   # 1
grep -c 'unpkg'                /tmp/c.html   # 0
grep -c 'vendor/'              /tmp/c.html   # 3
curl -s -o /dev/null -w '%{http_code}\n' https://avumutyucelhukuk.com/vendor/react-18.3.1.min.js  # 200
curl -s https://avumutyucelhukuk.com/js/varliklar.js | wc -c                                      # 619
```

### ⚠️ Bayt mı, karakter mi — bu tuzağa bir kez düşüldü

Tarayıcıda `fetch().then(r => r.text()).length` **karakter** sayar;
`wc -c` **bayt** sayar. Türkçe harfler UTF-8'de 2 bayt tutar. İkisi
karşılaştırılırsa canlı dosyalar depodakinden farklı **sanılır**.

Doğrusu: `fetch().then(r => r.arrayBuffer()).byteLength`.

Bir kez bu yüzden "bütün JS dosyaları farklı" sonucuna varıldı; farklar tam
olarak çok baytlı karakter sayısına eşitti. Ölçüm hatasıydı.

### ⏱ Dağıtım gecikmesi — "yayınlanmadı" sanmadan önce bekleyin

Push'tan sonra Cloudflare Pages'in derleyip yayması **birkaç dakika sürer**.
Bu aralıkta canlı hâlâ **bir önceki commit**'tir.

Bu da bir kez yanlış teşhise yol açtı: `07d6aea` gönderildikten hemen sonra
ölçüldü, eski sürüm göründü ve "dağıtım hattı bozuk" sanıldı. Hat çalışıyordu;
derleme henüz bitmemişti. Birkaç dakika sonra ölçüm **14/14** verdi.

`cf-cache-status: DYNAMIC` bir arıza belirtisi **değildir** — Pages HTML'i
zaten böyle sunar. Kenar önbelleği suçlamayın.

**Kural:** push'tan sonra en az 3 dakika bekleyin, sonra ölçün. Hâlâ eskiyse
Cloudflare Dashboard → proje → **Deployments** listesine bakın: derleme
başarısız mı, sırada mı, yoksa üretim dalı `main` değil mi?

---

## 6. Üç kaynağın karşılaştırması — 13.08.2026

Talep: tasarım sisteminin ürettiği · bu oturumda yapılanlar · sitenin canlı hâli.

| | Tasarım sistemi çıktısı | Depo (`main`) | Canlı site |
|---|---|---|---|
| `index.html` | ~1.58 MB paketleyici dışa aktarımı | **3.861 bayt** | **4.075 bayt** (+beacon) |
| noscript künye | ✗ yok | ✓ 1 | ✓ 1 |
| Person JSON-LD | ✗ yok | ✓ 1 | ✓ 1 |
| `vendor/` yerel | ✗ yok | ✓ 3 | ✓ 3 |
| `defer` | ✗ yok | ✓ 21/21 | ✓ 22/22 |
| `unpkg` | — | ✓ 0 | ✓ 0 |
| Sicil no 6448 | ✗ geçmiyor | ✓ | ✓ |
| `mevzuat` / `Misyon` | ✗ geçmiyor | ✓ | ✓ |
| `wa.me` | ✗ geçmiyor | ✓ doğru numara | ✓ doğru numara |
| Yayınlanabilir mi | **hayır** | evet | yayında |

**Benzerlik:** Görsel dil, bileşen adları ve renk değişkenleri
(`--brass-700`, `--surface-sunken`, `LexaHukukDesignSystem_93e85e`) ortak —
canlı `js/` dosyaları zaten aynı tasarım sisteminden türedi.

**Fark:** Tasarım çıktısı bu ortak kökün **eski bir fotoğrafı**. Canlıda olup
onda olmayanlar: mevzuat sayfası, site içi arama, misyon-vizyon, kullanım
koşulları, çoklu dil, düzeltilmiş WhatsApp bağlantısı, indeksleme blokları,
reklam yasağı temizliği.

**Birleştirme kararı: tasarım çıktısından alınacak hiçbir şey yok.**
Katkı sağlayacak tek bir alan bulunamadı; kesişimin tamamı canlıda zaten var
ve daha yeni. Tersine birleştirme — canlıyı o dosyayla değiştirmek — bugüne
kadarki üç gerilemenin de sebebi.

**`vscode-gorev` ve `vscode-gorev 2` klasörleri tamamen boştur** (tek dosya
yok). Bir görev paketi bekleniyorsa üretilmemiş demektir.

---

## 7. Reklam yasağı — yayında olan içeriğin sınırı

Dayanak: TBB Reklam Yasağı Yönetmeliği. **m.8, m.9, m.10 MÜLGA'dır**
(RG 9.8.2024-32627); bu maddelere dayanan eski notlara güvenmeyin.

- **m.7/c** — iş elde etme amacıyla paylaşım yasak. Emir kipi çağrı (*"hemen arayın"*, *"randevu alın"*) bu kapsamda.
- **m.7/d** — sitede bulunabilecekler **kapalı listedir**. Listede olmayan her bilgi ihlaldir.
- **m.7/e** — ücretli **ve ücretsiz** tanıtım, SEO çalışması, geri bağlantı yasak.
- **m.11** — üçüncü kişilerin içeriği **engellenmelidir** (yorum, paylaşım, etiketleme).
- **m.12/A** — TBB Takip Merkezi re'sen tarar; şikâyet beklemez.
- **m.12/2** — ihlal derhal giderilirse takdiri indirim sebebidir.

Yaptırım: kınama (AK m.135/2-a) → tekerrürde **23.790–237.900 TL**
(TBB Duyuru 2026/5).

Emsal: TBB DK **E.2026/19 K.2026/147** — "kişisel hesap" savunması reddedildi ·
**E.2026/121 K.2026/244** — hizmet duyurusu niteliğindeki gönderiler ·
**E.2026/101 K.2026/236** — teyit edilmemiş ikinci adres.

### Metin ararken escape biçimlerini de arayın

`js/*.js` derlenmiş React'tir; Türkçe harfler `\xFC`, `ş` biçiminde durur.
Düz `grep ücretsiz` üç canlı ihlali **kaçırdı**. Doğru desen:

```bash
grep -rEn 'ücretsiz|\\xFCcretsiz|\\u00FCcretsiz|bedelsiz' js/
```

**Meşru istisnalar:** `articles.js` (CMK m.150 — barodan ücretsiz müdafi) ve
`legal.js` (KVKK m.13). Bunlar mevzuat bilgisidir, ihlal değildir.

### Karar bekleyen gri alan

`js/buro.js` içindeki "Misyon ve Vizyon" bölümü m.7/d kapalı listesinde
**açıkça sayılmıyor**. Bilgilendirme sayılabilir de, tanıtım da. Baroya
sorulmadan kaldırılması da eklenmesi de savunulabilir; şu an **yayında**.
Karar Av. Umut Yücel'e aittir.

---

## 8. Sırada bekleyen işler

| # | İş | Kimde |
|---|---|---|
| 1 | `git push origin main` (2 commit) | **Copilot / kullanıcı** |
| 2 | `KODLAR` + `WA_TOKEN` + `WA_PHONE_ID` ortam değişkenleri | **Yalnız Av. Umut Yücel** (kimlik bilgisi) |
| 3 | Künye tek kaynak refaktörü (`COPILOT-KUNYE-TEK-KAYNAK.md` Adım 1) | Copilot |
| 4 | Refaktör bitince `tools/kunye-denetle.sh` içinde `ZORUNLU=1` | Copilot |
| 5 | Portal: 472 karma kod KV'ye, Worker v6 modülü (`PORTAL-KURULUM.md`) | Copilot + kullanıcı |
| 6 | Büro unvanı baro teyidi → `unvan-degistir.sh --uygula` | Kullanıcı |
| 7 | Instagram site bağlantısı kararı + parola girişi | **Yalnız kullanıcı** |
| 8 | WhatsApp Business "Hakkında" satırı | **Yalnız kullanıcı** (telefon uygulaması) |
| 9 | 44 duruşmanın müvekkil eşleştirmesi (`COPILOT-MUVEKKIL-ESLESTIRME.md`) | Copilot |

### Webhook'a dokunulmaz

Meta geri çağırma adresi çalışıyor ve **doğrulanmıştır**:
WhatsApp Business Account → `https://uyhukuk-webhook.onrender.com/webhook`
(`messages` **Subscribed**) → Worker `muddy-hat-f441`.
Instagram → doğrudan Worker `/giris/...`.
Uygulama `1100673212493214` · WABA `106404752490488` · TELEFON_ID `109650188830111`.

**Bu topolojiyi değiştiren hiçbir görev uygulanmayacak.** Değişiklik gerekirse
önce bu belge güncellenir.

---

## 9. Copilot için kısa özet

**Yap:**
1. `./tools/index-denetle.sh` → 14/14
2. `git push origin main` (2 commit bekliyor)
3. 3 dakika bekle, §5'teki `curl` ölçümlerini çalıştır
4. §8'deki 3, 4, 5 ve 9 numaralı işler

**Yapma:**
- 1 MB üstü herhangi bir HTML'i yayın kaynağı olarak kullanma
- `functions/api/*.KARANTINA` dosyalarını `.js` yapma
- `js/oturum.js` içindeki `content-type` doğrulamasını kaldırma
- §0'daki geçersiz belgelerdeki adımları uygulama
- Jeton, parola, müvekkil listesi girme — bunlar yalnız kullanıcıda

**Sorun çıkarsa:** önce `git log --oneline -10` ve `./tools/index-denetle.sh`.
Bugüne kadarki üç gerilemenin üçü de eski bir dosya kopyasının üzerine
yazılmasından çıktı; commit başlıkları bunu anlatmıyordu.
