import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/sidebar'
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const membership = await prisma.workspaceMember.findFirst({ where: { userId: session.user.id }, include: { workspace: true } })
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0F1A' }}>
      <Sidebar workspaceName={membership?.workspace?.name || 'My Workspace'} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</div>
    </div>
  )
}
