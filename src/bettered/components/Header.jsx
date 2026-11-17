import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRIMARY_NAV, ECOSYSTEM_NAV, SECONDARY_NAV } from '@/bettered/data/nav';
import { BEButton } from './ui';
import SearchPalette from './SearchPalette';

// Shorter labels for the dense desktop nav row only; mobile menu and search
// keep the full names from nav.js.
const DESKTOP_LABEL = { 'School Health Index': 'Health Index' };
function NAV_LABEL_OVERRIDES(items) {
  return items.map((item) => ({ ...item, label: DESKTOP_LABEL[item.label] || item.label }));
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="BetterEd Solutions home">
      <span className="font-black text-xl tracking-tight text-bettered-ink">
        Better<span className="text-bettered-orange">Ed</span>
      </span>
      <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.2em] text-bettered-midgray border-l border-bettered-lightgray pl-2">
        Solutions
      </span>
    </Link>
  );
}

function EcosystemDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-sm font-semibold text-bettered-ink hover:text-bettered-orange transition-colors py-2"
      >
        Ecosystem
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1 w-72 rounded-xl border border-bettered-lightgray bg-white shadow-xl py-2 z-50"
        >
          {ECOSYSTEM_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 hover:bg-bettered-offwhite"
            >
              <span className="block text-sm font-bold text-bettered-ink">{item.label}</span>
              <span className="block text-xs text-bettered-midgray">{item.description}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusable = panel ? panel.querySelectorAll('a, button') : [];
    if (focusable.length) focusable[0].focus();

    function onKey(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const allLinks = [...PRIMARY_NAV, ...SECONDARY_NAV];

  return (
    <div className="fixed inset-0 z-[100] bg-bettered-ink" role="dialog" aria-modal="true" aria-label="Site menu">
      <div ref={panelRef} className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="font-black text-xl text-white">
            Better<span className="text-bettered-orange">Ed</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-white hover:text-bettered-orange"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
          <ul className="space-y-1">
            {allLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="block py-3 text-2xl font-bold text-white hover:text-bettered-orange"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50 mb-3">Ecosystem</p>
            <ul className="space-y-1">
              {ECOSYSTEM_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={onClose} className="block py-2 text-base font-semibold text-white/90 hover:text-bettered-orange">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="px-5 py-5 border-t border-white/10 space-y-3">
          <BEButton
            to="/school-health-index/start"
            variant="primary"
            className="w-full"
            onClick={onClose}
          >
            Take the School Health Index
          </BEButton>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="w-full text-center text-sm font-semibold text-white/80 hover:text-white py-2"
          >
            Client Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        href="#bettered-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-bettered-orange focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-bold"
      >
        Skip to content
      </a>
      <header
        className={cn(
          'sticky top-0 z-50 bg-white/95 backdrop-blur border-b transition-shadow',
          scrolled ? 'border-bettered-lightgray shadow-sm' : 'border-transparent'
        )}
      >
        <div className="mx-auto flex h-16 sm:h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />

          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5" aria-label="Primary">
            {NAV_LABEL_OVERRIDES(PRIMARY_NAV.slice(1)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap text-[13px] 2xl:text-sm font-semibold transition-colors',
                    isActive ? 'text-bettered-orange' : 'text-bettered-ink hover:text-bettered-orange'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <EcosystemDropdown />
            {SECONDARY_NAV.slice(0, 2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap text-[13px] 2xl:text-sm font-semibold transition-colors',
                    isActive ? 'text-bettered-orange' : 'text-bettered-ink hover:text-bettered-orange'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search BetterEd Solutions"
              title="Search"
              className="p-2 text-bettered-ink hover:text-bettered-orange rounded-full"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/login"
              aria-label="Client Login"
              title="Client Login"
              className="hidden sm:flex p-2 text-bettered-ink hover:text-bettered-orange rounded-full"
            >
              <UserRound className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="hidden xl:inline-block whitespace-nowrap text-[13px] 2xl:text-sm font-semibold text-bettered-ink hover:text-bettered-orange px-2"
            >
              Contact
            </Link>
            <BEButton
              to="/school-health-index/start"
              variant="primary"
              className="hidden sm:inline-flex !py-2.5 !px-4 2xl:!px-6 !text-[11px] 2xl:!text-sm whitespace-nowrap"
            >
              Take the Index
            </BEButton>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="xl:hidden p-2 text-bettered-ink"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
