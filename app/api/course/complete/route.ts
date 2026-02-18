import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserById, markCourseCompleted, createHexAttestation } from '@/lib/db'

export async function POST() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = await getUserById(session.userId)
  if (!user || !user.course_paid) {
    return NextResponse.json({ error: 'Course not purchased' }, { status: 403 })
  }

  if (user.course_completed) {
    return NextResponse.json({ error: 'Already completed' }, { status: 400 })
  }

  // Mark course complete — status transitions from provisional to active
  await markCourseCompleted(session.userId)

  // Drop first HEX attestation
  await createHexAttestation(
    session.userId,
    'aex_training.three_agent_stack',
    'course_completion',
    1.0,
    {
      course: 'Course 1: Introduction to Three-Agent Stacks',
      provider: 'AEXTrainers',
      facilitator: 'Joan',
      completed_at: new Date().toISOString(),
    }
  )

  return NextResponse.json({
    success: true,
    aex_id: user.aex_id,
    status: 'active',
    hex: {
      domain: 'aex_training.three_agent_stack',
      attestation_type: 'course_completion',
      confidence: 1.0,
    },
  })
}
