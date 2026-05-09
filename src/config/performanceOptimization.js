/**
 * Performance Optimization Configuration
 * Targets 90+ Lighthouse scores and optimal mobile experience
 */

export const PERFORMANCE_CONFIG = {
  // Code Splitting Strategy
  codeSplitting: {
    enabled: true,
    chunkSize: 50, // KB
    preloadCritical: [
      'dashboard',
      'onboarding',
      'auth',
    ],
    lazyLoad: [
      'communities',
      'coaching',
      'courses',
      'marketplace',
      'operations',
    ],
  },

  // Image Optimization
  imageOptimization: {
    autoWebp: true,
    maxWidth: 1200,
    compressQuality: 80,
    thumbnailSize: 400,
    formats: ['webp', 'jpg', 'png'],
    lazy: true,
    placeholder: 'blur',
  },

  // Font Loading Strategy
  fontLoading: {
    strategy: 'swap', // Show system font while loading
    preload: ['Inter'],
    display: 'swap',
    subset: 'latin-ext',
  },

  // Caching Strategy
  caching: {
    enableServiceWorker: true,
    cacheName: 'edxponential-v1',
    maxAge: {
      api: 300, // 5 minutes
      assets: 86400, // 1 day
      pages: 3600, // 1 hour
    },
    staleWhileRevalidate: true,
  },

  // Database Query Optimization
  databaseOptimization: {
    enableQueryPagination: true,
    defaultPageSize: 20,
    maxPageSize: 100,
    enableInfiniteScroll: true,
    debounceSearch: 300,
  },

  // Animation Performance
  animationOptimization: {
    preferReducedMotion: true,
    useWillChange: true,
    optimizeTransforms: true,
    disableOn: {
      lowEndDevices: true,
      slowNetwork: true,
      batteryLow: true,
    },
  },

  // Network Optimization
  networkOptimization: {
    enableCompression: true,
    enableHttp2: true,
    enableBrotli: true,
    enableMobileOptimization: true,
    disableTracking: true,
  },

  // Memory Optimization
  memoryOptimization: {
    enableVirtualization: true,
    enableMemoization: true,
    autoGarbageCollection: true,
    maxMemoryThreshold: 100, // MB
  },

  // Lighthouse Targets
  lighthouseTargets: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 100,
    pwa: 95,
  },

  // Core Web Vitals Targets
  coreWebVitals: {
    LCP: 2500, // 2.5 seconds
    FID: 100, // 100 milliseconds
    CLS: 0.1, // 0.1 cumulative layout shift
    TTFB: 600, // 600 milliseconds
  },

  // Mobile-Specific Optimizations
  mobileOptimization: {
    enableTouchOptimization: true,
    minTouchTarget: 48, // pixels
    reduceAnimations: true,
    optimizeForLowBandwidth: true,
    useSystemFonts: false,
    enableHapticFeedback: true,
  },

  // Battery & Thermal Optimization
  deviceOptimization: {
    detectBatteryStatus: true,
    detectThermalStatus: true,
    reduceFeatures: {
      onLowBattery: true,
      onHighThermal: true,
    },
    disableBackgroundSync: {
      onLowBattery: true,
    },
  },
};

/**
 * Performance Monitoring Configuration
 * Environment variables are safely guarded for runtime access
 */
/* eslint-disable no-undef */
export const MONITORING_CONFIG = {
  providers: {
    sentry: {
      enabled: true,
      dsn: typeof process !== 'undefined' ? process.env?.REACT_APP_SENTRY_DSN : undefined,
      tracesSampleRate: 0.1,
      enableInboundFilters: true,
      enableClientReporting: true,
    },
    firebase: {
      enabled: true,
      projectId: typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_PROJECT_ID : undefined,
      measurementId: typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_MEASUREMENT_ID : undefined,
    },
    posthog: {
      enabled: true,
      apiKey: typeof process !== 'undefined' ? process.env?.REACT_APP_POSTHOG_KEY : undefined,
      apiHost: 'https://app.posthog.com',
      capturePageView: true,
      sessionRecording: {
        enabled: true,
        sampleRate: 0.1,
      },
    },
    webVitals: {
      enabled: true,
      reportAllChanges: false,
    },
  },

  metrics: {
    trackPageLoadTime: true,
    trackInteractionTime: true,
    trackFirstContentfulPaint: true,
    trackLargestContentfulPaint: true,
    trackCumulativeLayoutShift: true,
    trackFirstInputDelay: true,
    trackTimeToInteractive: true,
    trackMemoryUsage: true,
  },

  errorTracking: {
    captureConsoleErrors: true,
    captureUnhandledRejections: true,
    captureNetworkErrors: true,
    captureSecurityErrors: true,
    captureResourceErrors: true,
    includeBreadcrumbs: true,
    maxBreadcrumbs: 100,
  },

  alerts: {
    errorThreshold: 10, // per minute
    performanceThreshold: 3000, // ms
    slowNetworkThreshold: 2000, // ms
    highMemoryUsage: 150, // MB
  },
};

/**
 * Analytics Configuration
 */
export const ANALYTICS_CONFIG = {
  trackingEvents: {
    authentication: ['login', 'signup', 'logout', 'password_reset'],
    navigation: ['page_view', 'link_click', 'tab_change'],
    engagement: [
      'scroll_depth',
      'time_on_page',
      'feature_interaction',
      'search_query',
    ],
    transactions: [
      'subscription_created',
      'subscription_upgraded',
      'subscription_cancelled',
      'payment_completed',
    ],
    content: [
      'content_viewed',
      'content_created',
      'content_shared',
      'content_liked',
    ],
    community: [
      'group_joined',
      'post_created',
      'post_commented',
      'user_followed',
    ],
  },

  retentionMetrics: {
    trackDAU: true, // Daily Active Users
    trackMAU: true, // Monthly Active Users
    trackChurn: true,
    trackLTVCohorts: true,
    trackNPS: true, // Net Promoter Score
  },

  subscriptionMetrics: {
    trackMRR: true, // Monthly Recurring Revenue
    trackARR: true, // Annual Recurring Revenue
    trackChurnRate: true,
    trackUpgradeRate: true,
    trackDowngradeRate: true,
    trackPaymentFailures: true,
  },
};