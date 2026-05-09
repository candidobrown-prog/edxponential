import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shield, Plus, AlertTriangle, CheckCircle, Sparkles, X, FileText, Clock } from 'lucide-react';

const SEVERITY_STYLES = { low: 'bg-blue-500/10 text-blue-400', medium: 'bg-amber-500/10 text-amber-400', high: 'bg-orange-500/10 text-orange-400', critical: 'bg-red-500/10 text-red-400' };
const TYPES = ['safety', 'security', 'behavioral', 'medical', 'facilities', 'fire', 'lockdown', 'threat', 'accident', 'other'];
const COMPLIANCE_ITEMS = [
  { label: 'Fire Drill Records', due: '2026-05-30', status: 'complete' },
  { label: 'Safety Plan Annual Review', due: '2026-06-15', status: 'pending' },
  { label: 'OSHA Self-Inspection', due: '2026-04-01', status: 'overdue' },
  { label: 'Emergency Contact Updates', due: '2026-05-20', status: 'complete' },
  { label: 'Lockdown Procedure Training', due: '2026-05-31', status: 'pending' },
  { label: 'AED Equipment Check', due: '2026-06-01', status: 'pending' },
  { label: 'Visitor Management Audit', due: '2026-05-15', status: 'complete' },
  { label: 'Charter Safety Compliance', due: '2026-07-01', status: 'pending' },
];

export default function OpxSafety() {
  const [showForm, setShowForm] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', incident_type: 'safety', severity: 'medium', location: '', incident_date: new Date().toISOString().split('T')[0] });
  const qc = useQueryClient();

  const { data: incidents = [] } = useQuery({ queryKey: ['opx-incidents'], queryFn: () => base44.entities.OpxIncident.list('-created_date', 100) });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.OpxIncident.create(data),
    onSuccess: () => { qc.invalidateQueries(['opx-incidents']); setShowForm(false); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.OpxIncident.update(id, data),
    onSuccess: () => qc.invalidateQueries(['opx-incidents'])
  });

  const open = incidents.filter(i => i.status === 'open').length;
  const critical = incidents.filter(i => i.severity === 'critical').length;
  const overdue = COMPLIANCE_ITEMS.filter(c => c.status === 'overdue').length;
  const pending = COMPLIANCE_ITEMS.filter(c => c.status === 'pending').length;

  const generateSafetyReport = async () => {
    setGenLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are SafetyX™ AI. Generate a 4-sentence school safety compliance briefing:
Open incidents: ${open}, Critical: ${critical}
Overdue compliance items: ${overdue}, Pending: ${pending}
Total items tracked: ${COMPLIANCE_ITEMS.length}
Recent incidents: ${incidents.slice(0,3).map(i => `${i.incident_type} (${i.severity})`).join(', ')}
Be specific, compliance-focused, urgent where needed.`,
    });
    setAiReport(res);
    setGenLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#06060c] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">SafetyX™</h1>
          <p className="text-xs text-white/25 mt-0.5">Safety, compliance & incident management</p>
        </div>
        <div className="flex gap-3">
          <button onClick={generateSafetyReport} disabled={genLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white/70 transition-all">
            <Sparkles className={`w-3 h-3 ${genLoading ? 'animate-pulse' : ''}`} /> Safety AI Report
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
            <Plus className="w-3 h-3" /> Log Incident
          </button>
        </div>
      </div>

      {aiReport && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#08080f] border border-white/6 rounded-2xl p-5 flex items-start gap-3">
          <Shield className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/50 leading-relaxed flex-1">{aiReport}</p>
          <button onClick={() => setAiReport('')} className="text-white/20 hover:text-white/50 transition-colors"><X className="w-3 h-3" /></button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Open Incidents', value: open, alert: open > 0 },
          { label: 'Critical Severity', value: critical, alert: critical > 0 },
          { label: 'Overdue Compliance', value: overdue, alert: overdue > 0 },
          { label: 'Pending Compliance', value: pending },
        ].map(({ label, value, alert }) => (
          <div key={label} className={`rounded-2xl p-5 border ${alert ? 'bg-red-500/5 border-red-500/15' : 'bg-[#08080f] border-white/6'}`}>
            <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#08080f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-4">Log Safety Incident</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <input placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="col-span-2 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="col-span-2 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none h-20" />
            <div className="flex flex-col gap-3">
              <select value={form.incident_type} onChange={e => setForm({ ...form, incident_type: e.target.value })}
                className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20">
                {TYPES.map(t => <option key={t} value={t} className="bg-[#0d0d1a]">{t}</option>)}
              </select>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}
                className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20">
                {['low', 'medium', 'high', 'critical'].map(s => <option key={s} value={s} className="bg-[#0d0d1a]">{s}</option>)}
              </select>
            </div>
            <input type="date" value={form.incident_date} onChange={e => setForm({ ...form, incident_date: e.target.value })}
              className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => createMutation.mutate(form)}
              className="px-5 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">Submit Incident</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white/60 transition-all">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Compliance Calendar */}
        <div className="bg-[#08080f] border border-white/6 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-xs font-black text-white">Compliance Calendar</p>
            <p className="text-[10px] text-white/25 mt-0.5">Track deadlines & regulatory requirements</p>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {COMPLIANCE_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-6 py-3.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'complete' ? 'bg-emerald-400' : item.status === 'overdue' ? 'bg-red-400 animate-pulse' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white/70">{item.label}</p>
                  <p className="text-[10px] text-white/25">Due: {item.due}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${item.status === 'complete' ? 'bg-emerald-500/10 text-emerald-400' : item.status === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div className="bg-[#08080f] border border-white/6 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <p className="text-xs font-black text-white">Incident Log</p>
            <p className="text-[10px] text-white/25">{incidents.length} total</p>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {incidents.length === 0 && <div className="px-6 py-8 text-center text-white/20 text-xs">No incidents logged.</div>}
            {incidents.map(inc => (
              <div key={inc.id} className="flex items-center gap-3 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-white/70 truncate">{inc.title}</p>
                  <p className="text-[10px] text-white/25">{inc.incident_type} · {inc.incident_date}</p>
                </div>
                <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase ${SEVERITY_STYLES[inc.severity]}`}>{inc.severity}</span>
                <select value={inc.status} onChange={e => updateMutation.mutate({ id: inc.id, data: { status: e.target.value } })}
                  className="text-[9px] bg-transparent text-white/30 border-0 outline-none cursor-pointer">
                  {['open', 'under_review', 'resolved', 'escalated'].map(s => <option key={s} value={s} className="bg-[#0d0d1a] text-white normal-case">{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}