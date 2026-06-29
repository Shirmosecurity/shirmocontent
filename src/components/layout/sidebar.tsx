'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
const NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: '⚡' },
  { href: '/content',   label: 'AI Content', icon: '✍️' },
  { href: '/video',     label: 'Video Studio',icon: '🎬' },
  { href: '/campaigns', label: 'Campaigns',  icon: '🚀' },
  { href: '/automation',label: 'Automation', icon: '🤖' },
  { href: '/analytics', label: 'Analytics',  icon: '📊' },
  { href: '/agents',    label: 'AI Agents',  icon: '🧠' },
  { href: '/settings',  label: 'Settings',   icon: '⚙️' },
]
export function Sidebar({ workspaceName }: { workspaceName: string }) {
  const pathname = usePathname()
  return (
    <aside style={{ width: 220, background: '#16162A', borderRight: '1px solid #2A2A45', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0, minHeight: '100vh' }}>
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #2A2A45' }}>
        <div style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Aura AI</div>
        <div style={{ fontSize: 10, color: '#64748B', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>Content Marketing OS</div>
      </div>
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 2, background: active ? '#7C3AED22' : 'transparent', color: active ? '#A78BFA' : '#64748B', fontWeight: active ? 600 : 400, fontSize: 13, textDecoration: 'none' }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #2A2A45' }}>
        <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>WORKSPACE</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', marginBottom: 12 }}>{workspaceName}</div>
        <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ fontSize: 12, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Sign out →</button>
      </div>
    </aside>
  )
}
