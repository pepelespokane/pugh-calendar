// Pugh Calendar service worker — network-first, falls back to cache offline.
const CACHE_NAME = 'pugh-calendar-v1';
const APP_SHELL = ['./', './index.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    clients.claim(),
    caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))),
  ]));
});
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    fetch(event.request)
      .then(response => { const clone = response.clone(); caches.open(CACHE_NAME).then(c => c.put(event.request, clone)); return response; })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});
self.addEventListener('message', (event) => { if (event.data === 'skipWaiting') self.skipWaiting(); });
