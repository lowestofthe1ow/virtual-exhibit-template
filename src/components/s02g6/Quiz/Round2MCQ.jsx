import { useState } from "react";

import { round2Questions } from "../../../data/s02g6/QuizQuestions.js";

import RoundComplete from "./RoundComplete.jsx";

export default function Round2MCQ({
  addPoints,
  saveAnswer,
  next,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = round2Questions[currentQuestion];

  function handleAnswer(option) {
    if (showFeedback) return;

    setSelectedAnswer(option);
    setShowFeedback(true);

    if (option === question.answer) {
      setScore((prev) => prev + 2);
    }
  }

  function nextQuestion() {
    saveAnswer({
        round: 2,
        question: question.question,
        selected: selectedAnswer,
        correct: selectedAnswer === question.answer,
    });
    if (currentQuestion < round2Questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
    } else {
        addPoints(score);
        setFinished(true);
    }
  }

  if (finished) {
    return (
      <RoundComplete
        title="Round 2 — Museum Explorer"
        currentRound={2}
        totalRounds={5}
        pointsEarned={score}
        maxPoints={10}
        message="Excellent! You explored the museum exhibits and answered questions based on what you discovered."
        nextLabel="Continue to Round 3 →"
        next={next}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-4xl font-bold mb-2">
        Round 2 — Museum Explorer
      </h1>

      <p className="text-gray-600 mb-6">
        Question {currentQuestion + 1} of {round2Questions.length}
      </p>

      <h2 className="text-2xl font-semibold mb-8">
        {question.question}
      </h2>

      <div className="space-y-4">

        {question.options.map((option) => {

          let style =
            "w-full border rounded-lg p-4 text-left transition ";

          if (showFeedback) {

            if (option === question.answer)
              style += "bg-green-100 border-green-500";

            else if (option === selectedAnswer)
              style += "bg-red-100 border-red-500";

            else
              style += "bg-gray-100 border-gray-300";

          } else {

            style += "hover:bg-cyan-100 border-gray-300";

          }

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              className={style}
            >
              {option}
            </button>
          );

        })}

      </div>

      {showFeedback && (
        <div className="mt-8 border rounded-lg bg-gray-50 p-5">

            {selectedAnswer === question.answer ? (
            <p className="text-green-600 font-bold text-xl">
                Correct!
            </p>
            ) : (
            <p className="text-red-600 font-bold text-xl">
                Incorrect!
            </p>
            )}

            <p className="mt-3">
            <strong>Correct Answer:</strong> {question.answer}
            </p>

            <button
            onClick={nextQuestion}
            className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg"
            >
            {currentQuestion === round2Questions.length - 1
                ? "Finish Round"
                : "Next Question"}
            </button>

        </div>
      )}
      

    </div>
  );
}