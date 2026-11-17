import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, BEButton } from '@/bettered/components/ui';

export default function Login() {
  useDocumentTitle('Client Login', 'Log in to the BetterEd Command Center, the secure portal for BetterEd clients.');

  return (
    <Container className="py-20 sm:py-28 max-w-md text-center">
      <div className="h-14 w-14 rounded-full bg-bettered-offwhite border border-bettered-lightgray flex items-center justify-center mx-auto mb-6">
        <Lock className="h-6 w-6 text-bettered-orange" />
      </div>
      <h1 className="text-3xl font-black tracking-tight mb-3">BetterEd Command Center&trade;</h1>
      <p className="text-bettered-charcoal/80 mb-8">
        The Command Center is BetterEd&rsquo;s secure client portal for active transformation partners. It is
        currently being rolled out to engaged clients.
      </p>
      <div className="space-y-3">
        <BEButton to="/contact?intent=client-login" variant="primary" className="w-full justify-center">
          Request Client Access <ArrowRight className="h-4 w-4" />
        </BEButton>
        <BEButton to="/" variant="outline" className="w-full justify-center">
          Return Home
        </BEButton>
      </div>
    </Container>
  );
}
