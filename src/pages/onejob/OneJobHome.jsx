import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, Building2, Users, Star, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const portals = [
  {
    role: 'Post a Job',
    icon: Building2,
    color: '#0a0f1e',
    light: '#f0f0f0',
    text: '#0a0f1e',
    desc: 'Find exceptional educators, leaders, and executives for your school or organization.',
    path: '/onejob/employer',
    cta: 'Post a Job',
  },
  {
    role: 'Find a Job',
    icon: Search,
    color: '#0a0f1e',
    light: '#f0f0f0',
    text: '#0a0f1e',
    desc: 'Discover premium education leadership roles matched to your experience and goals.',
    path: '/onejob/jobs',
    cta: 'Browse Jobs',
  },
  {
    role: 'Job Seeker Profile',
    icon: Users,
    color: '#0a0f1e',
    light: '#f0f0f0',
    text: '#0a0f1e',
    desc: 'Build your professional profile and let top education organizations find you.',
    path: '/onejob/seeker',
    cta: 'Build Profile',
  },
  {
    role: 'Admin Controls',
    icon: Shield,
    color: '#0a0f1e',
    light: '#f0f0f0',
    text: '#0a0f1e',
    desc: 'Manage all job posts, applicants, payments, and platform performance.',
    path: '/onejob/admin',
    cta: 'Admin Dashboard',
  },
];

const stats = [
  { label: 'Active Jobs', value: '2,400+' },
  { label: 'Education Organizations', value: '850+' },
  { label: 'Candidates Placed', value: '12,000+' },
  { label: 'Avg. Time to Hire', value: '18 days' },
];

export default function OneJobHome() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Hero */}
      <div className="bg-[#0a0f1e] text-white px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Briefcase className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm font-medium">by edXponential</span>
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tight">OneJob</h1>
          <p className="text-xl text-white/60 mb-3 font-light">The Premium Education Hiring Marketplace</p>
          <p className="text-white/40 max-w-2xl mx-auto text-base leading-relaxed">
            Connecting education leaders, founders, principals, and executives with the talent 
            that transforms schools and moves organizations forward.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link to="/onejob/employer">
              <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-bold px-6 h-11">Post a Job</Button>
            </Link>
            <Link to="/onejob/jobs">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold px-6 h-11">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#f8f8f8] border-b border-gray-200 px-8 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-[#0a0f1e]">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portal Cards */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-10">How can we help you?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {portals.map(({ role, icon: Icon, light, desc, path, cta }) => (
            <Link key={role} to={path}
              className="group block bg-white rounded-2xl border-2 border-gray-100 hover:border-[#0a0f1e] p-7 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0a0f1e] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-[#0a0f1e] text-lg mb-1">{role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-[#0a0f1e] text-sm font-bold">
                {cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pricing teaser */}
      <div className="bg-[#0a0f1e] text-white px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Simple, transparent pricing</h2>
          <p className="text-white/60 mb-8">From standard posts to executive searches — choose the level that fits your hiring needs.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { tier: 'Standard', price: '$199', desc: '30-day listing' },
              { tier: 'Featured', price: '$499', desc: '45-day + priority placement', highlight: true },
              { tier: 'Executive', price: '$999', desc: '60-day premium + search' },
            ].map(({ tier, price, desc, highlight }) => (
              <div key={tier} className={`rounded-2xl p-6 ${highlight ? 'bg-white text-[#0a0f1e]' : 'bg-white/10 border border-white/10'}`}>
                <p className={`font-black text-xl ${highlight ? 'text-[#0a0f1e]' : 'text-white'}`}>{tier}</p>
                <p className={`text-3xl font-black mt-2 ${highlight ? 'text-[#0a0f1e]' : 'text-white'}`}>{price}</p>
                <p className={`text-sm mt-1 ${highlight ? 'text-gray-500' : 'text-white/50'}`}>{desc}</p>
              </div>
            ))}
          </div>
          <Link to="/onejob/pricing" className="inline-block mt-8">
            <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-bold px-6">View Full Pricing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}