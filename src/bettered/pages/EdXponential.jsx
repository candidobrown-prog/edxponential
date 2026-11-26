import React, { useState } from 'react';
import { ArrowRight, GraduationCap, Users, Sparkles, BookOpen } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

const TRACKS = [
  { icon: BookOpen, title: 'Courses', copy: 'On-demand and cohort courses on leadership, instruction, and school transformation.' },
  { icon: Users, title: 'Community', copy: 'A community of educators and school teams working through the same challenges together.' },
  { icon: Sparkles, title: 'AI Tools', copy: 'Practical, responsible AI tools and workflows built for school leaders and teachers.' },
  { icon: GraduationCap, title: 'Coaching', copy: 'Access to coaching support that extends beyond a single BetterEd engagement.' },
];

const PLANS = ['Individual Membership', 'School Team Plan', 'Enterprise / Network Plan'];

export default function EdXponential() {
  useDocumentTitle('edXponential', 'edXponential is BetterEd’s professional learning platform — courses, coaching, AI tools, and community for educators and school teams.');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'edXponential' }]} />
          <Eyebrow>BetterEd Ecosystem</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">edXponential</h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            A professional learning and growth platform for educators, leaders, executives, and school teams seeking
            accelerated improvement through coaching, artificial intelligence, community, practice, and
            implementation support.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {TRACKS.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="border border-bettered-lightgray rounded-xl p-6">
                <Icon className="h-6 w-6 text-bettered-orange mb-3" />
                <h3 className="font-bold mb-2">{t.title}</h3>
                <p className="text-sm text-bettered-charcoal/80">{t.copy}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-5">Plans</h2>
            <ul className="space-y-3 mb-8">
              {PLANS.map((p) => (
                <li key={p} className="flex items-center gap-3 border border-bettered-lightgray rounded-lg px-5 py-4 font-semibold text-bettered-ink">
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-sm text-bettered-midgray">
              edXponential membership, course enrollment, and pricing are launching soon. Join the waitlist to be
              notified first.
            </p>
          </div>

          <div className="rounded-2xl bg-bettered-offwhite p-8">
            {submitted ? (
              <div className="text-center py-6">
                <h3 className="text-xl font-black mb-2">You&rsquo;re on the list.</h3>
                <p className="text-bettered-charcoal/80">We&rsquo;ll be in touch as edXponential membership opens.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-black mb-1">Join the edXponential Waitlist</h3>
                <p className="text-sm text-bettered-midgray mb-4">Be first to know when membership opens.</p>
                <div>
                  <label htmlFor="edx-email" className="block text-sm font-semibold mb-1">Work Email</label>
                  <input
                    id="edx-email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-bettered-lightgray px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bettered-orange"
                  />
                </div>
                <BEButton type="submit" variant="dark" className="w-full justify-center">
                  Join the Waitlist <ArrowRight className="h-4 w-4" />
                </BEButton>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
