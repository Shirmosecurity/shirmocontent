'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
interface Credits { remaining: number; limit: number; plan: string }
export function Topbar({ title }: { title: string }) {
  const { data: session } = useSession()
  const [credits, setCredits] = useState<Credits | null>(null)
  const initials = session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  useEffect(() => {
    fetch('/api/user/credits').then(r => r.json()).then(d => setCredits(d)).catch(() => {})
  }, [])
  const isUnlimited = credits?.limit === 999999
  const pct = credits && !isUnlimited ? Math.round((credits.remaining / credits.limit) * 100) : 100
  const creditColor = pct > 50 ? '#10B981' : pct > 20 ? '#F59E0B' : '#EF4444'
  return (
    <header style={{ background: '#16162A', borderBottom: '1px solid #2A2A45', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {credits && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isUnlimited ? (
              <span style={{ background: '#10B98122', color: '#10B981', border: '1px solid #10B98144', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>∞ Unlimited</span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 60, height: 4, background: '#2A2A45', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: creditColor, borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, color: creditColor, fontWeight: 600 }}>{credits.remaining}/{credits.limit}</span>
                <Link href="/settings" style={{ fontSize: 10, color: '#64748B', textDecoration: 'none' }}>credits</Link>
              </div>
            )}
          </div>
        )}
        <span style={{ background: '#10B98122', color: '#10B981', border: '1px solid #10B98144', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>⚡ AI Active</span>
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>{initials}</div>
        </Link>
      </div>
    </header>
  )
}
