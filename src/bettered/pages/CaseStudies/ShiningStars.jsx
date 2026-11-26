import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs, Disclaimer } from '@/bettered/components/ui';

const PHOTOS = [
  'School exterior',
  'Summer Institute',
  'Teacher coaching',
  'Leadership team meeting',
  'Parent event',
  'Facilities improvements',
  'Students learning',
  'BetterEd team on campus',
];

function Block({ title, children }) {
  return (
    <div className="py-8 border-b border-bettered-lightgray">
      <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function ShiningStars() {
  useDocumentTitle(
    'Shining Stars Montessori Academy Case Study',
    'BetterEd’s flagship transformation partnership with Shining Stars Montessori Academy Public Charter School.'
  );

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Case Studies', to: '/case-studies' }, { label: 'Shining Stars Montessori' }]} />
          <Eyebrow>Flagship Transformation</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">
            Shining Stars Montessori Academy Public Charter School
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            A multi-year BetterEd transformation partnership spanning leadership coaching, teacher development,
            enrollment strategy, staffing, facilities, curriculum, and culture.
          </p>
        </Container>
      </div>

      <Container className="py-4">
        <div className="mb-10">
          <Disclaimer>
            This case study is in BetterEd&rsquo;s internal approval process. Quantitative outcomes, dates, and
            direct quotes are published only once verified by the partner school and approved by BetterEd. Sections
            below marked as pending will be updated as that evidence is confirmed.
          </Disclaimer>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-12">
          <div>
            <Block title="Organization & Context">
              <p className="text-bettered-charcoal/85 leading-relaxed">
                Shining Stars Montessori Academy is a public charter school serving students through a Montessori
                instructional model. BetterEd was engaged to support a comprehensive transformation across
                leadership, instruction, enrollment, and operations.
              </p>
            </Block>
            <Block title="Starting Condition & Urgency">
              <p className="text-bettered-charcoal/85 leading-relaxed">
                Specific baseline enrollment, achievement, and staffing figures for the starting condition are
                pending verification and will be published once confirmed by the school.
              </p>
            </Block>
            <Block title="Diagnostic Process">
              <p className="text-bettered-charcoal/85 leading-relaxed">
                BetterEd&rsquo;s engagement began with a full organizational diagnosis across leadership, culture,
                instruction, talent, enrollment, operations, and facilities &mdash; the same approach formalized in
                the BetterEd School Health Index&trade;.
              </p>
            </Block>
            <Block title="BetterEd Intervention">
              <ul className="space-y-2.5 text-bettered-charcoal/85">
                <li>Leadership coaching for the school’s administrative team</li>
                <li>Teacher coaching and professional development, including a Summer Institute</li>
                <li>Enrollment strategy and family engagement support</li>
                <li>Staffing and talent support</li>
                <li>Facilities improvement planning</li>
                <li>Curriculum alignment within the Montessori instructional model</li>
                <li>Culture and community-building initiatives, including parent events</li>
              </ul>
            </Block>
            <Block title="Quantitative & Qualitative Outcomes">
              <p className="text-bettered-charcoal/85 leading-relaxed">
                Verified outcome data and client reflections will be published here once BetterEd and Shining Stars
                Montessori Academy complete the case study approval process.
              </p>
            </Block>
            <Block title="Photography & Artifacts">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PHOTOS.map((p) => (
                  <div
                    key={p}
                    className="aspect-square rounded-lg bg-bettered-offwhite border border-bettered-lightgray flex items-center justify-center text-center text-[11px] font-semibold text-bettered-midgray p-2"
                  >
                    [PHOTO: {p}]
                  </div>
                ))}
              </div>
            </Block>
          </div>

          <aside className="lg:py-8">
            <div className="rounded-xl border border-bettered-lightgray p-6 sticky top-24">
              <h3 className="font-bold mb-3">Related Services</h3>
              <ul className="space-y-2 mb-6">
                {['school-improvement', 'enrollment-growth', 'teacher-coaching'].map((slug) => (
                  <li key={slug}>
                    <BEButton to={`/services/${slug}`} variant="ghost" className="!px-0 !justify-start !normal-case !font-semibold">
                      View Service
                    </BEButton>
                  </li>
                ))}
              </ul>
              <BEButton to="/contact?intent=strategic-consultation" variant="primary" className="w-full justify-center">
                Start Your Own Diagnosis <ArrowRight className="h-4 w-4" />
              </BEButton>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
