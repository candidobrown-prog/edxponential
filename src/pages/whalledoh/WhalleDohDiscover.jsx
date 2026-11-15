import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, MapPin, Star, ArrowRight, Zap, X, MessageSquare } from 'lucide-react';
import WhalleDohLayout from './WhalleDohLayout';

const ROLES = ['All', 'Teacher', 'Principal', 'Superintendent', 'Coach', 'Professor', 'Founder', 'Counselor', 'Researcher', 'Tutor'];
const SUBJECTS = ['All', 'Math', 'Literacy', 'STEM', 'Special Ed', 'Arts', 'Science', 'History', 'ELL', 'PE'];
const LOCATIONS = ['All', 'United States', 'United Kingdom', 'Canada', 'Nigeria', 'South Africa', 'Mexico', 'Brazil', 'India', 'Australia'];

const EDUCATORS = [
  { id: 1, name: 'Dr. Angela Morris', role: 'Superintendent', subject: 'Literacy', location: 'Chicago, IL', years: 18, emoji: '🎓', verified: true, featured: true, bio: 'Literacy transformation leader with 18 years of district-wide impact.', tags: ['Literacy', 'Leadership', 'District-wide'] },
  { id: 2, name: 'Marcus Johnson', role: 'Principal', subject: 'All', location: 'Atlanta, GA', years: 12, emoji: '🏫', verified: true, featured: false, bio: 'School turnaround specialist. Took KIPP Atlanta from 42% to 89% proficiency.', tags: ['Turnaround', 'Culture', 'Principal'] },
  { id: 3, name: 'Priya Nair', role: 'Founder', subject: 'STEM', location: 'Austin, TX', years: 9, emoji: '📐', verified: false, featured: true, bio: 'EdTech founder building AI-powered STEM curriculum for underserved communities.', tags: ['STEM', 'EdTech', 'AI'] },
  { id: 4, name: 'Carlos Rivera', role: 'Coach', subject: 'Math', location: 'Los Angeles, CA', years: 14, emoji: '🤝', verified: true, featured: false, bio: 'Instructional coach specializing in math pedagogy and classroom management.', tags: ['Math', 'Coaching', 'PD'] },
  { id: 5, name: 'Sarah Kim', role: 'Teacher', subject: 'Special Ed', location: 'New York, NY', years: 7, emoji: '💡', verified: false, featured: false, bio: 'Special education teacher, IEP specialist, and inclusion advocate.', tags: ['Special Ed', 'IEP', 'Inclusion'] },
  { id: 6, name: 'James Okafor', role: 'Founder', subject: 'All', location: 'Houston, TX', years: 5, emoji: '🚀', verified: true, featured: true, bio: 'Founder of AI-powered tutoring platform serving 12,000 students across Texas.', tags: ['AI', 'EdTech', 'Tutoring'] },
  { id: 7, name: 'Dr. Keisha Brown', role: 'Professor', subject: 'Literacy', location: 'Philadelphia, PA', years: 22, emoji: '📚', verified: true, featured: false, bio: 'Professor of Education at Temple University, published author on literacy equity.', tags: ['Higher Ed', 'Literacy', 'Research'] },
  { id: 8, name: 'Thomas White', role: 'Counselor', subject: 'All', location: 'Detroit, MI', years: 10, emoji: '🌱', verified: false, featured: false, bio: 'School counselor helping at-risk youth navigate academic and social-emotional challenges.', tags: ['Counseling', 'SEL', 'Equity'] },
  { id: 9, name: 'Aisha Patel', role: 'Researcher', subject: 'All', location: 'Boston, MA', years: 6, emoji: '🔬', verified: true, featured: false, bio: 'Education researcher at Harvard GSE focused on equity in K-12 outcomes.', tags: ['Research', 'Harvard', 'Equity'] },
];

function EducatorCard({ educator, onConnect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/15 transition-all group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">{educator.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white font-black text-sm">{educator.name}</span>
            {educator.verified && <CheckCircle className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />}
            {educator.featured && <span className="text-[9px] font-black bg-white text-[#07080f] rounded px-1.5 py-0.5">FEATURED</span>}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="text-white/40 text-xs">{educator.role}</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="flex items-center gap-1 text-white/35 text-xs"><MapPin className="w-2.5 h-2.5" />{educator.location}</span>
          </div>
        </div>
        <span className="text-white/25 text-xs font-semibold shrink-0">{educator.years}y exp</span>
      </div>
      <p className="text-white/45 text-xs leading-relaxed mb-3">{educator.bio}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {educator.tags.map(t => (
          <span key={t} className="text-[10px] text-white/40 border border-white/[0.08] rounded-full px-2 py-0.5 font-semibold">{t}</span>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onConnect(educator)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white text-[#07080f] font-black text-xs py-2.5 rounded-xl hover:bg-gray-100 transition-all">
          <MessageSquare className="w-3.5 h-3.5" /> Connect
        </button>
        <Link to="/whalledoh/ai"
          className="flex items-center gap-1.5 border border-white/10 text-white/50 font-bold text-xs px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-all">
          <Zap className="w-3.5 h-3.5" /> WhallAI
        </Link>
      </div>
    </motion.div>
  );
}

function ConnectModal({ educator, onClose }) {
  const [step, setStep] = useState('method'); // method | message
  const [method, setMethod] = useState(null);
  const [message, setMessage] = useState(`Hi ${educator?.name?.split(' ')[0]}, I came across your profile on WhalleDoh and I'm inspired by your work in ${educator?.tags?.[0] || 'education'}. I'd love to connect and explore ways we might collaborate. Would you be open to a quick conversation?`);

  if (!educator) return null;
  const methods = ['Platform Message', 'Email', 'LinkedIn', 'Instagram', 'Direct Message'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0e0f1a] border border-white/10 rounded-3xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-4 h-4" /></button>

        {step === 'method' && (
          <>
            <h3 className="text-white font-black text-lg mb-1">Connect with {educator.name}</h3>
            <p className="text-white/40 text-sm mb-5">WhallAI will draft a personalized message. How would you like to reach out?</p>
            <div className="space-y-2 mb-5">
              {methods.map(m => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${method === m ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/50 hover:border-white/25'}`}>
                  {m}
                </button>
              ))}
            </div>
            <button disabled={!method} onClick={() => setStep('message')}
              className="w-full bg-white text-[#07080f] font-black py-3 rounded-xl disabled:opacity-25 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm">
              Draft Message with WhallAI <Zap className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {step === 'message' && (
          <>
            <h3 className="text-white font-black text-lg mb-1">Your Introduction</h3>
            <p className="text-white/40 text-sm mb-4">WhallAI drafted this personalized message. Edit it freely.</p>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm resize-none focus:outline-none focus:border-white/25 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setStep('method')} className="px-4 py-3 border border-white/10 text-white/50 font-bold text-sm rounded-xl hover:border-white/25 transition-all">Back</button>
              <button onClick={onClose} className="flex-1 bg-white text-[#07080f] font-black py-3 rounded-xl hover:bg-gray-100 transition-all text-sm">
                Send via {method}
              </button>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={onClose} className="flex-1 border border-white/10 text-white/40 font-bold text-xs py-2 rounded-xl hover:bg-white/5 transition-all">Save Draft</button>
              <button onClick={onClose} className="flex-1 border border-white/10 text-white/40 font-bold text-xs py-2 rounded-xl hover:bg-white/5 transition-all">Schedule Outreach</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function WhalleDohDiscover() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [connectingTo, setConnectingTo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = EDUCATORS.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.bio.toLowerCase().includes(search.toLowerCase()) || e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchRole = roleFilter === 'All' || e.role === roleFilter;
    const matchSubject = subjectFilter === 'All' || e.subject === subjectFilter || e.tags.some(t => t === subjectFilter);
    return matchSearch && matchRole && matchSubject;
  });

  return (
    <WhalleDohLayout>
      {connectingTo && <ConnectModal educator={connectingTo} onClose={() => setConnectingTo(null)} />}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Discover Educators</h1>
          <p className="text-white/40 text-sm">Search, filter, and connect with brilliant educators worldwide.</p>
        </div>

        {/* Search + Filter row */}
        <div className="flex gap-3 mb-6 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role, expertise..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${showFilters ? 'border-white text-white bg-white/10' : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white'}`}>
            <Filter className="w-4 h-4" /> Filters
          </button>
          <Link to="/whalledoh/ai"
            className="flex items-center gap-2 bg-white text-[#07080f] font-black px-4 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all">
            <Zap className="w-4 h-4" /> Ask WhallAI
          </Link>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white/30 mb-2">Role</p>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${roleFilter === r ? 'bg-white text-[#07080f]' : 'bg-white/[0.05] text-white/40 hover:text-white hover:bg-white/10'}`}>{r}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white/30 mb-2">Subject / Expertise</p>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS.map(s => (
                  <button key={s} onClick={() => setSubjectFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${subjectFilter === s ? 'bg-white text-[#07080f]' : 'bg-white/[0.05] text-white/40 hover:text-white hover:bg-white/10'}`}>{s}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-white/35 text-sm font-semibold">{filtered.length} educator{filtered.length !== 1 ? 's' : ''} found</p>
          {(roleFilter !== 'All' || subjectFilter !== 'All' || search) && (
            <button onClick={() => { setRoleFilter('All'); setSubjectFilter('All'); setSearch(''); }} className="text-xs text-white/30 font-bold hover:text-white/60 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(e => <EducatorCard key={e.id} educator={e} onConnect={setConnectingTo} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/25 text-lg font-black mb-2">No educators found.</p>
            <p className="text-white/20 text-sm mb-5">Try asking WhallAI instead — it searches beyond our platform.</p>
            <Link to="/whalledoh/ai" className="inline-flex items-center gap-2 bg-white text-[#07080f] font-black px-5 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all">
              <Zap className="w-4 h-4" /> Ask WhallAI
            </Link>
          </div>
        )}
      </div>
    </WhalleDohLayout>
  );
}