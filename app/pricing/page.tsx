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
        padding: '0 24px',
        gap: 32,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <p style={{ fontSize: 22, fontWeight: 600, color: '#c8ccd4', marginBottom: 12 }}>
            Joan&apos;s Course
          </p>
          <p style={{ fontSize: 14, color: '#8a8f98', lineHeight: 1.7, margin: 0 }}>
            Four to six live sessions. You build and run a three-agent stack from scratch.
            By the end, you have a working methodology and the identity cards to prove it.
          </p>
        </div>

        <div style={{
          background: '#13151b',
          border: '1px solid #2a2d36',
          borderRadius: 8,
          padding: '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          minWidth: 280,
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
              'Live conversation with Joan across 4\u20136 sessions',
              'Three-agent stack built hands-on',
              'Identity cards and carry-forward methodology',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: 13,
                color: '#8a8f98',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}>
                <span style={{ color: '#6fbf73', flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

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
        </div>
      </div>
    </div>
  )
}
