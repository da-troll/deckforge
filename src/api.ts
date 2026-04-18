import type { Deck, Theme } from './types';

const SYSTEM_PROMPT = `You are a professional presentation designer. Generate slide decks as structured JSON.

Return ONLY a valid JSON object matching this exact schema — no markdown fences, no explanation:

{
  "title": "string",
  "subtitle": "string (optional)",
  "theme": "dark" | "midnight" | "glass" | "light",
  "slides": [
    {
      "layout": "title" | "bullets" | "content" | "two-col" | "quote" | "code" | "closing",
      "title": "string (optional)",
      "subtitle": "string (optional — title layout only)",
      "bullets": ["string", ...] (optional — bullets layout, 4-6 items),
      "body": "string (optional — content layout, 2-3 sentences)",
      "left": "string (optional — two-col layout)",
      "right": "string (optional — two-col layout)",
      "quote": "string (optional — quote layout, impactful 1-2 sentences)",
      "attribution": "string (optional — quote layout)",
      "code": "string (optional — code layout, realistic code snippet)",
      "language": "string (optional — code layout, e.g. typescript)",
      "caption": "string (optional — code layout)"
    }
  ]
}

Rules:
- Generate 8-12 slides total
- First slide: "title" layout
- Last slide: "closing" layout
- Mix layouts for visual variety — avoid 3+ consecutive same layouts
- Keep text concise — slides are not documents
- Bullets: 4-6 items max, start with action verbs or key nouns
- Choose theme based on topic mood: dark/midnight for tech, light for business, glass for creative
- The closing slide title should be memorable (not just "Thank You")
- Make content specific and informative, not generic filler`;

export async function generateDeck(
  prompt: string,
  apiKey: string,
  themeHint?: Theme,
  onProgress?: (msg: string) => void
): Promise<Deck> {
  onProgress?.('Connecting to Claude...');

  const userPrompt = themeHint
    ? `${prompt}\n\nPreferred theme: ${themeHint}`
    : prompt;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': apiKey,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    const msg = (err as { error?: { message?: string } })?.error?.message || response.statusText;
    throw new Error(`Claude API error: ${msg}`);
  }

  onProgress?.('Parsing slides...');

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>;
  };

  const text = data.content.find(b => b.type === 'text')?.text ?? '';

  // Strip markdown fences if Claude added them anyway
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  try {
    const deck = JSON.parse(cleaned) as Deck;
    if (!deck.slides || !Array.isArray(deck.slides)) {
      throw new Error('Invalid deck structure: missing slides array');
    }
    return deck;
  } catch (e) {
    throw new Error(`Failed to parse Claude response as JSON: ${(e as Error).message}\n\nRaw: ${cleaned.slice(0, 200)}`);
  }
}
