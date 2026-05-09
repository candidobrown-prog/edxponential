/**
 * App Store Compliance Configuration
 * Ensures compliance with Apple Human Interface Guidelines,
 * Google Material Design, and accessibility standards
 */

export const COMPLIANCE_CONFIG = {
  // Apple App Store Guidelines
  apple: {
    ageRating: '4+',
    requiresKids: false,
    guideline: {
      // 1.0 Safety
      safety: {
        childSafety: true,
        dataProtection: true,
        userDataTracking: false,
      },
      // 2.0 Performance
      performance: {
        minimize: ['app size', 'crash rate', 'network usage'],
        optimize: ['launch time', 'battery usage', 'memory'],
      },
      // 3.0 Business
      business: {
        pricing: true,
        inAppPurchases: true,
        subscriptions: true,
        validateReceipts: true,
      },
      // 4.0 Design
      design: {
        useSystemUI: true,
        respectUserSettings: true,
        supportDarkMode: true,
        safeArea: true,
        notches: true,
      },
      // 5.0 Legal
      legal: {
        privacyPolicy: true,
        termsOfService: true,
        includeAttribution: true,
      },
    },
  },

  // Google Play Store Guidelines
  google: {
    ageRating: 'Everyone',
    contentRating: {
      violence: 'None',
      profanity: 'None',
      advertising: 'Present',
      finance: true,
    },
    guideline: {
      // Ads & Monetization
      adsMonetization: {
        disallowDeceptiveAds: true,
        disclosureRequired: true,
        userControl: true,
      },
      // Data & Security
      dataSecurity: {
        useHTTPS: true,
        encryptSensitive: true,
        respectPermissions: true,
        handlePII: true,
      },
      // Device & Network Abuse
      deviceAbuse: {
        noBattery: true,
        noStorage: true,
        noOverheating: true,
        noCrashing: true,
      },
    },
  },

  // WCAG 2.1 Accessibility Standards
  accessibility: {
    wcagLevel: 'AA',
    requirements: {
      // Perceivable
      perceivable: {
        colorContrast: '4.5:1', // Normal text
        colorContrastLarge: '3:1', // Large text
        enableAlternative: true, // Text for images
        captioning: true, // Video captions
      },
      // Operable
      operable: {
        keyboardAccessible: true,
        focusVisible: true,
        focusOrder: true,
        noTrapFocus: true,
        touchTarget: 48, // pixels minimum
        noFlashing: true,
        skipNavigation: true,
      },
      // Understandable
      understandable: {
        clearLanguage: true,
        consistentNavigation: true,
        errorIdentification: true,
        helpAvailable: true,
      },
      // Robust
      robust: {
        semanticHTML: true,
        ariaLabels: true,
        roles: true,
        properties: true,
        states: true,
        noLinuxDependency: true,
      },
    },

    implementation: {
      screenReader: true,
      keyboardNavigation: true,
      ariaLabels: true,
      semanticHeadings: true,
      altText: true,
      formLabels: true,
      errorMessages: true,
      focusIndicators: true,
      colorNotSole: true,
      reducedMotion: true,
    },
  },

  // FERPA Compliance (Family Educational Rights & Privacy Act)
  ferpa: {
    dataProtection: {
      limitAccess: true, // Role-based access
      auditTrails: true,
      parentalConsent: true,
      studentRecords: true,
      gradeBook: true,
      attendanceRecords: true,
    },
    studentPrivacy: {
      noDataSelling: true,
      noDataSharing: true, // Without consent
      noPersonalizedAds: true,
      parentalNotification: true,
      studentRights: true,
    },
  },

  // GDPR Compliance
  gdpr: {
    dataProtection: {
      dataProcessing: true,
      privacyByDesign: true,
      dataMinimization: true,
      storageLimit: true,
    },
    userRights: {
      rightToAccess: true,
      rightToDelete: true,
      rightToRectify: true,
      rightToPortability: true,
      consentManagement: true,
    },
    requirements: {
      privacyNotice: true,
      privacyPolicy: true,
      dpia: true, // Data Protection Impact Assessment
      dpo: true, // Data Protection Officer
      dataTransfers: true,
    },
  },

  // CCPA Compliance (California Consumer Privacy Act)
  ccpa: {
    disclosure: {
      privacyPolicy: true,
      dataCollection: true,
      dataUse: true,
      dataSharingPractices: true,
      optOut: true,
    },
    consumerRights: {
      rightToKnow: true,
      rightToDelete: true,
      rightToOptOut: true,
      rightToLimitUse: true,
      noDiscrimination: true,
    },
  },

  // Payment Security (PCI DSS)
  paymentSecurity: {
    pciCompliance: {
      neverStoreFullCC: true,
      useTokenization: true,
      useThirdParty: true, // Stripe, Apple Pay, Google Pay
      validatePayments: true,
      secureTransmission: true,
    },
    fraud: {
      detectSuspicious: true,
      enableMFA: true,
      validateCVV: true,
      addressVerification: true,
    },
  },

  // Push Notification Compliance
  pushNotifications: {
    frequency: {
      noExcessive: true,
      respectQuietHours: true,
      respectedPreferences: true,
    },
    content: {
      noClickbait: true,
      noMisleading: true,
      clearValue: true,
    },
    permissions: {
      explicitConsent: true,
      easyOptOut: true,
      respectSettings: true,
    },
  },

  // Verification Checklist
  preSubmissionChecklist: [
    'Privacy policy is current',
    'Terms of service are included',
    'All functionality works',
    'No crashing or freezing',
    'All text is localized',
    'No placeholder content',
    'HTTPS enabled',
    'Strong passwords enforced',
    'Secure API keys',
    'Data encrypted in transit',
    'Data encrypted at rest',
    'No hardcoded credentials',
    'Accessibility tested',
    'Performance optimized',
    'Battery usage minimal',
    'Network usage optimized',
    'Memory leaks fixed',
    'Crash reports reviewed',
    'User testing completed',
    'Support email valid',
  ],
};

/**
 * Regional Compliance
 */
export const REGIONAL_COMPLIANCE = {
  unitedStates: ['FERPA', 'CCPA'],
  europeanUnion: ['GDPR'],
  unitedKingdom: ['UK GDPR', 'DPA 2018'],
  canada: ['PIPEDA'],
  australia: ['Privacy Act'],
  china: ['MLH'],
  russia: ['Federal Law 152-FZ'],
};