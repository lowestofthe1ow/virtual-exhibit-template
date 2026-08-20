import { useEffect, useRef, useState } from "react";

const ROWS = [12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // top to bottom
const NUM_COLS = 40; 

const HOLLERITH = (() => {
  const map = { " ": [] };
  for (let d = 0; d <= 9; d++) map[String(d)] = [d];
  "ABCDEFGHI".split("").forEach((ch, i) => (map[ch] = [12, i + 1]));
  "JKLMNOPQR".split("").forEach((ch, i) => (map[ch] = [11, i + 1]));
  "STUVWXYZ".split("").forEach((ch, i) => (map[ch] = [0, i + 2]));
  Object.assign(map, {
    "-": [11],
    "&": [12],
    ".": [12, 3, 8],
    ",": [0, 3, 8],
    "$": [11, 3, 8],
    "*": [11, 4, 8],
    "/": [0, 1],
    "=": [6, 8],
  });
  return map;
})();

const KEYPAD_KEYS = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  ..."0123456789".split(""),
  "-", "&", ".", ",", "$", "*", "/", "=",
];

export default function PunchCardSimulator() {
  // punches[i] = { char, rows } for column i
  const [punches, setPunches] = useState([]);
  const [status, setStatus] = useState("READY. TYPE TO PUNCH.");
  const [batchPhase, setBatchPhase] = useState("idle"); // idle | queued | reading | processing | done
  const [printout, setPrintout] = useState(null);
  const [jobNumber, setJobNumber] = useState(1);

  const timersRef = useRef([]);
  const wrapperRef = useRef(null);

  // Clear any pending batch timers on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const busy = batchPhase !== "idle" && batchPhase !== "done";
  const cardFull = punches.length >= NUM_COLS;

  function punchChar(rawChar) {
    if (busy) return;
    const ch = rawChar.toUpperCase();
    const rows = HOLLERITH[ch];

    if (rows === undefined) {
      setStatus(`NO KEY FOR '${ch}' ON THIS KEYPUNCH.`);
      return;
    }
    if (cardFull) {
      setStatus("CARD FULL. SUBMIT IT OR TAKE A NEW CARD.");
      return;
    }

    setPunches((prev) => [...prev, { char: ch, rows }]);
    setStatus(
      ch === " "
        ? "SPACE - COLUMN SKIPPED (NO HOLES)."
        : `PUNCHED '${ch}' -> ROWS [${rows.join(", ")}]`
    );
  }

  function handleKeyDown(event) {
    if (event.key === "Backspace") {
      event.preventDefault();
      setStatus("NO BACKSPACE! A KEYPUNCH CANNOT UN-PUNCH A HOLE. TAKE A NEW CARD.");
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      submitToBatch();
      return;
    }
    if (event.key.length === 1) {
      event.preventDefault(); // stop space from scrolling the page
      punchChar(event.key);
    }
  }

  function newCard() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPunches([]);
    setPrintout(null);
    setBatchPhase("idle");
    setStatus("FRESH CARD LOADED. TYPE TO PUNCH.");
  }

  function submitToBatch() {
    if (busy) return;
    if (punches.length === 0) {
      setStatus("BLANK CARD - NOTHING TO SUBMIT.");
      return;
    }

    const text = punches.map((p) => p.char).join("");
    setPrintout(null);
    setBatchPhase("queued");
    setStatus("CARD SUBMITTED. WAITING IN THE BATCH QUEUE...");

    const schedule = (fn, ms) => timersRef.current.push(setTimeout(fn, ms));

    schedule(() => {
      setBatchPhase("reading");
      setStatus("CARD READER: READING HOLES COLUMN BY COLUMN...");
    }, 1200);

    schedule(() => {
      setBatchPhase("processing");
      setStatus("PROCESSOR: RUNNING JOB...");
    }, 2400);

    schedule(() => {
      setBatchPhase("done");
      setStatus("LINE PRINTER: JOB COMPLETE. COLLECT YOUR PRINTOUT.");
      setPrintout({
        job: jobNumber,
        cols: punches.length,
        text,
      });
      setJobNumber((n) => n + 1);
    }, 3600);
  }

  function focusCard() {
    wrapperRef.current?.focus();
  }

  return (
    <div
      className="pc-machine"
      ref={wrapperRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={focusCard}
      aria-label="Interactive keypunch machine. Type characters to punch them onto the card."
    >
      <div className="pc-titlebar">
        <span className={busy ? "pc-lamp pc-lamp-busy" : "pc-lamp pc-lamp-ready"} />
        <span className="pc-titletext">KEYPUNCH STATION - 1940s</span>
        <span className="pc-colcount">
          COL {String(Math.min(punches.length + 1, NUM_COLS)).padStart(2, "0")} / {NUM_COLS}
        </span>
      </div>

      {/* Card bed */}
      <div className="pc-bed">
        <div className="pc-card">
          {/* interpreted print line: the typed characters along the top edge */}
          <div className="pc-printline" aria-hidden="true">
            {Array.from({ length: NUM_COLS }).map((_, c) => (
              <span key={c} className={c === punches.length && !cardFull ? "pc-printcell pc-current" : "pc-printcell"}>
                {punches[c]?.char ?? ""}
              </span>
            ))}
          </div>

          {ROWS.map((row) => (
            <div className="pc-row" key={row}>
              <span className="pc-rowlabel" aria-hidden="true">
                {row}
              </span>
              {Array.from({ length: NUM_COLS }).map((_, c) => {
                const punched = punches[c]?.rows.includes(row);
                return (
                  <span
                    key={c}
                    className={punched ? "pc-cell pc-punched" : "pc-cell"}
                    aria-hidden="true"
                  >
                    {punched ? "" : row <= 9 ? row : ""}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="pc-status" role="status">
        {status}
      </div>

      {/* On-screen keypad (also works with a physical keyboard) */}
      <div className="pc-keypad" aria-label="Keypunch keyboard">
        {KEYPAD_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="pc-key"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              punchChar(key);
              focusCard();
            }}
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          className="pc-key pc-key-space"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            punchChar(" ");
            focusCard();
          }}
        >
          SPACE
        </button>
      </div>

      <div className="pc-controls">
        <button type="button" className="pc-btn pc-btn-secondary" onClick={newCard}>
          New card
        </button>
        <button
          type="button"
          className="pc-btn pc-btn-primary"
          onClick={submitToBatch}
          disabled={busy || punches.length === 0}
        >
          {busy ? "Processing..." : "Submit to batch"}
        </button>
      </div>

      {/* Batch progress strip */}
      {batchPhase !== "idle" && (
        <div className="pc-batch-strip" aria-hidden="true">
          <span className={batchPhase === "queued" ? "pc-stage pc-stage-active" : "pc-stage pc-stage-done"}>
            QUEUE
          </span>
          <span className="pc-stage-arrow">&#8594;</span>
          <span
            className={
              batchPhase === "reading"
                ? "pc-stage pc-stage-active"
                : batchPhase === "queued"
                ? "pc-stage"
                : "pc-stage pc-stage-done"
            }
          >
            CARD READER
          </span>
          <span className="pc-stage-arrow">&#8594;</span>
          <span
            className={
              batchPhase === "processing"
                ? "pc-stage pc-stage-active"
                : batchPhase === "done"
                ? "pc-stage pc-stage-done"
                : "pc-stage"
            }
          >
            PROCESSOR
          </span>
          <span className="pc-stage-arrow">&#8594;</span>
          <span className={batchPhase === "done" ? "pc-stage pc-stage-done" : "pc-stage"}>
            PRINTER
          </span>
        </div>
      )}

      {/* Line printer output */}
      {printout && (
        <div className="pc-printout" aria-label="Line printer output">
          <div className="pc-printout-line">*** JOB {String(printout.job).padStart(4, "0")} ***</div>
          <div className="pc-printout-line">READ 1 CARD ({printout.cols} COLUMNS PUNCHED)</div>
          <div className="pc-printout-line">OUTPUT:</div>
          <div className="pc-printout-line pc-printout-result">&gt;&gt; {printout.text}</div>
          <div className="pc-printout-line">*** END OF JOB ***</div>
          <p className="pc-printout-note">
            In a real 1940s-50s computer center, this printout could take hours or even a
            day to come back. One mistyped column meant re-punching the card and waiting again.
          </p>
        </div>
      )}

      <style>{`
        .pc-machine {
          max-width: 600px;
          margin: 0 auto;
          background: #3a3f45;
          border-radius: 10px;
          padding-bottom: 1rem;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          font-family: Consolas, "Courier New", monospace;
          outline: none;
        }

        .pc-machine:focus-visible {
          outline: 3px solid #d9dce1;
          outline-offset: 3px;
        }

        .pc-titlebar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.6rem 0.9rem;
          background: #2b2b2b;
          border-radius: 10px 10px 0 0;
          color: #9ca3af;
          font-size: 0.78rem;
          letter-spacing: 0.5px;
        }

        .pc-lamp {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .pc-lamp-ready {
          background: #27c93f;
          box-shadow: 0 0 6px rgba(39, 201, 63, 0.8);
        }

        .pc-lamp-busy {
          background: #ffbd2e;
          box-shadow: 0 0 6px rgba(255, 189, 46, 0.8);
          animation: pc-lamp-blink 0.7s steps(2, start) infinite;
        }

        @keyframes pc-lamp-blink {
          50% { opacity: 0.25; }
        }

        .pc-colcount {
          margin-left: auto;
        }

        .pc-bed {
          padding: 1rem;
          overflow-x: auto;
          background: #23262a;
        }

        .pc-card {
          width: max-content;
          background: #e9dcb4;
          color: #6b5f3f;
          padding: 6px 10px 8px;
          border-radius: 3px;
          clip-path: polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 14px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
        }

        .pc-printline {
          display: flex;
          margin: 2px 0 4px 22px;
          border-bottom: 1px dashed rgba(107, 95, 63, 0.4);
        }

        .pc-printcell {
          width: 12px;
          height: 12px;
          font-size: 9px;
          font-weight: 700;
          text-align: center;
          color: #4a4028;
        }

        .pc-printcell.pc-current {
          background: rgba(107, 95, 63, 0.18);
        }

        .pc-row {
          display: flex;
          align-items: center;
        }

        .pc-rowlabel {
          width: 22px;
          font-size: 8px;
          font-weight: 700;
          text-align: left;
          opacity: 0.7;
        }

        .pc-cell {
          width: 12px;
          height: 13px;
          font-size: 6px;
          line-height: 13px;
          text-align: center;
          opacity: 0.55;
        }

        .pc-cell.pc-punched {
          opacity: 1;
          background:
            linear-gradient(#111, #111) center / 6px 9px no-repeat;
        }

        .pc-status {
          margin: 0.7rem 1rem 0;
          padding: 0.5rem 0.7rem;
          background: #14161a;
          color: #7dd3fc;
          font-size: 0.78rem;
          letter-spacing: 0.5px;
          border-radius: 6px;
          min-height: 1.2em;
        }

        .pc-keypad {
          display: grid;
          grid-template-columns: repeat(11, 1fr);
          gap: 5px;
          padding: 0.8rem 1rem 0;
        }

        .pc-key {
          border: none;
          border-radius: 5px;
          padding: 0.35rem 0;
          background: #565d66;
          color: #f3f4f6;
          font-family: inherit;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 0 #1f2226;
          transition: transform 0.08s ease, background 0.08s ease;
        }

        .pc-key:hover:not(:disabled) {
          background: #6b7380;
        }

        .pc-key:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: none;
        }

        .pc-key:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pc-key-space {
          grid-column: span 11;
        }

        .pc-controls {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          padding: 0.8rem 1rem 0;
        }

        .pc-btn {
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.12s ease, background 0.12s ease;
        }

        .pc-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .pc-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pc-btn-secondary {
          background: #9ca3af;
          color: #111;
        }

        .pc-btn-primary {
          background: #e9dcb4;
          color: #3b331d;
        }

        .pc-batch-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0.8rem 1rem 0;
          padding: 0.5rem;
          background: #23262a;
          border-radius: 6px;
          font-size: 0.68rem;
          letter-spacing: 0.5px;
        }

        .pc-stage {
          color: #6b7280;
          font-weight: 700;
        }

        .pc-stage-active {
          color: #ffbd2e;
        }

        .pc-stage-done {
          color: #27c93f;
        }

        .pc-stage-arrow {
          color: #4b5563;
        }

        .pc-printout {
          margin: 0.9rem 1rem 0;
          padding: 0.9rem 1rem;
          border-radius: 4px;
          color: #1f2937;
          font-size: 0.82rem;
          line-height: 1.8;
          background: repeating-linear-gradient(
            #ffffff,
            #ffffff 1.8em,
            #e4f2e4 1.8em,
            #e4f2e4 3.6em
          );
          border-left: 10px dotted #cfd6cf;
          border-right: 10px dotted #cfd6cf;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
        }

        .pc-printout-line {
          white-space: pre-wrap;
          word-break: break-word;
          font-weight: 700;
        }

        .pc-printout-result {
          font-size: 0.95rem;
        }

        .pc-printout-note {
          margin: 0.6rem 0 0;
          font-size: 0.72rem;
          font-weight: 400;
          font-style: italic;
          color: #4b5563;
        }

        @media (max-width: 600px) {
          .pc-keypad {
            grid-template-columns: repeat(9, 1fr);
          }

          .pc-key-space {
            grid-column: span 9;
          }

          .pc-key {
            font-size: 0.72rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pc-lamp-busy {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
