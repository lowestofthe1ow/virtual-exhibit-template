/**
 * InteractiveCanvas.jsx
 *
 * The Drawing Tablet Simulator -- the exhibit's main interactive component.
 * Composes the two child panels from the Proposed Page Wireframe Layout:
 *
 *   +---------------------------------+-------------------------------+
 *   | HardwareMatrixSim (visual sim)  | BusRegisterMonitor (data feed)|
 *   +---------------------------------+-------------------------------+
 *   | Pen Force Slider [=====----] %  |                               |
 *   +---------------------------------+-------------------------------+
 *
 * It is the single owner of all simulator state (pen position, force,
 * strokes, interrupt counter, report rate) and passes that state DOWN to
 * the two presentational children -- the classic React "lift state up"
 * pattern.
 *
 * ## The three Interactive Elements from the proposal
 *  1. Hover/drag over the pad  -> pen position sampled, copper traces
 *     illuminate (HardwareMatrixSim), X/Y registers update (BusRegisterMonitor).
 *  2. Force slider             -> analog % quantized to a 13-bit ADC level
 *     (0..8191), shown as binary + decimal in the data feed.
 *  3. Sketching at speed       -> each report packet raises a hardware
 *     interrupt (IRQ counter + report-rate readout), and the stroke echoed
 *     on the monitor varies its thickness with the recorded pressure.
 *
 * ## Learning Notes
 * - useState for renderable state (pen, strokes...), useRef for bookkeeping
 *   that must NOT trigger re-renders (per-second report counting).
 * - Strokes are updated immutably: we always build a new array so React
 *   detects the change.
 * - A 1-second setInterval inside useEffect converts "reports counted this
 *   second" into a Hz figure, then cleans itself up on unmount.
 *
 * ## Props
 *   None. Drop it into MDX (client:load so it hydrates in the browser):
 *
 * ## Usage Example
 *   <InteractiveCanvas client:load />
 */

import { useState, useRef, useEffect } from "react";
import HardwareMatrixSim from "./S40_Group3_HardwareMatrixSim.jsx";
import BusRegisterMonitor from "./S40_Group3_BusRegisterMonitor.jsx";
import { buildDemoStrokes } from "./S40_Group3_demoLogo.js";
import "../../styles/s40g3/S40_Group3_tablet-exhibit.css";

const MAX_POINTS = 4000; // cap stroke memory so long sessions stay smooth

export default function InteractiveCanvas() {
  // --- Simulator state --------------------------------------------------
  const [pen, setPen] = useState(null); // {x,y} normalized, or null = out of range
  const [pressurePct, setPressurePct] = useState(65); // slider, 0..100
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]); // array of arrays of {x,y,p}
  const [interruptCount, setInterruptCount] = useState(0);
  const [reportRate, setReportRate] = useState(0);

  // --- Report-rate bookkeeping (refs: no re-render needed) ---------------
  const reportsThisSecond = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setReportRate(reportsThisSecond.current);
      reportsThisSecond.current = 0;
    }, 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  const pressure = pressurePct / 100;

  // --- Demo stroke bookkeeping -------------------------------------------
  const [demoRunning, setDemoRunning] = useState(false);
  const demoTimer = useRef(null);

  useEffect(() => {
    // Stop a running demo cleanly if the component unmounts
    return () => {
      if (demoTimer.current) clearInterval(demoTimer.current);
    };
  }, []);

  /**
   * Improvement (final milestone): auto-draw a demo so viewers can see the
   * full pipeline (wire illumination -> registers -> ADC -> IRQs -> monitor
   * echo) without needing precise pointer control.
   *
   * The demo draws the College of Computer Studies mark: the tilted frame
   * (outer and inner outline) and the wordmark "College of / Computer
   * Studies" in a single-stroke pen font (see S40_Group3_demoLogo.js). The
   * playback is a precomputed schedule of frames: within a stroke the pen
   * travels at constant speed with the tip down; between strokes the tip
   * lifts and the pen hops to the next stroke's start, exactly like a
   * plotter. Every tip-down frame raises an IRQ, so the counters run hot
   * while the mark draws itself.
   */
  function runDemoStroke() {
    if (demoRunning) return;
    setDemoRunning(true);
    const restorePct = pressurePct; // put the slider back afterwards

    // ---- Precompute the frame schedule ----------------------------------
    const strokes = buildDemoStrokes();
    const STEP_MS = 25;
    const DRAW_SPEED = 1.5; // pad-widths per second while drawing
    const perFrame = (DRAW_SPEED * STEP_MS) / 1000; // distance per frame
    const schedule = []; // {pos, draw, newStroke, pct}

    /** Point at arc-length distance d along a polyline (with cum lengths). */
    function pointAtDist(pts, cum, d) {
      let s = 1;
      while (s < cum.length - 1 && cum[s] < d) s++;
      const segLen = cum[s] - cum[s - 1];
      const f = segLen === 0 ? 0 : (d - cum[s - 1]) / segLen;
      return {
        x: pts[s - 1].x + (pts[s].x - pts[s - 1].x) * f,
        y: pts[s - 1].y + (pts[s].y - pts[s - 1].y) * f,
      };
    }

    let prevEnd = null;
    for (const stroke of strokes) {
      const pts = stroke.points;
      if (pts.length === 0) continue;
      // Pen-up hop from the previous stroke's end to this stroke's start
      if (prevEnd) {
        const HOP_FRAMES = 2;
        for (let h = 1; h <= HOP_FRAMES; h++) {
          const f = h / HOP_FRAMES;
          schedule.push({
            pts: [
              {
                x: prevEnd.x + (pts[0].x - prevEnd.x) * f,
                y: prevEnd.y + (pts[0].y - prevEnd.y) * f,
              },
            ],
            draw: false,
            newStroke: false,
            pct: restorePct,
          });
        }
      }
      // Constant-speed walk along the stroke, sampled by total arc length.
      // Each frame carries every original polyline point passed during that
      // frame (plus an interpolated endpoint), so small letter arcs keep
      // their full detail instead of being down-sampled to the frame rate.
      const cum = [0];
      for (let s = 1; s < pts.length; s++) {
        cum.push(cum[s - 1] + Math.hypot(pts[s].x - pts[s - 1].x, pts[s].y - pts[s - 1].y));
      }
      const total = cum[cum.length - 1];
      const n = Math.max(2, Math.round(total / perFrame));
      const pct = Math.round(stroke.pressure * 100);
      let idx = 1; // next original point not yet emitted
      for (let k = 0; k <= n; k++) {
        const d = (total * k) / n;
        const framePts = [];
        while (idx < pts.length && cum[idx] <= d) {
          framePts.push(pts[idx]);
          idx += 1;
        }
        const tip = pointAtDist(pts, cum, d);
        const last = framePts[framePts.length - 1];
        if (!last || Math.hypot(tip.x - last.x, tip.y - last.y) > 1e-6) {
          framePts.push(tip);
        }
        schedule.push({ pts: framePts, draw: true, newStroke: k === 0, pct });
      }
      prevEnd = pts[pts.length - 1];
    }

    // ---- Play the schedule ----------------------------------------------
    let i = 0;
    demoTimer.current = setInterval(() => {
      if (i >= schedule.length) {
        clearInterval(demoTimer.current);
        demoTimer.current = null;
        setIsDrawing(false);
        setPen(null);
        setPressurePct(restorePct);
        setDemoRunning(false);
        return;
      }
      const fr = schedule[i];
      const tip = fr.pts[fr.pts.length - 1];
      setPen(tip);
      setPressurePct(fr.pct);
      reportsThisSecond.current += 1;
      if (fr.draw) {
        setIsDrawing(true);
        setInterruptCount((n) => n + 1);
        const withPressure = fr.pts.map((p) => ({ ...p, p: fr.pct / 100 }));
        if (fr.newStroke) {
          setStrokes((prev) => prev.concat([withPressure]));
        } else {
          setStrokes((prev) => {
            if (prev.length === 0) return prev;
            const next = prev.slice();
            next[next.length - 1] = next[next.length - 1].concat(withPressure);
            return next;
          });
        }
      } else {
        setIsDrawing(false);
      }
      i += 1;
    }, STEP_MS);
  }

  /**
   * Improvement (final milestone): keyboard operation of the tablet, so the
   * simulator is usable without a pointing device (rubric: accessibility
   * basics). Focus the pad, then:
   *   Arrow keys        move the pen (hold Shift for larger steps)
   *   Space or Enter    press / lift the pen tip (toggle drawing)
   *   Escape            lift the pen out of the digitizer's range
   */
  function handlePadKeyDown(e) {
    const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (![...ARROWS, " ", "Enter", "Escape"].includes(e.key)) return;
    e.preventDefault(); // keep arrows/space from scrolling the page

    if (e.key === "Escape") {
      setIsDrawing(false);
      setPen(null);
      return;
    }

    // Place the pen at pad center on first keyboard use
    const current = pen ?? { x: 0.5, y: 0.5 };

    if (e.key === " " || e.key === "Enter") {
      if (isDrawing) {
        setIsDrawing(false);
      } else {
        setPen(current);
        setIsDrawing(true);
        setInterruptCount((n) => n + 1);
        setStrokes((prev) => prev.concat([[{ ...current, p: pressure }]]));
      }
      return;
    }

    const step = e.shiftKey ? 0.08 : 0.02;
    const next = {
      x: Math.min(1, Math.max(0, current.x + (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0))),
      y: Math.min(1, Math.max(0, current.y + (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0))),
    };
    handlePenMove(next); // same path as pointer input: reports, IRQs, points
  }


  /** Append a point to the stroke currently being drawn (immutably). */
  function appendPoint(pos) {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice();
      const current = next[next.length - 1].concat([{ ...pos, p: pressure }]);
      next[next.length - 1] = current;
      // Trim oldest stroke if the total point budget is exceeded
      let total = next.reduce((n, s) => n + s.length, 0);
      while (total > MAX_POINTS && next.length > 1) {
        total -= next[0].length;
        next.shift();
      }
      return next;
    });
  }

  // --- Pointer callbacks (wired into HardwareMatrixSim's SVG) ------------
  function handlePenMove(pos) {
    setPen(pos);
    if (pos === null) return;
    // Every position sample is one report packet from the tablet.
    reportsThisSecond.current += 1;
    if (isDrawing) {
      // Interactive Element #3: each in-contact report raises an IRQ.
      setInterruptCount((n) => n + 1);
      appendPoint(pos);
    }
  }

  function handlePenDown(pos) {
    if (pos === null) return;
    setPen(pos);
    setIsDrawing(true);
    setInterruptCount((n) => n + 1);
    setStrokes((prev) => prev.concat([[{ ...pos, p: pressure }]])); // start new stroke
  }

  function handlePenUp() {
    setIsDrawing(false);
  }

  function handlePenLeave() {
    setIsDrawing(false);
    setPen(null); // pen lifted out of the digitizer's sensing range
  }

  return (
    <section className="tx-exhibit">
      <div className="tx-titlebar">
        <span>Interactive Component: Drawing Tablet Simulator</span>
        <span>{isDrawing ? "TIP SWITCH: DOWN" : "TIP SWITCH: UP"}</span>
      </div>

      <div className="tx-body">
        {/* ---- Left column: visual hardware simulation ---- */}
        <div className="tx-left">
          <p className="tx-blocklabel">[ Visual Hardware Simulation ]</p>

          <HardwareMatrixSim
            pen={pen}
            pressure={pressure}
            isDrawing={isDrawing}
            strokes={strokes}
            onPenMove={handlePenMove}
            onPenDown={handlePenDown}
            onPenUp={handlePenUp}
            onPenLeave={handlePenLeave}
            onPadKeyDown={handlePadKeyDown}
          />

          {/* Interactive Element #2: the Pen Force Slider */}
          <div className="tx-slider-row">
            <label htmlFor="tx-force">PEN FORCE</label>
            <input
              id="tx-force"
              type="range"
              min="0"
              max="100"
              value={pressurePct}
              onChange={(e) => setPressurePct(Number(e.target.value))}
              aria-label="Pen force, percent of full-scale pressure"
            />
            <span className="tx-slider-value">{pressurePct}%</span>
          </div>

          <div className="tx-controls">
            <button
              className="tx-btn"
              onClick={runDemoStroke}
              disabled={demoRunning}
            >
              {demoRunning ? "Demo running..." : "Demo stroke"}
            </button>
            <button className="tx-btn" onClick={() => setStrokes([])}>
              Clear screen
            </button>
            <button className="tx-btn" onClick={() => setInterruptCount(0)}>
              Reset IRQ count
            </button>
          </div>
        </div>

        {/* ---- Right column: live architecture data feed ---- */}
        <div className="tx-right">
          <p className="tx-blocklabel">[ Live Architecture Data Feed ]</p>
          <BusRegisterMonitor
            pen={pen}
            pressure={pressure}
            isDrawing={isDrawing}
            interruptCount={interruptCount}
            reportRate={reportRate}
          />
        </div>
      </div>

      <div className="tx-footnote">
        Hover the tablet's active area to energize the digitizer traces. Press
        and drag to close the tip switch, raise interrupts, and draw. Works
        with mouse, touch, and stylus input. Keyboard: focus the tablet (Tab),
        move the pen with the arrow keys (Shift for bigger steps), press
        Space/Enter to lower or lift the tip, Escape to leave the sensing
        range. Or click "Demo stroke" to watch the whole pipeline run itself.
      </div>
    </section>
  );
}
