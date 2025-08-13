self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('polywaste-v1').then((cache) => {
    return cache.addAll(['./','index.html','app.js','manifest.webmanifest','assets/icon-192.png','assets/icon-512.png']);
  }));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});
