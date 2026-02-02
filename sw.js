// Service Worker for The House of Humanity
// Provides offline functionality and caching for better performance

const CACHE_NAME = 'thoh-v1.3';

// Cache only known-present, high-value assets.
// Avoid caching missing URLs because cache.addAll() fails the install if any request 404s.
const urlsToCache = [
    '/',
    '/index.html',
    '/404.html',
    '/styles.css',
    '/script.js',
    '/site.webmanifest',
    '/images/THOHlogo.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await Promise.all(
                urlsToCache.map((url) => cache.add(url).catch(() => undefined))
            );
            self.skipWaiting();
        })()
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Only handle safe, cacheable requests.
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    // For navigations, try network first (fresh content), then fall back.
    if (req.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const networkResp = await fetch(req);
                    const cache = await caches.open(CACHE_NAME);
                    cache.put('/index.html', networkResp.clone()).catch(() => undefined);
                    return networkResp;
                } catch (_) {
                    const cached = await caches.match('/index.html');
                    return cached || caches.match('/404.html');
                }
            })()
        );
        return;
    }

    // For static assets, use cache-first.
    event.respondWith(
        (async () => {
            const cached = await caches.match(req);
            if (cached) return cached;
            const resp = await fetch(req);
            // Cache successful same-origin responses.
            if (resp && resp.status === 200) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(req, resp.clone()).catch(() => undefined);
            }
            return resp;
        })()
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map((name) => (name !== CACHE_NAME ? caches.delete(name) : undefined))
            );
            self.clients.claim();
        })()
    );
});
