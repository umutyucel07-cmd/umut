// Umut Yücel Hukuk — çevrimdışı önbellek
const SURUM = 'uy-v8';   // 12.08.2026: vendor/ + webp geçişi — eski önbellek temizlensin diye artırıldı
const VARLIKLAR = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SURUM).then((c) => c.addAll(VARLIKLAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== SURUM).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// Sayfa istekleri: önce ağ, olmazsa önbellek (böylece güncelleme hemen görünür, internet yoksa site açılır)
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r).then((y) => { caches.open(SURUM).then((c) => c.put('/index.html', y.clone())); return y; })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
