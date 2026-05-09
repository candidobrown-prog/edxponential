/**
 * Enterprise-grade caching layer for optimal performance
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.expirations = new Map();
  }

  /**
   * Set cache with TTL
   */
  set(key, value, ttlSeconds = 300) {
    this.cache.set(key, value);
    
    // Clear existing timeout
    if (this.expirations.has(key)) {
      clearTimeout(this.expirations.get(key));
    }

    // Set expiration
    const timeout = setTimeout(() => {
      this.cache.delete(key);
      this.expirations.delete(key);
    }, ttlSeconds * 1000);

    this.expirations.set(key, timeout);
  }

  /**
   * Get from cache
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    this.cache.delete(key);
    if (this.expirations.has(key)) {
      clearTimeout(this.expirations.get(key));
      this.expirations.delete(key);
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.forEach((_, key) => this.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cacheManager = new CacheManager();

/**
 * Memoize expensive function calls with caching
 */
export function memoize(fn, ttlSeconds = 300) {
  return function memoized(...args) {
    const key = `${fn.name}:${JSON.stringify(args)}`;
    
    if (cacheManager.has(key)) {
      return cacheManager.get(key);
    }

    const result = fn.apply(this, args);

    if (result instanceof Promise) {
      return result.then(resolved => {
        cacheManager.set(key, resolved, ttlSeconds);
        return resolved;
      });
    }

    cacheManager.set(key, result, ttlSeconds);
    return result;
  };
}

/**
 * Cache strategy for API responses
 */
export function createApiCacheKey(endpoint, params) {
  return `api:${endpoint}:${JSON.stringify(params || {})}`;
}

/**
 * Get cached API response or fetch fresh
 */
export async function getCachedOrFetch(endpoint, params, fetcher, ttlSeconds = 300) {
  const key = createApiCacheKey(endpoint, params);

  const cached = cacheManager.get(key);
  if (cached) {
    return cached;
  }

  const result = await fetcher();
  cacheManager.set(key, result, ttlSeconds);
  return result;
}

export default {
  cacheManager,
  memoize,
  createApiCacheKey,
  getCachedOrFetch,
};