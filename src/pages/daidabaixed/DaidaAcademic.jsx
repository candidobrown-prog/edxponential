import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Sparkles, BookOpen, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area
} from 'recharts';

const SUBGROUP_DATA = [
  { group: 'All Students', reading: 74, math: 71 },
  { group: 'ELL', reading: 58, math: 63 },
  { group: 'SPED', reading: 52, math: 55 },
  { group: 'Black', reading: 68, math: 65 },
  { group: 'Hispanic', reading: 66, math: 64 },
  { group: 'White', reading: 81, math: 79 },
  { group: 'Low Income', reading: 61, math: 60 },
];

const MONTHLY_GROWTH = [
  { month: 'Sep', below: 38, approaching: 24, proficient: 26, advanced: 12 },
  { month: 'Oct', below: 35, approaching: 25, proficient: 27, advanced: 13 },
  { month: 'Nov', below: 32, approaching: 24, proficient: 29, advanced: 15 },
  { month: 'Dec', below: 30, approaching: 23, proficient: 31, advanced: 16 },
  { month: 'Jan', below: 28, approaching: 22, proficient: 33, advanced: 17 },
  { month: 'Feb', below: 26, approaching: 21, proficient: 34, advanced: 19 },
  { month: 'Mar', below: 24, approaching: 20, proficient: 36, advanced: 20 },
];

const GRADE_DETAIL = [
  { grade: 'K', reading: 78, math: 75, writing: 72, science: 80 },
  { grade: '1st', reading: 72, math: 70, writing: 68, science: 74 },
  { grade: '2nd', reading: 68, math: 65, writing: 64, science: 70 },
  { grade: '3rd', reading: 71, math: 68, writing: 66, science: 72 },
  { grade: '4th', reading: 74, math: 72, writing: 70, science: 75 },
  { grade: '5th', reading: 76, math: 74, writing: 72, science: 78 },
];

export default function DaidaAcademic() {
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateAnalysis = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze these school academic performance metrics and provide a 4-5 sentence strategic insight for a principal:

Grade-level performance ranges: Reading 68-78%, Math 65-75%
Subgroup gaps: ELL 58% reading, SPED 52% reading, Low Income 61%
Monthly trend: Below proficiency declining from 38% to 24% (positive)
Advanced proficiency growing from 12% to 20%

Key concerns and celebrations, with 2-3 specific recommendations.`,
    });
    setAiAnalysis(result);
    setGenerating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Academic Intelligence</h1>
          <p className="text-gray-400 text-sm mt-0.5">Proficiency, growth, and subgroup analytics</p>
        </div>
        <Button onClick={generateAnalysis} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> {generating ? 'Analyzing...' : 'AI Analysis'}
        </Button>
      </div>

      {aiAnalysis && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#020205] rounded-2xl p-5 mb-6 flex gap-3">
          <Brain className="w-5 h-5 text-white/50 flex-shrink-0 mt-0.5" />
          <p className="text-white/80 text-sm leading-relaxed">{aiAnalysis}</p>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Reading Proficiency', value: '74%', delta: '+5%', up: true },
          { label: 'Math Proficiency', value: '71%', delta: '+4%', up: true },
          { label: 'Writing Performance', value: '68%', delta: '+3%', up: true },
          { label: 'Science Proficiency', value: '75%', delta: '+6%', up: true },
        ].map(({ label, value, delta, up }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            <p className="text-3xl font-black text-black">{value}</p>
            <span className={`text-xs font-bold flex items-center gap-1 mt-1 ${up ? 'text-emerald-500' : 'text-red-500'}`}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {delta} YTD
            </span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Proficiency Distribution */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="font-black text-sm text-black mb-1">Proficiency Levels Over Time</p>
          <p className="text-xs text-gray-400 mb-4">% of students by performance band</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_GROWTH}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
              <Area type="monotone" dataKey="advanced" stackId="1" stroke="#000000" fill="#000000" name="Advanced" />
              <Area type="monotone" dataKey="proficient" stackId="1" stroke="#6b7280" fill="#6b7280" name="Proficient" />
              <Area type="monotone" dataKey="approaching" stackId="1" stroke="#d1d5db" fill="#d1d5db" name="Approaching" />
              <Area type="monotone" dataKey="below" stackId="1" stroke="#f3f4f6" fill="#f3f4f6" name="Below" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subgroup Gap */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="font-black text-sm text-black mb-1">Subgroup Performance Gap</p>
          <p className="text-xs text-gray-400 mb-4">Reading & Math by student group</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SUBGROUP_DATA} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis dataKey="group" type="category" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
              <Bar dataKey="reading" fill="#000000" radius={[0, 4, 4, 0]} name="Reading %" />
              <Bar dataKey="math" fill="#d1d5db" radius={[0, 4, 4, 0]} name="Math %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grade Detail Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="font-black text-sm text-black">Grade-Level Performance Detail</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['Grade', 'Reading', 'Math', 'Writing', 'Science', 'Trend'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRADE_DETAIL.map(g => (
              <tr key={g.grade} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-black text-sm text-black">{g.grade}</td>
                {['reading', 'math', 'writing', 'science'].map(sub => (
                  <td key={sub} className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 rounded-full bg-black" style={{ width: `${g[sub]}%` }} />
                      </div>
                      <span className="text-xs font-black text-black">{g[sub]}%</span>
                    </div>
                  </td>
                ))}
                <td className="px-5 py-3">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +3%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}