const CACHE_NAME = 'geoguesser-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.webmanifest',
  '/data/photos.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
