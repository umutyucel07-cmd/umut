#!/usr/bin/env bash
# ============================================================================
#  index-denetle.sh — index.html bütünlük denetimi
#  Av. Umut Yücel · 12.08.2026
#
#  NEDEN VAR: 12.08.2026'da commit 8c1c772 sitenin Google dizinine girmesini
#  sağlayan iki bloğu ekledi (noscript künyesi + Person JSON-LD). BİR SONRAKİ
#  commit (7488fdf "müvekkil girişi: kalıcı oturum") ikisini de, defer'i de
#  sessizce geri aldı ve unpkg'yi geri getirdi. Commit başlığı bunu anlatmıyordu;
#  eski bir index.html kopyası üzerine yazılmıştı. Kimse fark etmedi.
#
#  Bu script o hatanın tekrarını imkânsız kılar.
#  Kullanım:  ./tools/index-denetle.sh        (depo kökünden)
#  Kanca:     .git/hooks/pre-commit içinden çağrılır
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

F=index.html
[ -f "$F" ] || { echo "❌ $F bulunamadı"; exit 1; }

hata=0
kontrol() { # ad · gerçek · beklenen · açıklama
  local ad="$1" ger="$2" bek="$3" not="$4"
  if [ "$ger" = "$bek" ]; then
    printf "  ✅ %-22s %s\n" "$ad" "$ger"
  else
    printf "  ❌ %-22s %s  (beklenen: %s) — %s\n" "$ad" "$ger" "$bek" "$not"
    hata=1
  fi
}
enaz() { # ad · gerçek · asgari · açıklama
  local ad="$1" ger="$2" min="$3" not="$4"
  if [ "$ger" -ge "$min" ] 2>/dev/null; then
    printf "  ✅ %-22s %s\n" "$ad" "$ger"
  else
    printf "  ❌ %-22s %s  (en az: %s) — %s\n" "$ad" "$ger" "$min" "$not"
    hata=1
  fi
}

echo "index.html bütünlük denetimi"
echo "────────────────────────────────────────────────────────────"

enaz    "Person JSON-LD"  "$(grep -c 'application/ld+json' "$F")" 1 \
        "Sitenin dizine girmesini sağlayan bloklardan biri"
enaz    "noscript künye"  "$(grep -c '<noscript>' "$F")" 1 \
        "Googlebot'un gördüğü metin bu blok olmadan 10 karaktere düşer"
kontrol "unpkg (dış origin)" "$(grep -c 'unpkg' "$F")" 0 \
        "Dış origin sayısı sıfır olmalı; vendor/ kullanılır"
kontrol "cloudflareinsights" "$(grep -c 'cloudflareinsights' "$F")" 0 \
        "Cloudflare yayında kendi ekler; kaynağa yazılırsa iki kez girer"
kontrol "vendor/ referansı" "$(grep -c 'vendor/' "$F")" 3 \
        "react + react-dom + lucide yerel olmalı"

# defer: her <script src=...> defer taşımalı (sayı zamanla artabilir, oran sabit)
SRC=$(grep -o '<script[^>]*src="[^"]*"' "$F" | wc -l | tr -d ' ')
DEF=$(grep -o '<script defer src="[^"]*"' "$F" | wc -l | tr -d ' ')
kontrol "defer'li script"   "$DEF" "$SRC" \
        "Her harici script defer almalı (ayrıştırmayı bloklamamak için)"

enaz    "DOMContentLoaded"  "$(grep -c 'DOMContentLoaded' "$F")" 1 \
        "Açılış perdesi kapatıcısı bunun İÇİNDE olmalı; dışındaysa beyaz ekran"

# Reklam yasağı: JSON-LD'de yalnız Person; şu şemalar yerel sonuç/derecelendirme açar
YASAK=$(grep -cE '"@type"[[:space:]]*:[[:space:]]*"(Attorney|LegalService|LocalBusiness)"|aggregateRating|priceRange|"review"' "$F")
kontrol "yasak şema alanı"  "$YASAK" 0 \
        "Attorney/LocalBusiness → yerel paket (Yön. m.7/e); rating/review → m.11"

# Reklam yasağı: iş çağrısı ve ücret ibaresi
CAGRI=$(grep -ciE 'randevu alın|hemen ara|bize yazın|iletişime geçebilirsiniz|ücretsiz' "$F")
kontrol "iş çağrısı / ücret" "$CAGRI" 0 \
        "Emir kipi çağrı m.7/c; ücret ibaresi m.7/d + AK m.135/2-n"

# varliklar.js: 440 KB'lik gömülü sürümün geri gelmediğini doğrula
if [ -f js/varliklar.js ]; then
  VB=$(wc -c < js/varliklar.js | tr -d ' ')
  if [ "$VB" -lt 2000 ]; then printf "  ✅ %-22s %s bayt\n" "varliklar.js" "$VB"
  else printf "  ❌ %-22s %s bayt (beklenen <2000) — eski gömülü sürüm geri gelmiş\n" "varliklar.js" "$VB"; hata=1; fi
fi


# ── 13.08.2026'da eklenen üç denetim ────────────────────────────────────────
# Üçü de o gün canlıda ya da depoda gerçekten yaşanmış olaylardan doğdu.

# PAKETLEYICI DIŞA AKTARIMI: tasarım aracının "dışa aktar" çıktısı yayınlanabilir
# site DEĞİLDİR. 1.55 MB'lik dagitim/index.html ve 1.58 MB'lik dışa aktarım
# dosyası üç kez yayın kaynağı sanıldı. İkisi de her şeyi tek dosyaya gömer,
# script src değerleri UUID'dir, noscript/JSON-LD taşımaz.
PAKET=$(grep -rl --include='*.html' -E '__bundler_loading|__bundler_thumbnail' . 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
kontrol "paketleyici çıktısı" "$PAKET" 0 \
        "Bu dosyalar yayın kaynağı değildir; index.html + js/ + vendor/ yayınlanır"

BUYUK=$(find . -name '*.html' -size +200k -not -path './node_modules/*' -not -path './.git/*' 2>/dev/null | wc -l | tr -d ' ')
kontrol "200 KB üstü HTML"  "$BUYUK" 0 \
        "Şişkin HTML = her şeyin gömüldüğü paketleyici tuzağı"

# UÇ DÜRÜSTLÜĞÜ: _redirects içindeki SPA yedeği (/* -> /index.html 200) uç yokken
# de 200 döndürür. js/oturum.js yalnız r.ok'a bakarsa müvekkile "kodunuz
# gönderildi" YALANINI söyler. İçerik türü doğrulaması zorunludur.
if [ -f js/oturum.js ]; then
  DURUST=$(grep -c "content-type" js/oturum.js | tr -d ' ')
  enaz  "uç yanıtı doğrulama" "$DURUST" 1 \
        "SPA yedeği 200 döner; content-type bakılmazsa müvekkile yalan başarı mesajı gider"
fi

# KARANTİNA UÇLARI: ikinci WhatsApp webhook'u + serbest metin + sabit doğrulama
# jetonu. Gerekçe: 05_Bellek_Arsivi/KARANTINA-UCLAR/NEDEN-KARANTINADA.md
KAR=0
[ -f functions/api/webhook.js ] && KAR=$((KAR+1))
[ -f functions/api/wa-webhook.js ] && KAR=$((KAR+1))
kontrol "karantina ucu"     "$KAR" 0 \
        "Çift webhook + serbest metin gönderimi; NEDEN-KARANTINADA.md okunmadan geri konmaz"


# ACIK BELGE: Pages depodaki her dosyayi yayinlar. Kok dizindeki her .md
# _redirects icinde 404'lenmis olmali; yoksa ic belge canliya sizar.
# 13.08.2026: yirmi dosya bu sekilde acik bulundu.
KAPANMAMIS=0
for m in *.md; do
  [ -e "$m" ] || continue
  grep -qF "/$m" _redirects 2>/dev/null || { echo "  ⚠️  _redirects'te kapatilmamis belge: $m"; KAPANMAMIS=$((KAPANMAMIS+1)); }
done
kontrol "acik ic belge"     "$KAPANMAMIS" 0 \
        "_redirects kaydi zorunlu ama TEK BASINA KORUMA DEGIL - Pages statik varligi once sunuyor. Gercek koruma: tools/yayin-hazirla.sh + Pages build cikti dizini"

# ── MUVEKKIL LISTESI TARAYICIDA OLMAZ ───────────────────────────────────────
# 13.08.2026 bulgusu: js/buro-bilgi.js icinde window.MUVEKKILLER dizisi vardi
# ve js/oturum.js girilen erisim kodunu DOGRUDAN o diziyle karsilastiriyordu.
# Dosya herkese acik yayinlanir. Icinde o gun yalniz iki ORNEK kayit vardi
# (Elif Sahin, Murat Kaya - ikisi de buro kayitlarinda arandi, bulunamadi),
# ama dosyanin kendi yorumu "yeni muvekkil eklemek icin bu listeye bir satir
# yazin" diyordu. O satir yazilsaydi 472 muvekkilin adi, erisim kodu, telefon
# son dordu ve dava gecmisi indirilebilir hale gelecekti.
# Dogrulama /api/giris ucuna tasindi. Bu denetim geri gelmesini engeller.
MVSATIR=0
for j in js/*.js; do
  [ -e "$j" ] || continue
  # "window.MUVEKKILLER = [" satirinda hemen ardindan "]" gelmiyorsa dolu demektir
  grep -o 'window\.MUVEKKILLER *= *\[.\{0,3\}' "$j" 2>/dev/null | grep -qv 'window\.MUVEKKILLER *= *\[\]' \
    && { echo "  ⚠️  tarayiciya muvekkil kaydi gomulmus: $j"; MVSATIR=$((MVSATIR+1)); }
done
kontrol "tarayicida muvekkil"  "$MVSATIR" 0 \
        "Dogrulama sunucuda (/api/giris). Bu dizi DOLU olursa muvekkil verisi herkese acik yayinlanir"

# ── KIMLIK CEKIRDEGI YAYINLANMAZ ────────────────────────────────────────────
# lib/kimlik.js biber ve ozet mantigini tasir. functions/ derlenirken icine
# gomulur; yayin dizini beyaz listesinde YER ALMAMALIDIR.
LIBACIK=0
grep -qE '^\s*lib(/|$)' tools/yayin-hazirla.sh 2>/dev/null && LIBACIK=1
kontrol "kimlik cekirdegi acik" "$LIBACIK" 0 \
        "lib/ beyaz listeye eklenirse ozetleme mantigi ve anahtar semasi yayinlanir"

# ── KIMLIK DENEMESI GECMELI ─────────────────────────────────────────────────
# Muvekkil kimlik dogrulamasi canli bir yoldur; sozdizimi denetimi yetmez.
if [ -f tools/kimlik-denemesi.sh ] && command -v node >/dev/null 2>&1; then
  if bash tools/kimlik-denemesi.sh >/tmp/uy-kimlik-deneme.log 2>&1; then
    kontrol "kimlik denemesi" 0 0 ""
  else
    echo "  ⚠️  kimlik denemesi DUSTU - ayrinti: /tmp/uy-kimlik-deneme.log"
    tail -5 /tmp/uy-kimlik-deneme.log | sed 's/^/     /'
    kontrol "kimlik denemesi" 1 0 \
            "bash tools/kimlik-denemesi.sh calistirip duzeltin; giris yolu bozuk birakilamaz"
  fi
fi

echo "────────────────────────────────────────────────────────────"
if [ "$hata" -eq 1 ]; then
  cat <<'SON'
❌ DENETİM BAŞARISIZ — commit durduruldu.

Bu bloklar tesadüfen orada değil. 12.08.2026'da bir commit ikisini birden
sessizce sildi ve site indekslemesi riske girdi. Eksik kalemi geri koymadan
devam etmeyin.

Sağlam sürüm referansı:  git show 8c1c772:index.html
Kural belgesi:           CLAUDE.md
Canlı durum:             ~/.agents/skills/umut-yucel-sistem/SKILL.md

Bilinçli bir istisna gerekiyorsa:  git commit --no-verify
SON
  exit 1
fi
echo "✅ index.html bütün. Commit edilebilir."
