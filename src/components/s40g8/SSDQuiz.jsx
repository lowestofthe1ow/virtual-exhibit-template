/**
 * SSDQuiz.jsx
 *
 * A single-page multiple-choice quiz on how SSDs work, laid out like a simple
 * form: the viewer fills in their name, answers every question with radio
 * buttons, then presses "Send" once at the bottom. Submitting grades all the
 * answers at once and reveals the score, marking each question right or wrong
 * with a short explanation.
 *
 * ## Learning Notes
 * This component demonstrates several key React concepts:
 * - Controlled inputs: the name fields and every radio group are driven by
 *   state, so React is the single source of truth for what the viewer typed or
 *   picked.
 *
 * - One piece of state for many inputs: `answers` is an array where `answers[i]`
 *   is the option index chosen for question i. Selecting a radio copies the
 *   array (`[...prev]`) and sets one slot, so we never mutate state in place.
 *
 * - Conditional rendering: the same markup shows a neutral form before
 *   submitting and a graded form (colors, explanations, score banner) after,
 *   based on the `submitted` flag.
 *
 * - Derived UI: the score and the "answer every question" guard are computed
 *   from state on each render, so there is no extra state to keep in sync.
 *
 * ## Props
 *   None. The quiz is self-contained -- just drop it in.
 *
 * ## Usage Example
 *   <SSDQuiz />
 *
 * ## How to customize
 *   - Add or edit a question -> the `questions` array
 *   - Each option has `text`; the correct one is marked `correct: true`
 *   - `explanation` is shown under the question after submitting
 */

import { useState } from "react";
import "../../styles/s40g8/component-tokens.css";

// -- Quiz data --------------------------------------------
// Each question has the prompt `text`, a list of `options` (exactly one marked
// `correct`), and an `explanation` revealed once the form is submitted.
const questions = [
  {
    text: "What does the abbreviation “SSD” stand for?",
    options: [
      { text: "Solid State Drive", correct: true },
      { text: "System Storage Disk" },
      { text: "Serial Storage Device" },
      { text: "Static Silicon Drive" },
    ],
    explanation:
      "SSD stands for Solid State Drive. “Solid state” means it has no moving parts — unlike a mechanical hard drive, everything is done electronically in flash memory chips.",
  },
  {
    text: "Which type of memory does a typical SSD use to store your data?",
    options: [
      { text: "Spinning magnetic platters" },
      { text: "NAND flash memory", correct: true },
      { text: "Volatile DRAM only" },
      { text: "Optical discs" },
    ],
    explanation:
      "SSDs store data in NAND flash memory — a non-volatile memory that keeps its contents even without power. An HDD, by contrast, stores data as magnetic charges on spinning platters.",
  },
  {
    text: "Why is an SSD generally much faster than a mechanical hard drive?",
    options: [
      { text: "It spins its platters faster" },
      { text: "It uses a larger cooling fan" },
      {
        text: "It has no moving parts, so there is no seek time waiting for a head to move",
        correct: true,
      },
      { text: "It compresses every file automatically" },
    ],
    explanation:
      "An HDD must physically move a read/write head and wait for the platter to rotate into position (seek time + rotational latency). An SSD accesses any flash cell electronically, so that mechanical delay disappears.",
  },
  {
    text: "What is the job of the SSD controller?",
    options: [
      { text: "It spins the drive up to speed" },
      {
        text: "It manages where data is written, handles wear-leveling, and talks to the computer",
        correct: true,
      },
      { text: "It supplies power to the whole computer" },
      { text: "It only lights up the drive's LED" },
    ],
    explanation:
      "The controller is the SSD's “brain.” It decides which flash cells to write to, spreads writes evenly (wear-leveling), performs error correction, and communicates with the host over the interface.",
  },
  {
    text: "NAND flash cells wear out after many write cycles. What technique spreads writes evenly to make the drive last longer?",
    options: [
      { text: "Defragmentation" },
      { text: "Overclocking" },
      { text: "Wear-leveling", correct: true },
      { text: "Disk mirroring" },
    ],
    explanation:
      "Wear-leveling makes the controller distribute writes across all the flash cells instead of hammering the same ones. This prevents any single block from wearing out early and extends the drive's lifespan.",
  },
  {
    text: "Data in NAND flash is organized into pages grouped into blocks. What is unusual about how flash is erased?",
    options: [
      { text: "You can erase a single byte at a time" },
      {
        text: "You can write a page, but you can only erase a whole block at once",
        correct: true,
      },
      { text: "Flash memory can never be erased" },
      { text: "Erasing happens automatically every second" },
    ],
    explanation:
      "Flash can be written one page at a time, but it can only be erased one full block at a time. This asymmetry is why SSDs use tricks like garbage collection and the TRIM command to stay efficient.",
  },
  {
    text: "Which modern interface lets SSDs reach the highest speeds by connecting directly over PCI Express?",
    options: [
      { text: "SATA" },
      { text: "USB 2.0" },
      { text: "NVMe (over PCIe)", correct: true },
      { text: "IDE / PATA" },
    ],
    explanation:
      "NVMe drives connect over PCI Express lanes, bypassing the older SATA bottleneck. A SATA SSD tops out around 550 MB/s, while an NVMe SSD can reach several thousand MB/s.",
  },
];

// -- Styles -----------------------------------------------
// The var(--…) values are CSS custom properties from the page's theme, matching
// the other components in this exhibit. A few styles are functions that take a
// flag and return a style object so the look can change once the form is graded.
const styles = {
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-text-primary)",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "var(--font-sans)",
    color: "var(--color-text-primary)",
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-secondary)",
    borderRadius: "var(--border-radius-md)",
  },
  subLabel: {
    display: "block",
    fontSize: 12,
    color: "var(--color-text-secondary)",
    marginTop: 6,
  },
  question: {
    paddingTop: "1.5rem",
    marginTop: "1.5rem",
    borderTop: "0.5px solid var(--color-border-tertiary)",
  },
  questionNo: {
    margin: "0 0 0.75rem",
    fontSize: 16,
    fontWeight: 700,
    color: "var(--color-text-primary)",
  },
  prompt: {
    margin: "0 0 1rem",
    fontSize: 15,
    lineHeight: 1.5,
    color: "var(--color-text-primary)",
  },
  option: (state) => ({
    // state: "idle" | "correct" | "wrong"
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    cursor: state === "idle" ? "pointer" : "default",
    padding: "8px 12px",
    marginBottom: 6,
    borderRadius: "var(--border-radius-md)",
    border:
      state === "correct"
        ? "2px solid #2f9e44"
        : state === "wrong"
          ? "2px solid #e03131"
          : "0.5px solid transparent",
    background:
      state === "correct"
        ? "rgba(47, 158, 68, 0.10)"
        : state === "wrong"
          ? "rgba(224, 49, 49, 0.10)"
          : "transparent",
    fontSize: 14,
    lineHeight: 1.5,
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-sans)",
  }),
  explanation: (correct) => ({
    marginTop: 10,
    padding: "12px 14px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderLeft: `3px solid ${correct ? "#2f9e44" : "#e03131"}`,
    background: "var(--color-background-secondary)",
    fontSize: 14,
    lineHeight: 1.6,
    color: "var(--color-text-primary)",
  }),
  send: (enabled) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: 15,
    fontWeight: 600,
    padding: "10px 32px",
    borderRadius: "var(--border-radius-md)",
    border: "none",
    background: "#e03131",
    color: "#fff",
    opacity: enabled ? 1 : 0.45,
    fontFamily: "var(--font-sans)",
  }),
  ghostBtn: {
    cursor: "pointer",
    fontSize: 14,
    padding: "8px 18px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-secondary)",
    background: "transparent",
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-sans)",
  },
};

export default function SSDQuiz() {
  // The two name fields, kept as controlled inputs.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // `answers[i]` is the option index chosen for question i (or undefined).
  const [answers, setAnswers] = useState([]);
  // `submitted` flips to true once the viewer presses Send, revealing grading.
  const [submitted, setSubmitted] = useState(false);
  // Set true when Send is pressed with unanswered questions, to nudge the viewer.
  const [showMissing, setShowMissing] = useState(false);

  const totalQ = questions.length;
  const answeredCount = answers.filter((a) => a !== undefined).length;
  const allAnswered = answeredCount === totalQ;

  // Record the picked option for a question without mutating the old array.
  function pick(qIndex, optIndex) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  }

  // Grade the form. If anything is unanswered, nudge instead of submitting.
  function handleSend() {
    if (!allAnswered) {
      setShowMissing(true);
      return;
    }
    setShowMissing(false);
    setSubmitted(true);
  }

  // Clear everything so the quiz can be retaken.
  function handleReset() {
    setFirstName("");
    setLastName("");
    setAnswers([]);
    setSubmitted(false);
    setShowMissing(false);
  }

  // Count correct answers (used for the score banner after submitting).
  const score = answers.reduce(
    (sum, choice, i) => sum + (questions[i]?.options[choice]?.correct ? 1 : 0),
    0,
  );

  return (
    <div style={{ padding: "1.5rem 0", fontFamily: "var(--font-sans)" }}>
      {/* -- Score banner (after submitting) -- */}
      {submitted && (
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "2px solid var(--color-border-info)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1.25rem",
            marginBottom: "0.5rem",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {firstName || lastName
              ? `Thanks, ${[firstName, lastName].filter(Boolean).join(" ")} — your score`
              : "Your score"}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              margin: "2px 0 4px",
            }}
          >
            {score} / {totalQ}
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
            {score === totalQ
              ? "Perfect score — you really know your SSDs!"
              : score >= totalQ * 0.6
                ? "Nice work — you've got a solid grasp of how SSDs work."
                : "Good start — scroll back up and revisit the exhibit, then try again."}
          </div>
        </div>
      )}

      {/* -- Name -- */}
      <div style={styles.question}>
        <span style={styles.label}>Name</span>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <input
              style={styles.input}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={submitted}
              aria-label="First name"
            />
            <span style={styles.subLabel}>First Name</span>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <input
              style={styles.input}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={submitted}
              aria-label="Last name"
            />
            <span style={styles.subLabel}>Last name</span>
          </div>
        </div>
      </div>

      {/* -- Questions (all shown at once) -- */}
      {questions.map((q, qi) => {
        const choice = answers[qi];
        return (
          <div key={qi} style={styles.question}>
            <h3 style={styles.questionNo}>Question {qi + 1}</h3>
            <p style={styles.prompt}>{q.text}</p>

            {q.options.map((opt, oi) => {
              let state = "idle";
              if (submitted) {
                if (opt.correct) state = "correct";
                else if (choice === oi) state = "wrong";
              }
              return (
                <label key={oi} style={styles.option(state)}>
                  <input
                    type="radio"
                    name={`q${qi}`}
                    checked={choice === oi}
                    onChange={() => pick(qi, oi)}
                    disabled={submitted}
                    style={{ marginTop: 3, flexShrink: 0 }}
                  />
                  <span>{opt.text}</span>
                </label>
              );
            })}

            {/* Explanation appears under each question once graded */}
            {submitted && (
              <div style={styles.explanation(q.options[choice]?.correct)}>
                <strong>
                  {q.options[choice]?.correct ? "Correct! " : "Not quite. "}
                </strong>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* -- Send / Retake -- */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {!submitted ? (
          <>
            <button style={styles.send(true)} onClick={handleSend}>
              Send
            </button>
            {showMissing && !allAnswered && (
              <span style={{ fontSize: 13, color: "#e03131" }}>
                Please answer all {totalQ} questions ({answeredCount}/{totalQ}{" "}
                done).
              </span>
            )}
          </>
        ) : (
          <button style={styles.ghostBtn} onClick={handleReset}>
            &#8634; Retake quiz
          </button>
        )}
      </div>
    </div>
  );
}
