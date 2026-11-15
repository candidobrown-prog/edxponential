import React, { useState } from 'react';
import { Search, Sparkles, Star, TrendingUp, Zap, Filter, Heart, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Lesson Plans', 'Curriculum', 'Courses', 'Coaching', 'Templates', 'Books', 'Merchandise', 'Memberships', 'Assessments', 'Workshops'];

const FEATURED_PRODUCTS = [
  { id: 1, title: 'Complete K-8 ELA Curriculum Bundle', creator: 'Dr. Lisa Chen', price: 249, rating: 4.9, reviews: 382, category: 'Curriculum', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', type: 'digital' },
  { id: 2, title: 'Charter School Launch Playbook', creator: 'Marcus Webb', price: 97, rating: 4.8, reviews: 214, category: 'Templates', badge: 'Trending', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', type: 'digital' },
  { id: 3, title: '1:1 Executive EdVisor Coaching (6 Sessions)', creator: 'Priya Nair', price: 799, rating: 5.0, reviews: 58, category: 'Coaching', badge: 'Featured', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', type: 'service' },
  { id: 4, title: 'School Leader Hoodie — Premium', creator: 'EduWear Co.', price: 65, rating: 4.7, reviews: 143, category: 'Merchandise', badge: 'New', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80', type: 'physical' },
  { id: 5, title: '90-Day New Teacher Survival System', creator: 'TeachStrong', price: 39, rating: 4.8, reviews: 921, category: 'Templates', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', type: 'digital' },
  { id: 6, title: 'AI in Education Certification Course', creator: 'EdTech Academy', price: 199, rating: 4.9, reviews: 307, category: 'Courses', badge: 'Trending', image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80', type: 'course' },
  { id: 7, title: 'MTSS Tier 1-3 Intervention Toolkit', creator: 'SpedPro Network', price: 129, rating: 4.7, reviews: 189, category: 'Curriculum', badge: '', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', type: 'digital' },
  { id: 8, title: 'Principal Leadership Masterclass', creator: 'Dr. James Osei', price: 349, rating: 4.9, reviews: 76, category: 'Courses', badge: 'Featured', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', type: 'course' },
];

const BADGE_STYLES = {
  'Best Seller': 'bg-white text-black',
  'Trending': 'bg-white/10 text-white/80',
  'Featured': 'bg-white/8 text-white/70',
  'New': 'bg-white/6 text-white/60',
};

const TYPE_LABELS = { digital: 'Digital', physical: 'Physical', service: 'Service', course: 'Course' };

export default function EduCartxMarketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [aiSearch, setAiSearch] = useState('');
  const [aiResults, setAiResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = FEATURED_PRODUCTS.filter(p =>
    (category === 'All' || p.category === category) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.creator.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAiSearch = async () => {
    if (!aiSearch.trim()) return;
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI product curator for EduCartx™, an education marketplace. A user is searching for: "${aiSearch}". Recommend 3 product ideas they might want, with title, type, estimated price, and why it fits their need. Return as JSON: { recommendations: [{title, type, price, reason}] }`,
        response_json_schema: { type: 'object', properties: { recommendations: { type: 'array', items: { type: 'object' } } } }
      });
      setAiResults(res.recommendations || []);
    } catch { toast.error('AI search failed'); }
    setAiLoading(false);
  };

  const toggleSave = (id) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleCart = (id) => { setCart(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); toast.success(cart.has(id) ? 'Removed from cart' : 'Added to cart!'); };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-black text-xl tracking-tight">Marketplace</h1>
            <p className="text-xs text-white/30 mt-0.5">Discover world-class educational products, courses, and services</p>
          </div>
          <div className="flex items-center gap-2">
            {cart.size > 0 && (
              <Button className="bg-white text-black font-black text-xs h-8 px-4 rounded-full gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Cart ({cart.size})
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, creators, topics..."
              className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
          </div>
          <Button variant="outline" className="border-white/10 text-white/50 text-xs h-10 px-3 hover:bg-white/5 gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* AI Smart Search */}
        <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-white/40" />
            <span className="text-xs font-black text-white/50 uppercase tracking-widest">AI Product Recommender</span>
          </div>
          <div className="flex gap-2">
            <input value={aiSearch} onChange={e => setAiSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSearch()}
              placeholder="Tell me what you need — e.g. 'I'm a 5th grade teacher building a science unit'"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
            <Button onClick={handleAiSearch} disabled={aiLoading} className="bg-white text-black font-black text-xs h-10 px-4 rounded-xl hover:bg-white/90">
              {aiLoading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> Ask AI</>}
            </Button>
          </div>
          {aiResults && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {aiResults.map((r, i) => (
                <div key={i} className="border border-white/8 rounded-xl p-3 bg-white/2">
                  <div className="text-xs font-black text-white/70 mb-1">{r.title}</div>
                  <div className="text-[10px] text-white/30 mb-2">{r.reason}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white/60">${r.price}</span>
                    <span className="text-[10px] bg-white/8 rounded px-1.5 py-0.5 text-white/40">{r.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${category === c ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Section: Trending */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-white/30" />
            <span className="font-black text-sm text-white/60 uppercase tracking-widest">Trending Now</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="group border border-white/6 rounded-2xl overflow-hidden bg-white/1 hover:border-white/12 hover:bg-white/3 transition-all">
                <div className="relative h-40 overflow-hidden bg-white/5">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                  {p.badge && (
                    <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full ${BADGE_STYLES[p.badge] || ''}`}>{p.badge}</span>
                  )}
                  <span className="absolute top-2 right-2 text-[10px] bg-black/60 text-white/60 px-2 py-0.5 rounded-full">{TYPE_LABELS[p.type]}</span>
                  <button onClick={() => toggleSave(p.id)} className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/80 transition-all">
                    <Heart className={`w-3.5 h-3.5 ${saved.has(p.id) ? 'fill-white text-white' : 'text-white/40'}`} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-[10px] text-white/25 font-bold mb-1">{p.creator}</div>
                  <div className="text-sm font-black text-white/80 leading-tight mb-2 line-clamp-2">{p.title}</div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 fill-white/60 text-white/60" />
                    <span className="text-xs font-black text-white/50">{p.rating}</span>
                    <span className="text-[10px] text-white/20">({p.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm">${p.price}</span>
                    <button onClick={() => toggleCart(p.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black transition-all ${cart.has(p.id) ? 'bg-white text-black' : 'bg-white/8 text-white/60 hover:bg-white/15'}`}>
                      <ShoppingCart className="w-3 h-3" /> {cart.has(p.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/20">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-black text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}