import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Clock, Eye, Zap, Brain,
  AlertTriangle, CheckCircle2, Sparkles, Loader2,
  ArrowUp, ArrowDown, Target, Award
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COMPLETION_DATA = [
  { week: 'Wk 1', rate: 92 }, { week: 'Wk 2', rate: 87 }, { week: 'Wk 3', rate: 80 },
  { week: 'Wk 4', rate: 78 }, { week: 'Wk 5', rate: 76 }, { week: 'Wk 6', rate: 74 },
];
const ENROLLMENT_DATA = [
  { month: 'Jan', students: 120 }, { month: 'Feb', students: 180 }, { month: 'Mar', students: 240 },
  { month: 'Apr', students: 310 }, { month: 'May', students: 420 }, { month: 'Jun', students: 490 },
];
const ENGAGEMENT_DATA = [
  { lesson: 'L1', watch: 95 }, { lesson: 'L2', watch: 91 }, { lesson: 'L3', watch: 88 },
  { lesson: 'L4', watch: 82 }, { lesson: 'L5', watch: 78 }, { lesson: 'L6', watch: 85 },
  { lesson: 'L7', watch: 74 }, { lesson: 'L8', watch: 70 },
];

const customTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-white/50 font-bold">{label}</p>
      <p className="text-white font-black">{payload[0].value}{typeof payload[0].value === 'number' && payload[0].name !== 'students' ? '%' : ''}</p>
    </div>
  );
};

export default function ClassifiedxAnalytics() {
  const [aiInsight, setAiInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAIInsight = async () => {
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert learning analytics AI. Analyze this course performance data and generate strategic insights and recommendations for an educational platform:

METRICS:
- Total students: 1,493
- Average completion rate: 75%
- Average watch time per lesson: 8.2 minutes
- Course rating: 4.8/5
- Revenue: $27,500
- Enrollment trend: Increasing 20% month over month
- Drop-off point: Lesson 7-8 (70% completion - highest drop)
- Best performing course: Classroom Management Masterclass (847 students)
- Quiz average: 82%

Generate specific, actionable insights. Be direct and focused.`,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_health_score: { type: 'number' },
            key_insights: { type: 'array', items: { type: 'string' } },
            at_risk_signals: { type: 'array', items: { type: 'string' } },
            top_recommendations: { type: 'array', items: { type: 'string' } },
            growth_opportunities: { type: 'array', items: { type: 'string' } },
            predicted_revenue_30d: { type: 'string' },
            executive_summary: { type: 'string' },
          }
        }
      });
      setAiInsight(res);
      toast.success('AI analysis complete.');
    } catch (e) {
      toast.error('Analysis failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">Learning Analytics</h1>
          </div>
          <p className="text-xs text-white/30">AI-powered intelligence for your educational ecosystem</p>
        </div>
        <Button onClick={handleAIInsight} disabled={loading} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
          {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : <><Sparkles className="w-3.5 h-3.5" /> AI Analysis</>}
        </Button>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Students', value: '1,493', change: '+18%', up: true, icon: Users },
            { label: 'Avg Completion', value: '75%', change: '+3%', up: true, icon: CheckCircle2 },
            { label: 'Avg Watch Time', value: '8.2 min', change: '-0.4', up: false, icon: Clock },
            { label: 'Avg Quiz Score', value: '82%', change: '+2%', up: true, icon: Target },
          ].map(({ label, value, change, up, icon: Icon }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="border border-white/8 rounded-2xl p-4 bg-white/2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-white/30 font-bold">{label}</span>
                <Icon className="w-3.5 h-3.5 text-white/15" />
              </div>
              <div className="font-black text-xl text-white">{value}</div>
              <div className={`text-[11px] flex items-center gap-1 mt-1 font-bold ${up ? 'text-white/50' : 'text-white/30'}`}>
                {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {change} this month
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white/8 rounded-2xl p-5 bg-white/2 md:col-span-2">
            <h3 className="font-black text-sm text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-white/40" /> Monthly Enrollments</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ENROLLMENT_DATA}>
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="students" fill="rgba(255,255,255,0.25)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
            <h3 className="font-black text-sm text-white mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-white/40" /> Lesson Engagement %</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={ENGAGEMENT_DATA}>
                <XAxis dataKey="lesson" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
                <Tooltip content={customTooltip} />
                <Line dataKey="watch" stroke="rgba(255,255,255,0.5)" strokeWidth={2} dot={{ fill: 'rgba(255,255,255,0.5)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Trend */}
        <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
          <h3 className="font-black text-sm text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-white/40" /> Weekly Completion Rate Trend</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={COMPLETION_DATA}>
              <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip content={customTooltip} />
              <Line dataKey="rate" stroke="rgba(255,255,255,0.6)" strokeWidth={2.5} dot={{ fill: 'rgba(255,255,255,0.6)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight Panel */}
        {aiInsight && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="border border-white/10 rounded-2xl p-6 bg-white/3">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-white/60" />
                <h3 className="font-black text-sm text-white">AI Intelligence Report</h3>
              </div>
              <div className="text-center border border-white/10 rounded-xl px-3 py-1.5">
                <div className="font-black text-white text-lg">{aiInsight.overall_health_score}/100</div>
                <div className="text-[10px] text-white/30">Health Score</div>
              </div>
            </div>

            <p className="text-sm text-white/60 mb-5 leading-relaxed">{aiInsight.executive_summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsight.key_insights?.length > 0 && (
                <div>
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Key Insights</p>
                  {aiInsight.key_insights.map((ins, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/50 py-1"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30" />{ins}</div>
                  ))}
                </div>
              )}
              {aiInsight.top_recommendations?.length > 0 && (
                <div>
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Top Recommendations</p>
                  {aiInsight.top_recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/50 py-1"><Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30" />{rec}</div>
                  ))}
                </div>
              )}
              {aiInsight.at_risk_signals?.length > 0 && (
                <div>
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Risk Signals</p>
                  {aiInsight.at_risk_signals.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/50 py-1"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/25" />{r}</div>
                  ))}
                </div>
              )}
              {aiInsight.growth_opportunities?.length > 0 && (
                <div>
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Growth Opportunities</p>
                  {aiInsight.growth_opportunities.map((g, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/50 py-1"><Award className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30" />{g}</div>
                  ))}
                </div>
              )}
            </div>

            {aiInsight.predicted_revenue_30d && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">30-Day Revenue Forecast: </span>
                <span className="text-sm font-black text-white/70">{aiInsight.predicted_revenue_30d}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}