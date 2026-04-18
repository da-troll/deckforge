export interface ModelOption {
  id: string;
  label: string;
  group: string;
  reasoning?: boolean; // o-series: no response_format support
  note?: string;
}

export const MODELS: ModelOption[] = [
  // Latest 2026
  { id: 'gpt-5.4',          label: 'GPT-5.4',              group: 'Latest (2026)' },
  { id: 'gpt-5.4-mini',     label: 'GPT-5.4 Mini',         group: 'Latest (2026)', note: 'Fast' },
  { id: 'gpt-5.4-nano',     label: 'GPT-5.4 Nano',         group: 'Latest (2026)', note: 'Cheapest' },
  { id: 'gpt-5.3-codex',    label: 'GPT-5.3 Codex',        group: 'Latest (2026)', note: 'Code' },

  // GPT-5 series 2025
  { id: 'gpt-5.2',             label: 'GPT-5.2',              group: 'GPT-5 (2025)' },
  { id: 'gpt-5.1',             label: 'GPT-5.1',              group: 'GPT-5 (2025)' },
  { id: 'gpt-5.1-codex-max',   label: 'GPT-5.1 Codex Max',   group: 'GPT-5 (2025)', note: 'Agentic coding' },
  { id: 'gpt-5.1-codex',       label: 'GPT-5.1 Codex',       group: 'GPT-5 (2025)', note: 'Code' },
  { id: 'gpt-5.1-codex-mini',  label: 'GPT-5.1 Codex Mini',  group: 'GPT-5 (2025)', note: 'Code, fast' },
  { id: 'gpt-5',               label: 'GPT-5',                group: 'GPT-5 (2025)' },
  { id: 'gpt-5-codex',         label: 'GPT-5 Codex',         group: 'GPT-5 (2025)', note: 'Code' },
  { id: 'gpt-5-mini',          label: 'GPT-5 Mini',          group: 'GPT-5 (2025)', note: 'Fast' },

  // GPT-4.x
  { id: 'gpt-4.5',        label: 'GPT-4.5',         group: 'GPT-4.x' },
  { id: 'gpt-4.1',        label: 'GPT-4.1',         group: 'GPT-4.x', note: '1M ctx' },
  { id: 'gpt-4.1-mini',   label: 'GPT-4.1 Mini',   group: 'GPT-4.x', note: 'Fast' },
  { id: 'gpt-4.1-nano',   label: 'GPT-4.1 Nano',   group: 'GPT-4.x', note: 'Cheapest' },
  { id: 'gpt-4o',         label: 'GPT-4o',          group: 'GPT-4.x' },
  { id: 'gpt-4o-mini',    label: 'GPT-4o Mini',    group: 'GPT-4.x', note: 'Fast' },

  // Reasoning — o-series
  { id: 'o3-pro',   label: 'o3 Pro',   group: 'Reasoning', reasoning: true, note: 'Slowest, best' },
  { id: 'o3',       label: 'o3',       group: 'Reasoning', reasoning: true },
  { id: 'o4-mini',  label: 'o4-mini',  group: 'Reasoning', reasoning: true, note: 'Technical' },
  { id: 'o3-mini',  label: 'o3-mini',  group: 'Reasoning', reasoning: true, note: 'Fast' },
  { id: 'o1-pro',   label: 'o1 Pro',   group: 'Reasoning', reasoning: true },
  { id: 'o1',       label: 'o1',       group: 'Reasoning', reasoning: true },
  { id: 'o1-mini',  label: 'o1-mini',  group: 'Reasoning', reasoning: true, note: 'Fast' },

  // Codex CLI
  { id: 'codex-mini-latest', label: 'Codex Mini', group: 'Codex', note: 'CLI optimized' },
];

export const DEFAULT_MODEL = 'gpt-4.1';

export function getModel(id: string): ModelOption {
  return MODELS.find(m => m.id === id) ?? { id, label: id, group: 'Custom' };
}
