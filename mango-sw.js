const OFFLINE = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mango — offline</title><style>body{background:#212121;color:#eee;font:18px system-ui;text-align:center;padding:20vh 24px}h1{color:#ffbe55}button{font:inherit;padding:12px 24px;border:0;border-radius:12px;background:#ffbe55}</style><h1>🥭 Mango</h1><p>You’re offline. Reconnect to open Mango and your messages.</p><button onclick="location.reload()">Try again</button></html>`;
self.addEventListener('install', event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate' || event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(fetch(event.request).catch(() => new Response(OFFLINE, {
    status:503,headers:{'Content-Type':'text/html; charset=utf-8'}
  })));
});
