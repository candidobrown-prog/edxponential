import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton } from '@/bettered/components/ui';
import { loadSHI, saveSHI } from '@/bettered/lib/shiStorage';

const ROLES = ['Superintendent / CEO', 'Head of School / Principal', 'Assistant Principal', 'Board Member', 'Director / Department Head', 'Other School Leader'];
const SCHOOL_TYPES = ['Public District School', 'Public Charter School', 'Independent / Private School', 'Network / Multiple Campuses', 'Other'];
const GRADE_BANDS = ['Early Childhood', 'Elementary', 'Middle', 'High School', 'K-8', 'K-12', 'Other'];

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-bettered-ink mb-1.5">
        {label} {required && <span className="text-bettered-orange">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-bettered-lightgray px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bettered-orange';

export default function Start() {
  useDocumentTitle('Start the School Health Index', 'Begin the BetterEd School Health Index™ — tell us about you and your school.');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const initial = loadSHI();
  const [contact, setContact] = useState(
    initial.contact || { name: '', email: '', phone: '', role: '', school: '', consent: false }
  );
  const [school, setSchool] = useState(
    initial.school || { schoolName: '', schoolType: '', location: '', website: '', grades: '', enrollment: '', campuses: '', governance: '', yearsOperating: '' }
  );

  function handleContactSubmit(e) {
    e.preventDefault();
    const state = loadSHI();
    saveSHI({ ...state, contact });
    setStep(2);
  }

  function handleSchoolSubmit(e) {
    e.preventDefault();
    const state = loadSHI();
    saveSHI({ ...state, contact, school });
    navigate('/school-health-index/assessment');
  }

  return (
    <Container className="py-16 sm:py-20 max-w-2xl">
      <Eyebrow>Step {step} of 2</Eyebrow>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight mb-2">
        {step === 1 ? 'Tell us about you.' : 'Tell us about your school.'}
      </h1>
      <p className="text-bettered-charcoal/70 mb-8">
        {step === 1
          ? 'This stays with your results and lets us follow up on your School Health Score.'
          : 'This context helps BetterEd tailor the preliminary snapshot to your school.'}
      </p>

      <div className="h-1.5 w-full bg-bettered-lightgray rounded-full mb-10 overflow-hidden">
        <div className="h-full bg-bettered-orange transition-all" style={{ width: step === 1 ? '50%' : '100%' }} />
      </div>

      {step === 1 ? (
        <form onSubmit={handleContactSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full Name" required>
              <input required className={inputCls} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
            </Field>
            <Field label="Work Email" required>
              <input required type="email" className={inputCls} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Phone">
              <input type="tel" className={inputCls} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </Field>
            <Field label="Your Role" required>
              <select required className={inputCls} value={contact.role} onChange={(e) => setContact({ ...contact, role: e.target.value })}>
                <option value="">Select a role</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>
          <Field label="School or Organization" required>
            <input required className={inputCls} value={contact.school} onChange={(e) => setContact({ ...contact, school: e.target.value })} />
          </Field>
          <label className="flex items-start gap-3 text-sm text-bettered-charcoal/80">
            <input
              type="checkbox"
              required
              checked={contact.consent}
              onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
              className="mt-1 h-4 w-4 accent-bettered-orange"
            />
            <span>
              I agree to be contacted by BetterEd Solutions about my School Health Index results and consent to
              BetterEd&rsquo;s{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          <BEButton type="submit" variant="primary" className="w-full justify-center">
            Continue <ArrowRight className="h-4 w-4" />
          </BEButton>
        </form>
      ) : (
        <form onSubmit={handleSchoolSubmit} className="space-y-5">
          <Field label="School Name" required>
            <input required className={inputCls} value={school.schoolName} onChange={(e) => setSchool({ ...school, schoolName: e.target.value })} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="School Type" required>
              <select required className={inputCls} value={school.schoolType} onChange={(e) => setSchool({ ...school, schoolType: e.target.value })}>
                <option value="">Select a type</option>
                {SCHOOL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Grades Served" required>
              <select required className={inputCls} value={school.grades} onChange={(e) => setSchool({ ...school, grades: e.target.value })}>
                <option value="">Select grades</option>
                {GRADE_BANDS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Location (City, State)" required>
              <input required className={inputCls} value={school.location} onChange={(e) => setSchool({ ...school, location: e.target.value })} />
            </Field>
            <Field label="Website">
              <input type="url" placeholder="https://" className={inputCls} value={school.website} onChange={(e) => setSchool({ ...school, website: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Enrollment" required>
              <input required type="number" min="1" className={inputCls} value={school.enrollment} onChange={(e) => setSchool({ ...school, enrollment: e.target.value })} />
            </Field>
            <Field label="Number of Campuses">
              <input type="number" min="1" className={inputCls} value={school.campuses} onChange={(e) => setSchool({ ...school, campuses: e.target.value })} />
            </Field>
            <Field label="Years in Operation">
              <input type="number" min="0" className={inputCls} value={school.yearsOperating} onChange={(e) => setSchool({ ...school, yearsOperating: e.target.value })} />
            </Field>
          </div>
          <Field label="Governance Model">
            <input placeholder="e.g. Independent board, district-run, network-managed" className={inputCls} value={school.governance} onChange={(e) => setSchool({ ...school, governance: e.target.value })} />
          </Field>
          <div className="flex gap-3">
            <BEButton type="button" variant="outline" onClick={() => setStep(1)}>
              Back
            </BEButton>
            <BEButton type="submit" variant="primary" className="flex-1 justify-center">
              Continue to Assessment <ArrowRight className="h-4 w-4" />
            </BEButton>
          </div>
        </form>
      )}
    </Container>
  );
}
