import { useRef, useState } from "react";

const LARGE_SIZE = 56; 
const SMALL_SIZE = 24;
const EDGE_PAD = 14;
const SENSITIVITY = 1.7; 
const TAP_THRESHOLD = 8; 

export default function PointingDeviceDemo() {
  const [phase, setPhase] = useState("idle"); // idle | playing
  const [target, setTarget] = useState(null); // { x, y, size }
  const [hits, setHits] = useState([]); // [{ ms, size }]
  const [misses, setMisses] = useState(0);
  const [cursor, setCursor] = useState({ x: 280, y: 150 });
  const [contact, setContact] = useState(null); // finger dot on the pad
  const [pressed, setPressed] = useState(false);
  const [missFlash, setMissFlash] = useState(false);

  const areaRef = useRef(null);
  const cursorRef = useRef({ x: 280, y: 150 });
  const lastPointRef = useRef(null);
  const movedRef = useRef(0);
  const spawnTimeRef = useRef(0);
  const spawnCountRef = useRef(0);

  function setCursorPos(next) {
    cursorRef.current = next;
    setCursor(next);
  }

  function spawnTarget() {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const size = spawnCountRef.current % 2 === 0 ? LARGE_SIZE : SMALL_SIZE;
    spawnCountRef.current += 1;
    const maxX = rect.width - size - EDGE_PAD * 2;
    const maxY = rect.height - size - EDGE_PAD * 2;
    setTarget({
      x: EDGE_PAD + Math.random() * Math.max(maxX, 0),
      y: EDGE_PAD + Math.random() * Math.max(maxY, 0),
      size,
    });
    spawnTimeRef.current = performance.now();
  }

  function startTest() {
    const rect = areaRef.current?.getBoundingClientRect();
    const center = rect
      ? { x: rect.width / 2, y: rect.height / 2 }
      : { x: 280, y: 150 };
    setCursorPos(center);
    setHits([]);
    setMisses(0);
    spawnCountRef.current = 0;
    setPhase("playing");
    spawnTarget();
  }

  function registerClick() {
    if (phase !== "playing" || !target) return;
    const cx = target.x + target.size / 2;
    const cy = target.y + target.size / 2;
    const dist = Math.hypot(cursorRef.current.x - cx, cursorRef.current.y - cy);

    if (dist <= target.size / 2 + 4) {
      const ms = Math.round(performance.now() - spawnTimeRef.current);
      setHits((prev) => [...prev, { ms, size: target.size }]);
      spawnTarget();
    } else {
      setMisses((m) => m + 1);
      setMissFlash(true);
      setTimeout(() => setMissFlash(false), 180);
    }
  }

  function padPointerDown(event) {
    if (phase !== "playing") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    movedRef.current = 0;
    setPressed(true);
    updateContact(event);
  }

  function padPointerMove(event) {
    updateContact(event);
    if (phase !== "playing" || !lastPointRef.current) return;

    const dx = event.clientX - lastPointRef.current.x;
    const dy = event.clientY - lastPointRef.current.y;
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    movedRef.current += Math.hypot(dx, dy);

    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nextX = Math.min(
      Math.max(cursorRef.current.x + dx * SENSITIVITY, 0),
      rect.width
    );
    const nextY = Math.min(
      Math.max(cursorRef.current.y + dy * SENSITIVITY, 0),
      rect.height
    );
    setCursorPos({ x: nextX, y: nextY });
  }

  function padPointerUp() {
    setPressed(false);
    setContact(null);
    if (lastPointRef.current && movedRef.current < TAP_THRESHOLD) {
      registerClick();
    }
    lastPointRef.current = null;
  }

  function updateContact(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setContact({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  const avg = (list) =>
    list.length === 0
      ? 0
      : Math.round(list.reduce((sum, h) => sum + h.ms, 0) / list.length);
  const largeHits = hits.filter((h) => h.size === LARGE_SIZE);
  const smallHits = hits.filter((h) => h.size === SMALL_SIZE);

  return (
    <div className="pd-machine">
      <div className="pd-titlebar">
        <span className={phase === "playing" ? "pd-lamp pd-lamp-busy" : "pd-lamp pd-lamp-ready"} />
        <span className="pd-titletext">POINTING STATION - 1968</span>
        <span className="pd-coords">
          X:{String(Math.round(cursor.x)).padStart(3, "0")} Y:{String(Math.round(cursor.y)).padStart(3, "0")}
        </span>
      </div>

      {/* SCREEN */}
      <div
        className={"pd-area" + (missFlash ? " pd-area-miss" : "")}
        ref={areaRef}
        aria-label="Screen. The cursor here is controlled by the trackpad below."
      >
        {phase === "idle" && (
          <div className="pd-overlay">
            <p className="pd-overlay-title">TARGET PRACTICE</p>
            <p className="pd-overlay-text">
              Use the trackpad below to move the cursor on this screen, then click
              the targets. Moving your hand on one surface to point at another is
              the breakthrough of the mouse.
            </p>
            <button type="button" className="pd-btn" onClick={startTest}>
              Start
            </button>
          </div>
        )}

        {phase === "playing" && target && (
          <span
            className="pd-target"
            style={{
              left: target.x,
              top: target.y,
              width: target.size,
              height: target.size,
            }}
            aria-hidden="true"
          />
        )}

        {phase === "playing" && (
          <svg
            className="pd-cursor"
            style={{ left: cursor.x, top: cursor.y }}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            aria-hidden="true"
          >
            <path
              d="M2 2 L2 17 L6 13 L9 20 L12 19 L9 12 L15 12 Z"
              fill="#f3f4f6"
              stroke="#14161a"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {phase === "playing" && (
          <div className="pd-hud" aria-hidden="true">
            <span>HITS {hits.length}</span>
            <span>MISS {misses}</span>
            <span>LG {avg(largeHits)}ms</span>
            <span>SM {avg(smallHits)}ms</span>
          </div>
        )}
      </div>

      {/* TRACKPAD */}
      <div className="pd-deck">
        <div
          className={"pd-pad" + (pressed ? " pd-pad-active" : "")}
          onPointerDown={padPointerDown}
          onPointerMove={padPointerMove}
          onPointerUp={padPointerUp}
          onPointerLeave={padPointerUp}
          role="button"
          tabIndex={0}
          aria-label="Trackpad. Drag to move the cursor; tap to click."
        >
          <span className="pd-pad-label">
            {phase === "playing" ? "DRAG TO MOVE  -  TAP TO CLICK" : "TRACKPAD"}
          </span>
          {contact && (
            <span
              className="pd-pad-contact"
              style={{ left: contact.x, top: contact.y }}
              aria-hidden="true"
            />
          )}
        </div>

        <button
          type="button"
          className="pd-click-btn"
          disabled={phase !== "playing"}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onClick={registerClick}
        >
          Click
        </button>
      </div>

      {phase === "playing" && (
        <div className="pd-footer">
          <p className="pd-hint">
            {smallHits.length > 0 && largeHits.length > 0 && avg(smallHits) > avg(largeHits)
              }
          </p>
          <button type="button" className="pd-btn pd-btn-small" onClick={startTest}>
            Reset
          </button>
        </div>
      )}

      <style>{`
        .pd-machine {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          background: #3a3f45;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          font-family: Consolas, "Courier New", monospace;
        }

        .pd-titlebar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.6rem 0.9rem;
          background: #2b2b2b;
          color: #9ca3af;
          font-size: 0.78rem;
          letter-spacing: 0.5px;
        }

        .pd-lamp {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .pd-lamp-ready {
          background: #27c93f;
          box-shadow: 0 0 6px rgba(39, 201, 63, 0.8);
        }

        .pd-lamp-busy {
          background: #ffbd2e;
          box-shadow: 0 0 6px rgba(255, 189, 46, 0.8);
        }

        .pd-coords {
          margin-left: auto;
          color: #7dd3fc;
          font-variant-numeric: tabular-nums;
        }

        .pd-area {
          position: relative;
          height: 300px;
          background:
            linear-gradient(rgba(125, 211, 252, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.05) 1px, transparent 1px),
            #14161a;
          background-size: 24px 24px, 24px 24px, auto;
          overflow: hidden;
          transition: background-color 0.18s ease;
        }

        .pd-area-miss {
          background-color: #2a1416;
        }

        .pd-cursor {
          position: absolute;
          pointer-events: none;
          transform: translate(-2px, -2px);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
          z-index: 5;
        }

        .pd-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          padding: 1.2rem 1.6rem;
          text-align: center;
        }

        .pd-overlay-title {
          margin: 0;
          color: #f3f4f6;
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .pd-overlay-text {
          margin: 0;
          max-width: 440px;
          color: #9ca3af;
          font-size: 0.78rem;
          line-height: 1.6;
        }

        .pd-target {
          position: absolute;
          border-radius: 50%;
          background:
            radial-gradient(circle, #14161a 0 18%, #f87171 18% 42%, #14161a 42% 62%, #f87171 62% 100%);
          box-shadow: 0 0 14px rgba(248, 113, 113, 0.55);
          animation: pd-pop 0.16s ease;
        }

        @keyframes pd-pop {
          from { transform: scale(0.4); }
          to { transform: scale(1); }
        }

        .pd-hud {
          position: absolute;
          top: 8px;
          right: 10px;
          display: flex;
          gap: 10px;
          color: #6b7280;
          font-size: 0.68rem;
          letter-spacing: 1px;
          pointer-events: none;
          font-variant-numeric: tabular-nums;
        }

        .pd-deck {
          display: flex;
          gap: 0.8rem;
          align-items: stretch;
          padding: 0.9rem 1rem;
          background: #2b2f34;
        }

        .pd-pad {
          position: relative;
          flex: 1;
          height: 120px;
          border-radius: 10px;
          background: #4a5058;
          border: 2px solid #565d66;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
          cursor: grab;
          touch-action: none;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          user-select: none;
        }

        .pd-pad-active {
          cursor: grabbing;
          background: #525862;
          border-color: #7dd3fc;
        }

        .pd-pad-label {
          color: #9ca3af;
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          pointer-events: none;
        }

        .pd-pad-contact {
          position: absolute;
          width: 26px;
          height: 26px;
          margin: -13px 0 0 -13px;
          border-radius: 50%;
          background: rgba(125, 211, 252, 0.35);
          border: 2px solid #7dd3fc;
          pointer-events: none;
        }

        .pd-click-btn {
          flex-shrink: 0;
          width: 96px;
          border: 2px solid #565d66;
          border-radius: 10px;
          background: #565d66;
          color: #f3f4f6;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 3px 0 #1f2226;
          transition: transform 0.08s ease, background 0.08s ease;
        }

        .pd-click-btn:hover:not(:disabled) {
          background: #6b7380;
        }

        .pd-click-btn:active:not(:disabled) {
          transform: translateY(3px);
          box-shadow: none;
        }

        .pd-click-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pd-footer {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.7rem 1rem;
          background: #23262a;
        }

        .pd-hint {
          margin: 0;
          flex: 1;
          color: #9ca3af;
          font-size: 0.74rem;
          line-height: 1.5;
        }

        .pd-btn {
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.4rem;
          background: #7dd3fc;
          color: #0c2530;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.12s ease;
        }

        .pd-btn:hover {
          transform: translateY(-2px);
        }

        .pd-btn-small {
          padding: 0.45rem 1rem;
          font-size: 0.72rem;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .pd-area {
            height: 240px;
          }

          .pd-pad {
            height: 100px;
          }

          .pd-hud {
            gap: 6px;
            font-size: 0.6rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pd-target {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
