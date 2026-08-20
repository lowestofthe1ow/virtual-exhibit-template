/**
 * ArchQuiz.jsx
 *
 * A scored knowledge-check quiz on the three milestones covered in this exhibit:
 * ENIAC (1945), IBM System/360 (1964), and the Intel 4004 (1971). The viewer
 * answers multiple-choice questions, each with one correct option, and sees a
 * final score plus a review of every question at the end.
 *
 * ## Learning Notes
 * Mirrors the same patterns as DistroQuiz.jsx:
 * - useState for `step` (which question we're on), `answers` (choice per question),
 *   and `selected` (the option highlighted before "Next" is pressed).
 * - Data-driven UI: all questions/answers/explanations live in the `questions`
 *   array up top, so editing the quiz never requires touching the JSX below.
 * - Conditional rendering switches between intro / question / result screens.
 *
 * ## Usage Example
 *   <ArchQuiz client:load />
 */

import { useState } from "react";

// -- Quiz data --------------------------------------------
// Each question has the prompt, a list of options, the index of the correct
// option, and a short explanation shown during the review at the end.
const questions = [
  {
    text: 'What made ENIAC\'s "programming" so labor-intensive?',
    options: [
      "It had to be rewired and switched by hand for each new task",
      "It required a punch-card compiler to be recompiled",
      "It needed a monthly firmware update",
      "It only accepted programs written in assembly",
    ],
    correct: 0,
    explain:
      "ENIAC had no stored-program memory -- operators physically re-plugged cables and set switches to change what it computed.",
  },
  {
    text: "Roughly how many vacuum tubes powered ENIAC?",
    options: ["1,800", "18,000", "180,000", "1,800,000"],
    correct: 1,
    explain:
      "ENIAC used about 18,000 vacuum tubes, which is also why it ran hot, drew huge amounts of power, and filled an entire room.",
  },
  {
    text: "What was the big architectural innovation of the IBM System/360?",
    options: [
      "It was the first computer to use a mouse",
      "It replaced tubes with punch cards entirely",
      "A single instruction set architecture shared across a whole family of models",
      "It eliminated the need for an operating system",
    ],
    correct: 2,
    explain:
      "System/360 let software run unmodified across many different hardware models -- decoupling programs from the specific machine they ran on.",
  },
  {
    text: "What component replaced the vacuum tube in the System/360 generation?",
    options: ["The transistor", "The relay", "The punch card", "The silicon wafer"],
    correct: 0,
    explain:
      "Discrete transistors were smaller, cooler-running, and far more reliable than the fragile tubes they replaced.",
  },
  {
    text: "What was the key breakthrough of the Intel 4004?",
    options: [
      "It was the first computer with color graphics",
      "It put an entire CPU onto a single silicon chip",
      "It introduced the first hard disk drive",
      "It was the first machine to run Linux",
    ],
    correct: 1,
    explain:
      "The 4004 integrated the control unit, registers, and ALU onto one chip -- work that previously took cabinets of hardware.",
  },
  {
    text: "Which best orders these three milestones from oldest to newest?",
    options: [
      "Intel 4004 -> ENIAC -> System/360",
      "System/360 -> ENIAC -> Intel 4004",
      "ENIAC -> System/360 -> Intel 4004",
      "ENIAC -> Intel 4004 -> System/360",
    ],
    correct: 2,
    explain:
      "ENIAC (1945) came first, System/360 (1964) next, and the Intel 4004 (1971) completed the shift to single-chip computing.",
  },
];

// -- Styles (matches DistroQuiz's theme-variable approach) --
const styles = {
  progressBar: (filled) => ({
    flex: 1,
    height: 4,
    borderRadius: 2,
    background: filled ? "var(--color-text-primary)" : "var(--color-border-tertiary)",
    transition: "background 0.2s",
  }),
  optionBtn: (state) => ({
    // state: "idle" | "selected" | "correct" | "wrong"
    position: "relative",
    cursor: state === "locked" ? "default" : "pointer",
    textAlign: "left",
    padding: "12px 14px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: "var(--border-radius-md)",
    border:
      state === "correct"
        ? "2px solid #4CAF50"
        : state === "wrong"
          ? "2px solid #e0524b"
          : state === "selected"
            ? "2px solid var(--color-border-info)"
            : "0.5px solid var(--color-border-secondary)",
    background:
      state === "correct"
        ? "rgba(76,175,80,0.12)"
        : state === "wrong"
          ? "rgba(224,82,75,0.12)"
          : state === "selected"
            ? "var(--color-background-info)"
            : "var(--color-background-primary)",
    transition: "border-color 0.12s, background 0.12s",
    fontFamily: "var(--font-sans)",
  }),
  radio: (state) => ({
    // state: "idle" | "selected" | "correct" | "wrong"
    flexShrink: 0,
    width: 24,
    height: 24,
    borderRadius: "50%",
    border:
      state === "correct"
        ? "2.5px solid #4CAF50"
        : state === "wrong"
          ? "2.5px solid #e0524b"
          : state === "selected"
            ? "2.5px solid var(--color-text-info)"
            : "2.5px solid #8a8a8a",
    background: "var(--color-background-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.12s",
  }),
  radioFill: (state) => ({
    width: 13,
    height: 13,
    borderRadius: "50%",
    background: state === "correct" ? "#4CAF50" : state === "wrong" ? "#e0524b" : "var(--color-text-info)",
  }),
  nextBtn: (enabled) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: 14,
    padding: "8px 18px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-secondary)",
    background: "transparent",
    color: "var(--color-text-primary)",
    opacity: enabled ? 1 : 0.35,
    fontFamily: "var(--font-sans)",
  }),
};

export default function ArchQuiz() {
  const [step, setStep] = useState(0); // 0 = intro, 1..totalQ = questions, >totalQ = result
  const [answers, setAnswers] = useState([]); // chosen option index per question
  const [selected, setSelected] = useState(null); // choice on current question, before locking in
  const [locked, setLocked] = useState(false); // true once an answer is submitted for this question

  const totalQ = questions.length;
  const isIntro = step === 0;
  const isResult = step > totalQ;
  const currentQ = questions[step - 1];

  function handleSelect(i) {
    if (locked) return; // no changing your answer after submitting
    setSelected(i);
  }

  function handleSubmit() {
    if (selected === null) return;
    setLocked(true);
  }

  function handleNext() {
    setAnswers((prev) => [...prev, selected]);
    setSelected(null);
    setLocked(false);
    setStep((s) => s + 1);
  }

  function handleRestart() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setLocked(false);
  }

  const score = isResult ? answers.reduce((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0) : 0;

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {/* -- Intro -- */}
      {isIntro && (
        <div>
          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: "1.25rem",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Test what you've learned about ENIAC, the IBM System/360, and the Intel 4004 across {totalQ} quick
            questions.
          </p>
          <button style={styles.nextBtn(true)} onClick={() => setStep(1)}>
            Start the quiz →
          </button>
        </div>
      )}

      {/* -- Question -- */}
      {!isIntro && !isResult && currentQ && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem" }}>
            {questions.map((_, i) => (
              <div key={i} style={styles.progressBar(i < step - 1 || (i === step - 1 && locked))} />
            ))}
          </div>

          <p
            style={{
              fontSize: 13,
              color: "var(--color-text-secondary)",
              margin: "0 0 0.4rem",
            }}
          >
            Question {step} of {totalQ}
          </p>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: 18, fontWeight: 500 }}>{currentQ.text}</h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: "1.25rem",
            }}
          >
            {currentQ.options.map((opt, i) => {
              let state = "idle";
              if (locked) {
                if (i === currentQ.correct) state = "correct";
                else if (i === selected) state = "wrong";
                else state = "locked";
              } else if (selected === i) {
                state = "selected";
              }
              return (
                <button
                  key={i}
                  style={styles.optionBtn(state)}
                  onClick={() => handleSelect(i)}
                  aria-pressed={selected === i}
                  disabled={locked}
                >
                  <span style={styles.radio(state)}>
                    {(state === "selected" || state === "correct" || state === "wrong") && (
                      <span style={styles.radioFill(state)} />
                    )}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--color-text-primary)" }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation shown once the answer is locked in */}
          {locked && (
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--color-text-secondary)",
                background: "var(--color-background-secondary)",
                padding: "10px 14px",
                borderRadius: "var(--border-radius-md)",
                marginBottom: "1.25rem",
              }}
            >
              {selected === currentQ.correct ? "Correct! " : "Not quite. "}
              {currentQ.explain}
            </p>
          )}

          {!locked ? (
            <button style={styles.nextBtn(selected !== null)} disabled={selected === null} onClick={handleSubmit}>
              Submit answer
            </button>
          ) : (
            <button style={styles.nextBtn(true)} onClick={handleNext}>
              {step === totalQ ? "See my score →" : "Next question →"}
            </button>
          )}
        </div>
      )}

      {/* -- Result -- */}
      {isResult && (
        <div>
          <div
            style={{
              background: "var(--color-background-primary)",
              border: "2px solid var(--color-border-info)",
              borderRadius: "var(--border-radius-lg)",
              padding: "1.25rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Your score
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              {score} / {totalQ}
            </div>
          </div>

          {/* Per-question review */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: "1.25rem",
            }}
          >
            {questions.map((q, i) => {
              const correct = answers[i] === q.correct;
              return (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "var(--border-radius-md)",
                    border: `0.5px solid var(--color-border-secondary)`,
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      color: correct ? "#4CAF50" : "#e0524b",
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    {correct ? "✓ Correct" : "✕ Missed"} — Q{i + 1}
                  </div>
                  <div style={{ color: "var(--color-text-secondary)" }}>{q.explain}</div>
                </div>
              );
            })}
          </div>

          <button style={styles.nextBtn(true)} onClick={handleRestart}>
            ↺ Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}
