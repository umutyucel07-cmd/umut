# Otomatik Arama Yanıtı — kurulum ve metinler

**Av. Umut Yücel — Antalya Barosu, sicil no 6448**
Hazırlanma: 13.08.2026 · Reklam yasağı denetiminden geçmiştir (karar: YAYINLANABİLİR)

---

## 1. Nasıl çalışır

Gelen aramayı reddederken **kırmızı tuş yerine "Mesaj" tuşuna** basarsınız. Ekranda
kayıtlı üç metin çıkar, birine dokunursunuz — arayan kişiye o anda gider.

- Arayan iPhone kullanıyorsa **iMessage** olarak gider (ücretsiz).
- Diğer telefonlarda **SMS** olarak gider (operatör tarifesi).
- Uygulama gerekmez, abonelik yoktur, arama kaydınıza kimse erişmez.

**Tek fark:** tam otomatik değil, reddederken bir dokunuş gerektirir. iOS'ta
"cevapsız aramada kendiliğinden SMS gitsin" diye bir özellik yoktur — bu bir ayar
eksikliği değil, işletim sistemi sınırıdır.

---

## 2. Kurulum — 6 adım

1. **Ayarlar** uygulamasını açın
2. **Telefon**'a dokunun
3. **Metinle Yanıtla** (Respond with Text) satırına dokunun
4. Üç hazır metin görürsünüz — üzerine dokunup silin, aşağıdaki metinleri yazın
5. Yazdıkça kendiliğinden kaydolur, ayrı bir kaydet tuşu yoktur
6. Çıkın

**Kullanım:** Arama geldiğinde ekranı yukarı kaydırın → **Mesaj** → uygun metne dokunun.
Telefon kilitliyken de çalışır.

---

## 3. Metinler

### Metin 1 — genel (varsayılan)

```
Sayın ilgili, şu an görüşme sağlayamıyorum. Bu numaraya WhatsApp'tan yazmanız hâlinde mesajınız kaydedilir ve en kısa sürede tarafınıza dönüş yapılır.

Av. Umut Yücel, Antalya Barosu — sicil no 6448
```

### Metin 2 — duruşma / adliye günleri

```
Sayın ilgili, şu an duruşmada olduğumdan görüşme sağlayamıyorum. Bu numaraya WhatsApp'tan yazmanız hâlinde mesajınız kaydedilir ve gün içinde tarafınıza dönüş yapılır.

Av. Umut Yücel, Antalya Barosu — sicil no 6448
```

### Metin 3 — aynı gün dönüş yapılamayacaksa

```
Sayın ilgili, şu an görüşme sağlayamıyorum ve bugün dönüş yapamayabilirim. Bu numaraya WhatsApp'tan yazmanız hâlinde mesajınız kaydedilir ve ilk fırsatta tarafınıza dönülür.

Av. Umut Yücel, Antalya Barosu — sicil no 6448
```

---

## 4. Neden bu üç metin böyle yazıldı

**"WhatsApp'tan yazmanız hâlinde mesajınız kaydedilir"** cümlesi bilerek seçildi ve
doğrudur: bu numaraya gelen mesaj Cloudflare Worker üzerinden Notion "Gelen Talep
Havuzu"na düşer. Yani söz verilen şey gerçekten oluyor — arayan kişi boşluğa yazmıyor.

**Metin, mevcut WhatsApp otomatik teyidiyle uyumludur.** Kişi arar, bu mesajı alır,
sonra WhatsApp'tan yazarsa Worker `alindi` teyidini gönderir. İkisi çelişmez: birincisi
"şu an müsait değilim, yazın", ikincisi "mesajınız ulaştı". Zincir tutarlıdır.

**Sistem kuralı Y-3 ile çatışmaz.** Y-3 *kendiliğinden çalışan* ikinci bir otomatik
yanıt kaynağını yasaklar (Zapier, Business Suite otomasyonu, telefonun karşılama
mesajı). Bu metinler her seferinde sizin dokunuşunuzla gider — otomatik kaynak
değil, elle gönderilen tek mesajdır. Telefondaki **karşılama mesajı kapalı kalmaya
devam eder**.

---

## 5. Reklam yasağı denetimi

**KARAR: YAYINLANABİLİR**

| Kontrol | Bulgu |
|---|---|
| A-8 ücret, indirim, "ücretsiz görüşme" | Yok |
| A-9 iş çağrısı ("danışmak için yazın", "hemen ara") | Yok — kişi zaten aramıştır, bu yanıttır |
| A-7 üstünlük/uzmanlık iddiası | Yok |
| A-6 dava sonucu, başarı oranı | Yok |
| A-5 müvekkil adı, referans | Yok |
| A-11 talep edilmemiş toplu gönderim | Hayır — arayan kişiye tek tek yanıt |
| A-12 ısrarlı ikinci temas | Hayır — ilk ve tek yanıt |
| C-21 künye kapalı listesi (m.7/d) | İçinde: ad-soyad + baro + sicil no |

**Bilerek dışarıda bırakılanlar:**

- **Faaliyet alanları** (aile hukuku, iş hukuku vb.). Teknik olarak m.7/d'de
  "uzmanlık anlamına gelmemek üzere" izinlidir, ancak otomatik mesajda hizmet
  sayımına yaklaşır ve **RİSKLİ** olur. Sitede yazılabilir, bu mesajda yazılmaz.
- **Büro unvanı.** Ortalıkta altı varyant dolaşıyor ve baroya kayıtlı ad yazılı
  olarak teyit edilmedi. Teyit gelene kadar dışa dönük metinde kullanılmaz.
- **Adres, e-posta, KEP.** Kapalı listede izinlidir ama SMS'i uzatır ve arayan
  kişinin ihtiyacı değildir; WhatsApp kanalı zaten gösterilmiştir.

---

## 6. Bilinmesi gereken iki pratik nokta

**SMS uzunluğu.** Türkçe karakter (ç, ğ, ı, ö, ş, ü) içeren SMS'ler 160 değil
**70 karakterlik** parçalara bölünür. Yukarıdaki metinler 3 parça civarındadır.
Arayan iPhone kullanıyorsa iMessage gider, ücret yoktur. Maliyet endişesi varsa
Metin 1 kısaltılabilir — ama avukat imzası taşıyan bir metinde Türkçe karakterleri
kaldırmayı önermem.

**Bu metinler müvekkil ayrımı yapmaz.** Kim ararsa arasın aynı metin gider. Hassas
bir bilgi içermediği için sakıncası yoktur; künye bilgisi zaten kartvizitte ve sitede
açıktır.

---

## 7. İsterseniz eklenebilecek dördüncü katman

15 saniyede kendiliğinden sesli mesaja düşme, operatör kodu ile ayrıca kurulabilir:

```
**61*<sesli mesaj numarası>**15#
```

Süre 5–30 saniye arası, 5'in katları. Turkcell yönlendirilen arama başına
1,19 TL (KDV-ÖİV dahil) alır. Bu, "Mesaj" tuşuna basmaya fırsat bulamadığınız
durumlar için bir yedektir; ikisi birlikte çalışabilir.
