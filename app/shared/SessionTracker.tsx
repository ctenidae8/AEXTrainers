'use client'

import type { SessionInfo } from './types'

const SESSIONS: SessionInfo[] = [
  { id: 1, label: 'S1', title: 'First Contact', desc: 'Felt Problem' },
  { id: 2, label: 'S2', title: 'Structure', desc: 'Scoping & Identity' },
  { id: '3a', label: '3a', title: 'Work Cycle', desc: 'Ramble / Directive' },
  { id: '3b', label: '3b', title: 'Compression', desc: 'QC & Failure' },
  { id: 4, label: 'S4', title: 'Graduation', desc: 'Build & Test' },
]

export default function SessionTracker({ current }: { current: number | string }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {SESSIONS.map((s, i) => {
        const active = current === s.id
        const idx = SESSIONS.findIndex(x => x.id === s.id)
        const curIdx = SESSIONS.findIndex(x => x.id === current)
        const past = idx < curIdx
        return (
          <div key={String(s.id)} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              opacity: active ? 1 : past ? 0.6 : 0.3, transition: 'opacity 0.3s'
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
                background: active ? '#c97d3c' : past ? '#3a3d46' : 'transparent',
                border: active ? 'none' : '1px solid #3a3d46',
                color: active ? '#0f1117' : '#8a8f98',
              }}>{s.label}</div>
              <span style={{ fontSize: 9, color: '#6f7681', whiteSpace: 'nowrap', letterSpacing: 0.3 }}>{s.desc}</span>
            </div>
            {i < SESSIONS.length - 1 && <div style={{ width: 16, height: 1, background: '#2a2d36', margin: '0 2px', marginBottom: 14 }} />}
          </div>
        )
      })}
    </div>
  )
}
