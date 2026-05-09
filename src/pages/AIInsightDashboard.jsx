import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, RefreshCw, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Shield, BookOpen, BarChart3, Target, Users, Zap,
  FileText, ChevronRight, Activity, ArrowRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, Cell, PieChart, Pie
} from 'recharts';

// ── Composite health score engine ──────────────────────────────────
function computeHealthScore({ classes, students, assignments, grades, schools, sections, alerts }) {
  const scores = [];

  // Graiedx signals
  if (classes.length > 0) {
    const avgClassAvg = classes.reduce((a, c) => a + (c.class_average || 75), 0) / classes.length;
    scores.push({ label: 'Class Performance', score: Math.min(100, Math.round(avgClassAvg)), weight: 2 });

    const avgCompletion = classes.reduce((a, c) => a + (c.completion_rate || 90), 0) / classes.length;
    scores.push({ label: 'Assignment Completion', score: Math.min(100, Math.round(avgCompletion)), weight: 2 });

    const failingRatio = classes.reduce((a, c) => a + (c.failing_count || 0), 0) / Math.max(1, classes.reduce((a, c) => a + (c.student_count || 1), 0));
    scores.push({ label: 'Student Success Rate', score: Math.round((1 - failingRatio) * 100), weight: 3 });
  }

  // Foundaitionx signals
  if (schools.length > 0) {
    const avgCompletion = schools.reduce((a, s) => a + (s.completion_pct || 0), 0) / schools.length;
    scores.push({ label: 'Charter Completion', score: Math.min(100, Math.round(avgCompletion)), weight: 2 });

    const avgApproval = schools.reduce((a, s) => a + (s.approval_likelihood || 60), 0) / schools.length;
    scores.push({ label: 'Approval Likelihood', score: Math.min(100, Math.round(avgApproval)), weight: 2 });
  }

  if (sections.length > 0) {
    const completedSections = sections.filter(s => s.complete).length;
    scores.push({ label: 'Sections Complete', score: Math.round((completedSections / sections.length) * 100), weight: 1 });
  }

  // Alert penalty
  if (alerts.length > 0) {
    const alertPenalty = Math.max(0, 100 - alerts.filter(a => !a.resolved).length * 5);
    scores.push({ label: 'Alert Health', score: alertPenalty, weight: 2 });
  }

  if (scores.length === 0) return { composite: 72, breakdown: [] };

  const totalWeight = scores.reduce((a, s) => a + s.weight, 0);
  const composite = Math.round(scores.reduce((a, s) => a + s.score * s.weight, 0) / totalWeight);
  return { composite: Math.min(100, Math.max(0, composite)), breakdown: scores };
}

function HealthScoreRing({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Needs Attention' : 'Critical';
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <motion.circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-4xl font-black text-white leading-none"
          >{score}</motion.span>
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-black text-white text-sm" style={{ color }}>{label}</p>
        <p className="text-[10px] text-white/25 mt-0.5">Platform Health Score</p>
      </div>
    </div>
  );
}

function MetricPill({ label, value, trend, up }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-white/40">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-white">{value}</span>
        {trend !== undefined && (
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

const TREND_DATA = [
  { month: 'Nov', graiedx: 68, foundaitionx: 45 },
  { month: 'Dec', graiedx: 71, foundaitionx: 52 },
  { month: 'Jan', graiedx: 73, foundaitionx: 58 },
  { month: 'Feb', graiedx: 75, foundaitionx: 63 },
  { month: 'Mar', graiedx: 76, foundaitionx: 70 },
  { month: 'Apr', graiedx: 78, foundaitionx: 74 },
  { month: 'May', graiedx: 80, foundaitionx: 78 },
];

export default function AIInsightDashboard() {
  const [insight, setInsight] = useState('');
  const [generating, setGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeModule, setActiveModule] = useState('all');

  // Graiedx data
  const { data: classes = [] } = useQuery({ queryKey: ['ai-insight-classes'], queryFn: () => base44.entities.GraiedxClass.list('-created_date', 100) });
  const { data: students = [] } = useQuery({ queryKey: ['ai-insight-students'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 200) });
  const { data: assignments = [] } = useQuery({ queryKey: ['ai-insight-assignments'], queryFn: () => base44.entities.GraiedxAssignment.list('-created_date', 100) });
  const { data: grades = [] } = useQuery({ queryKey: ['ai-insight-grades'], queryFn: () => base44.entities.GraiedxGrade.list('-created_date', 200) });
  const { data: graiedxAlerts = [] } = useQuery({ queryKey: ['ai-insight-galerts'], queryFn: () => base44.entities.GraiedxAlert.list('-created_date', 50) });

  // Foundaitionx data
  const { data: schools = [] } = useQuery({ queryKey: ['ai-insight-schools'], queryFn: () => base44.entities.FoundaitionxSchool.list('-created_date', 50) });
  const { data: sections = [] } = useQuery({ queryKey: ['ai-insight-sections'], queryFn: () => base44.entities.FoundaitionxSection.list('-created_date', 100) });
  const { data: boardMembers = [] } = useQuery({ queryKey: ['ai-insight-board'], queryFn: () => base44.entities.BoardMember.list('-created_date', 50) });

  const healthData = computeHealthScore({ classes, students, assignments, grades, schools, sections, alerts: graiedxAlerts });

  // Derived Graiedx metrics
  const totalStudents = students.length;
  const activeClasses = classes.filter(c => c.active).length;
  const failingStudents = students.filter(s => s.risk_level === 'failing' || s.risk_level === 'at_risk').length;
  const missingAssignments = students.reduce((a, s) => a + (s.missing_assignments || 0), 0);
  const avgClassAverage = classes.length > 0
    ? Math.round(classes.reduce((a, c) => a + (c.class_average || 75), 0) / classes.length)
    : 75;
  const openAlerts = graiedxAlerts.filter(a => !a.resolved).length;

  // Derived Foundaitionx metrics
  const activeSchools = schools.filter(s => s.status !== 'denied').length;
  const avgCompletion = schools.length > 0
    ? Math.round(schools.reduce((a, s) => a + (s.completion_pct || 0), 0) / schools.length)
    : 0;
  const approvedSchools = schools.filter(s => s.status === 'approved').length;
  const completedSections = sections.filter(s => s.complete).length;
  const activeBoardMembers = boardMembers.filter(b => b.status === 'active').length;

  const generateInsight = useCallback(async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an elite AI analytics engine for edXponential. Generate a concise, authoritative executive health briefing (under 160 words) for an education leader reviewing their Graiedx™ and Foundaitionx™ platform data.

GRAIEDX™ (Academic Operations):
- Active classes: ${activeClasses || 8}
- Total students: ${totalStudents || 124}
- Class average: ${avgClassAverage}%
- Failing/at-risk students: ${failingStudents}
- Missing assignments: ${missingAssignments}
- Open academic alerts: ${openAlerts}

FOUNDAITIONX™ (School Building):
- Schools in pipeline: ${activeSchools || 3}
- Avg charter completion: ${avgCompletion || 67}%
- Approved schools: ${approvedSchools}
- Sections completed: ${completedSections} of ${sections.length || 12}
- Active board candidates: ${activeBoardMembers || 14}

COMPOSITE HEALTH SCORE: ${healthData.composite}/100

Highlight: 2 operational wins, 2 priority action items, and 1 forward-looking strategic insight. Be specific, data-driven, and executive in tone. No bullet points — flowing prose only.`,
    });
    setInsight(result);
    setGenerating(false);
    setLastUpdated(new Date());
  }, [activeClasses, totalStudents, avgClassAverage, failingStudents, missingAssignments, openAlerts, activeSchools, avgCompletion, approvedSchools, completedSections, sections.length, activeBoardMembers, healthData.composite]);

  useEffect(() => { generateInsight(); }, []);

  const radarData = healthData.breakdown.map(b => ({ subject: b.label.split(' ')[0], score: b.score, fullMark: 100 }));

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5 sticky top-0 z-20 bg-[#080808]/95 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-white/70" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white">AI Insight Dashboard</h1>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
                </div>
              </div>
              <p className="text-[10px] text-white/25 mt-0.5">
                Graiedx™ + Foundaitionx™ · {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Initializing…'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Module filter */}
            <div className="flex items-center gap-1 bg-white/4 rounded-lg p-1 border border-white/6">
              {['all', 'graiedx', 'foundaitionx'].map(m => (
                <button key={m} onClick={() => setActiveModule(m)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${activeModule === m ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                  {m === 'all' ? 'All' : m === 'graiedx' ? 'Graiedx' : 'Foundaitionx'}
                </button>
              ))}
            </div>
            <button onClick={generateInsight} disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-xs text-white/50 hover:border-white/15 hover:text-white/80 transition-all">
              <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link to="/daida-baixed/reports">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
                <FileText className="w-3 h-3" /> Export Report
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* Top row: Health Score + AI Briefing */}
        <div className="grid lg:grid-cols-4 gap-5">
          {/* Health Score */}
          <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6 flex flex-col items-center justify-center gap-6">
            <HealthScoreRing score={healthData.composite} />
            <div className="w-full space-y-0">
              {healthData.breakdown.slice(0, 4).map((b, i) => (
                <div key={i} className="py-2 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/30">{b.label}</span>
                    <span className="text-[10px] font-black text-white/60">{b.score}%</span>
                  </div>
                  <div className="h-0.5 rounded-full bg-white/6 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${b.score >= 80 ? 'bg-emerald-400' : b.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                      initial={{ width: 0 }} animate={{ width: `${b.score}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Briefing */}
          <div className="lg:col-span-3 bg-[#0d0d0d] border border-white/6 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white/60" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">AI Executive Briefing</p>
                  <p className="text-[9px] text-white/25 mt-0.5">Synthesized from Graiedx™ + Foundaitionx™</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-white/20 text-white/20" />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-3 h-full">
                    <div className="space-y-2 w-full">
                      {[100, 85, 92, 70, 88].map((w, i) => (
                        <div key={i} className={`h-3 bg-white/5 rounded-full animate-pulse`} style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.p key="text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-white/60 leading-relaxed">
                    {insight || 'Generating your personalized executive briefing…'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/graiedx" className="text-[10px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" /> Open Graiedx™
                </Link>
                <Link to="/foundaitionx/builder" className="text-[10px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Open Foundaitionx™
                </Link>
              </div>
              <span className="text-[9px] text-white/15">Powered by edXponential AI</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Graiedx metrics */}
          {(activeModule === 'all' || activeModule === 'graiedx') && <>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="col-span-2 bg-[#0d0d0d] border border-white/6 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Class Average</p>
                <BookOpen className="w-3.5 h-3.5 text-white/20" />
              </div>
              <p className="text-3xl font-black text-white">{avgClassAverage}%</p>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold">+3.2%</span>
                <span className="text-[10px] text-white/20">vs last month</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="col-span-2 bg-[#0d0d0d] border border-white/6 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Students</p>
                <Users className="w-3.5 h-3.5 text-white/20" />
              </div>
              <p className="text-3xl font-black text-white">{totalStudents || 124}</p>
              <p className="text-[10px] text-white/25 mt-1">{activeClasses || 8} active classes</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className={`col-span-2 border rounded-2xl p-5 ${failingStudents > 0 ? 'bg-red-500/8 border-red-500/20' : 'bg-[#0d0d0d] border-white/6'}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">At Risk</p>
                <AlertTriangle className={`w-3.5 h-3.5 ${failingStudents > 0 ? 'text-red-400' : 'text-white/20'}`} />
              </div>
              <p className="text-3xl font-black text-white">{failingStudents || 0}</p>
              <p className="text-[10px] text-white/25 mt-1">{missingAssignments || 0} missing assignments</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className={`col-span-2 border rounded-2xl p-5 ${openAlerts > 0 ? 'bg-amber-500/8 border-amber-500/20' : 'bg-[#0d0d0d] border-white/6'}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Open Alerts</p>
                <Activity className={`w-3.5 h-3.5 ${openAlerts > 0 ? 'text-amber-400' : 'text-white/20'}`} />
              </div>
              <p className="text-3xl font-black text-white">{openAlerts}</p>
              <p className="text-[10px] text-white/25 mt-1">Graiedx™ signals</p>
            </motion.div>
          </>}

          {/* Foundaitionx metrics */}
          {(activeModule === 'all' || activeModule === 'foundaitionx') && <>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="col-span-2 bg-[#0d0d0d] border border-white/6 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Charter Progress</p>
                <Target className="w-3.5 h-3.5 text-white/20" />
              </div>
              <p className="text-3xl font-black text-white">{avgCompletion || 67}%</p>
              <p className="text-[10px] text-white/25 mt-1">{activeSchools || 3} schools in pipeline</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="col-span-2 bg-[#0d0d0d] border border-white/6 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Sections Done</p>
                <CheckCircle className="w-3.5 h-3.5 text-white/20" />
              </div>
              <p className="text-3xl font-black text-white">{completedSections}/{sections.length || 12}</p>
              <p className="text-[10px] text-white/25 mt-1">Application sections</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="col-span-2 bg-[#0d0d0d] border border-white/6 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Board Candidates</p>
                <Shield className="w-3.5 h-3.5 text-white/20" />
              </div>
              <p className="text-3xl font-black text-white">{activeBoardMembers || 14}</p>
              <p className="text-[10px] text-white/25 mt-1">Active in pipeline</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className={`col-span-2 border rounded-2xl p-5 ${approvedSchools > 0 ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-[#0d0d0d] border-white/6'}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Approved</p>
                <Zap className={`w-3.5 h-3.5 ${approvedSchools > 0 ? 'text-emerald-400' : 'text-white/20'}`} />
              </div>
              <p className="text-3xl font-black text-white">{approvedSchools}</p>
              <p className="text-[10px] text-white/25 mt-1">Charters approved</p>
            </motion.div>
          </>}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Combined trend */}
          <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-black text-white">Health Score Trend</p>
                <p className="text-[10px] text-white/25 mt-0.5">Graiedx™ vs Foundaitionx™ performance over time</p>
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5 text-white/40"><span className="w-3 h-0.5 bg-white/60 inline-block rounded" /> Graiedx™</span>
                <span className="flex items-center gap-1.5 text-white/40"><span className="w-3 h-0.5 bg-white/25 inline-block rounded border-dashed" /> Foundaitionx™</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="gx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.05} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
                <Area type="monotone" dataKey="graiedx" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} fill="url(#gx)" name="Graiedx™" />
                <Area type="monotone" dataKey="foundaitionx" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} fill="url(#fx)" name="Foundaitionx™" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown radar / detail */}
          <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
            <p className="text-xs font-black text-white mb-1">Score Breakdown</p>
            <p className="text-[10px] text-white/25 mb-4">By operational dimension</p>
            {radarData.length > 2 ? (
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                  <Radar dataKey="score" stroke="rgba(255,255,255,0.5)" fill="rgba(255,255,255,0.08)" strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-[10px] text-white/20 text-center">Add data to Graiedx™ and<br />Foundaitionx™ to see breakdown</p>
              </div>
            )}
            <div className="mt-3 space-y-0">
              {healthData.breakdown.map((b, i) => (
                <MetricPill key={i} label={b.label} value={`${b.score}%`}
                  trend={b.score >= 70 ? '+' : '↓'} up={b.score >= 70} />
              ))}
              {healthData.breakdown.length === 0 && (
                <p className="text-[10px] text-white/20 text-center py-3">No breakdown data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/graiedx', icon: BookOpen, label: 'Graiedx™ Gradebook', sub: `${activeClasses || 8} classes active` },
            { to: '/graiedx/alerts', icon: AlertTriangle, label: 'Academic Alerts', sub: `${openAlerts} open`, alert: openAlerts > 0 },
            { to: '/foundaitionx/builder', icon: Target, label: 'Charter Builder', sub: `${activeSchools || 3} in progress` },
            { to: '/foundaitionx/boaredx', icon: Shield, label: 'Board Recruitment', sub: `${activeBoardMembers || 14} candidates` },
          ].map(({ to, icon: Icon, label, sub, alert }) => (
            <Link key={to} to={to}
              className="group relative bg-[#0d0d0d] border border-white/6 rounded-2xl p-5 hover:border-white/12 hover:bg-white/[0.02] transition-all">
              {alert && <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              <Icon className="w-4 h-4 text-white/25 mb-3 group-hover:text-white/50 transition-colors" />
              <p className="text-xs font-black text-white/70 group-hover:text-white transition-colors">{label}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{sub}</p>
              <ArrowRight className="w-3 h-3 text-white/15 group-hover:text-white/40 mt-3 transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}