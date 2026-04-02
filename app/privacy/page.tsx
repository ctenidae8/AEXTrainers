export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#c8ccd4',
    }}>
      <header style={{
        padding: '12px 20px',
        borderBottom: '1px solid #1a1c23',
        fontSize: 13,
        color: '#8a8f98',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        <a href="/" style={{ color: '#8a8f98', textDecoration: 'none' }}>aex.training</a>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>

        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e0e3ea', marginBottom: 6 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: '#555b66', marginBottom: 48 }}>
          AEXTech Holdings LLC · Effective April 2026
        </p>

        <Section title="1. What We Collect">
          <p>We collect the minimum information required to run the platform.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Account data.</strong> When you create an account, we collect your email address and a hashed version of your password. We never store your password in plain text.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Course conversations.</strong> Your conversations with AI facilitators (Virgil, Ariadne, Joan, and others) are stored in our database. This is required to support session continuity — so you can return to a course and pick up where you left off.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Enrollment and completion records.</strong> We record which courses you&apos;ve enrolled in, when you enrolled, and when you completed them. Completion records are the hook for future credential issuance through the AEXgora protocol registry.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Payment data.</strong> Payments are processed by Stripe. We receive a record of the transaction (amount, course, timestamp) and your email address as provided to Stripe. We do not store your payment card number or full payment details.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Usage data.</strong> We collect standard server logs including IP addresses, browser and device information, and pages accessed. This data is used for security, fraud prevention, and platform reliability.</p>
        </Section>

        <Section title="2. How We Use It">
          <p>We use what we collect to operate the platform: to authenticate you, deliver course content, process payments, and maintain your session history.</p>
          <p>We do not use your conversation data to train AI models without your separate, explicit consent.</p>
          <p>We may review conversation data to investigate policy violations, improve course quality, or respond to legal requirements. Human review is limited to what is necessary for these purposes.</p>
          <p>We use transaction records for financial accounting and legal compliance. Payment records are retained for a minimum of seven years regardless of account status.</p>
        </Section>

        <Section title="3. What We Share">
          <p><strong style={{ color: '#c8ccd4' }}>Stripe.</strong> We share your email address and transaction details with Stripe to process payments. Stripe&apos;s use of your data is governed by <a href="https://stripe.com/privacy" style={{ color: '#c97d3c', textDecoration: 'none' }}>Stripe&apos;s Privacy Policy</a>.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Infrastructure providers.</strong> Our platform runs on third-party hosting infrastructure (currently Vercel and associated services). These providers may have incidental access to platform data in the course of providing their services. They are not permitted to use your data for their own purposes.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Legal requirements.</strong> We may disclose your data to law enforcement or regulatory authorities when required by law, valid legal process, or to protect the safety of users or the public.</p>
          <p><strong style={{ color: '#c8ccd4' }}>We do not sell your data.</strong> We do not sell your personal data to third parties. We do not share your data with advertisers.</p>
        </Section>

        <Section title="4. What's Visible to Others">
          <p>aex.training is not a social platform. Your account data, conversation history, and enrollment records are not visible to other users.</p>
          <p>When the AEXgora integration becomes available, course completion credentials may become visible through the protocol registry in accordance with how you configure your AEX identity record at that time. No data is shared with AEXgora systems before that integration exists.</p>
        </Section>

        <Section title="5. Data Retention and Deletion">
          <p>Your data is retained for as long as your account is active.</p>
          <p>When you delete your account, your email address, password, conversation history, and enrollment records are permanently deleted. Deletion is irreversible.</p>
          <p>Financial transaction records are retained for seven years following the transaction date for legal and tax compliance, regardless of account status. Retained records are anonymized where technically feasible.</p>
          <p>To delete your account, contact <a href="mailto:support@jamonix.com" style={{ color: '#c97d3c', textDecoration: 'none' }}>support@jamonix.com</a>. We will process deletion requests within 30 days.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on your jurisdiction, you may have rights to access, correct, delete, or receive a portable copy of your personal data. To exercise any of these rights, contact <a href="mailto:support@jamonix.com" style={{ color: '#c97d3c', textDecoration: 'none' }}>support@jamonix.com</a>. We will respond within 30 days.</p>
          <p><strong style={{ color: '#c8ccd4' }}>California residents (CCPA).</strong> AEXTech Holdings LLC does not sell personal data. No opt-out mechanism is required, but you may contact us to confirm this or exercise other CCPA rights.</p>
        </Section>

        <Section title="7. Security">
          <p>We use industry-standard security practices: encryption in transit (TLS), encrypted storage for sensitive data, and access controls limiting who can reach production systems. Passwords are stored as bcrypt hashes and are never recoverable in plain text.</p>
          <p>No system is impenetrable. In the event of a data breach affecting your personal data, we will notify you and applicable regulatory authorities as required by law.</p>
        </Section>

        <Section title="8. Children">
          <p>aex.training is not directed to individuals under 18. We do not knowingly collect data from minors. If you believe a minor has created an account, contact <a href="mailto:support@jamonix.com" style={{ color: '#c97d3c', textDecoration: 'none' }}>support@jamonix.com</a> and we will delete it.</p>
        </Section>

        <Section title="9. Changes">
          <p>We may update this policy. Material changes will be communicated by email to enrolled users. Continued use after notice constitutes acceptance.</p>
        </Section>

        <Section title="10. Contact">
          <p>Privacy questions or rights requests: <a href="mailto:support@jamonix.com" style={{ color: '#c97d3c', textDecoration: 'none' }}>support@jamonix.com</a></p>
          <p>AEXTech Holdings LLC · aex.training</p>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontSize: 14,
        fontWeight: 600,
        color: '#e0e3ea',
        marginBottom: 14,
        paddingBottom: 8,
        borderBottom: '1px solid #1a1c23',
        letterSpacing: '0.01em',
      }}>
        {title}
      </h2>
      <div style={{
        fontSize: 14,
        lineHeight: 1.75,
        color: '#8a8f98',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {children}
      </div>
    </section>
  )
}
