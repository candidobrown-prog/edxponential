import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, AlertTriangle, CheckCircle, Clock, Wrench, X, Search } from 'lucide-react';

const CATEGORIES = ['hvac', 'plumbing', 'electrical', 'cleaning', 'painting', 'it_support', 'security', 'landscaping', 'renovation', 'inspection', 'emergency', 'other'];
const PRIORITY_STYLES = { low: 'bg-white/6 text-white/30', medium: 'bg-amber-500/10 text-amber-400', high: 'bg-orange-500/10 text-orange-400', emergency: 'bg-red-500/15 text-red-400' };
const STATUS_STYLES = { open: 'bg-red-500/10 text-red-400', in_progress: 'bg-amber-500/10 text-amber-400', pending_parts: 'bg-blue-500/10 text-blue-400', completed: 'bg-emerald-500/10 text-emerald-400', cancelled: 'bg-white/6 text-white/30' };

export default function OpxFacilities() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: 'hvac', priority: 'medium', location: '', room_number: '', reported_by: '', estimated_cost: '' });

  const { data: workOrders = [] } = useQuery({ queryKey: ['opx-work-orders'], queryFn: () => base44.entities.OpxWorkOrder.list('-created_date', 200) });

  const create = useMutation({
    mutationFn: (d) => base44.entities.OpxWorkOrder.create({ ...d, estimated_cost: parseFloat(d.estimated_cost) || 0, status: 'open' }),
    onSuccess: () => { qc.invalidateQueries(['opx-work-orders']); setShowAdd(false); setForm({ title: '', description: '', category: 'hvac', priority: 'medium', location: '', room_number: '', reported_by: '', estimated_cost: '' }); }
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.OpxWorkOrder.update(id, { status }),
    onSuccess: () => qc.invalidateQueries(['opx-work-orders'])
  });

  const filtered = workOrders.filter(w => `${w.title} ${w.location} ${w.category}`.toLowerCase().includes(search.toLowerCase()));
  const open = workOrders.filter(w => w.status === 'open').length;
  const inProgress = workOrders.filter(w => w.status === 'in_progress').length;
  const emergency = workOrders.filter(w => w.priority === 'emergency' && w.status !== 'completed').length;
  const completed = workOrders.filter(w => w.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#08090a] text-white">
      <div className="sticky top-0 z-20 bg-[#08090a]/95 backdrop-blur-xl border-b border-white/[0.05] px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-white/40" />
          <span className="text-xs font-black text-white/70">Facilities & Maintenance</span>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-xs font-black hover:bg-white/90 transition-all">
          <Plus className="w-3 h-3" /> New Work Order
        </button>
      </div>

      <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Open', value: open, icon: AlertTriangle, alert: open > 0 },
            { label: 'In Progress', value: inProgress, icon: Wrench },
            { label: 'Emergency', value: emergency, icon: AlertTriangle, alert: emergency > 0 },
            { label: 'Completed', value: completed, icon: CheckCircle },
          ].map((k, i) => (
            <div key={i} className={`rounded-2xl p-5 border ${k.alert && k.value > 0 ? 'bg-red-500/5 border-red-500/15' : 'bg-[#0d0e0f] border-white/[0.06]'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">{k.label}</p>
                <k.icon className={`w-3.5 h-3.5 ${k.alert && k.value > 0 ? 'text-red-400' : 'text-white/15'}`} />
              </div>
              <p className="text-3xl font-black text-white">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search work orders..."
            className="w-full bg-[#0d0e0f] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/15" />
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#0d0e0f] border border-white/[0.06] rounded-2xl">
            <Building2 className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-xs text-white/25">No work orders. Create one to track facilities issues.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(wo => (
              <motion.div key={wo.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#0d0e0f] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-4 hover:border-white/8 transition-all">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${wo.priority === 'emergency' ? 'bg-red-500' : wo.priority === 'high' ? 'bg-orange-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-bold text-white">{wo.title}</p>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${PRIORITY_STYLES[wo.priority]}`}>{wo.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/25">
                    <span className="capitalize">{wo.category?.replace(/_/g, ' ')}</span>
                    {wo.location && <span>· {wo.location}</span>}
                    {wo.room_number && <span>· Room {wo.room_number}</span>}
                    {wo.estimated_cost > 0 && <span>· Est. ${wo.estimated_cost.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${STATUS_STYLES[wo.status]}`}>{wo.status?.replace(/_/g, ' ')}</span>
                  {wo.status === 'open' && (
                    <button onClick={() => updateStatus.mutate({ id: wo.id, status: 'in_progress' })}
                      className="text-[9px] font-bold text-white/30 hover:text-white/60 px-2 py-1 rounded-lg border border-white/8 hover:border-white/15 transition-all">
                      Start
                    </button>
                  )}
                  {wo.status === 'in_progress' && (
                    <button onClick={() => updateStatus.mutate({ id: wo.id, status: 'completed' })}
                      className="text-[9px] font-bold text-emerald-400/60 hover:text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/15 hover:border-emerald-500/30 transition-all">
                      Complete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#0d0e0f] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-black text-white">New Work Order</p>
                <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-white/30" /></button>
              </div>
              <div className="space-y-3">
                {[['title', 'Title', 'text', 'e.g. HVAC Unit 2B Repair'], ['location', 'Building/Location', 'text', 'Main Building'], ['room_number', 'Room Number', 'text', '204'], ['reported_by', 'Reported By', 'text', 'John Smith'], ['estimated_cost', 'Estimated Cost ($)', 'number', '500']].map(([k, l, t, ph]) => (
                  <div key={k}>
                    <label className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">{l}</label>
                    <input type={t} placeholder={ph} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                  </div>
                ))}
                <div>
                  <label className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe the issue..."
                    className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none" />
                </div>
                {[['category', 'Category', CATEGORIES], ['priority', 'Priority', ['low', 'medium', 'high', 'emergency']]].map(([k, l, opts]) => (
                  <div key={k}>
                    <label className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">{l}</label>
                    <select value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20">
                      {opts.map(o => <option key={o} value={o} className="bg-[#0d0e0f]">{o.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border border-white/8 text-xs text-white/40">Cancel</button>
                <button onClick={() => create.mutate(form)} className="flex-1 py-2.5 rounded-xl bg-white text-black text-xs font-black">Submit Work Order</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}