import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

const OPTIONS = [
  { title: 'Candidate Sourcing', copy: 'BetterEd actively sources and screens candidates matched to your open role, your mission, and your culture.' },
  { title: 'Full-Service Recruitment', copy: 'End-to-end support from job posting through offer: sourcing, screening, interview coordination, and reference checks.' },
  { title: 'Executive Search', copy: 'Dedicated search support for superintendent, head of school, and senior leadership roles.' },
  { title: 'Talent Pipeline Partnership', copy: 'Ongoing access to BetterEd’s candidate network for schools hiring multiple roles across the year.' },
];

export default function TalentExchangeEmployers() {
  useDocumentTitle('Talent Exchange for Employers', 'Post roles, request candidate sourcing, and access BetterEd Verified Candidates through the BetterEd Talent Exchange™.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Talent Exchange', to: '/talent-exchange' }, { label: 'Employers' }]} />
          <Eyebrow>For Schools &amp; Employers</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">
            Find exceptional talent, faster.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            From a single classroom vacancy to a superintendent search, BetterEd combines recruiting expertise with
            a network of assessed and verified educators.
          </p>
          <div className="mt-8">
            <BEButton to="/contact?intent=talent-exchange-employer" variant="primary">
              Request Talent Support <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <h2 className="text-2xl font-black tracking-tight mb-8">How Schools Work With BetterEd</h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {OPTIONS.map((o) => (
            <div key={o.title} className="border border-bettered-lightgray rounded-xl p-6">
              <CheckCircle2 className="h-5 w-5 text-bettered-orange mb-3" />
              <h3 className="font-bold text-lg mb-2">{o.title}</h3>
              <p className="text-sm text-bettered-charcoal/80">{o.copy}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-bettered-offwhite p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Tell us about the role you&rsquo;re filling.</h2>
          <p className="text-bettered-charcoal/80 max-w-xl mx-auto mb-6">
            Share a few details and a BetterEd recruiter will follow up to scope the right level of support.
          </p>
          <BEButton to="/contact?intent=talent-exchange-employer" variant="dark">
            Start a Talent Request
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
