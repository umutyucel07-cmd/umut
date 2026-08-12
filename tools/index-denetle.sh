#!/usr/bin/env bash
# ============================================================================
#  index-denetle.sh — index.html bütünlük denetimi
#  Av. Umut Yücel · 12.08.2026
#
#  NEDEN VAR: 12.08.2026'da commit 8c1c772 sitenin Google dizinine girmesini
#  sağlayan iki bloğu ekledi (noscript künyesi + Person JSON-LD). BİR SONRAKİ
#  commit (7488fdf "müvekkil girişi: kalıcı oturum") ikisini de, defer'i de
#  sessizce geri aldı ve unpkg'yi geri getirdi. Commit başlığı bunu anlatmıyordu;
#  eski bir index.html kopyası üzerine yazılmıştı. Kimse fark etmedi.
#
#  Bu script o hatanın tekrarını imkânsız kılar.
#  Kullanım:  ./tools/index-denetle.sh        (depo kökünden)
#  Kanca:     .git/hooks/pre-commit içinden çağrılır
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

F=index.html
[ -f "$F" ] || { echo "❌ $F bulunamadı"; exit 1; }

hata=0
kontrol() { # ad · gerçek · beklenen · açıklama
  local ad="$1" ger="$2" bek="$3" not="$4"
  if [ "$ger" = "$bek" ]; then
    printf "  ✅ %-22s %s\n" "$ad" "$ger"
  else
    printf "  ❌ %-22s %s  (beklenen: %s) — %s\n" "$ad" "$ger" "$bek" "$not"
    hata=1
  fi
}
enaz() { # ad · gerçek · asgari · açıklama
  local ad="$1" ger="$2" min="$3" not="$4"
  if [ "$ger" -ge "$min" ] 2>/dev/null; then
    printf "  ✅ %-22s %s\n" "$ad" "$ger"
  else
    printf "  ❌ %-22s %s  (en az: %s) — %s\n" "$ad" "$ger" "$min" "$not"
    hata=1
  fi
}

echo "index.html bütünlük denetimi"
echo "────────────────────────────────────────────────────────────"

enaz    "Person JSON-LD"  "$(grep -c 'application/ld+json' "$F")" 1 \
        "Sitenin dizine girmesini sağlayan bloklardan biri"
enaz    "noscript künye"  "$(grep -c '<noscript>' "$F")" 1 \
        "Googlebot'un gördüğü metin bu blok olmadan 10 karaktere düşer"
kontrol "unpkg (dış origin)" "$(grep -c 'unpkg' "$F")" 0 \
        "Dış origin sayısı sıfır olmalı; vendor/ kullanılır"
kontrol "cloudflareinsights" "$(grep -c 'cloudflareinsights' "$F")" 0 \
        "Cloudflare yayında kendi ekler; kaynağa yazılırsa iki kez girer"
kontrol "vendor/ referansı" "$(grep -c 'vendor/' "$F")" 3 \
        "react + react-dom + lucide yerel olmalı"

# defer: her <script src=...> defer taşımalı (sayı zamanla artabilir, oran sabit)
SRC=$(grep -o '<script[^>]*src="[^"]*"' "$F" | wc -l | tr -d ' ')
DEF=$(grep -o '<script defer src="[^"]*"' "$F" | wc -l | tr -d ' ')
kontrol "defer'li script"   "$DEF" "$SRC" \
        "Her harici script defer almalı (ayrıştırmayı bloklamamak için)"

enaz    "DOMContentLoaded"  "$(grep -c 'DOMContentLoaded' "$F")" 1 \
        "Açılış perdesi kapatıcısı bunun İÇİNDE olmalı; dışındaysa beyaz ekran"

# Reklam yasağı: JSON-LD'de yalnız Person; şu şemalar yerel sonuç/derecelendirme açar
YASAK=$(grep -cE '"@type"[[:space:]]*:[[:space:]]*"(Attorney|LegalService|LocalBusiness)"|aggregateRating|priceRange|"review"' "$F")
kontrol "yasak şema alanı"  "$YASAK" 0 \
        "Attorney/LocalBusiness → yerel paket (Yön. m.7/e); rating/review → m.11"

# Reklam yasağı: iş çağrısı ve ücret ibaresi
CAGRI=$(grep -ciE 'randevu alın|hemen ara|bize yazın|iletişime geçebilirsiniz|ücretsiz' "$F")
kontrol "iş çağrısı / ücret" "$CAGRI" 0 \
        "Emir kipi çağrı m.7/c; ücret ibaresi m.7/d + AK m.135/2-n"

# varliklar.js: 440 KB'lik gömülü sürümün geri gelmediğini doğrula
if [ -f js/varliklar.js ]; then
  VB=$(wc -c < js/varliklar.js | tr -d ' ')
  if [ "$VB" -lt 2000 ]; then printf "  ✅ %-22s %s bayt\n" "varliklar.js" "$VB"
  else printf "  ❌ %-22s %s bayt (beklenen <2000) — eski gömülü sürüm geri gelmiş\n" "varliklar.js" "$VB"; hata=1; fi
fi

echo "────────────────────────────────────────────────────────────"
if [ "$hata" -eq 1 ]; then
  cat <<'SON'
❌ DENETİM BAŞARISIZ — commit durduruldu.

Bu bloklar tesadüfen orada değil. 12.08.2026'da bir commit ikisini birden
sessizce sildi ve site indekslemesi riske girdi. Eksik kalemi geri koymadan
devam etmeyin.

Sağlam sürüm referansı:  git show 8c1c772:index.html
Kural belgesi:           CLAUDE.md
Canlı durum:             ~/.agents/skills/umut-yucel-sistem/SKILL.md

Bilinçli bir istisna gerekiyorsa:  git commit --no-verify
SON
  exit 1
fi
echo "✅ index.html bütün. Commit edilebilir."
