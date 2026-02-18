'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function EnrollContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [existingUser, setExistingUser] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const cancelled = params.get('payment') === 'cancelled'

  // Check if user is already logged in but unpaid — show re-checkout option
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          if (data.user.course_paid) {
            // Already paid — go to course
            router.push('/course-1')
          } else {
            // Logged in but unpaid — show re-checkout
            setExistingUser(true)
          }
        }
      } catch {
        // Not logged in — show registration form
      }
    }
    checkAuth()
  }, [router])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const stripeRes = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      const stripeData = await stripeRes.json()
      if (stripeData.url) {
        window.location.href = stripeData.url
      } else {
        setError('Failed to create checkout session')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      // Step 1: Create account
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const regData = await regRes.json()

      if (!regRes.ok) {
        setError(regData.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Step 2: Redirect to Stripe checkout
      await handleCheckout()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#6f7681', marginBottom: 12, textTransform: 'uppercase', fontWeight: 500 }}>AEXTrainers</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e8eaef', margin: '0 0 8px' }}>
            {existingUser ? 'Complete Payment' : 'Create Your Account'}
          </h1>
          <p style={{ fontSize: 14, color: '#6f7681', margin: 0 }}>
            {existingUser
              ? 'Your account is ready. Complete payment to start training with Joan.'
              : "You'll be assigned an AEX identity and directed to payment."}
          </p>
        </div>

        {cancelled && (
          <div style={{ background: '#2a1a1a', border: '1px solid #4a2a2a', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#d4a0a0' }}>
            Payment was cancelled. {existingUser ? 'Click below to try again.' : 'Your account has been created — complete payment below.'}
          </div>
        )}

        {existingUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{ color: '#d4a0a0', fontSize: 13, padding: '8px 12px', background: '#2a1a1a', border: '1px solid #4a2a2a', borderRadius: 6 }}>{error}</div>
            )}
            <button onClick={handleCheckout} disabled={loading} style={{
              background: loading ? '#2a2d36' : '#c97d3c', color: loading ? '#6f7681' : '#0f1117',
              border: 'none', borderRadius: 6, padding: '12px', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s',
            }}>
              {loading ? 'Redirecting to payment...' : 'Pay — $67'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <a href="/api/auth/logout" onClick={async (e) => { e.preventDefault(); await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }} style={{ color: '#6f7681', fontSize: 12, textDecoration: 'none', cursor: 'pointer' }}>
                Not you? <span style={{ color: '#c97d3c' }}>Log out</span>
              </a>
            </div>
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
            <div>
              <label style={{ fontSize: 12, color: '#8a8f98', display: 'block', marginBottom: 4 }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                style={{ width: '100%', background: '#161820', border: '1px solid #2a2d36', borderRadius: 6, padding: '10px 12px', color: '#d4d7de', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#8a8f98', display: 'block', marginBottom: 4 }}>Confirm Password</label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8}
                style={{ width: '100%', background: '#161820', border: '1px solid #2a2d36', borderRadius: 6, padding: '10px 12px', color: '#d4d7de', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ fontSize: 12, color: '#6f7681', lineHeight: 1.5, padding: '4px 0' }}>
              By creating an account, you opt in to the AEX Protocol. Your AEX identity starts provisional — it becomes active when you complete the course.
            </div>

            {error && (
              <div style={{ color: '#d4a0a0', fontSize: 13, padding: '8px 12px', background: '#2a1a1a', border: '1px solid #4a2a2a', borderRadius: 6 }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#2a2d36' : '#c97d3c', color: loading ? '#6f7681' : '#0f1117',
              border: 'none', borderRadius: 6, padding: '12px', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s', marginTop: 4,
            }}>
              {loading ? 'Creating account...' : 'Create Account & Pay — $67'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/login" style={{ color: '#6f7681', fontSize: 13, textDecoration: 'none' }}>Already have an account? <span style={{ color: '#c97d3c' }}>Log in</span></a>
        </div>
      </div>
    </div>
  )
}

export default function Enroll() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#6f7681', fontSize: 14 }}>Loading...</span></div>}>
      <EnrollContent />
    </Suspense>
  )
}
