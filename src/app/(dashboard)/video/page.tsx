'use client'
import { useState, useEffect } from 'react'
import { Topbar } from '@/components/layout/topbar'
interface Script { hook:string; script:string; cta:string; b_roll:string[]; hashtags:string[] }
const FORMATS = ['Reel (30s)','TikTok (60s)','YouTube Short (60s)']
export default function VideoPage() {
  const [topic,setTopic]=useState(''); const [format,setFormat]=useState(FORMATS[0])
  const [result,setResult]=useState<Script|null>(null); const [loading,setLoading]=useState(false)
  const [error,setError]=useState(''); const [workspaceId,setWorkspaceId]=useState('')
  useEffect(()=>{ fetch('/api/workspace').then(r=>r.json()).then(d=>{ if(d[0]) setWorkspaceId(d[0].id) }) },[])
  async function generate() {
    if(!topic.trim()||!workspaceId) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res=await fetch('/api/video/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic,format,workspaceId})})
      const data=await res.json(); if(!res.ok) throw new Error(data.error); setResult(data)
    } catch(err:any){ setError(err.message||'Generation failed') }
    setLoading(false)
  }
  const card={background:'#16162A',border:'1px solid #2A2A45',borderRadius:14,padding:24}
  const inp={width:'100%',background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'10px 12px',color:'#E2E8F0',fontSize:13,outline:'none',boxSizing:'border-box' as const}
  const lbl={display:'block' as const,fontSize:11,color:'#64748B',marginBottom:6,textTransform:'uppercase' as const,letterSpacing:1}
  return (
    <>
      <Topbar title="Video Script Studio" />
      <main style={{padding:28,flex:1,overflowY:'auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:24}}>
          <div style={card}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>🎬 Script Generator</div>
            <div style={{fontSize:12,color:'#64748B',marginBottom:20}}>Viral-optimized for Reels, TikTok & Shorts</div>
            <div style={{marginBottom:14}}>
              <label style={lbl}>Format</label>
              <div style={{display:'flex',gap:8}}>{FORMATS.map(f=><button key={f} onClick={()=>setFormat(f)} style={{flex:1,padding:'8px',borderRadius:8,fontWeight:600,fontSize:11,cursor:'pointer',background:format===f?'#7C3AED22':'transparent',color:format===f?'#A78BFA':'#64748B',border:format===f?'1px solid #7C3AED':'1px solid #2A2A45'}}>{f}</button>)}</div>
            </div>
            <div style={{marginBottom:20}}><label style={lbl}>Script Topic</label><textarea style={{...inp,minHeight:100,resize:'vertical'}} placeholder='e.g. "Why most gym programs fail"' value={topic} onChange={e=>setTopic(e.target.value)} /></div>
            {error&&<div style={{background:'#7F1D1D22',border:'1px solid #7F1D1D55',borderRadius:8,padding:'10px 12px',color:'#FCA5A5',fontSize:12,marginBottom:14}}>{error}</div>}
            <button onClick={generate} disabled={loading||!topic.trim()} style={{width:'100%',padding:11,borderRadius:8,fontWeight:700,fontSize:14,cursor:'pointer',background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',border:'none',opacity:loading||!topic.trim()?0.6:1}}>
              {loading?'🎬 Writing Script...':'🎬 Generate Script'}
            </button>
          </div>
          <div style={card}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>📝 Script Output</div>
            <div style={{fontSize:12,color:'#64748B',marginBottom:16}}>Ready to record</div>
            {!result&&!loading&&<div style={{textAlign:'center',padding:'60px 0',color:'#64748B'}}><div style={{fontSize:48,marginBottom:12}}>🎬</div><div style={{fontSize:13}}>Enter a topic to generate your script</div></div>}
            {loading&&<div style={{textAlign:'center',padding:'60px 0',color:'#64748B'}}><div style={{fontSize:48,marginBottom:12}}>⚡</div><div style={{fontSize:13}}>Writing your viral script...</div></div>}
            {result&&(
              <div>
                <div style={{marginBottom:12}}><label style={lbl}>🪝 Hook (First 3 seconds)</label><div style={{background:'#F59E0B11',border:'1px solid #F59E0B33',borderRadius:8,padding:'10px 12px',fontSize:13,fontWeight:600}}>{result.hook}</div></div>
                <div style={{marginBottom:12}}><label style={lbl}>📜 Full Script</label><div style={{background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:8,padding:'10px 12px',fontSize:12,lineHeight:1.7,whiteSpace:'pre-wrap',maxHeight:180,overflowY:'auto'}}>{result.script}</div></div>
                <div style={{marginBottom:12}}><label style={lbl}>🎥 B-Roll Ideas</label>{result.b_roll.map((b,i)=><div key={i} style={{fontSize:12,color:'#64748B',padding:'3px 0'}}>• {b}</div>)}</div>
                <div style={{marginBottom:16}}><label style={lbl}>Call to Action</label><div style={{background:'#10B98111',border:'1px solid #10B98133',borderRadius:8,padding:'8px 12px',fontSize:13,fontWeight:600}}>{result.cta}</div></div>
                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>navigator.clipboard.writeText(`${result.hook}\n\n${result.script}\n\n${result.cta}`)} style={{padding:'9px 18px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:'transparent',color:'#7C3AED',border:'1px solid #7C3AED'}}>📋 Copy Script</button>
                  <button onClick={generate} style={{padding:'9px 18px',borderRadius:8,fontWeight:600,fontSize:13,cursor:'pointer',background:'transparent',color:'#64748B',border:'1px solid #2A2A45'}}>🔄 Regenerate</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>🎯 Script Frameworks</div>
          <div style={{fontSize:12,color:'#64748B',marginBottom:16}}>Click to apply a proven structure</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {[{i:'🎯',t:'Hook Formula',d:'Pattern interrupt + curiosity gap + payoff',p:'Use hook formula: pattern interrupt then curiosity then payoff for'},{i:'📖',t:'Story Arc',d:'Problem → tension → solution → CTA',p:'Write a story arc: problem then tension then solution then CTA about'},{i:'🔥',t:'Trend Jacking',d:'Ride trending audio with your message',p:'Create a trend-jacking script riding current viral trends about'},{i:'📊',t:'Education Loop',d:'Teach one thing, tease the next',p:'Write an education loop teaching one key insight and teasing more about'}].map(f=>(
              <div key={f.t} onClick={()=>setTopic(f.p)} style={{background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:12,padding:16,cursor:'pointer'}}>
                <div style={{fontSize:28,marginBottom:8}}>{f.i}</div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{f.t}</div>
                <div style={{fontSize:11,color:'#64748B'}}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
