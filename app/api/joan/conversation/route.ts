import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveConversation, loadConversation } from '@/lib/db/users'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ messages: [] }, { status: 401 })

  const aex_id = (session.user as any).aex_id
  const messages = await loadConversation(aex_id, 'joan')

  return NextResponse.json({ messages: messages ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const aex_id = (session.user as any).aex_id
  const { messages } = await req.json()

  await saveConversation(aex_id, 'joan', messages)
  return NextResponse.json({ ok: true })
}
