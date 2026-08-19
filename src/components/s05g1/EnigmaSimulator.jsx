import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { ALPHABET, encodeLetter, encodeWord } from "../../utils/s05g1/enigmaUtils.js";

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Z", "U", "I", "O"],
  ["A", "S", "D", "F", "G", "H", "J", "K"],
  ["P", "Y", "X", "C", "V", "B", "N", "M", "L"],
];

const CHALLENGE_PLAINTEXT = "HELP";
const CHALLENGE_STATE = 7;

export default function EnigmaSimulator() {
  const [step, setStep] = useState(0);
  const [initialState, setInitialState] = useState(0);
  const [rotorState, setRotorState] = useState(0);
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");
  const [litLamp, setLitLamp] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [savedMessage, setSavedMessage] = useState("");
  const [savedOutput, setSavedOutput] = useState("");

  const challenge3Cipher = useMemo(
    () => encodeWord(CHALLENGE_PLAINTEXT, CHALLENGE_STATE),
    []
  );

  const containerRef = useRef(null);
  const lampTimeoutRef = useRef(null);

  const pressKey = useCallback(
    (letter) => {
      if (step === 0 || step === 5) return;

      const encoded = encodeLetter(letter, rotorState);
      setMessage((m) => m + letter);
      setOutput((o) => o + encoded);
      setRotorState((s) => (s + 1) % 26);
      setLitLamp(encoded);
      setPressedKey(letter);

      if (lampTimeoutRef.current) clearTimeout(lampTimeoutRef.current);
      lampTimeoutRef.current = setTimeout(() => {
        setLitLamp(null);
        setPressedKey(null);
      }, 250);
    },
    [rotorState, step]
  );

  useEffect(() => {
    const handler = (e) => {
      if (step === 0 || step === 5) return;
      const key = e.key.toUpperCase();
      if (ALPHABET.includes(key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        pressKey(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pressKey, step]);

  useEffect(() => {
    if (step === 1 && message === "AAAAAA") {
      const unique = new Set(output.split(""));
      if (unique.size > 1) {
        triggerSuccess(
          "Notice how each 'A' encoded to a different letter! The rotor advances after every keypress, changing the cipher each time."
        );
        setCompletedChallenges((s) => new Set([...s, 1]));
      }
    }

    if (
      step === 3 &&
      savedOutput.length > 0 &&
      message.length === savedOutput.length
    ) {
      if (message === savedOutput && output === savedMessage) {
        triggerSuccess(
          "The encrypted text decrypted back to your original message! The Enigma is its own inverse — the same machine settings encrypt and decrypt."
        );
        setCompletedChallenges((s) => new Set([...s, 2]));
      }
    }

    if (step === 4 && message.length === challenge3Cipher.length) {
      if (message === challenge3Cipher && output === CHALLENGE_PLAINTEXT) {
        triggerSuccess(
          `Message decoded: "${CHALLENGE_PLAINTEXT}"! You found rotor state ${CHALLENGE_STATE}. The Allies' ability to crack Enigma is widely credited with shortening WW2 by two years.`
        );
        setCompletedChallenges((s) => new Set([...s, 3]));
      }
    }
  }, [message, output, step, savedMessage, savedOutput, challenge3Cipher]);

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
  };

  const resetMachine = useCallback(() => {
    setRotorState(initialState);
    setMessage("");
    setOutput("");
    setLitLamp(null);
    setPressedKey(null);
    setShowSuccess(false);
    setSuccessMsg("");
  }, [initialState]);

  const startChallenge = (num) => {
    setShowSuccess(false);
    setSuccessMsg("");
    if (num === 1) {
      setInitialState(0);
      setRotorState(0);
    } else if (num === 2) {
      setInitialState(0);
      setRotorState(0);
      setSavedMessage("");
      setSavedOutput("");
    } else if (num === 4) {
      setInitialState(0);
      setRotorState(0);
    }
    setMessage("");
    setOutput("");
    setStep(num);
  };

  const saveAndContinue = () => {
    setSavedMessage(message);
    setSavedOutput(output);
    setRotorState(0);
    setMessage("");
    setOutput("");
    setStep(3);
  };

  const goToFreeMode = () => {
    setInitialState(0);
    setRotorState(0);
    setMessage("");
    setOutput("");
    setShowSuccess(false);
    setStep(6);
  };

  const updateInitialState = (e) => {
    const next = Number(e.target.value);
    setInitialState(next);
    setRotorState(next);
    setMessage("");
    setOutput("");
    setShowSuccess(false);
  };

  const activeChallenge =
    step === 1 ? 1 : step === 2 || step === 3 ? 2 : step === 4 ? 3 : 0;

  const isKeyboardEnabled =
    step >= 1 && step <= 4 || step === 6;

  const challengeInfo = {
    1: {
      title: "Challenge 1 — The Changing Wiring",
      desc: "The Enigma's encryption changes with every keypress. Type the letter 'A' six times to observe this in action.",
      hint: "Type: A A A A A A",
    },
    2: {
      title: "Challenge 2 — The Two-Way Street (Encrypt)",
      desc: "Type any word (at least 3 letters) to encrypt it. When ready, save your result to proceed.",
      hint: null,
    },
    3: {
      title: "Challenge 2 — The Two-Way Street (Decrypt)",
      desc: "Now type the encrypted output below. Watch what happens — the same machine decrypts it back!",
      hint: savedOutput,
    },
    4: {
      title: "Challenge 3 — The Intercept",
      desc: `You've intercepted an encoded enemy transmission. Adjust the rotor state and type the ciphertext below to decode it. Can you find the right setting?`,
      hint: challenge3Cipher,
    },
    6: {
      title: "Free Mode",
      desc: "Experiment freely with the Enigma machine. Adjust the rotor state and type anything!",
      hint: null,
    },
  };

  const info = challengeInfo[step] || {};

  return (
    <section className="enigma-sim" ref={containerRef} aria-label="Enigma simulator">
      <div className="enigma-progress">
        {[1, 2, 3].map((n, i) => {
          const done = completedChallenges.has(n);
          const active = activeChallenge === n;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <div
                  className={`enigma-progress-connector${
                    completedChallenges.has(n - 1) ? " done" : ""
                  }`}
                />
              )}
              <div
                className={`enigma-progress-step${
                  active ? " active" : ""
                }${done ? " completed" : ""}`}
              >
                <div className="enigma-progress-dot">
                  {done ? "✓" : n}
                </div>
                <span>
                  {n === 1
                    ? "Changing Wiring"
                    : n === 2
                    ? "Two-Way Street"
                    : "The Intercept"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <div className="enigma-intro-screen">
          <div className="enigma-intro-icon">III</div>
          <h3 className="enigma-intro-title">Enigma Machine Simulator</h3>
          <p className="enigma-intro-desc">
            Complete three challenges to discover the key properties of the
            Enigma cipher. Each challenge reveals a fundamental aspect of how
            the machine works.
          </p>
          <button
            className="enigma-btn enigma-btn-primary"
            onClick={() => startChallenge(1)}
            type="button"
          >
            Begin Challenges ▶
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="enigma-complete-screen">
          <div className="enigma-intro-icon">///</div>
          <h3 className="enigma-intro-title">All Challenges Complete!</h3>
          <div className="enigma-complete-score">
            {["I", "II", "III"].map((label, i) => (
              <div className="enigma-complete-badge" key={i}>
                {label}
              </div>
            ))}
          </div>
          <p className="enigma-intro-desc">
            You've discovered the three key properties of the Enigma machine:
            the changing wiring (rotor), the symmetric encryption (reflector),
            and the power of codebreaking.
          </p>
          <button
            className="enigma-btn enigma-btn-primary"
            onClick={goToFreeMode}
            type="button"
          >
            Try Free Mode ▶
          </button>
        </div>
      )}

      {(step >= 1 && step <= 4 || step === 6) && (
        <>
          <div className="enigma-challenge-card">
            <h3 className="enigma-challenge-title">{info.title}</h3>
            <p className="enigma-challenge-desc">{info.desc}</p>
            {info.hint && (
              <div className="enigma-challenge-hint">{info.hint}</div>
            )}
            {step === 3 && (
              <div style={{ marginTop: "0.5rem" }}>
                <div className="enigma-saved-display">
                  <span className="enigma-saved-label">Your original message</span>
                  <span className="enigma-saved-value">{savedMessage}</span>
                </div>
              </div>
            )}
          </div>

          <div className="enigma-machine">
            <div className="enigma-rotor-area">
              <span className="enigma-rotor-label">Rotor</span>
              <div className="enigma-rotor-drum">
                <div className="enigma-rotor-shade top"></div>
                <div className="enigma-rotor-letters" style={{ transform: `translateY(${-rotorState * 40}px)` }}>
                  {ALPHABET.split("").map((letter, i) => {
                    const prev = ALPHABET[(i - 1 + 26) % 26];
                    const next = ALPHABET[(i + 1) % 26];
                    return (
                      <div className="enigma-rotor-slot" key={i}>
                        <span className="enigma-rotor-notch">{prev}</span>
                        <span className="enigma-rotor-current">{letter}</span>
                        <span className="enigma-rotor-notch">{next}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="enigma-rotor-shade bottom"></div>
                <div className="enigma-rotor-indicator"></div>
              </div>
            </div>

            <div className="enigma-lampboard">
              {keyboardRows.map((row, ri) => (
                <div className="enigma-lamp-row" key={ri}>
                  {row.map((letter) => (
                    <div
                      key={letter}
                      className={`enigma-lamp${
                        litLamp === letter ? " lit" : ""
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="enigma-keyboard">
              {keyboardRows.map((row, ri) => (
                <div className="enigma-key-row" key={ri}>
                  {row.map((letter) => (
                    <button
                      key={letter}
                      type="button"
                      className={`enigma-key${
                        pressedKey === letter ? " pressed" : ""
                      }`}
                      onClick={() => pressKey(letter)}
                      disabled={!isKeyboardEnabled}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="enigma-tapes">
              <div className="enigma-tape-group">
                <span className="enigma-tape-label">Input</span>
                <div className="enigma-tape">
                  {message || (
                    <span className="enigma-tape-placeholder">
                      type a message…
                    </span>
                  )}
                </div>
              </div>
              <div className="enigma-tape-group">
                <span className="enigma-tape-label">Output</span>
                <div className="enigma-tape output-tape">
                  {output || (
                    <span className="enigma-tape-placeholder">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showSuccess && (
            <div className="enigma-success-overlay">
              <span className="enigma-success-icon">✓</span>
              <p className="enigma-success-text">{successMsg}</p>
            </div>
          )}

          <div className="enigma-controls">
            {(step === 4 || step === 6) && (
              <div className="enigma-slider-group">
                <span className="enigma-slider-label">
                  Initial State: {initialState}
                </span>
                <input
                  type="range"
                  className="enigma-slider"
                  min={0}
                  max={25}
                  value={initialState}
                  onChange={updateInitialState}
                />
              </div>
            )}

            <button
              className="enigma-btn enigma-btn-reset"
              onClick={resetMachine}
              type="button"
            >
              Reset
            </button>

            {step === 2 && message.length >= 3 && !showSuccess && (
              <button
                className="enigma-btn enigma-btn-primary"
                onClick={saveAndContinue}
                type="button"
              >
                Save &amp; Continue ▶
              </button>
            )}

            {showSuccess && (step === 1 || step === 3 || step === 4) && (
              <button
                className="enigma-btn enigma-btn-primary"
                onClick={() => step === 4 ? setStep(5) : startChallenge(step === 1 ? 2 : 4)}
                type="button"
              >
                {step === 4 ? "Finish ▶" : "Next Challenge ▶"}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
