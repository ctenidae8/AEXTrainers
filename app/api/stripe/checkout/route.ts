import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const PRICES: Record<string, { amount: number; name: string }> = {
  joan: { amount: 6700, name: "Joan's Course — Early Access" },
}

export async function POST(req: NextRequest) {
  try {
    const { course } = await req.json()

    if (!course || !PRICES[course]) {
      return NextResponse.json({ error: 'Invalid course' }, { status: 400 })
    }

    const price = PRICES[course]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: price.name },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/login?purchased=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: { course },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
