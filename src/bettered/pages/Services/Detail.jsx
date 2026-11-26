import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';
import { getServiceBySlug, services } from '@/bettered/data/services';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

function Block({ title, children }) {
  return (
    <div className="py-8 border-b border-bettered-lightgray">
      <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4">{title}</h2>
      {children}
    </div>
  );
}

function List({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-bettered-charcoal/85">
          <CheckCircle2 className="h-5 w-5 text-bettered-orange shrink-0 mt-0.5" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  useDocumentTitle(service ? service.name : 'Service', service ? service.short : undefined);

  if (!service) return <Navigate to="/services" replace />;

  const related = (service.related || [])
    .map((s) => getServiceBySlug(s))
    .filter(Boolean);

  const faqs = [
    {
      q: 'How long does this engagement typically run?',
      a: 'Most BetterEd engagements run between six months and three years, depending on scope. We size the engagement to the diagnosis, not the other way around.',
    },
    {
      q: 'Do we need to complete the School Health Index first?',
      a: 'It helps. The School Health Index gives both BetterEd and your team a shared starting point, but we can also begin directly with a discovery conversation.',
    },
    {
      q: 'Who on our team needs to be involved?',
      a: 'It depends on scope, but meaningful progress requires participation from leadership and, in most engagements, a core team of staff who can sustain the work after BetterEd’s direct support ends.',
    },
  ];

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.name }]} />
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">{service.name}</h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">{service.short}</p>
          <div className="mt-8">
            <BEButton to="/contact?intent=request-proposal" variant="primary">
              Request a Consultation <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-12">
          <div>
            <Block title="Who It's For">
              <p className="text-bettered-charcoal/85 leading-relaxed">{service.who}</p>
            </Block>
            <Block title="The Challenge">
              <p className="text-bettered-charcoal/85 leading-relaxed">{service.challenge}</p>
            </Block>
            <Block title="Symptoms Leaders May Notice">
              <List items={service.symptoms} />
            </Block>
            <Block title="What BetterEd Examines">
              <List items={service.examine} />
            </Block>
            <Block title="Likely Root Causes">
              <List items={service.rootCauses} />
            </Block>
            <Block title="What BetterEd Provides">
              <List items={service.provides} />
            </Block>
            <Block title="Engagement Process">
              <ol className="space-y-3">
                {service.process.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="h-7 w-7 rounded-full bg-bettered-orange text-black font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-bettered-charcoal/85 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </Block>
            <Block title="Sample Deliverables">
              <List items={service.deliverables} />
            </Block>
            <Block title="Expected Outcomes">
              <List items={service.outcomes} />
            </Block>
            <div className="py-8">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4">FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-bettered-charcoal/80">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <aside className="lg:py-8">
            <div className="rounded-xl border border-bettered-lightgray p-6 sticky top-24">
              <h3 className="font-bold mb-2">Flagship Transformation</h3>
              <p className="text-sm text-bettered-midgray mb-4">
                See how this work plays out in a full partnership.
              </p>
              <BEButton to="/case-studies/shining-stars-montessori" variant="outline" className="w-full justify-center mb-6">
                Read the Case Study
              </BEButton>

              {related.length > 0 && (
                <>
                  <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-bettered-midgray">Related Services</h3>
                  <ul className="space-y-2">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <BEButton to={`/services/${r.slug}`} variant="ghost" className="!px-0 !justify-start !normal-case !font-semibold">
                          {r.name}
                        </BEButton>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
        </div>
      </Container>

      <div className="bg-bettered-offwhite mt-16">
        <Container className="py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to talk through {service.name.toLowerCase()}?
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <BEButton to="/contact?intent=request-proposal" variant="dark">
              Request a Proposal
            </BEButton>
            <BEButton to="/school-health-index/start" variant="outline">
              Take the School Health Index
            </BEButton>
          </div>
        </Container>
      </div>
    </div>
  );
}
