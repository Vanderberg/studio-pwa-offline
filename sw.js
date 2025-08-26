const CACHE = 'studio-alfa-v6.6.2';
const ASSETS = [
  './','./index.html','./manifest.json','./src/css/styles.css','./src/js/main.js','./src/js/db.js','./src/js/logo.js','./src/js/ui.js','./src/js/alunos.js','./src/js/treinos.js',
  './assets/icons/icon-192.png','./assets/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k))))); });
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return resp;
  }).catch(() => caches.match('./'))));
});
