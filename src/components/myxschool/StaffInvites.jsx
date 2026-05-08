import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Plus, Mail, Check, X, AlertCircle, Upload } from 'lucide-react';
import ExcelImportWizard from '@/components/import/ExcelImportWizard';
import { STAFF_FIELDS } from '@/components/import/importFieldDefs';

const ROLES = [
  {v:'assistant_principal',l:'Assistant Principal'},
  {v:'dean',l:'Dean'},
  {v:'instructional_coach',l:'Instructional Coach'},
  {v:'operations_leader',l:'Operations Leader'},
  {v:'teacher_leader',l:'Teacher Leader'},
  {v:'data_leader',l:'Data Leader'},
  {v:'finance_leader',l:'Finance Leader'},
  {v:'counselor',l:'Counselor'},
  {v:'other',l:'Other Staff'},
];

const ALL_PERMS = [
  'View only','Edit Xschetails','View Xscores','Manage staff','Manage billing',
  'Access OneJob','Access TwotrX','Access edXportante','Access Pitch Park','Admin-level access'
];

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e] bg-white transition-all";

export default function StaffInvites({ user, school, staff, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState({ staff_name:'', staff_email:'', role:'', permissions:[] });
  const [saving, setSaving] = useState(false);

  const FREE_SEATS = 2;
  const activeStaff = (staff || []).filter(s => s.status !== 'removed');
  const freeUsed = Math.min(activeStaff.length, FREE_SEATS);
  const paidSeats = Math.max(0, activeStaff.length - FREE_SEATS);

  const handleInvite = async () => {
    if (!school?.id || !form.staff_email || !form.role) return;
    setSaving(true);
    const isPaid = activeStaff.length >= FREE_SEATS;
    const created = await base44.entities.SchoolStaff.create({
      school_id: school.id,
      invited_by_email: user.email,
      staff_name: form.staff_name,
      staff_email: form.staff_email,
      role: form.role,
      permissions: form.permissions,
      status: 'invited',
      is_paid_seat: isPaid,
    });
    onUpdate([...(staff || []), created]);
    setForm({ staff_name:'', staff_email:'', role:'', permissions:[] });
    setShowForm(false);
    setSaving(false);
  };

  const handleRemove = async (id) => {
    await base44.entities.SchoolStaff.update(id, { status: 'removed' });
    onUpdate(staff.map(s => s.id === id ? { ...s, status: 'removed' } : s));
  };

  const togglePerm = (p) => setForm(f => ({
    ...f, permissions: f.permissions.includes(p) ? f.permissions.filter(x=>x!==p) : [...f.permissions, p]
  }));

  return (
    <div className="space-y-5">
      {/* Seats Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center">
            <p className="text-2xl font-black text-[#0a0f1e]">{FREE_SEATS}</p>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">Included Seats</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#0a0f1e]">{freeUsed}</p>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">Free Used</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#0a0f1e]">{paidSeats}</p>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">Paid Seats</p>
          </div>
        </div>
        {paidSeats > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <strong>{paidSeats} additional staff seat{paidSeats>1?'s':''}</strong> at <strong>$7.99/month each</strong> = <strong>${(paidSeats*7.99).toFixed(2)}/month</strong>
          </div>
        )}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">
            <Upload className="w-4 h-4" /> Import from Excel
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all">
            <Plus className="w-4 h-4" /> Invite Staff Member
          </button>
        </div>
      </div>
      <ExcelImportWizard
        open={showImport}
        onOpenChange={setShowImport}
        fieldDefs={STAFF_FIELDS}
        entityName="SchoolStaff"
        templateName="Staff Roster"
        onImportComplete={() => {}}
      />

      {/* Invite Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-black text-[#0a0f1e]">New Staff Invite</h3>
          {activeStaff.length >= FREE_SEATS && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">You have used your 2 included seats. This member will be billed at <strong>$7.99/month</strong>.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest">Staff Name</label>
              <input className={inp} placeholder="Jane Smith" value={form.staff_name} onChange={e=>setForm(f=>({...f,staff_name:e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest">Email</label>
              <input className={inp} placeholder="jane@school.org" value={form.staff_email} onChange={e=>setForm(f=>({...f,staff_email:e.target.value}))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest">Role</label>
              <select className={inp} value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option value="">Select role...</option>
                {ROLES.map(r=><option key={r.v} value={r.v}>{r.l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {ALL_PERMS.map(p => {
                const active = form.permissions.includes(p);
                return (
                  <button key={p} onClick={() => togglePerm(p)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${active?'bg-[#0a0f1e] text-white border-[#0a0f1e]':'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleInvite} disabled={saving||!form.staff_email||!form.role}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all disabled:opacity-40">
              <Mail className="w-4 h-4" />{saving?'Sending...':'Send Invite'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl font-black text-sm text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Staff List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-[#0a0f1e]">Staff Members ({activeStaff.length})</h3>
        </div>
        {activeStaff.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-semibold">No staff members invited yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activeStaff.map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-black text-[#0a0f1e] text-sm">{s.staff_name || s.staff_email}</p>
                  <p className="text-xs text-gray-400">{s.staff_email} · {ROLES.find(r=>r.v===s.role)?.l || s.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  {s.is_paid_seat && <span className="text-xs font-black px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">$7.99/mo</span>}
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full capitalize ${s.status==='active'?'bg-green-50 text-green-700':'bg-gray-100 text-gray-500'}`}>{s.status}</span>
                  <button onClick={() => handleRemove(s.id)} className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-red-50 transition-all">
                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enterprise upsell */}
      <div className="bg-[#0a0f1e] rounded-2xl p-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-white font-black">Need 10+ staff seats?</p>
          <p className="text-white/40 text-sm mt-0.5">Get custom pricing, unlimited seats, and premium support with an Enterprise Package.</p>
        </div>
        <button className="px-5 py-2.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all whitespace-nowrap">
          Request Enterprise Quote
        </button>
      </div>
    </div>
  );
}