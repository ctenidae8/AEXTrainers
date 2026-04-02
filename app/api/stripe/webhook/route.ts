import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { sql } from '@/lib/db/client'
import { createEnrollmentFromStripe } from '@/lib/db/users'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const email = session.customer_details?.email
    const course = session.metadata?.course
    const stripeSessionId = session.id

    if (!email || !course) {
      return NextResponse.json({ error: 'Missing email or course' }, { status: 400 })
    }

    // Idempotency check — Stripe may deliver the same event more than once
    const existing = await sql`
      SELECT id FROM purchases WHERE stripe_session_id = ${stripeSessionId}
    `
    if (existing.rows.length > 0) {
      return NextResponse.json({ ok: true })
    }

    const aex_id = await createEnrollmentFromStripe(email, course)

    await sql`
      INSERT INTO purchases (stripe_session_id, email, course, aex_id)
      VALUES (${stripeSessionId}, ${email}, ${course}, ${aex_id})
    `
  }

  return NextResponse.json({ ok: true })
}
