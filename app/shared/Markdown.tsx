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
          <pre key={i} style={{ background: '#1a1c23', borderRadius: 6, padding: '12px 14px', overflowX: 'auto', fontSize: 13, lineHeight: 1.5, border: '1px solid #2a2d36', margin: '8px 0' }}>
            <code>{buf.join('\n')}</code>
          </pre>
        )
        inCode = false
      }
      continue
    }
    if (inCode) { buf.push(l); continue }
    if (l.startsWith('### ')) { els.push(<h3 key={i} style={{ fontSize: 15, fontWeight: 600, color: '#e0e2e8', margin: '16px 0 6px' }}>{l.slice(4)}</h3>); continue }
    if (l.startsWith('## ')) { els.push(<h2 key={i} style={{ fontSize: 16, fontWeight: 600, color: '#e0e2e8', margin: '18px 0 8px' }}>{l.slice(3)}</h2>); continue }
    if (l.startsWith('# ')) { els.push(<h1 key={i} style={{ fontSize: 18, fontWeight: 700, color: '#e8eaef', margin: '20px 0 10px' }}>{l.slice(2)}</h1>); continue }
    if (l.trim() === '') { els.push(<div key={i} style={{ height: 8 }} />); continue }
    const s = l
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#d4d7de;font-weight:600">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:#1a1c23;padding:1px 5px;border-radius:3px;font-size:12px">$1</code>')
    if (l.match(/^[-•]\s/)) {
      els.push(
        <div key={i} style={{ paddingLeft: 16, position: 'relative', lineHeight: 1.6 }}>
          <span style={{ position: 'absolute', left: 2, color: '#6f7681' }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: s.replace(/^[-•]\s/, '') }} />
        </div>
      )
    } else {
      els.push(<p key={i} style={{ margin: '4px 0', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: s }} />)
    }
  }
  return <div>{els}</div>
}
