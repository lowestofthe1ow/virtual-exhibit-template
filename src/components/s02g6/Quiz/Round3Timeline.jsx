import { useState } from "react";

import { timeline } from "../../../data/s02g6/Timeline.js";
import { shuffleArray } from "../../../data/s02g6/QuizUtils.js";

import RoundComplete from "./RoundComplete.jsx";

export default function Round3Timeline({
  addPoints,
  saveAnswer,
  next,
}) {
  // Shuffle the timeline when the round starts
  const roundEvents = timeline
    .slice(0, 5)
    .map(event => ({
        id: event.id,
        year: event.year,
        text: event.title,
    }));

  const [events, setEvents] = useState(() =>
    shuffleArray(roundEvents)
  );

  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Correct order (sorted by year)
  const correctOrder = [...roundEvents].sort(
    (a, b) => a.year - b.year
  );

  function moveUp(index) {
    if (index === 0) return;

    const updated = [...events];

    [updated[index], updated[index - 1]] = [
      updated[index - 1],
      updated[index],
    ];

    setEvents(updated);
  }

  function moveDown(index) {
    if (index === events.length - 1) return;

    const updated = [...events];

    [updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ];

    setEvents(updated);
  }

  function checkTimeline() {
    let correct = 0;

    events.forEach((event, index) => {
      if (event.id === correctOrder[index].id) {
        correct++;
      }
    });

    const points = correct * 2;

    setCorrectCount(correct);

    addPoints(points);

    saveAnswer({
      round: 1,
      score: points,
      correct: correct,
    });

    setChecked(true);
  }

  if (checked) {
    return (
      <RoundComplete
        title="Round 3 — Time Traveler"
        currentRound={3}
        totalRounds={5}
        pointsEarned={correctCount * 2}
        maxPoints={10}
        message={`You correctly arranged ${correctCount} out of ${roundEvents.length} events.`}
        nextLabel="Continue to Round 4 →"
        next={next}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-4xl font-bold mb-3">
        Round 3 — Time Traveler
      </h1>

      <p className="text-gray-600 mb-8">
        Arrange the following events from the earliest to the latest.
      </p>

      <div className="space-y-4">

        {events.map((event, index) => (

          <div
            key={event.id}
            className="border rounded-xl shadow-sm p-5 flex justify-between items-center"
          >

            <div>

              <p className="font-bold text-cyan-600 mb-2">
                Position {index + 1}
              </p>

              <p className="text-lg">
                {event.text}
              </p>

            </div>

            <div className="flex flex-col gap-2">

              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ⬆ Move Up
              </button>

              <button
                onClick={() => moveDown(index)}
                disabled={index === events.length - 1}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ⬇ Move Down
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-10 text-center">

        <button
          onClick={checkTimeline}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg transition"
        >
          ✔ Check Timeline
        </button>

      </div>

    </div>
  );
}