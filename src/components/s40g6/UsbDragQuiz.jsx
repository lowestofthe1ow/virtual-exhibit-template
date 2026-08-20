import { useState, useRef } from "react";
import "../../styles/s40g6/usb-exhibit.css";

const USB_TYPES = [
  { id: "usbA",     name: "USB-A",     img: "/src/assets/usbA.png",     color: "#378ADD" },
  { id: "usbB",     name: "USB-B",     img: "/src/assets/usbB.png",     color: "#1D9E75" },
  { id: "usbC",     name: "USB-C",     img: "/src/assets/usbC.png",     color: "#EFB800" },
  { id: "microUsb", name: "Micro USB", img: "/src/assets/microUsb.png", color: "#D85A30" },
];

const QUESTIONS = [
  { id: 1, characteristic: "Reversible oval connector. Found on modern laptops, phones, and tablets. Supports up to 240W charging and 40Gbps data.", answer: "usbC" },
  { id: 2, characteristic: "Rectangular connector. The most common USB type for decades. Found on computers, chargers, and USB hubs.", answer: "usbA" },
  { id: 3, characteristic: "Small trapezoid connector. Common on older Android phones and budget devices. Replaced by USB-C in most modern devices.", answer: "microUsb" },
  { id: 4, characteristic: "Square connector with beveled corners. Used on printers, scanners, and other peripherals. Rarely seen on consumer devices today.", answer: "usbB" },
  { id: 5, characteristic: "This connector supports Thunderbolt 4 and DisplayPort Alt Mode — meaning you can plug a 4K monitor directly into it with a single cable.", answer: "usbC" },
  { id: 6, characteristic: "You'll find this port on almost every desktop PC and laptop made between 2000 and 2020. USB flash drives and keyboards use this to connect.", answer: "usbA" },
  { id: 7, characteristic: "This connector was the standard charging port for Android phones from roughly 2007 to 2017. It has a top and bottom — you can't plug it in upside down.", answer: "microUsb" },
  { id: 8, characteristic: "This connector is almost exclusively found on the device end of a printer or scanner cable. It has a distinctly boxy, almost square shape.", answer: "usbB" },
];

export default function UsbDragQuiz({ images }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [dragging, setDragging] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const dragItem = useRef(null);

  const question = QUESTIONS[currentQ];

  const resolveImg = (usbId) => {
    if (images && images[usbId]) {
      const img = images[usbId];
      return typeof img === "string" ? img : img?.src ?? String(img);
    }
    return `/src/assets/${usbId}.png`;
  };

  const handleDragStart = (e, usbId) => {
    setDragging(usbId);
    dragItem.current = usbId;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDropTarget(true); };
  const handleDragLeave = () => setDropTarget(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDropTarget(false);
    const dropped = dragItem.current;
    if (!dropped) return;
    const correct = dropped === question.answer;
    setResult(correct ? "correct" : "wrong");
    if (!correct) setWrongAnswer(dropped);
    if (correct) setScore(s => s + 1);
  };
  const handleNext = () => {
    setResult(null); setDragging(null); setWrongAnswer(null);
    if (currentQ + 1 >= QUESTIONS.length) { setDone(true); } else { setCurrentQ(q => q + 1); }
  };
  const handleRestart = () => {
    setCurrentQ(0); setScore(0); setResult(null);
    setDragging(null); setWrongAnswer(null); setDone(false); setDropTarget(false);
  };

  const correctType = USB_TYPES.find(u => u.id === question?.answer);

  if (done) {
    return (
      <div className="usb-exhibit-wrap" style={{ background: "#111116", borderRadius: "16px", padding: "40px 32px", textAlign: "center", fontFamily: "var(--font-sans)", width: "100%", minWidth: 0, alignSelf: "stretch", boxSizing: "border-box" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>
          {score === QUESTIONS.length ? "🎉" : score >= QUESTIONS.length / 2 ? "👍" : "📚"}
        </div>
        <div style={{ fontSize: "28px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>{score} / {QUESTIONS.length}</div>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
          {score === QUESTIONS.length ? "Perfect score! You know your USB types." : score >= QUESTIONS.length / 2 ? "Good effort! Review the ones you missed." : "Keep studying — USB types can be tricky!"}
        </div>
        <button onClick={handleRestart} style={{ background: "#378ADD", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="usb-exhibit-wrap" style={{ background: "#111116", borderRadius: "16px", padding: "28px 24px", fontFamily: "var(--font-sans)", width: "100%", minWidth: 0, alignSelf: "stretch", boxSizing: "border-box" }}>
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
      <div style={{ display: "flex", gap: "3px", marginBottom: "24px" }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "2px",
            background: i < currentQ ? "#5EEAD4" : i === currentQ ? "#2A2F3A" : "#1A1E27",
          }} />
        ))}
      </div>

      {/* Fixed height content area */}
      <div style={{ minHeight: "420px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "10px" }}>
          Drag &amp; Drop Quiz
        </div>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "6px" }}>
          Which USB type matches this description?
        </div>
        <div style={{
          fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6",
          marginBottom: "28px", padding: "14px 16px",
          background: "rgba(255,255,255,0.04)", borderRadius: "10px",
          borderLeft: "3px solid #378ADD", minHeight: "72px",
          width: "100%", boxSizing: "border-box", overflowWrap: "break-word",
        }}>
          {question.characteristic}
        </div>

        {/* USB options */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px", width: "100%", boxSizing: "border-box" }}>
          {USB_TYPES.map((usb) => {
            const isCorrectAndShown = result === "correct" && usb.id === question.answer;
            const isWrong = result === "wrong" && usb.id === wrongAnswer;
            const isDimmed = result && usb.id !== question.answer && usb.id !== wrongAnswer;
            return (
              <div
                key={usb.id}
                draggable={!result}
                onDragStart={(e) => handleDragStart(e, usb.id)}
                onDragEnd={() => setDragging(null)}
                style={{
                  background: isCorrectAndShown ? "rgba(29,158,117,0.15)" : isWrong ? "rgba(216,90,48,0.15)" : dragging === usb.id ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                  border: isCorrectAndShown ? "1.5px solid #1D9E75" : isWrong ? "1.5px solid #D85A30" : dragging === usb.id ? `1.5px solid ${usb.color}` : "1.5px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px", padding: "12px 8px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                  cursor: result ? "default" : "grab",
                  opacity: isDimmed ? 0.3 : 1,
                  transition: "all 0.15s ease", userSelect: "none",
                }}
              >
                <img src={resolveImg(usb.id)} alt={usb.name} draggable={false} style={{ width: "64px", height: "48px", objectFit: "contain", pointerEvents: "none" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{usb.name}</span>
              </div>
            );
          })}
        </div>

        {/* Drop zone — fixed height so it doesn't shift */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: result === "correct" ? "2px solid #1D9E75" : result === "wrong" ? "2px solid #D85A30" : dropTarget ? "2px solid #378ADD" : "2px dashed rgba(255,255,255,0.15)",
            borderRadius: "14px", padding: "24px 16px", textAlign: "center",
            background: result === "correct" ? "rgba(29,158,117,0.08)" : result === "wrong" ? "rgba(216,90,48,0.08)" : dropTarget ? "rgba(55,138,221,0.08)" : "rgba(255,255,255,0.02)",
            transition: "all 0.15s ease", marginBottom: "16px",
            height: "90px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px",
          }}
        >
          {!result && (
            <>
              <div style={{ fontSize: "22px" }}>⬇️</div>
              <div style={{ fontSize: "13px", color: dropTarget ? "#378ADD" : "rgba(255,255,255,0.3)", fontWeight: "500" }}>
                {dropTarget ? "Release to answer" : "Drop your answer here"}
              </div>
            </>
          )}
          {result === "correct" && (
            <>
              <div style={{ fontSize: "22px" }}>✅</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1D9E75" }}>Correct!</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                That's a <strong style={{ color: "#fff" }}>{correctType?.name}</strong> connector.
              </div>
            </>
          )}
          {result === "wrong" && (
            <>
              <div style={{ fontSize: "22px" }}>❌</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#D85A30" }}>Not quite!</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                The correct answer is <strong style={{ color: "#fff" }}>{correctType?.name}</strong>.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Next button */}
      {result && (
        <button
          onClick={handleNext}
          style={{
            width: "100%", background: result === "correct" ? "#1D9E75" : "#378ADD",
            color: "#fff", border: "none", borderRadius: "10px",
            padding: "13px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
          }}
          onMouseEnter={e => e.target.style.opacity = "0.85"}
          onMouseLeave={e => e.target.style.opacity = "1"}
        >
          {currentQ + 1 >= QUESTIONS.length ? "See results →" : "Next question →"}
        </button>
      )}
    </div>
  );
}