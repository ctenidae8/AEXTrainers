'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RedeemPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, email, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
    } else {
      router.push('/login?redeemed=1')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <header style={{ position: 'absolute', top: 0, left: 0, padding: '12px 20px', fontSize: 13, color: '#8a8f98', fontWeight: 500, letterSpacing: '0.02em' }}>
        aex.training
      </header>
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ color: '#c8ccd4', fontSize: 15, margin: 0 }}>Redeem access code</p>
        <input
          type="text"
          placeholder="Access code"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          style={inputStyle}
        />
        {error && <p style={{ color: '#e07070', fontSize: 13, margin: 0 }}>{error}</p>}
        <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
          {loading ? 'Redeeming...' : 'Redeem'}
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#1a1c23',
  border: '1px solid #2a2d36',
  borderRadius: 6,
  padding: '10px 14px',
  color: '#c8ccd4',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  background: '#1a1c23',
  border: '1px solid #2a2d36',
  borderRadius: 6,
  padding: '10px 18px',
  color: '#c8ccd4',
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
}
