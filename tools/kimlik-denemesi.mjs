// Uçtan uca senaryo denemesi — sahte KV + sahte WhatsApp.
import { onRequest as giris } from './giris.mjs';
import { onRequest as kodTalebi } from './kod.mjs';
import { adNormalize, telNormalize, kodNormalize } from './kimlik.mjs';
import crypto2 from 'node:crypto';

const KV = () => {
  const m = new Map();
  return {
    _m: m,
    async get(k, o) { const v = m.get(k); if (v === undefined) return null; return o?.type === 'json' ? JSON.parse(v) : v; },
    async put(k, v) { m.set(k, v); },
    async delete(k) { m.delete(k); },
  };
};

let gonderilenler = [];
globalThis.fetch = async (url, init) => {
  gonderilenler.push(JSON.parse(init.body));
  return { ok: true, text: async () => '' };
};

const istek = (govde) => new Request('https://x/api/y', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'CF-Connecting-IP': '1.2.3.4' },
  body: JSON.stringify(govde),
});

const oz = (biber, alan, d) => crypto2.createHash('sha256').update(`${biber}|${alan}|${d}`, 'utf8').digest('hex');

let gecti = 0, kaldi = 0;
const kontrol = (ad, kosul, ek = '') => {
  if (kosul) { console.log(`  ✅ ${ad}`); gecti++; }
  else { console.log(`  ❌ ${ad} ${ek}`); kaldi++; }
};

async function calistir() {
  // ---- 1. KV yokken: söz VERİLMEZ ---------------------------------------
  // ESKİ BEKLENTİ 'kuyruk' İDİ VE YANLIŞTI: bu dal "talebiniz alınmıştır"
  // diyor, ama KV bağlı olmadığı için talebi yazacağı yer yok. Söz veriliyor,
  // talep kayboluyordu. Doğru davranış: söz vermemek.
  let r = await kodTalebi({ request: istek({ ad: 'Ayşe Yılmaz', tel: '05320000000' }), env: {} });
  let c = await r.json();
  kontrol('KV yokken kod talebi SÖZ VERMEZ', c.durum === 'hazir-degil', JSON.stringify(c));
  kontrol('KV yokken "alınmıştır" denmez', !/alınmıştır|iletilecek/i.test(c.mesaj || ''), JSON.stringify(c));

  r = await giris({ request: istek({ kod: 'UY-ABCD-EFGH' }), env: {} });
  c = await r.json();
  kontrol('KV yokken giriş "hazır değil" der, "kod yanlış" DEMEZ', c.durum === 'hazir-degil', JSON.stringify(c));

  // ---- 2. Dizin boşken: söz VERİLMEZ, "eşleşmedi" de DENMEZ -------------
  const kv = KV();
  const env = { KOD_KV: kv, WA_PHONE_ID: '109650188830111', WA_TOKEN: 'sahte' };
  r = await kodTalebi({ request: istek({ ad: 'Ayşe Yılmaz', tel: '05320000000' }), env });
  c = await r.json();
  kontrol('dizin boşken kod talebi SÖZ VERMEZ', c.durum === 'hazir-degil', JSON.stringify(c));
  kontrol('dizin boşken "eşleşmedi" DENMEZ', c.durum !== 'yok', JSON.stringify(c));

  // Dizin boşken GİRİŞ de "kod yanlış" dememeli. 13.08 akşamı canlıda ölçüldü:
  // KOD_KV bağlı ama boşken doğru biçimli bir kod "kayıtlarımızla
  // eşleşmemektedir" yanıtı alıyordu — 12.08'de düzeltilen yalanın başka dalı.
  r = await giris({ request: istek({ kod: 'UY-ABCD-EFGH' }), env });
  c = await r.json();
  kontrol('dizin boşken giriş "hazır değil" der, "kod yanlış" DEMEZ', c.durum === 'hazir-degil', JSON.stringify(c));
  kontrol('dizin boşken giriş 503 döner (401 değil)', r.status === 503, `status=${r.status}`);

  // ---- 3. Dizini yükle (muvekkil-yukle.js ile AYNI hesap) ---------------
  const biber = await kv.get('sys:biber');
  kontrol('biber sunucuda üretilmiş', !!biber && biber.length === 64);
  const anahtar = `mv:${oz(biber, 'mv', `${adNormalize('Ayşe Yılmaz')}|${telNormalize('05320000000')}`)}`;
  await kv.put(anahtar, JSON.stringify({ ad: 'Ayşe Yılmaz', tel: '5320000000', sicil: 'MV-1', dosyalar: [{ id: 1, title: 'Test' }] }));
  await kv.put('sys:dizin', JSON.stringify({ adet: 1, t: 'x' }));

  // ---- 4. Kod talebi: gönderilir, yanıtta kod YOKTUR --------------------
  gonderilenler = [];
  r = await kodTalebi({ request: istek({ ad: 'ayşe   yılmaz', tel: '+90 532 000 00 00' }), env });
  c = await r.json();
  kontrol('eşleşen müvekkile kod gönderilir', c.durum === 'gonderildi', JSON.stringify(c));
  kontrol('yanıt gövdesinde kod GEÇMEZ', !JSON.stringify(c).match(/UY-[0-9A-Z]{4}-[0-9A-Z]{4}/), JSON.stringify(c));
  const mesaj = gonderilenler[0]?.text?.body || '';
  const kod1 = (mesaj.match(/UY-[0-9A-Z]{4}-[0-9A-Z]{4}/) || [])[0];
  kontrol('WhatsApp mesajında kod var', !!kod1, mesaj);
  kontrol('hedef numara 90 önekli', gonderilenler[0]?.to === '905320000000', gonderilenler[0]?.to);

  // ---- 5. Giriş: doğru kod açar, yalnız KENDİ kaydını döner -------------
  r = await giris({ request: istek({ kod: kod1 }), env });
  c = await r.json();
  kontrol('doğru kod ile giriş açılır', c.ok === true && c.muvekkil?.ad === 'Ayşe Yılmaz', JSON.stringify(c));
  kontrol('yanıtta telefon dönmez', !JSON.stringify(c).includes('5320000000'), JSON.stringify(c));

  // ---- 6. Yanlış kod: 401 ----------------------------------------------
  r = await giris({ request: istek({ kod: 'UY-2222-3333' }), env });
  c = await r.json();
  kontrol('yanlış kod reddedilir', r.status === 401 && c.durum === 'yok', `${r.status} ${JSON.stringify(c)}`);

  // ---- 7. Biçimsiz kod: 400 --------------------------------------------
  r = await giris({ request: istek({ kod: 'saçma' }), env });
  c = await r.json();
  kontrol('biçimsiz kod 400 döner', r.status === 400 && c.durum === 'bicim');

  // ---- 8. YENİLEME: yeni kod eskisini geçersiz kılar --------------------
  await kv.delete('kfr:1.2.3.4');            // fren penceresini sıfırla
  gonderilenler = [];
  r = await kodTalebi({ request: istek({ ad: 'Ayşe Yılmaz', tel: '05320000000' }), env });
  c = await r.json();
  const kod2 = ((gonderilenler[0]?.text?.body || '').match(/UY-[0-9A-Z]{4}-[0-9A-Z]{4}/) || [])[0];
  kontrol('ikinci talepte YENİ kod üretilir', !!kod2 && kod2 !== kod1, `${kod1} → ${kod2}`);

  r = await giris({ request: istek({ kod: kod2 }), env });
  kontrol('yeni kod çalışır', r.status === 200);
  r = await giris({ request: istek({ kod: kod1 }), env });
  kontrol('ESKİ kod artık çalışmaz', r.status === 401);

  // ---- 9. WA yapılandırılmamışsa kod ÜRETİLMEZ (eski kod yaşar) --------
  await kv.delete('kfr:1.2.3.4');
  const envWAsiz = { KOD_KV: kv };
  r = await kodTalebi({ request: istek({ ad: 'Ayşe Yılmaz', tel: '05320000000' }), env: envWAsiz });
  c = await r.json();
  kontrol('WA yokken kuyruk döner', c.durum === 'kuyruk');
  r = await giris({ request: istek({ kod: kod2 }), env });
  kontrol('WA yokken mevcut kod İPTAL EDİLMEZ', r.status === 200);

  // ---- 9b. WA yokken talep KUYRUĞA YAZILIR -----------------------------
  const kuyrukAnahtarlari = [...kv._m.keys()].filter((k) => k.startsWith('talep:'));
  kontrol('WA yokken talep kuyruğa yazılır', kuyrukAnahtarlari.length === 1,
          JSON.stringify(kuyrukAnahtarlari));
  const kayitKuyruk = JSON.parse(kv._m.get(kuyrukAnahtarlari[0]) || '{}');
  kontrol('kuyrukta ad var', kayitKuyruk.ad === 'Ayşe Yılmaz', JSON.stringify(kayitKuyruk));
  kontrol('kuyrukta TAM telefon YOK', !JSON.stringify(kayitKuyruk).includes('5320000000'),
          JSON.stringify(kayitKuyruk));
  kontrol('kuyrukta son dört hane var', kayitKuyruk.telSon4 === '0000', kayitKuyruk.telSon4);

  // ---- 10. Eşleşmeyen müvekkil -----------------------------------------
  await kv.delete('kfr:1.2.3.4');
  r = await kodTalebi({ request: istek({ ad: 'Bilinmeyen Kişi', tel: '05559998877' }), env });
  c = await r.json();
  kontrol('eşleşmeyen ad+telefon "yok" döner', c.durum === 'yok');
  kontrol('eşleşmeyen kişi kuyruğa YAZILMAZ',
          [...kv._m.keys()].filter((k) => k.startsWith('talep:')).length === 1,
          'büro ile ilişkisi olmayan kişinin verisi kaydedilmemeli');

  // ---- 11. Fren -------------------------------------------------------
  await kv.delete('kfr:1.2.3.4');
  let sonDurum = '';
  for (let i = 0; i < 5; i++) {
    const rr = await kodTalebi({ request: istek({ ad: 'Ayşe Yılmaz', tel: '05320000000' }), env });
    sonDurum = (await rr.json()).durum;
  }
  kontrol('kod talebi freni devreye girer', sonDurum === 'sik', sonDurum);

  // ---- 12. Normalizasyon ----------------------------------------------
  kontrol('eski biçim kod normalize olur', kodNormalize('uy 4182') === 'UY-4182', kodNormalize('uy 4182'));
  kontrol('yeni biçim kod normalize olur', kodNormalize('uy-abcd-efgh') === 'UY-ABCD-EFGH', kodNormalize('uy-abcd-efgh'));
  kontrol('karışık harf reddedilir (I/O/0/1 alfabede yok)', kodNormalize('UY-IOOO-1111') === '');
  kontrol('Türkçe "i" büyük harfi doğru', adNormalize('inci şahin') === 'İNCİ ŞAHİN', adNormalize('inci şahin'));

  console.log(`\n  geçti: ${gecti}   kaldı: ${kaldi}`);
  process.exit(kaldi ? 1 : 0);
}
calistir();
