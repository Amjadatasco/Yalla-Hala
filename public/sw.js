const CACHE_NAME = "yallahala-cache-v1";
const urlsToCache = [
  "/manifest.json",
  "/logo.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // استراتيجية الشبكة أولاً مع الرجوع للكاش عند عدم توفر الإنترنت (تضمن حداثة الأسعار والحجوزات دائماً)
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
