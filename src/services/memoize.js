export default function memoize(fn) {
  const cache = new Map();

  const memoized = (key) => {
    if (!cache.has(key)) {
      cache.set(key, fn(key));
    }

    return cache.get(key);
  };

  memoized.cache = cache;
  return memoized;
}
