import { useEffect, useRef, useState } from 'react';

// Two "price tag" characters descend along a $/GB axis as years advance.
// HDD starts cheap and stays roughly flat; Flash starts sky-high and
// crashes down, crossing below HDD around the early 2010s — the moment
// described in the preceding paragraph. Loops back to the start after
// the crossover lands.

const YEARS = [1991, 1997, 2003, 2008, 2012, 2016];
// relative height (0 = top/expensive, 1 = bottom/cheap) per year
const HDD_PATH = [0.72, 0.68, 0.65, 0.62, 0.6, 0.58];
const FLASH_PATH = [0.03, 0.15, 0.32, 0.5, 0.66, 0.8];
const STEP_MS = 900;
const HOLD_MS = 1400;

const wrapStyle = {
  position: 'relative',
  margin: '1.75rem auto',
  maxWidth: '480px',
  padding: '1.5rem 1.5rem 1.1rem',
  background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.06), transparent 60%), rgba(10,0,20,0.85)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '10px',
};

const TRACK_HEIGHT = 150;

export default function PriceCrossoverRace() {
  const [step, setStep] = useState(0);
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
    let i = 0;

    async function loop() {
      while (!cancelled) {
        i = 0;
        setStep(0);
        await new Promise((r) => setTimeout(r, HOLD_MS));
        while (i < YEARS.length - 1 && !cancelled) {
          i++;
          setStep(i);
          await new Promise((r) => setTimeout(r, STEP_MS));
        }
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, HOLD_MS * 1.4));
      }
    }
    loop();
    return () => {
      cancelled = true;
    };
  }, [running]);

  const hddY = HDD_PATH[step] * TRACK_HEIGHT;
  const flashY = FLASH_PATH[step] * TRACK_HEIGHT;
  const hasCrossed = flashY >= hddY;

  return (
    <div style={wrapStyle} ref={containerRef}>
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-head)',
          fontSize: '0.62rem',
          letterSpacing: '2px',
          color: 'rgba(170,170,204,0.55)',
          textTransform: 'uppercase',
          marginBottom: '0.3rem',
        }}
      >
        Price per Gigabyte, over time
      </div>
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-head)',
          fontSize: '0.72rem',
          color: hasCrossed ? '#39FF14' : '#FF00FF',
          marginBottom: '1rem',
          transition: 'color 0.3s ease',
        }}
      >
        {YEARS[step]}
        {hasCrossed ? ' — flash finally wins' : ''}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        {/* axis + racers */}
        <div style={{ position: 'relative', width: '90px', height: `${TRACK_HEIGHT}px` }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'rgba(255,255,255,0.12)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-1.1rem',
              left: 0,
              fontSize: '0.55rem',
              color: 'rgba(170,170,204,0.4)',
              letterSpacing: '0.5px',
            }}
          >
            expensive
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '-1.1rem',
              left: 0,
              fontSize: '0.55rem',
              color: 'rgba(170,170,204,0.4)',
              letterSpacing: '0.5px',
            }}
          >
            cheap
          </div>

          {/* HDD tag */}
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: `${hddY}px`,
              transition: `top ${STEP_MS}ms cubic-bezier(0.45,0,0.55,1)`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span style={{ fontSize: '1rem' }}>💽</span>
            <span style={{ fontSize: '0.6rem', color: '#00FFFF', fontFamily: 'var(--font-head)' }}>HDD</span>
          </div>

          {/* Flash tag */}
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: `${flashY}px`,
              transition: `top ${STEP_MS}ms cubic-bezier(0.45,0,0.55,1)`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span style={{ fontSize: '1rem' }}>🏷️</span>
            <span style={{ fontSize: '0.6rem', color: '#FF00FF', fontFamily: 'var(--font-head)' }}>Flash</span>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: '1.2rem',
          fontSize: '0.68rem',
          color: 'rgba(170,170,204,0.5)',
          letterSpacing: '0.4px',
        }}
      >
        Timeline compressed for pacing &mdash; the real crossover took roughly twenty years, not a few seconds.
      </div>
    </div>
  );
}