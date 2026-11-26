import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Users, Award, Layers } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs, Disclaimer } from '@/bettered/components/ui';
import { getAcademyBySlug } from '@/bettered/data/academies';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-bettered-lightgray last:border-0">
      <Icon className="h-4 w-4 text-bettered-orange mt-1 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-bettered-midgray">{label}</p>
        <p className="text-sm font-semibold text-bettered-ink">{value}</p>
      </div>
    </div>
  );
}

export default function AcademyDetail() {
  const { slug } = useParams();
  const academy = getAcademyBySlug(slug);

  useDocumentTitle(academy ? academy.name : 'Academy', academy ? academy.headline : undefined);

  if (!academy) return <Navigate to="/academies" replace />;

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Academies', to: '/academies' }, { label: academy.name }]} />
          <Eyebrow>BetterEd Academies</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">{academy.name}</h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl leading-relaxed">{academy.headline}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <BEButton to={`/contact?intent=enroll-academy&program=${academy.slug}`} variant="primary">
              Enroll Now <ArrowRight className="h-4 w-4" />
            </BEButton>
            <BEButton to={`/contact?intent=academy-inquiry&program=${academy.slug}`} variant="outlineLight">
              Ask a Question
            </BEButton>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-12">
          <div>
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3">Who It&rsquo;s For</h2>
              <p className="text-bettered-charcoal/85 leading-relaxed">{academy.audience}</p>
            </section>
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3">The Problem</h2>
              <p className="text-bettered-charcoal/85 leading-relaxed">{academy.problem}</p>
            </section>
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3">Outcomes</h2>
              <ul className="space-y-2.5">
                {academy.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-bettered-charcoal/85">
                    <CheckCircle2 className="h-5 w-5 text-bettered-orange shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3">Curriculum &amp; Modules</h2>
              <ol className="space-y-3">
                {academy.modules.map((m, i) => (
                  <li key={m} className="flex items-start gap-3">
                    <span className="h-7 w-7 rounded-full bg-bettered-orange text-black font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-bettered-charcoal/85 pt-0.5">{m}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3">Faculty</h2>
              <p className="text-bettered-charcoal/85 leading-relaxed">{academy.faculty}</p>
            </section>
          </div>

          <aside>
            <div className="rounded-xl border border-bettered-lightgray p-6 sticky top-24">
              <p className="text-3xl font-black text-bettered-ink mb-1">{academy.price}</p>
              <p className="text-sm text-bettered-midgray mb-5">{academy.groupPricing}</p>
              <InfoRow icon={Clock} label="Duration" value={academy.duration} />
              <InfoRow icon={Layers} label="Format" value={academy.format} />
              <InfoRow icon={Users} label="Schedule" value={academy.schedule} />
              <InfoRow icon={Award} label="Certification" value={academy.certification} />
              <p className="text-xs text-bettered-midgray mt-4 mb-5">{academy.live} &middot; {academy.coaching} &middot; {academy.materials}</p>
              <BEButton to={`/contact?intent=enroll-academy&program=${academy.slug}`} variant="primary" className="w-full justify-center mb-3">
                Enroll Now
              </BEButton>
              <BEButton to={`/contact?intent=purchase-order&program=${academy.slug}`} variant="outline" className="w-full justify-center mb-3">
                Request Invoice / Submit a PO
              </BEButton>
              <p className="text-xs text-bettered-midgray text-center">{academy.enrollmentNote}</p>
            </div>
          </aside>
        </div>

        <div className="mt-16">
          <Disclaimer>
            Enrollment, invoicing, and purchase-order requests for BetterEd Academies are currently coordinated
            directly with our team. Submit the form linked above and a BetterEd team member will follow up with
            enrollment and payment details.
          </Disclaimer>
        </div>
      </Container>
    </div>
  );
}
