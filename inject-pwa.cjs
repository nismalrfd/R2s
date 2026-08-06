const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\nismal\\Downloads\\web for r2s';

// 1. Create manifest.json
const manifest = {
  "name": "R2s Realtors Network",
  "short_name": "R2s",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "description": "Premium real estate networking and property management platform.",
  "icons": [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Placeholder.png/512px-Placeholder.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Placeholder.png/512px-Placeholder.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
};
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));

// 2. Create sw.js
const sw = `
const CACHE_NAME = 'r2s-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/verify.html',
  '/signup.html',
  '/property-detail.html',
  '/add-property.html',
  '/profile.html',
  '/edit-profile.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
`;
fs.writeFileSync(path.join(dir, 'sw.js'), sw);

// 3. PWA Meta Tags & App Physics CSS
const pwaHeadTags = `
  <!-- PWA Meta Tags -->
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="R2s Realtors" />
  
  <!-- Premium Mobile App CSS Physics -->
  <style>
    /* Prevent text selection to feel like native app */
    body, h1, h2, h3, h4, p, span, div, button, a, i {
      -webkit-user-select: none;
      user-select: none;
    }
    /* Allow text selection in inputs */
    input, textarea {
      -webkit-user-select: text;
      user-select: text;
    }
    /* Remove blue tap highlight */
    * {
      -webkit-tap-highlight-color: transparent;
    }
    /* Prevent bounce on scroll for rigid native feel */
    body {
      overscroll-behavior-y: none;
    }
  </style>
`;

const pwaScript = `
  <!-- PWA Service Worker Registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration.scope);
        }).catch(err => {
          console.log('SW registration failed: ', err);
        });
      });
    }
  </script>
`;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Inject into Head
  if (!content.includes('PWA Meta Tags')) {
    content = content.replace(/<\/head>/, `${pwaHeadTags}\n</head>`);
  }
  
  // Inject before Body close
  if (!content.includes('PWA Service Worker Registration')) {
    content = content.replace(/<\/body>/, `${pwaScript}\n</body>`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('PWA injection complete.');
