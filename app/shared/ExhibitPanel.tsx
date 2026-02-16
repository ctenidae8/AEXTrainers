tsx
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
