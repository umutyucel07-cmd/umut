// ============================================================================
//  /api/otomatik-cevap — otomatik yanıt metinlerini JSON olarak sunar
//  Av. Umut Yücel · 21.08.2026
//
//  ── BU UÇ NEDEN VAR ───────────────────────────────────────────────────────
//  07_Buro-Duzeni/_Araclar/rapor_uret.py yerel makinede otomatik_cevap.json
//  üretiyordu ama o dosya git'e HİÇ girmiyordu (07_Buro-Duzeni tamamen
//  .gitignore'lu). Site/mobil/Worker bu metinlere hiçbir zaman erişemedi;
//  "otomatik cevap sistemi" fiilen yalnız bir belge üretiyordu.
//
//  Metinlerin TEK kaynağı artık lib/otomatik-cevap.js (kişisel veri
//  içermez — reklam yasağı ve KVKK gereği zaten öyle tasarlandı). Bu uç
//  o dosyayı olduğu gibi döndürür; sunucu tarafında değişken/hesaplama yok.
//
//  ── GÜVENLİK ──────────────────────────────────────────────────────────────
//  Kişisel veri YOKTUR (müvekkil adı, T.C., dosya no, dava sonucu) — bu
//  metinler zaten dışa dönük WhatsApp/web yanıtları için tasarlandı, herkese
//  açık olabilir. Kimlik doğrulama GEREKMEZ.
// ============================================================================
import { json } from '../../lib/kimlik.js';
import { otomatikCevapGovdesi, OTOMATIK_CEVAPLAR } from '../../lib/otomatik-cevap.js';

const GECERLI_ANAHTARLAR = new Set(Object.keys(OTOMATIK_CEVAPLAR));

export async function onRequest({ request }) {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    // ?anahtar=karsilama → yalnız o metni döndürür (Worker/istemci için pratik).
    const anahtar = url.searchParams.get('anahtar');
    if (anahtar) {
      if (!GECERLI_ANAHTARLAR.has(anahtar)) {
        return json({ ok: false, error: 'bilinmeyen_anahtar' }, 404);
      }
      return json({ ok: true, anahtar, metin: OTOMATIK_CEVAPLAR[anahtar] });
    }
    return json({ ok: true, ...otomatikCevapGovdesi() });
  }

  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
