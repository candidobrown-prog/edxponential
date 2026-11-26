import React, { useId, useState } from 'react';
import { Brain, Heart, Zap, Workflow, Dumbbell, ShieldCheck, Layers, Users, Activity } from 'lucide-react';
import { BEButton } from './ui';

const SYSTEMS = [
  {
    key: 'leadership',
    icon: Brain,
    system: 'The Brain',
    title: 'Leadership',
    copy: 'Leadership establishes direction, interprets evidence, makes decisions, communicates priorities, and coordinates action.',
    cta: { label: 'Explore Executive Coaching', to: '/services/executive-coaching' },
  },
  {
    key: 'culture',
    icon: Heart,
    system: 'The Heart',
    title: 'Mission & Culture',
    copy: 'Mission and culture determine what the organization values, protects, rewards, and believes is possible for students.',
    cta: { label: 'Explore School Improvement', to: '/services/school-improvement' },
  },
  {
    key: 'communication',
    icon: Zap,
    system: 'The Nervous System',
    title: 'Communication',
    copy: 'Communication transmits information, expectations, feedback, decisions, urgency, and accountability throughout the organization.',
    cta: { label: 'Explore Strategic Planning', to: '/services/strategic-planning' },
  },
  {
    key: 'operations',
    icon: Workflow,
    system: 'The Circulatory System',
    title: 'Operations',
    copy: 'Operations move time, people, resources, information, materials, and support throughout the school.',
    cta: { label: 'Explore Facilities & Operations', to: '/services/facilities-operations' },
  },
  {
    key: 'teachers',
    icon: Dumbbell,
    system: 'The Muscles',
    title: 'Teachers',
    copy: 'Teachers convert plans, curriculum, leadership priorities, and resources into daily student experiences.',
    cta: { label: 'Explore Teacher Coaching', to: '/services/teacher-coaching' },
  },
  {
    key: 'accountability',
    icon: ShieldCheck,
    system: 'The Immune System',
    title: 'Accountability',
    copy: 'Accountability helps the organization identify breakdowns, respond to risk, protect standards, and prevent ineffective practice from becoming normalized.',
    cta: { label: 'Explore School Turnaround', to: '/services/school-turnaround' },
  },
  {
    key: 'talent',
    icon: Layers,
    system: 'The Skeletal System',
    title: 'Talent',
    copy: 'Talent provides the structural strength required for the organization to stand, move, grow, and remain stable.',
    cta: { label: 'Explore Talent Acquisition', to: '/services/talent-acquisition' },
  },
  {
    key: 'families',
    icon: Users,
    system: 'The Support System',
    title: 'Families & Community',
    copy: 'Families and communities provide trust, partnership, context, advocacy, and reinforcement.',
    cta: { label: 'Explore Enrollment Growth', to: '/services/enrollment-growth' },
  },
  {
    key: 'outcomes',
    icon: Activity,
    system: 'The Vital Signs',
    title: 'Student Outcomes',
    copy: 'Academic performance, attendance, engagement, culture, persistence, graduation, and postsecondary outcomes indicate the health and effectiveness of the system.',
    cta: { label: 'Take the School Health Index', to: '/school-health-index' },
  },
];

function nodePosition(index, total, radius) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
}

export default function AnatomyOfAHealthySchool() {
  const [activeKey, setActiveKey] = useState('leadership');
  const uid = useId();
  const active = SYSTEMS.find((s) => s.key === activeKey) || SYSTEMS[0];
  const radius = 40;

  return (
    <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 items-center">
      <div className="relative mx-auto w-full max-w-[520px] aspect-square">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {SYSTEMS.map((s, i) => {
            const { x, y } = nodePosition(i, SYSTEMS.length, radius);
            const isActive = s.key === activeKey;
            return (
              <line
                key={s.key}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke={isActive ? '#F97316' : '#E5E5E5'}
                strokeWidth={isActive ? 0.6 : 0.3}
                className="transition-all duration-300"
              />
            );
          })}
          <circle cx="50" cy="50" r="12" fill="#0B0B0C" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[24%] aspect-square rounded-full bg-bettered-ink flex items-center justify-center text-center">
            <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide leading-tight px-2">
              Your<br />School
            </span>
          </div>
        </div>

        {SYSTEMS.map((s, i) => {
          const { x, y } = nodePosition(i, SYSTEMS.length, radius);
          const isActive = s.key === activeKey;
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveKey(s.key)}
              onFocus={() => setActiveKey(s.key)}
              aria-pressed={isActive}
              aria-describedby={`${uid}-panel`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={`flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-bettered-orange border-bettered-orange text-black scale-110 shadow-lg'
                    : 'bg-white border-bettered-lightgray text-bettered-ink group-hover:border-bettered-orange'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span
                className={`text-[10px] sm:text-xs font-bold text-center leading-tight max-w-[72px] ${
                  isActive ? 'text-bettered-orange' : 'text-bettered-ink'
                }`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} className="bg-bettered-offwhite rounded-2xl p-6 sm:p-8" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-bettered-orange mb-2">{active.system}</p>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">{active.title}</h3>
        <p className="text-bettered-charcoal/80 leading-relaxed mb-6">{active.copy}</p>
        <BEButton to={active.cta.to} variant="dark">
          {active.cta.label}
        </BEButton>
      </div>
    </div>
  );
}
