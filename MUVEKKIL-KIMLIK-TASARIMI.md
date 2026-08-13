# Müvekkil kimliği — kod yenileme tasarımı (B seçeneği)

**13.08.2026 · Av. Umut Yücel**
`KODLAR` ortam değişkeni **oluşturulmayacak.** Gerekçe, tasarım ve doğrulama aşağıda.

---

## 0 · Kodu yazarken bulunan iki şey

Bu iş "KODLAR'ı yaratmadan kod dağıtımını çözelim" diye başladı. Kodu yazmak için
mevcut giriş akışını okuduğumda iki şey çıktı; ikisi de tasarımın kapsamını değiştirdi.

### Bulgu 1 — Giriş doğrulaması tarayıcıda yapılıyordu

`js/oturum.js` girilen erişim kodunu `window.MUVEKKILLER` dizisiyle karşılaştırıyordu.
O dizi `js/buro-bilgi.js` içindeydi ve **herkese açık yayınlanıyordu.**

O gün listede yalnız iki kayıt vardı — `Elif Şahin (UY-4182)` ve `Murat Kaya (UY-7735)`.
İkisini de büro kayıtlarında aradım: `buro.sqlite`, müvekkil portföyü ve dosya
listelerinde **ikisi de yok**; sicil numaraları (`MV-2026-0184`, `MV-2026-0207`) hiçbir
yerde geçmiyor; dosya numaraları farklı mahkeme ve dava türlerine ait.
**Örnek kayıtlar. Fiilî bir sızıntı doğmadı.**

Asıl mesele o değil. Dosyanın kendi yorumu şunu diyordu:

> *"Yeni müvekkil eklemek için bu listeye bir satır yazıp siteyi yeniden derlemek yeterlidir."*

Bu talimat izlenseydi 472 müvekkilin **adı, erişim kodu, telefon son dördü, sicil
numarası ve dava geçmişi** herkesin indirebileceği bir `.js` dosyasına girecekti.
Kurulmuş ama patlamamış bir tuzaktı. Bugün kapattığım belge sızıntısından
kat kat ağırdı — çünkü orada mühendislik belgesi vardı, burada müvekkil dosyası olacaktı.

Aynı dosyada ikinci bir sızıntı daha vardı: `kodTalep` girilen ad+telefonun kayıtlı
olup olmadığını **tarayıcıda** yanıtlıyordu. Liste boş olsa bile bu bir **sayım aracıdır**;
tek tek deneyerek kimin müvekkil olduğu öğrenilebilirdi.

### Bulgu 2 — WhatsApp gönderimi hatalı numaraya gidecekti

Mevcut `kod-talebi.js` içinde:

```js
const to = '9' + String(match.tel || '').replace(/\D/g, '').slice(-10);
```

Türkiye ülke kodu **90**, "9" değil. `0532 000 00 00` → `95320000000` (11 hane);
doğrusu `905320000000` (12 hane). `WA_TOKEN` tanımlı olmadığı için bu satır canlıda
**hiç çalışmamıştı** — jeton girildiği gün her gönderim sessizce hatalı numaraya
gidecekti. Deneme senaryosu yakaladı, düzeltildi.

---

## 1 · Neden A değil B

| | **A — kod listesi** | **B — kod yenileme** |
|---|---|---|
| Depolama | 472 müvekkilin `{ad, tel, kod}` listesi `KODLAR` içinde **düz metin** | Düz metin **yok**; yalnız biberli özet |
| Kod nerede | Ortam değişkeninde, panelde okunabilir | Hiçbir yerde. Yalnız özeti saklanır |
| "Kodumu unuttum" | Aynı kod tekrar gönderilir | **Yeni kod** üretilir, eskisi ölür |
| "Kodum çalındı" | Elle müdahale gerekir | Aynı işlem — ayrı bir süreç yok |
| Panel sızarsa | 472 müvekkilin adı, telefonu, kodu açığa çıkar | Özetler açığa çıkar; kodlar zaten yok |

B'de `KODLAR` **hiç oluşturulmaz.** Kalan tek sır `WA_TOKEN` olur.

---

## 2 · Nasıl çalışıyor

```
Müvekkil → siteye ad + telefon yazar
   │
   ├─ /api/kod-talebi
   │    · ad+telefonu biberleyip özetler → mv:<özet> anahtarını KV'de arar
   │    · eşleşirse YENİ kod üretir (UY-XXXX-XXXX)
   │    · ÖNCE WhatsApp'a gönderir, SONRA eski kodun özetini siler
   │    · yanıtta kodu DÖNDÜRMEZ
   │
Müvekkil → kodu siteye girer
   │
   └─ /api/giris
        · kodu biberleyip özetler → kod:<özet> anahtarını arar
        · bulursa YALNIZ o müvekkilin kendi kaydını döner
        · dakikada 8 / saatte 40 deneme sınırı
```

**KV'de duranlar**

| Anahtar | İçerik |
|---|---|
| `sys:biber` | Sunucunun ilk çalışmada ürettiği 32 baytlık biber |
| `sys:dizin` | `{adet, t}` — dizin yüklendi mi |
| `mv:<özet>` | Müvekkilin kendi kaydı (ad, telefon, sicil, dosyalar) |
| `kod:<özet>` | `{mv: "mv:<özet>"}` — 180 gün ömürlü |

### Kod biçimi genişletildi: `UY-0000` → `UY-XXXX-XXXX`

`UY-0000..UY-9999` = 10.000 olasılık. **472 müvekkile kod verildiğinde rastgele TEK
bir tahminin BİRİNİN hesabına düşme ihtimali %4,7'dir.** Deneme sınırı bunu yavaşlatır
ama kabul edilebilir yapmaz — müvekkil dosyası için bu oran savunulamaz.

Yeni alfabede (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ` — karışan `I O 0 1` yok) 32⁸ ≈ **1,1 × 10¹²**
olasılık var. **Kodlar henüz dağıtılmadı**; biçimi genişletmek için doğru an burasıydı.
Eski biçim geriye dönük olarak hâlâ okunur, ama yeni kod o biçimde üretilmez.

### Biber ne yapar, ne yapmaz

Biber **sunucuda** üretilir ve KV'de durur: hiçbir insanın eline geçmez, sohbete
düşmez, panele elle girilmez — yani bir "sır girme" adımı doğurmaz.
**Sınırı da açık:** KV'nin tamamı sızarsa biber de sızar. Biber sözlük saldırısına ve
kısmi sızıntıya karşıdır, tam dökümüne karşı değildir.

---

## 3 · Müvekkil dizini nasıl yüklenir

`tools/muvekkil-yukle.js` **yalnız avukatın kendi bilgisayarında** çalışır.
Düz metin liste o makineden çıkmaz: git'e girmez (`_Veri/` zaten `.gitignore`'da),
sohbete düşmez, panele yapıştırılmaz.

```bash
node tools/muvekkil-yukle.js --dosya ~/…/_Veri/muvekkil-portal.json --kv <KV_ID> --kuru
node tools/muvekkil-yukle.js --dosya ~/…/_Veri/muvekkil-portal.json --kv <KV_ID>
```

`--kuru` hiçbir şey yazmaz; sayar, doğrular, çakışma arar. Araç yüklemeden **önce**
denetler: boş ad, 10 haneye inmeyen telefon, aynı ad+telefonun iki kez geçmesi ve
`kod` alanı bırakılmış kayıtlar. Sorun varsa **hiçbir şey yazılmaz** — yarım yükleme
en kötü sonuçtur.

Araç kod üretmez, okumaz, göstermez. Kod, müvekkil talep ettiği anda üretilir.

---

## 4 · Doğrulama

`tools/kimlik-denemesi.sh` — sahte KV ve sahte WhatsApp ile **23 senaryo**. Ağ ve sır
gerektirmez, hiçbir yere yazmaz. `tools/index-denetle.sh` bunu her commit'te koşturur.

Kapsadıkları arasında:

- KV yokken giriş **"kod yanlış" demez** — "hazır değil" der. *(12.08'de canlıda tam
  tersi bir yalan söylenmişti: müvekkile "kodunuz gönderildi" deniyordu ama hiçbir şey
  gönderilmiyordu.)*
- Dizin boşken kod talebi **kuyruğa** alınır, "eşleşmedi" **denmez**.
- Yanıt gövdesinde kod **geçmez**; yalnız WhatsApp mesajında geçer.
- Giriş yanıtında müvekkilin **telefonu dönmez**.
- İkinci talep yeni kod üretir; **eski kod ölür**.
- WhatsApp yapılandırılmamışsa **kod üretilmez** — müvekkilin çalışan kodu sessizce
  iptal edilmez.
- Deneme freni devreye girer.
- Türkçe `i → İ` dönüşümü doğru (tr-TR olmadan "İnci" ile "inci" eşleşmez).

### Yeni kalıcı denetimler (`tools/index-denetle.sh`)

| Denetim | Ne engelliyor |
|---|---|
| `tarayicida muvekkil` | `window.MUVEKKILLER` yeniden doldurulursa commit durur |
| `kimlik cekirdegi acik` | `lib/` beyaz listeye eklenirse commit durur |
| `kimlik denemesi` | 23 senaryodan biri düşerse commit durur |

Üçü de **negatif denendi**: kasten bozulduğunda üçü de yakaladı ve commit'i durdurdu.

---

## 5 · Sırada ne var

1. **KV namespace açılıp Pages'e `KOD_KV` adıyla bağlanmalı.** Sır değil; panel işi.
2. `WA_TOKEN` girilmeli — **yalnız Av. Umut Yücel.**
3. `tools/muvekkil-yukle.js --kuru` ile deneme, sonra gerçek yükleme.
4. `bash tools/yayin-dogrula.sh` → `/api/giris` de sınanıyor, exit 0 beklenir.

Bunlar tamamlanana kadar sistem **güvenli biçimde eksik** çalışır: müvekkile yalan
söylenmez, talep kuyruğa alınır, hiçbir kod üretilmez.
