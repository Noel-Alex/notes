const CACHE='notes-v12';
const CORE=['./fat/past-papers/','./fat/past-papers/index.html','./fat/past-papers/archive.js','./fat/past-papers/mocks/eda.js','./fat/past-papers/mocks/data-mining.js','./fat/past-papers/mocks/deep-learning.js','./fat/past-papers/mocks/compiler-design.js','./subjects/eda/fat/workbook/','./subjects/eda/fat/workbook/index.html','./subjects/eda/fat/workbook/problems.js','./fat/','./fat/index.html','./fat/theme.css','./fat/engine.js','./fat/quizzes.js','./fat/data/eda.js','./fat/data/data-mining.js','./fat/data/deep-learning.js','./fat/data/compiler-design.js','./subjects/eda/fat/','./subjects/data-mining/fat/','./subjects/deep-learning/fat/','./subjects/compiler-design/fat/','./','./index.html','./assets/site.css','./assets/site.js','./catalog.json','./subjects/eda/','./subjects/eda/cat2/','./subjects/data-mining/','./subjects/data-mining/cat2/','./subjects/data-mining/cat2/cat2.css','./subjects/data-mining/cat2/cat2.js','./subjects/deep-learning/','./subjects/deep-learning/cat2/','./subjects/deep-learning/cat2/cat2.css','./subjects/deep-learning/cat2/cat2.js','./subjects/compiler-design/','./subjects/compiler-design/cat2/','./subjects/compiler-design/cat2/cat2.css','./subjects/compiler-design/cat2/cat2.js','./subjects/compiler-design/cat2/theory.css','./subjects/compiler-design/cat2/theory.js','./subjects/compiler-design/cat2/sections/start.html','./subjects/compiler-design/cat2/sections/m2.html','./subjects/compiler-design/cat2/sections/m3.html','./subjects/compiler-design/cat2/sections/m4a.html','./subjects/compiler-design/cat2/sections/m4b.html','./subjects/compiler-design/cat2/sections/m5a.html','./subjects/compiler-design/cat2/sections/m5b.html','./subjects/compiler-design/cat2/sections/finish.html'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const req=event.request;
  const isNavigation=req.mode==='navigate' || (req.headers.get('accept')||'').includes('text/html');
  if(isNavigation){
    event.respondWith(fetch(req).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return response;}).catch(()=>caches.match(req).then(hit=>hit||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return response;})));
});