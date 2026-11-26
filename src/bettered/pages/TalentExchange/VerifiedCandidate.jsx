import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs, Disclaimer } from '@/bettered/components/ui';

const STEPS = [
  { title: 'Identity Verification', copy: 'Confirming you are who you say you are.' },
  { title: 'Resume & Credential Review', copy: 'BetterEd reviews your resume, certifications, and licenses for completeness and accuracy.' },
  { title: 'Reference Checks', copy: 'Prior supervisors or colleagues confirm your work history and performance.' },
  { title: 'Instructional or Leadership Assessment', copy: 'A structured review of your instructional practice or leadership experience, matched to your role.' },
  { title: 'Interview', copy: 'A conversation with a BetterEd team member about your experience, goals, and fit.' },
];

export default function VerifiedCandidate() {
  useDocumentTitle('Become a BetterEd Verified Candidate', 'Build a profile and pursue BetterEd Verified Candidate status to stand out to schools hiring through the Talent Exchange.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Talent Exchange', to: '/talent-exchange' }, { label: 'Verified Candidate' }]} />
          <Eyebrow>For Educators</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">
            Become a BetterEd Verified Candidate.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            A structured verification process that helps schools trust what they see &mdash; and helps you stand out
            in the BetterEd Talent Exchange&trade;.
          </p>
          <div className="mt-8">
            <BEButton to="/contact?intent=talent-exchange-candidate" variant="primary">
              Start Verification <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <h2 className="text-2xl font-black tracking-tight mb-8">What Verification Includes</h2>
        <ol className="space-y-4 max-w-2xl mb-12">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span className="h-9 w-9 rounded-full bg-bettered-orange text-black font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-bettered-ink">{s.title}</p>
                <p className="text-sm text-bettered-charcoal/80">{s.copy}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex items-start gap-3 rounded-xl border border-bettered-lightgray p-5 max-w-2xl mb-10">
          <ShieldCheck className="h-5 w-5 text-bettered-orange shrink-0 mt-0.5" />
          <p className="text-sm text-bettered-charcoal/80">
            Verified status is displayed with the date it was completed, and expires after a period set by BetterEd.
            A badge is only ever shown once the underlying checks are actually complete.
          </p>
        </div>

        <Disclaimer className="max-w-2xl mb-12">
          Verification requirements vary by role and may include background-check status where applicable. BetterEd
          will never represent a check as complete before it has actually occurred.
        </Disclaimer>

        <div className="rounded-2xl bg-bettered-offwhite p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Ready to get started?</h2>
          <BEButton to="/contact?intent=talent-exchange-candidate" variant="dark">
            Start Verification
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
