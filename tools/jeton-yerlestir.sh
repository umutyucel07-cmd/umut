#!/usr/bin/env bash
# ============================================================================
#  jeton-yerlestir.sh — panodaki Meta jetonunu Worker + Pages'e koyar
#  Av. Umut Yücel · 16.08.2026
#
#  ── NİYE ELLE YAPIŞTIRMIYORUZ ─────────────────────────────────────────────
#  14.08 teşhisi: "Pages WA_TOKEN kopyası bozuk — telefonda eksik/üç noktalı
#  kopya şüphesi." Yani jeton ölmemişti, YAPIŞTIRMA bozuktu. Meta jetonları
#  200+ karakter; panelden elle kopyalarken sonu kesilebiliyor, arayüz üç nokta
#  ile kısaltıp öyle kopyalatabiliyor, mobilde satır sonu ekleniyor.
#  Bu betik değeri PANODAN ALIR ve doğrudan boruyla geçirir — insan eli
#  değmediği için kesilme, boşluk ve satır sonu hatası olamaz.
#
#  ── DEĞER NEREYE GİTMİYOR ─────────────────────────────────────────────────
#  · Ekrana basılmaz (yalnız uzunluk ve ilk 4 karakter gösterilir)
#  · Dosyaya yazılmaz, log tutulmaz
#  · Claude'a geçmez — bu betiği AVUKAT çalıştırır (kural 11 / kasa)
#  · İş bitince pano temizlenir
#
#  ── KULLANIM ──────────────────────────────────────────────────────────────
#    1) Meta'da jetonu üret, "Kopyala" düğmesine bas (KASA'ya da kaydet)
#    2) Terminalde:  bash tools/jeton-yerlestir.sh
#    3) Bitince:     bash tools/wa-uctan-uca-dene.sh
#
#    bash tools/jeton-yerlestir.sh --kuru   → hiçbir şey yazmaz, yalnız denetler
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.."

WORKER="muddy-hat-f441"
PAGES="avumutyucelhukuk"
W="npx --yes wrangler@latest"

KURU=0
[ "${1:-}" = "--kuru" ] && KURU=1

echo "── Meta jetonu yerleştirme ─────────────────────────────────────────"
echo "  hedef 1: Worker  $WORKER   → WA_TOKEN"
echo "  hedef 2: Pages   $PAGES    → WA_TOKEN (production + preview)"
echo

# ── 1 · Panodan oku ────────────────────────────────────────────────────────
if ! command -v pbpaste >/dev/null 2>&1; then
  echo "❌ pbpaste yok (bu betik macOS içindir)."; exit 1
fi
JETON="$(pbpaste | tr -d '\r\n')"      # satır sonu ve CR temizlenir

UZUNLUK=${#JETON}
ONEK="${JETON:0:4}"

echo "  panodaki değer: ${UZUNLUK} karakter · başlangıç \"${ONEK}…\""

# ── 2 · Değeri GÖSTERMEDEN akıl sağlığı denetimi ──────────────────────────
HATA=0
if [ "$UZUNLUK" -lt 100 ]; then
  echo "  ❌ Çok kısa. Meta System User jetonları genelde 180-250 karakterdir."
  echo "     Pano büyük olasılıkla kesik bir kopya taşıyor — Meta'da 'Kopyala'"
  echo "     düğmesini kullanın, metni elle seçmeyin."
  HATA=1
fi
if [ "$ONEK" != "EAA" ] && [ "${JETON:0:3}" != "EAA" ]; then
  echo "  ⚠️  Meta jetonları genellikle 'EAA' ile başlar. Panodaki değer"
  echo "     başka bir şey olabilir (parola? başka bir anahtar?). Devam"
  echo "     etmeden önce doğru şeyi kopyaladığınızdan emin olun."
  HATA=1
fi
case "$JETON" in
  *" "*) echo "  ❌ Değerin içinde BOŞLUK var — kesin kopyalama hatası."; HATA=1 ;;
  *"…"*|*"..."*) echo "  ❌ Değerin içinde ÜÇ NOKTA var — arayüz kısaltmış."; HATA=1 ;;
esac

if [ "$HATA" -eq 1 ]; then
  echo
  echo "  Yerleştirme YAPILMADI. Panoyu düzeltip yeniden çalıştırın."
  exit 1
fi
echo "  ✓ biçim denetimi geçti"
echo

if [ "$KURU" -eq 1 ]; then
  echo "  --kuru: hiçbir şey yazılmadı."
  exit 0
fi

# ── 3 · Worker ─────────────────────────────────────────────────────────────
echo "  → Worker $WORKER …"
if printf '%s' "$JETON" | $W secret put WA_TOKEN --name "$WORKER" >/dev/null 2>&1; then
  echo "    ✓ yazıldı (Worker kendiliğinden yeniden dağıtılır)"
else
  echo "    ❌ yazılamadı. 'npx wrangler whoami' ile oturumu kontrol edin."
  exit 1
fi

# ── 4 · Pages — production ve preview, İKİSİ DE ───────────────────────────
for ORTAM in production preview; do
  echo "  → Pages $PAGES ($ORTAM) …"
  if printf '%s' "$JETON" | $W pages secret put WA_TOKEN \
       --project-name "$PAGES" --env "$ORTAM" >/dev/null 2>&1; then
    echo "    ✓ yazıldı"
  else
    echo "    ⚠️  yazılamadı ($ORTAM) — panelden elle bakın:"
    echo "       https://dash.cloudflare.com/42cee80ca1465fe0bd27e3756b385f20/pages/view/$PAGES/settings/environment-variables"
  fi
done

# ── 5 · Panoyu temizle ─────────────────────────────────────────────────────
printf '' | pbcopy
echo
echo "  ✓ pano temizlendi (jeton panoda kalmasın)"

# ── 6 · Sırada ne var ──────────────────────────────────────────────────────
cat <<'SON'

── Sırada ──────────────────────────────────────────────────────────
  1) Pages, sırları YENİ DAĞITIMDA okur. Yeniden dağıtım gerekiyor:
       · Claude'a "jeton girildi" deyin, boş commit ile tetiklerim, VEYA
       · Cloudflare → Pages → Deployments → son dağıtım → Retry deployment

  2) Dağıtım bitince uçtan uca sınayın:
       bash tools/wa-uctan-uca-dene.sh
     "durum: gonderildi" görürseniz iki jeton da sağdır.

  3) Jetonu KASA'ya kaydettiğinizden emin olun (~/Desktop/KASA/).
     Meta jetonu bir daha göstermez.
────────────────────────────────────────────────────────────────────
SON
