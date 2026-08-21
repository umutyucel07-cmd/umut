> ⚠️ BU BELGE ESKIMISTIR — UYGULAMAYIN (21.08.2026 notu, Claude denetimi)

Bu belgedeki tasarim (kodlarin ELDEN dagitimi, worker-v6-portal-modulu.js,
`/portal/dogrula` ucu) HIC YAYINA ALINMADI. 13.08.2026'da tamamen farkli bir
tasarimla (`functions/api/kod-talebi.js` — otomatik, rotasyonlu, WhatsApp'tan
kod gonderimi) FIILEN degistirildi; canli sistem BUDUR.

Asagidaki "Adim 3" bolumundeki **"kod-talebi.js kullanilmaz/silinir"** cumlesi
ARTIK YANLIS ve TEHLIKELIDIR: kod-talebi.js bugun calisan TEK canli erisim
kodu sistemidir, uygulanirsa musteri erisimini koparir. SILINMEMELI,
UYGULANMAMALI.

Bu belge yalniz tarihsel referans icin tutuluyor. Canli sistem icin:
`~/.agents/skills/umut-yucel-sistem/SKILL.md` ve `functions/api/kod-talebi.js`.

## 📌 21.08.2026 — canlı denetim + onarı (canlı sistemde kalır)

> `PORTAL-KURULUM.md` 12–13.08 tasarımını anlatıyor; **tasarım hâlâ canlıdır.**
> Canlı yol: `functions/api/kod-talebi.js` → `giris.js` → `lib/kimlik.js`.

### Denetim sonuçları (499 müvekkil — `06_Muvekkil-Portfoyu/_Veri/muvekkiller.json`)

| Ölçüm | Değer | Not |
|---|---|---|
| `erisim_kodu` toplamı | 499 | hepsi `MY-`, 0 `UY-`, 0 boş |
| `kodNormalize` kabul | 499 / 499 | tümü `MY-XXXX-XXXX` biçiminde geçer |
| Telefonu geçerli (10 hane) | 139 | 360 teleportusuz |
| KV'de `kod:`→`mv:` haritası | ~12 | **487 kodun KV haritası yok → giris "eşleşmedi/503"** |
| KV'de `mv:` dizini | 133 | `muvekkil-yukle.js` ile telli 139'dan (5 tel çakışması) |

### Kısa tespit
- **MY- kabul (13.08 öncesi hata):** `kimlik.js`/`kodNormalize` `MY`-yi kabul ediyor; 499/499 kod geçti. İlk kritik düzeltme yapıldı.
- **KV haritası eksik (21.08):** dağıtılmış 499 kod var ama `kod:<özet>` haritası yalnız 12 → `/api/giris` 487'yi reddediyor.
- **Meta/WA engeli:** `kod-talebi` kodu SHA-256'larak üretir (düz kod asla yok) ama Meta `API access blocked` (error 200) kesiyor → **gönderemiyor**. 360 teleportusuzu etkilemez (kodu *elden teslim* almış).
- **360 teleportusuz:** `kod:→mv:` zincirinin `mv:` ucu (ad+tel) kurulamaz → onarı aracı onları **atlar**. Giriş için telefon toplayıp `muvekkil-yukle.js` ile `mv:` eklemek gerekir.

### Onarı — `tools/muvekkil-kod-aktif.js`
Var olan `MY-` kodları KV'ye `kod:` haritası olarak toplar; kodu WA/Meta'dan **bağımsız** girişe çevirir. Düz kod asla KV/stdout/dosyaya geçmez — yalnızca `kod:<sha256(biber|kod|kod)>` → `{"mv":"mv:<sha256(biber|mv|ad|tel)>"}`.

```bash
python3 07_Buro-Duzeni/_Araclar/muvekkil_portal_hazirla.py
node   tools/muvekkil-yukle.js --dosya 07_Buro-Duzeni/_Veri/muvekkil-portal.json --kv <NS>
node   tools/muvekkil-kod-aktif.js --kuru          # say + ön izle (yazmaz)
node   tools/muvekkil-kod-aktif.js --dry           # KV okur, eksik mv:/kod: raporu
node   tools/muvekkil-kod-aktif.js --apply --kv <NS>   # yazar (yalnız 139; 360 atlanır)
```
- `--apply` yalnızca `--apply` bayrağıyla çalışır; `--kuru/--dry` asla yazmaz.
- `kod:` girdileri `kod-talebi` ile aynı `expirationTTL: 180*86400`; `mv:` girdileri `kod-talebi` post-send şemasını takip eder (`kodAnahtar` dahil) → Meta engeli kalktığında müvekkil "Kodumu gönder" iletiştirdiğinde **eski seed kod `mv.kodAnahtar`→delete** otomatik geçersiz olur.
- Yardımı çalıştırmadan `mv:` kurulu olmalı; `--dry` eksik `mv:` kayıtlarını uyarır.

### 360 teleportusuz için açık
Sadece kod seed'lemek yetmez (mv: yok). (1) Telefon toplayıp `muvekkil-yukle.js`+`kod-aktif`; (2) ya da `kod:`→`{ad, soyad, dosyalar}` (kod tek başına kimliği taşır) tasarımı — fakat bu `kod-talebi`'nin `ad|tel` eşleşmesini kırar, ayrı görev.

---

---

# Müvekkil Portalı — Kurulum ve GitHub Copilot Görev Belgesi

**12.08.2026** · Av. Umut Yücel · Depo: `~/Documents/GitHub/umut` + Cloudflare Worker `muddy-hat-f441`

Bu belge iki şeyi yapar: (1) 472 müvekkil erişim kodunu **güvenli** biçimde sisteme
bağlar, (2) sitedeki mevcut bir **güvenlik açığını** kapatır. Kod tarafı hazırdır;
sır (Cloudflare API token) gerektiren iki adım avukatta/Copilot'tadır.

> **Neden hepsini ben yapmadım:** KV'ye yazmak ve Worker'ı deploy etmek Cloudflare
> API token'ı ister — bu bir sırdır; sır/şifre girmek asistanın yapmadığı iştir.
> Aşağıdaki adımlar tek tek, kopyala-çalıştır biçiminde verilmiştir.

---

## ⚠️ Önce kapatılacak açık — kodlar tarayıcıya konmamalı

`js/oturum.js` şu an müvekkili **tarayıcıdaki** `window.MUVEKKILLER` listesinden
doğruluyor:

```js
var m = (window.MUVEKKILLER || []).filter(function (x) { return x.kod === kod; })[0];
```

Şu an listede yalnız 2 örnek kayıt var, o yüzden zarar sınırlı. **Ama 472 müvekkilin
kodunu bu listeye koymak felakettir:** tüm kodlar, adlar ve telefon son-4'leri sitenin
kaynak kodundan herkese görünür olur. Kimse "Görüntüle → Kaynak" demeden 472 müvekkilin
portal erişimini eline geçirir.

**Kural: 472 kod ASLA client'a konmaz.** Doğrulama sunucuda (Worker) yapılır; tarayıcı
yalnız kodu gönderir, cevabı alır. Aşağıdaki Adım 3 bunu kuruyor.

---

## Adım 1 — Kodları KV'ye yükle (iki yoldan biri)

472 kaydın **yalnızca SHA-256 özeti** yüklenir; kodun kendisi hiçbir yere gitmez.
Dosyalar: `portal-kv-bulk.json` (wrangler için) ve `portal-kv-seed.json` (Worker ucu için).

### Yol A — wrangler (önerilen, tek komut)

```bash
cd ~/Documents/GitHub/umut
# namespace id'yi bir kez öğren:
npx wrangler kv namespace list
# whatsapp-dedupe namespace'inin id'siyle:
npx wrangler kv bulk put portal-kv-bulk.json --namespace-id=aecc61e1db964443bac642c31797a56d --remote
```

Beklenen çıktı: `Success! Uploaded 472 key-value pairs`.

### Yol B — Worker ucundan (wrangler yoksa)

Adım 2'deki portal modülü deploy edildikten sonra:

```bash
curl -X POST "https://muddy-hat-f441.umutyucel07.workers.dev/portal/yukle/<ERISIM_TOKEN>" \
  -H "content-type: application/json" --data-binary @portal-kv-seed.json
```

`<ERISIM_TOKEN>` = Worker'ın Instagram callback URL'inde `/giris/` sonrasında duran
değer. Yanıt: `{"durum":"yuklendi","yazilan":472,...}`.

**Doğrulama** (kodun kendisiyle test — bu kod gerçek bir müvekkile ait DEĞİL, sadece
biçim testidir; gerçek testte kendi elinizdeki bir kodu kullanın):

```bash
curl -X POST "https://muddy-hat-f441.umutyucel07.workers.dev/portal/dogrula" \
  -H "content-type: application/json" -d '{"kod":"MY-XXXX-XXXX"}'
```

Geçerli kod → `{"ok":true,"ad":"...","dosya":null}`; geçersiz → `{"ok":false,"neden":"eslesmedi"}`.

---

## Adım 2 — Worker'a portal modülünü ekle

`worker-v6-portal-modulu.js` dosyasındaki 4 fonksiyonu (`sha256hex`, `portalHizAsimi`,
`portalDogrula`, `portalYukle`) mevcut `worker.js`'in en altına, `export { worker_default as default }`
satırından **önce** yapıştır. Ardından `fetch()` içindeki POST bloğuna, imza
doğrulamasından **önce**, şu iki satırı ekle:

```js
if (yol === "/portal/dogrula") return portalDogrula(request, env);
if (env.ERISIM_TOKEN && yol === `/portal/yukle/${env.ERISIM_TOKEN}`) return portalYukle(request, env);
```

İsteğe bağlı 4. şablonu (`portal_kodu`) `SABLONLAR` nesnesine ekle (modül dosyasının
altında hazır). Sonra deploy:

```bash
cd ~/Documents/GitHub/umut
npx wrangler deploy    # veya mevcut deploy akışınız neyse
```

**Kırmızı çizgiler (mevcut Worker'ın korumaları — hiçbiri bozulmayacak):**

- Portal ucu mevcut webhook/gonder/rehber uçlarından **bağımsız**; onlara dokunma.
- `portalDogrula` IP başına dakikada 8 denemeyle sınırlı, 5 dk kilitli — kaba kuvvete karşı.
- Kod KV'de **düz metin durmaz**, yalnız SHA-256. Uç sızsa bile kod geri çözülemez.
- `/gonder` ucu hâlâ yalnız sabit şablon kabul eder; **kod gövdesi oradan geçmez.**

---

## Adım 3 — Siteyi sunucu doğrulamasına geçir

`js/oturum.js` içindeki `dogrula` fonksiyonu sunucuya soracak biçimde değiştirilir.
Fonksiyon **async** olur; `js/site.js` (veya girişi çağıran dosya) bunu `await` etmeli.

`dogrula` gövdesindeki client-side eşleştirme:

```js
var m = (window.MUVEKKILLER || []).filter(function (x) { return x.kod === kod; })[0];
if (m) { sil(KILIT); yaz(OTURUM, { kod: kod, t: Date.now() }); return { ok: true, muvekkil: m }; }
```

şununla değiştirilir:

```js
try {
  var r = await fetch('https://muddy-hat-f441.umutyucel07.workers.dev/portal/dogrula', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ kod: kod, tc4: (girilenTc4 || '') })
  });
  var j = await r.json();
  if (j.ok) {
    sil(KILIT);
    yaz(OTURUM, { kod: kod, t: Date.now() });   // kodun kendisini değil, oturum bileti sakla
    return { ok: true, muvekkil: { ad: j.ad, tur: j.tur, dosya: j.dosya } };
  }
  if (j.neden === 'tc4_gerekli') return { ok: false, tc4Iste: true, hata: 'Lütfen T.C. kimlik numaranızın son 4 hanesini giriniz.' };
  if (j.neden === 'cok_deneme') return { ok: false, hata: 'Çok fazla deneme yapıldı; lütfen birkaç dakika sonra tekrar deneyiniz.' };
} catch (e) { return { ok: false, hata: 'Bağlantı kurulamadı; lütfen sonra tekrar deneyiniz.' }; }
```

Ayrıca:

- `aktif()` fonksiyonu da `window.MUVEKKILLER`'e bakıyor — o da sunucuya sormalı ya
  da yalnız oturum biletinin süresine bakıp içeriği girişte alınana güvenmeli.
- **`window.MUVEKKILLER` client'tan tamamen kaldırılır.** `buro-bilgi.js`'teki 2 örnek
  müvekkil kaydı da silinir — artık kaynak sunucudur.
- `functions/api/kod-talebi.js` **kullanılmaz/silinir**: kodu numaraya güvenip otomatik
  gönderiyordu, güvenli değil (bkz. `00-DURDUR-WEBHOOK-GOREVI.md`). Kod dağıtımı avukatın
  kişiye özel elden gönderimiyle yapılır (dağıtım paketi).

---

## Adım 4 — Dosya durumu içeriği (sonraki iş, bugün değil)

Portal şu an **kod doğrular** ama her müvekkilin dosya durumunu göstermek için içerik
gerekir. İçerik `dosya:<hash>` anahtarında, portal kaydıyla aynı özet altında tutulur:

```json
{ "asama": "Bilirkişi raporu bekleniyor", "esas": "2025/418",
  "mahkeme": "Antalya 3. İş", "sonraki": "2026-04-14 09:40", "guncelleme": "2026-08-12" }
```

Bu veri müvekkil dosyalarından/UYAP'tan üretilir ve **müvekkil adı/T.C. içermez** —
yalnız dosyanın kendi bilgisi. Üretimi ayrı bir görevdir; portal içeriksizken
"dosya bilgisi hazırlanıyor" gösterir, çökmez.

---

## Güvenlik özeti — bu tasarım neden güvenli

| Risk | Bu tasarımdaki karşılık |
|---|---|
| Kodlar tarayıcıda görünür | ❌ engellendi — kodlar yalnız Worker'da, hash olarak |
| KV sızarsa kodlar çözülür | ❌ engellendi — SHA-256, geri çözülemez |
| Ele geçmiş numaraya kod otomatik gider | ❌ engellendi — otomatik gönderim yok, elden dağıtım |
| Kaba kuvvetle kod denenir | ❌ engellendi — IP başına 8/dk + 5 dk kilit |
| Kod tek başına yeterli | ikincil doğrulama: T.C. son-4 (kayıtta varsa) |
| Portal'dan mesaj sızar | portal tek yönlü, yalnız okur; `/gonder` serbest metni reddeder |

---

## Dosya listesi

| Dosya | Ne | Nereye |
|---|---|---|
| `portal-kv-bulk.json` | 472 hash, wrangler formatı | Adım 1-A |
| `portal-kv-seed.json` | 472 hash, Worker ucu formatı | Adım 1-B |
| `worker-v6-portal-modulu.js` | Worker'a eklenecek 4 fonksiyon + route | Adım 2 |
| bu belge | kurulum + Copilot talimatı | — |

**Kişisel veri notu:** `portal-kv-bulk.json` ve `portal-kv-seed.json` müvekkil adı ve
T.C./telefon son-4 içerir. Bunlar `.gitignore`'da tutulur, **GitHub'a konmaz**; yalnız
KV'ye yüklemek için yereldedir. Yükleme bittikten sonra yerelde tutmaya gerek yoktur.
