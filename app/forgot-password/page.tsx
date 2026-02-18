'use client'

import { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        setError('Failed to send reset email')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#6f7681', marginBottom: 12, textTransform: 'uppercase', fontWeight: 500 }}>AEXTrainers</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e8eaef', margin: '0 0 8px' }}>Reset Password</h1>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#8a8f98', lineHeight: 1.6 }}>If an account exists with that email, you&apos;ll receive a reset link shortly. Check your inbox.</p>
            <a href="/login" style={{ color: '#c97d3c', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginTop: 16 }}>Back to login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#8a8f98', display: 'block', marginBottom: 4 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', background: '#161820', border: '1px solid #2a2d36', borderRadius: 6, padding: '10px 12px', color: '#d4d7de', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ color: '#d4a0a0', fontSize: 13, padding: '8px 12px', background: '#2a1a1a', border: '1px solid #4a2a2a', borderRadius: 6 }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#2a2d36' : '#c97d3c', color: loading ? '#6f7681' : '#0f1117',
              border: 'none', borderRadius: 6, padding: '12px', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s',
            }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <a href="/login" style={{ color: '#6f7681', fontSize: 13, textDecoration: 'none' }}>Back to login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
