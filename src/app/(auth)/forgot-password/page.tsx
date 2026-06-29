'use client'
import { useState } from 'react'
import Link from 'next/link'
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await fetch('/api/auth/forgot-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email }) })
    setSent(true); setLoading(false)
  }
  const inp = {width:'100%',background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'10px 12px',color:'#E2E8F0',fontSize:14,outline:'none',boxSizing:'border-box' as const}
  return (
    <div style={{minHeight:'100vh',background:'#0F0F1A',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#7C3AED,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',textAlign:'center',marginBottom:8}}>ShirmoContent</div>
        <div style={{color:'#64748B',fontSize:14,textAlign:'center',marginBottom:28}}>Reset your password</div>
        <div style={{background:'#16162A',border:'1px solid #2A2A45',borderRadius:16,padding:32}}>
          {sent ? (
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:48,marginBottom:16}}>📧</div>
              <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>Check your email</div>
              <div style={{fontSize:13,color:'#64748B',lineHeight:1.6,marginBottom:24}}>If an account exists for <strong style={{color:'#E2E8F0'}}>{email}</strong>, we've sent a reset link. Check your inbox and spam folder.</div>
              <Link href="/login" style={{color:'#A78BFA',fontSize:13,textDecoration:'none'}}>← Back to sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',fontSize:12,color:'#64748B',marginBottom:6}}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={inp}/>
              </div>
              <button type="submit" disabled={loading} style={{width:'100%',padding:11,borderRadius:8,fontWeight:700,fontSize:14,cursor:'pointer',background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',border:'none',opacity:loading?0.6:1}}>
                {loading?'Sending...':'Send Reset Link'}
              </button>
              <div style={{textAlign:'center',marginTop:20,fontSize:13}}>
                <Link href="/login" style={{color:'#64748B',textDecoration:'none'}}>← Back to sign in</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

