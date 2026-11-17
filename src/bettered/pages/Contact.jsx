import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton } from '@/bettered/components/ui';

const INTENT_COPY = {
  'strategic-consultation': { heading: 'Schedule a Strategic Consultation', sub: 'Tell us about your school and we’ll follow up to find a time to talk.' },
  'request-proposal': { heading: 'Request a Proposal', sub: 'Share your challenge and goals, and BetterEd will follow up with next steps.' },
  'school-health-review': { heading: 'Schedule a School Health Review Call', sub: 'A BetterEd professional will review your School Health Index results with you.' },
  'complete-diagnostic': { heading: 'Request a Complete BetterEd Diagnostic', sub: 'Tell us about your school and we’ll scope a full diagnostic engagement.' },
  'enroll-academy': { heading: 'Enroll in a BetterEd Academy', sub: 'Share your details and we’ll confirm enrollment and payment options.' },
  'academy-inquiry': { heading: 'Ask About a BetterEd Academy', sub: 'Have a question before enrolling? Tell us more.' },
  'purchase-order': { heading: 'Request an Invoice or Submit a Purchase Order', sub: 'Share your organization’s billing details and BetterEd will follow up.' },
  'talent-exchange-employer': { heading: 'Request Talent Support', sub: 'Tell us about the role you’re hiring for.' },
  'talent-exchange-candidate': { heading: 'Start BetterEd Verification', sub: 'Share your background and a BetterEd team member will follow up on next steps.' },
  careers: { heading: 'Join the BetterEd Team', sub: 'Tell us a bit about your background and interest in BetterEd.' },
  default: { heading: 'Let’s make your school better.', sub: 'Tell us about your school and your goals, and a member of the BetterEd team will follow up.' },
};

const NEEDS = [
  'School Improvement & Transformation', 'Executive Coaching', 'Leadership Development', 'Teacher Coaching',
  'Talent Acquisition', 'Capital, Advancement & Investment', 'BetterEd Academies', 'Talent Exchange',
  'School Health Index Follow-Up', 'Other',
];

const inputCls = 'w-full rounded-lg border border-bettered-lightgray px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bettered-orange';

function Field({ label, children, required, className }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-bettered-ink mb-1.5">
        {label} {required && <span className="text-bettered-orange">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Contact() {
  const [params] = useSearchParams();
  const intent = params.get('intent') || 'default';
  const program = params.get('program');
  const copy = INTENT_COPY[intent] || INTENT_COPY.default;
  const [submitted, setSubmitted] = useState(false);

  useDocumentTitle('Contact', 'Get in touch with BetterEd Solutions about school improvement, coaching, talent, academies, or the School Health Index.');

  if (submitted) {
    return (
      <Container className="py-24 max-w-xl text-center">
        <CheckCircle2 className="h-12 w-12 text-bettered-orange mx-auto mb-5" />
        <h1 className="text-3xl font-black tracking-tight mb-3">Thank you.</h1>
        <p className="text-bettered-charcoal/80 mb-8">
          A member of the BetterEd team will follow up shortly at the email address you provided.
        </p>
        <BEButton to="/" variant="dark">
          Return Home
        </BEButton>
      </Container>
    );
  }

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-16 sm:py-20">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-2xl">{copy.heading}</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl">{copy.sub}</p>
        </Container>
      </div>

      <Container className="py-16 max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-6"
        >
          {program && <input type="hidden" name="program" value={program} />}
          <input type="hidden" name="intent" value={intent} />

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="First Name" required><input required className={inputCls} /></Field>
            <Field label="Last Name" required><input required className={inputCls} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Work Email" required><input required type="email" className={inputCls} /></Field>
            <Field label="Phone"><input type="tel" className={inputCls} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Job Title"><input className={inputCls} /></Field>
            <Field label="Organization" required><input required className={inputCls} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Organization Type">
              <select className={inputCls} defaultValue="">
                <option value="">Select type</option>
                <option>Public District School</option>
                <option>Public Charter School</option>
                <option>Independent / Private School</option>
                <option>Network / Multiple Campuses</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Number of Schools"><input type="number" min="1" className={inputCls} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Location"><input className={inputCls} /></Field>
            <Field label="Website"><input type="url" placeholder="https://" className={inputCls} /></Field>
          </div>

          <Field label="Primary Need">
            <select className={inputCls} defaultValue="">
              <option value="">Select a need</option>
              {NEEDS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>

          <Field label="What challenge are you trying to solve?" required>
            <textarea required rows={4} className={inputCls} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Urgency">
              <select className={inputCls} defaultValue="">
                <option value="">Select urgency</option>
                <option>Immediate (within 30 days)</option>
                <option>Near-term (this school year)</option>
                <option>Planning ahead (next school year)</option>
                <option>Just exploring</option>
              </select>
            </Field>
            <Field label="Budget Range">
              <select className={inputCls} defaultValue="">
                <option value="">Select a range</option>
                <option>Under $10,000</option>
                <option>$10,000 &ndash; $50,000</option>
                <option>$50,000 &ndash; $150,000</option>
                <option>$150,000+</option>
                <option>Not yet determined</option>
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Decision-Making Authority">
              <select className={inputCls} defaultValue="">
                <option value="">Select one</option>
                <option>I make the final decision</option>
                <option>I influence the decision</option>
                <option>Someone else decides</option>
              </select>
            </Field>
            <Field label="How did you hear about BetterEd?">
              <input className={inputCls} />
            </Field>
          </div>

          <label className="flex items-start gap-3 text-sm text-bettered-charcoal/80">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-bettered-orange" />
            <span>
              I consent to be contacted by BetterEd Solutions and acknowledge BetterEd&rsquo;s{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Privacy Policy</a>.
            </span>
          </label>

          <BEButton type="submit" variant="primary" className="w-full justify-center">
            Submit <ArrowRight className="h-4 w-4" />
          </BEButton>
        </form>
      </Container>
    </div>
  );
}
