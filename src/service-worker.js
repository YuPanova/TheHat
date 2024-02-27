const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll([
          '/',
          '/index.html',
          'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          '/src/offline.html',
          '/src/assets/images/the-hat.png'
       ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) { // && key !== CACHE_DYNAMIC_NAME
            return caches.delete(key);
          }
        }));
      })
  );


});

//Cache with network fallback strategy with routing
self.addEventListener('fetch', function(event) {

  ///////////// only for testing POST request
  if (event.request.url === 'https://api.languagetoolplus.com/v2/check'){
    console.log('from fetch',event.request)
  }

  caches.open(CACHE_DYNAMIC_NAME)
    .then(function (cache){
      return cache.keys().then(requests => {
        requests.forEach(request => {
          if (request.url === 'https://api.languagetoolplus.com/v2/check'
          && event.request.url === 'https://api.languagetoolplus.com/v2/check'){
            console.log(`from cache: ${request.url}`, request);

            for (const key in request) {
                console.log(key,': ', request[key],' --- ', event.request[key]);
            }

            return request
          }
        });
      });
    })
//////////////////
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {

        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {

                  // todo exclude, because we caching them in webWorker
                  if (!event.request.url.includes('https://images.unsplash.com')){
                    cache.put(event.request.url, res.clone());
                  }

                  return res;
                });
            })
            .catch(function() {
              return caches.open(CACHE_STATIC_NAME)
                .then(function (cache){
                  return cache.match('/src/offline.html')
                })
            });
        }
      })
  );
});
