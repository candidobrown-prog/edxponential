import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Brain, Sparkles, AlertTriangle, Target, BarChart3, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const FORECAST_TYPES = [
  { id: 'achievement', icon: BarChart3, label: 'Achievement Forecast', desc: 'Predict end-of-year academic outcomes', color: 'bg-[#020205] text-white' },
  { id: 'attendance', icon: Target, label: 'Attendance Risk Forecast', desc: 'Identify students at risk for chronic absenteeism', color: 'bg-white border border-gray-100' },
  { id: 'compliance', icon: AlertTriangle, label: 'SPED Compliance Forecast', desc: 'Project compliance risks over next 60-90 days', color: 'bg-white border border-gray-100' },
  { id: 'retention', icon: TrendingUp, label: 'Staff Retention Forecast', desc: 'Predict teacher turnover risk by department', color: 'bg-white border border-gray-100' },
];

const FORECAST_DATA = {
  reading: [
    { month: 'Now', actual: 74 }, { month: 'Apr', actual: 76 }, { month: 'May', actual: null, forecast: 78 },
    { month: 'Jun', actual: null, forecast: 80 }, { month: 'Aug', actual: null, forecast: 79 }, { month: 'Sep', actual: null, forecast: 75 },
  ],
  attendance: [
    { month: 'Sep', actual: 94 }, { month: 'Oct', actual: 93 }, { month: 'Nov', actual: 92 },
    { month: 'Dec', actual: 91 }, { month: 'Jan', actual: 93 }, { month: 'Feb', actual: 94 },
    { month: 'Mar', actual: 95 }, { month: 'Apr', actual: null, forecast: 95 }, { month: 'May', actual: null, forecast: 93 }, { month: 'Jun', actual: null, forecast: 91 },
  ],
};

export default function DaidaAIForecast() {
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [forecast, setForecast] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: spedStudents = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });
  const { data: spedServices = [] } = useQuery({ queryKey: ['sped-services'], queryFn: () => base44.entities.SpedService.list('-created_date', 200) });
  const { data: alerts = [] } = useQuery({ queryKey: ['xscores-alerts'], queryFn: () => base44.entities.XscoresAlert.list('-created_date', 100) });

  const today = new Date().toISOString().split('T')[0];
  const expiredIEPs = spedStudents.filter(s => s.iep_end_date && s.iep_end_date < today).length;
  const avgCompliance = spedServices.length ? Math.round(spedServices.reduce((a, s) => a + (s.compliance_pct || 100), 0) / spedServices.length) : 100;

  const generateForecast = async (type) => {
    setSelectedForecast(type);
    setGenerating(true);
    setForecast('');

    const PROMPTS = {
      achievement: `Generate a predictive academic achievement forecast for a school. Current data: Reading 74%, Math 71%, both trending up +4-5% YTD. Forecast end-of-year outcomes, identify which grade levels and subgroups are most likely to meet/miss proficiency targets, and recommend 3 interventions to maximize gains. Include a confidence assessment.`,
      attendance: `Generate an attendance risk forecast. Current: 94% average, trending stable. ${alerts.filter(a => a.category === 'attendance').length} attendance alerts active. Forecast chronic absenteeism risk for Q4, identify high-risk periods, and provide 3 prevention strategies.`,
      compliance: `Generate a SPED compliance forecast for the next 90 days. Current: ${avgCompliance}% service compliance, ${expiredIEPs} expired IEPs, ${spedStudents.length} total students. Project compliance trajectory, flag highest-risk students, and provide a 90-day risk mitigation plan.`,
      retention: `Generate a teacher retention risk forecast. Indicators: high workload, mid-year departure patterns, coaching engagement. Identify early warning signs, predict risk categories by department, and recommend 3 retention strategies.`,
    };

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: PROMPTS[type],
      model: 'claude_sonnet_4_6',
    });
    setForecast(result);
    setGenerating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-black">AI Forecasting Engine</h1>
          <p className="text-gray-400 text-sm">Predictive intelligence and proactive risk identification</p>
        </div>
      </div>
      <div className="h-px bg-gray-100 my-6" />

      {/* Forecast Type Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {FORECAST_TYPES.map(({ id, icon: Icon, label, desc, color }) => (
          <button key={id} onClick={() => generateForecast(id)}
            className={`${color} rounded-2xl p-5 text-left hover:shadow-md transition-all group`}>
            <Icon className={`w-5 h-5 mb-3 ${color.includes('text-white') ? 'text-white/60' : 'text-gray-400 group-hover:text-black'}`} />
            <p className={`font-black text-sm mb-1 ${color.includes('text-white') ? 'text-white' : 'text-black'}`}>{label}</p>
            <p className={`text-xs ${color.includes('text-white') ? 'text-white/50' : 'text-gray-400'}`}>{desc}</p>
            {selectedForecast === id && generating && (
              <div className="flex items-center gap-1.5 mt-3">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
                <span className={`text-[10px] font-bold opacity-50 ${color.includes('text-white') ? 'text-white' : 'text-black'}`}>Forecasting...</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Forecast Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-black text-sm text-black">Reading Proficiency Forecast</p>
              <p className="text-xs text-gray-400">Actual + AI projected trajectory</p>
            </div>
            <span className="text-[10px] bg-black/5 text-black px-2 py-1 rounded-full font-black uppercase">Projected: 80%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={FORECAST_DATA.reading}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[60, 90]} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
              <ReferenceLine x="Apr" stroke="#d1d5db" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="actual" stroke="#000000" strokeWidth={2.5} dot={{ fill: '#000', r: 3 }} connectNulls={false} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke="#9ca3af" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#9ca3af', r: 3 }} connectNulls={false} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-black text-sm text-black">Attendance Rate Forecast</p>
              <p className="text-xs text-gray-400">Seasonal trend + end-of-year projection</p>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-black uppercase">Watch: Jun Dip</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={FORECAST_DATA.attendance}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[85, 100]} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
              <ReferenceLine x="Apr" stroke="#d1d5db" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="actual" stroke="#000000" strokeWidth={2.5} dot={{ fill: '#000', r: 3 }} connectNulls={false} name="Actual %" />
              <Line type="monotone" dataKey="forecast" stroke="#d97706" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#d97706', r: 3 }} connectNulls={false} name="Forecast %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Result */}
      <AnimatePresence>
        {(generating || forecast) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-black" />
              <p className="font-black text-sm text-black">
                {FORECAST_TYPES.find(f => f.id === selectedForecast)?.label} — AI Forecast
              </p>
            </div>
            {generating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Running predictive model with Claude AI...</p>
              </div>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{forecast}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}