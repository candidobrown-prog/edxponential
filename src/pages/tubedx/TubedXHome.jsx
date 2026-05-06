import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Zap, Radio, Globe, BarChart3, Shield, Layers, Video, Users, Star, ArrowRight, CheckCircle, Tv } from 'lucide-react';

const FEATURES = [
  { icon: Video, title: 'Video Hosting', desc: 'HD/4K upload, CDN delivery, adaptive streaming with custom branding' },
  { icon: Radio, title: 'Live Streaming', desc: 'Enterprise livestreams, webinars, multi-host conferences and summits' },
  { icon: Zap, title: 'AI Studio', desc: 'Generate scripts, captions, translations, SEO metadata, and summaries' },
  { icon: BarChart3, title: 'Analytics', desc: 'Deep insights: watch time, heatmaps, drop-off, completion rates' },
  { icon: Tv, title: 'OTT Platform', desc: 'Launch your own Netflix-style streaming channel for education' },
  { icon: Shield, title: 'Enterprise Security', desc: 'SSO, DRM encryption, FERPA-aligned, domain restrictions' },
];

const TIERS = [
  { name: 'Starter', price: 'Free', storage: '10 GB', streams: '2 events/mo', color: 'bg-white border border-gray-200', features: ['10 GB storage', '720p uploads', '2 live events/mo', 'Basic analytics', 'AI captions (5 videos)'] },
  { name: 'Principal', price: '$49/mo', storage: '100 GB', streams: '10 events/mo', color: 'bg-white border border-gray-200', features: ['100 GB storage', '1080p HD uploads', '10 live events/mo', 'Advanced analytics', 'AI captions unlimited', 'AI script generator', 'OTT channel (1)'] },
  { name: 'Executive', price: '$149/mo', storage: '500 GB', streams: 'Unlimited', color: 'bg-[#0a0f1e] text-white', features: ['500 GB storage', '4K uploads', 'Unlimited live events', 'AI Studio full access', 'Multi-language translation', '5 OTT channels', 'Team collaboration', 'Custom branding'] },
  { name: 'Enterprise', price: 'Custom', storage: 'Unlimited', streams: 'Unlimited', color: 'bg-white border border-gray-200', features: ['Unlimited storage', 'Unlimited events', 'White-label platform', 'Dedicated CDN', 'SLA support', 'SSO + DRM', 'Custom integrations', 'Network management'] },
];

export default function TubedXHome() {
  return (
    <div className="min-h-screen bg-black" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0f1e] to-black" />
        <div className="relative max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white/60 text-xs font-black uppercase tracking-widest">edXponential · TubedX™</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
            TubedX™
          </h1>
          <p className="text-xl text-white/50 mb-4 max-w-2xl mx-auto leading-relaxed">
            The AI-powered video ecosystem for education leaders. Host, stream, teach, monetize, and collaborate — all in one cinematic platform.
          </p>
          <p className="text-sm text-white/30 mb-10 font-black uppercase tracking-widest">
            Vimeo · Netflix · MasterClass · Zoom · Loom · Kajabi — Combined for Education
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/tubedx/dashboard">
              <button className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-gray-100 transition-all">
                <Play className="w-4 h-4" /> Launch TubedX
              </button>
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-2xl font-black text-sm hover:bg-white/10 transition-all">
              <Radio className="w-4 h-4" /> Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-white/30 text-xs font-black uppercase tracking-widest text-center mb-12">Platform Capabilities</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-black mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <p className="text-white/30 text-xs font-black uppercase tracking-widest text-center mb-4">Pricing & Storage</p>
        <h2 className="text-3xl font-black text-white text-center mb-12">Choose Your TubedX Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map(tier => (
            <div key={tier.name} className={`rounded-2xl p-6 ${tier.color}`}>
              <p className={`text-xs font-black uppercase tracking-widest mb-2 ${tier.name === 'Executive' ? 'text-white/40' : 'text-gray-400'}`}>{tier.name}</p>
              <p className={`text-3xl font-black mb-1 ${tier.name === 'Executive' ? 'text-white' : 'text-[#0a0f1e]'}`}>{tier.price}</p>
              <div className={`text-xs font-black mb-1 ${tier.name === 'Executive' ? 'text-white/60' : 'text-gray-400'}`}>
                <span className="font-black">{tier.storage}</span> storage
              </div>
              <div className={`text-xs mb-5 ${tier.name === 'Executive' ? 'text-white/40' : 'text-gray-400'}`}>{tier.streams} events</div>
              <div className="space-y-2 mb-6">
                {tier.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${tier.name === 'Executive' ? 'text-white/40' : 'text-gray-400'}`} />
                    <span className={`text-xs ${tier.name === 'Executive' ? 'text-white/60' : 'text-gray-500'}`}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/tubedx/dashboard">
                <button className={`w-full py-2.5 rounded-xl font-black text-sm transition-all ${tier.name === 'Executive' ? 'bg-white text-[#0a0f1e] hover:bg-gray-100' : 'bg-[#0a0f1e] text-white hover:bg-[#1a2033]'}`}>
                  Get Started
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-8 pb-24 text-center">
        <Link to="/tubedx/dashboard">
          <button className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-100 transition-all">
            Launch TubedX Studio <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}