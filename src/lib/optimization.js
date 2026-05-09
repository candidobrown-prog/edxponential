/**
 * Performance optimization utilities
 * Implements code splitting, lazy loading, and asset optimization strategies
 */

/**
 * Preload critical assets
 */
export function preloadCriticalAssets() {
  if (typeof window === 'undefined') return;

  const criticalAssets = [
    '/fonts/inter.woff2',
    '/images/logo.svg',
    '/images/eddy-bg.svg',
  ];

  criticalAssets.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = href.endsWith('.woff2') ? 'font' : 'image';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImages() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px',
  });

  images.forEach(img => imageObserver.observe(img));
}

/**
 * Request idle callback with fallback
 */
export function scheduleIdleCallback(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * Debounce function for expensive operations
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function for frequent events
 */
export function throttle(fn, limit = 100) {
  let lastTime = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastTime >= limit) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * Batch DOM updates
 */
export function batchDOMUpdates(updates) {
  if (typeof window === 'undefined') return;

  const fragment = document.createDocumentFragment();
  updates.forEach(update => update(fragment));
  return fragment;
}

/**
 * Minimize reflows with computed style batching
 */
export function getComputedStyles(elements) {
  // Read all styles first
  const styles = elements.map(el => window.getComputedStyle(el));
  // Then modify (if needed)
  return styles;
}

/**
 * Virtual scrolling for large lists
 */
export class VirtualScroller {
  constructor(container, itemHeight, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.visibleRange = { start: 0, end: 0 };
  }

  calculateVisibleRange(scrollTop, containerHeight) {
    const start = Math.floor(scrollTop / this.itemHeight);
    const end = Math.ceil((scrollTop + containerHeight) / this.itemHeight);
    return { start, end };
  }

  update(totalItems, scrollTop, containerHeight) {
    const newRange = this.calculateVisibleRange(scrollTop, containerHeight);
    
    if (newRange.start !== this.visibleRange.start || newRange.end !== this.visibleRange.end) {
      this.visibleRange = newRange;
      this.render(totalItems);
    }
  }

  render(totalItems) {
    // Render only visible items
    const visibleItems = [];
    for (let i = this.visibleRange.start; i < Math.min(this.visibleRange.end, totalItems); i++) {
      visibleItems.push(this.renderItem(i));
    }
    return visibleItems;
  }
}

/**
 * Progressive image loading
 */
export function createProgressiveImage(lowResSrc, highResSrc) {
  const img = document.createElement('img');
  
  // Load low-res first
  img.src = lowResSrc;
  img.style.filter = 'blur(10px)';
  
  // Load high-res in background
  const highResImg = new Image();
  highResImg.src = highResSrc;
  highResImg.onload = () => {
    img.src = highResSrc;
    img.style.filter = 'blur(0px)';
  };
  
  return img;
}

/**
 * Service worker registration for offline support
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.log('Service Worker registration failed:', err);
  });
}

export default {
  preloadCriticalAssets,
  lazyLoadImages,
  scheduleIdleCallback,
  debounce,
  throttle,
  batchDOMUpdates,
  getComputedStyles,
  VirtualScroller,
  createProgressiveImage,
  registerServiceWorker,
};