// Performance optimization utilities for high-traffic handling

// Debounce function for performance optimization
export function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function for scroll and resize events
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memory management utilities
export const MemoryManager = {
  // Clear unused cache entries
  clearCache() {
    try {
      // Clear service worker cache if available
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('old') || name.includes('v1')) {
              caches.delete(name);
            }
          });
        });
      }
    } catch (error) {
      console.warn('Cache clearing failed:', error);
    }
  },

  // Monitor memory usage
  checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usedPercent > 80) {
        console.warn('High memory usage detected:', usedPercent.toFixed(2) + '%');
        this.clearCache();
        
        // Force garbage collection if available (Chrome dev tools)
        if (window.gc && typeof window.gc === 'function') {
          window.gc();
        }
      }
      
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: usedPercent
      };
    }
    return null;
  },

  // Auto memory management
  startMonitoring() {
    // Check memory every 30 seconds
    return setInterval(() => {
      this.checkMemoryUsage();
    }, 30000);
  }
};

// Performance monitoring
export const PerformanceMonitor = {
  // Track page load time
  trackPageLoad() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        console.log('Page load time:', loadTime, 'ms');
        return loadTime;
      }
    }
    return null;
  },

  // Track component render time
  trackRender(componentName, startTime) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // 60fps = 16.67ms per frame
      console.warn(`Slow render detected in ${componentName}:`, renderTime, 'ms');
    }
    
    return renderTime;
  },

  // Track route change performance
  trackRouteChange(route) {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const changeTime = endTime - startTime;
      console.log(`Route change to ${route}:`, changeTime, 'ms');
      return changeTime;
    };
  }
};

// Image optimization utilities
export const ImageOptimizer = {
  // Lazy load images with Intersection Observer
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Apply to all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      return imageObserver;
    }
  },

  // Preload critical images
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }
};

// Resource preloading for performance
export const ResourcePreloader = {
  // Preload critical CSS
  preloadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  },

  // Preload JavaScript modules
  preloadJS(href) {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = href;
    document.head.appendChild(link);
  },

  // Preload fonts
  preloadFont(href, type = 'font/woff2') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = type;
    link.crossOrigin = 'anonymous';
    link.href = href;
    document.head.appendChild(link);
  }
};

// High traffic optimization
export const TrafficOptimizer = {
  // Implement client-side rate limiting
  rateLimiter: new Map(),
  
  checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.rateLimiter.has(key)) {
      this.rateLimiter.set(key, []);
    }
    
    const requests = this.rateLimiter.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.rateLimiter.set(key, validRequests);
    return true;
  },

  // Optimize for high concurrent users
  optimizeForHighTraffic() {
    // Reduce animation complexity during high load
    const highLoad = this.detectHighLoad();
    
    if (highLoad) {
      // Disable non-essential animations
      document.documentElement.style.setProperty('--animation-duration', '0s');
      
      // Reduce update frequency
      document.documentElement.classList.add('high-traffic-mode');
    }
    
    return highLoad;
  },

  // Detect high system load
  detectHighLoad() {
    if ('memory' in performance) {
      const memory = performance.memory;
      const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      // Also check if page is running slowly
      const entries = performance.getEntriesByType('measure');
      const slowOperations = entries.filter(entry => entry.duration > 100);
      
      return memoryUsage > 70 || slowOperations.length > 5;
    }
    
    return false;
  }
};

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  // Start memory monitoring
  const memoryInterval = MemoryManager.startMonitoring();
  
  // Setup lazy loading
  ImageOptimizer.setupLazyLoading();
  
  // Preload critical resources
  ResourcePreloader.preloadFont('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  // Optimize for high traffic
  TrafficOptimizer.optimizeForHighTraffic();
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(memoryInterval);
  });
  
  return {
    memoryInterval,
    cleanup: () => clearInterval(memoryInterval)
  };
}