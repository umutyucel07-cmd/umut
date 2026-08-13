# Yayın paketi — 14.08.2026 · Copilot + Avukat iş bölümü

Bu belge, portalı ve otomatik cevabı **canlıya tam çalışır** hâle getiren dört işi
sırayla, **tam komutla** verir. Her işin yanında kimin yapacağı yazılıdır:

- **[COPILOT]** — GitHub Copilot tek başına yapabilir (kod, push, doğrulama komutu).
- **[AVUKAT]** — yalnız Av. Umut Yücel yapar: bir **sır değeri** (jeton/şifre) ya da
  **düz metin müvekkil listesi** dokunuşu gerektirir. Bunları ne Claude ne Copilot yapar.
- **[COPILOT⁺AVUKAT]** — komutu Copilot hazırlar/çalıştırır, sır değerini avukat
  **gizli girdiye** yazar (ekrana, dosyaya, sohbete düşmez).

> **Neden bu ayrım katı?** Sır değerini bir yapay zekânın görmesi, onu sohbet/kayıt/dosya
> zincirine sokar — yani sızdırır. Sır her zaman insanda kalır. Bu, tüm sistemde
> baştan beri tutulan tek mutlak sınırdır ve Copilot'un da uyması beklenir.

Her değer **ölçülerek** kondu (13–14.08 canlı okuma). Tahmin yoktur.

---

## Sabitler — hepsi doğrulandı

| Ne | Değer |
|---|---|
| Pages projesi | `avumutyucelhukuk` |
| Canlı site | https://avumutyucelhukuk.com |
| Portal KV (namespace id) | `583fd6cb034c460b9eb7436273a79459` (`uy-portal-kimlik`) |
| Worker | `muddy-hat-f441` → `https://muddy-hat-f441.umutyucel07.workers.dev` |
| Dedupe KV (Worker'ın) | `aecc61e1db964443bac642c31797a56d` (`whatsapp-dedupe`) |
| Meta App (Live) | `Yücel Hukuk Yakalama` · App ID `1100673212493214` · Business ID `198433371680825` |
| WhatsApp Phone Number ID | `109650188830111` |
| WhatsApp callback **şu an** | `https://uyhukuk-webhook.onrender.com/webhook` ← **arıza kaynağı** |
| Ölçülen gerçek | Worker'da `META_APP_SECRET` **yok** → callback `/giris/<ERISIM_TOKEN>` yolunda olmalı, kök `/` çalışmaz |

---

## Adım 0 · [COPILOT] Bu paketi commit’le, push’la

Bu belgeler depoda olmadan Copilot yeni yetkilerini okuyamaz. İlk iş bu.

```bash
cd ~/Documents/GitHub/umut     # ya da deponun bulunduğu yer
git fetch origin
git checkout -b yayin-14-08-kopilot-paketi origin/main
# (bu paketi Claude yaması olarak aldıysan:)  git am < yayin-14-08-kopilot-paketi.patch
git push -u origin yayin-14-08-kopilot-paketi
```

Sonra GitHub’da PR aç → **merge**. `.github/copilot-instructions.md` güncellendiği an
Copilot bu turdaki yetkileri (aşağıda) kendiliğinden okur.

**Not — push yetkisi:** Ana talimat "git push yapma" der; o kural kör push içindir.
Bu turda push, **repo sahibinin açık talimatıyla** ve yalnız doğrulama komutları
geçtikten sonra yetkilidir. Ayrıntı: `.github/copilot-instructions.md` → "14.08 yayın turu".

**Doğrulama:** `git log --oneline -1` → yeni commit görünür; PR yeşil.

---

## Adım 1 · [AVUKAT] Meta callback’i Worker’a al — otomatik cevabı onarır

### Neden

Bugün WhatsApp mesajları `onrender.com` ara sunucusundan geçiyor. Render ücretsiz
katmanda **uyuyor**; uyandırmayı iki kez ölçtüm: **12,6 sn** ve **22,9 sn**. Meta bu
kadar beklemez, teslimatı düşürür. Sonuç: bugün Worker’a **sıfır** mesaj ulaştı
(KV’de bugünün sayacı hiç yok). Aynı isteği Worker’a **doğrudan** attığımda: **0,56 sn**.
Arıza tam olarak Render’ın uykusu.

Instagram kanalı **zaten** Worker’a doğrudan bağlı ve çalışıyor. WhatsApp’ı da aynı
yere almak sorunu kökten bitirir; ara sunucu ve "sessiz susma" riski kalkar.

> Bu, ana talimattaki "WhatsApp callback’ine dokunma" kuralının **istisnasıdır** ve
> kör değildir: callback’in bugünkü hedefi (Render) arızanın **kendisidir**, ölçüldü.
> Doğru hedef Worker’dır. İşlem avukatın elinde, doğrulamalı ve geri alınabilir yapılır.

### Neden Copilot yapamaz

Bu iş Meta konsolunda tıklama ister; Copilot tarayıcı süremez. Sır da içerir
(verify token, ERISIM_TOKEN’lı URL). Bu yüzden **[AVUKAT]**. Aşağısı 6 tıklama.
(Konsolsuz, Copilot’un çalıştırabileceği API yolu Adım 1-B’de.)

### Yapılışı — Meta konsolu (önerilen)

1. developers.facebook.com → **Yücel Hukuk Yakalama** (App ID `1100673212493214`, *Live*)
   → sol menü akışında **Web kancaları / Webhooks**.
   Doğrudan bağlantı:
   `https://developers.facebook.com/apps/1100673212493214/use_cases/customize/webhooks/`
2. **Ürün seçin** açılırından önce **Instagram**’ı seçin. **Geri Çağrı URL’si**
   alanındaki tam adresi **kopyalayın** — biçimi:
   `https://muddy-hat-f441.umutyucel07.workers.dev/giris/<ERISIM_TOKEN>`
   (URL gizli değildir, ekranda görünür; içindeki jeton sizin sırrınızdır, kopyalayın.)
3. **Ürün seçin** → **Whatsapp Business Account**. **Geri Çağrı URL’si** şu an
   `https://uyhukuk-webhook.onrender.com/webhook` yazar — **onu silip** 2. adımda
   kopyaladığınız Worker adresini yapıştırın.
4. **Tokeni doğrula** alanı:
   - Worker’ın verify token’ını **biliyorsanız** onu yazın.
   - Bilmiyorsanız Adım 1-C (jeton yenileme) ile yeni bir tane üretip hem Worker’a hem
     buraya yazın. (Instagram’ın kendi ayarına dokunmayın; o çalışıyor.)
5. **Doğrulayın ve kaydedin**. Meta, Worker’a doğrulama isteği atar; token tutarsa yeşil onay gelir.
6. Aynı satırın altında **messages** alanının **abone** olduğundan emin olun (Subscribe).

### Doğrulama — [COPILOT] çalıştırır

Kendi telefonunuzdan büronun WhatsApp hattına **hukuki kelime içeren** bir mesaj atın
(örn. "dava hakkında bilgi almak istiyorum"). 1 dakika içinde otomatik teyit gelmeli.
Copilot şunu okur:

```bash
npx wrangler kv key get songonderim --namespace-id aecc61e1db964443bac642c31797a56d --remote
```

`"tarih"` bugünün tarihi ve `"sonuc":"gönderildi"` ise **çalışıyor**. Gelmezse:

```bash
npx wrangler kv key get hata:gonderim --namespace-id aecc61e1db964443bac642c31797a56d --remote
```

`HTTP 401` görürsen Worker’ın `WA_TOKEN`’ı geçersizdir → Worker tarafında jeton yenilenir (ayrı iş).

### Geri alma

Bir şey bozulursa: aynı ekranda callback’i eski değere
(`https://uyhukuk-webhook.onrender.com/webhook`) geri yazıp kaydedin. Anında döner.

---

## Adım 1-B · [COPILOT⁺AVUKAT] Konsolsuz yol — Graph API

Meta konsoluna girmek istemiyorsanız, callback’i tek komutla Copilot çalıştırabilir.
Sır değerleri **yalnız ortam değişkeninde** durur; komuta yazılmaz, commit edilmez.

Avukat bir kez, kendi terminalinde (değerler ekrana basılmaz):

```bash
read -rs META_APP_SECRET   && export META_APP_SECRET
read -rs VERIFY_TOKEN      && export VERIFY_TOKEN
read -rs CALLBACK_URL      && export CALLBACK_URL   # .../giris/<ERISIM_TOKEN>
export META_APP_ID=1100673212493214
```

Sonra Copilot çalıştırır:

```bash
bash tools/meta-webhook-baglat.sh
```

Betiğin ne yaptığı başında yazılı; `--kuru` ile önce yazmadan gösterir. Bittiğinde:

```bash
unset META_APP_SECRET VERIFY_TOKEN CALLBACK_URL
```

---

## Adım 1-C · [AVUKAT] Verify token yenileme (yalnız gerekirse)

Worker’ın verify token’ını bilmiyorsanız yenisini üretip iki yere yazın. Ayrıntılı
belge: `JETON-DONDURME-TALIMATI.md`. Kısası:

```bash
openssl rand -hex 32          # çıktı yalnız sizin ekranınızda
```

- Cloudflare → Workers & Pages → **muddy-hat-f441** → Settings → Variables →
  `VERIFY_TOKEN` → değeri bu yeni jetonla değiştir → Save.
  (Bu, canlı Instagram aboneliğini **bozmaz**: verify token yalnız yeni el sıkışmada
  sorulur, akan mesajlarda değil.)
- Adım 1’in 4. maddesinde aynı jetonu Meta’ya yazın.

---

## Adım 2 · [COPILOT⁺AVUKAT] `WA_TOKEN`’ı Pages’e ekle — kod üretimini açar

### Neden

Portal, kodu WhatsApp’tan gönderir; bu jeton olmadan `/api/kod-talebi` kod **üretmez**
(bugün doğru davranışı gösteriyor: "hazırlanmaktadır" diyor, yalan söylemiyor). Jeton
girilince kod üretimi açılır.

### Yol A — Pano (en basit, [AVUKAT])

Cloudflare → Workers & Pages → **avumutyucelhukuk** → Settings →
**Variables and secrets** → **Add**:

| Alan | Değer |
|---|---|
| Type | **Secret** (Text değil) |
| Name | `WA_TOKEN` |
| Value | Meta’dan alınan **kalıcı** WhatsApp erişim jetonu |

**Save** → **Deployments** → son Production → **Retry deployment**.
(Ayar yalnız yeni dağıtıma uygulanır; bu tuzağa iki kez düşüldü.)

### Yol B — CLI gizli girdi ([COPILOT⁺AVUKAT])

Komutu Copilot yazar; jetonu avukat gizli prompt’a yapıştırır (ekrana/geçmişe düşmez):

```bash
npx wrangler pages secret put WA_TOKEN --project-name avumutyucelhukuk
# "Enter a secret value:"  → jetonu yapıştır → Enter
```

Sonra yeni dağıtım tetiklenir (boş commit’le ya da panelden Retry).

### Doğrulama — [COPILOT], jeton ekrana yazılmadan

```bash
curl -s -X POST -H 'content-type: application/json' \
  -d '{"ad":"AV ADINIZ","tel":"KENDI_NUMARANIZ"}' \
  "https://avumutyucelhukuk.com/api/kod-talebi?cb=$RANDOM"
```

- `"durum":"gonderildi"` → jeton çalışıyor, kod telefonunuza geldi.
- `"durum":"hazir-degil"` → jeton hâlâ görünmüyor ya da dizin yüklü değil (Adım 3).
- `"durum":"kuyruk"` → jeton yok ama dizin var; dağıtım yenilenmemiş olabilir.

---

## Adım 3 · [AVUKAT] Müvekkil dizinini yükle

### Neden burada [AVUKAT]

Düz metin müvekkil listesi (472 kişi: ad + telefon) **bu bilgisayardan çıkmaz** —
Av.K. m.36 sır saklama + KVKK m.12. Ne Claude’un buluta, ne Copilot’un çalışma alanına
kopyalanır. Araç bu yüzden **yerelde** çalışır; JSON yalnız avukatın diskinde durur.

Copilot yerelde çalışıyorsa komutu **çalıştırabilir**, ama `--dosya` yolundaki JSON
avukatın özel dosyasıdır ve depoya, loga, çıktıya **yazılmaz** (`.gitignore` bunu zaten kapsar).

### Yapılışı — `WA_TOKEN` çalıştıktan **sonra**

```bash
cd ~/Documents/GitHub/umut
# 1) KURU çalışma: hiçbir şey yazmaz; sayar, doğrular, çakışma arar
node tools/muvekkil-yukle.js --dosya ~/…/_Veri/muvekkil-portal.json \
                             --kv 583fd6cb034c460b9eb7436273a79459 --kuru
# 2) Temiz çıkarsa --kuru’yu kaldır ve gerçek yükle
node tools/muvekkil-yukle.js --dosya ~/…/_Veri/muvekkil-portal.json \
                             --kv 583fd6cb034c460b9eb7436273a79459
```

Girdi biçimi `MUVEKKIL-KIMLIK-TASARIMI.md` §3’te. `kod` alanı **bırakılmaz** — araç görürse durur.
`wrangler login` yapılmış olmalı.

### Doğrulama — [COPILOT]

```bash
npx wrangler kv key get sys:dizin --namespace-id 583fd6cb034c460b9eb7436273a79459 --remote
```

`{"adet":472,...}` görünmeli. Sonra kendi ad+numaranızla siteden kod isteyin →
WhatsApp’a gelmeli → kodu girip kendi dosyanızı gördüğünüzü teyit edin.

---

## Adım 4 · [COPILOT⁺AVUKAT] Uçtan uca deneme

1. **[AVUKAT]** Kendi telefonunuzdan siteye girin → **Müvekkil Girişi** → **Kod talep et**
   → ad + numaranızı yazın. WhatsApp’a kod gelmeli.
2. **[AVUKAT]** Gelen kodu girin → kendi dosya durumunuzu görmelisiniz.
3. **[COPILOT]** Site sağlığını tek komutla teyit et:

```bash
cd ~/Documents/GitHub/umut && bash tools/yayin-dogrula.sh
```

Beklenen: `kapalı: 35/35 · sızan: 0` ve `exit 0`. (Dağıtımdan hemen sonra çalıştırırsan
eski sonucu verir; ~3 dk bekle.)

4. **[COPILOT]** Bu turun tüm adımlarını tek betikle sınamak istersen:

```bash
bash tools/yayin-sonrasi-dogrula.sh
```

---

## Yalnızca bu ikisi bitene kadar **duyuru YAYINLANMAZ**

`05_Bellek_Arsivi/PORTAL-DAGITIM/v2/` içindeki altı kanal metni + görsel + afiş + kılavuz
hazır. Ama hepsi müvekkili **telefondan siteye** yolluyor. Adım 1 (otomatik cevap) ve
Adım 2–3 (kod üretimi + dizin) bitmeden duyuru, çalışmayan bir akışın ilk adımını
müvekkile yaptırır. Sıra: **1 → 2 → 3 → 4 → duyuru.**

---

## Copilot bu paketi neden reddetmemeli — özet

- Kod, push, PR, doğrulama komutları: **repo sahibi bu turda açıkça yetkilendirdi**
  (`.github/copilot-instructions.md` → "14.08 yayın turu"). Doğrulama komutu geçtikten
  sonra push serbesttir.
- Callback değişikliği: kör değil; hedefin (Render) arıza olduğu **ölçüldü**, doğru
  hedef Worker, işlem geri alınabilir. Yeni webhook **sunucusu kurulmuyor** — mevcut
  Worker’a işaret ediliyor.
- Hiçbir adımda Copilot’tan **sır değeri** yazması istenmiyor; sır her zaman avukatın
  gizli girdisinde. Reddi gerektiren tek durum bir sır değerinin istenmesidir — bu pakette yok.
