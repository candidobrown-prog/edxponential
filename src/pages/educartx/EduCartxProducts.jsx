import React, { useState } from 'react';
import { Package, Plus, Sparkles, Loader2, Trash2, Edit, Eye, Upload, DollarSign, Tag, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const PRODUCT_TYPES = ['Digital Download', 'Course', 'Coaching', 'Membership', 'Physical Product', 'Service', 'Bundle', 'Template', 'Assessment', 'Curriculum'];
const CATEGORIES = ['Lesson Plans', 'Curriculum', 'Assessment', 'Template', 'E-Book', 'Course', 'Coaching', 'Merchandise', 'Workshop', 'Certification', 'Membership'];

const SAMPLE_PRODUCTS = [
  { id: 1, title: 'K-5 Reading Comprehension Bundle', type: 'Digital Download', category: 'Curriculum', price: 89, status: 'published', sales: 143, revenue: 12727 },
  { id: 2, title: '30-Day New Teacher Bootcamp', type: 'Course', category: 'Course', price: 149, status: 'published', sales: 67, revenue: 9983 },
  { id: 3, title: 'EdVisor Strategy Session', type: 'Coaching', category: 'Coaching', price: 299, status: 'draft', sales: 0, revenue: 0 },
];

export default function EduCartxProducts() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [showCreate, setShowCreate] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Digital Download', category: 'Curriculum', price: '', description: '', tags: '' });
  const [aiCopy, setAiCopy] = useState(null);

  const generateProductCopy = async () => {
    if (!form.title) { toast.error('Enter a product title first'); return; }
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an elite product copywriter for EduCartx™, an education marketplace. Create complete product listing copy for: "${form.title}" (Type: ${form.type}, Category: ${form.category}).

Return JSON: { description, bullet_features: [string x5], seo_title, seo_description, tags: [string x8], pricing_suggestion: number, upsell_idea, target_audience }`,
        response_json_schema: {
          type: 'object',
          properties: {
            description: { type: 'string' }, bullet_features: { type: 'array', items: { type: 'string' } },
            seo_title: { type: 'string' }, seo_description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } }, pricing_suggestion: { type: 'number' },
            upsell_idea: { type: 'string' }, target_audience: { type: 'string' }
          }
        },
        model: 'claude_sonnet_4_6'
      });
      setAiCopy(res);
      if (res.description) setForm(f => ({ ...f, description: res.description }));
      if (res.pricing_suggestion) setForm(f => ({ ...f, price: res.pricing_suggestion }));
      if (res.tags) setForm(f => ({ ...f, tags: res.tags.join(', ') }));
      toast.success('AI product copy generated!');
    } catch { toast.error('Generation failed'); }
    setAiLoading(false);
  };

  const saveProduct = () => {
    if (!form.title || !form.price) { toast.error('Title and price required'); return; }
    setProducts(p => [...p, { id: Date.now(), ...form, status: 'draft', sales: 0, revenue: 0 }]);
    setShowCreate(false);
    setAiCopy(null);
    setForm({ title: '', type: 'Digital Download', category: 'Curriculum', price: '', description: '', tags: '' });
    toast.success('Product saved as draft!');
  };

  const deleteProduct = (id) => { setProducts(p => p.filter(x => x.id !== id)); toast.success('Product deleted'); };
  const toggleStatus = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, status: x.status === 'published' ? 'draft' : 'published' } : x));

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-white/50" />
            <h1 className="font-black text-lg tracking-tight">Product Creator</h1>
          </div>
          <p className="text-xs text-white/30">Build, manage, and optimize your product catalog with AI</p>
        </div>
        <Button onClick={() => setShowCreate(s => !s)} className="bg-white text-black font-black text-xs h-8 px-4 hover:bg-white/90 rounded-full gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Product
        </Button>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Create Form */}
        {showCreate && (
          <div className="border border-white/10 rounded-2xl p-6 bg-white/2 space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-white/70">Create New Product</span>
              <Button onClick={generateProductCopy} disabled={aiLoading} variant="outline"
                className="border-white/10 text-white/50 text-xs h-8 px-3 hover:bg-white/5 gap-1.5 rounded-full">
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> AI Generate Copy</>}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 block">Product Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Complete 5th Grade Science Curriculum"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 block">Product Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/25">
                  {PRODUCT_TYPES.map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 block">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/25">
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 block">Price ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 block">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="math, curriculum, k-5..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Describe your product..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 resize-none" />
              </div>
            </div>

            {aiCopy && (
              <div className="border border-white/8 rounded-xl p-4 bg-white/2 space-y-3">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">AI Insights</div>
                {aiCopy.bullet_features && (
                  <div>
                    <div className="text-[10px] text-white/25 mb-1.5">Key Features</div>
                    {aiCopy.bullet_features.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1">
                        <span className="text-white/30 text-xs mt-0.5">•</span>
                        <span className="text-xs text-white/50">{b}</span>
                      </div>
                    ))}
                  </div>
                )}
                {aiCopy.target_audience && <div><span className="text-[10px] text-white/25">Target: </span><span className="text-xs text-white/50">{aiCopy.target_audience}</span></div>}
                {aiCopy.upsell_idea && <div><span className="text-[10px] text-white/25">Upsell: </span><span className="text-xs text-white/50">{aiCopy.upsell_idea}</span></div>}
              </div>
            )}

            <div className="flex gap-3 justify-between">
              <div className="flex gap-2">
                <Button variant="outline" className="border-white/10 text-white/40 text-xs h-8 px-3 hover:bg-white/5 gap-1.5 rounded-full">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreate(false)} variant="ghost" className="text-white/30 hover:text-white text-xs h-8 px-3">Cancel</Button>
                <Button onClick={saveProduct} className="bg-white text-black font-black text-xs h-8 px-5 hover:bg-white/90 rounded-full">Save Product</Button>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="flex items-center gap-4 border border-white/6 rounded-xl px-5 py-4 bg-white/1 hover:bg-white/3 transition-all">
              <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white/30" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white/80">{p.title}</div>
                <div className="text-[10px] text-white/25 mt-0.5">{p.type} · {p.category}</div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-white">${p.price}</div>
                <div className="text-[10px] text-white/25">{p.sales} sales</div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-sm font-black text-white/60">${p.revenue.toLocaleString()}</div>
                <div className="text-[10px] text-white/20">revenue</div>
              </div>
              <button onClick={() => toggleStatus(p.id)}
                className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${p.status === 'published' ? 'bg-white/10 text-white/60 border-white/10' : 'bg-white/4 text-white/25 border-white/6'}`}>
                {p.status === 'published' ? '● Live' : '○ Draft'}
              </button>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-white/8 transition-all"><Eye className="w-3.5 h-3.5 text-white/20" /></button>
                <button className="p-1.5 rounded-lg hover:bg-white/8 transition-all"><Edit className="w-3.5 h-3.5 text-white/20" /></button>
                <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-white/8 transition-all"><Trash2 className="w-3.5 h-3.5 text-white/15 hover:text-red-400/60" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}