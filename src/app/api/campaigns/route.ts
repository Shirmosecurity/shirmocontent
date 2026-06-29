import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function userOwnsWorkspace(userId: string, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  })
  return !!membership
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')
    if (!workspaceId) return NextResponse.json({ error: 'Missing workspaceId' }, { status: 400 })
    const owns = await userOwnsWorkspace(session.user.id, workspaceId)
    if (!owns) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const campaigns = await prisma.campaign.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(campaigns)
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { workspaceId, name, type, industry } = await req.json()
    if (!workspaceId || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const owns = await userOwnsWorkspace(session.user.id, workspaceId)
    if (!owns) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const campaign = await prisma.campaign.create({ data: { workspaceId, name, type, industry, status: 'draft' } })
    return NextResponse.json(campaign)
  } catch { return NextResponse.json({ error: 'Failed to create' }, { status: 500 }) }
}
