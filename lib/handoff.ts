// NOTE: in-memory only — not enforced across Vercel serverless instances.
// Redis required for real enforcement at scale.
//
// Handoff packet flow:
// 1. Virgil emits [HANDOFF]...[/HANDOFF] block in his response.
// 2. /api/chat extracts it, generates Packet-ID, stores keyed by handoff_key.
// 3. On first Ariadne/Joan message for that handoff_key, packet is retrieved
//    and prepended to the system prompt as [STUDENT-CONTEXT]. Then deleted.

export interface HandoffPacket {
  packetId: string
  destination: string
  archetype: string
  domain: string
  motivation: string
  vocabulary: string
  affect: string
  confidence: string
  notes: string
}

interface StoredPacket {
  packet: HandoffPacket
  expiresAt: number
}

const store = new Map<string, StoredPacket>()
const TTL_MS = 10 * 60 * 1000 // 10 minutes

function prune() {
  const now = Date.now()
  const toDelete: string[] = []
  store.forEach((entry, key) => {
    if (entry.expiresAt < now) toDelete.push(key)
  })
  toDelete.forEach(k => store.delete(k))
}

export function storeHandoff(key: string, packet: HandoffPacket): void {
  prune()
  store.set(key, { packet, expiresAt: Date.now() + TTL_MS })
}

export function retrieveHandoff(key: string): HandoffPacket | null {
  prune()
  const entry = store.get(key)
  if (!entry) return null
  if (entry.expiresAt < Date.now()) {
    store.delete(key)
    return null
  }
  return entry.packet
}

export function consumeHandoff(key: string): HandoffPacket | null {
  const packet = retrieveHandoff(key)
  if (packet) store.delete(key)
  return packet
}

export function generatePacketId(): string {
  const now = new Date()
  const date =
    now.getUTCFullYear().toString() +
    (now.getUTCMonth() + 1).toString().padStart(2, '0') +
    now.getUTCDate().toString().padStart(2, '0')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `VIR-${date}-${suffix}`
}

const HANDOFF_BLOCK = /\[HANDOFF\]([\s\S]*?)\[\/HANDOFF\]/

export function extractHandoffBlock(text: string): {
  cleaned: string
  packet: HandoffPacket | null
} {
  const match = text.match(HANDOFF_BLOCK)
  if (!match) return { cleaned: text, packet: null }

  const block = match[1]
  const field = (name: string): string => {
    const re = new RegExp(`${name}:\\s*(.+)`, 'i')
    const m = block.match(re)
    return m ? m[1].trim() : ''
  }

  const packet: HandoffPacket = {
    packetId: '', // filled in later
    destination: field('Destination'),
    archetype: field('Archetype'),
    domain: field('Domain'),
    motivation: field('Motivation'),
    vocabulary: field('Vocabulary'),
    affect: field('Affect'),
    confidence: field('Confidence'),
    notes: field('Notes'),
  }

  const cleaned = text.replace(HANDOFF_BLOCK, '').trimEnd()
  return { cleaned, packet }
}

export function renderStudentContext(packet: HandoffPacket): string {
  return `[STUDENT-CONTEXT — do not acknowledge aloud]
Packet-ID: ${packet.packetId}
Destination: ${packet.destination}
Archetype: ${packet.archetype}
Domain: ${packet.domain}
Motivation: ${packet.motivation}
Vocabulary: ${packet.vocabulary}
Affect: ${packet.affect}
Confidence: ${packet.confidence}
Notes: ${packet.notes}
[/STUDENT-CONTEXT]

`
}
