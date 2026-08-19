import { useEffect, useRef, useState } from 'react';

const CELL_TYPES = [
  { key: 'slc', label: 'SLC', bits: 1, states: 2, color: '#00FFFF', desc: '1 bit per cell, 2 voltage states \u2014 fastest and most durable.', climbSec: 1.6 },
  { key: 'mlc', label: 'MLC', bits: 2, states: 4, color: '#39FF14', desc: '2 bits per cell, 4 voltage states.', climbSec: 2.2 },
  { key: 'tlc', label: 'TLC', bits: 3, states: 8, color: '#ffee00', desc: '3 bits per cell, 8 voltage states \u2014 the mainstream consumer standard.', climbSec: 2.8 },
  { key: 'qlc', label: 'QLC', bits: 4, states: 16, color: '#FF00FF', desc: '4 bits per cell, 16 voltage states \u2014 cheapest per gigabyte, shortest lifespan.', climbSec: 3.6 },
];

// Fully inline-styled, self-contained. Metaphor: a charge marker climbs a
// staircase of discrete voltage rungs, one rung per possible cell state,
// then discharges back down and repeats. More states = more, thinner
// rungs = a finer, harder climb — a visual echo of "finer voltage steps,
// noisier read" from the surrounding text, not just decoration.

const wrapStyle = {
  position: 'relative',
  margin: '1.75rem 0',
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

const STAIR_HEIGHT = 84;
const RUNG_GAP = 2;

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
        @keyframes cellVoltClimb {
          0%   { bottom: 0%; }
          100% { bottom: calc(100% - 10px); }
        }
      `}</style>

      <div style={headerStyle}>NAND CELL TYPES</div>

      <div style={rowStyle}>
        {CELL_TYPES.map((c, i) => {
          const isLast = i === CELL_TYPES.length - 1;
          const rungHeight = (STAIR_HEIGHT - RUNG_GAP * (c.states - 1)) / c.states;

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
                  marginBottom: '0.7rem',
                }}
              >
                {c.label}
              </div>

              {/* staircase of voltage rungs */}
              <div
                style={{
                  position: 'relative',
                  width: '26px',
                  height: `${STAIR_HEIGHT}px`,
                  margin: '0 auto 0.7rem',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  gap: `${RUNG_GAP}px`,
                }}
              >
                {Array.from({ length: c.states }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      height: `${rungHeight}px`,
                      borderRadius: '1px',
                      background: `${c.color}22`,
                      border: `1px solid ${c.color}44`,
                    }}
                  />
                ))}

                {/* climbing charge marker */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    width: '10px',
                    height: '10px',
                    marginLeft: '-5px',
                    borderRadius: '50%',
                    background: c.color,
                    boxShadow: `0 0 8px ${c.color}`,
                    animation: `cellVoltClimb ${c.climbSec}s steps(${c.states - 1}, jump-none) infinite alternate`,
                    animationPlayState: running ? 'running' : 'paused',
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