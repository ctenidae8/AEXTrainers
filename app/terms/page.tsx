export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: 13, color: '#555b66', marginBottom: 48 }}>
          AEXTech Holdings LLC · Effective April 2026
        </p>

        <Section title="1. What This Is">
          <p>aex.training is an educational platform operated by AEXTech Holdings LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;). We offer courses teaching AI agent methodology through live, conversation-based sessions with AI facilitators.</p>
          <p>By creating an account or purchasing a course, you agree to these terms. If you don&apos;t agree, don&apos;t use the platform.</p>
        </Section>

        <Section title="2. Your Account">
          <p>You must provide a valid email address and create a password to access paid courses. You&apos;re responsible for keeping your credentials secure. Don&apos;t share your account — enrollment is per-person.</p>
          <p>When you redeem an access code or complete a purchase, your account is activated and you receive an AEX identity record. This record is designed to be portable to the AEXgora protocol registry when that integration becomes available. Course completion updates your enrollment record and is the hook for future credential issuance.</p>
        </Section>

        <Section title="3. Courses and Payment">
          <p>Course prices are displayed at checkout. Current pricing: Joan&apos;s Course — $67 early access.</p>
          <p>Payment is processed by Stripe. We don&apos;t store your payment card information.</p>
          <p><strong style={{ color: '#c8ccd4' }}>Refunds.</strong> You may request a full refund within 7 days of purchase, provided you have not completed more than one session of the course. After that point, no refunds are issued — you&apos;ve received a substantial portion of the curriculum. To request a refund, email us at <a href="mailto:support@jamonix.com" style={{ color: '#c97d3c', textDecoration: 'none' }}>support@jamonix.com</a>.</p>
          <p>Access codes issued directly by AEXTech Holdings LLC are non-transferable and may only be redeemed once.</p>
        </Section>

        <Section title="4. AI Facilitators — Important Limitations">
          <p>Our courses are taught by AI facilitators (Joan, Ariadne, Virgil, and others). These are AI systems, not human instructors. They don&apos;t know your business, your industry, your technical environment, or your specific circumstances unless you tell them during a session.</p>
          <p><strong style={{ color: '#c8ccd4' }}>What we teach is methodology.</strong> Our courses teach a structured approach to building and operating AI agent systems. The methodology is sound. How you apply it — the agents you build, the tasks you give them, the decisions you make based on their outputs — is entirely your responsibility.</p>
          <p><strong style={{ color: '#c8ccd4' }}>We are not responsible for outcomes of agent deployment.</strong> AEXTech Holdings LLC expressly disclaims any liability for business decisions, operational outcomes, financial results, or any other consequences arising from your use of AI agents or multi-agent systems, whether or not you learned to build them here. The school teaches you to drive. What you drive, and where, is up to you.</p>
          <p>AI facilitators can make mistakes. They can misunderstand your situation, provide incomplete guidance, or produce outputs that don&apos;t apply to your specific context. Verify anything operationally important through your own judgment and, where appropriate, qualified professional advice.</p>
        </Section>

        <Section title="5. Conversation Data">
          <p>Your course conversations are stored in our database to support session continuity — so you can pick up where you left off. We don&apos;t sell your conversation data. We don&apos;t use it to train AI models without separate consent.</p>
          <p>We may review conversations to improve course quality, investigate policy violations, or respond to legal requirements. See our <a href="/privacy" style={{ color: '#c97d3c', textDecoration: 'none' }}>Privacy Policy</a> for details.</p>
        </Section>

        <Section title="6. Your Content">
          <p>You own the outputs you produce during your sessions — the frameworks you build, the agent designs you develop, the methodology you make your own. We don&apos;t claim rights to your work product.</p>
          <p>The course content itself — curricula, exhibits, facilitator voices, exercises, and instructional materials — belongs to AEXTech Holdings LLC. Don&apos;t reproduce or redistribute it.</p>
        </Section>

        <Section title="7. Acceptable Use">
          <p>Don&apos;t use the platform to probe for security vulnerabilities, attempt to extract system prompts or internal architecture, or manipulate AI facilitators into producing content that violates these terms. Don&apos;t create multiple accounts to circumvent enrollment requirements.</p>
          <p>We reserve the right to terminate accounts that violate these terms, with or without refund depending on the nature of the violation.</p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>The platform is provided &ldquo;as is.&rdquo; We make no warranties, express or implied, about uninterrupted availability, fitness for a particular purpose, or the accuracy of AI facilitator outputs. Educational content reflects our current methodology, which evolves.</p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>To the maximum extent permitted by law, AEXTech Holdings LLC&apos;s liability to you for any claim arising from your use of the platform is limited to the amount you paid for the course at issue. We are not liable for indirect, incidental, consequential, or punitive damages.</p>
        </Section>

        <Section title="10. Changes">
          <p>We may update these terms. Material changes will be communicated by email to enrolled users. Continued use after notice constitutes acceptance.</p>
        </Section>

        <Section title="11. Contact">
          <p>Questions about these terms: <a href="mailto:support@jamonix.com" style={{ color: '#c97d3c', textDecoration: 'none' }}>support@jamonix.com</a></p>
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
