/* Notes progressive offline cache.
   Network-first for HTML and EDA textbook assets; an older installation must never
   silently pin the course to an obsolete set of JavaScript files. */
const VERSION='notes-v15-eda-teaching-qa';
const CACHE=VERSION;
const PRECACHE=[
'./','./index.html','./fat/','./fat/index.html',
'./subjects/eda/','./subjects/eda/fat/','./subjects/eda/fat/index.html',
'./subjects/eda/fat/textbook/reader.css',
'./subjects/eda/fat/textbook/reader.js',
'./subjects/eda/fat/textbook/labs.js',
'./subjects/eda/fat/textbook/m01.js',
'./subjects/eda/fat/textbook/m02.js',
'./subjects/eda/fat/textbook/m03.js',
'./subjects/eda/fat/textbook/m04.js',
'./subjects/eda/fat/textbook/m05.js',
'./subjects/eda/fat/textbook/m06.js',
'./subjects/eda/fat/textbook/m07.js',
'./subjects/eda/fat/workbook/',
'./subjects/eda/fat/workbook/index.html',
'./subjects/eda/fat/workbook/problems.js',
'./subjects/eda/fat/textbook/deep/m01.js',
'./subjects/eda/fat/textbook/deep/m02.js',
'./subjects/eda/fat/textbook/deep/m03.js',
'./subjects/eda/fat/textbook/deep/m04.js',
'./subjects/eda/fat/textbook/deep/m05.js',
'./subjects/eda/fat/textbook/deep/m06.js',
'./subjects/eda/fat/textbook/deep/m07.js',
'./subjects/eda/fat/textbook/deep/apply.js',
'./subjects/eda/fat/textbook/deep/extra.css',
'./subjects/eda/fat/quiz/',
'./subjects/eda/fat/quiz/index.html',
'./subjects/eda/fat/quiz/questions.js',
'./subjects/eda/fat/coverage/',
'./subjects/eda/fat/coverage/index.html',
'./fat/past-papers/',
'./fat/past-papers/index.html'
];

function cacheResponse(request,response){
  if(!response || !response.ok || response.type==='opaque')return Promise.resolve(response);
  const copy=response.clone();
  return caches.open(CACHE).then(cache=>cache.put(request,copy))
    .catch(()=>{}).then(()=>response);
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    // Failure of any optional asset cannot prevent a new worker from activating.
    await Promise.allSettled(PRECACHE.map(async path=>{
      try{
        const address=new URL(path,self.registration.scope).href;
        const response=await fetch(address,{cache:'reload'});
        if(response.ok)await cache.put(address,response);
      }catch(_){}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('notes-v')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin!==self.location.origin)return;
  const isNavigation=req.mode==='navigate'||(req.headers.get('accept')||'').includes('text/html');
  const isTextbook=/\/subjects\/eda\/fat\/(?:textbook\/|index\.html|$)/.test(u.pathname);
  const isAsset=/\.(?:js|css)(?:$)/i.test(u.pathname);
  if(isNavigation || isTextbook || isAsset){
    // Prefer the deployed version; offline-only mode falls back to a cached response.
    event.respondWith(fetch(req,{cache:'no-store'}).then(r=>cacheResponse(req,r))
      .catch(()=>caches.match(req).then(hit=>{
        if(hit)return hit;
        if(isNavigation)return caches.match(new URL('./index.html',self.registration.scope).href);
        return Response.error();
      })));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>cacheResponse(req,r))));
});
