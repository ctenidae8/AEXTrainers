tsx
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
    
      {SESSIONS.map((s, i) => {
        const active = current === s.id
        const idx = SESSIONS.findIndex(x => x.id === s.id)
        const curIdx = SESSIONS.findIndex(x => x.id === current)
        const past = idx < curIdx
        return (
          
            
              {s.label}
              {s.desc}
            
            {i < SESSIONS.length - 1 && }
          
        )
      })}
    
  )
}

