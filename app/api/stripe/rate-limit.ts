// NOTE: in-memory only — not enforced across Vercel serverless instances.
// Each instance has its own Map. In production this provides no real protection.
// Replace with Redis-based solution before scaling beyond early cohort.
const attempts = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 1000
const MAX_ATTEMPTS = 10

export function checkRateLimit(ip: string): { allowed: boolean } {
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false }
  }

  record.count++
  return { allowed: true }
}
