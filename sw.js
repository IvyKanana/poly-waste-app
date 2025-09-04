self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("polywaste-cache").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js",
        "./manifest.webmanifest"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
