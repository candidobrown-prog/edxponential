import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function SponsoredContentCard({ content, onClick }) {
  return (
    <motion.a
      href={content.cta_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClick?.(content.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="block group"
    >
      <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden h-full">
        {/* Image */}
        {content.featured_image_url && (
          <div className="relative h-40 w-full overflow-hidden bg-surface">
            <img
              src={content.featured_image_url}
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                {content.label}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {content.logo_url && (
              <img
                src={content.logo_url}
                alt={content.sponsor_name}
                className="h-5 w-5 object-cover rounded"
              />
            )}
            <span className="caption text-muted-foreground">{content.sponsor_name}</span>
          </div>

          <h3 className="title font-semibold text-black mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {content.title}
          </h3>

          <p className="body-xs text-muted-foreground mb-4 line-clamp-2">
            {content.description}
          </p>

          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            {content.cta_text}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}