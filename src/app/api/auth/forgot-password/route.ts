import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true })
    // Invalidate old tokens
    await prisma.passwordReset.updateMany({ where: { userId: user.id, used: false }, data: { used: true } })
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await prisma.passwordReset.create({ data: { userId: user.id, token, expires } })
    try { await sendPasswordResetEmail(email, token) } catch (e) { console.error('Reset email failed:', e) }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
