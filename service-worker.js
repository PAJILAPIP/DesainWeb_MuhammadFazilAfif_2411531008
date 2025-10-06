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
        // Cache hit - return response dari cache
        if (response) {
          return response;
        }

        // Clone request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Cek validitas: pastikan response berhasil (status 200) dan dari domain sendiri ('basic')
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response dan simpan ke cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // >>> INI PERBAIKAN UTAMA: Cegah TypeError <<<
          // Hanya kembalikan offline.html jika permintaan adalah navigasi (HTML)
          if (event.request.mode === 'navigate') {
            return caches.match('./offline.html');
          }
           
          // Untuk aset (script, gambar, dll.) yang gagal, kembalikan Response kosong/gagal yang valid.
          // Ini menyelesaikan 'Failed to convert value to Response'.
          return new Response(null, { status: 404, statusText: 'Not Found' });
        });
      })
  );
});