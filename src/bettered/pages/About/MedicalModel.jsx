import React from 'react';
import { ClipboardList, Microscope, Stethoscope, Activity, RefreshCw, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

const STAGES = [
  { icon: ClipboardList, title: 'History', copy: 'We gather the full organizational history: prior improvement efforts, leadership changes, and the context behind current conditions.' },
  { icon: Microscope, title: 'Examination', copy: 'We examine evidence directly — data, documents, classrooms, and conversations with staff, leaders, and families.' },
  { icon: Stethoscope, title: 'Diagnosis', copy: 'We identify the root causes behind visible symptoms, not just the symptoms themselves.' },
  { icon: Activity, title: 'Prescription', copy: 'We build a sequenced transformation plan matched to what the diagnosis actually shows.' },
  { icon: RefreshCw, title: 'Treatment', copy: 'We implement alongside your team through embedded coaching, not a report that sits on a shelf.' },
  { icon: TrendingUp, title: 'Monitoring', copy: 'We track progress on a regular, predictable cadence and share it transparently with leadership.' },
  { icon: Sparkles, title: 'Adjustment', copy: 'When something isn’t working, we say so and adjust the plan — rather than waiting for a scheduled review.' },
  { icon: ShieldCheck, title: 'Recovery', copy: 'We support the organization through to measurable, durable improvement, not a temporary bounce.' },
  { icon: ShieldCheck, title: 'Prevention', copy: 'We help build the systems that catch future breakdowns early, so progress holds after the engagement ends.' },
];

export default function MedicalModel() {
  useDocumentTitle('The BetterEd Medical Model', 'Why BetterEd applies the discipline of medicine — history, diagnosis, treatment, and monitoring — to school transformation.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Medical Model' }]} />
          <Eyebrow>The BetterEd Medical Model</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">
            Schools deserve the same rigor as medicine.
          </h1>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-3xl space-y-5 text-lg text-bettered-charcoal/85 leading-relaxed mb-14">
          <p>
            BetterEd was inspired by the discipline of medicine. When a patient is struggling, responsible
            practitioners do not simply blame the patient. They gather a history, examine the evidence, identify
            symptoms, conduct tests, diagnose the underlying condition, consult specialists, prescribe an
            intervention, support treatment, monitor the response, adjust the intervention, support recovery, and
            prevent recurrence.
          </p>
          <p>Schools deserve the same level of rigor.</p>
          <p>
            When students struggle, schools are often given another program, another training session, another
            report, or another temporary intervention. BetterEd begins differently.
          </p>
          <p className="font-black text-bettered-ink text-2xl">BetterEd diagnoses before prescribing.</p>
        </div>

        <div className="rounded-2xl bg-bettered-offwhite p-8 sm:p-10 mb-14">
          <p className="text-xl sm:text-2xl font-black tracking-tight mb-3">
            BetterEd was not created to advise schools. It was created to transform them.
          </p>
          <p className="text-bettered-charcoal/80 leading-relaxed">
            Schools need more than advice. They need expert practitioners who can diagnose root causes, prescribe
            the right plan, implement with urgency, monitor progress, and build systems that last.
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10">The Nine Stages</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="border border-bettered-lightgray rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-9 w-9 rounded-full bg-bettered-ink text-white flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-bettered-ink">{i + 1}. {s.title}</span>
                </div>
                <p className="text-sm text-bettered-charcoal/80 leading-relaxed">{s.copy}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl bg-bettered-ink text-white p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">See where your school stands today.</h2>
          <BEButton to="/school-health-index/start" variant="primary">
            Take the School Health Index
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
