import { useMemo, useState } from "react";
import styles from "../../styles/s40g5/CloudQuiz.module.css";
import { quizQuestions } from "../../S40_Group5_data/s40g5/quizData.js";

export default function CloudQuiz() {
  const totalQuestions = quizQuestions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = quizQuestions[currentIndex];
  const isResult = currentIndex >= totalQuestions;

  const correctCount = useMemo(
    () => answers.filter((answer) => answer.isCorrect).length,
    [answers]
  );
  const incorrectCount = totalQuestions - correctCount;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const progress = Math.round((currentIndex / totalQuestions) * 100);

  const hasSelected = selectedOption !== null;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  function handleSubmit() {
    if (!hasSelected || submitted || !currentQuestion) {
      return;
    }

    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, selected: selectedOption, isCorrect }]);
    setSubmitted(true);
  }

  function handleNext() {
    if (!submitted) {
      return;
    }

    setSelectedOption(null);
    setSubmitted(false);
    setCurrentIndex((prev) => prev + 1);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setAnswers([]);
  }

  function getOptionClass(optionId) {
    const isSelected = selectedOption === optionId;
    if (!submitted) {
      return isSelected ? styles.selectedOption : "";
    }

    if (optionId === currentQuestion.correctOptionId) {
      return styles.correctOption;
    }

    if (isSelected) {
      return styles.wrongOption;
    }

    return "";
  }

  return (
    <section className={styles.quizShell} aria-labelledby="cloud-quiz-title">
      <div className={styles.quizHeader}>
        <p className={styles.eyebrow}>Knowledge Check</p>
        <div>
          <h2 id="cloud-quiz-title">Cloud Storage Quiz</h2>
          <p className={styles.introText}>
            Answer the questions below, then review your scores.
          </p>
        </div>
      </div>

      {!isResult && currentQuestion && (
        <div className={styles.quizCard}>
          <div className={styles.progressBar} aria-hidden="true">
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          <div className={styles.questionHeader}>
            <span className={styles.questionCount}>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <p className={styles.questionText}>{currentQuestion.text}</p>
          </div>

          <div className={styles.optionsList}>
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.optionButton} ${getOptionClass(option.id)}`}
                onClick={() => !submitted && setSelectedOption(option.id)}
                disabled={submitted}
                aria-pressed={selectedOption === option.id}
              >
                <span className={styles.optionLabel}>{option.label}</span>
              </button>
            ))}
          </div>

          {submitted && (
            <div className={styles.feedbackBox}>
              <p className={styles.feedbackHeading}>
                {answers.length === currentIndex
                  ? "Review your answer"
                  : "☁︎ Answer recorded"}
              </p>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className={styles.buttonRow}>
            {!submitted ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSubmit}
                disabled={!hasSelected}
              >
                Submit answer
              </button>
            ) : (
              <button type="button" className={styles.primaryButton} onClick={handleNext}>
                {isLastQuestion ? "View results" : "Next question"}
              </button>
            )}
          </div>
        </div>
      )}

      {isResult && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <p className={styles.resultLabel}>Quiz complete</p>
            <h3>Your score</h3>
          </div>

          <div className={styles.resultBody}>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreCenter}>
                <span className={styles.scorePercent}>{scorePercent}%</span>
                <span className={styles.scoreFraction}>
                  {correctCount}/{totalQuestions}
                </span>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statPanel}>
                <span className={`${styles.statIcon} ${styles.correctIcon}`}>✓</span>
                <p className={styles.statValue}>{correctCount}</p>
                <p className={styles.statLabel}>Correct</p>
              </div>
              <div className={styles.statPanel}>
                <span className={`${styles.statIcon} ${styles.wrongIcon}`}>✕</span>
                <p className={styles.statValue}>{incorrectCount}</p>
                <p className={styles.statLabel}>Incorrect</p>
              </div>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.primaryButton} onClick={handleRestart}>
              Restart ↺
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
