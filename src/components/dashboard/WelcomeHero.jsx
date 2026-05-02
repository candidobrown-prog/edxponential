import React from 'react';

export default function WelcomeHero({ userName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-10 text-primary-foreground">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white/5 rounded-full translate-y-1/2" />
      <div className="relative z-10">
        <p className="text-primary-foreground/60 text-sm font-medium uppercase tracking-widest mb-2">{greeting}</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
          {userName || 'Welcome back'}
        </h1>
        <p className="text-primary-foreground/70 text-base max-w-lg leading-relaxed">
          Empowering education leaders to build transformative institutions. Your journey to exponential impact continues here.
        </p>
      </div>
    </div>
  );
}