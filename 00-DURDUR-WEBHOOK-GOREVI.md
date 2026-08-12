# ⛔ DURDUR — `CLAUDE-TAMAMLANDI-ISLEM-LISTESI.md` uygulanmadı

**12.08.2026, 22:40** · Denetimi yapan: Claude (Cowork) · Karar: **listedeki üç maddenin hiçbiri uygulanmadı**

Bu belge, `CLAUDE-TAMAMLANDI-ISLEM-LISTESI.md` dosyasındaki tarayıcı adımlarının neden
uygulanmadığını, her biri için **canlı sistemden alınmış kanıtla** açıklar.

> Belge kötü niyetle yazılmamış; kod tarafı özenli. Sorun şu: **belge, canlı sistemin
> gerçek hâlini bilmeden yazılmış.** Üç adımın ikisi çalışan bir hattı koparıyor,
> biri iki yıl önce kapanmış bir servise dayanıyor.

---

## Özet tablo

| Liste maddesi | Karar | Tek cümlelik sebep |
|---|---|---|
| 1) Cloudflare Pages ortam değişkenleri | ⛔ **Yapılmadı** | `WA_TOKEN` bir sır — jeton/şifre girmek benim yapmadığım iş; ayrıca `KODLAR` müvekkil kişisel verisi |
| 2) MailChannels DNS kayıtları | ⛔ **Yapılmadı** | MailChannels'ın ücretsiz Cloudflare yolu **31.08.2024'te kapandı**; üstelik değişiklik SPF'nizi zayıflatır |
| 3) Meta webhook adresini değiştirme | ⛔ **KESİNLİKLE yapılmadı** | **Çalışan WhatsApp hattını koparırdı** — kanıt aşağıda |
| 3b) `messages` aboneliği | ✅ **Zaten yapılmış** | Canlıda "Subscribed" görüldü; listede eksik sanılmış |
| 4) Gerçek testler | ⏸ Yapılamadı | 1–3'e bağlı |

---

## Kanıt 1 — Hedef adres yayında değil

Liste, webhook'un `https://avumutyucelhukuk.com/api/wa-webhook` adresine
alınmasını istiyor. O adres canlıda **sitenin ana sayfasını** döndürüyor:

```
GET https://avumutyucelhukuk.com/api/wa-webhook?hub.mode=subscribe&...
→ sayfa başlığı: "Av. Umut Yücel · Umut Yücel Hukuk Bürosu — Antalya"
```

Yani Pages Function çalışmıyor, SPA yedeği dönüyor. Sebebi de belli:

```
$ git status --porcelain
?? functions/          ← hiç commit edilmemiş, hiç yayına gitmemiş
```

`functions/` klasörü **git'te takipsiz.** "Kod tarafı hazır" doğru; ama
*"hazır"* ile *"yayında"* aynı şey değil. Webhook adresini yayında olmayan bir
uca çevirmek, hattı **sessizce** kapatırdı — Meta hata da vermezdi, çünkü site
200 dönüyor.

---

## Kanıt 2 — Şu anki hat çalışıyor ve mimari belgelendiğinden farklı

Meta uygulamasındaki gerçek durum (canlıda okundu):

| Ürün | Callback URL | Abonelik |
|---|---|---|
| **Whatsapp Business Account** | `https://uyhukuk-webhook.onrender.com/webhook` | `messages` ✅ **Subscribed** |
| **Instagram** | `https://muddy-hat-f441.umutyucel07.workers.dev/giris/…` | aktif |

Worker'ın canlı durumu (`/sync` ucundan, salt okuma):

```json
{ "sayi": 0,
  "gonderim": { "bugun": 3, "tavan": 40, "anahtar": "acik",
    "son": { "tarih": "2026-08-12T12:37:32Z", "kanal": "whatsapp",
             "sablon": "alindi", "sonuc": "gönderildi" } } }
```

**Buradan çıkan sonuç:** son gönderim bugün 15:37'de (TR saati) **WhatsApp**
kanalından yapılmış. Yani WhatsApp mesajları Worker'a ulaşıyor. Callback Render'ı
gösterdiğine göre **Render, gelen webhook'u Worker'a iletiyor.**

Hat şu anda **ayakta ve çalışıyor.** Callback adresini değiştirmek şunları
aynı anda durdururdu:

- Notion talep havuzuna kayıt
- Kişi rehberi kenar filtresi (şahsi numaralar elenmez olurdu)
- Otomatik "alındı" teyidi
- Cevap Robotu'nun beslemesi
- 7 günlük kuyruk

### ⚠️ Ayrıca ortaya çıkan iki bulgu

**(a) Belgelenmemiş bir sunucu var.** `umut-yucel-sistem` becerisi §2.2 "tek
callback URL → Worker" diyor. Gerçek bu değil: WhatsApp yolunda **Render'da bir
ara sunucu** var. Bu tek başına yanlış değil, ama:

- hiçbir belgede yazmıyor — bir sonraki oturum yine yanlış varsayımla çalışır
- **tek arıza noktası**: Render ücretsiz katmanı uyku moduna girer veya servis
  düşerse hat sessizce susar, kimse fark etmez
- Worker'ın HMAC doğrulaması ancak Render imza başlığını **aynen** iletiyorsa
  çalışır; iletmiyorsa doğrulama fiilen devre dışıdır

**Sizden gereken tek bilgi:** `uyhukuk-webhook.onrender.com` sunucusunu siz mi
kurdunuz? Cevaba göre ya belgeye işlerim ya da kaldırıp callback'i doğrudan
Worker'a alırım (bu, hattı sadeleştirir ve arıza noktasını siler).

**(b) `ERISIM_TOKEN` bir URL'nin içinde duruyor.** Instagram callback adresi
`…/giris/b376a4f2…` biçiminde ve bu jeton Worker'ın `/sync` ve `/rehber`
uçlarını da açıyor. Meta arayüzünde açık metin görünüyor. Tasarım gereği böyle,
ama **jetonu göreni sistem durumunu okuyabilir** — bunu bilerek taşıyın.

---

## Kanıt 3 — Yeni uç güvenlik açığı getiriyor

`functions/api/wa-webhook.js` yayına alınsaydı, Worker'da olan üç koruma orada
**olmayacaktı**:

| Koruma | Worker (canlı) | Önerilen yeni uç |
|---|---|---|
| İmza doğrulama (`x-hub-signature-256` HMAC) | ✔ var | ✘ **yok** |
| Hukuki anahtar kelime filtresi | ✔ 36 kelime | ✘ yok |
| Kişi rehberi (şahsi/sistem numarayı eler) | ✔ var | ✘ yok |
| Gönderim tavanı / soğuma / kapatma anahtarı | ✔ 40/gün, 1 saat, KV anahtarı | ✘ yok |
| Serbest metin yasağı | ✔ yalnız 3 sabit şablon | ✘ **serbest metin gönderiyor** |

İmza doğrulaması olmaması demek: **adresi öğrenen herkes sahte "mesaj geldi"
gövdesi gönderip sizin hattınızdan WhatsApp mesajı çıkartabilir.** Açık röle.

Serbest metin göndermesi ayrı bir konu: bu, `umut-yucel-sistem` §2.3'ün
yasakladığı **ikinci otomatik yanıt kaynağıdır** — bu sabah saatlerce peşinde
koştuğumuz *"ilk 15 dakika ücretsizdir"* mesajını üreten hata sınıfının tam
kendisi.

---

## Kanıt 4 — En ciddi madde: portal kodu dağıtımı

Yeni uç, WhatsApp'tan "kod" yazan **numarası eşleşen herkese** müvekkil portal
erişim kodunu otomatik gönderiyor:

```js
const kim = String(msg.from||'').replace(/\D/g,'').slice(-10);
const match = kayitlar.find(x => String(x?.tel||'').replace(/\D/g,'').endsWith(kim));
// eşleşirse → kodu gönder
```

Tek doğrulama **arayan numarası.** Bu şu demek: bir müvekkilin WhatsApp hesabı
ele geçirilirse, saldırgan "kod" yazıp o müvekkilin **dosya portalı erişim
kodunu** alır.

**Bunu teorik bir risk olarak yazmıyorum:** bugün 06:37'de hattınıza gelen
40.000 TL'lik mesaj, WhatsApp hesap ele geçirme dolandırıcılığının klasik
deseniydi. Aynı gün, aynı hatta, sadece numaraya güvenen bir kod dağıtıcısı
açmak doğru olmaz. Av.K. m.36 (sır saklama) ve KVKK m.12 (veri güvenliği)
açısından savunulabilir değil.

Ayrıca `KODLAR` ortam değişkeni **müvekkil adı + telefon + e-posta + erişim
kodunu** düz metin olarak taşıyor. Bunu bir ortam değişkenine koymak, müvekkil
listesini dağıtım yapılandırmasına gömmek demektir.

---

## Kanıt 5 — E-posta kanalı iki yıl önce ölmüş

`functions/api/kod-talebi.js` şu uca istek atıyor:

```js
fetch('https://api.mailchannels.net/tx/v1/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },   // ← kimlik doğrulama başlığı YOK
  ...
```

MailChannels, Cloudflare Workers için **ücretsiz ve kimlik doğrulamasız** e-posta
gönderimini **31 Ağustos 2024'te sonlandırdı**; o tarihten beri kimliksiz
istekler reddediliyor. Yani bu kod bugün yayına alınsa **401/403 döner, tek bir
e-posta gitmez.**

### DNS değişikliği ayrıca zararlı olurdu

Alan adınızın bugünkü SPF kaydı:

```
avumutyucelhukuk.com.  TXT  "v=spf1 -all"
```

`-all` = **"bu alan adından hiç mail çıkmaz, çıkanı reddedin."** Büro Gmail ve
KEP kullandığı için bu **doğru ve sertleştirilmiş** ayardır: kimse
`@avumutyucelhukuk.com` adına sahte e-posta gönderemez.

Liste bunu `v=spf1 include:relay.mailchannels.net ~all` yapmayı istiyor —
yani `-all` (reddet) yerine `~all` (yumuşak uyarı). Bu, **bir avukatlık bürosunun
alan adı adına sahte e-posta gönderilmesini kolaylaştırır.** Müvekkile
"büronuzdan" gelen sahte bir e-posta, telafisi zor bir olaydır. Çalışmayan bir
servis için bu takası yapmam.

---

## Ne yapılmalı — güvenli tasarım

İstenen işlev meşru: **müvekkil portal kodunu kendisi alabilsin.** Doğru yol
ikinci bir sunucu değil, **var olan Worker'a dördüncü bir şablon**.

### Adım 1 — Uç değil, şablon ekle

Worker'a `portal_kodu` diye 4. şablon eklenir. Böylece:
imza doğrulaması ✔ · rehber filtresi ✔ · günlük tavan ✔ · soğuma ✔ ·
kapatma anahtarı ✔ · serbest metin yasağı ✔ — hepsi otomatik geçerli olur.
İkinci sunucu, ikinci jeton, ikinci callback yok.

### Adım 2 — Ama kodu otomatik gönderme

Numara tek başına kimlik değildir. İki seçenekten biri:

- **(a) Onaylı gönderim (önerilen):** Müvekkil "kod" yazınca Worker size bildirim
  düşer, tek dokunuşla onaylarsınız. Ele geçirilmiş hesap kodu alamaz.
- **(b) İkinci unsur:** Kod isteyen, **dosya esas numarasını** da yazsın.
  Numara + esas no eşleşirse gönderilir. Saldırganın esas noyu bilmesi gerekir.

### Adım 3 — E-posta isteniyorsa gerçek bir sağlayıcı

MailChannels yerine Resend / Postmark / Brevo — API anahtarıyla. **Anahtarı siz
girersiniz.** Ancak o zaman DNS'e dokunulur ve dokunulurken:

```
v=spf1 include:<sağlayıcı> -all      ← -all KORUNUR, ~all yapılmaz
```

artı DKIM ve DMARC. Sağlayıcı seçilmeden DNS'e dokunmak erken.

### Adım 4 — Render sorusunu kapatın

Bana `uyhukuk-webhook.onrender.com`'u kimin kurduğunu söyleyin. Sizinse belgeye
işlerim. Değilse ya da gereksizse callback'i doğrudan Worker'a alırım —
hat sadeleşir, arıza noktası ve belgesiz hop ortadan kalkar.

---

## Dokunulmayanlar — hiçbir şey değiştirilmedi

- Meta webhook ayarları: **okundu, değiştirilmedi**
- Cloudflare ortam değişkenleri: **açılmadı**
- DNS: **okundu, değiştirilmedi**
- `functions/` klasörü: **commit edilmedi, yayına alınmadı**
- Worker: **okundu, dağıtılmadı**

Tek yazılan şeyler: bu belge ve görev listesindeki kutucukların gerçek duruma
göre işaretlenmesi.
