import React, { useEffect, useMemo, useState } from 'react';

type MarkStep = {
  title: string;
  detail: string;
  explanation: string;
  activeParts: string[];
};

const Mark1Machine: React.FC = () => {
  const [calculation, setCalculation] = useState('45 * 72');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [result, setResult] = useState('Enter a simple arithmetic expression to compute.');

  const steps = useMemo<MarkStep[]>(() => {
    try {
      const value = Function(`return ${calculation}`)();
      return [
        {
          title: 'Load the numbers',
          detail: `The registers are primed with ${calculation}.`,
          explanation: 'The Mark I accepted values from punch cards or paper tape and moved them into its storage registers.',
          activeParts: ['registers'],
        },
        {
          title: 'Activate the relays',
          detail: 'Relays click as the machine chooses the arithmetic path.',
          explanation: 'Because the machine was electromechanical, relays had to close in sequence before the calculation could continue.',
          activeParts: ['relays'],
        },
        {
          title: 'Turn the shafts',
          detail: 'Mechanical shafts rotate and carry the value through the machine.',
          explanation: 'The long rotating shafts made the machine feel more like a complex assembly of gears than a modern electronic processor.',
          activeParts: ['shafts'],
        },
        {
          title: 'Print the result',
          detail: `Result ${value}.`,
          explanation: 'The final value emerges on the output mechanism character by character, showing the slow but reliable pace of electromechanical computation.',
          activeParts: ['printer'],
        },
      ];
    } catch {
      return [
        {
          title: 'Load the numbers',
          detail: 'The expression needs to be simple arithmetic only.',
          explanation: 'Use a basic expression such as 45 * 72 so the machine can follow each step clearly.',
          activeParts: ['registers'],
        },
      ];
    }
  }, [calculation]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, 1300 / speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, speed, stepIndex, steps.length]);

  const currentStep = steps[stepIndex] ?? steps[0];

  const compute = () => {
    try {
      const value = Function(`return ${calculation}`)();
      setResult(`Result: ${String(value)}`);
      setStepIndex(0);
      setIsPlaying(true);
    } catch {
      setResult('Invalid expression. Use basic arithmetic like 12 + 34.');
    }
  };

  const startPlayback = () => {
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
    setCalculation('45 * 72');
    setStepIndex(0);
    setIsPlaying(false);
    setResult('Enter a simple arithmetic expression to compute.');
  };

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">Harvard Mark I electromechanical calculator</h3>
        <p className="rotor-explainer-text">The Mark I used rotating shafts, relays, and registers to perform arithmetic without the speed of modern electronics.</p>
        <p className="rotor-explainer-text">This simulation highlights the machine’s slower mechanical rhythm and the way values move through its registers one stage at a time.</p>
      </div>

      <div className="simulator-toolbar">
        <div className="button-group">
          <button className="btn btn-primary" onClick={compute}>▶ Compute</button>
          <button className="btn btn-secondary" onClick={() => setIsPlaying((prev) => !prev)}>{isPlaying ? 'Pause' : 'Resume'}</button>
          <button className="btn btn-secondary" onClick={previousStep}>← Step</button>
          <button className="btn btn-secondary" onClick={nextStep}>Step →</button>
          <button className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>
        <div className="simulator-toolbar__controls">
          <label className="input-label" htmlFor="mark-speed">Speed</label>
          <select id="mark-speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rotor-input">
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
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('registers') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Registers</span>
              <div className="simulator-meter">{calculation}</div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('relays') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Relays</span>
              <div className="machine-gates">
                {['R1', 'R2', 'R3'].map((relay, index) => (
                  <div key={relay} className={`machine-gate ${index + 1 <= Math.min(stepIndex + 1, 3) ? 'is-active' : ''}`}>{relay}</div>
                ))}
              </div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('shafts') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Rotating shafts</span>
              <div className="machine-rail machine-rail--reader" />
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
        <label className="input-label">Calculation</label>
        <input type="text" value={calculation} className="rotor-input" onChange={(e) => setCalculation(e.target.value)} placeholder="Example: 45 * 72" />
      </div>

      <div className="museum-innovation-card">
        <h4>Why this machine was needed</h4>
        <p>As calculations grew larger and more repetitive, routine arithmetic needed a machine that could follow steps automatically rather than relying on manual labor or hand-assembled gearwork.</p>
      </div>

      <div className="simulator-metadata">
        <div><strong>Year:</strong> 1944</div>
        <div><strong>Developers:</strong> Howard Aiken and IBM</div>
        <div><strong>Purpose:</strong> Scientific and engineering calculations</div>
        <div><strong>Significance:</strong> Demonstrated the promise of automatic sequence control</div>
      </div>

      <div className="museum-innovation-card">
        <h4>Computing innovation</h4>
        <p>The Harvard Mark I showed that a machine could follow a sequence of instructions automatically using rotating shafts and relays. It brought the idea of stored procedure and automatic execution into practical engineering.</p>
        <ul>
          <li><strong>Principle:</strong> Sequential execution and stored control</li>
          <li><strong>Legacy:</strong> Instruction sequencing and early computer architecture</li>
        </ul>
      </div>

      <div className="museum-innovation-card">
        <h4>Legacy</h4>
        <p>The Mark I helped make automatic operation feel routine. Its approach to sequencing and stored instructions shaped later computer design and software execution models.</p>
      </div>
    </div>
  );
};

export default Mark1Machine;
