#!/usr/bin/env bash
# ============================================================================
#  yayin-hazirla.sh — yayın dizinini kur (KALICI ÇÖZÜM)
#  Av. Umut Yücel · 13.08.2026
#
#  SORUN: Cloudflare Pages, "build output directory" boş bırakıldığında depo
#  kökünün TAMAMINI yayınlar. Bu yüzden /COPILOT-YAYIN.md, /PORTAL-KURULUM.md,
#  /.env.example ve tools/ altındaki scriptler canlı sitede AÇIKTI.
#
#  GEÇİCİ KAPAK: _redirects içindeki 404 kuralları. Çalışıyor ama her yeni
#  belge için bir satır istiyor — unutulmaya açık.
#
#  KALICI ÇÖZÜM: yayınlanacakları AYRI bir dizine kopyalamak ve Pages'e
#  o dizini göstermek. Kapsayıcı değil, SEÇİCİ liste — yeni bir belge
#  eklendiğinde hiçbir şey yapılmasa bile sızmaz. Varsayılan "yayınlama".
#
#  CLOUDFLARE AYARI (bir kez, elle):
#    Pages → proje → Settings → Builds & deployments
#      Build command            : bash tools/yayin-hazirla.sh
#      Build output directory   : _site
#
#  Yerel deneme:  bash tools/yayin-hazirla.sh && ls -la _site
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

CIKTI="_site"

# Temizlik BİLEREK katı: eski bir çıktı dizini kalırsa artık yayınlanmaması
# gereken dosyalar yeni derlemeye sızabilir. Silinemiyorsa derleme DURUR.
if [ -e "$CIKTI" ] && ! rm -rf "$CIKTI" 2>/dev/null; then
  cat >&2 <<'SON'
❌ Eski _site dizini silinemedi — derleme durduruldu.

Bu, Cloudflare derleme sunucusunda OLMAZ; orada her derleme temiz bir
kopyayla başlar. Bu hatayı yerelde görüyorsanız muhtemel sebep: Cowork
köprüsündeki bağlı klasör "unlink" işlemine izin vermiyor.

Yerelde denemek isterseniz depoyu köprü dışında bir yere klonlayın, ya da
_site dizinini elle silin.

Derleme kasten durduruldu: yarım temizlenmiş bir dizinle devam etmek, eski
bir belgenin sessizce yayına çıkması demektir. Sızıntıyı kapatmak için
yazılmış bir scriptin yapabileceği en kötü şey budur.
SON
  exit 1
fi
mkdir -p "$CIKTI"

# ── Yayınlanacaklar — BEYAZ LİSTE. Burada olmayan hiçbir şey yayınlanmaz. ──
DOSYALAR=(
  index.html
  manifest.webmanifest
  sw.js
  _headers
  _redirects
  robots.txt
  sitemap.xml
  styles.css
  apple-touch-icon.png
  icon-192.png
  icon-512.png
  icon-maskable-512.png
)
DIZINLER=(
  js
  vendor
  assets
  functions
  yonetim-uy2608
)

for f in "${DOSYALAR[@]}"; do
  [ -f "$f" ] && cp "$f" "$CIKTI/"
done
for d in "${DIZINLER[@]}"; do
  [ -d "$d" ] && cp -R "$d" "$CIKTI/"
done

# ── Yayın dizininden temizlenecekler ────────────────────────────────────────
# Karantina uçları ve yedek kopyalar js/ ile birlikte kopyalanmış olabilir.
find "$CIKTI" -type f \( \
      -name '*.KARANTINA' -o -name '*.yedek-*' -o -name '*.oncesi-*' \
   -o -name '*.eski-*'    -o -name '*.orijinal-*' -o -name '*.gomulu-*' \
   -o -name '*.jsx'       -o -name '*.map' \) -delete 2>/dev/null || true

# ── Bağımlılık denetimi ─────────────────────────────────────────────────────
#  13.08.2026: beyaz liste ilk yazıldığında styles.css ve dört PWA ikonu
#  ATLANMIŞTI. Ayar o hâliyle yapılsaydı site stilsiz açılacak, PWA kurulumu
#  ve sw.js önbelleği bozulacaktı. Beyaz liste elle tutulan bir listedir ve
#  elle tutulan her liste eskir. Bu yüzden liste artık DENETLENİYOR:
#  index.html ve manifest neyi istiyorsa yayın dizininde bulunmak ZORUNDA.
if command -v python3 >/dev/null 2>&1; then
  python3 - "$CIKTI" <<'PYEOF' || hata=1
import io, json, os, re, sys
cikti = sys.argv[1]
istenen = set()
try:
    h = io.open(os.path.join(cikti, "index.html"), encoding="utf-8").read()
    for m in re.finditer(r'(?:src|href)="([^"]+)"', h):
        y = m.group(1)
        if y.startswith(("http://", "https://", "#", "data:", "mailto:", "tel:")):
            continue
        istenen.add(y.lstrip("./").lstrip("/"))
except Exception as e:
    print("  ❌ index.html okunamadı:", e); sys.exit(1)
try:
    d = json.load(io.open(os.path.join(cikti, "manifest.webmanifest"), encoding="utf-8"))
    for i in d.get("icons", []):
        istenen.add(str(i.get("src", "")).lstrip("./").lstrip("/"))
except Exception:
    pass
eksik = [y for y in sorted(istenen) if y and not os.path.exists(os.path.join(cikti, y))]
if eksik:
    print("  ❌ yayın dizininde EKSİK — site bozulur:")
    for y in eksik:
        print("       ", y)
    print("     Bu dosyaları DOSYALAR/DIZINLER beyaz listesine ekleyin.")
    sys.exit(1)
print(f"  ✓ bağımlılık denetimi: {len(istenen)} yolun tamamı yayın dizininde")
PYEOF
else
  echo "  ⚠️  python3 yok — bağımlılık denetimi atlandı"
fi

# ── Doğrulama: sızıntı var mı ───────────────────────────────────────────────
hata=0
SIZAN=$(find "$CIKTI" -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
[ "$SIZAN" -ne 0 ] && { echo "❌ yayın dizininde $SIZAN adet .md var"; hata=1; }
[ -e "$CIKTI/tools" ]       && { echo "❌ tools/ yayın dizinine girmiş";  hata=1; }
[ -e "$CIKTI/.env.example" ] && { echo "❌ .env.example yayın dizininde"; hata=1; }
[ -e "$CIKTI/.github" ]     && { echo "❌ .github/ yayın dizininde";      hata=1; }
[ -f "$CIKTI/index.html" ]  || { echo "❌ index.html KOPYALANMAMIŞ";      hata=1; }

if [ -f "$CIKTI/js/varliklar.js" ]; then
  VB=$(wc -c < "$CIKTI/js/varliklar.js" | tr -d ' ')
  [ "$VB" -ge 2000 ] && { echo "❌ varliklar.js $VB bayt (gömülü sürüm)"; hata=1; }
fi

# ── Reklam yasağı + sızıntı taraması — YAYIN DİZİNİ ÜZERİNDE ────────────────
#  13.08 dersi: "Kanca TEK BAŞINA YETMİYOR — yayın akışının kendisi denetimi
#  çağırmalı." Kanca --no-verify ile atlanabilir; burası atlanamaz.
#  Taramanın _site üzerinde koşması bilinçli: yayına GİDEN dosyalar denetlenir,
#  depodaki yedek/kaynak kopyalar değil.
if [ -f tools/reklam-sizinti-denetle.sh ]; then
  echo "  reklam yasağı + sızıntı taraması ($CIKTI)…"
  bash tools/reklam-sizinti-denetle.sh "$CIKTI" || hata=1
fi

[ "$hata" -eq 1 ] && exit 1

echo "✅ yayın dizini hazır: $CIKTI"
find "$CIKTI" -type f | wc -l | xargs echo "   dosya sayısı:"
du -sh "$CIKTI" 2>/dev/null | awk '{print "   boyut       : "$1}'
