import { useEffect, useRef, useState } from 'react';

// Fully self-contained: plain divs + inline styles, one embedded <style>
// tag just for the glow-pulse keyframes. No external stylesheet, no SVG
// attribute transitions (those are flakier cross-browser) — just
// transform/opacity transitions on absolutely positioned divs.

const PHASES = [
  {
    key: 'empty',
    duration: 900,
    title: 'Erased Cell \u2014 Data = 1',
    desc: 'No charge on the floating gate. Threshold voltage is low.',
    vth: 'LOW',
  },
  {
    key: 'program',
    duration: 1500,
    title: 'Programming \u2014 Write 0',
    desc: 'Electrons tunnel up through the oxide onto the floating gate.',
    vth: 'RISING',
  },
  {
    key: 'retain',
    duration: 2000,
    title: 'Non-Volatile \u2014 No Power Applied',
    desc: 'The gate is insulated, so the trapped charge just stays put.',
    vth: 'HIGH',
  },
  {
    key: 'erase',
    duration: 1500,
    title: 'Erasing \u2014 Write 1',
    desc: 'Electrons tunnel back out, resetting the cell.',
    vth: 'FALLING',
  },
];

const ELECTRON_X = [42, 46, 50, 54, 58]; // percent, spread across channel/gate width
const CHANNEL_Y = 176;
const GATE_Y = 60;

export default function FloatingGateAnimation() {
  const containerRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const timerRef = useRef(null);

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

  useEffect(() => {
    if (!running) {
      clearTimeout(timerRef.current);
      setPhaseIndex(0);
      return;
    }
    const phase = PHASES[phaseIndex];
    timerRef.current = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, phase.duration);
    return () => clearTimeout(timerRef.current);
  }, [running, phaseIndex]);

  const phase = PHASES[phaseIndex];
  const charged = phase.key === 'program' || phase.key === 'retain';
  const electronY = charged ? GATE_Y : CHANNEL_Y;

  const vthColor =
    phase.vth === 'HIGH' ? '#39FF14' : phase.vth === 'LOW' ? 'rgba(170,170,204,0.6)' : '#ffee00';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        margin: '1.75rem auto',
        maxWidth: '500px',     
        padding: '1.6rem 1.5rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.05), transparent 60%), rgba(10,0,20,0.85)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '10px',
      }}
    >
      <style>{`
        @keyframes gateGlowPulse {
          0%, 100% { box-shadow: 0 0 14px rgba(57,255,20,0.5), inset 0 0 10px rgba(57,255,20,0.25); }
          50%      { box-shadow: 0 0 26px rgba(57,255,20,0.85), inset 0 0 16px rgba(57,255,20,0.4); }
        }
      `}</style>

      {/* Status banner */}
      <div style={{ textAlign: 'center', marginBottom: '1.1rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: '0.82rem',
            letterSpacing: '0.5px',
            color: charged ? '#39FF14' : '#00FFFF',
            transition: 'color 0.4s ease',
          }}
        >
          {phase.title}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(170,170,204,0.6)', marginTop: '0.3rem' }}>
          {phase.desc}
        </div>
      </div>

      {/* Cross-section */}
      <div style={{ position: 'relative', height: '260px', maxWidth: '420px', margin: '0 auto' }}>
        {/* Control gate */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '18%',
            width: '64%',
            height: '34px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.62rem',
            letterSpacing: '1px',
            color: 'rgba(220,220,235,0.8)',
            fontFamily: 'var(--font-head)',
          }}
        >
          CONTROL GATE
        </div>

        {/* Control oxide */}
        <div
          style={{
            position: 'absolute',
            top: '34px',
            left: '18%',
            width: '64%',
            height: '10px',
            background: 'repeating-linear-gradient(45deg, rgba(0,255,255,0.15) 0 4px, transparent 4px 8px)',
            border: '1px solid rgba(0,255,255,0.15)',
            borderTop: 'none',
            borderBottom: 'none',
          }}
        />

        {/* Floating gate */}
        <div
          style={{
            position: 'absolute',
            top: '44px',
            left: '25%',
            width: '50%',
            height: '30px',
            borderRadius: '4px',
            background: charged ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${charged ? '#39FF14' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            letterSpacing: '1px',
            color: charged ? '#39FF14' : 'rgba(220,220,235,0.7)',
            fontFamily: 'var(--font-head)',
            transition: 'background 0.5s ease, border-color 0.5s ease, color 0.5s ease',
            animation: phase.key === 'retain' ? 'gateGlowPulse 1.6s ease-in-out infinite' : 'none',
          }}
        >
          FLOATING GATE
        </div>

        {/* Tunnel oxide */}
        <div
          style={{
            position: 'absolute',
            top: '74px',
            left: '25%',
            width: '50%',
            height: '10px',
            background: 'repeating-linear-gradient(45deg, rgba(0,255,255,0.15) 0 4px, transparent 4px 8px)',
            border: '1px solid rgba(0,255,255,0.15)',
            borderTop: 'none',
            borderBottom: 'none',
          }}
        />

        {/* Substrate row: source / channel / drain */}
        <div
          style={{
            position: 'absolute',
            top: '84px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderTop: 'none',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '25%',
              borderRight: '1px dashed rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.62rem',
              letterSpacing: '1px',
              color: 'rgba(220,220,235,0.55)',
              fontFamily: 'var(--font-head)',
            }}
          >
            SOURCE
          </div>
          <div
            style={{
              width: '50%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '0.4rem',
              fontSize: '0.6rem',
              letterSpacing: '1px',
              color: 'rgba(170,170,204,0.4)',
              fontFamily: 'var(--font-head)',
            }}
          >
            CHANNEL
          </div>
          <div
            style={{
              width: '25%',
              borderLeft: '1px dashed rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.62rem',
              letterSpacing: '1px',
              color: 'rgba(220,220,235,0.55)',
              fontFamily: 'var(--font-head)',
            }}
          >
            DRAIN
          </div>
        </div>

        {/* Electrons */}
        {ELECTRON_X.map((x, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${electronY}px`,
              width: '7px',
              height: '7px',
              marginLeft: '-3.5px',
              borderRadius: '50%',
              background: '#39FF14',
              boxShadow: '0 0 6px #39FF14',
              transition: `top 1.1s ease ${i * 0.06}s`,
              opacity: phase.key === 'empty' ? 0.35 : 1,
            }}
          />
        ))}
      </div>

      {/* Vth readout */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '1.1rem',
          fontSize: '0.68rem',
          letterSpacing: '0.5px',
          color: 'rgba(170,170,204,0.6)',
        }}
      >
        Threshold Voltage:{' '}
        <span style={{ color: vthColor, fontFamily: 'var(--font-head)' }}>{phase.vth}</span>
      </div>
    </div>
  );
}
