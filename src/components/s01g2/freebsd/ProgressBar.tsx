interface ProgressBarProps {
  value: number; // 0–100
  done?: boolean;
}

export default function ProgressBar({ value, done }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${clamped}%`,
            background: done
              ? "#22c55e"
              : "linear-gradient(90deg, #ef4444, #f97316)",
          }}
        />
      </div>
      <span className="font-mono text-xs text-zinc-400 tracking-widest">
        PROGRESS: <span className={done ? "text-green-400" : "text-white"}>{Math.round(clamped)}%</span>
        {done && <span className="text-green-400 ml-2">✓ DONE</span>}
      </span>
    </div>
  );
}