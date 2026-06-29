import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })
    await prisma.workspace.create({
      data: { name: `${name}'s Workspace`, industry: 'General', members: { create: { userId: user.id, role: 'owner' } } },
    })
    await prisma.subscription.create({
      data: { userId: user.id, stripeCustomerId: `free_${user.id}`, plan: 'free', status: 'active' },
    })
    try { await sendWelcomeEmail(email, name) } catch (e) { console.error('Welcome email failed:', e) }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
