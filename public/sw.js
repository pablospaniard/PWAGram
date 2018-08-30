const CACHE_STATIC_NAME = 'static-v12'
let CACHE_DYNAMIC_NAME = 'dynamic-v2'

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing service worker...', event)
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function(cache) {
      console.log('[Service Worker] Precaching App Shell')
      cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/promise.js', //old browsers
        '/src/js/fetch.js', //old browsers
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
      ])
    })
  )
})

// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName).then(function(cache) {
//     return cache.keys().then(function(keys) {
//       if (keys.length > maxItems) {
//         cache.delete(keys[0]).then(trimCache(cacheName, maxItems))
//       }
//     })
//   })
// }

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating service worker...', event)
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function(event) {
  const url = 'https://httpbin.org/get'
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      //Network strategy
      caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
        return fetch(event.request).then(function(res) {
          // trimCache(CACHE_DYNAMIC_NAME, 3)
          cache.put(event.request, res.clone())
          return res
        })
      })
    )
  } else {
    event.respondWith(
      //Network Offline and Cache strategy
      caches.match(event.request).then(function(response) {
        if (response) {
          return response
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
                // trimCache(CACHE_DYNAMIC_NAME, 3)
                cache.put(event.request.url, res.clone())
                return res
              })
            })
            .catch(function(err) {
              return caches.open(CACHE_STATIC_NAME).then(function(cache) {
                if (event.request.headers.get('accept').includes('text/html')) {
                  return cache.match('offline.html')
                }
              })
            })
        }
      })
    )
  }
})

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       if (response) {
//         return response
//       } else {
//         return fetch(event.request)
//           .then(function(res) {
//             return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
//               cache.put(event.request.url, res.clone())
//               return res
//             })
//           })
//           .catch(function(err) {
//             return caches.open(CACHE_STATIC_NAME).then(function(cache) {
//               return cache.match('offline.html')
//             })
//           })
//       }
//     })
//   )
// })

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       if (response) {
//         return response
//       } else {
//         return fetch(event.request)
//           .then(function(res) {
//             return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
//               cache.put(event.request.url, res.clone())
//               return res
//             })
//           })
//           .catch(function(err) {})
//       }
//     })
//   )
// })

//Cache Only srategy
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//   )
// })

//Network Only srategy
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//   )
// })
