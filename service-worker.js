// Name of the cache
const CACHE_NAME = "samosa-cache-v1";

// Files to cache
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/style.css",
  "/assets/app.js",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png"
];

// Install event (caches app files)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event (serves cached files when offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate event (cleanup old caches)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
