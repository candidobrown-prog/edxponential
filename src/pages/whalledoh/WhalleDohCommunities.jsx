import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Plus, Search, Globe, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import WhalleDohLayout from './WhalleDohLayout';

const CATEGORIES = ['All', 'Leadership', 'Teaching', 'Equity', 'EdTech', 'Coaching', 'Higher Ed', 'Special Ed'];

const COMMUNITIES = [
  { id: 1, name: 'Black Male Educators', emoji: '✊', members: 4200, category: 'Equity', privacy: 'public', description: 'A powerful community for Black male educators to connect, grow, and lead together.', featured: true },
  { id: 2, name: 'Montessori Leaders', emoji: '🌱', members: 1800, category: 'Teaching', privacy: 'public', description: 'Connecting Montessori educators and school leaders worldwide for collaboration and innovation.', featured: false },
  { id: 3, name: 'School Turnaround Leaders', emoji: '🔄', members: 3100, category: 'Leadership', privacy: 'public', description: 'Principals and superintendents who have transformed failing schools into places of excellence.', featured: true },
  { id: 4, name: 'AI in Education', emoji: '🧠', members: 7600, category: 'EdTech', privacy: 'public', description: 'Educators exploring how artificial intelligence is reshaping teaching, learning, and leadership.', featured: true },
  { id: 5, name: 'New Principals Network', emoji: '🏫', members: 2900, category: 'Leadership', privacy: 'public', description: 'Support network for first and second year principals navigating school leadership.', featured: false },
  { id: 6, name: 'District Superintendents', emoji: '🎓', members: 890, category: 'Leadership', privacy: 'private', description: 'Exclusive network for sitting superintendents and assistant superintendents.', featured: false },
  { id: 7, name: 'AP Biology Teachers', emoji: '🔬', members: 1400, category: 'Teaching', privacy: 'public', description: 'Advanced Placement Biology teachers sharing resources, labs, and instructional strategies.', featured: false },
  { id: 8, name: 'Teacher Coaches', emoji: '📋', members: 5200, category: 'Coaching', privacy: 'public', description: 'Instructional coaches and mentor teachers developing the next generation of educators.', featured: false },
  { id: 9, name: 'Equity in Education', emoji: '⚖️', members: 6100, category: 'Equity', privacy: 'public', description: 'Educators committed to closing opportunity gaps and building equitable school systems.', featured: true },
  { id: 10, name: 'EdTech Founders', emoji: '🚀', members: 2300, category: 'EdTech', privacy: 'public', description: 'Founders building products, platforms, and companies that transform education.', featured: false },
  { id: 11, name: 'Special Educators Network', emoji: '💡', members: 3800, category: 'Special Ed', privacy: 'public', description: 'Special education teachers, case managers, and inclusion specialists.', featured: false },
  { id: 12, name: 'Education Researchers', emoji: '📊', members: 1100, category: 'Higher Ed', privacy: 'public', description: 'Researchers, professors, and practitioners bridging the gap between academia and the classroom.', featured: false },
];

function CommunityCard({ c }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/15 transition-all group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">{c.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white font-black text-sm">{c.name}</span>
            {c.featured && <span className="text-[9px] font-black bg-white text-[#07080f] rounded px-1.5 py-0.5">HOT</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-white/35 text-xs"><Users className="w-2.5 h-2.5" />{c.members.toLocaleString()} members</span>
            <span className="flex items-center gap-1 text-white/30 text-xs">
              {c.privacy === 'public' ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
              {c.privacy}
            </span>
          </div>
        </div>
      </div>
      <p className="text-white/40 text-xs leading-relaxed mb-4">{c.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/30 border border-white/[0.07] rounded-full px-2 py-0.5 font-semibold">{c.category}</span>
        <button className="flex items-center gap-1.5 bg-white text-[#07080f] font-black text-xs px-3 py-2 rounded-xl hover:bg-gray-100 transition-all">
          <Plus className="w-3 h-3" /> Join
        </button>
      </div>
    </motion.div>
  );
}

export default function WhalleDohCommunities() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = COMMUNITIES.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <WhalleDohLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Communities</h1>
            <p className="text-white/40 text-sm">Private networks built for educators who lead, teach, and transform.</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-[#07080f] font-black text-sm px-4 py-3 rounded-xl hover:bg-gray-100 transition-all">
            <Plus className="w-4 h-4" /> Create Community
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-5 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search communities..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25" />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${category === c ? 'bg-white text-[#07080f]' : 'bg-white/[0.05] text-white/40 hover:text-white hover:bg-white/10'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => <CommunityCard key={c.id} c={c} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/25 text-lg font-black mb-2">No communities found.</p>
            <button className="inline-flex items-center gap-2 bg-white text-[#07080f] font-black px-5 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all">
              <Plus className="w-4 h-4" /> Create this community
            </button>
          </div>
        )}
      </div>
    </WhalleDohLayout>
  );
}