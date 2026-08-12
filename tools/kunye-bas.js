#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const Buro = require(path.join(ROOT, 'js', 'buro-bilgi.js'));

const hedefler = [
  'index.html',
  'manifest.webmanifest',
  'functions/api/kod-talebi.js',
  'functions/api/webhook.js',
];

const esleme = {
  '{{AD}}': Buro.ad,
  '{{BURO}}': Buro.buro,
  '{{SICIL}}': Buro.baroSicil,
};

let toplam = 0;
for (const rel of hedefler) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');
  const once = content;
  for (const [key, value] of Object.entries(esleme)) {
    content = content.split(key).join(String(value));
  }
  if (content !== once) {
    fs.writeFileSync(p, content, 'utf8');
    toplam += 1;
    console.log('yazildi:', rel);
  }
}
console.log(`\n${toplam} dosya güncellendi. Künye: "${Buro.buro}"`);
