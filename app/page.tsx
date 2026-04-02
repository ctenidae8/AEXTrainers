'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatUI from './shared/ChatUI'
import { VIRGIL_SYSTEM_PROMPT } from './virgil/system-prompt'
import type { Message, RoutingSignal, RouteTarget } from './shared/types'

const ROUTE_PATTERN = /\[ROUTE:(ariadne|joan|bartlett)\]/g

function parseRoute(text: string): RouteTarget | null {
  let last: RouteTarget | null = null
  let match
  while ((match = ROUTE_PATTERN.exec(text)) !== null) {
    last = match[1] as RouteTarget
  }
  ROUTE_PATTERN.lastIndex = 0
  return last
}

function stripRouteTags(text: string): string {
  return text.replace(ROUTE_PATTERN, '').trimEnd()
}

export default function VirgilPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello. I'm Virgil. What brings you to aex.training?" }
  ])
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [routingSignal, setRoutingSignal] = useState<RoutingSignal | null>(null)

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
          system: VIRGIL_SYSTEM_PROMPT,
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
      const target = parseRoute(rawText)
      const cleanText = stripRouteTags(rawText)

      const assistantMsg: Message = { role: 'assistant', text: cleanText }
      setMessages(prev => [...prev, assistantMsg])

      if (target) {
        setRoutingSignal({ target, detected: true })
      }
    } catch {
      const errMsg: Message = { role: 'assistant', text: 'Connection error. Please try again.' }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  const routeLabels: Record<RouteTarget, { label: string; path: string }> = {
    ariadne: { label: 'Start with Ariadne →', path: '/ariadne' },
    joan: { label: 'Take me to Joan →', path: '/joan' },
    bartlett: { label: 'Bartlett isn\'t ready yet', path: '/bartlett' },
  }

  const footer = routingSignal ? (
    <div style={{ padding: '8px 0' }}>
      <button
        onClick={() => router.push(routeLabels[routingSignal.target].path)}
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
        {routeLabels[routingSignal.target].label}
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
