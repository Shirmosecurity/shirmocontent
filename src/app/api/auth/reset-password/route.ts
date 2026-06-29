import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    const reset = await prisma.passwordReset.findUnique({ where: { token } })
    if (!reset || reset.used || reset.expires < new Date()) {
      return NextResponse.json({ error: 'Reset link is invalid or expired' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.update({ where: { id: reset.userId }, data: { password: hashed } })
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
