import { NextRequest, NextResponse } from 'next/server'
import { createProvisionalUser, createEnrollment } from '@/lib/db/users'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const aex_id = await createProvisionalUser(email)
    await createEnrollment(aex_id, 'ariadne')

    return NextResponse.json({ aex_id, status: 'provisional' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
