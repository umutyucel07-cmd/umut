#!/usr/bin/env bash
# ============================================================================
#  kimlik-denemesi.sh — /api/giris ve /api/kod-talebi uçtan uca deneme
#  Av. Umut Yücel · 13.08.2026
#
#  Sahte KV ve sahte WhatsApp ile 23 senaryo koşar. Ağ gerektirmez, sır
#  gerektirmez, hiçbir yere yazmaz. Müvekkil kimlik doğrulaması canlı bir
#  yoldur; her değişiklikten sonra bu koşmalıdır.
#
#  Neden geçici kopya: functions/ ve lib/ ESM'dir, depoda package.json yok.
#  Node .js uzantısını CommonJS sayar. Kopyalar .mjs uzantısıyla koşulur.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."
D=$(mktemp -d)
trap 'rm -rf "$D"' EXIT
cp lib/kimlik.js            "$D/kimlik.mjs"
cp lib/buro-gizli.js        "$D/buro-gizli.mjs"   # 16.08: giris yaniti buradan besleniyor
cp functions/api/giris.js   "$D/giris.mjs"
cp functions/api/kod-talebi.js "$D/kod.mjs"
cp tools/kimlik-denemesi.mjs   "$D/test.mjs"
sed -i.yedek "s#'../../lib/kimlik.js'#'./kimlik.mjs'#" "$D/giris.mjs" "$D/kod.mjs"
sed -i.yedek "s#'../../lib/buro-gizli.js'#'./buro-gizli.mjs'#" "$D/giris.mjs"
node "$D/test.mjs"
