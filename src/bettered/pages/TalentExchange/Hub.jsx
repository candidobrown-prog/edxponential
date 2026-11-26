import React from 'react';
import { ArrowRight, ShieldCheck, Search, UserCheck, Building2 } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

export default function TalentExchangeHub() {
  useDocumentTitle('Talent Exchange', 'The BetterEd Talent Exchange™ connects schools with assessed, developed, and verified education talent.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Talent Exchange' }]} />
          <Eyebrow>BetterEd Talent Exchange&trade;</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            Great schools require great people.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            A premium educator talent marketplace and staffing-intelligence platform &mdash; not a generic job board.
            The Talent Exchange connects schools with candidates who have been assessed, developed, and in many
            cases, BetterEd-verified.
          </p>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="border border-bettered-lightgray rounded-2xl p-8">
            <Building2 className="h-8 w-8 text-bettered-orange mb-4" />
            <h2 className="text-2xl font-black tracking-tight mb-3">For Schools &amp; Employers</h2>
            <p className="text-bettered-charcoal/80 mb-6 leading-relaxed">
              Post roles, request sourcing support, and tap into BetterEd&rsquo;s recruiting bench &mdash; from a
              single classroom hire to a full executive search.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-bettered-charcoal/80">
              <li className="flex items-center gap-2"><Search className="h-4 w-4 text-bettered-orange" /> Candidate sourcing &amp; executive search</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-bettered-orange" /> Access to BetterEd Verified Candidates</li>
              <li className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-bettered-orange" /> Hiring systems and onboarding support</li>
            </ul>
            <BEButton to="/talent-exchange/employers" variant="dark" className="w-full justify-center">
              Find Exceptional Talent <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>

          <div className="border border-bettered-lightgray rounded-2xl p-8">
            <UserCheck className="h-8 w-8 text-bettered-orange mb-4" />
            <h2 className="text-2xl font-black tracking-tight mb-3">For Educators</h2>
            <p className="text-bettered-charcoal/80 mb-6 leading-relaxed">
              Build a profile, get resume and interview support, and pursue BetterEd Verified Candidate status to
              stand out to the schools that need you most.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-bettered-charcoal/80">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-bettered-orange" /> BetterEd Verified Candidate badge</li>
              <li className="flex items-center gap-2"><Search className="h-4 w-4 text-bettered-orange" /> Resume review &amp; interview coaching</li>
              <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-bettered-orange" /> Connections to vetted schools and networks</li>
            </ul>
            <BEButton to="/talent-exchange/verified-candidate" variant="dark" className="w-full justify-center">
              Become a Verified Candidate <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-bettered-offwhite p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Need talent support as part of a transformation plan?</h2>
          <p className="text-bettered-charcoal/80 max-w-2xl mx-auto mb-6">
            Talent Acquisition is one of BetterEd&rsquo;s sixteen core services, built to work alongside leadership
            coaching, culture systems, and school improvement.
          </p>
          <BEButton to="/services/talent-acquisition" variant="outline">
            Explore Talent Acquisition Services
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
