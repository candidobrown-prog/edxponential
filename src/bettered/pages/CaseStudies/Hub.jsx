import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

export default function CaseStudiesHub() {
  useDocumentTitle('Case Studies', 'How BetterEd Solutions partners with schools to diagnose root causes and drive measurable transformation.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Case Studies' }]} />
          <Eyebrow>Case Studies</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            Transformation, documented.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            Every BetterEd case study goes through an internal approval process before publication. We do not
            publish results, quotes, or data that have not been verified by the partner school.
          </p>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <div className="border border-bettered-lightgray rounded-2xl overflow-hidden grid lg:grid-cols-2">
          <div className="aspect-[4/3] lg:aspect-auto bg-bettered-lightgray flex items-center justify-center text-bettered-midgray text-sm font-semibold">
            [PHOTO: School exterior]
          </div>
          <div className="p-8 sm:p-10 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wide text-bettered-orange mb-2">Flagship Transformation</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
              Shining Stars Montessori Academy Public Charter School
            </h2>
            <p className="text-bettered-charcoal/80 mb-6 flex-1">
              A multi-year partnership spanning leadership coaching, teacher development, enrollment strategy,
              staffing, facilities, curriculum, and culture.
            </p>
            <BEButton to="/case-studies/shining-stars-montessori" variant="dark" className="self-start">
              Read the Case Study <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-bettered-offwhite p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">More case studies are in review.</h2>
          <p className="text-bettered-charcoal/80 max-w-xl mx-auto">
            Additional partner stories will be published here as they complete BetterEd&rsquo;s verification and
            approval process.
          </p>
        </div>
      </Container>
    </div>
  );
}
