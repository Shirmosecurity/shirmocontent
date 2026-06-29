export async function generateContent({ industry, contentType, topic }: { industry: string; contentType: string; topic: string }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: `You are Aura AI, an elite marketing copywriter for ${industry} businesses. Return ONLY a valid JSON object with no markdown, no backticks, no explanation: {"primary":"main content text","hook":"attention-grabbing opening line","cta":"call to action","hashtags":["tag1","tag2","tag3","tag4","tag5"],"variation":"alternative version"}`,
      messages: [{ role: 'user', content: `Create a ${contentType} for a ${industry} business about: ${topic}` }],
    }),
  })
  console.log('Anthropic status:', response.status)
  const data = await response.json()
  console.log('Anthropic response:', JSON.stringify(data).slice(0, 500))
  if (!response.ok) throw new Error(`Anthropic API error: ${data.error?.message || response.status}`)
  const text = data.content?.[0]?.text || ''
  console.log('Raw text:', text.slice(0, 300))
  const clean = text.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(clean)
  return parsed
}

export async function generateVideoScript({ topic, format }: { topic: string; format: string }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: `You are a viral short-form video script writer for ${format}. Return ONLY valid JSON no markdown no backticks: {"hook":"first 3 seconds hook","script":"full script with [PAUSE] and [VISUAL] cues","cta":"end call to action","b_roll":["visual1","visual2","visual3"],"hashtags":["tag1","tag2","tag3"]}`,
      messages: [{ role: 'user', content: `Write a viral ${format} script about: ${topic}` }],
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(`Anthropic API error: ${data.error?.message || response.status}`)
  const text = data.content?.[0]?.text || ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}


