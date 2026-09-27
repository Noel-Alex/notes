const CACHE='notes-v3';
const CORE=['./','./index.html','./assets/site.css','./assets/site.js','./catalog.json','./subjects/eda/','./subjects/eda/cat2/'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const req=event.request;
  const isNavigation=req.mode==='navigate' || (req.headers.get('accept')||'').includes('text/html');

  if(isNavigation){
    // Network-first for HTML so newly published study notes replace stale exam pages immediately.
    event.respondWith(
      fetch(req)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(req,copy));
          return response;
        })
        .catch(()=>caches.match(req).then(hit=>hit||caches.match('./index.html')))
    );
    return;
  }

  // Static assets: cached first, refresh cache when fetched.
  event.respondWith(
    caches.match(req).then(hit=>hit||fetch(req).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(req,copy));
      return response;
    }))
  );
});