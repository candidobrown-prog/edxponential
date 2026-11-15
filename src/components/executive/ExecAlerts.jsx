import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Star, TrendingUp, TrendingDown, XCircle, UserX, Zap, Bell, CheckCircle, CreditCard } from 'lucide-react';

function AlertCard({ icon: Icon, title, desc, type = 'info', items = [] }) {
  const config = {
    warning: { border: 'border-yellow-500/20', bg: 'bg-yellow-500/5', iconBg: 'bg-yellow-500/15', iconColor: 'text-yellow-400', badge: 'bg-yellow-500/15 text-yellow-400' },
    danger: { border: 'border-red-500/20', bg: 'bg-red-500/5', iconBg: 'bg-red-500/15', iconColor: 'text-red-400', badge: 'bg-red-500/15 text-red-400' },
    success: { border: 'border-green-500/20', bg: 'bg-green-500/5', iconBg: 'bg-green-500/15', iconColor: 'text-green-400', badge: 'bg-green-500/15 text-green-400' },
    info: { border: 'border-white/10', bg: 'bg-white/[0.03]', iconBg: 'bg-white/10', iconColor: 'text-white/60', badge: 'bg-white/10 text-white/50' },
  }[type];

  return (
    <div className={`border ${config.border} ${config.bg} rounded-2xl p-5`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-black text-white/85 text-sm">{title}</p>
            {items.length > 0 && <span className={`${config.badge} text-[10px] font-black px-2 py-0.5 rounded-full`}>{items.length}</span>}
          </div>
          <p className="text-white/35 text-xs mt-0.5">{desc}</p>
        </div>
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5 ml-12">
          {items.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
              <span className="text-white/45 text-xs">{item}</span>
            </div>
          ))}
          {items.length > 4 && <p className="text-white/25 text-[11px] ml-3">+{items.length - 4} more</p>}
        </div>
      )}
    </div>
  );
}

export default function ExecAlerts() {
  const { data: users = [] } = useQuery({ queryKey: ['exec_users_full'], queryFn: () => base44.entities.User.list('-created_date', 500) });
  const { data: transactions = [] } = useQuery({ queryKey: ['exec_txns_sales'], queryFn: () => base44.entities.Transaction.list('-created_date', 500) });
  const { data: courses = [] } = useQuery({ queryKey: ['exec_courses_full'], queryFn: () => base44.entities.Course.list('-created_date', 300) });
  const { data: xscoresAlerts = [] } = useQuery({ queryKey: ['exec_xscores_alerts'], queryFn: () => base44.entities.XscoresAlert.list('-created_date', 50) });

  const now = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Users at risk (joined > 30 days, 0 purchases)
  const atRisk = users.filter(u => {
    const joined = new Date(u.created_date);
    const daysSince = (Date.now() - joined) / 86400000;
    const hasPurchase = transactions.some(t => t.user_email === u.email && t.status === 'completed');
    return daysSince > 30 && !hasPurchase;
  });

  // High-value users (spent > $200)
  const highValue = users.filter(u => {
    const spend = transactions.filter(t => t.user_email === u.email && t.status === 'completed').reduce((s, t) => s + (t.amount_usd || 0), 0);
    return spend > 200;
  });

  // Failed payments
  const failedPayments = transactions.filter(t => t.status === 'failed' && new Date(t.created_date) >= sevenDaysAgo);

  // Refunds this week
  const recentRefunds = transactions.filter(t => ['refunded', 'partially_refunded'].includes(t.status) && new Date(t.created_date) >= sevenDaysAgo);

  // Courses with 0 enrollments (published only)
  const { data: progress = [] } = useQuery({ queryKey: ['exec_progress'], queryFn: () => base44.entities.StudentProgress.list('-created_date', 500) });
  const enrolledCourseIds = new Set(progress.map(p => p.course_id));
  const noEnrollmentCourses = courses.filter(c => c.status === 'published' && !enrolledCourseIds.has(c.id));

  // New users today
  const newToday = users.filter(u => new Date(u.created_date) >= today);

  // Revenue spike check
  const todayRevenue = transactions.filter(t => t.status === 'completed' && new Date(t.created_date) >= today).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const yesterdayStart = new Date(today - 86400000);
  const yesterdayRevenue = transactions.filter(t => t.status === 'completed' && new Date(t.created_date) >= yesterdayStart && new Date(t.created_date) < today).reduce((s, t) => s + (t.amount_usd || 0), 0);

  // Open xscores alerts (critical)
  const criticalAlerts = xscoresAlerts.filter(a => a.risk_level === 'critical' && a.status === 'open');

  const totalAlerts = atRisk.length + failedPayments.length + noEnrollmentCourses.length + criticalAlerts.length;

  return (
    <div className="space-y-5">
      {/* Alert summary header */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white/70" />
          </div>
          <div>
            <p className="font-black text-white text-base">Executive Alert Center</p>
            <p className="text-white/35 text-xs">AI-powered platform intelligence · auto-refreshed</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">{totalAlerts}</p>
          <p className="text-white/35 text-xs">active alerts</p>
        </div>
      </div>

      {/* Alert Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertCard icon={UserX} title="Users at Risk of Churning" desc="Joined 30+ days ago with no purchases. Needs outreach or offer."
          type="warning" items={atRisk.slice(0, 6).map(u => `${u.full_name || u.email} — joined ${Math.round((Date.now() - new Date(u.created_date)) / 86400000)}d ago`)} />

        <AlertCard icon={Star} title="High-Value Users" desc="Users who have spent $200+ on the platform. Prioritize retention."
          type="success" items={highValue.slice(0, 6).map(u => {
            const spend = transactions.filter(t => t.user_email === u.email && t.status === 'completed').reduce((s, t) => s + (t.amount_usd || 0), 0);
            return `${u.full_name || u.email} — $${spend.toFixed(2)} spent`;
          })} />

        <AlertCard icon={XCircle} title="Failed Payments (7 Days)" desc="Recent payment failures that may need follow-up."
          type="danger" items={failedPayments.slice(0, 6).map(t => `${t.user_email} — $${(t.amount_usd || 0).toFixed(2)} · ${t.product_name || t.product_type}`)} />

        <AlertCard icon={CreditCard} title="Refund Activity (7 Days)" desc="Recent refunds to monitor for patterns or disputes."
          type="warning" items={recentRefunds.slice(0, 5).map(t => `${t.user_email} — $${(t.refund_amount || t.amount_usd || 0).toFixed(2)}`)} />

        <AlertCard icon={TrendingDown} title="Published Courses with No Students" desc="Courses live on the platform but with zero enrollment."
          type="warning" items={noEnrollmentCourses.slice(0, 6).map(c => `${c.title} — ${c.created_by || 'Unknown creator'}`)} />

        <AlertCard icon={Zap} title="New Users Today" desc="Platform growth — users who joined in the last 24 hours."
          type="success" items={newToday.map(u => `${u.full_name || u.email} — ${u.role || 'user'}`)} />

        <AlertCard icon={AlertTriangle} title="Critical Xschores Alerts" desc="Students flagged at critical risk across connected schools."
          type="danger" items={criticalAlerts.slice(0, 6).map(a => `${a.student_name} — ${a.benchmark_name || a.category}`)} />

        <AlertCard icon={TrendingUp} title="Revenue Intelligence"
          desc={todayRevenue > yesterdayRevenue ? `Revenue is UP today vs yesterday ($${todayRevenue.toFixed(2)} vs $${yesterdayRevenue.toFixed(2)})` : todayRevenue < yesterdayRevenue ? `Revenue is DOWN today ($${todayRevenue.toFixed(2)} vs $${yesterdayRevenue.toFixed(2)} yesterday)` : `Today's revenue matches yesterday: $${todayRevenue.toFixed(2)}`}
          type={todayRevenue >= yesterdayRevenue ? 'success' : 'warning'} items={[]} />
      </div>
    </div>
  );
}