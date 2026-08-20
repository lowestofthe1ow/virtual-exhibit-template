import { useState } from "react";
import "../../styles/s40g6/usb-exhibit.css";

const QUESTIONS = [
  {
    id: 1,
    description: "You can tell a USB-C port's capabilities from its physical appearance, much like how USB-A ports are color-coded.",
    answer: false,
    explanation: "A USB-C port refers only to the physical form of the port itself; to know what a specific port's specification is, you'd need to consult the hardware manual of the device."
  },
  {
    id: 2,
    description: "All Thunderbolt ports are USB-C ports, but not all USB-C ports are Thunderbolt ports.",
    answer: true,
    explanation: "Thunderbolt ports are a specific designation of USB-C ports tailored to high performance, capable of high-speed data transfer, and connected directly to a device's PCIe lanes."
  },
  {
    id: 3,
    description: "Much like USB-A, USB-C still follows the standard USB specification with the exception of USB4, which is exclusive to USB-C.",
    answer: true,
    explanation: "The last shared specification between the two ports was USB 3.2; however, in 2019, USB4 was introduced and developed solely for the USB-C port; it is still backwards compatible with older USB 3.0 and 2.0 ports."
  },
  {
    id: 4,
    description: "USB-C was first developed in 2014 with an initial design document citing members from Intel, HP, Texas Instruments, and the USB Implementers Forum as main contributors.",
    answer: false,
    explanation: "Development of the USB-C specification began as early as 2012, with the first design of the 1.0 specification being published in 2014."
  },
  {
    id: 5,
    description: "USB-C is capable of data transfer, display in and out, and power delivery, but not audio in and out.",
    answer: false,
    explanation: "USB-C is capable of digital audio in and out."
  },
];

export default function UsbTrueOrFalseQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const question = QUESTIONS[currentQ];

  const handleAnswer = (answer) => {
    if (result) return;
    const isCorrect = answer === question.answer;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    setResult(null);
    if (currentQ + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrentQ(q => q + 1);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setResult(null);
    setDone(false);
  };

  if (done) {
    return (
      <div className="usb-exhibit-wrap" style={{ 
        background: "#111116", borderRadius: "16px", padding: "40px 32px", 
        textAlign: "center", fontFamily: "var(--font-sans)", 
        width: "100%", minWidth: 0, alignSelf: "stretch", boxSizing: "border-box" 
      }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>
          {score === QUESTIONS.length ? "🎉" : score >= QUESTIONS.length / 2 ? "👍" : "📚"}
        </div>
        <div style={{ fontSize: "28px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
          {score} / {QUESTIONS.length}
        </div>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
          {score === QUESTIONS.length ? "Perfect score! You know your USB-C facts." : score >= QUESTIONS.length / 2 ? "Good effort! Review the ones you missed." : "Keep studying — try to read the explanations carefully!"}
        </div>
        <button onClick={handleRestart} style={{ background: "#378ADD", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="usb-exhibit-wrap" style={{ 
      background: "#111116", 
      borderRadius: "16px", 
      padding: "28px 24px", 
      fontFamily: "var(--font-sans)", 
      width: "1500px",
      minWidth: 0,
      alignSelf: "stretch", // This prevents the Astro layout from shrinking it
      boxSizing: "border-box" 
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
        <span style={{ fontSize: "12px", letterSpacing: "0.1em", color: "#5EEAD4", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
          Question {currentQ + 1} / {QUESTIONS.length}
        </span>
        <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "'JetBrains Mono', monospace" }}>
          score {score}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "24px" }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "2px",
            background: i < currentQ ? "#5EEAD4" : i === currentQ ? "#2A2F3A" : "#1A1E27",
          }} />
        ))}
      </div>

      {/* Fixed height content */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "10px" }}>
          True or False Quiz
        </div>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "6px" }}>
          Determine if the statement below is true or false.
        </div>
        
        {/* Fixed height question box */}
        <div style={{
          fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6",
          marginBottom: "28px", padding: "14px 16px",
          background: "rgba(255,255,255,0.04)", borderRadius: "10px",
          borderLeft: "3px solid #378ADD", 
          height: "100px", 
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflowY: "auto",
          overflowWrap: "break-word",
        }}>
          {question.description}
        </div>

        {/* True / False buttons */}
        <div style={{ display: "flex", gap: "14px", marginBottom: "16px", width: "100%" }}>
          <button
            onClick={() => handleAnswer(true)}
            disabled={!!result}
            onMouseEnter={() => setHoveredBtn("true")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              flex: 1, fontSize: "15px", fontWeight: "bold", color: "#1D9E75",
              padding: "10px 0", background: hoveredBtn === "true" ? "rgba(29,158,117,0.15)" : "rgba(255,255,255,0.04)",
              borderRadius: "10px", border: result && question.answer === true ? "1.5px solid #1D9E75" : "1.5px solid rgba(255,255,255,0.08)",
              cursor: result ? "not-allowed" : "pointer", transition: "all 0.15s ease",
            }}
          >True</button>
          <button
            onClick={() => handleAnswer(false)}
            disabled={!!result}
            onMouseEnter={() => setHoveredBtn("false")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              flex: 1, fontSize: "15px", fontWeight: "bold", color: "#D85A30",
              padding: "10px 0", background: hoveredBtn === "false" ? "rgba(216,90,48,0.15)" : "rgba(255,255,255,0.04)",
              borderRadius: "10px", border: result && question.answer === false ? "1.5px solid #D85A30" : "1.5px solid rgba(255,255,255,0.08)",
              cursor: result ? "not-allowed" : "pointer", transition: "all 0.15s ease",
            }}
          >False</button>
        </div>

        {/* Result box - fixed height to stop vertical shifting */}
        <div style={{ height: "110px", width: "100%", boxSizing: "border-box" }}>
          {result && (
            <div style={{
              border: result === "correct" ? "2px solid #1D9E75" : "2px solid #D85A30",
              borderRadius: "14px", padding: "14px 16px", height: "100%", boxSizing: "border-box",
              background: result === "correct" ? "rgba(29,158,117,0.08)" : "rgba(216,90,48,0.08)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
            }}>
              <div style={{ fontSize: "20px" }}>{result === "correct" ? "✅" : "❌"}</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: result === "correct" ? "#1D9E75" : "#D85A30" }}>
                {result === "correct" ? "Correct!" : "Not quite!"}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: "1.5" }}>
                {result === "correct" ? "Good job! You got it right!" : question.explanation}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next button - reserved height container so it doesn't pop the bottom down */}
      <div style={{ height: "45px", marginTop: "16px", width: "100%" }}>
        {result && (
          <button
            onClick={handleNext}
            style={{
              width: "100%", height: "100%",
              background: result === "correct" ? "#1D9E75" : "#378ADD",
              color: "#fff", border: "none", borderRadius: "10px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            {currentQ + 1 >= QUESTIONS.length ? "See results →" : "Next question →"}
          </button>
        )}
      </div>
    </div>
  );
}