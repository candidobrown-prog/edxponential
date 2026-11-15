import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ArrowLeft, Upload, Sparkles, RefreshCw, Download, Printer,
  Plus, Trash2, CheckCircle, Clock, AlertCircle, Tag, Save
} from 'lucide-react';

const EVENT_TYPES = [
  'School Start/End', 'Holiday', 'Break', 'Assessment Window', 'PD Day',
  'Board Meeting', 'Family Event', 'Report Card', 'Progress Report',
  'Staff Meeting', 'Field Trip', 'School Celebration', 'Parent Conference'
];

const TYPE_COLORS = {
  'Assessment Window': 'bg-blue-50 text-blue-700 border-blue-200',
  'Holiday': 'bg-green-50 text-green-700 border-green-200',
  'Break': 'bg-green-50 text-green-700 border-green-200',
  'PD Day': 'bg-purple-50 text-purple-700 border-purple-200',
  'Board Meeting': 'bg-amber-50 text-amber-700 border-amber-200',
  'Family Event': 'bg-pink-50 text-pink-700 border-pink-200',
  'Staff Meeting': 'bg-gray-50 text-gray-700 border-gray-200',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MasterCalendarPage() {
  const [events, setEvents] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: '', date: '', end_date: '', notes: '' });
  const [filterType, setFilterType] = useState('all');
  const [calendarPrompt, setCalendarPrompt] = useState('');

  const handleGenerateCalendar = async () => {
    setGenerating(true);
    const prompt = `You are an expert school calendar consultant. Generate a comprehensive school year calendar for 2025-2026 academic year.
${calendarPrompt ? `Additional context: ${calendarPrompt}` : ''}

Generate 20-25 key school calendar events including: school start/end dates, major holidays, breaks (fall, Thanksgiving, winter, spring), assessment windows (BOY, MOY, EOY), PD days, parent conferences, report card dates, board meetings, and school celebrations.

Return JSON: { "events": [ { "title": "First Day of School", "type": "School Start/End", "date": "2025-08-11", "end_date": "", "notes": "Welcome back assembly at 8am" } ] }`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt, model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: 'object',
        properties: {
          events: { type: 'array', items: { type: 'object', properties: { title:{type:'string'}, type:{type:'string'}, date:{type:'string'}, end_date:{type:'string'}, notes:{type:'string'} } } }
        }
      }
    });
    setEvents(result.events || []);
    setGenerating(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Extract all calendar events from this school calendar document. For each event extract: title, type (one of: School Start/End, Holiday, Break, Assessment Window, PD Day, Board Meeting, Family Event, Report Card, Progress Report, Staff Meeting, Field Trip, School Celebration, Parent Conference), date (YYYY-MM-DD), end_date if applicable, notes. Return JSON: { "events": [...] }`,
      file_urls: [file_url],
      response_json_schema: { type: 'object', properties: { events: { type: 'array', items: { type: 'object', properties: { title:{type:'string'}, type:{type:'string'}, date:{type:'string'}, end_date:{type:'string'}, notes:{type:'string'} } } } } }
    });
    setEvents(prev => [...prev, ...(result.events || [])]);
    setUploading(false);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    setNewEvent({ title: '', type: '', date: '', end_date: '', notes: '' });
    setShowAdd(false);
  };

  const filtered = filterType === 'all' ? events : events.filter(e => e.type === filterType);
  const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by month
  const byMonth = sorted.reduce((acc, ev) => {
    if (!ev.date) return acc;
    const month = new Date(ev.date + 'T00:00:00').getMonth();
    const key = MONTHS[month];
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/goaled" className="flex items-center gap-1 text-white/30 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Goaled Xschool™
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Master Calendar</h1>
              <p className="text-white/40 mt-1 text-sm">AI-powered centralized school master calendar system.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                <Printer className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* Action Bar */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">AI Calendar Generator</p>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 min-h-[60px] resize-none"
              placeholder="Optional: Add context about your school (state, region, school type, special dates)..."
              value={calendarPrompt}
              onChange={e => setCalendarPrompt(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleGenerateCalendar} disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all">
                {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Calendar</>}
              </button>
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">
                <Plus className="w-4 h-4" /> Add Event
              </button>
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all cursor-pointer">
                {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Calendar
                <input type="file" className="hidden" accept=".pdf,.xlsx,.xls,.csv,.docx" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          <div className="bg-[#0a0f1e] rounded-2xl p-5">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">Calendar Stats</p>
            <p className="text-4xl font-black text-white">{events.length}</p>
            <p className="text-white/30 text-xs mt-1">Total events</p>
            <div className="mt-4 space-y-1.5">
              {['Assessment Window', 'PD Day', 'Holiday'].map(type => {
                const count = events.filter(e => e.type === type).length;
                return count > 0 ? (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">{type}</span>
                    <span className="text-white/60 text-xs font-black">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Add Event Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <p className="font-black text-[#0a0f1e]">Add Calendar Event</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Event Title</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                    placeholder="e.g. Fall Assessment Window" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Event Type</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                    value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))}>
                    <option value="">Select type...</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                    value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Notes</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                    placeholder="Optional notes..." value={newEvent.notes} onChange={e => setNewEvent(p => ({ ...p, notes: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddEvent} className="px-5 py-2.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all">Save</button>
                <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${filterType === 'all' ? 'bg-[#0a0f1e] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'}`}>All Events</button>
          {EVENT_TYPES.map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${filterType === t ? 'bg-[#0a0f1e] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'}`}>{t}</button>
          ))}
        </div>

        {/* Calendar */}
        {Object.keys(byMonth).length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-black text-[#0a0f1e] mb-2">No calendar events yet</p>
            <p className="text-gray-400 text-sm">Generate a calendar with AI, upload an existing one, or add events manually.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(byMonth).map(([month, monthEvents]) => (
              <div key={month}>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{month}</p>
                <div className="space-y-2">
                  {monthEvents.map((ev, i) => {
                    const colorClass = TYPE_COLORS[ev.type] || 'bg-gray-50 text-gray-700 border-gray-200';
                    return (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                        <div className="text-center min-w-[48px]">
                          <p className="text-xl font-black text-[#0a0f1e]">{ev.date ? new Date(ev.date + 'T00:00:00').getDate() : '?'}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-[#0a0f1e] text-sm">{ev.title}</p>
                            {ev.type && <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${colorClass}`}>{ev.type}</span>}
                          </div>
                          {ev.notes && <p className="text-xs text-gray-400 mt-0.5">{ev.notes}</p>}
                        </div>
                        <button onClick={() => setEvents(prev => prev.filter((_, j) => j !== sorted.indexOf(ev)))}
                          className="p-2 rounded-xl hover:bg-red-50 transition-all">
                          <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}