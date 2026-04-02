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
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '12px 16px', background: '#13151b', borderBottom: '1px solid #2a2d36' }}>
      {SESSIONS.map((s, i) => {
        const active = current === s.id
        const idx = SESSIONS.findIndex(x => x.id === s.id)
        const curIdx = SESSIONS.findIndex(x => x.id === current)
        const past = idx < curIdx
        return (
          <div key={String(s.id)} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', padding: '4px 10px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#c97d3c' : past ? '#6fbf73' : '#555' }}>{s.label}</div>
              <div style={{ fontSize: 10, color: active ? '#c8ccd4' : past ? '#8a8f98' : '#444', marginTop: 2 }}>{s.desc}</div>
            </div>
            {i < SESSIONS.length - 1 && <div style={{ width: 20, height: 1, background: '#2a2d36' }} />}
          </div>
        )
      })}
    </div>
  )
}
