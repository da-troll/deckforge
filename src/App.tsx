import { useState, useEffect } from 'react';
import { Layers, Play, Download, Plus, Settings, AlertCircle } from 'lucide-react';
import type { Deck, Theme } from './types';
import { generateDeck } from './api';
import { exportDeckAsHtml } from './export';
import ApiKeySetup from './components/ApiKeySetup';
import PromptPanel from './components/PromptPanel';
import DeckPreview from './components/DeckPreview';
import PresentMode from './components/PresentMode';

export default function App() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('deckforge:apiKey') ?? '');
  const [showKeySetup, setShowKeySetup] = useState(false);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Show key setup if no key on first load
  useEffect(() => {
    if (!apiKey) setShowKeySetup(true);
  }, []);

  const handleGenerate = async (prompt: string, theme: Theme) => {
    if (!apiKey) { setShowKeySetup(true); return; }
    setGenerating(true);
    setError(null);
    setProgress('Sending to Claude...');
    try {
      const result = await generateDeck(prompt, apiKey, theme, setProgress);
      setDeck(result);
      setCurrentSlide(0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
      setProgress('');
    }
  };

  const handleExport = () => {
    if (deck) exportDeckAsHtml(deck);
  };

  const handleNewDeck = () => {
    setDeck(null);
    setCurrentSlide(0);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3 bg-zinc-950 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-forge rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white">DeckForge</span>
          <span className="text-zinc-600 text-xs hidden sm:inline">AI Slide Builder</span>
        </div>

        <div className="flex-1" />

        {deck && (
          <div className="flex items-center gap-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-1 max-w-sm overflow-hidden">
            <span className="text-xs text-zinc-400 truncate">{deck.title}</span>
            <span className="text-[10px] text-zinc-600 shrink-0">· {deck.slides.length} slides</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {deck && (
            <>
              <button
                onClick={() => setPresenting(true)}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Present
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 bg-forge hover:bg-forge-dim text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export HTML
              </button>
              <button
                onClick={handleNewDeck}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                title="New deck"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={() => setShowKeySetup(true)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-zinc-800"
            title="API key settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        {error && (
          <div className="mx-6 mt-4 flex items-start gap-3 bg-red-950/40 border border-red-800/50 rounded-xl p-4">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-300 font-medium">Generation failed</p>
              <p className="text-xs text-red-400/80 mt-1 font-mono break-all">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-300 text-xs cursor-pointer">✕</button>
          </div>
        )}

        {deck ? (
          <div className="h-full">
            <DeckPreview
              deck={deck}
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <PromptPanel
              onGenerate={handleGenerate}
              generating={generating}
              progress={progress}
            />
          </div>
        )}
      </main>

      {/* Present mode */}
      {presenting && deck && (
        <PresentMode
          deck={deck}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
          onExit={() => setPresenting(false)}
        />
      )}

      {/* API key modal */}
      {showKeySetup && (
        <ApiKeySetup
          onSave={key => {
            setApiKey(key);
            setShowKeySetup(false);
          }}
        />
      )}
    </div>
  );
}
