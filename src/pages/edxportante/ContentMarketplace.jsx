import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, Star, Download, BookOpen, Zap, Filter, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GRADES = ['All', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SUBJECTS = ['All', 'ELA', 'Math', 'Science', 'Social Studies', 'Writing', 'Special Ed'];
const TYPES = ['All', 'Lesson Plan', 'Assessment', 'Worksheet', 'Unit Plan', 'Intervention'];

export default function ContentMarketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [purchases, setPurchases] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [content, purchased] = await Promise.all([
        base44.entities.ContentItem.filter({ status: 'published' }),
        base44.entities.ContentPurchase.filter({ user_email: u.email }),
      ]);
      setItems(content);
      setPurchases(purchased.map(p => p.content_id));
    }).catch(() => {
      base44.entities.ContentItem.filter({ status: 'published' }).then(setItems);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    const matchSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.subject?.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === 'All' || item.grade_level?.includes(gradeFilter);
    const matchSubject = subjectFilter === 'All' || item.subject?.toLowerCase().includes(subjectFilter.toLowerCase());
    return matchSearch && matchGrade && matchSubject;
  });

  const handlePurchase = async (item) => {
    if (!user) return;
    await base44.entities.ContentPurchase.create({
      user_email: user.email,
      content_id: item.id,
      content_title: item.title,
      purchase_type: 'single',
      amount_paid: item.price || 0,
      payment_status: 'paid',
    });
    setPurchases(prev => [...prev, item.id]);
  };

  const ContentCard = ({ item }) => {
    const owned = purchases.includes(item.id);
    const typeLabels = { lesson_plan: '📚 Lesson Plan', assessment: '✏️ Assessment', worksheet: '📄 Worksheet', unit_plan: '🗂️ Unit Plan', intervention_plan: '🎯 Intervention', student_activity: '🎲 Activity', teacher_script: '🎭 Script' };
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#0a0f1e] transition-all p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs text-gray-500">{typeLabels[item.content_type] || item.content_type}</span>
            <h3 className="font-black text-[#0a0f1e] text-sm mt-0.5 leading-tight">{item.title}</h3>
          </div>
          {item.source === 'ai_generated' ? (
            <span className="flex items-center gap-1 text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
              <Zap className="w-3 h-3" />AI
            </span>
          ) : (
            <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">Expert</span>
          )}
        </div>
        <div className="flex gap-2 mb-3">
          {item.grade_level && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{item.grade_level}</span>}
          {item.subject && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{item.subject}</span>}
        </div>
        {item.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{item.description}</p>}
        <div className="flex items-center gap-2 mt-0.5 mb-4">
          {item.rating > 0 && <>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-600">{item.rating.toFixed(1)}</span>
          </>}
          <span className="text-xs text-gray-400">{item.downloads_count || 0} downloads</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-black text-[#0a0f1e]">{item.price ? `$${item.price}` : 'Free'}</p>
          {owned ? (
            <Button size="sm" className="bg-green-600 text-white font-bold h-8 text-xs gap-1">
              <Download className="w-3 h-3" />Download
            </Button>
          ) : (
            <Button size="sm" className="bg-[#0a0f1e] text-white font-bold h-8 text-xs gap-1" onClick={() => handlePurchase(item)}>
              {item.price ? <><ShoppingCart className="w-3 h-3" />Buy</> : <><Download className="w-3 h-3" />Get Free</>}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">edXportante</p>
            <h1 className="text-3xl font-black text-white">Content Marketplace</h1>
            <p className="text-white/50 mt-1">Standards-aligned instructional materials for every grade and subject.</p>
          </div>
          <Link to="/edxportante/generate">
            <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black gap-2 h-11">
              <Zap className="w-4 h-4" />Generate with AI
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                placeholder="Search by title, subject, grade..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <span className="text-sm text-gray-400 self-center font-semibold">{filtered.length} items</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Grade', opts: GRADES, val: gradeFilter, set: setGradeFilter },
              { label: 'Subject', opts: SUBJECTS, val: subjectFilter, set: setSubjectFilter },
            ].map(({ label, opts, val, set: setVal }) => (
              <div key={label}>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {opts.map(o => (
                    <button key={o} onClick={() => setVal(o)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${val === o ? 'bg-[#0a0f1e] border-[#0a0f1e] text-white' : 'border-gray-200 text-gray-500 hover:border-[#0a0f1e]'}`}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-400">No content found.</p>
            <Link to="/edxportante/generate"><Button className="mt-4 bg-[#0a0f1e] text-white font-bold">Generate Content</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map(item => <ContentCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}