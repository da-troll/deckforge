import type { Slide, Theme } from '../types';

interface Props {
  slide: Slide;
  theme: Theme;
  index: number;
  total: number;
  scale?: number;
}

export default function SlideRenderer({ slide, theme, index, total, scale = 1 }: Props) {
  const themeClass = `theme-${theme}`;

  const inner = renderLayout(slide);

  return (
    <div
      className={`slide-wrap ${themeClass}`}
      style={{ fontSize: `${scale}rem` }}
    >
      <div className="accent-bar" />
      {inner}
      <div className="slide-num">{index + 1} / {total}</div>
    </div>
  );
}

function renderLayout(slide: Slide) {
  switch (slide.layout) {
    case 'title':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '60px', textAlign: 'center' }}>
          {slide.title && (
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--slide-text)', marginBottom: '16px', lineHeight: 1.1 }}>
              {slide.title}
            </h1>
          )}
          {slide.subtitle && (
            <p style={{ fontSize: 'clamp(13px, 1.8vw, 20px)', color: 'var(--slide-muted)', maxWidth: '600px', lineHeight: 1.5 }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    case 'bullets':
      return (
        <div style={{ padding: '36px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {slide.title && (
            <h2 style={{ fontSize: 'clamp(16px, 2.2vw, 28px)', fontWeight: 700, color: 'var(--slide-accent2)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--slide-border)' }}>
              {slide.title}
            </h2>
          )}
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'center' }}>
            {(slide.bullets ?? []).map((b, i) => (
              <li key={i} style={{ fontSize: 'clamp(12px, 1.5vw, 18px)', color: 'var(--slide-text)', paddingLeft: '20px', position: 'relative', lineHeight: 1.4 }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--slide-accent)' }}>▸</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'content':
      return (
        <div style={{ padding: '36px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {slide.title && (
            <h2 style={{ fontSize: 'clamp(16px, 2.2vw, 28px)', fontWeight: 700, color: 'var(--slide-accent2)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--slide-border)' }}>
              {slide.title}
            </h2>
          )}
          {slide.body && (
            <p style={{ fontSize: 'clamp(14px, 1.7vw, 21px)', color: 'var(--slide-text)', lineHeight: 1.7, flex: 1, display: 'flex', alignItems: 'center' }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'two-col':
      return (
        <div style={{ padding: '36px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {slide.title && (
            <h2 style={{ fontSize: 'clamp(16px, 2.2vw, 28px)', fontWeight: 700, color: 'var(--slide-accent2)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--slide-border)' }}>
              {slide.title}
            </h2>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
            <div style={{ background: 'var(--slide-surface)', border: '1px solid var(--slide-border)', borderRadius: '8px', padding: '20px', fontSize: 'clamp(11px, 1.3vw, 17px)', color: 'var(--slide-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center' }}>
              {slide.left}
            </div>
            <div style={{ background: 'var(--slide-surface)', border: '1px solid var(--slide-border)', borderRadius: '8px', padding: '20px', fontSize: 'clamp(11px, 1.3vw, 17px)', color: 'var(--slide-text)', lineHeight: 1.6, display: 'flex', alignItems: 'center' }}>
              {slide.right}
            </div>
          </div>
        </div>
      );

    case 'quote':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '72px', lineHeight: '0.8', color: 'var(--slide-accent)', fontFamily: 'Georgia, serif', marginBottom: '16px' }}>"</div>
          {slide.quote && (
            <blockquote style={{ fontSize: 'clamp(15px, 2vw, 26px)', fontStyle: 'italic', maxWidth: '680px', lineHeight: 1.5, color: 'var(--slide-text)', marginBottom: '20px' }}>
              {slide.quote}
            </blockquote>
          )}
          {slide.attribution && (
            <cite style={{ fontSize: '13px', color: 'var(--slide-muted)' }}>— {slide.attribution}</cite>
          )}
        </div>
      );

    case 'code':
      return (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {slide.title && (
            <h2 style={{ fontSize: 'clamp(16px, 2.2vw, 28px)', fontWeight: 700, color: 'var(--slide-accent2)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--slide-border)' }}>
              {slide.title}
            </h2>
          )}
          <pre className="slide-code" style={{ flex: 1 }}>
            <code>{slide.code ?? ''}</code>
          </pre>
          {slide.caption && (
            <p style={{ fontSize: '11px', color: 'var(--slide-muted)', marginTop: '8px' }}>{slide.caption}</p>
          )}
        </div>
      );

    case 'closing':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '60px', textAlign: 'center' }}>
          {slide.title && (
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 64px)', fontWeight: 900, color: 'var(--slide-accent)', letterSpacing: '-2px', lineHeight: 1.05 }}>
              {slide.title}
            </h1>
          )}
          {slide.subtitle && (
            <p style={{ fontSize: 'clamp(13px, 1.6vw, 20px)', color: 'var(--slide-muted)', marginTop: '16px', maxWidth: '500px' }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    default:
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <span style={{ color: 'var(--slide-muted)' }}>{slide.title}</span>
        </div>
      );
  }
}
