// src/lib/performanceUtils.js
/**
 * Performance Optimization Utilities
 * Provides utilities for lazy loading, code splitting, and performance monitoring
 */

import logger from './logger';

// ==================== LAZY LOADING ====================

/**
 * Lazy load a component with retry logic
 * @param {Function} importFunc - Dynamic import function
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 */
export const lazyWithRetry = (importFunc, retries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    importFunc()
      .then(resolve)
      .catch((error) => {
        if (retries === 0) {
          logger.error('Lazy load failed after retries', { error: error.message });
          reject(error);
          return;
        }

        logger.warn(`Lazy load failed, retrying... (${retries} attempts left)`);

        setTimeout(() => {
          lazyWithRetry(importFunc, retries - 1, delay).then(resolve, reject);
        }, delay);
      });
  });
};

/**
 * Create a lazy-loaded component with loading fallback
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Configuration options
 */
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    fallback = null,
    preload = false,
    onError = null,
  } = options;

  const LazyComponent = React.lazy(() => lazyWithRetry(importFunc));

  // Preload if requested
  if (preload) {
    importFunc().catch(error => {
      logger.warn('Preload failed', { error: error.message });
    });
  }

  return LazyComponent;
};

// ==================== BUNDLE OPTIMIZATION ====================

/**
 * Check if module should be loaded based on viewport
 * @param {Element} element - DOM element to observe
 * @param {Function} callback - Callback when element is visible
 * @param {Object} options - IntersectionObserver options
 */
export const loadOnVisible = (element, callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    }, defaultOptions);

    observer.observe(element);
    return () => observer.disconnect();
  } else {
    // Fallback for browsers without IntersectionObserver
    callback();
    return () => {};
  }
};

/**
 * Load script dynamically
 * @param {string} src - Script source URL
 * @param {Object} attributes - Additional script attributes
 */
export const loadScript = (src, attributes = {}) => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve(existingScript);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    // Add custom attributes
    Object.keys(attributes).forEach(key => {
      script.setAttribute(key, attributes[key]);
    });

    script.onload = () => {
      logger.info('Script loaded successfully', { src });
      resolve(script);
    };

    script.onerror = (error) => {
      logger.error('Script load failed', { src, error: error.message });
      reject(error);
    };

    document.body.appendChild(script);
  });
};

/**
 * Prefetch resources for faster navigation
 * @param {string} href - Resource URL
 * @param {string} as - Resource type
 */
export const prefetchResource = (href, as = 'fetch') => {
  if ('HTMLLinkElement' in window && 'relList' in HTMLLinkElement.prototype) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;

    document.head.appendChild(link);
    logger.debug('Resource prefetched', { href, as });
  }
};

// ==================== PERFORMANCE MONITORING ====================

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startMeasure(name) {
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name) {
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];

        this.metrics.set(name, {
          duration: measure.duration,
          timestamp: Date.now(),
        });

        logger.debug(`Performance: ${name}`, { duration: `${measure.duration.toFixed(2)}ms` });

        // Warn for slow operations
        if (measure.duration > 100) {
          logger.warn(`Slow operation detected: ${name}`, { duration: `${measure.duration.toFixed(2)}ms` });
        }

        // Clean up
        performance.clearMarks(`${name}-start`);
        performance.clearMarks(`${name}-end`);
        performance.clearMeasures(name);

        return measure.duration;
      } catch (e) {
        logger.warn('Performance measurement failed', { name, error: e.message });
      }
    }
    return null;
  }

  getMetrics() {
    return Array.from(this.metrics.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React Hook for measuring component performance
 * @param {string} componentName - Name of the component
 */
export const usePerformanceMonitor = (componentName) => {
  React.useEffect(() => {
    performanceMonitor.startMeasure(componentName);

    return () => {
      performanceMonitor.endMeasure(componentName);
    };
  }, [componentName]);
};

// ==================== IMAGE OPTIMIZATION ====================

/**
 * Lazy load images
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source
 * @param {string} placeholder - Placeholder image
 */
export const lazyLoadImage = (img, src, placeholder = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1 1\'%3E%3C/svg%3E') => {
  img.src = placeholder;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.add('loaded');
          observer.disconnect();
        }
      });
    });

    observer.observe(img);
  } else {
    img.src = src;
  }
};

// ==================== DEBOUNCE & THROTTLE ====================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @param {boolean} immediate - Execute immediately
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;

  return function executedFunction(...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// ==================== MEMORY MANAGEMENT ====================

/**
 * Cleanup event listeners and timers
 */
export class CleanupManager {
  constructor() {
    this.listeners = [];
    this.timers = [];
    this.observers = [];
  }

  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    this.listeners.push({ element, event, handler, options });
  }

  setTimeout(func, delay) {
    const timer = setTimeout(func, delay);
    this.timers.push(timer);
    return timer;
  }

  setInterval(func, interval) {
    const timer = setInterval(func, interval);
    this.timers.push(timer);
    return timer;
  }

  observe(observer, target, options) {
    observer.observe(target, options);
    this.observers.push({ observer, target });
  }

  cleanup() {
    // Remove event listeners
    this.listeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });

    // Clear timers
    this.timers.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });

    // Disconnect observers
    this.observers.forEach(({ observer }) => {
      observer.disconnect();
    });

    // Reset arrays
    this.listeners = [];
    this.timers = [];
    this.observers = [];

    logger.debug('Cleanup completed');
  }
}

// ==================== WEB VITALS ====================

/**
 * Report Web Vitals (Core Web Vitals)
 */
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then((webVitals) => {
        // Check if functions exist before calling them
        if (webVitals.getCLS) webVitals.getCLS(onPerfEntry);
        if (webVitals.getFID) webVitals.getFID(onPerfEntry);
        if (webVitals.getFCP) webVitals.getFCP(onPerfEntry);
        if (webVitals.getLCP) webVitals.getLCP(onPerfEntry);
        if (webVitals.getTTFB) webVitals.getTTFB(onPerfEntry);
      })
      .catch(() => {
        // Silently fail if web-vitals is not installed
        // This is not critical for app functionality
      });
  }
};

// ==================== EXPORT ====================

export default {
  lazyWithRetry,
  createLazyComponent,
  loadOnVisible,
  loadScript,
  prefetchResource,
  PerformanceMonitor,
  performanceMonitor,
  usePerformanceMonitor,
  lazyLoadImage,
  debounce,
  throttle,
  CleanupManager,
  reportWebVitals,
};
