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
  onProgress?.('Connecting to OpenAI...');

  const userPrompt = themeHint
    ? `${prompt}\n\nPreferred theme: ${themeHint}`
    : prompt;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    const msg = (err as { error?: { message?: string } })?.error?.message || response.statusText;
    throw new Error(`OpenAI API error: ${msg}`);
  }

  onProgress?.('Parsing slides...');

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  const text = data.choices[0]?.message?.content ?? '';

  try {
    const deck = JSON.parse(text) as Deck;
    if (!deck.slides || !Array.isArray(deck.slides)) {
      throw new Error('Invalid deck structure: missing slides array');
    }
    return deck;
  } catch (e) {
    throw new Error(`Failed to parse response as JSON: ${(e as Error).message}\n\nRaw: ${text.slice(0, 200)}`);
  }
}
