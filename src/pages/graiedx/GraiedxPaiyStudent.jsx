import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star, Zap, TrendingUp, Award, Target, CheckCircle2, Lock, Gift, Flame, DollarSign, BarChart3 } from 'lucide-react';

const BADGES = [
  { key: 'honor_roll', icon: '⭐', label: 'Honor Roll', color: 'from-yellow-400 to-amber-500' },
  { key: 'perfect_attendance', icon: '📅', label: 'Perfect Attendance', color: 'from-blue-400 to-cyan-500' },
  { key: 'assignment_streak', icon: '🔥', label: 'Assignment Streak', color: 'from-orange-400 to-red-500' },
  { key: 'most_improved', icon: '📈', label: 'Most Improved', color: 'from-green-400 to-emerald-500' },
  { key: 'math_master', icon: '🧮', label: 'Math Master', color: 'from-violet-400 to-purple-500' },
  { key: 'reading_champ', icon: '📚', label: 'Reading Champ', color: 'from-pink-400 to-rose-500' },
];

export default function GraiedxPaiyStudent() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: students = [] } = useQuery({
    queryKey: ['GraiedxStudent'],
    queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 50),
  });

  const { data: incentives = [] } = useQuery({
    queryKey: ['PaiyIncentive'],
    queryFn: () => base44.entities.PaiyIncentive.list('-created_date', 50),
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ['PaiyReward'],
    queryFn: () => base44.entities.PaiyReward.list('-created_date', 50),
  });

  const student = selectedStudent || students[0];
  const studentIncentives = incentives.filter(i => i.student_name === student?.student_name);
  const studentRewards = rewards.filter(r => r.student_name === student?.student_name);
  const earnedRewards = studentRewards.filter(r => r.status === 'paid_out');
  const pendingRewards = studentRewards.filter(r => r.status === 'earned' || r.status === 'pending_approval');
  const totalEarned = earnedRewards.reduce((s, r) => s + (r.amount || 0), 0);
  const pendingAmount = pendingRewards.reduce((s, r) => s + (r.amount || 0), 0);

  const getProgressPct = (inc) => {
    if (!student) return 0;
    if (inc.incentive_type === 'grade' && inc.target_percentage) {
      return Math.min(100, ((student.current_average || 0) / inc.target_percentage) * 100);
    }
    if (inc.incentive_type === 'assignment_completion') {
      return Math.min(100, student.completion_rate || 0);
    }
    return inc.payout_status === 'condition_met' || inc.payout_status === 'paid_out' ? 100 : 50;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020205] via-[#0d0520] to-[#020205]">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-xl">🎮</div>
            <div>
              <h1 className="text-white font-black text-xl leading-none">My Paiy Dashboard</h1>
              <p className="text-white/30 text-xs mt-0.5">Track your goals, earn your rewards</p>
            </div>
          </div>
          {students.length > 1 && (
            <select
              value={selectedStudent?.id || ''}
              onChange={e => setSelectedStudent(students.find(s => s.id === e.target.value))}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs"
            >
              {students.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.student_name}</option>)}
            </select>
          )}
        </div>
      </div>

      {!student ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-white/30">No student data found.</p>
        </div>
      ) : (
        <div className="px-8 py-6 space-y-6">
          {/* Student Hero Card */}
          <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center font-black text-2xl text-white">
                {student.student_name?.charAt(0)}
              </div>
              <div>
                <p className="text-white font-black text-xl">{student.student_name}</p>
                <p className="text-white/40 text-sm">{student.class_name} · Grade {student.grade_level}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-orange-400 text-xs font-bold">Keep it up! 🔥</span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-white/40 text-xs">Current Average</p>
                <p className={cn('font-black text-4xl', {
                  'text-emerald-400': (student.current_average || 0) >= 90,
                  'text-yellow-400': (student.current_average || 0) >= 80,
                  'text-orange-400': (student.current_average || 0) >= 70,
                  'text-red-400': (student.current_average || 0) < 70,
                })}>
                  {student.current_average || '--'}%
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Earned', value: `$${totalEarned.toFixed(0)}`, icon: DollarSign, color: 'text-emerald-400' },
                { label: 'Pending', value: `$${pendingAmount.toFixed(0)}`, icon: Clock, color: 'text-yellow-400' },
                { label: 'Active Goals', value: studentIncentives.length, icon: Target, color: 'text-violet-400' },
                { label: 'Completion', value: `${student.completion_rate || 100}%`, icon: CheckCircle2, color: 'text-blue-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/5 rounded-2xl p-3 text-center">
                  <Icon className={cn('w-4 h-4 mx-auto mb-1', color)} />
                  <p className={cn('font-black text-xl', color)}>{value}</p>
                  <p className="text-white/30 text-[10px]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Goals */}
          <div>
            <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" /> My Goals
            </h3>
            {studentIncentives.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/5">
                <p className="text-white/30 text-sm">No active goals yet. Ask your parent to set up incentives!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentIncentives.map(inc => {
                  const pct = getProgressPct(inc);
                  const isComplete = inc.payout_status === 'condition_met' || inc.payout_status === 'paid_out';
                  return (
                    <div key={inc.id} className={cn(
                      'rounded-2xl p-4 border transition-all',
                      isComplete ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isComplete ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-4 h-4 text-violet-400" />}
                          <p className="text-white font-bold text-sm">{inc.title}</p>
                        </div>
                        <p className="text-emerald-400 font-black text-lg">${inc.reward_amount?.toFixed(0)}</p>
                      </div>
                      {inc.description && <p className="text-white/40 text-xs mb-3">{inc.description}</p>}
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className={cn('h-2 rounded-full transition-all', isComplete ? 'bg-emerald-400' : 'bg-violet-400')}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-white/30 text-[10px]">{Math.round(pct)}% complete</span>
                        <span className="text-white/30 text-[10px]">{inc.period?.replace('_', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Achievement Badges */}
          <div>
            <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" /> Achievement Badges
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {BADGES.map(badge => {
                const earned = earnedRewards.some(r => r.badge_type === badge.key);
                return (
                  <div key={badge.key} className={cn(
                    'rounded-2xl p-3 text-center transition-all',
                    earned ? `bg-gradient-to-br ${badge.color} bg-opacity-20` : 'bg-white/5 opacity-40'
                  )}>
                    <div className="text-2xl mb-1">{earned ? badge.icon : '🔒'}</div>
                    <p className="text-white text-[9px] font-bold leading-tight">{badge.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Rewards */}
          {pendingRewards.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-yellow-400" /> Rewards Waiting! 🎉
              </h3>
              <div className="space-y-2">
                {pendingRewards.map(r => (
                  <div key={r.id} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">🏆 {r.title}</p>
                      <p className="text-white/40 text-xs">Waiting for parent approval</p>
                    </div>
                    <p className="text-yellow-400 font-black text-xl">${r.amount?.toFixed(0)}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-xs mt-3 text-center">Ask your parent to approve your rewards!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Need this for the icon above
function Clock({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
  </svg>;
}