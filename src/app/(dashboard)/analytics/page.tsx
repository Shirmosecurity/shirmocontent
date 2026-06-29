import { Topbar } from '@/components/layout/topbar'
export default function Page() {
  const info: Record<string,{icon:string;title:string;desc:string}> = {
    automation:{icon:'🤖',title:'Automation Workflows',desc:'Set-and-forget automations — weekly content, lead nurture sequences, review requests. Coming soon.'},
    analytics:{icon:'📊',title:'Analytics & Insights',desc:'Connect your social accounts to track engagement, reach, and lead conversions with AI recommendations.'},
    agents:{icon:'🧠',title:'AI Agent Hub',desc:'7 autonomous AI agents — Social Manager, Caption Writer, Ad Copywriter, Trend Analyzer, Content Strategist, Lead Engagement, and Video Script Assistant — all working 24/7.'},
  }
  const p = info['analytics']
  return (
    <>
      <Topbar title={p.title} />
      <main style={{padding:28}}>
        <div style={{background:'#16162A',border:'1px solid #2A2A45',borderRadius:14,padding:40,textAlign:'center',color:'#64748B'}}>
          <div style={{fontSize:48,marginBottom:12}}>{p.icon}</div>
          <div style={{fontSize:15,fontWeight:700,color:'#E2E8F0',marginBottom:8}}>{p.title}</div>
          <div style={{fontSize:13}}>{p.desc}</div>
        </div>
      </main>
    </>
  )
}
