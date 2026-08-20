import { useMemo } from "react";
import {
  sampleHeartBoundary,
  pointsToPath,
  meridianPath,
  parallelPaths,
  boundsOf,
  evenLevels,
} from "./heartMath.js";

const MERIDIAN_ANGLES = [-1.3, -0.95, -0.6, 0.6, 0.95, 1.3];

export default function HeartWireframe({
  color = "#ff279e",
  size = 260,
  pulse = "normal", // "normal" | "fast" | "none"
  onClick,
  className = "",
  children,
}) {
  const boundary = useMemo(() => sampleHeartBoundary(), []);
  const bounds = useMemo(() => boundsOf(boundary), [boundary]);
  const outline = useMemo(() => pointsToPath(boundary), [boundary]);
  const meridians = useMemo(
    () => MERIDIAN_ANGLES.map((phi) => meridianPath(boundary, phi)),
    [boundary]
  );
  const parallels = useMemo(() => {
    const levels = evenLevels(bounds.minY, bounds.maxY, 9);
    return parallelPaths(boundary, levels);
  }, [boundary, bounds]);

  const pad = 2;
  const viewBox = `${bounds.minX - pad} ${bounds.minY - pad} ${
    bounds.maxX - bounds.minX + pad * 2
  } ${bounds.maxY - bounds.minY + pad * 2}`;

  const pulseClass =
    pulse === "fast" ? "animate-s03g1-heartbeat-fast" : pulse === "none" ? "" : "animate-s03g1-heartbeat";

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick(e);
            }
          : undefined
      }
      className={`overflow-visible outline-none ${
        onClick ? "cursor-pointer focus-visible:drop-shadow-[0_0_6px_rgba(255,39,158,0.85)]" : ""
      } ${pulseClass} ${className}`}
      style={{ transformOrigin: "50% 50%" }}
    >
      <defs>
        <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g fill="none" stroke={color} strokeLinecap="round" filter="url(#heartGlow)">
        {meridians.map((d, i) => (
          <path key={`m-${i}`} d={d} strokeWidth={0.35} opacity={0.55} />
        ))}
        {parallels.map((d, i) => (
          <path key={`p-${i}`} d={d} strokeWidth={0.35} opacity={0.55} />
        ))}
        <path d={outline} strokeWidth={0.8} opacity={1} />
      </g>
      {children}
    </svg>
  );
  
}
