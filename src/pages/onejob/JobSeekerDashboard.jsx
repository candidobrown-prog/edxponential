import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Bookmark, FileText, Briefcase, User, Search, TrendingUp, Upload, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const APP_STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  interview_scheduled: 'bg-purple-100 text-purple-700',
  offered: 'bg-emerald-100 text-emerald-700',
  hired: 'bg-green-200 text-green-800',
  rejected: 'bg-red-100 text-red-600',
  withdrawn: 'bg-gray-100 text-gray-500',
};

export default function JobSeekerDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [profiles, apps, saved] = await Promise.all([
        base44.entities.JobSeekerProfile.filter({ user_email: u.email }),
        base44.entities.JobApplication.filter({ applicant_email: u.email }),
        base44.entities.SavedJob.filter({ user_email: u.email }),
      ]);
      setProfile(profiles[0] || null);
      setProfileForm(profiles[0] || { full_name: u.full_name, user_email: u.email });
      setApplications(apps);
      setSavedJobs(saved);
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (profile) {
      const updated = await base44.entities.JobSeekerProfile.update(profile.id, profileForm);
      setProfile(updated);
    } else {
      const created = await base44.entities.JobSeekerProfile.create({ ...profileForm, user_email: user.email });
      setProfile(created);
    }
    setEditingProfile(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  const set = (k, v) => setProfileForm(f => ({ ...f, [k]: v }));
  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e]";
  const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">OneJob · Job Seeker</p>
            <h1 className="text-3xl font-black text-white">{profile?.full_name || user?.full_name || 'Your Dashboard'}</h1>
            <p className="text-white/50 mt-1">{profile?.headline || 'Complete your profile to get matched with top opportunities.'}</p>
          </div>
          <Link to="/onejob/jobs">
            <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black gap-2 h-11">
              <Search className="w-4 h-4" /> Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Profile */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0a0f1e] flex items-center justify-center mb-4">
                <span className="text-white font-black text-xl">{(profile?.full_name || user?.full_name || '?')[0]}</span>
              </div>
              <h2 className="font-black text-[#0a0f1e] text-lg">{profile?.full_name || user?.full_name}</h2>
              <p className="text-gray-500 text-sm">{profile?.current_title || 'Add your current role'}</p>
              <p className="text-gray-400 text-xs mt-1">{profile?.location || 'Add location'}</p>
              {profile?.open_to_work && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-green-700">Open to Work</span>
                </div>
              )}
              <Button onClick={() => setEditingProfile(!editingProfile)} className="w-full mt-4 bg-[#0a0f1e] text-white font-bold text-sm h-9">
                {editingProfile ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Applied', value: applications.length, icon: FileText },
                { label: 'Saved', value: savedJobs.length, icon: Bookmark },
                { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                  <p className="text-xl font-black text-[#0a0f1e]">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tabs */}
          <div className="md:col-span-2 space-y-4">
            {editingProfile ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-black text-[#0a0f1e]">Edit Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Full Name</label><input className={inp} value={profileForm.full_name || ''} onChange={e => set('full_name', e.target.value)} /></div>
                  <div><label className={lbl}>Current Title</label><input className={inp} value={profileForm.current_title || ''} onChange={e => set('current_title', e.target.value)} /></div>
                  <div><label className={lbl}>Organization</label><input className={inp} value={profileForm.current_organization || ''} onChange={e => set('current_organization', e.target.value)} /></div>
                  <div><label className={lbl}>Location</label><input className={inp} value={profileForm.location || ''} onChange={e => set('location', e.target.value)} /></div>
                  <div className="col-span-2"><label className={lbl}>Headline</label><input className={inp} value={profileForm.headline || ''} onChange={e => set('headline', e.target.value)} placeholder="e.g. Veteran Principal | Instructional Leader" /></div>
                  <div className="col-span-2"><label className={lbl}>Bio</label><textarea className={inp + " min-h-[80px] resize-none"} value={profileForm.bio || ''} onChange={e => set('bio', e.target.value)} /></div>
                  <div><label className={lbl}>LinkedIn URL</label><input className={inp} value={profileForm.linkedin_url || ''} onChange={e => set('linkedin_url', e.target.value)} /></div>
                  <div><label className={lbl}>Years Experience</label><input type="number" className={inp} value={profileForm.years_experience || ''} onChange={e => set('years_experience', Number(e.target.value))} /></div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="open_to_work" checked={profileForm.open_to_work || false} onChange={e => set('open_to_work', e.target.checked)} className="rounded" />
                  <label htmlFor="open_to_work" className="text-sm font-bold text-gray-600">Open to Work</label>
                </div>
                <Button onClick={handleSaveProfile} className="bg-[#0a0f1e] text-white font-black">Save Profile</Button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="border-b border-gray-100 px-5 flex gap-1">
                    {[['applications', 'Applications'], ['saved', 'Saved Jobs']].map(([k, l]) => (
                      <button key={k} onClick={() => setActiveTab(k)}
                        className={`px-4 py-4 text-sm font-black transition-all border-b-2 ${activeTab === k ? 'border-[#0a0f1e] text-[#0a0f1e]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{l}</button>
                    ))}
                  </div>

                  {activeTab === 'applications' && (
                    applications.length === 0 ? (
                      <div className="py-12 text-center">
                        <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-semibold">No applications yet.</p>
                        <Link to="/onejob/jobs"><Button className="mt-4 bg-[#0a0f1e] text-white font-bold text-sm">Browse Jobs</Button></Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {applications.map(app => (
                          <div key={app.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                              <p className="font-black text-[#0a0f1e] text-sm">{app.job_title}</p>
                              <p className="text-xs text-gray-400">{app.organization_name}</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${APP_STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-500'}`}>
                              {app.status?.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {activeTab === 'saved' && (
                    savedJobs.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bookmark className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-semibold">No saved jobs yet.</p>
                        <Link to="/onejob/jobs"><Button className="mt-4 bg-[#0a0f1e] text-white font-bold text-sm">Browse Jobs</Button></Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {savedJobs.map(saved => (
                          <div key={saved.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                              <p className="font-black text-[#0a0f1e] text-sm">{saved.job_title}</p>
                              <p className="text-xs text-gray-400">{saved.organization_name}</p>
                            </div>
                            <Link to={`/onejob/jobs/${saved.job_id}`}>
                              <Button size="sm" className="bg-[#0a0f1e] text-white font-bold h-8 text-xs gap-1">View <ArrowRight className="w-3 h-3" /></Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}