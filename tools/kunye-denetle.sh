#!/usr/bin/env bash
# ============================================================================
#  kunye-denetle.sh — künye tutarlılık denetimi
#  Av. Umut Yücel · 13.08.2026 (yeniden yazıldı — ZORUNLU MODA ALINDI)
#
#  ESKİ HEDEF (terk edildi): "künye yalnız js/buro-bilgi.js'te dursun, diğer
#  dosyalarda {{BURO}} işaretçisi olsun". Bu hedef statik bir sitede
#  ULAŞILAMAZ: index.html'in <title> ve <noscript> blokları ile
#  manifest.webmanifest ve sw.js, JavaScript ÇALIŞMADAN okunur. Googlebot
#  künyeyi orada görür. İşaretçi bırakılırsa dizine "{{BURO}}" girer.
#
#  Şablon+çıktı ayrımı da denendi ve reddedildi: bu depo üç kez, birinin eski
#  bir index.html kopyasını üzerine yazmasıyla bozuldu. Kaynak/çıktı ikiliği
#  o hatanın dördüncüsünü davet eder.
#
#  YENİ DEĞİŞMEZ: künye birden çok dosyada SABİT durabilir — ama hepsi
#  js/buro-bilgi.js ile AYNI olmak zorundadır. Asıl risk "iki kopya" değil,
#  "iki kopyanın birbirinden ayrışması"dır. Denetlenen budur.
#
#  Sapma bulunursa:  node tools/kunye-bas.js --uygula
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

ZORUNLU=${ZORUNLU:-1}

if ! command -v node >/dev/null 2>&1; then
  echo "⚠️  node bulunamadı — künye denetimi atlandı."
  exit 0
fi

if node tools/kunye-bas.js; then
  exit 0
fi

echo
echo "Düzeltme:  node tools/kunye-bas.js --uygula"
echo "Kaynak   :  js/buro-bilgi.js  (tek doğruluk kaynağı)"
if [ "$ZORUNLU" = "1" ]; then
  echo "❌ DENETİM BAŞARISIZ — commit/push durduruldu. (istisna: --no-verify)"
  exit 1
fi
echo "⚠️  UYARI MODU — devam ediliyor."
exit 0
