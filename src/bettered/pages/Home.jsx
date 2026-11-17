import React from 'react';
import { ArrowRight, Microscope, Stethoscope, ClipboardList, Activity, TrendingUp, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Stat } from '@/bettered/components/ui';
import AnatomyOfAHealthySchool from '@/bettered/components/AnatomyOfAHealthySchool';
import { services } from '@/bettered/data/services';
import { academies } from '@/bettered/data/academies';
import { vitamins } from '@/bettered/data/vitamins';

const MEDICAL_STAGES = [
  { icon: ClipboardList, label: 'History' },
  { icon: Microscope, label: 'Examination' },
  { icon: Stethoscope, label: 'Diagnosis' },
  { icon: Activity, label: 'Prescription' },
  { icon: RefreshCw, label: 'Treatment' },
  { icon: TrendingUp, label: 'Monitoring' },
  { icon: Sparkles, label: 'Adjustment' },
  { icon: ShieldCheck, label: 'Recovery' },
  { icon: ShieldCheck, label: 'Prevention' },
];

function Section({ className = '', children }) {
  return <section className={className}>{children}</section>;
}

export default function Home() {
  useDocumentTitle(
    'School Growth, Transformation & Investment',
    'BetterEd Solutions helps schools diagnose organizational health, strengthen leadership, improve instruction, recruit talent, grow enrollment, raise capital, and transform student outcomes.'
  );

  return (
    <>
      {/* 1. Hero */}
      <Section className="relative bg-white overflow-hidden">
        <Container className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <Eyebrow>School Growth, Transformation &amp; Investment</Eyebrow>
          <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] max-w-4xl">
            How healthy is your school?
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-bettered-charcoal/80 max-w-2xl leading-relaxed">
            BetterEd Solutions helps schools diagnose what is working, identify what is breaking down, and implement
            the systems, coaching, talent, technology, and capital needed to get better fast.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <BEButton to="/school-health-index/start" variant="primary">
              Take the BetterEd School Health Index&trade; <ArrowRight className="h-4 w-4" />
            </BEButton>
            <BEButton to="/contact?intent=strategic-consultation" variant="outline">
              Schedule a Strategic Consultation
            </BEButton>
          </div>
        </Container>
        <Container className="pb-20 sm:pb-28">
          <AnatomyOfAHealthySchool />
        </Container>
      </Section>

      {/* 2. School Health Index CTA */}
      <Section className="bg-bettered-ink text-white">
        <Container className="py-20 grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center">
          <div>
            <Eyebrow>The Diagnostic</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Your outcomes are vital signs.
            </h2>
            <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-xl">
              Academic performance is not an isolated event. It reflects the health of leadership, instruction,
              culture, talent, operations, enrollment, finance, facilities, family trust, special education, and
              organizational strategy. The BetterEd School Health Index&trade; helps school leaders see the full
              system.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <BEButton to="/school-health-index" variant="primary">
              Get Your School Health Score <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </Section>

      {/* 3. The Problem */}
      <Section className="bg-white">
        <Container className="py-20 grid lg:grid-cols-2 gap-12">
          <div>
            <Eyebrow>The Problem</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Schools rarely struggle in only one area.
            </h2>
            <p className="mt-5 text-bettered-charcoal/80 text-lg leading-relaxed">
              Low academic performance may be the visible symptom. The root cause may involve far more than
              instruction alone. BetterEd examines the full organization.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 content-start">
            {[
              'Weak instructional leadership',
              'Misaligned curriculum',
              'Inconsistent classroom management',
              'Staff vacancies',
              'Poor teacher retention',
              'Declining enrollment',
              'Unclear accountability',
              'Weak family trust',
              'Inefficient operations',
              'Financial instability',
              'Facility limitations',
              'Fragmented strategic planning',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-bettered-charcoal bg-bettered-offwhite rounded-lg px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-bettered-orange shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 4. Medical Model */}
      <Section className="bg-bettered-offwhite">
        <Container className="py-20">
          <div className="max-w-3xl">
            <Eyebrow>The BetterEd Medical Model</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Diagnose. Prescribe. Treat. Monitor. Recover. Prevent.
            </h2>
            <p className="mt-5 text-bettered-charcoal/80 text-lg leading-relaxed">
              BetterEd applies the discipline of medicine to school growth and transformation. We do not begin with a
              predetermined product. We begin with evidence.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
            {MEDICAL_STAGES.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div key={stage.label} className="flex flex-col items-center text-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-white border border-bettered-lightgray flex items-center justify-center text-bettered-orange">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-bold text-bettered-charcoal">{i + 1}. {stage.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-10">
            <BEButton to="/about/medical-model" variant="outline">
              Explore the BetterEd Medical Model <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </Section>

      {/* 5. Services Ecosystem */}
      <Section className="bg-white">
        <Container className="py-20">
          <Eyebrow>Services</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            One organization. Every critical system.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <BEButton
                key={svc.slug}
                to={`/services/${svc.slug}`}
                variant="ghost"
                className="!justify-start !normal-case !font-normal border border-bettered-lightgray rounded-xl p-5 text-left hover:border-bettered-orange hover:!text-bettered-ink group block"
              >
                <span className="block">
                  <span className="block font-bold text-bettered-ink group-hover:text-bettered-orange text-base mb-1">
                    {svc.name}
                  </span>
                  <span className="block text-sm text-bettered-midgray">{svc.short}</span>
                </span>
              </BEButton>
            ))}
          </div>
          <div className="mt-10">
            <BEButton to="/services" variant="dark">
              View All Services <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </Section>

      {/* 6. BetterEd Vitamins */}
      <Section className="bg-bettered-ink text-white">
        <Container className="py-20">
          <Eyebrow>The BetterEd Vitamins&trade;</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            The daily disciplines that make schools better.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vitamins.map((v) => (
              <div key={v.code} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-bettered-orange text-black font-black text-xs mb-3">
                  {v.code}
                </span>
                <h3 className="font-bold text-lg mb-1.5">{v.name}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{v.statement}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <BEButton to="/about/bettered-vitamins" variant="outlineLight">
              Explore the BetterEd Vitamins&trade; <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </Section>

      {/* 7. Flagship Case Study */}
      <Section className="bg-bettered-offwhite">
        <Container className="py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Flagship Transformation</Eyebrow>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Shining Stars Montessori Academy Public Charter School
            </h2>
            <p className="mt-5 text-bettered-charcoal/80 leading-relaxed">
              A multi-year transformation partnership spanning leadership coaching, teacher development, enrollment
              strategy, staffing, facilities, curriculum, and culture.
            </p>
            <div className="mt-6">
              <BEButton to="/case-studies/shining-stars-montessori" variant="dark">
                Read the Case Study <ArrowRight className="h-4 w-4" />
              </BEButton>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-bettered-lightgray border border-bettered-lightgray flex items-center justify-center text-bettered-midgray text-sm font-semibold">
            [PHOTO: School exterior]
          </div>
        </Container>
      </Section>

      {/* 8. Academies */}
      <Section className="bg-white">
        <Container className="py-20">
          <Eyebrow>BetterEd Academies</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Professional development that changes practice.
          </h2>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {academies.slice(0, 4).map((a) => (
              <div key={a.slug} className="min-w-[260px] sm:min-w-0 rounded-xl border border-bettered-lightgray p-5 flex flex-col">
                <h3 className="font-bold text-lg leading-snug mb-2">{a.name}</h3>
                <p className="text-sm text-bettered-midgray flex-1">{a.headline}</p>
                <p className="text-xs font-semibold text-bettered-orange mt-3">{a.duration} &middot; {a.format}</p>
                <BEButton to={`/academies/${a.slug}`} variant="ghost" className="!px-0 mt-3 self-start">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </BEButton>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <BEButton to="/academies" variant="outline">
              Explore BetterEd Academies <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </Container>
      </Section>

      {/* 9. Talent Exchange */}
      <Section className="bg-bettered-ink text-white">
        <Container className="py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>BetterEd Talent Exchange&trade;</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Great schools require great people.
            </h2>
            <p className="mt-5 text-white/80 leading-relaxed">
              The BetterEd Talent Exchange&trade; connects schools with assessed, developed, and verified education
              talent.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <BEButton to="/talent-exchange/employers" variant="primary" className="flex-1 justify-center">
              Find Exceptional Talent
            </BEButton>
            <BEButton to="/talent-exchange/verified-candidate" variant="outlineLight" className="flex-1 justify-center">
              Become Verified
            </BEButton>
          </div>
        </Container>
      </Section>

      {/* 10. Founder Story */}
      <Section className="bg-white">
        <Container className="py-20 grid lg:grid-cols-[1fr,1.3fr] gap-10 items-center">
          <div className="aspect-square rounded-2xl bg-bettered-offwhite border border-bettered-lightgray flex items-center justify-center text-bettered-midgray text-sm font-semibold">
            [PHOTO: Candido Brown]
          </div>
          <div>
            <Eyebrow>The Founder</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Every day adults delay, a child pays the price.
            </h2>
            <p className="mt-5 text-bettered-charcoal/80 leading-relaxed">
              Candido Brown founded BetterEd Solutions in Baltimore in 2017, believing schools deserve the same
              diagnostic rigor as medicine &mdash; and that children are never the problem. Broken systems are.
            </p>
            <div className="mt-6">
              <BEButton to="/about/candido-brown" variant="dark">
                Read Candido Brown&rsquo;s Story <ArrowRight className="h-4 w-4" />
              </BEButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* 11. Ecosystem */}
      <Section className="bg-bettered-offwhite">
        <Container className="py-20">
          <Eyebrow>The BetterEd Ecosystem</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight leading-tight max-w-2xl mb-10">
            Beyond consulting &mdash; a full ecosystem for school transformation.
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-bettered-lightgray p-6">
              <h3 className="font-bold text-lg mb-2">edXponential</h3>
              <p className="text-sm text-bettered-midgray mb-4">
                Professional learning, AI, coaching, implementation support, and community for educators and school
                teams.
              </p>
              <BEButton to="/edxponential" variant="ghost" className="!px-0">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </BEButton>
            </div>
            <div className="bg-white rounded-xl border border-bettered-lightgray p-6">
              <h3 className="font-bold text-lg mb-2">The EdXponent</h3>
              <p className="text-sm text-bettered-midgray mb-4">
                A publication focused on leadership, school improvement, innovation, policy, AI, teacher excellence,
                and the future of education.
              </p>
              <BEButton to="/the-edxponent" variant="ghost" className="!px-0">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </BEButton>
            </div>
            <div className="bg-white rounded-xl border border-bettered-lightgray p-6">
              <h3 className="font-bold text-lg mb-2">Raise Teacher Pay Project</h3>
              <p className="text-sm text-bettered-midgray mb-4">
                An advocacy initiative focused on increasing teacher compensation, professional respect, and
                long-term career sustainability.
              </p>
              <BEButton to="/raise-teacher-pay" variant="ghost" className="!px-0">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </BEButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* 13. Insights Preview */}
      <Section className="bg-white">
        <Container className="py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <Eyebrow>BetterEd Insights</Eyebrow>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">Field notes on school transformation.</h2>
            </div>
            <BEButton to="/insights" variant="outline">
              View All Insights
            </BEButton>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { slug: 'root-cause-vs-symptom', title: 'Why Schools Treat Symptoms Instead of Root Causes', category: 'School Turnaround' },
              { slug: 'ninety-day-leadership-plan', title: 'The First Ninety Days of a Turnaround Principalship', category: 'Leadership' },
              { slug: 'ai-literacy-for-school-leaders', title: 'What School Leaders Actually Need to Know About AI', category: 'AI in Education' },
            ].map((post) => (
              <BEButton
                key={post.slug}
                to={`/insights/${post.slug}`}
                variant="ghost"
                className="!justify-start !normal-case !font-normal border border-bettered-lightgray rounded-xl p-5 text-left block"
              >
                <span className="block">
                  <span className="block text-xs font-bold uppercase tracking-wide text-bettered-orange mb-2">{post.category}</span>
                  <span className="block font-bold text-bettered-ink leading-snug">{post.title}</span>
                </span>
              </BEButton>
            ))}
          </div>
        </Container>
      </Section>

      {/* 14. Final CTA */}
      <Section className="bg-bettered-ink text-white">
        <Container className="py-24 text-center">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            Get your school health score.
          </h2>
          <p className="mt-5 text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
            See your strengths. Identify your risks. Understand what requires immediate attention. Build a better
            path forward.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <BEButton to="/school-health-index/start" variant="primary">
              Take the School Health Index <ArrowRight className="h-4 w-4" />
            </BEButton>
            <BEButton to="/contact" variant="outlineLight">
              Schedule a Consultation
            </BEButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
