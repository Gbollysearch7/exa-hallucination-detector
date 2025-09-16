// app/api/extractclaims/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.1-70b-versatile';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// This function can run for a maximum of 60 seconds
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: 'Missing Groq API key' }, { status: 500 });
    }

    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert at extracting verifiable factual claims. Always respond with strict JSON that matches the requested schema.',
          },
          {
            role: 'user',
            content: `Extract every factual, verifiable claim from the provided text. Combine similar statements and avoid duplicates. Return ONLY valid JSON in the following format: [ { "claim": string, "original_text": string } ].\nText to analyse:\n${content}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq error: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Groq response missing content');
    }

    return NextResponse.json({ claims: JSON.parse(text) });
  } catch (error) {
    return NextResponse.json({ error: `Failed to extract claims | ${error}` }, { status: 500 });
  }
}
