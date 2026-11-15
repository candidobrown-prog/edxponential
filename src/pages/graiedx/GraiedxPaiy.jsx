import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DollarSign, Plus, Zap, TrendingUp, CheckCircle2, Clock, AlertTriangle,
  Sparkles, PiggyBank, Wallet, Star, RefreshCw, Bell, ChevronRight,
  Shield, Brain, Target, BarChart3, Users, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const INCENTIVE_TYPES = [
  { value: 'grade', label: 'Grade Target', icon: '🎯' },
  { value: 'assignment_completion', label: 'Assignment Completion', icon: '✅' },
  { value: 'attendance', label: 'Attendance', icon: '📅' },
  { value: 'growth', label: 'Grade Improvement', icon: '📈' },
  { value: 'honor_roll', label: 'Honor Roll', icon: '⭐' },
  { value: 'report_card', label: 'Report Card', icon: '📋' },
  { value: 'streak', label: 'Streak Challenge', icon: '🔥' },
  { value: 'standards_mastery', label: 'Standards Mastery', icon: '🏆' },
];

const PERIODS = [
  { value: 'per_assignment', label: 'Per Assignment' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'per_report_card', label: 'Per Report Card' },
  { value: 'semester', label: 'Semester' },
  { value: 'year_end', label: 'Year-End' },
];

const statusColors = {
  pending: 'bg-slate-100 text-slate-700',
  condition_met: 'bg-green-100 text-green-700',
  approved: 'bg-blue-100 text-blue-700',
  paid_out: 'bg-emerald-100 text-emerald-700',
  retained: 'bg-amber-100 text-amber-700',
  paused: 'bg-gray-100 text-gray-500',
};

const rewardStatusColors = {
  earned: 'bg-yellow-100 text-yellow-700',
  pending_approval: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  paid_out: 'bg-emerald-100 text-emerald-700',
  retained: 'bg-amber-100 text-amber-700',
};

export default function GraiedxPaiy() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [showNewIncentive, setShowNewIncentive] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    student_name: '', title: '', incentive_type: 'grade', period: 'monthly',
    reward_amount: '', target_grade: 'A', target_percentage: '', subject: '',
    savings_split_pct: 20, spending_split_pct: 80,
    requires_parent_approval: true, delay_until_report_card: false,
    description: '', parent_email: '', start_date: '', end_date: ''
  });

  const { data: incentives = [] } = useQuery({
    queryKey: ['PaiyIncentive'],
    queryFn: () => base44.entities.PaiyIncentive.list('-created_date', 50),
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ['PaiyReward'],
    queryFn: () => base44.entities.PaiyReward.list('-created_date', 50),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['PaiyAccount'],
    queryFn: () => base44.entities.PaiyAccount.list('-created_date', 20),
  });

  const { data: students = [] } = useQuery({
    queryKey: ['GraiedxStudent'],
    queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 100),
  });

  const createIncentive = useMutation({
    mutationFn: (data) => base44.entities.PaiyIncentive.create(data),
    onSuccess: () => { qc.invalidateQueries(['PaiyIncentive']); setShowNewIncentive(false); }
  });

  const updateReward = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PaiyReward.update(id, data),
    onSuccess: () => qc.invalidateQueries(['PaiyReward']),
  });

  const updateIncentive = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PaiyIncentive.update(id, data),
    onSuccess: () => qc.invalidateQueries(['PaiyIncentive']),
  });

  const handlePayout = (reward) => {
    updateReward.mutate({ id: reward.id, data: { parent_action: 'approved_payout', status: 'paid_out', parent_action_date: new Date().toISOString() } });
  };

  const handleRetain = (reward) => {
    updateReward.mutate({ id: reward.id, data: { parent_action: 'retained', status: 'retained', parent_action_date: new Date().toISOString() } });
  };

  const handleCreate = () => {
    createIncentive.mutate({
      ...form,
      reward_amount: parseFloat(form.reward_amount) || 0,
      target_percentage: parseFloat(form.target_percentage) || 0,
      savings_split_pct: parseInt(form.savings_split_pct),
      spending_split_pct: parseInt(form.spending_split_pct),
      payout_status: 'pending',
      active: true,
      funds_reserved: parseFloat(form.reward_amount) || 0,
    });
  };

  const runAI = async () => {
    setAiLoading(true);
    setShowAI(true);
    const summary = incentives.slice(0, 6).map(i =>
      `${i.student_name}: ${i.title} — $${i.reward_amount} (${i.payout_status})`
    ).join('\n');
    const studentSummary = students.slice(0, 6).map(s =>
      `${s.student_name}: ${s.current_average}% avg, ${s.missing_assignments} missing, risk: ${s.risk_level}`
    ).join('\n');
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI academic incentive advisor for Paiy Graiedx™, a platform that links financial rewards to student academic performance.\n\nCurrent incentive plans:\n${summary || 'None yet'}\n\nStudent performance:\n${studentSummary || 'No data'}\n\nProvide:\n1. An assessment of whether current incentive structures are healthy and motivating\n2. Specific recommendations for incentive adjustments\n3. Students who may need intervention support\n4. Suggested new incentives based on current performance\n5. A motivational message for the family\n\nKeep tone warm, encouraging, and actionable. Be specific.`,
      model: 'claude_sonnet_4_6'
    });
    setAiAnalysis(res);
    setAiLoading(false);
  };

  const totalReserved = incentives.reduce((s, i) => s + (i.funds_reserved || 0), 0);
  const totalEarned = rewards.filter(r => r.status === 'paid_out').reduce((s, r) => s + (r.amount || 0), 0);
  const pendingApproval = rewards.filter(r => r.status === 'earned' || r.status === 'pending_approval');
  const activeIncentives = incentives.filter(i => i.active && i.payout_status === 'pending');

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'incentives', label: 'Incentives', icon: Target },
    { id: 'rewards', label: 'Rewards Queue', icon: Award },
    { id: 'accounts', label: 'Accounts', icon: PiggyBank },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020205] via-[#0a0a1a] to-[#020205]">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-black text-xl leading-none">Paiy Graiedx™</h1>
                <p className="text-white/30 text-xs font-medium mt-0.5">Academic Incentive & Family Reward System</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={runAI} variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 gap-2 text-xs bg-transparent">
              <Brain className="w-3.5 h-3.5 text-emerald-400" /> AI Analysis
            </Button>
            <Button onClick={() => setShowNewIncentive(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-xs">
              <Plus className="w-3.5 h-3.5" /> New Incentive
            </Button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 mt-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all',
              tab === id ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
            )}>
              <Icon className="w-3.5 h-3.5" />{label}
              {id === 'rewards' && pendingApproval.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-black">
                  {pendingApproval.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Reserved Funds', value: `$${totalReserved.toFixed(2)}`, icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Total Paid Out', value: `$${totalEarned.toFixed(2)}`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Active Incentives', value: activeIncentives.length, icon: Target, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { label: 'Pending Approval', value: pendingApproval.length, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
                    <Icon className={cn('w-5 h-5', color)} />
                  </div>
                  <p className="text-white font-black text-2xl">{value}</p>
                  <p className="text-white/40 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Pending Actions */}
            {pendingApproval.length > 0 && (
              <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-white font-black text-sm">Rewards Awaiting Your Approval</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">{pendingApproval.length} pending</Badge>
                </div>
                <div className="space-y-3">
                  {pendingApproval.map(reward => (
                    <div key={reward.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg">
                          🏆
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{reward.student_name}</p>
                          <p className="text-white/50 text-xs">{reward.title}</p>
                          {reward.teacher_note && <p className="text-white/30 text-xs italic mt-0.5">"{reward.teacher_note}"</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-emerald-400 font-black text-lg">${reward.amount?.toFixed(2)}</p>
                          <p className="text-white/30 text-[10px]">{reward.earned_date}</p>
                        </div>
                        <Button onClick={() => handlePayout(reward)} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-8 px-3">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Pay Out
                        </Button>
                        <Button onClick={() => handleRetain(reward)} size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs h-8 px-3 bg-transparent">
                          Retain
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Summary */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-black text-sm mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-white/40" /> Student Incentive Overview
              </h3>
              {students.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8">No students found. Add students in the Students module.</p>
              ) : (
                <div className="space-y-2">
                  {students.slice(0, 8).map(student => {
                    const studentIncentives = incentives.filter(i => i.student_name === student.student_name);
                    const studentRewards = rewards.filter(r => r.student_name === student.student_name);
                    const earned = studentRewards.filter(r => r.status === 'paid_out').reduce((s, r) => s + (r.amount || 0), 0);
                    return (
                      <div key={student.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-black text-white">
                            {student.student_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">{student.student_name}</p>
                            <p className="text-white/40 text-xs">{student.class_name} · {student.current_average}% avg</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-white/40 text-[10px]">Incentives</p>
                            <p className="text-white font-bold text-sm">{studentIncentives.length}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/40 text-[10px]">Earned</p>
                            <p className="text-emerald-400 font-bold text-sm">${earned.toFixed(0)}</p>
                          </div>
                          <Badge className={cn('text-[10px] border-0', {
                            'bg-green-500/20 text-green-400': student.risk_level === 'on_track',
                            'bg-yellow-500/20 text-yellow-400': student.risk_level === 'watch',
                            'bg-orange-500/20 text-orange-400': student.risk_level === 'concern' || student.risk_level === 'at_risk',
                            'bg-red-500/20 text-red-400': student.risk_level === 'failing',
                          })}>
                            {student.risk_level?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Incentives Tab */}
        {tab === 'incentives' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-black">Active Incentive Plans</h3>
              <Button onClick={() => setShowNewIncentive(true)} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Incentive
              </Button>
            </div>
            {incentives.length === 0 ? (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-white font-black text-lg">No incentives yet</p>
                <p className="text-white/40 text-sm mt-2">Create your first academic reward to motivate your student.</p>
                <Button onClick={() => setShowNewIncentive(true)} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">Create First Incentive</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incentives.map(inc => {
                  const typeInfo = INCENTIVE_TYPES.find(t => t.value === inc.incentive_type);
                  return (
                    <div key={inc.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{typeInfo?.icon || '🎯'}</span>
                          <div>
                            <p className="text-white font-bold text-sm">{inc.title}</p>
                            <p className="text-white/40 text-xs">{inc.student_name} · {inc.subject || 'All Subjects'}</p>
                          </div>
                        </div>
                        <Badge className={cn('text-[10px] border-0', statusColors[inc.payout_status] || 'bg-white/10 text-white/50')}>
                          {inc.payout_status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-emerald-400 font-black text-xl">${inc.reward_amount?.toFixed(2)}</p>
                          <p className="text-white/30 text-[10px]">{inc.period?.replace('_', ' ')} · {inc.savings_split_pct}% savings</p>
                        </div>
                        <div className="flex gap-2">
                          {inc.payout_status === 'pending' && (
                            <Button onClick={() => updateIncentive.mutate({ id: inc.id, data: { active: !inc.active, payout_status: inc.active ? 'paused' : 'pending' } })}
                              size="sm" variant="outline" className="text-xs h-7 border-white/10 text-white/40 bg-transparent hover:bg-white/5">
                              {inc.active ? 'Pause' : 'Resume'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Rewards Queue */}
        {tab === 'rewards' && (
          <div className="space-y-4">
            <h3 className="text-white font-black">Reward History & Queue</h3>
            {rewards.length === 0 ? (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-16 text-center">
                <p className="text-white/40">No rewards yet. Rewards appear here when students meet incentive goals.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rewards.map(reward => (
                  <div key={reward.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center text-xl">🏆</div>
                      <div>
                        <p className="text-white font-bold text-sm">{reward.student_name}</p>
                        <p className="text-white/50 text-xs">{reward.title}</p>
                        {reward.teacher_note && <p className="text-white/30 text-xs italic">Teacher: "{reward.teacher_note}"</p>}
                        <p className="text-white/20 text-[10px] mt-1">{reward.earned_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-emerald-400 font-black text-lg">${reward.amount?.toFixed(2)}</p>
                        <Badge className={cn('text-[10px] border-0 mt-1', rewardStatusColors[reward.status] || 'bg-white/10 text-white/50')}>
                          {reward.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      {(reward.status === 'earned' || reward.status === 'pending_approval') && (
                        <div className="flex flex-col gap-2">
                          <Button onClick={() => handlePayout(reward)} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-8">
                            ✓ Pay Out
                          </Button>
                          <Button onClick={() => handleRetain(reward)} size="sm" variant="outline" className="border-amber-400/30 text-amber-400 text-xs h-8 bg-transparent hover:bg-amber-500/10">
                            Hold
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Accounts */}
        {tab === 'accounts' && (
          <div className="space-y-4">
            <h3 className="text-white font-black">Family Accounts</h3>
            {accounts.length === 0 ? (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-16 text-center">
                <PiggyBank className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">No accounts configured. Accounts are created automatically when you add incentive plans.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map(acct => (
                  <div key={acct.id} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-white">
                        {acct.student_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-black">{acct.student_name}</p>
                        <p className="text-white/40 text-xs">{acct.parent_email}</p>
                      </div>
                      <Badge className={cn('ml-auto text-[10px] border-0', acct.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400')}>
                        {acct.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Available', value: `$${(acct.available_balance || 0).toFixed(2)}`, color: 'text-white' },
                        { label: 'Savings', value: `$${(acct.savings_balance || 0).toFixed(2)}`, color: 'text-blue-400' },
                        { label: 'Paid Out', value: `$${(acct.total_paid_out || 0).toFixed(2)}`, color: 'text-emerald-400' },
                        { label: 'Retained', value: `$${(acct.total_retained || 0).toFixed(2)}`, color: 'text-amber-400' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white/5 rounded-xl p-3">
                          <p className="text-white/40 text-[10px]">{label}</p>
                          <p className={cn('font-black text-lg', color)}>{value}</p>
                        </div>
                      ))}
                    </div>
                    {acct.ai_last_analysis && (
                      <div className="mt-3 bg-white/5 rounded-xl p-3 border border-emerald-500/10">
                        <p className="text-white/30 text-[10px] flex items-center gap-1 mb-1"><Sparkles className="w-3 h-3 text-emerald-400" /> AI Insight</p>
                        <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{acct.ai_last_analysis}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Incentive Dialog */}
      <Dialog open={showNewIncentive} onOpenChange={setShowNewIncentive}>
        <DialogContent className="bg-[#0a0a1a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white font-black flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" /> Create Academic Incentive
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Student Name *</label>
                <Input value={form.student_name} onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))}
                  placeholder="Student name" className="bg-white/5 border-white/10 text-white text-sm h-9" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Parent Email *</label>
                <Input value={form.parent_email} onChange={e => setForm(f => ({ ...f, parent_email: e.target.value }))}
                  placeholder="parent@email.com" className="bg-white/5 border-white/10 text-white text-sm h-9" />
              </div>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Incentive Title *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder='e.g. "A in Math = $50"' className="bg-white/5 border-white/10 text-white text-sm h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Incentive Type</label>
                <Select value={form.incentive_type} onValueChange={v => setForm(f => ({ ...f, incentive_type: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a1a] border-white/10">
                    {INCENTIVE_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value} className="text-white">{t.icon} {t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Period</label>
                <Select value={form.period} onValueChange={v => setForm(f => ({ ...f, period: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a1a] border-white/10">
                    {PERIODS.map(p => (
                      <SelectItem key={p.value} value={p.value} className="text-white">{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Reward Amount ($) *</label>
                <Input type="number" value={form.reward_amount} onChange={e => setForm(f => ({ ...f, reward_amount: e.target.value }))}
                  placeholder="50.00" className="bg-white/5 border-white/10 text-white text-sm h-9" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Subject (optional)</label>
                <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Math, ELA, All..." className="bg-white/5 border-white/10 text-white text-sm h-9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Savings Split (%)</label>
                <Input type="number" min="0" max="100" value={form.savings_split_pct}
                  onChange={e => setForm(f => ({ ...f, savings_split_pct: e.target.value, spending_split_pct: 100 - parseInt(e.target.value || 0) }))}
                  className="bg-white/5 border-white/10 text-white text-sm h-9" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Spending Split (%)</label>
                <Input type="number" value={form.spending_split_pct} readOnly className="bg-white/5 border-white/10 text-white/50 text-sm h-9 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Description / Trigger Condition</label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder='e.g. "Earn A or B in Math this quarter"' className="bg-white/5 border-white/10 text-white text-sm h-9" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => setShowNewIncentive(false)} variant="outline" className="flex-1 border-white/10 text-white/50 bg-transparent">Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.student_name || !form.title || !form.reward_amount || createIncentive.isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
              {createIncentive.isPending ? 'Creating...' : 'Create Incentive'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Analysis Dialog */}
      <Dialog open={showAI} onOpenChange={setShowAI}>
        <DialogContent className="bg-[#0a0a1a] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-black flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" /> AI Incentive Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-12 h-12 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/50 text-sm">Analyzing incentive structures and student performance...</p>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-xs">AI Recommendation Report</span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}