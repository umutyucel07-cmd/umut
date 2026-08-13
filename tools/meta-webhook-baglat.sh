#!/usr/bin/env bash
# =============================================================================
#  tools/meta-webhook-baglat.sh
#  WhatsApp webhook callback'ini Meta Graph API ile Worker'a bağlar.
#  Av. Umut Yücel · 14.08.2026
#
#  NE YAPAR: Meta uygulamasının "whatsapp_business_account" aboneliğinin
#  callback URL + verify token + fields(messages) değerlerini günceller.
#  Yani Meta konsolundaki "Web kancaları" ekranının yaptığını komut satırında yapar.
#
#  NEDEN VAR: Meta konsoluna tarayıcıyla girmeden (ör. Copilot yerelde) callback'i
#  Render'dan Worker'a almak için. Konsol yolu KOPILOT-YAYIN-PAKETI-14-08.md Adım 1'de.
#
#  ── SIR YÖNETİMİ — KATI ─────────────────────────────────────────────────────
#  Üç sır YALNIZ ortam değişkeninden okunur. Komut satırına yazılmaz, dosyaya
#  yazılmaz, ekrana basılmaz, commit edilmez:
#     META_APP_SECRET   uygulama gizli anahtarı
#     VERIFY_TOKEN      Worker'ın VERIFY_TOKEN'ı ile AYNI olmalı
#     CALLBACK_URL      https://muddy-hat-f441.umutyucel07.workers.dev/giris/<ERISIM_TOKEN>
#  Sır olmayan:
#     META_APP_ID       varsayılan 1100673212493214 (Live uygulama)
#
#  ── KULLANIM ────────────────────────────────────────────────────────────────
#     read -rs META_APP_SECRET && export META_APP_SECRET
#     read -rs VERIFY_TOKEN    && export VERIFY_TOKEN
#     read -rs CALLBACK_URL    && export CALLBACK_URL
#     export META_APP_ID=1100673212493214
#     bash tools/meta-webhook-baglat.sh --kuru   # önce yazmadan göster
#     bash tools/meta-webhook-baglat.sh          # uygula
#     unset META_APP_SECRET VERIFY_TOKEN CALLBACK_URL
# =============================================================================
set -euo pipefail

APP_ID="${META_APP_ID:-1100673212493214}"
GRAPH="https://graph.facebook.com/v20.0"
KURU=0
[ "${1:-}" = "--kuru" ] && KURU=1

dur() { printf '\n❌ %s\n\n' "$1" >&2; exit 1; }

command -v curl >/dev/null || dur "curl bulunamadı."
[ -n "${META_APP_SECRET:-}" ] || dur "META_APP_SECRET ortamda yok. 'read -rs META_APP_SECRET && export META_APP_SECRET'"
[ -n "${VERIFY_TOKEN:-}" ]    || dur "VERIFY_TOKEN ortamda yok (Worker'daki VERIFY_TOKEN ile AYNI olmalı)."
[ -n "${CALLBACK_URL:-}" ]    || dur "CALLBACK_URL ortamda yok (.../giris/<ERISIM_TOKEN>)."

# Callback biçim denetimi: kör yanlış URL göndermeyi engeller.
case "$CALLBACK_URL" in
  https://*/giris/*) : ;;
  *) dur "CALLBACK_URL beklenen biçimde değil: https://<worker>/giris/<ERISIM_TOKEN>. Kök '/' yol ÇALIŞMAZ (META_APP_SECRET Worker'da yok)." ;;
esac

# App access token = APP_ID|APP_SECRET (Graph API'nin kabul ettiği biçim).
APP_TOKEN="${APP_ID}|${META_APP_SECRET}"

# Ekrana yalnız sır OLMAYAN özet basılır.
printf 'Meta webhook bağlama%s\n' "$([ $KURU = 1 ] && echo '  (KURU — yazmaz)')"
printf '  App ID    : %s\n' "$APP_ID"
printf '  Nesne     : whatsapp_business_account\n'
printf '  Alan      : messages\n'
printf '  Callback  : %s\n' "$(printf '%s' "$CALLBACK_URL" | sed -E 's#(/giris/).{4}.*#\1****(gizli)#')"
printf '  Verify tk : ****(gizli, %s hane)\n' "${#VERIFY_TOKEN}"

if [ "$KURU" = 1 ]; then
  printf '\n✅ Kuru çalışma. Değerler yerinde görünüyor. --kuru bayrağını kaldırıp yeniden çalıştırın.\n'
  exit 0
fi

# --- Uygula: app-level whatsapp_business_account aboneliğini güncelle ---------
YANIT="$(curl -sS -X POST "${GRAPH}/${APP_ID}/subscriptions" \
  -d "object=whatsapp_business_account" \
  --data-urlencode "callback_url=${CALLBACK_URL}" \
  --data-urlencode "verify_token=${VERIFY_TOKEN}" \
  -d "fields=messages" \
  -d "access_token=${APP_TOKEN}")"

printf '\nGraph yanıtı: %s\n' "$YANIT"

case "$YANIT" in
  *'"success":true'*)
    printf '\n✅ Callback güncellendi. Şimdi kendi telefonunuzdan hukuki içerikli bir mesaj atıp\n'
    printf '   otomatik teyidi bekleyin. Doğrulama:\n'
    printf '   npx wrangler kv key get songonderim --namespace-id aecc61e1db964443bac642c31797a56d --remote\n'
    ;;
  *)
    dur "Graph 'success:true' dönmedi. Yukarıdaki yanıtı okuyun (çoğu zaman verify token uyuşmuyor ya da uygulama izinleri eksik). Callback DEĞİŞMEDİ."
    ;;
esac
