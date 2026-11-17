import React from 'react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';
import { vitamins } from '@/bettered/data/vitamins';
import { getServiceBySlug } from '@/bettered/data/services';

export default function Vitamins() {
  useDocumentTitle('The BetterEd Vitamins™', 'The eight daily disciplines that keep a school transformation healthy, honest, rigorous, and focused on results.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'BetterEd Vitamins' }]} />
          <Eyebrow>The BetterEd Vitamins&trade;</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">
            The daily disciplines that make schools better.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            Transformation is not produced by a single event. It is built through the daily disciplines that keep an
            organization healthy, honest, rigorous, reflective, and focused on results.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="space-y-6">
          {vitamins.map((v) => {
            const relatedServices = (v.services || []).map((s) => getServiceBySlug(s)).filter(Boolean);
            return (
              <div key={v.code} className="border border-bettered-lightgray rounded-2xl p-7 sm:p-8 grid sm:grid-cols-[auto,1fr] gap-6">
                <div className="flex sm:flex-col items-center sm:items-start gap-3">
                  <span className="h-14 w-14 rounded-full bg-bettered-orange text-black font-black text-lg flex items-center justify-center shrink-0">
                    {v.code}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">{v.name}</h2>
                  <p className="font-semibold text-bettered-orange mb-3">{v.statement}</p>
                  <p className="text-bettered-charcoal/80 leading-relaxed mb-4">{v.body}</p>
                  {relatedServices.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {relatedServices.map((s) => (
                        <BEButton key={s.slug} to={`/services/${s.slug}`} variant="ghost" className="!px-3 !py-1.5 !text-xs border border-bettered-lightgray rounded-full !font-semibold">
                          {s.name}
                        </BEButton>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 rounded-2xl bg-bettered-offwhite p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">See the Vitamins in practice.</h2>
          <BEButton to="/case-studies/shining-stars-montessori" variant="dark">
            Read the Case Study
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
