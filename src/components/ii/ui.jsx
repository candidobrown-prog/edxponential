import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, Info, Loader2, ShieldAlert, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// BetterEd palette
export const C = { navy: '#0B1F3A', harbor: '#1A5FB4', yellow: '#FFC20E', paper: '#F6F4EE', mist: '#E3E9F1', slate: '#4F5B6D' };

export function PageHeader({ title, subtitle, crumbs = [], actions, freshness }) {
  return (
    <header className="mb-6">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="text-xs mb-2" style={{ color: C.slate }}>
          {crumbs.map((c, i) => (<span key={i}>{i > 0 && <span aria-hidden className="mx-1.5">/</span>}{c.to ? <Link to={c.to} className="hover:underline">{c.label}</Link> : <span aria-current="page">{c.label}</span>}</span>))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: C.navy }}>{title}</h1>
          {subtitle && <p className="text-sm mt-1 max-w-2xl" style={{ color: C.slate }}>{subtitle}</p>}
          {freshness && <p className="text-[11px] mt-1" style={{ color: C.slate }}>Data as of {new Date(freshness).toLocaleString()}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function Card({ title, children, className, right, id }) {
  return (
    <section id={id} aria-labelledby={title ? `${id || title}-h` : undefined} className={cn('bg-white border rounded-xl p-5', className)} style={{ borderColor: C.mist }}>
      {(title || right) && <div className="flex items-center justify-between mb-3"><h2 id={`${id || title}-h`} className="text-sm font-bold uppercase tracking-wide" style={{ color: C.slate }}>{title}</h2>{right}</div>}
      {children}
    </section>
  );
}

export function Btn({ children, variant = 'primary', size = 'md', className, as: As = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base', xl: 'h-16 px-8 text-lg' };
  const variants = { primary: 'text-white', secondary: 'bg-white border hover:bg-[#F6F4EE]', ghost: 'hover:bg-[#E3E9F1]', danger: 'bg-red-600 text-white hover:bg-red-700', accent: 'text-[#0B1F3A]' };
  const style = variant === 'primary' ? { background: C.harbor, outlineColor: C.harbor } : variant === 'accent' ? { background: C.yellow } : variant === 'secondary' ? { borderColor: C.mist, color: C.navy } : { color: C.navy };
  return <As className={cn(base, sizes[size], variants[variant], className)} style={style} {...props}>{children}</As>;
}

export function Field({ label, hint, error, children, required }) {
  const id = React.useId();
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-xs font-semibold mb-1" style={{ color: C.navy }}>{label}{required && <span aria-hidden className="text-red-600"> *</span>}</span>
      {React.cloneElement(children, { id, 'aria-invalid': !!error, 'aria-describedby': hint || error ? `${id}-d` : undefined })}
      {(hint || error) && <span id={`${id}-d`} className={cn('block text-[11px] mt-1', error ? 'text-red-700' : '')} style={error ? {} : { color: C.slate }}>{error || hint}</span>}
    </label>
  );
}
export const inputCls = 'w-full h-10 px-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5FB4]';
export const Input = React.forwardRef((p, ref) => <input ref={ref} {...p} className={cn(inputCls, p.className)} style={{ borderColor: C.mist }} />);
Input.displayName = 'Input';
export const Textarea = React.forwardRef((p, ref) => <textarea ref={ref} rows={4} {...p} className={cn('w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5FB4]', p.className)} style={{ borderColor: C.mist }} />);
Textarea.displayName = 'Textarea';
export const Select = React.forwardRef((p, ref) => <select ref={ref} {...p} className={cn(inputCls, p.className)} style={{ borderColor: C.mist }} />);
Select.displayName = 'Select';

/** Explicit UI states required by §3.13 */
export function State({ kind = 'empty', title, detail, action, className }) {
  const map = {
    loading: { icon: Loader2, spin: true, color: C.harbor, bg: '#fff' }, processing: { icon: Loader2, spin: true, color: C.harbor, bg: '#fff' },
    empty: { icon: Info, color: C.slate, bg: C.paper }, insufficient: { icon: Info, color: C.slate, bg: C.paper },
    error: { icon: XCircle, color: '#b91c1c', bg: '#fef2f2' }, denied: { icon: ShieldAlert, color: '#b91c1c', bg: '#fef2f2' },
    warning: { icon: AlertTriangle, color: '#92400e', bg: '#fffbeb' }, delayed: { icon: Clock, color: '#92400e', bg: '#fffbeb' }, success: { icon: CheckCircle2, color: '#166534', bg: '#f0fdf4' },
  }[kind] || {};
  const Icon = map.icon || Info;
  return (
    <div role={kind === 'error' || kind === 'denied' ? 'alert' : 'status'} aria-live={kind === 'loading' || kind === 'processing' ? 'polite' : undefined} className={cn('rounded-xl border p-5 flex gap-3 items-start', className)} style={{ background: map.bg, borderColor: C.mist }}>
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', map.spin && 'animate-spin')} style={{ color: map.color }} aria-hidden />
      <div className="min-w-0"><p className="text-sm font-semibold" style={{ color: C.navy }}>{title}</p>{detail && <p className="text-sm mt-0.5" style={{ color: C.slate }}>{detail}</p>}{action && <div className="mt-3">{action}</div>}</div>
    </div>
  );
}

export function Pill({ children, tone = 'neutral', title }) {
  const tones = { neutral: { bg: C.mist, fg: C.navy }, good: { bg: '#dcfce7', fg: '#166534' }, warn: { bg: '#fef3c7', fg: '#92400e' }, bad: { bg: '#fee2e2', fg: '#991b1b' }, info: { bg: '#dbeafe', fg: '#1e3a8a' }, accent: { bg: C.yellow, fg: C.navy } }[tone];
  return <span title={title} className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: tones.bg, color: tones.fg }}>{children}</span>;
}
export const Verified = ({ ok }) => (ok === false ? <Pill tone="bad" title="This quotation could not be found verbatim in the transcript">Unverified quote</Pill> : ok === true ? <Pill tone="good">Verified</Pill> : null);
export const Confidence = ({ value }) => { if (value === null || value === undefined) return null; const v = typeof value === 'number' ? (value >= 0.75 ? 'high' : value >= 0.45 ? 'moderate' : 'low') : value; return <Pill tone={v === 'high' ? 'good' : v === 'moderate' ? 'warn' : 'neutral'}>Confidence: {v}</Pill>; };

export function Stat({ label, value, sub, tone }) {
  return (<div className="rounded-xl border p-4 bg-white" style={{ borderColor: C.mist }}><p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.slate }}>{label}</p><p className="text-2xl font-bold mt-1" style={{ color: tone === 'warn' ? '#92400e' : C.navy }}>{value ?? '–'}</p>{sub && <p className="text-[11px] mt-0.5" style={{ color: C.slate }}>{sub}</p>}</div>);
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div role="tablist" aria-label="Sections" className="flex flex-wrap gap-1 border-b mb-4" style={{ borderColor: C.mist }}>
      {tabs.map((t) => (
        <button key={t.key} role="tab" aria-selected={value === t.key} onClick={() => onChange(t.key)} className={cn('px-3 py-2 text-sm font-semibold border-b-2 -mb-px focus-visible:outline focus-visible:outline-2', value === t.key ? '' : 'border-transparent hover:bg-[#F6F4EE]')} style={value === t.key ? { borderColor: C.harbor, color: C.harbor } : { color: C.slate }}>
          {t.label}{t.count !== undefined && <span className="ml-1.5 text-[10px] rounded-full px-1.5 py-0.5" style={{ background: C.mist, color: C.navy }}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function useErr() { const [err, setErr] = React.useState(null); const run = React.useCallback(async (fn) => { setErr(null); try { return await fn(); } catch (e) { setErr(e?.message || String(e)); throw e; } }, []); return [err, run, setErr]; }
export const ErrorNote = ({ error, onRetry }) => (error ? <State kind="error" title="Something didn't work" detail={error} action={onRetry && <Btn size="sm" variant="secondary" onClick={onRetry}>Try again</Btn>} /> : null);
