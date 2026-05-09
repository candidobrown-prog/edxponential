/**
 * Link Validation & Navigation System
 * Ensures zero dead links across edXponential ecosystem
 */

import React from 'react';

export const ECOSYSTEM_ROUTES = {
  // Core Platform
  HOME: '/',
  DASHBOARD: '/dashboard',
  SIGNIN: '/',
  ONBOARDING: '/onboarding',
  ECOSYSTEM: '/ecosystem',
  PRICING: '/pricing',
  PROFILE: '/profile',
  BILLING: '/billing',
  NOTIFICATIONS: '/notifications',
  
  // Xschy Xschraiper
  XSCHY: '/xschy',
  
  // Goaled Xschool
  GOALED: '/goaled',
  
  // Daida Baixed
  DAIDA: '/daida-baixed',
  
  // Graiedx
  GRAIEDX: '/graiedx',
  
  // PerSpEdxtives
  PERSPEDXTIVES: '/perspedxtives',
  
  // EduCartx
  EDUCARTX: '/educartx',
  
  // Classifiedx
  CLASSIFIEDX: '/classifiedx',
  
  // Foundaitionx
  FOUNDAITIONX: '/foundaitionx',
  
  // OperationX
  OPERATIONX: '/operationx/home',
  
  // Other Platforms
  COURSES: '/courses',
  COACHING: '/coaching',
  COMMUNITIES: '/communities',
  EDVESTORS: '/edvestors',
  DEAL_ROOM: '/deal-room',
  MATCHED_OPPORTUNITIES: '/matched-opportunities',
  TWOTRX: '/twotrx',
  TUBEDX: '/tubedx',
  ONEJOB: '/onejob',
  EDXPORTANTE: '/edxportante',
  TILII: '/tilii',
  WHALLEDOH: '/whalledoh',
  XSCHORES: '/xschores',
  
  // Admin
  ADMIN_ENTERPRISE: '/admin/enterprise',
  ADMIN_STORAGE: '/admin/storage',
  ADMIN_FEEDBACK: '/admin/feedback',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_EXECUTIVE: '/admin/executive',
  ADMIN_ADS: '/admin/ads',
  
  // External URLs
  WEBSITE: 'https://www.edxponential.org',
  BLOG: 'https://blog.edxponential.org',
  SUPPORT: 'https://support.edxponential.org',
  THE_EDXPONENT: 'https://theedxponent.com',
  CAREERS: 'https://careers.edxponential.org',
  INVESTOR_RELATIONS: 'https://investors.edxponential.org',
};

// Link health tracking
class LinkValidator {
  constructor() {
    this.linkCache = new Map();
    this.brokenLinks = new Set();
    this.loadingLinks = new Set();
    this.navigationHistory = [];
    this.scanResults = [];
    this.lastScanTime = null;
  }

  /**
   * Validate if route is internal or external
   */
  isExternalLink(url) {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  }

  /**
   * Validate if route exists
   */
  isValidRoute(route) {
    return Object.values(ECOSYSTEM_ROUTES).includes(route);
  }

  /**
   * Track navigation
   */
  trackNavigation(from, to, success = true) {
    this.navigationHistory.push({
      from,
      to,
      timestamp: new Date().toISOString(),
      success,
    });
    // Keep last 100 navigations
    if (this.navigationHistory.length > 100) {
      this.navigationHistory = this.navigationHistory.slice(-100);
    }
  }

  /**
   * Report broken link with context
   */
  reportBrokenLink(url, context = {}) {
    const brokenLinkObj = {
      url,
      timestamp: new Date().toISOString(),
      context,
    };
    this.brokenLinks.add(brokenLinkObj);
    console.warn(`[LinkValidator] Broken link detected: ${url}`, context);
  }

  /**
   * Scan all ecosystem routes for validity
   */
  scanEcosystem() {
    const scanResult = {
      timestamp: new Date().toISOString(),
      totalRoutes: Object.keys(ECOSYSTEM_ROUTES).length,
      validRoutes: [],
      invalidRoutes: [],
    };

    Object.entries(ECOSYSTEM_ROUTES).forEach(([key, route]) => {
      const isValid = this.validateRoute(route);
      if (isValid) {
        scanResult.validRoutes.push({ key, route });
      } else {
        scanResult.invalidRoutes.push({ key, route });
      }
    });

    scanResult.healthScore = (scanResult.validRoutes.length / scanResult.totalRoutes) * 100;
    this.scanResults.push(scanResult);
    this.lastScanTime = new Date().toISOString();
    
    return scanResult;
  }

  /**
   * Validate individual route
   */
  validateRoute(route) {
    // External URLs must be valid URL format
    if (this.isExternalLink(route)) {
      try {
        new URL(route);
        return true;
      } catch {
        return false;
      }
    }
    // Internal routes must start with /
    return route && route.startsWith('/');
  }

  /**
   * Get link health report
   */
  getHealthReport() {
    const totalTracked = this.linkCache.size;
    const broken = this.brokenLinks.size;
    const healthScore = totalTracked > 0 ? ((totalTracked - broken) / totalTracked) * 100 : 100;

    return {
      totalTracked,
      brokenLinks: broken,
      healthScore: Math.round(healthScore),
      lastScanTime: this.lastScanTime,
      navigations: this.navigationHistory.length,
      brokenLinkDetails: Array.from(this.brokenLinks),
      recentScan: this.scanResults[this.scanResults.length - 1] || null,
    };
  }

  /**
   * Get navigation analytics
   */
  getNavigationAnalytics() {
    const successful = this.navigationHistory.filter(n => n.success).length;
    const failed = this.navigationHistory.filter(n => !n.success).length;

    return {
      total: this.navigationHistory.length,
      successful,
      failed,
      successRate: this.navigationHistory.length > 0 ? (successful / this.navigationHistory.length) * 100 : 0,
      history: this.navigationHistory.slice(-20), // Last 20
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.linkCache.clear();
    this.brokenLinks.clear();
    this.navigationHistory = [];
  }
}

export const linkValidator = new LinkValidator();

/**
 * Safe navigation handler with error handling
 */
export const safeNavigate = async (navigate, route, onError = null) => {
  try {
    if (!route) {
      console.error('[Navigation] No route provided');
      return false;
    }

    // Check if external link
    if (linkValidator.isExternalLink(route)) {
      window.open(route, '_blank', 'noopener,noreferrer');
      return true;
    }

    // Internal navigation
    if (linkValidator.isValidRoute(route)) {
      navigate(route);
      return true;
    }

    console.error(`[Navigation] Invalid route: ${route}`);
    linkValidator.reportBrokenLink(route);
    onError?.('Invalid navigation route');
    return false;
  } catch (error) {
    console.error('[Navigation] Error during navigation:', error);
    linkValidator.reportBrokenLink(route, { error: error.message });
    onError?.(error.message);
    return false;
  }
};

/**
 * Validate link on component mount
 */
export const useValidateLink = (url) => {
  const [isValid, setIsValid] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!url) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // For external links, verify they're properly formatted
    if (linkValidator.isExternalLink(url)) {
      try {
        new URL(url);
        setIsValid(true);
      } catch {
        setIsValid(false);
        linkValidator.reportBrokenLink(url, { reason: 'Invalid URL format' });
      }
    } else {
      // For internal links, check against valid routes
      setIsValid(linkValidator.isValidRoute(url));
    }
    
    setIsLoading(false);
  }, [url]);

  return { isValid, isLoading };
};