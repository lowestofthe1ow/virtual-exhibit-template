import { useState, useEffect } from "react";

// ─── Fonts ──────────────────────────────────────────────────────────────────
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

      .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
      .font-tech { font-family: 'IBM Plex Mono', ui-monospace, 'JetBrains Mono', monospace; }

      @keyframes riseIn {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes popIn {
        from { opacity: 0; transform: translateY(10px) scale(0.94); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes factIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
      }
    `}</style>
  );
}

// ─── Chip Pin ─────────────────────────────────────────────────────────────────
function ChipPin({ cx, cy, color, horizontal }: { cx: number; cy: number; color: string; horizontal: boolean }) {
  if (horizontal) {
    return <line x1={cx} y1={cy} x2={cx + 5} y2={cy} stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />;
  }
  return <line x1={cx} y1={cy} x2={cx} y2={cy + 5} stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />;
}

// ─── CPU Chip SVG ─────────────────────────────────────────────────────────────
function CpuChip({ color, label }: { color: string; label: string }) {
  const pins = [18, 28, 38, 48, 58, 68, 78];
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl">
      {pins.map((px) => (
        <g key={`t${px}`}>
          <ChipPin cx={px} cy={6} color={color} horizontal={false} />
          <ChipPin cx={px} cy={88} color={color} horizontal={false} />
          <ChipPin cx={6} cy={px} color={color} horizontal={true} />
          <ChipPin cx={88} cy={px} color={color} horizontal={true} />
        </g>
      ))}
      <rect x="10" y="10" width="80" height="80" rx="6" fill="#1A1F2B" stroke={color} strokeWidth="1.5" opacity="0.92" />
      <circle cx="16" cy="16" r="3" fill={color} opacity="0.35" />
      <rect x="20" y="20" width="60" height="60" rx="3" fill="#0F1117" stroke={color} strokeWidth="0.5" opacity="0.5" />
      {[33, 46, 59].map((v) => (
        <g key={`grid-${v}`}>
          <line x1={v} y1="20" x2={v} y2="80" stroke={color} strokeWidth="0.4" opacity="0.12" />
          <line x1="20" y1={v} x2="80" y2={v} stroke={color} strokeWidth="0.4" opacity="0.12" />
        </g>
      ))}
      <rect x="30" y="40" width="40" height="22" rx="3" fill={color} opacity="0.1" />
      <text x="50" y="55" textAnchor="middle" fill={color} fontFamily="'IBM Plex Mono', monospace" fontWeight="600" fontSize="14" letterSpacing="2">
        {label}
      </text>
    </svg>
  );
}

// ─── VS Badge ────────────────────────────────────────────────────────────────
function VsBadge() {
  return (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <div className="absolute inset-0 rounded-full border border-white/15 animate-pulse-glow" />
      <div className="absolute inset-2 rounded-full bg-s01g9-arch-panel flex items-center justify-center border border-white/10" style={{ backgroundColor: "#1a1f2b" }}>
        <span className="font-tech text-xs font-semibold text-white/70" style={{ color: "rgba(255,255,255,0.7)" }}>VS</span>
      </div>
    </div>
  );
}

// ─── Chip-to-chip circuit line decorators ─────────────────────────────────────
function CircuitLine({ side, width, color, delay }: { side: "left" | "right"; width: number; color: string; delay: number }) {
  const x1 = side === "left" ? 0 : width;
  const x2 = side === "left" ? width - 40 : 40;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <line x1={x1} y1="50" x2={x2} y2="50" stroke={color} strokeWidth="1" opacity="0.25" strokeDasharray="6 6" className="animate-circuit" />
      <line x1={x1} y1="51" x2={x2} y2="51" stroke={color} strokeWidth="0.5" opacity="0.1" strokeDasharray="3 8" className="animate-circuit" style={{ animationDelay: `${delay}s` }} />
    </svg>
  );
}

// ─── Corner brackets — museum-vitrine framing device ──────────────────────────
// Small L-marks at each viewport corner. This is the single cheapest fix for
// "content floating in a void": it gives the canvas an edge instead of a fade.
function CornerBrackets() {
  const size = 22;
  const common = "absolute w-[22px] h-[22px] border-white/20";
  return (
    <div className="pointer-events-none absolute inset-0 z-20 p-5 sm:p-8">
      <div className={`${common} top-5 left-5 sm:top-8 sm:left-8 border-t border-l`} style={{ width: size, height: size }} />
      <div className={`${common} top-5 right-5 sm:top-8 sm:right-8 border-t border-r`} style={{ width: size, height: size }} />
      <div className={`${common} bottom-5 left-5 sm:bottom-8 sm:left-8 border-b border-l`} style={{ width: size, height: size }} />
      <div className={`${common} bottom-5 right-5 sm:bottom-8 sm:right-8 border-b border-r`} style={{ width: size, height: size }} />
    </div>
  );
}

// ─── Exhibit footer — page furniture that implies scale beyond this screen ────
function ExhibitFooter({ noteIndex, noteTotal }: { noteIndex: number; noteTotal: number }) {
  return (
    <div className="pointer-events-none absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-5 sm:px-8 py-4 font-tech text-[10px] tracking-[0.15em] uppercase text-white/25">
      <span>Note {String(noteIndex + 1).padStart(2, "0")} / {String(noteTotal).padStart(2, "0")}</span>
    </div>
  );
}

// ─── Did-you-know facts ────────────────────────────────────────────────────
// Filtered by hovered architecture so the placard becomes another way the
// page responds to interaction, not just static trivia.
type Arch = "arm" | "x86";
const FACTS: { arch: Arch; text: string }[] = [
  { arch: "arm", text: "ARM originally stood for \"Acorn RISC Machine,\" built in 1985 for a British home computer." },
  { arch: "x86", text: "x86 traces back to Intel's 8086, released in 1978 — modern chips still run software written for it." },
  { arch: "arm", text: "ARM doesn't manufacture a single chip. It licenses designs to Apple, Qualcomm, Samsung, and others." },
  { arch: "x86", text: "AMD, not Intel, introduced the 64-bit extension (x86-64) that every modern PC now runs on." },
  { arch: "arm", text: "Apple's M-series chips moved the entire Mac lineup from x86 to ARM in 2020." },
  { arch: "x86", text: "x86 instructions are variable-length, from 1 to 15 bytes — a big reason they're harder to decode in parallel." },
  { arch: "arm", text: "Nearly every smartphone on Earth runs on an ARM core." },
  { arch: "x86", text: "Modern x86 chips secretly translate CISC instructions into simpler, RISC-like micro-ops internally." },
];

function FactPlacard({ hoveredArch }: { hoveredArch: Arch | null }) {
  const [tick, setTick] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4500);
    return () => clearInterval(id);
  }, []);

  const pool = hoveredArch ? FACTS.filter((f) => f.arch === hoveredArch) : FACTS;
  const fact = pool[tick % pool.length];
  const accent = fact.arch === "arm" ? "#00C2D1" : "#FF8C42";

  return (
    <div className="relative z-10 mt-10 w-full max-w-md mx-auto">
      <div
        key={fact.text}
        className="border-l-2 pl-4 py-1 text-left"
        style={{
          borderColor: accent,
          animation: reduceMotion ? "none" : "factIn 0.4s ease both",
        }}
      >
        <p className="font-tech text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: accent }}>
          Did you know
        </p>
        <p className="text-gray-400 text-xs sm:text-[13px] leading-relaxed">{fact.text}</p>
      </div>
    </div>
  );
}

// ─── Interactive Circuit Board Background ─────────────────────────────────────
const ARM_COLOR = "#00C2D1";
const X86_COLOR = "#FF8C42";
const IDLE_COLOR = "#1A1F2B";
const C = 12;

type HoveredArch = "arm" | "x86" | null;

const ARM_RAIL_1 = `M 0 110 H 280 L ${280 + C} ${110 - C} H 465`;
const ARM_LOWER = `M 0 540 H 112 L ${112 + C} ${540 + C} V 648 L ${112 + 2 * C} ${648 + C} H 295 L ${295 + C} ${648 - C} H 460`;
const X86_RAIL_1 = `M 1440 110 H 1160 L ${1160 - C} ${110 - C} H 975`;
const X86_LOWER = `M 1440 540 H 1328 L ${1328 - C} ${540 + C} V 648 L ${1328 - 2 * C} ${648 + C} H 1145 L ${1145 - C} ${648 - C} H 980`;

function CircuitBoard({ hoveredArch, boardReady, reduceMotion }: { hoveredArch: HoveredArch; boardReady: boolean; reduceMotion: boolean }) {
  const armActive = hoveredArch === "arm";
  const x86Active = hoveredArch === "x86";

  const armStroke = armActive ? "#FFFFFF" : IDLE_COLOR;
  const x86Stroke = x86Active ? "#FFFFFF" : IDLE_COLOR;

  // Resting opacity raised (was 0.65) so the board reads as circuitry, not a
  // flat tiled grid, before anyone hovers anything.
  const armOpacityBase = x86Active ? 0.15 : armActive ? 1 : 0.85;
  const x86OpacityBase = armActive ? 0.15 : x86Active ? 1 : 0.85;

  const armOpacity = boardReady ? armOpacityBase : 0;
  const x86Opacity = boardReady ? x86OpacityBase : 0;

  const armFilter = armActive
    ? `drop-shadow(0 0 3px ${ARM_COLOR}) drop-shadow(0 0 8px ${ARM_COLOR}) drop-shadow(0 0 25px ${ARM_COLOR}88)`
    : "none";
  const x86Filter = x86Active
    ? `drop-shadow(0 0 3px ${X86_COLOR}) drop-shadow(0 0 8px ${X86_COLOR}) drop-shadow(0 0 25px ${X86_COLOR}88)`
    : "none";

  const tx: React.CSSProperties = {
    transition: "stroke 0.5s ease, opacity 0.9s ease, filter 0.5s ease, color 0.5s ease",
  };

  const viaStyle: React.CSSProperties = { fill: "currentColor", stroke: "none" };

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", zIndex: 0 }}
      aria-hidden="true"
    >
      <g
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: armStroke, color: armStroke, opacity: armOpacity, filter: armFilter, ...tx }}
      >
        <path d={ARM_RAIL_1} />
        <path d={`M 200 110 V 55 L ${200 + C} ${55 - C} H 400`} />
        <path d={`M 55 0 V 210 L ${55 + C} ${210 + C} H 195 L ${195 + C} ${210 + 2 * C} V 370`} />
        <path d={`M 0 315 H 132 L ${132 + C} ${315 - C} H 335 L ${335 + C} ${315 + C} V 435 L ${335} ${435 + C} H 142 L ${142 - C} ${435 + 2 * C} V 530`} />
        <path d={ARM_LOWER} />
        <path d={`M 0 735 H 188 L ${188 + C} ${735 - C} H 405 L ${405 + C} ${735 + C} V 840 L ${405} ${840 + C} H 218`} />
        <path d={`M 18 315 V 540 L ${18 + C} ${540 + C} H 75`} />
        <path d={`M 280 110 V 198 L ${280 + C} ${198 + C} H 430`} />
        <path d={`M 0 435 H 50`} />
        <path d={`M 0 658 H 98 L ${98 + C} ${658 - C} V ${540 + C}`} />

        <circle cx={200} cy={110} r={3} style={viaStyle} />
        <circle cx={280} cy={110} r={3} style={viaStyle} />
        <circle cx={55} cy={210} r={3} style={viaStyle} />
        <circle cx={207} cy={222} r={2.5} style={viaStyle} />
        <circle cx={132} cy={315} r={3} style={viaStyle} />
        <circle cx={335} cy={303} r={2.5} style={viaStyle} />
        <circle cx={347} cy={435} r={3} style={viaStyle} />
        <circle cx={130} cy={447} r={2.5} style={viaStyle} />
        <circle cx={112} cy={540} r={3} style={viaStyle} />
        <circle cx={124} cy={648} r={3} style={viaStyle} />
        <circle cx={295} cy={636} r={2.5} style={viaStyle} />
        <circle cx={188} cy={735} r={3} style={viaStyle} />
        <circle cx={405} cy={735} r={3} style={viaStyle} />
        <circle cx={98} cy={658} r={2.5} style={viaStyle} />

        {!reduceMotion && (
          <>
            <circle r={2.6} fill="currentColor">
              <animateMotion dur="5s" repeatCount="indefinite" path={ARM_RAIL_1} />
            </circle>
            <circle r={2.2} fill="currentColor" opacity="0.7">
              <animateMotion dur="6.5s" begin="1.2s" repeatCount="indefinite" path={ARM_LOWER} />
            </circle>
          </>
        )}
      </g>

      <g
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: x86Stroke, color: x86Stroke, opacity: x86Opacity, filter: x86Filter, ...tx }}
      >
        <path d={X86_RAIL_1} />
        <path d={`M 1240 110 V 55 L ${1240 - C} ${55 - C} H 1040`} />
        <path d={`M 1385 0 V 210 L ${1385 - C} ${210 + C} H 1245 L ${1245 - C} ${210 + 2 * C} V 370`} />
        <path d={`M 1440 315 H 1308 L ${1308 - C} ${315 - C} H 1105 L ${1105 - C} ${315 + C} V 435 L ${1105} ${435 + C} H 1298 L ${1298 + C} ${435 + 2 * C} V 530`} />
        <path d={X86_LOWER} />
        <path d={`M 1440 735 H 1252 L ${1252 - C} ${735 - C} H 1035 L ${1035 - C} ${735 + C} V 840 L ${1035} ${840 + C} H 1222`} />
        <path d={`M 1422 315 V 540 L ${1422 - C} ${540 + C} H 1365`} />
        <path d={`M 1160 110 V 198 L ${1160 - C} ${198 + C} H 1010`} />
        <path d={`M 1440 435 H 1390`} />
        <path d={`M 1440 658 H 1342 L ${1342 - C} ${658 - C} V ${540 + C}`} />

        <circle cx={1240} cy={110} r={3} style={viaStyle} />
        <circle cx={1160} cy={110} r={3} style={viaStyle} />
        <circle cx={1385} cy={210} r={3} style={viaStyle} />
        <circle cx={1233} cy={222} r={2.5} style={viaStyle} />
        <circle cx={1308} cy={315} r={3} style={viaStyle} />
        <circle cx={1105} cy={303} r={2.5} style={viaStyle} />
        <circle cx={1093} cy={435} r={3} style={viaStyle} />
        <circle cx={1310} cy={447} r={2.5} style={viaStyle} />
        <circle cx={1328} cy={540} r={3} style={viaStyle} />
        <circle cx={1316} cy={648} r={3} style={viaStyle} />
        <circle cx={1145} cy={636} r={2.5} style={viaStyle} />
        <circle cx={1252} cy={735} r={3} style={viaStyle} />
        <circle cx={1035} cy={735} r={3} style={viaStyle} />
        <circle cx={1342} cy={658} r={2.5} style={viaStyle} />

        {!reduceMotion && (
          <>
            <circle r={2.6} fill="currentColor">
              <animateMotion dur="5.4s" begin="0.4s" repeatCount="indefinite" path={X86_RAIL_1} />
            </circle>
            <circle r={2.2} fill="currentColor" opacity="0.7">
              <animateMotion dur="6.8s" begin="1.6s" repeatCount="indefinite" path={X86_LOWER} />
            </circle>
          </>
        )}
      </g>

      <g
        fill="none"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={IDLE_COLOR}
        opacity={boardReady ? 0.55 : 0}
        style={{ transition: "opacity 0.9s ease" }}
      >
        <path d={`M 685 0 V 160 L ${685 + C} ${160 + C} H ${755 - C} L 755 ${160} V 0`} />
        <path d={`M 685 900 V 740 L ${685 + C} ${740 - C} H ${755 - C} L 755 ${740} V 900`} />
        <line x1="720" y1="172" x2="720" y2="728" strokeDasharray="5 10" />
        <circle cx={697} cy={172} r={2.5} fill={IDLE_COLOR} />
        <circle cx={743} cy={172} r={2.5} fill={IDLE_COLOR} />
        <circle cx={697} cy={728} r={2.5} fill={IDLE_COLOR} />
        <circle cx={743} cy={728} r={2.5} fill={IDLE_COLOR} />
      </g>
    </svg>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onSelect }: { onSelect?: (arch: "arm" | "x86") => void }) {
  const [hoveredArch, setHoveredArch] = useState<HoveredArch>(null);
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [factTick, setFactTick] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setFactTick((t) => t + 1), 4500);
    return () => clearInterval(id);
  }, []);

  const factPool = hoveredArch ? FACTS.filter((f) => f.arch === hoveredArch) : FACTS;
  const activeFact = factPool[factTick % factPool.length];
  const factIndexInFullList = FACTS.indexOf(activeFact);

  const reveal = (delayMs: number, kind: "rise" | "pop" = "rise") =>
    reduceMotion
      ? { opacity: 1 }
      : ({
        animation: mounted ? `${kind === "rise" ? "riseIn" : "popIn"} 0.7s cubic-bezier(0.16,1,0.3,1) both` : "none",
        animationDelay: `${delayMs}ms`,
        opacity: mounted ? 1 : 0,
      } as React.CSSProperties);

  return (
    <div
      className="min-h-[80vh] w-full bg-pcb flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden rounded-2xl"
      style={{ backgroundColor: "#0f1117" }}
    >
      <FontLoader />
      <CornerBrackets />

      <CircuitBoard hoveredArch={hoveredArch} boardReady={mounted} reduceMotion={reduceMotion} />

      {/* Eyebrow + heading + thesis */}
      <div className="text-center mb-10 relative z-10 max-w-2xl">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-s01g9-arm to-s01g9-x86 font-display text-4xl sm:text-5xl md:text-6xl font-black mb-4">
          ARM <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 0.5rem", fontWeight: 300 }}>vs</span> x86
        </p>
        <p className="font-tech text-[11px] tracking-[0.25em] uppercase text-white/35 mb-4" style={{ color: "rgba(255,255,255,0.35)", ...reveal(0) }}>
          Two architectures · one instruction set war
        </p>
        <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed" style={{ color: "#9ca3af", ...reveal(160) }}>
          One decodes fixed-length instructions in a single cycle to sip power.
          The other decodes variable-length instructions to chase peak throughput.
          Pick a side to see where that tradeoff actually lives in the silicon.
        </p>
      </div>

      {/* Chip selector */}
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
        <button
          type="button"
          className="relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F1117]"
          style={reveal(260, "pop")}
          onClick={() => onSelect?.("arm")}
          onMouseEnter={() => setHoveredArch("arm")}
          onMouseLeave={() => setHoveredArch(null)}
          onFocus={() => setHoveredArch("arm")}
          onBlur={() => setHoveredArch(null)}
          aria-label="Explore the ARM architecture"
        >
          <div className="cursor-pointer hover:scale-105 transition-transform duration-300 flex flex-col items-center gap-3 group">
            <CpuChip color="#00C2D1" label="ARM" />
            <div className="flex flex-col items-center">
              <span className="font-tech text-sm text-s01g9-arm tracking-widest" style={{ color: "#00C2D1" }}>ARM</span>
              <span className="font-tech text-[10px] text-gray-500 mt-1 uppercase tracking-wider" style={{ color: "#6b7280" }}>RISC · fixed-length · low power</span>
            </div>
            <div className="w-24 h-[2px] bg-s01g9-arm/20 rounded-full group-hover:bg-s01g9-arm/40 transition-colors" style={{ backgroundColor: "rgba(0,194,209,0.2)" }} />
          </div>
        </button>

        <div className="flex items-center justify-center relative" style={reveal(340, "pop")}>
          <CircuitLine side="left" width={100} color="#00C2D1" delay={0} />
          <CircuitLine side="right" width={100} color="#FF8C42" delay={0.15} />
          <VsBadge />
        </div>

        <button
          type="button"
          className="relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F1117]"
          style={reveal(420, "pop")}
          onClick={() => onSelect?.("x86")}
          onMouseEnter={() => setHoveredArch("x86")}
          onMouseLeave={() => setHoveredArch(null)}
          onFocus={() => setHoveredArch("x86")}
          onBlur={() => setHoveredArch(null)}
          aria-label="Explore the x86 architecture"
        >
          <div className="cursor-pointer hover:scale-105 transition-transform duration-300 flex flex-col items-center gap-3 group">
            <CpuChip color="#FF8C42" label="x86" />
            <div className="flex flex-col items-center">
              <span className="font-tech text-sm text-s01g9-x86 tracking-widest" style={{ color: "#FF8C42" }}>x86</span>
              <span className="font-tech text-[10px] text-gray-500 mt-1 uppercase tracking-wider" style={{ color: "#6b7280" }}>CISC · variable-length · high throughput</span>
            </div>
            <div className="w-24 h-[2px] bg-s01g9-x86/20 rounded-full group-hover:bg-s01g9-x86/40 transition-colors" style={{ backgroundColor: "rgba(255,140,66,0.2)" }} />
          </div>
        </button>
      </div>

      {/* Rotating "did you know" placard — museum-label framing that hints
          the exhibit has more depth than this one screen. */}
      <div style={reveal(520)}>
        <FactPlacard hoveredArch={hoveredArch} />
      </div>

      <ExhibitFooter noteIndex={factIndexInFullList} noteTotal={FACTS.length} />
    </div>
  );
}

export default LandingPage;