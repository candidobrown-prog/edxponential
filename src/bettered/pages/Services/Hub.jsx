import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';
import { services } from '@/bettered/data/services';

export default function ServicesHub() {
  useDocumentTitle('Services', 'Sixteen integrated services spanning leadership, instruction, talent, capital, and operations — all built on BetterEd’s diagnostic methodology.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            Every critical system, under one firm.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            BetterEd doesn&rsquo;t hand schools a single fix. We diagnose across leadership, instruction, talent,
            enrollment, capital, and operations &mdash; then build the integrated plan that addresses root causes,
            not symptoms.
          </p>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => (
            <BEButton
              key={svc.slug}
              to={`/services/${svc.slug}`}
              variant="ghost"
              className="!justify-start !normal-case !font-normal border border-bettered-lightgray rounded-xl p-6 text-left hover:border-bettered-orange block h-full"
            >
              <span className="block h-full flex flex-col">
                <span className="block font-bold text-bettered-ink text-lg mb-2 leading-snug">{svc.name}</span>
                <span className="block text-sm text-bettered-midgray flex-1">{svc.short}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-bettered-orange">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </BEButton>
          ))}
        </div>
      </Container>
    </div>
  );
}
