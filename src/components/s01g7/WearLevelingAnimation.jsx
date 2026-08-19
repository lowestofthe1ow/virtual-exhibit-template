import { useEffect, useRef, useState } from 'react';

const GRID_COLS = 8;
const GRID_ROWS = 2;
const N = GRID_COLS * GRID_ROWS;
const WRITE_COUNT = 7;

const HEAT_STYLES = [
  { bg: 'rgba(0,255,255,0.10)', border: 'rgba(0,255,255,0.3)' },   // cool
  { bg: 'rgba(255,238,0,0.22)', border: 'rgba(255,238,0,0.4)' },   // warm
  { bg: 'rgba(255,140,0,0.30)', border: 'rgba(255,140,0,0.5)' },   // hot
  { bg: 'rgba(255,0,128,0.35)', border: 'rgba(255,0,128,0.55)' },  // critical
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const wrapStyle = {
  position: 'relative',
  margin: '1.75rem auto',
  maxWidth: '620px',
  padding: '1.75rem 1.75rem 1.5rem',
  background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.06), transparent 60%), rgba(10,0,20,0.85)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '10px',
};

const headerStyle = {
  textAlign: 'center',
  fontFamily: 'var(--font-head)',
  fontSize: '0.68rem',
  letterSpacing: '2.5px',
  color: 'rgba(170,170,204,0.6)',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
};

const phaseBadgeStyle = (color) => ({
  textAlign: 'center',
  fontFamily: 'var(--font-head)',
  fontSize: '0.78rem',
  letterSpacing: '1px',
  color,
  marginBottom: '1.1rem',
  transition: 'color 0.3s ease',
});

export default function WearLevelingAnimation() {
  const [grid, setGrid] = useState(Array(N).fill(0));
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [idleIndex, setIdleIndex] = useState(null);
  const [iconCell, setIconCell] = useState(null);
  const [phase, setPhase] = useState('dynamic');
  const [running, setRunning] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    let cancelled = false;

    async function runLoop() {
      while (!cancelled) {
        setGrid(Array(N).fill(0));
        setHighlightIndex(null);
        setIdleIndex(null);
        setIconCell(null);
        setPhase('dynamic');
        await wait(500);
        if (cancelled) return;

        let g = Array(N).fill(0);
        for (let w = 0; w < WRITE_COUNT; w++) {
          if (cancelled) return;
          const minHeat = Math.min(...g);
          const candidates = g.map((h, i) => i).filter((i) => g[i] === minHeat);
          const target = candidates[Math.floor(Math.random() * candidates.length)];

          setHighlightIndex(target);
          await wait(280);
          if (cancelled) return;

          g = g.map((h, i) => (i === target ? Math.min(h + 1, 3) : h));
          setGrid([...g]);
          await wait(220);
          if (cancelled) return;

          setHighlightIndex(null);
          await wait(160);
          if (cancelled) return;
        }

        const zeroCells = g.map((h, i) => i).filter((i) => g[i] === 0);
        if (zeroCells.length < 2) continue;

        const shuffled = [...zeroCells].sort(() => Math.random() - 0.5);
        const idleIdx = shuffled[0];
        const destIdx = shuffled[1];

        setPhase('static');
        setIdleIndex(idleIdx);
        setIconCell(idleIdx);
        await wait(1000);
        if (cancelled) return;

        setIconCell(destIdx);
        await wait(750);
        if (cancelled) return;

        g = g.map((h, i) => (i === idleIdx ? 1 : h));
        setGrid([...g]);
        setIdleIndex(null);
        await wait(1300);
        if (cancelled) return;

        setIconCell(null);
        await wait(600);
      }
    }

    runLoop();
    return () => {
      cancelled = true;
    };
  }, [running]);

  const isDynamic = phase === 'dynamic';

  return (
    <div style={wrapStyle} ref={containerRef}>
      <style>{`
        @keyframes idlePulseRing {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.5), 0 0 6px rgba(255,255,255,0.35); }
          50%      { box-shadow: 0 0 0 1px rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.6); }
        }
      `}</style>

      <div style={headerStyle}>WEAR LEVELING</div>
      <div style={phaseBadgeStyle(isDynamic ? '#00FFFF' : '#39FF14')}>
        {isDynamic ? 'DYNAMIC — steering writes to the coolest block' : 'STATIC — relocating an untouched block'}
      </div>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          gap: '6px',
          height: '110px',
        }}
      >
        {grid.map((heat, i) => {
          const style = HEAT_STYLES[heat];
          const isHighlighted = i === highlightIndex;
          const isIdle = i === idleIndex;
          return (
            <div
              key={i}
              style={{
                borderRadius: '3px',
                background: style.bg,
                border: `1px solid ${style.border}`,
                transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.2s ease',
                transform: isHighlighted ? 'scale(1.12)' : 'scale(1)',
                boxShadow: isHighlighted ? '0 0 10px rgba(255,255,255,0.6)' : 'none',
                animation: isIdle ? 'idlePulseRing 1.1s ease-in-out infinite' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-head)',
                letterSpacing: '0.5px',
              }}
            >
              {isIdle ? 'IDLE' : ''}
            </div>
          );
        })}

        {iconCell !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${((iconCell % GRID_COLS) + 0.5) * (100 / GRID_COLS)}%`,
              top: `${(Math.floor(iconCell / GRID_COLS) + 0.5) * (100 / GRID_ROWS)}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.7s ease, top 0.7s ease',
              fontSize: '1rem',
              pointerEvents: 'none',
            }}
          >
            📄
          </div>
        )}
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.1rem',
          fontSize: '0.78rem',
          lineHeight: 1.6,
          color: 'rgba(170,170,204,0.75)',
          minHeight: '2.6rem',
        }}
      >
        {isDynamic
          ? 'Dynamic wear leveling — new writes are steered toward the least-worn free blocks.'
          : 'Static wear leveling — even data that never changes is occasionally relocated, so its block re-enters the rotation instead of sitting idle forever.'}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '0.6rem',
          fontSize: '0.62rem',
          color: 'rgba(170,170,204,0.55)',
        }}
      >
        <span>🟦 cool</span>
        <span>🟨 warm</span>
        <span>🟧 hot</span>
        <span>🟥 critical</span>
        <span>📄 relocated data</span>
      </div>
    </div>
  );
}