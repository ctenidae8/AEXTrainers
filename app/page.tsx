'use client'

import { useRouter } from 'next/navigation'

function PricingTable() {
  const tiers = [
    { label: 'Early access', price: 67, total: 50, remaining: 50 },
    { label: 'Second cohort', price: 100, total: 50, remaining: 50 },
    { label: 'Third cohort', price: 150, total: 50, remaining: 50 },
  ]
  const activeTier = tiers.findIndex(t => t.remaining > 0)
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {['', 'Price', 'Spots'].map(h => (
            <th key={h} style={{ padding: '0 0 8px', textAlign: h === '' ? 'left' : 'right', color: '#4a4e58', fontSize: 11, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tiers.map((t, i) => {
          const active = i === activeTier
          const past = i < activeTier
          return (
            <tr key={i} style={{ opacity: past ? 0.35 : active ? 1 : 0.5 }}>
              <td style={{ padding: '7px 0', color: active ? '#c8ccd4' : '#6f7681', fontWeight: active ? 500 : 400 }}>
                {t.label}
                {active && <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#c97d3c', marginLeft: 8, verticalAlign: 'middle' }} />}
              </td>
              <td style={{ padding: '7px 0', textAlign: 'right', color: active ? '#e8eaef' : '#6f7681', fontWeight: active ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>
                {past ? <span style={{ textDecoration: 'line-through' }}>${t.price}</span> : `$${t.price}`}
              </td>
              <td style={{ padding: '7px 0', textAlign: 'right', color: active ? '#8a8f98' : '#4a4e58', fontVariantNumeric: 'tabular-nums' }}>
                {past ? 'Filled' : `${t.remaining} left`}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function Home() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#c8ccd4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#6f7681', marginBottom: 20, textTransform: 'uppercase', fontWeight: 500 }}>AEXTrainers</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#e8eaef', lineHeight: 1.25, margin: '0 0 16px' }}>Learn to run a<br />three-agent stack.</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#8a8f98', margin: '0 0 12px' }}>One facilitator. Four sessions. Hands-on methodology.</p>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6f7681', margin: '0 0 32px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
          Joan will teach you to design agents with clear roles, manage work between them, and catch the quality problems that silently degrade multi-agent coordination. You&apos;ll build a working stack by the end.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
          <div style={{ background: '#161820', border: '1px solid #2a2d36', borderRadius: 8, padding: '20px 24px', textAlign: 'left' }}>
            <div style={{ color: '#c97d3c', fontWeight: 600, fontSize: 11, letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase' }}>Who needs a 3-agent stack?</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#8a8f98' }}>
              <div style={{ marginBottom: 4 }}>• You&apos;ve had productive conversations with a single AI agent</div>
              <div style={{ marginBottom: 4 }}>• You&apos;re comfortable writing prompts</div>
              <div>• You&apos;ve wished the agent remembered things between sessions</div>
            </div>
          </div>
          <div style={{ background: '#161820', border: '1px solid #2a2d36', borderRadius: 8, padding: '20px 24px', textAlign: 'left' }}>
            <div style={{ color: '#c97d3c', fontWeight: 600, fontSize: 11, letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase' }}>What you&apos;ll build</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#8a8f98' }}>
              <div style={{ marginBottom: 4 }}>• Three agents with distinct roles, scoped boundaries, and identity cards</div>
              <div style={{ marginBottom: 4 }}>• A tested coordination workflow — routing, carry-forwards, session discipline</div>
              <div style={{ marginBottom: 4 }}>• The quality-control instincts that prevent silent degradation</div>
              <div>• A working stack you&apos;ve built, tested, and revised yourself</div>
            </div>
          </div>
          <div style={{ background: '#161820', border: '1px solid #2a2d36', borderRadius: 8, padding: '20px 24px', textAlign: 'left' }}>
            <div style={{ color: '#c97d3c', fontWeight: 600, fontSize: 11, letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase' }}>How it works</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#8a8f98' }}>
              <div style={{ marginBottom: 4 }}>• Four interactive sessions with Joan, your facilitator agent</div>
              <div style={{ marginBottom: 4 }}>• Learn by doing — every concept is practiced, not lectured</div>
              <div style={{ marginBottom: 4 }}>• Work at your own pace, pick up where you left off</div>
              <div>• Graduate with artifacts you&apos;ll actually use</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#161820', border: '1px solid #2a2d36', borderRadius: 8, padding: '20px 24px', marginBottom: 28 }}>
          <PricingTable />
        </div>
        <button onClick={() => router.push('/enroll')} style={{ background: '#c97d3c', color: '#0f1117', border: 'none', borderRadius: 6, padding: '13px 36px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 0.3 }}>
          Enroll — $67
        </button>
        <div style={{ marginTop: 10, fontSize: 12, color: '#6f7681' }}>Early access pricing · 50 spots</div>
        <div style={{ marginTop: 8 }}>
          <a href="/login" style={{ color: '#6f7681', fontSize: 12, textDecoration: 'none' }}>Already enrolled? <span style={{ color: '#c97d3c' }}>Log in</span></a>
        </div>
        <div style={{ marginTop: 40, fontSize: 11, color: '#3a3d46', letterSpacing: 0.5 }}>Powered by AEXgora Research</div>
      </div>
    </div>
  )
}
