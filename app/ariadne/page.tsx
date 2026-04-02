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
      text: "I'm Ariadne. Notice how that went with Virgil — one question, and your answer shaped everything after it. That's not a trick. That's what you're about to learn to do with your own AI. What are you working on right now?"
    }
  ])
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [completionSignal, setCompletionSignal] = useState<CompletionSignal | null>(null)

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

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        // TODO Package 3: when completionSignal fires, POST to /api/ariadne/complete
        // with session data to create provisional user record.
        // Do not implement here — DB does not exist yet.
        // Wire this in Package 3 before auth goes live.
      }
    } catch {
      const errMsg: Message = { role: 'assistant', text: 'Connection error. Please try again.' }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  const footer = completionSignal ? (
    <div style={{ padding: '8px 0' }}>
      <button
        onClick={() => router.push('/joan')}
        style={{
          background: '#1a1c23',
          border: '1px solid #2a2d36',
          borderRadius: 6,
          padding: '10px 20px',
          color: '#c8ccd4',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontWeight: 500,
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => {
          ;(e.target as HTMLElement).style.color = '#c97d3c'
          ;(e.target as HTMLElement).style.borderColor = '#c97d3c'
        }}
        onMouseLeave={e => {
          ;(e.target as HTMLElement).style.color = '#c8ccd4'
          ;(e.target as HTMLElement).style.borderColor = '#2a2d36'
        }}
      >
        Ready for Joan →
      </button>
    </div>
  ) : null

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1117' }}>
      <header style={{
        padding: '12px 20px',
        fontSize: 13,
        color: '#8a8f98',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        aex.training
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
