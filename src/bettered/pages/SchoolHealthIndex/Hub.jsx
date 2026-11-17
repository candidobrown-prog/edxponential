import React from 'react';
import { ArrowRight, Brain, Heart, Dumbbell, Activity, Layers, Workflow, Coins, Building2, Users, ShieldCheck, Zap } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Disclaimer } from '@/bettered/components/ui';
import { DOMAINS, CLASSIFICATIONS } from '@/bettered/data/healthIndex';

const ICONS = {
  leadership: Brain,
  culture: Heart,
  instruction: Dumbbell,
  achievement: Activity,
  talent: Layers,
  enrollment: Workflow,
  operations: Workflow,
  financial: Coins,
  facilities: Building2,
  family: Users,
  specialed: ShieldCheck,
  strategy: Zap,
};

export default function SchoolHealthIndexHub() {
  useDocumentTitle('School Health Index', 'The BetterEd School Health Index™ — a 12-domain diagnostic that gives school leaders a preliminary health score, risks, and recommended next steps.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-24">
          <Eyebrow>The Diagnostic</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            The BetterEd School Health Index&trade;
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            A guided, evidence-based diagnostic across twelve organizational health domains. In about fifteen
            minutes, get a preliminary School Health Score, your top strengths and risks, and recommended next
            steps.
          </p>
          <div className="mt-8">
            <BEButton to="/school-health-index/start" variant="primary">
              Take the School Health Index <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10">Twelve Domains of School Health</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {DOMAINS.map((d) => {
            const Icon = ICONS[d.key] || Activity;
            return (
              <div key={d.key} className="border border-bettered-lightgray rounded-xl p-5 flex items-start gap-3">
                <span className="h-10 w-10 rounded-full bg-bettered-offwhite flex items-center justify-center text-bettered-orange shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-bettered-ink leading-snug">{d.name}</p>
                  <p className="text-xs text-bettered-midgray">{d.system}</p>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">How Scoring Works</h2>
        <p className="text-bettered-charcoal/80 max-w-2xl mb-8 leading-relaxed">
          Each domain receives a score from 0 to 100, averaged into an overall School Health Score. A school may
          also receive an &ldquo;Intervention Required&rdquo; flag if any essential domain falls below a critical
          minimum &mdash; even when the overall average looks acceptable.
        </p>
        <div className="grid sm:grid-cols-5 gap-3 mb-10">
          {CLASSIFICATIONS.map((c) => (
            <div key={c.label} className="border border-bettered-lightgray rounded-lg p-4">
              <p className="text-xs font-bold text-bettered-orange mb-1">{c.min}&ndash;{c.max}</p>
              <p className="font-bold text-sm text-bettered-ink mb-1">{c.label}</p>
              <p className="text-xs text-bettered-midgray leading-snug">{c.description}</p>
            </div>
          ))}
        </div>

        <Disclaimer className="mb-12 max-w-2xl">
          The BetterEd School Health Snapshot is a preliminary organizational assessment based on the information
          submitted. Final findings and recommendations require review by BetterEd professionals and may require
          interviews, observations, document review, or additional evidence.
        </Disclaimer>

        <div className="rounded-2xl bg-bettered-offwhite p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">Ready to see your score?</h2>
          <p className="text-bettered-charcoal/80 max-w-xl mx-auto mb-6">
            Takes about fifteen minutes. You can save your progress and come back.
          </p>
          <BEButton to="/school-health-index/start" variant="dark">
            Take the School Health Index <ArrowRight className="h-4 w-4" />
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
