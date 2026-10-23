const CACHE_NAME = 'nida-shop-v3.3';
const ASSETS_TO_CACHE = [
  './', './index.html', './style.css', './app.js',
  './manifest.json', './icon-192.png', './icon-512.png', './rabbit.jpg'
];
const CORE = ['index.html', 'style.css', 'app.js', 'manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function put(req, res) {
  // Accept normal and opaque (cross-origin no-cors, e.g. Google Fonts) responses
  if (res && (res.status === 200 || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE_NAME).then((c) => c.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !isFont) return;

  const isCore = req.mode === 'navigate' || CORE.some((f) => url.pathname.endsWith('/' + f)) || url.pathname.endsWith('/');

  if (isFont) {
    // stale-while-revalidate for fonts
    event.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((r) => put(req, r)).catch(() => hit);
        return hit || net;
      })
    );
  } else if (isCore) {
    // network-first so updates land immediately; cache fallback when offline
    event.respondWith(
      fetch(req).then((r) => put(req, r)).catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))
      )
    );
  } else {
    // cache-first for images/icons (cache name is bumped on release)
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((r) => put(req, r)))
    );
  }
});
