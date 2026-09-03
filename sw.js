// UBAH NAMA/VERSI CACHE INI SETIAP KALI KAMU MELAKUKAN UPDATE KODE
const CACHE_NAME = 'laporan-toko-v5.0';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// 1. Install Service Worker & Paksa Aktif Langsung (Skip Waiting)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Hapus Cache Lama Secara Otomatis
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // Hapus cache versi sebelumnya
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Network First Strategy (Selalu Ambil Kode Terbaru dari Internet First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            })
            .catch(() => caches.match(event.request))
    );
});
