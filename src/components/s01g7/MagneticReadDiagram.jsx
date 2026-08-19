export default function MagneticReadDiagram() {
  return (
    <svg
      viewBox="0 0 590 220"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Animated diagram of the magnetic read process: a shielded sensor detects magnetization transitions on the recording medium and converts them into a voltage signal."
      style={{ width: '100%', height: 'auto', maxWidth: 900, display: 'block', margin: '0 auto' }}
    >
      <style>{`
        .mr-label { font-family: var(--font-head), monospace; font-size: 11px; letter-spacing: 1.5px; }
        .mr-sub   { font-family: var(--font-body), monospace; font-size: 9px; letter-spacing: 0.5px; fill: var(--text-muted); }
        .mr-panel-bg { fill: rgba(10,0,20,0.6); stroke: rgba(255,255,255,0.08); }

        .mr-domain { animation: mrTrackScroll 6.4s linear infinite; }
        @keyframes mrTrackScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-320px); }
        }

        .mr-sensor-core {
          animation: mrSensorFlash 0.8s ease-in-out infinite;
        }
        @keyframes mrSensorFlash {
          0%, 100% { fill: rgba(255,255,255,0.15); }
          50%      { fill: var(--accent-green); filter: drop-shadow(0 0 4px var(--accent-green)); }
        }

        .mr-waveform {
          animation: mrWaveScroll 6.4s linear infinite;
        }
        @keyframes mrWaveScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-320px); }
        }
      `}</style>

      <rect x="4" y="6" width="582" height="210" rx="8" className="mr-panel-bg" />
      <text x="20" y="26" className="mr-label" fill="var(--accent-green)">READING DATA</text>
      <text x="20" y="40" className="mr-sub">recorded transitions → TMR/GMR sensor → resistance change → voltage</text>

      {/* shields + sensor, fixed at the read position */}
      <rect x="185" y="54" width="6" height="34" fill="rgba(200,200,220,0.5)" />
      <rect x="209" y="54" width="6" height="34" fill="rgba(200,200,220,0.5)" />
      <rect x="191" y="60" width="18" height="22" className="mr-sensor-core" />
      <text x="150" y="50" className="mr-sub">shield</text>
      <text x="220" y="50" className="mr-sub">shield</text>
      <text x="160" y="100" className="mr-sub" fill="var(--accent-green)">TMR / GMR sensor</text>

      {/* already-written track scrolling under the read head */}
      <rect x="10" y="110" width="180" height="14" fill="rgba(255,255,255,0.03)" />
      <clipPath id="mrReadClip">
        <rect x="10" y="110" width="566" height="14" />
      </clipPath>
      <g clipPath="url(#mrReadClip)">
        <g className="mr-domain">
          {Array.from({ length: 32 }, (_, i) => (
            <rect
              key={i}
              x={-320 + i * 20}
              y="110"
              width="18"
              height="14"
              fill={i % 2 === 0 ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}
              opacity="0.55"
            />
          ))}
        </g>
      </g>
      <text x="10" y="140" className="mr-sub">magnetic track (already recorded)</text>

      {/* oscilloscope-style voltage trace, below */}
      <rect x="10" y="150" width="560" height="42" rx="4" fill="rgba(0,0,0,0.4)" stroke="rgba(57,255,20,0.2)" />
      <text x="20" y="162" className="mr-sub" fill="var(--accent-green)">playback voltage</text>
      <clipPath id="mrScopeClip">
        <rect x="14" y="166" width="552" height="22" />
      </clipPath>
      <g clipPath="url(#mrScopeClip)">
        <g className="mr-waveform">
          <polyline
            points={Array.from({ length: 33 }, (_, i) => {
              const x = -320 + i * 20;
              const y = i % 2 === 0 ? 170 : 186;
              return `${x + 340},${y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--accent-green)"
            strokeWidth="2"
          />
        </g>
      </g>
    </svg>
  );
}