import { useState } from "react";

import Welcome from "./Quiz/Welcome.jsx";
import Round1TrueFalse from "./Quiz/Round1TrueFalse.jsx";
import Round2MCQ from "./Quiz/Round2MCQ.jsx";
import Round3Timeline from "./Quiz/Round3Timeline.jsx";
import Round4Matching from "./Quiz/Round4Matching.jsx";
import Round5Years from "./Quiz/Round5Years.jsx";
import Results from "./Quiz/Results.jsx";

export default function Quiz() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  function addPoints(points) {
    setScore((prev) => prev + points);
  }

  function saveAnswer(answer) {
    setAnswers((prev) => [...prev, answer]);
  }

  const rounds = [
    Welcome,
    Round1TrueFalse,
    Round2MCQ,
    Round3Timeline,
    Round4Matching,
    Round5Years,
    Results,
  ];

  const CurrentScreen = rounds[currentRound];

  return (
    <CurrentScreen
      score={score}
      answers={answers}
      addPoints={addPoints}
      saveAnswer={saveAnswer}
      next={() => setCurrentRound((prev) => prev + 1)}
    />
  );
}