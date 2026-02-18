'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // If not paid, redirect to enroll (where they can complete payment)
      if (!data.user.course_paid) {
        router.push('/enroll')
        return
      }

      router.push('/course-1')
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#6f7681', marginBottom: 12, textTransform: 'uppercase', fontWeight: 500 }}>AEXTrainers</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e8eaef', margin: '0 0 8px' }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: '#6f7681', margin: 0 }}>Log in to continue your training with Joan.</p>
        </div>

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
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', background: '#161820', border: '1px solid #2a2d36', borderRadius: 6, padding: '10px 12px', color: '#d4d7de', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ color: '#d4a0a0', fontSize: 13, padding: '8px 12px', background: '#2a1a1a', border: '1px solid #4a2a2a', borderRadius: 6 }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? '#2a2d36' : '#c97d3c', color: loading ? '#6f7681' : '#0f1117',
            border: 'none', borderRadius: 6, padding: '12px', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s', marginTop: 4,
          }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="/forgot-password" style={{ color: '#6f7681', fontSize: 13, textDecoration: 'none' }}>Forgot your password?</a>
          <a href="/enroll" style={{ color: '#6f7681', fontSize: 13, textDecoration: 'none' }}>Need an account? <span style={{ color: '#c97d3c' }}>Enroll</span></a>
        </div>
      </div>
    </div>
  )
}
