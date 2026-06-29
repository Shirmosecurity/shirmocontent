import { prisma } from '@/lib/prisma'

const PLAN_LIMITS: Record<string, number> = {
  free:    10,
  starter: 50,
  growth:  999999,
  agency:  999999,
}

function today() {
  return new Date().toISOString().split('T')[0]
}

export async function getUserCredits(userId: string) {
  const sub = await prisma.subscription.findUnique({ where: { userId } })
  const plan = sub?.plan || 'free'
  const limit = PLAN_LIMITS[plan] || 10

  const record = await prisma.dailyCredit.findUnique({
    where: { userId_date: { userId, date: today() } },
  })

  const used = record?.used || 0
  const remaining = Math.max(0, limit - used)

  return { used, remaining, limit, plan }
}

export async function consumeCredit(userId: string): Promise<{ ok: boolean; remaining: number }> {
  const { remaining, limit } = await getUserCredits(userId)

  if (remaining <= 0) return { ok: false, remaining: 0 }

  await prisma.dailyCredit.upsert({
    where: { userId_date: { userId, date: today() } },
    create: { userId, date: today(), used: 1 },
    update: { used: { increment: 1 } },
  })

  return { ok: true, remaining: remaining - 1 }
}
