import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, Mail, Smartphone, Watch, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e] bg-white transition-all";

function Toggle({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50">
      <div>
        <p className="font-bold text-sm text-[#0a0f1e]">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${value ? 'bg-[#0a0f1e]' : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

export default function NotificationPrefs() {
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [record, setRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const existing = await base44.entities.NotificationPrefs.filter({ user_email: u.email }, '-created_date', 1);
      if (existing.length > 0) { setRecord(existing[0]); setPrefs(existing[0]); }
      else setPrefs({ user_email: u.email, email_enabled: true, phone_enabled: false, watch_enabled: false, deadlines: true, assignments: true, discussions: false, uploads: true, projects: true, sessions: true, payments: true, school_alerts: true });
    });
  }, []);

  const set = (k, v) => setPrefs(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    if (record) { await base44.entities.NotificationPrefs.update(record.id, prefs); }
    else { const created = await base44.entities.NotificationPrefs.create(prefs); setRecord(created); }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  if (!prefs) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">Settings</p>
          <h1 className="text-3xl font-black text-white">Notifications & Alerts</h1>
          <p className="text-white/40 mt-1 text-sm">Choose how and where you receive platform alerts.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8 space-y-6">
        {/* Channels */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Delivery Channels</p>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { key: 'email_enabled', icon: Mail, label: 'Email', sub: user?.email },
                { key: 'phone_enabled', icon: Smartphone, label: 'Phone / SMS', sub: 'Add phone number' },
                { key: 'watch_enabled', icon: Watch, label: 'Apple Watch', sub: 'Wearable alerts' },
              ].map(({ key, icon: Icon, label, sub }) => (
                <button key={key} onClick={() => set(key, !prefs[key])}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${prefs[key] ? 'bg-[#0a0f1e] border-[#0a0f1e]' : 'border-gray-100 hover:border-gray-300'}`}>
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${prefs[key] ? 'text-white' : 'text-gray-400'}`} />
                  <p className={`text-xs font-black ${prefs[key] ? 'text-white' : 'text-[#0a0f1e]'}`}>{label}</p>
                  {sub && <p className={`text-[10px] mt-0.5 ${prefs[key] ? 'text-white/40' : 'text-gray-300'}`}>{sub}</p>}
                </button>
              ))}
            </div>
            {prefs.phone_enabled && (
              <div>
                <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest">Phone Number</label>
                <input className={inp} placeholder="+1 (555) 000-0000" value={prefs.phone_number||''} onChange={e => set('phone_number', e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* Alert Types */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Alert Types</p>
          <Toggle label="Deadlines" sub="Course, assignment, and project deadlines" value={prefs.deadlines} onChange={v=>set('deadlines',v)} />
          <Toggle label="Assignments" sub="New assignments from courses and schools" value={prefs.assignments} onChange={v=>set('assignments',v)} />
          <Toggle label="Discussion Boards" sub="Replies and new posts in communities" value={prefs.discussions} onChange={v=>set('discussions',v)} />
          <Toggle label="Uploads" sub="New materials uploaded by teachers and schools" value={prefs.uploads} onChange={v=>set('uploads',v)} />
          <Toggle label="Projects" sub="Project updates and milestones" value={prefs.projects} onChange={v=>set('projects',v)} />
          <Toggle label="Sessions" sub="Tutoring and coaching session reminders" value={prefs.sessions} onChange={v=>set('sessions',v)} />
          <Toggle label="Payments & Billing" sub="Payment confirmations, failures, and renewals" value={prefs.payments} onChange={v=>set('payments',v)} />
          <Toggle label="School Alerts" sub="Updates from your school workspace" value={prefs.school_alerts} onChange={v=>set('school_alerts',v)} />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all flex items-center justify-center gap-2">
          {saved ? <><Check className="w-4 h-4" />Saved!</> : saving ? 'Saving...' : 'Save Notification Preferences'}
        </button>
      </div>
    </div>
  );
}