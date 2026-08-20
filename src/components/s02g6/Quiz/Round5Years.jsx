import { useState } from "react";

import { round5Questions } from "../../../data/s02g6/QuizQuestions.js";

import RoundComplete from "./RoundComplete.jsx";

export default function Round5Years({
  addPoints,
  saveAnswer,
  next,
}) {
  const [answers, setAnswers] = useState(
    Array(round5Questions.length).fill("")
  );

  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function handleChange(index, value) {
    if (submitted) return;

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  }

  function submitRound() {
    let points = 0;

    round5Questions.forEach((question, index) => {
      if (
        answers[index].trim() === question.answer
      ) {
        points += 2;
      }
    });

    setScore(points);
    addPoints(points);

    saveAnswer({
      round: 5,
      answers,
      score: points,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <RoundComplete
        title="Round 5 — Complete the Timeline"
        currentRound={5}
        totalRounds={5}
        pointsEarned={score}
        maxPoints={10}
        message="Fantastic! You completed the Philippine computing timeline."
        nextLabel="View Results →"
        next={next}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-4xl font-bold mb-2">
        Round 5 — Complete the Timeline
      </h1>

      <p className="text-gray-600 mb-8">
        Enter the correct year for each historical event.
      </p>

      <div className="space-y-6">

        {round5Questions.map((question, index) => (

          <div
            key={question.event}
            className="border rounded-lg p-5"
          >

            <h2 className="text-xl font-semibold mb-3">
              {question.event}
            </h2>

            <input
              type="text"
              maxLength={4}
              value={answers[index]}
              disabled={submitted}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              placeholder="Enter Year"
              className="w-full border rounded-lg p-3"
            />

          </div>

        ))}

      </div>

      {!submitted && (

        <button
          onClick={submitRound}
          className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg"
        >
          Submit Round
        </button>

      )}

    </div>
  );
}