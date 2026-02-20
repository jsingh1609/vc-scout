import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url, companyName } = await req.json()

  if (!url || !companyName) {
    return NextResponse.json({ error: 'Missing url or companyName' }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
  }

  const pagesToScrape = [url, `${url.replace(/\/$/, '')}/about`, `${url.replace(/\/$/, '')}/careers`]
  const fetchedAt = new Date().toISOString()
  let scrapedText = ''
  const sources: { url: string; fetchedAt: string }[] = []

  for (const pageUrl of pagesToScrape) {
    try {
      const res = await fetch(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VCScout/1.0)' },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const html = await res.text()
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 3000)
      scrapedText += `\n\n[Source: ${pageUrl}]\n${text}`
      sources.push({ url: pageUrl, fetchedAt })
    } catch {
      // Skip failed pages
    }
  }

  if (!scrapedText.trim()) {
    scrapedText = `Company: ${companyName}. Website: ${url}`
    sources.push({ url, fetchedAt })
  }

  const prompt = `You are a VC analyst. Based on the following scraped public website content for "${companyName}", extract structured intelligence.

Content:
${scrapedText.slice(0, 4000)}

Respond with ONLY valid JSON, no markdown, no backticks:
{
  "summary": "1-2 sentence overview of what the company does",
  "whatTheyDo": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "signals": ["signal 1", "signal 2", "signal 3"]
}

Signals should be inferred from the content, e.g. "Careers page detected — actively hiring", "Recent blog activity found", "Changelog present — active product development", "Pricing page found — commercial product".`

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.3,
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('GROQ ERROR:', err)
      return NextResponse.json({ error: `Groq error: ${err.slice(0, 300)}` }, { status: 500 })
    }

    const groqData = await groqRes.json()
    const raw = groqData.choices?.[0]?.message?.content || '{}'
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed: any
    try {
      parsed = JSON.parse(cleaned)
    } catch (e) {
      console.error('PARSE ERROR:', cleaned)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    return NextResponse.json({
      summary: parsed.summary || '',
      whatTheyDo: parsed.whatTheyDo || [],
      keywords: parsed.keywords || [],
      signals: parsed.signals || [],
      sources,
    })

  } catch (e: any) {
    console.error('FETCH ERROR:', e.message)
    return NextResponse.json({ error: `Request failed: ${e.message}` }, { status: 500 })
  }
}