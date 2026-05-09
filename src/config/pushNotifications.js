/**
 * Push Notification Configuration
 * Elegant, intelligent notifications that respect user preferences
 */

export const NOTIFICATION_CONFIG = {
  // Notification Categories
  categories: {
    aiRecommendation: {
      id: 'ai_recommendation',
      title: 'AI Recommendation',
      icon: 'sparkles',
      color: '#2563EB',
      sound: 'default',
      vibration: true,
      frequency: 'daily',
      maxPerDay: 1,
    },
    coachingReminder: {
      id: 'coaching_reminder',
      title: 'Coaching Reminder',
      icon: 'calendar',
      color: '#2563EB',
      sound: 'notification',
      vibration: true,
      frequency: 'as_needed',
      maxPerDay: 2,
    },
    communityUpdate: {
      id: 'community_update',
      title: 'Community',
      icon: 'users',
      color: '#2563EB',
      sound: 'none',
      vibration: false,
      frequency: 'daily',
      maxPerDay: 3,
    },
    marketplaceActivity: {
      id: 'marketplace_activity',
      title: 'Marketplace',
      icon: 'shopping-bag',
      color: '#2563EB',
      sound: 'none',
      vibration: false,
      frequency: 'weekly',
      maxPerDay: 1,
    },
    progressUpdate: {
      id: 'progress_update',
      title: 'Progress Update',
      icon: 'trending-up',
      color: '#2563EB',
      sound: 'notification',
      vibration: true,
      frequency: 'weekly',
      maxPerDay: 2,
    },
    announcement: {
      id: 'announcement',
      title: 'Announcement',
      icon: 'bell',
      color: '#2563EB',
      sound: 'default',
      vibration: true,
      frequency: 'as_needed',
      maxPerDay: 1,
    },
  },

  // Permission Request Strategy
  permissionRequest: {
    timing: 'on_engagement', // Not on launch
    title: 'Stay Updated',
    message: 'Get smart coaching recommendations, session reminders, and community updates.',
    allowButtonText: 'Allow',
    denyButtonText: 'Later',
    neverShowAgain: false,
  },

  // Notification Delivery
  delivery: {
    useAPNs: true, // Apple Push Notification service
    useGCM: true, // Google Cloud Messaging
    useFCM: true, // Firebase Cloud Messaging
    priorityHigh: true,
    soundEnabled: true,
    vibrateEnabled: true,
    ledEnabled: true,
    reduceForLowBattery: true,
    respectQuietHours: true,
    respectDoNotDisturb: true,
  },

  // Quiet Hours
  quietHours: {
    enabled: true,
    startTime: '22:00', // 10 PM
    endTime: '08:00', // 8 AM
    allowCritical: true,
  },

  // User Preferences
  preferences: {
    allowCategoryCustomization: true,
    allowFrequencyCustomization: true,
    allowSoundCustomization: true,
    allowVibrationCustomization: true,
    showFrequencyPresets: true,
    showQuietHours: true,
  },

  // Notification Content
  content: {
    maxTitleLength: 65,
    maxBodyLength: 240,
    includeImage: true,
    includeAction: true,
    deepLinking: true,
    trackingEnabled: false,
  },

  // Analytics
  analytics: {
    trackDelivery: true,
    trackOpen: true,
    trackDismiss: true,
    trackAction: true,
    trackFail: true,
  },
};

/**
 * Notification Templates
 */
export const NOTIFICATION_TEMPLATES = {
  // AI Recommendations
  aiInsight: {
    title: 'AI Insight for You',
    bodyTemplate: (insight) => `${insight}`,
    actionText: 'View',
    deepLink: '/dashboard',
  },

  // Coaching
  coachingReminder: {
    title: 'Upcoming Coaching Session',
    bodyTemplate: (coach, time) => `${coach} in ${time}`,
    actionText: 'Join',
    deepLink: '/coaching/session/:id',
  },

  // Community
  newCommunityPost: {
    title: 'New Discussion in Your Community',
    bodyTemplate: (community, author) => `${author} posted in ${community}`,
    actionText: 'Read',
    deepLink: '/communities/:id',
  },

  // Marketplace
  newListingNearby: {
    title: 'New Listing Available',
    bodyTemplate: (title, price) => `${title} - $${price}`,
    actionText: 'Browse',
    deepLink: '/educartx/marketplace',
  },

  // Progress
  progressAchieved: {
    title: '🎉 Goal Achieved!',
    bodyTemplate: (goal) => `You completed: ${goal}`,
    actionText: 'Celebrate',
    deepLink: '/dashboard',
  },

  // Announcement
  announcement: {
    title: 'Important Announcement',
    bodyTemplate: (message) => message,
    actionText: 'Learn More',
    deepLink: '/notifications',
  },
};

/**
 * Push Notification Frequency Rules
 */
export const FREQUENCY_RULES = {
  daily: {
    maxNotifications: 3,
    minIntervalMinutes: 120,
  },
  asNeeded: {
    maxNotifications: 5,
    minIntervalMinutes: 30,
  },
  weekly: {
    maxNotifications: 2,
    minIntervalDays: 3,
  },
  monthly: {
    maxNotifications: 1,
    minIntervalDays: 14,
  },
};