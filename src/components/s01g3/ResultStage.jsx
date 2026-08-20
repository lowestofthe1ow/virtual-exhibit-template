"use client";

export default function ResultStage({ setStage, answers }) {
  // Get saved results from both stages
  const { matchResults, mcqResults } = answers;

  // Match stage
  const matchCorrect = matchResults.filter(item => item.isCorrect).length;
  const matchTotal = matchResults.length;

  // MCQ stage
  const mcqCorrect = mcqResults.filter(q => q.isCorrect).length;
  const mcqTotal = mcqResults.length;

  // Overall score
  const totalCorrect = matchCorrect + mcqCorrect;
  const totalQuestions = matchTotal + mcqTotal;
  const scorePercent = Math.round((totalCorrect / totalQuestions) * 100);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto"}}>
      <p style={{ fontSize: "20px", marginBottom: "10px" }}><strong>📝 Final Result</strong></p>

      <div style={{
        padding: "18px",
        background: "#f8f9fa",
        borderRadius: "8px",
        marginBottom: "24px",
        border: "1px solid #e9ecef"
      }}>
        <p style={{ margin: "0 0 12px 0", fontSize: "18px" }}><strong>Your Score: {scorePercent}%</strong></p>
        <p style={{ margin: "6px 0", fontSize: "16px" }}>Matching Stage: {matchCorrect} / {matchTotal} correct</p>
        <p style={{ margin: "6px 0", fontSize: "16px" }}>Multiple Choice: {mcqCorrect} / {mcqTotal} correct</p>
        <p style={{ margin: "8px 0 0 0", fontSize: "18px" }}><strong>Total: {totalCorrect} / {totalQuestions}</strong></p>
      </div>

     <p style={{ fontSize: "20px", marginBottom: "10px" }}><strong>🔍 Matching Stage Answers</strong></p>
      <div style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch"
      }}>
        <table style={{
          width: "100%",
          minWidth: "680px",
          borderCollapse: "collapse",
          fontSize: "15px"
        }}>
          <thead>
            <tr style={{ background: "#e9ecef" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Description</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Your Choice</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Correct Answer</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {matchResults.map(item => (
              <tr key={item.id} style={{
                background: item.isCorrect ? "#d4edda" : "#f8d7da"
              }}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.text}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.assignedZone}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.correctZone}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                  {item.isCorrect ? "✅ Correct" : "❌ Wrong"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "20px", marginBottom: "10px" }}><strong>📋 Multiple Choice Answers</strong></p>
      <div style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch"
            }}>
              <table style={{
                width: "100%",
                minWidth: "680px",
                borderCollapse: "collapse",
                fontSize: "15px"
              }}>
          <thead>
            <tr style={{ background: "#e9ecef" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Question</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Your Answer</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Correct Answer</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {mcqResults.map(q => (
              <tr key={q.id} style={{
                background: q.isCorrect ? "#d4edda" : "#f8d7da"
              }}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{q.text}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{q.selected || "Not Answered"}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{q.correct}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                  {q.isCorrect ? "✅ Correct" : "❌ Wrong"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setStage("match")}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "6px",
          background: "#002170",
          color: "white",
          cursor: "pointer"
        }}
      >
        Start Over
      </button>
    </div>
  );
}