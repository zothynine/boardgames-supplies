const CACHE_NAME = 'v1.0.9a';
const urlsToCache = [
  '/',
  '/build/bundle.css',
  '/build/bundle.js'
];

self.addEventListener('install', event => {
  console.log("Installing service worker.");
  self.skipWaiting();
  
  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => {
      cache.keys().then( requests => { console.log(requests);} );
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Activating service worker.');

  console.log('Deleting old caches');
  event.waitUntil(
    self.clients.claim(),
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (CACHE_NAME.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

/**
 * Intercept requests and serve from cache falling back to networlk fetch
 */
self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);

  const isLocalHost = event.request.url.indexOf('localhost') !== -1;

  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response && !isLocalHost) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {

        // TODO 5 - Respond with custom 404 page
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });

    }).catch(error => {

      // TODO 6 - Respond with custom offline page

    })
  );
});


// Run in cosole to remove service worker

// navigator.serviceWorker.getRegistrations().then(function(registrations) {
//   for(let registration of registrations) {
//    registration.unregister()
//  } })
