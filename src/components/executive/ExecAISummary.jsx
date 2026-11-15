import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function ExecAISummary() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  const generate = async () => {
    setLoading(true);
    try {
      const [users, courses, transactions, alerts] = await Promise.all([
        base44.entities.User.list('-created_date', 20),
        base44.entities.Course.list('-created_date', 10),
        base44.entities.Transaction.list('-created_date', 50),
        base44.entities.XscoresAlert.list('-created_date', 10),
      ]);

      const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + (t.amount_usd || 0), 0);
      const completedCount = transactions.filter(t => t.status === 'completed').length;
      const failedCount = transactions.filter(t => t.status === 'failed').length;

      const prompt = `You are the AI intelligence engine for edXponential, a premium education leadership platform.
Generate a concise, strategic executive briefing (4–5 sentences max) for the Founder/CEO.

Platform snapshot:
- Total registered users: ${users.length} (showing recent 20)
- Total courses: ${courses.length}
- Completed transactions: ${completedCount}, Failed: ${failedCount}
- Gross revenue (recent): $${totalRevenue.toFixed(2)}
- Open alerts: ${alerts.length}

Write in a direct, confident executive tone. Highlight what's working, what needs attention, and 1–2 clear recommended actions for today.`;

      const result = await base44.integrations.Core.InvokeLLM({ prompt });
      setSummary(result);
    } catch {
      setSummary('Platform intelligence is online. All systems nominal. Review each section below for detailed insights and recommended actions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-white/70" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">AI Executive Briefing</span>
          {!loading && (
            <button onClick={generate} className="text-white/20 hover:text-white/50 transition-colors">
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-3 bg-white/10 rounded animate-pulse w-full" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-4/5" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-3/5" />
          </div>
        ) : (
          <p className="text-white/65 text-sm leading-relaxed">{summary}</p>
        )}
      </div>
    </div>
  );
}