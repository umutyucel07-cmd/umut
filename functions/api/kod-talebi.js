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
      durum: 'kuyruk',
      mesaj: 'Talebiniz alınmıştır. Kodunuz en geç mesai saatleri içinde tarafınıza iletilecektir.',
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

  // Dizin hiç yüklenmemişse bu bir EŞLEŞMEME değil, YAPILANDIRMA eksiğidir.
  // Müvekkile "kayıtlarımızla eşleşmedi" demek yanlış olur — 12.08'de canlıda
  // tam olarak bu yalan söylenmişti, tekrarlanmayacak.
  const dizin = await env.KOD_KV.get('sys:dizin', { type: 'json' });
  if (!dizin || !dizin.adet) {
    return json({
      ok: true,
      durum: 'kuyruk',
      mesaj: 'Talebiniz alınmıştır. Kodunuz en geç mesai saatleri içinde tarafınıza iletilecektir.',
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

  const phoneId = env.WA_PHONE_ID || env.PHONE_NUMBER_ID || env.WA_PHONE_NUMBER_ID;
  const token = env.WA_TOKEN || env.WHATSAPP_TOKEN || env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneId || !token) {
    // Gönderemeyeceksek kod ÜRETMİYORUZ. Üretip gönderememek, müvekkilin
    // elindeki çalışan kodu sessizce iptal etmek demektir.
    //
    // AMA "talebiniz alındı" demek de tek başına YETMEZ. 13.08'e kadar bu dal
    // müvekkile söz veriyor ve talebi HİÇBİR YERE yazmıyordu: kimin kod
    // istediği kaybolduğu için o söz tutulamazdı. Bugün onardığımız hatanın
    // aynısı - gerçekleşmeyecek bir şeyi olmuş gibi söylemek.
    // Artık talep kuyruğa YAZILIYOR; avukat Cloudflare → KV → talep:
    // önekinden görür ve elle gönderir.
    await talebiKuyruklaGuvenli(env.KOD_KV, muvekkil, tel, 'wa-yok');
    return json({
      ok: true,
      durum: 'kuyruk',
      mesaj: 'Talebiniz alındı. Kodunuz kısa sürede WhatsApp üzerinden iletilecektir.',
    });
  }

  const yeniKod = kodUret();

  // ÜLKE KODU 90, "9" DEĞİL.  Önceki sürümde bu satır  '9' + son10  idi:
  // 0532 000 00 00 → 95320000000 (11 hane). Türkiye için doğrusu
  // 905320000000 (12 hane). WA_TOKEN tanımlı olmadığı için bu kod yolu
  // canlıda hiç çalışmamıştı; jeton girildiği gün HER gönderim sessizce
  // hatalı numaraya gidecekti. Deneme senaryosu yakaladı.
  const hedef = '90' + telNormalize(muvekkil.tel || tel);
  const metin =
    `Sayın ${muvekkil.ad || ad}, portal erişim kodunuz: ${yeniKod}. ` +
    'avumutyucelhukuk.com → Müvekkil Girişi bölümünden giriş yapabilirsiniz. ' +
    'Bu kod önceki kodunuzun yerine geçer. Kodu kimseyle paylaşmayınız. — Umut Yücel Hukuk Bürosu';

  const yanit = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: hedef,
      type: 'text',
      text: { body: metin },
    }),
  });

  // SIRA KRİTİK: önce GÖNDER, sonra eskiyi geçersiz kıl. Ters sırada
  // gönderim hata verirse müvekkil hem eski hem yeni kodsuz kalırdı.
  if (!yanit.ok) {
    const hata = await yanit.text().catch(() => '');
    // Gönderim düştü: kod ÜRETİLDİ ama gitmedi. Eski kod hâlâ geçerli
    // (aşağıdaki silme satırına HİÇ ulaşılmıyor). Talep yine de kuyruğa
    // yazılır ki müvekkil unutulmasın.
    await talebiKuyruklaGuvenli(env.KOD_KV, muvekkil, tel, 'gonderim-hatasi');
    return json({
      ok: false,
      durum: 'hata',
      mesaj: 'Kodunuz şu anda gönderilemedi. Lütfen kısa süre sonra yeniden deneyiniz.',
      detay: hata.slice(0, 300),
    }, 502);
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
 * Bekleyen kod talebini KV'ye yazar.
 *
 * NE YAZILIR: müvekkilin adı, telefonunun SON DÖRT hanesi ve sebep.
 * Tam telefon numarası YAZILMAZ - avukat zaten kendi kayıtlarından bulur,
 * kuyruk kaydının onu tekrarlamasına gerek yok.
 *
 * KİM YAZILIR: yalnız EŞLEŞEN müvekkil. Eşleşmeyen bir talep bu noktaya hiç
 * ulaşmaz; büroyla ilişkisi olmayan kişinin adı ve numarası kaydedilmez.
 *
 * NEREDE GÖRÜLÜR: Cloudflare → Workers KV → uy-portal-kimlik → "talep:" öneki.
 * 30 gün sonra kendiliğinden düşer.
 *
 * Bu yazım BAŞARISIZ OLURSA istek düşmez: müvekkile verilen yanıt bundan
 * bağımsızdır. Kuyruk bir kolaylıktır, akışın şartı değildir.
 */
async function talebiKuyruklaGuvenli(kv, muvekkil, tel, sebep) {
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
        zaman: damga,
      }),
      { expirationTtl: 30 * 86400 },
    );
  } catch { /* kuyruk yazılamadı; akış etkilenmez */ }
}
