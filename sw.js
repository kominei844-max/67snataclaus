const V='vorrat-v1';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // Erst Netz (damit Updates ankommen), sonst gespeicherte Version
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
  }else if(u.hostname.includes('fonts.g')){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res})));
  }
});
