const CACHE = "deck-pwa-v" + self.crypto.randomUUID();
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/src/main.tsx",
  "/src/app/App.tsx",
  "/src/index.css",
];
self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
);
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
  )
);
self.addEventListener("fetch", (e) =>
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)))
);
