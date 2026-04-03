'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redeemed = searchParams.get('redeemed') === '1'
  const purchased = searchParams.get('purchased') === '1'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [isSettingPassword, setIsSettingPassword] = useState(purchased)
  const [setPasswordEmail, setSetPasswordEmail] = useState('')
  const [setPasswordValue, setSetPasswordValue] = useState('')
  const [setPasswordError, setSetPasswordError] = useState('')
  const [setPasswordLoading, setSetPasswordLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/joan')
    }
  }

  const handleSetPassword = async () => {
    setSetPasswordLoading(true)
    setSetPasswordError('')

    const res = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: setPasswordEmail, password: setPasswordValue }),
    })

    if (!res.ok) {
      const data = await res.json()
      setSetPasswordError(data.error || 'Something went wrong.')
      setSetPasswordLoading(false)
      return
    }

    // Auto sign-in after password set
    const result = await signIn('credentials', {
      email: setPasswordEmail,
      password: setPasswordValue,
      redirect: false,
    })
    setSetPasswordLoading(false)
    if (result?.error) {
      setSetPasswordError('Password set, but sign-in failed. Try signing in manually.')
    } else {
      router.push('/joan')
    }
  }

  return (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {isSettingPassword ? (
        <>
          <p style={{ color: '#6fbf73', fontSize: 13, margin: 0 }}>
            Payment confirmed — set a password to access your course.
          </p>
          <input
            type="email"
            placeholder="Email used at checkout"
            value={setPasswordEmail}
            onChange={e => setSetPasswordEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Choose a password (min 8 characters)"
            value={setPasswordValue}
            onChange={e => setSetPasswordValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSetPassword() }}
            style={inputStyle}
          />
          {setPasswordError && (
            <p style={{ color: '#e07070', fontSize: 13, margin: 0 }}>{setPasswordError}</p>
          )}
          <button
            onClick={handleSetPassword}
            disabled={setPasswordLoading}
            style={buttonStyle}
          >
            {setPasswordLoading ? 'Setting up...' : 'Set password and enter →'}
          </button>
          <p style={{ color: '#8a8f98', fontSize: 13, margin: 0 }}>
            Already have a password?{' '}
            <span
              onClick={() => setIsSettingPassword(false)}
              style={{ color: '#c97d3c', cursor: 'pointer' }}
            >
              Sign in instead.
            </span>
          </p>
        </>
      ) : (
        <>
          {redeemed && (
            <p style={{ color: '#6fbf73', fontSize: 13, margin: 0 }}>
              Code redeemed — sign in to continue.
            </p>
          )}
          <p style={{ color: '#c8ccd4', fontSize: 15, margin: 0 }}>Sign in</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
            style={inputStyle}
          />
          {error && <p style={{ color: '#e07070', fontSize: 13, margin: 0 }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p style={{ color: '#8a8f98', fontSize: 13, margin: 0 }}>
            Have an access code?{' '}
            <a href="/redeem" style={{ color: '#c97d3c', textDecoration: 'none' }}>Redeem it here.</a>
          </p>
        </>
      )}
    </div>
  )
}

export default function LoginPage() {
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
        <a href="/" style={{ color: '#8a8f98', textDecoration: 'none' }}>aex.training</a>
      </header>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <footer style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', padding: '16px 0', fontSize: 11, color: '#444' }}>
        <a href="/about" style={{ color: '#555', textDecoration: 'none' }}>About</a>
        {' · '}
        <a href="/terms" style={{ color: '#555', textDecoration: 'none' }}>Terms</a>
        {' · '}
        <a href="/privacy" style={{ color: '#555', textDecoration: 'none' }}>Privacy</a>
        <div style={{ marginTop: 6, color: '#333' }}>© 2026 AEXTech Holdings LLC</div>
      </footer>
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
