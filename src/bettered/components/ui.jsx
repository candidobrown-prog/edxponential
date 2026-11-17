import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Shared, lightweight primitives for the BetterEd Solutions marketing site.
// Deliberately separate from the app's shadcn Button/Card so this section's
// visual system (near-black + deep orange, bold editorial type) never bleeds
// into — or gets bled on by — the rest of the application.

export function Container({ className, children }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', className)}>{children}</div>;
}

export function Eyebrow({ children, light = false, className }) {
  return (
    <p
      className={cn(
        'text-xs sm:text-sm font-bold uppercase tracking-[0.18em]',
        light ? 'text-bettered-orange' : 'text-bettered-orange',
        className
      )}
    >
      {children}
    </p>
  );
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none';

const buttonVariants = {
  primary: 'bg-bettered-orange text-black hover:bg-bettered-orangedark px-6 py-3 text-sm',
  dark: 'bg-bettered-ink text-white hover:bg-black px-6 py-3 text-sm',
  outline: 'border-2 border-bettered-ink text-bettered-ink hover:bg-bettered-ink hover:text-white px-6 py-3 text-sm',
  outlineLight: 'border-2 border-white text-white hover:bg-white hover:text-bettered-ink px-6 py-3 text-sm',
  ghost: 'text-bettered-ink hover:text-bettered-orange px-2 py-2 text-sm normal-case font-semibold tracking-normal',
};

export function BEButton({ to, href, onClick, variant = 'primary', className, children, type, external = false, ...rest }) {
  const cls = cn(buttonBase, buttonVariants[variant], className);
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type || 'button'} onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}

export function Pill({ children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-bettered-lightgray px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bettered-midgray', className)}>
      {children}
    </span>
  );
}

export function Stat({ value, label, dark = false }) {
  return (
    <div>
      <div className={cn('font-black text-4xl sm:text-5xl tracking-tight', dark ? 'text-white' : 'text-bettered-ink')}>
        <span className="text-bettered-orange">{value}</span>
      </div>
      <p className={cn('mt-2 text-sm font-medium', dark ? 'text-white/70' : 'text-bettered-midgray')}>{label}</p>
    </div>
  );
}

export function Disclaimer({ children, className }) {
  return (
    <p className={cn('text-xs leading-relaxed text-bettered-midgray border-l-2 border-bettered-lightgray pl-4', className)}>
      {children}
    </p>
  );
}

export function SectionLabel({ children }) {
  return <Eyebrow>{children}</Eyebrow>;
}

// Breadcrumb trail used on deep pages (services, academies, case studies, etc.)
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-bettered-midgray">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.to || item.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-bettered-orange font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-bettered-ink font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
