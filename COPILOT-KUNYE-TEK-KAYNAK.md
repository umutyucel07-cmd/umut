# GitHub Copilot Görev Belgesi — Künyeyi gerçekten tek kaynağa bağla

**Depo:** `~/Documents/GitHub/umut` · **12.08.2026** · Süre: ~40 dakika
**Değişen:** `index.html`, `manifest.webmanifest`, `js/buro.js`, `functions/api/*.js`, yeni bir guard script

---

## Neden bu iş Copilot'a veriliyor

Bu bir **kod refaktörü**; depoda dosya düzenlemek gerekiyor, Copilot bunu benden
hızlı yapar. Aşağıdaki iki iş ise **bende değil, kimsede değil, sizde**:
Instagram şifresi ve WhatsApp Business telefon uygulaması. Onlar en altta ayrı
bölümde.

---

## Bulgu: "tek kaynak" kuralı fiilen hiç çalışmıyor

`js/buro-bilgi.js` içinde künyenin tek kaynağı olması gereken nesne var:

```js
window.BURO = {
  ad:   'Av. Umut Yücel',
  buro: 'Umut Yücel Hukuk Bürosu',
  baroSicil: '6448',
  ...
};
```

Tasarım kuralı da net: *"Künye bilgileri yalnız `window.BURO` üzerinden; elle
yazılmaz."*

**Ama depoda `BURO.buro` ifadesini okuyan tek bir satır yok.** Doğrulama:

```bash
cd ~/Documents/GitHub/umut
grep -rn "BURO\.buro" --exclude-dir=.git .    # → sıfır sonuç
```

Yani alan tanımlı, kimse okumuyor, herkes kendi kopyasını yazmış. Depodaki
sabit yazım sayısı:

| Dosya | Adet | Ne kadar önemli |
|---|---|---|
| `functions/api/kod-talebi.js` | 3 | E-posta gövdesi — müvekkile gider |
| `index.html` | 2 | **`<title>` ve `og:title` — Google bunu indeksledi** |
| `manifest.webmanifest` | 1 | PWA kurulum adı |
| `js/buro.js` | 1 | Arayüz |
| `js/buro-bilgi.js` | 1 | Kaynağın kendisi (kalacak) |
| `functions/api/webhook.js` | 1 | Sunucu tarafı |
| `.github/copilot-instructions.md` | 1 | Belge |
| `FACEBOOK-CROSSPOST-TASK.md*` | 4 | Belge — dokunma, arşiv |

### Bu neden şimdi acil oldu

Büro unvanı **baroca teyit edilmedi** ve ortalıkta altı ayrı yazımı dolaşıyor.
Site 12.08.2026'da Google dizinine girdi — yani **teyit edilmemiş unvan artık
`<title>` üzerinden indekste.** Teyit gelince değiştirmek gerekecek ve bugünkü
hâliyle bu, sekiz dosyada elle arama-değiştirme demek. Bir tanesi unutulursa
yedinci varyant doğar.

> **Not — bunu abartmayın:** büro unvanı kullanmak yasak değil; Yön. m.7/d
> kapalı listesinde "büro/ortaklık unvanı" **izinli** kalemdir. Sorun yasaklık
> değil **doğruluk**: teyit edilmemiş bir unvanı yayımlamak AK m.34 özen
> yükümlülüğü açısından savunmasız bırakır. Yapılacak iş unvanı silmek değil,
> **tek yerden değiştirilebilir hâle getirmek.**

---

## ADIM 1 — Künyeyi build zamanında tek yerden bas

Site derlemesiz, düz dosya sunuyor. En temiz çözüm: küçük bir üretim adımı.

### 1a. Kaynağı Node'dan da okunabilir yap

`js/buro-bilgi.js` şu an tarayıcıya `window.BURO` atıyor; Node ile okunamıyor.
Sonuna, **dosyanın geri kalanına dokunmadan**, şunu ekle:

```js
// Node tarafı (build script) da aynı kaynağı okusun diye:
if (typeof module !== 'undefined' && module.exports) { module.exports = window.BURO; }
```

`window` Node'da tanımsız olduğu için dosyanın en başına şu korumayı koy:

```js
var window = typeof globalThis.window !== 'undefined' ? globalThis.window : (globalThis.window = {});
```

⚠️ Tarayıcıda `var window = window` yeniden atama yapmamalı — yukarıdaki biçim
güvenlidir ama **değişikliği yaptıktan sonra siteyi tarayıcıda mutlaka aç ve
konsolda hata olmadığını gör.** Bu dosya sitenin tamamını besliyor; bozarsan
site beyaz ekran verir.

### 1b. Şablon işaretçileri koy

Aşağıdaki dosyalarda sabit yazılmış unvanı `{{BURO}}` ile değiştir:

- `index.html` — `<title>` ve `<meta property="og:title">`
- `manifest.webmanifest` — `name` ve varsa `short_name`
- `js/buro.js`
- `functions/api/kod-talebi.js` (3 yer)
- `functions/api/webhook.js`

`.md` dosyalarına **dokunma** — onlar belge/arşiv.

### 1c. Üretim scripti

`tools/kunye-bas.js`:

```js
#!/usr/bin/env node
// {{BURO}} ve {{AD}} işaretçilerini js/buro-bilgi.js'teki tek kaynaktan doldurur.
const fs = require('fs'), path = require('path');
const KOK = path.resolve(__dirname, '..');
const BURO = require(path.join(KOK, 'js/buro-bilgi.js'));

const HEDEFLER = [
  'index.html', 'manifest.webmanifest', 'js/buro.js',
  'functions/api/kod-talebi.js', 'functions/api/webhook.js',
];
const ESLEME = { '{{BURO}}': BURO.buro, '{{AD}}': BURO.ad, '{{SICIL}}': BURO.baroSicil };

let toplam = 0;
for (const rel of HEDEFLER) {
  const p = path.join(KOK, rel);
  if (!fs.existsSync(p)) { console.warn('atlandı (yok):', rel); continue; }
  let s = fs.readFileSync(p, 'utf8'); const once = s;
  for (const [k, v] of Object.entries(ESLEME)) s = s.split(k).join(v);
  if (s !== once) { fs.writeFileSync(p, s, 'utf8'); toplam++; console.log('yazıldı:', rel); }
}
console.log(`\n${toplam} dosya güncellendi. Künye: "${BURO.buro}"`);
```

**Dikkat:** bu script işaretçiyi gerçek değerle değiştirir, yani **tek yönlüdür.**
İşaretçili sürümü kaybetmemek için `index.html` yerine `index.template.html`
tutup çıktıyı `index.html` üretmek daha temizdir. Hangisini seçersen seç,
`.gitignore` ve dağıtım akışıyla tutarlı olsun — **üretilen dosya ile kaynak
dosyayı karıştırma.**

---

## ADIM 2 — Regresyon guard'ı

Asıl kalıcı değer bu: bir daha kimse künyeyi elle yazamasın.

`tools/kunye-denetle.sh`:

```bash
#!/usr/bin/env bash
# Depoda künyenin sabit yazılmış olmadığını doğrular. CI ve pre-commit için.
set -euo pipefail
cd "$(dirname "$0")/.."

YASAK=(
  "Av. Umut Yücel Hukuk Bürosu" "Umut Yücel Hukuk Bürosu" "Yücel Hukuk Bürosu"
  "Umut Yücel Hukuk" "Umut Yucel Hukuk" "Yucel Hukuk"
)
# Kaynağın kendisi ve belgeler muaf
MUAF='^\./(js/buro-bilgi\.js|.*\.md|\.github/|node_modules/|\.git/)'

hata=0
for v in "${YASAK[@]}"; do
  while IFS= read -r f; do
    [[ "$f" =~ $MUAF ]] && continue
    echo "❌ $f — künye sabit yazılmış: \"$v\""
    hata=1
  done < <(grep -rIl -F --exclude-dir=.git --exclude-dir=node_modules "$v" . 2>/dev/null || true)
done

if [ "$hata" -eq 1 ]; then
  echo
  echo "Künye yalnız js/buro-bilgi.js içinde bulunur."
  echo "Diğer dosyalarda {{BURO}} işaretçisi kullanılır; tools/kunye-bas.js doldurur."
  exit 1
fi
echo "✅ Künye tek kaynakta."
```

`chmod +x` yap. Sonra `.git/hooks/pre-commit` içine:

```bash
#!/usr/bin/env bash
tools/kunye-denetle.sh || { echo "Commit durduruldu."; exit 1; }
```

---

## ADIM 3 — Doğrula

Bu adımı **atlama**. Site canlıda ve yeni indekslendi.

```bash
cd ~/Documents/GitHub/umut

# 1. Kaynak Node'dan okunuyor mu
node -e "console.log(require('./js/buro-bilgi.js').buro)"    # → Umut Yücel Hukuk Bürosu

# 2. Üretim çalışıyor mu
node tools/kunye-bas.js

# 3. Guard yakalıyor mu (kasten boz, sonra geri al)
echo "Umut Yücel Hukuk Bürosu" >> index.html
tools/kunye-denetle.sh    # ❌ vermeli
git checkout index.html
tools/kunye-denetle.sh    # ✅ vermeli

# 4. Site bozulmadı mı — DEĞİŞMEZ KURALLAR
grep -c "unpkg.com\|cdn.jsdelivr\|cdnjs" index.html   # → 0 olmalı, dış kaynak YASAK
grep -c "defer" index.html                            # → 0'dan büyük olmalı
grep -c "noscript" index.html                         # → 0'dan büyük olmalı
grep -c '"@type": *"Person"' index.html               # → 1 olmalı
grep -c 'Attorney\|LocalBusiness' index.html          # → 0 olmalı
wc -c js/varliklar.js                                 # → 619 civarı olmalı
```

**Son satırlar kritik.** `js/varliklar.js` 619 bayt yerine 440 KB olursa eski
`site-dagitim` paketi bulaşmış demektir — geri al. `Attorney` veya
`LocalBusiness` şeması eklenirse Google yerel-işletme paneli açar, bu reklam
yasağı m.7/e riski doğurur; **yalnız `Person` kalacak.**

Bitince tarayıcıda `avumutyucelhukuk.com` aç, konsolda hata yok, açılış perdesi
kalkıyor, künye doğru görünüyor.

---

## ADIM 4 — Bittiğinde

Bana **"künye tek kaynağa bağlandı"** yazın. Ben:

1. `unvan-degistir.sh` scriptini sadeleştiririm — depo tarafı artık tek satır
   (`--sadece-kaynak` yeterli hâle gelir), script yalnız beceri dosyaları ve
   arşiv için kalır
2. `umut-yucel-sistem/SKILL.md` §2.1'e guard'ı değişmez kural olarak eklerim
3. Baro teyidi geldiğinde geçiş, **tek satır + beş elle kanal** olur

---

## ⛔ Bunlar Copilot işi DEĞİL — sizde

Copilot'un da benim de erişimimiz yok; ikisi de sizin elinizde:

| İş | Neden | Ne yapılacak |
|---|---|---|
| **Instagram site bağlantısı** | Oturum şifre istiyor; şifre girmek ne bende ne Copilot'ta | **Önce karar verin:** denetçi bu adımı *riskli* buldu (Yön. m.7/e siteler arası yönlendirme; kendi sitene link için açık istisna yok, içtihat da yok). Eklemezseniz risk sıfır. Eklerseniz düz alan adı yazın, izleme parametresi koymayın |
| **WhatsApp Business "Hakkında" + Kategori** | Meta kısıtı: numara telefondaki uygulamayla ortak kullanımda olduğu için hem API hem Business Manager **salt-okunur** (ikisinde de doğrulandı) | Telefondan: WhatsApp Business → Ayarlar → İşletme profili → Hakkında: `Av. Umut Yücel — Antalya Barosu, sicil no 6448` |
| **LinkedIn deneyim kaydı** | Unvan teyidi gelmeden değiştirmenin anlamı yok | Baro teyidi gelince, `unvan-degistir.sh --uygula` çıktısındaki kontrol listesiyle birlikte |
| **Baro unvan teyidi** | Antalya Barosu'ndan yazı gerekiyor | Barodan **kayıtlı büro unvanını yazılı** isteyin. Altı varyantı çözecek tek şey bu |
| **44 duruşmanın müvekkil adı** | `~/Desktop/HUKUK-AVUKATLIK` klasörüne erişim izni verilemedi | Ayrı belge hazır: `COPILOT-MUVEKKIL-ESLESTIRME.md` — bu **gerçekten** Copilot işi, ona verin |

---

## Kırmızı çizgiler

- `js/varliklar.js` **619 bayt** kalacak. Eski `site-dagitim` klasöründen dosya kopyalanmayacak
- `index.html`'e **dış kaynak eklenmeyecek** (unpkg, jsdelivr, cdnjs — hiçbiri)
- JSON-LD şeması **yalnız `Person`**; `Attorney`/`LocalBusiness` eklenmeyecek
- `defer` ve `noscript` **kaldırılmayacak** — ikisi de site indekslensin diye var
- Künye alanlarının **değerleri** değiştirilmeyecek; bu görev yalnız *nereden okunduğunu* değiştirir
- Şüphede kalırsan uygulama, sor. Bu depo canlı siteyi besliyor


---

## Kapanış notu — 13.08.2026 03:48

### Şu ana kadar yapılanlar
- `js/buro-bilgi.js` Node'dan okunabilir hale getirildi; `module.exports` eklendi.
- `tools/kunye-bas.js` üretim scripti kuruldu ve `--uygula` / tarama modu verildi.
- `tools/kunye-denetle.sh` guard çalışır durumda tutuldu.
- `index.html`, `manifest.webmanifest`, `js/buro.js`, `functions/api/kod-talebi.js` ve `sw.js` için sabit künye alanları tarandı.
- `tools/index-denetle.sh` birden çok kez çalıştırıldı; mevcut site bütünlük kontrolü geçti.

### Kısmi sonuç
- Kaynak artık tek noktadan okunabiliyor.
- Ancak çıktı dosyalarında sabit künye hâlâ bulunuyor; template/çıktı ayrımı tamamlanmadı.
- Bu yüzden iş, hedeflenen “tam tek-kaynak” seviyesinde bitmiş sayılmaz.

### Claude'a bırakılan talimat
1. `index.html`, `manifest.webmanifest`, `js/buro.js`, `functions/api/kod-talebi.js`, `functions/api/webhook.js` ve gerekiyorsa `sw.js` içinde künye alanlarını `{{BURO}}` / `{{AD}}` işaretçilerine çevir.
2. `tools/kunye-bas.js` ile bu işaretçileri üretim anında doldur.
3. `tools/kunye-denetle.sh` ile `js/buro-bilgi.js` dışındaki sabit yazımı sıfıra indir.
4. Ardından `tools/index-denetle.sh` ile yayın güvenliğini tekrar doğrula.
5. Değişiklikleri commit + push etmeden önce `node -e "console.log(require('./js/buro-bilgi.js').buro)"` kontrolünü tekrar çalıştır.

### Müvekkil eşleştirme için çıkan güvenli satırlar
- 2025/54 → Behiye Kök
- 2026/217 → Eda Hanım
- 2025/571 → Mustafa Laik
- 2025/578 → Tuğrul Gökhan Yıldız
- 2024/203 → Samet Kocagöz
- 2026/572 → Berke Tarıkcı (olası)
- 2025/410 → Onur (olası)
- 2025/358 → Ramazan Bey (olası)
- 2026/179 → Ayşe Gültekin (olası)
