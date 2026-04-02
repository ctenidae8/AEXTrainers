import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { markCourseComplete } from '@/lib/db/users'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const aex_id = (session.user as any).aex_id
  await markCourseComplete(aex_id, 'joan')

  // completed_at is now set — hook for future AEXgora DEX credential issuance
  return NextResponse.json({ ok: true })
}
