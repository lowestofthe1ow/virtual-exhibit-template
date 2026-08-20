import { useMemo, useState } from 'react';
import {
  computeALU,
  OPERATIONS,
  resolveWidth,
  validateBinary,
  WIDTH_OPTIONS,
} from '../../lib/s04g1/S04_Group1_aluEngine.js';

const OP_META = {
  ADD: { symbol: '+', category: 'arithmetic' },
  SUB: { symbol: '−', category: 'arithmetic' },
  AND: { symbol: '∧', category: 'logic' },
  OR: { symbol: '∨', category: 'logic' },
  XOR: { symbol: '⊕', category: 'logic' },
  NOT: { symbol: '¬', category: 'logic' },
  SHL: { symbol: '≪', category: 'shift' },
  SHR: { symbol: '≫', category: 'shift' },
};

function BinaryField({ id, label, value, error, disabled = false, onChange }) {
  return (
    <label className="alu-sim__field" htmlFor={id}>
      <span className="alu-sim__row-label">Operand {label}</span>
      <input
        id={id}
        className="alu-sim__input mono-value"
        value={value}
        inputMode="numeric"
        spellCheck="false"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <span id={`${id}-error`} className="alu-sim__error" role="alert">{error}</span>}
    </label>
  );
}

function BitRow({ label, value, disabled = false, onToggle }) {
  return (
    <div className="alu-sim__bit-row">
      <span className="alu-sim__row-label">{label}</span>
      <div className="alu-sim__bits" role="group" aria-label={`${label}, most significant bit first`}>
        {[...value].map((bit, index) => {
          const position = value.length - index - 1;
          return (
            <button
              key={`${label}-${position}`}
              type="button"
              className="alu-sim__bit"
              data-on={bit === '1'}
              aria-label={`${label} bit ${position}, currently ${bit}`}
              aria-pressed={bit === '1'}
              disabled={disabled}
              onClick={() => onToggle?.(index)}
            >
              {bit}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TraceTable({ result }) {
  const trace = result.trace;
  if (!trace) return null;
  return (
    <section className="alu-sim__trace-panel" aria-labelledby="alu-trace-title">
      <div className="alu-sim__trace-head">
        <div>
          <h3 id="alu-trace-title">{result.mode === 'CLA' ? 'Carry lookahead trace' : 'Ripple carry trace'}</h3>
          <p>
            G = A AND B-effective; P = A OR B-effective. Sum always uses A XOR B-effective XOR C-in.
          </p>
        </div>
        <div className="mono-value alu-sim__effective">
          <span>B-effective = {result.effectiveB}</span>
          <span>C0 = {result.initialCarry}</span>
        </div>
      </div>
      <div className="alu-sim__table-wrap" tabIndex="0" aria-label="Scrollable per-bit adder trace">
        <table className="alu-sim__table">
          <thead><tr><th>Bit (LSB first)</th><th>A</th><th>B-effective</th><th>G</th><th>P</th><th>C-in</th><th>Sum</th><th>C-out</th><th>Carry derivation</th></tr></thead>
          <tbody>
            {trace.stages.map((stage) => (
              <tr key={stage.bit}>
                <td>{stage.bit}</td><td>{stage.aBit}</td><td>{stage.bBit}</td><td>{stage.generate}</td><td>{stage.propagate}</td>
                <td>{stage.carryIn}</td><td>{stage.sumBit}</td><td>{stage.carryOut}</td>
                <td className="alu-sim__formula">{result.mode === 'CLA' ? stage.expression : `C${stage.bit + 1} = G${stage.bit} OR (P${stage.bit} AND C${stage.bit})`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="alu-sim__timing">
        {result.mode === 'CLA'
          ? 'CLA derives every carry from an expanded G/P expression in parallel; extra gates and wiring reduce carry-path depth.'
          : `RCA sends each carry into the next full adder, so worst-case delay grows across all ${result.width} stages.`}
        {' '}Final carry: <strong className="mono-value">{trace.finalCarry}</strong>
      </p>
    </section>
  );
}

export default function S04_Group1_ALUSimulator() {
  const [aInput, setAInput] = useState('0101');
  const [bInput, setBInput] = useState('0011');
  const [widthMode, setWidthMode] = useState('auto');
  const [operation, setOperation] = useState('ADD');
  const [mode, setMode] = useState('RCA');
  const unary = ['NOT', 'SHL', 'SHR'].includes(operation);
  const selectedWidth = resolveWidth(aInput, unary ? '' : bInput, widthMode);
  const aError = validateBinary(aInput, 'Operand A', widthMode);
  const bError = unary ? '' : validateBinary(bInput, 'Operand B', widthMode);
  const valid = !aError && !bError;
  const result = useMemo(() => {
    if (!valid) return null;
    return computeALU({ operation, aInput, bInput: bInput || '0', width: widthMode, mode });
  }, [aInput, bInput, mode, operation, valid, widthMode]);

  const toggleBit = (operand, index) => {
    if (!result) return;
    const source = operand === 'A' ? result.paddedA : result.paddedB;
    const next = [...source];
    next[index] = next[index] === '1' ? '0' : '1';
    (operand === 'A' ? setAInput : setBInput)(next.join(''));
  };

  return (
    <div className="alu-sim">
      <div className="alu-sim__controls">
        <div className="alu-sim__inputs">
          <BinaryField id="alu-a" label="A" value={aInput} error={aError} onChange={setAInput} />
          <span className="alu-sim__decimal mono-value">{result ? `Unsigned decimal: ${result.aValue}` : '—'}</span>
          <BinaryField id="alu-b" label="B" value={bInput} error={bError} disabled={unary} onChange={setBInput} />
          <span className="alu-sim__decimal mono-value">{unary ? 'Unused by this unary operation' : result ? `Unsigned decimal: ${result.bValue}` : '—'}</span>
        </div>

        <div className="alu-sim__selector-block">
          <span className="alu-sim__row-label">Operation</span>
          <div className="alu-sim__opcodes" role="group" aria-label="ALU operation">
            {OPERATIONS.map((op) => <button key={op} type="button" data-active={operation === op} data-category={OP_META[op].category} aria-pressed={operation === op} onClick={() => setOperation(op)}>{op}</button>)}
          </div>
        </div>

        <div className="alu-sim__selector-block">
          <span className="alu-sim__row-label">Word width</span>
          <div className="alu-sim__segmented" role="group" aria-label="Word width">
            {WIDTH_OPTIONS.map((width) => <button key={width} type="button" data-active={widthMode === width} aria-pressed={widthMode === width} onClick={() => setWidthMode(width)}>{width === 'auto' ? 'Auto' : width}</button>)}
          </div>
          <span className="alu-sim__width-note mono-value">Rendering {selectedWidth} bit{selectedWidth === 1 ? '' : 's'}</span>
        </div>

        {(operation === 'ADD' || operation === 'SUB') && (
          <div className="alu-sim__selector-block">
            <span className="alu-sim__row-label">Adder architecture</span>
            <div className="alu-sim__segmented" role="group" aria-label="Adder architecture">
              {['RCA', 'CLA'].map((candidate) => <button key={candidate} type="button" data-active={mode === candidate} aria-pressed={mode === candidate} onClick={() => setMode(candidate)}>{candidate === 'RCA' ? 'Ripple carry' : 'Carry lookahead'}</button>)}
            </div>
          </div>
        )}
      </div>

      {result ? (
        <>
          <section className="alu-sim__workbench" aria-label="Interactive operand bits">
            <BitRow label="A" value={result.paddedA} onToggle={(index) => toggleBit('A', index)} />
            <BitRow label="B" value={result.paddedB} disabled={unary} onToggle={(index) => toggleBit('B', index)} />
            {operation === 'SUB' && <BitRow label="~B" value={result.effectiveB} disabled />}
          </section>

          <section className="alu-sim__readout" aria-live="polite">
            <div className="alu-sim__result-copy">
              <span className="eyebrow">{operation} result · {selectedWidth}-bit</span>
              <strong className="alu-sim__result-binary mono-value">{result.resultBinary}</strong>
              <span className="mono-value">Decimal {result.decimal} · Hex {result.hexadecimal}</span>
            </div>
            <div className="alu-sim__flags" aria-label="Status flags">
              {Object.entries(result.flags).map(([flag, active]) => <div className="alu-sim__flag" key={flag}><span className="alu-sim__led" data-on={active} /><span className="mono-value">{flag}={active ? 1 : 0}</span></div>)}
            </div>
            {result.warnings.map((warning) => <p className="alu-sim__warning" key={warning}>{warning}</p>)}
            {operation === 'SUB' && <p className="alu-sim__note">For SUB, C is the no-borrow flag ({result.borrow ? 'borrow occurred' : 'no borrow'}); it is not an overflow warning. V separately reports signed overflow.</p>}
          </section>
          <TraceTable result={result} />
        </>
      ) : <div className="alu-sim__invalid" role="alert">Fix the highlighted input to run the ALU.</div>}

      <style>{`
        .S04_Group1_exhibit {
        .alu-sim{display:grid;gap:1rem;container-type:inline-size}.alu-sim__controls,.alu-sim__workbench,.alu-sim__readout,.alu-sim__trace-panel,.alu-sim__invalid{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem}.alu-sim__controls{display:grid;grid-template-columns:minmax(240px,1.2fr) repeat(3,minmax(180px,1fr));gap:1.25rem}.alu-sim__inputs{display:grid;grid-template-columns:1fr auto;gap:.4rem .75rem}.alu-sim__field{display:grid;gap:.4rem}.alu-sim__input{width:100%;min-width:0;background:var(--bg);border:1px solid var(--border-strong);border-radius:var(--radius);color:var(--paper);padding:.65rem .75rem}.alu-sim__input[aria-invalid=true]{border-color:var(--carry)}.alu-sim__input:disabled{opacity:.45}.alu-sim__error{color:var(--carry);font-size:.78rem}.alu-sim__decimal,.alu-sim__width-note{align-self:end;color:var(--paper-dim);font-size:.72rem}.alu-sim__row-label{font-family:var(--font-label);text-transform:uppercase;letter-spacing:.1em;font-size:.72rem;color:var(--paper-dim)}.alu-sim__selector-block{display:flex;flex-direction:column;gap:.55rem}.alu-sim__opcodes{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem}.alu-sim__segmented{display:flex;flex-wrap:wrap;gap:.35rem}.alu-sim__opcodes button,.alu-sim__segmented button{min-height:2.5rem;padding:.45rem .6rem;background:var(--bg);border:1px solid var(--border-strong);border-radius:var(--radius);color:var(--paper-dim);font-family:var(--font-mono);cursor:pointer}.alu-sim button[data-active=true]{background:var(--trace-dim);border-color:var(--trace);color:var(--trace)}.alu-sim__workbench{display:grid;gap:.75rem}.alu-sim__bit-row{display:grid;grid-template-columns:3.5rem minmax(0,1fr);align-items:center;gap:.75rem}.alu-sim__bits{display:flex;gap:.35rem;overflow-x:auto;padding:.15rem}.alu-sim__bit{flex:0 0 2.35rem;width:2.35rem;height:2.35rem;background:var(--bg);border:1px solid var(--border-strong);border-radius:var(--radius);color:var(--paper-dim);font-family:var(--font-mono);cursor:pointer}.alu-sim__bit[data-on=true]{background:var(--trace-dim);border-color:var(--trace);color:var(--trace)}.alu-sim__bit:disabled{cursor:not-allowed;opacity:.55}.alu-sim__readout{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1rem;align-items:center}.alu-sim__result-copy{display:flex;flex-direction:column;gap:.35rem;min-width:0}.alu-sim__result-binary{color:var(--trace);font-size:clamp(1.25rem,3vw,2rem);overflow-x:auto;white-space:nowrap}.alu-sim__flags{display:flex;flex-wrap:wrap;gap:.8rem}.alu-sim__flag{display:flex;align-items:center;gap:.35rem;font-size:.8rem}.alu-sim__led{width:.65rem;height:.65rem;border-radius:50%;background:var(--border-strong)}.alu-sim__led[data-on=true]{background:var(--carry);box-shadow:0 0 7px var(--carry)}.alu-sim__warning,.alu-sim__note{grid-column:1/-1;margin:0!important;font-size:.85rem}.alu-sim__warning{color:var(--carry)!important}.alu-sim__trace-head{display:flex;justify-content:space-between;gap:1rem}.alu-sim__trace-head h3{font-size:1rem}.alu-sim__trace-head p,.alu-sim__timing{font-size:.85rem;margin-bottom:.75rem}.alu-sim__effective{display:flex;flex-direction:column;align-items:flex-end;color:var(--trace);font-size:.78rem;overflow-wrap:anywhere}.alu-sim__table-wrap{overflow-x:auto}.alu-sim__table{width:100%;min-width:900px;border-collapse:collapse;font-family:var(--font-mono);font-size:.78rem}.alu-sim__table th,.alu-sim__table td{border:1px solid var(--border);padding:.45rem;text-align:center}.alu-sim__table th{color:var(--trace)}.alu-sim__formula{text-align:left!important;white-space:nowrap}.alu-sim__timing{margin:.75rem 0 0!important}.alu-sim__invalid{color:var(--carry);font-family:var(--font-mono)}
        @media(max-width:1050px){.alu-sim__controls{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.alu-sim__controls{grid-template-columns:1fr}.alu-sim__inputs{grid-template-columns:1fr}.alu-sim__decimal{margin-bottom:.5rem}.alu-sim__readout{grid-template-columns:1fr}.alu-sim__trace-head{flex-direction:column}.alu-sim__effective{align-items:flex-start}.alu-sim__bit-row{grid-template-columns:1fr}.alu-sim__opcodes{grid-template-columns:repeat(4,minmax(0,1fr))}}
        @container(max-width:1050px){.alu-sim__controls{grid-template-columns:repeat(2,minmax(0,1fr))}}@container(max-width:650px){.alu-sim__controls{grid-template-columns:1fr}.alu-sim__inputs{grid-template-columns:1fr}.alu-sim__decimal{margin-bottom:.5rem}.alu-sim__readout{grid-template-columns:1fr}.alu-sim__trace-head{flex-direction:column}.alu-sim__effective{align-items:flex-start}.alu-sim__bit-row{grid-template-columns:1fr}.alu-sim__opcodes{grid-template-columns:repeat(4,minmax(0,1fr))}}
        }
      `}</style>
      <style>{`
        .S04_Group1_exhibit .alu-sim {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          display: grid;
          gap: clamp(0.75rem, 2cqw, 1rem);
          container-type: inline-size;
        }

        .S04_Group1_exhibit .alu-sim__controls,
        .S04_Group1_exhibit .alu-sim__workbench,
        .S04_Group1_exhibit .alu-sim__readout,
        .S04_Group1_exhibit .alu-sim__trace-panel,
        .S04_Group1_exhibit .alu-sim__invalid {
          width: 100%;
          min-width: 0;
          padding: clamp(0.9rem, 2.5cqw, 1.4rem);
          border: 1px solid var(--border);
          border-radius: calc(var(--radius) + 3px);
          background:
            linear-gradient(145deg, rgba(20, 28, 43, 0.92), rgba(8, 15, 25, 0.96));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .S04_Group1_exhibit .alu-sim__controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(17rem, 100%), 1fr));
          align-items: stretch;
          gap: 0.85rem;
        }

        .S04_Group1_exhibit .alu-sim__inputs,
        .S04_Group1_exhibit .alu-sim__selector-block {
          min-width: 0;
          padding: 1rem;
          border: 1px solid rgba(43, 61, 92, 0.72);
          border-radius: var(--radius);
          background: rgba(2, 6, 15, 0.48);
        }

        .S04_Group1_exhibit .alu-sim__inputs {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          align-content: start;
          gap: 0.4rem;
        }

        .S04_Group1_exhibit .alu-sim__selector-block {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .S04_Group1_exhibit .alu-sim__field {
          min-width: 0;
          display: grid;
          gap: 0.4rem;
        }

        .S04_Group1_exhibit .alu-sim__input {
          width: 100%;
          min-width: 0;
          min-height: 2.75rem;
          padding: 0.65rem 0.75rem;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius);
          background: rgba(2, 6, 15, 0.9);
          color: var(--paper);
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .S04_Group1_exhibit .alu-sim__input:focus {
          border-color: var(--trace);
          box-shadow: 0 0 0 3px rgba(0, 230, 168, 0.12);
        }

        .S04_Group1_exhibit .alu-sim__input[aria-invalid='true'] {
          border-color: var(--carry);
          box-shadow: 0 0 0 3px rgba(255, 94, 58, 0.1);
        }

        .S04_Group1_exhibit .alu-sim__decimal,
        .S04_Group1_exhibit .alu-sim__width-note {
          max-width: 100%;
          margin: 0 0 0.45rem;
          color: var(--paper-dim);
          font-size: 0.7rem;
          overflow-wrap: anywhere;
        }

        .S04_Group1_exhibit .alu-sim__row-label {
          color: #8fa5bd;
          font-family: var(--font-label);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .S04_Group1_exhibit .alu-sim__opcodes {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.4rem;
        }

        .S04_Group1_exhibit .alu-sim__segmented {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(3.4rem, 1fr));
          gap: 0.4rem;
        }

        .S04_Group1_exhibit .alu-sim__segmented[aria-label='Adder architecture'] {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .S04_Group1_exhibit .alu-sim__opcodes button,
        .S04_Group1_exhibit .alu-sim__segmented button {
          width: 100%;
          min-width: 0;
          min-height: 2.65rem;
          padding: 0.5rem 0.4rem;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius);
          background: rgba(2, 6, 15, 0.78);
          color: var(--paper-dim);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          line-height: 1.2;
          white-space: normal;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }

        .S04_Group1_exhibit .alu-sim__opcodes button:hover,
        .S04_Group1_exhibit .alu-sim__segmented button:hover {
          border-color: #466181;
          color: var(--paper);
          transform: translateY(-1px);
        }

        .S04_Group1_exhibit .alu-sim button[data-active='true'] {
          border-color: var(--trace);
          background: linear-gradient(180deg, rgba(0, 74, 55, 0.95), rgba(0, 51, 39, 0.95));
          color: #8fffe1;
          box-shadow: inset 0 0 0 1px rgba(0, 230, 168, 0.12), 0 0 12px rgba(0, 230, 168, 0.08);
        }

        .S04_Group1_exhibit .alu-sim__workbench {
          display: grid;
          gap: 0.75rem;
        }

        .S04_Group1_exhibit .alu-sim__bit-row {
          min-width: 0;
          display: grid;
          grid-template-columns: 2.5rem minmax(0, 1fr);
          align-items: center;
          gap: 0.65rem;
        }

        .S04_Group1_exhibit .alu-sim__bits {
          width: 100%;
          min-width: 0;
          display: flex;
          gap: 0.35rem;
          padding: 0.2rem 0.2rem 0.55rem;
          overflow-x: auto;
          overscroll-behavior-inline: contain;
          scrollbar-color: var(--border-strong) transparent;
          scrollbar-width: thin;
        }

        .S04_Group1_exhibit .alu-sim__bit {
          flex: 0 0 2.2rem;
          width: 2.2rem;
          height: 2.2rem;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius);
          background: rgba(2, 6, 15, 0.84);
          color: var(--paper-dim);
          font-family: var(--font-mono);
          cursor: pointer;
        }

        .S04_Group1_exhibit .alu-sim__bit:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .S04_Group1_exhibit .alu-sim__readout {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem 1.5rem;
        }

        .S04_Group1_exhibit .alu-sim__result-copy {
          flex: 1 1 18rem;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .S04_Group1_exhibit .alu-sim__result-copy > span:last-child {
          color: #9aadc2;
          overflow-wrap: anywhere;
        }

        .S04_Group1_exhibit .alu-sim__result-binary {
          display: block;
          max-width: 100%;
          padding-bottom: 0.25rem;
          color: var(--trace);
          font-size: clamp(1.15rem, 5cqw, 2rem);
          line-height: 1.25;
          white-space: nowrap;
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .S04_Group1_exhibit .alu-sim__flags {
          flex: 0 1 auto;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .S04_Group1_exhibit .alu-sim__flag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          min-height: 2rem;
          padding: 0.35rem 0.55rem;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: rgba(2, 6, 15, 0.6);
          font-size: 0.75rem;
        }

        .S04_Group1_exhibit .alu-sim__warning,
        .S04_Group1_exhibit .alu-sim__note {
          flex: 1 0 100%;
          max-width: 100%;
          margin: 0 !important;
          font-size: 0.82rem;
        }

        .S04_Group1_exhibit .alu-sim__trace-head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem 1.5rem;
        }

        .S04_Group1_exhibit .alu-sim__trace-head > div:first-child {
          flex: 1 1 22rem;
          min-width: 0;
        }

        .S04_Group1_exhibit .alu-sim__effective {
          flex: 1 1 12rem;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: var(--trace);
          font-size: 0.72rem;
          overflow-wrap: anywhere;
        }

        .S04_Group1_exhibit .alu-sim__table-wrap {
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overscroll-behavior-inline: contain;
          scrollbar-color: var(--border-strong) transparent;
          scrollbar-width: thin;
        }

        .S04_Group1_exhibit .alu-sim__table {
          margin: 0;
        }

        @container (max-width: 560px) {
          .S04_Group1_exhibit .alu-sim__controls,
          .S04_Group1_exhibit .alu-sim__workbench,
          .S04_Group1_exhibit .alu-sim__readout,
          .S04_Group1_exhibit .alu-sim__trace-panel,
          .S04_Group1_exhibit .alu-sim__invalid {
            padding: 0.8rem;
          }

          .S04_Group1_exhibit .alu-sim__inputs,
          .S04_Group1_exhibit .alu-sim__selector-block {
            padding: 0.8rem;
          }

          .S04_Group1_exhibit .alu-sim__bit-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 0.35rem;
          }

          .S04_Group1_exhibit .alu-sim__flags {
            width: 100%;
          }

          .S04_Group1_exhibit .alu-sim__effective {
            align-items: flex-start;
          }
        }

        @container (max-width: 380px) {
          .S04_Group1_exhibit .alu-sim__opcodes {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
