import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, BarChart3, Users, DollarSign, Play, Video, Radio, BookOpen, Plus, TrendingUp, Eye, Star } from 'lucide-react';

const STATS = [
  { label: 'Total Views', value: '142.8K', trend: '+12%', icon: Eye },
  { label: 'Subscribers', value: '4,820', trend: '+8%', icon: Users },
  { label: 'Revenue', value: '$2,340', trend: '+21%', icon: DollarSign },
  { label: 'Avg Rating', value: '4.87', trend: '+0.2', icon: Star },
];

const MY_VIDEOS = [
  { title: 'AI in Literacy Instruction', views: '14.2K', duration: '32 min', status: 'published' },
  { title: 'Coaching for Growth', views: '9.8K', duration: '28 min', status: 'published' },
  { title: 'The Principal\'s Playbook', views: '—', duration: '45 min', status: 'draft' },
];

const TABS = ['Overview', 'Videos', 'Analytics', 'Monetize', 'AI Studio'];

export default function TiliiStudio() {
  const [tab, setTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-8 px-6 pb-20" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-1">Creator Dashboard</p>
            <h1 className="text-2xl font-black text-white">Your Studio.</h1>
          </div>
          <button className="flex items-center gap-2 bg-white text-black font-black text-sm px-5 py-2.5 rounded-xl hover:bg-zinc-100 transition-all">
            <Plus className="w-4 h-4" /> Upload Video
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${tab === t ? 'bg-white text-black' : 'text-white/35 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(({ label, value, trend, icon: Icon }) => (
                <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white/25 text-[10px] font-black uppercase tracking-wider">{label}</p>
                    <Icon className="w-3.5 h-3.5 text-white/20" />
                  </div>
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-xs font-bold text-emerald-400 mt-1">{trend} this month</p>
                </div>
              ))}
            </div>

            {/* Recent videos */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">Your Videos</p>
              <div className="space-y-2">
                {MY_VIDEOS.map((v, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:bg-white/[0.05] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <Video className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/85 font-black text-sm truncate">{v.title}</p>
                      <p className="text-white/30 text-xs">{v.duration}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white/55 text-xs font-bold">{v.views} views</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${v.status === 'published' ? 'bg-white/10 text-white/60' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Upload, label: 'Upload Video' },
                { icon: Radio, label: 'Go Live' },
                { icon: Zap, label: 'AI Studio' },
                { icon: DollarSign, label: 'Monetize' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex items-center gap-2 p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:bg-white/[0.06] hover:border-white/15 transition-all text-sm font-bold text-white/55 hover:text-white">
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'AI Studio' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.07] flex items-center justify-center mx-auto mb-5">
              <Zap className="w-6 h-6 text-white/50" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">AI Studio</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-8">Generate scripts, summaries, chapters, subtitles, translations, and SEO metadata for any video — in seconds.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
              {['Generate Script', 'AI Chapters', 'Auto Captions', 'Translate Video', 'SEO Metadata', 'AI Summary'].map(f => (
                <button key={f} className="bg-white/[0.05] border border-white/[0.08] rounded-xl py-2.5 text-xs font-black text-white/55 hover:bg-white/10 hover:text-white transition-all">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {(tab === 'Videos' || tab === 'Analytics' || tab === 'Monetize') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-12 text-center">
            <TrendingUp className="w-10 h-10 text-white/15 mx-auto mb-4" />
            <p className="text-white/35 font-black text-sm">More features coming soon.</p>
            <p className="text-white/20 text-xs mt-1">Upload your first video to unlock full {tab} tools.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}