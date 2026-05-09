import { useEffect, useRef } from 'react';
import { performanceMonitor } from '@/lib/performance';

/**
 * Hook for monitoring component and page performance
 */
export function usePerformanceMonitoring(pageName) {
  const pageLoadRef = useRef(false);

  useEffect(() => {
    if (!pageLoadRef.current) {
      pageLoadRef.current = true;
      const metrics = performanceMonitor.trackPageLoad(pageName);
      
      // Log to console
      if (metrics) {
        const score = performanceMonitor.getPerformanceScore();
        const vitals = performanceMonitor.getWebVitals();
        
        const goodColor = score >= 80 ? '#4CAF50' : '#FFA500';
        console.log(
          `%c⚡ ${pageName} loaded in ${Math.round(vitals.lcp)}ms (Score: ${score}/100)`,
          `color: ${goodColor}; font-weight: bold; font-size: 12px;`
        );
      }
    }
  }, [pageName]);

  return performanceMonitor;
}

/**
 * Hook for tracking component render performance
 */
export function useComponentRenderTime(componentName) {
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    return () => {
      const duration = performance.now() - startTimeRef.current;
      performanceMonitor.trackComponentRender(componentName, duration);
    };
  }, [componentName]);
}

/**
 * Hook for tracking API call performance
 */
export function useApiCallTiming() {
  return (endpoint, duration, status) => {
    performanceMonitor.trackApiCall(endpoint, duration, status);
  };
}

export default usePerformanceMonitoring;