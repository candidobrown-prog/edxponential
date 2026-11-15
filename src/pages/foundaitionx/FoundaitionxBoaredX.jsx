import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Users, Search, Sparkles, Loader2, Star, MapPin, Briefcase,
  ChevronRight, Filter, Plus, CheckCircle2, Brain, Award,
  DollarSign, Scale, Home, BarChart3, Zap, Heart, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const EXPERTISE_MAP = {
  legal: { icon: Scale, label: 'Legal' },
  finance: { icon: DollarSign, label: 'Finance' },
  fundraising: { icon: Heart, label: 'Fundraising' },
  academic: { icon: Award, label: 'Academic' },
  technology: { icon: Brain, label: 'Technology' },
  real_estate: { icon: Home, label: 'Real Estate' },
  operations: { icon: BarChart3, label: 'Operations' },
};

const DEMO_BOARD_CANDIDATES = [
  {
    id: 1, full_name: 'Dr. Angela Whitfield', title: 'Attorney & Education Advocate', location_city: 'Atlanta', location_state: 'GA',
    expertise: ['legal', 'academic', 'fundraising'], years_experience: 18, board_experience_years: 8,
    bio: 'Former school board attorney with 18 years in education law, charter school authorization, and governance compliance.',
    availability: 'immediate', fundraising_capacity: '25k_100k', ai_match_score: 96,
    previous_boards: 'KIPP Metro Atlanta, Atlanta Classical Academy'
  },
  {
    id: 2, full_name: 'Marcus Chen', title: 'CFO — Urban Schools Collaborative', location_city: 'Chicago', location_state: 'IL',
    expertise: ['finance', 'operations', 'technology'], years_experience: 22, board_experience_years: 11,
    bio: 'Education finance executive with experience building multi-million dollar school budgets and managing federal compliance.',
    availability: 'within_3_months', fundraising_capacity: '100k_plus', ai_match_score: 91,
    previous_boards: 'Noble Network, UNO Charter Schools'
  },
  {
    id: 3, full_name: 'Latoya Reeves', title: 'Real Estate Developer & Philanthropist', location_city: 'Houston', location_state: 'TX',
    expertise: ['real_estate', 'fundraising', 'finance'], years_experience: 15, board_experience_years: 6,
    bio: 'Commercial real estate developer who has facilitated facilities acquisition for 12 charter schools across Texas.',
    availability: 'within_3_months', fundraising_capacity: '100k_plus', ai_match_score: 88,
    previous_boards: 'YES Prep, KIPP Houston'
  },
  {
    id: 4, full_name: 'Dr. Priya Sharma', title: 'Curriculum & Instruction Expert', location_city: 'New York', location_state: 'NY',
    expertise: ['academic', 'technology'], years_experience: 20, board_experience_years: 4,
    bio: 'Former superintendent with expertise in STEM curriculum design, academic turnaround, and instructional leadership.',
    availability: 'within_6_months', fundraising_capacity: 'under_5k', ai_match_score: 82,
    previous_boards: 'Success Academy Advisory'
  },
  {
    id: 5, full_name: 'James Washington', title: 'Community Leader & Nonprofit Executive', location_city: 'Detroit', location_state: 'MI',
    expertise: ['fundraising', 'operations', 'legal'], years_experience: 25, board_experience_years: 14,
    bio: 'Led multiple nonprofit organizations with combined budgets over $50M. Deep community roots and donor network.',
    availability: 'immediate', fundraising_capacity: '100k_plus', ai_match_score: 79,
    previous_boards: 'Detroit Public Schools Community District Advisory'
  },
  {
    id: 6, full_name: 'Dr. Monica Ellis', title: 'HR Executive — National School Network', location_city: 'Denver', location_state: 'CO',
    expertise: ['academic', 'operations'], years_experience: 16, board_experience_years: 5,
    bio: 'Human resources and talent development executive for a national charter network with 85 schools.',
    availability: 'within_3_months', fundraising_capacity: '5k_25k', ai_match_score: 76,
    previous_boards: 'Denver School of Science & Technology'
  },
];

const STAGES = ['saved', 'outreach_sent', 'responded', 'interview_scheduled', 'interviewed', 'offered', 'accepted'];

export default function FoundaitionxBoaredX() {
  const [tab, setTab] = useState('discover');
  const [search, setSearch] = useState('');
  const [filterExpertise, setFilterExpertise] = useState('all');
  const [pipeline, setPipeline] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [schoolMission, setSchoolMission] = useState('');

  const filtered = DEMO_BOARD_CANDIDATES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.full_name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.location_state.toLowerCase().includes(q);
    const matchFilter = filterExpertise === 'all' || c.expertise.includes(filterExpertise);
    return matchSearch && matchFilter;
  });

  const addToPipeline = (candidate) => {
    if (pipeline.find(p => p.id === candidate.id)) return toast('Already in pipeline');
    setPipeline(prev => [...prev, { ...candidate, stage: 'saved' }]);
    toast.success(`${candidate.full_name} added to pipeline`);
  };

  const runAIMatch = async () => {
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert school governance consultant and board recruitment specialist.

A charter school founder with mission: "${schoolMission || 'To provide high-quality education to underserved students'}" is building their founding board.

Analyze the following 6 board candidates and provide recommendations:
${DEMO_BOARD_CANDIDATES.map(c => `- ${c.full_name} (${c.title}): Expertise in ${c.expertise.join(', ')}, ${c.board_experience_years} years board experience, fundraising capacity: ${c.fundraising_capacity}`).join('\n')}

Provide:
- top_picks (array of 5 names ranked by fit, with reason)
- governance_gaps (array of expertise areas missing)
- diversity_assessment (string)
- fundraising_capacity_total (estimated total)
- strategic_recommendation (paragraph)
- board_composition_recommendation (what the ideal board looks like)`,
        response_json_schema: {
          type: 'object',
          properties: {
            top_picks: { type: 'array', items: { type: 'object' } },
            governance_gaps: { type: 'array', items: { type: 'string' } },
            diversity_assessment: { type: 'string' },
            fundraising_capacity_total: { type: 'string' },
            strategic_recommendation: { type: 'string' },
            board_composition_recommendation: { type: 'string' },
          }
        }
      });
      setAiRecommendations(res);
      toast.success('AI board analysis complete!');
    } catch {
      toast.error('AI match failed');
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">BoaredX™</h1>
            <span className="text-[10px] font-black text-white/20 border border-white/10 px-1.5 py-0.5 rounded-full">Board Recruitment Engine</span>
          </div>
          <p className="text-xs text-white/30">AI-powered board member recruitment, matching, and governance network</p>
        </div>
        <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
          <Plus className="w-3.5 h-3.5" /> Create Board Profile
        </Button>
      </div>

      <div className="px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'discover', label: 'Discover Members' },
            { id: 'ai_match', label: 'AI Matching' },
            { id: 'pipeline', label: `Pipeline (${pipeline.length})` },
            { id: 'governance', label: 'Governance Center' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all ${tab === id ? 'bg-white text-black' : 'border border-white/15 text-white/40 hover:bg-white/5'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'discover' && (
          <>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-48 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search board candidates..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={() => setFilterExpertise('all')}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${filterExpertise === 'all' ? 'bg-white text-black' : 'border border-white/12 text-white/30 hover:bg-white/5'}`}>All</button>
                {Object.entries(EXPERTISE_MAP).map(([key, { label }]) => (
                  <button key={key} onClick={() => setFilterExpertise(key)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${filterExpertise === key ? 'bg-white text-black' : 'border border-white/12 text-white/30 hover:bg-white/5'}`}>{label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((candidate, i) => (
                <motion.div key={candidate.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border border-white/8 rounded-2xl p-5 bg-white/2 hover:border-white/15 hover:bg-white/3 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm text-white/50">
                        {candidate.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-black text-sm text-white">{candidate.full_name}</div>
                        <div className="text-[11px] text-white/35">{candidate.title}</div>
                      </div>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="font-black text-white text-sm">{candidate.ai_match_score}</div>
                      <div className="text-[9px] text-white/20">AI Match</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/35 mb-3 line-clamp-2">{candidate.bio}</p>
                  <div className="flex items-center gap-1 mb-3 flex-wrap">
                    {candidate.expertise.slice(0, 3).map(e => (
                      <span key={e} className="text-[10px] font-black border border-white/10 px-1.5 py-0.5 rounded-full text-white/30">
                        {EXPERTISE_MAP[e]?.label || e}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/25 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.location_city}, {candidate.location_state}</span>
                    <span>{candidate.board_experience_years}yr board exp</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => addToPipeline(candidate)} className="flex-1 bg-white text-black font-black text-[11px] hover:bg-white/90 rounded-lg h-7">
                      Add to Pipeline
                    </Button>
                    <button className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all">
                      <Mail className="w-3.5 h-3.5 text-white/30" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'ai_match' && (
          <div className="max-w-3xl space-y-5">
            <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
              <h3 className="font-black text-sm text-white mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-white/40" /> AI Board Matching Engine</h3>
              <input value={schoolMission} onChange={e => setSchoolMission(e.target.value)}
                placeholder="Describe your school's mission and the type of board members you need..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 mb-3" />
              <Button onClick={runAIMatch} disabled={aiLoading} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
                {aiLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing</> : <><Sparkles className="w-3.5 h-3.5" /> Run AI Match</>}
              </Button>
            </div>
            {aiRecommendations && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {aiRecommendations.strategic_recommendation && (
                  <div className="border border-white/8 rounded-xl p-5 bg-white/2">
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Strategic Recommendation</p>
                    <p className="text-sm text-white/55 leading-relaxed">{aiRecommendations.strategic_recommendation}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {aiRecommendations.governance_gaps?.length > 0 && (
                    <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                      <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-2">Governance Gaps</p>
                      {aiRecommendations.governance_gaps.map((g, i) => (
                        <div key={i} className="flex items-center gap-1.5 mb-1">
                          <Zap className="w-3 h-3 text-white/25" />
                          <span className="text-[11px] text-white/40">{g}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {aiRecommendations.diversity_assessment && (
                    <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                      <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-2">Diversity Assessment</p>
                      <p className="text-[11px] text-white/40">{aiRecommendations.diversity_assessment}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {tab === 'pipeline' && (
          <div className="space-y-4">
            {pipeline.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/25 text-sm">No candidates in pipeline. Discover and add board members.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {pipeline.map((c, i) => (
                  <div key={i} className="border border-white/8 rounded-xl p-4 bg-white/2 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center font-black text-sm text-white/50 flex-shrink-0">
                      {c.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-white">{c.full_name}</div>
                      <div className="text-[11px] text-white/30">{c.title}</div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {STAGES.map(stage => (
                        <button key={stage} onClick={() => setPipeline(prev => prev.map((p, j) => j === i ? { ...p, stage } : p))}
                          className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${c.stage === stage ? 'bg-white text-black' : 'border border-white/10 text-white/25 hover:bg-white/5'}`}>
                          {stage.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'governance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Board Roster', desc: '0 / 7 seats filled', icon: Users },
              { title: 'Committees', desc: 'Finance, Academic, Governance', icon: BarChart3 },
              { title: 'Next Meeting', desc: 'Not scheduled', icon: Zap },
              { title: 'Board Goals', desc: '0 active goals', icon: CheckCircle2 },
              { title: 'Documents', desc: 'Bylaws, minutes, policies', icon: Star },
              { title: 'Evaluations', desc: 'Annual board evaluation', icon: Award },
            ].map(({ title, desc, icon: Icon }, i) => (
              <div key={i} className="border border-white/8 rounded-2xl p-5 bg-white/2 hover:bg-white/3 hover:border-white/15 transition-all cursor-pointer">
                <Icon className="w-6 h-6 text-white/20 mb-3" />
                <div className="font-black text-sm text-white mb-1">{title}</div>
                <div className="text-[11px] text-white/30">{desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}