import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { BookOpen, Zap, Download, Star, ShoppingBag, ArrowRight, Plus, Layers, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EdXportanteDashboard() {
  const [myContent, setMyContent] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [content, purchased] = await Promise.all([
        base44.entities.ContentItem.filter({ creator_email: u.email }),
        base44.entities.ContentPurchase.filter({ user_email: u.email }),
      ]);
      setMyContent(content);
      setPurchases(purchased);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Content Created', value: myContent.length, icon: BookOpen },
    { label: 'Items Purchased', value: purchases.length, icon: ShoppingBag },
    { label: 'Total Downloads', value: myContent.reduce((s, c) => s + (c.downloads_count || 0), 0), icon: Download },
    { label: 'Avg Rating', value: myContent.filter(c => c.rating > 0).length > 0 ? (myContent.reduce((s, c) => s + (c.rating || 0), 0) / myContent.filter(c => c.rating > 0).length).toFixed(1) : '—', icon: Star },
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">edXportante · My Dashboard</p>
            <h1 className="text-3xl font-black text-white">My Content Library</h1>
            <p className="text-white/50 mt-1">Manage your generated and purchased instructional materials.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/edxportante/generate">
              <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black gap-2 h-11"><Zap className="w-4 h-4" />Generate</Button>
            </Link>
            <Link to="/edxportante/marketplace">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-black gap-2 h-11"><ShoppingBag className="w-4 h-4" />Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <Icon className="w-5 h-5 text-gray-400 mb-3" />
              <p className="text-3xl font-black text-[#0a0f1e]">{value}</p>
              <p className="text-sm text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* My Generated Content */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-[#0a0f1e]">My Content ({myContent.length})</h2>
            <Link to="/edxportante/generate" className="text-sm font-black text-[#0a0f1e] flex items-center gap-1">
              <Plus className="w-4 h-4" /> Create New
            </Link>
          </div>
          {myContent.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-400">No content generated yet.</p>
              <Link to="/edxportante/generate"><Button className="mt-4 bg-[#0a0f1e] text-white font-bold">Generate Your First Lesson</Button></Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myContent.map(c => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0a0f1e] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-[#0a0f1e] text-sm">{c.title}</p>
                      <p className="text-xs text-gray-400">{c.grade_level} · {c.subject} · {c.content_type?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{c.downloads_count || 0} downloads</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchased */}
        {purchases.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="font-black text-[#0a0f1e]">Purchased Content ({purchases.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {purchases.map(p => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <p className="font-bold text-[#0a0f1e] text-sm">{p.content_title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0a0f1e]">${p.amount_paid || 0}</span>
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1"><Download className="w-3 h-3" />Download</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Build Your Own App */}
        <div className="bg-[#0a0f1e] rounded-2xl p-8">
          <div className="flex items-start justify-between">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-5 h-5 text-white/50" />
                <p className="text-white/50 text-xs font-black uppercase tracking-widest">Premium Feature</p>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Build Your Own App</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Package your content into a fully branded internal curriculum platform for your school or network. 
                Select materials, customize branding, and deploy a white-label instructional hub your teachers will love.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {['Select your content library', 'Add your school branding', 'Deploy to your teachers', 'Track usage & engagement'].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black gap-2">
                <Layers className="w-4 h-4" /> Coming Soon — Join Waitlist
              </Button>
            </div>
            <div className="hidden md:block w-32 h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
              <Layers className="w-12 h-12 text-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}