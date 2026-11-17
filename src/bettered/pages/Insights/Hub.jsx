import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';
import { articles } from '@/bettered/data/articles';

const CATEGORIES = [
  'School Turnaround', 'Leadership', 'Instruction', 'Classroom Management', 'Enrollment', 'Talent',
  'AI in Education', 'Capital & Fundraising', 'Teacher Pay', 'School Culture', 'Strategic Planning',
  'Special Education', 'Facilities', 'Governance',
];

export default function InsightsHub() {
  useDocumentTitle('Insights', 'BetterEd Insights: field notes on school turnaround, leadership, instruction, talent, AI, and strategic planning.');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Insights' }]} />
          <Eyebrow>BetterEd Insights</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            Field notes on school transformation.
          </h1>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((c) => (
            <span key={c} className="rounded-full border border-bettered-lightgray px-3.5 py-1.5 text-xs font-semibold text-bettered-charcoal">
              {c}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {articles.map((a) => (
            <BEButton
              key={a.slug}
              to={`/insights/${a.slug}`}
              variant="ghost"
              className="!justify-start !normal-case !font-normal border border-bettered-lightgray rounded-xl p-6 text-left block h-full hover:border-bettered-orange"
            >
              <span className="block h-full flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wide text-bettered-orange mb-3">{a.category}</span>
                <span className="block font-bold text-lg text-bettered-ink leading-snug mb-2">{a.title}</span>
                <span className="block text-sm text-bettered-midgray flex-1">{a.subtitle}</span>
                <span className="mt-4 text-xs font-semibold text-bettered-midgray">{a.author} &middot; {a.readingTime}</span>
              </span>
            </BEButton>
          ))}
        </div>

        <div className="rounded-2xl bg-bettered-offwhite p-8 sm:p-10 grid sm:grid-cols-[1.2fr,1fr] gap-8 items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Get new Insights by email.</h2>
            <p className="text-bettered-charcoal/80">New essays on school transformation, leadership, and talent.</p>
          </div>
          <div>
            {subscribed ? (
              <p className="font-semibold text-bettered-ink">Subscribed. Thank you.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <label htmlFor="insights-email" className="sr-only">Email address</label>
                <input
                  id="insights-email"
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
