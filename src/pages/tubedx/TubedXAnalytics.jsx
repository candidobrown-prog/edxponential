import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Eye, Clock, TrendingUp, Users, Zap, BarChart3, Video, Play } from 'lucide-react';

const MOCK_WEEKLY = [
  { day: 'Mon', views: 42, watchTime: 86 },
  { day: 'Tue', views: 68, watchTime: 140 },
  { day: 'Wed', views: 55, watchTime: 110 },
  { day: 'Thu', views: 90, watchTime: 200 },
  { day: 'Fri', views: 120, watchTime: 260 },
  { day: 'Sat', views: 75, watchTime: 155 },
  { day: 'Sun', views: 48, watchTime: 95 },
];

const DEVICE_DATA = [
  { name: 'Desktop', value: 52 },
  { name: 'Mobile', value: 33 },
  { name: 'Tablet', value: 10 },
  { name: 'Smart TV', value: 5 },
];
const COLORS = ['#0a0f1e', '#555', '#999', '#ccc'];

export default function TubedXAnalytics() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [vids, evts] = await Promise.all([
        base44.entities.TubedXVideo.filter({ owner_email: u.email }, '-views_count', 20),
        base44.entities.TubedXEvent.filter({ owner_email: u.email }, '-created_date', 20),
      ]);
      setVideos(vids);
      setEvents(evts);
    }).finally(() => setLoading(false));
  }, []);

  const totalViews = videos.reduce((s, v) => s + (v.views_count || 0), 0);
  const totalWatchMin = videos.reduce((s, v) => s + (v.watch_time_minutes || 0), 0);
  const avgCompletion = videos.length > 0 ? Math.round(videos.reduce((s, v) => s + (v.completion_rate || 0), 0) / videos.length) : 0;
  const totalRegistrations = events.reduce((s, e) => s + (e.registrations_count || 0), 0);
  const topVideos = [...videos].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);

  const generateAIInsights = async () => {
    setGeneratingAI(true);
    const prompt = `You are a video analytics AI for an education platform. Based on this data, generate 4 actionable insights:
- Total videos: ${videos.length}
- Total views: ${totalViews}
- Avg completion: ${avgCompletion}%
- Total watch time: ${Math.round(totalWatchMin / 60)} hours
- Events: ${events.length}, Registrations: ${totalRegistrations}
- Top video: ${topVideos[0]?.title || 'N/A'} (${topVideos[0]?.views_count || 0} views)

Return JSON: { "insights": ["insight1", "insight2", "insight3", "insight4"] }`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: { type: 'object', properties: { insights: { type: 'array', items: { type: 'string' } } } }
    });
    setAiInsights(result.insights || []);
    setGeneratingAI(false);
  };

  if (loading) return <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">TubedX™</p>
            <h1 className="text-2xl font-black text-white">Analytics</h1>
            <p className="text-white/30 text-sm mt-1">Performance insights across all your content</p>
          </div>
          <button onClick={generateAIInsights} disabled={generatingAI}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 disabled:opacity-50 transition-all">
            <Zap className="w-4 h-4" />{generatingAI ? 'Analyzing...' : 'AI Insights'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, sub: 'all time' },
            { label: 'Watch Time', value: `${Math.round(totalWatchMin / 60)}h`, icon: Clock, sub: 'total hours' },
            { label: 'Avg Completion', value: `${avgCompletion}%`, icon: TrendingUp, sub: 'all videos' },
            { label: 'Registrations', value: totalRegistrations.toLocaleString(), icon: Users, sub: 'all events' },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <Icon className="w-4 h-4 text-gray-400 mb-3" />
              <p className="text-2xl font-black text-[#0a0f1e]">{value}</p>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
              <p className="text-xs text-gray-300 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="font-black text-[#0a0f1e] mb-5">Views This Week</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOCK_WEEKLY}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: 'Arial', fontSize: 12, border: '1px solid #eee', borderRadius: 8 }} />
                <Bar dataKey="views" fill="#0a0f1e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="font-black text-[#0a0f1e] mb-5">Watch Time (minutes)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MOCK_WEEKLY}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: 'Arial', fontSize: 12, border: '1px solid #eee', borderRadius: 8 }} />
                <Line type="monotone" dataKey="watchTime" stroke="#0a0f1e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="font-black text-[#0a0f1e] mb-5">Device Breakdown</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={DEVICE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value">
                  {DEVICE_DATA.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: 'Arial', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {DEVICE_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} /><span className="text-gray-500">{d.name}</span></div>
                  <span className="font-black text-[#0a0f1e]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Videos */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <p className="font-black text-[#0a0f1e] mb-5">Top Performing Videos</p>
            {topVideos.length === 0 ? (
              <div className="py-10 text-center"><Video className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-gray-300 text-sm font-black">No videos yet</p></div>
            ) : (
              <div className="space-y-3">
                {topVideos.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-4">
                    <span className="text-2xl font-black text-gray-200 w-6 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-[#0a0f1e] truncate">{v.title}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                        <div className="bg-[#0a0f1e] h-1.5 rounded-full" style={{ width: `${Math.min(100, ((v.views_count || 0) / (topVideos[0]?.views_count || 1)) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#0a0f1e]">{(v.views_count || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="bg-[#0a0f1e] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-white/40" />
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">AI Analytics Insights</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((ins, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                  <p className="text-white/60 text-sm leading-relaxed">{ins}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}