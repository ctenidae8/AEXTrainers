// NOTE: in-memory only — not enforced across Vercel serverless instances.
// Each instance has its own Map. In production this provides no real protection.
// Redis required for real enforcement at scale.

type AgentName = 'virgil' | 'ariadne' | 'joan'

interface AgentLimit {
  windowMs: number
  max: number
}

const AGENT_LIMITS: Record<AgentName, AgentLimit> = {
  virgil: { windowMs: 60 * 60 * 1000, max: 20 },
  ariadne: { windowMs: 60 * 60 * 1000, max: 30 },
  joan: { windowMs: 60 * 60 * 1000, max: 60 },
}

const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkChatRateLimit(
  ip: string,
  agent: AgentName
): { allowed: boolean } {
  const limit = AGENT_LIMITS[agent]
  if (!limit) return { allowed: true }

  const key = `${agent}:${ip}`
  const now = Date.now()
  const record = buckets.get(key)

  if (!record || now > record.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs })
    return { allowed: true }
  }

  if (record.count >= limit.max) {
    return { allowed: false }
  }

  record.count++
  return { allowed: true }
}

// Rough token estimate — 1 token ≈ 4 chars for English text.
// Not exact, but safe enough for a cap check. Anthropic's real tokenizer
// is more accurate; this is a cheap pre-flight.
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
