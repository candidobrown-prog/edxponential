import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { safeNavigate, linkValidator } from '@/lib/linkValidator';

/**
 * SafeLink Component
 * Ensures all links work perfectly with:
 * - Proper routing (internal/external)
 * - Loading states
 * - Error handling
 * - Animations
 * - Mobile responsiveness
 */
export const SafeLink = React.forwardRef(({
  to,
  href,
  children,
  className = '',
  variant = 'default',
  external = false,
  onClick,
  onError,
  loading = false,
  showLoadingState = true,
  newTab = false,
  fallbackRoute = '/',
  ...props
}, ref) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const url = href || to;
  const isExternal = external || linkValidator.isExternalLink(url);

  const handleClick = async (e) => {
    e.preventDefault();

    // Custom onClick handler
    if (onClick) {
      const result = await onClick(e);
      if (result === false) return;
    }

    setError(null);

    if (showLoadingState) {
      setIsLoading(true);
    }

    try {
      if (isExternal) {
        const target = newTab ? '_blank' : '_self';
        window.open(url, target, newTab ? 'noopener,noreferrer' : '');
      } else {
        const navigated = await safeNavigate(navigate, url, setError);
        if (!navigated && fallbackRoute) {
          navigate(fallbackRoute);
        }
      }
    } catch (err) {
      console.error('[SafeLink] Navigation error:', err);
      setError(err.message);
      onError?.(err);
      linkValidator.reportBrokenLink(url, { error: err.message });
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  };

  // Render as external link
  if (isExternal) {
    return (
      <motion.a
        ref={ref}
        href={url}
        target={newTab ? '_blank' : '_self'}
        rel={newTab ? 'noopener noreferrer' : ''}
        onClick={handleClick}
        className={`relative ${className} transition-all duration-200`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {isLoading && showLoadingState ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </span>
        ) : (
          children
        )}
      </motion.a>
    );
  }

  // Render as button (for internal navigation)
  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      disabled={isLoading}
      className={`relative ${className} disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {isLoading && showLoadingState ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
      {error && (
        <span className="text-xs text-destructive absolute top-full mt-1">
          Navigation failed
        </span>
      )}
    </motion.button>
  );
});

SafeLink.displayName = 'SafeLink';

export default SafeLink;