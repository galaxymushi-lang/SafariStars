const CACHE = "safari-stars-v10";
const FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./lessons.js",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./version.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Network-first for HTML and version.json (always fresh)
  if (url.pathname.endsWith("/") || url.pathname.endsWith("index.html") || url.pathname.endsWith("version.json") || url.pathname.endsWith("app.js")) {
    e.respondWith(
      fetch(e.request).then((r) => {
        const clone = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first for static assets (CSS, images, lessons)
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((resp) => {
      const clone = resp.clone();
      caches.open(CACHE).then((c) => c.put(e.request, clone));
      return resp;
    }))
  );
});
