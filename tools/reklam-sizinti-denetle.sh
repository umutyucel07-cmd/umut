#!/usr/bin/env bash
# ============================================================================
#  reklam-sizinti-denetle.sh — YAYINLANAN dosyalarda reklam yasağı + sızıntı taraması
#  Av. Umut Yücel · 16.08.2026
#
#  NEDEN YAZILDI — üç ölçülmüş olay:
#
#  1) 12.08'de "ücretsiz ön görüşme" ibaresi Türkçe metinlerden kaldırıldı ve
#     ortak hafızaya "kaldırıldı, geri gelmez" diye yazıldı. 16.08'de ölçüldü:
#     aynı iddia js/site-arama.js içindeki DIL_METIN ÇEVİRİ NESNESİNDE
#     İngilizce, Rusça, Almanca ve Arapça olmak üzere DÖRT DİLDE canlıydı.
#     Türkçe temizlenmişti; çeviri nesnesi hiç aranmamıştı.
#
#  2) Aynı tarama js/articles.js içinde ikinci bir kalıntı buldu: her yazının
#     altında "Bu konu sizin dosyanıza da uyuyor mu? / 15 dakikalık ön görüşmede
#     belgelerinizi birlikte değerlendirelim. / [Randevu Al]" — m.7/c iş elde
#     etme bloğu. "ücretsiz" kelimesi silinmiş, kurgu ayakta kalmıştı.
#
#  3) Ana sayfa ve portal demo kartlarında GERÇEKÇİ esas numaraları vardı
#     (2025/418 E. · Antalya 3. İş Mah.). Veri uydurmaydı ama biçim gerçekti:
#     o numarada BAŞKA BİRİNİN gerçek dosyası olabilir.
#
#  DERS: düz "grep ücretsiz" yetmez. Aranacak olanlar:
#     · beş dil (tr/en/ru/de/ar)      · \uNNNN ve \xNN escape biçimleri
#     · çeviri/dil nesneleri          · iş çağrısı kurgusu (ücret kelimesi olmadan)
#
#  KULLANIM
#    bash tools/reklam-sizinti-denetle.sh            # denetle, ihlalde 1 döner
#    bash tools/reklam-sizinti-denetle.sh --liste    # yalnız taranan dosyaları yaz
#
#  BAĞLANDIĞI YERLER
#    · .git/hooks/pre-commit      (engelleyici)
#    · tools/yayin-hazirla.sh     (yayın dizini kurulduktan sonra, engelleyici)
#
#  MUAF LİSTESİ aşağıdadır. Bir bulgu meşruysa oraya GEREKÇESİYLE yazılır —
#  desen gevşetilmez. Muaf listesi bu dosyanın hafızasıdır.
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.."

if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ python3 yok — denetim yapılamadı. Yayını DURDURUYORUM (sessiz geçmek yasak)."
  exit 1
fi

DIZIN="${1:-.}"
[ "$DIZIN" = "--liste" ] && DIZIN="."

python3 - "$DIZIN" "${2:-}" <<'PYEOF'
import io, os, re, sys

kok  = sys.argv[1] if sys.argv[1] != '--liste' else '.'
liste_modu = '--liste' in sys.argv

YAYIN_DOSYA = ['index.html','manifest.webmanifest','sw.js','robots.txt','sitemap.xml','styles.css']
YAYIN_DIZIN = ['js','vendor','assets','functions']
# yedek/kaynak kopyalar yayına girmiyor (yayin-hazirla.sh siliyor) — taramaya da girmez
ATLA = re.compile(r'\.(yedek-|oncesi-|eski-|orijinal-|gomulu-)|\.jsx$|\.map$|\.KARANTINA$|/(react|react-dom|lucide)-')
# Yalnız METİN dosyaları taranır. 16.08: .webp ikili içeriğinde rastgele "12,5 TL"
# benzeri diziler eşleşip yanlış alarm üretti.
METIN = re.compile(r'\.(js|html|css|json|webmanifest|txt|xml|md)$', re.I)

hedef = []
for f in YAYIN_DOSYA:
    y = os.path.join(kok, f)
    if os.path.isfile(y): hedef.append(y)
for d in YAYIN_DIZIN:
    yd = os.path.join(kok, d)
    if not os.path.isdir(yd): continue
    for dizin, _, dosyalar in os.walk(yd):
        for f in dosyalar:
            y = os.path.join(dizin, f)
            yy = y.replace(os.sep, '/')
            if not ATLA.search(yy) and METIN.search(yy): hedef.append(y)

if liste_modu:
    print(f"taranacak {len(hedef)} dosya:")
    for y in sorted(hedef): print("  " + y)
    sys.exit(0)

# ── MUAF LİSTESİ — (dosya-eki, desen-parçası, gerekçe) ──────────────────────
# Kural: bir bulgu buraya ancak GEREKÇESİYLE girer. Gerekçe yazılamıyorsa muaf değildir.
MUAF = [
 ('js/articles.js', 'ücretsiz müdafi',
  'CMK m.150 — barodan ücretsiz müdafi hakkı. Mevzuat bilgisi, büro ücret politikası değil.'),
 ('js/legal.js', 'ücretsiz olarak yanıtlanır',
  'KVKK m.13 — başvurunun ücretsiz yanıtlanması kanuni zorunluluk. Mevzuat bilgisi.'),
 ('js/legal.js', 'cretsiz olarak yan',
  'Aynı KVKK m.13 cümlesinin Babel escape biçimi. 16.08 dersi: düz biçim muaftı ama '
  'escape biçimi denetime takıldı — MUAF LİSTESİ DE ESCAPE GÖRMELİ.'),
 ('js/articles.js', 'bir indirim uygulanır',
  'Kira tespiti yazısı — hak ve nesafet indirimi. İçtihat bilgisi, büro fiyatı değil.'),
 ('js/mevzuat.js', 'UCRET_ASGARI',
  'Avukatlık Asgari Ücret Tarifesi — TBB tarafından RG\'de yayımlanan resmî tarife. '
  'Büronun kendi fiyatı değil; mevzuat bilgisidir (kontrol listesi: mevzuat kalemi serbest).'),
 ('js/mevzuat.js', 'Asgari Ücret Tarifesi',
  'Aynı — barobirlik.org.tr mevzuat bağlantısı.'),
 ('js/mevzuat.js', 'yasal tavan',
  'Kıdem tazminatı yasal tavanı — kanuni tutar, hesaplama aracının çıktısı.'),
 ('js/articles.js', 'cezada indirim talep',
  'Vergi yazısı — VUK m.376 cezada indirim. Mevzuat bilgisi, büro fiyatı değil.'),
 ('js/kod-talebi.js', "MailChannels",
  'Kod yorumu — MailChannels ücretsiz servisinin kapandığını anlatır. Site metni değil.'),
 ('functions/api/kod-talebi.js', "MailChannels",
  'Aynı kod yorumu, sunucu tarafı kopyası.'),
 ('js/uygulama.js', 'Henüz müvekkilimiz değilseniz',
  'Erişim kodunun nasıl alınacağını anlatan USUL cümlesi; teklif veya çağrı değil.'),
 ('js/login.js', 'ardından vekâletname tanzim',
  'Vekâlet ilişkisinin kurulma usulünü anlatır; teklif değil.'),
 ('js/site-arama.js', 'randevu görüşme ön görüşme takvim',
  'Site içi ARAMA anahtar kelime dizini — ziyaretçiye gösterilen metin değil.'),
 ('manifest.webmanifest', 'Randevu Al',
  'PWA kısayolu — uygulama içi gezinme etiketi.'),
 ('js/buro.js', 'Randevu Al',
  'Randevu sayfasına gezinme düğmesi. Randevu formu gri alan (kontrol listesi md.22).'),
 ('js/portal.js', "iban",
  'Ödeme ekranı büro IBAN alanını okur; alanın kendisi buro-bilgi.js kararına bağlı.'),
]

def muaf_mi(yol, satir_metni):
    y = yol.replace(os.sep, '/')
    for dosya, parca, _ in MUAF:
        if y.endswith(dosya) and parca in satir_metni:
            return True
    return False

# ── DENETİMLER ─────────────────────────────────────────────────────────────
# 1) ÜCRET — beş dil + escape biçimleri.  Sızan tam olarak buydu.
UCRET = [
 ('tr',      r'[üu]cretsiz|ücretsiz'),
 ('tr-esc',  r'\\u00FCcretsiz|\\xFCcretsiz|\\u00fccretsiz'),
 ('tr-15dk', r'(ilk\s+)?(on\s?be[şs]|15|onbe[şs])\s*dakika'),
 ('tr-15esc',r'15\s*dakikal\\u0131k|on\s*be\\u015F\s*dakika'),
 ('en',      r'free of charge|no charge|free consultation|first fifteen minutes|fifteen minutes are free'),
 ('ru',      r'бесплатн'),
 ('de',      r'kostenfrei|kostenlos|unentgeltlich|gratis'),
 ('ar',      r'مجان'),
 # ← asıl risk RAKAMLI fiyat. 16.08 dersi: "TL" küçük harfe duyarsız aranırsa
 # escape metindeki kayıtlı gibi diziler eşleşiyor. Büyük harf + boşluk şart.
 ('tutar',   r'\d[\d.,]{2,}\s*(?:₺|\\u20BA)|\d[\d.,]{2,}\s+TL(?![a-zçğıöşü])'),
 ('tarife',  r'\bindirim\b|\b[üu]cret tarifesi\b|\bfiyat listesi\b'),
]
# 2) GERÇEKÇİ ESAS NUMARASI — 0000/0000 bilerek serbest (örnek işareti)
ESAS = r'\b(?:19|20)\d{2}/\d{1,5}\s*(?:E\.|Esas\b)'
# 3) GERÇEK MAHKEME ADI
MAHKEME = (r'\b(?:Antalya|İstanbul|Ankara|İzmir|Bursa|Adana|Konya|Isparta|Kocaeli|Denizli|'
           r'Mersin|Gaziantep|Muğla|Aydın|Manisa)\s*\d{0,2}\.?\s*'
           r'(?:Asliye|Sulh|İş|Ağır|Aile|İcra|Tüketici|Ticaret|İdare|Vergi|Kadastro|İnfaz)')
# 4) SIR GÖRÜNÜMLÜ ALAN — yayınlanan JS'te
# KRİTİK — yayınlanan JS'te bulunması hiçbir gerekçeyle savunulamaz. ENGELLER.
SIR_KRITIK = r'\b(panelKodu|apiKey|api_key|apiSecret|token|accessToken|secret|password|parola|şifre|sifre|pin|cvv|kartNo)\s*:'
# İZLEME — büro işlevine bağlı, avukat kararı bekliyor (16.08). Uyarır, DURDURMAZ.
SIR_IZLEME = r'\b(tcNo|tckn|iban|ibanDuz|ibanHesap|odemeLink)\s*:'
# 5) DAVA SONUCU
SONUC = r'Karar tebli[ğg] edildi|karar kesinle[şs]ti|beraat karar|tahliye karar[ıi]|talebin kabul[üu]|davan[ıi]n kabul[üu]|dava(?:m[ıi]z)? kazan'
# 6) İŞ ELDE ETME KURGUSU — "ücret" kelimesi olmadan da kurulabilir (16.08 dersi)
CAGRI = (r'dosyan[ıi]za da uyuyor|dosyan\\u0131za da uyuyor|sizin dosyan[ıi]z|'
         r'hemen ara(?:y[ıi]n)?\b|bize ula[şs][ıi]n|[İi]leti[şs]ime ge[çc]in|'
         r'birlikte de[ğg]erlendirelim|de\\u011Ferlendirelim|'
         r'hakk[ıi]n[ıi]z[ıi] aray[ıi]n|kaybetmeyin|f[ıi]rsat[ıi] ka[çc][ıi]rmay[ıi]n')
# 7) ÜSTÜNLÜK
USTUNLUK = r'\ben iyi\b|\ben ba[şs]ar[ıi]l[ıi]\b|lider|uzman avukat|\buzmanl[ıi]k\b|%\s*\d{2,3}\s*ba[şs]ar[ıi]|y[ıi]llar[ıi]n deneyim'

DENETIMLER = [
 ('ÜCRET / TARİFE (5 dil + escape)', UCRET, False),
 ('GERÇEKÇİ ESAS NUMARASI',          [('esas', ESAS)], False),
 ('GERÇEK MAHKEME ADI',              [('mahkeme', MAHKEME)], False),
 ('SIR ALANI — KRİTİK',              [('sır', SIR_KRITIK)], True),
 ('DAVA SONUCU',                     [('sonuç', SONUC)], False),
 ('İŞ ELDE ETME KURGUSU (m.7/c)',    [('çağrı', CAGRI)], False),
 ('ÜSTÜNLÜK İDDİASI',                [('üstünlük', USTUNLUK)], False),
]

toplam = 0
muaf_sayisi = 0
print(f"reklam-sizinti-denetle · {len(hedef)} yayınlanan dosya taranıyor\n")

for baslik, desenler, sadece_js in DENETIMLER:
    bulgular = []
    for etiket, kalip in desenler:
        r = re.compile(kalip, re.I)
        for y in sorted(hedef):
            if sadece_js and not y.endswith('.js'): continue
            try:
                s = io.open(y, encoding='utf-8', errors='replace').read()
            except Exception:
                continue
            for m in r.finditer(s):
                t = m.group(0)
                if t.startswith('0000'):           # örnek işaretli numara
                    continue
                sat_no = s[:m.start()].count('\n') + 1
                sat_bas = s.rfind('\n', 0, m.start()) + 1
                sat_son = s.find('\n', m.end());  sat_son = len(s) if sat_son < 0 else sat_son
                satir = s[sat_bas:sat_son]
                if muaf_mi(y, satir):
                    muaf_sayisi += 1
                    continue
                if etiket == 'sır':
                    # KURAL 15 — sır alanının DEĞERİ hiçbir yere yazılmaz.
                    # Denetim çıktısı terminale, CI günlüğüne, ekran görüntüsüne düşer.
                    # Bu yüzden yalnız ALAN ADI ve değerin UZUNLUĞU raporlanır.
                    ad = m.group(1) if m.groups() else '?'
                    kuyruk = s[m.end():m.end()+400].lstrip()
                    uz = '?'
                    if kuyruk[:1] in ("'", '"'):
                        son = kuyruk[1:].find(kuyruk[0])
                        if son >= 0: uz = str(son)
                    cevre = f"{ad} alani VAR (deger yazilmadi, {uz} karakter)"
                else:
                    cevre = s[max(0, m.start()-60):m.end()+60].replace('\n', ' ')
                bulgular.append((y, sat_no, etiket, cevre.strip()[:150]))
    if bulgular:
        print(f"❌ {baslik} — {len(bulgular)} bulgu")
        for y, n, e, c in bulgular:
            print(f"     {y}:{n}  [{e}]  {c}" if e == 'sır' else f"     {y}:{n}  [{e}]  …{c}…")
        toplam += len(bulgular)
    else:
        print(f"✓  {baslik}")

# ── İZLEME (engellemez) — açık kararlar her koşuda görünür kalsın ───────────
izleme = []
_r = re.compile(SIR_IZLEME)
for y in sorted(hedef):
    if not y.endswith('.js'): continue
    s = io.open(y, encoding='utf-8', errors='replace').read()
    for m in _r.finditer(s):
        ad = m.group(1)
        kuyruk = s[m.end():m.end()+400].lstrip()
        uz = '?'
        if kuyruk[:1] in ("'", '"'):
            son = kuyruk[1:].find(kuyruk[0])
            if son >= 0: uz = str(son)
        izleme.append((y, s[:m.start()].count('\n') + 1, ad, uz))
if izleme:
    print(f"\n⚠  İZLEME — kimlik/ödeme alanı yayınlanan JS'te ({len(izleme)}) · engellemez")
    for y, n, ad, uz in izleme:
        print(f"     {y}:{n}  {ad} (deger yazilmadi, {uz} karakter)")
    print("     16.08 kararı: tcNo'nun vekâletname kartında işlevi var, IBAN bloğunu 6 dosya")
    print("     kullanıyor. Kaldırmak yerine girişin arkasına almak gerekiyor — avukat kararı.")

print()
if muaf_sayisi:
    print(f"({muaf_sayisi} eşleşme muaf listesinden geçti — gerekçeleri bu dosyanın içinde)")

if toplam:
    print(f"\n❌ {toplam} BULGU — yayın/commit DURDURULDU.")
    print("   Meşruysa tools/reklam-sizinti-denetle.sh içindeki MUAF listesine")
    print("   GEREKÇESİYLE ekleyin. Deseni gevşetmeyin.")
    sys.exit(1)

print("✅ temiz — beş dilde ücret ifadesi, gerçekçi esas no, mahkeme adı,")
print("   sır alanı, dava sonucu, iş çağrısı ve üstünlük iddiası bulunmadı.")
PYEOF
