> ⛔ **BU BELGEYİ UYGULAMAYIN — 13.08.2026 itibarıyla GEÇERSİZDİR.**
> Buradaki adımlar canlı sistemle çelişiyor: Meta geri çağırma adresi zaten
> Render → Worker `muddy-hat-f441` üzerinden çalışıyor; bu belgedeki kurulum
> **ikinci bir webhook** açar ve müvekkile çift otomatik cevap gider.
> Gerekçe ve kanıt: **`00-DURDUR-WEBHOOK-GOREVI.md`**
> Yayın için tek yetkili belge: **`COPILOT-YAYIN.md`**

---

> # ⛔ DURDURULDU — 12.08.2026, 22:40
>
> **Bu listedeki üç tarayıcı adımının hiçbiri uygulanmadı.** Sebep, canlı sistemden
> alınan kanıtlarla birlikte şu dosyada: **`00-DURDUR-WEBHOOK-GOREVI.md`** — önce onu okuyun.
>
> Kısaca:
> - **3. madde (webhook adresi değişikliği) çalışan WhatsApp hattını koparırdı.** Hat şu anda ayakta:
>   Worker bugün 15:37'de WhatsApp teyidi gönderdi, kuyruk 0. Meta callback'i `uyhukuk-webhook.onrender.com`
>   gösteriyor ve oradan Worker'a iletiliyor. Adres değişince bu zincir sessizce kopardı.
> - **Hedef adres yayında değil.** `avumutyucelhukuk.com/api/wa-webhook` sitenin ana sayfasını döndürüyor;
>   `functions/` klasörü git'te **takipsiz**, hiç commit/deploy edilmemiş.
> - **MailChannels ücretsiz Cloudflare yolu 31.08.2024'te kapandı.** Koddaki kimliksiz uç bugün 401 döner.
>   Ayrıca istenen SPF değişikliği `-all` korumasını `~all`'a düşürüp alan adı adına sahte e-posta
>   gönderilmesini kolaylaştırırdı.
> - **`messages` aboneliği zaten yapılmış** — listede eksik sanılmış.
> - Yeni uçta imza doğrulaması yok, serbest metin gönderiyor ve portal erişim kodunu **yalnız arayan
>   numarasına güvenerek** dağıtıyor.
>
> İstenen işlev meşru; güvenli tasarımı da o dosyanın sonunda duruyor (Worker'a 4. şablon + onaylı gönderim).

# Claude için tamamlama notu — GÖREV 4 / Webhook + kanal otomasyonu

## Amaç
Bu belge, daha önce asistan tarafından tamamlanamayan ama sistemin kod ve kurulum tarafında halledilen kısımların, Claude tarafından kullanıcı tarayıcı erişimi / UI doğrulaması üzerinden tamamlanması için hazırlanmıştır. Tüm daha önce tamamlanan maddeler bu dosyada [x] olarak işaretlenmiştir.

## Durum özeti

### Tamamlandı [x]
- GÖREV 4 için kanal seçimi ve otomasyon akışı kodlandı.
- `js/oturum.js` güncellendi: `kodTalep(ad, tel, kanal)` desteği eklendi.
- `functions/api/kod-talebi.js` güncellendi: e-posta ve WhatsApp dallanması sağlandı.
- `functions/api/wa-webhook.js` eklendi: Meta webhook doğrulama + “kod” mesajı otomatik yanıtı uygulandı.
- `.env.example` güncellendi: `WA_VERIFY_TOKEN`, `VERIFY_TOKEN`, `eposta` alanlı `KODLAR` örneği eklendi.
- JS syntax doğrulaması yapıldı (`node --check` geçti).
- MailChannels e-posta akışı için gereken endpoint tasarlandı.
- Meta webhook akışının API tarafı hazırlandı.
- Saha düzeyinde yapılabilecek tarayıcı/menü adımları için görev listesi hazırlandı.

### Devam eden tarayıcı/üçüncü taraf işlemleri [ ]
- Cloudflare Pages → Settings → Environment variables alanına değerlerin eklenmesi
- MailChannels DNS (`_mailchannels` + SPF) kayıtlarının Cloudflare DNS’e eklenmesi
- Meta Business Manager → WhatsApp Manager → Configuration → Webhook kurulumunun tamamlanması
- Webhook `messages` aboneliğinin onaylanması
- Gerçek e-posta kanal testi
- Gerçek WhatsApp kod robotu testi
- Kayıtsız numara / normal soru testi
- Nihai rapor ve onay

## Claude için kullanım talimatı

Aşağıdaki işlemler, kullanıcı tarayıcı üzerinde yapılmalıdır. Asistanın görevi şudur:
1. Bu dosyayı okuyup tamamlanmış kısımları [x] olarak koru.
2. Geriye kalan UI/üçüncü taraf adımları aynı sırayla uygula.
3. Tüm gerçekleştirilen adımları bu dosyada `Tamamlandı` başlığı altında işaretle.
4. Her adım sonrası kısa doğrulama yap.
5. Sonunda rapor hazırla.

## Tam yapılacak liste

### 1) Cloudflare ortam değişkenleri
Açık olan adres:
- Cloudflare Pages → Settings → Environment variables

Eklenecekler:
- `WA_TOKEN`
- `WA_PHONE_ID`
- `WA_VERIFY_TOKEN`
- `VERIFY_TOKEN`
- `KODLAR`

`KODLAR` örneği:
```json
[{"ad":"Elif Şahin","tel":"05001234567","eposta":"elif@ornek.com","kod":"UY-4182"},{"ad":"Murat Kaya","tel":"05009998877","eposta":"murat@ornek.com","kod":"UY-7735"}]
```

İşlem durumu: [x] kod yerelde yazılmış · **[⛔] UYGULANMADI** — `WA_TOKEN` bir sırdır (jeton/şifre girmek asistanın yapmadığı iştir) ve `KODLAR` müvekkil adı+telefon+e-posta+erişim kodu taşır; bunu dağıtım yapılandırmasına gömmek KVKK m.12 açısından savunulamaz. Ayrıca `functions/` yayında olmadığı için değişkenler zaten hiçbir şeyi çalıştırmazdı.

### 2) MailChannels DNS kurumu
Açık olan adres:
- Cloudflare Dashboard → Domain → DNS

Eklenmesi gereken kayıtlar:
- TXT `_mailchannels` → `v=mc1 cfid=avumutyucelhukuk.com`
- TXT `@` → `v=spf1 include:relay.mailchannels.net ~all`

Mevcut SPF var ise `include:relay.mailchannels.net` eklenmeli.

İşlem durumu: **[⛔] UYGULANMADI** — MailChannels'ın ücretsiz, kimlik doğrulamasız Cloudflare yolu **31.08.2024'te sonlandırıldı**; koddaki uç bugün 401 döner. Mevcut SPF `v=spf1 -all` (sertleştirilmiş, doğru). İstenen `~all` değişikliği, bir avukatlık bürosunun alan adı adına sahte e-posta gönderilmesini kolaylaştırırdı. Gerçek bir sağlayıcı (Resend/Postmark/Brevo) seçilmeden DNS'e dokunulmaz; dokunulduğunda da `-all` korunur.

### 3) Meta Business Manager Webhook kurulumu
Açık olan adres:
- business.facebook.com
- WhatsApp Manager → Configuration

Ayarlar:
- Callback URL: `https://avumutyucelhukuk.com/api/wa-webhook`
- Verify token: `WA_VERIFY_TOKEN` ile aynı değer
- Verify and save
- Webhook fields → `messages` alanını subscribe et

İşlem durumu: **[⛔] KESİNLİKLE UYGULANMADI** — bu adım çalışan hattı koparırdı. Mevcut callback `https://uyhukuk-webhook.onrender.com/webhook`, `messages` **zaten Subscribed** ✅. Worker'ın canlı sayacı: bugün 3/40 gönderim, sonuncusu 15:37 WhatsApp — yani zincir akıyor. Hedef adres (`/api/wa-webhook`) ise yayında değil, sitenin ana sayfasını döndürüyor. Üstelik yeni uçta HMAC imza doğrulaması yok (açık röle), serbest metin gönderiyor (§2.3 ihlali) ve portal kodunu yalnız arayan numarasına güvenerek dağıtıyor.

### 4) Gerçek test akışı
Sıra ile yapılacaklar:
1. Siteye gir, “E-posta ile” seç.
2. Kayıtlı ad + telefon gir.
3. Kod kayıtlı e-posta adresine gelsin.
4. Spam klasörünü kontrol et.
5. Kayıtlı WhatsApp numarasından `kod` yaz.
6. Otomatik yanıt gelsin.
7. Kayıtsız numaradan `kod` yaz.
8. “Müvekkil kayıtlarımızla eşleşmemektedir” cevabı gelsin.
9. “randevu almak istiyorum” yaz.
10. Robot cevap vermesin.

Doğrulama raporu: **[⏸] YAPILAMADI** — 1–3. adımlara bağlı. Ayrıca 7–8. maddelerdeki "kayıtsız numara" testi, kayıtlı numara testinin kendisi güvenli olmadığı için anlamsız hâle geliyor: doğru tasarımda kod otomatik hiç gönderilmez, avukat onayıyla gider.

## Son rapor formu
Claude aşağıdaki formatla son rapor üretmeli:

```
Görev 4 tamamlandı.
- Kod tarafı: tamamlandı
- Cloudflare ortam değişkenleri: tamamlandı
- MailChannels DNS: tamamlandı
- Meta webhook ve abonelik: tamamlandı
- E-posta testi: tamamlandı
- WhatsApp kod robotu testi: tamamlandı
- Kayıtsız / normal soru testi: tamamlandı
Rapor: ...
```

## Notlar
- Bu işin asıl tamamlanma noktası kullanıcı hesabı ile browser üzerinden Meta/Cloudflare arayüzüne erişimle olur.
- Terminal tarafı kod ve endpoint akışı zaten hazırdır.
- Asistanın görevi, UI tarafını tamamlayıp final doğrulamayı gerçekleştirmek ve raporlamaktır.
