/**
 * Build Configuration for App Store Distribution
 * Supports iOS, Android, PWA, and desktop builds
 * 
 * Note: This file runs in Node.js only during build time
 * and is not included in the browser bundle.
 */
/* eslint-disable no-undef */

export const BUILD_CONFIG = {
  // App Metadata
  app: {
    name: 'edXponential',
    version: '1.0.0',
    buildNumber: '1',
    bundleId: 'com.edxponential.app',
    packageName: 'com.edxponential.app',
  },

  // iOS Configuration
  ios: {
    enabled: true,
    target: 'iphoneos',
    minimumVersion: '14.0',
    architectures: ['arm64'],
    capabilities: [
      'push_notifications',
      'app_groups',
      'associated_domains',
      'sign_in_with_apple',
    ],
    entitlements: {
      'aps-environment': 'production',
      'com.apple.developer.applesignin': ['Default'],
      'keychain-access-groups': ['$(AppIdentifierPrefix)com.edxponential.app'],
    },
    plist: {
      NSPhotoLibraryUsageDescription: 'edXponential needs access to your photos to upload profile pictures and resources.',
      NSCameraUsageDescription: 'edXponential needs camera access for video coaching sessions.',
      NSMicrophoneUsageDescription: 'edXponential needs microphone access for audio coaching and calls.',
      NSContactsUsageDescription: 'edXponential needs access to contacts for community invitations.',
      NSCalendarsUsageDescription: 'edXponential needs calendar access to manage coaching sessions.',
      NSLocalNetworkUsageDescription: 'edXponential uses local network to optimize performance.',
      NSBonjourServiceTypes: ['_edx._tcp', '_edx._udp'],
    },
  },

  // Android Configuration
  android: {
    enabled: true,
    target: 'android',
    minimumSdk: 26, // Android 8.0
    targetSdk: 34, // Android 14
    compileSdk: 34,
    architectures: ['arm64-v8a', 'armeabi-v7a'],
    features: [
      'android.hardware.camera',
      'android.hardware.camera.autofocus',
      'android.hardware.microphone',
      'android.hardware.location',
    ],
    permissions: [
      'android.permission.INTERNET',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_CONTACTS',
      'android.permission.READ_CALENDAR',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.GET_ACCOUNTS',
      'android.permission.USE_BIOMETRIC',
    ],
  },

  // PWA Configuration
  pwa: {
    enabled: true,
    scope: '/',
    display: 'standalone',
    startUrl: '/?source=pwa',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/icon-192x192.png', size: '192x192' },
      { src: '/icons/icon-512x512.png', size: '512x512' },
      { src: '/icons/icon-maskable-192x192.png', size: '192x192', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512x512.png', size: '512x512', purpose: 'maskable' },
    ],
  },

  // Build Optimization
  optimization: {
    production: true,
    minify: true,
    sourceMap: false, // Disabled in production for security
    analyze: false,
    reportCompressedSize: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // Code Splitting
  splitting: {
    chunks: {
      vendor: true,
      common: true,
      async: true,
    },
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    minSize: 20000,
    minChunkSize: 20000,
  },

  // Asset Optimization
  assets: {
    images: {
      formats: ['webp', 'jpg', 'png'],
      quality: 80,
      maxWidth: 1200,
    },
    fonts: {
      subset: 'latin-ext',
      preload: ['Inter'],
    },
    svg: {
      optimize: true,
      removeDimensions: true,
    },
  },

  // Environment Variables
  env: {
    production: {
      API_URL: 'https://api.edxponential.com',
      STRIPE_PUBLIC_KEY: typeof process !== 'undefined' ? process.env?.STRIPE_PUBLIC_KEY : undefined,
      SENTRY_DSN: typeof process !== 'undefined' ? process.env?.SENTRY_DSN : undefined,
      FIREBASE_PROJECT_ID: typeof process !== 'undefined' ? process.env?.FIREBASE_PROJECT_ID : undefined,
      POSTHOG_KEY: typeof process !== 'undefined' ? process.env?.POSTHOG_KEY : undefined,
    },
  },

  // Security
  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'data:'],
      'connect-src': ["'self'", 'https:', 'wss:'],
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    },
  },

  // Distribution Targets
  distribution: {
    appStore: {
      bundleId: 'com.edxponential.app',
      teamId: 'XXXXXXXXXX', // Replace with actual Team ID
      signingIdentity: 'iPhone Distribution: edXponential Inc.',
    },
    playStore: {
      packageName: 'com.edxponential.app',
      keystoreFile: 'edxponential.keystore',
      keyAlias: 'edxponential',
      storePassword: typeof process !== 'undefined' ? process.env?.ANDROID_KEYSTORE_PASSWORD : undefined,
      keyPassword: typeof process !== 'undefined' ? process.env?.ANDROID_KEY_PASSWORD : undefined,
    },
    web: {
      domain: 'edxponential.com',
      cname: 'app.edxponential.com',
    },
  },
};

export default BUILD_CONFIG;