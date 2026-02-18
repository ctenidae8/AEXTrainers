import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserById } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = await getUserById(session.userId)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      aex_id: user.aex_id,
      email: user.email,
      status: user.status,
      course_paid: user.course_paid,
      current_session: user.current_session,
      course_completed: user.course_completed,
      completed_at: user.completed_at,
    },
  })
}
