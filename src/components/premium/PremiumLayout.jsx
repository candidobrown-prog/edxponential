import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Layout Component
 * Wraps content with Apple-quality spacing and breathing room
 */
export function PremiumSection({ children, className = "", spacing = "3xl" }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`${spacing === '3xl' ? 'py-12 px-6 md:py-16' : spacing === '4xl' ? 'py-16 px-6 md:py-24' : 'py-20 px-6 md:py-32'} max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function PremiumContainer({ children, className = "" }) {
  return (
    <div className={`max-w-7xl mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}

export function PremiumGrid({ children, cols = 3, className = "" }) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[cols] || `grid-cols-${cols}`;

  return (
    <div className={`grid ${gridClass} gap-6 md:gap-8 ${className}`}>
      {children}
    </div>
  );
}

export function PremiumHeading({ level = 1, children, subtitle, className = "" }) {
  const headingClasses = {
    1: "display-1",
    2: "display-2",
    3: "heading-1",
    4: "heading-2",
  }[level] || "heading-1";

  const HeadingTag = `h${level}`;

  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      <HeadingTag className={headingClasses}>
        {children}
      </HeadingTag>
      {subtitle && (
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PremiumCard({ children, hover = true, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -4 } : {}}
      className={`card-premium p-6 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function PremiumButton({ children, variant = "solid", size = "md", ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`btn-base px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
        variant === "solid"
          ? "bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-lg"
          : "border border-foreground/20 bg-background hover:bg-muted text-foreground"
      }`}
      {...props}
    >
      {children}
    </motion.button>
  );
}