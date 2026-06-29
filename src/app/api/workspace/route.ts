import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: session.user.id },
      include: { workspace: { include: { _count: { select: { content: true, campaigns: true } } } } },
    })
    return NextResponse.json(memberships.map(m => m.workspace))
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}
