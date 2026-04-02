'use client'

import { useState } from 'react'
import type { Exhibit } from './types'

interface Props {
  artifacts: string[]
  allShown: string[]
  exhibitData: Record<string, Exhibit>
  onClose: () => void
  onSwitch: (key: string) => void
}

export default function ExhibitPanel({ artifacts, allShown, exhibitData, onClose, onSwitch }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

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
    <div style={{ width: 420, borderLeft: '1px solid #2a2d36', background: '#13151b', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2d36' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: otherExhibits.length > 0 ? 12 : 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8a8f98', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exercise Materials</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8a8f98', cursor: 'pointer', fontSize: 16, padding: '2px 6px' }}>✕</button>
        </div>
        {otherExhibits.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {otherExhibits.map(k => (
              <button key={k} onClick={() => onSwitch(k)} style={{ background: '#1a1c23', border: '1px solid #2a2d36', borderRadius: 4, color: '#8a8f98', fontSize: 11, padding: '3px 10px', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#c97d3c'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#8a8f98'}>
                ← {exhibitData[k].title}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {artifacts.map(key => {
          const a = exhibitData[key]
          if (!a) return null
          return (
            <div key={key} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#c8ccd4' }}>{a.title}</span>
                <button onClick={() => copy(key)} style={{ background: '#1a1c23', border: '1px solid #2a2d36', borderRadius: 4, color: copied === key ? '#6fbf73' : '#8a8f98', fontSize: 11, padding: '3px 10px', cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500 }}>
                  {copied === key ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: '#a0a4ac' }}>
                {a.content.split('\n').map((line, li) => {
                  const isBold = line.startsWith('**') && line.endsWith('**')
                  if (isBold) return <div key={li} style={{ fontWeight: 600, color: '#c8ccd4', marginTop: li > 0 ? 12 : 0 }}>{line.slice(2, -2)}</div>
                  return <div key={li}>{line || '\u00A0'}</div>
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
