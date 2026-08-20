import { useState } from "react";

import { round4Questions } from "../../../data/s02g6/QuizQuestions.js";
import { shuffleArray } from "../../../data/s02g6/QuizUtils.js";

import RoundComplete from "./RoundComplete.jsx";

const shuffledQuestions = round4Questions.map((question) => ({
  ...question,
  options: shuffleArray(question.options),
}));

export default function Round4Matching({
  addPoints,
  saveAnswer,
  next,
}) {
  const [answers, setAnswers] = useState(
    Array(shuffledQuestions.length).fill("")
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

    shuffledQuestions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        points += 2;
      }
    });

    setScore(points);
    addPoints(points);

    saveAnswer({
      round: 4,
      answers,
      score: points,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <RoundComplete
        title="Round 4 — Match the Innovation"
        currentRound={4}
        totalRounds={5}
        pointsEarned={score}
        maxPoints={10}
        message="Excellent! You matched each innovation with its historical significance."
        nextLabel="Continue to Round 5 →"
        next={next}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-4xl font-bold mb-2">
        Round 4 — Match the Innovation
      </h1>

      <p className="text-gray-600 mb-8">
        Match each innovation with its correct description.
      </p>

      <div className="space-y-6">

        {shuffledQuestions.map((question, index) => (

          <div
            key={question.left}
            className="border rounded-lg p-5"
          >

            <h2 className="font-semibold text-xl mb-3">
              {question.left}
            </h2>

            <select
              value={answers[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={submitted}
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Select an answer...
              </option>

              {question.options.map((option) => (

                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>

              ))}

            </select>

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