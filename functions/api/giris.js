// ============================================================================
//  /api/giris — erişim kodunu SUNUCUDA doğrular
//  Av. Umut Yücel · 13.08.2026
//
//  ── BU UÇ NEDEN VAR ───────────────────────────────────────────────────────
//  Önceki tasarımda doğrulama TARAYICIDA yapılıyordu: js/oturum.js girilen
//  kodu window.MUVEKKILLER listesiyle karşılaştırıyordu ve o liste herkese
//  açık js/buro-bilgi.js içinde yayınlanıyordu. Bugün listede yalnız iki
//  ÖRNEK kayıt olduğu için fiilî bir zarar doğmadı (ikisi de büro
//  kayıtlarında yok — arandı, bulunamadı). Ama dosyanın kendi yorumu
//  "yeni müvekkil eklemek için bu listeye bir satır yazın" diyordu.
//  O satır yazıldığı an 472 müvekkilin adı, erişim kodu, telefon son dördü
//  ve dava geçmişi herkesin indirebileceği bir dosyaya girecekti.
//
//  Doğrulama artık burada. Tarayıcıya müvekkil listesi GÖNDERİLMEZ; müvekkil
//  yalnız KENDİ kaydını, yalnız doğru kodu girdikten sonra görür.
// ============================================================================
import { json, kodNormalize, kodAnahtari, biberAl, frenAsildiMi } from '../../lib/kimlik.js';

const OTURUM_GUN = 30;

export async function onRequest({ request, env }) {
  if (request.method === 'GET') return json({ ok: true, service: 'giris' });
  if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  let govde;
  try {
    govde = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const kod = kodNormalize(govde?.kod);
  if (!kod) {
    return json({
      ok: false,
      durum: 'bicim',
      mesaj: 'Kodunuz UY-XXXX-XXXX biçimindedir. Lütfen tarafımızca iletilen kodu olduğu gibi giriniz.',
    }, 400);
  }

  // Yapılandırma eksikse müvekkile "kod yanlış" DENMEZ. Yanlış olan kod değil,
  // kurulum. 12.08'de tam tersi bir hata canlıda müvekkile yalan söylemişti.
  if (!env.KOD_KV) {
    return json({
      ok: false,
      durum: 'hazir-degil',
      mesaj: 'Müvekkil girişi şu anda hazırlanmaktadır. Lütfen kısa süre sonra yeniden deneyiniz ya da tarafımıza ulaşınız.',
    }, 503);
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'bilinmiyor';

  // İki kademeli fren: 5 dakikada 10, saatte 40.
  //
  // KISA PENCERE NEDEN 60 SANİYE DEĞİL: 13.08.2026'da canlıda ölçüldü —
  // eski kod `expirationTtl: 60` ile sayaç tutuyordu ve fren HİÇ devreye
  // girmiyordu. Sebep: KV yazımının küresel okunur hale gelmesi ~60 saniye
  // sürüyor; anahtar okunabilir olmadan önce zaten sona eriyordu. Yani
  // 60 saniyelik bir KV sayacı fiilen ölü koddur.
  // Pencere, yayılma süresinden belirgin biçimde UZUN olmalı.
  if (await frenAsildiMi(env.KOD_KV, `gfr:d:${ip}`, 10, 300)) {
    return json({
      ok: false,
      durum: 'kilit',
      mesaj: 'Çok sayıda deneme yapıldı. Lütfen birkaç dakika sonra yeniden deneyiniz.',
    }, 429);
  }
  if (await frenAsildiMi(env.KOD_KV, `gfr:s:${ip}`, 40, 3600)) {
    return json({
      ok: false,
      durum: 'kilit',
      mesaj: 'Çok sayıda deneme yapıldı. Giriş bir süreliğine kısıtlanmıştır; lütfen tarafımıza ulaşınız.',
    }, 429);
  }

  const biber = await biberAl(env.KOD_KV);
  const kayit = await env.KOD_KV.get(await kodAnahtari(biber, kod), { type: 'json' });

  if (!kayit || !kayit.mv) {
    return json({
      ok: false,
      durum: 'yok',
      mesaj: 'Girilen kod kayıtlarımızla eşleşmemektedir. Kodunuzu Müvekkil Girişi ekranından yeniden talep edebilirsiniz.',
    }, 401);
  }

  const muvekkil = await env.KOD_KV.get(kayit.mv, { type: 'json' });
  if (!muvekkil) {
    // Kod geçerli ama kayıt yok: veri tutarsızlığı. Müvekkile teknik ayrıntı
    // verilmez, ama "kodun yanlış" da denmez — çünkü değil.
    return json({
      ok: false,
      durum: 'hazir-degil',
      mesaj: 'Kaydınıza şu anda ulaşılamadı. Lütfen tarafımıza ulaşınız.',
    }, 503);
  }

  return json({
    ok: true,
    durum: 'acik',
    oturumGun: OTURUM_GUN,
    muvekkil: {
      ad: muvekkil.ad || '',
      sicil: muvekkil.sicil || '',
      dosyalar: Array.isArray(muvekkil.dosyalar) ? muvekkil.dosyalar : [],
    },
  });
}
