import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')
    if (!workspaceId) return NextResponse.json({ error: 'Missing workspaceId' }, { status: 400 })
    const campaigns = await prisma.campaign.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(campaigns)
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { workspaceId, name, type, industry } = await req.json()
    const campaign = await prisma.campaign.create({ data: { workspaceId, name, type, industry, status: 'draft' } })
    return NextResponse.json(campaign)
  } catch { return NextResponse.json({ error: 'Failed to create' }, { status: 500 }) }
}
