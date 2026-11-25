/* مجرّة ضياء · يخلي الموقع يفتح حتى بدون إنترنت (آخر نسخة محفوظة) */
const V='diya-shell-v1';
const SHELL=['./','./index.html','./manifest.json','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{if(res&&(res.ok||res.type==='opaque'))caches.open(V).then(c=>c.put(r,res)).catch(()=>{})};
function netFirst(r){
  return new Promise(ok=>{let done=false;
    const fb=()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match(new URL('index.html',r.url).href)).then(m=>m||caches.match('./index.html')).then(m=>{if(!done){done=true;ok(m||Response.error())}});
    const t=setTimeout(fb,6000);
    fetch(r).then(res=>{clearTimeout(t);if(!done){done=true;ok(res)}if(res.ok&&!new URL(r.url).search)put(r,res.clone())}).catch(()=>{clearTimeout(t);fb()})})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===self.location.origin){
    if(u.pathname.includes('/push/onesignal/'))return;
    if(u.search){return}                                   /* فحص التحديثات (?_=…) يروح للشبكة دايمًا */
    if(r.mode==='navigate'||/\/$|\.html$/.test(u.pathname)){e.respondWith(netFirst(r));return}
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{put(r,res.clone());return res})));return}
  if(u.host==='www.gstatic.com'&&u.pathname.includes('/firebasejs/'))e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{put(r,res.clone());return res})));
});
