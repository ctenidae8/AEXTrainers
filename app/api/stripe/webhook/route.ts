import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { markCoursePaid } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId = parseInt(session.client_reference_id)
    const stripeCustomerId = session.customer as string

    if (userId) {
      await markCoursePaid(userId, stripeCustomerId || '')
      console.log(`Course paid: user ${userId}, AEX_ID from metadata: ${session.metadata?.aex_id}`)
    }
  }

  return NextResponse.json({ received: true })
}
