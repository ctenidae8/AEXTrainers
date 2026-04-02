import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getEnrollment } from '@/lib/db/users'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ enrolled: false }, { status: 401 })

  const aex_id = (session.user as any).aex_id
  const enrollment = await getEnrollment(aex_id, 'joan')

  return NextResponse.json({ enrolled: !!enrollment })
}
