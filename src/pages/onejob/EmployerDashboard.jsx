import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Briefcase, Plus, Users, Eye, Star, DollarSign, Clock, CheckCircle, XCircle, ArrowRight, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  pending_payment: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-700' },
  pending_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
};

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [j, apps] = await Promise.all([
        base44.entities.JobPost.filter({ employer_email: u.email }),
        base44.entities.JobApplication.list('-created_date', 200),
      ]);
      setJobs(j);
      const myJobIds = j.map(jb => jb.id);
      setApplications(apps.filter(a => myJobIds.includes(a.job_id)));
    }).finally(() => setLoading(false));
  }, []);

  const tabJobs = {
    active: jobs.filter(j => j.status === 'active'),
    draft: jobs.filter(j => j.status === 'draft' || j.status === 'pending_payment'),
    expired: jobs.filter(j => j.status === 'expired' || j.status === 'closed'),
    all: jobs,
  };

  const stats = [
    { label: 'Active Posts', value: tabJobs.active.length, icon: Briefcase, bg: 'bg-[#0a0f1e]', text: 'text-white' },
    { label: 'Total Applicants', value: applications.length, icon: Users, bg: 'bg-gray-100', text: 'text-[#0a0f1e]' },
    { label: 'Drafts', value: tabJobs.draft.length, icon: Clock, bg: 'bg-gray-100', text: 'text-[#0a0f1e]' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: Star, bg: 'bg-gray-100', text: 'text-[#0a0f1e]' },
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">OneJob · Employer</p>
            <h1 className="text-3xl font-black text-white">Hiring Dashboard</h1>
            <p className="text-white/50 mt-1">Manage your job posts and find exceptional talent.</p>
          </div>
          <Link to="/onejob/post">
            <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black gap-2 h-11">
              <Plus className="w-4 h-4" /> Post a Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, bg, text }) => (
            <div key={label} className={`${bg} rounded-2xl p-5`}>
              <Icon className={`w-5 h-5 ${text} mb-3 opacity-60`} />
              <p className={`text-3xl font-black ${text}`}>{value}</p>
              <p className={`text-sm ${text} opacity-60 mt-0.5`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Jobs Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 flex items-center gap-1">
            {[['active', 'Active'], ['draft', 'Drafts'], ['expired', 'Expired'], ['all', 'All Posts']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-4 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === key ? 'border-[#0a0f1e] text-[#0a0f1e]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                {label} <span className="ml-1 text-xs opacity-60">({tabJobs[key]?.length || 0})</span>
              </button>
            ))}
          </div>
          {tabJobs[activeTab]?.length === 0 ? (
            <div className="py-16 text-center">
              <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold">No {activeTab} job posts.</p>
              {activeTab === 'active' && (
                <Link to="/onejob/post"><Button className="mt-4 bg-[#0a0f1e] text-white font-bold">Post Your First Job</Button></Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {tabJobs[activeTab]?.map(job => {
                const appCount = applications.filter(a => a.job_id === job.id).length;
                const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.draft;
                return (
                  <div key={job.id} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-black text-[#0a0f1e]">{job.job_title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-sm text-gray-500">{job.location || 'Location TBD'}</p>
                          <span className="text-xs text-gray-400">{job.created_date ? format(new Date(job.created_date), 'MMM d, yyyy') : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-black text-[#0a0f1e]">{appCount}</p>
                        <p className="text-xs text-gray-400">applicants</p>
                      </div>
                      {job.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                      <Link to={`/onejob/jobs/${job.id}/applicants`}>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1">View <ArrowRight className="w-3 h-3" /></Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent applicants */}
        {applications.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-[#0a0f1e]">Recent Applicants</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {applications.slice(0, 6).map(app => (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0a0f1e] flex items-center justify-center">
                      <span className="text-white font-black text-xs">{app.applicant_name?.[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#0a0f1e] text-sm">{app.applicant_name}</p>
                      <p className="text-xs text-gray-400">{app.job_title} · {app.current_title || 'No title'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                      app.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>{app.status?.replace('_', ' ')}</span>
                    <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none" value={app.status}
                      onChange={async e => {
                        await base44.entities.JobApplication.update(app.id, { status: e.target.value });
                        setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: e.target.value } : a));
                      }}>
                      {['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'offered', 'hired', 'rejected'].map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}