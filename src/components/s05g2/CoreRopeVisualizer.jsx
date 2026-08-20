import { useState } from 'react';

export default function CoreRopeVisualizer() {
  const [mode, setMode] = useState('rope'); // 'rope' | 'punchcard'
  const [cores, setCores] = useState([1, 0, 1, 1, 0, 1, 0, 1]);
  const binaryValue = cores.join('');
  const decimalValue = parseInt(binaryValue, 2);

  const toggleCore = (index) => {
    const updated = [...cores];
    updated[index] = updated[index] === 1 ? 0 : 1;
    setCores(updated);
  };

  return (
    <div className="crv">
      <div className="crv__header">
        <h3 className="crv__title">Interactive Visualizer Model</h3>
        <button
          className="crv__switch"
          onClick={() => setMode(mode === 'rope' ? 'punchcard' : 'rope')}
        >
          Switch to {mode === 'rope' ? 'Punch Card View' : 'Core Rope View'}
        </button>
      </div>

      <p className="crv__mode-label">
        Current view: <strong>{mode === 'rope' ? "Margaret Hamilton's Core Rope Memory" : "Ada Lovelace's Punch Card"}</strong>
      </p>

      <div className="crv__cells">
        {cores.map((val, idx) => (
          <button
            key={idx}
            onClick={() => toggleCore(idx)}
            aria-label={`bit ${idx}, currently ${val}`}
            className={`crv__cell ${mode === 'punchcard' ? 'crv__cell--square' : ''} ${val === 1 ? 'crv__cell--on' : ''}`}
          >
            {val}
          </button>
        ))}
      </div>

      <p className="crv__value" aria-live="polite">
        Binary: <strong>{binaryValue}</strong> &mdash; Decimal: <strong>{decimalValue}</strong>
      </p>

      <p className="crv__hint">
        {mode === 'rope'
          ? 'Click a ring: wire threaded THROUGH it stores a 1, wire routed AROUND it stores a 0.'
          : 'Click a cell: a punched hole stores a 1, solid card stores a 0.'}
      </p>

      <style>{`
        .crv {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg1);
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
        .crv__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .crv__title {
          font-family: "Lora Variable";
          margin: 0;
        }
        .crv__switch {
          border: 2px solid var(--border);
          border-radius: 100px;
          background: var(--bg2);
          color: var(--text);
          padding: 0.4rem 0.9rem;
          font-size: var(--small);
          cursor: pointer;
        }
        .crv__switch:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .crv__mode-label {
          font-size: var(--small);
          color: var(--muted);
          margin: 0.75rem 0 1.25rem 0;
        }
        .crv__cells {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .crv__cell {
          width: 50px;
          height: 50px;
          border-radius: 999px;
          border: 2px solid var(--accent);
          background: transparent;
          color: var(--text);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .crv__cell--square {
          border-radius: 4px;
        }
        .crv__cell--on {
          background: var(--accent);
          color: white;
        }
        .crv__value {
          margin: 1rem 0 0;
          font-size: var(--small);
          color: var(--text);
        }
        .crv__hint {
          font-size: var(--small);
          color: var(--muted);
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
