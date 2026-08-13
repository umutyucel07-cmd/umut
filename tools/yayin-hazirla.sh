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
rm -rf "$CIKTI"
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
)
DIZINLER=(
  js
  vendor
  assets
  functions
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

[ "$hata" -eq 1 ] && exit 1

echo "✅ yayın dizini hazır: $CIKTI"
find "$CIKTI" -type f | wc -l | xargs echo "   dosya sayısı:"
du -sh "$CIKTI" 2>/dev/null | awk '{print "   boyut       : "$1}'
