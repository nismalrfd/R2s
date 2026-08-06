const CACHE_NAME = 'r2s-pwa-v2'; // Incremented cache version
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/verify.html',
  '/signup.html',
  '/property-detail.html',
  '/add-property.html',
  '/profile.html',
  '/edit-profile.html'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old v1 cache
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open pages immediately
  );
});

self.addEventListener('fetch', event => {
  // NETWORK FIRST STRATEGY (great for active development)
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});