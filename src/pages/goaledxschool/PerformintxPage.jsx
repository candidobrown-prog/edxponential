import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ArrowLeft, Sparkles, RefreshCw, Save, Printer, Download,
  Target, CheckCircle, AlertCircle, Clock, TrendingUp, BarChart3,
  ChevronDown, ChevronUp, Star, Award, Zap, Calendar
} from 'lucide-react';

const STATUS_CONFIG = {
  on_track: { label: 'On Track', color: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  at_risk: { label: 'At Risk', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  behind: { label: 'Behind', color: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
  not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
  completed: { label: 'Completed', color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
};

const CAT_ICONS = { academic: BarChart3, culture: Users, staff: Star, operations: Target };

function GoalCard({ goal, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[goal.status] || STATUS_CONFIG.not_started;
  const Icon = CAT_ICONS[goal.category] || Target;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#0a0f1e] text-sm leading-tight">{goal.title}</p>
              <p className="text-xs text-gray-400 mt-1">Owner: <span className="font-bold text-gray-600">{goal.owner}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{status.label}
            </span>
            <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${
              goal.priority === 'high' ? 'bg-red-50 text-red-600' : goal.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
            }`}>{goal.priority}</span>
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
              {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
            <span className="text-xs font-black text-gray-600">{goal.progress || 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div className={`h-1.5 rounded-full transition-all ${
              (goal.progress || 0) >= 70 ? 'bg-green-500' : (goal.progress || 0) >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`} style={{ width: `${goal.progress || 0}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{goal.deadline}</span>
          <span className="flex items-center gap-1"><Target className="w-3 h-3" />{goal.target}</span>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 p-5 space-y-4 overflow-hidden">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Baseline</p>
                <p className="text-sm text-gray-700">{goal.baseline}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Evidence Source</p>
                <p className="text-sm text-gray-700">{goal.evidence_source}</p>
              </div>
            </div>
            {goal.checkpoints?.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Checkpoints</p>
                <div className="space-y-1.5">
                  {goal.checkpoints.map((cp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-full flex-shrink-0" />
                      <p className="text-xs text-gray-600">{cp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {goal.coaching_recommendations && (
              <div className="bg-[#0a0f1e] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-white/40" />
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Coaching Recommendations</p>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">{goal.coaching_recommendations}</p>
              </div>
            )}
            <div className="flex gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => onStatusChange(goal, key)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${goal.status === key ? cfg.color : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PerformintxPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [goals, setGoals] = useState(location.state?.goals || []);
  const [schoolContext, setSchoolContext] = useState(location.state?.schoolContext || {});
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showXIPPrompt, setShowXIPPrompt] = useState(false);
  const [generatingXIP, setGeneratingXIP] = useState(false);
  const [xip, setXip] = useState(null);

  const handleStatusChange = (goal, status) => {
    setGoals(prev => prev.map(g => g.title === goal.title ? { ...g, status } : g));
  };

  const handleGenerateFromScratch = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a sample Performintx™ dashboard with 8 SMART school goals covering academic, culture, staff, and operations categories. Include realistic school data. Return JSON: { "goals": [ { "title":"...", "category":"academic", "owner":"Principal Smith", "baseline":"42%", "target":"60%", "deadline":"June 2026", "evidence_source":"NWEA MAP", "checkpoints":["Q1 check","Q2 check","Q3 check"], "status":"not_started", "priority":"high", "coaching_recommendations":"...", "progress":0 } ] }`,
      model: 'claude_sonnet_4_6',
      response_json_schema: { type: 'object', properties: { goals: { type: 'array', items: { type: 'object', properties: { title:{type:'string'}, category:{type:'string'}, owner:{type:'string'}, baseline:{type:'string'}, target:{type:'string'}, deadline:{type:'string'}, evidence_source:{type:'string'}, checkpoints:{type:'array',items:{type:'string'}}, status:{type:'string'}, priority:{type:'string'}, coaching_recommendations:{type:'string'}, progress:{type:'number'} } } } } }
    });
    setGoals(result.goals || []);
    setGenerating(false);
  };

  const handleGenerateXIP = async () => {
    setGeneratingXIP(true);
    const goalsSummary = goals.map(g => `- ${g.title} | Owner: ${g.owner} | Target: ${g.target} | Deadline: ${g.deadline}`).join('\n');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert school improvement consultant. Generate a comprehensive Xschool Improvement Plan (XIP) based on these SMART goals:\n\n${goalsSummary}\n\nGenerate a full XIP including: Executive Summary, School Profile, School-Wide Goals, Academic Goals, Culture Goals, Coaching Plans, Observation Schedules, Department Goals, Assessment Plans, Progress Monitoring Plans, PD Plans, Accountability Structures, Timeline of Actions, Success Metrics, Quarterly Checkpoints, and Board-Facing Summary. Be specific, actionable, and comprehensive.`,
      model: 'claude_sonnet_4_6',
    });
    setXip(result);
    setGeneratingXIP(false);
    setShowXIPPrompt(false);
  };

  const filteredGoals = goals.filter(g => filter === 'all' || g.category === filter || g.status === filter);
  const stats = {
    total: goals.length,
    onTrack: goals.filter(g => g.status === 'on_track').length,
    atRisk: goals.filter(g => g.status === 'at_risk' || g.status === 'behind').length,
    notStarted: goals.filter(g => g.status === 'not_started').length,
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/goaled" className="flex items-center gap-1 text-white/30 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Goaled Xschool™
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Performintx™</h1>
              <p className="text-white/40 mt-1 text-sm">People Performance Intelligence Dashboard — every person, every goal, every deadline.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setShowXIPPrompt(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                <Sparkles className="w-4 h-4" /> AutoPopulate Master Plan (XIP)
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* XIP Prompt */}
        <AnimatePresence>
          {showXIPPrompt && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-[#0a0f1e] rounded-2xl p-8 text-center">
              <Sparkles className="w-10 h-10 text-white/30 mx-auto mb-3" />
              <h2 className="text-xl font-black text-white mb-2">Would you like to AutoPopulate a Master Plan?</h2>
              <p className="text-white/40 text-sm mb-6">The AI will generate a complete Xschool Improvement Plan (XIP) based on all your goals and school context.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={handleGenerateXIP} disabled={generatingXIP}
                  className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                  {generatingXIP ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating XIP...</> : <><Sparkles className="w-4 h-4" />Yes, Generate XIP</>}
                </button>
                <button onClick={() => setShowXIPPrompt(false)}
                  className="px-6 py-3.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                  Not Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XIP Output */}
        {xip && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">AI Generated</p>
                <h2 className="text-2xl font-black text-[#0a0f1e]">Xschool Improvement Plan (XIP)</h2>
              </div>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" /> Export XIP
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{xip}</pre>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Goals', value: stats.total, icon: Target, color: 'bg-[#0a0f1e]', dark: true },
            { label: 'On Track', value: stats.onTrack, icon: CheckCircle, color: 'bg-white' },
            { label: 'At Risk / Behind', value: stats.atRisk, icon: AlertCircle, color: 'bg-white' },
            { label: 'Not Started', value: stats.notStarted, icon: Clock, color: 'bg-white' },
          ].map(({ label, value, icon: Icon, color, dark }) => (
            <div key={label} className={`${color} rounded-2xl border border-gray-100 p-5`}>
              <Icon className={`w-4 h-4 mb-3 ${dark ? 'text-white/40' : 'text-gray-400'}`} />
              <p className={`text-3xl font-black ${dark ? 'text-white' : 'text-[#0a0f1e]'}`}>{value}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>{label}</p>
            </div>
          ))}
        </div>

        {goals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-black text-[#0a0f1e] mb-2">No Performance Goals Yet</h2>
            <p className="text-gray-400 text-sm mb-6">Complete Xschmart Goalx to generate your Performintx™ dashboard, or generate a sample.</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/goaled/xschmart-goalx"
                className="px-6 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all inline-flex items-center gap-2">
                <Target className="w-4 h-4" /> Go to Xschmart Goalx
              </Link>
              <button onClick={handleGenerateFromScratch} disabled={generating}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all inline-flex items-center gap-2">
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Sample
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['all', 'academic', 'culture', 'staff', 'operations', 'on_track', 'at_risk', 'not_started'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap capitalize transition-all ${filter === f ? 'bg-[#0a0f1e] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Goals Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredGoals.map((goal, i) => (
                <GoalCard key={i} goal={goal} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}