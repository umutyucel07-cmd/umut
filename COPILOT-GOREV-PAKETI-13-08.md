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

## 2. ⚖️ Baro belgesi ve unvan kararı — KARAR VERİLDİ

Antalya Barosu Başkanlığı Sicil Servisi · **03.06.2026 · E-91130897-622.03-20599**
(doğrulama kodu 308B-1DA1-85U5, imza Av. Yasemin Sönmez, Başkan Yrd.)

| Kalem | Belge | Sitedeki hâli |
|---|---|---|
| Sicil no | **6448** | ✅ aynı |
| Levha kaydı | "Avukat Umut YÜCEL" — gerçek kişi | — |
| Kayıtlı adres | Meltem Mah. İsmail Baha Sürelsan Cad. Birlik Apt. No:21 K:8 D:25 Muratpaşa/Antalya | ✅ **birebir aynı** |
| Mesleğe başlama | 04/12/2019 | — |
| Büro unvanı | **belgede yok** | — |

### ✅ KARAR (13.08.2026, Av. Umut Yücel): unvan KALIYOR

**"Umut Yücel Hukuk Bürosu" kullanılmaya devam edecek.** Dayanak: AK m.43 — her avukat
levhaya yazıldıktan sonra bir **büro** kurmak zorundadır; tek kişilik büronun bu şekilde
anılması yerleşik kullanımdır. Baro yazısında ayrıca bir unvan kaydı bulunmaması, unvanın
yasaklandığı anlamına gelmez.

**Copilot için sonuç: unvanı hiçbir dosyadan KALDIRMAYIN.**
`<title>`, `manifest.webmanifest`, `index.html`, `js/buro.js`, `js/buro-bilgi.js`
olduğu gibi kalır. `unvan-degistir.sh` **çalıştırılmayacaktır.**

**Tek ayrıntı:** Cevap Robotu'nun tanımadığı kişilere giden KIRMIZI sabit metninde
kısa imza kullanılıyor — *"mesajınız Av. Umut Yücel'e ulaşmış"*. Bu, unvan kararıyla
çelişmez; kısa imza her hâlde teyitli olan biçimdir. Sitede unvan, robot taslağında
kısa imza — ikisi birlikte tutarlıdır.

**Not (kozmetik, davranışı etkilemez):** Dört robot görevinden üçünün prompt metninde
hâlâ 13.08 sabahına ait "BÜRO UNVANI KULLANILMAZ" paragrafı duruyor. Robotun ürettiği
metin her iki sürümde de aynı ("Av. Umut Yücel" imzası), yalnız açıklama cümlesi eski.
Bir sonraki oturumda dört görevin promptu tek metinde eşitlenecek. **Bu, siteyi ya da
müvekkile giden metni etkilemez.**

## 3. 🤖 Cevap Robotu — üç yoğunluk bandı (kuruldu)

İstenen "mesai içinde yarım saatte bir" **platform tarafından reddedildi**:
zamanlanmış görevlerde **asgari aralık 1 saattir** (`0,30 6-15 * * 1-5` →
`cron interval too short`). Bu bir tercih değil, sistem sınırıdır.

Sınır içinde kurulan düzen — **mesai yoğun · ara saatler olağan · gece çok az**:

| Görev | Cron (UTC) | Türkiye saati | Tur | Bant |
|---|---|---|---|---|
| **· Mesai** | `0 6-15 * * 1-5` | Hafta içi 09:00–18:00, saatlik | 10 | **yoğun** |
| **· Ara Saatler** | `0 3,5,16,18 * * *` | Her gün 06:00 · 08:00 · 19:00 · 21:00 | 4 | olağan |
| **· Hafta Sonu** | `0 7,9,11,13,15 * * 0,6` | Cmt/Paz 10:00–18:00, 2 saatte bir | 5 | olağan |
| **· Gece** | `0 19,22,1 * * *` | Her gün 22:00 · 01:00 · 04:00 | 3 | **çok az** |

**Çakışma yok:** Mesai 09–18 hafta içi; Ara 06/08 ve 19/21 (mesai dışı); Gece 22/01/04;
Hafta Sonu yalnız Cmt/Paz 10–18. Hiçbir saat iki görevde birden geçmiyor.

Günlük toplam: hafta içi **17 tur**, hafta sonu **12 tur**. Eskisi her gün 15 turdu
ve hepsi düz dağılıyordu; yük artık mesaiye kaymış durumda.

Her görevin promptunda kendi bandına özel not var: gece turunda "az önce/şu an" gibi
ana bağlı ifade yasak (taslak sabah gönderilecek); ara saat turunda randevu için mesai
saatine işaret ediliyor; hafta sonu turunda adliyenin kapalı olduğu ama CMK 91/94
sürelerinin işlediği yazılı.

### Daha hızlı yanıt gerçekten isteniyorsa

Görev sıklığı **yanıt hızını belirlemez**. Müvekkile giden ilk teyit Worker'ın
webhook'undan **anında** çıkar; zamanlanmış görev yalnız triyaj süpürgesidir.
Hızı belirleyen ayar `ACK_SOGUMA_SN=3600` (kişi başına 1 saat soğuma) — mesai içinde
1800'e indirilebilir. **Worker kodu değişikliğidir**, §4'e bakın.

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

## 6. 🔑 Müvekkil Bilgi Sistemi — 472 erişim kodu (COPILOT + KULLANICI)

Kod dağıtım altyapısı hazır. Eksik olan **üç ortam değişkeni**.

Cloudflare Dashboard → Workers & Pages → proje → **Settings → Environment variables**:

| Değişken | İçerik | Tür |
|---|---|---|
| `KODLAR` | `[{"ad":"...","tel":"...","eposta":"...","kod":"..."}, …]` | **Secret** |
| `WA_PHONE_ID` | `109650188830111` | Plain |
| `WA_TOKEN` | WhatsApp Cloud API kalıcı jetonu | **Secret** |

İsteğe bağlı: `KOD_KV` adında KV binding → IP başına dakikada 3 istek sınırı devreye girer.

### Copilot'un yapacağı hazırlık (jetonsuz kısım)

`KODLAR` değerini üretmek Copilot'un işidir; **girmek** kullanıcınındır. Adımlar:

1. `~/05_Bellek_Arsivi/PORTAL-DAGITIM/portal-kv-bulk.json` dosyasından
   `[{"ad","tel","eposta","kod"}]` biçiminde tek satırlık JSON üret.
2. Üretilen dosyayı **depoya koymayın** — `.gitignore` zaten `portal-kv-*.json`
   desenini süzüyor; yeni dosya da aynı desende adlandırılmalı.
3. Kullanıcıya tek adım bırakın: dosyayı açıp içeriği kopyalayıp Cloudflare
   arayüzünde `KODLAR` secret alanına yapıştırmak.
4. `WA_PHONE_ID` **gizli değildir** — `109650188830111` düz metin olarak girilir.
5. `WA_TOKEN`'ı Copilot **görmez ve üretmez**; Meta Business arayüzünden yalnız
   kullanıcı alır ve yapıştırır.

Doğrulama (jeton gerektirmez, herkes çalıştırabilir):

```bash
curl -s https://avumutyucelhukuk.com/api/kod-talebi
# beklenen: {"ok":true,"service":"kod-talebi"}
```

Üç değişken girildikten sonra eşleşen bir müvekkil için `durum` alanı
`"kuyruk"` yerine `"gonderildi"` dönmeye başlar. Dönmüyorsa değişkenler
yanlış isimle girilmiş demektir.

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
| 1 | `git push origin main` | **Copilot / kullanıcı** | ✅ 13.08 gecesi 4 commit gitti; yenileri bekliyor |
| 2 | Kilit artıklarını sil (`.git/*.lock.at*`) | **Kullanıcı** | Köprü silemiyor |
| 3 | `KODLAR` · `WA_TOKEN` · `WA_PHONE_ID` | **Yalnız kullanıcı** | Kimlik bilgisi + kişisel veri |
| 4 | Worker 4. şablon (§4) | Copilot | Dört koşul atlanmadan |
| 5 | `ACK_SOGUMA_SN` mesai içinde 1800 | Copilot | Tek gevşetme önerisi |
| 6 | Hukuki filtreye 7 kelime ekle (§5) | Copilot | |
| 7 | Künye tek kaynak refaktörü | Copilot | `COPILOT-KUNYE-TEK-KAYNAK.md` |
| 8 | Refaktör sonrası `ZORUNLU=1` | Copilot | `tools/kunye-denetle.sh` |
| 9 | Portal sunucu doğrulaması | Copilot + kullanıcı | `PORTAL-KURULUM.md` |
| 10 | ~~Unvan kararı~~ | ✅ **karar verildi** | Unvan KALIYOR — §2 |
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

**✅ 13.08.2026'da yapıldı — `pre-push` kancası kuruldu.** Gerekçesi şu: `pre-commit`
kancası `git commit --no-verify` ile atlanabiliyor ve **bir kez atlandı**; üçüncü site
gerilemesi tam o boşluktan girdi. Commit yereldir, **push canlıya gider** — asıl kapı
push'tur. Artık her `git push` öncesi `tools/index-denetle.sh` çalışıyor; başarısızsa
push durur.

Kanca dosyası: `.git/hooks/pre-push`. Git kancaları depoda taşınmaz — **yeni bir klon
yapılırsa bu dosya kopyalanmalıdır.** Bilinçli istisna: `git push --no-verify`.

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
