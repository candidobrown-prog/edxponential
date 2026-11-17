import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Disclaimer } from '@/bettered/components/ui';
import { scoreAssessment } from '@/bettered/data/healthIndex';
import { getServiceBySlug } from '@/bettered/data/services';
import { loadSHI } from '@/bettered/lib/shiStorage';

const DOMAIN_SERVICE_MAP = {
  leadership: 'leadership-development',
  culture: 'school-improvement',
  instruction: 'instructional-coaching',
  achievement: 'teacher-coaching',
  talent: 'talent-acquisition',
  enrollment: 'enrollment-growth',
  operations: 'facilities-operations',
  financial: 'capital-advancement-investment',
  facilities: 'facilities-operations',
  family: 'enrollment-growth',
  specialed: 'special-education',
  strategy: 'strategic-planning',
};

function ScoreGauge({ score }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#EFEFEF" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#F97316"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-bettered-ink">{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-bettered-midgray">out of 100</span>
      </div>
    </div>
  );
}

function DomainBar({ domain }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-bettered-ink">{domain.name}</span>
        <span className="text-sm font-bold text-bettered-orange">{domain.score}</span>
      </div>
      <div className="h-2 w-full bg-bettered-lightgray rounded-full overflow-hidden">
        <div className="h-full bg-bettered-orange rounded-full" style={{ width: `${domain.score}%` }} />
      </div>
    </div>
  );
}

export default function Results() {
  useDocumentTitle('Your School Health Snapshot', 'Your preliminary BetterEd School Health Score, strengths, risks, and recommended next steps.');
  const navigate = useNavigate();
  const [shi, setShi] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const state = loadSHI();
    if (!state.responses || Object.keys(state.responses).length === 0) {
      navigate('/school-health-index/start');
      return;
    }
    setShi(state);
  }, [navigate]);

  const result = useMemo(() => (shi ? scoreAssessment(shi.responses) : null), [shi]);

  if (!shi || !result) return null;

  const { domainScores, overall, classification, escalated, risks } = result;
  const schoolName = shi.school?.schoolName || 'your school';

  async function handleDownload() {
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('BetterEd School Health Snapshot', 14, y);
      y += 10;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`School: ${schoolName}`, 14, y); y += 6;
      doc.text(`Prepared for: ${shi.contact?.name || ''}`, 14, y); y += 6;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y); y += 10;

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`Overall School Health Score: ${overall} / 100`, 14, y); y += 7;
      doc.text(`Classification: ${classification.label}`, 14, y); y += 10;

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Domain Scores', 14, y); y += 7;
      doc.setFont(undefined, 'normal');
      domainScores.forEach((d) => {
        doc.text(`${d.name}: ${d.score} / 100`, 14, y);
        y += 6;
      });

      y += 6;
      doc.setFont(undefined, 'italic');
      doc.setFontSize(9);
      const disclaimer =
        'This is a preliminary organizational assessment based on information submitted by the respondent. ' +
        'Final findings and recommendations require review by BetterEd professionals and may require interviews, ' +
        'observations, document review, or additional evidence.';
      doc.text(doc.splitTextToSize(disclaimer, 180), 14, y);

      doc.save('bettered-school-health-snapshot.pdf');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-16">
          <Eyebrow>Preliminary Snapshot</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight max-w-2xl">
            {schoolName}&rsquo;s School Health Snapshot
          </h1>
        </Container>
      </div>

      <Container className="py-16">
        {escalated && (
          <div className="mb-10 flex items-start gap-3 rounded-xl border-2 border-bettered-orange bg-bettered-orange/10 p-5">
            <AlertTriangle className="h-5 w-5 text-bettered-orange shrink-0 mt-0.5" />
            <p className="text-sm text-bettered-charcoal font-medium">
              One or more essential domains fell below the critical threshold. BetterEd recommends urgent review
              regardless of the overall average score shown below.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-14 p-8 border border-bettered-lightgray rounded-2xl">
          <ScoreGauge score={overall} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-bettered-orange mb-1">Classification</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">{classification.label}</h2>
            <p className="text-bettered-charcoal/80 max-w-md">{classification.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="text-xl font-black tracking-tight mb-5">Domain Scores</h2>
            <div className="space-y-4">
              {domainScores.map((d) => <DomainBar key={d.key} domain={d} />)}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight mb-5">Immediate Priorities</h2>
            <div className="space-y-3">
              {risks.map((d) => {
                const service = getServiceBySlug(DOMAIN_SERVICE_MAP[d.key]);
                return (
                  <div key={d.key} className="border border-bettered-lightgray rounded-xl p-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-bettered-ink">{d.name}</p>
                      <p className="text-sm text-bettered-midgray">Score: {d.score} / 100</p>
                    </div>
                    {service && (
                      <BEButton to={`/services/${service.slug}`} variant="ghost" className="!px-0 !text-xs !font-semibold shrink-0">
                        View Service <ArrowRight className="h-3 w-3" />
                      </BEButton>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-xl font-black tracking-tight mb-5 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-bettered-orange" /> Top Strengths
          </h2>
          <div className="flex flex-wrap gap-3">
            {result.strengths.map((d) => (
              <span key={d.key} className="rounded-full border border-bettered-lightgray px-4 py-2 text-sm font-semibold text-bettered-charcoal">
                {d.name} &middot; {d.score}
              </span>
            ))}
          </div>
        </div>

        <Disclaimer className="mb-14 max-w-2xl">
          The BetterEd School Health Snapshot is a preliminary organizational assessment based on the information
          submitted. Final findings and recommendations require review by BetterEd professionals and may require
          interviews, observations, document review, or additional evidence.
        </Disclaimer>

        <div className="rounded-2xl bg-bettered-ink text-white p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">What should happen next?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-7">
            A BetterEd professional can review your results, ask clarifying questions, and recommend a complete
            diagnostic if warranted.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <BEButton to="/contact?intent=school-health-review" variant="primary">
              Schedule a School Health Review Call <ArrowRight className="h-4 w-4" />
            </BEButton>
            <BEButton to="/contact?intent=complete-diagnostic" variant="outlineLight">
              Request a Complete Diagnostic
            </BEButton>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white underline disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {downloading ? 'Preparing PDF…' : 'Download Preliminary PDF'}
          </button>
        </div>
      </Container>
    </div>
  );
}
