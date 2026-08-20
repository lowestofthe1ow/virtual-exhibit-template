"use client";
import { useState } from "react";

export default function MCQStage({ setStage, setAnswers, currentAnswers }) {
  // Define questions and correct answers
  const questions = [
    {
      id: 1,
      text: "What is the main purpose of Wi-Fi?",
      options: [
        "To connect nearby devices to a network using radio waves instead of cables",
        "To increase a computer's CPU clock speed",
        "To store files permanently without an internet connection",
        "To replace all wired power cables"
      ],
      correct: "To connect nearby devices to a network using radio waves instead of cables"
    },
    {
      id: 2,
      text: "Which limitation was common in early 2.4 GHz Wi-Fi such as 802.11b?",
      options: [
        "It could suffer interference from other devices using the same band",
        "It required fiber-optic cables for every device",
        "It could only work with satellite internet",
        "It used Multi-Link Operation by default"
      ],
      correct: "It could suffer interference from other devices using the same band"
    },
    {
      id: 3,
      text: "Which improvement is most closely associated with Wi-Fi 4 (802.11n)?",
      options: [
        "MIMO and wider 40 MHz channels for higher throughput",
        "Multi-Link Operation across several bands at the same time",
        "The first use of the 6 GHz extension called Wi-Fi 6E",
        "A return to 2 Mbps maximum speeds"
      ],
      correct: "MIMO and wider 40 MHz channels for higher throughput"
    },
    {
      id: 4,
      text: "Which statement best describes Wi-Fi 6 and Wi-Fi 6E?",
      options: [
        "Wi-Fi 6 improves crowded-network efficiency with OFDMA, while Wi-Fi 6E extends that technology into the 6 GHz band",
        "Wi-Fi 6 removes multi-device support, while Wi-Fi 6E returns to 2 Mbps speeds",
        "Wi-Fi 6 only works through Ethernet cables, while Wi-Fi 6E only works through fiber",
        "Wi-Fi 6 and Wi-Fi 6E are names for the original 1997 standard"
      ],
      correct: "Wi-Fi 6 improves crowded-network efficiency with OFDMA, while Wi-Fi 6E extends that technology into the 6 GHz band"
    },
    {
      id: 5,
      text: "What is the key idea behind Wi-Fi 7's Multi-Link Operation (MLO)?",
      options: [
        "A device can coordinate multiple wireless links at once for more capacity and lower latency",
        "A router must turn off all bands except 2.4 GHz",
        "A device can only connect after a wired cable is attached",
        "A network must use one client at a time"
      ],
      correct: "A device can coordinate multiple wireless links at once for more capacity and lower latency"
    }
  ];

  // Handle Selected
  const [selected, setSelected] = useState({});

  const handleSelect = (questionId, chosenAnswer) => {
    setSelected(prev => ({
      ...prev,
      [questionId]: chosenAnswer
    }));
  };

  const goToResult = () => {
    // Check each answer and mark correct/incorrect
    const mcqResults = questions.map(q => ({
      id: q.id,
      text: q.text,
      selected: selected[q.id] || "",
      correct: q.correct,
      isCorrect: selected[q.id] === q.correct
    }));

    // Save results to shared answers state
    setAnswers({
      ...currentAnswers,
      mcqResults: mcqResults
    });

    // Move to final result page
    setStage("result");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

      {questions.map(question => (
        <div
          key={question.id}
          style={{
            marginBottom: "20px",
            padding: "16px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            background: "#fdfdfd"
          }}
        >
          <p style={{ fontSize: "16px", margin: "0 0 14px 0", lineHeight: "1.5" }}>
            <strong>{question.id}.</strong> {question.text}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {question.options.map(option => (
              <label
                key={option}
                style={{
                   display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  minHeight: "44px",
                  borderRadius: "8px",
                  background: selected[question.id] === option ? "#e3f2fd" : "#f8f9fa",
                  border: selected[question.id] === option ? "1px solid #00227098" : "1px solid transparent",
                  cursor: "pointer",
                  fontSize: "15px",
                  lineHeight: "1.35"
                }}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  value={option}
                  checked={selected[question.id] === option}
                  onChange={() => handleSelect(question.id, option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>

        <button
          onClick={goToResult}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            background: "#002170",
            color: "white",
            cursor: "pointer",
            width: "100%",
            maxWidth: "240px",
            minHeight: "44px"
          }}
        >
          See Result →
        </button>
      </div>
    </div>
  );
}