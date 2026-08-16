#!/bin/zsh
# ============================================================================
#  kuyruk-nobetcisi.sh — kod-talebi kuyrugunun SESSIZLIGINI kirar
#  Av. Umut Yucel · 16.08.2026
#
#  ── NEDEN VAR ─────────────────────────────────────────────────────────────
#  WhatsApp gonderimi coktugunde /api/kod-talebi talebi SESSIZCE KV kuyruguna
#  yazar; muvekkil "buromuz iletecektir" gorur, avukat HABERDAR OLMAZ.
#  16.08 Meta blokunda olculen tek gercek is riski buydu. Bu betik her 15
#  dakikada kuyruga bakar; YENI kayit gorunce Mac bildirimi + kendine iMessage
#  atar. Meta'ya dokunmaz, yeni hesap istemez, deger sizmaz.
#
#  Worker tarafini da izler: hata:gonderim anahtarinin tarihi degisirse
#  otomatik teyit hatti da kirilmis demektir — ayni yolla haber verir.
#
#  ── KURULUM (bir kez) ─────────────────────────────────────────────────────
#    launchctl load -w ~/Library/LaunchAgents/com.uy.kuyruk-nobetcisi.plist
#  Kaldirmak icin: launchctl unload -w ...ayni yol...
#
#  Elle calistirma:  zsh tools/kuyruk-nobetcisi.sh
#  Gunluk:           ~/.uy-nobet/gunluk.log
# ============================================================================
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
set -u
# wrangler hesap baglamini repo kokunden alir — betik nereden cagrilirsa
# cagrilsin oraya gecilir (16.08 tohum turunda olculen ders: cd olmadan
# liste BOS donuyor ve nobetci kor kaliyor).
cd "$(dirname "$0")/.." || exit 1

NS_KIMLIK="583fd6cb034c460b9eb7436273a79459"   # uy-portal-kimlik (talep: kuyrugu)
NS_DEDUPE="aecc61e1db964443bac642c31797a56d"   # whatsapp-dedupe (hata:gonderim)
DURUM_DIZIN="$HOME/.uy-nobet"
GORULEN="$DURUM_DIZIN/gorulen-anahtarlar.txt"
HATA_TARIH="$DURUM_DIZIN/worker-hata-tarihi.txt"
GUNLUK="$DURUM_DIZIN/gunluk.log"
IMSG_HEDEF="umutyucel07@gmail.com"             # kendine iMessage (Apple ID)

mkdir -p "$DURUM_DIZIN"
touch "$GORULEN" "$HATA_TARIH"

kayit() { print -r -- "$(date '+%Y-%m-%d %H:%M:%S')  $1" >> "$GUNLUK"; }

bildir() {
  local MSJ="$1"
  # 1) Mac bildirimi (izin gerektirmez)
  osascript -e "display notification \"$MSJ\" with title \"UY Kuyruk Nobetcisi\" sound name \"Ping\"" >/dev/null 2>&1
  # 2) Kendine iMessage (telefona duser). Basarisiz olursa sessizce gecer.
  osascript >/dev/null 2>&1 <<OSA
tell application "Messages"
  try
    set hedefServis to 1st account whose service type = iMessage
    set hedefKisi to participant "$IMSG_HEDEF" of hedefServis
    send "UY Nobetci: $MSJ" to hedefKisi
  end try
end tell
OSA
}

# ── 1 · talep: kuyrugu ──────────────────────────────────────────────────────
ANAHTARLAR=$(npx --yes wrangler@latest kv key list \
  --namespace-id "$NS_KIMLIK" --prefix "talep:" --remote 2>/dev/null \
  | grep '"name"' | sed 's/.*"name": *"\([^"]*\)".*/\1/')

if [ -z "$ANAHTARLAR" ] && ! grep -q "ILKKURULUM" "$GORULEN" 2>/dev/null; then
  kayit "UYARI: liste bos dondu (ag/wrangler?) — alarm uretilmedi"
fi

YENI_SAYI=0
YENI_OZET=""
print -r -- "$ANAHTARLAR" | while IFS= read -r K; do
  [ -z "$K" ] && continue
  if ! grep -qxF "$K" "$GORULEN"; then
    print -r -- "$K" >> "$GORULEN"
    if [ -s "$GORULEN.seeded" ]; then
      DEGER=$(npx --yes wrangler@latest kv key get "$K" \
        --namespace-id "$NS_KIMLIK" --remote 2>/dev/null)
      AD=$(print -r -- "$DEGER" | sed -n 's/.*"ad":"\([^"]*\)".*/\1/p')
      SON4=$(print -r -- "$DEGER" | sed -n 's/.*"telSon4":"\([^"]*\)".*/\1/p')
      kayit "YENI KUYRUK KAYDI: $K → $AD (...$SON4)"
      bildir "Yeni kod talebi kuyrukta: $AD (...$SON4). Kod ULASMADI — arayip elden iletin."
    fi
  fi
done

# Ilk calisma: mevcutlari devral, alarm uretme
if [ ! -s "$GORULEN.seeded" ]; then
  ADET=$(grep -c . "$GORULEN" 2>/dev/null); [ -z "$ADET" ] && ADET=0
  print "ILKKURULUM $(date '+%F %T') — $ADET kayit devralindi" > "$GORULEN.seeded"
  kayit "Ilk kurulum: $ADET mevcut kayit alarm uretmeden devralindi"
fi

# ── 2 · Worker hata:gonderim tarihi ────────────────────────────────────────
WHATA=$(npx --yes wrangler@latest kv key get "hata:gonderim" \
  --namespace-id "$NS_DEDUPE" --remote 2>/dev/null \
  | sed -n 's/.*"tarih":"\([^"]*\)".*/\1/p')
ESKI=$(cat "$HATA_TARIH" 2>/dev/null)
if [ -n "$WHATA" ] && [ "$WHATA" != "$ESKI" ]; then
  print -r -- "$WHATA" > "$HATA_TARIH"
  if [ -n "$ESKI" ]; then
    kayit "WORKER HATASI YENILENDI: $WHATA"
    bildir "WhatsApp otomatik teyit hatti hata verdi ($WHATA). Gelen mesajlara cevap gitmiyor olabilir."
  else
    kayit "Worker hata tarihi devralindi: $WHATA (alarm yok)"
  fi
fi

kayit "tur tamam"
