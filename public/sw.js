// Network-first, cache only as a fallback for true offline use.
// Never cache index.html or hashed JS/CSS bundles — those must always be fresh
// so app updates take effect immediately instead of being stuck on an old version.
const CACHE = 'wc2026-v3';
const NEVER_CACHE = [/\.html$/, /\/static\/js\//, /\/static\/css\//, /^\/$/];

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const skipCache = NEVER_CACHE.some(re => re.test(url.pathname));

  if (skipCache) {
    // Always go to network, never serve a cached copy of app code
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }

  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
