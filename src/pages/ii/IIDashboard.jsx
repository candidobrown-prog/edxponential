import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ii } from '@/api/ii';
import { PageHeader, Card, Stat, State, Btn, Pill, C } from '@/components/ii/ui';

const STATUS_TONE = { draft: 'neutral', setup: 'neutral', recording: 'warn', recorded: 'info', review: 'info', analyzed: 'accent', approved: 'good', archived: 'neutral' };
export const StatusPill = ({ status }) => <Pill tone={STATUS_TONE[status] || 'neutral'}>{status}</Pill>;

export default function IIDashboard() {
  const { me } = useOutletContext();
  const qc = useQueryClient();
  const { data, isLoading, error, dataUpdatedAt } = useQuery({ queryKey: ['ii-dashboard'], queryFn: ii.dashboard, enabled: !!me && !(me.needs_bootstrap) });

  if (me?.needs_bootstrap) {
    return (
      <>
        <PageHeader title="Instructional Intelligence" subtitle="First-time setup for this deployment." />
        <State kind="empty" title="No organization exists yet" detail="Create the pilot organization and school. You will be added as district administrator and coach so you can run the first observations." action={<Btn onClick={async () => { await ii.bootstrap({}); qc.invalidateQueries(['ii-me']); }}>Create pilot organization</Btn>} />
      </>
    );
  }
  const noAccess = !me?.platform_admin && (me?.memberships || []).length === 0;
  if (noAccess) return (<><PageHeader title="Instructional Intelligence" /><State kind="denied" title="No school role assigned" detail="Ask your school or district administrator to add you to a school in Instructional Intelligence. Nothing here is visible without a role." /></>);
  if (isLoading) return <State kind="loading" title="Loading your dashboard…" />;
  if (error) return <State kind="error" title="Dashboard unavailable" detail={error.message} />;

  const roles = data.role_summary; const isTeacher = roles.includes('teacher'); const isLeader = roles.some((r) => ['principal', 'district_admin'].includes(r)); const isCoach = roles.some((r) => ['coach', 'observer'].includes(r));
  const providers = me.providers || {};
  return (
    <>
      <PageHeader title="Overview" subtitle={`Role-appropriate view for ${roles.map((r) => r.replace('_', ' ')).join(', ') || 'platform administration'}.`} freshness={dataUpdatedAt} actions={isCoach && <Btn as={Link} to="/ii/observations/new">New observation</Btn>} />
      {(!providers.transcription?.configured || !providers.ai?.configured) && (
        <State kind="warning" className="mb-5" title="Some processing services are not configured" detail={[!providers.transcription?.configured && 'Automatic transcription is off (no transcription provider key) — transcripts can be entered or pasted manually.', !providers.ai?.configured && 'AI analysis stages are off (no Anthropic key) — discourse metrics and manual CFU-100 review still work.'].filter(Boolean).join(' ')} />
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {isCoach && <><Stat label="Awaiting review" value={data.observations.awaiting_review} sub="recorded / in transcript review" /><Stat label="Evidence to verify" value={data.evidence_requiring_verification} tone={data.evidence_requiring_verification ? 'warn' : undefined} sub="unverified quotations" /><Stat label="Open action plans" value={data.action_plans.open} /><Stat label="Outstanding reassessments" value={data.reassessments.outstanding} /></>}
        {isTeacher && !isCoach && <><Stat label="Private reflection drafts" value={data.reflections.drafts} /><Stat label="Shared observations" value={data.observations.total} /><Stat label="Agreed coaching commitments" value={data.coaching.agreed} /><Stat label="Upcoming reassessments" value={data.reassessments.outstanding} /></>}
        {isLeader && !isCoach && !isTeacher && <><Stat label="Observations visible" value={data.observations.total} sub="shared for leadership" /><Stat label="Approved" value={data.observations.approved} /><Stat label="Stale analyses" value={data.data_quality.stale_analyses} tone={data.data_quality.stale_analyses ? 'warn' : undefined} /><Stat label="Reassessments complete" value={data.reassessments.upcoming.length ? `${data.reassessments.outstanding} open` : '–'} /></>}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Card title="Recent observations" right={<Link to="/ii/observations" className="text-xs font-semibold" style={{ color: C.harbor }}>All</Link>}>
          {data.observations.recent.length === 0 ? <State kind="empty" title="No observations yet" detail={isCoach ? 'Start with New Observation.' : 'Observations appear here once a coach shares one with you.'} /> : (
            <ul className="divide-y" style={{ borderColor: C.mist }}>{data.observations.recent.map((o) => (<li key={o.id} className="py-2.5 flex items-center justify-between gap-3"><div className="min-w-0"><Link to={`/ii/observations/${o.id}`} className="text-sm font-semibold hover:underline truncate block" style={{ color: C.navy }}>{o.teacher_name || o.teacher_email} · {o.subject || 'Subject'} {o.grade ? `· Gr ${o.grade}` : ''}</Link><p className="text-[11px]" style={{ color: C.slate }}>{o.date || new Date(o.created_date).toLocaleDateString()} · {o.standard || 'no standard set'}</p></div><StatusPill status={o.status} /></li>))}</ul>
          )}
        </Card>
        <Card title={isTeacher ? 'Coaching commitments' : 'Coaching conversations'}>
          {data.coaching.recent.length === 0 ? <State kind="empty" title="No coaching conferences yet" /> : (
            <ul className="divide-y" style={{ borderColor: C.mist }}>{data.coaching.recent.map((c) => (<li key={c.id} className="py-2.5 flex items-center justify-between gap-3"><div><Link to={`/ii/coaching/${c.id}`} className="text-sm font-semibold hover:underline" style={{ color: C.navy }}>{c.teacher_email}</Link><p className="text-[11px]" style={{ color: C.slate }}>{(c.commitments || []).length} commitment(s) · follow-up {c.follow_up_date || 'not set'}</p></div><Pill tone={c.status === 'agreed' ? 'good' : 'neutral'}>{c.status}</Pill></li>))}</ul>
          )}
        </Card>
        <Card title="Upcoming reassessments">
          {data.reassessments.upcoming.length === 0 ? <State kind="empty" title="Nothing scheduled" /> : <ul className="space-y-2">{data.reassessments.upcoming.map((r) => <li key={r.id} className="text-sm flex justify-between"><span>{r.standard} · {r.teacher_email}</span><span style={{ color: C.slate }}>{r.due_date}</span></li>)}</ul>}
        </Card>
        <Card title="Instructional trends (your observations)">
          {data.trends.n === 0 ? <State kind="insufficient" title="Not enough analyzed observations" detail="Trends appear after analyses are reviewed." /> : (
            <div className="text-sm space-y-2">
              <p>Mean student talk: <strong>{data.trends.student_talk_mean ?? '–'}%</strong> across {data.trends.n} analyses</p>
              <p>DOK distribution: {data.trends.dok_distribution.map((d) => `DOK${d.level}: ${d.count}`).join(' · ')}</p>
              <ul className="grid grid-cols-2 gap-1 text-[12px]">{Object.values(data.trends.cfu_dimensions).map((d) => <li key={d.label}>{d.label}: <strong>{d.mean_pct}%</strong> <span style={{ color: C.slate }}>(n={d.n})</span></li>)}</ul>
            </div>
          )}
          {(data.data_quality.stale_analyses > 0 || data.data_quality.unverified_findings > 0) && <p className="text-[11px] mt-3" style={{ color: '#92400e' }}>Data quality: {data.data_quality.stale_analyses} stale analyses, {data.data_quality.unverified_findings} unverified findings.</p>}
        </Card>
      </div>
    </>
  );
}
