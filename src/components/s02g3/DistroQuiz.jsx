/**
 * DistroQuiz.jsx
 *
 * An interactive Windows evolution trivia quiz.
 * Higher total scores unlock stronger result titles.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Howl } from "howler";
import "../../styles/s02g3/quiz.css";
import win95Startup from "../../assets/s02g3/win95.mp3";

const questions = [
  {
    text: "When was Windows 1.0 released?",
    options: [
      { id: "win1-1983", label: "1983", points: 0 },
      { id: "win1-1985", label: "1985", points: 2 },
      { id: "win1-1988", label: "1988", points: 0 },
      { id: "win1-1990", label: "1990", points: 0 },
    ],
  },
  {
    kind: "audio",
    audioText: "Which Windows version is this startup sound from?",
    fallbackText: "Which Windows release introduced the Start menu and taskbar to the mainstream?",
    soundSrc: win95Startup,
    options: [
      { id: "start-31", label: "Windows 3.1", points: 0 },
      { id: "start-95", label: "Windows 95", points: 2 },
      { id: "start-98", label: "Windows 98", points: 0 },
      { id: "start-xp", label: "Windows XP", points: 0 },
    ],
  },
  {
    text: "Which feature was introduced in the development and release of Windows 3.0?",
    options: [
      { id: "feature-pnp", label: "Plug and Play enhancements", points: 0 },
      { id: "feature-wmm", label: "Windows Movie Maker", points: 0 },
      { id: "feature-dc", label: "Disk Cleanup", points: 0 },
      { id: "feature-fm", label: "File Manager", points: 2 },
    ],
  },
  {
    text: "Which Windows release replaced the classic Start menu with a tile-based Start screen?",
    options: [
      { id: "tiles-vista", label: "Windows Vista", points: 0 },
      { id: "tiles-7", label: "Windows 7", points: 0 },
      { id: "tiles-8", label: "Windows 8", points: 2 },
      { id: "tiles-10", label: "Windows 10", points: 0 },
    ],
  },
  {
    text: "Which version was designed to unify the user experience across multiple devices such as PCs, tablets, and smartphones?",
    options: [
      { id: "unify-7", label: "Windows 7", points: 0 },
      { id: "unify-8", label: "Windows 8", points: 0 },
      { id: "unify-10", label: "Windows 10", points: 2 },
      { id: "unify-11", label: "Windows 11", points: 0 },
    ],
  },
];

const scoreTiers = [
  {
    minScore: 10,
    title: "Windows Evolution Master",
    tagline: "You can trace the platform from tiled windows to centered taskbars.",
    color: "#0067C0",
    desc: "You know the major turning points in Windows history and can place key interface and architecture changes with confidence.",
  },
  {
    minScore: 8,
    title: "Windows Historian",
    tagline: "You know the major milestones and can identify the key releases.",
    color: "#007A33",
    desc: "You have a solid understanding of Windows history, but a few details may still need refreshing.",
  },
  {
    minScore: 6,
    title: "Release Archivist",
    tagline: "You know your way around the biggest milestones.",
    color: "#1F6F8B",
    desc: "You have a solid grasp of how Windows evolved, even if a few release details still need a refresher.",
  },
  {
    minScore: 4,
    title: "Windows Enthusiast",
    tagline: "You know your way around the major releases.",
    color: "#FF9900",
    desc: "You have a good understanding of Windows history, but there are still some gaps to fill.",
  },
  {
    minScore: 2,
    title: "Control Panel Explorer",
    tagline: "You remember the landmarks, but not every build note.",
    color: "#4C7A34",
    desc: "You recognize the headline changes across major versions, and a little more timeline study will push you into expert territory.",
  },
  {
    minScore: 0,
    title: "Fresh Install",
    tagline: "Every expert starts with a first boot.",
    color: "#8A5A2B",
    desc: "This is a good baseline. Walk the exhibit timeline once more and the next run should score much higher.",
  },
];

function getResult(totalScore) {
  return scoreTiers.find((tier) => totalScore >= tier.minScore) ?? scoreTiers[scoreTiers.length - 1];
}

export default function DistroQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAudioQuestion, setShowAudioQuestion] = useState(true);
  const soundRef = useRef(null);

  const totalQ = questions.length;
  const isIntro = step === 0;
  const isResult = step > totalQ;
  const currentQ = questions[step - 1];
  const isAudioQuestion = currentQ?.kind === "audio";
  const questionText = isAudioQuestion && !showAudioQuestion ? currentQ.fallbackText : currentQ?.audioText ?? currentQ?.text;

  useEffect(
    () => () => {
      soundRef.current?.stop();
      soundRef.current?.unload();
      soundRef.current = null;
    },
    [],
  );

  function stopQuestionSound() {
    soundRef.current?.stop();
    soundRef.current?.unload();
    soundRef.current = null;
  }

  function playQuestionSound(src) {
    if (!src) return;

    stopQuestionSound();

    const sound = new Howl({
      src: [src],
      html5: true,
      preload: true,
      onend: () => {
        sound.unload();
        if (soundRef.current === sound) {
          soundRef.current = null;
        }
      },
      onstop: () => {
        sound.unload();
        if (soundRef.current === sound) {
          soundRef.current = null;
        }
      },
      onloaderror: () => {
        if (soundRef.current === sound) {
          soundRef.current = null;
        }
      },
      onplayerror: () => {
        if (soundRef.current === sound) {
          soundRef.current = null;
        }
      },
    });

    soundRef.current = sound;
    sound.play();
  }

  function handleNext() {
    if (!selected) return;
    stopQuestionSound();
    setAnswers((prev) => [...prev, selected]);
    setSelected(null);
    setStep((s) => s + 1);
  }

  function handleClose() {
    stopQuestionSound();
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setShowAudioQuestion(true);
  }

  function handleRestart() {
    stopQuestionSound();
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setShowAudioQuestion(true);
  }

  const totalScore = answers.reduce((sum, answerId) => {
    const selectedOption = questions
      .flatMap((question) => question.options)
      .find((option) => option.id === answerId);

    return sum + (selectedOption?.points ?? 0);
  }, 0);
  const maxScore = questions.length * 2;
  const result = isResult ? getResult(totalScore) : null;

  if (isIntro) {
    return (
      <div className="quiz-root-wrapper quiz-inline">
        <div className="quiz-modal-card--inline">
          <div className="quiz-animated-step">
            <h3 className="quiz-question-heading">Windows Evolution Trivia</h3>
            <p className="quiz-intro-text">
              Answer 5 quick questions about major Windows releases. Each correct answer adds to your total score and unlocks a stronger title at the end.
            </p>
            <button className="quiz-btn-primary" onClick={() => setStep(1)}>
              Start the quiz →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quizOverlay = (
    <div className="quiz-root-wrapper quiz-overlay-backdrop" onClick={handleClose}>
      <div className="quiz-modal-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="quiz-close-x" onClick={handleClose} aria-label="Close quiz">×</button>

        {/* -- Screen 2: Active Question Pass -- */}
        {!isIntro && !isResult && currentQ && (
          <div className="quiz-animated-step" key={step}>
            <div className="quiz-progress-track">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`quiz-progress-segment ${i < step ? "is-filled" : ""}`} 
                />
              ))}
            </div>

            <p className="quiz-step-meta">Question {step} of {totalQ}</p>
            <h3 className="quiz-question-heading">{questionText}</h3>

            {isAudioQuestion && (
              <div className="quiz-control-row" style={{ marginBottom: "1rem" }}>
                {showAudioQuestion ? (
                  <>
                    <button
                      type="button"
                      className="quiz-btn-primary quiz-btn-secondary"
                      onClick={() => playQuestionSound(currentQ.soundSrc)}
                    >
                      Play startup sound
                    </button>
                    <button
                      type="button"
                      className="quiz-btn-primary quiz-btn-secondary"
                      onClick={() => {
                        stopQuestionSound();
                        setShowAudioQuestion(false);
                        setSelected(null);
                      }}
                    >
                      Can't listen? Use text question instead
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="quiz-btn-primary quiz-btn-secondary"
                    onClick={() => {
                      stopQuestionSound();
                      setShowAudioQuestion(true);
                      setSelected(null);
                    }}
                  >
                    Use startup sound question
                  </button>
                )}
              </div>
            )}

            <div className="quiz-options-grid">
              {currentQ.options.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`quiz-option-card ${isSelected ? "is-active" : ""}`}
                    onClick={() => setSelected(opt.id)}
                    aria-pressed={isSelected}
                  >
                    {isSelected && <span className="quiz-checkmark-icon">✓</span>}
                    <div className="quiz-option-card-title">{opt.label}</div>
                    <div className="quiz-option-card-desc">{opt.desc}</div>
                  </button>
                );
              })}
            </div>

            <button 
              className="quiz-btn-primary" 
              disabled={!selected} 
              onClick={handleNext}
            >
              {step === totalQ ? "See my result →" : "Next →"}
            </button>
          </div>
        )}

        {/* -- Screen 3: Minimalized Results Panel Pass -- */}
        {isResult && result && (
          <div className="quiz-animated-step">
            <p className="quiz-result-header-text">Your Trivia Rank</p>
            <p className="quiz-step-meta">Score {totalScore} of {maxScore}</p>
            
            <div 
              className="quiz-modern-result-card"
              style={{ background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, ${result.color}0A 100%), var(--color-background-primary, #ffffff)`, border: `2px solid ${result.color}` }}
            >
              <div className="quiz-result-identity-block">
                <div 
                  className="quiz-result-status-indicator" 
                  style={{ background: result.color, boxShadow: `0 0 12px ${result.color}80` }} 
                />
                <div>
                  <div className="quiz-result-main-title">{result.title}</div>
                  <div className="quiz-result-sub-tagline">“{result.tagline}”</div>
                </div>
              </div>

              <p className="quiz-result-body-desc">{result.desc}</p>
            </div>

            <div className="quiz-control-row">
              <button className="quiz-btn-primary" onClick={handleRestart}>
                ↺ Retake quiz
              </button>
              <button className="quiz-btn-primary quiz-btn-secondary" onClick={handleClose}>
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(quizOverlay, document.body) : null;
}