#!/usr/bin/env node
/* ============================================================================
 *  kunye-bas.js — künye EŞİTLEYİCİ
 *  Av. Umut Yücel · 13.08.2026 (yeniden yazıldı)
 *
 *  ÖNCEKİ SÜRÜMÜN SORUNU: {{BURO}} işaretçilerini dosyanın İÇİNDE gerçek değerle
 *  değiştiriyordu. Bu tek yönlüdür — bir kez çalıştırıldığında işaretçi yok olur,
 *  dosya yeniden sabit künyeye döner ve script bir daha işe yaramaz. Kaynak-çıktı
 *  ayrımı olmadan şablon basmak kendi girdisini yok eden bir derleme adımıdır.
 *
 *  YENİ YAKLAŞIM — şablon yok, EŞİTLEME var:
 *  Statik dosyalarda (index.html, manifest, sw.js) künye zorunlu olarak sabit
 *  durur; Googlebot ve manifest ayrıştırıcısı JavaScript çalıştırmaz. Doğru
 *  değişmez "tek kopya olsun" değil, "BÜTÜN kopyalar js/buro-bilgi.js ile AYNI
 *  olsun"dur. Bu script sapmayı bulur (--kontrol) ve düzeltir (--uygula).
 *
 *  Kullanım:
 *    node tools/kunye-bas.js            # sapma raporu (varsayılan)
 *    node tools/kunye-bas.js --uygula   # sapmaları buro-bilgi.js'e göre düzelt
 * ==========================================================================*/
'use strict';
const fs = require('fs');
const path = require('path');
const KOK = path.resolve(__dirname, '..');
const B = require(path.join(KOK, 'js', 'buro-bilgi.js'));

const UYGULA = process.argv.includes('--uygula');

// Künyenin meşru olarak sabit durduğu dosyalar. functions/api/webhook.js
// BİLEREK YOK — o uç karantinada (.KARANTINA); listeye eklenmez.
const HEDEF = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'js/buro.js',
  'functions/api/kod-talebi.js',
];

// Eski/yanlış yazımlar -> doğru değer. Sıra önemli: uzun olan önce.
const DOGRU_BURO = B.buro;                    // "Umut Yücel Hukuk Bürosu"
const ESKI_BURO = [
  'Av. Umut Yücel Hukuk Bürosu',
  'Yücel Hukuk Bürosu',
  'Umut Yücel Hukuk Bürosu',   // doğru olan; yerinde bırakılır
  'Umut Yucel Hukuk Burosu',
  'Umut Yucel Hukuk',
  'Yucel Hukuk',
].filter(v => v !== DOGRU_BURO);

let sapma = 0, yazilan = 0;
const rapor = [];

for (const rel of HEDEF) {
  const p = path.join(KOK, rel);
  if (!fs.existsSync(p)) { rapor.push(['—', rel, 'dosya yok']); continue; }
  let icerik = fs.readFileSync(p, 'utf8');
  const once = icerik;
  const bulunan = [];

  // Kısa varyantlar doğru unvanın İÇİNDE de geçer ("Yücel Hukuk Bürosu" ⊂
  // "Umut Yücel Hukuk Bürosu"). Bu yüzden önce doğru unvan geçici bir belirteçle
  // maskelenir, sapmalar ondan sonra aranır, en sonda maske geri açılır.
  const MASKE = '\u0000UY_DOGRU\u0000';
  icerik = icerik.split(DOGRU_BURO).join(MASKE);
  for (const eski of ESKI_BURO) {
    if (icerik.includes(eski)) {
      bulunan.push(eski);
      icerik = icerik.split(eski).join(MASKE);
    }
  }
  icerik = icerik.split(MASKE).join(DOGRU_BURO);
  // Baro sicil — YALNIZ VARLIK KONTROLÜ, otomatik yeniden yazma YOK.
  //
  // 13.08.2026: bu scriptin ilk sürümü sicil numarasını desenle yakalayıp yeniden
  // yazıyordu. js/buro.js içinde "Antalya Barosu · Sicil 6448"in yanında
  // "TBB Sicil 160505" de geçiyor — TBB sicili AYRI bir numaradır. Desen onun ilk
  // beş hanesini yakaladı; --uygula çalıştırılsaydı 160505 bozulacaktı.
  // Prozadaki sayıyı bulanık desenle değiştirmek bir eşitleyicinin işi değildir.
  // Bunun yerine: "Antalya Baro..." bağlamında geçen sayı doğru olmalı; değilse
  // yalnız RAPOR edilir, elle düzeltilir.
  for (const g of (icerik.match(/Antalya\s+Baro(?:su)?[^0-9]{0,24}\d{3,6}/g) || [])) {
    const no = (g.match(/(\d{3,6})$/) || [])[1];
    if (no && no !== String(B.baroSicil)) bulunan.push('baro sicil ' + no + ' \u2260 ' + B.baroSicil + ' — ELLE düzeltin');
  }

  if (icerik !== once || bulunan.length) {
    sapma += bulunan.length;
    rapor.push(['✗', rel, bulunan.join(' · ')]);
    if (UYGULA) { fs.writeFileSync(p, icerik, 'utf8'); yazilan++; }
  } else {
    rapor.push(['✓', rel, 'künye eşit']);
  }
}

console.log('künye eşitleme — kaynak: js/buro-bilgi.js');
console.log('─'.repeat(62));
for (const [im, dosya, not] of rapor) console.log(`  ${im} ${dosya.padEnd(32)} ${not}`);
console.log('─'.repeat(62));
console.log(`  Büro : "${B.buro}"`);
console.log(`  Ad   : "${B.ad}"   Sicil: ${B.baroSicil}`);
if (sapma === 0) { console.log('\n✅ Bütün kopyalar kaynakla aynı.'); process.exit(0); }
if (UYGULA) { console.log(`\n✅ ${yazilan} dosya eşitlendi (${sapma} sapma).`); process.exit(0); }
console.log(`\n⚠️  ${sapma} sapma bulundu. Düzeltmek için:  node tools/kunye-bas.js --uygula`);
process.exit(1);
