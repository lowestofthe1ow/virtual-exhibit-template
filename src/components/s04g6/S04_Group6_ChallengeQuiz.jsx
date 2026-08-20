import { useMemo, useState } from "react";

const quizBank = [
  {
    question: "What is RAM?",
    options: [
      "A semiconductor that temporarily stores data and program instructions",
      "A router that temporarily stores data and program instructions",
      "A switch that temporarily stores data and program instructions",
      "A semiconductor that permanently stores data and program instructions"
    ],
    answerIndex: 0
  },
  {
    question:
      "Memory stores program instructions and data digitally using packets.",
    options: [
      "True",
      "False"
    ],
    answerIndex: 1
  },
  {
    question:
      "The process that lets the CPU perform a sequence of operations is called ________.",
    options: [
      "Go-Grow-Glow Cycle",
      "Discover-Offer-Request-Acknowledge Cycle",
      "Read-Write-Update Cycle",
      "Fetch-Decode-Execute Cycle"
    ],
    answerIndex: 3
  },
  {
    question:
      "RAM is a device that forwards data packets between computer networks.",
    options: [
      "True",
      "False"
    ],
    answerIndex: 1
  },
  {
    question:
      "All of the following are part of the Von Neumann architecture except:",
    options: [
      "CPU",
      "Memory Unit",
      "Input Device",
      "Switching Fabric"
    ],
    answerIndex: 3
  },
  {
    question:
      "Which type of memory stores information magnetically on the surface of a rotating metal cylinder?",
    options: [
      "Magnetic Core Memory",
      "Fiber Optic Memory",
      "Drum Memory",
      "Matrix Core Memory"
    ],
    answerIndex: 2
  },
  {
    question:
      "RAM gives the computer a temporary workspace for running programs.",
    options: [
      "True",
      "False"
    ],
    answerIndex: 0
  },
  {
    question:
      "Which bus identifies the memory location where data should be read or written?",
    options: [
      "Data Bus",
      "Forwarding Bus",
      "Address Bus",
      "Control Bus"
    ],
    answerIndex: 2
  },
  {
    question:
      "The CPU must request data from memory when the required data is not already available in its registers.",
    options: [
      "True",
      "False"
    ],
    answerIndex: 0
  },
  {
    question:
      "In DRAM, the controller selects CAS before RAS to access the correct memory cell.",
    options: [
      "True",
      "False"
    ],
    answerIndex: 1
  }
];

const optionLetters = ["A", "B", "C", "D"];

function getScoreDetails(score, totalQuestions) {
  const percentage = Math.round(
    (score / totalQuestions) * 100
  );

  if (percentage >= 90) {
    return {
      rank: "MASTER MEMORY ARCHITECT",
      message:
        "Your recall is running at peak performance. You successfully retained the exhibit's major concepts."
    };
  }

  if (percentage >= 70) {
    return {
      rank: "STRONG MEMORY RETENTION",
      message:
        "Your memory system is performing well. Review the missed concepts to bring your recall even closer to mastery."
    };
  }

  if (percentage >= 50) {
    return {
      rank: "MEMORY TRAINING REQUIRED",
      message:
        "You retained the main ideas, but a few signals were lost. Revisit the exhibit and begin another memory cycle."
    };
  }

  return {
    rank: "SYSTEM REQUIRES REVIEW",
    message:
      "Important data did not make it into long-term recall. Reload the exhibit concepts, then run the memory test again."
  };
}

function AnimatedMemoryGraphic({
  isAnswered,
  isCorrect
}) {
  const statusText = !isAnswered
    ? "AWAITING RESPONSE"
    : isCorrect
      ? "DATA VERIFIED"
      : "RECALL MISMATCH";

  return (
    <div
      className={[
        "quiz-memory-visual",
        isAnswered ? "is-processing" : "",
        isAnswered && isCorrect
          ? "is-correct"
          : "",
        isAnswered && !isCorrect
          ? "is-incorrect"
          : ""
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="quiz-memory-glow"></div>

      <div className="quiz-reticle quiz-reticle-outer"></div>
      <div className="quiz-reticle quiz-reticle-middle"></div>
      <div className="quiz-reticle quiz-reticle-inner"></div>

      <div className="quiz-target-frame"></div>

      <div className="quiz-data-stream quiz-data-stream-one">
        <span>1</span>
        <span>0</span>
        <span>1</span>
        <span>1</span>
      </div>

      <div className="quiz-data-stream quiz-data-stream-two">
        <span>0</span>
        <span>1</span>
        <span>0</span>
        <span>1</span>
      </div>

      <div className="quiz-memory-chip">
        <div className="quiz-chip-board">
          <span className="quiz-chip-contact quiz-chip-contact-1"></span>
          <span className="quiz-chip-contact quiz-chip-contact-2"></span>
          <span className="quiz-chip-contact quiz-chip-contact-3"></span>
          <span className="quiz-chip-contact quiz-chip-contact-4"></span>
          <span className="quiz-chip-contact quiz-chip-contact-5"></span>
          <span className="quiz-chip-contact quiz-chip-contact-6"></span>

          <div className="quiz-chip-core">
            <span>RAM</span>
            <small>RECALL MODULE</small>
          </div>
        </div>
      </div>

      <div className="quiz-packet quiz-packet-one"></div>
      <div className="quiz-packet quiz-packet-two"></div>
      <div className="quiz-packet quiz-packet-three"></div>

      <div className="quiz-visual-status">
        <span className="quiz-status-light"></span>
        <span>{statusText}</span>
      </div>
    </div>
  );
}

export default function QuizLogic() {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [score, setScore] =
    useState(0);

  const [isComplete, setIsComplete] =
    useState(false);

  const currentQuestion =
    quizBank[currentIndex];

  const totalQuestions =
    quizBank.length;

  const isAnswered =
    selectedAnswer !== null;

  const selectedWasCorrect =
    isAnswered &&
    selectedAnswer === currentQuestion.answerIndex;

  const progressPercentage =
    isComplete
      ? 100
      : ((currentIndex + 1) / totalQuestions) * 100;

  const scorePercentage =
    Math.round(
      (score / totalQuestions) * 100
    );

  const scoreDetails = useMemo(
    () =>
      getScoreDetails(
        score,
        totalQuestions
      ),
    [score, totalQuestions]
  );

  function handleAnswer(answerIndex) {
    if (isAnswered) {
      return;
    }

    setSelectedAnswer(answerIndex);

    if (
      answerIndex ===
      currentQuestion.answerIndex
    ) {
      setScore(
        (previousScore) =>
          previousScore + 1
      );
    }
  }

  function handleNextQuestion() {
    if (!isAnswered) {
      return;
    }

    if (
      currentIndex ===
      totalQuestions - 1
    ) {
      setIsComplete(true);
      return;
    }

    setCurrentIndex(
      (previousIndex) =>
        previousIndex + 1
    );

    setSelectedAnswer(null);
  }

  function restartQuiz() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsComplete(false);
  }

  return (
    <div className="quiz-experience">
      {!isComplete ? (
        <>
          <div className="quiz-main-layout">
            <section className="quiz-question-panel">
              <div className="quiz-panel-accent"></div>

              <div className="quiz-question-heading">
                <span>
                  TEST YOURSELF
                </span>

                <span className="quiz-question-count">
                  {String(currentIndex + 1).padStart(
                    2,
                    "0"
                  )}
                  {" / "}
                  {String(totalQuestions).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>

              <h3 className="question-number">
                QUESTION{" "}
                {String(currentIndex + 1).padStart(
                  2,
                  "0"
                )}
              </h3>

              <p className="question-text">
                {currentQuestion.question}
              </p>

              <AnimatedMemoryGraphic
                isAnswered={isAnswered}
                isCorrect={selectedWasCorrect}
              />
            </section>

            <section className="quiz-answer-panel">
              <div className="quiz-panel-accent"></div>

              <div className="quiz-answer-heading">
                <span>
                  SELECT A RESPONSE
                </span>

                <span>
                  MEMORY CHECK
                </span>
              </div>

              <div
                className="quiz-choices"
                role="group"
                aria-label={`Question ${
                  currentIndex + 1
                } answers`}
              >
                {currentQuestion.options.map(
                  (
                    optionText,
                    optionIndex
                  ) => {
                    const isCorrectOption =
                      optionIndex ===
                      currentQuestion.answerIndex;

                    const isSelected =
                      optionIndex ===
                      selectedAnswer;

                    let optionState = "";

                    if (
                      isAnswered &&
                      isCorrectOption
                    ) {
                      optionState =
                        "correct";
                    } else if (
                      isAnswered &&
                      isSelected &&
                      !isCorrectOption
                    ) {
                      optionState =
                        "incorrect";
                    }

                    return (
                      <button
                        key={`${currentIndex}-${optionIndex}`}
                        type="button"
                        className={[
                          "quiz-option",
                          isSelected
                            ? "selected"
                            : "",
                          optionState
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() =>
                          handleAnswer(
                            optionIndex
                          )
                        }
                        disabled={
                          isAnswered
                        }
                      >
                        <span className="option-letter">
                          {
                            optionLetters[
                              optionIndex
                            ]
                          }
                        </span>

                        <span className="option-text">
                          {optionText}
                        </span>

                        <span
                          className="option-status"
                          aria-hidden="true"
                        >
                          {optionState ===
                          "correct"
                            ? "✓"
                            : optionState ===
                                "incorrect"
                              ? "×"
                              : "›"}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              <div
                className={[
                  "quiz-feedback",
                  isAnswered
                    ? "is-visible"
                    : "",
                  selectedWasCorrect
                    ? "is-correct"
                    : "is-incorrect"
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-live="polite"
              >
                <span className="quiz-feedback-label">
                  {selectedWasCorrect
                    ? "DATA VERIFIED"
                    : "RECALL MISMATCH"}
                </span>

                <p>
                  {selectedWasCorrect
                    ? "Correct signal received. The information was successfully retrieved."
                    : "That signal does not match the stored answer. The correct response has been highlighted."}
                </p>
              </div>

              <button
                className="quiz-next-button"
                type="button"
                onClick={
                  handleNextQuestion
                }
                disabled={!isAnswered}
              >
                <span>
                  {currentIndex ===
                  totalQuestions - 1
                    ? "PROCESS FINAL SCORE"
                    : "LOAD NEXT QUESTION"}
                </span>

                <strong aria-hidden="true">
                  →
                </strong>
              </button>
            </section>
          </div>

        <div
        className="quiz-progress"
        aria-label={`Question ${currentIndex + 1} of ${totalQuestions}`}
        >
        <div className="quiz-progress-track">
            <div
            className="quiz-progress-fill"
            style={{
                width: `${progressPercentage}%`
            }}
            ></div>

            {quizBank.map((_, index) => {
            const isPast =
                index < currentIndex;

            const isCurrent =
                index === currentIndex;

            return (
                <span
                key={index}
                className={[
                    "quiz-progress-node",
                    isPast
                    ? "is-complete"
                    : "",
                    isCurrent
                    ? "is-current"
                    : ""
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    left: `${
                    (
                        index /
                        (totalQuestions - 1)
                    ) * 100
                    }%`
                }}
                ></span>
            );
            })}
        </div>
        </div>
        </>
      ) : (
        <section className="quiz-results">
          <div className="quiz-results-frame"></div>

          <div className="quiz-results-visual">
            <div className="quiz-results-ring quiz-results-ring-one"></div>
            <div className="quiz-results-ring quiz-results-ring-two"></div>
            <div className="quiz-results-ring quiz-results-ring-three"></div>

            <div className="quiz-results-score">
              <strong>
                {scorePercentage}%
              </strong>

              <span>
                RETENTION SCORE
              </span>
            </div>
          </div>

          <div className="quiz-results-content">
            <span className="quiz-results-kicker">
              MEMORY ANALYSIS COMPLETE
            </span>

            <h3>
              {scoreDetails.rank}
            </h3>

            <p>
              {scoreDetails.message}
            </p>

            <div className="quiz-score-grid">
              <div>
                <span>
                  CORRECT SIGNALS
                </span>

                <strong>
                  {String(score).padStart(
                    2,
                    "0"
                  )}
                </strong>
              </div>

              <div>
                <span>
                  MISSED SIGNALS
                </span>

                <strong>
                  {String(
                    totalQuestions -
                      score
                  ).padStart(2, "0")}
                </strong>
              </div>

              <div>
                <span>
                  TOTAL QUESTIONS
                </span>

                <strong>
                  {String(
                    totalQuestions
                  ).padStart(2, "0")}
                </strong>
              </div>
            </div>

            <button
              className="quiz-restart-button"
              type="button"
              onClick={restartQuiz}
            >
              <span>
                RESTART MEMORY TEST
              </span>

              <strong aria-hidden="true">
                ↺
              </strong>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}