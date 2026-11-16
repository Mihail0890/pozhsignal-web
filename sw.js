importScripts('web-config.js');
try { importScripts('sw-fcm.js'); } catch (e) {}
const CACHE = 'pozh-1794861288';
const SHELL = ['./', 'index.html', 'supabase.js', 'xlsx.full.min.js', 'manifest.webmanifest', 'icon-192.png', 'icon-180.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k.indexOf('pozh-') === 0).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then((hit) => {
    const net = fetch(r).then((res) => {
      if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
