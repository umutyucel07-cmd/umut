// ============================================================================
//  /yonetim-uy2608/* — kimlik kapısı
//  Av. Umut Yücel · 16.08.2026
//
//  ── NEDEN VAR ─────────────────────────────────────────────────────────────
//  16.08 gecesi ölçüldü: panel çerezsiz, anonim bir istekte 200 ve 17.540
//  bayt dönüyordu. Koruma yalnızca "gizli yol" + sayfa içi noindex idi.
//  Panelde sır yok — ama mimari haritası var: Cloudflare hesap kimliği, Meta
//  uygulama kimliği, Notion sayfa bağlantıları. Tek başlarına erişim
//  vermezler, keşif değeri taşırlar. Yolu bilen herkesin açabilmesi yeterli
//  bir koruma değildir.
//
//  ── TASARIM ───────────────────────────────────────────────────────────────
//  KAPALI BAŞARISIZ. PANEL_PAROLA tanımlı değilse 503 döner ve içerik
//  SIZMAZ. Yanlış yapılandırmada panel açık kalmaz, kilitli kalır. Bir
//  kimlik kapısının yapabileceği en kötü şey, arızalandığında sessizce
//  açılmaktır.
//
//  Parola KODA YAZILMAZ. Ortam değişkeninden okunur; değerini avukat kendi
//  girer (kural 15). Bu dosyada, bu depoda ve sohbette hiçbir zaman bulunmaz.
//
//  ── AVUKATIN YAPACAĞI (bir kez) ──────────────────────────────────────────
//  Cloudflare → Workers & Pages → avumutyucelhukuk → Settings →
//  Variables and Secrets → Add
//      Ad    : PANEL_PAROLA
//      Değer : (kasadan, uzun ve benzersiz bir parola)
//  Production ve Preview ortamlarının İKİSİNE de eklenmeli.
//  ⚠️ Yeni değişken ancak YENİ BİR DAĞITIMDAN sonra geçerli olur:
//     Deployments → en son dağıtım → ⋯ → Retry deployment
//
//  Giriş: kullanıcı adı "avukat", parola yukarıdaki değer.
//  Tarayıcı hatırlar; her açılışta sorulmaz.
// ============================================================================

const KULLANICI = 'avukat';
const DEGISKEN = 'PANEL_PAROLA';

// Sabit zamanlı karşılaştırma — erken çıkış yok, parola tahmininde zamanlama
// sızıntısı oluşmasın. (Uzunluk farkı sızar; kabul edilebilir.)
function esitMi(a, b) {
  const kodlayici = new TextEncoder();
  const x = kodlayici.encode(a);
  const y = kodlayici.encode(b);
  if (x.length !== y.length) return false;
  let fark = 0;
  for (let i = 0; i < x.length; i++) fark |= x[i] ^ y[i];
  return fark === 0;
}

const GUVENLIK_BASLIKLARI = {
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

function kimlikIste() {
  return new Response('Yetkisiz.\n', {
    status: 401,
    headers: {
      ...GUVENLIK_BASLIKLARI,
      'WWW-Authenticate': 'Basic realm="Komuta Merkezi", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

// ── Tanı ─────────────────────────────────────────────────────────────────
// "Parola tanımlı değil" tek başına hangi hatanın yapıldığını söylemiyordu.
// Bu işlev sebebi ayırt eder. HİÇBİR değişken ADI ve HİÇBİR DEĞER yazılmaz —
// yalnız bir sayı ve bir sınıf bilgisi döner.
function taniMetni(env) {
  let adlar = [];
  try {
    adlar = Object.keys(env || {});
  } catch {
    return 'Ortam değişkenleri okunamadı.';
  }

  if (adlar.length === 0) {
    return 'Bu dağıtım HİÇBİR ortam değişkeni görmüyor.\n' +
           '→ Değişken eklendikten SONRA yeniden dağıtım gerekir:\n' +
           '  Deployments → en son dağıtım → ⋯ → Retry deployment';
  }

  if (adlar.includes(DEGISKEN)) {
    return `${DEGISKEN} tanımlı ama DEĞERİ BOŞ.\n` +
           '→ Değişkeni silip değerini yeniden girin, sonra Retry deployment.';
  }

  const benzer = adlar.some((a) => a.trim().toUpperCase() === DEGISKEN);
  if (benzer) {
    return 'Adı benzeyen bir değişken var ama birebir eşleşmiyor.\n' +
           `→ Ad tam olarak ${DEGISKEN} olmalı: büyük harf, alt çizgi, başta/sonda boşluk yok.`;
  }

  return `Bu dağıtım ${adlar.length} ortam değişkeni görüyor ama ${DEGISKEN} aralarında yok.\n` +
         '→ Muhtemelen yanlış ortama eklendi. Production ve Preview ayrı listelerdir;\n' +
         '  bu adres Production ortamını kullanıyor. Ekledikten sonra Retry deployment.';
}

export async function onRequest(context) {
  const { request, env, next } = context;

  // ── Kapalı başarısız ─────────────────────────────────────────────────────
  const parola = env && env[DEGISKEN];
  if (!parola) {
    return new Response(
      'Panel kapalı — kimlik kapısı çalışıyor, içerik sunulmuyor.\n\n' +
      'TANI:\n' + taniMetni(env) + '\n',
      {
        status: 503,
        headers: { ...GUVENLIK_BASLIKLARI, 'Content-Type': 'text/plain; charset=utf-8' },
      },
    );
  }

  const baslik = request.headers.get('Authorization') || '';
  if (!baslik.startsWith('Basic ')) return kimlikIste();

  // Base64 → bayt → UTF-8. atob tek başına Latin-1 verir; Türkçe karakterli
  // parola o yüzden bozulurdu.
  let cozulmus;
  try {
    const ham = Uint8Array.from(atob(baslik.slice(6).trim()), (c) => c.charCodeAt(0));
    cozulmus = new TextDecoder('utf-8').decode(ham);
  } catch {
    return kimlikIste();
  }

  const ayrac = cozulmus.indexOf(':');
  if (ayrac < 0) return kimlikIste();

  const kullanici = cozulmus.slice(0, ayrac);
  const girilen = cozulmus.slice(ayrac + 1);

  // İki karşılaştırma da her zaman çalışsın — && kısa devre yapmasın.
  const kullaniciTamam = esitMi(kullanici, KULLANICI);
  const parolaTamam = esitMi(girilen, parola);
  if (!(kullaniciTamam && parolaTamam)) return kimlikIste();

  // ── Geçti: statik varlığı sun, başlıkları sıkılaştır ────────────────────
  const yanit = await next();
  const cikti = new Response(yanit.body, yanit);
  for (const [ad, deger] of Object.entries(GUVENLIK_BASLIKLARI)) {
    cikti.headers.set(ad, deger);
  }
  return cikti;
}
