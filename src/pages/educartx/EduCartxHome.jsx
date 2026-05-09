import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Store, BarChart3, Package, Zap, ArrowRight, Star, TrendingUp, Globe, Shield, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  { icon: Store, label: 'AI Storefront Builder', desc: 'Build a branded storefront in minutes with AI-powered design tools' },
  { icon: ShoppingBag, label: 'Sell Everything', desc: 'Digital, physical, courses, coaching, memberships, and more' },
  { icon: Sparkles, label: 'AI Product Creator', desc: 'Generate titles, descriptions, pricing & marketing copy instantly' },
  { icon: BarChart3, label: 'Creator Analytics', desc: 'Revenue, conversion, and growth insights at your fingertips' },
  { icon: TrendingUp, label: 'AI Marketing Engine', desc: 'Auto-generate campaigns, social posts, and product launches' },
  { icon: Globe, label: 'Global Marketplace', desc: 'Reach thousands of educators, schools and organizations' },
  { icon: Shield, label: 'Secure Commerce', desc: 'Enterprise-grade fraud protection and encrypted transactions' },
  { icon: Users, label: 'Creator Community', desc: 'Connect with top educational creators, brands, and organizations' },
];

const PRODUCT_TYPES = [
  { label: 'Lesson Plans', emoji: '📋' },
  { label: 'Curriculum', emoji: '📚' },
  { label: 'Assessments', emoji: '📝' },
  { label: 'E-Books', emoji: '📖' },
  { label: 'Courses', emoji: '🎓' },
  { label: 'Coaching', emoji: '🧠' },
  { label: 'Memberships', emoji: '🏆' },
  { label: 'Templates', emoji: '🗂️' },
  { label: 'Merchandise', emoji: '👕' },
  { label: 'Workshops', emoji: '🎯' },
  { label: 'Certifications', emoji: '🏅' },
  { label: 'Software & Tools', emoji: '⚙️' },
];

const STATS = [
  { value: '50K+', label: 'Active Creators' },
  { value: '$180M+', label: 'Creator Revenue' },
  { value: '2M+', label: 'Products Listed' },
  { value: '99.9%', label: 'Uptime SLA' },
];

export default function EduCartxHome() {
  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight">EduCartx™</span>
              <span className="text-white/20 text-[9px] font-bold ml-2 uppercase tracking-widest hidden sm:inline">by edXponential</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/educartx/marketplace">
              <Button variant="ghost" className="text-white/60 hover:text-white text-sm h-9">Browse</Button>
            </Link>
            <Link to="/educartx/dashboard">
              <Button className="bg-white text-black font-black text-sm h-9 px-5 hover:bg-white/90 rounded-full">
                Open Platform <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_60%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-white/50" />
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">AI-Powered Education Commerce</span>
            </div>
            <h1 className="font-heading text-5xl sm:text-7xl font-black tracking-tight leading-[1.0] mb-6">
              The Commerce<br />
              <span className="text-white/25">Platform for</span><br />
              Education.
            </h1>
            <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Sell everything. Build storefronts. Grow your brand. EduCartx™ is the Amazon + Shopify + Kajabi of education — powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/educartx/dashboard">
                <Button className="bg-white text-black font-black h-12 px-8 text-base rounded-full hover:bg-white/90 gap-2">
                  Start Selling <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/educartx/marketplace">
                <Button variant="outline" className="border-white/15 text-white h-12 px-8 text-base rounded-full hover:bg-white/5 gap-2">
                  <BookOpen className="w-4 h-4" /> Browse Marketplace
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/25 uppercase tracking-widest font-bold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Types */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-black mb-3">Sell Any Educational Product</h2>
            <p className="text-white/30 text-sm">From digital downloads to physical merchandise — one platform, infinite possibilities</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {PRODUCT_TYPES.map((pt, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 p-4 border border-white/6 rounded-xl bg-white/2 hover:bg-white/5 hover:border-white/12 transition-all cursor-default">
                <span className="text-2xl">{pt.emoji}</span>
                <span className="text-[10px] font-black text-white/40 text-center leading-tight">{pt.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-black mb-3">Everything You Need to Build an Education Empire</h2>
            <p className="text-white/30 text-sm max-w-xl mx-auto">Combine the best of Amazon, Shopify, Kajabi, Teachers Pay Teachers and more — in one AI-powered platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="border border-white/6 rounded-2xl p-6 bg-white/1 hover:bg-white/3 hover:border-white/12 transition-all">
                <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white/60" />
                </div>
                <h3 className="font-black text-sm text-white/80 mb-2">{f.label}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-8 h-8 text-black" />
          </div>
          <h2 className="font-heading text-4xl font-black mb-4">Ready to build your education empire?</h2>
          <p className="text-white/30 mb-10">Join thousands of creators, educators and schools already selling on EduCartx™</p>
          <Link to="/educartx/dashboard">
            <Button className="bg-white text-black font-black h-12 px-10 text-base rounded-full hover:bg-white/90 gap-2">
              Launch Your Storefront <Zap className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-white/15 text-xs">© 2026 EduCartx™ — Part of the edXponential Ecosystem</p>
      </footer>
    </div>
  );
}