export default function MagneticWriteDiagram() {
  return (
    <svg
      viewBox="0 0 590 198"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Animated diagram of the magnetic write process: a write coil and pole imprint magnetization transitions onto the recording medium as it moves beneath it."
      style={{ width: '100%', height: 'auto', maxWidth: 900, display: 'block', margin: '0 auto' }}
    >
      <style>{`
        .mw-label { font-family: var(--font-head), monospace; font-size: 11px; letter-spacing: 1.5px; }
        .mw-sub   { font-family: var(--font-body), monospace; font-size: 9px; letter-spacing: 0.5px; fill: var(--text-muted); }
        .mw-panel-bg { fill: rgba(10,0,20,0.6); stroke: rgba(255,255,255,0.08); }

        .mw-domain { animation: mwTrackScroll 6.4s linear infinite; }
        @keyframes mwTrackScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-320px); }
        }

        .mw-current-arrow {
          transform-origin: 95px 95px;
          animation: mwCurrentFlip 1.6s steps(1) infinite;
        }
        @keyframes mwCurrentFlip {
          0%, 49%   { transform: rotate(0deg); }
          50%, 100% { transform: rotate(180deg); }
        }

        .mw-write-bubble {
          animation: mwBubblePulse 0.8s ease-in-out infinite;
          transform-origin: 200px 148px;
        }
        @keyframes mwBubblePulse {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50%      { opacity: 0.9;  transform: scale(1.15); }
        }
      `}</style>

      <rect x="4" y="6" width="582" height="188" rx="8" className="mw-panel-bg" />
      <text x="20" y="26" className="mw-label" fill="var(--accent-magenta)">WRITING DATA</text>
      <text x="20" y="40" className="mw-sub">write current (I_w) → coil → yoke → main pole → medium</text>

      {/* yoke + coil, fixed */}
      <rect x="86" y="52" width="10" height="70" fill="#c9a3ff" opacity="0.85" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx="91" cy={58 + i * 14} rx="16" ry="7" fill="none" stroke="#c9a3ff" strokeWidth="2" opacity="0.7" />
      ))}
      <g className="mw-current-arrow">
        <line x1="95" y1="85" x2="95" y2="105" stroke="var(--accent-magenta)" strokeWidth="2" />
        <polygon points="95,108 90,98 100,98" fill="var(--accent-magenta)" />
      </g>
      <text x="112" y="90" className="mw-sub" fill="var(--accent-magenta)">I_w</text>

      {/* main pole tip, fixed at the write position */}
      <polygon points="182,122 218,122 200,146" fill="var(--accent-cyan)" opacity="0.9" />
      <circle className="mw-write-bubble" cx="200" cy="148" r="22" fill="var(--accent-cyan)" opacity="0.3" />
      <text x="240" y="128" className="mw-sub" fill="var(--accent-cyan)">main pole</text>
      <text x="180" y="70" className="mw-sub">soft magnetic yoke</text>

      {/* blank (unwritten) track, always visible */}
      <rect x="10" y="150" width="566" height="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />

      {/* written domains, clipped so only the portion already past the pole (left side) shows color */}
      <clipPath id="mwWrittenClip">
        <rect x="10" y="150" width="190" height="14" />
      </clipPath>
      <g clipPath="url(#mwWrittenClip)">
        <g className="mw-domain">
          {Array.from({ length: 32 }, (_, i) => (
            <rect
              key={i}
              x={-320 + i * 20}
              y="150"
              width="18"
              height="14"
              fill={i % 2 === 0 ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}
              opacity="0.55"
            />
          ))}
        </g>
      </g>
      <text x="10" y="188" className="mw-sub">already written (behind the pole)</text>
      <text x="560" y="188" className="mw-sub" textAnchor="end">unwritten medium approaching →</text>
    </svg>
  );
}