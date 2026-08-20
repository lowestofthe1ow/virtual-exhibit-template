import React, { useEffect, useMemo, useState } from 'react';

type EniacStep = {
  title: string;
  detail: string;
  explanation: string;
  activeParts: string[];
};

const EniacMachine: React.FC = () => {
  const [program, setProgram] = useState('ADD 13, 27');
  const [registerA, setRegisterA] = useState(0);
  const [registerB, setRegisterB] = useState(0);
  const [output, setOutput] = useState('Simulate a program by entering an operation and running it.');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const steps = useMemo<EniacStep[]>(() => {
    const normalized = program.trim().toUpperCase();
    const isAdd = normalized.startsWith('ADD ');
    const isMultiply = normalized.startsWith('MULT ');
    if (isAdd || isMultiply) {
      return [
        {
          title: 'Route the patch cables',
          detail: 'The operator connects the right pathway for the instruction.',
          explanation: 'ENIAC programming was manual. The operator had to plug cables and set switches so the machine would send data through the correct arithmetic units.',
          activeParts: ['cables'],
        },
        {
          title: 'Load the accumulators',
          detail: `Register A holds ${registerA} and Register B holds ${registerB}.`,
          explanation: 'The accumulators store intermediate values while the machine prepares to operate on them.',
          activeParts: ['accumulators'],
        },
        {
          title: 'Fire the pulses',
          detail: 'Electrical pulses race through the machine.',
          explanation: 'ENIAC used electronic pulses to move data along the wiring network and through the arithmetic units.',
          activeParts: ['pulses'],
        },
        {
          title: 'Display the result',
          detail: `${output}`,
          explanation: 'Once the pulses finish, the output panel shows the final value from the computation.',
          activeParts: ['output'],
        },
      ];
    }

    return [
      {
        title: 'Route the patch cables',
        detail: 'The instruction needs a valid operation and two numbers.',
        explanation: 'ENIAC did not load programs from memory. Instead, operators configured the machine by hand before it could run.',
        activeParts: ['cables'],
      },
    ];
  }, [output, program, registerA, registerB]);

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

  const runProgram = () => {
    const normalized = program.trim().toUpperCase();
    if (normalized.startsWith('ADD ')) {
      const args = normalized.replace('ADD ', '').split(',').map((s) => Number(s.trim()));
      if (args.length === 2 && args.every(Number.isFinite)) {
        const result = args[0] + args[1];
        setRegisterA(args[0]);
        setRegisterB(args[1]);
        setOutput(`ADD result: ${result}`);
        setStepIndex(0);
        setIsPlaying(true);
        return;
      }
    }
    if (normalized.startsWith('MULT ')) {
      const args = normalized.replace('MULT ', '').split(',').map((s) => Number(s.trim()));
      if (args.length === 2 && args.every(Number.isFinite)) {
        const result = args[0] * args[1];
        setRegisterA(args[0]);
        setRegisterB(args[1]);
        setOutput(`MULT result: ${result}`);
        setStepIndex(0);
        setIsPlaying(true);
        return;
      }
    }
    setOutput('Unsupported program. Try ADD or MULT with two integers.');
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
    setProgram('ADD 13, 27');
    setRegisterA(0);
    setRegisterB(0);
    setOutput('Simulate a program by entering an operation and running it.');
    setStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">ENIAC patch-cable programming</h3>
        <p className="rotor-explainer-text">ENIAC was programmed by physically wiring the machine and setting switches, rather than by loading a stored program from memory.</p>
        <p className="rotor-explainer-text">This simulation shows how a calculation moves through the machine once patch cables and accumulators are configured.</p>
      </div>

      <div className="simulator-toolbar">
        <div className="button-group">
          <button className="btn btn-primary" onClick={runProgram}>▶ Run</button>
          <button className="btn btn-secondary" onClick={() => setIsPlaying((prev) => !prev)}>{isPlaying ? 'Pause' : 'Resume'}</button>
          <button className="btn btn-secondary" onClick={previousStep}>← Step</button>
          <button className="btn btn-secondary" onClick={nextStep}>Step →</button>
          <button className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>
        <div className="simulator-toolbar__controls">
          <label className="input-label" htmlFor="eniac-speed">Speed</label>
          <select id="eniac-speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rotor-input">
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
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('cables') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Patch cables</span>
              <div className="machine-gates">
                {['A', 'B', 'C'].map((cable, index) => (
                  <div key={cable} className={`machine-gate ${index <= Math.min(stepIndex, 2) ? 'is-active' : ''}`}>{cable}</div>
                ))}
              </div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('accumulators') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Accumulators</span>
              <div className="simulator-meter">{registerA} / {registerB}</div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('pulses') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Pulse lanes</span>
              <div className="machine-rail machine-rail--reader" />
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('output') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Output panel</span>
              <div className="simulator-meter">{output}</div>
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
        <label className="input-label">Program instruction</label>
        <input type="text" value={program} className="rotor-input" onChange={(e) => setProgram(e.target.value)} placeholder="Example: ADD 13, 27" />
      </div>

      <div className="museum-innovation-card">
        <h4>Why this machine was needed</h4>
        <p>As problems became too varied and too large for a single fixed-purpose machine, engineers needed a machine that could be reconfigured for different calculations instead of being dedicated to one task.</p>
      </div>

      <div className="simulator-metadata">
        <div><strong>Year:</strong> 1945</div>
        <div><strong>Developers:</strong> John Mauchly and J. Presper Eckert</div>
        <div><strong>Purpose:</strong> Large-scale scientific and military calculation</div>
        <div><strong>Significance:</strong> Demonstrated the power of electronic digital computation</div>
      </div>

      <div className="museum-innovation-card">
        <h4>Computing innovation</h4>
        <p>ENIAC proved that electronic machines could be reconfigured for different problems. Its flexible wiring and arithmetic units helped define the idea of general-purpose computation.</p>
        <ul>
          <li><strong>Principle:</strong> Reprogrammable electronic data processing</li>
          <li><strong>Legacy:</strong> Modern instruction-driven computing and flexible software systems</li>
        </ul>
      </div>

      <div className="museum-innovation-card">
        <h4>Legacy</h4>
        <p>ENIAC helped make the idea of a universal machine feel practical. Its flexible design set the stage for later general-purpose computers and the software-driven world that followed.</p>
      </div>
    </div>
  );
};

export default EniacMachine;
