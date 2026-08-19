import { useEffect, useRef, useState } from 'react';

const CELL_TYPES = [
  { key: 'slc', label: 'SLC', bits: 1, states: 2, color: '#00FFFF', desc: '1 bit per cell, 2 voltage states \u2014 fastest and most durable.', climbSec: 2.2 },
  { key: 'mlc', label: 'MLC', bits: 2, states: 4, color: '#39FF14', desc: '2 bits per cell, 4 voltage states.', climbSec: 2.8 },
  { key: 'tlc', label: 'TLC', bits: 3, states: 8, color: '#ffee00', desc: '3 bits per cell, 8 voltage states \u2014 the mainstream consumer standard.', climbSec: 3.4 },
  { key: 'qlc', label: 'QLC', bits: 4, states: 16, color: '#FF00FF', desc: '4 bits per cell, 16 voltage states \u2014 cheapest per gigabyte, shortest lifespan.', climbSec: 4.2 },
];

// Fully inline-styled, self-contained. Metaphor: a graduated candle, like
// an old candle clock whose rings mark discrete steps rather than smooth
// continuous burn. Ring count = number of voltage states for that cell
// type. A flame climbs the candle one ring at a time, pausing on each
// mark (each Vth level), then resets to the bottom and repeats.

const wrapStyle = {
  position: 'relative',
  margin: '1.75rem auto',
  maxWidth: '620px',
  padding: '2rem 1.75rem 1.6rem',
  background:
    'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.07), transparent 60%), rgba(10,0,20,0.9)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: '10px',
  boxShadow: 'inset 0 0 26px rgba(0,0,0,0.6)',
};

const headerStyle = {
  textAlign: 'center',
  fontFamily: 'var(--font-head)',
  fontSize: '0.68rem',
  letterSpacing: '2.5px',
  color: 'rgba(170,170,204,0.6)',
  textTransform: 'uppercase',
  marginBottom: '1.4rem',
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const CANDLE_HEIGHT = 90;
const CANDLE_WIDTH = 22;

export default function CellVoltageDiagram() {
  const [running, setRunning] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={wrapStyle} ref={containerRef}>
      <style>{`
        @keyframes cellCandleFlicker {
          0%, 100% { transform: scale(1) translateX(-50%); opacity: 1; }
          50%      { transform: scale(0.88) translateX(-50%); opacity: 0.85; }
        }
        @keyframes cellCandleClimb {
          0%   { bottom: 0%; }
          100% { bottom: calc(100% - 6px); }
        }
      `}</style>

      <div style={headerStyle}>NAND CELL TYPES</div>

      <div style={rowStyle}>
        {CELL_TYPES.map((c, i) => {
          const isLast = i === CELL_TYPES.length - 1;
          const ringGapPct = 100 / c.states;

          return (
            <div
              key={c.key}
              style={{
                textAlign: 'center',
                padding: '1rem 0.6rem 0.9rem',
                borderRight: isLast ? 'none' : '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '0.8rem',
                  letterSpacing: '1.5px',
                  color: c.color,
                  marginBottom: '0.8rem',
                }}
              >
                {c.label}
              </div>

              {/* graduated candle */}
              <div
                style={{
                  position: 'relative',
                  width: `${CANDLE_WIDTH}px`,
                  height: `${CANDLE_HEIGHT}px`,
                  margin: '0 auto 0.7rem',
                }}
              >
                {/* wax body */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: '100%',
                    borderRadius: '2px 2px 4px 4px',
                    background: `linear-gradient(180deg, ${c.color}33, ${c.color}14)`,
                    border: `1px solid ${c.color}55`,
                  }}
                />

                {/* ring marks, one per voltage state boundary */}
                {Array.from({ length: c.states - 1 }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bottom: `${(j + 1) * ringGapPct}%`,
                      width: '100%',
                      height: '1px',
                      background: 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}

                {/* wick */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '6px',
                    background: '#5c4a33',
                  }}
                />

                {/* climbing flame, pauses on each ring */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    width: '11px',
                    height: '15px',
                    borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
                    background: `radial-gradient(circle at 50% 70%, #fff6c8 0%, ${c.color} 55%, #ff7a00 90%)`,
                    boxShadow: `0 0 8px ${c.color}`,
                    animationName: 'cellCandleClimb, cellCandleFlicker',
                    animationDuration: `${c.climbSec}s, 0.9s`,
                    animationTimingFunction: `steps(${c.states - 1}, jump-none), ease-in-out`,
                    animationIterationCount: 'infinite, infinite',
                    animationDirection: 'alternate, normal',
                    animationPlayState: running ? 'running, running' : 'paused, paused',
                    marginBottom: '6px',
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'rgba(170,170,204,0.65)',
                  letterSpacing: '0.4px',
                }}
              >
                {c.bits} bit{c.bits > 1 ? 's' : ''}/cell
              </div>
              <div
                style={{
                  fontSize: '0.6rem',
                  color: 'rgba(170,170,204,0.4)',
                  letterSpacing: '0.3px',
                  marginTop: '0.15rem',
                }}
              >
                {c.states} states
              </div>
            </div>
          );
        })}
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.2rem',
          fontSize: '0.72rem',
          letterSpacing: '0.3px',
          lineHeight: 1.6,
          color: 'rgba(170,170,204,0.6)',
        }}
      >
        More bits per cell means more voltage states packed into the same range &mdash; finer steps, and a noisier, more error-prone read.
      </p>
    </div>
  );
}