/**
 * Link Validation & Navigation System
 * Ensures zero dead links across edXponential ecosystem
 */

import React from 'react';

export const ECOSYSTEM_ROUTES = {
  // Public Pages
  HOME: '/',
  ECOSYSTEM: '/ecosystem',
  PRICING: '/pricing',
  ONBOARDING: '/onboarding',
  
  // Auth
  DASHBOARD: '/dashboard',
  SIGNIN: '/signin',
  
  // Platform Ecosystems
  WHALLED_OH: '/whalledoh',
  TILII: '/tilii',
  TWOTRX: '/twotrx',
  XSCHORES: '/xschores',
  GRAIEDX: '/graiedx',
  FOUNDAITIONX: '/foundaitionx',
  CLASSIFIEDX: '/classifiedx',
  EDUCARTX: '/educartx',
  OPERATIONX: '/operationx',
  DAIDA_BAIXED: '/daida-baixed',
  PERSPEDXTIVES: '/perspedxtives',
  EDXPORTANTE: '/edxportante',
  TUBEDX: '/tubedx',
  ONEJOB: '/onejob',
  GOALEDXSCHOOL: '/goaled',
  
  // Community & Network
  COMMUNITIES: '/communities',
  EDVESTORS: '/edvestors',
  DEAL_ROOM: '/deal-room',
  MATCHED_OPPORTUNITIES: '/matched-opportunities',
  
  // Profile & Settings
  PROFILE: '/profile',
  BILLING: '/billing',
  NOTIFICATIONS: '/notifications',
  
  // Admin
  ADMIN_ADS: '/admin/ads',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_ENTERPRISE: '/admin/enterprise',
  
  // External
  WEBSITE: 'https://www.edxponential.org',
  THE_EDXPONENT: 'https://theedxponent.com',
  SUPPORT: 'https://support.edxponential.org',
  BLOG: 'https://blog.edxponential.org',
  CAREERS: 'https://careers.edxponential.org',
  INVESTOR_RELATIONS: 'https://investors.edxponential.org',
};

// Link health tracking
class LinkValidator {
  constructor() {
    this.linkCache = new Map();
    this.brokenLinks = new Set();
    this.loadingLinks = new Set();
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
   * Report broken link
   */
  reportBrokenLink(url, context = {}) {
    this.brokenLinks.add({
      url,
      timestamp: new Date().toISOString(),
      context,
    });
    console.warn(`[LinkValidator] Broken link detected: ${url}`, context);
  }

  /**
   * Get link health report
   */
  getHealthReport() {
    return {
      totalLinks: this.linkCache.size,
      brokenLinks: this.brokenLinks.size,
      healthScore: ((this.linkCache.size - this.brokenLinks.size) / this.linkCache.size) * 100,
      brokenLinkDetails: Array.from(this.brokenLinks),
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.linkCache.clear();
    this.brokenLinks.clear();
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