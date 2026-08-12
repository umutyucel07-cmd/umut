// ============================================================================
//  Worker v6 — PORTAL MODÜLÜ (mevcut muddy-hat-f441 worker.js'e EKLENECEK)
//  Av. Umut Yücel · 12.08.2026
//
//  Bu, çalışan Worker'ı BOZMADAN genişletir. Yeni bir sunucu/uç DEĞİLDİR —
//  aynı Worker, aynı KV (DEDUPE binding), aynı ERISIM_TOKEN.
//
//  KURULUM: aşağıdaki 3 route satırını worker.js'in fetch() GET/POST
//  bloklarına ekle, ardından bu dosyadaki 4 fonksiyonu worker.js'in en altına
//  (export'tan önce) yapıştır. Detay ve doğrulama: PORTAL-KURULUM.md.
// ============================================================================

// ---- worker.js fetch() İÇİNE EKLENECEK ROUTE'LAR ----
//
//   POST bloğunda, imza doğrulamasından ÖNCE:
//     if (yol === "/portal/dogrula") return portalDogrula(request, env);
//     if (env.ERISIM_TOKEN && yol === `/portal/yukle/${env.ERISIM_TOKEN}`)
//       return portalYukle(request, env);
//
//   (GET tarafına dokunma; portal yalnız POST.)

// ---------------------------------------------------------------------------

var PORTAL_HIZ_PENCERE_SN = 60;   // 1 dakikalık pencere
var PORTAL_HIZ_TAVAN = 8;         // IP başına dakikada en çok 8 deneme
var PORTAL_KILIT_SN = 300;        // tavan aşılırsa 5 dk kilit

async function sha256hex(metin) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(metin));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Kaba kuvvete karşı IP başına hız sınırı (KV üzerinde).
async function portalHizAsimi(env, ip) {
  if (!env.DEDUPE || !ip) return false;
  const kilitK = `portal:kilit:${ip}`;
  if (await env.DEDUPE.get(kilitK)) return true;
  const sayacK = `portal:hiz:${ip}`;
  const n = parseInt((await env.DEDUPE.get(sayacK)) || "0", 10) + 1;
  if (n > PORTAL_HIZ_TAVAN) {
    await env.DEDUPE.put(kilitK, "1", { expirationTtl: PORTAL_KILIT_SN });
    return true;
  }
  await env.DEDUPE.put(sayacK, String(n), { expirationTtl: PORTAL_HIZ_PENCERE_SN });
  return false;
}

// Müvekkil kodu doğrular. Kodun KENDİSİ hiçbir yerde saklı değildir; yalnız
// SHA-256 özeti KV'de `portal:<hash>` altında durur. Bu uç sızsa bile kod
// geri çözülemez. İkincil doğrulama: T.C. son 4 hane (kayıtta varsa).
async function portalDogrula(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "";
  if (await portalHizAsimi(env, ip)) {
    return jsonYanit({ ok: false, neden: "cok_deneme" });
  }
  let istek;
  try {
    istek = JSON.parse(await request.text());
  } catch {
    return jsonYanit({ ok: false, neden: "gecersiz" });
  }
  const kod = String(istek.kod || "").toLocaleUpperCase("tr-TR").replace(/[\s]/g, "");
  if (!/^MY-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(kod)) {
    return jsonYanit({ ok: false, neden: "bicim" });
  }
  if (!env.DEDUPE) return jsonYanit({ ok: false, neden: "kv_yok" });

  const ozet = await sha256hex(kod);
  const ham = await env.DEDUPE.get(`portal:${ozet}`);
  if (!ham) return jsonYanit({ ok: false, neden: "eslesmedi" });

  let kayit;
  try {
    kayit = JSON.parse(ham);
  } catch {
    return jsonYanit({ ok: false, neden: "veri" });
  }

  // İkincil doğrulama: kayıtta T.C. son-4 varsa istenir ve eşleşmeli.
  if (kayit.tc4) {
    const tc4 = String(istek.tc4 || "").replace(/\D/g, "");
    if (!tc4) return jsonYanit({ ok: false, neden: "tc4_gerekli" });
    if (tc4 !== kayit.tc4) return jsonYanit({ ok: false, neden: "tc4_yanlis" });
  }

  // Başarılı giriş — dosya durumu İÇERİĞİ bu üçüncü katmanda değildir.
  // İçerik ayrı bir KV anahtarında (`dosya:<hash>`) tutulur; henüz yüklenmediyse
  // portal "veri hazırlanıyor" gösterir. Burada yalnız kimlik + varsa özet döner.
  const durum = await env.DEDUPE.get(`dosya:${ozet}`);
  return jsonYanit({
    ok: true,
    ad: kayit.ad,
    tur: kayit.tur || "kisi",
    dosya: durum ? JSON.parse(durum) : null,
  });
}

// Portal seed'ini KV'ye yükler. YALNIZ ERISIM_TOKEN'lı yoldan çağrılabilir.
// Gövde: [{ "kod_ozeti": "...", "ad": "...", "tc_son4": "...", "tel_son4": "...", "tur": "..." }, ...]
async function portalYukle(request, env) {
  if (!env.DEDUPE) return jsonYanit({ durum: "hata", neden: "kv_yok" });
  let liste;
  try {
    liste = JSON.parse(await request.text());
  } catch {
    return jsonYanit({ durum: "hata", neden: "gecersiz_json" });
  }
  if (!Array.isArray(liste)) return jsonYanit({ durum: "hata", neden: "dizi_bekleniyor" });

  let yazilan = 0;
  for (const r of liste.slice(0, 1000)) {
    const ozet = String(r?.kod_ozeti || "");
    if (!/^[0-9a-f]{64}$/.test(ozet)) continue;
    const deger = JSON.stringify({
      ad: String(r.ad || ""),
      tc4: String(r.tc_son4 || ""),
      tel4: String(r.tel_son4 || ""),
      tur: String(r.tur || "kisi"),
    });
    await env.DEDUPE.put(`portal:${ozet}`, deger);
    yazilan++;
  }
  return jsonYanit({ durum: "yuklendi", yazilan, gelen: liste.length });
}

// ---------------------------------------------------------------------------
//  4. ŞABLON — SABLONLAR nesnesine EKLENECEK (mevcut üç şablonun yanına):
//
//    portal_kodu: "Sayın müvekkilimiz, Müvekkil Bilgi Sistemi erişim kodunuz " +
//      "büromuzca tarafınıza iletilmiştir. Giriş: avumutyucelhukuk.com → Müvekkil " +
//      "Girişi. Erişim kodunuzu kimseyle paylaşmayınız; büromuz kodunuzu telefon " +
//      "veya mesajla talep etmez. Bu otomatik bir bilgilendirmedir."
//
//  DİKKAT: Bu şablon KODUN KENDİSİNİ İÇERMEZ. Kod, avukatın kişiye özel elden
//  gönderdiği mesajda (dağıtım paketi) gider. Worker'ın /gonder ucundan kod
//  gövdesi ASLA geçmez — çünkü /gonder yalnız sabit şablon adı kabul eder,
//  serbest metin reddeder. Bu, "kodu numaraya güvenip otomatik gönderme"
//  hatasına düşmemek için bilinçli tasarımdır.
// ---------------------------------------------------------------------------
