/**
 * まさてゃんカメコ service worker
 * GitHub Pages のサブパス(/kameko/)でも動くよう、すべて sw.js 自身のURLから基準を作る。
 */
const CACHE = 'kameko-cache-v4';
const BASE = new URL('./', self.location.href);
const SHELL = [
  BASE.href,
  `${BASE.href}manifest.json`,
  `${BASE.href}icons/icon-192.png`,
  `${BASE.href}icons/icon-512.png`,
  `${BASE.href}icons/apple-touch-icon.png`,
  `${BASE.href}icons/maskable-512.png`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Firestore / 認証などの外部通信はそのまま通す（キャッシュしない）
  if (url.origin !== self.location.origin) return;

  // 画面遷移: ネットワーク優先、オフライン時はキャッシュしたアプリ本体
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(BASE.href, copy));
          return response;
        })
        .catch(() => caches.match(BASE.href).then((cached) => cached || Response.error())),
    );
    return;
  }

  if (!url.pathname.startsWith(BASE.pathname)) return;

  // ビルド済みの静的ファイル: キャッシュ優先（ファイル名にハッシュが付く）
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
