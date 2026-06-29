'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const registered = params.get('registered')
  const reset = params.get('reset')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) { setError('Invalid email or password'); setLoading(false) }
    else router.push('/dashboard')
  }

  const s = {
    page: {minHeight:'100vh',background:'#0F0F1A',display:'flex',alignItems:'center',justifyContent:'center',padding:24},
    box: {background:'#16162A',border:'1px solid #2A2A45',borderRadius:16,padding:32,width:'100%',maxWidth:420},
    inp: {width:'100%',background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'10px 12px',color:'#E2E8F0',fontSize:14,outline:'none',boxSizing:'border-box' as const},
    btn: {width:'100%',padding:11,borderRadius:8,fontWeight:700,fontSize:14,cursor:'pointer',background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',border:'none'},
  }

  return (
    <div style={s.page}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#7C3AED,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textAlign:'center',marginBottom:8}}>ShirmoContent</div>
        <div style={{color:'#64748B',fontSize:14,textAlign:'center',marginBottom:28}}>Sign in to your account</div>
        <div style={s.box}>
          {registered && <div style={{background:'#10B98122',border:'1px solid #10B98155',borderRadius:8,padding:'10px 12px',color:'#10B981',fontSize:13,marginBottom:16}}>✓ Account created! Sign in below.</div>}
          {reset && <div style={{background:'#10B98122',border:'1px solid #10B98155',borderRadius:8,padding:'10px 12px',color:'#10B981',fontSize:13,marginBottom:16}}>✓ Password reset! Sign in with your new password.</div>}
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:12,color:'#64748B',marginBottom:6}}>EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={s.inp}/>
            </div>
            <div style={{marginBottom:8}}>
              <label style={{display:'block',fontSize:12,color:'#64748B',marginBottom:6}}>PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={s.inp}/>
            </div>
            <div style={{textAlign:'right',marginBottom:20}}>
              <Link href="/forgot-password" style={{fontSize:12,color:'#A78BFA',textDecoration:'none'}}>Forgot password?</Link>
            </div>
            {error && <div style={{background:'#7F1D1D22',border:'1px solid #7F1D1D',borderRadius:8,padding:'10px 12px',color:'#FCA5A5',fontSize:13,marginBottom:16}}>{error}</div>}
            <button type="submit" disabled={loading} style={{...s.btn,opacity:loading?0.6:1}}>{loading?'Signing in...':'Sign In'}</button>
          </form>
          <div style={{textAlign:'center',marginTop:20,fontSize:13,color:'#64748B'}}>
            Don't have an account? <Link href="/register" style={{color:'#A78BFA',textDecoration:'none'}}>Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}

