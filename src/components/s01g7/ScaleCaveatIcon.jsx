import { useEffect, useRef, useState } from 'react';

// Endurance -> orbit speed. Slower orbit = more durable (SLC), faster/
// jitterier orbit = wears out fast (QLC). Same relative ordering as the
// real P/E-cycle data, just mapped to speed instead of a spiral collapse.
const RINGS = [
  { key: 'slc', label: 'SLC', val: '~100,000', color: '#00FFFF', radius: 62, period: 10 },
  { key: 'mlc', label: 'MLC', val: '~3\u201310K', color: '#39FF14', radius: 46, period: 6.5 },
  { key: 'tlc', label: 'TLC', val: '~1\u20133K', color: '#ffee00', radius: 30, period: 4 },
  { key: 'qlc', label: 'QLC', val: '~100\u2013300', color: '#FF00FF', radius: 14, period: 1.8 },
];

const wrapStyle = {
  position: 'relative',
  margin: '1.5rem auto',
  maxWidth: '340px',
  padding: '1.1rem 1rem',
  background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.05), transparent 60%), rgba(10,0,20,0.85)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '10px',
};

export default function WearLevelingFlow() {
  const [running, setRunning] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={wrapStyle} ref={containerRef}>
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-head)',
          fontSize: '0.6rem',
          letterSpacing: '2px',
          color: 'rgba(170,170,204,0.55)',
          textTransform: 'uppercase',
          marginBottom: '0.6rem',
        }}
      >
        P/E Endurance
      </div>

      <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto' }}>
        {RINGS.map((r) => (
          <div
            key={`ring-${r.key}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${r.radius * 2}px`,
              height: `${r.radius * 2}px`,
              marginTop: `-${r.radius}px`,
              marginLeft: `-${r.radius}px`,
              borderRadius: '50%',
              border: `1px dashed ${r.color}33`,
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '20px',
            height: '20px',
            marginTop: '-10px',
            marginLeft: '-10px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        />

        {RINGS.map((r) => (
          <div
            key={`pivot-${r.key}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '1px',
              height: '1px',
              animation: running ? `orbitSpin ${r.period}s linear infinite` : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                marginLeft: '-4px',
                marginTop: '-4px',
                left: `${r.radius}px`,
                borderRadius: '50%',
                background: r.color,
                boxShadow: `0 0 6px ${r.color}`,
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.9rem' }}>
        {RINGS.map((r) => (
          <div
            key={`val-${r.key}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.66rem',
              letterSpacing: '0.3px',
            }}
          >
            <span style={{ color: r.color, fontFamily: 'var(--font-head)' }}>{r.label}</span>
            <span style={{ color: 'var(--text-muted)' }}>{r.val} cycles</span>
          </div>
        ))}
      </div>
    </div>
  );
}