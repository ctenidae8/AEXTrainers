'use client'

export default function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const els: JSX.Element[] = []
  let inCode = false
  let buf: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (l.startsWith('```')) {
      if (!inCode) { inCode = true; buf = [] }
      else {
        els.push(
          
            {buf.join('\n')}
          
        )
        inCode = false
      }
      continue
    }
    if (inCode) { buf.push(l); continue }
    if (l.startsWith('### ')) { els.push({l.slice(4)}); continue }
    if (l.startsWith('## ')) { els.push({l.slice(3)}); continue }
    if (l.startsWith('# ')) { els.push({l.slice(2)}); continue }
    if (l.trim() === '') { els.push(); continue }
    const s = l
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
    if (l.match(/^[-•]\s/)) {
      els.push(
        
          •
          <span dangerouslySetInnerHTML={{ __html: s.replace(/^[-•]\s/, '') }} />
        
      )
    } else {
      els.push()
    }
  }
  return {els}
}

