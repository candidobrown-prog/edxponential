import React from 'react';
import LegalPage from '@/bettered/components/LegalPage';

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="January 2026" description="How BetterEd Solutions collects, uses, and protects information submitted through this website.">
      <p>
        BetterEd Solutions (&ldquo;BetterEd,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects
        your privacy. This Privacy Policy explains what information we collect through this website, how we use
        it, and the choices available to you.
      </p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, including:</p>
      <ul>
        <li>Contact information, such as your name, email address, phone number, job title, and organization</li>
        <li>Information submitted through the BetterEd School Health Index&trade;, including school profile and organizational data</li>
        <li>Documents you choose to upload as part of a diagnostic or engagement</li>
        <li>Information submitted through contact, enrollment, or candidate and employer forms</li>
      </ul>
      <p>
        We also collect limited technical information automatically, such as browser type and general usage data,
        to help us maintain and improve this website.
      </p>

      <h2>How We Use Information</h2>
      <ul>
        <li>To respond to inquiries and provide requested information about BetterEd&rsquo;s services</li>
        <li>To generate preliminary School Health Index results and follow up on them</li>
        <li>To process academy enrollment, talent exchange activity, and related communications</li>
        <li>To improve this website and BetterEd&rsquo;s services</li>
      </ul>

      <h2>How We Do Not Use Information</h2>
      <p>
        BetterEd does not sell personal information. We do not knowingly collect personally identifiable information
        from students through this website.
      </p>

      <h2>Sharing of Information</h2>
      <p>
        We do not share your information with third parties except as needed to operate this website and our
        services (for example, email delivery or payment processing), to comply with the law, or with your
        consent.
      </p>

      <h2>Data Retention &amp; Security</h2>
      <p>
        We retain information for as long as necessary to provide our services and fulfill the purposes described
        in this policy, and we use reasonable administrative, technical, and physical safeguards to protect it.
      </p>

      <h2>Your Choices</h2>
      <p>
        You may contact us at any time to ask what information we hold about you, to request a correction, or to
        request deletion, subject to legal and operational limitations.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about this Privacy Policy can be directed to BetterEd Solutions through our{' '}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPage>
  );
}
