'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Message } from './types'
import Markdown from './markdown'

interface ChatUIProps {
  messages: Message[]
  onSend: (text: string) => void
  loading: boolean
  streamingText?: string
  footer?: React.ReactNode
}

export default function ChatUI({ messages, onSend, loading, streamingText, footer }: ChatUIProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus()
    }
  }, [loading])

  const autoResize = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [])

  const handleSubmit = () => {
    const text = inputRef.current?.value.trim()
    if (!text || loading) return
    onSend(text)
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.style.height = 'auto'
      inputRef.current.focus()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                background: msg.role === 'user' ? '#2a2d36' : '#1a1c23',
                borderRadius: 8,
                padding: '12px 16px',
                color: '#c8ccd4',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {msg.role === 'assistant' ? <Markdown text={msg.text} /> : msg.text}
            </div>
          </div>
        ))}

        {streamingText && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div
              style={{
                maxWidth: '80%',
                background: '#1a1c23',
                borderRadius: 8,
                padding: '12px 16px',
                color: '#c8ccd4',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <Markdown text={streamingText} />
            </div>
          </div>
        )}

        {loading && !streamingText && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div
              style={{
                background: '#1a1c23',
                borderRadius: 8,
                padding: '12px 16px',
                display: 'flex',
                gap: 6,
              }}
            >
              {[0, 1, 2].map(n => (
                <span
                  key={n}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#8a8f98',
                    animation: `pulse 1.4s infinite`,
                    animationDelay: `${n * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {footer && (
        <div style={{ padding: '0 16px 8px' }}>
          {footer}
        </div>
      )}

      <div style={{ padding: '12px 20px 24px', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          ref={inputRef}
          placeholder="Type a message..."
          disabled={loading}
          rows={1}
          onInput={autoResize}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
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
            resize: 'none',
            lineHeight: 1.5,
            minHeight: 40,
            maxHeight: 120,
            overflow: 'auto',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: '#1a1c23',
            border: '1px solid #2a2d36',
            borderRadius: 6,
            padding: '10px 18px',
            color: loading ? '#555' : '#c8ccd4',
            fontSize: 14,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: 'inherit',
            transition: 'color 0.2s',
            minHeight: 40,
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
