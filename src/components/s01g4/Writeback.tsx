import React, { useState, useRef, useEffect } from 'react';

export default function Writeback() {
    const [step, setStep] = useState(0);
    const timers = useRef<NodeJS.Timeout[]>([]);

    function clearTimers() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    }

    useEffect(() => {
        return clearTimers;
    }, []);

    function var1InReg()
    {
        setStep(3);
    };

    function showLine()
    {
        setStep(2);
    };

    function highlightValue()
    {
        setStep(1);
    }

    function stopAnimation()
    {
        clearTimers();
        setStep(0);
    };

    const STEP_DURATION = 1250; // milliseconds per step

    function playAnimation()
    {
        stopAnimation();
        timers.current.push(setTimeout(highlightValue, 1 * STEP_DURATION));
        timers.current.push(setTimeout(showLine, 2 * STEP_DURATION));
        timers.current.push(setTimeout(var1InReg, 3 * STEP_DURATION));
    };

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        clearTimers();
        setStep(parseInt(e.target.value));
    }

    return (
        <div className="pipeline-sim">
            <div className="ps-header">
                <h3 className='ps-title-cycle' style={{ color: 'var(--ps-purple)' }} >
                    Cycle 5: Writeback (WB)
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

                    <div className="ps-badge">
                        0x48_8B05_7F00_0000
                    </div>
                </div>

                {/* Register File Row */}
                <div style={{ display: 'flex' }}>
                    
                    {/* WHO ARE YOU? Register File */}
                    <div className='ps-register-file'>
                        <div className='ps-label'>
                            Register File
                        </div>

                        {(step != 3) && (
                            <div className="ps-stat__value ps-stat__value--cyan" style={{ fontSize: '1.3rem', lineHeight: '1.5' }}>
                                RAX: 0x----_----_----_----<br />
                                RBX: 0x----_----_----_----<br />
                                RCX: 0x----_----_----_----<br />
                                RDX: 0x----_----_----_----
                            </div>
                        )}

                        {step == 3 && (
                            <div className="ps-stat__value ps-stat__value--cyan" style={{ fontSize: '1.3rem', lineHeight: '1.5' }}>
                                RAX: <span style={{ color: 'var(--ps-green)' }}> 0x0000_0000_0000_0004</span><br />
                                RBX: 0x----_----_----_----<br />
                                RCX: 0x----_----_----_----<br />
                                RDX: 0x----_----_----_----
                            </div>
                        )}
                    </div>

                    {/* WHO ARE YOU??? Path Animation */}
                    <div className='ps-path'>
                        {step == 2 && (
                            <svg className='ps-svg'>
                                <line className="ps-exec-line" x1="0" y1="10" x2="100%" y2="10" />

                                <svg x="0" y="10" style={{ overflow: 'visible' }}>
                                    <polygon className="ps-exec-arrow" points="10,-5 0,0 10,5" />
                                </svg>
                            </svg>
                        )}
                    </div>

                    {/* WHO ARE YOU? Value From Memory */}
                    <div style={{ width: '220px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div className='ps-label' style={{ color: 'var(--ps-green)' }}>
                            Value from Memory
                        </div>

                        {(step == 1 || step == 2) && (
                            <div className="ps-badge">
                                0x0000_0000_0000_0004
                            </div>
                        )}
                    </div>

                </div>

            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', width: '100%' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--ps-muted)' }}>Progress:</label>
                <input 
                    type="range" 
                    min="0" 
                    max="3" 
                    value={step} 
                    onChange={handleSliderChange}
                    style={{ flex: 1, cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}