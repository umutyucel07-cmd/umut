// ============================================================================
//  /api/kod-talebi — erişim kodu talebi (kod YENİLEME tasarımı)
//  Av. Umut Yücel · 13.08.2026
//
//  ── NE DEĞİŞTİ ────────────────────────────────────────────────────────────
//  ESKİ: KODLAR ortam değişkeni 472 müvekkilin {ad, tel, kod, eposta}
//        listesini DÜZ METİN tutacaktı; uç o listede eşleşme arayıp
//        müvekkilin MEVCUT kodunu tekrar gönderecekti.
//  YENİ: KODLAR diye bir değişken YOK. Uç her talepte YENİ kod üretir,
//        eskisini geçersiz kılar, yalnız özetini saklar ve kodu sadece
//        müvekkilin kayıtlı WhatsApp numarasına gönderir.
//
//  Sonuç: hiçbir yerde düz metin kod yok, hiçbir yerde düz metin müvekkil
//  dizini yok, ve "kodumu unuttum" ile "kodum başkasının eline geçti" aynı
//  tek işlemle çözülüyor.
//
//  ── ASLA YAPILMAYACAK ─────────────────────────────────────────────────────
//  Kod HTTP yanıtına konmaz. Ekranda gösterilmez. Günlüğe yazılmaz.
//  Bu üçü ihlal edilirse tasarımın tamamı anlamsızlaşır.
// ============================================================================
import {
  json, kodUret, biberAl, muvekkilAnahtari, kodAnahtari, frenAsildiMi, telNormalize,
} from '../../lib/kimlik.js';

const KOD_OMRU_GUN = 180;

export async function onRequest({ request, env }) {
  if (request.method === 'GET') return json({ ok: true, service: 'kod-talebi' });
  if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  let govde;
  try {
    govde = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const ad = String(govde?.ad || '').trim().replace(/\s+/g, ' ');
  const tel = telNormalize(govde?.tel);
  if (!ad || tel.length < 10) {
    return json({ ok: false, error: 'invalid_input' }, 400);
  }

  // E-posta kanalı kapatıldı: MailChannels'ın Workers için ücretsiz servisi
  // sona erdi ve yerine bir sağlayıcı bağlanmadı. Sessizce WhatsApp'a düşmek
  // müvekkile yanlış yerde kod beklettirir; açıkça söylüyoruz.
  if (govde?.kanal === 'eposta') {
    return json({
      ok: true,
      durum: 'kanal-yok',
      mesaj: 'E-posta ile gönderim şu anda kullanılamıyor. Kodunuz kayıtlı WhatsApp numaranıza gönderilebilir.',
    });
  }

  if (!env.KOD_KV) {
    return json({
      ok: true,
      durum: 'hazir-degil',
      mesaj: 'Kod gönderimi şu anda hazırlanmaktadır. Lütfen kısa süre sonra yeniden deneyiniz ya da büromuza ulaşınız.',
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'bilinmiyor';
  if (await frenAsildiMi(env.KOD_KV, `kfr:${ip}`, 3, 300)) {
    return json({
      ok: false,
      durum: 'sik',
      mesaj: 'Kısa süre önce talep oluşturdunuz. Lütfen birkaç dakika sonra yeniden deneyiniz.',
    }, 429);
  }

  const biber = await biberAl(env.KOD_KV);

  const dizin = await env.KOD_KV.get('sys:dizin', { type: 'json' });
  if (!dizin || !dizin.adet) {
    return json({
      ok: true,
      durum: 'hazir-degil',
      mesaj: 'Kod gönderimi şu anda hazırlanmaktadır. Lütfen kısa süre sonra yeniden deneyiniz ya da büromuza ulaşınız.',
    });
  }

  const mvAnahtar = await muvekkilAnahtari(biber, ad, tel);
  const muvekkil = await env.KOD_KV.get(mvAnahtar, { type: 'json' });
  if (!muvekkil) {
    return json({
      ok: true,
      durum: 'yok',
      mesaj: 'Bilgileriniz kayıtlarımızla eşleşmedi. Yazımı denetleyip yeniden deneyebilir ya da tarafımıza ulaşabilirsiniz.',
    });
  }

  // Panele TELEFONDAN yapıştırılan değerin başına/sonuna boşluk bulaşabilir;
  // Authorization başlığına girerse fetch fırlatır (1101). Süzmek güvenli.
  const phoneId = String(env.WA_PHONE_ID || env.PHONE_NUMBER_ID || env.WA_PHONE_NUMBER_ID || '').replace(/\s+/g, '');
  const token = String(env.WA_TOKEN || env.WHATSAPP_TOKEN || env.WHATSAPP_ACCESS_TOKEN || '').replace(/\s+/g, '');
  if (!phoneId || !token) {
    await talebiKuyruklaGuvenli(env.KOD_KV, muvekkil, tel, 'wa-yok', 'WA_TOKEN/WA_PHONE_ID tanımsız');
    return json({
      ok: true,
      durum: 'kuyruk',
      mesaj: 'Talebiniz alındı. Kodunuz kısa sürede WhatsApp üzerinden iletilecektir.',
    });
  }

  const yeniKod = kodUret();

  // ÜLKE KODU 90, "9" değil (0532… → 90532…, 12 hane).
  const hedef = '90' + telNormalize(muvekkil.tel || tel);
  const metin =
    `Sayın ${muvekkil.ad || ad}, portal erişim kodunuz: ${yeniKod}. ` +
    'avumutyucelhukuk.com → Müvekkil Girişi bölümünden giriş yapabilirsiniz. ' +
    'Bu kod önceki kodunuzun yerine geçer. Kodu kimseyle paylaşmayınız. — Umut Yücel Hukuk Bürosu';

  // Meta ucu User-Agent'sız isteği TCP'de kesebiliyor ("Network connection
  // lost."). Çare: gerçek User-Agent + kısa aralıklı TEK yeniden deneme.
  const gonderimIstek = () => fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'uy-portal/1.0 (+https://avumutyucelhukuk.com)',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: hedef,
      type: 'text',
      text: { body: metin },
    }),
  });
  let yanit;
  try {
    yanit = await gonderimIstek();
  } catch (ilkKopus) {
    try {
      await new Promise((coz) => setTimeout(coz, 400));
      yanit = await gonderimIstek();
    } catch (aghata) {
      // GÜVENLİK: detay YALNIZ KV kuyruğuna yazılır, HTTP yanıtına KONMAZ —
      // aksi hâlde her çağıran arka uç hata durumunu (jeton/pencere) okur.
      // 200 + durum:'hata' dönüyoruz; Cloudflare 502 gövdesini yutuyor.
      const detay = `fetch: ${String((aghata && aghata.message) || aghata).slice(0, 200)}`;
      await talebiKuyruklaGuvenli(env.KOD_KV, muvekkil, tel, 'gonderim-hatasi', detay);
      return json({
        ok: false,
        durum: 'hata',
        mesaj: 'Kodunuz şu anda gönderilemedi; talebiniz not edildi. Büromuz kodu en kısa sürede iletecektir.',
      });
    }
  }

  // SIRA KRİTİK: önce GÖNDER, sonra eskiyi geçersiz kıl.
  if (!yanit.ok) {
    const hata = await yanit.text().catch(() => '');
    // detay KV kuyruğuna yazılır (401=jeton, 131047=24s penceresi,
    // 131021=alıcı=gönderici); HTTP yanıtına KONMAZ.
    const detay = `HTTP ${yanit.status}: ${hata.slice(0, 200)}`;
    await talebiKuyruklaGuvenli(env.KOD_KV, muvekkil, tel, 'gonderim-hatasi', detay);
    return json({
      ok: false,
      durum: 'hata',
      mesaj: 'Kodunuz şu anda gönderilemedi; talebiniz not edildi. Büromuz kodu en kısa sürede iletecektir.',
    });
  }

  if (muvekkil.kodAnahtar) {
    await env.KOD_KV.delete(muvekkil.kodAnahtar);
  }
  const yeniAnahtar = await kodAnahtari(biber, yeniKod);
  await env.KOD_KV.put(
    yeniAnahtar,
    JSON.stringify({ mv: mvAnahtar }),
    { expirationTtl: KOD_OMRU_GUN * 86400 },
  );
  await env.KOD_KV.put(mvAnahtar, JSON.stringify({ ...muvekkil, kodAnahtar: yeniAnahtar }));

  return json({
    ok: true,
    durum: 'gonderildi',
    mesaj: 'Kodunuz kayıtlı WhatsApp numaranıza gönderilmiştir. Bu kod önceki kodunuzun yerine geçer.',
  });
}

/**
 * Bekleyen kod talebini KV'ye yazar. Ad + telefonun SON DÖRT hanesi + sebep +
 * detay; tam numara YAZILMAZ. Yalnız EŞLEŞEN müvekkil. Cloudflare → KV →
 * "talep:" öneki; 30 günde düşer. Başarısız olursa istek düşmez.
 */
async function talebiKuyruklaGuvenli(kv, muvekkil, tel, sebep, detay = '') {
  if (!kv) return;
  try {
    const damga = new Date().toISOString();
    const rastgele = [...crypto.getRandomValues(new Uint8Array(4))]
      .map((b) => b.toString(16).padStart(2, '0')).join('');
    await kv.put(
      `talep:${damga}-${rastgele}`,
      JSON.stringify({
        ad: muvekkil?.ad || '',
        telSon4: telNormalize(muvekkil?.tel || tel).slice(-4),
        sebep,
        detay: String(detay).slice(0, 200),
        zaman: damga,
      }),
      { expirationTtl: 30 * 86400 },
    );
  } catch { /* kuyruk yazılamadı; akış etkilenmez */ }
}
