/**
 * Performance Optimization Utilities
 * Optimized for 4GB RAM devices
 */

// Debounce function for expensive operations
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy load images
export const lazyLoadImage = (img) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove('lazy');
          observer.unobserve(image);
        }
      });
    });
    observer.observe(img);
  } else {
    // Fallback for older browsers
    img.src = img.dataset.src;
  }
};

// Memory cleanup
export const cleanupMemory = () => {
  // Clear unused caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old') || name.includes('temp')) {
          caches.delete(name);
        }
      });
    });
  }
  
  // Force garbage collection (if available)
  if (window.gc) {
    window.gc();
  }
};

// Check device memory
export const getDeviceMemory = () => {
  if (navigator.deviceMemory) {
    return navigator.deviceMemory; // Returns GB
  }
  return 4; // Default assumption
};

// Check if low-end device
export const isLowEndDevice = () => {
  const memory = getDeviceMemory();
  const cores = navigator.hardwareConcurrency || 2;
  
  return memory <= 4 || cores <= 2;
};

// Optimize for low-end devices
export const optimizeForDevice = () => {
  if (isLowEndDevice()) {
    // Reduce animation complexity
    document.documentElement.classList.add('low-end-device');
    
    // Disable heavy animations
    const style = document.createElement('style');
    style.textContent = `
      .low-end-device * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
      }
      .low-end-device .heavy-animation {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Preload critical resources
export const preloadCriticalResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.type;
    link.href = resource.url;
    document.head.appendChild(link);
  });
};

// Virtual scrolling helper
export const getVisibleItems = (items, scrollTop, containerHeight, itemHeight) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  
  return {
    visibleItems: items.slice(startIndex, endIndex + 1),
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight
  };
};

// Request idle callback wrapper
export const runWhenIdle = (callback) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(callback, 1);
  }
};

// Batch DOM updates
export const batchDOMUpdates = (updates) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Monitor performance
export const monitorPerformance = () => {
  if ('performance' in window && 'memory' in performance) {
    const memory = performance.memory;
    return {
      usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
      percentage: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%'
    };
  }
  return null;
};

// Clear component cache
export const clearComponentCache = () => {
  // Clear React cache if needed
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE = () => {};
  }
};

// Optimize images
export const optimizeImage = (url, width = 800) => {
  // Add image optimization parameters
  if (url.includes('unsplash.com')) {
    return `${url}?w=${width}&q=75&auto=format`;
  }
  return url;
};

// Prefetch on hover
export const prefetchOnHover = (url) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Cache API helper
export const cacheResource = async (cacheName, url) => {
  if ('caches' in window) {
    const cache = await caches.open(cacheName);
    await cache.add(url);
  }
};

// Get cached resource
export const getCachedResource = async (cacheName, url) => {
  if ('caches' in window) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(url);
    return response;
  }
  return null;
};

// Measure component render time
export const measureRenderTime = (componentName, callback) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
};

// Detect slow network
export const isSlowNetwork = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' ||
           connection.saveData;
  }
  return false;
};

// Adaptive loading strategy
export const getLoadingStrategy = () => {
  const isLowEnd = isLowEndDevice();
  const isSlow = isSlowNetwork();
  
  if (isLowEnd && isSlow) {
    return 'minimal'; // Load only essential content
  } else if (isLowEnd || isSlow) {
    return 'reduced'; // Load with reduced quality
  }
  return 'full'; // Load everything
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Optimize for device
  optimizeForDevice();
  
  // Monitor memory usage
  if (isLowEndDevice()) {
    setInterval(() => {
      const memoryInfo = monitorPerformance();
      if (memoryInfo) {
        const usage = parseFloat(memoryInfo.percentage);
        if (usage > 80) {
          console.warn('High memory usage detected:', memoryInfo);
          cleanupMemory();
        }
      }
    }, 30000); // Check every 30 seconds
  }
  
  // Add performance observer
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry.name, entry.duration);
        }
      }
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }
};

export default {
  debounce,
  throttle,
  lazyLoadImage,
  cleanupMemory,
  getDeviceMemory,
  isLowEndDevice,
  optimizeForDevice,
  preloadCriticalResources,
  getVisibleItems,
  runWhenIdle,
  batchDOMUpdates,
  monitorPerformance,
  clearComponentCache,
  optimizeImage,
  prefetchOnHover,
  registerServiceWorker,
  cacheResource,
  getCachedResource,
  measureRenderTime,
  isSlowNetwork,
  getLoadingStrategy,
  initPerformanceOptimizations
};
