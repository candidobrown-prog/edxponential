import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, MapPin, Briefcase, Star, Bookmark, Filter, Clock, Building2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const ROLES = ['All Roles', 'Teaching', 'Leadership', 'Executive', 'Operations', 'EdTech', 'Special Ed', 'Counseling'];
const TYPES = ['All Types', 'Full Time', 'Part Time', 'Contract'];
const LOCATIONS = ['All Locations', 'Remote', 'Hybrid', 'In Person'];

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [j, s] = await Promise.all([
        base44.entities.JobPost.filter({ status: 'active' }),
        u ? base44.entities.SavedJob.filter({ user_email: u.email }) : []
      ]);
      setJobs(j);
      setSavedJobs(s.map(s => s.job_id));
    }).catch(() => {
      base44.entities.JobPost.filter({ status: 'active' }).then(setJobs);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.job_title?.toLowerCase().includes(search.toLowerCase()) || j.organization_name?.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All Roles' || j.role_category === roleFilter.toLowerCase().replace(' ', '_');
    const matchType = typeFilter === 'All Types' || j.employment_type === typeFilter.toLowerCase().replace(' ', '_');
    const matchLoc = locationFilter === 'All Locations' || j.work_type === locationFilter.toLowerCase().replace(' ', '_');
    return matchSearch && matchRole && matchType && matchLoc;
  });

  const featured = filtered.filter(j => j.featured);
  const regular = filtered.filter(j => !j.featured);

  const handleSave = async (jobId, jobTitle, orgName) => {
    if (!user) return;
    if (savedJobs.includes(jobId)) {
      const existing = await base44.entities.SavedJob.filter({ user_email: user.email, job_id: jobId });
      if (existing[0]) await base44.entities.SavedJob.delete(existing[0].id);
      setSavedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      await base44.entities.SavedJob.create({ user_email: user.email, job_id: jobId, job_title: jobTitle, organization_name: orgName });
      setSavedJobs(prev => [...prev, jobId]);
    }
  };

  const JobCard = ({ job, isFeatured }) => (
    <div className={`bg-white rounded-2xl border-2 transition-all hover:shadow-lg ${isFeatured ? 'border-[#0a0f1e]' : 'border-gray-100 hover:border-gray-300'} p-6`} style={{ fontFamily: 'Arial, sans-serif' }}>
      {isFeatured && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Featured</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.logo_url ? <img src={job.logo_url} alt="" className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-[#0a0f1e] text-base leading-tight">{job.job_title}</h3>
          <p className="text-gray-600 text-sm font-semibold mt-0.5">{job.organization_name}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {job.location && <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" />{job.location}</span>}
            {job.employment_type && <span className="text-xs text-gray-500 capitalize">{job.employment_type.replace('_', ' ')}</span>}
            {job.work_type && <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{job.work_type.replace('_', ' ')}</span>}
          </div>
          {job.salary_display && <p className="text-sm font-bold text-[#0a0f1e] mt-2">{job.salary_display}</p>}
        </div>
        <button onClick={() => handleSave(job.id, job.job_title, job.organization_name)} className="flex-shrink-0">
          <Bookmark className={`w-5 h-5 transition-colors ${savedJobs.includes(job.id) ? 'fill-[#0a0f1e] text-[#0a0f1e]' : 'text-gray-300 hover:text-gray-500'}`} />
        </button>
      </div>
      {job.description && <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">{job.description}</p>}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {job.created_date ? format(new Date(job.created_date), 'MMM d') : 'Recently posted'}
        </div>
        <div className="flex gap-2">
          <Link to={`/onejob/jobs/${job.id}`}>
            <Button size="sm" className="bg-[#0a0f1e] hover:bg-[#1a2540] text-white h-8 text-xs font-bold">View & Apply</Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">Find Your Next Role</h1>
          <p className="text-white/50 mb-6">Premium education leadership opportunities, curated for serious professionals.</p>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input className="w-full pl-12 pr-4 py-3 rounded-xl border-0 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Job title, school, organization, or keyword..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-bold px-6 h-11">Search</Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Filter className="w-5 h-5 text-gray-400 self-center" />
          {[
            { options: ROLES, value: roleFilter, set: setRoleFilter },
            { options: TYPES, value: typeFilter, set: setTypeFilter },
            { options: LOCATIONS, value: locationFilter, set: setLocationFilter },
          ].map(({ options, value, set }) => (
            <div key={options[0]} className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 cursor-pointer"
                value={value} onChange={e => set(e.target.value)}>
                {options.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          ))}
          <span className="text-sm text-gray-400 self-center ml-auto font-semibold">{filtered.length} jobs found</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-8">
            {featured.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Featured Opportunities</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {featured.map(j => <JobCard key={j.id} job={j} isFeatured />)}
                </div>
              </div>
            )}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">All Opportunities</h2>}
                <div className="grid md:grid-cols-2 gap-4">
                  {regular.map(j => <JobCard key={j.id} job={j} isFeatured={false} />)}
                </div>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
                <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-semibold">No jobs match your search.</p>
                <p className="text-gray-300 text-sm mt-1">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}