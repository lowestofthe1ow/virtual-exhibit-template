import React, { useState, useEffect, useRef } from 'react';

const ROUNDS_DATA = {
    easy: {
        title: "> ACCESS_LOG: ROUND 1 (CLEAR ANALOGIES)",
        description: "Vector routing for human-scale logical blocks.",
        scenarios: [
            { id: "e1", situation: "A delivery driver picks up a specific sealed package from a designated warehouse storage bin.", correctAnswer: "FETCH", explanation: "FETCH = Retrieving something from a specific location. The driver goes to the address (warehouse bin) and gets the data (package)." },
            { id: "e2", situation: "A spy uses a cipher sheet to translate a secret Morse code message into plain text instructions.", correctAnswer: "DECODE", explanation: "DECODE = Translating raw data into understandable instructions. The cipher (Control Unit) translates binary (Morse) into actions (plain text)." },
            { id: "e3", situation: "A lumberjack swings an axe to physically chop down a marked tree trunk.", correctAnswer: "EXECUTE", explanation: "EXECUTE = Performing the actual work. The axe (ALU) does the physical operation on the tree (data)." }
        ]
    },
    medium: {
        title: "> ACCESS_LOG: ROUND 2 (AUTOMATED GATES)",
        description: "Abstract trace evaluation inside automated machinery arrays.",
        scenarios: [
            { id: "m1", situation: "A vending machine internal mechanism rolls a specific soda can out from the deep storage rack.", correctAnswer: "FETCH", explanation: "FETCH = Pulling stored data from memory. The machine retrieves (fetches) the can from its storage address." },
            { id: "m2", situation: "A barcode scanner reads the black lines on a snack wrapper to figure out its item name and price.", correctAnswer: "DECODE", explanation: "DECODE = Interpreting raw data. The scanner reads the barcode pattern (binary) and translates it into item information." },
            { id: "m3", situation: "A cash register drawer pops open and the machine prints out a physical paper receipt.", correctAnswer: "EXECUTE", explanation: "EXECUTE = Performing the output action. The register executes the transaction by opening the drawer and printing results." }
        ]
    },
    hard: {
        title: "> ACCESS_LOG: ROUND 3 (SYSTEM ARCHITECTURE)",
        description: "Deep mainframe logistics coordination matrix.",
        scenarios: [
            { id: "h1", situation: "A robotic warehouse crane retrieves a heavy pallet based entirely on raw grid coordinate data.", correctAnswer: "FETCH", explanation: "FETCH = Address-based memory retrieval. The crane uses coordinates (address bus) to locate and retrieve the pallet (data)." },
            { id: "h2", situation: "An air traffic controller reads a complex radar flight matrix to deduce if a plane is cleared to land.", correctAnswer: "DECODE", explanation: "DECODE = Complex instruction interpretation. The controller (CU) analyzes radar data (instruction) to determine the correct control signals." },
            { id: "h3", situation: "A heavy hydraulic factory press slams down, stamping a flat sheet of metal into a finished car door.", correctAnswer: "EXECUTE", explanation: "EXECUTE = Heavy computation/transformation. The press (ALU) performs the actual physical transformation on the material (data)." }
        ]
    }
};

const STAGES = ['FETCH', 'DECODE', 'EXECUTE'];
const ROUND_ORDER = ['easy', 'medium', 'hard'];

export default function InstinctGame({ onGridActive, triggerTrackDirectly, isAmbientPlaying, toggleAmbientMusic }) {
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); 
    const [isRoundSubmitted, setIsRoundSubmitted] = useState(false);
    const [cumulativeScore, setCumulativeScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [touchDragging, setTouchDragging] = useState(null);
    const [keyboardSelected, setKeyboardSelected] = useState(null);
    const touchStartPos = useRef(null);

    // Auto-engage Daft Punk tracking if parent commands entry handshake
    useEffect(() => {
        if (triggerTrackDirectly) {
            toggleAmbientMusic();
        }
    }, [triggerTrackDirectly]);

    const currentRoundKey = ROUND_ORDER[currentRoundIndex];
    const currentRound = ROUNDS_DATA[currentRoundKey];

    const handleDragStart = (e, stageText) => {
        e.dataTransfer.setData("draggedStage", stageText);
    };

    const handleTouchStart = (e, stageText) => {
        touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setTouchDragging(stageText);
    };

    const handleTouchMove = (e) => {
        if (!touchDragging) return;
        e.preventDefault();
    };

    const handleTouchEnd = (e, scenarioId) => {
        if (!touchDragging || isRoundSubmitted) return;
        
        const touch = e.changedTouches[0];
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (dropTarget && dropTarget.closest('[data-scenario-id]')) {
            setUserAnswers({ ...userAnswers, [scenarioId]: touchDragging });
        }
        
        setTouchDragging(null);
        touchStartPos.current = null;
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e, scenarioId) => {
        e.preventDefault();
        const droppedStage = e.dataTransfer.getData("draggedStage");
        setUserAnswers({ ...userAnswers, [scenarioId]: droppedStage });
    };

    const handleStageKeyDown = (e, stage) => {
        if (isRoundSubmitted) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setKeyboardSelected(keyboardSelected === stage ? null : stage);
        }
    };

    const handleSlotKeyDown = (e, scenarioId) => {
        if (isRoundSubmitted || !keyboardSelected) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setUserAnswers({ ...userAnswers, [scenarioId]: keyboardSelected });
            setKeyboardSelected(null);
        }
    };

    const handleSubmitRound = () => {
        let roundPoints = 0;
        currentRound.scenarios.forEach(s => {
            if (userAnswers[s.id] === s.correctAnswer) roundPoints += 1;
        });
        setCumulativeScore(cumulativeScore + roundPoints);
        setIsRoundSubmitted(true);
    };

    const handleNextRound = () => {
        if (currentRoundIndex < ROUND_ORDER.length - 1) {
            setCurrentRoundIndex(currentRoundIndex + 1);
            setUserAnswers({});
            setIsRoundSubmitted(false);
        } else {
            setGameCompleted(true);
        }
    };

    const handleResetGame = () => {
        setCurrentRoundIndex(0);
        setUserAnswers({});
        setIsRoundSubmitted(false);
        setCumulativeScore(0);
        setGameCompleted(false);
    };

    const allFilled = currentRound.scenarios.every(s => userAnswers[s.id]);

    return (
        <div style={{
            border: '1px solid #004d66', 
            padding: '25px', 
            borderRadius: '4px', 
            backgroundColor: '#05080c',
            color: '#c0f3ff',
            maxWidth: '750px',
            margin: '20px auto',
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            boxShadow: '0 0 20px rgba(0, 186, 250, 0.05)',
            boxSizing: 'border-box',
            width: '100%'
        }}>
            <style>{`
                @media (max-width: 600px) {
                    .instinct-scenario { flex-direction: column !important; gap: 10px !important; }
                    .instinct-dropzone { width: 100% !important; }
                    .instinct-title { font-size: 1rem !important; }
                    .instinct-desc { font-size: 0.7rem !important; }
                    .instinct-situation { font-size: 0.75rem !important; }
                    .instinct-stage { font-size: 0.7rem !important; padding: 8px 12px !important; }
                    .instinct-feedback { font-size: 0.7rem !important; }
                    .instinct-result { font-size: 1.2rem !important; }
                }
            `}</style>
            
            {!gameCompleted ? (
                <div>
                    {/* HARD-FORCED FONTS ON THE HEADER SECTION */}
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <h3 className="instinct-title" style={{ 
                            color: '#00bafa', 
                            margin: '0 0 4px 0', 
                            fontSize: '1.4rem',
                            fontFamily: '"JetBrains Mono", "Courier New", monospace',
                            textTransform: 'uppercase'
                        }}>
                            {currentRound.title}
                        </h3>
                        <p className="instinct-desc" style={{ 
                            color: '#537a85', 
                            fontSize: '0.85rem', 
                            margin: 0,
                            fontFamily: '"JetBrains Mono", "Courier New", monospace'
                        }}>
                            {currentRound.description}
                        </p>
                    </div>

                    {/* DRAG TARGET OPTIONS */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                        {STAGES.map((stage) => (
                            <div 
                                key={stage}
                                draggable={!isRoundSubmitted} 
                                onDragStart={(e) => handleDragStart(e, stage)}
                                onTouchStart={(e) => handleTouchStart(e, stage)}
                                onTouchMove={handleTouchMove}
                                onKeyDown={(e) => handleStageKeyDown(e, stage)}
                                tabIndex={isRoundSubmitted ? -1 : 0}
                                role="button"
                                aria-label={`Select ${stage} stage${keyboardSelected === stage ? ' (selected)' : ''}`}
                                aria-pressed={keyboardSelected === stage}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: isRoundSubmitted ? '#020204' : keyboardSelected === stage ? '#00bafa' : touchDragging === stage ? '#00bafa' : '#004d66',
                                    color: isRoundSubmitted ? '#537a85' : keyboardSelected === stage ? '#000' : touchDragging === stage ? '#000' : '#c0f3ff',
                                    border: `1px solid ${isRoundSubmitted ? '#112233' : keyboardSelected === stage || touchDragging === stage ? '#00bafa' : '#00bafa'}`,
                                    borderRadius: '2px',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    cursor: isRoundSubmitted ? 'default' : 'grab',
                                    userSelect: 'none',
                                    fontFamily: '"JetBrains Mono", "Courier New", monospace',
                                    transform: keyboardSelected === stage || touchDragging === stage ? 'scale(1.05)' : 'none',
                                    transition: 'all 0.15s ease',
                                    outline: keyboardSelected === stage ? '2px solid #febe0b' : 'none',
                                    outlineOffset: '2px'
                                }}
                            >
                                [{stage}]
                            </div>
                        ))}
                    </div>
                    {keyboardSelected && (
                        <div style={{ textAlign: 'center', color: '#febe0b', fontSize: '0.8rem', marginBottom: '15px', fontFamily: '"JetBrains Mono", monospace' }}>
                            Keyboard mode: <strong>{keyboardSelected}</strong> selected. Press Enter/Space on a scenario slot to assign it, or press {keyboardSelected} again to deselect.
                        </div>
                    )}

                    {/* SLOTS AREA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {currentRound.scenarios.map((scenario) => {
                            const answer = userAnswers[scenario.id];
                            const isCorrect = answer === scenario.correctAnswer;

                            return (
                                <div key={scenario.id} className="instinct-scenario" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div className="instinct-scenario" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#020204', padding: '15px', border: `1px solid ${isRoundSubmitted ? (isCorrect ? '#00bafa' : '#fe006f') : '#004d66'}`, borderRadius: '2px', flexWrap: 'wrap' }}>
                                        <div className="instinct-situation" style={{ flex: 1, minWidth: '200px', color: '#c0f3ff', fontSize: '0.85rem', lineHeight: '1.5', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                                            {`> "${scenario.situation}"`}
                                        </div>

                                        <div 
                                            className="instinct-dropzone"
                                            data-scenario-id={scenario.id}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => !isRoundSubmitted && handleDrop(e, scenario.id)}
                                            onTouchEnd={(e) => handleTouchEnd(e, scenario.id)}
                                            onKeyDown={(e) => handleSlotKeyDown(e, scenario.id)}
                                            tabIndex={isRoundSubmitted ? -1 : 0}
                                            role="button"
                                            aria-label={`Drop zone for scenario: ${scenario.situation.substring(0, 30)}...${answer ? ` (assigned: ${answer})` : ''}`}
                                            style={{
                                                width: '130px',
                                                minHeight: '40px',
                                                border: answer ? '1px solid #00bafa' : '1px dashed #537a85',
                                                backgroundColor: answer ? 'rgba(0, 186, 250, 0.05)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                color: answer ? '#00bafa' : '#537a85',
                                                fontSize: '0.8rem',
                                                fontFamily: '"JetBrains Mono", "Courier New", monospace',
                                                cursor: isRoundSubmitted ? 'default' : 'pointer'
                                            }}
                                        >
                                            {answer ? answer : "READY FOR DROP"}
                                        </div>

                                        {isRoundSubmitted && (
                                            <div style={{ width: '30px', textAlign: 'center', color: isCorrect ? '#00bafa' : '#fe006f', fontWeight: 'bold', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                                                {isCorrect ? '✔' : '✘'}
                                            </div>
                                        )}
                                    </div>
                                    {isRoundSubmitted && !isCorrect && (
                                        <div className="instinct-feedback" style={{ padding: '10px 15px', background: 'rgba(254, 0, 111, 0.1)', borderLeft: '3px solid #fe006f', fontSize: '0.8rem', color: '#fe006f', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                                            <strong>Explanation:</strong> {scenario.explanation}
                                        </div>
                                    )}
                                    {isRoundSubmitted && isCorrect && (
                                        <div className="instinct-feedback" style={{ padding: '10px 15px', background: 'rgba(0, 186, 250, 0.1)', borderLeft: '3px solid #00bafa', fontSize: '0.8rem', color: '#00bafa', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                                            ✓ {scenario.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '35px' }}>
                        {!isRoundSubmitted ? (
                            <button 
                                onClick={handleSubmitRound}
                                disabled={!allFilled}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: allFilled ? 'transparent' : '#020204',
                                    color: allFilled ? '#fe006f' : '#537a85',
                                    border: `1px solid ${allFilled ? '#fe006f' : '#112233'}`,
                                    cursor: allFilled ? 'pointer' : 'not-allowed',
                                    fontFamily: '"JetBrains Mono", "Courier New", monospace', // Explicit override
                                    fontSize: '0.9rem'
                                }}
                            >
                                COMMIT_ANSWERS_TO_BUS
                            </button>
                        ) : (
                            <button 
                                onClick={handleNextRound}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: 'transparent',
                                    color: '#00bafa',
                                    border: '1px solid #00bafa',
                                    cursor: 'pointer',
                                    fontFamily: '"JetBrains Mono", "Courier New", monospace', // Explicit override
                                    fontSize: '0.9rem'
                                }}
                            >
                                {currentRoundIndex === ROUND_ORDER.length - 1 ? "LOAD FINAL SUMMARY" : "ADVANCE CYCLE SYSTEM →"}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h3 style={{ color: '#febe0b', fontSize: '1.8rem', margin: '0 0 10px 0', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                        ⚡ GRID COMPILATION SUCCESSFUL
                    </h3>
                    <p style={{ color: '#537a85', marginBottom: '35px', fontSize: '0.85rem', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                        All instructional streams evaluated through the mainframe pipeline.
                    </p>
                    
                    <div style={{ background: '#020204', display: 'inline-block', padding: '20px 40px', border: '1px solid #004d66', marginBottom: '35px' }}>
                        <p style={{ margin: '0 0 5px 0', textTransform: 'uppercase', color: '#00bafa', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                            INTEGRITY SCORE VERDICT
                        </p>
                        <h2 style={{ fontSize: '3rem', margin: 0, color: cumulativeScore >= 7 ? '#00bafa' : '#fe006f', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                            {cumulativeScore} / 9
                        </h2>
                    </div>

                    <div>
                        <button 
                            onClick={handleResetGame}
                            style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#c0f3ff', border: '1px solid #004d66', cursor: 'pointer', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '0.85rem' }}
                        >
                            [RESET SYSTEM REGISTERS]
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}