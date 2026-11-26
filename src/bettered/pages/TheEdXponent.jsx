import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

const CATEGORIES = [
  'School Improvement',
  'Education Leadership',
  'Innovation',
  'Policy',
  'Artificial Intelligence',
  'Teacher Excellence',
  'School Culture',
  'Talent',
  'Teacher Pay',
  'The Future of Learning',
];

export default function TheEdXponent() {
  useDocumentTitle('The EdXponent', 'The EdXponent is BetterEd’s publication covering school improvement, leadership, innovation, policy, AI, and teacher excellence.');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'The EdXponent' }]} />
          <Eyebrow>BetterEd Ecosystem</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">The EdXponent</h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            BetterEd&rsquo;s publication covering school improvement, education leadership, innovation, policy,
            artificial intelligence, teacher excellence, school culture, talent, teacher pay, and the future of
            learning.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <h2 className="text-2xl font-black tracking-tight mb-6">Coverage Areas</h2>
        <div className="flex flex-wrap gap-2 mb-16">
          {CATEGORIES.map((c) => (
            <span key={c} className="rounded-full border border-bettered-lightgray px-4 py-2 text-sm font-semibold text-bettered-charcoal">
              {c}
            </span>
          ))}
        </div>

        <div className="rounded-2xl bg-bettered-offwhite p-8 sm:p-10 grid sm:grid-cols-[1.2fr,1fr] gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">The EdXponent is launching soon.</h2>
            <p className="text-bettered-charcoal/80 leading-relaxed">
              In the meantime, read original field notes from BetterEd&rsquo;s team on{' '}
              <BEButton to="/insights" variant="ghost" className="!px-0 !inline !font-semibold !normal-case underline">
                BetterEd Insights
              </BEButton>
              .
            </p>
          </div>
          <div>
            {submitted ? (
              <p className="font-semibold text-bettered-ink">You&rsquo;re subscribed. Thank you.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <label htmlFor="edxponent-email" className="sr-only">Email address</label>
                <input
                  id="edxponent-email"
                  type="email"
                  required
                  placeholder="you@school.org"
                  className="flex-1 rounded-lg border border-bettered-lightgray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-bettered-orange"
                />
                <BEButton type="submit" variant="dark">
                  Subscribe <ArrowRight className="h-4 w-4" />
                </BEButton>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
