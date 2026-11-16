import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ii } from '@/api/ii';
import { PageHeader, Card, State, Stat, Select, C } from '@/components/ii/ui';

export default function IITrends() {
  const { me } = useOutletContext();
  const [schoolId, setSchoolId] = useState(me.schools?.[0]?.id || ''); const [orgId, setOrgId] = useState(me.organizations?.[0]?.id || '');
  const { data: s, isLoading, error, dataUpdatedAt } = useQuery({ queryKey: ['ii-trend-school', schoolId], queryFn: () => ii.schoolTrends(schoolId), enabled: !!schoolId && me.capabilities.school_aggregates });
  const { data: d, error: dErr } = useQuery({ queryKey: ['ii-trend-district', orgId], queryFn: () => ii.districtTrends(orgId), enabled: !!orgId && me.capabilities.district_aggregates });
  return (<>
    <PageHeader title="Schoolwide & Districtwide Trends" subtitle="Aggregates only, with small-group suppression. Never used to compare or rank teachers." crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Trends' }]} freshness={dataUpdatedAt} />
    {me.capabilities.school_aggregates && (<section className="mb-6" aria-labelledby="school-h">
      <div className="flex items-center gap-3 mb-3"><h2 id="school-h" className="font-bold" style={{ color: C.navy }}>School</h2>{me.schools.length > 1 && <Select className="w-56 h-9" value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>{me.schools.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select>}</div>
      {isLoading ? <State kind="loading" title="Computing aggregates…" /> : error ? <State kind={error.status === 403 ? 'denied' : 'error'} title="Not available" detail={error.message} /> : !s ? null : s.suppressed ? <State kind="insufficient" title="Suppressed to protect identities" detail={`${s.reason} (${s.observation_count} observations, ${s.teachers} teacher(s)).`} /> : (<>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"><Stat label="Observations" value={s.observation_coverage.observations} sub={`${s.observation_coverage.teachers} teachers · ${s.observation_coverage.approved} approved`} /><Stat label="Mean student talk" value={s.student_talk_mean !== null ? `${s.student_talk_mean}%` : '–'} sub={`${s.n} reviewed analyses`} /><Stat label="Coaching follow-through" value={`${s.coaching_followthrough.closed}/${s.coaching_followthrough.plans}`} sub="plans closed" /><Stat label="Reassessments" value={`${s.reassessment.complete}/${s.reassessment.planned}`} sub="complete" /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="CFU-100 dimension trends (mean % of weight)">{Object.keys(s.cfu_dimensions).length === 0 ? <State kind="insufficient" title="No scored dimensions yet" /> : <ul className="space-y-1.5">{Object.values(s.cfu_dimensions).map((dm) => <li key={dm.label} className="text-sm"><div className="flex justify-between"><span>{dm.label}</span><span>{dm.mean_pct}% <span style={{ color: C.slate }}>(n={dm.n})</span></span></div><div className="h-1.5 rounded-full" style={{ background: C.mist }}><div className="h-full rounded-full" style={{ width: `${dm.mean_pct}%`, background: C.harbor }} /></div></li>)}</ul>}</Card>
          <Card title="Questioning rigour (DOK distribution)"><ul className="space-y-1.5">{s.dok_distribution.map((x) => { const tot = s.dok_distribution.reduce((a, b) => a + b.count, 0) || 1; return <li key={x.level} className="text-sm"><div className="flex justify-between"><span>DOK {x.level}</span><span>{x.count}</span></div><div className="h-1.5 rounded-full" style={{ background: C.mist }}><div className="h-full rounded-full" style={{ width: `${x.count / tot * 100}%`, background: C.navy }} /></div></li>; })}</ul><p className="text-[11px] mt-2" style={{ color: C.slate }}>Data quality: {s.data_quality.stale} stale analyses excluded. {s.note}</p></Card>
        </div></>)}
    </section>)}
    {me.capabilities.district_aggregates && (<section aria-labelledby="district-h"><h2 id="district-h" className="font-bold mb-3" style={{ color: C.navy }}>District</h2>
      {dErr ? <State kind="error" title="Not available" detail={dErr.message} /> : !d ? <State kind="loading" title="Loading…" /> : <Card><table className="w-full text-sm"><thead><tr className="text-left text-xs" style={{ color: C.slate }}><th>School</th><th>Observations</th><th>Teachers</th><th>Mean student talk</th><th>Analyses</th></tr></thead><tbody>{d.schools.map((x) => <tr key={x.school.id} className="border-t" style={{ borderColor: C.mist }}><td className="py-1.5">{x.school.name}</td><td>{x.observations}</td><td>{x.suppressed ? <em style={{ color: C.slate }}>suppressed</em> : x.teachers}</td><td>{x.suppressed ? '–' : x.student_talk_mean !== null ? `${x.student_talk_mean}%` : '–'}</td><td>{x.suppressed ? '–' : x.n}</td></tr>)}</tbody></table></Card>}
    </section>)}
  </>);
}
