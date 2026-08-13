#!/usr/bin/env bash
# ============================================================================
#  yayin-dogrula.sh — belge sızıntısı kapandı mı?
#  Av. Umut Yücel · 13.08.2026
#
#  Cloudflare'de "Build command: bash tools/yayin-hazirla.sh" ve
#  "Build output directory: _site" ayarlandıktan ve bir dağıtım tamamlandıktan
#  SONRA çalıştırılır. Sır gerektirmez; herkes çalıştırabilir.
#
#  Kullanım:  bash tools/yayin-dogrula.sh
# ============================================================================
set -uo pipefail

# AG ERISIMI KONTROLU — Cowork koprusunun (device_bash) ag erisimi YOKTUR;
# orada calistirilirsa her istek 000 doner ve denetim yaniltici olur.
if ! curl -s -o /dev/null --max-time 8 https://cloudflare.com 2>/dev/null; then
  echo "⚠️  Ag erisimi yok — bu denetim burada calistirilamaz." >&2
  echo "    Kendi terminalinizde ya da CI icinde calistirin." >&2
  exit 2
fi
KOK="${1:-https://avumutyucelhukuk.com}"

YOLLAR=(
  /COPILOT-YAYIN.md /COPILOT-GOREV-PAKETI-13-08.md /COPILOT-KOD-YAMALARI.md
  /COPILOT-KUNYE-TEK-KAYNAK.md /PORTAL-KURULUM.md /00-DURDUR-WEBHOOK-GOREVI.md
  /CLAUDE.md /TESLIM-13-08-2026.md /JETON-DONDURME-TALIMATI.md /YETKI-BELGESI.md
  /GOREV-3-VE-4-DURUM.md /OKU.md /CANLI-YAYIN-KONTROL-RAPORU.md
  /.env.example /tools/index-denetle.sh /tools/kunye-bas.js
  /tools/kunye-denetle.sh /tools/yayin-hazirla.sh /tools/worker-v6-portal-modulu.js
)

acik=0; kapali=0
echo "yayın sızıntı denetimi — $KOK"
echo "────────────────────────────────────────────────────────────"
for y in "${YOLLAR[@]}"; do
  govde=$(curl -s --max-time 15 "$KOK$y" || true)
  kod=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$KOK$y" || true)
  # Belge sızmışsa gövde markdown/script gibi başlar; kapalıysa HTML gelir.
  if printf '%s' "$govde" | head -c 400 | grep -qE '^\s*(#|#!/usr/bin|<!--)'; then
    printf "  ❌ %-40s %s  SIZIYOR\n" "$y" "$kod"; acik=$((acik+1))
  else
    printf "  ✅ %-40s %s\n" "$y" "$kod"; kapali=$((kapali+1))
  fi
done
echo "────────────────────────────────────────────────────────────"
echo "  kapalı: $kapali/${#YOLLAR[@]}   sızan: $acik"

# Site hâlâ ayakta mı — kapatma işlemi ana sayfayı bozmamalı
ANA=$(curl -s --max-time 15 "$KOK/" || true)
for k in "<noscript" '"Person"' "vendor/"; do
  printf '%s' "$ANA" | grep -qF "$k" || { echo "  ❌ ana sayfada eksik: $k"; acik=$((acik+1)); }
done
printf '%s' "$ANA" | grep -q "unpkg" && { echo "  ❌ ana sayfada unpkg belirdi"; acik=$((acik+1)); }

if [ "$acik" -eq 0 ]; then echo "✅ Sızıntı yok, ana sayfa sağlam."; exit 0; fi
echo "❌ $acik sorun var."
echo "   Yayın dizini ayarı yapılmadıysa: Pages → Settings → Builds"
echo "   Build command: bash tools/yayin-hazirla.sh   ·   Output: _site"
exit 1
