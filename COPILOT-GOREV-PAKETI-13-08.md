# Copilot Görev Paketi — 13.08.2026

**Av. Umut Yücel · Antalya Barosu, sicil no 6448**
Bu belge `COPILOT-YAYIN.md` ile birlikte okunur. Çelişki hâlinde `COPILOT-YAYIN.md` esastır.

---

## 0. Bu oturumda BİTEN işler — tekrar yapmayın

| İş | Durum |
|---|---|
| Canlı site bütünlük denetimi | ✅ **14/14** geçti (13.08, 01:47) |
| Kod talebi ucu — sahte başarı mesajı | ✅ onarıldı, commit `0e5b517` |
| İki webhook ucu karantina | ✅ `.KARANTINA` uzantısı + `.gitignore` |
| Denetçiye 5 yeni kalem | ✅ paketleyici, 200 KB HTML, uç doğrulama, 2 karantina ucu |
| `COPILOT-YAYIN.md` sürüm 2 | ✅ 17 KB |
| Cevap Robotu saatleri | ✅ üç göreve bölündü (§3) |
| Cevap Robotu — MAVİ dosya durumu bandı | ✅ üç görevin promptuna eklendi |
| Baro belgesi incelendi | ✅ bulgu §2'de |

**Depoda 4 commit gönderilmeyi bekliyor.** Tek yapılacak: `git push origin main`.

---

## 1. 🔴 EN ÖNCELİKLİ — push

```bash
cd ~/Documents/GitHub/umut
rm -f .git/index.lock .git/HEAD.lock .git/*.lock.at* .git/*.lock.atik-* .git/objects/*/tmp_obj_*
./tools/index-denetle.sh          # 14/14 vermeli
git push origin main
```

Sonra **3 dakika bekleyip** `COPILOT-YAYIN.md` §5'teki `curl` ölçümlerini çalıştırın.

Push edilmeden `js/oturum.js` onarımı ve `/api/kod-talebi` ucu **canlıya çıkmaz** —
yani müvekkile yalan başarı mesajı gösteren hata canlıda **hâlâ duruyor.**

---

## 2. ⚖️ BARO BELGESİ — unvan sorusunun cevabı değişti

Antalya Barosu Başkanlığı Sicil Servisi · **03.06.2026 · E-91130897-622.03-20599**
(Belge doğrulama kodu 308B-1DA1-85U5, imza Av. Yasemin Sönmez, Başkan Yrd.)

Belgenin teyit ettiği üç şey:

| Kalem | Değer | Sitedeki hâli |
|---|---|---|
| Sicil no | **6448** | ✅ aynı |
| Levha kaydı | **"Avukat Umut YÜCEL"** — gerçek kişi | — |
| Kayıtlı adres | Meltem Mah. İsmail Baha Sürelsan Cad. Birlik Apt. No:21 K:8 D:25 Muratpaşa/Antalya | ✅ **birebir aynı** |
| Mesleğe başlama | 04/12/2019 | — |

**Belgede kayıtlı bir BÜRO UNVANI YOKTUR.** Kayıt bir gerçek kişi avukat kaydıdır.

Bu, beklenen "unvan teyidi" değildir — tersine, **teyit edilecek bir unvan olmadığını**
gösterir. Sonuçları:

**Yapıldı:** Cevap Robotu'nun dışa dönük KIRMIZI sabit metni artık
*"mesajınız Av. Umut Yücel'e ulaşmış"* diyor. Önceden *"… Hukuk Bürosu'na"* yazıyordu —
teyit edilmemiş unvan, tanımadığı kişilere gönderilecek metinde. Üç görevin promptunda da
düzeltildi.

**Karar sizde — iki seçenek:**

- **(a) Unvanı kaldırın.** `<title>`, `manifest.webmanifest`, `js/buro.js`, `index.html`
  ve `js/buro-bilgi.js` içinde "Umut Yücel Hukuk Bürosu" → "Av. Umut Yücel".
  Gerekçe: Yön. m.7/d kapalı listesi; kayıtlı olmayan bir unvan liste dışıdır.
  Google `<title>`'ı indeksledi, değişiklik yeniden taranmalı.
- **(b) Unvanı koruyun.** AK m.43 her avukatın bir **büro** kurmasını zorunlu tutar;
  tek kişilik bir büronun "… Hukuk Bürosu" diye anılması yerleşik kullanımdır.
  Risk: unvanın bir **avukatlık ortaklığı** (AK m.44/B) izlenimi vermesi.

**Copilot bu kararı vermez.** Karar (a) ise şu komut altı varyantı beş kanalda tek
seferde değiştirir:

```bash
~/.agents/skills/umut-yucel-sistem/araclar/unvan-degistir.sh \
  --baro-teyit --yeni "Av. Umut Yücel" --uygula
```

Çalıştırmadan önce `<title>` etiketine bakın — "Av. Umut Yücel · Av. Umut Yücel — Antalya"
gibi bir tekrar oluşursa elle sadeleştirin.

---

## 3. 🤖 Cevap Robotu — yeni saat düzeni (kuruldu)

İstenen "mesai içinde yarım saatte bir" **platform tarafından reddedildi**:
zamanlanmış görevlerde **asgari aralık 1 saattir**. `0,30 6-15 * * 1-5` ifadesi
`cron interval too short` hatası verdi. Bu bir yapılandırma tercihi değil, sistem sınırıdır.

Sınır içinde kurulan düzen:

| Görev | Cron (UTC) | Türkiye saati | Tur |
|---|---|---|---|
| **Cevap Robotu · Mesai** | `0 6-15 * * 1-5` | Hafta içi 09:00–18:00, **saatlik** | 10 |
| **Cevap Robotu · Gece ve Kenar** | `0 1,3,16,19,22 * * *` | Her gün 04:00 · 06:00 · 19:00 · 22:00 · 01:00 | 5 |
| **Cevap Robotu · Hafta Sonu Gündüz** | `0 7,10,13 * * 0,6` | Cmt/Paz 10:00 · 13:00 · 16:00 | 3 |

**Gece bandı (21:00–06:00) tam üç tur:** 22:00 · 01:00 · 04:00 — istenen sayı birebir.
Mesai saatlik (izin verilen en sık). Kalan saatler seyrek.

Eski tek görev günde 15 tur atıyordu, hafta sonu dâhil. Yeni düzen hafta içi 15,
hafta sonu 8 tur — yükü mesaiye kaydırdı.

### Daha hızlı yanıt gerçekten isteniyorsa

Zamanlanmış görev sıklığı **yanıt hızını belirlemez**. Müvekkile giden ilk teyit
Worker'ın webhook'undan **anında** çıkar; zamanlanmış görev yalnız triyaj süpürgesidir.
Hızı belirleyen ayar Worker içindeki `ACK_SOGUMA_SN=3600` (kişi başına 1 saat soğuma).
Mesai içinde 1800'e (30 dk) indirilebilir — **Worker kodu değişikliğidir**, §4'e bakın.

---

## 4. 🔵 Worker — dördüncü şablon: dosya durumu

Şu an `/gonder` ucu yalnız üç şablonu kabul ediyor: `alindi` · `sure` · `gorusme`.
Serbest metni reddediyor (Yön. m.7/c gereği bilinçli sınır).

**Triyaj tarafı yapıldı:** Cevap Robotu artık 🔵 MAVİ bandını tanıyor ve dosya durumu
taslağını hazırlıyor. Ama gönderim için Worker'da dördüncü şablon yok.

**Copilot yapacak — `worker.js` içindeki şablon sözlüğüne ekleyin:**

```js
dosya: 'Sayın {ad}, dosyanızla ilgili kayıtlarımızda görünen son durum: {asama}.' +
       '{tarihSatiri} Ayrıntılı değerlendirme için Av. Umut Yücel tarafından dönüş ' +
       'sağlanacaktır. Bu mesaj bilgilendirme amaçlıdır; avukat-müvekkil ilişkisi kurmaz.',
```

Ve `/gonder` doğrulamasına dört sıkı koşul (atlanırsa şablon eklenmez):

1. `sablon === 'dosya'` isteği yalnız **kişi rehberinde `muvekkil`** sınıfı için kabul edilir.
   Diğer her sınıf → `403`. Sebep: dosya bilgisi meslek sırrıdır (AK m.36) ve kişisel veridir.
2. `asama` ve `tarihSatiri` **sunucuya gönderilen serbest metin olamaz**; yalnız izinli
   değer kümesinden seçilir (`dilekce_verildi`, `durusma_bekleniyor`, `karar_bekleniyor`,
   `istinafta`, `icra_asamasinda`, `dosya_kapandi`). Serbest metin kabul edilirse §karantina'daki
   hatanın aynısı geri gelir.
3. `tarihSatiri` yalnız `GG.AA.YYYY` biçimini kabul eder; başka içerik reddedilir.
4. Aynı kişiye `dosya` şablonu **24 saatte bir defadan fazla** gönderilmez.

**Neden bu kadar sıkı:** dördüncü şablon, sistemin ilk kez müvekkile **dosyasına özgü
veri** göndermesi demek. Yanlış kişiye giden tek satır hem KVKK ihlali hem meslek sırrı
ihlalidir. Şablon serbest metne açılırsa üç şablon kısıtının tüm anlamı kaybolur.

---

## 5. 🛑 Frenler — inceleme ve gevşetme önerisi

Sistemdeki frenler ve değerlendirmem:

| Fren | Şu an | Değerlendirme |
|---|---|---|
| `/gonder` yalnız 3 sabit şablon | Katı | **Korunmalı** — reklam yasağının teknik karşılığı. §4 ile 4'e çıkıyor, hâlâ kapalı liste |
| `ACK_SOGUMA_SN=3600` | 1 saat | **Gevşetilebilir:** mesai içinde 1800 (30 dk). Mesai dışında 3600 kalsın |
| Günlük otomatik cevap tavanı 40 | Katı | **Korunmalı** — kaçak döngüye karşı tek gerçek koruma |
| 36 anahtar kelimelik hukuki filtre | Orta | **Genişletilebilir:** "vekâletname", "keşif", "bilirkişi", "ıslah", "haciz ihbarnamesi", "e-tebligat", "istinaf duruşması" eklenmeli |
| Kişi rehberi kenar filtresi | Katı | **Korunmalı** — şahsi mesajların işlenmesini önleyen tek katman |
| `js/oturum.js` 5 dakikalık kod talep aralığı | Orta | **Korunmalı** |
| `/api/kod-talebi` IP başına dakikada 3 | Orta | **Korunmalı** — ama `KOD_KV` binding'i yoksa çalışmıyor (§6) |
| KIRMIZI'da otomatik yanıt yok | Katı | **Korunmalı** — süreye bağlı konuda robot yanıtı en büyük risk |
| `tools/index-denetle.sh` 14 kalem | Katı | **Korunmalı ve genişletilmeli** |

**Tek somut gevşetme önerim:** `ACK_SOGUMA_SN` mesai içinde 1800. Diğer frenlerin hepsi
ya disiplin riskine ya kişisel veriye dayanıyor; gevşetmenin karşılığı yok.

---

## 6. 🔑 Müvekkil Bilgi Sistemi — 472 erişim kodu

Kod dağıtım altyapısı hazır. Eksik olan **üç ortam değişkeni**.

Cloudflare Dashboard → Workers & Pages → proje → **Settings → Environment variables**:

| Değişken | İçerik | Tür |
|---|---|---|
| `KODLAR` | `[{"ad":"...","tel":"...","eposta":"...","kod":"..."}, …]` | **Secret** |
| `WA_PHONE_ID` | `109650188830111` | Plain |
| `WA_TOKEN` | WhatsApp Cloud API kalıcı jetonu | **Secret** |

İsteğe bağlı: `KOD_KV` adında KV binding → IP başına dakikada 3 istek sınırı devreye girer.

> ⛔ **Bu üç değeri ne Copilot ne Claude giremez.** `WA_TOKEN` bir kimlik bilgisidir;
> `KODLAR` 472 müvekkilin adı, telefonu ve kodudur. **Yalnız Av. Umut Yücel** girer.

Girilene kadar davranış **dürüst**: müvekkil "talebiniz alınmıştır" görür, yalan başarı yok.

Portal sunucu tarafı için ayrı yol haritası: **`PORTAL-KURULUM.md`** (Adım 3 doğrulamayı
sunucuya taşır). **Değişmez kural: 472 kod hiçbir koşulda `window.MUVEKKILLER` içine girmez.**

---

## 7. 📣 Duyuru ve gönderim — sınır nerede

Hazır evraklar `~/05_Bellek_Arsivi/PORTAL-DAGITIM/` altında:
afiş, kılavuz, duyuru metinleri, 130 tek dokunuşlu wa.me kartı, 472 kod fişi (48 sayfa PDF).

**Gönderimi ve paylaşımı otomatik yapamam.** İki ayrı sebep:

1. **Kimin adına mesaj gideceği.** Müvekkile WhatsApp/e-posta göndermek ve LinkedIn ·
   Instagram · Facebook'ta gönderi paylaşmak, sizin adınıza dışa dönük beyandır. Bunlar
   her seferinde sizin açık onayınızı gerektirir; toplu yetkiyle yapılmaz.
2. **Reklam yasağı.** Genel paylaşımlar (LinkedIn/Instagram/Facebook gönderisi, hikâye)
   **Yön. m.7/c ve m.7/e** kapsamındadır. Yayınlamadan önce metin
   `hukuk-dijital:reklam-yasagi` becerisindeki 40 maddelik denetimden geçmelidir.
   Ayrıca **m.11**: gönderiye gelen üçüncü kişi yorumları **engellenmelidir** —
   yorumlar kapatılmadan paylaşım yapılmamalıdır.

**Ayrım net tutulmalı:** afiş, kılavuz ve tanıtım metni **genel**; erişim kodu **kişiye
özeldir**. Kod hiçbir genel paylaşımda, hiçbir toplu mesajda geçmez — yalnız o müvekkilin
kendi numarasına/e-postasına, tek tek.

### Önerdiğim sıra

1. Önce **kanal başına bir** deneme gönderimi (kendinize), biçimi görün.
2. Metinleri reklam yasağı denetiminden geçirin.
3. Instagram/Facebook gönderilerinde **yorumları kapatın** (m.11).
4. Kodları `MUVEKKIL-KOD-DAGITIM.html` üzerinden **tek tek** gönderin — 130 kart
   tek dokunuşla açılıyor; toplu gönderim listesi kullanılmıyor (yanlış kişiye
   kod gitmesini yapısal olarak imkânsız kılmak için).

---

## 8. Kalan işler ve kimde olduğu

| # | İş | Kimde | Not |
|---|---|---|---|
| 1 | `git push origin main` (4 commit) | **Copilot / kullanıcı** | Cowork köprüsünde ağ yok |
| 2 | Kilit artıklarını sil (`.git/*.lock.at*`) | **Kullanıcı** | Köprü silemiyor |
| 3 | `KODLAR` · `WA_TOKEN` · `WA_PHONE_ID` | **Yalnız kullanıcı** | Kimlik bilgisi + kişisel veri |
| 4 | Worker 4. şablon (§4) | Copilot | Dört koşul atlanmadan |
| 5 | `ACK_SOGUMA_SN` mesai içinde 1800 | Copilot | Tek gevşetme önerisi |
| 6 | Hukuki filtreye 7 kelime ekle (§5) | Copilot | |
| 7 | Künye tek kaynak refaktörü | Copilot | `COPILOT-KUNYE-TEK-KAYNAK.md` |
| 8 | Refaktör sonrası `ZORUNLU=1` | Copilot | `tools/kunye-denetle.sh` |
| 9 | Portal sunucu doğrulaması | Copilot + kullanıcı | `PORTAL-KURULUM.md` |
| 10 | Unvan kararı (§2) | **Yalnız kullanıcı** | Hukuki tercih |
| 11 | Instagram site bağlantısı + parola | **Yalnız kullanıcı** | Parola girişi devredilmez |
| 12 | WhatsApp Business "Hakkında" | **Yalnız kullanıcı** | Yalnız telefon uygulamasından |
| 13 | Gmail → Gelişmiş Güvenli Tarama | **Yalnız kullanıcı** | Hesap ayarı |
| 14 | 44 duruşmanın müvekkil adı | Copilot | `COPILOT-MUVEKKIL-ESLESTIRME.md` · kaynak `~/Desktop/HUKUK-AVUKATLIK` |
| 15 | Duyuru gönderimi ve paylaşımlar | **Yalnız kullanıcı** | §7 |

### Yayın akışına denetimi bağlayın

Pre-commit kancası bir kez atlandı ve üçüncü gerileme o boşluktan girdi. Yayın görevi
hangi adımla commit atıyorsa **öncesine** şu satır konmalı:

```bash
./tools/index-denetle.sh || exit 1
```

Kanca tek başına yetmiyor: `--no-verify` ile atlanabiliyor ve bir kez atlandı.

---

## 9. Değişmezler — bunlara dokunulmaz

- **Webhook topolojisi:** WhatsApp Business Account → `uyhukuk-webhook.onrender.com/webhook`
  → Worker `muddy-hat-f441`. Instagram → doğrudan Worker `/giris/…`.
  İkinci bir uç açan hiçbir görev uygulanmaz.
- **`functions/api/*.KARANTINA`** dosyaları `.js` yapılmaz.
  Gerekçe: `05_Bellek_Arsivi/KARANTINA-UCLAR/NEDEN-KARANTINADA.md`
- **`js/oturum.js`** içindeki `content-type` doğrulaması kaldırılmaz.
- **472 kod** `window.MUVEKKILLER` içine girmez.
- **1 MB üstü HTML** yayın kaynağı olarak kullanılmaz.
- **Ücret ibaresi** hiçbir dışa dönük metinde geçmez (escape biçimleri dâhil:
  `ücretsiz`, `\xFCcretsiz`, `ücretsiz`, `bedelsiz`).
