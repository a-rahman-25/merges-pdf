const CACHE_NAME = 'mergespdf-v2';
const STATIC_ASSETS = ['/', '/logo.svg', '/manifest.json', '/favicon.ico'];
const NEVER_CACHE_PATTERNS = [
  '/@vite/',
  '/node_modules/.vite/',
  '/src/',
  '/@react-refresh',
  '/favicon.ico?'
];

const isCacheableStaticAsset = (request) => {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.search) return false;
  return STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/og/');
};

const shouldBypassCache = (request) => {
  const url = new URL(request.url);
  if (request.method !== 'GET') return true;
  if (url.origin !== self.location.origin) return true;
  if (request.mode === 'navigate') return false;
  return NEVER_CACHE_PATTERNS.some((pattern) => url.pathname.includes(pattern)) || url.search.length > 0;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (shouldBypassCache(request)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  if (isCacheableStaticAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(fetch(request));
});
