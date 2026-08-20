import React, { useEffect, useMemo, useState } from 'react';

type ColossusStep = {
  title: string;
  detail: string;
  explanation: string;
  activeParts: string[];
};

const defaultBits = '1010110010101010';

const ColossusMachine: React.FC = () => {
  const [input, setInput] = useState(defaultBits);
  const [threshold, setThreshold] = useState(5);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const steps = useMemo<ColossusStep[]>(() => {
    const ones = (input.match(/1/g) || []).length;
    const score = ones >= threshold ? 'High probability of a valid signal.' : 'Signal does not meet the threshold.';

    return [
      {
        title: 'Feed the paper tape',
        detail: 'The tape advances through the optical reader.',
        explanation: 'Colossus read teleprinter traffic from paper tape, turning the stream into electronic pulses the machine could test.',
        activeParts: ['tape', 'reader'],
      },
      {
        title: 'Read the bits',
        detail: `The stream contains ${input.length} bits and ${ones} ones.`,
        explanation: 'Each bit is sampled one at a time so the logic circuits can compare them against possible wheel settings.',
        activeParts: ['reader', 'logic'],
      },
      {
        title: 'Test the logic',
        detail: 'The gates light up as the machine evaluates each candidate hypothesis.',
        explanation: 'This was one of the big breakthroughs of Colossus: it ran fast enough to test many hypotheses electronically instead of by hand.',
        activeParts: ['logic', 'gates'],
      },
      {
        title: 'Count matches',
        detail: `The counters rise toward the threshold of ${threshold}.`,
        explanation: 'As characters match expected patterns, the counters climb. The highest-scoring configuration becomes the best candidate.',
        activeParts: ['counter'],
      },
      {
        title: 'Select the likely setting',
        detail: `${score}`,
        explanation: 'The most promising setting is highlighted. In practice, this helped cryptanalysts recover the Lorenz key settings faster than traditional methods.',
        activeParts: ['result'],
      },
    ];
  }, [input, threshold]);

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
    setInput(defaultBits);
    setThreshold(5);
    setStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">Colossus signal analysis</h3>
        <p className="rotor-explainer-text">Colossus was built to inspect encrypted teleprinter traffic by testing many possible settings with electronic logic circuits.</p>
        <p className="rotor-explainer-text">This simulator mirrors that flow by reading a bit stream, activating logic gates, and tracking which candidate pattern looks strongest.</p>
      </div>

      <div className="simulator-toolbar">
        <div className="button-group">
          <button className="btn btn-primary" onClick={startPlayback}>▶ Start</button>
          <button className="btn btn-secondary" onClick={() => setIsPlaying((prev) => !prev)}>{isPlaying ? 'Pause' : 'Resume'}</button>
          <button className="btn btn-secondary" onClick={previousStep}>← Step</button>
          <button className="btn btn-secondary" onClick={nextStep}>Step →</button>
          <button className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>
        <div className="simulator-toolbar__controls">
          <label className="input-label" htmlFor="colossus-speed">Speed</label>
          <select id="colossus-speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rotor-input">
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
              <span className="machine-part__label">Paper tape</span>
              <div className="simulator-tape">
                {input.split('').map((bit, index) => (
                  <span key={`${bit}-${index}`} className={`simulator-tape__bit ${bit === '1' ? 'is-on' : ''}`}>{bit}</span>
                ))}
              </div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('reader') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Optical reader</span>
              <div className="machine-rail machine-rail--reader" />
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('logic') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Logic gates</span>
              <div className="machine-gates">
                {['A', 'B', 'C'].map((gate, index) => (
                  <div key={gate} className={`machine-gate ${index + 1 <= Math.min(stepIndex + 1, 3) ? 'is-active' : ''}`}>{gate}</div>
                ))}
              </div>
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('counter') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Counters</span>
              <div className="simulator-meter">{Math.max(0, stepIndex + 1)}/{steps.length}</div>
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

      <div className="input-area">
        <div className="input-group">
          <label className="input-label">Teleprinter bit stream</label>
          <textarea value={input} className="rotor-input" rows={5} onChange={(e) => setInput(e.target.value.replace(/[^01]/g, ''))} placeholder="Enter 0/1 signal data" />
        </div>
        <div className="input-group">
          <label className="input-label">Detection threshold</label>
          <input type="number" min={1} max={20} value={threshold} className="rotor-input" onChange={(e) => setThreshold(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
        </div>
      </div>

      <div className="museum-innovation-card">
        <h4>Why this machine was needed</h4>
        <p>Once the war shifted to machine-generated traffic and long encrypted streams, human analysis became too slow. Colossus was built to test many bit patterns electronically and identify plausible solutions quickly.</p>
      </div>

      <div className="simulator-metadata">
        <div><strong>Year:</strong> 1943</div>
        <div><strong>Developers:</strong> Tommy Flowers and the Post Office Research Station</div>
        <div><strong>Purpose:</strong> Analyze Lorenz cipher traffic</div>
        <div><strong>Significance:</strong> One of the first programmable electronic digital computers</div>
      </div>

      <div className="museum-innovation-card">
        <h4>Computing innovation</h4>
        <p>Colossus showed that electronic circuits could process digital data at high speed. Its design made it possible to test many signal hypotheses quickly, which was a major step toward electronic computation.</p>
        <ul>
          <li><strong>Principle:</strong> Electronic digital logic and programmable control</li>
          <li><strong>Legacy:</strong> Modern CPUs, digital signal processing, and electronic data analysis</li>
        </ul>
      </div>

      <div className="museum-innovation-card">
        <h4>Legacy</h4>
        <p>Colossus helped prove that electronic circuits could handle information at scale. That idea became central to CPUs, servers, and the broader digital infrastructure of modern computing.</p>
      </div>
    </div>
  );
};

export default ColossusMachine;
