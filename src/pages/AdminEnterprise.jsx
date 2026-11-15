import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const STATUS_STYLE = {
  new: 'bg-blue-50 text-blue-700',
  reviewing: 'bg-amber-50 text-amber-700',
  quote_sent: 'bg-purple-50 text-purple-700',
  in_negotiation: 'bg-orange-50 text-orange-700',
  closed_won: 'bg-green-50 text-green-700',
  closed_lost: 'bg-red-50 text-red-700',
};

export default function AdminEnterprise() {
  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [quoteAmt, setQuoteAmt] = useState('');

  useEffect(() => {
    base44.entities.EnterpriseQuote.list('-created_date', 100).then(q => {
      setQuotes(q); setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.EnterpriseQuote.update(id, { status });
    setQuotes(q => q.map(x => x.id === id ? { ...x, status } : x));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const saveNote = async () => {
    await base44.entities.EnterpriseQuote.update(selected.id, { admin_notes: note, quote_amount: quoteAmt ? Number(quoteAmt) : undefined });
    setQuotes(q => q.map(x => x.id === selected.id ? { ...x, admin_notes: note, quote_amount: Number(quoteAmt) } : x));
    setSelected(s => ({ ...s, admin_notes: note, quote_amount: Number(quoteAmt) }));
  };

  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.status === filter);
  const totalPipeline = quotes.filter(q => !['closed_lost'].includes(q.status)).reduce((s, q) => s + (q.quote_amount || 0), 0);
  const won = quotes.filter(q => q.status === 'closed_won').reduce((s, q) => s + (q.quote_amount || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-3xl font-black text-white">Enterprise Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Quotes', value: quotes.length, icon: Shield },
            { label: 'New Requests', value: quotes.filter(q=>q.status==='new').length, icon: Clock },
            { label: 'Pipeline Value', value: `$${totalPipeline.toLocaleString()}`, icon: TrendingUp },
            { label: 'Won Value', value: `$${won.toLocaleString()}`, icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <Icon className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-2xl font-black text-[#0a0f1e]">{value}</p>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* List */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <p className="font-black text-[#0a0f1e]">Quote Requests</p>
              <select className="ml-auto border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none" value={filter} onChange={e=>setFilter(e.target.value)}>
                <option value="all">All</option>
                {['new','reviewing','quote_sent','in_negotiation','closed_won','closed_lost'].map(s=><option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map(q => (
                <div key={q.id} onClick={() => { setSelected(q); setNote(q.admin_notes||''); setQuoteAmt(q.quote_amount||''); }}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-all ${selected?.id===q.id?'bg-gray-50':''}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-[#0a0f1e] text-sm">{q.organization_name}</p>
                      <p className="text-xs text-gray-400">{q.full_name} · {q.org_type?.replace(/_/g,' ')} · {q.city}, {q.state}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[q.status]||'bg-gray-100 text-gray-500'}`}>{q.status?.replace(/_/g,' ')}</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm font-semibold">No quotes found.</div>}
            </div>
          </div>

          {/* Detail */}
          {selected && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div>
                <p className="font-black text-[#0a0f1e]">{selected.organization_name}</p>
                <p className="text-xs text-gray-400">{selected.full_name} · {selected.submitter_email}</p>
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {['reviewing','quote_sent','in_negotiation','closed_won','closed_lost'].map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`px-2.5 py-1 rounded-xl border text-[10px] font-black capitalize transition-all ${selected.status===s?'bg-[#0a0f1e] text-white border-[#0a0f1e]':'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                      {s.replace(/_/g,' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Quote Amount ($)</p>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" type="number" value={quoteAmt} onChange={e=>setQuoteAmt(e.target.value)} placeholder="0" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin Notes</p>
                <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm min-h-[80px] resize-none" value={note} onChange={e=>setNote(e.target.value)} />
              </div>
              <button onClick={saveNote} className="w-full py-2.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm">Save</button>
              {selected.problem_statement && (
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Problem</p>
                  <p className="text-xs text-gray-600">{selected.problem_statement}</p>
                </div>
              )}
              {selected.services_needed?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Services</p>
                  <div className="flex flex-wrap gap-1">{selected.services_needed.map(s=><span key={s} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{s}</span>)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}