'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false) }
    else router.push('/login?registered=true')
  }
  const inp = { width: '100%', background: '#0F0F1A', border: '1px solid #2A2A45', borderRadius: 8, padding: '10px 12px', color: '#E2E8F0', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }
  return (
    <div style={{ minHeight: '100vh', background: '#0F0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ShirmoContent</div>
          <div style={{ color: '#64748B', marginTop: 8, fontSize: 14 }}>Create your free account</div>
        </div>
        <div style={{ background: '#16162A', border: '1px solid #2A2A45', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            {(['name','email','password'] as const).map(field => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>{field}</label>
                <input type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} required placeholder={field === 'name' ? 'Your full name' : field === 'email' ? 'you@example.com' : '••••••••'} style={inp} />
              </div>
            ))}
            {error && <div style={{ background: '#7F1D1D22', border: '1px solid #7F1D1D', borderRadius: 8, padding: '10px 12px', color: '#FCA5A5', fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 11, borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', color: '#fff', border: 'none', opacity: loading ? 0.6 : 1, marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
            Already have an account? <Link href="/login" style={{ color: '#A78BFA', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

