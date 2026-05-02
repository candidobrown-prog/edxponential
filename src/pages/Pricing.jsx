import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Lock, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    name: 'edVestor Access',
    price: '$25,000',
    period: '/year',
    tag: null,
    description: 'Enter the room. Start seeing deals that don\'t exist anywhere else.',
    features: [
      'Access to all active Deal Room opportunities',
      'View founder profiles and pitch materials',
      'Request introductions to founders',
      'Basic messaging on platform',
      'Monthly Deal Room digest',
      'edXponential member directory',
    ],
    cta: 'Apply for Access',
    ctaVariant: 'outline',
    accent: 'border-border/60',
  },
  {
    name: 'edVestor Circle',
    price: '$50,000',
    period: '/year',
    tag: 'Most Popular',
    description: 'Priority access, direct lines, and a seat at the table with top operators.',
    features: [
      'Everything in edVestor Access',
      'Early deal visibility (48hr before public)',
      'Direct messaging to founders',
      'Access to private investor rooms',
      'Monthly investor briefings with curated insights',
      'Curated deal matching to your thesis',
      'Intro to 2 founders per quarter (guaranteed)',
    ],
    cta: 'Join the Circle',
    ctaVariant: 'default',
    accent: 'border-foreground',
    highlight: true,
  },
  {
    name: 'edVestor Elite',
    price: '$100,000+',
    period: '/year',
    tag: 'White Glove',
    description: 'Concierge-level access. Every deal, every founder, every room.',
    features: [
      'Everything in edVestor Circle',
      'Concierge deal sourcing (we find deals for you)',
      'Guaranteed warm introductions (unlimited)',
      'Private dinners and retreats with top founders',
      'Co-investment opportunities with the network',
      'Founder matchmaking by your mandate',
      'Dedicated relationship manager',
      'Custom due diligence support',
    ],
    cta: 'Talk to Us',
    ctaVariant: 'default',
    accent: 'border-foreground',
  },
];

const ADD_ONS = [
  { name: 'Success Fee', desc: '2–5% on capital raised through the platform', tag: 'Founder' },
  { name: 'Founder Listing Fee', desc: '$2,000–$10,000 to submit an opportunity', tag: 'Founder' },
  { name: 'Premium Placement', desc: '$5,000 to feature your opportunity at the top of the Deal Room', tag: 'Founder' },
  { name: 'Insights Report', desc: 'Quarterly data report on education investment trends and deal flow', tag: 'Investor' },
];

export default function Pricing() {
  const [billingFocus, setBillingFocus] = useState('investor');

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Membership · Private</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
          Invest in access.<br />
          <span className="text-muted-foreground/50">Not just deals.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
          edXponential is not a deal board. It's a closed-loop capital network where serious investors access
          vetted founders building institutions that matter.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center bg-muted rounded-xl p-1 mt-2">
          {['investor', 'founder'].map(t => (
            <button
              key={t}
              onClick={() => setBillingFocus(t)}
              className={`px-5 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                billingFocus === t ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'investor' ? 'For edVestors' : 'For Founders'}
            </button>
          ))}
        </div>
      </div>

      {billingFocus === 'investor' ? (
        <>
          {/* Investor Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative bg-card border-2 rounded-2xl p-7 flex flex-col transition-all ${tier.accent} ${tier.highlight ? 'shadow-xl scale-[1.02]' : ''}`}
              >
                {tier.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold ${
                      tier.tag === 'Most Popular' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {tier.tag}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    {i === 0 && <Star className="w-4 h-4 text-muted-foreground" />}
                    {i === 1 && <Zap className="w-4 h-4" />}
                    {i === 2 && <ArrowRight className="w-4 h-4" />}
                    <span className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">{tier.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tier.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-3.5 h-3.5 text-foreground mt-0.5 flex-shrink-0" />
                      <span className={tier.highlight ? 'text-foreground' : 'text-muted-foreground'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.ctaVariant}
                  className={`w-full rounded-xl ${tier.highlight ? 'bg-foreground text-background hover:bg-foreground/85' : ''}`}
                >
                  {tier.cta} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: '$2B+', label: 'Capital in network' },
              { value: '500+', label: 'Vetted edVestors' },
              { value: '3x', label: 'Avg deal access vs. open markets' },
              { value: '98%', label: 'Member renewal rate' },
            ].map(s => (
              <div key={s.label} className="text-center bg-card border border-border/60 rounded-xl p-5">
                <div className="font-heading text-3xl font-bold">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Founder Pricing */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Standard Listing',
                price: '$2,000',
                desc: 'Submit your opportunity for admin review. If approved, it appears in the Deal Room.',
                features: ['One opportunity listing', 'Admin curation and approval', 'Access to investor interest signals', 'Basic funding tracker'],
              },
              {
                name: 'Premium Listing',
                price: '$5,000',
                desc: 'Featured placement at the top of the Deal Room for 30 days.',
                features: ['Everything in Standard', 'Featured deal card placement', 'Priority curation review', 'Investor match notifications', 'Dedicated intro management'],
                highlight: true,
              },
              {
                name: 'Success Fee',
                price: '2–5%',
                desc: 'Optionally share upside on capital raised through the platform.',
                features: ['No upfront listing fee', 'Fee only paid on capital raised', 'Aligned incentives', 'Full platform support'],
              },
            ].map(tier => (
              <div key={tier.name} className={`bg-card border-2 rounded-2xl p-7 flex flex-col ${tier.highlight ? 'border-foreground shadow-xl scale-[1.02]' : 'border-border/60'}`}>
                {tier.highlight && (
                  <div className="text-[9px] uppercase tracking-widest font-semibold bg-foreground text-background rounded-full px-3 py-1 w-fit mb-3">
                    Most Chosen
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground mb-2">{tier.name}</div>
                  <div className="font-heading text-3xl font-bold">{tier.price}</div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tier.desc}</p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-3.5 h-3.5 text-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={tier.highlight ? 'default' : 'outline'} className="w-full rounded-xl">
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Additional Revenue Streams</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ADD_ONS.map(a => (
            <div key={a.name} className="flex items-start gap-4 bg-card border border-border/60 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-heading font-semibold text-sm">{a.name}</span>
                  <Badge className="text-[9px] uppercase tracking-widest bg-muted text-muted-foreground border-0 py-0">{a.tag}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-foreground text-background rounded-2xl p-10 text-center space-y-4">
        <h2 className="font-heading text-3xl font-bold">This is where decisions get made.</h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm leading-relaxed">
          edXponential is invite-only. Every member is vetted. Every deal is curated.
          You're not browsing — you're operating inside the network.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/deal-room">
            <Button className="rounded-xl bg-white text-black hover:bg-white/90 gap-2">
              Browse Deal Room <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/founder-dashboard">
            <Button variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10 gap-2">
              Founder Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}