import React, { useState, useRef, useEffect } from 'react';

export default function Memory() {
    const [step, setStep] = useState(0);
    const timers = useRef<NodeJS.Timeout[]>([]);

    function clearTimers() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    }

    useEffect(() => {
        return clearTimers;
    }, []);

    function var1InCPU()
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
        timers.current.push(setTimeout(var1InCPU, 3 * STEP_DURATION));
    };

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        clearTimers();
        setStep(parseInt(e.target.value));
    }

    return (
        <div className="pipeline-sim">
            <div className="ps-header">
                <h3 className="ps-title-cycle" style={{ color: 'var(--ps-yellow)' }} >
                    Cycle 4: Memory (M)
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

            <div className='ps-main-container'>
                
                {/* WHO ARE YOU??? CPU Rectangle */}
                <div className='ps-box ps-cpu'>
                    <div className='ps-label'>
                        CPU
                    </div>

                    <div className='ps-row'>

                        {step == 3 && (
                          <span style={{ color: 'var(--ps-green)' }} >
                            0x0000_0000_0000_0004
                          </span>
                        )}

                    </div>
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

                {/* WHO ARE YOU??? Memory Rectangle */}
                <div className='ps-box ps-mem'>
                    <div className='ps-label'>
                        Memory
                    </div>

                    {/* WHO ARE YOU? Top Row */}
                    <div className='ps-row'>
                        <span>
                          instruction
                        </span>
                        
                        <span>
                            0x48_8B05_7F00_0000
                        </span>
                    </div>

                    {/* WHO ARE YOU? Bottom Row */}
                    <div className='ps-row'>
                        <span>
                          var1
                        </span>

                        {(step == 1 || step == 2) && (
                            <span style={{ color: 'var(--ps-green)' }} >
                                0x0000_0000_0000_0004
                            </span>
                        )}

                        {(step == 0 || step == 3) && (
                            <span>
                                0x0000_0000_0000_0004
                            </span>
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