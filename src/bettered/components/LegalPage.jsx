import React from 'react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, Breadcrumbs } from '@/bettered/components/ui';

export default function LegalPage({ title, updated, description, children }) {
  useDocumentTitle(title, description);
  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-16">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-white/60">Last updated: {updated}</p>
        </Container>
      </div>
      <Container className="py-14 max-w-3xl">
        <div className="prose-legal space-y-6 text-bettered-charcoal/85 leading-relaxed [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-bettered-ink [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-bettered-orange [&_a]:font-semibold">
          {children}
        </div>
      </Container>
    </div>
  );
}
