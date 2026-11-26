import React from 'react';
import LegalPage from '@/bettered/components/LegalPage';

export default function Accessibility() {
  return (
    <LegalPage title="Accessibility" updated="January 2026" description="BetterEd Solutions' commitment to a website that works for every visitor, including people using assistive technology.">
      <p>
        BetterEd Solutions is committed to making this website usable by the widest possible audience, including
        people with disabilities and people using assistive technology.
      </p>

      <h2>Our Standard</h2>
      <p>
        We design and build this website with reference to the Web Content Accessibility Guidelines (WCAG) 2.2,
        Level AA, including semantic HTML, keyboard navigation, visible focus states, a skip-to-content link,
        descriptive link text, and sufficient color contrast. Charts and scores on this website are designed not to
        rely on color alone.
      </p>

      <h2>Ongoing Work</h2>
      <p>
        Accessibility is an ongoing effort. As we add new features &mdash; including the School Health Index, client
        portal, and talent marketplace &mdash; we test them against these standards and continue to make
        improvements.
      </p>

      <h2>Reporting an Issue</h2>
      <p>
        If you encounter an accessibility barrier on this website, please let us know through our{' '}
        <a href="/contact">Contact page</a> so we can address it.
      </p>
    </LegalPage>
  );
}
