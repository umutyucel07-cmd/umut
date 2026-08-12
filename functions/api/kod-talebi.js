export async function onRequest({ request, env }) {
  const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

  if (request.method === 'GET') {
    return json({ ok: true, service: 'kod-talebi' });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const ad = String(body?.ad || '').trim().replace(/\s+/g, ' ');
  const tel = String(body?.tel || '').replace(/\D/g, '');
  const kanal = body?.kanal === 'eposta' ? 'eposta' : 'whatsapp';
  if (!ad || tel.length < 10) {
    return json({ ok: false, error: 'invalid_input' }, 400);
  }

  if (env.KOD_KV) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const key = `rl:${ip}`;
    const current = Number((await env.KOD_KV.get(key)) || '0');
    if (current >= 3) {
      return json({ ok: false, durum: 'sik', mesaj: 'Çok sık istek yapıldı. Lütfen birkaç dakika sonra yeniden deneyiniz.' }, 429);
    }
    await env.KOD_KV.put(key, String(current + 1), { expirationTtl: 60 });
  }

  const normAd = (v) => String(v || '').trim().toLocaleUpperCase('tr-TR').replace(/\s+/g, ' ');
  const list = (() => {
    try {
      return JSON.parse(env.KODLAR || '[]');
    } catch {
      return [];
    }
  })();

  const match = list.find((x) => {
    const telMatch = String(x?.tel || '').replace(/\D/g, '');
    return normAd(x?.ad) === normAd(ad) && telMatch.endsWith(tel.slice(-10));
  });

  // KODLAR ortam degiskeni tanimli degilse liste bostur. Bu bir ESLESMEME degil,
  // YAPILANDIRMA eksigidir. Muvekkile 'eslesmedi' demek yanlis olur; talep kuyruga alinir.
  if (!list.length) {
    return json({ ok: true, durum: 'kuyruk', mesaj: 'Talebiniz alınmıştır. Kodunuz en geç mesai saatleri içinde tarafınıza iletilecektir.' });
  }

  if (!match) {
    return json({ ok: true, durum: 'yok', mesaj: 'Bilgileriniz kayıtlarımızla eşleşmedi.' });
  }

  if (kanal === 'eposta') {
    if (!match.eposta) {
      return json({ ok: true, durum: 'yok', mesaj: 'Kayıtlı e-posta adresiniz bulunamadığı için kod e-posta ile gönderilemedi.' });
    }

    const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: match.eposta }] }],
        from: { email: 'portal@avumutyucelhukuk.com', name: 'Umut Yücel Hukuk Bürosu' },
        subject: 'Portal erişim kodunuz',
        content: [{
          type: 'text/plain',
          value: `Sayın ${match.ad},\n\nPortal erişim kodunuz: ${match.kod}\n\navumutyucelhukuk.com → Müvekkil Girişi bölümünden giriş yapabilirsiniz. Kodu kimseyle paylaşmayınız.\n\nUmut Yücel Hukuk Bürosu`,
        }],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return json({ ok: false, durum: 'hata', detail: text.slice(0, 500) }, 502);
    }

    return json({ ok: true, durum: 'gonderildi', mesaj: 'Kodunuz kayıtlı e-posta adresinize gönderilmiştir.' });
  }

  const phoneId = env.WA_PHONE_ID || env.PHONE_NUMBER_ID || env.WA_PHONE_NUMBER_ID;
  const token = env.WA_TOKEN || env.WHATSAPP_TOKEN || env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !token) {
    return json({ ok: true, durum: 'kuyruk', mesaj: 'Talebiniz alındı. Kodunuz kısa sürede WhatsApp üzerinden iletilecek.' });
  }

  const to = '9' + String(match.tel || '').replace(/\D/g, '').slice(-10);
  const message = `Sayın ${match.ad}, portal erişim kodunuz: ${match.kod}. avumutyucelhukuk.com → Müvekkil Girişi bölümünden giriş yapabilirsiniz. Kodu kimseyle paylaşmayınız. — Umut Yücel Hukuk Bürosu`;

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return json({ ok: false, durum: 'hata', detail: text.slice(0, 500) }, 502);
  }

  return json({ ok: true, durum: 'gonderildi', mesaj: 'Kodunuz kayıtlı WhatsApp numaranıza gönderilmiştir.' });
}
