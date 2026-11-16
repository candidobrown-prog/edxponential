import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ii } from '@/api/ii';
import { PageHeader, Card, State, Btn, Select, C } from '@/components/ii/ui';
import { StatusPill } from './IIDashboard';

export default function IIObservations() {
  const { me } = useOutletContext();
  const [status, setStatus] = useState(''); const [school, setSchool] = useState('');
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['ii-observations', status, school], queryFn: () => ii.observations({ status, school_id: school }) });
  return (
    <>
      <PageHeader title="Classroom Observations" subtitle="Every observation you own, are assigned to, or that has been shared with you." crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Observations' }]} actions={me.capabilities.create_observation && <Btn as={Link} to="/ii/observations/new">New observation</Btn>} />
      <div className="flex flex-wrap gap-2 mb-4">
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-48"><option value="">All statuses</option>{['draft', 'setup', 'recording', 'recorded', 'review', 'analyzed', 'approved', 'archived'].map((s) => <option key={s}>{s}</option>)}</Select>
        {me.schools?.length > 1 && <Select aria-label="Filter by school" value={school} onChange={(e) => setSchool(e.target.value)} className="w-56"><option value="">All schools</option>{me.schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>}
      </div>
      {isLoading ? <State kind="loading" title="Loading observations…" /> : error ? <State kind="error" title="Could not load observations" detail={error.message} action={<Btn size="sm" variant="secondary" onClick={() => refetch()}>Retry</Btn>} /> : data.length === 0 ? (
        <State kind="empty" title="No observations" detail={status ? 'Nothing matches this filter.' : me.capabilities.create_observation ? 'Create your first observation to begin.' : 'Observations appear once a coach shares one with you.'} />
      ) : (
        <Card>
          <table className="w-full text-sm"><caption className="sr-only">Observations</caption>
            <thead><tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: C.slate }}><th className="py-2">Teacher</th><th>Subject / Grade</th><th>Standard</th><th>Date</th><th>Status</th><th><span className="sr-only">Open</span></th></tr></thead>
            <tbody>{data.map((o) => (<tr key={o.id} className="border-t" style={{ borderColor: C.mist }}><td className="py-2.5 font-semibold" style={{ color: C.navy }}>{o.teacher_name || o.teacher_email}</td><td>{o.subject || '–'} {o.grade ? `· Gr ${o.grade}` : ''}</td><td className="max-w-[12rem] truncate" title={o.standard}>{o.standard || '–'}</td><td>{o.date || new Date(o.created_date).toLocaleDateString()}</td><td><StatusPill status={o.status} /></td><td className="text-right"><Link to={`/ii/observations/${o.id}`} className="font-semibold text-xs" style={{ color: C.harbor }}>Open</Link></td></tr>))}</tbody>
          </table>
        </Card>
      )}
    </>
  );
}
