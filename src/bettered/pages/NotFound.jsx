import React from 'react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, BEButton } from '@/bettered/components/ui';

export default function NotFound() {
  useDocumentTitle('Page Not Found', undefined);

  return (
    <Container className="py-24 sm:py-32 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-bettered-orange mb-4">404</p>
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 max-w-2xl mx-auto">
        This page needs a better plan.
      </h1>
      <p className="text-bettered-charcoal/80 max-w-md mx-auto mb-8">
        The page you requested could not be found.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <BEButton to="/" variant="primary">
          Return Home
        </BEButton>
        <BEButton to="/school-health-index/start" variant="outline">
          Take the School Health Index
        </BEButton>
        <BEButton to="/contact" variant="outline">
          Contact BetterEd
        </BEButton>
      </div>
    </Container>
  );
}
