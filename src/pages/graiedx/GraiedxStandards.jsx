import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Sparkles, BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STANDARDS_SETS = {
  ELA: ['RL.1 - Key Ideas','RL.2 - Theme & Summary','RL.3 - Character Analysis','RI.1 - Evidence','RI.2 - Central Idea','W.1 - Arguments','W.2 - Informative','W.3 - Narrative','SL.1 - Discussion','L.1 - Grammar'],
  Math: ['OA.1 - Operations','NBT.1 - Place Value','NF.1 - Fractions','MD.1 - Measurement','G.1 - Geometry','RP.1 - Ratios','NS.1 - Number System','EE.1 - Expressions','F.1 - Functions','SP.1 - Statistics'],
  Science: ['LS1 - Cell Biology','LS2 - Ecosystems','LS3 - Genetics','LS4 - Evolution','PS1 - Matter','PS2 - Forces','PS3 - Energy','PS4 - Waves','ESS1 - Earth','ESS2 - Earth Systems'],
};

export default function GraiedxStandards() {
  const [subject, setSubject] = useState('ELA');
  const [analysis, setAnalysis] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: grades = [] } = useQuery({ queryKey: ['gx-grades-all'], queryFn: () => base44.entities.GraiedxGrade.list('-created_date', 2000) });
  const { data: assignments = [] } = useQuery({ queryKey: ['gx-assignments-all'], queryFn: () => base44.entities.GraiedxAssignment.list('-created_date', 500) });

  const standards = STANDARDS_SETS[subject] || [];

  // Mock mastery data based on grades
  const masteryData = standards.map((std, i) => {
    const relatedGrades = grades.filter((_, gi) => gi % standards.length === i);
    const avg = relatedGrades.length > 0
      ? Math.round(relatedGrades.reduce((a, g) => a + (g.percentage || 70), 0) / relatedGrades.length)
      : Math.floor(60 + Math.random() * 35);
    return {
      standard: std.split(' - ')[0],
      fullName: std,
      mastery: avg,
      mastered: avg >= 80,
      approaching: avg >= 60 && avg < 80,
      below: avg < 60,
      students: relatedGrades.length || Math.floor(Math.random() * 25) + 5,
    };
  });

  const masteredCount = masteryData.filter(d => d.mastered).length;
  const belowCount = masteryData.filter(d => d.below).length;
  const avgMastery = Math.round(masteryData.reduce((a, d) => a + d.mastery, 0) / masteryData.length);

  const generateAnalysis = async () => {
    setGenerating(true);
    const belowStandards = masteryData.filter(d => d.below).map(d => d.fullName).join(', ');
    const strongStandards = masteryData.filter(d => d.mastered).map(d => d.fullName).join(', ');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a standards mastery analysis report for ${subject}:
- Average mastery: ${avgMastery}%
- Mastered (80%+): ${masteredCount} standards
- Below proficiency: ${belowCount} standards
- Below standards: ${belowStandards || 'None'}
- Strong standards: ${strongStandards || 'None'}

Provide: 
1. Overall mastery summary (2 sentences)
2. Top 3 instructional priorities for reteaching
3. Recommended intervention strategies
4. One success to celebrate

Be specific to ${subject} instruction. Executive-level, actionable tone.`,
    });
    setAnalysis(result);
    setGenerating(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Standards Mastery Tracking</h1>
          <p className="text-gray-400 text-sm mt-0.5">Monitor proficiency by standard, identify gaps, and drive instruction</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-32 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(STANDARDS_SETS).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={generateAnalysis} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2">
            <Sparkles className="w-4 h-4" /> {generating ? 'Analyzing...' : 'AI Analysis'}
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg Mastery', value: `${avgMastery}%`, color: avgMastery >= 70 ? 'text-emerald-600' : 'text-red-600' },
          { label: 'Standards Mastered', value: masteredCount, color: 'text-emerald-600' },
          { label: 'Approaching', value: masteryData.filter(d => d.approaching).length, color: 'text-amber-600' },
          { label: 'Below Mastery', value: belowCount, color: belowCount > 0 ? 'text-red-600' : 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* AI Analysis */}
      {(analysis || generating) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-[#020205] rounded-2xl p-5 mb-6 flex gap-3">
          <Star className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5" />
          {generating ? (
            <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-white/30 animate-spin" /><p className="text-white/40 text-sm">Analyzing standards mastery...</p></div>
          ) : (
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{analysis}</p>
          )}
        </motion.div>
      )}

      {/* Standards Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <p className="font-black text-sm text-black mb-4">{subject} Standards Mastery Overview</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={masteryData} barSize={24}>
            <XAxis dataKey="standard" tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }}
              formatter={(val, name, props) => [`${val}%`, props.payload.fullName]}
            />
            <Bar dataKey="mastery" radius={[4, 4, 0, 0]} name="Mastery %">
              {masteryData.map((d, i) => (
                <Cell key={i} fill={d.mastered ? '#059669' : d.approaching ? '#d97706' : '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 justify-center">
          {[{ color: '#059669', label: 'Mastered (80%+)' }, { color: '#d97706', label: 'Approaching (60-79%)' }, { color: '#dc2626', label: 'Below (<60%)' }].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="text-[10px] text-gray-500 font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Standards Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['Standard', 'Mastery %', 'Level', 'Progress', 'Action'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {masteryData.map((d, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-bold text-sm text-black">{d.standard}</p>
                  <p className="text-[10px] text-gray-400">{d.fullName}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-sm font-black ${d.mastered ? 'text-emerald-600' : d.approaching ? 'text-amber-600' : 'text-red-600'}`}>{d.mastery}%</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${d.mastered ? 'bg-emerald-100 text-emerald-700' : d.approaching ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {d.mastered ? 'Mastered' : d.approaching ? 'Approaching' : 'Below'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${d.mastery}%`, background: d.mastered ? '#059669' : d.approaching ? '#d97706' : '#dc2626' }} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  {!d.mastered && (
                    <span className="text-[9px] text-gray-500 font-bold">{d.below ? '⚠ Reteach' : '📚 Practice'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}