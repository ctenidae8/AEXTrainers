import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getValidResetToken, markTokenUsed, updatePassword } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const resetToken = await getValidResetToken(token)
    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await updatePassword(resetToken.user_id, passwordHash)
    await markTokenUsed(resetToken.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Password reset failed' }, { status: 500 })
  }
}
