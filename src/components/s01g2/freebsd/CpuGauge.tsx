interface CpuGaugeProps {
  value: number; // 0-100
}

export default function CpuGauge({ value }: CpuGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const angle = -90 + (clamped / 100) * 180;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 120 68" className="w-32 h-auto">
        {/* Green zone */}
        <path d="M10 62 A52 52 0 0 1 43 14" stroke="#22c55e" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* Yellow zone */}
        <path d="M43 14 A52 52 0 0 1 77 14" stroke="#eab308" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* Red zone */}
        <path d="M77 14 A52 52 0 0 1 110 62" stroke="#ef4444" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* Needle */}
        <g transform={`rotate(${angle} 60 62)`}>
          <line x1="60" y1="62" x2="60" y2="16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle cx="60" cy="62" r="4.5" fill="#fff" />
      </svg>
      <span className="font-mono text-xs text-zinc-400 tracking-widest">
        CPU USAGE: <span className="text-white">{Math.round(clamped)}%</span>
      </span>
    </div>
  );
}