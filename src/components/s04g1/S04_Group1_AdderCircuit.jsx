import { useEffect, useMemo, useRef, useState } from 'react';
import { computeAdderTrace } from '../../lib/s04g1/S04_Group1_aluEngine.js';

const WIDTH = 4;
const STAGE_DELAY_MS = 260; // per-stage highlight delay used only for the ripple animation

function bitsToInt(bits) {
  // bits[0] is the least-significant bit here — index matches bit position.
  return bits.reduce((acc, bit, i) => acc + (bit << i), 0);
}

/** Generate/propagate signals and every carry in the chain, computed however the caller likes. */
function computeCarryChain(aBits, bBits, cin, mode) {
  const a = [...aBits].reverse().join('');
  const b = [...bBits].reverse().join('');
  const trace = computeAdderTrace(a, b, cin, mode === 'lookahead' ? 'CLA' : 'RCA');
  return { g: trace.generate, p: trace.propagate, c: trace.carries, sum: trace.sumBits };
}

function BitSwitch({ bit, index, onToggle, label }) {
  return (
    <button
      type="button"
      className="adder__bit"
      data-on={bit === 1}
      aria-pressed={bit === 1}
      aria-label={`${label} bit ${index}, currently ${bit}`}
      onClick={onToggle}
    >
      {bit}
    </button>
  );
}

export default function S04_Group1_AdderCircuit() {
  const [aBits, setABits] = useState([1, 0, 1, 0]); // LSB → MSB: A = 0101 = 5
  const [bBits, setBBits] = useState([1, 1, 0, 0]); // B = 0011 = 3
  const [cin, setCin] = useState(0);
  const [mode, setMode] = useState('ripple'); // 'ripple' | 'lookahead'
  const [activeStage, setActiveStage] = useState(-1); // -1 = idle, WIDTH = fully settled
  const timeouts = useRef([]);

  const { g, p, c, sum } = useMemo(() => computeCarryChain(aBits, bBits, cin, mode), [aBits, bBits, cin, mode]);

  const aValue = bitsToInt(aBits);
  const bValue = bitsToInt(bBits);
  const sumValue = bitsToInt(sum) + (c[WIDTH] << WIDTH);

  // Replay the propagation animation whenever an input or mode changes.
  useEffect(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setActiveStage(-1);

    if (mode === 'ripple') {
      // Each stage can't resolve its carry-out until the one before it has —
      // so we reveal them one at a time, stage by stage.
      for (let stage = 0; stage <= WIDTH; stage++) {
        const t = setTimeout(() => setActiveStage(stage), (stage + 1) * STAGE_DELAY_MS);
        timeouts.current.push(t);
      }
    } else {
      // Carry-lookahead derives every carry directly from G/P and c0 in parallel —
      // so the whole chain resolves in one step, regardless of width.
      const t = setTimeout(() => setActiveStage(WIDTH), STAGE_DELAY_MS);
      timeouts.current.push(t);
    }

    return () => timeouts.current.forEach(clearTimeout);
  }, [aBits, bBits, cin, mode]);

  const toggleBit = (setter) => (index) => {
    setter((prev) => prev.map((b, i) => (i === index ? (b ? 0 : 1) : b)));
  };

  // Rough, illustrative gate-delay counts — not a specific fabrication's timing,
  // just enough to show *why* lookahead exists: ripple's delay grows with width,
  // lookahead's stays flat.
  const gateDelays = mode === 'ripple' ? WIDTH * 2 : 4;

  return (
    <div className="adder">
      <div className="adder__controls">
        <div className="adder__operand">
          <span className="adder__row-label">A</span>
          <div className="adder__bits">
            {[3, 2, 1, 0].map((i) => (
              <BitSwitch key={i} bit={aBits[i]} index={i} label="A" onToggle={() => toggleBit(setABits)(i)} />
            ))}
          </div>
          <span className="adder__decimal mono-value">= {aValue}</span>
        </div>

        <div className="adder__operand">
          <span className="adder__row-label">B</span>
          <div className="adder__bits">
            {[3, 2, 1, 0].map((i) => (
              <BitSwitch key={i} bit={bBits[i]} index={i} label="B" onToggle={() => toggleBit(setBBits)(i)} />
            ))}
          </div>
          <span className="adder__decimal mono-value">= {bValue}</span>
        </div>

        <div className="adder__cin">
          <span className="adder__row-label">C-in</span>
          <BitSwitch bit={cin} index={0} label="Carry-in" onToggle={() => setCin((v) => (v ? 0 : 1))} />
        </div>

        <div className="adder__mode" role="group" aria-label="Adder circuit type">
          <button
            type="button"
            className="adder__modebtn"
            data-active={mode === 'ripple'}
            aria-pressed={mode === 'ripple'}
            onClick={() => setMode('ripple')}
          >
            Ripple-carry
          </button>
          <button
            type="button"
            className="adder__modebtn"
            data-active={mode === 'lookahead'}
            aria-pressed={mode === 'lookahead'}
            onClick={() => setMode('lookahead')}
          >
            Carry-lookahead
          </button>
        </div>
      </div>

      {/* the carry propagation chain */}
      <div className="adder__chain">
        <div className={`adder__carrynode ${activeStage >= 0 ? 'is-settled' : ''}`}>
          <span className="adder__carrybit mono-value" data-on={cin === 1}>
            {cin}
          </span>
          <span className="adder__carrylabel">c0</span>
        </div>

        {[0, 1, 2, 3].map((stage) => (
          <div className="adder__stage" key={stage}>
            <div className={`adder__wire ${activeStage >= stage ? 'is-live' : ''}`} aria-hidden="true" />
            <div className="adder__fa">
              <span className="adder__fa-label mono-value">FA{stage}</span>
              <span className="adder__gp mono-value">G={g[stage]} P={p[stage]}</span>
              <span className="adder__sumbit mono-value">S{stage}={sum[stage]}</span>
            </div>
            <div
              className={`adder__wire adder__wire--out ${activeStage >= stage + 1 ? 'is-live' : ''}`}
              aria-hidden="true"
            />
            <div className={`adder__carrynode ${activeStage >= stage + 1 ? 'is-settled' : ''}`}>
              <span className="adder__carrybit mono-value" data-on={c[stage + 1] === 1}>
                {activeStage >= stage + 1 ? c[stage + 1] : '?'}
              </span>
              <span className="adder__carrylabel">c{stage + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="adder__result">
        <div>
          <span className="adder__row-label">SUM</span>{' '}
          <span className="mono-value">{sum.slice().reverse().join('')}</span>{' '}
          <span className="adder__decimal mono-value">= {sumValue}</span>
        </div>
        <div className="adder__timing">
          <span className="eyebrow">Simplified gate-delay estimate</span>{' '}
          <span className="mono-value">~{gateDelays}</span>
          {mode === 'ripple' && (
            <span className="adder__timing-note"> — grows with word width</span>
          )}
          {mode === 'lookahead' && (
            <span className="adder__timing-note"> — flat, regardless of word width</span>
          )}
        </div>
      </div>

      <style>{`
        .S04_Group1_exhibit {
        .adder {
          display: flex;
          flex-direction: column;
          container-type: inline-size;
          gap: 1.5rem;
          padding: 1.5rem;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }
        .adder__controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.75rem;
        }
        .adder__operand,
        .adder__cin {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .adder__row-label {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--paper-dim);
          width: 2.4em;
        }
        .adder__bits {
          display: flex;
          gap: 0.3rem;
        }
        .adder__bit {
          width: 1.9rem;
          height: 1.9rem;
          border-radius: var(--radius);
          border: 1px solid var(--border-strong);
          background: var(--bg);
          color: var(--paper-dim);
          font-family: var(--font-mono);
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
        }
        .adder__bit[data-on='true'] {
          background: var(--trace-dim);
          border-color: var(--trace);
          color: var(--trace);
        }
        .adder__decimal {
          font-size: 0.78rem;
          color: var(--paper-dim);
        }
        .adder__mode {
          display: flex;
          gap: 0.4rem;
          margin-left: auto;
        }
        .adder__modebtn {
          padding: 0.4rem 0.7rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.03em;
          background: var(--bg);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius);
          color: var(--paper-dim);
          cursor: pointer;
        }
        .adder__modebtn[data-active='true'] {
          background: var(--trace-dim);
          border-color: var(--trace);
          color: var(--trace);
        }

        .adder__chain {
          display: flex;
          align-items: center;
          overflow-x: auto;
          padding-block: 0.5rem;
        }
        .adder__stage {
          display: flex;
          align-items: center;
          flex: 1 0 auto;
        }
        .adder__wire {
          width: 1.5rem;
          height: 2px;
          background: var(--border-strong);
          transition: background 0.2s ease;
        }
        .adder__wire.is-live {
          background: var(--trace);
        }
        .adder__fa {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          padding: 0.7rem 0.8rem;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius);
          background: var(--panel-raised);
          min-width: 5.5rem;
        }
        .adder__fa-label {
          font-size: 0.85rem;
          color: var(--paper);
        }
        .adder__gp,
        .adder__sumbit {
          font-size: 0.72rem;
          color: var(--paper-dim);
        }
        .adder__carrynode {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          opacity: 0.4;
          transition: opacity 0.2s ease;
        }
        .adder__carrynode.is-settled {
          opacity: 1;
        }
        .adder__carrybit {
          width: 1.7rem;
          height: 1.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border-strong);
          font-size: 0.8rem;
          color: var(--paper-dim);
        }
        .adder__carrybit[data-on='true'] {
          border-color: var(--carry);
          color: var(--carry);
          box-shadow: 0 0 6px var(--carry);
        }
        .adder__carrylabel {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--paper-dim);
        }

        .adder__result {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
          font-size: 0.85rem;
        }
        .adder__timing-note {
          color: var(--paper-dim);
          font-size: 0.78rem;
        }

        @media (max-width: 640px) {
          .adder__mode {
            margin-left: 0;
          }
        }
        @container (max-width: 640px) {
          .adder__mode {
            margin-left: 0;
          }
        }
        }
      `}</style>
    </div>
  );
}
