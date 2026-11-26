import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_COLUMNS, LEGAL_LINKS } from '@/bettered/data/nav';
import { Container, BEButton } from './ui';

export default function Footer() {
  return (
    <footer className="bg-bettered-ink text-white">
      <Container className="py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-bettered-orange mb-3">
              Every day adults delay, a child pays the price.
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-xl">
              Get your school's health score.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <BEButton to="/school-health-index/start" variant="primary">
              Take the School Health Index
            </BEButton>
            <BEButton to="/contact?intent=strategic-consultation" variant="outlineLight">
              Schedule a Consultation
            </BEButton>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50 mb-4">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-white/85 hover:text-bettered-orange transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-white/10 text-xs text-white/50">
          <p>
            &copy; {new Date().getFullYear()} BetterEd Solutions. Founded in Baltimore, Maryland by Candido Brown. All
            rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
