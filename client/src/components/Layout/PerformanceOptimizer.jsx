import React, { useEffect, useState, useCallback } from 'react';
import { throttle, debounce } from '../../utils/performance';

// High-performance image component with lazy loading
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false,
  onLoad,
  onError 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px 0px' }
    );

    const imgElement = document.querySelector(`[data-src="${src}"]`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  if (hasError) {
    return (
      <div 
        className={`bg-slate-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <i className="fas fa-image text-slate-600 text-2xl"></i>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <i className="fas fa-image text-slate-600 text-xl"></i>
        </div>
      )}
      
      {(isInView || priority) && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          data-src={src}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
};

// Performance-optimized scroll handler
export const useOptimizedScroll = (callback, deps = []) => {
  useEffect(() => {
    const throttledCallback = throttle(callback, 16); // 60fps
    
    window.addEventListener('scroll', throttledCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledCallback);
    };
  }, deps);
};

// Optimized resize handler
export const useOptimizedResize = (callback, deps = []) => {
  useEffect(() => {
    const debouncedCallback = debounce(callback, 250);
    
    window.addEventListener('resize', debouncedCallback);
    
    return () => {
      window.removeEventListener('resize', debouncedCallback);
    };
  }, deps);
};

// Memory-efficient list virtualization
export const VirtualizedList = ({ 
  items, 
  renderItem, 
  itemHeight = 60, 
  containerHeight = 400,
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  
  const handleScroll = useCallback(
    throttle((e) => {
      setScrollTop(e.target.scrollTop);
    }, 16),
    []
  );

  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => 
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
};

// Component for detecting high traffic load
export const TrafficLoadDetector = ({ children, onHighLoad }) => {
  const [isHighLoad, setIsHighLoad] = useState(false);

  useEffect(() => {
    const checkLoad = () => {
      // Check memory usage
      if ('memory' in performance) {
        const memory = performance.memory;
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        // Check frame rate
        let frameCount = 0;
        const startTime = performance.now();
        
        const countFrames = () => {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            const fps = frameCount;
            const highLoad = usagePercent > 70 || fps < 30;
            
            if (highLoad !== isHighLoad) {
              setIsHighLoad(highLoad);
              onHighLoad?.(highLoad);
            }
          }
        };
        
        requestAnimationFrame(countFrames);
      }
    };

    const interval = setInterval(checkLoad, 5000);
    return () => clearInterval(interval);
  }, [isHighLoad, onHighLoad]);

  return (
    <div className={isHighLoad ? 'high-traffic-mode' : ''}>
      {children}
    </div>
  );
};

// Optimized animation component
export const OptimizedAnimation = ({ 
  children, 
  className = '', 
  duration = 0.3, 
  delay = 0,
  disabled = false 
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(!disabled);

  useEffect(() => {
    // Disable animations on low-end devices
    const checkPerformance = () => {
      if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
        setShouldAnimate(false);
      }
      
      if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
        setShouldAnimate(false);
      }
    };

    checkPerformance();
  }, []);

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={`transition-all ease-out ${className}`}
      style={{ 
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
};

export default {
  OptimizedImage,
  useOptimizedScroll,
  useOptimizedResize,
  VirtualizedList,
  TrafficLoadDetector,
  OptimizedAnimation
};