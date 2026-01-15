const CACHE = "deck-pwa-" + (self.crypto?.randomUUID?.() || Date.now());
const ASSETS = [
  // Alap assetek – a SW scope alatt látod majd (BASE_URL alútvonal)
  "./",
  "./index.html",
  "./assets/index-*.js",
  "./assets/index-*.css",
  "./manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
  );
});
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
