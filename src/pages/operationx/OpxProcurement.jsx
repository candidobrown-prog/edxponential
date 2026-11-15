import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Search, CheckCircle, AlertTriangle, X, DollarSign, Star } from 'lucide-react';

const CATEGORIES = ['technology', 'facilities', 'supplies', 'food_service', 'transportation', 'professional_services', 'utilities', 'insurance', 'construction', 'curriculum', 'staffing', 'other'];
const STATUS_STYLES = { active: 'bg-emerald-500/10 text-emerald-400', inactive: 'bg-white/6 text-white/30', suspended: 'bg-red-500/10 text-red-400', pending_review: 'bg-amber-500/10 text-amber-400' };
const COMP_STYLES = { compliant: 'bg-emerald-500/10 text-emerald-400', pending: 'bg-amber-500/10 text-amber-400', non_compliant: 'bg-red-500/10 text-red-400', expired: 'bg-red-500/15 text-red-400' };

export default function OpxProcurement() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_name: '', email: '', phone: '', category: 'technology', contract_value: '', payment_terms: 'net_30', payment_method: 'ach', contract_start: '', contract_end: '' });

  const { data: vendors = [] } = useQuery({ queryKey: ['opx-vendors'], queryFn: () => base44.entities.OpxVendor.list('-created_date', 200) });

  const create = useMutation({
    mutationFn: (d) => base44.entities.OpxVendor.create({ ...d, contract_value: parseFloat(d.contract_value) || 0, status: 'active', compliance_status: 'pending' }),
    onSuccess: () => { qc.invalidateQueries(['opx-vendors']); setShowAdd(false); setForm({ company_name: '', contact_name: '', email: '', phone: '', category: 'technology', contract_value: '', payment_terms: 'net_30', payment_method: 'ach', contract_start: '', contract_end: '' }); }
  });

  const filtered = vendors.filter(v => `${v.company_name} ${v.category} ${v.contact_name}`.toLowerCase().includes(search.toLowerCase()));
  const totalContractValue = vendors.reduce((a, v) => a + (v.contract_value || 0), 0);
  const totalPaidYtd = vendors.reduce((a, v) => a + (v.total_paid_ytd || 0), 0);
  const nonCompliant = vendors.filter(v => v.compliance_status === 'non_compliant' || v.compliance_status === 'expired').length;
  const activeCount = vendors.filter(v => v.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#08090a] text-white">
      <div className="sticky top-0 z-20 bg-[#08090a]/95 backdrop-blur-xl border-b border-white/[0.05] px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-4 h-4 text-white/40" />
          <span className="text-xs font-black text-white/70">Procurement & Vendors</span>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-xs font-black hover:bg-white/90 transition-all">
          <Plus className="w-3 h-3" /> Add Vendor
        </button>
      </div>

      <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Active Vendors', value: activeCount },
            { label: 'Contract Value', value: `$${(totalContractValue / 1000).toFixed(0)}K` },
            { label: 'Paid YTD', value: `$${(totalPaidYtd / 1000).toFixed(0)}K` },
            { label: 'Non-Compliant', value: nonCompliant, alert: nonCompliant > 0 },
          ].map((k, i) => (
            <div key={i} className={`rounded-2xl p-5 border ${k.alert && k.value > 0 ? 'bg-red-500/5 border-red-500/15' : 'bg-[#0d0e0f] border-white/[0.06]'}`}>
              <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-2">{k.label}</p>
              <p className="text-3xl font-black text-white">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
            className="w-full bg-[#0d0e0f] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/15" />
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#0d0e0f] border border-white/[0.06] rounded-2xl">
            <ShoppingCart className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-xs text-white/25">No vendors yet. Add your first vendor.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(v => (
              <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-[#0d0e0f] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-black text-white">{v.company_name}</p>
                    {v.contact_name && <p className="text-[10px] text-white/30 mt-0.5">{v.contact_name}</p>}
                  </div>
                  <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${STATUS_STYLES[v.status]}`}>{v.status}</span>
                </div>
                <div className="space-y-1.5 border-t border-white/[0.04] pt-3">
                  <div className="flex justify-between">
                    <span className="text-[9px] text-white/20">Category</span>
                    <span className="text-[9px] text-white/50 capitalize">{v.category?.replace(/_/g, ' ')}</span>
                  </div>
                  {v.contract_value > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[9px] text-white/20">Contract Value</span>
                      <span className="text-[9px] font-black text-white/60">${v.contract_value.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[9px] text-white/20">Payment Terms</span>
                    <span className="text-[9px] text-white/50">{v.payment_terms?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[9px] text-white/20">Compliance</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${COMP_STYLES[v.compliance_status]}`}>{v.compliance_status}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {!v.w9_on_file && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold">W-9 Needed</span>}
                    {!v.insurance_on_file && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold">No Insurance</span>}
                    {v.w9_on_file && v.insurance_on_file && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold">Docs Complete</span>}
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
                <p className="text-sm font-black text-white">Add Vendor</p>
                <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-white/30" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['company_name', 'Company Name', 'text', 'Acme Corp', 'col-span-2'], ['contact_name', 'Contact Name', 'text', 'John Smith', ''], ['email', 'Email', 'email', 'contact@vendor.com', ''], ['phone', 'Phone', 'tel', '(555) 000-0000', ''], ['contract_value', 'Contract Value ($)', 'number', '25000', ''], ['contract_start', 'Contract Start', 'date', '', ''], ['contract_end', 'Contract End', 'date', '', '']].map(([k, l, t, ph, cs]) => (
                  <div key={k} className={cs || ''}>
                    <label className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">{l}</label>
                    <input type={t} placeholder={ph} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                  </div>
                ))}
                {[['category', 'Category', CATEGORIES], ['payment_terms', 'Payment Terms', ['net_15', 'net_30', 'net_60', 'due_on_receipt', 'prepaid']], ['payment_method', 'Payment Method', ['ach', 'check', 'credit_card', 'wire', 'manual']]].map(([k, l, opts]) => (
                  <div key={k}>
                    <label className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">{l}</label>
                    <select value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none">
                      {opts.map(o => <option key={o} value={o} className="bg-[#0d0e0f]">{o.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border border-white/8 text-xs text-white/40">Cancel</button>
                <button onClick={() => create.mutate(form)} className="flex-1 py-2.5 rounded-xl bg-white text-black text-xs font-black">Add Vendor</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}