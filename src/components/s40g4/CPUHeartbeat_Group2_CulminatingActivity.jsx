import React, { useState } from 'react';

// The missions bridge High-Level Code to Hardware Routing
const MISSIONS = [
    {
        instruction: "let score = 100;  // Variable Assignment",
        objective: "The game just started! The CPU needs to fetch this line of code, understand it, and save the number '100' into its temporary workspace.",
        steps: [
            { target: "PC_TO_MAR", hint: "You need to find where the code lives first. Route the Program Counter (PC) to the Address Register (MAR)." },
            { target: "RAM_TO_IR", hint: "Now that you have the address, pull the actual instruction out of Main Memory (RAM) and into the Instruction Register (IR)." },
            { target: "IR_TO_CU", hint: "The CPU needs to understand what 'let score = 100' means. Send it to the Control Unit (CU) to decode." },
            { target: "RAM_TO_REG", hint: "The CU realizes it's saving a number! Route the value '100' from RAM into the CPU's Registers." }
        ]
    },
    {
        instruction: "score = score + 50;  // Math Operation",
        objective: "The player just collected a coin! The CPU needs to fetch this code, bring the current score to the calculator, add 50, and save it.",
        steps: [
            { target: "PC_TO_MAR", hint: "Find the next line of code by sending the Program Counter (PC) address to the MAR." },
            { target: "RAM_TO_IR", hint: "Load the addition command from RAM into the Instruction Register (IR)." },
            { target: "IR_TO_CU", hint: "Send the command to the Control Unit (CU) so it can prepare the calculator." },
            { target: "REG_TO_ALU", hint: "Send the current score and the number 50 from the Registers into the ALU to be added together." },
            { target: "ALU_TO_REG", hint: "Route the final calculated sum from the ALU back into the Registers to update the score." }
        ]
    }
];

export default function CulminatingActivity() {
    const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const [errorGlitch, setErrorGlitch] = useState(false);
    const [successWave, setSuccessWave] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [errorFeedback, setErrorFeedback] = useState(null);

    // --- CYBER-TECH PALETTE CONFIGURATION ---
    const ACCENTS = {
        CYAN: '#00bafa',
        PURPLE: '#8338ec',
        PINK: '#fe006f',
        YELLOW: '#febe0b'
    };

    const mission = MISSIONS[currentMissionIdx];
    const currentStep = mission.steps[stepIdx];
    const isCompleted = stepIdx >= mission.steps.length;

    // Lightweight Synthesizer Sound Engine for feedback
    const playTone = (freq, type = 'sine', duration = 0.1) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) { console.log("Audio context not initialized"); }
    };

    const BUS_FEEDBACK = {
        PC_TO_MAR: { wrong: "Not yet! You need to find the memory address first. The Program Counter holds where to look.", why: "The PC→MAR connection is always the first step in a fetch cycle." },
        RAM_TO_IR: { wrong: "You haven't gotten the address to memory yet! Route PC→MAR first.", why: "RAM can't be read until MAR tells it which address to access." },
        IR_TO_CU: { wrong: "The Control Unit can't decode nothing! You need to fetch the instruction from RAM first.", why: "The CU needs an instruction in the IR before it can decode anything." },
        RAM_TO_REG: { wrong: "The CU hasn't decoded the instruction yet! Send it to the Control Unit first.", why: "The CU must know what to do before routing data to registers." },
        REG_TO_ALU: { wrong: "The ALU needs data from registers, but you haven't decoded the command yet!", why: "The CU must set up the ALU operation before sending operands." },
        ALU_TO_REG: { wrong: "The ALU hasn't computed anything yet! Send operands to the ALU first.", why: "Results can only be routed back after the ALU performs its operation." }
    };

    const triggerBusConnection = (busId) => {
        if (isCompleted) return;

        if (busId === currentStep.target) {
            playTone(587.33, 'triangle', 0.15);
            setShowHint(false);
            setErrorFeedback(null);
            
            if (stepIdx + 1 >= mission.steps.length) {
                setSuccessWave(true);
                playTone(880, 'sine', 0.4);
                setStepIdx(stepIdx + 1);
            } else {
                setStepIdx(stepIdx + 1);
            }
        } else {
            setErrorGlitch(true);
            playTone(150, 'sawtooth', 0.25);
            setErrorFeedback(BUS_FEEDBACK[busId] || { wrong: "That's not the right pathway for this step.", why: "Check the objective and try a different connection." });
            setTimeout(() => setErrorGlitch(false), 400);
            setTimeout(() => setErrorFeedback(null), 4000);
        }
    };

    const nextMission = () => {
        setSuccessWave(false);
        setStepIdx(0);
        setShowHint(false);
        setCurrentMissionIdx((currentMissionIdx + 1) % MISSIONS.length);
    };

    return (
        <div style={{ backgroundColor: '#0a0c0D', padding: '30px', borderRadius: '16px', border: `2px solid ${successWave ? ACCENTS.YELLOW : errorGlitch ? ACCENTS.PINK : '#202425'}`, color: '#f0fafa', fontFamily: '"JetBrains Mono", monospace', position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease', maxWidth: '900px', margin: '30px auto', boxSizing: 'border-box', width: '100%' }}>
            
            {/* CSS ANIMATIONS & FONT INJECTIONS */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
                    
                    @keyframes matrixGlitch {
                        0% { transform: translate(0); filter: hue-rotate(0deg); }
                        20% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
                        40% { transform: translate(3px, -2px); }
                        60% { transform: translate(-2px, -2px); }
                        80% { transform: translate(2px, 2px); }
                        100% { transform: translate(0); filter: hue-rotate(0deg); }
                    }
                    @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(-5px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .glitch-active { animation: matrixGlitch 0.2s infinite linear; border: 2px solid ${ACCENTS.PINK} !important; }
                    .bus-line-btn { background: #0a0c0D; border: 1px solid #202425; color: #afafaf; padding: 12px 16px; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s; font-family: 'JetBrains Mono', monospace; }
                    .bus-line-btn:hover { background: #202425; color: #f0fafa; border-color: ${ACCENTS.CYAN}; transform: translateY(-2px); }
                    .bus-line-btn:focus-visible { outline: 2px solid ${ACCENTS.CYAN}; outline-offset: 2px; }
                    @media (max-width: 480px) {
                        .bus-grid { grid-template-columns: 1fr !important; }
                        .culminating-mission { font-size: 0.8rem !important; }
                        .culminating-code { font-size: 0.85rem !important; }
                        .culminating-goal { font-size: 0.8rem !important; }
                        .culminating-bus-label { font-size: 0.75rem !important; }
                        .culminating-success { font-size: 1.3rem !important; }
                        .bus-line-btn { padding: 10px 12px !important; }
                        .bus-line-btn span:first-child { font-size: 1rem !important; }
                    }
                `}
            </style>

            <div className={errorGlitch ? "glitch-active" : ""}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #202425', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                    <div>
                        <span className="culminating-mission" style={{ color: ACCENTS.CYAN, fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Bebas Neue", sans-serif' }}>⚙️ Mission {currentMissionIdx + 1}</span>
                        <h3 className="culminating-code" style={{ margin: '5px 0 0 0', fontSize: '1.4rem', color: '#f0fafa', fontFamily: '"JetBrains Mono", monospace' }}>Code: <span style={{ color: ACCENTS.PURPLE }}>{mission.instruction}</span></h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: '#afafaf', textTransform: 'uppercase', letterSpacing: '1px' }}>Routing Progress</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: ACCENTS.YELLOW, fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '1px' }}>{Math.min(stepIdx, mission.steps.length)} / {mission.steps.length} CONNECTIONS</div>
                    </div>
                </div>

                {/* OBJECTIVE */}
                <div className="culminating-goal" style={{ background: '#202425', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${ACCENTS.CYAN}`, marginBottom: '25px' }}>
                    <strong style={{ color: ACCENTS.CYAN, fontSize: '1.1rem', textTransform: 'uppercase', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '1px' }}>The Goal:</strong>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.95rem', color: '#f0fafa', lineHeight: '1.6' }}>{mission.objective}</p>
                </div>

                {!isCompleted ? (
                    <div>
                        {/* CONTROL PANEL HEADER WITH HINT BUTTON */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h4 style={{ color: '#afafaf', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0, letterSpacing: '1px', fontFamily: '"JetBrains Mono", monospace'}}>Control Panel: Select the correct data pathway</h4>
                            <button 
                                onClick={() => setShowHint(!showHint)} 
                                style={{ 
                                    background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.4rem', 
                                    filter: showHint ? `drop-shadow(0 0 8px ${ACCENTS.YELLOW})` : 'grayscale(100%) opacity(0.5)',
                                    transition: 'all 0.3s', padding: 0
                                }}
                                title="Need a hint?"
                            >
                                💡
                            </button>
                        </div>

                        {/* HINT DISPLAY */}
                        {showHint && (
                            <div style={{ background: '#202425', padding: '12px 15px', borderRadius: '8px', border: `1px solid ${ACCENTS.YELLOW}`, marginBottom: '20px', color: '#f0fafa', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <strong style={{ color: ACCENTS.YELLOW, fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.1rem', letterSpacing: '1px' }}>Hint: </strong> {currentStep.hint}
                            </div>
                        )}

                        {/* WRONG ANSWER FEEDBACK */}
                        {errorFeedback && (
                            <div style={{ background: 'rgba(254, 0, 111, 0.1)', padding: '12px 15px', borderRadius: '8px', border: `1px solid ${ACCENTS.PINK}`, marginBottom: '20px', color: '#f0fafa', fontSize: '0.9rem', lineHeight: '1.5', animation: 'fadeIn 0.3s ease' }}>
                                <strong style={{ color: ACCENTS.PINK }}>Wrong Pathway!</strong> {errorFeedback.wrong}
                                <br/><span style={{ color: '#afafaf', fontSize: '0.8rem' }}>{errorFeedback.why}</span>
                            </div>
                        )}

                        {/* INTERACTIVE BUS MATRIX */}
                        <div className="bus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("PC_TO_MAR")}>
                                <span style={{ display: 'block', color: '#f0fafa', fontWeight: 'bold', marginBottom: '6px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', letterSpacing: '1px' }}>📍 Find Address</span>
                                <span style={{ fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>🔌 Route: <span style={{ color: ACCENTS.CYAN }}>PC ➔ MAR</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("RAM_TO_IR")}>
                                <span style={{ display: 'block', color: '#f0fafa', fontWeight: 'bold', marginBottom: '6px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', letterSpacing: '1px' }}>📥 Fetch Instruction</span>
                                <span style={{ fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>🔌 Route: <span style={{ color: ACCENTS.CYAN }}>RAM ➔ IR</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("IR_TO_CU")}>
                                <span style={{ display: 'block', color: '#f0fafa', fontWeight: 'bold', marginBottom: '6px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', letterSpacing: '1px' }}>🧠 Decode Command</span>
                                <span style={{ fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>🔌 Route: <span style={{ color: ACCENTS.PURPLE }}>IR ➔ CU</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("RAM_TO_REG")}>
                                <span style={{ display: 'block', color: '#f0fafa', fontWeight: 'bold', marginBottom: '6px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', letterSpacing: '1px' }}>💾 Load Data</span>
                                <span style={{ fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>🔌 Route: <span style={{ color: ACCENTS.PINK }}>RAM ➔ Registers</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("REG_TO_ALU")}>
                                <span style={{ display: 'block', color: '#f0fafa', fontWeight: 'bold', marginBottom: '6px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', letterSpacing: '1px' }}>🧮 Send to Calculator</span>
                                <span style={{ fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>🔌 Route: <span style={{ color: ACCENTS.PINK }}>Registers ➔ ALU</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("ALU_TO_REG")}>
                                <span style={{ display: 'block', color: '#f0fafa', fontWeight: 'bold', marginBottom: '6px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', letterSpacing: '1px' }}>📝 Save Result</span>
                                <span style={{ fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>🔌 Route: <span style={{ color: ACCENTS.YELLOW }}>ALU ➔ Registers</span></span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* SUCCESS SCREEN */
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: `${ACCENTS.YELLOW}10`, borderRadius: '10px', border: `1px dashed ${ACCENTS.YELLOW}` }}>
                        <h3 className="culminating-success" style={{ color: ACCENTS.YELLOW, fontSize: '2.2rem', margin: '0 0 15px 0', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '2px' }}>🎉 EXECUTION SUCCESSFUL!</h3>
                        <p style={{ color: '#f0fafa', maxWidth: '550px', margin: '0 auto 25px auto', fontSize: '1rem', lineHeight: '1.6' }}>
                            You successfully took a high-level command and routed it through the physical hardware! This is exactly what your computer does billions of times per second.
                        </p>
                        <button onClick={nextMission} style={{ background: ACCENTS.YELLOW, color: '#0a0c0D', padding: '14px 35px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: `0 0 20px ${ACCENTS.YELLOW}40`, transition: 'transform 0.2s', fontFamily: '"JetBrains Mono", monospace' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                            Load Next Mission ➡️
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}