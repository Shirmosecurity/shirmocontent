import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateContent } from '@/lib/anthropic'
import { prisma } from '@/lib/prisma'
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { industry, contentType, topic, workspaceId } = await req.json()
    if (!industry || !contentType || !topic || !workspaceId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const result = await generateContent({ industry, contentType, topic })
    if (!result.primary) throw new Error("AI returned empty response")
    const content = await prisma.content.create({
      data: { workspaceId, type: contentType, industry, topic, hook: result.hook, primary: result.primary, cta: result.cta, hashtags: result.hashtags || [], variation: result.variation, status: 'draft' },
    })
    return NextResponse.json({ ...result, id: content.id })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

