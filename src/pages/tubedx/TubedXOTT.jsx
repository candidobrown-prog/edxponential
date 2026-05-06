import React, { useState } from 'react';
import { Tv, Play, CheckCircle, Star, Users, DollarSign, Globe, Lock, Plus, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const OTT_FEATURES = [
  'Netflix-style streaming interface',
  'iOS & Android mobile apps',
  'Apple TV & Roku support',
  'Monthly/annual subscriptions',
  'Pay-per-view & rentals',
  'Custom channel branding',
  'Subscriber analytics',
  'Automated content delivery',
];

const CHANNEL_TYPES = [
  { icon: BookOpen, title: 'Streaming Academy', desc: 'Full curriculum in a Netflix-style hub for teachers and students' },
  { icon: Users, title: 'Leadership Channel', desc: 'Premium video membership for district and network leaders' },
  { icon: Star, title: 'Training Hub', desc: 'Professional development and PD library for educators' },
  { icon: DollarSign, title: 'Investor Media', desc: 'Private investment content, deal rooms, and pitches' },
];

function BookOpenIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
const BookOpen = BookOpenIcon;

export default function TubedXOTT() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">TubedX™</p>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Tv className="w-4 h-4 text-white" />
              </div>
              OTT Platform
            </h1>
            <p className="text-white/30 text-sm mt-1">Launch your own Netflix-style streaming channel for education</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
            <Plus className="w-4 h-4" /> Launch Channel
          </button>
        </div>
        <div className="max-w-7xl mx-auto mt-5 flex gap-1">
          {['overview', 'channels', 'monetization', 'distribution'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-[#0a0f1e]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Hero Banner */}
            <div className="bg-[#0a0f1e] rounded-2xl p-8 flex items-center justify-between flex-wrap gap-6">
              <div className="max-w-lg">
                <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-3">TubedX OTT</p>
                <h2 className="text-3xl font-black text-white mb-3">Your Own Streaming Channel</h2>
                <p className="text-white/50 leading-relaxed mb-6">Launch a fully branded Netflix-style OTT channel for your school, network, or education brand. Stream to iOS, Android, Apple TV, Roku, and Smart TVs.</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {OTT_FEATURES.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                      <span className="text-white/50 text-xs">{f}</span>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                  <Tv className="w-4 h-4" /> Launch Your OTT Channel
                </button>
              </div>
              <div className="hidden lg:flex w-64 h-48 bg-white/5 border border-white/10 rounded-2xl items-center justify-center">
                <Tv className="w-20 h-20 text-white/10" />
              </div>
            </div>

            {/* Channel Types */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">OTT Channel Types</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {CHANNEL_TYPES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#0a0f1e] transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#0a0f1e] transition-all">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-all" />
                    </div>
                    <h3 className="font-black text-[#0a0f1e] text-sm mb-2">{title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'monetization' && (
          <div className="space-y-6">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Monetization Options</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: DollarSign, title: 'Monthly Subscription', desc: 'Charge monthly access to your full channel library', price: '$5–$99/mo' },
                { icon: Globe, title: 'Annual Subscription', desc: 'Annual memberships with discounted rates', price: '$49–$999/yr' },
                { icon: Play, title: 'Pay-Per-View', desc: 'Charge for individual premium events or classes', price: '$5–$299/event' },
                { icon: Lock, title: 'Course Rental', desc: 'Time-limited access to specific courses or series', price: '$10–$149' },
              ].map(({ icon: Icon, title, desc, price }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <Icon className="w-5 h-5 text-gray-400 mb-4" />
                  <h3 className="font-black text-[#0a0f1e] mb-2">{title}</h3>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">{desc}</p>
                  <span className="text-xs font-black text-[#0a0f1e] bg-gray-100 px-3 py-1.5 rounded-full">{price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="space-y-6">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Distribution Platforms</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['iOS App', 'Android App', 'Apple TV', 'Roku', 'Fire TV', 'Web Browser', 'Smart TV', 'Chromecast', 'Desktop App', 'iPad'].map(p => (
                <div key={p} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-[#0a0f1e] transition-all cursor-pointer">
                  <Tv className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="font-black text-sm text-[#0a0f1e]">{p}</p>
                  <p className="text-xs text-gray-400 mt-1">Available</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <Tv className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-300">No OTT channels yet.</p>
            <p className="text-sm text-gray-300 mt-1">Launch your first channel to start streaming.</p>
            <button className="mt-4 px-6 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm">
              <Plus className="w-4 h-4 inline mr-2" />Launch Channel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}