import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Play, Upload, Radio, Video, BarChart3, Zap, Tv, Users, Plus, Eye, Clock, TrendingUp, Star, ArrowRight, Mic, BookOpen, Layers } from 'lucide-react';

const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'videos', label: 'My Videos', path: '/tubedx/videos' },
  { id: 'events', label: 'Live Events', path: '/tubedx/events' },
  { id: 'analytics', label: 'Analytics', path: '/tubedx/analytics' },
  { id: 'ai', label: 'AI Studio', path: '/tubedx/ai-studio' },
  { id: 'ott', label: 'OTT Platform', path: '/tubedx/ott' },
];

function StatCard({ label, value, icon: Icon, sub, dark }) {
  return (
    <div className={`rounded-2xl p-5 ${dark ? 'bg-[#0a0f1e]' : 'bg-white border border-gray-100'}`}>
      <Icon className={`w-4 h-4 mb-3 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
      <p className={`text-2xl font-black ${dark ? 'text-white' : 'text-[#0a0f1e]'}`}>{value}</p>
      <p className={`text-xs font-black uppercase tracking-widest mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>{label}</p>
      {sub && <p className={`text-xs mt-1 ${dark ? 'text-white/20' : 'text-gray-300'}`}>{sub}</p>}
    </div>
  );
}

export default function TubedXDashboard() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [vids, evts] = await Promise.all([
        base44.entities.TubedXVideo.filter({ owner_email: u.email }, '-created_date', 20),
        base44.entities.TubedXEvent.filter({ owner_email: u.email }, '-created_date', 10),
      ]);
      setVideos(vids);
      setEvents(evts);
    }).finally(() => setLoading(false));
  }, []);

  const totalViews = videos.reduce((s, v) => s + (v.views_count || 0), 0);
  const totalWatchMin = videos.reduce((s, v) => s + (v.watch_time_minutes || 0), 0);
  const avgCompletion = videos.length > 0 ? Math.round(videos.reduce((s, v) => s + (v.completion_rate || 0), 0) / videos.length) : 0;
  const liveEvents = events.filter(e => e.status === 'live').length;
  const upcomingEvents = events.filter(e => e.status === 'scheduled').length;

  const quickActions = [
    { label: 'Upload Video', icon: Upload, path: '/tubedx/videos', color: 'bg-[#0a0f1e] text-white' },
    { label: 'Go Live', icon: Radio, path: '/tubedx/events', color: 'bg-white border border-gray-200 text-[#0a0f1e]' },
    { label: 'Create Webinar', icon: Mic, path: '/tubedx/events', color: 'bg-white border border-gray-200 text-[#0a0f1e]' },
    { label: 'AI Script', icon: Zap, path: '/tubedx/ai-studio', color: 'bg-white border border-gray-200 text-[#0a0f1e]' },
    { label: 'Analytics', icon: BarChart3, path: '/tubedx/analytics', color: 'bg-white border border-gray-200 text-[#0a0f1e]' },
    { label: 'OTT Channel', icon: Tv, path: '/tubedx/ott', color: 'bg-white border border-gray-200 text-[#0a0f1e]' },
  ];

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">edXponential</p>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-[#0a0f1e] fill-[#0a0f1e]" />
              </div>
              TubedX™
            </h1>
            <p className="text-white/30 text-sm mt-1">AI-Powered Video Ecosystem for Education Leaders</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/tubedx/videos">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                <Upload className="w-4 h-4" /> Upload Video
              </button>
            </Link>
            <Link to="/tubedx/events">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white rounded-xl font-black text-sm hover:bg-white/10 transition-all">
                <Radio className="w-4 h-4" /> Go Live
              </button>
            </Link>
          </div>
        </div>

        {/* Sub Nav */}
        <div className="max-w-7xl mx-auto mt-6 flex gap-1 overflow-x-auto">
          {NAV_TABS.map(t => (
            <Link key={t.id} to={t.path || '/tubedx/dashboard'}>
              <button className={`px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all ${t.id === 'dashboard' ? 'bg-white text-[#0a0f1e]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                {t.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard label="Videos" value={videos.length} icon={Video} sub="uploaded" dark />
          <StatCard label="Total Views" value={totalViews.toLocaleString()} icon={Eye} sub="all time" />
          <StatCard label="Watch Time" value={`${Math.round(totalWatchMin / 60)}h`} icon={Clock} sub="total hours" />
          <StatCard label="Completion" value={`${avgCompletion}%`} icon={TrendingUp} sub="avg rate" />
          <StatCard label="Live Events" value={liveEvents} icon={Radio} sub={`${upcomingEvents} upcoming`} />
          <StatCard label="Webinars" value={events.filter(e => e.event_type === 'webinar').length} icon={Mic} sub="total" />
        </div>

        {/* Quick Actions */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(({ label, icon: Icon, path, color }) => (
              <Link key={label} to={path}>
                <button className={`w-full flex flex-col items-center gap-2 p-4 rounded-2xl font-black text-xs transition-all hover:shadow-md ${color}`}>
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Videos */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-[#0a0f1e]">Recent Videos</h2>
            <Link to="/tubedx/videos" className="text-xs font-black text-gray-400 hover:text-[#0a0f1e] flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {videos.length === 0 ? (
            <div className="py-16 text-center">
              <Video className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-300">No videos yet.</p>
              <Link to="/tubedx/videos">
                <button className="mt-4 px-5 py-2.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm">
                  Upload Your First Video
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {videos.slice(0, 6).map(v => (
                <div key={v.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-all">
                  <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {v.thumbnail_url ? (
                      <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#0a0f1e] text-sm truncate">{v.title}</p>
                    <p className="text-xs text-gray-400">{v.video_type} · {v.visibility}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{v.views_count || 0}</span>
                    <span className={`px-2 py-0.5 rounded-full font-black ${v.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-[#0a0f1e]">Upcoming Events</h2>
            <Link to="/tubedx/events" className="text-xs font-black text-gray-400 hover:text-[#0a0f1e] flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {events.filter(e => e.status === 'scheduled').length === 0 ? (
            <div className="py-12 text-center">
              <Radio className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-300 text-sm">No upcoming events.</p>
              <Link to="/tubedx/events">
                <button className="mt-3 px-5 py-2 bg-[#0a0f1e] text-white rounded-xl font-black text-sm">
                  Schedule an Event
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {events.filter(e => e.status === 'scheduled').map(ev => (
                <div key={ev.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-black text-[#0a0f1e] text-sm">{ev.title}</p>
                    <p className="text-xs text-gray-400">{ev.event_type} · {ev.registrations_count || 0} registered</p>
                  </div>
                  <span className="text-xs font-black text-[#0a0f1e] bg-gray-100 px-3 py-1 rounded-full">
                    {ev.scheduled_at ? new Date(ev.scheduled_at).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integrations Row */}
        <div className="bg-[#0a0f1e] rounded-2xl p-6">
          <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-4">TubedX Integrations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'edVisors', path: '/edvisors' },
              { label: 'edVestors', path: '/edvestors' },
              { label: 'Deal Room', path: '/deal-room' },
              { label: 'TwotrX', path: '/twotrx' },
              { label: 'OneJob', path: '/onejob' },
              { label: 'edXportante', path: '/edxportante' },
              { label: 'Courses', path: '/courses' },
              { label: 'Communities', path: '/communities' },
            ].map(({ label, path }) => (
              <Link key={label} to={path}>
                <button className="w-full py-2.5 px-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/10 font-black text-xs transition-all">
                  {label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}