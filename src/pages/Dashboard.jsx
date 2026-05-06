import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Star, Users, ArrowRight, CheckCircle, DollarSign, Briefcase, TrendingUp, CreditCard, Layers, Building2, Sparkles, BarChart3 } from 'lucide-react';
import TierBadge from '../components/shared/TierBadge';
import { Link } from 'react-router-dom';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import StatCard from '../components/dashboard/StatCard';
import StudentProgressCard from '../components/dashboard/StudentProgressCard';
import EdVisorCard from '../components/coaching/EdVisorCard';
import OnboardingTutorial from '../components/platform/OnboardingTutorial';
import { AnimatePresence } from 'framer-motion';

const ONBOARD_KEY = 'edx_onboarding_dismissed';
const COMPLETED_KEY = 'edx_onboarding_completed';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [xschetails, setXschetails] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const records = await base44.entities.Xschetails.filter({ user_email: u.email }, '-created_date', 1);
      if (records.length > 0) setXschetails(records[0]);
      // Show onboarding if not dismissed/completed
      if (!localStorage.getItem(COMPLETED_KEY) && !localStorage.getItem(ONBOARD_KEY)) {
        setTimeout(() => setShowOnboarding(true), 1000);
      }
    }).catch(() => {});
  }, []);

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list('-created_date', 4),
  });

  const { data: coaches = [] } = useQuery({
    queryKey: ['coaches'],
    queryFn: () => base44.entities.CoachingSession.list('-created_date', 4),
  });

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: () => base44.entities.Community.list('-created_date', 4),
  });

  const { data: progressItems = [] } = useQuery({
    queryKey: ['my-progress', user?.email],
    queryFn: () => base44.entities.StudentProgress.filter({ user_email: user.email }, '-updated_date', 10),
    enabled: !!user?.email,
  });

  const completedCourses = progressItems.filter(p => p.status === 'completed').length;
  const inProgressCourses = progressItems.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTutorial
            userRole={user?.role}
            onClose={() => {
              setShowOnboarding(false);
              localStorage.setItem(ONBOARD_KEY, 'true');
            }}
          />
        )}
      </AnimatePresence>

      <WelcomeHero userName={user?.full_name} tier={user?.membership_tier} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Courses" value={courses.length} icon={BookOpen} accentColor="bg-black" subtitle="Available to enroll" />
        <StatCard title="edVisors" value={coaches.length} icon={Star} accentColor="bg-black" subtitle="Ready for sessions" />
        <StatCard title="Communities" value={communities.length} icon={Users} accentColor="bg-black" subtitle="Active groups" />
        <StatCard title="Courses Completed" value={completedCourses} icon={CheckCircle} accentColor="bg-black" subtitle={`${inProgressCourses} in progress`} />
      </div>

      {/* Xschetails CTA */}
      {!xschetails ? (
        <div className="bg-[#0a0f1e] rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black">Build Your Xschetails™</p>
              <p className="text-white/40 text-sm">Complete your school intelligence profile to unlock AI recommendations, dashboards, and matching.</p>
            </div>
          </div>
          <Link to="/xschetails">
            <button className="flex items-center gap-2 px-5 py-3 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all whitespace-nowrap">
              Start Now <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0a0f1e] rounded-2xl p-5 col-span-1">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Xschetails™</p>
            <p className="text-white font-black">{xschetails.school_name}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full">
                <div className="h-1.5 bg-white rounded-full" style={{ width: `${xschetails.completion_pct || 0}%` }} />
              </div>
              <span className="text-white/50 text-xs font-black">{xschetails.completion_pct || 0}%</span>
            </div>
          </div>
          <Link to="/xschetails/dashboard" className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#0a0f1e] transition-all">
            <BarChart3 className="w-5 h-5 text-gray-400 mb-2" />
            <p className="font-black text-[#0a0f1e] text-sm">Xschetails Dashboard</p>
            <p className="text-xs text-gray-400 mt-0.5">Performance charts & AI insights</p>
          </Link>
          <Link to="/xschetails" className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#0a0f1e] transition-all">
            <Sparkles className="w-5 h-5 text-gray-400 mb-2" />
            <p className="font-black text-[#0a0f1e] text-sm">AI Analysis</p>
            <p className="text-xs text-gray-400 mt-0.5">{xschetails.ai_summary ? 'View your school report' : 'Generate AI insights'}</p>
          </Link>
        </div>
      )}

      {/* Capital Access Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/deal-room" className="group bg-foreground text-background rounded-2xl p-5 hover:bg-foreground/90 transition-all col-span-1">
          <div className="flex items-center justify-between mb-3">
            <Briefcase className="w-4 h-4 text-white/60" />
            <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
          </div>
          <h3 className="font-heading text-base font-semibold mb-0.5">Deal Room</h3>
          <p className="text-white/50 text-xs">Private investment opportunities</p>
        </Link>
        <Link to="/pipeline" className="group bg-card border border-border/50 rounded-2xl p-5 hover:border-foreground/20 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <h3 className="font-heading text-base font-semibold mb-0.5">My Pipeline</h3>
          <p className="text-muted-foreground text-xs">Track your investor deal flow</p>
        </Link>
        <Link to="/founder-dashboard" className="group bg-card border border-border/50 rounded-2xl p-5 hover:border-foreground/20 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <h3 className="font-heading text-base font-semibold mb-0.5">Raise Capital</h3>
          <p className="text-muted-foreground text-xs">Submit and manage your raise</p>
        </Link>
        <Link to="/pricing" className="group bg-card border border-border/50 rounded-2xl p-5 hover:border-foreground/20 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <h3 className="font-heading text-base font-semibold mb-0.5">Membership</h3>
          <p className="text-muted-foreground text-xs">edVestor pricing & access tiers</p>
        </Link>
      </div>

      {/* My Progress */}
      {progressItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">My Learning Progress</h2>
            <Link to="/courses" className="text-sm text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
              All Courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressItems.slice(0, 4).map(p => <StudentProgressCard key={p.id} progress={p} />)}
          </div>
        </section>
      )}

      {/* Featured edVisors */}
      {coaches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">Featured edVisors</h2>
            <Link to="/edvisors" className="text-sm text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coaches.map(coach => <EdVisorCard key={coach.id} coach={coach} />)}
          </div>
        </section>
      )}

      {/* Communities */}
      {communities.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">Active Communities</h2>
            <Link to="/communities" className="text-sm text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {communities.map(c => (
              <Link key={c.id} to={`/communities/${c.id}`} className="bg-card border border-border/50 rounded-xl p-5 hover:border-black/20 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-medium text-sm truncate">{c.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                <p className="text-xs text-muted-foreground">{c.member_count || 0} members</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}