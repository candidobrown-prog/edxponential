import React from 'react';
import TierBadge from '../shared/TierBadge';

export default function WelcomeHero({ userName, tier }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-8 md:p-10 text-background">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/3 rounded-full translate-y-1/2" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <p className="text-white/50 text-xs font-medium uppercase tracking-[0.2em]">{greeting}</p>
          {tier && <TierBadge tier={tier} size="sm" />}
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          {userName || 'Welcome back'}
        </h1>
        <p className="text-white/50 text-sm max-w-lg leading-relaxed font-light">
          You are part of an exclusive network of education leaders building institutions that outlast them.
        </p>
      </div>
    </div>
  );
}