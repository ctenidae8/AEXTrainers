'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatUI from '../shared/ChatUI'
import { ARIADNE_SYSTEM_PROMPT } from './system-prompt'
import type { Message, CompletionSignal } from '../shared/types'

const COMPLETE_PATTERN = /\[COMPLETE\]/g

function stripCompleteTags(text: string): string {
  return text.replace(COMPLETE_PATTERN, '').trimEnd()
}

export default function AriadnePage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "I'm Ariadne. Notice how that went with Virgil \u2014 one question, and your answer shaped everything after it. That's not a trick. That's what you're about to learn to do with your own AI.\n\nWhat are you working on right now? A project, a trip, a problem you're stuck on \u2014 anything real."
    }
  ])
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [completionSignal, setCompletionSignal] = useState<CompletionSignal | null>(null)
  const [completionEmail, setCompletionEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailError, setEmailError] = useState('')

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: 'user', text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)
    setStreamingText('')

    try {
      const apiMessages = updated.map(m => ({
        role: m.role,
        content: m.text,
      }))

      const handoffKey = typeof window !== 'undefined'
        ? localStorage.getItem('aex_handoff_key')
        : null

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'ariadne',
          handoff_key: handoffKey,
          system: ARIADNE_SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errMsg: Message = { role: 'assistant', text: 'Something went wrong. Please try again.' }
        setMessages(prev => [...prev, errMsg])
        return
      }

      const rawText = data.content?.[0]?.text || ''
      const hasComplete = COMPLETE_PATTERN.test(rawText)
      COMPLETE_PATTERN.lastIndex = 0
      const cleanText = stripCompleteTags(rawText)

      const assistantMsg: Message = { role: 'assistant', text: cleanText }
      setMessages(prev => [...prev, assistantMsg])

      if (hasComplete) {
        setCompletionSignal({ detected: true })
      }
    } catch {
      const errMsg: Message = { role: 'assistant', text: 'Connection error. Please try again.' }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  const handleEmailSubmit = async () => {
    if (!completionEmail.includes('@')) {
      setEmailError('Need a valid email.')
      return
    }
    const res = await fetch('/api/ariadne/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: completionEmail }),
    })
    if (res.ok) {
      setEmailSubmitted(true)
    } else {
      setEmailError('Something went wrong. Try again.')
    }
  }

  const footer = completionSignal ? (
    <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {!emailSubmitted ? (
        <>
          <p style={{ fontSize: 13, color: '#8a8f98', margin: 0 }}>
            Drop your email to continue.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={completionEmail}
              onChange={e => setCompletionEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleEmailSubmit() }}
              style={{
                flex: 1,
                background: '#1a1c23',
                border: '1px solid #2a2d36',
                borderRadius: 6,
                padding: '10px 14px',
                color: '#c8ccd4',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button onClick={handleEmailSubmit} style={{
              background: '#1a1c23',
              border: '1px solid #2a2d36',
              borderRadius: 6,
              padding: '10px 18px',
              color: '#c8ccd4',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Continue
            </button>
          </div>
          {emailError && <p style={{ fontSize: 13, color: '#e07070', margin: 0 }}>{emailError}</p>}
        </>
      ) : (
        <button
          onClick={() => router.push('/joan')}
          style={{
            background: '#1a1c23',
            border: '1px solid #c97d3c',
            borderRadius: 6,
            padding: '10px 20px',
            color: '#c97d3c',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 500,
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            ;(e.target as HTMLElement).style.color = '#e0a06a'
            ;(e.target as HTMLElement).style.borderColor = '#e0a06a'
          }}
          onMouseLeave={e => {
            ;(e.target as HTMLElement).style.color = '#c97d3c'
            ;(e.target as HTMLElement).style.borderColor = '#c97d3c'
          }}
        >
          Ready for Joan →
        </button>
      )}
    </div>
  ) : null

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1117' }}>
      <header style={{
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <a href="/" style={{
          fontSize: 13,
          color: '#8a8f98',
          fontWeight: 500,
          letterSpacing: '0.02em',
          textDecoration: 'none',
        }}>
          aex.training
        </a>
        <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            Courses
          </span>
          <a href="/" style={navLinkStyle}>Virgil</a>
          <a href="/joan" style={navLinkStyle}>Joan</a>
        </nav>
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatUI
          messages={messages}
          onSend={handleSend}
          loading={loading}
          streamingText={streamingText || undefined}
          footer={footer}
        />
      </div>
    </div>
  )
}

const navLinkStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#9ba3af',
  textDecoration: 'none',
  letterSpacing: '0.02em',
  transition: 'color 0.2s',
}
