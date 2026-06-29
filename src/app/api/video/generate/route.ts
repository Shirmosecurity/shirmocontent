import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateVideoScript } from '@/lib/anthropic'
import { prisma } from '@/lib/prisma'
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { topic, format, workspaceId } = await req.json()
    if (!topic || !format || !workspaceId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const result = await generateVideoScript({ topic, format })
    await prisma.content.create({
      data: { workspaceId, type: 'video-script', industry: 'General', topic, hook: result.hook, primary: result.script, cta: result.cta, hashtags: result.hashtags || [], status: 'draft' },
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
