import React, { useEffect, useState } from 'react';
import { processEnigmaKeypress, defaultEnigmaState } from '../../lib/s02g9/crypto.ts';
import type { EnigmaState } from '../../lib/s02g9/crypto.ts';

const EnigmaMachine: React.FC = () => {
  const [state, setState] = useState<EnigmaState>(defaultEnigmaState());
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating || !state.path?.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextStage = state.path[animationIndex];
      const nextFeedback = state.history?.[animationIndex] ?? state.feedback;
      setState((prev) => ({ ...prev, activeStage: nextStage, feedback: nextFeedback }));

      if (animationIndex < state.path.length - 1) {
        setAnimationIndex((prev) => prev + 1);
      } else {
        setIsAnimating(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [animationIndex, isAnimating, state.feedback, state.history, state.path]);

  const pressKey = (letter: string) => {
    const next = processEnigmaKeypress(state, letter);
    setState(next);
    setAnimationIndex(0);
    setIsAnimating(true);
  };

  const reset = () => {
    setState(defaultEnigmaState());
    setAnimationIndex(0);
    setIsAnimating(false);
  };

  const updatePlug = (index: number, side: 'a' | 'b', value: string) => {
    const v = (value || '').toUpperCase().slice(0, 1);
    const copy = { ...state };
    const pairs = [...copy.plugPairs];
    const pair = { ...pairs[index] };
    if (side === 'a') pair.a = v;
    else pair.b = v;
    pairs[index] = pair;
    copy.plugPairs = pairs;
    setState(copy);
  };

  const updateRotorPos = (i: number, val: number) => {
    const copy = { ...state, rotorPositions: [...state.rotorPositions] };
    copy.rotorPositions[i] = Math.max(0, Math.min(25, val));
    setState(copy);
  };

  const updateRing = (i: number, val: number) => {
    const copy = { ...state, ringSettings: [...state.ringSettings] };
    copy.ringSettings[i] = Math.max(1, Math.min(26, val));
    setState(copy);
  };

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">Enigma Machine Exhibit</h3>
        <p className="rotor-explainer-text">The Enigma machine was used during World War II to hide military communications. Its rotating rotors made the same letter encrypt differently every time.</p>
        <p className="rotor-explainer-text">This exhibit highlights the keyboard, plugboard, rotors, reflector, and lampboard while you encrypt messages one key at a time.</p>
      </div>

      <div className="enigma-education-grid">
        <div className="enigma-info-panel">
          <h4>Historical Information</h4>
          <p>The Enigma machine was a wartime cipher device used by Germany during World War II to protect military communications. Its moving rotors made the same letter encrypt differently each time, which made the machine revolutionary for its era.</p>
          <ul>
            <li>Rotor encryption introduced a changing substitution system instead of a fixed letter shift.</li>
            <li>As encryption grew more complex, codebreakers needed ever more sophisticated machines to test settings and recover messages.</li>
            <li>The plugboard, rotors, and reflector together made Enigma both clever and hard to reverse without the right configuration.</li>
          </ul>
        </div>

        <div className="enigma-illustration-panel">
          <div className="enigma-illustration-title">Labeled Components</div>
          <div className="enigma-part-grid">
            <div className="enigma-part">Keyboard</div>
            <div className="enigma-part">Plugboard</div>
            <div className="enigma-part">Rotors</div>
            <div className="enigma-part">Reflector</div>
            <div className="enigma-part">Lampboard</div>
          </div>
        </div>
      </div>

      <div className="enigma-config-area">
        <div className="input-group">
          <label className="input-label">Rotor positions</label>
          <div className="rotor-settings rotor-settings-inline">
            {[0, 1, 2].map(i => (
              <div className="rotor-group" key={i}>
                <label className="rotor-label">Rotor {i + 1}</label>
                <input type="number" min={0} max={25} value={state.rotorPositions[i]} className="rotor-input" onChange={(e) => updateRotorPos(i, Number(e.target.value) || 0)} />
              </div>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Ring settings</label>
          <div className="rotor-settings rotor-settings-inline">
            {[0, 1, 2].map(i => (
              <div className="rotor-group" key={i}>
                <label className="rotor-label">Ring {i + 1}</label>
                <input type="number" min={1} max={26} value={state.ringSettings[i]} className="rotor-input" onChange={(e) => updateRing(i, Number(e.target.value) || 1)} />
              </div>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Plugboard pairs</label>
          <div id="plugboardPairsList" className="plugboard-pairs">
            {state.plugPairs.map((p, i) => `${p.a || '-'} ↔ ${p.b || '-'}` + (i < state.plugPairs.length - 1 ? ' · ' : ''))}
          </div>

          <div className="plugboard-editor">
            {state.plugPairs.map((pair, idx) => (
              <div className="plugboard-row" key={idx}>
                <input type="text" maxLength={1} className="plugboard-input" value={pair.a} onChange={(e) => updatePlug(idx, 'a', e.target.value)} />
                <span>↔</span>
                <input type="text" maxLength={1} className="plugboard-input" value={pair.b} onChange={(e) => updatePlug(idx, 'b', e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="enigma-rotor-display">
        {[0, 1, 2].map(i => (
          <div className="rotor-display" key={i}>
            <div className="rotor-name">Rotor {i + 1}</div>
            <div className="rotor-number">{String(state.rotorPositions[i]).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      <div className="enigma-keyboard" id="enigmaKeyboard">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
          <button key={letter} className="enigma-key" type="button" onClick={() => pressKey(letter)}>{letter}</button>
        ))}
      </div>

      <div className="input-area">
        <div className="input-group">
          <label className="input-label">Encrypted output</label>
          <div className="output-display" id="enigmaOutput">{state.output || 'Press letters on the keyboard to encrypt.'}</div>
        </div>
        <div className="input-group">
          <label className="input-label">Educational feedback</label>
          <div className="enigma-feedback" id="enigmaFeedback">{state.feedback}</div>
        </div>
      </div>

      <div className="enigma-path-grid">
        <div className={`enigma-stage ${state.activeStage === 'stageKeyboard' ? 'active' : ''}`} id="stageKeyboard">Keyboard</div>
        <div className={`enigma-stage ${state.activeStage === 'stagePlugboard' ? 'active' : ''}`} id="stagePlugboard">Plugboard</div>
        <div className={`enigma-stage ${state.activeStage === 'stageRotor1' ? 'active' : ''}`} id="stageRotor1">Rotor I</div>
        <div className={`enigma-stage ${state.activeStage === 'stageRotor2' ? 'active' : ''}`} id="stageRotor2">Rotor II</div>
        <div className={`enigma-stage ${state.activeStage === 'stageRotor3' ? 'active' : ''}`} id="stageRotor3">Rotor III</div>
        <div className={`enigma-stage ${state.activeStage === 'stageReflector' ? 'active' : ''}`} id="stageReflector">Reflector</div>
        <div className={`enigma-stage ${state.activeStage === 'stageRotor3Back' ? 'active' : ''}`} id="stageRotor3Back">Rotor III</div>
        <div className={`enigma-stage ${state.activeStage === 'stageRotor2Back' ? 'active' : ''}`} id="stageRotor2Back">Rotor II</div>
        <div className={`enigma-stage ${state.activeStage === 'stageRotor1Back' ? 'active' : ''}`} id="stageRotor1Back">Rotor I</div>
        <div className={`enigma-stage ${state.activeStage === 'stagePlugboardBack' ? 'active' : ''}`} id="stagePlugboardBack">Plugboard</div>
        <div className={`enigma-stage ${state.activeStage === 'stageLampboard' ? 'active' : ''}`} id="stageLampboard">Lampboard</div>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={reset}>Reset Enigma</button>
      </div>
    </div>
  );
};

export default EnigmaMachine;