import Link from 'next/link'
export default function LandingPage() {
  return (
    <div style={{background:'#0F0F1A',minHeight:'100vh',color:'#E2E8F0',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 80px',borderBottom:'1px solid #2A2A45'}}>
        <div style={{fontSize:22,fontWeight:800,background:'linear-gradient(135deg,#7C3AED,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Aura AI</div>
        <div style={{display:'flex',gap:32,alignItems:'center'}}>
          <Link href="/login" style={{color:'#A78BFA',fontSize:14,textDecoration:'none'}}>Sign In</Link>
          <Link href="/register" style={{padding:'9px 20px',borderRadius:8,fontWeight:700,fontSize:14,background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',textDecoration:'none'}}>Start Free →</Link>
        </div>
      </nav>
      <section style={{textAlign:'center',padding:'100px 80px 80px'}}>
        <div style={{display:'inline-block',background:'#7C3AED22',color:'#A78BFA',border:'1px solid #7C3AED44',borderRadius:20,padding:'5px 16px',fontSize:12,fontWeight:700,marginBottom:24,letterSpacing:1}}>⚡ AI-POWERED CONTENT MARKETING</div>
        <h1 style={{fontSize:64,fontWeight:900,lineHeight:1.1,marginBottom:24,margin:'0 auto 24px'}}>
          Your Entire Marketing Team,{' '}
          <span style={{background:'linear-gradient(135deg,#7C3AED,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Powered by AI</span>
        </h1>
        <p style={{fontSize:20,color:'#64748B',maxWidth:600,margin:'0 auto 40px',lineHeight:1.6}}>Generate social captions, video scripts, ad copy, and full campaigns in seconds. 7 AI agents working 24/7 so you don't have to.</p>
        <div style={{display:'flex',gap:16,justifyContent:'center'}}>
          <Link href="/register" style={{padding:'14px 32px',borderRadius:10,fontWeight:700,fontSize:16,background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',textDecoration:'none'}}>Start Free — No Card Required →</Link>
          <Link href="/login" style={{padding:'14px 32px',borderRadius:10,fontWeight:700,fontSize:16,background:'transparent',color:'#A78BFA',border:'1px solid #7C3AED',textDecoration:'none'}}>Sign In</Link>
        </div>
        <div style={{marginTop:24,fontSize:12,color:'#64748B'}}>Trusted by gyms, med spas, real estate agencies, restaurants & MSPs</div>
      </section>
      <section style={{padding:'80px',borderTop:'1px solid #2A2A45'}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:12}}>Everything you need to dominate content</h2>
          <p style={{color:'#64748B',fontSize:16}}>One platform. All your marketing. Fully automated.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
          {[{i:'✍️',t:'AI Content Generator',d:'Captions, emails, ad copy, blog outlines — generated in seconds for your specific industry.'},{i:'🎬',t:'Video Script Studio',d:'Viral Reel and TikTok scripts with hooks, B-roll directions, and CTAs built in.'},{i:'🚀',t:'Campaign Builder',d:'Launch lead gen, seasonal, and review campaigns with one click. Templates for every industry.'},{i:'🤖',t:'Automation Workflows',d:'Weekly content drops, lead nurture sequences, review requests — all running on autopilot.'},{i:'🧠',t:'7 AI Agents',d:'Social Manager, Caption Writer, Ad Copywriter, Trend Analyzer and more — working together.'},{i:'📊',t:'Analytics & Insights',d:'Track engagement, reach, and lead conversions. AI recommends your best next moves.'}].map(f=>(
            <div key={f.t} style={{background:'#16162A',border:'1px solid #2A2A45',borderRadius:14,padding:28}}>
              <div style={{fontSize:36,marginBottom:12}}>{f.i}</div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>{f.t}</div>
              <div style={{fontSize:13,color:'#64748B',lineHeight:1.6}}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{padding:'80px',background:'#16162A',borderTop:'1px solid #2A2A45'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:36,fontWeight:800,marginBottom:12}}>Built for your industry</h2>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
          {['🏋️ Gyms & Fitness','🏠 Real Estate','🍕 Restaurants','💆 Med Spas','🔒 Cybersecurity & MSPs','🔧 Local Service'].map(i=>(
            <div key={i} style={{background:'#0F0F1A',border:'1px solid #2A2A45',borderRadius:10,padding:'12px 20px',fontSize:14,fontWeight:600}}>{i}</div>
          ))}
        </div>
      </section>
      <section style={{padding:'80px',borderTop:'1px solid #2A2A45'}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:12}}>Simple, transparent pricing</h2>
          <p style={{color:'#64748B'}}>Start free. Upgrade when you're ready.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,maxWidth:960,margin:'0 auto'}}>
          {[{name:'Starter',price:'$97',color:'#64748B',features:['50 AI Credits/day','1 Workspace','Caption & Video Generator','Basic Analytics','Email Support']},{name:'Growth',price:'$197',color:'#7C3AED',badge:'Most Popular',features:['Unlimited AI Content','3 Workspaces','All Content Types','Campaign Builder','3 Active AI Agents','Priority Support']},{name:'Agency',price:'$497',color:'#F59E0B',features:['Unlimited Everything','25 Workspaces','White-Label','All 7 AI Agents','Dedicated Manager']}].map(p=>(
            <div key={p.name} style={{background:'#16162A',border:`1px solid ${p.color}44`,borderRadius:16,padding:28,position:'relative'}}>
              {(p as any).badge&&<div style={{position:'absolute',top:-12,left:20,background:'#7C3AED',color:'#fff',borderRadius:20,padding:'4px 14px',fontSize:11,fontWeight:700}}>{(p as any).badge}</div>}
              <div style={{fontSize:18,fontWeight:800,color:p.color,marginBottom:4}}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:20}}><span style={{fontSize:40,fontWeight:900}}>{p.price}</span><span style={{color:'#64748B'}}>/mo</span></div>
              <div style={{borderTop:'1px solid #2A2A45',marginBottom:20}}/>
              {p.features.map(f=><div key={f} style={{fontSize:13,padding:'5px 0'}}>✓ {f}</div>)}
              <Link href="/register" style={{display:'block',textAlign:'center',padding:'12px',borderRadius:8,fontWeight:700,fontSize:14,background:`linear-gradient(135deg,${p.color},${p.color}99)`,color:'#fff',textDecoration:'none',marginTop:24}}>Get Started →</Link>
            </div>
          ))}
        </div>
      </section>
      <section style={{padding:'80px',textAlign:'center',borderTop:'1px solid #2A2A45'}}>
        <h2 style={{fontSize:48,fontWeight:900,marginBottom:16}}>Ready to put your marketing on <span style={{background:'linear-gradient(135deg,#7C3AED,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>autopilot?</span></h2>
        <p style={{color:'#64748B',fontSize:18,marginBottom:40}}>Join hundreds of businesses generating more content, more leads, and more revenue with Aura AI.</p>
        <Link href="/register" style={{padding:'16px 40px',borderRadius:10,fontWeight:700,fontSize:18,background:'linear-gradient(135deg,#7C3AED,#5B21B6)',color:'#fff',textDecoration:'none'}}>Start Free Today →</Link>
      </section>
      <footer style={{padding:'32px 80px',borderTop:'1px solid #2A2A45',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:16,fontWeight:800,background:'linear-gradient(135deg,#7C3AED,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Aura AI</div>
        <div style={{fontSize:12,color:'#64748B'}}>© 2025 Aura AI. All rights reserved.</div>
        <div style={{display:'flex',gap:20}}>{['Privacy','Terms','Contact'].map(l=><a key={l} href="#" style={{fontSize:12,color:'#64748B',textDecoration:'none'}}>{l}</a>)}</div>
      </footer>
    </div>
  )
}
