import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Bell, X, Trash2, Search, CheckCheck, Sparkles, AlertCircle, Calendar, Target, Users, Clock, TrendingUp, BookOpen, MessageSquare } from 'lucide-react';

const ICON_MAP = {
  deadline: Clock,
  goal: Target,
  coaching: Users,
  calendar: Calendar,
  assessment: BookOpen,
  alert: AlertCircle,
  message: MessageSquare,
  ai: Sparkles,
};

const SAMPLE_NOTIFS = [
  { id: 1, type: 'deadline', title: 'Q1 Goal Checkpoint Due', body: 'Reading proficiency checkpoint is due in 3 days. Review your data team notes.', time: '2h ago', pinned: false, read: false, priority: 'high' },
  { id: 2, type: 'coaching', title: 'Coaching Session Reminder', body: 'You have a coaching session with Ms. Rivera tomorrow at 9am.', time: '4h ago', pinned: false, read: false, priority: 'medium' },
  { id: 3, type: 'assessment', title: 'MOY Assessment Window Opens', body: 'Mid-year NWEA MAP window opens Monday. Ensure all classrooms are scheduled.', time: '1d ago', pinned: true, read: true, priority: 'high' },
  { id: 4, type: 'goal', title: 'Goal Progress: Math Proficiency', body: 'Math proficiency goal is at 68% — on track for your 75% target by EOY.', time: '2d ago', pinned: false, read: true, priority: 'low' },
  { id: 5, type: 'ai', title: 'AI Insight: Attendance Trend', body: '3rd grade attendance dropped 4% this week. Consider a parent outreach campaign.', time: '3d ago', pinned: false, read: false, priority: 'medium' },
  { id: 6, type: 'calendar', title: 'Board Meeting Next Week', body: 'Quarterly board meeting scheduled for Thursday. Prepare your data dashboard.', time: '3d ago', pinned: false, read: true, priority: 'medium' },
];

const PRIORITY_DOT = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-green-500' };

export default function NotificaxionsBar() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(SAMPLE_NOTIFS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [generating, setGenerating] = useState(false);
  const ref = useRef(null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handlePin = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const handleDismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id));
  const handleMarkAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const handleOpen = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleGenerateAI = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 3 intelligent, timely school leadership notifications for a K-8 principal. Focus on: operational urgency, academic data, coaching, and culture. Return JSON: { "notifications": [ { "type": "ai|deadline|coaching|assessment|goal|calendar|alert", "title": "...", "body": "1-2 sentences, specific and actionable", "priority": "high|medium|low" } ] }`,
      response_json_schema: { type: 'object', properties: { notifications: { type: 'array', items: { type: 'object', properties: { type:{type:'string'}, title:{type:'string'}, body:{type:'string'}, priority:{type:'string'} } } } } }
    });
    const newNotifs = (result.notifications || []).map((n, i) => ({
      ...n, id: Date.now() + i, time: 'Just now', pinned: false, read: false
    }));
    setNotifs(prev => [...newNotifs, ...prev]);
    setGenerating(false);
  };

  const filtered = notifs
    .filter(n => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || n.type === filterType || (filterType === 'unread' && !n.read) || (filterType === 'pinned' && n.pinned);
      return matchSearch && matchType;
    })
    .sort((a, b) => b.pinned - a.pinned);

  return (
    <div ref={ref} className="relative" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-11 w-[420px] bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-black text-[#0a0f1e] text-sm">Notificaxions</p>
                  {unread > 0 && <p className="text-xs text-gray-400">{unread} unread</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleGenerateAI} disabled={generating}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#0a0f1e] text-white rounded-xl text-[10px] font-black hover:bg-[#1a2033] transition-all">
                    {generating ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /></> : <Sparkles className="w-3 h-3" />}
                    AI
                  </button>
                  <button onClick={handleMarkAllRead}
                    className="p-1.5 rounded-xl hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {['all', 'unread', 'pinned', 'ai', 'deadline', 'coaching', 'assessment', 'goal'].map(f => (
                  <button key={f} onClick={() => setFilterType(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black whitespace-nowrap capitalize transition-all ${filterType === f ? 'bg-[#0a0f1e] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="overflow-y-auto max-h-[400px]">
              {filtered.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-bold">No notifications</p>
                </div>
              ) : (
                filtered.map(notif => {
                  const Icon = ICON_MAP[notif.type] || Bell;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleOpen(notif.id)}
                      className={`px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer group ${!notif.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${notif.pinned ? 'bg-[#0a0f1e]' : 'bg-gray-100'}`}>
                          <Icon className={`w-3.5 h-3.5 ${notif.pinned ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`text-xs font-black text-[#0a0f1e] leading-tight ${!notif.read ? 'font-black' : 'font-bold'}`}>{notif.title}</p>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[notif.priority]}`} />
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                          </div>
                          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{notif.body}</p>
                          <p className="text-[10px] text-gray-300 mt-1">{notif.time}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={e => { e.stopPropagation(); handlePin(notif.id); }}
                            className={`p-1 rounded-lg transition-all ${notif.pinned ? 'text-[#0a0f1e]' : 'text-gray-300 hover:text-gray-600'}`}>
                            <span className="text-[10px] font-black">📌</span>
                          </button>
                          <button onClick={e => { e.stopPropagation(); handleDismiss(notif.id); }}
                            className="p-1 rounded-lg text-gray-300 hover:text-red-500 transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}