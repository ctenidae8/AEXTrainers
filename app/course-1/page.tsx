'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import SessionTracker from '../shared/SessionTracker'
import ExhibitPanel from '../shared/ExhibitPanel'
import Markdown from '../shared/Markdown'
import type { Message } from '../shared/types'
import { EXHIBITS } from './exhibits'
import { JOAN_SYSTEM_PROMPT } from './system-prompt'

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '12px 0', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#8a8f98', marginRight: 6, fontStyle: 'italic' }}>Joan is thinking</span>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%', background: '#6f7681',
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}
    </div>
  )
}

export default function Course1() {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<number | string>(1)
  const [started, setStarted] = useState(false)
  const [panelArtifacts, setPanelArtifacts] = useState<string[]>([])
  const [allShown, setAllShown] = useState<string[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scroll = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  useEffect(() => { scroll() }, [msgs, loading, scroll])

  const parseArtifactTags = useCallback((text: string) => {
    const tags: string[] = []
    const cleaned = text.replace(/\[SHOW_ARTIFACT:(\w+)\]\n?/g, (_, key) => {
      if (EXHIBITS[key]) tags.push(key)
      return ''
    })
    return { cleaned: cleaned.trim(), artifactKeys: tags }
  }, [])

  const callJoan = useCallback(async (history: Message[]) => {
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: JOAN_SYSTEM_PROMPT,
          messages: history.map(m => ({ role: m.role, content: m.text })),
        }),
      })
      const data = await res.json()
      return data.content?.map((b: any) => b.type === 'text' ? b.text : '').join('') || "I seem to have lost my thread. Could you say that again?"
    } catch {
      return "Something went wrong on my end. Let's try that again."
    } finally {
      setLoading(false)
    }
  }, [])

  const processReply = useCallback((raw: string) => {
    const { cleaned, artifactKeys } = parseArtifactTags(raw)
    if (artifactKeys.length) {
      setPanelArtifacts(artifactKeys)
      setAllShown(prev => {
        const next = [...prev]
        artifactKeys.forEach(k => { if (!next.includes(k)) next.push(k) })
        return next
      })
    }
    return cleaned
  }, [parseArtifactTags])

  const startSession = useCallback(async () => {
    setStarted(true)
    const opening: Message[] = [{ role: 'user', text: 'Hello, I\'m here to start the training.' }]
    const raw = await callJoan(opening)
    const cleaned = processReply(raw)
    setMsgs([{ role: 'assistant', text: cleaned }])
    inputRef.current?.focus()
  }, [callJoan, processReply])

  const send = useCallback(async () => {
    const t = input.trim()
    if (!t || loading) return
    const userMsg: Message = { role: 'user', text: t }
    const newMsgs = [...msgs, userMsg]
    setMsgs(newMsgs)
    setInput('')
    const raw = await callJoan(newMsgs)
    const cleaned = processReply(raw)
    setMsgs(prev => [...prev, { role: 'assistant', text: cleaned }])
    inputRef.current?.focus()
  }, [input, loading, msgs, callJoan, processReply])

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }, [send])

  const panelOpen = panelArtifacts.length > 0

  if (!started) {
    return (
      <div style={{ height: '100vh', background: '#0f1117', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1a1c23', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: 2.5, color: '#6f7681', textTransform: 'uppercase', fontWeight: 500 }}>AEXTrainers</span>
            <span style={{ color: '#2a2d36' }}>|</span>
            <span style={{ fontSize: 13, color: '#8a8f98' }}>Joan — Facilitator</span>
          </div>
          <SessionTracker current={session} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 14, color: '#6f7681', maxWidth: 360, textAlign: 'center', lineHeight: 1.6 }}>
            Joan is your facilitator for the next four sessions. She&apos;ll teach you to build and run a three-agent stack through live practice.
          </div>
          <button onClick={startSession} style={{ background: '#c97d3c', color: '#0f1117', border: 'none', borderRadius: 6, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Begin Session 1
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', background: '#0f1117', display: 'flex', flexDirection: 'column', color: '#c8ccd4' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1a1c23', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, letterSpacing: 2.5, color: '#6f7681', textTransform: 'uppercase', fontWeight: 500 }}>AEXTrainers</span>
          <span style={{ color: '#2a2d36' }}>|</span>
          <span style={{ fontSize: 13, color: '#8a8f98' }}>Joan — Facilitator</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {allShown.length > 0 && (
            <button onClick={() => setPanelArtifacts(panelOpen ? [] : [allShown[allShown.length - 1]])} style={{ background: '#1a1c23', border: '1px solid #2a2d36', borderRadius: 4, color: '#8a8f98', fontSize: 11, padding: '4px 10px', cursor: 'pointer', fontWeight: 500 }}>
              {panelOpen ? 'Hide Materials' : 'Show Materials'}
            </button>
          )}
          <SessionTracker current={session} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'assistant' && <div style={{ fontSize: 11, color: '#6f7681', marginBottom: 4, fontWeight: 500 }}>Joan</div>}
                  <div style={{
                    maxWidth: m.role === 'user' ? '75%' : '90%',
                    padding: m.role === 'user' ? '10px 14px' : '2px 0',
                    background: m.role === 'user' ? '#1a1e2a' : 'transparent',
                    borderRadius: m.role === 'user' ? 12 : 0,
                    fontSize: 14, lineHeight: 1.65,
                    color: m.role === 'user' ? '#d4d7de' : '#b8bcc6',
                  }}>
                    {m.role === 'assistant' ? <Markdown text={m.text} /> : m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 11, color: '#6f7681', marginBottom: 4, fontWeight: 500 }}>Joan</div>
                  <TypingDots />
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
          <div style={{ padding: '12px 24px 16px', borderTop: '1px solid #1a1c23', flexShrink: 0 }}>
            <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Talk to Joan..."
                rows={5}
                style={{ flex: 1, background: '#161820', border: '1px solid #2a2d36', borderRadius: 8, padding: '10px 14px', color: '#d4d7de', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, minHeight: 105, maxHeight: 160 }}
              />
              <button onClick={send} disabled={!input.trim() || loading} style={{
                background: input.trim() && !loading ? '#c97d3c' : '#2a2d36',
                color: input.trim() && !loading ? '#0f1117' : '#6f7681',
                border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600,
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: 'all 0.2s', whiteSpace: 'nowrap', height: 40,
              }}>Send</button>
            </div>
            <div style={{ maxWidth: 680, margin: '6px auto 0', fontSize: 11, color: '#3a3d46', textAlign: 'center' }}>
              Joan is an AI facilitator. Sessions work best at a conversational pace.
            </div>
          </div>
        </div>
        {panelOpen && (
          <ExhibitPanel
            artifacts={panelArtifacts}
            allShown={allShown}
            exhibitData={EXHIBITS}
            onClose={() => setPanelArtifacts([])}
            onSwitch={(key) => setPanelArtifacts([key])}
          />
        )}
      </div>
    </div>
  )
}
