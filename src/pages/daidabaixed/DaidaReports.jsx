import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, Download, Brain, BarChart3, Shield, Users, Target,
  Calendar, TrendingUp, AlertTriangle, ChevronRight, Clock, CheckCircle,
  Printer, Copy, RefreshCw, Filter, Star, Activity, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

const REPORT_TYPES = [
  {
    id: 'executive',
    icon: BarChart3,
    label: 'Executive Summary',
    badge: 'Board-Ready',
    desc: 'Full school health overview for leadership and board presentations',
    tags: ['Academic', 'SPED', 'Culture', 'Alerts'],
    featured: true,
  },
  {
    id: 'academic',
    icon: TrendingUp,
    label: 'Academic Performance',
    badge: 'Data-Driven',
    desc: 'Proficiency, growth, subgroup gaps, and grade-level analysis',
    tags: ['Proficiency', 'Growth', 'Subgroups'],
  },
  {
    id: 'sped',
    icon: Shield,
    label: 'SPED Compliance',
    badge: 'Legal Compliance',
    desc: 'IEP timelines, service minutes, compliance risk flags, and goal progress',
    tags: ['IEPs', 'Services', 'Goals', 'Risk'],
  },
  {
    id: 'culture',
    icon: Activity,
    label: 'Culture & Climate',
    badge: 'Whole School',
    desc: 'Attendance, behavior, engagement, and school climate indicators',
    tags: ['Attendance', 'Behavior', 'Engagement'],
  },
  {
    id: 'goals',
    icon: Target,
    label: 'Goal Progress',
    badge: 'Accountability',
    desc: 'SMART goal completion, accountability tracking, and recovery planning',
    tags: ['SMART Goals', 'Progress', 'Accountability'],
  },
  {
    id: 'staff',
    icon: Users,
    label: 'Staff Performance',
    badge: 'HR Intelligence',
    desc: 'Observation scores, coaching cycles, PD participation, and morale',
    tags: ['Observations', 'Coaching', 'PD'],
  },
  {
    id: 'alerts',
    icon: AlertTriangle,
    label: 'Alerts & Interventions',
    badge: 'Action-Oriented',
    desc: 'Open alerts, resolution rates, escalated issues, and recommended actions',
    tags: ['Open Alerts', 'Escalations', 'Actions'],
  },
  {
    id: 'forecast',
    icon: Brain,
    label: 'AI Predictive Forecast',
    badge: 'AI-Powered',
    desc: 'Predictive analytics, risk students, year-end projections, and trends',
    tags: ['Predictions', 'Trends', 'Year-End'],
  },
];

const AUDIENCES = [
  { value: 'principal', label: 'Principal' },
  { value: 'superintendent', label: 'Superintendent' },
  { value: 'board', label: 'Board of Directors' },
  { value: 'sped_coordinator', label: 'SPED Coordinator' },
  { value: 'instructional_coach', label: 'Instructional Coach' },
  { value: 'parent_community', label: 'Parent Community' },
];

const PERIODS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'semester', label: 'This Semester' },
  { value: 'ytd', label: 'Year-to-Date' },
];

export default function DaidaReports() {
  const [selectedType, setSelectedType] = useState(null);
  const [report, setReport] = useState('');
  const [generating, setGenerating] = useState(false);
  const [audience, setAudience] = useState('principal');
  const [period, setPeriod] = useState('month');
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const { data: spedStudents = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });
  const { data: spedServices = [] } = useQuery({ queryKey: ['sped-services'], queryFn: () => base44.entities.SpedService.list('-created_date', 200) });
  const { data: spedGoals = [] } = useQuery({ queryKey: ['sped-goals'], queryFn: () => base44.entities.SpedGoal.list('-created_date', 200) });
  const { data: alerts = [] } = useQuery({ queryKey: ['xscores-alerts'], queryFn: () => base44.entities.XscoresAlert.list('-created_date', 100) });

  const today = new Date().toISOString().split('T')[0];
  const avgCompliance = spedServices.length ? Math.round(spedServices.reduce((a, s) => a + (s.compliance_pct || 100), 0) / spedServices.length) : 100;
  const expiredIEPs = spedStudents.filter(s => s.iep_end_date && s.iep_end_date < today).length;
  const openAlerts = alerts.filter(a => a.status === 'open').length;
  const goalsOnTrack = spedGoals.filter(g => g.progress_status === 'on_track').length;

  const buildPrompt = (typeId) => {
    const audienceLabel = AUDIENCES.find(a => a.value === audience)?.label || audience;
    const periodLabel = PERIODS.find(p => p.value === period)?.label || period;

    const context = `
School Data Context (${periodLabel}):
- ${spedStudents.length} students with active IEPs
- SPED Service Compliance: ${avgCompliance}%
- Expired IEPs: ${expiredIEPs}
- Goals On Track: ${goalsOnTrack}/${spedGoals.length}
- Open Alerts: ${openAlerts}
- Academic: Reading 74%, Math 71% proficiency (trending up)
- Attendance: 94% average
- Chronic Absenteeism: 8% of students
- Behavior Referrals: 23 this month (down 12%)
`;

    const prompts = {
      executive: `You are an elite school data analyst generating an Executive Summary Report for a ${audienceLabel}. Reporting period: ${periodLabel}.

${context}

Write a professional, board-ready Executive Summary including:
1. **School Health Score** (0-100 with justification)
2. **Academic Performance** — proficiency, trends, subgroup highlights
3. **Culture & Climate** — attendance, behavior, engagement
4. **Special Education Compliance** — IEP status, service delivery, risks
5. **Open Alerts & Action Items** — priority issues requiring attention
6. **Top 3 Wins This Period**
7. **Top 3 Strategic Priorities**
8. **Recommendations for Leadership**

Use professional formatting with clear headers. Tone: Executive-level, data-driven, action-oriented.`,

      academic: `You are an expert instructional data analyst generating an Academic Performance Report for a ${audienceLabel}. Period: ${periodLabel}.

${context}

Write a comprehensive Academic Performance Report including:
1. **Overall School Proficiency** (Reading & Math with trend analysis)
2. **Grade-Level Breakdown** (K–8 proficiency estimates with strengths/gaps)
3. **Subgroup Analysis** (ELL, SPED, Low-Income, Race/Ethnicity gaps)
4. **Year-to-Date Growth Trends** (gaining/losing ground?)
5. **Top-Performing Classrooms** and what's driving success
6. **Students Needing Intervention** (at-risk flags)
7. **Instructional Recommendations** for improving proficiency
8. **Projected Year-End Outcomes** if trends continue

Professional tone. Use clear section headers, data tables where helpful.`,

      sped: `You are a special education compliance officer generating a SPED Compliance Report for a ${audienceLabel}. Period: ${periodLabel}.

${context}

Write a comprehensive SPED Compliance Report including:
1. **Compliance Dashboard** — overall compliance %, service delivery rates
2. **IEP Status Summary** — active, expired (${expiredIEPs}), expiring soon
3. **Service Delivery Analysis** — required vs. delivered minutes by service type
4. **Goal Progress Summary** — on track vs. not progressing (${goalsOnTrack}/${spedGoals.length})
5. **Risk Areas** — students/services requiring immediate attention
6. **Upcoming Compliance Deadlines** (next 30/60/90 days)
7. **Required Actions** — prioritized list for compliance team
8. **Recommended Staffing/Resource Adjustments**

FERPA-compliant language. Clear, actionable, legally defensible.`,

      culture: `You are a school culture analyst generating a Culture & Climate Report for a ${audienceLabel}. Period: ${periodLabel}.

${context}

Write a detailed Culture & Climate Report including:
1. **Attendance Overview** — rate, trends, chronic absenteeism breakdown
2. **Behavior & Discipline Trends** — referrals, suspensions, patterns by grade
3. **Student Engagement Indicators** — participation, extracurricular, surveys
4. **Staff Morale & Retention Signals** — turnover risk, survey data
5. **Family & Community Engagement** — participation rates, communication quality
6. **Active Climate Alerts** (${openAlerts} open)
7. **Bright Spots** — classrooms/grades with outstanding culture
8. **Climate Improvement Action Plan** — specific, executable recommendations

Empathetic, strengths-based framing while being honest about challenges.`,

      goals: `You are a school accountability coach generating a Goal Progress & Accountability Report for a ${audienceLabel}. Period: ${periodLabel}.

${context}

Write a comprehensive Goal Progress Report including:
1. **School-Wide Goal Summary** — completion rates by department/team
2. **SMART Goal Quality Analysis** — are goals measurable and achievable?
3. **On-Track vs. Off-Track Goals** — with root cause analysis
4. **Teacher Goal Accountability** — patterns and individual needs
5. **Leader Goal Tracking** — principal/AP/coordinator goal progress
6. **Behind-Schedule Goals** — recovery plans and adjusted timelines
7. **Goal Culture Assessment** — is the school genuinely goal-driven?
8. **Recommendations** for improving goal-setting culture and accountability

Direct, honest, coaching-oriented tone.`,

      staff: `You are an HR and talent analytics expert generating a Staff Performance Report for a ${audienceLabel}. Period: ${periodLabel}.

${context}

Write a comprehensive Staff Performance Report including:
1. **Observation Completion Rate** — formal/informal obs done vs. required
2. **Coaching Cycle Participation** — who's engaged, who's resistant
3. **Professional Development Engagement** — attendance, application, outcomes
4. **Staff Goal Completion by Department**
5. **High-Performing Teams & Educators** — recognize and leverage
6. **Departments/Individuals Needing Support** — with specific plans
7. **Retention Risk Indicators** — staff showing signs of disengagement
8. **Strategic HR Recommendations** — hiring gaps, succession planning, culture

Balanced, constructive, and legally appropriate.`,

      alerts: `You are a school operations analyst generating an Alerts & Intervention Report for a ${audienceLabel}. Period: ${periodLabel}.

${context}

Write a detailed Alerts & Interventions Report including:
1. **Alert Summary Dashboard** — total (${openAlerts} open), by type, by severity
2. **Resolution Rate Analysis** — how quickly are alerts being addressed?
3. **Escalated Issues** — alerts that have been open too long
4. **Student-Level Alert Patterns** — students with multiple flags
5. **Classroom/Grade-Level Alert Concentrations** — hotspots
6. **Intervention Effectiveness** — are current interventions working?
7. **Root Cause Analysis** — what's driving the most common alerts?
8. **Priority Action List** — top 10 actions for this week

Urgent, action-oriented tone. Clear priority tiers (Critical / High / Medium).`,

      forecast: `You are an AI predictive analytics engine generating a Predictive Forecast Report for a ${audienceLabel}. Period: ${periodLabel}.

${context}

Write a comprehensive AI Predictive Forecast including:
1. **Year-End Academic Projections** — where will the school land if trends hold?
2. **Students at Risk of Not Meeting Standards** — count, grade, subject
3. **Chronic Absenteeism Trajectory** — will it improve or worsen?
4. **SPED Compliance Forecast** — projected compliance rate by year-end
5. **Behavior Trend Predictions** — escalation or de-escalation expected?
6. **Staff Retention Risk Forecast** — who might leave?
7. **Budget & Resource Gap Projections** — where will needs exceed capacity?
8. **Top 5 Proactive Interventions** — highest-leverage actions to change trajectory

Confident, data-grounded, forward-looking tone. Quantify projections wherever possible.`,
    };

    return prompts[typeId] || prompts.executive;
  };

  const generateReport = async (typeId) => {
    setSelectedType(typeId);
    setReport('');
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: buildPrompt(typeId),
        model: 'claude_sonnet_4_6',
      });
      setReport(result);
      setHistory(h => [
        { id: Date.now(), typeId, audience, period, preview: result.slice(0, 100) + '...', ts: new Date().toLocaleTimeString() },
        ...h.slice(0, 4),
      ]);
    } catch (e) {
      setReport('Report generation failed. Please try again.');
    }
    setGenerating(false);
  };

  const handleDownload = () => {
    const el = document.createElement('a');
    el.download = `daida_${selectedType}_${Date.now()}.txt`;
    el.href = 'data:text/plain,' + encodeURIComponent(report);
    el.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const selectedMeta = REPORT_TYPES.find(r => r.id === selectedType);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-black flex items-center gap-2">
              <FileText className="w-5 h-5 text-black/40" /> Report Generation Engine
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">AI-powered executive, compliance, academic, and predictive reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36 rounded-xl text-xs border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERIODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="w-44 rounded-xl text-xs border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {AUDIENCES.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Data Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Active IEPs', value: spedStudents.length, icon: Shield, warning: expiredIEPs > 0 },
            { label: 'SPED Compliance', value: `${avgCompliance}%`, icon: CheckCircle, warning: avgCompliance < 90 },
            { label: 'Open Alerts', value: openAlerts, icon: AlertTriangle, warning: openAlerts > 5 },
            { label: 'Goals On Track', value: `${goalsOnTrack}/${spedGoals.length}`, icon: Target, warning: goalsOnTrack < spedGoals.length * 0.7 },
          ].map((s, i) => (
            <div key={i} className={`bg-white border rounded-xl p-4 flex items-center gap-3 ${s.warning ? 'border-amber-200' : 'border-gray-100'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.warning ? 'bg-amber-50' : 'bg-gray-50'}`}>
                <s.icon className={`w-4 h-4 ${s.warning ? 'text-amber-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <div className="font-black text-black text-lg leading-none">{s.value}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Type Grid */}
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Report Type</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {REPORT_TYPES.map(({ id, icon: Icon, label, badge, desc, tags, featured }) => (
              <button key={id} onClick={() => generateReport(id)}
                className={`relative text-left rounded-2xl p-5 border transition-all group hover:shadow-md active:scale-[0.98]
                  ${selectedType === id ? 'border-black bg-[#020205] text-white ring-2 ring-black ring-offset-2' : featured ? 'border-gray-900 bg-[#020205] text-white' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                {selectedType === id && generating && (
                  <div className="absolute top-3 right-3">
                    <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                  </div>
                )}
                {selectedType === id && !generating && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-4 h-4 text-white/50" />
                  </div>
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${selectedType === id || featured ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                  <Icon className={`w-4 h-4 ${selectedType === id || featured ? 'text-white/70' : 'text-gray-500'}`} />
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedType === id || featured ? 'text-white/40' : 'text-gray-400'}`}>{badge}</div>
                <p className={`font-black text-sm mb-1.5 leading-snug ${selectedType === id || featured ? 'text-white' : 'text-black'}`}>{label}</p>
                <p className={`text-xs leading-relaxed ${selectedType === id || featured ? 'text-white/40' : 'text-gray-400'}`}>{desc}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {tags.map(t => (
                    <span key={t} className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${selectedType === id || featured ? 'bg-white/10 text-white/50' : 'bg-gray-100 text-gray-400'}`}>{t}</span>
                  ))}
                </div>
                <div className={`flex items-center gap-1.5 mt-3 text-[10px] font-black transition-colors ${selectedType === id || featured ? 'text-white/50' : 'text-gray-300 group-hover:text-black'}`}>
                  <Sparkles className="w-3 h-3" /> Generate with AI
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Report */}
        <AnimatePresence>
          {(generating || report) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {/* Report Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-black">{selectedMeta?.label}</p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      For {AUDIENCES.find(a => a.value === audience)?.label} · {PERIODS.find(p => p.value === period)?.label}
                    </p>
                  </div>
                </div>
                {report && !generating && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy} className="rounded-lg text-xs font-bold gap-1 h-8">
                      {copied ? <><CheckCircle className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handlePrint} className="rounded-lg text-xs font-bold gap-1 h-8">
                      <Printer className="w-3 h-3" /> Print
                    </Button>
                    <Button size="sm" onClick={handleDownload} className="rounded-lg text-xs font-bold gap-1 h-8 bg-black text-white hover:bg-black/80">
                      <Download className="w-3 h-3" /> Export
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => generateReport(selectedType)} className="rounded-lg text-xs font-bold gap-1 h-8 text-gray-400">
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </Button>
                  </div>
                )}
              </div>

              {/* Report Body */}
              <div className="p-8">
                {generating ? (
                  <div className="flex items-center gap-4 py-8">
                    <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin flex-shrink-0" />
                    <div>
                      <p className="font-black text-black text-sm">Generating {selectedMeta?.label}…</p>
                      <p className="text-gray-400 text-xs mt-0.5">Claude AI is analyzing your school data and composing a professional report.</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                    prose-headings:font-black prose-headings:text-black
                    prose-h1:text-xl prose-h2:text-base prose-h3:text-sm
                    prose-strong:text-black prose-strong:font-bold
                    prose-ul:my-2 prose-li:my-0.5
                    max-h-[70vh] overflow-y-auto">
                    <ReactMarkdown>{report}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report History */}
        {history.length > 0 && (
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Recent Reports
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.map(h => {
                const meta = REPORT_TYPES.find(r => r.id === h.typeId);
                return (
                  <div key={h.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 hover:border-gray-200 transition-all cursor-pointer"
                    onClick={() => { setSelectedType(h.typeId); setReport(''); setAudience(h.audience); setPeriod(h.period); generateReport(h.typeId); }}>
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {meta && <meta.icon className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-xs text-black truncate">{meta?.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {AUDIENCES.find(a => a.value === h.audience)?.label} · {h.ts}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{h.preview}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}