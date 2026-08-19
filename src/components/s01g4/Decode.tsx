import React, { useState, useRef, useEffect } from 'react';

export default function Decode() {
    const [step, setStep] = useState(0);
    const timers = useRef<NodeJS.Timeout[]>([]);

    function clearTimers() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    }

    useEffect(() => {
        return clearTimers;
    }, []);

    function meaningOfHex()
    {
        setStep(2);
    };

    function splitUp()
    {
        setStep(1);
    };

    function stopAnimation()
    {
        clearTimers();
        setStep(0);
    };

    const STEP_DURATION = 2000; // milliseconds per step

    function playAnimation()
    {
        stopAnimation();
        timers.current.push(setTimeout(splitUp, 1 * STEP_DURATION));
        timers.current.push(setTimeout(meaningOfHex, 2 * STEP_DURATION));
    };

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        clearTimers();
        setStep(parseInt(e.target.value));
    }

    return (
        <div className="pipeline-sim">
            <div className="ps-header">
                <h3 className="ps-title-cycle" style={{ color: '#55FF55' }} >
                    Cycle 2: Decode (D)
                </h3>
                
                <div className='ps-btn-container'>
                    <button className="ps-btn ps-btn--success" onClick={() => playAnimation()}>
                        Play
                    </button>

                    <button className="ps-btn ps-btn--danger" onClick={() => stopAnimation()}>
                        Reset
                    </button>
                </div>
            </div>

            {/* WHO ARE YOU? Explanations */}
            {step == 2 && (
                <div className="ps-explanation-row">
                    <div className="ps-explanation-box" style={{ borderColor: 'var(--ps-red)' }}>
                        <div className="ps-explanation-label" style={{ color: 'var(--ps-red)' }}>
                            48
                        </div>
                        <span className="ps-explanation-text">We are accessing 64 bit operands</span>
                    </div>
                    <div className="ps-explanation-box" style={{ borderColor: 'var(--ps-purple)' }}>
                        <div className="ps-explanation-label" style={{ color: 'var(--ps-purple)' }}>
                            8B
                        </div>
                        <span className="ps-explanation-text">Moving from a 64 bit register or memory to a 64 bit register</span>
                    </div>
                    <div className="ps-explanation-box" style={{ borderColor: 'var(--ps-green)' }}>
                        <div className="ps-explanation-label" style={{ color: 'var(--ps-green)' }}>
                            05
                        </div>
                        <span className="ps-explanation-text">The destination is RAX, find var1 based on how far it is from RIP</span>
                    </div>
                    <div className="ps-explanation-box" style={{ borderColor: 'var(--ps-yellow)' }}>
                        <div className="ps-explanation-label" style={{ color: 'var(--ps-yellow)' }}>
                            7F 00 00 00
                        </div>
                        <span className="ps-explanation-text">It is 127 addresses away from RIP</span>
                    </div>
                </div>
            )}
            

            {/* WHO ARE YOU? CPU*/}
            <div className='ps-cpu-container'>
                <div className='ps-label'>
                    CPU
                </div>

                {/* WHO ARE YOU? Control Unit */}
                <div className='ps-control-unit'>
                    <div className='ps-label'>
                        Control Unit
                    </div>

                    {(step == 0) && (
                        <div className="ps-badge">
                            0x48_8B05_7F00_0000
                        </div>
                    )}

                    {(step == 1 || step == 2) && (
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                            <div className="ps-badge" style={{ color: 'var(--ps-yellow)', borderColor: 'var(--ps-muted)' }}>
                                0x
                            </div>

                            <div className="ps-badge" style={{ color: 'var(--ps-red)', borderColor: 'var(--ps-red)' }}>
                                48
                            </div>

                            <div className="ps-badge" style={{ color: 'var(--ps-purple)', borderColor: 'var(--ps-purple)' }}>
                                8B
                            </div>

                            <div className="ps-badge" style={{ color: 'var(--ps-green)', borderColor: 'var(--ps-green)' }}>
                                05
                            </div>

                            <div className="ps-badge" style={{ color: 'var(--ps-yellow)', borderColor: 'var(--ps-yellow)' }}>
                                7F 00 00 00
                            </div>
                        </div>
                    )}
                    
                </div>

                {/* Register File Row */}
                <div style={{ display: 'flex' }}>
                    
                    {/* WHO ARE YOU? Register File */}
                    <div className='ps-register-file'>
                        <div className='ps-label'>
                            Register File
                        </div>

                        <div className="ps-stat__value ps-stat__value--cyan" style={{ fontSize: '1.3rem', lineHeight: '1.5' }}>
                            RAX: 0x----_----_----_----<br />
                            RBX: 0x----_----_----_----<br />
                            RCX: 0x----_----_----_----<br />
                            RDX: 0x----_----_----_----
                        </div>
                    </div>

                </div>

            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', width: '100%' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--ps-muted)' }}>Progress:</label>
                <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    value={step} 
                    onChange={handleSliderChange}
                    style={{ flex: 1, cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}