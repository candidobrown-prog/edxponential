import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Sparkles, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area, Legend } from 'recharts';

export default function GraiedxAnalytics() {
  const [forecast, setForecast] = useState('');
  const [generating, setGenerating] = useState(false);
  const [forecastType, setForecastType] = useState('performance');

  const { data: students = [] } = useQuery({ queryKey: ['gx-students-all'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });
  const { data: assignments = [] } = useQuery({ queryKey: ['gx-assignments-all'], queryFn: () => base44.entities.GraiedxAssignment.list('-created_date', 500) });
  const { data: grades = [] } = useQuery({ queryKey: ['gx-grades-all'], queryFn: () => base44.entities.GraiedxGrade.list('-created_date', 2000) });
  const { data: alerts = [] } = useQuery({ queryKey: ['gx-alerts-all'], queryFn: () => base44.entities.GraiedxAlert.list('-created_date', 200) });

  const LETTER = (p) => p >= 90 ? 'A' : p >= 80 ? 'B' : p >= 70 ? 'C' : p >= 60 ? 'D' : 'F';

  // Grade distribution
  const gradeDist = [
    { grade: 'A', count: students.filter(s => (s.current_average || 0) >= 90).length, fill: '#059669' },
    { grade: 'B', count: students.filter(s => (s.current_average || 0) >= 80 && (s.current_average || 0) < 90).length, fill: '#374151' },
    { grade: 'C', count: students.filter(s => (s.current_average || 0) >= 70 && (s.current_average || 0) < 80).length, fill: '#6b7280' },
    { grade: 'D', count: students.filter(s => (s.current_average || 0) >= 60 && (s.current_average || 0) < 70).length, fill: '#d97706' },
    { grade: 'F', count: students.filter(s => (s.current_average || 0) < 60).length, fill: '#dc2626' },
  ];

  // Completion by category
  const byCat = assignments.reduce((acc, a) => {
    const cat = a.category || 'other';
    if (!acc[cat]) acc[cat] = { total: 0, graded: 0 };
    acc[cat].total++;
    acc[cat].graded += a.graded_count || 0;
    return acc;
  }, {});
  const completionData = Object.entries(byCat).map(([cat, d]) => ({
    cat: cat.replace(/_/g,' '), rate: d.total > 0 ? Math.round((d.graded / d.total) * 100) : 0
  })).sort((a, b) => b.rate - a.rate).slice(0, 8);

  // Risk trend
  const riskData = [
    { name: 'On Track', value: students.filter(s => s.risk_level === 'on_track').length, fill: '#059669' },
    { name: 'Watch', value: students.filter(s => s.risk_level === 'watch').length, fill: '#d97706' },
    { name: 'Concern', value: students.filter(s => s.risk_level === 'concern').length, fill: '#ea580c' },
    { name: 'At Risk', value: students.filter(s => s.risk_level === 'at_risk').length, fill: '#dc2626' },
    { name: 'Failing', value: students.filter(s => s.risk_level === 'failing').length, fill: '#7f1d1d' },
  ].filter(d => d.value > 0);

  // Simulated trend (mock 6-week trend)
  const trendData = [
    { week: 'Wk 1', avg: 78, missing: 12 },
    { week: 'Wk 2', avg: 76, missing: 18 },
    { week: 'Wk 3', avg: 80, missing: 10 },
    { week: 'Wk 4', avg: 79, missing: 14 },
    { week: 'Wk 5', avg: 82, missing: 8 },
    { week: 'Wk 6', avg: students.length > 0 ? Math.round(students.reduce((a,s) => a + (s.current_average||0), 0) / students.length) : 80, missing: students.reduce((a,s) => a + (s.missing_assignments||0), 0) },
  ];

  const generateForecast = async () => {
    setGenerating(true);
    const avgGrade = students.length ? Math.round(students.reduce((a, s) => a + (s.current_average || 0), 0) / students.length) : 0;
    const failing = students.filter(s => (s.current_average || 0) < 60).length;
    const improving = students.filter(s => s.trend === 'improving').length;
    const declining = students.filter(s => s.trend === 'declining').length;
    const missingTotal = students.reduce((a, s) => a + (s.missing_assignments || 0), 0);

    const result = await base44.integrations.Core.InvokeLLM({
      model: 'claude_sonnet_4_6',
      prompt: `You are an AI academic analytics engine. Generate a ${forecastType} forecast and analysis for a school.

Current Data:
- ${students.length} students, average grade: ${avgGrade}%
- ${failing} failing, ${improving} improving, ${declining} declining
- ${missingTotal} total missing assignments
- ${alerts.filter(a => !a.resolved).length} open alerts

Provide:
1. A 4-sentence data-driven forecast for ${forecastType}
2. Top 3 action items for school leaders/teachers
3. Students/groups to watch (based on patterns)
4. One predicted outcome if no action is taken

Be specific, data-referencing, and executive-level. Use school leadership tone.`,
    });
    setForecast(result);
    setGenerating(false);
  };

  const KPI = ({ label, value, trend, color }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-black ${color || 'text-black'}`}>{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          <span className="text-[10px] font-bold">{trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}</span>
        </div>
      )}
    </div>
  );

  const avgGrade = students.length ? Math.round(students.reduce((a, s) => a + (s.current_average || 0), 0) / students.length) : 0;
  const completionRate = students.length ? Math.round(students.reduce((a, s) => a + (s.completion_rate || 100), 0) / students.length) : 100;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">AI Analytics & Forecasting</h1>
          <p className="text-gray-400 text-sm mt-0.5">Predictive insights and academic performance intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={forecastType} onValueChange={setForecastType}>
            <SelectTrigger className="w-40 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['performance','attendance','intervention','standards'].map(t => (
                <SelectItem key={t} value={t}>{t.replace(/\b\w/g,c=>c.toUpperCase())} Forecast</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateForecast} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2">
            <Sparkles className="w-4 h-4" /> {generating ? 'Forecasting...' : 'AI Forecast'}
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KPI label="School Avg" value={`${avgGrade}%`} trend={avgGrade >= 75 ? 'up' : 'down'} color={avgGrade >= 70 ? 'text-black' : 'text-red-600'} />
        <KPI label="Students" value={students.length} />
        <KPI label="Completion" value={`${completionRate}%`} trend={completionRate >= 80 ? 'up' : 'down'} />
        <KPI label="Failing" value={students.filter(s => (s.current_average || 0) < 60).length} color={students.filter(s => (s.current_average || 0) < 60).length > 0 ? 'text-red-600' : 'text-emerald-600'} />
        <KPI label="Improving" value={students.filter(s => s.trend === 'improving').length} color="text-emerald-600" trend="up" />
      </div>

      {/* AI Forecast */}
      {(forecast || generating) && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#020205] rounded-2xl p-6 mb-6 flex gap-4">
          <Brain className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5" />
          {generating ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
              <p className="text-white/40 text-sm">AI is generating your academic forecast...</p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">{forecastType} Forecast · AI-Generated</p>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{forecast}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Trend Line */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">6-Week Performance Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
              <Area type="monotone" dataKey="avg" stroke="#000" strokeWidth={2} fill="url(#avgGrad)" name="Avg %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Grade Distribution</p>
          {gradeDist.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={gradeDist} barSize={32}>
                <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Students">
                  {gradeDist.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-200 text-sm font-bold">No grade data</div>
          )}
        </div>

        {/* Risk Pie */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Student Risk Distribution</p>
          {riskData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {riskData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {riskData.map(({ name, value, fill }) => (
                  <div key={name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: fill }} />
                    <span className="text-[10px] text-gray-500">{name}: {value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-200 text-sm font-bold">Add students</div>
          )}
        </div>

        {/* Completion by Category */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Completion by Assignment Type</p>
          {completionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={completionData} layout="vertical" barSize={12}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="cat" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="rate" fill="#000" radius={[0, 4, 4, 0]} name="%" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-200 text-sm font-bold">Add assignments</div>
          )}
        </div>
      </div>
    </div>
  );
}