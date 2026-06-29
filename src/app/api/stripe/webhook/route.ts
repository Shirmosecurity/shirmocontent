import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch { return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }) }
  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.CheckoutSession
      if (s.metadata?.userId && s.metadata?.plan) {
        await prisma.subscription.update({ where: { userId: s.metadata.userId }, data: { stripeSubscriptionId: s.subscription as string, plan: s.metadata.plan, status: 'active' } })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const dbSub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: sub.id } })
      if (dbSub) await prisma.subscription.update({ where: { id: dbSub.id }, data: { plan: 'free', status: 'canceled' } })
      break
    }
  }
  return NextResponse.json({ received: true })
}
