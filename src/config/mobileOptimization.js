/**
 * Mobile & Responsive Design Optimization
 * Ensures optimal experience across all devices
 */

export const VIEWPORT_BREAKPOINTS = {
  xs: '320px', // Small phones
  sm: '640px', // Phones
  md: '768px', // Tablets
  lg: '1024px', // Large tablets
  xl: '1280px', // Desktop
  '2xl': '1536px', // Large desktop
};

export const DEVICE_OPTIMIZATION = {
  // Touch Optimization
  touch: {
    minTouchTarget: 48, // iOS HIG minimum
    spacing: 8, // Between touch targets
    hapticFeedback: true,
    longPressActions: true,
    swipeGestures: true,
    gestureThreshold: 5, // pixels
  },

  // Orientation
  orientation: {
    supportPortrait: true,
    supportLandscape: true,
    smartRotation: true,
    safeArea: true,
    notch: true,
    dynamicIsland: true, // iPhone 14 Pro
    statusBar: true,
    navBar: true,
  },

  // Safe Area
  safeArea: {
    top: true,
    bottom: true,
    left: true,
    right: true,
    adjustContent: true,
  },

  // Keyboard Handling
  keyboard: {
    dismissOnScroll: true,
    handleOverlay: true,
    adjustLayout: true,
    returnKeyLabel: 'Next',
    smartReturnKey: true,
  },

  // Responsive Typography
  typography: {
    baseSize: 16, // pixels
    maxSize: 20, // pixels
    lineHeight: 1.5,
    scaleWithDeviceSize: true,
    readableColumnWidth: true,
    accessibleContrast: true,
  },

  // Responsive Layout
  layout: {
    singleColumn: 'xs',
    twoColumn: 'md',
    threeColumn: 'lg',
    fluidMargins: true,
    fluidPadding: true,
    responsiveGrids: true,
    responsiveModals: true,
  },

  // Performance on Mobile
  mobilePerformance: {
    lazyLoadImages: true,
    optimizeAssets: true,
    reduceAnimations: true,
    minimizeJavaScript: true,
    cachingStrategy: 'aggressive',
    compressionFormat: 'webp',
    maxImageSize: 1024,
  },

  // Network Optimization
  network: {
    detectConnection: true,
    reduce3G: true,
    reduceHD: true,
    offlineMode: true,
    backgroundSync: true,
    dataSaver: true,
  },

  // Battery & Thermal
  battery: {
    detectBatteryStatus: true,
    reduceAnimations: true,
    disableBackgroundTasks: true,
    dimmingOnLowBattery: true,
  },

  // Screen Specific
  screen: {
    handleNotch: true,
    handleDynamicIsland: true,
    handleDynamicNotch: true,
    handleRoundedCorners: true,
    handleCutouts: true,
    handleSafeArea: true,
  },

  // Input Methods
  input: {
    supportKeyboard: true,
    supportTouch: true,
    supportPencil: true, // iPad
    supportMouse: true,
    supportGamepad: false,
  },
};

/**
 * Responsive Breakpoint Strategy
 */
export const RESPONSIVE_STRATEGY = {
  mobile: {
    width: '0px-639px',
    optimization: {
      singleColumn: true,
      stackedLayout: true,
      topNavigation: true,
      bottomTabBar: true,
      largeButtons: true,
      minimizedModals: true,
    },
  },

  tablet: {
    width: '640px-1023px',
    optimization: {
      twoColumn: true,
      sidebarLayout: true,
      collapsibleSidebar: true,
      largeText: true,
      splitView: true,
    },
  },

  desktop: {
    width: '1024px+',
    optimization: {
      threeColumn: true,
      sidebarLayout: true,
      multiPanel: true,
      richContextMenus: true,
      advancedFeatures: true,
    },
  },
};

/**
 * Mobile App Specific Features
 */
export const MOBILE_FEATURES = {
  // Home Screen
  homeScreen: {
    appIcon: true,
    appName: 'edXponential',
    shortcut: 'Dashboard',
  },

  // App Shortcuts
  shortcuts: [
    {
      name: 'Dashboard',
      action: '/dashboard',
      icon: 'chart-bar',
    },
    {
      name: 'Coaching',
      action: '/coaching',
      icon: 'target',
    },
    {
      name: 'Community',
      action: '/communities',
      icon: 'users',
    },
  ],

  // Status Bar
  statusBar: {
    style: 'dark', // light or dark
    backgroundColor: 'white',
    translucent: false,
  },

  // System Integration
  systemIntegration: {
    shareSheet: true,
    deepLinking: true,
    handoff: true, // macOS handoff
    spotlight: true, // iOS search
  },

  // App-Specific Features
  capabilities: {
    offlineMode: true,
    backgroundSync: true,
    pushNotifications: true,
    biometric: true, // Face ID / fingerprint
    nfc: false,
    ar: false,
  },
};

/**
 * PWA Specific Optimizations
 */
export const PWA_OPTIMIZATION = {
  installPrompt: {
    show: true,
    timing: 'after_engagement',
    dismissal: 'respect_user_preference',
  },

  offline: {
    fallbackPage: '/offline',
    cacheStrategy: 'stale-while-revalidate',
    backgroundSync: true,
  },

  shortcuts: {
    enabled: true,
    items: [
      'Dashboard',
      'Coaching',
      'Community',
    ],
  },

  shareTarget: {
    enabled: true,
    acceptTypes: [
      'text/plain',
      'text/uri-list',
      'image/*',
      'application/pdf',
    ],
  },
};