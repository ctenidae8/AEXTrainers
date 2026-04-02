import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, activateUser } from '@/lib/db/users'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Email and password (min 8 characters) required' },
        { status: 400 }
      )
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'No account found for that email. Check the email used at checkout.' },
        { status: 404 }
      )
    }

    const password_hash = await bcrypt.hash(password, 12)
    await activateUser(user.aex_id, password_hash)

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
