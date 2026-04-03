'use client'

import { useState } from 'react'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course: 'joan' }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || !data.url) {
      setError('Something went wrong. Try again.')
      return
    }
    window.location.href = data.url
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <header style={{
        padding: '12px 20px',
        fontSize: 13,
        color: '#8a8f98',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        aex.training
      </header>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px 48px',
        gap: 32,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <p style={{ fontSize: 22, fontWeight: 600, color: '#c8ccd4', marginBottom: 16 }}>
            Joan&apos;s Course
          </p>
          <p style={{ fontSize: 14, color: '#8a8f98', lineHeight: 1.8, marginBottom: 12 }}>
            Most people who try to use AI agents get stuck in the same place: they can prompt a single model, but they can&apos;t coordinate a team. They can get an answer, but they can&apos;t build a system that produces reliable answers repeatedly, on complex tasks, without babysitting every step.
          </p>
          <p style={{ fontSize: 14, color: '#8a8f98', lineHeight: 1.8, marginBottom: 0 }}>
            Joan teaches you to build and run a three-agent stack — a coordinated team where each agent has a defined role, clear scope, and a handoff protocol. You don&apos;t read about this. You build it, session by session, on a real problem you bring to the course.
          </p>
        </div>

        <div style={{
          background: '#1e2128',
          border: '1px solid #343840',
          borderRadius: 8,
          padding: '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          minWidth: 280,
          maxWidth: 420,
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: '#c8ccd4' }}>$67</span>
            <span style={{ fontSize: 14, color: '#8a8f98', marginLeft: 8 }}>early access</span>
          </div>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%',
          }}>
            {[
              'Four to six live sessions \u2014 paced to how fast you move',
              'Three-agent stack built hands-on, on your own project',
              'Identity cards: defined scope, role, and boundaries for each agent',
              'Carry-forward methodology \u2014 how context moves between agents without getting lost',
              'Handoff protocols \u2014 how agents brief each other when passing work',
              'Failure handling \u2014 what to do when an agent drifts, loops, or produces garbage',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: 13,
                color: '#8a8f98',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                lineHeight: 1.6,
              }}>
                <span style={{ color: '#6fbf73', flexShrink: 0, marginTop: 2 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div style={{
            width: '100%',
            borderTop: '1px solid #2a2d36',
            paddingTop: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            <p style={{ fontSize: 11, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
              What you leave with
            </p>
            <p style={{ fontSize: 13, color: '#8a8f98', lineHeight: 1.6, margin: 0 }}>
              A working methodology. Identity cards for each agent in your stack. The ability to design, test, and run a coordinated agent team on any problem — not just the one you built in the course.
            </p>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading}
            style={{
              width: '100%',
              background: '#1a1c23',
              border: '1px solid #c97d3c',
              borderRadius: 6,
              padding: '12px 24px',
              color: '#c97d3c',
              fontSize: 15,
              fontWeight: 500,
              cursor: loading ? 'default' : 'pointer',
              fontFamily: 'inherit',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.target as HTMLElement).style.color = '#e09050'
                ;(e.target as HTMLElement).style.borderColor = '#e09050'
              }
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = '#c97d3c'
              ;(e.target as HTMLElement).style.borderColor = '#c97d3c'
            }}
          >
            {loading ? 'Redirecting to checkout...' : 'Enroll now →'}
          </button>

          {error && <p style={{ fontSize: 13, color: '#e07070', margin: 0 }}>{error}</p>}

          <p style={{ fontSize: 12, color: '#555', margin: 0, textAlign: 'center' }}>
            Have an access code?{' '}
            <a href="/redeem" style={{ color: '#8a8f98', textDecoration: 'none' }}>
              Redeem it here.
            </a>
          </p>

          <p style={{ fontSize: 11, color: '#444', margin: 0, textAlign: 'center' }}>
            <a href="/about" style={{ color: '#555', textDecoration: 'none' }}>About</a>
            {' · '}
            <a href="/terms" style={{ color: '#555', textDecoration: 'none' }}>Terms</a>
            {' · '}
            <a href="/privacy" style={{ color: '#555', textDecoration: 'none' }}>Privacy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
