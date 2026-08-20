export default function Results({ score }) {

  let rank = "";
  let message = "";

  if (score >= 45) {
    rank = "Digital Pioneer";
    message =
      "Outstanding! You have an excellent understanding of the history of computing in the Philippines.";
  } else if (score >= 35) {
    rank = "True Historian";
    message =
      "Great job! You know many of the important milestones in Philippine computing history.";
  } else if (score >= 25) {
    rank = "Computer Explorer";
    message =
      "Nice work! You explored the museum well and learned several key historical events.";
  } else {
    rank = "Curious Visitor";
    message =
      "Thanks for visiting! Explore the museum again to discover more about Philippine computing history.";
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10 text-center">

      <h1 className="text-4xl font-bold mb-6">
        Philippine Computing Challenge Complete!
      </h1>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="bg-cyan-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${(score / 50) * 100}%` }}
        ></div>
      </div>

      <h2 className="text-6xl font-bold text-cyan-600 mb-4">
        {score} / 50
      </h2>

      <h3 className="text-3xl font-semibold mb-4">
        {rank}
      </h3>

      <p className="text-gray-700 text-lg leading-relaxed mb-10">
        {message}
      </p>

      <div className="flex justify-center gap-4">

        <button
          onClick={() => window.location.reload()}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition"
        >
          Try Again!
        </button>

        

      </div>

    </div>
  );
}