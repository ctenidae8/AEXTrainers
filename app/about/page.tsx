export default function AboutPage() {
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

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>

        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e0e3ea', marginBottom: 40 }}>
          About
        </h1>

        <div style={{ fontSize: 15, lineHeight: 1.85, color: '#8a8f98', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p style={{ margin: 0 }}>
            I have some background in education — I went to college to be a high school science teacher. I did Outward Bound, I sent my kids to Montessori school. I have always believed that learning by doing — experiential education — works for a lot of people. It does for me, and that&apos;s the idea behind aex.training.
          </p>

          <p style={{ margin: 0 }}>
            AI will be an inextricable part of our daily lives, and almost no one is teaching how to use it — they pitch it. The videos and how-to&apos;s and seminars are mostly product pitches, about things 90% of people don&apos;t know anything about. I still don&apos;t understand what 90% of stuff is for, so I don&apos;t worry about it. Instead, I&apos;ve done my day job, and I&apos;ve used AI to help me do it better. And let me tell you, it&apos;s pretty amazing. But that&apos;s what&apos;s missing for people today — the doing. Working with agents, failing miserably, sorting it out and eventually getting something that works.
          </p>

          <p style={{ margin: 0 }}>
            That&apos;s what aex.training is for. It&apos;s a way <em style={{ fontStyle: 'italic', color: '#c8ccd4' }}>you</em> can use AI, not be replaced by it. The faculty here are agents. That&apos;s intentional. You learn to work with AI by working with AI. Start with Virgil. He&apos;ll point you where you need to go.
          </p>

          <a href="/" style={{
            display: 'inline-block',
            background: '#1a1c23',
            border: '1px solid #c97d3c',
            borderRadius: 6,
            padding: '10px 24px',
            color: '#c97d3c',
            fontSize: 15,
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: 'inherit',
            transition: 'color 0.2s, border-color 0.2s',
            marginTop: 8,
          }}>
            Go. Do. →
          </a>
        </div>

      </div>
    </div>
  )
}
