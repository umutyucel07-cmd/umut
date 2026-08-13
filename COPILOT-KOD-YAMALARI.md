# Uygulanacak Kod Yamaları

**13.08.2026** · Av. Umut Yücel · hedef: `src/worker.js` (Worker `muddy-hat-f441`) ve `functions/api/kod-talebi.js`

> Yamalar **bağımlılık sırasına** göre dizildi. 1 ve 2 aynı dağıtımda gitmeli —
> ikisi de `src/worker.js` içinde, tek yayınla biter.
>
> Kaynak, canlı Worker'dan okundu (`workers_get_worker_code`), tahmin yok.

---

## YAMA 1 — Kenar filtresine kod kelimeleri

**Neden ilk sırada:** bu yapılmadan "kod robotu" **imkânsız**. Worker kaynağında:

```js
if (SADECE_HUKUKI) { if (!hukukiSinyal(govde)) return; }
```

`ANAHTAR_KELIMELER` listesinde "kod" **yok**. Müvekkil "kod" yazdığında mesaj
Notion'a hiç yazılmıyor, `/sync` kuyruğuna düşmüyor, robot onu hiç görmüyor.

`ANAHTAR_KELIMELER` dizisinin **sonuna** ekleyin:

```js
  "kod",
  "erişim kodu",
  "portal",
  "şifre",
  "giriş yapamıyorum",
  "giremiyorum",
```

⚠️ **"kod" geniş bir kelimedir** — "kodu", "barkod", "kodlama" da yakalar.
Yanlış pozitif kabul edilebilir: en kötü ihtimalle içeriksiz bir kayıt açılır,
müvekkile yanlış mesaj **gitmez** (gönderim ayrı kapıdan geçiyor).

---

## YAMA 2 — İki yeni şablon: `dosya` ve `kod`

### 2a. Aşama sözlüğü — `SABLONLAR`'dan ÖNCE

Serbest metni yapısal olarak imkânsız kılan kısım budur.

```js
// Dosya durumu YALNIZ bu kümeden seçilir. Serbest metin kabul edilmez —
// aksi hâlde /gonder fiilen serbest metin ucuna dönüşür ve üç şablon
// kısıtının (Yön. m.7/c) tüm anlamı kaybolur.
var ASAMALAR = {
  dilekce_verildi:   "dilekçe mahkemeye sunulmuştur",
  durusma_bekleniyor:"duruşma günü beklenmektedir",
  karar_bekleniyor:  "karar aşamasındadır",
  istinafta:         "istinaf incelemesindedir",
  icra_asamasinda:   "icra aşamasındadır",
  dosya_kapandi:     "dosya kapanmıştır"
};
```

### 2b. `SABLONLAR` sözlüğüne iki giriş

```js
  dosya: "Sayın {ad}, dosyanızla ilgili kayıtlarımızda görünen son durum: {asama}." +
         " Ayrıntılı değerlendirme için Av. Umut Yücel tarafından tarafınıza dönüş" +
         " sağlanacaktır. Bu otomatik bir bilgilendirme mesajıdır; hukuki değerlendirme içermez.",

  kod:   "Portal erişim kodunuz kayıtlı iletişim bilgilerinize ayrıca iletilmiştir." +
         " Kodu kimseyle paylaşmayınız. Bu otomatik bir bilgilendirme mesajıdır."
```

⚠️ **Kodun kendisi `kod` şablonunda GEÇMEZ.** Kod ayrı yoldan, `/api/kod-talebi`
üzerinden gider. Sebep: `/gonder` günlüğü ve KV izleri (`songonderim`,
`hata:gonderim`) gönderilen metni saklıyor — kod düz metin olarak oraya yazılmamalı.

### 2c. `gonderUcu` içinde sıkı doğrulama

Mevcut şablon kontrolünden **hemen sonra**, `pencereAnahtari` satırından **önce** ekleyin:

```js
  // ── dosya şablonu: dört koşul, biri bile atlanırsa gönderim yok ──────────
  let metin = SABLONLAR[sablon];

  if (sablon === "dosya" || sablon === "kod") {
    // (1) YALNIZ müvekkil. Dosya bilgisi meslek sırrıdır (Av.K. m.36) ve
    //     kişisel veridir; yanlış kişiye tek satır bile verilmez.
    const kisi = await kisiOku(env, hedef);
    if (!kisi || kisi.sinif !== "muvekkil") {
      return jsonYanit({ durum: "reddedildi", neden: "bu şablon yalnız müvekkil sınıfına gönderilir" }, 403);
    }
  }

  if (sablon === "dosya") {
    // (2) ad: yalnız harf ve boşluk. Serbest metin enjeksiyonunu keser.
    const ad = String(istek.ad || "").trim();
    if (!/^[\p{L} .]{2,60}$/u.test(ad)) {
      return jsonYanit({ durum: "hata", neden: "ad biçimi geçersiz" });
    }
    // (3) asama: kapalı kümeden seçilir, serbest metin DEĞİL.
    const asamaAnahtar = String(istek.asama || "");
    if (!Object.prototype.hasOwnProperty.call(ASAMALAR, asamaAnahtar)) {
      return jsonYanit({
        durum: "hata",
        neden: "bilinmeyen aşama — izinli: " + Object.keys(ASAMALAR).join(", ")
      });
    }
    metin = metin.replace("{ad}", ad).replace("{asama}", ASAMALAR[asamaAnahtar]);

    // (4) yerleştirme sonrası hiçbir işaretçi kalmamalı
    if (metin.includes("{")) {
      return jsonYanit({ durum: "hata", neden: "şablon doldurulamadı" });
    }
  }
```

Ardından **iki satırı** güncelleyin — artık `SABLONLAR[sablon]` değil `metin` gönderiliyor:

```js
  // kuru çalıştırma yanıtında:
  metin: metin,                       // eski: SABLONLAR[sablon]

  // gerçek gönderimde:
  const hata = await grafGonder(env, kanal, hedef, metin);   // eski: SABLONLAR[sablon]
```

`jsonYanit`'ın ikinci parametresi yoksa ekleyin:

```js
function jsonYanit(obj, durum = 200) {
  return new Response(JSON.stringify(obj), {
    status: durum,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
```

### 2d. Zorunlu ilk test — kuru çalıştırma

Canlı gönderimden **önce**. `<ANAHTAR>` = `GONDER_ANAHTARI`, `<NUMARA>` = kendi numaranız.

```bash
curl -s -X POST https://muddy-hat-f441.umutyucel07.workers.dev/gonder \
  -H "x-anahtar: <ANAHTAR>" -H "content-type: application/json" \
  -d '{"kuru":true,"kanal":"whatsapp","hedef":"<NUMARA>","sablon":"dosya","ad":"Deneme Kişi","asama":"durusma_bekleniyor"}'
```

Beklenen: `"durum":"kuru"` ve `metin` alanında doldurulmuş cümle. Ayrıca **red testleri**
— üçü de reddetmeli:

```bash
# serbest asama
-d '{"kuru":true,...,"sablon":"dosya","ad":"X","asama":"istediğim gibi yazarım"}'
# müvekkil olmayan numara
-d '{"kuru":true,...,"hedef":"<rehberde-olmayan>","sablon":"dosya",...}'
# ad içinde işaretçi
-d '{"kuru":true,...,"ad":"{asama}","asama":"istinafta"}'
```

---

## YAMA 3 — Mesai içinde daha kısa soğuma

Tek gevşetme önerim. `ACK_SOGUMA_SN` sabitini fonksiyonla değiştirin:

```js
// var ACK_SOGUMA_SN = 60 * 60;        ← ESKİ
function ackSogumaSn() {
  const tr = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
  const gun = tr.getDay(), saat = tr.getHours();
  const mesai = gun >= 1 && gun <= 5 && saat >= 9 && saat < 18;
  return mesai ? 30 * 60 : 60 * 60;   // mesai 30 dk, dışı 1 saat
}
```

`otomatikTeyit` içindeki kullanım:

```js
await gonderimKaydet(env, cooldown, iz, ackSogumaSn());   // eski: ACK_SOGUMA_SN
```

Günlük tavan **40 olarak kalır** — kaçak döngüye karşı tek gerçek koruma odur.

---

## YAMA 4 — E-posta kanalı kapatılır

`functions/api/kod-talebi.js`, MailChannels çağrısı. **MailChannels, Cloudflare Workers
için ücretsiz servisi kapattı (2024)**; satır bugün `502` döner ve müvekkile kod gitmez —
üstelik sessizce.

`if (kanal === 'eposta') { … }` bloğunun **tamamını** şununla değiştirin:

```js
  // 13.08.2026: MailChannels ücretsiz Workers servisi kapandı; eski çağrı 502
  // dönüyordu ve müvekkil "gönderildi" sanıyordu. Sessiz başarısızlık yerine
  // dürüst yönlendirme. Yeni sağlayıcı (Resend/Brevo/Postmark) bağlanınca
  // bu blok geri açılır.
  if (kanal === 'eposta') {
    return json({
      ok: true,
      durum: 'kuyruk',
      mesaj: 'Talebiniz alınmıştır. Kodunuz kayıtlı WhatsApp numaranıza iletilecektir.'
    });
  }
```

`js/kod-talebi.js` içindeki kanal seçiminde "E-posta ile" düğmesi de kaldırılabilir;
kaldırılmazsa da davranış dürüsttür.

---

## YAMA 5 — Belgeleri yayın kökünden çıkarma (**ARTIK ZORUNLU**)

> ⛔ **13.08.2026 ölçümü: `_redirects` yaklaşımı ÇALIŞMIYOR.** Birleşme ve dağıtımdan
> sonra 13/13 belge hâlâ `200` döndü. Sebep: **Cloudflare Pages önce statik varlığa
> bakar**; yönlendirme var olan bir dosyanın üzerini örtemez. Yanlış varsayım bendeydi.
>
> **Çalışan kısım:** `_headers` içindeki `X-Robots-Tag: noindex, nofollow, noarchive`
> doğrulandı — belgeler erişilebilir ama **arama motoruna girmez**.
>
> **Bu yama artık isteğe bağlı değil; sızıntıyı kapatan tek şey bu.**

`tools/yayin-hazirla.sh` yazıldı ve **yerelde denendi**: 56 dosya, 1,7 MB, sızıntı yok.

Beyaz liste mantığı: `index.html` · `manifest.webmanifest` · `sw.js` · `_headers` ·
`_redirects` · `robots.txt` · `sitemap.xml` + `js/` `vendor/` `assets/` `functions/`.
**Listede olmayan hiçbir şey yayınlanmaz** — yeni bir belge eklendiğinde hiçbir şey
yapılmasa bile sızmaz. Varsayılan "yayınlama".

**Cloudflare ayarı — bir kez, elle:**

```
Pages → proje → Settings → Builds & deployments
  Build command           : bash tools/yayin-hazirla.sh
  Build output directory  : _site
```

Ayar yapıldıktan sonra `_redirects` içindeki 15 satırlık 404 bloğu **gereksiz hâle gelir**
ve sadeleştirilebilir. Ayar yapılmadan **kaldırılmamalıdır** — o blok şu anki tek kapaktır.

Script kendi doğrulamasını yapıyor; sızıntı bulursa `exit 1` ile **derlemeyi durdurur**:
yayın dizininde `.md`, `tools/`, `.env.example`, `.github/` varsa ya da `index.html`
kopyalanmamışsa ya da `varliklar.js` 2000 baytı aşmışsa.

---

## Sıra ve doğrulama

| # | Yama | Nerede | Test |
|---|---|---|---|
| 1 | Kod kelimeleri | `src/worker.js` | Kendinize "kod" yazın → Notion'a düşmeli |
| 2 | İki şablon | `src/worker.js` | §2d kuru çalıştırma + üç red testi |
| 3 | Soğuma | `src/worker.js` | Mesai içinde iki mesaj, 30 dk arayla teyit |
| 4 | E-posta | `functions/api/kod-talebi.js` | `kanal:"eposta"` → `durum:"kuyruk"` |
| 5 | Yayın dizini | Cloudflare ayarı | 20 iç yol 404 dönmeli |

**1, 2 ve 3 aynı dosyada — tek dağıtımda gitmeli.** 4 ayrı PR. 5 kod değil, ayar.
