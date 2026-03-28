const CACHE = 'portfolio-static-v93';
const OFFLINE_FIRST_EXT = [
  '.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.woff2', '.woff', '.ttf', '.otf', '.json', '.webmanifest', '.pdf'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if(req.method !== 'GET'){ return; }
  const url = new URL(req.url);
  const isAsset = OFFLINE_FIRST_EXT.some(ext => url.pathname.endsWith(ext));

  if(isAsset){
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      if(cached){
        // Refresh in background when possible
        fetch(req).then(r=> { if(r && r.ok) cache.put(req, r.clone()); }).catch(()=>{});
        return cached;
      }
      const res = await fetch(req);
      if(res && res.ok){ cache.put(req, res.clone()); }
      return res;
    })());
  } else if(url.origin === location.origin){
    // Network-first for same-origin HTML navigations
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try{
        const res = await fetch(req);
        if(res && res.status === 200){ cache.put(req, res.clone()); }
        return res;
      } catch {
        const cached = await cache.match(req);
        return cached || new Response('Offline', {status: 503, statusText: 'Offline'});
      }
    })());
  }
});
