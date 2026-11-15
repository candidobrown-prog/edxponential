import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Briefcase, Users, DollarSign, Star, CheckCircle, XCircle, Eye, EyeOff, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OneJobAdmin() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending_review');

  useEffect(() => {
    Promise.all([
      base44.entities.JobPost.list('-created_date', 500),
      base44.entities.JobApplication.list('-created_date', 500),
    ]).then(([j, a]) => { setJobs(j); setApplications(a); }).finally(() => setLoading(false));
  }, []);

  const handleJobAction = async (jobId, updates) => {
    await base44.entities.JobPost.update(jobId, updates);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates } : j));
  };

  const totalRevenue = jobs.filter(j => j.payment_status === 'paid').reduce((sum, j) => sum + (j.payment_amount || 0), 0);
  const featured = jobs.filter(j => j.tier === 'featured' || j.tier === 'executive');

  const stats = [
    { label: 'Total Job Posts', value: jobs.length, icon: Briefcase, bg: 'bg-[#0a0f1e]', text: 'text-white' },
    { label: 'Active Posts', value: jobs.filter(j => j.status === 'active').length, icon: CheckCircle, bg: 'bg-gray-100', text: 'text-[#0a0f1e]' },
    { label: 'Pending Review', value: jobs.filter(j => j.status === 'pending_review').length, icon: Eye, bg: 'bg-yellow-50', text: 'text-[#0a0f1e]' },
    { label: 'Total Applications', value: applications.length, icon: Users, bg: 'bg-gray-100', text: 'text-[#0a0f1e]' },
    { label: 'Revenue Collected', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: 'bg-gray-100', text: 'text-[#0a0f1e]' },
    { label: 'Featured Posts Sold', value: featured.length, icon: Star, bg: 'bg-gray-100', text: 'text-[#0a0f1e]' },
  ];

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Shield className="w-6 h-6 text-white/50" />
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest">OneJob Admin</p>
            <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, bg, text }) => (
            <div key={label} className={`${bg} rounded-2xl p-5`}>
              <Icon className={`w-5 h-5 ${text} mb-3 opacity-50`} />
              <p className={`text-2xl font-black ${text}`}>{value}</p>
              <p className={`text-sm ${text} opacity-60 mt-0.5`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Job Management */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-[#0a0f1e]">Job Post Management</h2>
            <div className="flex gap-2">
              {[['pending_review', 'Pending'], ['active', 'Active'], ['rejected', 'Rejected'], ['all', 'All']].map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${filter === k ? 'bg-[#0a0f1e] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-semibold">No posts in this category.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.slice(0, 20).map(job => (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-[#0a0f1e] text-sm truncate">{job.job_title}</p>
                      {job.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                        job.tier === 'executive' ? 'bg-purple-100 text-purple-700' :
                        job.tier === 'featured' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{job.tier}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{job.organization_name} · {job.location || 'No location'} · ${job.payment_amount || 0}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {job.status === 'pending_review' && (
                      <>
                        <Button size="sm" className="bg-[#0a0f1e] text-white font-bold h-8 text-xs gap-1" onClick={() => handleJobAction(job.id, { status: 'active', payment_status: 'paid' })}>
                          <CheckCircle className="w-3 h-3" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleJobAction(job.id, { status: 'rejected' })}>
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      </>
                    )}
                    {job.status === 'active' && (
                      <>
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => handleJobAction(job.id, { featured: !job.featured })}>
                          <Star className={`w-3 h-3 ${job.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          {job.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleJobAction(job.id, { status: 'closed' })}>
                          Close
                        </Button>
                      </>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                      job.status === 'active' ? 'bg-green-100 text-green-700' :
                      job.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
                      job.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>{job.status?.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}