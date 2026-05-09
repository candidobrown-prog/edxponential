/**
 * Enterprise-grade performance monitoring and optimization
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.isEnabled = typeof window !== 'undefined';
  }

  /**
   * Track page load performance
   */
  trackPageLoad(pageName) {
    if (!this.isEnabled) return;

    const navigationTiming = performance.getEntriesByType('navigation')[0];
    if (!navigationTiming) return;

    const metrics = {
      pageName,
      dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
      tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
      ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
      fcp: this.getFirstContentfulPaint(),
      lcp: this.getLargestContentfulPaint(),
      tti: this.getTimeToInteractive(),
      domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
      loadComplete: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
      timestamp: new Date().toISOString(),
    };

    this.metrics[pageName] = metrics;
    this.logMetrics(metrics);
    
    return metrics;
  }

  /**
   * Track API response time
   */
  trackApiCall(endpoint, duration, status) {
    if (!this.isEnabled) return;

    const metric = {
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString(),
    };

    if (!this.metrics.apiCalls) this.metrics.apiCalls = [];
    this.metrics.apiCalls.push(metric);

    // Alert if slow
    if (duration > 1000) {
      console.warn(`Slow API call: ${endpoint} took ${duration}ms`);
    }
  }

  /**
   * Track component render time
   */
  trackComponentRender(componentName, duration) {
    if (!this.isEnabled) return;

    const metric = {
      component: componentName,
      duration,
      timestamp: new Date().toISOString(),
    };

    if (!this.metrics.componentRenders) this.metrics.componentRenders = [];
    this.metrics.componentRenders.push(metric);

    // Alert if render takes too long
    if (duration > 16) {
      console.warn(`Slow component render: ${componentName} took ${duration}ms (exceeds 16ms frame time)`);
    }
  }

  /**
   * Get First Contentful Paint
   */
  getFirstContentfulPaint() {
    if (!this.isEnabled) return 0;
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return fcp ? Math.round(fcp.startTime) : 0;
  }

  /**
   * Get Largest Contentful Paint
   */
  getLargestContentfulPaint() {
    if (!this.isEnabled) return 0;
    const paintEntries = performance.getEntriesByType('paint');
    const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
    return lcp ? Math.round(lcp.startTime) : 0;
  }

  /**
   * Get Time to Interactive
   */
  getTimeToInteractive() {
    if (!this.isEnabled) return 0;
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    if (!navigationTiming) return 0;
    return Math.round(navigationTiming.domInteractive - navigationTiming.fetchStart);
  }

  /**
   * Get Web Vitals
   */
  getWebVitals() {
    const fcp = this.getFirstContentfulPaint();
    const lcp = this.getLargestContentfulPaint();
    const tti = this.getTimeToInteractive();

    return {
      fcp,
      lcp,
      tti,
      targetsMet: {
        fcp: fcp < 1500,
        lcp: lcp < 2500,
        tti: tti < 3000,
      },
    };
  }

  /**
   * Log metrics to console (or send to monitoring service)
   */
  logMetrics(metrics) {
    const vitals = this.getWebVitals();
    const allTargetsMet = Object.values(vitals.targetsMet).every(v => v);

    console.log('%cPerformance Metrics', 'color: #4CAF50; font-weight: bold; font-size: 14px;', {
      ...metrics,
      webVitals: vitals,
      status: allTargetsMet ? '✓ All targets met' : '⚠ Some targets missed',
    });
  }

  /**
   * Report metrics to monitoring service (Sentry, LogRocket, Datadog, etc.)
   */
  reportToMonitoring(serviceType = 'sentry') {
    if (!this.isEnabled) return;

    const vitals = this.getWebVitals();
    
    // Example: Send to Sentry
    if (window.Sentry) {
      window.Sentry.captureMessage('Performance Metrics', {
        level: 'info',
        contexts: {
          trace: vitals,
          performance: this.metrics,
        },
      });
    }

    // Example: Send to LogRocket
    if (window.LogRocket) {
      window.LogRocket.captureException(new Error('Performance Report'), {
        extra: { vitals, metrics: this.metrics },
      });
    }
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore() {
    const vitals = this.getWebVitals();
    let score = 100;

    // Deduct for missed targets
    if (!vitals.targetsMet.fcp) score -= 10;
    if (!vitals.targetsMet.lcp) score -= 20;
    if (!vitals.targetsMet.tti) score -= 20;

    // Deduct based on absolute values
    if (vitals.fcp > 2000) score -= 5;
    if (vitals.lcp > 3500) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Check if performance is acceptable
   */
  isPerformanceAcceptable() {
    const score = this.getPerformanceScore();
    return score >= 80;
  }
}

export const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;