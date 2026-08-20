import { useState } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "According to the video, what is the most common data transfer speed for USB-C ports?",
    options: ["5 Gbps", "10 Gbps", "20 Gbps", "40 Gbps"],
    answer: "10 Gbps",
    explanation: "The video states that the most common USB-C speed is 10 Gbps — twice as fast as the rectangular USB 3.0 ports we used for decades.",
  },
  {
    id: 2,
    question: "According to the video, what is the maximum data transfer speed available on USB-C ports that support Thunderbolt?",
    options: ["10 Gbps", "20 Gbps", "40 Gbps", "80 Gbps"],
    answer: "40 Gbps",
    explanation: "As mentioned in the video, Thunderbolt-enabled USB-C ports reach up to 40 Gbps — twice as fast as the fastest non-Thunderbolt USB-C port at 20 Gbps.",
  },
  {
    id: 3,
    question: "Which USB-C pin is responsible for detecting plug orientation and negotiating power roles?",
    options: ["VBUS", "SBU1", "CC1", "D+"],
    answer: "CC1",
    explanation: "The CC (Configuration Channel) pin detects which way the plug is inserted, assigns host vs device roles, and runs the Power Delivery protocol messages.",
  },
  {
    id: 4,
    question: "According to the video, what can a USB-C port on a laptop or desktop do in reverse?",
    options: [
      "Transfer files to a phone wirelessly",
      "Charge the internal batteries of smaller devices",
      "Mirror the screen to a monitor",
      "Act as a USB hub",
    ],
    answer: "Charge the internal batteries of smaller devices",
    explanation: "The video explains that USB-C ports on laptops and desktops can work in reverse — charging the internal batteries of smaller connected devices like phones and tablets.",
  },
  {
    id: 5,
    question: "According to the video, what is true about a standard USB-C cable?",
    options: [
      "It has different connectors on each end",
      "It only works in one orientation",
      "It has the same connector on both ends",
      "It requires an adapter to plug in",
    ],
    answer: "It has the same connector on both ends",
    explanation: "The video points out that standard USB-C cables have the same connector on both ends — so you never have to figure out which end goes where, unlike older USB cables.",
  },
];

const WRAP = {
  fontFamily: "var(--font-sans)",
  background: "#111116",
  borderRadius: "16px",
  padding: "28px 24px",
};

export default function UsbMultipleChoiceQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);

  const question = QUESTIONS[currentQ];
  const isCorrect = selected === question?.answer;

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === question.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    setAnswers(a => [...a, { question: question.question, selected, correct: question.answer, wasCorrect: isCorrect }]);
    if (currentQ + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswers([]);
  };

  if (done) {
    return (
      <div style={WRAP}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>
            {score === QUESTIONS.length ? "🏆" : score >= 3 ? "👍" : "📚"}
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>
            {score} / {QUESTIONS.length}
          </div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
            {score === QUESTIONS.length
              ? "Perfect! You really know your USB-C."
              : score >= 3
              ? "Good work — review the ones you missed."
              : "Keep studying the pin diagram and type specs!"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {answers.map((a, i) => (
            <div key={i} style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: `1px solid ${a.wasCorrect ? "#1D9E75" : "#D85A30"}44`,
              background: a.wasCorrect ? "rgba(29,158,117,0.08)" : "rgba(216,90,48,0.08)",
            }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>{a.wasCorrect ? "✅" : "❌"}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "500", color: "#fff", marginBottom: "3px" }}>
                    Q{i + 1}: {a.question}
                  </div>
                  {!a.wasCorrect && (
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                      Your answer: <span style={{ color: "#D85A30" }}>{a.selected}</span> — Correct: <span style={{ color: "#1D9E75" }}>{a.correct}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleRestart} style={{
          width: "100%", background: "#378ADD", color: "#fff",
          border: "none", borderRadius: "10px", padding: "13px",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={WRAP}>
      {/* Header - pin quiz style */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
        <span style={{ fontSize: "12px", letterSpacing: "0.1em", color: "#5EEAD4", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
          Question {currentQ + 1} / {QUESTIONS.length}
        </span>
        <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "'JetBrains Mono', monospace" }}>
          score {score}
        </span>
      </div>

      {/* Progress bar - pin quiz style */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "2px",
            background: i < currentQ ? "#5EEAD4" : i === currentQ ? "#2A2F3A" : "#1A1E27",
          }} />
        ))}
      </div>

      <div style={{ minHeight: "380px" }}>

      <div style={{
        fontSize: "16px", fontWeight: "600", color: "#fff", lineHeight: "1.5",
        marginBottom: "20px", padding: "16px 18px",
        background: "rgba(255,255,255,0.05)", borderRadius: "12px",
        borderLeft: "3px solid #378ADD",
      }}>
        {question.question}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = option === question.answer;

          let bg = "rgba(255,255,255,0.04)";
          let border = "1px solid rgba(255,255,255,0.1)";
          let color = "#fff";

          if (selected) {
            if (isAnswer) {
              bg = "rgba(29,158,117,0.15)";
              border = "1.5px solid #1D9E75";
              color = "#fff";
            } else if (isSelected) {
              bg = "rgba(216,90,48,0.15)";
              border = "1.5px solid #D85A30";
              color = "#fff";
            } else {
              bg = "rgba(255,255,255,0.02)";
              border = "1px solid rgba(255,255,255,0.06)";
              color = "rgba(255,255,255,0.3)";
            }
          }

          return (
            <button key={option} onClick={() => handleSelect(option)} disabled={!!selected} style={{
              padding: "13px 16px", borderRadius: "10px",
              border, background: bg, color,
              cursor: selected ? "default" : "pointer",
              textAlign: "left", fontSize: "14px",
              fontWeight: isSelected || (selected && isAnswer) ? "600" : "400",
              display: "flex", alignItems: "center", gap: "10px",
              transition: "all 0.15s",
            }}>
              <span style={{
                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                border: `1.5px solid ${selected && isAnswer ? "#1D9E75" : isSelected && selected ? "#D85A30" : "rgba(255,255,255,0.2)"}`,
                background: selected && isAnswer ? "#1D9E75" : isSelected && selected && !isAnswer ? "#D85A30" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", color: "#fff",
              }}>
                {selected && isAnswer ? "✓" : isSelected && selected && !isAnswer ? "✗" : ""}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{
          padding: "14px 16px", borderRadius: "10px", marginBottom: "16px",
          background: isCorrect ? "rgba(29,158,117,0.08)" : "rgba(216,90,48,0.08)",
          border: `1px solid ${isCorrect ? "#1D9E75" : "#D85A30"}44`,
        }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: isCorrect ? "#1D9E75" : "#D85A30", marginBottom: "5px" }}>
            {isCorrect ? "✅ Correct!" : "❌ Not quite!"}
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
            {question.explanation}
          </div>
        </div>
      )}

      </div>

      {selected && (
        <button onClick={handleNext} style={{
          width: "100%", background: isCorrect ? "#1D9E75" : "#378ADD",
          color: "#fff", border: "none", borderRadius: "10px",
          padding: "13px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}>
          {currentQ + 1 >= QUESTIONS.length ? "See results →" : "Next question →"}
        </button>
      )}
    </div>
  );
}