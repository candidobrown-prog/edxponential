import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  DollarSign, Bell, CheckCircle2, TrendingDown, Users, MessageSquare,
  Star, Target, Sparkles, AlertTriangle, ShieldCheck, Eye
} from 'lucide-react';

export default function GraiedxPaiyTeacher() {
  const qc = useQueryClient();
  const [selectedReward, setSelectedReward] = useState(null);
  const [notifyNote, setNotifyNote] = useState('');
  const [notifyType, setNotifyType] = useState('payout');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const createReward = useMutation({
    mutationFn: (data) => base44.entities.PaiyReward.create(data),
    onSuccess: () => { qc.invalidateQueries(['PaiyReward']); setSelectedReward(null); setSent(true); setSending(false); }
  });

  const handleNotify = async () => {
    if (!selectedReward) return;
    setSending(true);
    createReward.mutate({
      student_name: selectedReward.student_name,
      parent_email: selectedReward.parent_email || '',
      teacher_email: selectedReward.teacher_email,
      title: notifyType === 'payout'
        ? `Teacher recommends payout: ${selectedReward.title}`
        : `Teacher recommends holding funds: ${selectedReward.title}`,
      amount: selectedReward.reward_amount || 0,
      teacher_note: notifyNote,
      status: 'pending_approval',
      parent_action: 'pending',
      earned_date: new Date().toISOString().split('T')[0],
      badge_type: 'grade_achievement',
    });
  };

  // Group students by incentive status
  const studentsWithIncentives = students.map(s => ({
    ...s,
    incentives: incentives.filter(i => i.student_name === s.student_name),
    rewards: rewards.filter(r => r.student_name === s.student_name),
  })).filter(s => s.incentives.length > 0);

  const studentsNeedingAttention = students.filter(s =>
    s.risk_level === 'failing' || s.risk_level === 'at_risk' || s.missing_assignments > 2
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020205] via-[#0a051a] to-[#020205]">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl leading-none">Teacher Paiy View</h1>
            <p className="text-white/30 text-xs mt-0.5">Incentive-linked students · Notify families · Recommend actions</p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-blue-500/20 text-blue-300 border-0 text-[10px] px-3 py-1">
              <ShieldCheck className="w-3 h-3 mr-1" /> Banking info hidden · FERPA compliant
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Attention Needed */}
        {studentsNeedingAttention.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <h3 className="text-white font-black text-sm flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Students Needing Attention
            </h3>
            <div className="space-y-2">
              {studentsNeedingAttention.map(s => {
                const sIncentives = incentives.filter(i => i.student_name === s.student_name);
                return (
                  <div key={s.id} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center font-black text-white text-sm">
                        {s.student_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{s.student_name}</p>
                        <p className="text-white/40 text-xs">
                          {s.current_average}% avg · {s.missing_assignments} missing
                          {sIncentives.length > 0 && ` · ${sIncentives.length} incentive(s) at risk`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => { setSelectedReward({ ...s, title: 'Grade Alert', reward_amount: sIncentives[0]?.reward_amount || 0, teacher_email: s.teacher_email }); setNotifyType('retain'); }}
                        size="sm" variant="outline" className="text-xs h-8 border-amber-500/30 text-amber-400 bg-transparent hover:bg-amber-500/10">
                        <TrendingDown className="w-3 h-3 mr-1" /> Recommend Retain
                      </Button>
                      <Button
                        onClick={() => { setSelectedReward({ ...s, title: 'Achievement Notification', reward_amount: sIncentives[0]?.reward_amount || 0, teacher_email: s.teacher_email }); setNotifyType('payout'); }}
                        size="sm" className="text-xs h-8 bg-blue-500 hover:bg-blue-600 text-white">
                        <Bell className="w-3 h-3 mr-1" /> Notify Parent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Incentive-Linked Students */}
        <div>
          <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" /> Students with Active Incentive Plans
          </h3>
          {studentsWithIncentives.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
              <DollarSign className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No students have active incentive plans yet.</p>
              <p className="text-white/20 text-xs mt-1">Parents can set up Paiy Graiedx™ incentives in the Family Portal.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentsWithIncentives.map(s => {
                const metGoals = s.incentives.filter(i => i.payout_status === 'condition_met' || i.payout_status === 'paid_out');
                const pendingGoals = s.incentives.filter(i => i.payout_status === 'pending');
                return (
                  <div key={s.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-blue-500/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 flex items-center justify-center font-black text-white">
                          {s.student_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold">{s.student_name}</p>
                          <p className="text-white/40 text-xs">{s.class_name} · {s.current_average}% avg</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-[10px] border-0', {
                          'bg-green-500/20 text-green-400': s.risk_level === 'on_track',
                          'bg-yellow-500/20 text-yellow-400': s.risk_level === 'watch',
                          'bg-orange-500/20 text-orange-400': s.risk_level === 'at_risk' || s.risk_level === 'concern',
                          'bg-red-500/20 text-red-400': s.risk_level === 'failing',
                        })}>
                          {s.risk_level?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Incentive Summary */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/40 text-[9px]">Active Plans</p>
                        <p className="text-white font-black text-base">{s.incentives.length}</p>
                      </div>
                      <div className="bg-emerald-500/10 rounded-lg p-2">
                        <p className="text-white/40 text-[9px]">Goals Met</p>
                        <p className="text-emerald-400 font-black text-base">{metGoals.length}</p>
                      </div>
                      <div className="bg-yellow-500/10 rounded-lg p-2">
                        <p className="text-white/40 text-[9px]">Pending</p>
                        <p className="text-yellow-400 font-black text-base">{pendingGoals.length}</p>
                      </div>
                    </div>

                    {/* Incentive List — no amounts shown to teacher */}
                    <div className="mt-3 space-y-1">
                      {s.incentives.map(inc => (
                        <div key={inc.id} className="flex items-center gap-2 text-xs">
                          <div className={cn('w-1.5 h-1.5 rounded-full', {
                            'bg-emerald-400': inc.payout_status === 'paid_out' || inc.payout_status === 'condition_met',
                            'bg-yellow-400': inc.payout_status === 'pending',
                            'bg-gray-400': inc.payout_status === 'paused',
                          })} />
                          <span className="text-white/60">{inc.title}</span>
                          <span className="text-white/30">{inc.incentive_type?.replace('_', ' ')}</span>
                          <Badge className={cn('text-[9px] border-0 ml-auto', {
                            'bg-emerald-500/20 text-emerald-400': inc.payout_status === 'paid_out' || inc.payout_status === 'condition_met',
                            'bg-yellow-500/20 text-yellow-400': inc.payout_status === 'pending',
                            'bg-gray-500/20 text-gray-400': inc.payout_status === 'paused',
                          })}>
                            {inc.payout_status?.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Teacher Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                      <Button
                        onClick={() => { setSelectedReward({ ...s, title: s.incentives[0]?.title || 'Goal Achievement', reward_amount: s.incentives[0]?.reward_amount || 0, teacher_email: s.teacher_email }); setNotifyType('payout'); setSent(false); }}
                        size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs h-8 gap-1">
                        <Bell className="w-3 h-3" /> Notify Parent to Payout
                      </Button>
                      <Button
                        onClick={() => { setSelectedReward({ ...s, title: s.incentives[0]?.title || 'Performance Update', reward_amount: s.incentives[0]?.reward_amount || 0, teacher_email: s.teacher_email }); setNotifyType('retain'); setSent(false); }}
                        size="sm" variant="outline" className="flex-1 border-amber-500/20 text-amber-400 text-xs h-8 bg-transparent hover:bg-amber-500/10 gap-1">
                        <TrendingDown className="w-3 h-3" /> Recommend Retain Funds
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All Students Overview */}
        <div>
          <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-white/40" /> All Students
          </h3>
          <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/30 text-xs font-bold px-4 py-3">Student</th>
                  <th className="text-center text-white/30 text-xs font-bold px-4 py-3">Average</th>
                  <th className="text-center text-white/30 text-xs font-bold px-4 py-3">Missing</th>
                  <th className="text-center text-white/30 text-xs font-bold px-4 py-3">Incentives</th>
                  <th className="text-center text-white/30 text-xs font-bold px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const sInc = incentives.filter(i => i.student_name === s.student_name);
                  return (
                    <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-black">
                            {s.student_name?.charAt(0)}
                          </div>
                          <span className="text-white font-medium">{s.student_name}</span>
                          {sInc.length > 0 && <DollarSign className="w-3 h-3 text-emerald-400" />}
                        </div>
                      </td>
                      <td className="text-center px-4 py-3">
                        <span className={cn('font-bold text-sm', {
                          'text-emerald-400': (s.current_average || 0) >= 90,
                          'text-yellow-400': (s.current_average || 0) >= 80,
                          'text-orange-400': (s.current_average || 0) >= 70,
                          'text-red-400': (s.current_average || 0) < 70,
                        })}>{s.current_average || '--'}%</span>
                      </td>
                      <td className="text-center px-4 py-3">
                        <span className={cn('text-sm', s.missing_assignments > 0 ? 'text-red-400 font-bold' : 'text-white/40')}>
                          {s.missing_assignments || 0}
                        </span>
                      </td>
                      <td className="text-center px-4 py-3">
                        <span className="text-white/60 text-sm">{sInc.length || '—'}</span>
                      </td>
                      <td className="text-center px-4 py-3">
                        <Badge className={cn('text-[10px] border-0', {
                          'bg-green-500/20 text-green-400': s.risk_level === 'on_track',
                          'bg-yellow-500/20 text-yellow-400': s.risk_level === 'watch',
                          'bg-orange-500/20 text-orange-400': s.risk_level === 'at_risk' || s.risk_level === 'concern',
                          'bg-red-500/20 text-red-400': s.risk_level === 'failing',
                        })}>
                          {s.risk_level?.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notify Dialog */}
      <Dialog open={!!selectedReward} onOpenChange={() => { setSelectedReward(null); setSent(false); }}>
        <DialogContent className="bg-[#0a0a1a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-black flex items-center gap-2">
              {notifyType === 'payout'
                ? <><Bell className="w-4 h-4 text-blue-400" /> Notify Parent to Payout</>
                : <><TrendingDown className="w-4 h-4 text-amber-400" /> Recommend Retain Funds</>
              }
            </DialogTitle>
          </DialogHeader>
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-black text-lg">Notification Sent!</p>
              <p className="text-white/40 text-sm mt-1">Parent will receive the recommendation in their Paiy dashboard.</p>
              <Button onClick={() => { setSelectedReward(null); setSent(false); }} className="mt-4 bg-white/10 hover:bg-white/20 text-white">Close</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs">Student</p>
                <p className="text-white font-bold">{selectedReward?.student_name}</p>
                <p className="text-white/40 text-xs mt-2">Incentive</p>
                <p className="text-white/70 text-sm">{selectedReward?.title}</p>
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1.5">
                  {notifyType === 'payout' ? 'Your message to parent (why you recommend payout):' : 'Your message to parent (reason to hold funds):'}
                </label>
                <textarea
                  value={notifyNote}
                  onChange={e => setNotifyNote(e.target.value)}
                  placeholder={notifyType === 'payout'
                    ? 'e.g. "Marcus has shown great improvement this week and completed all assignments."'
                    : 'e.g. "Devon has 3 missing assignments. I recommend holding the reward until they\'re completed."'
                  }
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm resize-none h-24 focus:outline-none focus:border-blue-500/40"
                />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                <p className="text-white/50 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Banking details are never shared with teachers. Only the recommendation is sent.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setSelectedReward(null)} variant="outline" className="flex-1 border-white/10 text-white/50 bg-transparent">Cancel</Button>
                <Button onClick={handleNotify} disabled={sending || createReward.isPending}
                  className={cn('flex-1 text-white', notifyType === 'payout' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-amber-500 hover:bg-amber-600')}>
                  {sending ? 'Sending...' : notifyType === 'payout' ? 'Send Payout Recommendation' : 'Recommend Retain Funds'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}