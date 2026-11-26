import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

export default function Team() {
  useDocumentTitle('Team', 'The people behind BetterEd Solutions.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Team' }]} />
          <Eyebrow>Team</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            The people behind BetterEd.
          </h1>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-2xl border border-bettered-lightgray rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="h-28 w-28 rounded-full bg-bettered-offwhite border border-bettered-lightgray flex items-center justify-center text-bettered-midgray text-xs font-semibold shrink-0">
            [PHOTO]
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Candido Brown</h2>
            <p className="text-bettered-orange font-semibold mb-3">Founder &amp; CEO</p>
            <p className="text-bettered-charcoal/80 leading-relaxed mb-4">
              Candido founded BetterEd Solutions in Baltimore in 2017 after a career in classroom teaching, school
              and network leadership, and executive coaching &mdash; including time with Success Academy, and
              education studies at Johns Hopkins University and the Harvard Graduate School of Education.
            </p>
            <BEButton to="/about/candido-brown" variant="outline">
              Read Candido&rsquo;s Full Story
            </BEButton>
          </div>
        </div>

        <div className="mt-10 max-w-2xl rounded-2xl bg-bettered-offwhite p-8">
          <h2 className="text-xl font-black tracking-tight mb-2">BetterEd is growing.</h2>
          <p className="text-bettered-charcoal/80">
            Additional team profiles will be published here as BetterEd&rsquo;s coaching, recruiting, and
            advancement bench grows. Interested in joining BetterEd?{' '}
            <Link to="/contact?intent=careers" className="text-bettered-orange font-semibold hover:underline">
              Get in touch.
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
