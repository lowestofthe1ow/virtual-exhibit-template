interface PowerMeterProps {
  value: number; // 0–100
}

export default function PowerMeter({ value }: PowerMeterProps) {
  const clamped = Math.min(100, Math.max(0, value));

  // Interpolate fill color: green at 0, red at 100
  const r = Math.round(lerp(34, 239, clamped / 100));
  const g = Math.round(lerp(197, 68, clamped / 100));
  const b = Math.round(lerp(94, 68, clamped / 100));
  const color = `rgb(${r},${g},${b})`;

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-20 w-5 rounded-full bg-zinc-800 overflow-hidden flex items-end">
        <div
          className="w-full rounded-full transition-all duration-100"
          style={{ height: `${clamped}%`, background: color }}
        />
      </div>
      <span className="font-mono text-[10px] text-zinc-500 tracking-widest text-center">
        POWER
      </span>
    </div>
  );
}