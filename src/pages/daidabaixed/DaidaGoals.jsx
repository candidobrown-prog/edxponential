import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, CheckCircle, AlertTriangle, TrendingUp, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PROGRESS_CONFIG = {
  mastered: { color: '#059669', label: 'Mastered', bg: 'bg-emerald-100 text-emerald-700' },
  on_track: { color: '#000000', label: 'On Track', bg: 'bg-black/10 text-black' },
  some_progress: { color: '#6b7280', label: 'Some Progress', bg: 'bg-gray-100 text-gray-700' },
  minimal_progress: { color: '#d97706', label: 'Minimal Progress', bg: 'bg-amber-100 text-amber-700' },
  not_started: { color: '#dc2626', label: 'Not Started', bg: 'bg-red-100 text-red-700' },
};

export default function DaidaGoals() {
  const [aiInsight, setAiInsight] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['sped-goals'],
    queryFn: () => base44.entities.SpedGoal.list('-created_date', 200),
  });

  const byStatus = goals.reduce((acc, g) => {
    const s = g.progress_status || 'not_started';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(byStatus).map(([name, value]) => ({
    name: PROGRESS_CONFIG[name]?.label || name, value, color: PROGRESS_CONFIG[name]?.color || '#9ca3af'
  }));

  const byArea = goals.reduce((acc, g) => {
    const area = g.goal_area || 'other';
    if (!acc[area]) acc[area] = { area: area.replace(/_/g, ' '), total: 0, on_track: 0 };
    acc[area].total++;
    if (g.progress_status === 'on_track' || g.progress_status === 'mastered') acc[area].on_track++;
    return acc;
  }, {});
  const areaData = Object.values(byArea).map(a => ({ ...a, pct: Math.round(a.on_track / a.total * 100) }));

  const avgProgress = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + (g.current_progress_pct || 0), 0) / goals.length) : 0;
  const onTrack = goals.filter(g => g.progress_status === 'on_track' || g.progress_status === 'mastered').length;

  const generateInsight = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze IEP goal progress data for a school and provide a concise strategic briefing (4-5 sentences) for an instructional leader:
Total goals: ${goals.length}, On track: ${onTrack}, Average progress: ${avgProgress}%
By status: ${JSON.stringify(byStatus)}
Top concern areas: ${areaData.sort((a, b) => a.pct - b.pct).slice(0, 3).map(a => a.area).join(', ')}
Provide wins, concerns, and 2-3 actionable recommendations.`,
    });
    setAiInsight(result);
    setGenerating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Goal Intelligence</h1>
          <p className="text-gray-400 text-sm mt-0.5">Synced from PerSpEdxtives™ & Xschmart Goalx</p>
        </div>
        <Button onClick={generateInsight} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> {generating ? 'Analyzing...' : 'AI Goal Analysis'}
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Goals', value: goals.length || 0, color: 'bg-[#020205] text-white' },
          { label: 'On Track', value: onTrack, color: 'bg-emerald-50 border border-emerald-100' },
          { label: 'Avg Progress', value: `${avgProgress}%`, color: 'bg-white border border-gray-100' },
          { label: 'Need Attention', value: goals.filter(g => g.progress_status === 'minimal_progress' || g.progress_status === 'not_started').length, color: 'bg-amber-50 border border-amber-100' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-2xl p-5`}>
            <div className={`text-3xl font-black ${color.includes('text-white') ? 'text-white' : 'text-black'}`}>{value}</div>
            <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${color.includes('text-white') ? 'text-white/50' : 'text-gray-400'}`}>{label}</div>
          </div>
        ))}
      </div>

      {aiInsight && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-[#020205] rounded-2xl p-5 mb-6 flex gap-3">
          <Brain className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
          <p className="text-white/80 text-sm leading-relaxed">{aiInsight}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Progress Distribution */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="font-black text-sm text-black mb-4">Goal Progress Distribution</p>
          {goals.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {pieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-500">{name}: <strong>{value}</strong></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No goals recorded yet</p>
            </div>
          )}
        </div>

        {/* By Goal Area */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="font-black text-sm text-black mb-4">On-Track Rate by Goal Area</p>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={areaData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis dataKey="area" type="category" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} formatter={(v) => [`${v}%`, 'On Track']} />
                <Bar dataKey="pct" fill="#000000" radius={[0, 4, 4, 0]} name="On Track %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">No goal area data yet</div>
          )}
        </div>
      </div>

      {/* Goal List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="font-black text-sm text-black">All Goals</p>
        </div>
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No goals yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {goals.map(g => {
              const cfg = PROGRESS_CONFIG[g.progress_status] || PROGRESS_CONFIG.not_started;
              return (
                <div key={g.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm text-black truncate">{g.goal_title || g.goal_area?.replace(/_/g, ' ')}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${cfg.bg} flex-shrink-0`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-400">{g.student_name} · {g.responsible_provider || 'No provider'}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 h-2 bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${g.current_progress_pct || 0}%`, backgroundColor: cfg.color }} />
                    </div>
                    <span className="text-xs font-black text-black w-8">{g.current_progress_pct || 0}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}