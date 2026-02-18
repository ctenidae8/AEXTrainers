import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, getUserByEmail, getNextAexId } from '@/lib/db'
import { createSession, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await getUserByEmail(email.toLowerCase())
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    // Assign AEX_ID
    const aexId = await getNextAexId()

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await createUser(email.toLowerCase(), passwordHash, aexId)

    // Create session
    const token = await createSession({
      userId: user.id,
      aexId: user.aex_id,
      email: user.email,
    })
    await setSessionCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        aex_id: user.aex_id,
        email: user.email,
        status: user.status,
        course_paid: user.course_paid,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
