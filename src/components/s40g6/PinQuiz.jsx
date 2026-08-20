import { useState } from "react";

const PIN_DATA = {
  A1:  { color: "#888780", name: "GND",  group: "Ground" },
  A2:  { color: "#378ADD", name: "TX1+", group: "SuperSpeed" },
  A3:  { color: "#378ADD", name: "TX1−", group: "SuperSpeed" },
  A4:  { color: "#1D9E75", name: "VBUS", group: "Power" },
  A5:  { color: "#EFB800", name: "CC1",  group: "Config" },
  A6:  { color: "#B59FE8", name: "D+",   group: "USB 2.0" },
  A7:  { color: "#B59FE8", name: "D−",   group: "USB 2.0" },
  A8:  { color: "#D85A30", name: "SBU1", group: "Sideband" },
  A9:  { color: "#1D9E75", name: "VBUS", group: "Power" },
  A10: { color: "#378ADD", name: "RX2−", group: "SuperSpeed" },
  A11: { color: "#378ADD", name: "RX2+", group: "SuperSpeed" },
  A12: { color: "#888780", name: "GND",  group: "Ground" },
  B12: { color: "#888780", name: "GND",  group: "Ground" },
  B11: { color: "#378ADD", name: "RX1+", group: "SuperSpeed" },
  B10: { color: "#378ADD", name: "RX1−", group: "SuperSpeed" },
  B9:  { color: "#1D9E75", name: "VBUS", group: "Power" },
  B8:  { color: "#D85A30", name: "SBU2", group: "Sideband" },
  B7:  { color: "#B59FE8", name: "D−",   group: "USB 2.0" },
  B6:  { color: "#B59FE8", name: "D+",   group: "USB 2.0" },
  B5:  { color: "#EFB800", name: "CC2",  group: "Config" },
  B4:  { color: "#1D9E75", name: "VBUS", group: "Power" },
  B3:  { color: "#378ADD", name: "TX2−", group: "SuperSpeed" },
  B2:  { color: "#378ADD", name: "TX2+", group: "SuperSpeed" },
  B1:  { color: "#888780", name: "GND",  group: "Ground" },
};

const ROW_A = ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12"];
const ROW_B = ["B12","B11","B10","B9","B8","B7","B6","B5","B4","B3","B2","B1"];

const QUESTIONS = [
  {
    prompt: "Select all pins that represent GND.",
    answer: ["A1", "A12", "B1", "B12"],
    hint: "There are four of these, one at each outer edge of both rows.",
  },
  {
    prompt: "Select all pins that support a 10Gbps data transfer rate.",
    answer: ["A2", "A3", "A10", "A11", "B10", "B11", "B2", "B3"],
    hint: "This is every SuperSpeed TX/RX pin — two lanes, each a differential pair, on both rows.",
  },
  {
    prompt: "Select all pins that can do 480Mbps data transfer rate or more.",
    answer: ["A2", "A3", "A6", "A7", "A10", "A11", "B6", "B7", "B10", "B11", "B2", "B3"],
    hint: "This includes the USB 2.0 pair plus every SuperSpeed TX/RX pin, since 10Gbps is also ≥480Mbps.",
  },
  {
    prompt: "Select all pins that represent the secondary bus.",
    answer: ["A8", "B8"],
    hint: "As discussed earlier, these pins carry alt signals for different protocols like DisplayPort",
  },
  {
    prompt: "Select all pins that represent USB 2.0 data transfer rate.",
    answer: ["A6", "A7", "B6", "B7"],
    hint: "Look for the D+/D− differential pair, bridged together inside the cable on both rows.",
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function UsbCPinQuiz() {
  const [order] = useState(() => shuffle(QUESTIONS.map((_, i) => i)));
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const qIndex = order[step];
  const q = QUESTIONS[qIndex];
  const total = QUESTIONS.length;

  const togglePin = (id) => {
    if (checked) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isCorrectSet = () => {
    if (selected.length !== q.answer.length) return false;
    return q.answer.every((a) => selected.includes(a));
  };

  const handleCheck = () => {
    if (selected.length === 0 || checked) return;
    setChecked(true);
    if (isCorrectSet()) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (step + 1 >= total) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
    setSelected([]);
    setChecked(false);
  };

  const handleRestart = () => {
    setStep(0);
    setSelected([]);
    setChecked(false);
    setScore(0);
    setDone(false);
  };

  const pinState = (id) => {
    const isSel = selected.includes(id);
    if (!checked) return isSel ? "selected" : "idle";
    const isAns = q.answer.includes(id);
    if (isAns && isSel) return "hit";
    if (isAns && !isSel) return "missed";
    if (!isAns && isSel) return "wrong";
    return "idle";
  };

  const renderPin = (id) => {
    const pin = PIN_DATA[id];
    const state = pinState(id);

    const styles = {
      idle: { border: "2px solid #232833", background: "#171B24", opacity: 1 },
      selected: { border: `2px solid ${pin.color}`, background: `${pin.color}26`, opacity: 1 },
      hit: { border: "2px solid #35D07F", background: "#35D07F26", opacity: 1 },
      missed: { border: "2px solid #35D07F", background: "transparent", opacity: 0.55 },
      wrong: { border: "2px solid #E5484D", background: "#E5484D26", opacity: 1 },
    }[state];

    return (
      <button
        key={id}
        onClick={() => togglePin(id)}
        disabled={checked}
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "3px",
          padding: "10px 2px",
          borderRadius: "8px",
          cursor: checked ? "default" : "pointer",
          transition: "all 0.12s ease",
          fontFamily: "inherit",
          ...styles,
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "2px",
            background: pin.color,
            display: "block",
          }}
        />
        <span style={{ fontSize: "10px", color: "#6B7280", fontFamily: "'JetBrains Mono', monospace" }}>
          {id}
        </span>
        <span style={{ fontSize: "12px", color: "#E8EAED", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
          {pin.name}
        </span>
      </button>
    );
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <div style={outerStyle}>
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 32px" }}>
          <div style={{ fontSize: "13px", letterSpacing: "0.12em", color: "#5EEAD4", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
            Quiz complete
          </div>
          <div style={{ fontSize: "56px", fontWeight: 700, color: "#E8EAED", margin: "16px 0 4px", fontFamily: "'JetBrains Mono', monospace" }}>
            {score}/{total}
          </div>
          <div style={{ color: "#8B93A1", fontSize: "14px", marginBottom: "28px" }}>
            {pct >= 80 ? "Solid grasp of the USB-C pinout." : pct >= 50 ? "Getting there — a few pins to review." : "Worth another pass through the pinout."}
          </div>
          <button onClick={handleRestart} style={primaryBtnStyle}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <span style={{ fontSize: "12px", letterSpacing: "0.1em", color: "#5EEAD4", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
            Question {step + 1} / {total}
          </span>
          <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "'JetBrains Mono', monospace" }}>
            score {score}
          </span>
        </div>

        <div style={{ display: "flex", gap: "3px", marginBottom: "24px" }}>
          {order.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "3px",
                borderRadius: "2px",
                background: i < step ? "#5EEAD4" : i === step ? "#2A2F3A" : "#1A1E27",
              }}
            />
          ))}
        </div>

        <h2 style={{ fontSize: "18px", lineHeight: 1.5, color: "#E8EAED", fontWeight: 500, margin: "0 0 24px" }}>
          {q.prompt}
        </h2>

        <div style={{ background: "#0D0F14", borderRadius: "10px", padding: "16px 10px", marginBottom: "10px" }}>
          <div style={{ fontSize: "10px", color: "#4B5563", fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px", paddingLeft: "2px" }}>
            ROW A
          </div>
          <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
            {ROW_A.map(renderPin)}
          </div>
          <div style={{ fontSize: "10px", color: "#4B5563", fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px", paddingLeft: "2px" }}>
            ROW B
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {ROW_B.map(renderPin)}
          </div>
        </div>

        {checked && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "8px",
              background: isCorrectSet() ? "#35D07F1A" : "#E5484D1A",
              border: `1px solid ${isCorrectSet() ? "#35D07F" : "#E5484D"}`,
              fontSize: "13px",
              color: "#E8EAED",
              lineHeight: 1.5,
            }}
          >
            {isCorrectSet() ? (
              <strong style={{ color: "#35D07F" }}>Correct.</strong>
            ) : (
              <>
                <strong style={{ color: "#E5484D" }}>Not quite.</strong>{" "}
                Correct pin(s): {q.answer.join(", ")}.
              </>
            )}
            <div style={{ color: "#8B93A1", marginTop: "4px" }}>{q.hint}</div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={selected.length === 0}
              style={{
                ...primaryBtnStyle,
                opacity: selected.length === 0 ? 0.4 : 1,
                cursor: selected.length === 0 ? "default" : "pointer",
              }}
            >
              Check answer
            </button>
          ) : (
            <button onClick={handleNext} style={primaryBtnStyle}>
              {step + 1 >= total ? "See results" : "Next question"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const outerStyle = {
  fontFamily: "'Inter', system-ui, sans-serif",
  background: "#0B0E14",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  justifyContent: "center",
};

const cardStyle = {
  background: "#12151D",
  border: "1px solid #1F2430",
  borderRadius: "14px",
  padding: "24px",
  width: "100%",
  maxWidth: "640px",
};

const primaryBtnStyle = {
  background: "#5EEAD4",
  color: "#0B0E14",
  border: "none",
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};
