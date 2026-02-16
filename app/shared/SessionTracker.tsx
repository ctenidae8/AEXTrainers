```tsx
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
```

---

## 12. app/shared/ExhibitPanel.tsx

```tsx
'use client'

import { useState } from 'react'
import type { Exhibit } from './types'

interface Props {
  artifacts: string[]
  allShown: string[]
  exhibitData: Record
  onClose: () => void
  onSwitch: (key: string) => void
}

export default function ExhibitPanel({ artifacts, allShown, exhibitData, onClose, onSwitch }: Props) {
  const [copied, setCopied] = useState(null)

  const copy = (key: string) => {
    const text = exhibitData[key]?.content
    if (!text) return
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  if (!artifacts.length) return null
  const otherExhibits = allShown.filter(k => !artifacts.includes(k) && exhibitData[k])

  return (
    
      
        
          Exercise Materials
          ✕
        
        {otherExhibits.length > 0 && (
          
            {otherExhibits.map(k => (
              <button key={k} onClick={() => onSwitch(k)} style={{ background: '#1a1c23', border: '1px solid #2a2d36', borderRadius: 4, color: '#8a8f98', fontSize: 11, padding: '3px 10px', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#c97d3c'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#8a8f98'}>
                ← {exhibitData[k].title}
              
            ))}
          
        )}
      
      
        {artifacts.map(key => {
          const a = exhibitData[key]
          if (!a) return null
          return (
            
              
                {a.title}
                <button onClick={() => copy(key)} style={{ background: '#1a1c23', border: '1px solid #2a2d36', borderRadius: 4, color: copied === key ? '#6fbf73' : '#8a8f98', fontSize: 11, padding: '3px 10px', cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500 }}>
                  {copied === key ? 'Copied' : 'Copy'}
                
              
              
                {a.content.split('\n').map((line, li) => {
                  const isBold = line.startsWith('**') && line.endsWith('**')
                  if (isBold) return  0 ? 12 : 0 }}>{line.slice(2, -2)}
                  return {line || '\u00A0'}
                })}
              
            
          )
        })}
      
    
  )
}
```

---
