'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
function ResetForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ token, password }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false) }
    else router.push('/login?reset=true')
  }
  const inp = {width:'100%',background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'10px 12px',color:'#E2E8F0',fontSize:14,outline:'none',boxSizing:'border-box' as const}
  if (!token) return (
    <div style={{textAlign:'center',padding:'40px 0'}}>
      <div style={{fontSize:13,color:'#FCA5A5',marginBottom:16}}>Invalid or missing reset token.</div>
      <Link href="/forgot-password" style={{color:'#A78BFA',fontSize:13,textDecoration:'none'}}>Request a new reset link →</Link>
    </div>
  )
  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginBottom:16}}>
        <label style={{display:'block',fontSize:12,color:'#64748B',marginBottom:6}}>NEW PASSWORD</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min 8 characters" style={inp}/>
      </div>
      <div style={{marginBottom:20}}>
        <label style={{display:'block',fontSize:12,color:'#64748B',marginBottom:6}}>CONFIRM PASSWORD</label>
        <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required placeholder="Repeat password" style={inp}/>
      </div>
      {error && <div style={{background:'#7F1D1D22',border:'1px solid #7F1D1D',borderRadius:8,padding:'10px 12px',color:'#FCA5A5',fontSize:13,marginBottom:16}}>{error}</div>}
      <button type="submit" disabled={loading} style={{width:'100%',padding:11,borderRadius:8,fontWeight:700,fontSize:14,cursor:'pointer',background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',border:'none',opacity:loading?0.6:1}}>
        {loading?'Resetting...':'Reset Password'}
      </button>
    </form>
  )
}
export default function ResetPasswordPage() {
  return (
    <div style={{minHeight:'100vh',background:'#0F0F1A',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#7C3AED,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textAlign:'center',marginBottom:8}}>ShirmoContent</div>
        <div style={{color:'#64748B',fontSize:14,textAlign:'center',marginBottom:28}}>Choose a new password</div>
        <div style={{background:'#16162A',border:'1px solid #2A2A45',borderRadius:16,padding:32}}>
          <Suspense><ResetForm /></Suspense>
        </div>
      </div>
    </div>
  )
}

