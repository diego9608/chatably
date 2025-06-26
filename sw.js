/**
 * Chatably Service Worker
 * Provides offline functionality and caching for better performance
 */

const CACHE_NAME = 'chatably-v1.0.0';
const CACHE_VERSION = '1.0.0';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/chat-demo.js',
    '/js/feature-toggles.js',
    '/js/conversion-features.js',
    '/js/performance-optimizations.js',
    '/manifest.json',
    // Add critical assets
    '/assets/images/favicon-32x32.png',
    '/assets/images/icon-192x192.png',
    '/assets/images/icon-512x512.png'
];

// Dynamic cache for API responses and other resources
const DYNAMIC_CACHE_NAME = 'chatably-dynamic-v1.0.0';

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

/**
 * Install Event - Cache static resources
 */
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching static resources');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Static resources cached successfully');
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Error caching static resources:', error);
            })
    );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

/**
 * Fetch Event - Handle network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other protocols
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Apply different strategies based on request type
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(url)) {
        event.respondWith(networkFirst(request));
    } else if (isHTMLRequest(request)) {
        event.respondWith(staleWhileRevalidate(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

/**
 * Cache First Strategy
 * Best for static assets that rarely change
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return getOfflineFallback(request);
    }
}

/**
 * Network First Strategy
 * Best for API requests and dynamic content
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return getOfflineFallback(request);
    }
}

/**
 * Stale While Revalidate Strategy
 * Best for HTML pages - serve cached version while updating in background
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Fetch updated version in background
    const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    });
    
    // Return cached version immediately if available
    return cachedResponse || await fetchPromise;
}

/**
 * Helper Functions
 */

function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

function isAPIRequest(url) {
    return url.pathname.includes('/api/') || 
           url.hostname.includes('api.') ||
           url.pathname.includes('/webhook/');
}

function isHTMLRequest(request) {
    return request.headers.get('accept')?.includes('text/html');
}

async function getOfflineFallback(request) {
    // Return appropriate offline fallback
    if (isHTMLRequest(request)) {
        const cache = await caches.open(CACHE_NAME);
        return cache.match('/') || createOfflineResponse();
    }
    
    // For other resources, return a simple offline response
    return createOfflineResponse();
}

function createOfflineResponse() {
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'No hay conexión a internet. Por favor, inténtalo más tarde.'
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
            statusText: 'Service Unavailable'
        }
    );
}

/**
 * Background Sync for Form Submissions
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForms());
    }
});

async function syncContactForms() {
    // Sync any pending contact form submissions
    const pendingForms = await getStoredForms();
    
    for (const form of pendingForms) {
        try {
            await submitForm(form);
            await removeStoredForm(form.id);
            console.log('✅ Form synced successfully');
        } catch (error) {
            console.error('❌ Form sync failed:', error);
        }
    }
}

async function getStoredForms() {
    // Implementation would get forms from IndexedDB
    return [];
}

async function submitForm(formData) {
    // Implementation would submit form to server
    return fetch('/submit-form', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    });
}

async function removeStoredForm(id) {
    // Implementation would remove form from IndexedDB
}

/**
 * Push Notifications
 */
self.addEventListener('push', (event) => {
    const options = {
        body: event.data?.text() || 'Nueva notificación de Chatably',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/badge-72x72.png',
        data: {
            url: '/',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'open',
                title: 'Abrir Chatably'
            },
            {
                action: 'dismiss',
                title: 'Descartar'
            }
        ],
        requireInteraction: false,
        silent: false
    };
    
    event.waitUntil(
        self.registration.showNotification('Chatably', options)
    );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

/**
 * Message Handler for Communication with Main Thread
 */
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_VERSION });
            break;
            
        case 'CLEAN_CACHE':
            cleanCache();
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

async function cleanCache() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(name => caches.delete(name))
    );
    console.log('🧹 All caches cleaned');
}

/**
 * Error Handler
 */
self.addEventListener('error', (error) => {
    console.error('Service Worker error:', error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('🚀 Chatably Service Worker loaded successfully');