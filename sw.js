// CIC Reportes – permite instalar la app y abrirla sin señal.
var CACHE = 'cic-reportes-v1';
var ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (r) {
    var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); return r;
  }).catch(function () { return caches.match(req).then(function (r) { return r || caches.match('./index.html'); }); }));
});
