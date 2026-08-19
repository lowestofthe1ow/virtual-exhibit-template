import { useEffect, useRef, useState } from 'react';

// Fully self-contained: inline styles + one embedded <style> tag for the
// keyframes (spin / pulse / jitter). No external stylesheet dependency.

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const GAUGES = [
  {
    key: 'hdd',
    label: 'HDD',
    icon: '\uD83D\uDCBF',
    color: '#FF0080',
    pct: 15,
    note: '7,200 RPM \u2014 physical seek required',
    anim: 'iopsSpin 2.6s linear infinite',
    countMode: 'flicker',
    min: 100,
    max: 200,
  },
  {
    key: 'sata',
    label: 'SATA SSD',
    icon: '\u26A1',
    color: '#00FFFF',
    pct: 55,
    note: 'No moving parts, one AHCI queue',
    anim: 'iopsPulse 1.8s ease-in-out infinite',
    countMode: 'count',
    target: 50000,
    suffix: '',
  },
  {
    key: 'nvme',
    label: 'NVMe SSD',
    icon: '\uD83D\uDE80',
    color: '#39FF14',
    pct: 100,
    note: 'Thousands of parallel queues',
    anim: 'iopsJitter 0.35s ease-in-out infinite',
    countMode: 'count',
    target: 1000000,
    suffix: '+',
  },
];

function formatNumber(n) {
  return Math.round(n).toLocaleString('en-US');
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function GaugeCard({ g, running }) {
  const [display, setDisplay] = useState(g.countMode === 'flicker' ? g.min : 0);
  const [filled, setFilled] = useState(false);
  const rafRef = useRef(null);
  const flickerRef = useRef(null);

  useEffect(() => {
    if (!running) {
      setFilled(false);
      return;
    }
    const t = setTimeout(() => setFilled(true), 120);
    return () => clearTimeout(t);
  }, [running]);

  useEffect(() => {
    if (!running) return;

    if (g.countMode === 'flicker') {
      flickerRef.current = setInterval(() => {
        setDisplay(Math.floor(g.min + Math.random() * (g.max - g.min)));
      }, 550);
      return () => clearInterval(flickerRef.current);
    }

    const duration = 1700;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(g.target * easeOutCubic(t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, g]);

  const offset = CIRCUMFERENCE * (1 - (filled ? g.pct : 0) / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg viewBox="0 0 130 130" width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
          <circle
            cx="65" cy="65" r={RADIUS} fill="none"
            stroke={g.color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.3s ease', filter: `drop-shadow(0 0 6px ${g.color}88)` }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            animation: running ? g.anim : 'none',
          }}
        >
          {g.icon}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.8rem', letterSpacing: '1px', color: g.color }}>
          {g.label}
        </div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.15rem', color: 'var(--text)', margin: '0.25rem 0' }}>
          {formatNumber(display)}{g.suffix || ''}
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
          {g.countMode === 'flicker' ? 'IOPS (fluctuating)' : 'IOPS'}
        </div>
        <div style={{ fontSize: '0.62rem', color: 'rgba(170,170,204,0.5)', marginTop: '0.35rem', maxWidth: '150px' }}>
          {g.note}
        </div>
      </div>
    </div>
  );
}

export default function IopsGaugeCluster() {
  const containerRef = useRef(null);
  const [running, setRunning] = useState(false);

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
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        margin: '1.75rem 0',
        padding: '1.75rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(57,255,20,0.05), transparent 60%), rgba(10,0,20,0.85)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '10px',
      }}
    >
      <style>{`
        @keyframes iopsSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes iopsPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.12); opacity: 1; }
        }
        @keyframes iopsJitter {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25%      { transform: translate(-1px, 1px) rotate(-4deg); }
          50%      { transform: translate(1px, -1px) rotate(3deg); }
          75%      { transform: translate(-1px, -1px) rotate(-2deg); }
        }
      `}</style>

      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-head)',
          fontSize: '0.68rem',
          letterSpacing: '2.5px',
          color: 'rgba(170,170,204,0.6)',
          textTransform: 'uppercase',
          marginBottom: '1.4rem',
        }}
      >
        IOPS by Interface
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {GAUGES.map((g) => (
          <GaugeCard key={g.key} g={g} running={running} />
        ))}
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.3rem',
          fontSize: '0.68rem',
          color: 'rgba(170,170,204,0.45)',
          letterSpacing: '0.3px',
        }}
      >
        Ring fill is log-scaled, same as the numbers themselves \u2014 NVMe's real advantage over
        HDD is roughly 10,000&times;, far beyond what three rings could show to scale.
      </p>
    </div>
  );
}
