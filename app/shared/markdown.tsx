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
          <pre key={`code-${i}`} style={{ background: '#161820', borderRadius: 4, padding: 12, overflowX: 'auto', fontSize: 13, lineHeight: 1.5, margin: '8px 0' }}>
            <code>{buf.join('\n')}</code>
          </pre>
        )
        inCode = false
      }
      continue
    }
    if (inCode) { buf.push(l); continue }
    if (l.startsWith('### ')) { els.push(<h3 key={i} style={{ fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 4 }}>{l.slice(4)}</h3>); continue }
    if (l.startsWith('## ')) { els.push(<h2 key={i} style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 4 }}>{l.slice(3)}</h2>); continue }
    if (l.startsWith('# ')) { els.push(<h1 key={i} style={{ fontSize: 16, fontWeight: 600, marginTop: 16, marginBottom: 4 }}>{l.slice(2)}</h1>); continue }
    if (l.trim() === '') { els.push(<br key={i} />); continue }
    const s = l
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:#161820;padding:2px 5px;border-radius:3px;font-size:13px">$1</code>')
    if (l.match(/^[-•]\s/)) {
      els.push(
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
          <span>•</span>
          <span dangerouslySetInnerHTML={{ __html: s.replace(/^[-•]\s/, '') }} />
        </div>
      )
    } else {
      els.push(<p key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: s }} />)
    }
  }
  return <div>{els}</div>
}
