import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Download, Brain, CheckCircle, BarChart3, Shield, Users, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const REPORT_TYPES = [
  { id: 'executive', icon: BarChart3, label: 'Executive Summary', desc: 'Board-ready overview of all school performance metrics', color: 'bg-[#020205] text-white' },
  { id: 'academic', icon: BarChart3, label: 'Academic Performance', desc: 'Proficiency, growth, subgroup, grade-level analysis', color: 'bg-white border border-gray-100' },
  { id: 'sped', icon: Shield, label: 'SPED Compliance Report', desc: 'IEP status, service minutes, compliance risks, goals', color: 'bg-white border border-gray-100' },
  { id: 'culture', icon: Users, label: 'Culture & Climate', desc: 'Attendance, behavior, engagement, climate indicators', color: 'bg-white border border-gray-100' },
  { id: 'goals', icon: Target, label: 'Goal Progress Report', desc: 'SMART goals, completion rates, accountability tracking', color: 'bg-white border border-gray-100' },
  { id: 'staff', icon: Users, label: 'Staff Performance', desc: 'Observation scores, coaching cycles, PD participation', color: 'bg-white border border-gray-100' },
];

export default function DaidaReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [generatedReport, setGeneratedReport] = useState('');
  const [generating, setGenerating] = useState(false);
  const [audience, setAudience] = useState('principal');

  const { data: spedStudents = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });
  const { data: spedServices = [] } = useQuery({ queryKey: ['sped-services'], queryFn: () => base44.entities.SpedService.list('-created_date', 200) });
  const { data: spedGoals = [] } = useQuery({ queryKey: ['sped-goals'], queryFn: () => base44.entities.SpedGoal.list('-created_date', 200) });
  const { data: alerts = [] } = useQuery({ queryKey: ['xscores-alerts'], queryFn: () => base44.entities.XscoresAlert.list('-created_date', 100) });

  const today = new Date().toISOString().split('T')[0];
  const avgCompliance = spedServices.length ? Math.round(spedServices.reduce((a, s) => a + (s.compliance_pct || 100), 0) / spedServices.length) : 100;
  const expiredIEPs = spedStudents.filter(s => s.iep_end_date && s.iep_end_date < today).length;
  const openAlerts = alerts.filter(a => a.status === 'open').length;

  const generateReport = async (reportType) => {
    setSelectedReport(reportType);
    setGenerating(true);
    setGeneratedReport('');

    const PROMPTS = {
      executive: `Generate a comprehensive executive school summary report for the ${audience}. Include: Overall School Health Score, Academic Performance (Reading 74%, Math 71%, trending upward), Culture & Climate indicators (Attendance 94%), SPED Compliance (${avgCompliance}%, ${expiredIEPs} expired IEPs), Active Alerts (${openAlerts}), Top 3 Wins, Top 3 Priorities, and Strategic Recommendations. Format professionally with clear sections and headers. Tone: Executive-level, strategic, data-driven.`,
      academic: `Generate a detailed Academic Performance Report for ${audience}. Include: Overall proficiency rates (Reading 74%, Math 71%), Grade-level breakdown (K:78%R/75%M through 5th:76%R/74%M), Subgroup gaps (ELL: 58%, SPED: 52%, Low Income: 61%), YTD growth trends, Top-performing classrooms, Intervention recommendations, and Next steps. Professional education reporting format.`,
      sped: `Generate a Special Education Compliance Report for ${audience}. Data: ${spedStudents.length} students with IEPs, ${avgCompliance}% service compliance, ${expiredIEPs} expired IEPs, ${spedGoals.filter(g => g.progress_status === 'on_track').length}/${spedGoals.length} goals on track. Include: Compliance Summary, Risk Areas, Student Progress Overview, Service Delivery Analysis, Upcoming Deadlines, and Required Actions. FERPA-appropriate language.`,
      culture: `Generate a Culture & Climate Report for ${audience}. Include: Attendance Rate (94% avg, trending up), Chronic Absenteeism Analysis, Behavior Referral Trends, Student Engagement Indicators, Teacher Morale Indicators, Family Engagement Status, Active Behavioral Alerts (${openAlerts}), and Climate Improvement Recommendations.`,
      goals: `Generate a Goal Progress & Accountability Report for ${audience}. Include: SMART Goal completion rates, Department-level goal progress, Teacher goal accountability, Leader goal tracking, Behind-schedule goals and recovery plans, Goal setting quality analysis, and Recommendations for improving goal attainment culture.`,
      staff: `Generate a Staff Performance Report for ${audience}. Include: Observation completion rates, Coaching cycle participation, Professional development engagement, Goal completion by staff, Departments needing support, High-performing teams, and Strategic staffing recommendations.`,
    };

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: PROMPTS[reportType] || PROMPTS.executive,
      model: 'claude_sonnet_4_6',
    });
    setGeneratedReport(result);
    setGenerating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Report Generation Engine</h1>
          <p className="text-gray-400 text-sm mt-0.5">AI-powered executive, board, academic, and compliance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500">Report for:</span>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="w-40 rounded-xl text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="principal">Principal</SelectItem>
              <SelectItem value="superintendent">Superintendent</SelectItem>
              <SelectItem value="board">Board of Directors</SelectItem>
              <SelectItem value="sped_coordinator">SPED Coordinator</SelectItem>
              <SelectItem value="instructional_coach">Instructional Coach</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report Type Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {REPORT_TYPES.map(({ id, icon: Icon, label, desc, color }) => (
          <button key={id} onClick={() => generateReport(id)}
            className={`${color} rounded-2xl p-5 text-left hover:shadow-md transition-all group relative`}>
            {selectedReport === id && generating && (
              <div className="absolute top-3 right-3">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
              </div>
            )}
            <Icon className={`w-5 h-5 mb-3 ${color.includes('text-white') ? 'text-white/60' : 'text-gray-400 group-hover:text-black'} transition-colors`} />
            <p className={`font-black text-sm mb-1 ${color.includes('text-white') ? 'text-white' : 'text-black'}`}>{label}</p>
            <p className={`text-xs leading-relaxed ${color.includes('text-white') ? 'text-white/50' : 'text-gray-400'}`}>{desc}</p>
            <div className={`flex items-center gap-1.5 mt-3 text-xs font-black ${color.includes('text-white') ? 'text-white/60' : 'text-gray-400 group-hover:text-black'} transition-colors`}>
              <Sparkles className="w-3 h-3" /> Generate with AI
            </div>
          </button>
        ))}
      </div>

      {/* Generated Report */}
      <AnimatePresence>
        {(generating || generatedReport) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-black" />
                <p className="font-black text-sm text-black">
                  {REPORT_TYPES.find(r => r.id === selectedReport)?.label} — for {audience.replace(/_/g, ' ')}
                </p>
              </div>
              {generatedReport && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { const el = document.createElement('a'); el.download = `report_${selectedReport}_${Date.now()}.txt`; el.href = 'data:text/plain,' + encodeURIComponent(generatedReport); el.click(); }}
                    className="rounded-lg text-xs font-bold gap-1">
                    <Download className="w-3 h-3" /> Export
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6">
              {generating ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm font-bold">Generating {REPORT_TYPES.find(r => r.id === selectedReport)?.label} using Claude AI...</p>
                </div>
              ) : (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-[70vh] overflow-y-auto">
                  {generatedReport}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}