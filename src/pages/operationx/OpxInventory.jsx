import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Plus, Search, QrCode, AlertTriangle, CheckCircle, MapPin, Tag } from 'lucide-react';

const CATEGORIES = ['technology', 'furniture', 'supplies', 'equipment', 'vehicle', 'media', 'safety', 'food_service', 'other'];
const STATUS_STYLES = { available: 'bg-emerald-500/10 text-emerald-400', checked_out: 'bg-blue-500/10 text-blue-400', maintenance: 'bg-amber-500/10 text-amber-400', retired: 'bg-white/5 text-white/20', lost: 'bg-red-500/10 text-red-400' };
const CONDITION_STYLES = { excellent: 'text-emerald-400', good: 'text-white/50', fair: 'text-amber-400', poor: 'text-orange-400', damaged: 'text-red-400', lost: 'text-red-400' };

function generateBarcode(id) {
  return `OPX-${String(id).padStart(6, '0').substring(0, 6)}`;
}

export default function OpxInventory() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item_name: '', category: 'technology', location_room: '', location_building: '', quantity: '1', purchase_price: '', serial_number: '' });
  const qc = useQueryClient();

  const { data: items = [] } = useQuery({ queryKey: ['opx-inventory'], queryFn: () => base44.entities.OpxInventoryItem.list('-created_date', 200) });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.OpxInventoryItem.create({
      ...data, quantity: +data.quantity || 1, purchase_price: +data.purchase_price || 0,
      barcode: `OPX-${Date.now().toString().slice(-6)}`
    }),
    onSuccess: () => { qc.invalidateQueries(['opx-inventory']); setShowForm(false); }
  });

  const filtered = items.filter(i => {
    const matchSearch = `${i.item_name} ${i.location_room} ${i.assigned_to} ${i.serial_number}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalItems = items.length;
  const totalValue = items.reduce((a, i) => a + ((i.purchase_price || 0) * (i.quantity || 1)), 0);
  const lowStock = items.filter(i => i.quantity <= (i.min_quantity || 0)).length;
  const checkedOut = items.filter(i => i.status === 'checked_out').length;
  const lostItems = items.filter(i => i.status === 'lost').length;

  const catCounts = CATEGORIES.map(c => ({ cat: c, count: items.filter(i => i.category === c).length })).filter(c => c.count > 0);

  return (
    <div className="min-h-screen bg-[#06060c] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">InvenX™</h1>
          <p className="text-xs text-white/25 mt-0.5">Asset tracking, barcodes & inventory management</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
          <Plus className="w-3 h-3" /> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Assets', value: totalItems },
          { label: 'Total Value', value: `$${(totalValue / 1000).toFixed(0)}K` },
          { label: 'Checked Out', value: checkedOut },
          { label: 'Low / Out of Stock', value: lowStock, alert: lowStock > 0 },
          { label: 'Lost / Missing', value: lostItems, alert: lostItems > 0 },
        ].map(({ label, value, alert }) => (
          <div key={label} className={`rounded-2xl p-5 border ${alert ? 'bg-red-500/5 border-red-500/15' : 'bg-[#08080f] border-white/6'}`}>
            <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {catCounts.length > 0 && (
        <div className="bg-[#08080f] border border-white/6 rounded-2xl p-5">
          <p className="text-xs font-black text-white mb-3">Assets by Category</p>
          <div className="flex flex-wrap gap-2">
            {catCounts.map(({ cat, count }) => (
              <button key={cat} onClick={() => setCatFilter(catFilter === cat ? 'all' : cat)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${catFilter === cat ? 'bg-white/10 border-white/20 text-white' : 'border-white/6 text-white/30 hover:border-white/12 hover:text-white/50'}`}>
                <span className="capitalize">{cat.replace(/_/g, ' ')}</span>
                <span className={`rounded-full w-4 h-4 flex items-center justify-center text-[9px] ${catFilter === cat ? 'bg-white/20 text-white' : 'bg-white/6 text-white/30'}`}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#08080f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-4">Add Asset / Inventory Item</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { key: 'item_name', placeholder: 'Item Name *' },
              { key: 'serial_number', placeholder: 'Serial Number' },
              { key: 'location_room', placeholder: 'Room / Location' },
              { key: 'location_building', placeholder: 'Building' },
              { key: 'quantity', placeholder: 'Quantity', type: 'number' },
              { key: 'purchase_price', placeholder: 'Purchase Price', type: 'number' },
            ].map(({ key, placeholder, type }) => (
              <input key={key} type={type || 'text'} placeholder={placeholder} value={form[key] || ''}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
            ))}
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0d1a]">{c.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => createMutation.mutate(form)}
              className="px-5 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">Add to Inventory</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white/60 transition-all">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="bg-[#08080f] border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 bg-white/4 border border-white/6 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-white/25" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets, rooms, serial numbers…"
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/20 focus:outline-none" />
          </div>
          <p className="text-[10px] text-white/25">{filtered.length} items</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/4">
                {['Barcode', 'Item', 'Category', 'Location', 'Qty', 'Value', 'Condition', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-white/25 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-white/20 text-xs">No assets tracked yet.</td></tr>
              )}
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-[10px] text-white/30">{item.barcode || `OPX-${item.id?.slice(-6)}`}</td>
                  <td className="px-4 py-3 font-bold text-white/80">{item.item_name}</td>
                  <td className="px-4 py-3 text-white/30 capitalize">{item.category?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-white/30">{item.location_room ? `${item.location_room}${item.location_building ? ' · ' + item.location_building : ''}` : '—'}</td>
                  <td className="px-4 py-3 font-bold text-white/60">{item.quantity}</td>
                  <td className="px-4 py-3 text-white/40">{item.purchase_price ? `$${item.purchase_price.toLocaleString()}` : '—'}</td>
                  <td className={`px-4 py-3 font-bold capitalize ${CONDITION_STYLES[item.condition] || 'text-white/30'}`}>{item.condition}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase ${STATUS_STYLES[item.status] || 'bg-white/5 text-white/20'}`}>
                      {item.status?.replace(/_/g, ' ')}
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