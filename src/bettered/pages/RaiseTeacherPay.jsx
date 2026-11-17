import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

const PILLARS = [
  { title: 'Compensation', copy: 'Advocating for teacher pay that reflects the complexity and importance of the work.' },
  { title: 'Professional Respect', copy: 'Treating teachers as the highly skilled professionals they are.' },
  { title: 'Retention', copy: 'Addressing the conditions that push experienced teachers out of the classroom.' },
  { title: 'Career Sustainability', copy: 'Building a profession educators can build a full career inside, not flee from.' },
];

export default function RaiseTeacherPay() {
  useDocumentTitle('Raise Teacher Pay Project', 'An advocacy initiative focused on increasing teacher compensation, professional respect, and long-term career sustainability.');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Raise Teacher Pay Project' }]} />
          <Eyebrow>BetterEd Ecosystem</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            The Raise Teacher Pay Project
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            An advocacy initiative focused on increasing teacher compensation, professional respect, and long-term
            career sustainability.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {PILLARS.map((p) => (
            <div key={p.title} className="border border-bettered-lightgray rounded-xl p-6">
              <h3 className="font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-bettered-charcoal/80">{p.copy}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mb-16">
          <h2 className="text-2xl font-black tracking-tight mb-4">Why This Matters</h2>
          <p className="text-bettered-charcoal/85 leading-relaxed mb-4">
            Teacher compensation and career sustainability sit at the center of nearly every challenge BetterEd
            diagnoses inside schools &mdash; talent vacancies, retention losses, and the loss of institutional
            knowledge that makes every other improvement effort harder to sustain.
          </p>
          <p className="text-bettered-charcoal/85 leading-relaxed">
            The Raise Teacher Pay Project exists to build public awareness, gather research, and advocate for
            policy and employer practices that treat teaching as the sustainable, well-compensated profession it
            should be.
          </p>
        </div>

        <div className="rounded-2xl bg-bettered-offwhite p-8 sm:p-10 grid sm:grid-cols-[1.2fr,1fr] gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Research, campaigns, and partner resources are launching soon.</h2>
            <p className="text-bettered-charcoal/80 leading-relaxed">
              Sign up below to be notified as the Raise Teacher Pay Project publishes research and advocacy
              resources.
            </p>
          </div>
          <div>
            {submitted ? (
              <p className="font-semibold text-bettered-ink">Thank you for supporting the Project.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <label htmlFor="rtp-email" className="sr-only">Email address</label>
                <input
                  id="rtp-email"
                  type="email"
                  required
                  placeholder="you@school.org"
                  className="flex-1 rounded-lg border border-bettered-lightgray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-bettered-orange"
                />
                <BEButton type="submit" variant="dark">
                  Notify Me <ArrowRight className="h-4 w-4" />
                </BEButton>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
