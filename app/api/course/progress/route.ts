import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getConversationHistory, saveConversationHistory, getUserById } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = await getUserById(session.userId)
  if (!user || !user.course_paid) {
    return NextResponse.json({ error: 'Course not purchased' }, { status: 403 })
  }

  const history = await getConversationHistory(session.userId)
  return NextResponse.json({
    messages: history.messages,
    shownArtifacts: history.shown_artifacts,
    currentSession: user.current_session,
    completed: user.course_completed,
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { messages, shownArtifacts } = await req.json()
  await saveConversationHistory(session.userId, messages, shownArtifacts)

  return NextResponse.json({ success: true })
}
