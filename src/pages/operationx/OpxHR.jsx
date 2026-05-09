import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Brain, X, CheckCircle, AlertTriangle, Clock, DollarSign, UserCheck } from 'lucide-react';

const DEPTS = ['administration', 'instruction', 'operations', 'finance', 'hr', 'facilities', 'technology', 'student_services', 'special_education', 'other'];
const ROLES = ['ceo', 'executive_director', 'principal', 'coo', 'hr_director', 'finance_director', 'operations_manager', 'teacher', 'staff', 'contractor'];

const STATUS_STYLES = {
  active: 'bg-emerald-500/10 text-emerald-400',
  on_leave: 'bg-amber-500/10 text-amber-400',
  terminated: 'bg-red-500/10 text-red-400',
  probation: 'bg-blue-500/10 text-blue-400',
};

export default function OpxHR() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', job_title: '', department: 'instruction', role: 'teacher', employment_type: 'full_time', salary: '', hire_date: '' });

  const { data: employees = [] } = useQuery({ queryKey: ['opx-employees'], queryFn: () => base44.entities.OpxEmployee.list('-created_date', 200) });

  const create = useMutation({
    mutationFn: (d) => base44.entities.OpxEmployee.create({ ...d, salary: parseFloat(d.salary) || 0, status: 'active' }),
    onSuccess: () => { qc.invalidateQueries(['opx-employees']); setShowAdd(false); setForm({ first_name: '', last_name: '', email: '', job_title: '', department: 'instruction', role: 'teacher', employment_type: 'full_time', salary: '', hire_date: '' }); }
  });

  const filtered = employees.filter(e =>
    `${e.first_name} ${e.last_name} ${e.job_title} ${e.department}`.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter(e => e.status === 'active').length;
  const pendingDocs = employees.filter(e => e.i9_status !== 'complete' || !e.w4_on_file).length;
  const totalPayroll = employees.filter(e => e.status === 'active').reduce((a, e) => a + (e.salary || 0), 0);

  const generateInsight = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `HR intelligence for a school ops officer. Staff: ${employees.length} total, ${activeCount} active. Missing docs: ${pendingDocs} employees. Total annual payroll: $${(totalPayroll/1000).toFixed(0)}K. Departments: ${[...new Set(employees.map(e => e.department))].join(', ')}. Give a 2-sentence HR health summary and one staffing recommendation. Be concise and executive.`
    });
    setAiInsight(result);
    setGenerating(false);
  };

  React.useEffect(() => { if (employees.length > 0) generateInsight(); }, [employees.length]);

  return (
    <div className="min-h-screen bg-[#08090a] text-white">
      <div className="sticky top-0 z-20 bg-[#08090a]/95 backdrop-blur-xl border-b border-white/[0.05] px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-white/40" />
          <span className="text-xs font-black text-white/70">HR & Payroll</span>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-xs font-black hover:bg-white/90 transition-all">
          <Plus className="w-3 h-3" /> Add Employee
        </button>
      </div>

      <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-5">
        {/* AI */}
        {aiInsight && (
          <div className="bg-[#0d0e0f] border border-white/[0.06] rounded-2xl p-4 flex items-start gap-3">
            <Brain className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/45 leading-relaxed">{aiInsight}</p>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Staff', value: employees.length || 0, icon: Users },
            { label: 'Active', value: activeCount || 0, icon: CheckCircle },
            { label: 'Missing Docs', value: pendingDocs || 0, icon: AlertTriangle, alert: pendingDocs > 0 },
            { label: 'Annual Payroll', value: `$${(totalPayroll/1000).toFixed(0)}K`, icon: DollarSign },
          ].map((k, i) => (
            <div key={i} className={`rounded-2xl p-5 border ${k.alert ? 'bg-amber-500/5 border-amber-500/15' : 'bg-[#0d0e0f] border-white/[0.06]'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">{k.label}</p>
                <k.icon className={`w-3.5 h-3.5 ${k.alert ? 'text-amber-400' : 'text-white/15'}`} />
              </div>
              <p className="text-3xl font-black text-white">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..."
            className="w-full bg-[#0d0e0f] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/15" />
        </div>

        {/* Employee Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-xs text-white/25">No employees yet. Add your team.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(emp => (
              <motion.div key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-[#0d0e0f] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-xs font-black text-white/60">
                      {emp.first_name?.[0]}{emp.last_name?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{emp.first_name} {emp.last_name}</p>
                      <p className="text-[10px] text-white/30">{emp.job_title}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${STATUS_STYLES[emp.status] || 'bg-white/6 text-white/30'}`}>
                    {emp.status}
                  </span>
                </div>
                <div className="space-y-1.5 border-t border-white/[0.04] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-white/20">Department</span>
                    <span className="text-[9px] text-white/50 capitalize">{emp.department?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-white/20">Type</span>
                    <span className="text-[9px] text-white/50 capitalize">{emp.employment_type?.replace(/_/g, ' ')}</span>
                  </div>
                  {emp.salary > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/20">Salary</span>
                      <span className="text-[9px] font-black text-white/60">${emp.salary.toLocaleString()}/yr</span>
                    </div>
                  )}
                  <div className="flex gap-1.5 mt-2">
                    {emp.i9_status !== 'complete' && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold">I-9 Pending</span>}
                    {!emp.w4_on_file && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold">W-4 Missing</span>}
                    {emp.i9_status === 'complete' && emp.w4_on_file && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold">Docs Complete</span>}
                  </div>
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
              className="bg-[#0d0e0f] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-black text-white">Add Employee</p>
                <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['first_name', 'First Name', 'text', 'Jane'], ['last_name', 'Last Name', 'text', 'Smith'], ['email', 'Email', 'email', 'jane@school.edu'], ['job_title', 'Job Title', 'text', 'Math Teacher'], ['salary', 'Annual Salary ($)', 'number', '55000'], ['hire_date', 'Hire Date', 'date', '']].map(([key, label, type, ph]) => (
                  <div key={key} className={key === 'email' || key === 'job_title' ? 'col-span-2' : ''}>
                    <label className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">{label}</label>
                    <input type={type} placeholder={ph} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                  </div>
                ))}
                {[['department', 'Department', DEPTS], ['role', 'Role', ROLES], ['employment_type', 'Employment Type', ['full_time', 'part_time', 'contractor', 'substitute', 'intern']]].map(([key, label, opts]) => (
                  <div key={key}>
                    <label className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">{label}</label>
                    <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20">
                      {opts.map(o => <option key={o} value={o} className="bg-[#0d0e0f]">{o.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border border-white/8 text-xs text-white/40 hover:text-white/60">Cancel</button>
                <button onClick={() => create.mutate(form)} className="flex-1 py-2.5 rounded-xl bg-white text-black text-xs font-black hover:bg-white/90">Add Employee</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}