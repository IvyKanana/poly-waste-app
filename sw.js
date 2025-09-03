self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('polywaste-v2').then(cache => cache.addAll([
      './',
      './index.html',
      './app.js',
      './manifest.webmanifest',
      './assets/icon-192.png',
      './assets/icon-512.png',
      'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js',
      'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!=='polywaste-v2').map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
