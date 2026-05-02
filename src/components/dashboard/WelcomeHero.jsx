import React from 'react';

export default function WelcomeHero({ userName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative overflow-hidden rounded-xl bg-foreground p-8 md:p-10 text-background">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/3 rounded-full translate-y-1/2" />
      <div className="relative z-10">
        <p className="text-white/50 text-xs font-medium uppercase tracking-[0.2em] mb-3">{greeting}</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          {userName || 'Welcome back'}
        </h1>
        <p className="text-white/60 text-base max-w-lg leading-relaxed font-light">
          Empowering education leaders to build transformative institutions. Your journey to edXponential impact continues here.
        </p>
        <div className="mt-6">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-6 w-auto object-contain opacity-30"
          />
        </div>
      </div>
    </div>
  );
}