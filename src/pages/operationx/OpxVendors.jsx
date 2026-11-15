import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Globe, Plus, Search, DollarSign, AlertTriangle, CheckCircle, Star, X } from 'lucide-react';

const CATEGORIES = ['technology', 'facilities', 'food_service', 'transportation', 'supplies', 'professional_services', 'utilities', 'insurance', 'other'];
const STATUS_STYLES = { active: 'bg-emerald-500/10 text-emerald-400', inactive: 'bg-white/5 text-white/20', pending_approval: 'bg-amber-500/10 text-amber-400', blacklisted: 'bg-red-500/10 text-red-400' };

export default function OpxVendors() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_name: '', contact_email: '', category: 'supplies', payment_method: 'ach', payment_terms: 'Net 30' });
  const qc = useQueryClient();

  const { data: vendors = [] } = useQuery({ queryKey: ['opx-vendors'], queryFn: () => base44.entities.OpxVendor.list('-created_date', 100) });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.OpxVendor.create(data),
    onSuccess: () => { qc.invalidateQueries(['opx-vendors']); setShowForm(false); }
  });

  const filtered = vendors.filter(v =>
    `${v.company_name} ${v.contact_name} ${v.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const active = vendors.filter(v => v.status === 'active').length;
  const pendingApproval = vendors.filter(v => v.status === 'pending_approval').length;
  const expiringContracts = vendors.filter(v => v.contract_expiry && v.contract_expiry < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]).length;
  const totalSpend = vendors.reduce((a, v) => a + (v.total_spend_ytd || 0), 0);
  const missingW9 = vendors.filter(v => !v.w9_on_file && v.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#06060c] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">ProcureX™</h1>
          <p className="text-xs text-white/25 mt-0.5">Vendor management, procurement & contracts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
          <Plus className="w-3 h-3" /> Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Active Vendors', value: active },
          { label: 'Pending Approval', value: pendingApproval, alert: pendingApproval > 0 },
          { label: 'YTD Spend', value: `$${(totalSpend / 1000).toFixed(0)}K` },
          { label: 'Expiring Contracts', value: expiringContracts, alert: expiringContracts > 0 },
          { label: 'Missing W-9', value: missingW9, alert: missingW9 > 0 },
        ].map(({ label, value, alert }) => (
          <div key={label} className={`rounded-2xl p-5 border ${alert ? 'bg-amber-500/5 border-amber-500/15' : 'bg-[#08080f] border-white/6'}`}>
            <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#08080f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-4">Add New Vendor</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { key: 'company_name', placeholder: 'Company Name *' },
              { key: 'contact_name', placeholder: 'Contact Name' },
              { key: 'contact_email', placeholder: 'Contact Email *', type: 'email' },
              { key: 'contact_phone', placeholder: 'Phone' },
              { key: 'payment_terms', placeholder: 'Payment Terms' },
              { key: 'tax_id', placeholder: 'Tax ID / EIN' },
            ].map(({ key, placeholder, type }) => (
              <input key={key} type={type || 'text'} placeholder={placeholder} value={form[key] || ''}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
            ))}
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0d1a]">{c.replace(/_/g, ' ')}</option>)}
            </select>
            <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}
              className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20">
              {['ach', 'check', 'credit_card', 'wire', 'paypal'].map(m => <option key={m} value={m} className="bg-[#0d0d1a]">{m.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => createMutation.mutate(form)}
              className="px-5 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">Add Vendor</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white/60 transition-all">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="bg-[#08080f] border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 bg-white/4 border border-white/6 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-white/25" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors…"
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/20 focus:outline-none" />
          </div>
          <p className="text-[10px] text-white/25">{filtered.length} vendors</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/4">
                {['Vendor', 'Category', 'Contact', 'Payment', 'YTD Spend', 'W-9', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-white/25 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-white/20 text-xs">No vendors yet.</td></tr>
              )}
              {filtered.map(v => (
                <tr key={v.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-bold text-white/80">{v.company_name}</td>
                  <td className="px-4 py-3 text-white/30 capitalize">{v.category?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-white/30">{v.contact_name || '—'}</td>
                  <td className="px-4 py-3 text-white/30 uppercase">{v.payment_method}</td>
                  <td className="px-4 py-3 font-bold text-white/50">${(v.total_spend_ytd || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {v.w9_on_file
                      ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase ${STATUS_STYLES[v.status] || 'bg-white/5 text-white/20'}`}>
                      {v.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}