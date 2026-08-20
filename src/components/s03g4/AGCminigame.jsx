import React, { useState } from 'react';
import q1img from '../../assets/s03g4/q1img.webp';
import q2img from '../../assets/s03g4/q2img.webp';
import q3img from '../../assets/s03g4/q3img.webp'; 
import q4img from '../../assets/s03g4/q4img.webp'; 
import ansminigame from '../../assets/s03g4/ansminigame.webp';

export default function AGCMinigame() {
  const [activeStep, setActiveStep] = useState(1);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [unlockedModules, setUnlockedModules] = useState({
    ic: false,
    rope: false,
    dsky: false,
    exec: false
  });

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset? Your minigame progress will be completely lost."
    );
    if (confirmReset) {
      setActiveStep(1);
      setShowEvaluation(false);
      setIsCorrect(false);
      setExplanation('');
      setUnlockedModules({ ic: false, rope: false, dsky: false, exec: false });
    }
  };

  const handleSelection = (stepId, correct, text) => {
    setIsCorrect(correct);
    setExplanation(text);
    setShowEvaluation(true);

    if (correct) {
      setUnlockedModules((prev) => ({
        ...prev,
        ...(stepId === 1 && { ic: true }),
        ...(stepId === 2 && { rope: true }),
        ...(stepId === 3 && { dsky: true }),
        ...(stepId === 4 && { exec: true })
      }));
    }
  };

  const handleWorkflowShift = () => {
    setShowEvaluation(false);

    if (isCorrect) {
      if (activeStep < 4) {
        setActiveStep(activeStep + 1);
      } else {
        alert("Congratulations! All modules have been successfully mapped out and built! The AGC is ready for take off.");
        setActiveStep(1);
        setUnlockedModules({ ic: false, rope: false, dsky: false, exec: false });
      }
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg-deep-navy: #0B132B;   
          --panel-beige: #F4F1EA;    
          --text-dark: #1C2A4A;     
          --accent-gold: #E5A93B;    
          --accent-blue: #6B8EA7;    
          --font-heading: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-retro: 'IBM Plex Mono', monospace;
        }

        .main-canvas {
          width: 100%;
          background-color: var(--panel-beige);
          color: var(--text-dark);
          border-radius: 8px;
          padding: 2rem;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .game-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 2rem;
        }

        @media (max-width: 850px) {
          .game-grid { grid-template-columns: 1fr; }
        }

        .blueprint-card {
          background: #111A30;
          color: #EAEAEA;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(107, 142, 167, 0.3);
        }

        .blueprint-title {
          font-family: var(--font-retro);
          color: var(--accent-gold);
          font-size: 0.8rem;
          text-align: center;
          margin-bottom: 1.5rem;
          letter-spacing: 0.5px;
          border-bottom: 1px dashed rgba(107, 142, 167, 0.3);
          padding-bottom: 0.5rem;
        }

        .hardware-chassis {
          width: 100%;
          flex: 1;
          min-height: 380px;
          border: 2px dashed rgba(244, 241, 234, 0.15);
          position: relative;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 4px;
        }

        .chassis-component {
          position: absolute;
          background: rgba(107, 142, 167, 0.08);
          border: 1px dashed rgba(107, 142, 167, 0.4);
          color: rgba(244, 241, 234, 0.3);
          font-family: var(--font-retro);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0.75rem;
          box-sizing: border-box;
          border-radius: 4px;
          transition: all 0.5s ease-in-out;
        }

        .chassis-component.unlocked {
          color: #FFFFFF;
          border: 2px solid var(--accent-gold);
          background: rgba(229, 169, 59, 0.2);
          box-shadow: 0 0 15px rgba(229, 169, 59, 0.3);
          font-weight: bold;
        }

        .comp-ic-pos { top: 4%; left: 8%; width: 84%; height: 20%; }
        .comp-rope-pos { top: 28%; left: 8%; width: 84%; height: 20%; }
        .comp-dsky-pos { top: 52%; left: 8%; width: 84%; height: 20%; }
        .comp-exec-pos { top: 76%; left: 8%; width: 84%; height: 20%; }

        .interactive-viewport {
          background: #FFFFFF;
          border: 1px solid rgba(107, 142, 167, 0.25);
          border-radius: 8px;
          padding: 2rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
          position: relative;
        }

        .exit-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: 1px solid rgba(107, 142, 167, 0.3);
          color: var(--accent-blue);
          font-family: var(--font-retro);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.7rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 10;
        }

        .exit-btn:hover {
          background: #FFF5F5;
          color: #C92A2A;
          border-color: #FFA8A8;
        }

        .challenge-tag {
          font-family: var(--font-retro);
          color: var(--accent-blue);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .challenge-headline {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          line-height: 1.4;
          color: var(--text-dark);
          margin-top: 0;
          margin-bottom: 1.5rem;
        }

        .image-placeholder-frame {
          width: 100%;
          height: 200px;
          background-color: #F8F9FA;
          border: 2px dashed rgba(107, 142, 167, 0.4);
          border-radius: 6px;
          margin-bottom: 0.5rem; 
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-retro);
          font-size: 0.8rem;
          color: var(--accent-blue);
          text-transform: uppercase;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .image-placeholder-frame img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain; 
        }

        .image-source-caption {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--accent-blue);
          font-style: italic;
          text-align: center;
          margin-bottom: 1.75rem; 
        }

        .image-source-link {
          color: var(--accent-gold);
          text-decoration: underline;
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .choice-row-btn {
          width: 100%;
          background: #FFFFFF;
          color: var(--text-dark);
          border: 1.5px solid rgba(107, 142, 167, 0.4);
          padding: 1rem 1.25rem;
          text-align: left;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .choice-row-btn:hover {
          background: #F1F5F9;
          border-color: var(--accent-gold);
          transform: translateY(-1px);
        }

        .feedback-banner-title {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          margin-top: 0;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .feedback-banner-title.success { color: #2B8A3E; }
        .feedback-banner-title.failure { color: #C92A2A; }

        .feedback-body-text {
          font-size: 1.05rem;
          line-height: 1.55;
          color: var(--text-dark);
          margin-bottom: 2rem;
        }

        .navigation-cta-btn {
          background-color: var(--text-dark);
          color: #FFFFFF;
          border: none;
          padding: 0.9rem 1.8rem;
          font-family: var(--font-retro);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: opacity 0.2s;
        }

        .navigation-cta-btn:hover { opacity: 0.9; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }

        @keyframes popIn {
          0% { 
            transform: scale(0.95); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }

        .animate-failure {
          animation: shake 0.4s ease-in-out;
        }

        .animate-success {
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

        <div className="main-canvas">
          <div className="game-grid">
            
            <div className="blueprint-card">
              <div className="blueprint-title">// ARCHITECTURAL ASSEMBLY AREA</div>
              <div className="hardware-chassis">
                <div className={`chassis-component comp-ic-pos ${unlockedModules.ic ? 'unlocked' : ''}`}>
                  {unlockedModules.ic ? '[MODULE 01: INTEGRATED CIRCUITS]' : '[MODULE 01]'}
                </div>
                <div className={`chassis-component comp-rope-pos ${unlockedModules.rope ? 'unlocked' : ''}`}>
                  {unlockedModules.rope ? '[MODULE 02: ROPE MEMORY]' : '[MODULE 02]'}
                </div>
                <div className={`chassis-component comp-dsky-pos ${unlockedModules.dsky ? 'unlocked' : ''}`}>
                  {unlockedModules.dsky ? '[MODULE 03: DSKY INTERFACE]' : '[MODULE 03]'}
                </div>
                <div className={`chassis-component comp-exec-pos ${unlockedModules.exec ? 'unlocked' : ''}`}>
                  {unlockedModules.exec ? '[MODULE 04: EXEC SOFTWARE]' : '[MODULE 04]'}
                </div>
              </div>
            </div>

            <div className="interactive-viewport">
              <button className="exit-btn" onClick={handleReset}>✕ Reset Game</button>

              {!showEvaluation && activeStep === 1 && (
                <div className="question-block">
                  <div className="challenge-tag">Challenge 01</div>
                  <p className="challenge-headline">Pre-Apollo computers are so large they take up entire rooms. To successfully compress navigation hardware into a tiny rocket capsule, what micro solution must you choose?</p>
                  
                  <div className="image-placeholder-frame">
                    <img src={q1img.src} alt="Logic Constraints" />
                  </div>
                  <div className="image-source-caption">
                    NASA Electronic Associates Computer. <span className="image-source-link"> 
                    <a href="https://nara.getarchive.net/media/electronic-associates-electronic-computer-def5a5"> Source: NARA & DVIDS Public Domain Archives </a> </span>
                  </div>

                  <div className="options-stack">
                    <button className="choice-row-btn" onClick={() => handleSelection(1, false, "Vacuum tubes are far too heavy and bulky to fit onboard the spacecraft framework.")}>
                      A) Rearrange layout space for standard Vacuum Tubes
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(1, true, "Correct! Transitioning early to integrated circuits solved the problems within structural load space parameters.")}>
                      B) Implement newly developed Integrated Logic Circuits
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(1, false, "Modern flash micro-drives were not invented yet in this era of the Space Race.")}>
                      C) Wire up automated Solid State Micro-Drives
                    </button>
                  </div>
                </div>
              )}

              {!showEvaluation && activeStep === 2 && (
                <div className="question-block">
                  <div className="challenge-tag">Challenge 02</div>
                  <p className="challenge-headline">If critical computer guidance programs suffer from dynamic logic corruption or accidental overwrites mid-flight, the mission will fail. How do you isolate operational software code securely?</p>
                  
                  <div className="image-placeholder-frame">
                    <img src={q2img.src} alt="Core Logic Design" />
                  </div>
                  <div className="image-source-caption">
                    Corrupt Stock Image. <span className="image-source-link"> 
                    <a href="https://www.shutterstock.com/image-illustration/corrupted-document-icon-digital-file-highlighted-2072354282?dd_referrer=https%3A%2F%2Fwww.google.com%2F"> Source: Shutterstock </a> </span>
                  </div>

                  <div className="options-stack">
                    <button className="choice-row-btn" onClick={() => handleSelection(2, false, "Erasable core parameters process transient calculations, but has high corruption risks for permanent system programming.")}>
                      A) Commit operational flight programs to Erasable Core Memory elements
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(2, true, "Correct! Hardwiring through the read-only magnetic rope structures renders the program unalterable and completely safe from deep space hazards.")}>
                      B) Manufacture software logic into physical Read-Only Magnetic Rope Memory
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(2, false, "Spinning platter disks are highly susceptible to crashing under structural launch environments.")}>
                      C) Initialize code maps directly onto Magnetic Spinning Drum Disks
                    </button>
                  </div>
                </div>
              )}

              {!showEvaluation && activeStep === 3 && (
                <div className="question-block">
                  <div className="challenge-tag">Challenge 03</div>
                  <p className="challenge-headline">Astronauts must communicate with the AGC quickly and accurately while wearing bulky pressurized gloves. How do you design the human-machine interface?</p>
                  
                  <div className="image-placeholder-frame">
                    <img src={q3img.src} alt="Core Logic Design" />
                  </div>
                  <div className="image-source-caption">
                    Apollo Display and Keyboard Assembly. <span className="image-source-link"> 
                    <a href="https://airandspace.si.edu/collection-objects/keyboard-display-dsky-apollo/nasm_A19720317000"> Source: National Air and Space Museum </a> </span>
                  </div>

                  <div className="options-stack">
                    <button className="choice-row-btn" onClick={() => handleSelection(3, false, "A QWERTY keyboard requires too much precision for a gloved astronaut.")}>
                      A) A standard mechanical typewriter keyboard
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(3, false, "Switches are prone to error during rapid data entry and has poor visual feedback.")}>
                      B) An array of binary toggle switches
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(3, true, "Correct! A Display and Keyboard (DSKY) utilizing a simple syntax with large buttons allows for reliable operation.")}>
                      C) A numerical Display and Keyboard (DKSY)
                    </button>
                  </div>
                </div>
              )}

              {!showEvaluation && activeStep === 4 && (
                <div className="question-block">
                  <div className="challenge-tag">Challenge 04</div>
                  <p className="challenge-headline">During the critical descent, hardware radars might overload the computer with too much data. How should the software manage processing power to prevent a fatal crash?</p>
                  
                  <div className="image-placeholder-frame">
                    <img src={q4img.src} alt="Core Logic Design" />
                  </div>
                  <div className="image-source-caption">
                    Margaret Hamilton. <span className="image-source-link"> 
                    <a href="https://www.pinterest.com/pin/313563192786731045/"> Source: Pinterest </a> </span>
                  </div>

                  <div className="options-stack">
                    <button className="choice-row-btn" onClick={() => handleSelection(4, true, "Correct! Margaret Hamilton's asynchronous executive system drops low-priority tasks, ensuring flight-critical steering programs keep running.")}>
                      A) Implement Hamilton's asynchronous executive system that drops non-critical tasks
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(4, false, "Equal processing means crucial steering functions will be delayed while the computer processes background tasks.")}>
                      B) Distribute processing time equally to all background and foreground tasks
                    </button>
                    <button className="choice-row-btn" onClick={() => handleSelection(4, false, "A total shutdown and reboot during powered descent would leave the spacecraft flying completely blind.")}>
                      C) Force a total system shutdown and enter safe-mode
                    </button>
                  </div>
                </div>
              )}

              {showEvaluation && (
                <div className={`feedback-block ${isCorrect ? 'animate-success' : 'animate-failure'}`}>
                  <div className={`feedback-banner-title ${isCorrect ? 'success' : 'failure'}`}>
                    {isCorrect ? '✓ Component Accepted & Integrated' : '⚠ Assembly Error: Design Rejected'}
                  </div>
    
                  <div className="image-placeholder-frame">
                    <img src={ansminigame.src} alt="Correct Answer" />
                  </div>
                  <div className="image-source-caption">
                    Apollo Guidance Computer. <span className="image-source-link">
                    <a href="https://www.universetoday.com/articles/the-story-of-the-apollo-guidance-computer-part-3">Source: Universe Today</a></span>
                  </div>

                  <p className="feedback-body-text">{explanation}</p>
                  <button className="navigation-cta-btn" onClick={handleWorkflowShift}>
                    {isCorrect ? (activeStep === 4 ? 'Complete AGC Assembly' : 'Unlock Next Module') : 'Retry'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
}

