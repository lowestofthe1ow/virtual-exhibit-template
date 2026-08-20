"use client";
import { useState } from "react";
import MatchStage from "./MatchStage.jsx";
import MCQStage from "./MCQStage.jsx";
import ResultStage from "./ResultStage.jsx";

export default function KnowledgeCheck() {
  const [stage, setStage] = useState("match");
  // Save Results
  const [answers, setAnswers] = useState({
    matchResults: [],
    mcqResults: []
  })

  return (
    <div>
      <div style={{ marginBottom: "20px", padding: "14px 16px", border: "1px solid #dbe7ff", borderRadius: "10px", background: "#f5f8ff" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>Instructions</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          <div>
            <strong style={{fontSize: "15px" }}>Matching Type:</strong>
            <div style={{ marginTop: "4px", fontSize: "14px" }}>Tap a card first, then tap the appropriate Wi-Fi generation box to place it. On PC, you can also drag each description into the correct Wi-Fi standard box.</div>
          </div>
          <div>
            <strong style={{fontSize: "15px" }}>Multiple Choice:</strong>
            <div style={{ marginTop: "4px", fontSize: "14px" }}>Select the best answer for each question.</div>
          </div>
          <div style={{ marginTop: "4px" }}>
            <strong style={{fontSize: "15px" }}>The overall result will be shown at the very end after you complete both parts.</strong>
          </div>
        </div>
      </div>

      {/*Matching Stage*/}
      {stage === "match" && (
        <MatchStage
          setStage={setStage}
          setAnswers={setAnswers}
          currentAnswers={answers}
        />
      )}
      {/*Multiple Choice Stage*/}
      {stage === "mcq" && (
        <MCQStage
          setStage={setStage}
          setAnswers={setAnswers}
          currentAnswers={answers}
        />
      )}
      {/*Result Stage*/}
      {stage === "result" && (
        <ResultStage
          setStage={setStage}
          answers={answers}
        />
      )}
    </div>
  );
}
