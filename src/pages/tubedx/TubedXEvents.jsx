import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Radio, Mic, Users, Calendar, Clock, Plus, X, CheckCircle, TrendingUp, Bell } from 'lucide-react';

const EVENT_TYPES = ['webinar', 'livestream', 'conference', 'summit', 'training', 'town_hall', 'investor_meeting'];
const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-500',
  scheduled: 'bg-blue-100 text-blue-700',
  live: 'bg-red-500 text-white animate-pulse',
  ended: 'bg-gray-100 text-gray-400',
  replay_available: 'bg-green-100 text-green-700',
};

function CreateEventModal({ onClose, onSaved, userEmail }) {
  const [form, setForm] = useState({ title: '', description: '', event_type: 'webinar', scheduled_at: '', duration_minutes: 60, registration_required: true, max_attendees: '', is_paid: false, ticket_price: 0 });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const saved = await base44.entities.TubedXEvent.create({ ...form, owner_email: userEmail, status: 'scheduled' });
    setDone(true);
    setTimeout(() => { onSaved(saved); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-[#0a0f1e] text-lg">Create Event</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {done ? (
          <div className="py-10 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-black text-[#0a0f1e]">Event Created!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-black placeholder:text-gray-300 focus:outline-none focus:border-[#0a0f1e]" placeholder="Event Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none h-20 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Event Type</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-black focus:outline-none" value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })}>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Duration (min)</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-black focus:outline-none" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Scheduled Date & Time</label>
              <input type="datetime-local" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} />
            </div>
            <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none" placeholder="Max Attendees (optional)" value={form.max_attendees} onChange={e => setForm({ ...form, max_attendees: e.target.value })} />
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <label className="text-sm font-black text-[#0a0f1e] flex-1">Paid Event</label>
              <button onClick={() => setForm({ ...form, is_paid: !form.is_paid })} className={`w-10 h-5 rounded-full transition-all ${form.is_paid ? 'bg-[#0a0f1e]' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.is_paid ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            {form.is_paid && (
              <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none" placeholder="Ticket Price ($)" value={form.ticket_price} onChange={e => setForm({ ...form, ticket_price: Number(e.target.value) })} />
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-black text-sm text-gray-500">Cancel</button>
              <button onClick={handleSubmit} disabled={!form.title || saving}
                className="flex-1 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TubedXEvents() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const evts = await base44.entities.TubedXEvent.filter({ owner_email: u.email }, '-created_date', 50);
      setEvents(evts);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'all' ? events : events.filter(e => e.status === activeFilter || e.event_type === activeFilter);
  const totalRegistrations = events.reduce((s, e) => s + (e.registrations_count || 0), 0);
  const totalRevenue = events.reduce((s, e) => s + (e.revenue_generated || 0), 0);

  if (loading) return <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onSaved={e => setEvents(prev => [e, ...prev])} userEmail={user?.email} />}

      <div className="bg-[#0a0f1e] px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">TubedX™</p>
            <h1 className="text-2xl font-black text-white">Live Events & Webinars</h1>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: events.length, icon: Radio },
            { label: 'Registrations', value: totalRegistrations.toLocaleString(), icon: Users },
            { label: 'Live Now', value: events.filter(e => e.status === 'live').length, icon: TrendingUp },
            { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <Icon className="w-4 h-4 text-gray-400 mb-3" />
              <p className="text-2xl font-black text-[#0a0f1e]">{value}</p>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'scheduled', 'live', 'webinar', 'livestream', 'conference', 'ended'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeFilter === f ? 'bg-[#0a0f1e] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-[#0a0f1e]'}`}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Events List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <Radio className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-300">No events yet.</p>
            <button onClick={() => setShowCreate(true)} className="mt-4 px-6 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm">
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${ev.event_type === 'webinar' ? 'bg-blue-100' : ev.event_type === 'livestream' ? 'bg-red-100' : 'bg-gray-100'}`}>
                  {ev.event_type === 'webinar' ? <Mic className="w-5 h-5 text-blue-600" /> : <Radio className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#0a0f1e]">{ev.title}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400 uppercase font-black">{ev.event_type.replace('_', ' ')}</span>
                    {ev.scheduled_at && <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ev.scheduled_at).toLocaleDateString()}</span>}
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{ev.duration_minutes}min</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" />{ev.registrations_count || 0} registered</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {ev.is_paid && <span className="text-xs font-black text-[#0a0f1e] bg-gray-100 px-2 py-1 rounded-lg">${ev.ticket_price}</span>}
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full ${STATUS_COLORS[ev.status] || 'bg-gray-100 text-gray-500'}`}>{ev.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}