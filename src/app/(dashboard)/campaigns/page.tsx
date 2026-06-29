'use client'
import { useState, useEffect } from 'react'
import { Topbar } from '@/components/layout/topbar'
interface Campaign { id:string; name:string; industry:string; type:string; status:string; leads:number; createdAt:string }
export default function CampaignsPage() {
  const [campaigns,setCampaigns]=useState<Campaign[]>([]); const [workspaceId,setWorkspaceId]=useState('')
  const [loading,setLoading]=useState(true); const [creating,setCreating]=useState(false)
  const [form,setForm]=useState({name:'',type:'lead-gen',industry:'Gym / Fitness'})
  useEffect(()=>{ fetch('/api/workspace').then(r=>r.json()).then(d=>{ if(d[0]){ setWorkspaceId(d[0].id); fetch(`/api/campaigns?workspaceId=${d[0].id}`).then(r=>r.json()).then(c=>{setCampaigns(c);setLoading(false)}) } }) },[])
  async function createCampaign() {
    if(!form.name.trim()) return
    const res=await fetch('/api/campaigns',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,workspaceId})})
    const data=await res.json(); setCampaigns(p=>[data,...p]); setForm({name:'',type:'lead-gen',industry:'Gym / Fitness'}); setCreating(false)
  }
  const sc=(s:string)=>s==='active'?'#10B981':s==='scheduled'?'#06B6D4':'#64748B'
  const card={background:'#16162A',border:'1px solid #2A2A45',borderRadius:14,padding:24}
  const inp={width:'100%',background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'9px 12px',color:'#E2E8F0',fontSize:13,outline:'none',boxSizing:'border-box' as const}
  return (
    <>
      <Topbar title="Campaign Builder" />
      <main style={{padding:28,flex:1,overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div><div style={{fontSize:15,fontWeight:700}}>🚀 Campaigns</div><div style={{fontSize:12,color:'#64748B'}}>AI-powered marketing campaigns</div></div>
          <button onClick={()=>setCreating(!creating)} style={{padding:'9px 18px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',border:'none'}}>+ New Campaign</button>
        </div>
        {creating&&(
          <div style={{...card,marginBottom:24,borderColor:'#7C3AED55'}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Create Campaign</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>
              <div><label style={{display:'block',fontSize:11,color:'#64748B',marginBottom:6}}>NAME</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Summer Challenge" style={inp}/></div>
              <div><label style={{display:'block',fontSize:11,color:'#64748B',marginBottom:6}}>TYPE</label><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{...inp,appearance:'none'}}>{['lead-gen','seasonal','education','review','retargeting','referral'].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label style={{display:'block',fontSize:11,color:'#64748B',marginBottom:6}}>INDUSTRY</label><select value={form.industry} onChange={e=>setForm(p=>({...p,industry:e.target.value}))} style={{...inp,appearance:'none'}}>{['Gym / Fitness','Real Estate','Restaurant / Cafe','Med Spa / Beauty','Cybersecurity / MSP','Local Service'].map(i=><option key={i}>{i}</option>)}</select></div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={createCampaign} style={{padding:'9px 18px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',border:'none'}}>Create</button>
              <button onClick={()=>setCreating(false)} style={{padding:'9px 18px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:'transparent',color:'#64748B',border:'1px solid #2A2A45'}}>Cancel</button>
            </div>
          </div>
        )}
        <div style={{...card,marginBottom:24}}>
          {loading?<div style={{textAlign:'center',padding:'40px 0',color:'#64748B'}}>Loading...</div>:campaigns.length===0?(
            <div style={{textAlign:'center',padding:'40px 0',color:'#64748B'}}><div style={{fontSize:32,marginBottom:8}}>🚀</div><div>No campaigns yet. Create your first one above.</div></div>
          ):(
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{color:'#64748B',fontSize:11,textAlign:'left'}}>{['Campaign','Industry','Type','Status','Leads','Created'].map(h=><th key={h} style={{padding:'8px 0',borderBottom:'1px solid #2A2A45'}}>{h}</th>)}</tr></thead>
              <tbody>{campaigns.map((c,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #2A2A4522'}}>
                  <td style={{padding:'12px 0',fontWeight:600,fontSize:13}}>{c.name}</td>
                  <td style={{padding:'12px 0'}}><span style={{background:'#06B6D422',color:'#06B6D4',borderRadius:6,padding:'2px 8px',fontSize:11,fontWeight:600}}>{c.industry}</span></td>
                  <td style={{padding:'12px 0',fontSize:12,color:'#64748B'}}>{c.type}</td>
                  <td style={{padding:'12px 0'}}><span style={{background:`${sc(c.status)}22`,color:sc(c.status),borderRadius:20,padding:'3px 10px',fontSize:11}}>{c.status}</span></td>
                  <td style={{padding:'12px 0',fontSize:13,fontWeight:700,color:'#10B981'}}>{c.leads}</td>
                  <td style={{padding:'12px 0',fontSize:12,color:'#64748B'}}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </main>
    </>
  )
}
