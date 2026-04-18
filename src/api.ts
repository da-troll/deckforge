import type { Deck, Theme } from './types';
import { getModel } from './models';

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
  modelId: string,
  themeHint?: Theme,
  onProgress?: (msg: string) => void
): Promise<Deck> {
  onProgress?.(`Sending to ${modelId}...`);

  const model = getModel(modelId);
  const isReasoning = model.reasoning ?? false;

  const userPrompt = themeHint
    ? `${prompt}\n\nPreferred theme: ${themeHint}\n\nIMPORTANT: Respond with ONLY a valid JSON object — no markdown, no explanation.`
    : `${prompt}\n\nIMPORTANT: Respond with ONLY a valid JSON object — no markdown, no explanation.`;

  const body: Record<string, unknown> = {
    model: modelId,
    max_tokens: 4096,
    messages: isReasoning
      ? [{ role: 'user', content: `${SYSTEM_PROMPT}\n\n---\n\n${userPrompt}` }]
      : [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
  };

  // json_object response_format not supported by o-series reasoning models
  if (!isReasoning) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    const msg = (err as { error?: { message?: string } })?.error?.message || response.statusText;
    throw new Error(`OpenAI API error (${modelId}): ${msg}`);
  }

  onProgress?.('Parsing slides...');

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  const text = data.choices[0]?.message?.content ?? '';

  // Strip markdown fences if model wrapped the JSON anyway
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  try {
    const deck = JSON.parse(cleaned) as Deck;
    if (!deck.slides || !Array.isArray(deck.slides)) {
      throw new Error('Invalid deck structure: missing slides array');
    }
    return deck;
  } catch (e) {
    throw new Error(`Failed to parse response as JSON: ${(e as Error).message}\n\nRaw: ${cleaned.slice(0, 300)}`);
  }
}
