self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

// Optionnel : gestion du fetch pour future extension
self.addEventListener('fetch', event => {
  // Ici, tu peux ajouter du cache si besoin
}); 