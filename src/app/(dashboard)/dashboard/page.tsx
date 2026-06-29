import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Topbar } from '@/components/layout/topbar'
import { redirect } from 'next/navigation'
export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const userId = (session.user as any).id
  const membership = await prisma.workspaceMember.findFirst({ where: { userId: session.user.id } })
  const workspaceId = membership?.workspaceId
  const [contentCount, campaignCount, recentContent] = await Promise.all([
    workspaceId ? prisma.content.count({ where: { workspaceId } }) : 0,
    workspaceId ? prisma.campaign.count({ where: { workspaceId } }) : 0,
    workspaceId ? prisma.content.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' }, take: 5 }) : [],
  ])
  const stats = [
    { label: 'Content Generated', val: contentCount, color: '#7C3AED' },
    { label: 'Active Campaigns',  val: campaignCount, color: '#06B6D4' },
    { label: 'AI Agents',         val: 7,             color: '#10B981' },
    { label: 'Avg. Engagement',   val: '6.8%',        color: '#F59E0B' },
  ]
  return (
    <>
      <Topbar title="Dashboard" />
      <main style={{ padding: 28, flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 24 }}>
          {stats.map(st => (
            <div key={st.label} style={{ background: '#16162A', border: '1px solid #2A2A45', borderRadius: 14, padding: 20, borderTop: `2px solid ${st.color}` }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#E2E8F0' }}>{st.val}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{st.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#16162A', border: '1px solid #2A2A45', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Recent Content</div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>Your latest AI-generated pieces</div>
          {recentContent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✍️</div>
              <div>No content yet. <a href="/content" style={{ color: '#A78BFA' }}>Generate your first piece →</a></div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ color: '#64748B', fontSize: 11, textAlign: 'left' }}>{['Type','Topic','Status','Created'].map(h => <th key={h} style={{ padding: '8px 0', borderBottom: '1px solid #2A2A45' }}>{h}</th>)}</tr></thead>
              <tbody>{recentContent.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #2A2A4522' }}>
                  <td style={{ padding: '10px 0', fontSize: 12 }}>{c.type}</td>
                  <td style={{ padding: '10px 0', fontSize: 12, color: '#64748B' }}>{c.topic}</td>
                  <td style={{ padding: '10px 0' }}><span style={{ background: '#10B98122', color: '#10B981', borderRadius: 20, padding: '3px 10px', fontSize: 11 }}>{c.status}</span></td>
                  <td style={{ padding: '10px 0', fontSize: 12, color: '#64748B' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div style={{ background: '#16162A', border: '1px solid #2A2A45', borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>⚡ Quick Generate</div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>Jump into content creation</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Instagram Caption','Reel Script','Ad Copy','Email Copy','Blog Outline','Promo Offer'].map(t => (
              <a key={t} href="/content" style={{ padding: '7px 14px', borderRadius: 8, fontWeight: 600, fontSize: 12, background: 'transparent', color: '#7C3AED', border: '1px solid #7C3AED', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

