/**
 * App Store Metadata Configuration
 * Used for Apple App Store, Google Play Store, and other app distribution platforms
 */

export const APP_METADATA = {
  // Basic Info
  appName: 'edXponential',
  appSubtitle: 'The AI Operating System for Education',
  bundleId: 'com.edxponential.app',
  packageName: 'com.edxponential.app',
  version: '1.0.0',
  buildNumber: '1',
  
  // Branding
  primaryColor: '#2563EB',
  accentColor: '#2563EB',
  backgroundColor: '#FFFFFF',
  
  // App Store Connect
  appStoreId: 'TBD', // Set after app store submission
  googlePlayId: 'TBD', // Set after Google Play submission
  
  // Support
  supportEmail: 'support@edxponential.com',
  privacyPolicy: 'https://edxponential.com/privacy',
  termsOfService: 'https://edxponential.com/terms',
  websiteUrl: 'https://edxponential.com',
  
  // Keywords for search
  keywords: [
    'education',
    'AI',
    'school',
    'leadership',
    'coaching',
    'operations',
    'analytics',
    'founders',
    'principals',
    'executives',
    'learning management',
  ],
  
  // Ratings
  ageRating: '4+', // Appropriate for all ages
  contentRatingBusiness: true,
  contentRatingEducation: true,
  
  // Permissions Required
  requiredPermissions: {
    ios: [
      'NSCameraUsageDescription',
      'NSMicrophoneUsageDescription',
      'NSPhotoLibraryUsageDescription',
      'NSContactsUsageDescription',
      'NSCalendarsUsageDescription',
    ],
    android: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_CONTACTS',
      'android.permission.READ_CALENDAR',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.GET_ACCOUNTS',
    ],
  },
  
  // Device Requirements
  minimumiOSVersion: '14.0',
  minimumiPadOSVersion: '14.0',
  minimumAndroidVersion: 26, // Android 8.0
  
  // Features
  features: {
    aiPersonalization: true,
    offlineMode: true,
    pushNotifications: true,
    inAppPurchases: true,
    videoConferencing: false,
    voiceCalls: false,
    realTimeCollaboration: true,
  },
};

/**
 * Apple App Store Description
 * Character limit: 4000
 */
export const APPLE_APP_STORE_DESCRIPTION = `
edXponential is the AI Operating System for Education™ — a premium platform designed for founders, executives, principals, coaches, educators, tutors, investors, and organizations who are serious about building and leading exceptional schools.

WHAT IS edXponential?

edXponential brings together intelligent AI tools, executive dashboards, coaching systems, community networks, and operational infrastructure into one cohesive ecosystem. Think of it as: OpenAI meets Apple meets Linear — built exclusively for education leaders.

KEY FEATURES

🎯 AI-Powered Intelligence
- Personalized AI guidance through Eddy, our education-focused AI assistant
- Predictive analytics for student success
- AI-driven coaching recommendations
- Automated insights and reporting
- Smart onboarding and contextual learning

📊 Leadership Dashboards
- Bloomberg-level analytics for school leadership
- Real-time KPIs and metrics
- Predictive forecasting tools
- Board-ready reports in seconds
- Executive-grade business intelligence

🏫 School Operations
- Student information systems
- Gradebook and assessment management
- SPED compliance and IEP tracking
- HR and payroll management
- Budget and financial planning
- Vendor and inventory management
- Safety and incident reporting

🎓 Coaching & Professional Development
- Premium coaching marketplace
- Session booking and management
- Progress tracking and feedback
- Peer learning communities
- Leadership development programs

💼 Founder & Investment Tools
- Charter school builder with compliance tools
- Board recruitment and governance
- Investor matching and deal rooms
- Pitch intelligence and readiness scoring
- Capital access and fundraising guidance

🛒 Creator Marketplace
- EduCartx™ for selling courses and resources
- Student incentive systems (Paiy™)
- Content distribution and royalties
- Curriculum marketplace

👥 Elite Communities
- Founder networks
- Principal peer groups
- Coach communities
- Educator collaboration spaces
- Investment syndicates

🎯 Career Opportunities
- WonJob™ education recruiting
- Talent matching for schools
- Leadership position boards

PERFORMANCE & RELIABILITY

✨ Enterprise-Grade Quality
- Built with Apple-quality standards
- 99.9% uptime SLA
- Bank-level security and encryption
- FERPA-compliant for educational data
- SOC 2 Type II certified
- Regular security audits

⚡ Speed & Performance
- Optimized for mobile and desktop
- Instant load times
- Smooth animations and transitions
- Minimal battery usage
- Offline-capable features

🔒 Privacy & Security
- End-to-end encrypted communications
- Secure role-based permissions
- Advanced audit logs
- GDPR and CCPA compliant
- No data selling or tracking
- Secure payment processing

WHO USES edXponential?

✓ School Founders launching new institutions
✓ Principals and school leaders managing operations
✓ Superintendents overseeing districts and networks
✓ Executive coaches supporting leadership
✓ Teachers collaborating and sharing resources
✓ Tutors building their coaching businesses
✓ Investors connecting with education opportunities
✓ Organizations scaling education solutions

WHY edXponential?

"This feels like a billion-dollar AI platform for education." — Education Leaders

edXponential is:
→ AI-powered without being overwhelming
→ Enterprise-capable without being enterprise bloat
→ Premium without being expensive
→ Beautiful without sacrificing functionality
→ Fast without sacrificing features

The platform is designed with the care and attention that Apple brings to its products. Every interaction has been thoughtfully crafted. Every feature serves education leaders. Every design decision supports your mission.

PRICING

edXponential offers transparent, tiered pricing:
- Explore free tier to try the platform
- Professional tier for individual leaders
- Premium tier for schools and organizations
- Enterprise tier for large networks and districts

Free trial available. No credit card required.

START TODAY

Download edXponential and join 500+ education leaders transforming schools and systems.

Your exponential journey starts here.

---

Questions? Contact support@edxponential.com
Privacy Policy: edxponential.com/privacy
Terms of Service: edxponential.com/terms
`;

/**
 * Google Play Store Description
 * Character limit: 4000
 */
export const GOOGLE_PLAY_STORE_DESCRIPTION = `
edXponential: The AI Operating System for Education™

Built for school founders, principals, executives, coaches, educators, tutors, and investors who are serious about transforming education.

WHAT YOU GET

✨ AI-Powered Guidance
- Smart AI assistant for education decisions
- Personalized recommendations
- Automated insights and alerts
- Predictive analytics

📊 Executive Dashboards
- Real-time school metrics and KPIs
- Advanced analytics
- Beautiful, actionable reports
- Leadership intelligence

🏫 School Operations
- Student management
- Gradebook and grading
- Special education (SPED) compliance
- Staff management
- Budget and finance
- Inventory tracking
- Safety reports

🎓 Coaching & Learning
- Premium coaching marketplace
- Professional development
- Peer collaboration
- Leadership programs

💼 Founder Tools
- Charter school builder
- Board governance
- Investor connections
- Capital funding
- Pitch coaching

🛒 Marketplace
- Sell courses and resources
- Creator tools
- Student incentives
- Content sharing

👥 Communities
- Connect with education leaders
- Peer networks
- Collaboration spaces
- Founder groups

🎯 Career Board
- Education job opportunities
- Talent matching
- Leadership positions

WHY edXponential?

Trusted by 500+ education leaders
→ 98% member satisfaction
→ 1,200+ schools impacted
→ $2B+ capital in network
→ 10,000+ educators supported

QUALITY YOU CAN TRUST

✓ Enterprise security (SOC 2, FERPA-compliant)
✓ Bank-level encryption
✓ Offline capability
✓ Lightning fast
✓ Apple-quality design
✓ 99.9% uptime

SIMPLE PRICING

Free tier to explore
Professional for individuals
Premium for schools
Enterprise for districts

Get started free. No card required.

Download now and join the education leadership revolution.

edxponential.com
support@edxponential.com
`;

/**
 * Short Descriptions for App Store Listings
 */
export const SHORT_DESCRIPTIONS = {
  apple: 'The AI Operating System for Education. All-in-one platform for school leaders, founders, coaches, and educators.',
  google: 'The AI Operating System for Education. School leadership, operations, coaching, and community in one app.',
  general: 'AI-powered education operating system for founders, principals, executives, coaches, and educators.',
};

/**
 * Promotional Text (What\'s New)
 */
export const PROMOTIONAL_TEXT = {
  ios: 'Welcome to edXponential! The AI Operating System for Education is now available on iPhone and iPad. Build, lead, coach, and grow exponentially. Download now and get started free.',
  android: 'edXponential is here! The AI Operating System for Education. Premium tools for school leaders, founders, coaches, and educators. Download free today.',
};

/**
 * Review Prompts
 */
export const REVIEW_PROMPTS = {
  onboarding: {
    title: 'Love edXponential?',
    message: 'Help us reach more education leaders. Leave a 5-star review!',
    timing: 'after_onboarding_complete',
  },
  firstDashboard: {
    title: 'Loving your dashboard?',
    message: 'Your review helps education leaders discover edXponential.',
    timing: 'after_first_dashboard_view',
  },
  milestone30Days: {
    title: 'You\'ve been using edXponential for 30 days!',
    message: 'What do you think? We\'d love your feedback.',
    timing: 'after_30_days',
  },
};