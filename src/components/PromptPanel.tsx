import { useState } from 'react';
import { Sparkles, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { SEEDS } from '../seeds';
import { MODELS, DEFAULT_MODEL } from '../models';
import type { Theme } from '../types';

interface Props {
  onGenerate: (prompt: string, theme: Theme, model: string) => void;
  generating: boolean;
  progress: string;
}

// Build grouped options for <select>
const MODEL_GROUPS = MODELS.reduce<Record<string, typeof MODELS>>((acc, m) => {
  (acc[m.group] ??= []).push(m);
  return acc;
}, {});

export default function PromptPanel({ onGenerate, generating, progress }: Props) {
  const [prompt, setPrompt] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [showSeeds, setShowSeeds] = useState(true);

  const handleGenerate = () => {
    const text = prompt.trim();
    if (!text || generating) return;
    onGenerate(text, theme, model);
  };

  const loadSeed = (seed: (typeof SEEDS)[0]) => {
    setPrompt(seed.prompt);
    setTheme(seed.theme);
  };

  const selectedModel = MODELS.find(m => m.id === model);
  const isReasoning = selectedModel?.reasoning ?? false;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      {/* Hero */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-4">
          <Zap className="w-3 h-3 text-forge" />
          AI Slide Builder
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Describe your presentation
        </h1>
        <p className="text-zinc-400 text-sm">
          GPT generates a complete slide deck from your prompt. Export as a standalone HTML file.
        </p>
      </div>

      {/* Prompt input */}
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe the presentation you need — topic, audience, key points, tone..."
          rows={5}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-forge resize-none transition-colors"
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
          }}
        />

        {/* Model + Theme row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Model selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 shrink-0">Model:</span>
            <div className="relative">
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="appearance-none bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:border-forge cursor-pointer"
              >
                {Object.entries(MODEL_GROUPS).map(([group, opts]) => (
                  <optgroup key={group} label={group}>
                    {opts.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.label}{m.note ? ` — ${m.note}` : ''}{m.reasoning ? ' ⟳' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {isReasoning && (
              <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                reasoning — may be slow
              </span>
            )}
          </div>

          {/* Theme picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 shrink-0">Theme:</span>
            <div className="flex gap-1.5">
              {(['dark', 'midnight', 'glass', 'light'] as Theme[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${
                    theme === t
                      ? 'bg-forge text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-zinc-600 flex-1">⌘+Enter to generate</p>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="flex items-center gap-2 bg-forge hover:bg-forge-dim disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm cursor-pointer shrink-0"
          >
            {generating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {progress || 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Deck
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seed prompts */}
      <div>
        <button
          onClick={() => setShowSeeds(v => !v)}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer mb-3"
        >
          {showSeeds ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Household seed prompts ({SEEDS.length})
        </button>

        {showSeeds && (
          <div className="grid grid-cols-2 gap-2">
            {SEEDS.map(seed => (
              <button
                key={seed.label}
                onClick={() => loadSeed(seed)}
                className="text-left bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-xl p-3 transition-all cursor-pointer group"
              >
                <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors mb-1">
                  {seed.label}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded capitalize">{seed.theme}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
