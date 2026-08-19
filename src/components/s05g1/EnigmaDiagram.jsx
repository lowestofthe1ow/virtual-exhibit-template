import { useState, useMemo, useRef, useCallback } from "react";
import { ALPHABET, encodeLetterPath } from "../../utils/s05g1/enigmaUtils.js";

export default function EnigmaDiagram() {
  const [inputLetter, setInputLetter] = useState("A");
  const [state, setState] = useState(0);
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  const path = useMemo(() => encodeLetterPath(inputLetter, state), [inputLetter, state]);

  const animate = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimStep(0);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step > 4) {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
        return;
      }
      setAnimStep(step);
    }, 550);
  }, [isAnimating]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAnimStep(-1);
    setIsAnimating(false);
  }, []);

  const stages = [
    { label: "Input", value: path.input },
    { label: "Rotor →", value: path.afterRotor },
    { label: "Reflector", value: path.afterReflector },
    { label: "← Rotor", value: path.outputLetter },
    { label: "Output", value: path.outputLetter },
  ];

  return (
    <div className="enigma-diagram" role="figure" aria-label="Enigma encoding pipeline">
      <div className="enigma-diagram-title">Signal Path Visualization</div>

      <div className="enigma-diagram-pipeline">
        {stages.map((stage, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && (
              <div className={`enigma-diagram-arrow${animStep >= i ? " active" : ""}`}>
                ▸
              </div>
            )}
            <div className={`enigma-diagram-stage${animStep >= i ? " active" : ""}`}>
              <span className="enigma-diagram-stage-label">{stage.label}</span>
              <span className="enigma-diagram-stage-value">
                {animStep >= i ? stage.value : "·"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="enigma-diagram-controls">
        <label>
          <span className="enigma-diagram-state-label">Letter: </span>
          <select
            className="enigma-diagram-select"
            value={inputLetter}
            onChange={(e) => { setInputLetter(e.target.value); reset(); }}
            disabled={isAnimating}
          >
            {ALPHABET.split("").map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="enigma-diagram-state-label">State: </span>
          <select
            className="enigma-diagram-select"
            value={state}
            onChange={(e) => { setState(Number(e.target.value)); reset(); }}
            disabled={isAnimating}
          >
            {Array.from({ length: 26 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>

        <button
          className="enigma-diagram-btn"
          onClick={animStep >= 0 ? reset : animate}
          type="button"
        >
          {animStep >= 0 ? "Reset" : "Trace Signal ▶"}
        </button>
      </div>
    </div>
  );
}
