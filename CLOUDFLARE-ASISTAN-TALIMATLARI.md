# Cloudflare Yapay Zekâ Asistanı — Hazır Talimatlar

**13.08.2026** · Av. Umut Yücel · hesap: `umutyucel07@gmail.com`

> Her bölüm **tek başına** kopyalanıp Cloudflare panelindeki yapay zekâ asistanına
> yapıştırılabilir. Sıra önemlidir; yukarıdan aşağı gidin.
>
> ⛔ **Hiçbir talimatın içinde sır YOKTUR.** Jeton ve müvekkil listesi gereken
> yerlerde `<...>` yer tutucusu var; oraya değeri **siz** yazarsınız. Asistana
> jeton yazdırmayın, sohbet kaydına düşer.
>
> ⚠️ Asistan bir değişiklik önerdiğinde **uygulamadan önce ne yapacağını okuyun.**
> Aşağıdaki her bölümün sonunda "beklenen sonuç" yazılı — eşleşmiyorsa durdurun.

---

## 1 · Pages derleme ayarı (EN ÖNCELİKLİ)

```
Pages projemde derleme ayarlarını değiştirmek istiyorum.

Proje: avumutyucelhukuk.com'u yayınlayan Pages projesi
(GitHub deposu: umutyucel07-cmd/umut, üretim dalı: main)

Yapılacak:
- Build command    : bash tools/yayin-hazirla.sh
- Build output directory : _site
- Root directory   : değişmeyecek (depo kökü)

Neden: şu an derleme komutu yok ve çıktı dizini depo kökü; bu yüzden depodaki
BÜTÜN dosyalar yayınlanıyor. İç belgeler (.md) ve tools/ altındaki scriptler
canlı sitede açık. Yeni script yalnız yayınlanması gerekenleri _site dizinine
kopyalıyor.

Ayarı kaydettikten sonra en son dağıtımı yeniden çalıştır (Retry deployment).
```

**Beklenen sonuç:** derleme başarılı; günlükte `✅ yayın dizini hazır: _site`
ve `✓ bağımlılık denetimi: 28 yolun tamamı yayın dizininde` satırları.
Derleme **başarısız olursa** günlükteki `❌` satırını bana gönderin — script
kasten durur, sessiz eksik site üretmez.

**Doğrulama:** `bash tools/yayin-dogrula.sh`

---

## 2 · Worker doğrulama jetonunu değiştirme

> Önce Render'daki değeri değiştirin. Render Cloudflare'de değil; asistan oraya
> erişemez. Sıra: **Render → Worker → (en son) Meta.**

```
muddy-hat-f441 adlı Worker'ın ortam değişkenlerini görmek istiyorum.

VERIFY_TOKEN adlı değişkenin değerini güncelleyeceğim. Bana bu değişkenin
bulunduğu ekrana nasıl gideceğimi göster; değeri kendim yazacağım.

Değeri sen üretme, sorma ve yazma.

Güncelledikten sonra Worker'ı yeniden dağıt (Deploy) ve dağıtımın başarılı
olduğunu teyit et.
```

**Beklenen sonuç:** Worker yeniden dağıtıldı, hata yok.

**Doğrulama (jetonunuzu ekrana yazmadan):**
```bash
bash tools/jeton-dogrula.sh "<yeni jeton>"
```
İki uç da `200` dönmeli ve meydan okumayı yansıtmalı. **Ancak ondan sonra Meta.**

---

## 3 · Pages ortam değişkenleri

```
Pages projemin Production ortam değişkenlerini eklemek istiyorum.

Eklenecekler:
- WA_PHONE_ID = 109650188830111        (Plain text — gizli değil)
- WA_TOKEN    = <ben yazacağım>         (Secret / encrypted)

Bu iki değişkeni oluşturacağım ekrana götür. WA_TOKEN'ı Secret olarak
işaretlediğimden emin ol. Değerleri sen üretme ve sorma.

Ekledikten sonra yeni bir dağıtım gerekiyor mu, söyle — ortam değişkenleri
yalnız yeni dağıtımlarda etkili oluyorsa bunu belirt.
```

**Beklenen sonuç:** iki değişken Production altında; `WA_TOKEN` **Secret**
olarak (değeri kaydettikten sonra bir daha görünmemeli).

**Doğrulama:**
```bash
curl -s https://avumutyucelhukuk.com/api/kod-talebi
# beklenen: {"ok":true,"service":"kod-talebi"}
```

> `KODLAR` değişkeni bu listede **bilerek yok.** Önce tasarım kararı verilmeli —
> `COPILOT-UC-AYAR.md` §3. Kod yenileme (B) seçilirse `KODLAR` hiç gerekmez.

---

## 4 · KV bağlantısı (isteğe bağlı ama önerilir)

```
Pages projeme bir KV namespace binding eklemek istiyorum.

Binding adı : KOD_KV
Namespace   : yeni oluştur, adı "kod-talepleri" olsun

Neden: erişim kodu talep ucunda IP başına dakikada 3 istek sınırı ve talebin
kalıcı kaydı için gerekiyor. Şu an bir talep geldiğinde hiçbir yerde kalıcı
iz kalmıyor.

Binding'i Production ortamına ekle. Preview ortamı için de gerekiyor mu, söyle.
```

**Beklenen sonuç:** `KOD_KV` binding'i Production'da; namespace kimliği
size gösterilir (bu bir sır değildir).

---

## 5 · Worker şablonları (kod değişikliği)

> Bu bir ayar değil, **kod** işidir. Tam yamalar: `COPILOT-KOD-YAMALARI.md`
> Yama 1, 2 ve 3 **aynı dosyada** — tek dağıtımda gitmeli.

```
muddy-hat-f441 Worker'ının kaynak kodunu düzenlemek istiyorum.

Üç değişiklik yapacağım, hepsi src/worker.js içinde:
1. ANAHTAR_KELIMELER dizisine altı kelime eklenecek
2. SABLONLAR sözlüğüne iki yeni şablon (dosya, kod) ve bir ASAMALAR sabiti
3. ACK_SOGUMA_SN sabiti bir fonksiyona çevrilecek

Kod editörüne nasıl gideceğimi göster. Değişiklikleri ben yapıştıracağım.

Yapıştırmadan önce mevcut kodun bir kopyasını almanın yolunu da söyle —
geri dönmem gerekebilir.
```

**Dağıtımdan sonra ZORUNLU ilk test — kuru çalıştırma, hiçbir şey göndermez:**

```bash
curl -s -X POST https://muddy-hat-f441.umutyucel07.workers.dev/gonder \
  -H "x-anahtar: <GONDER_ANAHTARI>" -H "content-type: application/json" \
  -d '{"kuru":true,"kanal":"whatsapp","hedef":"<kendi numaranız>","sablon":"dosya","ad":"Deneme Kisi","asama":"durusma_bekleniyor"}'
```

`"durum":"kuru"` ve doldurulmuş `metin` gelmeli. **Canlı gönderim ancak bundan sonra.**

---

## 6 · Sağlık sorgusu (istediğiniz zaman)

```
Şu üç şeyi kontrol etmek istiyorum:

1. Pages projemin son dağıtımı başarılı mı, ne zaman oldu?
2. muddy-hat-f441 Worker'ının son 24 saatteki hata oranı ve istek sayısı ne?
3. whatsapp-dedupe adlı KV namespace'inde kaç anahtar var?

Sadece raporla, hiçbir şeyi değiştirme.
```

---

## Asistanla çalışırken üç kural

**1. Sır yazdırmayın.** Jeton, parola, müvekkil listesi — hiçbiri sohbete
girmemeli. Talimatların hepsi "değeri ben yazacağım" diyor; bu bilinçli.

**2. Uygulamadan önce okuyun.** Asistan bir değişikliği kendisi yapabiliyorsa,
ne yapacağını önce anlattırın. Bu depoda üç kez, kimsenin okumadığı bir
değişiklik canlıyı bozdu.

**3. Ölçmeden "oldu" demeyin.** Her bölümün altında bir doğrulama komutu var.
Bu oturumda `_redirects` çözümü mantıklı görünüyordu ve **çalışmadı** —
yalnız ölçüm gösterdi. Aynısı buradaki her adım için geçerli.

---

## Sıra özeti

| # | İş | Nerede | Doğrulama |
|---|---|---|---|
| 1 | Derleme ayarı | Pages | `yayin-dogrula.sh` |
| 2 | Jeton (Render → Worker → Meta) | Render + Worker + Meta | `jeton-dogrula.sh` |
| 3 | `WA_TOKEN`, `WA_PHONE_ID` | Pages | `curl /api/kod-talebi` |
| 4 | `KOD_KV` binding | Pages | — |
| 5 | Worker şablonları | Worker | kuru çalıştırma |

**1 bitmeden 2'ye geçmeyin** — sızıntı açıkken sır döndürmenin anlamı azalır.
