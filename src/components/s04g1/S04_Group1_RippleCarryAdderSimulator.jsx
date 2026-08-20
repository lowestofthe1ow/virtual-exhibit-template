import { Fragment, useEffect, useMemo, useState } from 'react';
import { computeALU, normalizeBinary, validateBinary } from '../../lib/s04g1/S04_Group1_aluEngine.js';

function BinaryInput({ id, label, value, error, onChange }) {
  return <label className="rca__field" htmlFor={id}><span className="rca__label">{label}</span><input id={id} className="rca__input mono-value" value={value} inputMode="numeric" spellCheck="false" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)} />{error && <span id={`${id}-error`} className="rca__error" role="alert">{error}</span>}</label>;
}

export default function S04_Group1_RippleCarryAdderSimulator() {
  const [aInput, setAInput] = useState('1011');
  const [bInput, setBInput] = useState('0110');
  const [carryIn, setCarryIn] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const [replay, setReplay] = useState(0);
  const cleanA = normalizeBinary(aInput);
  const cleanB = normalizeBinary(bInput);
  const aError = validateBinary(cleanA, 'Operand A');
  const bError = validateBinary(cleanB, 'Operand B');
  const valid = !aError && !bError;
  const result = useMemo(() => valid ? computeALU({ operation: 'ADD', aInput: cleanA, bInput: cleanB, width: 'auto', mode: 'RCA', carryIn }) : null, [carryIn, cleanA, cleanB, valid]);

  useEffect(() => {
    if (!result) { setActiveStage(-1); return undefined; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setActiveStage(result.width); return undefined; }
    setActiveStage(-1);
    const delay = Math.min(140, Math.max(35, Math.floor(2800 / result.width)));
    const timers = result.trace.stages.map((_, index) => setTimeout(() => setActiveStage(index), (index + 1) * delay));
    timers.push(setTimeout(() => setActiveStage(result.width), (result.width + 1) * delay));
    return () => timers.forEach(clearTimeout);
  }, [replay, result]);

  const fullDecimal = result ? result.aValue + result.bValue + BigInt(carryIn) : 0n;
  return <div className="rca">
    <div className="rca__controls">
      <BinaryInput id="rca-a" label="Operand A" value={aInput} error={aError} onChange={setAInput} />
      <BinaryInput id="rca-b" label="Operand B" value={bInput} error={bError} onChange={setBInput} />
      <div className="rca__field"><span className="rca__label">Optional carry-in</span><div className="rca__segmented" role="group" aria-label="Carry-in value">{[0,1].map((value) => <button type="button" key={value} data-active={carryIn === value} aria-pressed={carryIn === value} onClick={() => setCarryIn(value)}>{value}</button>)}</div></div>
      <button className="rca__replay" type="button" onClick={() => setReplay((value) => value + 1)} disabled={!result}>Replay carry trace</button>
    </div>
    {!result && <div className="rca__invalid" role="alert">Fix the highlighted binary input before the adder can run.</div>}
    {result && <>
      <section className="rca__readout" aria-live="polite">
        <div><span className="eyebrow">Padded operands</span><strong className="mono-value">{result.paddedA}<br />+ {result.paddedB}<br />+ C0 {carryIn}</strong></div>
        <div><span className="eyebrow">{result.width}-bit sum</span><strong className="mono-value">{result.resultBinary}</strong></div>
        <div><span className="eyebrow">Final carry</span><strong className="mono-value">{result.trace.finalCarry}</strong></div>
        <div><span className="eyebrow">Full result</span><strong className="mono-value">{result.fullResultBinary}</strong></div>
        <div><span className="eyebrow">Decimal check</span><strong className="mono-value">{result.aValue.toString()} + {result.bValue.toString()} + {carryIn} = {fullDecimal.toString()}</strong></div>
      </section>
      <div className="rca__chain" aria-label="Full-adder stages, bit 0 least significant first">
        {result.trace.stages.map((stage, index) => <Fragment key={stage.bit}><article className="rca__stage" data-active={activeStage === index} data-settled={activeStage >= index}><span className="rca__stage-label mono-value">Bit {stage.bit} · LSB{stage.bit === 0 ? '' : ` + ${stage.bit}`}</span><strong>FA{stage.bit}</strong><span className="mono-value">A={stage.aBit} B={stage.bBit} C-in={stage.carryIn}</span><span className="mono-value">S={stage.sumBit} C-out={stage.carryOut}</span></article>{index < result.width - 1 && <div className="rca__wire" data-active={activeStage > index}><span className="mono-value">C{stage.bit + 1}={stage.carryOut}</span><i /></div>}</Fragment>)}
      </div>
      <section className="rca__steps"><h3>Bit-by-bit calculation · LSB first</h3><div className="rca__table-wrap" tabIndex="0"><table><thead><tr><th>Bit</th><th>A</th><th>B</th><th>Carry in</th><th>G</th><th>P</th><th>Sum</th><th>Carry out</th></tr></thead><tbody>{result.trace.stages.map((stage, index) => <tr key={stage.bit} data-active={activeStage >= index}><td>{stage.bit}</td><td>{stage.aBit}</td><td>{stage.bBit}</td><td>{stage.carryIn}</td><td>{stage.generate}</td><td>{stage.propagate}</td><td>{stage.sumBit}</td><td>{stage.carryOut}</td></tr>)}</tbody></table></div></section>
    </>}
    <style>{`
      .S04_Group1_exhibit {
      .rca{display:grid;gap:1rem;container-type:inline-size}.rca__controls,.rca__readout,.rca__steps,.rca__invalid{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem}.rca__controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) auto;gap:1rem;align-items:end}.rca__field{display:flex;flex-direction:column;gap:.45rem;min-width:0}.rca__label{font-family:var(--font-label);text-transform:uppercase;letter-spacing:.1em;font-size:.72rem;color:var(--paper-dim)}.rca__input{width:100%;min-height:2.75rem;background:var(--bg);border:1px solid var(--border-strong);border-radius:var(--radius);color:var(--paper);padding:.65rem}.rca__input[aria-invalid=true]{border-color:var(--carry)}.rca__error,.rca__invalid{color:var(--carry);font-size:.8rem}.rca__segmented{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}.rca__segmented button,.rca__replay{min-height:2.75rem;background:var(--bg);border:1px solid var(--border-strong);border-radius:var(--radius);color:var(--paper-dim);font-family:var(--font-mono);cursor:pointer}.rca__segmented button[data-active=true]{background:var(--trace-dim);border-color:var(--trace);color:var(--trace)}.rca__readout{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1rem}.rca__readout>div{display:flex;flex-direction:column;gap:.35rem;min-width:0}.rca__readout strong{color:var(--trace);overflow-x:auto}.rca__chain{display:flex;align-items:center;overflow-x:auto;padding:.5rem 0}.rca__stage{flex:0 0 10rem;display:flex;flex-direction:column;gap:.4rem;padding:.8rem;background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);opacity:.45}.rca__stage[data-settled=true]{opacity:1}.rca__stage[data-active=true]{border-color:var(--trace);box-shadow:0 0 12px rgba(0,230,168,.15)}.rca__stage-label{font-size:.68rem;color:var(--paper-dim)}.rca__stage span{font-size:.72rem}.rca__wire{flex:0 0 4.5rem;text-align:center;color:var(--paper-dim);font-size:.65rem}.rca__wire i{display:block;height:2px;background:var(--border-strong)}.rca__wire[data-active=true] i{background:var(--carry);box-shadow:0 0 7px var(--carry)}.rca__steps h3{font-size:1rem}.rca__table-wrap{overflow-x:auto}.rca table{width:100%;min-width:660px;border-collapse:collapse;font-family:var(--font-mono);font-size:.8rem}.rca th,.rca td{border:1px solid var(--border);padding:.45rem;text-align:center}.rca th{color:var(--trace)}.rca tr[data-active=true] td{background:rgba(0,230,168,.04)}
      @media(max-width:900px){.rca__controls{grid-template-columns:repeat(2,minmax(0,1fr))}.rca__readout{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:540px){.rca__controls,.rca__readout{grid-template-columns:1fr}}
      @container(max-width:900px){.rca__controls{grid-template-columns:repeat(2,minmax(0,1fr))}.rca__readout{grid-template-columns:repeat(2,minmax(0,1fr))}}@container(max-width:540px){.rca__controls,.rca__readout{grid-template-columns:1fr}}
      }
    `}</style>
  </div>;
}
