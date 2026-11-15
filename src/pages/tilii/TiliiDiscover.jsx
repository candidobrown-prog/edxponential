import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Search, Zap, Filter, Star } from 'lucide-react';

const CATEGORIES = ['All', 'Education', 'Leadership', 'AI & Tech', 'Wellness', 'Entrepreneurship', 'Coaching', 'Storytelling', 'Culture'];
const TYPES = ['All', 'Masterclass', 'Documentary', 'Series', 'Talk', 'Podcast', 'Live'];

const ALL_VIDEOS = [
  { title: 'The Future of AI in Education', creator: 'Dr. Marcus Webb', type: 'Masterclass', cat: 'AI & Tech', duration: '48 min', views: '142K', rating: 4.9, thumb: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&auto=format' },
  { title: 'Leading Schools Through Crisis', creator: 'Principal K. Adeyemi', type: 'Documentary', cat: 'Leadership', duration: '1h 12min', views: '98K', rating: 4.8, thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format' },
  { title: 'Building a Culture of Excellence', creator: 'edXponential Studio', type: 'Series', cat: 'Culture', duration: '6 Ep.', views: '210K', rating: 4.95, thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format' },
  { title: 'Literacy Revolution', creator: 'Dr. Amara Nwosu', type: 'Talk', cat: 'Education', duration: '22 min', views: '55K', rating: 4.7, thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80&auto=format' },
  { title: 'The Founder\'s Blueprint', creator: 'James Okafor', type: 'Masterclass', cat: 'Entrepreneurship', duration: '3h 20min', views: '188K', rating: 4.9, thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&auto=format' },
  { title: 'Mindful Leadership', creator: 'Priya Nair', type: 'Series', cat: 'Wellness', duration: '8 Ep.', views: '76K', rating: 4.8, thumb: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80&auto=format' },
  { title: 'The Coaching Code', creator: 'Marcus Bell', type: 'Masterclass', cat: 'Coaching', duration: '2h 10min', views: '64K', rating: 4.85, thumb: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80&auto=format' },
  { title: 'Why Stories Change the World', creator: 'Aisha Diallo', type: 'Talk', cat: 'Storytelling', duration: '18 min', views: '44K', rating: 4.75, thumb: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=80&auto=format' },
  { title: 'Math for Everyone', creator: 'Prof. Li Chen', type: 'Series', cat: 'Education', duration: '12 Ep.', views: '130K', rating: 4.9, thumb: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format' },
];

export default function TiliiDiscover() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [type, setType] = useState('All');

  const filtered = ALL_VIDEOS.filter(v =>
    (cat === 'All' || v.cat === cat) &&
    (type === 'All' || v.type === type) &&
    (v.title.toLowerCase().includes(search.toLowerCase()) || v.creator.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-8 px-6 pb-20" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 mb-3">
            <Zap className="w-3 h-3 text-white/35" />
            <span className="text-white/35 text-[10px] tracking-widest uppercase font-black">AI-Powered Discovery</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Discover.</h1>
          <p className="text-white/35 text-sm">Curated by intelligence. Built for growth.</p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search videos, creators, topics…"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pl-11 pr-5 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 max-w-xl" />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`flex-shrink-0 text-[11px] font-black uppercase tracking-wider rounded-full px-3.5 py-1.5 transition-all ${cat === c ? 'bg-white text-black' : 'border border-white/[0.08] text-white/35 hover:text-white hover:border-white/20'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-shrink-0 text-[11px] font-semibold rounded-lg px-3 py-1 transition-all ${type === t ? 'bg-white/10 text-white border border-white/20' : 'text-white/30 hover:text-white/60'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 mb-3 relative">
                <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider text-white/60 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-white/[0.08]">{v.type}</span>
                <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-white/50 fill-white/30" />
                  <span className="text-[10px] text-white/50 font-bold">{v.rating}</span>
                </div>
              </div>
              <p className="text-white/85 text-xs font-black leading-snug line-clamp-2 mb-1">{v.title}</p>
              <p className="text-white/30 text-[11px] font-semibold">{v.creator}</p>
              <p className="text-white/20 text-[10px] mt-0.5">{v.duration} · {v.views} views</p>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/25 text-sm font-black">No results found.</p>
            <p className="text-white/15 text-xs mt-1">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}