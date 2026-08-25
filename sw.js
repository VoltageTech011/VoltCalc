// sw.js
const CACHE_NAME = 'voltcalc-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/responsive.css',
  './css/themes.css',
  './css/calculator.css',
  './css/history.css',
  './css/converter.css',
  './css/graph.css',
  './css/modals.css',
  './js/app.js',
  './js/calculator/parser.js',
  './js/calculator/scientific.js',
  './js/calculator/memory.js',
  './js/history/manager.js',
  './js/history/search.js',
  './js/history/export.js',
  './js/history/import.js',
  './js/converter/units.js',
  './js/converter/conversion.js',
  './js/graph/renderer.js',
  './js/formulas/mathematics.js',
  './js/ui/navigation.js',
  './js/ui/toast.js',
  './js/ui/theme.js',
  './assets/icons/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
