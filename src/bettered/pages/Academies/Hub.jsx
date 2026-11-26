import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Pill, Breadcrumbs } from '@/bettered/components/ui';
import { academies } from '@/bettered/data/academies';

export default function AcademiesHub() {
  useDocumentTitle('BetterEd Academies', 'Cohort-based professional development for principals, coaches, teachers, and founding teams — built on BetterEd’s own methodology.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Academies' }]} />
          <Eyebrow>BetterEd Academies</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            Professional development that changes practice.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            Cohort-based, coached, and practice-driven &mdash; not a one-day workshop. Every academy is built on the
            same methodology BetterEd uses inside full transformation engagements.
          </p>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 gap-6">
          {academies.map((a) => (
            <div key={a.slug} className="border border-bettered-lightgray rounded-2xl p-7 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                <Pill>{a.format}</Pill>
                <Pill>{a.duration}</Pill>
              </div>
              <h2 className="text-xl font-black tracking-tight mb-2">{a.name}</h2>
              <p className="text-bettered-midgray text-sm mb-1 font-semibold">{a.audience}</p>
              <p className="text-bettered-charcoal/80 mb-5 flex-1">{a.headline}</p>
              <div className="flex items-center justify-between pt-4 border-t border-bettered-lightgray">
                <span className="font-bold text-bettered-ink">{a.price}</span>
                <BEButton to={`/academies/${a.slug}`} variant="dark">
                  View Program <ArrowRight className="h-4 w-4" />
                </BEButton>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
