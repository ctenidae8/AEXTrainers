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
    <div style={{
      width: 440, minWidth: 440, borderLeft: '1px solid #1a1c23', background: '#0d0f14',
      display: 'flex', flexDirection: 'column', height: '100%'
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1c23', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, letterSpacing: 1.5, color: '#6f7681', textTransform: 'uppercase', fontWeight: 500 }}>Exercise Materials</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6f7681', cursor: 'pointer', fontSize: 16, padding: '2px 6px' }}>✕</button>
        </div>
        {otherExhibits.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {otherExhibits.map(k => (
              <button key={k} onClick={() => onSwitch(k)} style={{
                background: '#1a1c23', border: '1px solid #2a2d36', borderRadius: 4,
                color: '#8a8f98', fontSize: 11, padding: '3px 10px', cursor: 'pointer',
                fontWeight: 500, transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#c97d3c'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#8a8f98'}>
                ← {exhibitData[k].title}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 20px' }}>
        {artifacts.map(key => {
          const a = exhibitData[key]
          if (!a) return null
          return (
            <div key={key} style={{ borderBottom: '1px solid #1a1c23' }}>
              <div style={{
                padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, background: '#0d0f14', zIndex: 1
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#c97d3c' }}>{a.title}</span>
                <button onClick={() => copy(key)} style={{
                  background: '#1a1c23', border: '1px solid #2a2d36', borderRadius: 4,
                  color: copied === key ? '#6fbf73' : '#8a8f98', fontSize: 11, padding: '3px 10px',
                  cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500
                }}>
                  {copied === key ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{
                padding: '8px 16px 16px', fontSize: 13, lineHeight: 1.6, color: '#b8bcc6',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                whiteSpace: 'pre-wrap', wordWrap: 'break-word'
              }}>
                {a.content.split('\n').map((line, li) => {
                  const isBold = line.startsWith('**') && line.endsWith('**')
                  if (isBold) return <div key={li} style={{ fontWeight: 700, color: '#e0e2e8', marginTop: li > 0 ? 12 : 0 }}>{line.slice(2, -2)}</div>
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
