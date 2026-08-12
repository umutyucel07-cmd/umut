#!/usr/bin/env bash
# ============================================================================
#  kunye-denetle.sh — künye tek kaynakta mı denetimi
#  Av. Umut Yücel · 12.08.2026 (düzeltilmiş sürüm)
#
#  AMAÇ: Büro unvanı yalnız js/buro-bilgi.js içinde bulunsun; diğer dosyalarda
#  {{BURO}} işaretçisi kullanılsın. Baro teyidi geldiğinde tek yerden değişsin.
#
#  ⚠️ ŞU AN UYARI MODUNDA — commit'i ENGELLEMEZ.
#  Sebep: refaktör (COPILOT-KUNYE-TEK-KAYNAK.md Adım 1) henüz yapılmadı; künye
#  hâlâ 8 dosyada sabit. Bu hâlde engelleyici çalışırsa HER commit durur,
#  herkes `--no-verify` alışkanlığı edinir ve asıl kritik olan index.html
#  guard'ı da devre dışı kalır. Refaktör bitince ZORUNLU=1 yapın.
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

# Refaktör tamamlandığında bunu 1 yapın → guard commit'i engellemeye başlar.
ZORUNLU=${ZORUNLU:-0}

YASAK=(
  "Av. Umut Yücel Hukuk Bürosu" "Umut Yücel Hukuk Bürosu" "Yücel Hukuk Bürosu"
  "Umut Yücel Hukuk" "Umut Yucel Hukuk" "Yucel Hukuk"
)

# Muaf olanlar:
#   js/buro-bilgi.js  → künyenin tek meşru kaynağı
#   *.md              → belge
#   tools/            → guard'ın kendisi (YASAK dizisi bu dizgeleri içerir!)
#   *.yedek-* / *.oncesi-*  → yedek kopyalar
#   .github/ node_modules/ .git/ vendor/
MUAF='^\./(js/buro-bilgi\.js|tools/|\.github/|node_modules/|\.git/|vendor/)|\.md$|\.yedek-|\.oncesi-|\.eski-'

bulunan=()
for v in "${YASAK[@]}"; do
  while IFS= read -r f; do
    [[ "$f" =~ $MUAF ]] && continue
    bulunan+=("$f")
  done < <(grep -rIl -F --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=vendor "$v" . 2>/dev/null || true)
done

# tekilleştir
if [ ${#bulunan[@]} -gt 0 ]; then
  tekil=$(printf '%s\n' "${bulunan[@]}" | sort -u)
else
  tekil=''
fi

if [ -z "$tekil" ]; then
  echo "✅ Künye tek kaynakta (js/buro-bilgi.js)."
  exit 0
fi

tekil_sayi=$(printf '%s\n' "$tekil" | grep -c '.' || true)

echo "────────────────────────────────────────────────────────────"
echo "Künye $tekil_sayi dosyada sabit yazılmış:"
printf '%s\n' "$tekil" | while IFS= read -r satir; do
  [ -n "$satir" ] && printf '   • %s\n' "$satir"
done
echo
echo "Hedef: künye yalnız js/buro-bilgi.js'te dursun; diğerlerinde {{BURO}}"
echo "işaretçisi olsun ve tools/kunye-bas.js doldursun."
echo "Yol haritası: COPILOT-KUNYE-TEK-KAYNAK.md"
echo "────────────────────────────────────────────────────────────"

if [ "$ZORUNLU" = "1" ]; then
  echo "❌ DENETİM BAŞARISIZ — commit durduruldu. (istisna: git commit --no-verify)"
  exit 1
fi

echo "⚠️  UYARI MODU — commit'e izin veriliyor."
echo "    Refaktör bitince bu dosyada ZORUNLU=1 yapın."
exit 0
