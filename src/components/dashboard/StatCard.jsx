import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, subtitle, icon: Icon, accentColor }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
          accentColor || "bg-accent"
        )}>
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <h3 className="text-3xl font-heading font-bold text-foreground">{value}</h3>
      <p className="text-sm font-medium text-foreground mt-1">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}