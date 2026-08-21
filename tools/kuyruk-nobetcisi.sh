#!/bin/zsh
# ============================================================================
#  kuyruk-nobetcisi.sh — kod-talebi kuyrugunun SESSIZLIGINI kirar
#  Av. Umut Yucel · 16.08.2026 (21.08: bildirim metni duzeltildi, asagida)
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
# launchd, TCC korumasi nedeniyle ~/Documents'i OKUYAMAZ (16.08'de olculdu:
# exit 127 / "can't open input file"). Bu calisir kopya bu yuzden ~/.uy-nobet
# altinda durur ve wrangler hesap baglamini dizinden degil env'den alir.
export CLOUDFLARE_ACCOUNT_ID="42cee80ca1465fe0bd27e3756b385f20"
cd "$HOME" || exit 1

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
# BOS KUYRUK ile ULASILAMAYAN KV AYNI SEY DEGILDIR.
#
# 16-20.08 arasi bu ayrim yoktu: ikisi de bos ANAHTARLAR uretiyordu ve betik
# HER TURDA "liste bos dondu (ag/wrangler?)" yaziyordu. Dort gunde ~380 kez.
# Olculdu 20.08: talep: onekli anahtar sayisi 0 — yani kuyruk BOSTU, KV
# saglikliydi. Uyari bastan sona sahtedi.
#
# Asil zarar sahte alarm degil: GERCEK bir kesintide de betik AYNI satiri
# yazacakti. Her turda oten bir uyari uyari degildir; tasidigi bilgi sifirdir.
# Nobetcinin tek isi hatanin sessiz kalmamasiydi; nobetcinin kendisi dort gun
# sessizce korduu.
#
# Ayrim CIKIS KODU ve GOVDE BICIMI ile yapilir:
#   cikis != 0        -> gercek hata
#   govde bos         -> gercek hata (wrangler hep bir sey basar)
#   govde "[" ile baslamiyor -> JSON degil, gercek hata
#   govde "[]"        -> SAGLIKLI, kuyruk bos
HAM=$(npx --yes wrangler@latest kv key list \
  --namespace-id "$NS_KIMLIK" --prefix "talep:" --remote 2>/dev/null)
CIKIS=$?

GECERLI=0
case "$HAM" in
  \[*) GECERLI=1 ;;
esac

if [ $CIKIS -ne 0 ] || [ $GECERLI -eq 0 ]; then
  kayit "HATA: KV listesi alinamadi (cikis=$CIKIS) — KUYRUK DENETLENEMEDI"
  bildir "KV'ye ulasilamadi — kuyruk DENETLENEMEDI (cikis=$CIKIS)"
  ANAHTARLAR=""
else
  ANAHTARLAR=$(print -r -- "$HAM" | grep '"name"' | sed 's/.*"name": *"\([^"]*\)".*/\1/')
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
      # 21.08 ek: portalde kalıcı bir TEST kaydı var (wa-uctan-uca-dene.sh'nin
      # sınadığı "Umut Nuh Çelik" / ...3203). O betik çalıştırıldığında Meta
      # engeliyse bu kayıt da GERÇEK bir müvekkil talebiymiş gibi kuyruğa
      # düşer; test kaydı için avukatı aramaya yönlendirmek yanlış alarmdır.
      # NOT: KV'deki "ad" alanı Title Case ("Umut Nuh Çelik") — büyük/küçük
      # harften bağımsız karşılaştırılır (${(L)} zsh küçük harfe çevirir).
      if [ "${(L)AD}" = "umut nuh çelik" ] && [ "$SON4" = "3203" ]; then
        kayit "TEST KAYDI (wa-uctan-uca-dene.sh) — bildirim BASTIRILDI: $K"
      else
        # 21.08: onceki metin "arayip elden iletin" diyordu — bu YANLISTI.
        # kod-talebi.js tasarimi geregi basarisiz denemede uretilen kod
        # HICBIR YERDE saklanmiyor (yalniz basarili gonderimde KV'ye hash
        # olarak yaziliyor). Elde iletecek somut bir kod yok; asagidaki metin
        # artik bunu dogru soyluyor ve gercekci bir eylem oneriyor.
        bildir "Yeni kod talebi kuyrukta: $AD (...$SON4). WhatsApp gonderimi basarisiz oldu — uretilen kod HICBIR YERDE sakli degil, elde iletecek kod yok. Muvekkili arayip durumu aciklayin (daha once aldigi bir kod varsa hala gecerlidir); engel kalkinca siteden kendisi yeniden dener."
      fi
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
