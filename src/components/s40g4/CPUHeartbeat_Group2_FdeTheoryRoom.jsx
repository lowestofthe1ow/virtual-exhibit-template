import React, { useState } from 'react';

export default function FdeTheoryRoom() {
    const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });
    const [roomCleared, setRoomCleared] = useState(false);
    const [error, setError] = useState(false);
    const [feedback, setFeedback] = useState({ q1: '', q2: '', q3: '' });

    const handleInputChange = (q, value) => {
        setAnswers(prev => ({ ...prev, [q]: value }));
        setError(false);
        setFeedback(prev => ({ ...prev, [q]: '' }));
    };

    const submitFlags = () => {
        const correctAnswers = { q1: 'fetch', q2: 'decode', q3: 'execute' };
        const explanations = {
            q1: 'FETCH: The CPU retrieves instructions from memory using the Program Counter (PC). Think of it like checking your to-do list to see what to do next.',
            q2: 'DECODE: The Control Unit translates binary instructions into control signals. Like a universal remote figuring out what button you pressed.',
            q3: 'EXECUTE: The ALU performs the actual computation. Like a calculator doing the math after you type in numbers and press equals.'
        };
        
        let newFeedback = {};
        let allCorrect = true;
        
        Object.keys(correctAnswers).forEach(q => {
            const isCorrect = answers[q].trim().toLowerCase() === correctAnswers[q];
            newFeedback[q] = isCorrect ? 'correct' : explanations[q];
            if (!isCorrect) allCorrect = false;
        });
        
        setFeedback(newFeedback);
        
        if (allCorrect) {
            setRoomCleared(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    return (
        <div style={{
            border: '1px solid #004d66',
            backgroundColor: '#05080c',
            borderRadius: '4px',
            width: '100%',
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            boxShadow: '0 0 15px rgba(0, 186, 250, 0.05)',
            marginBottom: '40px',
            boxSizing: 'border-box'
        }}>
            <style>{`
                @media (max-width: 480px) {
                    .theory-input { width: 100% !important; }
                    .theory-title { font-size: 0.85rem !important; }
                    .theory-briefing { font-size: 0.78rem !important; }
                    .theory-label { font-size: 0.75rem !important; }
                    .theory-feedback { font-size: 0.72rem !important; }
                    .theory-status { font-size: 0.75rem !important; }
                }
            `}</style>
            {/* TASK HEADER */}
            <div style={{ backgroundColor: '#020204', padding: '15px 20px', borderBottom: '1px solid #004d66', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span className="theory-title" style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    TASK 1: UNDERSTANDING THE CPU PIPELINE
                </span>
                <span className="theory-status" style={{ color: roomCleared ? '#00bafa' : '#537a85', fontSize: '0.9rem' }}>
                    STATUS: {roomCleared ? '[ COMPLETED ]' : '[ IN PROGRESS ]'}
                </span>
            </div>

            <div style={{ padding: '25px' }}>
                {/* TASK BRIEFING */}
                <h3 style={{ color: '#00bafa', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '1rem' }}>
                    &gt; Task Briefing
                </h3>
                <div className="theory-briefing" style={{ color: '#c0f3ff', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px', padding: '15px', background: 'rgba(0, 77, 102, 0.1)', borderLeft: '3px solid #00bafa' }}>
                    <p style={{ margin: '0 0 10px 0' }}>Every time a computer does anything, from moving a mouse to rendering a 3D game, the CPU is rapidly cycling through three distinct stages:</p>
                    <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px', color: '#537a85' }}>
                        <li style={{ marginBottom: '8px' }}><strong style={{ color: '#c0f3ff' }}>1. The FETCH Stage:</strong> The CPU reaches out to the main memory (RAM) to retrieve the next instruction in the sequence. It uses a special register called the Program Counter (PC) to know exactly which memory address to look at.</li>
                        <li style={{ marginBottom: '8px' }}><strong style={{ color: '#c0f3ff' }}>2. The DECODE Stage:</strong> The CPU's Control Unit takes that raw instruction (which is just binary code) and translates it into specific electrical signals. It figures out what needs to be done and activates the correct hardware pathways.</li>
                        <li><strong style={{ color: '#c0f3ff' }}>3. The EXECUTE Stage:</strong> The actual work is performed. This might involve the Arithmetic Logic Unit (ALU) doing math, moving data between registers, or writing data back to memory.</li>
                    </ul>
                </div>

                {/* KNOWLEDGE CHECK */}
                <h3 style={{ color: '#febe0b', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '1rem' }}>
                    &gt; Knowledge Check
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                    {/* Q1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#537a85', fontSize: '0.85rem' }}>
                            1. The CPU retrieves the next instruction from main memory (RAM). This stage is called:
                        </label>
                        <input 
                            className="theory-input"
                            type="text" 
                            disabled={roomCleared}
                            value={answers.q1} 
                            onChange={(e) => handleInputChange('q1', e.target.value)}
                            placeholder="Enter term..."
                            style={{ background: '#020204', border: `1px solid ${feedback.q1 === 'correct' ? '#00bafa' : feedback.q1 ? '#fe006f' : '#004d66'}`, color: '#00bafa', padding: '10px', fontFamily: 'inherit', outline: 'none', width: '250px', maxWidth: '100%', boxSizing: 'border-box' }}
                        />
                        {feedback.q1 && feedback.q1 !== 'correct' && (
                            <div style={{ color: '#fe006f', fontSize: '0.8rem', padding: '8px', background: 'rgba(254, 0, 111, 0.1)', borderLeft: '3px solid #fe006f' }}>
                                {feedback.q1}
                            </div>
                        )}
                        {feedback.q1 === 'correct' && (
                            <div style={{ color: '#00bafa', fontSize: '0.8rem' }}>✓ Correct</div>
                        )}
                    </div>
                    {/* Q2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#537a85', fontSize: '0.85rem' }}>
                            2. The Control Unit translates the instruction into signals the hardware can understand. This is the:
                        </label>
                        <input 
                            className="theory-input"
                            type="text" 
                            disabled={roomCleared}
                            value={answers.q2} 
                            onChange={(e) => handleInputChange('q2', e.target.value)}
                            placeholder="Enter term..."
                            style={{ background: '#020204', border: `1px solid ${feedback.q2 === 'correct' ? '#00bafa' : feedback.q2 ? '#fe006f' : '#004d66'}`, color: '#00bafa', padding: '10px', fontFamily: 'inherit', outline: 'none', width: '250px', maxWidth: '100%', boxSizing: 'border-box' }}
                        />
                        {feedback.q2 && feedback.q2 !== 'correct' && (
                            <div style={{ color: '#fe006f', fontSize: '0.8rem', padding: '8px', background: 'rgba(254, 0, 111, 0.1)', borderLeft: '3px solid #fe006f' }}>
                                {feedback.q2}
                            </div>
                        )}
                        {feedback.q2 === 'correct' && (
                            <div style={{ color: '#00bafa', fontSize: '0.8rem' }}>✓ Correct</div>
                        )}
                    </div>
                    {/* Q3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#537a85', fontSize: '0.85rem' }}>
                            3. The Arithmetic Logic Unit (ALU) performs the required mathematical or logical operation. This is the:
                        </label>
                        <input 
                            className="theory-input"
                            type="text" 
                            disabled={roomCleared}
                            value={answers.q3} 
                            onChange={(e) => handleInputChange('q3', e.target.value)}
                            placeholder="Enter term..."
                            style={{ background: '#020204', border: `1px solid ${feedback.q3 === 'correct' ? '#00bafa' : feedback.q3 ? '#fe006f' : '#004d66'}`, color: '#00bafa', padding: '10px', fontFamily: 'inherit', outline: 'none', width: '250px', maxWidth: '100%', boxSizing: 'border-box' }}
                        />
                        {feedback.q3 && feedback.q3 !== 'correct' && (
                            <div style={{ color: '#fe006f', fontSize: '0.8rem', padding: '8px', background: 'rgba(254, 0, 111, 0.1)', borderLeft: '3px solid #fe006f' }}>
                                {feedback.q3}
                            </div>
                        )}
                        {feedback.q3 === 'correct' && (
                            <div style={{ color: '#00bafa', fontSize: '0.8rem' }}>✓ Correct</div>
                        )}
                    </div>
                </div>

                {/* SUBMISSION AREA */}
                {!roomCleared ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button 
                            onClick={submitFlags}
                            aria-label="Submit answers"
                            style={{ backgroundColor: 'transparent', color: '#00bafa', border: '1px solid #00bafa', padding: '10px 20px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}
                        >
                            SUBMIT_FLAGS
                        </button>
                        {error && <span style={{ color: '#fe006f', fontSize: '0.85rem' }}>[!] ACCESS DENIED: Check the red feedback below each incorrect answer.</span>}
                    </div>
                ) : (
                    <div style={{ color: '#febe0b', fontSize: '0.9rem', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>
                        ✓ ALL FLAGS ACCEPTED. SYSTEM ARCHITECTURE UNLOCKED.
                    </div>
                )}
            </div>
            <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }`}</style>
        </div>
    );
}