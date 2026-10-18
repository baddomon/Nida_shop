const CACHE_NAME = 'nida-shop-v2.3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index_3d.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './rabbit.jfif',
  './rabbit.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, and asynchronously fetch update for next time
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {
          // offline, ignore
        });
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache external assets like Google Fonts if successful
        if (networkResponse && networkResponse.status === 200) {
          const url = event.request.url;
          if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
        }
        return networkResponse;
      }).catch(() => {
        // If offline and request is for navigation, fallback to cached index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html').then((res) => res || caches.match('./'));
        }
      });
    })
  );
});
