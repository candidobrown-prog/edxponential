import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton } from '@/bettered/components/ui';
import { DOMAINS, LIKERT_OPTIONS } from '@/bettered/data/healthIndex';
import { loadSHI, saveSHI } from '@/bettered/lib/shiStorage';

export default function Assessment() {
  useDocumentTitle('School Health Index Assessment', 'Answer twelve domains of questions to generate your preliminary School Health Score.');
  const navigate = useNavigate();
  const [domainIndex, setDomainIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const state = loadSHI();
    if (!state.contact || !state.school) {
      navigate('/school-health-index/start');
      return;
    }
    setResponses(state.responses || {});
    setReady(true);
  }, [navigate]);

  if (!ready) return null;

  const domain = DOMAINS[domainIndex];
  const isLast = domainIndex === DOMAINS.length - 1;
  const domainAnswered = domain.questions.every((q) => typeof responses[q.id] === 'number');
  const totalAnswered = Object.keys(responses).length;
  const totalQuestions = DOMAINS.reduce((sum, d) => sum + d.questions.length, 0);

  function setAnswer(questionId, value) {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }

  function persist(next) {
    const state = loadSHI();
    saveSHI({ ...state, responses: next });
  }

  function handleNext() {
    persist(responses);
    if (isLast) {
      const state = loadSHI();
      saveSHI({ ...state, responses, submittedAt: new Date().toISOString() });
      navigate('/school-health-index/results');
    } else {
      setDomainIndex((i) => i + 1);
    }
  }

  function handleBack() {
    persist(responses);
    if (domainIndex === 0) {
      navigate('/school-health-index/start');
    } else {
      setDomainIndex((i) => i - 1);
    }
  }

  return (
    <Container className="py-16 sm:py-20 max-w-2xl">
      <Eyebrow>Domain {domainIndex + 1} of {DOMAINS.length}</Eyebrow>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight mb-1">{domain.name}</h1>
      <p className="text-sm text-bettered-midgray mb-8">{totalAnswered} of {totalQuestions} questions answered</p>

      <div className="h-1.5 w-full bg-bettered-lightgray rounded-full mb-10 overflow-hidden">
        <div
          className="h-full bg-bettered-orange transition-all"
          style={{ width: `${((domainIndex + (domainAnswered ? 1 : 0)) / DOMAINS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-8 mb-10">
        {domain.questions.map((q) => (
          <fieldset key={q.id}>
            <legend className="font-semibold text-bettered-ink mb-3 leading-snug">{q.text}</legend>
            <div className="grid grid-cols-5 gap-2">
              {LIKERT_OPTIONS.map((opt) => {
                const checked = responses[q.id] === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-1 py-2.5 text-center cursor-pointer transition-colors ${
                      checked ? 'border-bettered-orange bg-bettered-orange/10' : 'border-bettered-lightgray hover:border-bettered-midgray'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={checked}
                      onChange={() => setAnswer(q.id, opt.value)}
                      className="accent-bettered-orange"
                    />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-bettered-charcoal leading-tight">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex gap-3">
        <BEButton variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </BEButton>
        <BEButton variant="primary" className="flex-1 justify-center" onClick={handleNext} disabled={!domainAnswered}>
          {isLast ? 'See My School Health Score' : 'Next Domain'} <ArrowRight className="h-4 w-4" />
        </BEButton>
      </div>
      {!domainAnswered && (
        <p className="text-xs text-bettered-midgray mt-3">Answer all three questions to continue.</p>
      )}
    </Container>
  );
}
