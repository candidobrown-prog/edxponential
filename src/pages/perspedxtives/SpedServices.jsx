import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, Plus, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SERVICE_TYPES = [
  'specialized_instruction', 'speech_language', 'occupational_therapy', 'physical_therapy',
  'counseling', 'behavioral_intervention', 'reading_intervention', 'math_intervention',
  'social_work', 'transition_services', 'vision_services', 'hearing_services', 'assistive_technology',
];

const DELIVERY_MODELS = ['push_in', 'pull_out', 'co_teaching', 'individual', 'small_group', 'large_group', 'consultation'];

export default function SpedServices() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    student_name: '', service_type: '', provider_name: '', delivery_model: '',
    frequency_per_week: '', minutes_per_session: '', required_minutes_weekly: '',
    location: '', start_date: '', end_date: '',
  });
  const qc = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['sped-services'],
    queryFn: () => base44.entities.SpedService.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: data => base44.entities.SpedService.create({ ...data, student_id: 'manual', status: 'active', compliance_pct: 100 }),
    onSuccess: () => { qc.invalidateQueries(['sped-services']); setShowAdd(false); },
  });

  const filtered = services.filter(s => !search || s.student_name?.toLowerCase().includes(search.toLowerCase()) || s.provider_name?.toLowerCase().includes(search.toLowerCase()));
  const avgCompliance = services.length ? Math.round(services.reduce((a, s) => a + (s.compliance_pct || 100), 0) / services.length) : 100;
  const lowServices = services.filter(s => (s.compliance_pct || 100) < 80).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Service Delivery</h1>
          <p className="text-gray-400 text-sm mt-0.5">{services.length} active services · {avgCompliance}% avg compliance</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#020205] text-white rounded-2xl p-5">
          <p className="text-white/40 text-xs font-black uppercase tracking-wider mb-2">Total Services</p>
          <p className="text-3xl font-black">{services.length}</p>
        </div>
        <div className={`rounded-2xl p-5 ${avgCompliance >= 90 ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Avg Compliance</p>
          <p className={`text-3xl font-black ${avgCompliance >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>{avgCompliance}%</p>
        </div>
        <div className={`rounded-2xl p-5 ${lowServices > 0 ? 'bg-red-50 border border-red-100' : 'bg-white border border-gray-100'}`}>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Below 80%</p>
          <p className={`text-3xl font-black ${lowServices > 0 ? 'text-red-600' : 'text-black'}`}>{lowServices}</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student or provider..." className="pl-9 rounded-xl" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">No services found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Student', 'Service', 'Provider', 'Model', 'Required/wk', 'Delivered', 'Compliance'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const isLow = (s.compliance_pct || 100) < 80;
                  return (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-bold text-sm text-black">{s.student_name}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{s.service_type?.replace(/_/g, ' ')}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{s.provider_name}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{s.delivery_model?.replace(/_/g, ' ')}</td>
                      <td className="px-5 py-3 text-xs font-bold text-black">{s.required_minutes_weekly || 0} min</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{s.delivered_minutes_this_week || 0} min</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {isLow ? <AlertTriangle className="w-3 h-3 text-red-500" /> : <CheckCircle className="w-3 h-3 text-emerald-500" />}
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 rounded-full" style={{ width: `${s.compliance_pct || 100}%`, background: isLow ? '#dc2626' : '#059669' }} />
                          </div>
                          <span className={`text-xs font-black ${isLow ? 'text-red-600' : 'text-black'}`}>{s.compliance_pct || 100}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Add Service</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Student Name *</label>
              <Input value={form.student_name} onChange={e => setForm(p => ({ ...p, student_name: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Service Type *</label>
              <Select value={form.service_type} onValueChange={v => setForm(p => ({ ...p, service_type: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Provider Name *</label>
              <Input value={form.provider_name} onChange={e => setForm(p => ({ ...p, provider_name: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Delivery Model</label>
              <Select value={form.delivery_model} onValueChange={v => setForm(p => ({ ...p, delivery_model: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {DELIVERY_MODELS.map(m => <SelectItem key={m} value={m}>{m.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Required Min/Week</label>
              <Input type="number" value={form.required_minutes_weekly} onChange={e => setForm(p => ({ ...p, required_minutes_weekly: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Location</label>
              <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.student_name || !form.service_type || createMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createMutation.isPending ? 'Saving...' : 'Add Service'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}