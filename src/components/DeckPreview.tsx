import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Deck } from '../types';
import SlideRenderer from './SlideRenderer';

interface Props {
  deck: Deck;
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

export default function DeckPreview({ deck, currentSlide, onSlideChange }: Props) {
  const slide = deck.slides[currentSlide];
  const total = deck.slides.length;

  const prev = () => onSlideChange(Math.max(0, currentSlide - 1));
  const next = () => onSlideChange(Math.min(total - 1, currentSlide + 1));

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Slide rail */}
      <div className="w-36 flex flex-col gap-2 overflow-y-auto scrollbar-hide shrink-0">
        {deck.slides.map((s, i) => (
          <button
            key={i}
            onClick={() => onSlideChange(i)}
            className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
              i === currentSlide
                ? 'border-forge'
                : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div style={{ pointerEvents: 'none' }}>
              <SlideRenderer slide={s} theme={deck.theme} index={i} total={total} scale={0.35} />
            </div>
            <div className={`absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded ${
              i === currentSlide ? 'bg-forge text-white' : 'bg-zinc-900/80 text-zinc-500'
            }`}>
              {i + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Main view */}
      <div className="flex flex-col flex-1 min-w-0 gap-3">
        {/* Slide */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-h-full" style={{ aspectRatio: '16/9' }}>
            <SlideRenderer slide={slide} theme={deck.theme} index={currentSlide} total={total} />
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>
          <span className="text-xs text-zinc-500 font-mono">
            {currentSlide + 1} / {total}
          </span>
          <button
            onClick={next}
            disabled={currentSlide === total - 1}
            className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
