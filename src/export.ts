import type { Deck, Slide, Theme } from './types';

const THEME_CSS: Record<Theme, string> = {
  dark: `
    --bg: #18181b; --surface: #27272a; --accent: #6366f1; --accent2: #818cf8;
    --text: #f4f4f5; --muted: #a1a1aa; --border: #3f3f46; --code-bg: #0f0f11;`,
  midnight: `
    --bg: #020617; --surface: #0f172a; --accent: #22d3ee; --accent2: #67e8f9;
    --text: #e2e8f0; --muted: #94a3b8; --border: #1e293b; --code-bg: #010409;`,
  glass: `
    --bg: #0c0c14; --surface: rgba(255,255,255,0.06); --accent: #a78bfa; --accent2: #c4b5fd;
    --text: #f8fafc; --muted: #94a3b8; --border: rgba(255,255,255,0.12); --code-bg: rgba(0,0,0,0.4);`,
  light: `
    --bg: #ffffff; --surface: #f4f4f5; --accent: #4f46e5; --accent2: #6366f1;
    --text: #18181b; --muted: #71717a; --border: #e4e4e7; --code-bg: #f1f5f9;`,
};

function renderSlideHtml(slide: Slide, index: number, total: number): string {
  const num = `<div class="num">${index + 1} / ${total}</div>`;
  const bar = `<div class="bar"></div>`;

  switch (slide.layout) {
    case 'title':
      return `
        ${bar}
        <div class="center">
          ${slide.title ? `<h1 class="big-title">${esc(slide.title)}</h1>` : ''}
          ${slide.subtitle ? `<p class="big-sub">${esc(slide.subtitle)}</p>` : ''}
        </div>
        ${num}`;

    case 'bullets':
      return `
        ${bar}
        <div class="layout-bullets">
          ${slide.title ? `<h2 class="slide-title">${esc(slide.title)}</h2>` : ''}
          <ul class="bullet-list">
            ${(slide.bullets ?? []).map(b => `<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>
        ${num}`;

    case 'content':
      return `
        ${bar}
        <div class="layout-content">
          ${slide.title ? `<h2 class="slide-title">${esc(slide.title)}</h2>` : ''}
          ${slide.body ? `<p class="body-text">${esc(slide.body)}</p>` : ''}
        </div>
        ${num}`;

    case 'two-col':
      return `
        ${bar}
        <div class="layout-two-col">
          ${slide.title ? `<h2 class="slide-title col-span">${esc(slide.title)}</h2>` : ''}
          <div class="col-grid">
            <div class="col">${slide.left ? `<p>${esc(slide.left)}</p>` : ''}</div>
            <div class="col">${slide.right ? `<p>${esc(slide.right)}</p>` : ''}</div>
          </div>
        </div>
        ${num}`;

    case 'quote':
      return `
        ${bar}
        <div class="center">
          <div class="quote-mark">"</div>
          ${slide.quote ? `<blockquote>${esc(slide.quote)}</blockquote>` : ''}
          ${slide.attribution ? `<cite>— ${esc(slide.attribution)}</cite>` : ''}
        </div>
        ${num}`;

    case 'code':
      return `
        ${bar}
        <div class="layout-code">
          ${slide.title ? `<h2 class="slide-title">${esc(slide.title)}</h2>` : ''}
          <pre class="code-block"><code>${esc(slide.code ?? '')}</code></pre>
          ${slide.caption ? `<p class="caption">${esc(slide.caption)}</p>` : ''}
        </div>
        ${num}`;

    case 'closing':
      return `
        ${bar}
        <div class="center">
          ${slide.title ? `<h1 class="closing-title">${esc(slide.title)}</h1>` : ''}
          ${slide.subtitle ? `<p class="big-sub">${esc(slide.subtitle)}</p>` : ''}
        </div>
        ${num}`;

    default:
      return `${bar}<div class="center"><h2>${esc(slide.title ?? '')}</h2></div>${num}`;
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function exportDeckAsHtml(deck: Deck): void {
  const themeVars = THEME_CSS[deck.theme] ?? THEME_CSS.dark;
  const slidesHtml = deck.slides
    .map((s, i) => `<div class="slide">${renderSlideHtml(s, i, deck.slides.length)}</div>`)
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(deck.title)}</title>
  <style>
    :root { ${themeVars} }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #000; display: flex; flex-direction: column; align-items: center;
           justify-content: center; min-height: 100vh; font-family: ui-sans-serif, system-ui, sans-serif; }
    #deck-wrap { width: 100%; max-width: 1200px; padding: 0 20px; }
    .slide { display: none; aspect-ratio: 16/9; background: var(--bg); color: var(--text);
             position: relative; overflow: hidden; border-radius: 8px; }
    .slide.active { display: flex; flex-direction: column; }
    .bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); }
    .num { position: absolute; bottom: 14px; right: 18px; font-size: 11px; color: var(--muted);
           font-family: monospace; }
    .center { display: flex; flex-direction: column; align-items: center; justify-content: center;
              flex: 1; padding: 60px; text-align: center; }
    .big-title { font-size: clamp(28px, 4vw, 54px); font-weight: 800; letter-spacing: -1px;
                 color: var(--text); margin-bottom: 16px; }
    .big-sub { font-size: clamp(14px, 1.8vw, 22px); color: var(--muted); max-width: 640px; }
    .closing-title { font-size: clamp(28px, 4.5vw, 64px); font-weight: 900; color: var(--accent);
                     letter-spacing: -2px; }
    .quote-mark { font-size: 80px; line-height: 0.8; color: var(--accent); font-family: Georgia, serif;
                  margin-bottom: 16px; }
    blockquote { font-size: clamp(16px, 2.2vw, 28px); font-style: italic; max-width: 700px;
                 line-height: 1.5; color: var(--text); margin-bottom: 20px; }
    cite { font-size: 14px; color: var(--muted); }
    .layout-bullets, .layout-content, .layout-code, .layout-two-col { padding: 40px 56px; flex: 1; display: flex; flex-direction: column; }
    .slide-title { font-size: clamp(20px, 2.5vw, 32px); font-weight: 700; color: var(--accent2);
                   margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
    .bullet-list { list-style: none; display: flex; flex-direction: column; gap: 10px; flex: 1; justify-content: center; }
    .bullet-list li { font-size: clamp(13px, 1.6vw, 20px); color: var(--text); padding-left: 20px; position: relative; line-height: 1.4; }
    .bullet-list li::before { content: '▸'; position: absolute; left: 0; color: var(--accent); }
    .body-text { font-size: clamp(14px, 1.7vw, 22px); color: var(--text); line-height: 1.7; flex: 1; display: flex; align-items: center; }
    .col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; }
    .col { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 24px;
           font-size: clamp(12px, 1.4vw, 18px); color: var(--text); line-height: 1.6; display: flex; align-items: center; }
    .code-block { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px;
                  padding: 16px 20px; overflow-x: auto; font-family: monospace; font-size: clamp(10px, 1.2vw, 14px);
                  color: var(--accent2); line-height: 1.6; flex: 1; white-space: pre; }
    .caption { font-size: 12px; color: var(--muted); margin-top: 10px; }
    nav { display: flex; align-items: center; gap: 16px; margin-top: 16px; }
    button { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;
             padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.15s; }
    button:hover { background: rgba(255,255,255,0.2); }
    button:disabled { opacity: 0.35; cursor: default; }
    #counter { color: #a1a1aa; font-size: 13px; font-family: monospace; min-width: 60px; text-align: center; }
    .title-badge { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
  </style>
</head>
<body>
<div id="deck-wrap">
  <div id="slides">
${slidesHtml}
  </div>
  <nav>
    <button id="prev">← Prev</button>
    <span id="counter">1 / ${deck.slides.length}</span>
    <button id="next">Next →</button>
    <span style="flex:1"></span>
    <span style="color:#52525b;font-size:12px">Built with DeckForge</span>
  </nav>
</div>
<script>
  const slides = document.querySelectorAll('.slide');
  let cur = 0;
  function show(n) {
    if (n < 0 || n >= slides.length) return;
    slides.forEach((s, i) => s.classList.toggle('active', i === n));
    cur = n;
    document.getElementById('counter').textContent = (cur + 1) + ' / ' + slides.length;
    document.getElementById('prev').disabled = cur === 0;
    document.getElementById('next').disabled = cur === slides.length - 1;
  }
  document.getElementById('prev').onclick = () => show(cur - 1);
  document.getElementById('next').onclick = () => show(cur + 1);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); show(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
  });
  show(0);
<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${deck.title.replace(/\s+/g, '-').toLowerCase()}.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
