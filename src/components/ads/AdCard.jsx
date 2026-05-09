import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdCard({ ad, onDismiss, onView }) {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    onDismiss?.(ad.id);
  };

  const handleClick = () => {
    onView?.(ad.id);
    window.open(ad.cta_url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        "group cursor-pointer",
        isDismissing && "opacity-0"
      )}
    >
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted"
        aria-label="Dismiss ad"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Content Area */}
      <div onClick={handleClick} className="p-5">
        {/* Logo & Label */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            {ad.logo_url && (
              <img
                src={ad.logo_url}
                alt={ad.advertiser_name}
                className="h-6 w-6 object-cover rounded"
              />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Sponsored
            </span>
          </div>
        </div>

        {/* Headline & Description */}
        <h3 className="title font-semibold text-black mb-2 group-hover:text-primary transition-colors">
          {ad.title}
        </h3>
        <p className="body-xs text-muted-foreground mb-4 line-clamp-2">
          {ad.description}
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/btn">
          {ad.cta_text}
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Image (if present) */}
      {ad.image_url && (
        <div className="h-32 w-full bg-surface overflow-hidden">
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
    </motion.div>
  );
}