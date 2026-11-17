import React from 'react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';

export default function CandidoBrown() {
  useDocumentTitle('Candido Brown’s Story', 'The founder’s path from Baltimore classrooms to Johns Hopkins, Harvard, Success Academy, and the founding of BetterEd Solutions in 2017.');

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-24">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Candido Brown' }]} />
          <Eyebrow>The Founder</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
            Every day adults delay, a child pays the price.
          </h1>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <div className="grid lg:grid-cols-[1fr,1.6fr] gap-12">
          <div>
            <div className="aspect-[4/5] rounded-2xl bg-bettered-offwhite border border-bettered-lightgray flex items-center justify-center text-bettered-midgray text-sm font-semibold sticky top-24">
              [PHOTO: Candido Brown]
            </div>
          </div>

          <div className="prose-none space-y-6 text-lg text-bettered-charcoal/85 leading-relaxed">
            <p>
              Candido Brown grew up in Baltimore and experienced the power that schools and teachers can have in
              changing the direction of a child&rsquo;s life. He also saw what happens when institutions fail to
              provide children with the quality, consistency, belief, protection, and opportunity they deserve.
            </p>
            <p>
              Before building a career in education, Candido was deeply interested in psychology, the brain, human
              behavior, and the reasons individuals and organizations struggle. That curiosity followed him through
              Baltimore City College, Johns Hopkins University, the Harvard Graduate School of Education, classroom
              teaching, school leadership, network leadership, executive coaching, and school-improvement work.
            </p>
            <p>
              At Baltimore City College High School, Candido found teachers who changed the trajectory of his life
              &mdash; the kind of educators BetterEd now exists to develop and support at scale. That experience,
              paired with an early fascination with how people think and why organizations succeed or fail, carried
              him to Johns Hopkins University and later the Harvard Graduate School of Education.
            </p>
            <p>
              From there, Candido moved into the classroom, teaching and later leading schools, including time with
              Success Academy, before taking on principal and network-level leadership roles. Along the way, he
              built a practice in executive coaching and leadership development &mdash; work that put him inside the
              decision-making of dozens of schools and systems.
            </p>
            <p>
              As Candido worked with schools, he began to question a fundamental contradiction.
            </p>
            <p>
              In medicine, when a patient experiences a serious condition, professionals are expected to investigate
              the cause. They examine the patient, gather evidence, consult specialists, diagnose the condition,
              prescribe treatment, monitor progress, and adjust the plan when it is not working.
            </p>
            <p>
              In education, when a child struggles, the system often blames the child. The student is called
              unmotivated. The family is described as uninvolved. The community is treated as the problem. The
              teacher is blamed. The principal is replaced. Another program is purchased. The symptoms are
              repeatedly labeled, but the root cause is rarely treated with the rigor the situation demands.
            </p>
            <p>Candido believed schools deserved better.</p>
            <p>
              He wanted educators to be treated as highly skilled professionals. He wanted school improvement to
              become more diagnostic, evidence based, coordinated, precise, urgent, and accountable. He wanted
              schools to receive more than recommendations. He wanted them to receive a complete transformation team
              capable of diagnosing the challenge, prescribing the correct intervention, supporting implementation,
              monitoring progress, and staying focused on the outcome.
            </p>
            <p className="font-black text-bettered-ink text-xl">
              That belief led Candido Brown to found BetterEd Solutions in Baltimore in 2017.
            </p>

            <div className="rounded-2xl bg-bettered-offwhite p-8 my-10 border-l-4 border-bettered-orange">
              <p className="text-xl sm:text-2xl font-semibold text-bettered-ink leading-snug">
                &ldquo;I founded BetterEd because schools do not need more people labeling their symptoms. They need
                experts who can diagnose the root cause, prescribe the right intervention, support the
                implementation, and remain accountable for the result.&rdquo;
              </p>
              <p className="mt-4 text-sm font-bold text-bettered-midgray uppercase tracking-wide">
                Candido Brown, Founder &amp; CEO, BetterEd Solutions
              </p>
            </div>

            <p>
              Today, Candido leads BetterEd as it works alongside superintendents, boards, principals, and teachers
              to diagnose the root causes of underperformance and build the systems, talent, and capital schools
              need to improve &mdash; because children are not the problem. Broken systems are.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-bettered-ink text-white p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">See BetterEd&rsquo;s methodology in practice.</h2>
          <BEButton to="/about/medical-model" variant="primary">
            Explore the BetterEd Medical Model
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
