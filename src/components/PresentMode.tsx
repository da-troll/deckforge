import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Deck } from '../types';
import SlideRenderer from './SlideRenderer';

interface Props {
  deck: Deck;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  onExit: () => void;
}

export default function PresentMode({ deck, currentSlide, onSlideChange, onExit }: Props) {
  const total = deck.slides.length;

  const prev = useCallback(() => onSlideChange(Math.max(0, currentSlide - 1)), [currentSlide, onSlideChange]);
  const next = useCallback(() => onSlideChange(Math.min(total - 1, currentSlide + 1)), [currentSlide, total, onSlideChange]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onExit]);

  const slide = deck.slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Slide */}
      <div className="flex-1 flex items-center justify-center p-4" onClick={next}>
        <div className="w-full h-full max-w-[calc(100vh*16/9)]" style={{ aspectRatio: '16/9' }}>
          <SlideRenderer slide={slide} theme={deck.theme} index={currentSlide} total={total} />
        </div>
      </div>

      {/* Controls overlay */}
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-950/80 border-t border-zinc-800">
        <button onClick={onExit} className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs transition-colors cursor-pointer">
          <X className="w-3.5 h-3.5" />
          Exit (Esc)
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            disabled={currentSlide === 0}
            className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-zinc-400 font-mono w-16 text-center">
            {currentSlide + 1} / {total}
          </span>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            disabled={currentSlide === total - 1}
            className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1">
          {deck.slides.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); onSlideChange(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentSlide ? 'bg-forge w-4' : 'bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
