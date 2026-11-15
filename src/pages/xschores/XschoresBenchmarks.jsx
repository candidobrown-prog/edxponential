import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Settings, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const RISK_COLORS = {
  watch: 'bg-yellow-100 text-yellow-800',
  concern: 'bg-orange-100 text-orange-800',
  at_risk: 'bg-red-100 text-red-800',
  critical: 'bg-red-900 text-red-100',
};

const CATEGORIES = ['attendance', 'tardiness', 'behavior', 'academics', 'culture', 'communication'];
const AUDIENCES = ['principal', 'assistant_principal', 'dean', 'counselor', 'teacher', 'parent', 'student'];
const METHODS = ['in_app', 'email', 'sms'];

const defaultForm = {
  benchmark_name: '', category: 'attendance', metric: '', threshold_value: '',
  threshold_operator: 'greater_than_or_equal', time_window: 'weekly',
  scope: 'school', grade_level: '', risk_level: 'concern',
  alert_audience: ['principal', 'teacher'], alert_method: ['in_app'],
  recommended_action: '', escalation_rule: '', active: true
};

export default function XschoresBenchmarks() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const queryClient = useQueryClient();

  const { data: benchmarks = [], isLoading } = useQuery({
    queryKey: ['xschores-benchmarks'],
    queryFn: () => base44.entities.XscoresBenchmark.list('-created_date', 100),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.XscoresBenchmark.update(editId, data) : base44.entities.XscoresBenchmark.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['xschores-benchmarks'] }); setShowForm(false); setForm(defaultForm); setEditId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.XscoresBenchmark.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['xschores-benchmarks'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.XscoresBenchmark.update(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['xschores-benchmarks'] }),
  });

  const toggleAudience = (val) => setForm(f => ({
    ...f, alert_audience: f.alert_audience.includes(val) ? f.alert_audience.filter(x => x !== val) : [...f.alert_audience, val]
  }));
  const toggleMethod = (val) => setForm(f => ({
    ...f, alert_method: f.alert_method.includes(val) ? f.alert_method.filter(x => x !== val) : [...f.alert_method, val]
  }));

  const openEdit = (b) => {
    setForm({ ...defaultForm, ...b });
    setEditId(b.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Benchmarks & Thresholds</h1>
          <p className="text-muted-foreground mt-1">Configure custom thresholds, triggers, and alert rules</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setEditId(null); setShowForm(true); }} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> New Benchmark
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">Loading benchmarks...</div>
      ) : benchmarks.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Settings className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-bold text-muted-foreground mb-1">No benchmarks configured</p>
          <p className="text-sm text-muted-foreground">Create your first threshold to begin auto-generating alerts.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {benchmarks.map(b => (
            <div key={b.id} className={`bg-white border border-border rounded-2xl p-5 transition-all ${!b.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-black text-base">{b.benchmark_name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${RISK_COLORS[b.risk_level] || ''}`}>{b.risk_level?.replace('_', ' ')}</span>
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-md text-xs capitalize">{b.category}</span>
                    {!b.active && <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-xs">Inactive</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>{b.metric}</strong> — Alert when value is <strong>{b.threshold_operator?.replace(/_/g, ' ')} {b.threshold_value}</strong> within <strong>{b.time_window}</strong> window
                  </p>
                  {b.recommended_action && <p className="text-xs text-foreground/60 mt-1.5 italic">→ {b.recommended_action}</p>}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {b.alert_audience?.map(a => <span key={a} className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded capitalize">{a.replace(/_/g, ' ')}</span>)}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggleMutation.mutate({ id: b.id, active: !b.active })} className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
                    {b.active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(b.id)} className="p-2 rounded-lg hover:bg-red-50 transition-all text-muted-foreground hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-black text-xl">{editId ? 'Edit' : 'New'} Benchmark</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1"><Label>Benchmark Name *</Label><Input value={form.benchmark_name} onChange={e => setForm({ ...form, benchmark_name: e.target.value })} required placeholder="e.g., Weekly Tardy Threshold" /></div>
              <div className="space-y-1"><Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Metric *</Label><Input value={form.metric} onChange={e => setForm({ ...form, metric: e.target.value })} required placeholder="e.g., tardies_this_week" /></div>
              <div className="space-y-1"><Label>Operator</Label>
                <Select value={form.threshold_operator} onValueChange={v => setForm({ ...form, threshold_operator: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater_than_or_equal">≥ (Greater than or equal)</SelectItem>
                    <SelectItem value="greater_than">&gt; (Greater than)</SelectItem>
                    <SelectItem value="less_than">&lt; (Less than)</SelectItem>
                    <SelectItem value="less_than_or_equal">≤ (Less than or equal)</SelectItem>
                    <SelectItem value="equal_to">= (Equal to)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Threshold Value *</Label><Input type="number" value={form.threshold_value} onChange={e => setForm({ ...form, threshold_value: Number(e.target.value) })} required /></div>
              <div className="space-y-1"><Label>Time Window</Label>
                <Select value={form.time_window} onValueChange={v => setForm({ ...form, time_window: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['daily', 'weekly', 'monthly', 'semester', 'year_to_date'].map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Risk Level</Label>
                <Select value={form.risk_level} onValueChange={v => setForm({ ...form, risk_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['watch', 'concern', 'at_risk', 'critical'].map(r => <SelectItem key={r} value={r} className="capitalize">{r.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Alert Audience</Label>
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map(a => (
                  <button key={a} type="button" onClick={() => toggleAudience(a)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all capitalize ${form.alert_audience?.includes(a) ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground/40'}`}>
                    {a.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Alert Method</Label>
              <div className="flex gap-2">
                {METHODS.map(m => (
                  <button key={m} type="button" onClick={() => toggleMethod(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all uppercase ${form.alert_method?.includes(m) ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground/40'}`}>
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1"><Label>Recommended Action</Label><Textarea value={form.recommended_action} onChange={e => setForm({ ...form, recommended_action: e.target.value })} placeholder="e.g., Advisor should contact family today and document the call." className="min-h-[60px]" /></div>
            <div className="space-y-1"><Label>Escalation Rule</Label><Input value={form.escalation_rule} onChange={e => setForm({ ...form, escalation_rule: e.target.value })} placeholder="e.g., Escalate to principal if unresolved after 48 hours" /></div>

            <Button type="submit" className="w-full rounded-xl" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : (editId ? 'Update Benchmark' : 'Create Benchmark')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}