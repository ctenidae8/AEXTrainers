import { NextRequest, NextResponse } from 'next/server'
import { checkChatRateLimit, estimateTokens } from '@/lib/chat-guardrails'
import {
  extractHandoffBlock,
  storeHandoff,
  consumeHandoff,
  generatePacketId,
  renderStudentContext,
} from '@/lib/handoff'

type AgentName = 'virgil' | 'ariadne' | 'joan'

const MAX_USER_TOKENS = 2000
const VALID_AGENTS: AgentName[] = ['virgil', 'ariadne', 'joan']

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const agent: AgentName | undefined = body.agent
    const handoffKey: string | undefined = body.handoff_key

    // Rate limiting (per agent, per IP)
    if (agent && VALID_AGENTS.includes(agent)) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
      const rateLimit = checkChatRateLimit(ip, agent)
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Too many messages. Please wait and try again shortly.' },
          { status: 429 }
        )
      }
    }

    // Token cap — check the most recent user message
    const messages = Array.isArray(body.messages) ? body.messages : []
    const lastUser = [...messages].reverse().find((m: any) => m.role === 'user')
    if (lastUser?.content && typeof lastUser.content === 'string') {
      const tokens = estimateTokens(lastUser.content)
      if (tokens > MAX_USER_TOKENS) {
        // Log for threshold calibration
        console.log(`chat cap hit: agent=${agent} tokens=${tokens}`)
        return NextResponse.json(
          { error: 'Input too long. Please shorten your message.' },
          { status: 400 }
        )
      }
    }

    // Handoff packet injection — Ariadne / Joan, first user message only
    let systemPrompt: string = body.system
    if (
      (agent === 'ariadne' || agent === 'joan') &&
      handoffKey &&
      messages.filter((m: any) => m.role === 'user').length === 1
    ) {
      const packet = consumeHandoff(handoffKey)
      if (packet) {
        systemPrompt = renderStudentContext(packet) + systemPrompt
      }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-20250514',
        max_tokens: body.max_tokens || 1500,
        system: systemPrompt,
        messages: body.messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'API request failed' },
        { status: response.status }
      )
    }

    // Handoff packet extraction — Virgil only
    if (agent === 'virgil' && handoffKey && data.content?.[0]?.text) {
      const rawText = data.content[0].text
      const { cleaned, packet } = extractHandoffBlock(rawText)
      if (packet) {
        packet.packetId = generatePacketId()
        storeHandoff(handoffKey, packet)
        // Strip the block from the response shown to the student
        data.content[0].text = cleaned
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('chat route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
