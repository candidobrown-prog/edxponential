import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

const LINKS = [
  { to: '/about/medical-model', title: 'The BetterEd Medical Model', copy: 'Why BetterEd diagnoses before it prescribes.' },
  { to: '/about/bettered-vitamins', title: 'The BetterEd Vitamins™', copy: 'The eight daily disciplines behind every engagement.' },
  { to: '/about/candido-brown', title: 'Candido Brown’s Story', copy: 'The founder’s path from Baltimore classrooms to BetterEd.' },
  { to: '/about/team', title: 'Team', copy: 'The people behind BetterEd Solutions.' },
];

export default function AboutHub() {
  useDocumentTitle('About', 'BetterEd Solutions is a School Growth, Transformation & Investment Firm founded in Baltimore in 2017 by Candido Brown.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <Eyebrow>About BetterEd</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            Not created to advise schools. Created to transform them.
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">
            BetterEd Solutions is a School Growth, Transformation &amp; Investment Firm founded in Baltimore in 2017
            by Candido Brown.
          </p>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl mb-14">
          <p className="text-lg text-bettered-charcoal/85 leading-relaxed">
            BetterEd is more than a consulting firm. BetterEd is a comprehensive school-growth and transformation
            partner that diagnoses organizational health, strengthens leadership, improves instruction, develops
            educators, grows enrollment, recruits talent, raises capital, implements technology, and supports
            schools through long-term transformation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {LINKS.map((l) => (
            <BEButton
              key={l.to}
              to={l.to}
              variant="ghost"
              className="!justify-start !normal-case !font-normal border border-bettered-lightgray rounded-xl p-6 text-left hover:border-bettered-orange block"
            >
              <span className="block">
                <span className="block font-bold text-lg text-bettered-ink mb-1.5">{l.title}</span>
                <span className="block text-sm text-bettered-midgray">{l.copy}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-bettered-orange">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </BEButton>
          ))}
        </div>
      </Container>
    </div>
  );
}
