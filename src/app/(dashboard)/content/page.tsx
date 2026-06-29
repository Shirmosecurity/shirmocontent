'use client'
import { useState, useEffect } from 'react'
import { Topbar } from '@/components/layout/topbar'
const INDUSTRIES = ['Gym / Fitness','Real Estate','Restaurant / Cafe','Med Spa / Beauty','Cybersecurity / MSP','Local Service']
const CONTENT_TYPES = ['Instagram Caption','Facebook Post','Twitter/X Post','Email Copy','Blog Outline','Ad Copy','CTA Text','Promotional Offer']
interface Generated { id?: string; primary: string; hook: string; cta: string; hashtags: string[]; variation: string }
export default function ContentPage() {
  const [industry, setIndustry] = useState(INDUSTRIES[0])
  const [contentType, setContentType] = useState(CONTENT_TYPES[0])
  const [topic, setTopic] = useState('')
  const [generated, setGenerated] = useState<Generated | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workspaceId, setWorkspaceId] = useState('')
  const [copied, setCopied] = useState(false)
  useEffect(() => { fetch('/api/workspace').then(r=>r.json()).then(d=>{ if(d[0]) setWorkspaceId(d[0].id) }) }, [])
  async function generate() {
    if (!topic.trim() || !workspaceId) return
    setLoading(true); setError(''); setGenerated(null)
    try {
      const res = await fetch('/api/content/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({industry,contentType,topic,workspaceId}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGenerated(data)
    } catch (err: any) { setError(err.message || 'Generation failed') }
    setLoading(false)
  }
  function copyAll() {
    if (!generated) return
    navigator.clipboard.writeText(`${generated.hook}\n\n${generated.primary}\n\n${generated.cta}\n\n${generated.hashtags.map(h=>`#${h}`).join(' ')}`)
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }
  const inp = { width:'100%', background:'#0F0F1A', border:'1px solid #2A2A45', borderRadius:8, padding:'10px 12px', color:'#E2E8F0', fontSize:13, outline:'none', boxSizing:'border-box' as const }
  const lbl = { display:'block' as const, fontSize:11, color:'#64748B', marginBottom:6, textTransform:'uppercase' as const, letterSpacing:1 }
  const card = { background:'#16162A', border:'1px solid #2A2A45', borderRadius:14, padding:24 }
  return (
    <>
      <Topbar title="AI Content Generator" />
      <main style={{ padding:28, flex:1, overflowY:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24 }}>
          <div style={card}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>✍️ Generate Content</div>
            <div style={{ fontSize:12, color:'#64748B', marginBottom:20 }}>AI-powered copy for any channel</div>
            <div style={{ marginBottom:14 }}><label style={lbl}>Industry</label><select style={{...inp,appearance:'none'}} value={industry} onChange={e=>setIndustry(e.target.value)}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></div>
            <div style={{ marginBottom:14 }}><label style={lbl}>Content Type</label><select style={{...inp,appearance:'none'}} value={contentType} onChange={e=>setContentType(e.target.value)}>{CONTENT_TYPES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{ marginBottom:20 }}><label style={lbl}>Topic / Prompt</label><textarea style={{...inp,minHeight:100,resize:'vertical'}} placeholder={`e.g. "Summer sale, 30% off, limited time"`} value={topic} onChange={e=>setTopic(e.target.value)} /></div>
            {error && <div style={{ background:'#7F1D1D22', border:'1px solid #7F1D1D55', borderRadius:8, padding:'10px 12px', color:'#FCA5A5', fontSize:12, marginBottom:14 }}>{error}</div>}
            <button onClick={generate} disabled={loading||!topic.trim()} style={{ width:'100%', padding:11, borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer', background:'linear-gradient(135deg,#7C3AED,#5B21B6)', color:'#fff', border:'none', opacity:loading||!topic.trim()?0.6:1 }}>
              {loading ? '⚡ Generating...' : '⚡ Generate Content'}
            </button>
          </div>
          <div style={card}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>📋 Output</div>
            <div style={{ fontSize:12, color:'#64748B', marginBottom:16 }}>Edit, copy, or save your content</div>
            {!generated&&!loading&&<div style={{textAlign:'center',padding:'60px 0',color:'#64748B'}}><div style={{fontSize:48,marginBottom:12}}>✨</div><div style={{fontSize:13}}>Your AI content will appear here</div></div>}
            {loading&&<div style={{textAlign:'center',padding:'60px 0',color:'#64748B'}}><div style={{fontSize:48,marginBottom:12}}>⚡</div><div style={{fontSize:13}}>Aura AI is writing your content...</div></div>}
            {generated&&(
              <div>
                <div style={{marginBottom:12}}><label style={lbl}>Hook</label><div style={{background:'#7C3AED11',border:'1px solid #7C3AED33',borderRadius:8,padding:'10px 12px',fontSize:13,fontWeight:600,lineHeight:1.5}}>{generated.hook}</div></div>
                <div style={{marginBottom:12}}><label style={lbl}>Main Content</label><div style={{background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'10px 12px',fontSize:13,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{generated.primary}</div></div>
                <div style={{marginBottom:12}}><label style={lbl}>Call to Action</label><div style={{background:'#10B98111',border:'1px solid #10B98133',borderRadius:8,padding:'10px 12px',fontSize:13,fontWeight:600}}>{generated.cta}</div></div>
                <div style={{marginBottom:20}}><label style={lbl}>Hashtags</label><div style={{marginTop:4}}>{generated.hashtags.map(h=><span key={h} style={{display:'inline-block',background:'#06B6D422',color:'#06B6D4',borderRadius:6,padding:'2px 8px',fontSize:11,fontWeight:600,marginRight:4,marginBottom:4}}>#{h}</span>)}</div></div>
                <div style={{display:'flex',gap:10}}>
                  <button onClick={copyAll} style={{padding:'9px 18px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:'transparent',color:'#7C3AED',border:'1px solid #7C3AED'}}>{copied?'✓ Copied!':'📋 Copy All'}</button>
                  <button onClick={generate} style={{padding:'9px 18px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:'transparent',color:'#64748B',border:'1px solid #2A2A45'}}>🔄 Regenerate</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>⚡ Quick Templates</div>
          <div style={{fontSize:12,color:'#64748B',marginBottom:16}}>Click to pre-fill a proven prompt</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12}}>
            {[{l:'Summer Promo',i:'☀️',d:'Summer flash sale, limited time offer, exclusive deal'},{l:'Trust Builder',i:'🏆',d:'Customer success story, transformation, before and after results'},{l:'Lead Magnet',i:'🎯',d:'Free consultation, free audit, no-obligation offer'},{l:'Behind Scenes',i:'🎥',d:'Day in the life, behind the scenes, meet the team'},{l:'FAQ Post',i:'❓',d:'Common questions answered, myth busting, educational content'},{l:'Event Promo',i:'📅',d:'Upcoming event, workshop, webinar, limited seats'}].map(t=>(
              <div key={t.l} onClick={()=>setTopic(t.d)} style={{background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:12,padding:14,cursor:'pointer',textAlign:'center'}}>
                <div style={{fontSize:24,marginBottom:6}}>{t.i}</div>
                <div style={{fontSize:12,fontWeight:700}}>{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
