const CACHE_NAME = 'Wesbsite';
const urlsToCache = [
  './',
  'index.html',
  'contact.html',
  'about.html',
  'offline.html',
  'style.css',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png'
];

// Install event - cache aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - strategi Cache First dengan Fallback ke Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 1. Cache hit
        if (response) {
          return response;
        }

        // 2. Lakukan Fetch
        return fetch(event.request.clone()) // Clone request
          .then((response) => {
            // Cek validitas dan simpan ke cache jika 'basic' (aset dari domain sendiri)
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            // 3. PENANGANAN FALLBACK YANG BENAR
            // Hanya kembalikan offline.html untuk permintaan halaman (navigasi)
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html'); // Pastikan ini jalur yang benar
            }
             // Untuk aset (script, gambar) yang gagal, kembalikan Response kegagalan
             // INI MENCEGAH TypeError: Failed to convert value to 'Response'
             return new Response(null, { status: 404, statusText: 'Not Found' });
          });
      })
  );
});