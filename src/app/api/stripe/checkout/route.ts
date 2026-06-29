import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { plan } = await req.json()
    const planConfig = PLANS[plan as keyof typeof PLANS]
    if (!planConfig?.priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    let subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
    let customerId = subscription?.stripeCustomerId
    if (!customerId || customerId.startsWith('free_')) {
      const customer = await stripe.customers.create({ email: session.user.email!, name: session.user.name || undefined })
      customerId = customer.id
      await prisma.subscription.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, stripeCustomerId: customerId, plan: 'free', status: 'active' },
        update: { stripeCustomerId: customerId },
      })
    }
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId, mode: 'subscription', payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      metadata: { userId: session.user.id, plan },
    })
    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
