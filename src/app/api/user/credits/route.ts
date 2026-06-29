import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const credits = await getUserCredits(session.user.id)
    return NextResponse.json(credits)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
  }
}
