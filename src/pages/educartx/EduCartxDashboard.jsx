import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, Star, Sparkles, Loader2, ArrowUpRight, ArrowDownRight, Package, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 4200, orders: 38 }, { month: 'Feb', revenue: 5800, orders: 52 },
  { month: 'Mar', revenue: 7100, orders: 64 }, { month: 'Apr', revenue: 6400, orders: 58 },
  { month: 'May', revenue: 9200, orders: 83 }, { month: 'Jun', revenue: 11400, orders: 102 },
];

const TOP_PRODUCTS = [
  { name: 'K-5 Reading Bundle', revenue: 12727, sales: 143, change: 12 },
  { name: '30-Day Teacher Bootcamp', revenue: 9983, sales: 67, change: 8 },
  { name: 'Principal Leadership Masterclass', revenue: 7450, sales: 21, change: -3 },
  { name: 'Math Intervention Toolkit', revenue: 5610, sales: 89, change: 22 },
];

const STATS = [
  { label: 'Total Revenue', value: '$44,100', change: '+18%', up: true, icon: DollarSign },
  { label: 'Orders', value: '397', change: '+12%', up: true, icon: ShoppingCart },
  { label: 'Customers', value: '284', change: '+9%', up: true, icon: Users },
  { label: 'Avg. Rating', value: '4.87', change: '+0.2', up: true, icon: Star },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs">
      <div className="text-white/40 mb-1">{label}</div>
      <div className="text-white font-black">${payload[0]?.value?.toLocaleString()}</div>
    </div>
  );
};

export default function EduCartxDashboard() {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const generateInsights = async () => {
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an elite ecommerce AI strategist for EduCartx™. Analyze this creator's performance data:
- Total Revenue: $44,100 (up 18%)
- Orders: 397 (up 12%)
- Top product: K-5 Reading Bundle ($12,727)
- Best growth: Math Intervention Toolkit (+22%)

Provide: executive_summary (2 sentences), top_opportunities (3 items), pricing_recommendation, next_product_idea, marketing_tip.
Return as JSON.`,
        response_json_schema: {
          type: 'object',
          properties: {
            executive_summary: { type: 'string' },
            top_opportunities: { type: 'array', items: { type: 'string' } },
            pricing_recommendation: { type: 'string' },
            next_product_idea: { type: 'string' },
            marketing_tip: { type: 'string' }
          }
        }
      });
      setAiInsights(res);
    } catch { toast.error('AI insights failed'); }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-white/50" />
            <h1 className="font-black text-lg tracking-tight">Creator Dashboard</h1>
          </div>
          <p className="text-xs text-white/30">Revenue analytics, product performance, and AI-powered growth insights</p>
        </div>
        <Button onClick={generateInsights} disabled={aiLoading} className="bg-white text-black font-black text-xs h-8 px-4 hover:bg-white/90 rounded-full gap-1.5">
          {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> AI Insights</>}
        </Button>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="border border-white/6 rounded-2xl p-5 bg-white/1">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-4 h-4 text-white/25" />
                <div className={`flex items-center gap-1 text-[10px] font-black ${s.up ? 'text-white/50' : 'text-red-400/50'}`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{s.change}
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1">{s.value}</div>
              <div className="text-[10px] text-white/25 uppercase tracking-widest font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        {aiInsights && (
          <div className="border border-white/8 rounded-2xl p-5 bg-white/2 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/40" />
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">AI Growth Intelligence</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{aiInsights.executive_summary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {aiInsights.top_opportunities?.map((o, i) => (
                <div key={i} className="border border-white/6 rounded-xl p-3 bg-white/2">
                  <div className="text-[10px] font-black text-white/25 mb-1">Opportunity {i + 1}</div>
                  <div className="text-xs text-white/60">{o}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Pricing Rec.', val: aiInsights.pricing_recommendation },
                { label: 'Next Product', val: aiInsights.next_product_idea },
                { label: 'Marketing Tip', val: aiInsights.marketing_tip },
              ].filter(f => f.val).map((f, i) => (
                <div key={i} className="border border-white/6 rounded-xl p-3 bg-white/1">
                  <div className="text-[10px] font-black text-white/25 mb-1">{f.label}</div>
                  <div className="text-xs text-white/50">{f.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Chart */}
        <div className="border border-white/6 rounded-2xl p-5 bg-white/1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-black text-sm text-white/70">Revenue Over Time</div>
              <div className="text-[10px] text-white/25 mt-0.5">Last 6 months</div>
            </div>
            <TrendingUp className="w-4 h-4 text-white/20" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="rgba(255,255,255,0.4)" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="border border-white/6 rounded-2xl p-5 bg-white/1">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-white/25" />
            <span className="font-black text-sm text-white/60">Top Products</span>
          </div>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 text-center text-[10px] font-black text-white/20">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-white/70 truncate">{p.name}</div>
                  <div className="h-1.5 bg-white/5 rounded-full mt-1.5">
                    <div className="h-full bg-white/30 rounded-full" style={{ width: `${(p.revenue / 14000) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white/70">${p.revenue.toLocaleString()}</div>
                  <div className={`text-[10px] font-black ${p.change > 0 ? 'text-white/40' : 'text-red-400/40'}`}>
                    {p.change > 0 ? '+' : ''}{p.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}