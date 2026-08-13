#!/usr/bin/env bash
# ============================================================================
#  jeton-dogrula.sh — webhook doğrulama jetonu sağlıklı mı?
#  Av. Umut Yücel · 13.08.2026
#
#  İKİ KİPİ VAR:
#    (a) jetonsuz  : YANLIŞ jetonun reddedildiğini doğrular. Herkes çalıştırabilir.
#    (b) jetonlu   : DOĞRU jetonun kabul edildiğini doğrular. Jeton yalnız
#                    avukatın elindedir ve ekrana YAZILMAZ.
#
#  Kullanım:
#    bash tools/jeton-dogrula.sh                 # (a) sır gerektirmez
#    bash tools/jeton-dogrula.sh "YENI_JETON"    # (b) rotasyondan sonra
# ============================================================================
set -uo pipefail

# AG ERISIMI KONTROLU — Cowork koprusunun (device_bash) ag erisimi YOKTUR;
# orada calistirilirsa her istek 000 doner ve denetim yaniltici olur.
if ! curl -s -o /dev/null --max-time 8 https://cloudflare.com 2>/dev/null; then
  echo "⚠️  Ag erisimi yok — bu denetim burada calistirilamaz." >&2
  echo "    Kendi terminalinizde ya da CI icinde calistirin." >&2
  exit 2
fi
JETON="${1:-}"
UCLAR=(
  "Render|https://uyhukuk-webhook.onrender.com/webhook"
  "Worker|https://muddy-hat-f441.umutyucel07.workers.dev/"
)
hata=0

echo "webhook doğrulama denetimi"
echo "────────────────────────────────────────────────────────────"
echo "(a) YANLIŞ jeton — iki uç da reddetmeli"
for u in "${UCLAR[@]}"; do
  ad="${u%%|*}"; adres="${u##*|}"
  kod=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
    "$adres?hub.mode=subscribe&hub.verify_token=YANLIS_$RANDOM$RANDOM&hub.challenge=T1" || true)
  if [ "$kod" = "403" ]; then printf "  ✅ %-8s %s reddetti\n" "$ad" "$kod"
  else printf "  ❌ %-8s %s — 403 bekleniyordu\n" "$ad" "$kod"; hata=1; fi
done

if [ -z "$JETON" ]; then
  echo
  echo "(b) atlandı — doğru jetonla denemek için:"
  echo "     bash tools/jeton-dogrula.sh \"YENI_JETON\""
  echo "     (jeton ekrana yazılmaz, yalnız sonuç gösterilir)"
else
  echo
  echo "(b) DOĞRU jeton — iki uç da 200 dönmeli ve meydan okumayı yansıtmalı"
  MEYDAN="UY$RANDOM"
  for u in "${UCLAR[@]}"; do
    ad="${u%%|*}"; adres="${u##*|}"
    yanit=$(curl -s --max-time 20 \
      "$adres?hub.mode=subscribe&hub.verify_token=$JETON&hub.challenge=$MEYDAN" || true)
    kod=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
      "$adres?hub.mode=subscribe&hub.verify_token=$JETON&hub.challenge=$MEYDAN" || true)
    if [ "$kod" = "200" ] && [ "$yanit" = "$MEYDAN" ]; then
      printf "  ✅ %-8s 200 · meydan okuma doğru yansıtıldı\n" "$ad"
    else
      printf "  ❌ %-8s %s · yansıma hatalı — bu uçta değer yanlış\n" "$ad" "$kod"; hata=1
    fi
  done
  echo
  echo "  İkisi de ✅ ise Meta'ya geçebilirsiniz. Biri ❌ ise ÖNCE onu düzeltin:"
  echo "  Meta'da kaydetmek yeniden doğrulama tetikler; uç hazır değilse abonelik düşebilir."
fi

echo "────────────────────────────────────────────────────────────"
[ "$hata" -eq 0 ] && { echo "✅ denetim temiz."; exit 0; }
echo "❌ sorun var."; exit 1
