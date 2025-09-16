// app/api/verifyclaims/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.1-70b-versatile';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { claim, original_text, exasources } = await req.json();

    if (!claim || !original_text || !exasources) {
      return NextResponse.json({ error: 'Claim and sources are required' }, { status: 400 });
    }

    const factCheckSchema = z.object({
      claim: z.string(),
      assessment: z.enum(["True", "False", "Insufficient Information"]),
      summary: z.string(),
      fixed_original_text: z.string(),
      confidence_score: z.number().min(0).max(100)
    });

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: 'Missing Groq API key' }, { status: 500 });
    }

    const sourcesFormatted = exasources
      .map(
        (source: any, index: number) => `Source ${index + 1}:
Text: ${source.text}
URL: ${source.url}
`,
      )
      .join('\n');

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
              'You are an exacting fact-checker. Only output strict JSON that matches the provided schema.',
          },
          {
            role: 'user',
            content: `Given the claim, original text, and supporting sources, provide a fact-checking judgment. Always respond with a JSON object that matches this schema: { "claim": string, "assessment": "True" | "False" | "Insufficient Information", "summary": string, "fixed_original_text": string, "confidence_score": number }.\n\nSources:\n${sourcesFormatted}\nOriginal text: ${original_text}\nClaim: ${claim}\n\nRemember: respond with valid JSON only.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq error: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Groq response missing content');
    }

    const parsed = factCheckSchema.parse(JSON.parse(content));

    console.log('LLM response:', parsed);
    return NextResponse.json({ claims: parsed });
  } catch (error) {
    console.error('Verify claims API error:', error);
    return NextResponse.json({ error: `Failed to extract claims | ${error}` }, { status: 500 });
  }
}
