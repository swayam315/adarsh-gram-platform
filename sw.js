// Service Worker for PM-AJAY Village Portal
const CACHE_NAME = 'pm-ajay-village-portal-v2.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './dashboard.js',
    './forms.js',
    './map.js',
    './manifest.json'
];

// Install event - cache all essential files
self.addEventListener('install', function(event) {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('All resources cached successfully');
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.log('Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }
                
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request).then(function(response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    var responseToCache = response.clone();

                    // Add to cache for future visits
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(function(error) {
                console.log('Fetch failed; returning offline page:', error);
                // You could return a custom offline page here
            })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', function(event) {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-form-sync') {
        event.waitUntil(
            // Process any pending form submissions
            processPendingSubmissions()
        );
    }
});

// Process pending form submissions when back online
function processPendingSubmissions() {
    // This would process any forms that were submitted while offline
    console.log('Processing pending form submissions...');
    
    // In a real app, you would:
    // 1. Get pending submissions from IndexedDB
    // 2. Send them to the server
    // 3. Clear them from the local database
    
    return Promise.resolve();
}

// Push notification support
self.addEventListener('push', function(event) {
    console.log('Push notification received');
    
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'New update from PM-AJAY Portal',
        icon: './assets/icons/icon-192.png',
        badge: './assets/icons/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || './'
        },
        actions: [
            {
                action: 'view',
                title: 'View Details'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'PM-AJAY Update', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked');
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else {
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

console.log('Service Worker loaded successfully');
