export type Layout = 'title' | 'bullets' | 'content' | 'two-col' | 'quote' | 'code' | 'closing';
export type Theme = 'dark' | 'midnight' | 'glass' | 'light';

export interface Slide {
  layout: Layout;
  title?: string;
  subtitle?: string;
  bullets?: string[];
  body?: string;
  left?: string;
  right?: string;
  quote?: string;
  attribution?: string;
  code?: string;
  language?: string;
  caption?: string;
}

export interface Deck {
  title: string;
  subtitle?: string;
  theme: Theme;
  slides: Slide[];
}

export interface SeedPrompt {
  label: string;
  prompt: string;
  theme: Theme;
}
