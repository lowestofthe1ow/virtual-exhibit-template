/**
 * HardwareMatrixSim.jsx
 *
 * The "Visual Hardware Simulation" column of the Drawing Tablet Simulator
 * (left side of the Proposed Page Wireframe Layout in the README).
 *
 * Renders, top to bottom, the full signal chain as one SVG scene:
 *
 *   [ Monitor ] <- strokes echoed back to the screen by the CPU
 *        |
 *   [ CPU / Host ] <- bus link pulses while an interrupt is being serviced
 *        |
 *   [ Drawing Tablet / Active Area Grid ] <- the digitizer matrix itself
 *
 * ## Interactive Element #1 (from the proposal)
 * The tablet surface is drawn as a grid of horizontal + vertical "copper"
 * traces. As the pen (the user's pointer) moves across the active area, the
 * traces nearest the pen tip illuminate with an intensity falloff, so the
 * viewer can literally see which conductors are currently sensing the pen.
 *
 * ## Learning Notes
 * - This is a *controlled* (stateless) component: all live values -- pen
 *   position, pressure, strokes, drawing flag -- arrive as props from
 *   InteractiveCanvas.jsx, which owns the state. The component just draws.
 * - Wire illumination is computed per-trace from the distance between the
 *   trace and the pen, mimicking how a real digitizer sees the strongest
 *   signal on the conductors closest to the pen coil.
 * - Pointer events (onPointerDown/Move/Up/Leave) are forwarded up via
 *   callbacks so the parent can update registers, fire interrupts, etc.
 *
 * ## Props
 *   - pen        ({x, y} | null) normalized 0..1 pen position, null = out of range
 *   - pressure   (number 0..1)   current pen force (from the slider)
 *   - isDrawing  (boolean)       pen is in contact (pointer held down)
 *   - strokes    (array)         finished + in-progress strokes; each stroke is
 *                                an array of {x, y, p} points (normalized)
 *   - onPenMove / onPenDown / onPenUp / onPenLeave  (functions) pointer callbacks
 *                                receiving normalized {x, y}
 */

import { useRef } from "react";

// Grid geometry (SVG user units)
const PAD_X = 20;
const PAD_Y = 250;
const PAD_W = 400;
const PAD_H = 220;
const COLS = 24; // vertical traces (X sensing)
const ROWS = 13; // horizontal traces (Y sensing)

// Monitor geometry
const MON_X = 120;
const MON_Y = 12;
const MON_W = 200;
const MON_H = 120;

// CPU geometry
const CPU_X = 170;
const CPU_Y = 168;
const CPU_W = 100;
const CPU_H = 44;

/** Signal strength (0..1) for a trace at distance d (normalized units). */
function traceSignal(d) {
  const falloff = 0.09; // how far the pen's field "reaches"
  const s = 1 - d / falloff;
  return s > 0 ? s : 0;
}

/** Blend from idle gray -> copper -> near-black as signal rises. */
function traceColor(s) {
  if (s <= 0) return "var(--tx-grid-idle)";
  // Interpolate idle #DDDDDD -> copper #B87333
  const from = [0xdd, 0xdd, 0xdd];
  const to = [0xb8, 0x73, 0x33];
  const c = from.map((f, i) => Math.round(f + (to[i] - f) * Math.min(1, s * 1.4)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export default function HardwareMatrixSim({
  pen,
  pressure,
  isDrawing,
  strokes,
  onPenMove,
  onPenDown,
  onPenUp,
  onPenLeave,
  onPadKeyDown,
}) {
  const svgRef = useRef(null);

  /** Convert a pointer event to normalized pad coordinates (0..1, 0..1). */
  function toPad(e) {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    // Map client px -> SVG user units (viewBox is 440 x 490)
    const ux = ((e.clientX - rect.left) / rect.width) * 440;
    const uy = ((e.clientY - rect.top) / rect.height) * 490;
    const x = (ux - PAD_X) / PAD_W;
    const y = (uy - PAD_Y) / PAD_H;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    return { x, y };
  }

  // --- Build the digitizer grid, illuminating traces near the pen --------
  const vTraces = [];
  for (let i = 0; i < COLS; i++) {
    const nx = i / (COLS - 1);
    const s = pen ? traceSignal(Math.abs(nx - pen.x)) : 0;
    vTraces.push(
      <line
        key={`v${i}`}
        x1={PAD_X + nx * PAD_W}
        y1={PAD_Y}
        x2={PAD_X + nx * PAD_W}
        y2={PAD_Y + PAD_H}
        stroke={traceColor(s)}
        strokeWidth={s > 0 ? 1 + s * 2 : 1}
      />
    );
  }
  const hTraces = [];
  for (let j = 0; j < ROWS; j++) {
    const ny = j / (ROWS - 1);
    const s = pen ? traceSignal(Math.abs(ny - pen.y)) : 0;
    hTraces.push(
      <line
        key={`h${j}`}
        x1={PAD_X}
        y1={PAD_Y + ny * PAD_H}
        x2={PAD_X + PAD_W}
        y2={PAD_Y + ny * PAD_H}
        stroke={traceColor(s)}
        strokeWidth={s > 0 ? 1 + s * 2 : 1}
      />
    );
  }

  // --- Strokes, echoed on the monitor "screen" ---------------------------
  // Each consecutive point pair becomes a segment whose width tracks the
  // pressure recorded at draw time (Interactive Element #3: thickness varies
  // with force).
  const monitorSegs = [];
  strokes.forEach((stroke, si) => {
    for (let k = 1; k < stroke.length; k++) {
      const a = stroke[k - 1];
      const b = stroke[k];
      monitorSegs.push(
        <line
          key={`m${si}-${k}`}
          x1={MON_X + 8 + a.x * (MON_W - 16)}
          y1={MON_Y + 8 + a.y * (MON_H - 16)}
          x2={MON_X + 8 + b.x * (MON_W - 16)}
          y2={MON_Y + 8 + b.y * (MON_H - 16)}
          stroke="var(--tx-ink)"
          strokeWidth={0.5 + b.p * 3.5}
          strokeLinecap="round"
        />
      );
    }
  });

  // Faint echo of strokes on the pad itself, so drawing feels physical
  const padSegs = [];
  strokes.forEach((stroke, si) => {
    for (let k = 1; k < stroke.length; k++) {
      const a = stroke[k - 1];
      const b = stroke[k];
      padSegs.push(
        <line
          key={`p${si}-${k}`}
          x1={PAD_X + a.x * PAD_W}
          y1={PAD_Y + a.y * PAD_H}
          x2={PAD_X + b.x * PAD_W}
          y2={PAD_Y + b.y * PAD_H}
          stroke="var(--tx-signal)"
          strokeOpacity="0.35"
          strokeWidth={0.5 + b.p * 3}
          strokeLinecap="round"
        />
      );
    }
  });

  const busActive = isDrawing;

  return (
    <div className="tx-svgwrap">
      <svg
        ref={svgRef}
        className="tx-pad"
        viewBox="0 0 440 490"
        role="application"
        tabIndex="0"
        aria-label="Drawing tablet simulator. Hover or drag with a pointer to draw. Keyboard: arrow keys move the pen, Shift-arrow moves faster, Space or Enter presses and lifts the pen tip, Escape lifts the pen away."
        onKeyDown={onPadKeyDown}
        onPointerMove={(e) => onPenMove(toPad(e))}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          onPenDown(toPad(e));
        }}
        onPointerUp={(e) => onPenUp(toPad(e))}
        onPointerLeave={() => onPenLeave()}
      >
        {/* ---- Monitor -------------------------------------------------- */}
        <rect x={MON_X} y={MON_Y} width={MON_W} height={MON_H} fill="#fff" stroke="var(--tx-ink)" strokeWidth="3" />
        <rect x={MON_X + 4} y={MON_Y + 4} width={MON_W - 8} height={MON_H - 8} fill="#fff" stroke="var(--tx-grid-idle)" strokeWidth="1" />
        {monitorSegs}
        <rect x={MON_X + MON_W / 2 - 14} y={MON_Y + MON_H} width="28" height="10" fill="var(--tx-ink)" />
        <text x={MON_X + MON_W / 2} y={MON_Y + MON_H - 8} textAnchor="middle" fontFamily="Courier New, monospace" fontSize="9" fill="var(--tx-signal)">
          MONITOR
        </text>

        {/* ---- Bus: monitor <- CPU -------------------------------------- */}
        <line x1="220" y1={MON_Y + MON_H + 10} x2="220" y2={CPU_Y} stroke="var(--tx-ink)" strokeWidth="2" strokeDasharray={busActive ? "4 3" : "none"}>
          {busActive && (
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.4s" repeatCount="indefinite" />
          )}
        </line>

        {/* ---- CPU / Host ------------------------------------------------ */}
        <rect x={CPU_X} y={CPU_Y} width={CPU_W} height={CPU_H} fill={busActive ? "var(--tx-ink)" : "#fff"} stroke="var(--tx-ink)" strokeWidth="3" />
        <text x={CPU_X + CPU_W / 2} y={CPU_Y + CPU_H / 2 + 4} textAnchor="middle" fontFamily="Courier New, monospace" fontSize="12" fontWeight="bold" fill={busActive ? "#fff" : "var(--tx-ink)"}>
          CPU/HOST
        </text>
        {/* IRQ flag */}
        {busActive && (
          <text x={CPU_X + CPU_W + 8} y={CPU_Y + 16} fontFamily="Courier New, monospace" fontSize="10" fill="var(--tx-ink)">
            IRQ!
          </text>
        )}

        {/* ---- Bus: CPU <- tablet ---------------------------------------- */}
        <line x1="220" y1={CPU_Y + CPU_H} x2="220" y2={PAD_Y - 12} stroke="var(--tx-ink)" strokeWidth="2" strokeDasharray={busActive ? "4 3" : "none"}>
          {busActive && (
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.4s" repeatCount="indefinite" />
          )}
        </line>

        {/* ---- Drawing tablet -------------------------------------------- */}
        <rect x={PAD_X - 8} y={PAD_Y - 12} width={PAD_W + 16} height={PAD_H + 24} fill="#fff" stroke="var(--tx-ink)" strokeWidth="3" />
        {hTraces}
        {vTraces}
        {padSegs}
        <text x={PAD_X} y={PAD_Y + PAD_H + 9} fontFamily="Courier New, monospace" fontSize="9" fill="var(--tx-signal)">
          ACTIVE AREA GRID ({COLS} X-TRACES x {ROWS} Y-TRACES)
        </text>

        {/* ---- Pen ------------------------------------------------------- */}
        {pen && (
          <g pointerEvents="none">
            {/* sensing field */}
            <circle cx={PAD_X + pen.x * PAD_W} cy={PAD_Y + pen.y * PAD_H} r={10 + pressure * 10} fill="none" stroke="var(--tx-copper)" strokeWidth="1" strokeDasharray="3 3" />
            {/* tip */}
            <circle cx={PAD_X + pen.x * PAD_W} cy={PAD_Y + pen.y * PAD_H} r={isDrawing ? 4 : 3} fill={isDrawing ? "var(--tx-ink)" : "var(--tx-signal)"} />
            {/* barrel */}
            <line x1={PAD_X + pen.x * PAD_W} y1={PAD_Y + pen.y * PAD_H} x2={PAD_X + pen.x * PAD_W + 26} y2={PAD_Y + pen.y * PAD_H - 34} stroke="var(--tx-ink)" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
}
