'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Topbar } from '@/components/layout/topbar'
import type { Credits } from '@/types/index'

const PLANS = [
  {name:'Starter',price:'$97/mo',plan:'starter',color:'#64748B',features:['50 AI Credits/day','1 Workspace','Caption & Video Generator','Basic Analytics','Email Support']},
  {name:'Growth',price:'$197/mo',plan:'growth',color:'#7C3AED',features:['Unlimited AI Content','3 Workspaces','All Content Types','Campaign Builder','3 AI Agents','Priority Support'],badge:'Most Popular'},
  {name:'Agency',price:'$497/mo',plan:'agency',color:'#F59E0B',features:['Unlimited Everything','25 Workspaces','White-Label','All 7 AI Agents','Dedicated Support']},
]

function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  async function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    setLoading(true)
    const res = await fetch('/api/user/delete', { method: 'DELETE' })
    if (res.ok) { window.location.href = '/login' }
    else { alert('Failed to delete account.'); setLoading(false); setConfirming(false) }
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={handleDelete} disabled={loading} style={{ padding: '9px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', background: confirming ? '#EF4444' : 'transparent', color: confirming ? '#fff' : '#FCA5A5', border: '1px solid #7F1D1D', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Deleting...' : confirming ? 'Yes, permanently delete' : 'Delete Account'}
      </button>
      {confirming && <button onClick={() => setConfirming(false)} style={{ padding: '9px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'transparent', color: '#64748B', border: '1px solid #2A2A45' }}>Cancel</button>}
    </div>
  )
}

export default function SettingsPage() {
  const {data:session,update} = useSession()
  const [credits,setCredits] = useState<Credits|null>(null)
  const [billingLoading,setBillingLoading] = useState<string|null>(null)
  const [profileForm,setProfileForm] = useState({name:'',email:'',currentPassword:'',newPassword:'',confirmPassword:''})
  const [profileMsg,setProfileMsg] = useState<{type:'success'|'error',text:string}|null>(null)
  const [profileLoading,setProfileLoading] = useState(false)
  const [activeTab,setActiveTab] = useState<'profile'|'billing'>('profile')

  useEffect(()=>{
    if(session?.user){
      setProfileForm(p=>({...p,name:session.user.name||'',email:session.user.email||''}))
    }
    fetch('/api/user/credits').then(r=>r.json()).then(d=>setCredits(d)).catch(()=>{})
  },[session])

  async function saveProfile(e:React.FormEvent) {
    e.preventDefault(); setProfileLoading(true); setProfileMsg(null)
    if(profileForm.newPassword && profileForm.newPassword!==profileForm.confirmPassword){
      setProfileMsg({type:'error',text:'New passwords do not match'}); setProfileLoading(false); return
    }
    const res = await fetch('/api/user/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      name:profileForm.name, email:profileForm.email,
      currentPassword:profileForm.currentPassword||undefined,
      newPassword:profileForm.newPassword||undefined,
    })})
    const data = await res.json()
    if(!res.ok){ setProfileMsg({type:'error',text:data.error||'Update failed'}) }
    else { setProfileMsg({type:'success',text:'Profile updated successfully'}); setProfileForm(p=>({...p,currentPassword:'',newPassword:'',confirmPassword:''})); await update() }
    setProfileLoading(false)
  }

  async function subscribe(plan:string) {
    setBillingLoading(plan)
    const res=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})})
    const data=await res.json(); if(data.url) window.location.href=data.url; setBillingLoading(null)
  }

  const card={background:'#16162A',border:'1px solid #2A2A45',borderRadius:14,padding:24}
  const inp={width:'100%',background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'10px 12px',color:'#E2E8F0',fontSize:13,outline:'none',boxSizing:'border-box' as const}
  const lbl={display:'block' as const,fontSize:11,color:'#64748B',marginBottom:6,textTransform:'uppercase' as const,letterSpacing:1}
  const tab=(t:'profile'|'billing')=>({padding:'9px 20px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:activeTab===t?'#7C3AED22':'transparent',color:activeTab===t?'#A78BFA':'#64748B',border:activeTab===t?'1px solid #7C3AED44':'1px solid transparent'})

  return (
    <>
      <Topbar title="Settings" />
      <main style={{padding:28,flex:1,overflowY:'auto'}}>

        {/* Account header */}
        <div style={{...card,marginBottom:24,display:'flex',alignItems:'center',gap:16}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#7C3AED,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',flexShrink:0}}>
            {session?.user?.name?.charAt(0).toUpperCase()||'U'}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:700}}>{session?.user?.name}</div>
            <div style={{fontSize:13,color:'#64748B'}}>{session?.user?.email}</div>
          </div>
          {credits&&(
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:11,color:'#64748B',marginBottom:4}}>TODAY'S CREDITS</div>
              {credits.limit===999999
                ?<div style={{fontSize:14,fontWeight:700,color:'#10B981'}}>∞ Unlimited</div>
                :<div style={{fontSize:14,fontWeight:700,color:credits.remaining>10?'#10B981':credits.remaining>3?'#F59E0B':'#EF4444'}}>{credits.remaining} / {credits.limit} remaining</div>
              }
              <div style={{fontSize:11,color:'#64748B',textTransform:'capitalize',marginTop:2}}>{credits.plan} plan</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:8,marginBottom:24}}>
          <button onClick={()=>setActiveTab('profile')} style={tab('profile')}>👤 Profile</button>
          <button onClick={()=>setActiveTab('billing')} style={tab('billing')}>💳 Billing & Plans</button>
        </div>

        {/* Profile Tab */}
        {activeTab==='profile'&&(
          <form onSubmit={saveProfile}>
            <div style={{...card,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Personal Information</div>
              <div style={{fontSize:12,color:'#64748B',marginBottom:20}}>Update your name and email address</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div><label style={lbl}>Full Name</label><input value={profileForm.name} onChange={e=>setProfileForm(p=>({...p,name:e.target.value}))} style={inp} placeholder="Your full name"/></div>
                <div><label style={lbl}>Email Address</label><input type="email" value={profileForm.email} onChange={e=>setProfileForm(p=>({...p,email:e.target.value}))} style={inp} placeholder="you@example.com"/></div>
              </div>
            </div>
            <div style={{...card,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Change Password</div>
              <div style={{fontSize:12,color:'#64748B',marginBottom:20}}>Leave blank to keep your current password</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                <div><label style={lbl}>Current Password</label><input type="password" value={profileForm.currentPassword} onChange={e=>setProfileForm(p=>({...p,currentPassword:e.target.value}))} style={inp} placeholder="••••••••"/></div>
                <div><label style={lbl}>New Password</label><input type="password" value={profileForm.newPassword} onChange={e=>setProfileForm(p=>({...p,newPassword:e.target.value}))} style={inp} placeholder="Min 8 characters"/></div>
                <div><label style={lbl}>Confirm New Password</label><input type="password" value={profileForm.confirmPassword} onChange={e=>setProfileForm(p=>({...p,confirmPassword:e.target.value}))} style={inp} placeholder="Repeat new password"/></div>
              </div>
            </div>
            {profileMsg&&<div style={{background:profileMsg.type==='success'?'#10B98122':'#7F1D1D22',border:`1px solid ${profileMsg.type==='success'?'#10B98155':'#7F1D1D'}`,borderRadius:8,padding:'10px 14px',color:profileMsg.type==='success'?'#10B981':'#FCA5A5',fontSize:13,marginBottom:16}}>{profileMsg.type==='success'?'✓ ':'⚠ '}{profileMsg.text}</div>}
            <button type="submit" disabled={profileLoading} style={{padding:'10px 24px',borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer',background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',border:'none',opacity:profileLoading?0.6:1}}>
              {profileLoading?'Saving...':'Save Changes'}
            </button>
          </form>
        )}

        {/* Billing Tab */}
        {activeTab==='billing'&&(
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:24}}>
              {PLANS.map(p=>(
                <div key={p.name} style={{...card,border:`1px solid ${p.color}44`,position:'relative'}}>
                  {(p as any).badge&&<div style={{position:'absolute',top:-10,left:16,background:'#7C3AED',color:'#fff',borderRadius:20,padding:'3px 12px',fontSize:11,fontWeight:700}}>{(p as any).badge}</div>}
                  <div style={{fontSize:16,fontWeight:800,color:p.color}}>{p.name}</div>
                  <div style={{fontSize:28,fontWeight:800,margin:'8px 0'}}>{p.price}</div>
                  <div style={{borderTop:'1px solid #2A2A45',margin:'12px 0'}}/>
                  {p.features.map(f=><div key={f} style={{fontSize:12,padding:'5px 0'}}>✓ {f}</div>)}
                  <button onClick={()=>subscribe(p.plan)} disabled={billingLoading===p.plan} style={{width:'100%',padding:10,borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer',background:`linear-gradient(135deg,${p.color},${p.color}99)`,color:'#fff',border:'none',marginTop:16,opacity:billingLoading===p.plan?0.6:1}}>
                    {billingLoading===p.plan?'Redirecting...':'Upgrade →'}
                  </button>
                </div>
              ))}
            </div>
            <div style={{...card,borderColor:'#7F1D1D55'}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:4,color:'#FCA5A5'}}>⚠️ Danger Zone</div>
              <div style={{fontSize:12,color:'#64748B',marginBottom:16}}>These actions are permanent and cannot be undone.</div>
              <DeleteAccountButton />
            </div>
          </div>
        )}
      </main>
    </>
  )
}


