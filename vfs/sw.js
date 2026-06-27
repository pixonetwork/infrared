// sw.js - Service Worker Thread
const files = new Map();
const defaultMimes = { 'js': 'text/javascript', 'css': 'text/css', 'html': 'text/html' };

self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const filename = url.pathname.split('/').pop().split('?')[0];

    // Intercept matching virtual files from local memory
    if (files.has(filename)) {
        const content = files.get(filename);
        const ext = filename.split('.').pop().toLowerCase();
        
        event.respondWith(new Response(content, {
            status: 200,
            headers: { 'Content-Type': defaultMimes[ext] || 'application/octet-stream' }
        }));
    }
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VFS_WRITE') {
        files.set(event.data.filename, event.data.content);
    }
});