'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ChatUI from '../shared/ChatUI'
import SessionTracker from '../shared/SessionTracker'
import ExhibitPanel from '../shared/ExhibitPanel'
import { JOAN_SYSTEM_PROMPT } from './system-prompt'
import { EXHIBITS } from './exhibits'
import type { Message, CompletionSignal } from '../shared/types'

const ARTIFACT_PATTERN = /\[SHOW_ARTIFACT:(\w+)\]/g
const COMPLETE_PATTERN = /\[COMPLETE\]/g

function stripTags(text: string): string {
  return text
    .replace(ARTIFACT_PATTERN, '')
    .replace(COMPLETE_PATTERN, '')
    .trimEnd()
}

function parseArtifacts(text: string): string[] {
  const keys: string[] = []
  let match
  while ((match = ARTIFACT_PATTERN.exec(text)) !== null) {
    keys.push(match[1])
  }
  ARTIFACT_PATTERN.lastIndex = 0
  return keys
}

export default function JoanPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [enrollment, setEnrollment] = useState<'loading' | 'enrolled' | 'not-enrolled'>('loading')

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [completionSignal, setCompletionSignal] = useState<CompletionSignal | null>(null)

  const [currentSession, setCurrentSession] = useState<number | string>(1)
  const [activeArtifacts, setActiveArtifacts] = useState<string[]>([])
  const [allShownArtifacts, setAllShownArtifacts] = useState<string[]>([])

  // Enrollment check
  useEffect(() => {
    if (status === 'loading') return
    if (!session) return // middleware handles redirect

    fetch('/api/joan/enrollment')
      .then(res => res.json())
      .then(data => setEnrollment(data.enrolled ? 'enrolled' : 'not-enrolled'))
      .catch(() => setEnrollment('not-enrolled'))
  }, [session, status])

  // Conversation restore
  useEffect(() => {
    if (enrollment !== 'enrolled') return

    fetch('/api/joan/conversation')
      .then(res => res.json())
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
        }
      })
      .catch(() => {}) // silent fail — fresh start is acceptable
  }, [enrollment])

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
          system: JOAN_SYSTEM_PROMPT,
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

      // Parse artifact tags
      const artifactKeys = parseArtifacts(rawText)
      if (artifactKeys.length > 0) {
        setActiveArtifacts(artifactKeys)
        setAllShownArtifacts(prev => {
          const next = [...prev]
          for (const k of artifactKeys) {
            if (!next.includes(k)) next.push(k)
          }
          return next
        })
      }

      // Parse completion
      const hasComplete = COMPLETE_PATTERN.test(rawText)
      COMPLETE_PATTERN.lastIndex = 0

      const cleanText = stripTags(rawText)
      const assistantMsg: Message = { role: 'assistant', text: cleanText }
      const updatedMessages = [...updated, assistantMsg]
      setMessages(updatedMessages)

      // Fire and forget: save conversation
      fetch('/api/joan/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (hasComplete) {
        setCompletionSignal({ detected: true })
        fetch('/api/joan/complete', { method: 'POST' })
      }
    } catch {
      const errMsg: Message = { role: 'assistant', text: 'Connection error. Please try again.' }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  // Loading / auth states
  if (status === 'loading' || enrollment === 'loading') {
    return <div style={{ minHeight: '100vh', background: '#0f1117' }} />
  }

  if (enrollment === 'not-enrolled') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f1117',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        gap: 16,
      }}>
        <header style={{ position: 'absolute', top: 0, left: 0, padding: '12px 20px', fontSize: 13, color: '#8a8f98', fontWeight: 500, letterSpacing: '0.02em' }}>
          aex.training
        </header>
        <p style={{ color: '#c8ccd4', fontSize: 15 }}>Joan&apos;s course requires enrollment.</p>
        <a href="/redeem" style={{
          background: '#1a1c23',
          border: '1px solid #2a2d36',
          borderRadius: 6,
          padding: '10px 20px',
          color: '#c8ccd4',
          fontSize: 14,
          textDecoration: 'none',
          fontFamily: 'inherit',
        }}>
          Redeem an access code →
        </a>
      </div>
    )
  }

  const footer = completionSignal ? (
    <div style={{ padding: '8px 0' }}>
      <p style={{ fontSize: 13, color: '#6fbf73', margin: '0 0 8px 0' }}>
        Course complete.
      </p>
    </div>
  ) : null

  // Enrolled: full Joan course
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
      <SessionTracker current={currentSession} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ChatUI
            messages={messages}
            onSend={handleSend}
            loading={loading}
            streamingText={streamingText || undefined}
            footer={footer}
          />
        </div>
        {activeArtifacts.length > 0 && (
          <ExhibitPanel
            artifacts={activeArtifacts}
            allShown={allShownArtifacts}
            exhibitData={EXHIBITS}
            onClose={() => setActiveArtifacts([])}
            onSwitch={(key) => setActiveArtifacts([key])}
          />
        )}
      </div>
    </div>
  )
}
