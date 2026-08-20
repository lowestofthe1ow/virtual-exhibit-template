export default function RoundComplete({
  title,
  currentRound,
  totalRounds,
  pointsEarned,
  maxPoints,
  message,
  nextLabel,
  next,
}) {
  const percentage = (pointsEarned / maxPoints) * 100;

  let encouragement = "";

  if (percentage === 100) {
    encouragement = "Perfect! You're a Genius!";
  } else if (percentage >= 80) {
    encouragement = "Excellent work!";
  } else if (percentage >= 60) {
    encouragement = "Nice job! Keep it up!";
  } else if (percentage >= 40) {
    encouragement = "You're getting there. Keep exploring!";
  } else {
    encouragement = "Don't worry! Every challenge is a chance to learn.";
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10">

      {/* Progress */}
      <div className="mb-8">

        <p className="text-gray-500 text-center mb-2">
          Round {currentRound} of {totalRounds}
        </p>

        <div className="w-full bg-gray-300 rounded-full h-3">

          <div
            className="bg-cyan-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${(currentRound / totalRounds) * 100}%`,
            }}
          />

        </div>

      </div>

      {/* Round Complete */}

      <div className="text-center">

        <h1 className="text-4xl font-bold text-green-600 mb-3">
          Round Complete!
        </h1>

        <h2 className="text-2xl font-semibold mb-6">
          {title}
        </h2>

        <div className="bg-gray-100 rounded-xl p-6 mb-8">

          <p className="text-lg">
            You earned
          </p>

          <h3 className="text-6xl font-bold text-cyan-600 my-3">
            {pointsEarned}/{maxPoints}
          </h3>

          <p className="text-xl font-semibold mb-3">
            {encouragement}
          </p>

          <p className="text-gray-700">
            {message}
          </p>

        </div>

        <button
          onClick={next}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg text-lg transition"
        >
          {nextLabel}
        </button>

      </div>

    </div>
  );
}