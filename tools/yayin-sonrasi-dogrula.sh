#!/usr/bin/env bash
# =============================================================================
#  tools/yayin-sonrasi-dogrula.sh
#  14.08 yayın turunun DÖRT adımını canlıdan ölçer ve durumunu basar.
#  Av. Umut Yücel · 14.08.2026
#
#  Sır kullanmaz, sır basmaz. Yalnız gözlemlenebilir canlı durumu okur.
#  Durum kodları bu sitede yalan söyler (SPA yedeği her yola 200 döndürür),
#  bu yüzden ölçüt İÇERİK'tir. Her istek benzersiz ?cb= ile önbelleği deler.
#  wrangler kuruluysa KV okumaları da yapılır (opsiyonel).
# =============================================================================
set -uo pipefail

SITE="https://avumutyucelhukuk.com"
WORKER="https://muddy-hat-f441.umutyucel07.workers.dev"
DEDUPE_KV="aecc61e1db964443bac642c31797a56d"
PORTAL_KV="583fd6cb034c460b9eb7436273a79459"
gecti=0; bekle=0
cb() { echo "cb=$$-$RANDOM-$(date +%s 2>/dev/null || echo 0)"; }
iyi() { printf '  ✅ %s\n' "$1"; gecti=$((gecti+1)); }
 npd() { printf '  ⏳ %s\n' "$1"; bekle=$((bekle+1)); }

echo "14.08 yayın turu — canlı durum"
echo "────────────────────────────────────────────────────────────"

# --- Adım 0/site: temel sağlık --------------------------------------------
echo "· Site & uçlar"
gj() { curl -s -m 15 "$SITE/api/$1?$(cb)"; }
echo "$(gj giris)"      | grep -q '"service":"giris"'      && iyi "/api/giris ayakta"       || npd "/api/giris yanıt vermedi"
echo "$(gj kod-talebi)" | grep -q '"service":"kod-talebi"' && iyi "/api/kod-talebi ayakta"  || npd "/api/kod-talebi yanıt vermedi"

# Kodsuz istekte veri dönmemeli
g="$(curl -s -m 15 -X POST -H 'content-type: application/json' -d '{}' "$SITE/api/giris?$(cb)")"
echo "$g" | grep -q '"durum":"bicim"' && iyi "kodsuz/biçimsiz istek reddediliyor (veri sızmıyor)" || npd "giriş beklenm/edik yanıt: $g"

# Dizin-yokken-yalan onarımı canlı mı? (doğru biçimli koda 'hazir-degil' beklenir; 'yok' YANLIŞ olurdu)
gd="$(curl -s -m 15 -X POST -H 'content-type: application/json' -d '{"kod":"UY-2345-6789"}' "$SITE/api/giris?$(cb)")"
case "$gd" in
  *'"durum":"hazir-degil"'*) iyi "giriş: dizin yokken 'hazırlanıyor' diyor (yalan yok)";;
  *'"durum":"acik"'*)        iyi "giriş: geçerli bir kayıt açıldı (dizin yüklü)";;
  *'"durum":"yok"'*)         npd "giriş HÂLÂ 'eşleşmedi' diyor — dizin-yokken-yalan onarımı canlı değil";;
  *)                          npd "giriş beklenm/edik: $gd";;
esac

# --- Adım 1: otomatik cevap (Worker) --------------------------------------
echo "· Adım 1 — otomatik cevap (Worker)"
wc1="$(curl -s -m 15 -o /dev/null -w '%{http_code}' "$WORKER/?hub.mode=subscribe&hub.verify_token=YANLIS&hub.challenge=x&$(cb)")"
[ "$wc1" = "403" ] && iyi "Worker doğrulama ucu ayakta (yanlış token → 403)" || npd "Worker verify beklenm/edik: HTTP $wc1"
# Render hâlâ callback ise ölç (uyku göstergesi)
rt="$(curl -s -m 40 -o /dev/null -w '%{time_total}' "https://uyhukuk-webhook.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=YANLIS&hub.challenge=x" 2>/dev/null || echo 99)"
awk -v t="$rt" 'BEGIN{ if (t+0>3) exit 1 }' && iyi "Render yanıtı hızlı (${rt}s) — ya uyanık ya devre dışı" || npd "Render yavaş (${rt}s) — uyku riski; callback Worker'a alınmalı (Adım 1)"

if command -v wrangler >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; then
  W="wrangler"; command -v wrangler >/dev/null 2>&1 || W="npx wrangler"
  bugun="sayac:gonderim:$(date -u +%Y-%m-%d 2>/dev/null || echo 0000-00-00)"
  say="$($W kv key get "$bugun" --namespace-id "$DEDUPE_KV" --remote 2>/dev/null || echo '')"
  [ -n "$say" ] && iyi "bugün otomatik teyit sayacı: $say (mesaj ulaşıyor)" || npd "bugün otomatik teyit YOK — hatta mesaj ulaşmamış olabilir (Adım 1)"
else
  printf '     (wrangler yok — KV okumaları atlandı)\n'
fi

# --- Adım 2: WA_TOKEN / kod üretimi ---------------------------------------
echo "· Adım 2 — kod üretimi (WA_TOKEN)"
kt="$(curl -s -m 15 -X POST -H 'content-type: application/json' -d '{"ad":"DENEME KISI","tel":"5001112233"}' "$SITE/api/kod-talebi?$(cb)")"
case "$kt" in
  *'"durum":"yok"'*)         iyi "kod-talebi eşleştirme yapıyor (dizin+jeton hazır; sahte kişi 'yok')";;
  *'"durum":"kuyruk"'*)      npd "jeton yok (dizin var) — WA_TOKEN eklenmeli (Adım 2)";;
  *'"durum":"hazir-degil"'*) npd "jeton yok ya da dizin yüklü değil (Adım 2/3)";;
  *'"durum":"gonderildi"'*)  npd "sahte kişiye kod gitti?! beklenmedik — incele";;
  *)                          npd "kod-talebi beklenm/edik: $kt";;
esac

# --- Adım 3: dizin ---------------------------------------------------------
echo "· Adım 3 — müvekkil dizini"
if command -v wrangler >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; then
  W="wrangler"; command -v wrangler >/dev/null 2>&1 || W="npx wrangler"
  dz="$($W kv key get sys:dizin --namespace-id "$PORTAL_KV" --remote 2>/dev/null || echo '')"
  case "$dz" in
    *'"adet"'*) iyi "dizin yüklü: $dz";;
    *)          npd "dizin yüklü değil — Adım 3 (muvekkil-yukle.js)";;
  esac
else
  printf '     (wrangler yok — dizin KV okuması atlandı)\n'
fi

echo "────────────────────────────────────────────────────────────"
printf '  hazır: %s   bekleyen: %s\n' "$gecti" "$bekle"
[ "$bekle" -eq 0 ] && echo "✅ Dört adım da canlıda tamam." || echo "⏳ Bekleyen adımlar var — KOPILOT-YAYIN-PAKETI-14-08.md'ye bakın."
exit 0
