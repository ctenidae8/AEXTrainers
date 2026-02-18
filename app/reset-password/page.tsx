'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setError(data.error || 'Reset failed')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#d4a0a0', fontSize: 14 }}>Invalid reset link. <a href="/forgot-password" style={{ color: '#c97d3c' }}>Request a new one</a></p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#6f7681', marginBottom: 12, textTransform: 'uppercase', fontWeight: 500 }}>AEXTrainers</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e8eaef', margin: '0 0 8px' }}>Set New Password</h1>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6fbf73', fontSize: 14 }}>Password reset successfully. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#8a8f98', display: 'block', marginBottom: 4 }}>New Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                style={{ width: '100%', background: '#161820', border: '1px solid #2a2d36', borderRadius: 6, padding: '10px 12px', color: '#d4d7de', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#8a8f98', display: 'block', marginBottom: 4 }}>Confirm New Password</label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#6f7681', fontSize: 14 }}>Loading...</span></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
