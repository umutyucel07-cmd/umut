#!/usr/bin/env bash
# ============================================================================
#  yayin-dogrula.sh — belge sızıntısı kapandı mı?
#  Av. Umut Yücel · 13.08.2026 (v2)
#
#  DURUM 13.08.2026 06:20 UTC: Cloudflare Pages ayarı UYGULANDI ve dağıtım
#  yenilendi. Ölçüm: 33/33 kapalı, site 12/12 sağlam, /api/kod-talebi JSON.
#  Bu script o durumun bozulmadığını her çalıştırmada yeniden sınar.
#
#  ── ÖLÇÜMLE ÖĞRENİLEN İKİ TUZAK (v2'de düzeltildi) ──────────────────────
#
#  1) DURUM KODU YALAN SÖYLER.  _redirects içindeki "/* /index.html 200"
#     kuralı yüzünden OLMAYAN her yol 200 döner. "404 bekle" diye kurulmuş
#     her denetim bu sitede yanlış sonuç verir.
#     DOĞRU ÖLÇÜT: content-type. text/html geldiyse dosya YOK (tek sayfa
#     yedeği döndü) = KAPALI. application/x-sh, text/markdown,
#     application/octet-stream geldiyse dosya VAR = SIZIYOR.
#
#  2) ÖNBELLEK YALAN SÖYLER.  Ayar uygulandıktan sonra bile eski gövde
#     dönmeye devam edebilir (kenar önbelleği ya da aradaki vekil sunucu;
#     'age' başlığı artarken 'cf-cache-status: DYNAMIC' görülmüştür).
#     Bu yüzden her istek TEKİL bir sorgu dizesiyle yapılır. Sorgu dizesi
#     varlık eşleşmesini değiştirmez ama önbelleği atlar.
#     Bu iki tuzak yüzünden 13.08'de "kapanmadı" diye yanlış rapor
#     yazılmasına RAMAK KALDI. Düzeltme burada kalıcı hale getirildi.
#
#  Kullanım:  bash tools/yayin-dogrula.sh [https://ornek.com]
#  Sır gerektirmez; herkes çalıştırabilir.
# ============================================================================
set -uo pipefail

if ! curl -s -o /dev/null --max-time 8 https://cloudflare.com 2>/dev/null; then
  echo "⚠️  Ag erisimi yok — bu denetim burada calistirilamaz." >&2
  echo "    Kendi terminalinizde ya da CI icinde calistirin." >&2
  exit 2
fi

KOK="${1:-https://avumutyucelhukuk.com}"
CB="cb=$$$(date +%s)"          # her calistirmada tekil — onbellek atlanir

YOLLAR=(
  # kök belgeler
  /COPILOT-YAYIN.md /COPILOT-GOREV-PAKETI-13-08.md /COPILOT-KOD-YAMALARI.md
  /COPILOT-KUNYE-TEK-KAYNAK.md /COPILOT-UC-AYAR.md /CLOUDFLARE-ASISTAN-TALIMATLARI.md
  /PORTAL-KURULUM.md /00-DURDUR-WEBHOOK-GOREVI.md /CLAUDE.md /TESLIM-13-08-2026.md
  /JETON-DONDURME-TALIMATI.md /YETKI-BELGESI.md /GOREV-3-VE-4-DURUM.md /OKU.md
  /CANLI-YAYIN-KONTROL-RAPORU.md /CLAUDE-CANLI-YAYIN-KONTROLU.md
  /CLAUDE-TAMAMLANDI-ISLEM-LISTESI.md /FACEBOOK-CROSSPOST-TASK.md
  # scriptler
  /tools/index-denetle.sh /tools/kunye-bas.js /tools/kunye-denetle.sh
  /tools/yayin-hazirla.sh /tools/yayin-dogrula.sh /tools/jeton-dogrula.sh
  /tools/worker-v6-portal-modulu.js
  # nokta ile baslayanlar — Pages bunlari da yayinlar
  /.env.example /.gitignore
  /.github/CODEOWNERS /.github/copilot-instructions.md
  /.github/workflows/imza-dogrulama.yml
  # kimlik cekirdegi - functions/ derlenirken icine gomulur, YAYINLANMAZ
  /lib/kimlik.js
  # fonksiyon kaynagi
  /functions/api/giris.js /functions/api/kod-talebi.js /functions/api/webhook.js.KARANTINA
  /functions/api/wa-webhook.js.KARANTINA
)

acik=0; kapali=0
echo "yayın sızıntı denetimi — $KOK"
echo "ölçüt: content-type · text/html = dosya yok = KAPALI"
echo "────────────────────────────────────────────────────────────"
for y in "${YOLLAR[@]}"; do
  tur=$(curl -s -o /dev/null --max-time 15 -w '%{content_type}' "$KOK$y?$CB" || true)
  boy=$(curl -s -o /dev/null --max-time 15 -w '%{size_download}' "$KOK$y?$CB" || true)
  case "$tur" in
    text/html*) printf "  ✅ %-42s kapalı\n" "$y"; kapali=$((kapali+1)) ;;
    *)          printf "  ❌ %-42s SIZIYOR (%s · %s B)\n" "$y" "$tur" "$boy"; acik=$((acik+1)) ;;
  esac
done
echo "────────────────────────────────────────────────────────────"
echo "  kapalı: $kapali/${#YOLLAR[@]}   sızan: $acik"

# ── Site hâlâ ayakta mı — kapatma işlemi ana sayfayı bozmamalı ──────────────
ANA=$(curl -s --max-time 15 "$KOK/?$CB" || true)
for k in "<noscript" '"Person"' "vendor/" "Umut Yücel Hukuk Bürosu" "Antalya Barosu"; do
  printf '%s' "$ANA" | grep -qF "$k" || { echo "  ❌ ana sayfada eksik: $k"; acik=$((acik+1)); }
done
printf '%s' "$ANA" | grep -q "unpkg" && { echo "  ❌ ana sayfada unpkg belirdi"; acik=$((acik+1)); }

# ── Beyaz listedeki varlıklar gerçekten sunuluyor mu ────────────────────────
#  Beyaz liste eksik olsaydı site stilsiz/ikonsuz açılırdı; bunlar HTML
#  dönerse dosya YOK demektir — sızıntı denetiminin tam TERSİ mantık.
for v in /styles.css /manifest.webmanifest /sw.js /icon-192.png /icon-512.png \
         /icon-maskable-512.png /apple-touch-icon.png /js/oturum.js /js/buro.js \
         /robots.txt /sitemap.xml; do
  t=$(curl -s -o /dev/null --max-time 15 -w '%{content_type}' "$KOK$v?$CB" || true)
  case "$t" in
    text/html*) echo "  ❌ varlık kayıp: $v (tek sayfa yedeği döndü)"; acik=$((acik+1)) ;;
  esac
done

# ── Fonksiyon ucu hâlâ çalışıyor mu ─────────────────────────────────────────
for u in kod-talebi giris; do
  UC=$(curl -s --max-time 15 "$KOK/api/$u?$CB" || true)
  if printf '%s' "$UC" | grep -q "\"service\":\"$u\""; then
    echo "  ✅ /api/$u Function olarak çalışıyor"
  else
    echo "  ❌ /api/$u JSON dönmüyor — Function kaydolmamış olabilir"
    echo "     Gelen: $(printf '%s' "$UC" | head -c 80)"
    acik=$((acik+1))
  fi
done

# Giris ucu ASLA muvekkil listesi dondurmemeli. Bos kod ile sorulur; yanitta
# baska bir muvekkilin adi/telefonu gecmemeli.
BOS=$(curl -s --max-time 15 -X POST -H 'content-type: application/json' -d '{"kod":""}' "$KOK/api/giris?$CB" || true)
if printf '%s' "$BOS" | grep -qE '"(dosyalar|muvekkil)"'; then
  echo "  ❌ /api/giris kodsuz istekte müvekkil verisi döndürdü"
  acik=$((acik+1))
else
  echo "  ✅ /api/giris kodsuz istekte veri döndürmüyor"
fi

if [ "$acik" -eq 0 ]; then echo "✅ Sızıntı yok, site sağlam."; exit 0; fi
echo "❌ $acik sorun var."
echo "   Ayar yerinde mi: Pages → Settings → Build"
echo "     Build command: bash tools/yayin-hazirla.sh   ·   Output: _site"
echo "   AYARI DEĞİŞTİRMEK TEK BAŞINA YETMEZ: ayar yalnız YENİ dağıtımlara"
echo "   uygulanır. Deployments → son Production → Manage deployment →"
echo "   Retry deployment. Sonra Caching → Purge Everything."
exit 1
