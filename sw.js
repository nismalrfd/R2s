const CACHE_NAME = 'r2s-cache-v2';

const urlsToCache = [
  '/',
  '/login.html',
  '/dashboard.html',
  '/LOGO.png'
];

self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker immediately.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      }).catch(err => console.log('Cache addAll failed:', err))
  );
});

self.addEventListener('activate', event => {
  // Claim any open clients immediately so the new SW takes control instantly
  event.waitUntil(self.clients.claim());
  
  // Clean up any old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Use a Network-First strategy: 
  // Always try to fetch the latest version from the server first.
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If we get a valid response from the network, clone it and update the cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If the network fails (offline), fall back to the cache
        return caches.match(event.request).then(cachedResponse => {
           if (cachedResponse) {
               return cachedResponse;
           }
           // If not in cache and it's a page request, fallback to a safe page like login
           if (event.request.mode === 'navigate') {
              return caches.match('/login.html');
           }
        });
      })
  );
});