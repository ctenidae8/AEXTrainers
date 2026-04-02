import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { createProvisionalUser, createEnrollment, activateUser } from '@/lib/db/users'
import bcrypt from 'bcryptjs'

// TODO Package 5: add rate limiting before Stripe goes live
// Access codes are enumerable — fine for small manual cohort, not for public launch
export async function POST(req: NextRequest) {
  try {
    const { code, email, password } = await req.json()

    if (!code || !email || !password) {
      return NextResponse.json({ error: 'Code, email, and password required' }, { status: 400 })
    }

    // Validate code exists and is unredeemed
    const result = await sql`
      SELECT * FROM access_codes WHERE code = ${code} AND redeemed_by IS NULL
    `
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or already redeemed code' }, { status: 400 })
    }

    const accessCode = result.rows[0]
    const password_hash = await bcrypt.hash(password, 12)

    const aex_id = await createProvisionalUser(email)
    await activateUser(aex_id, password_hash)
    await createEnrollment(aex_id, accessCode.course)

    // Mark code redeemed
    await sql`
      UPDATE access_codes SET redeemed_by = ${aex_id}, redeemed_at = NOW()
      WHERE code = ${code}
    `

    return NextResponse.json({ aex_id, course: accessCode.course, status: 'active' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
