import { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface Props {
  onSave: (key: string) => void;
}

export default function ApiKeySetup({ onSave }: Props) {
  const [value, setValue] = useState('');

  const isValid = value.trim().startsWith('sk-');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (isValid) {
      localStorage.setItem('deckforge:apiKey', trimmed);
      onSave(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-forge/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-forge" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">OpenAI API Key</h2>
            <p className="text-xs text-zinc-400">Required for AI slide generation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-forge transition-colors font-mono"
              autoFocus
            />
            <p className="mt-2 text-xs text-zinc-500">
              Stored in localStorage. Never sent anywhere except api.openai.com.
            </p>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-forge hover:bg-forge-dim disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer"
          >
            Start Building Decks
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Get an API key from platform.openai.com
          </a>
        </div>
      </div>
    </div>
  );
}
