import React, { useEffect, useMemo, useState } from 'react';

type BombeStep = {
  title: string;
  detail: string;
  explanation: string;
  activeParts: string[];
  candidate?: string;
};

const defaultCrib = 'ATTACK';
const defaultPositions = [3, 8, 19];

const BombeMachine: React.FC = () => {
  const [crib, setCrib] = useState(defaultCrib);
  const [rotorPositions, setRotorPositions] = useState(defaultPositions);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const steps = useMemo<BombeStep[]>(() => {
    const candidateKey = rotorPositions.map((pos) => String.fromCharCode(65 + pos)).join('-');
    const cribText = crib.trim().toUpperCase() || defaultCrib;

    return [
      {
        title: 'Load the crib',
        detail: `The operators begin with a guessed plaintext fragment: ${cribText}.`,
        explanation: 'A crib is a likely word or phrase hidden in the cipher text. The Bombe uses it to test whether a rotor arrangement could produce that known text.',
        activeParts: ['crib', 'wiring'],
      },
      {
        title: 'Align the drums',
        detail: `The rotors are set to ${candidateKey}.`,
        explanation: 'Each drum represents a rotor position. The machine advances the drums as if the Enigma machine were being started with a particular key.',
        activeParts: ['drums'],
      },
      {
        title: 'Trace the circuit',
        detail: 'Current travels through the wiring network looking for consistent letter substitutions.',
        explanation: 'The Bombe builds a logical chain of connections. If one path contradicts the crib, that setting is discarded quickly.',
        activeParts: ['wiring', 'logic'],
      },
      {
        title: 'Reject impossible settings',
        detail: 'Contradictions light up as dead ends and disappear from the board.',
        explanation: 'Every time a candidate setting breaks the letter logic, the Bombe removes it. Only settings that survive all checks are kept.',
        activeParts: ['logic'],
      },
      {
        title: 'Confirm a candidate',
        detail: `Candidate key ${candidateKey} survives the test and is highlighted for verification.`,
        explanation: 'When a setting satisfies the crib, it becomes a promising Enigma key. Human operators would then test it on an Enigma machine to confirm the result.',
        activeParts: ['indicator'],
        candidate: candidateKey,
      },
    ];
  }, [crib, rotorPositions]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, 1400 / speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, speed, stepIndex, steps.length]);

  const updatePosition = (index: number, value: number) => {
    setRotorPositions((prev) => {
      const next = [...prev];
      next[index] = Math.max(0, Math.min(25, value));
      return next;
    });
    setStepIndex(0);
    setIsPlaying(false);
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
    setCrib(defaultCrib);
    setRotorPositions(defaultPositions);
    setStepIndex(0);
    setIsPlaying(false);
  };

  const currentStep = steps[stepIndex] ?? steps[0];

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">Bombe logic laboratory</h3>
        <p className="rotor-explainer-text">The Bombe used the idea of a known plaintext fragment, or crib, to test thousands of rotor settings and eliminate the ones that could not possibly work.</p>
        <p className="rotor-explainer-text">This simulation shows how the machine builds logical connections, rejects contradictions, and leaves plausible candidate keys for human verification.</p>
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
          <label className="input-label" htmlFor="bombe-speed">Speed</label>
          <select id="bombe-speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rotor-input">
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
            <div className="machine-part machine-part--panel">
              <span className="machine-part__label">Known crib</span>
              <span className={`machine-part__value ${currentStep.activeParts.includes('crib') ? 'is-active' : ''}`}>{crib.toUpperCase()}</span>
            </div>
            <div className="machine-part machine-part--panel">
              <span className="machine-part__label">Rotor drums</span>
              <div className="machine-drum-row">
                {rotorPositions.map((position, index) => (
                  <div key={`${position}-${index}`} className={`machine-drum ${currentStep.activeParts.includes('drums') ? 'is-active' : ''}`}>
                    <span>{index + 1}</span>
                    <strong>{String.fromCharCode(65 + position)}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="machine-part machine-part--panel">
              <span className="machine-part__label">Logic lattice</span>
              <div className={`machine-rail ${currentStep.activeParts.includes('wiring') ? 'is-active' : ''}`} />
              <div className={`machine-rail machine-rail--secondary ${currentStep.activeParts.includes('logic') ? 'is-active' : ''}`} />
            </div>
            <div className={`machine-part machine-part--panel ${currentStep.activeParts.includes('indicator') ? 'is-active' : ''}`}>
              <span className="machine-part__label">Candidate light</span>
              <span className="machine-part__value">{currentStep.candidate ?? 'Pending'}</span>
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
          <label className="input-label">Known crib</label>
          <input type="text" value={crib} className="rotor-input" onChange={(e) => setCrib(e.target.value.toUpperCase())} placeholder="Example: ATTACK" />
        </div>
        <div className="input-group">
          <label className="input-label">Rotor positions</label>
          <div className="rotor-settings rotor-settings-inline">
            {rotorPositions.map((position, index) => (
              <div className="rotor-group" key={index}>
                <label className="rotor-label">Rotor {index + 1}</label>
                <input type="number" min={0} max={25} value={position} className="rotor-input" onChange={(e) => updatePosition(index, Number(e.target.value) || 0)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="museum-innovation-card">
        <h4>Why this machine was needed</h4>
        <p>Enigma created trillions of possible settings, so humans could no longer test them one by one. The Bombe was created to automate the search for likely rotor arrangements and reduce the work of codebreakers.</p>
      </div>

      <div className="simulator-metadata">
        <div><strong>Year:</strong> 1939</div>
        <div><strong>Developers:</strong> Alan Turing, Gordon Welchman, and Bletchley Park staff</div>
        <div><strong>Purpose:</strong> Rapidly test possible Enigma rotor settings</div>
        <div><strong>Significance:</strong> Helped turn cipher breaking from slow manual work into a machine-assisted search</div>
      </div>

      <div className="museum-innovation-card">
        <h4>Computing innovation</h4>
        <p>The Bombe introduced automated logical search. Instead of checking each rotor arrangement by hand, it used electrical circuits to eliminate impossible settings and keep the promising ones.</p>
        <ul>
          <li><strong>Principle:</strong> Logical deduction through machine-driven search</li>
          <li><strong>Legacy:</strong> Early search algorithms and automated pattern matching</li>
        </ul>
      </div>

      <div className="museum-innovation-card">
        <h4>Legacy</h4>
        <p>The Bombe helped establish the idea that a machine could model a huge search space and prune it with logic. That approach later influenced search algorithms, optimization, and cybersecurity practice.</p>
      </div>
    </div>
  );
};

export default BombeMachine;
