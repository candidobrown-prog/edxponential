import React from 'react';
import LegalPage from '@/bettered/components/LegalPage';

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy" updated="January 2026" description="How BetterEd Solutions uses cookies and similar technology on this website.">
      <p>
        This Cookie Policy explains how BetterEd Solutions uses cookies and similar technologies on this website.
      </p>

      <h2>What Cookies We Use</h2>
      <ul>
        <li><strong>Essential storage:</strong> used to save your progress through the BetterEd School Health Index&trade; in your browser session, so you don&rsquo;t lose your answers while moving between steps.</li>
        <li><strong>Analytics:</strong> where enabled, used in aggregate to understand how visitors use this website so we can improve it.</li>
      </ul>
      <p>We do not use cookies to sell your personal information.</p>

      <h2>Managing Cookies</h2>
      <p>
        Most browsers let you block or delete cookies through their settings. Doing so may affect your ability to
        save progress through the School Health Index or other features of this website.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about this Cookie Policy can be directed to BetterEd Solutions through our{' '}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPage>
  );
}
