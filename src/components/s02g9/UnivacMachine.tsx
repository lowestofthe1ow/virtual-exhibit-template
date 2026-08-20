import React, { useEffect, useMemo, useState } from 'react';

type UnivacStep = {
  title: string;
  detail: string;
  explanation: string;
  activeParts: string[];
};

const UnivacMachine: React.FC = () => {
  const [records, setRecords] = useState('10,20,30,40');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [result, setResult] = useState('Enter numeric records separated by commas.');

  const steps = useMemo<UnivacStep[]>(() => {
    const values = records.split(',').map((item) => Number(item.trim())).filter(Number.isFinite);
    if (values.length === 0) {
      return [
        {
          title: 'Load tape',
          detail: 'There are no valid records yet.',
          explanation: 'UNIVAC I relied on magnetic tape to hold data in sequence, so the first task is to read a useful list of records.',
          activeParts: ['tape'],
        },
      ];
    }

    const sum = values.reduce((acc, value) => acc + value, 0);
    const average = sum / values.length;

    return [
      {
        title: 'Spin the tape reels',
        detail: 'The reels turn as data is read from magnetic tape.',
        explanation: 'Magnetic tape stored records sequentially. UNIVAC could read them one after another without the need for punch cards at every step.',
        activeParts: ['tape'],
      },
      {
        title: 'Read the records',
        detail: `The machine parses ${values.length} records from the input.`,
        explanation: 'Each record is passed to the processor in order, which is how early business data systems handled bulk information.',
        activeParts: ['memory'],
      },
      {
        title: 'Process the batch',
        detail: 'The CPU sums the values and prepares a report.',
        explanation: 'Simple tasks such as counting, sorting, and averaging were central to early commercial computing.',
        activeParts: ['cpu'],
      },
      {
        title: 'Print the report',
        detail: `Average ${average.toFixed(2)}.`,
        explanation: 'The printer outputs the finished report line by line, which is the final stage of the business-data workflow.',
        activeParts: ['printer'],
      },
    ];
  }, [records]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, 1200 / speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, speed, stepIndex, steps.length]);

  const currentStep = steps[stepIndex] ?? steps[0];

  const computeAverage = () => {
    const values = records.split(',').map((item) => Number(item.trim())).filter(Number.isFinite);
    if (values.length === 0) {
      setResult('Enter at least one numeric record.');
      setStepIndex(0);
      setIsPlaying(false);
      return;
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    setResult(`Parsed ${values.length} records. Average: ${(sum / values.length).toFixed(2)}`);
    setStepIndex(0);
    setIsPlaying(true);
  };

  const nextStep = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const reset = () => {
    setRecords('10,20,30,40');
    setResult('Enter numeric records separated by commas.');
    setStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">UNIVAC I business-data flow</h3>
        <p className="rotor-explainer-text">UNIVAC I handled business tasks using magnetic tape, memory blocks, and printed reports rather than the punch-card workflows that came before it.</p>
        <p className="rotor-explainer-text">This simulation shows the flow of records from tape into memory and through the CPU to a printed output report.</p>
      </div>

      <div className="simulator-toolbar">
        <div className="button-group">
          <button className="btn btn-primary" onClick={computeAverage}>▶ Run</button>
          <button className="btn btn-secondary" onClick={() => setIsPlaying((prev) => !prev)}>{isPlaying ? 'Pause' : 'Resume'}</button>
          <button className="btn btn-secondary" onClick={previousStep}>← Step</button>
          <button className="btn btn-secondary" onClick={nextStep}>Step →</button>
          <button className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>
        <div className="simulator-toolbar__controls">
          <label className="input-label" htmlFor="univac-speed">Speed</label>
          <select id="univac-speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rotor-input">
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={4}>4×</option>
          </select>
          <button className="btn btn-secondary" onClick={() => setZoomed((prev) => !prev)}>{zoomed ? 'Zoom out' : 'Zoom in'}</button>
        </div>
      </div>

      <div className={`simulator-shell ${zoomed ? 'simulator-shell--zoomed' : ''}`}>
        <div className="simulator-visual">
          <div className="simulator-visual__panel">
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('tape') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Magnetic tape</span>
              <div className="simulator-tape">
                {records.split(',').filter(Boolean).map((record, index) => (
                  <span key={`${record}-${index}`} className="simulator-tape__bit is-on">{record}</span>
                ))}
              </div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('memory') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Memory blocks</span>
              <div className="machine-gates">
                {['M1', 'M2', 'M3'].map((block, index) => (
                  <div key={block} className={`machine-gate ${index <= Math.min(stepIndex, 2) ? 'is-active' : ''}`}>{block}</div>
                ))}
              </div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('cpu') ? 'is-active' : ''}`}>
              <span className="machine-part__label">CPU</span>
              <div className="simulator-meter">{result}</div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('printer') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Printer</span>
              <div className="simulator-meter">{result}</div>
            </div>
          </div>

          <div className="simulator-side-panel">
            <div className="simulator-step-card">
              <h4>{currentStep.title}</h4>
              <p>{currentStep.detail}</p>
              <p className="simulator-step-card__explanation">{currentStep.explanation}</p>
            </div>
            <div className="simulator-sequence">
              {steps.map((step, index) => (
                <div key={step.title} className={`simulator-step ${index === stepIndex ? 'active' : ''}`}>
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Data records</label>
        <textarea value={records} className="rotor-input" rows={4} onChange={(e) => setRecords(e.target.value)} placeholder="Example: 10, 20, 30, 40" />
      </div>

      <div className="museum-innovation-card">
        <h4>Why this machine was needed</h4>
        <p>Once governments and businesses needed to process increasingly large amounts of information, a machine was needed that could manage records, reports, and recurring calculations reliably and quickly.</p>
      </div>

      <div className="simulator-metadata">
        <div><strong>Year:</strong> 1951</div>
        <div><strong>Developers:</strong> Remington Rand</div>
        <div><strong>Purpose:</strong> Commercial business and administrative data processing</div>
        <div><strong>Significance:</strong> Showed how computers could move from scientific work to everyday business tasks</div>
      </div>

      <div className="museum-innovation-card">
        <h4>Computing innovation</h4>
        <p>UNIVAC I helped bring computing into the commercial world. Its use of data processing, reporting, and stored records established ideas that later shaped databases, business software, and networked information systems.</p>
        <ul>
          <li><strong>Principle:</strong> Data processing for business and administration</li>
          <li><strong>Legacy:</strong> Databases, reporting systems, and modern information infrastructure</li>
        </ul>
      </div>

      <div className="museum-innovation-card">
        <h4>Legacy</h4>
        <p>UNIVAC helped move computing from special-purpose calculation into the routine work of government and business. That shift shaped the modern information economy and the software systems we depend on today.</p>
      </div>
    </div>
  );
};

export default UnivacMachine;
