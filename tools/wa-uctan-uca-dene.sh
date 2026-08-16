#!/usr/bin/env bash
# ============================================================================
#  wa-uctan-uca-dene.sh — WhatsApp kod gönderim yolunu UÇTAN UCA sınar
#  Av. Umut Yücel · 16.08.2026
#
#  ── NEDEN VAR ─────────────────────────────────────────────────────────────
#  Sistemde İKİ AYRI Meta jetonu var ve ikisi bağımsız bozulabiliyor:
#
#    1) Worker  muddy-hat-f441   → gelen mesaja OTOMATİK TEYİT gönderir
#    2) Pages   avumutyucelhukuk → müvekkile ERİŞİM KODU gönderir
#
#  16.08.2026'da ölçüldü: Worker'ınki sağdı, Pages'inki BOZUKTU. İkisi de
#  "WA_TOKEN" adını taşıdığı için "WhatsApp çalışıyor mu?" sorusu tek başına
#  yanıltıcı — biri çalışırken diğeri ölü olabilir ve KIRIK OLAN, müvekkilin
#  gördüğü taraftır: kod telefona düşmez, ekranda "büromuz iletecektir" yazar,
#  talep sessizce bir kuyruğa girer. Dışarıdan hiçbir belirti yoktur.
#
#  Bu betik ikinci yolu (Pages → Meta) doğrudan sınar.
#
#  ── ÖN KOŞUL: 24 SAAT PENCERESİ ───────────────────────────────────────────
#  Meta, işletmenin serbest metin göndermesine ancak kullanıcı son 24 saatte
#  yazdıysa izin verir. Bu yüzden sınama İKİ ADIMLIDIR:
#
#    ADIM 1 (elle) : test kişisi KENDİ hattından büro hattına, içinde hukuki
#                    bir anahtar kelime geçen bir mesaj atar. Örnek:
#                      "Merhaba, tebligat konusunda bilgi almak istiyorum."
#                    Otomatik teyit geldiyse → Worker jetonu SAĞ.
#                    Gelmediyse → ya jeton ölü ya numara rehberde 'sahsi'.
#
#    ADIM 2 (bu betik) : koddan kod talebi. Kod o telefona düşerse
#                        → Pages jetonu da SAĞ. Düşmezse → Pages jetonu bozuk.
#
#  ── KULLANIM ──────────────────────────────────────────────────────────────
#    bash tools/wa-uctan-uca-dene.sh              # test kaydıyla koşar
#    bash tools/wa-uctan-uca-dene.sh --aciklama   # yalnız yorumla, istek atma
#
#  ⚠️  BU BETİK GERÇEK MESAJ GÖNDERTİR. Yalnız portal dizinindeki TEST kaydına
#      karşı koşar; başka bir ada karşı koşmayı reddeder (aşağıdaki guard).
#      Gerçek müvekkil adıyla koşmayın — kendi kodunu geçersiz kılar.
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.."

UC="${UY_UC:-https://avumutyucelhukuk.com}"

# ── TEST KAYDI ────────────────────────────────────────────────────────────
#  Kaynak: 05_Bellek_Arsivi/oturum-arsivi/2026-08-14-...-kod-talebi-onarimlari.md §4
#  "138 kayıt (137 gerçek + 1 test). Test kaydı: Umut Nuh Çelik, tel son4 3203,
#   sicil TEST-2026, dosyalar boş. TC bilerek KAYDEDİLMEDİ."
#  Test bitince bu kayıt hem _Veri/muvekkil-portal.json'dan hem KV'den kaldırılacak;
#  o zaman bu betik de silinir ya da yeni test kaydına göre güncellenir.
TEST_AD="UMUT NUH ÇELİK"
TEST_TEL="5518513203"

if [ "${1:-}" = "--aciklama" ]; then
  echo "Sınanacak uç : $UC/api/kod-talebi"
  echo "Test kaydı   : $TEST_AD · ...${TEST_TEL: -4}"
  echo "İstek ATILMADI (--aciklama)."
  exit 0
fi

# Guard: gerçek müvekkil adına karşı koşulmasın.
case "$TEST_AD" in
  "UMUT NUH ÇELİK") : ;;
  *) echo "❌ Bu betik yalnız portal dizinindeki TEST kaydına karşı koşar."
     echo "   Gerçek müvekkil adıyla koşmak o kişinin mevcut kodunu geçersiz kılar."
     exit 1 ;;
esac

echo "── WhatsApp uçtan uca sınama ───────────────────────────────────────"
echo "  uç        : $UC/api/kod-talebi"
echo "  test kaydı: $TEST_AD · ...${TEST_TEL: -4}"
echo
echo "  ÖN KOŞUL: test kişisi son 24 saat içinde büro hattına yazmış olmalı."
echo "            (Meta 24 saat penceresi — yoksa Meta serbest metni reddeder"
echo "             ve bu, JETON BOZUK sanılabilecek bir hata üretir.)"
echo

YANIT=$(curl -s -X POST "$UC/api/kod-talebi" \
  -H 'Content-Type: application/json' \
  -d "{\"ad\":\"$TEST_AD\",\"tel\":\"$TEST_TEL\",\"kanal\":\"whatsapp\",\"kaynak\":\"uctan-uca-dene\"}" \
  -w '\n%{http_code}')

HTTP=$(printf '%s' "$YANIT" | tail -n1)
GOVDE=$(printf '%s' "$YANIT" | sed '$d')

echo "  HTTP: $HTTP"
DURUM=$(printf '%s' "$GOVDE" | sed -n 's/.*"durum"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
MESAJ=$(printf '%s' "$GOVDE" | sed -n 's/.*"mesaj"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
echo "  durum: ${DURUM:-?}"
echo "  mesaj: ${MESAJ:-?}"
echo

# Kodun yanıtta DÖNMEMESİ tasarım gereğidir — kod yalnız WhatsApp ile gider.
if printf '%s' "$GOVDE" | grep -q 'UY-'; then
  echo "  🔴 CİDDİ: yanıtın içinde kod görünüyor. Kod yalnız WhatsApp ile"
  echo "     gitmelidir; HTTP yanıtında dönmesi bilgi sızıntısıdır."
fi

echo "── Sonuç ───────────────────────────────────────────────────────────"
case "${DURUM:-}" in
  gonderildi)
    echo "  ✅ Pages WA_TOKEN SAĞ — kod test telefonuna gitti."
    echo "     Doğrulamak için telefona bakın. Kod tek kullanımlıktır."
    ;;
  kuyruk)
    echo "  ⚠️  Uç 6 saniyede yanıt vermedi; talep kuyruğa alındı."
    echo "     Bu 'bozuk' demek değil — ağ yavaşlığı da olabilir. Telefona bakın:"
    echo "     kod geldiyse yol sağlamdır, gelmediyse hata olarak sayın."
    ;;
  hata|gonderim-hatasi)
    echo "  ⛔ Pages WA_TOKEN BOZUK — Meta gönderimi reddetti."
    echo "     Bu, MÜVEKKİLİN GÖRDÜĞÜ taraftır: kod telefona düşmez, ekranda"
    echo "     'büromuz iletecektir' yazar, talep kuyruğa girer."
    echo "     Çare: 05_Bellek_Arsivi/00_GUVENLIK/KASA-FISI-META-SYSTEM-USER-JETONU.md"
    ;;
  wa-yok|kanal-yok)
    echo "  ⛔ Pages'te WA_TOKEN / WA_PHONE_ID TANIMSIZ."
    echo "     Değişken hiç yok ya da adı farklı. Kod şu sırayla bakıyor:"
    echo "       WA_TOKEN → WHATSAPP_TOKEN → WHATSAPP_ACCESS_TOKEN"
    echo "       WA_PHONE_ID → PHONE_NUMBER_ID → WA_PHONE_NUMBER_ID"
    ;;
  hazir-degil)
    echo "  ⛔ KOD_KV bağlı değil ya da müvekkil dizini boş."
    echo "     Bu bir JETON sorunu DEĞİL — kurulum sorunudur."
    ;;
  yok)
    echo "  ⛔ Ad + telefon dizinde eşleşmedi."
    echo "     Test kaydı kaldırılmış olabilir (kaldırılması planlanmıştı)."
    echo "     Kaldırıldıysa bu betik de güncellenmeli ya da silinmeli."
    ;;
  sik)
    echo "  ⏳ Kısa süre önce talep oluşturulmuş. Birkaç dakika sonra deneyin."
    ;;
  *)
    echo "  ❓ Beklenmeyen durum. Ham yanıt:"
    echo "     $GOVDE"
    ;;
esac
echo "────────────────────────────────────────────────────────────────────"
