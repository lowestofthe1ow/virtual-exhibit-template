import React, { useState, useEffect } from 'react';
import type { InstructionRow, CellData } from './pipelineUtils';
import PipelineGrid from './PipelineGrid';

export default function HazardFlushSim() {
  const [currentCycle, setCurrentCycle] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const totalCycles = 8; 

// Handle animation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setInterval(() => {
        setCurrentCycle((prev) => {
          if (prev >= totalCycles - 1) {
            setIsAnimating(false);
            return prev; // <-- CHANGED: This tells it to stay on the final cycle instead of resetting to -1
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isAnimating, totalCycles]);

  const togglePlay = () => {
    if (currentCycle >= totalCycles - 1) {
      setCurrentCycle(0);
      setIsAnimating(true);
    } else {
      if (currentCycle === -1) {
        setCurrentCycle(0);
      }
      setIsAnimating(!isAnimating);
    }
  };

  const handleReset = () => {
    setCurrentCycle(-1);
    setIsAnimating(false);
  };

  const handleStepPrev = () => {
    setIsAnimating(false);
    setCurrentCycle((prev) => (prev > -1 ? prev - 1 : -1));
  };

  const handleStepNext = () => {
    setIsAnimating(false);
    setCurrentCycle((prev) => (prev < totalCycles - 1 ? prev + 1 : prev));
  };

  // Generate grid data: Branch resolves in Execute (E) stage at t2.
  const generateFlushGridData = (cycle: number): InstructionRow[] => {
    const rows: InstructionRow[] = [];

    // Row 0: Branch Instruction
    const r0Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 0 && c < 5) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        r0Cells.push({
          type: 'stage',
          label: stages[c],
          stageName: stages[c],
          cellCycle: c,
          isHighlighted: cycle === c,
        });
      } else {
        r0Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'JCXZ L1', cells: r0Cells });

    // Row 1: Wrong Path 1 (Speculatively fetched, flushed at t3)
    const r1Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 1 && c < 6) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        const isFlushed = cycle >= 3 && c >= 3;
        r1Cells.push({
          type: 'stage',
          label: isFlushed ? 'nop' : stages[c - 1],
          stageName: isFlushed ? undefined : stages[c - 1],
          cellCycle: c,
          isFaded: isFlushed || cycle === 2,
          isFlushing: cycle === 3 && c >= 3,
          isHighlighted: cycle === c && !isFlushed,
        });
      } else {
        r1Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'INC AX', cells: r1Cells });

    // Row 2: Wrong Path 2 (Speculatively fetched, flushed at t3)
    const r2Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 2 && c < 7) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        const isFlushed = cycle >= 3 && c >= 3;
        r2Cells.push({
          type: 'stage',
          label: isFlushed ? 'nop' : stages[c - 2],
          stageName: isFlushed ? undefined : stages[c - 2],
          cellCycle: c,
          isFaded: isFlushed || cycle === 2,
          isFlushing: cycle === 3 && c >= 3,
          isHighlighted: cycle === c && !isFlushed,
        });
      } else {
        r2Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'DEC BX', cells: r2Cells });

    // Row 3: Correct Path (Starts at t3 after flush)
    const r3Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (cycle >= 3 && c >= 3 && c < 8) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        r3Cells.push({
          type: 'stage',
          label: stages[c - 3],
          stageName: stages[c - 3],
          cellCycle: c,
          isHighlighted: cycle === c,
        });
      } else {
        r3Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'L1: MOV CX, 5', cells: r3Cells });

    return rows;
  }

  const timeCycles = Array.from({ length: totalCycles }, (_, i) => i);
  const rows = generateFlushGridData(currentCycle);

  let explanation = 'Press Play or Step Forward to trace the branch hazard scenario.';
  if (currentCycle === 0) {
    explanation = 'Cycle 1 (t0): JCXZ L1 is fetched (F stage). The CPU does not know if CX is 0 yet.';
  } else if (currentCycle === 1) {
    explanation = 'Cycle 2 (t1): JCXZ is decoded. Hardware speculatively fetches INC AX, assuming no jump.';
  } else if (currentCycle === 2) {
    explanation = 'Cycle 3 (t2): JCXZ executes! The ALU checks the Zero Flag (ZF). It is 1! The jump must happen, misprediction detected!';
  } else if (currentCycle === 3) {
    explanation = 'Cycle 4 (t3): Flush! INC AX and DEC BX are converted to NOPs. The correct instruction (L1: MOV CX, 5) is fetched.';
  } else if (currentCycle >= 4) {
    explanation = `Cycle ${currentCycle + 1} (t${currentCycle}): The correct instruction path proceeds down the pipeline.`;
  }

  const showOverlay = currentCycle === 2 || currentCycle === 3;

  const renderSVGOverlay = () => {
    if (!showOverlay) return null;

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <defs>
          <marker
            id="flush-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="5"
            orient="auto-start-reverse"
          >
            <path d="M0,1 L10,5 L0,9 Z" className="ps-flush-arrowhead" />
          </marker>
        </defs>
        <path
          d="M 280,70 L 320,190"
          fill="none"
          stroke="#FF5555"
          strokeWidth="2"
          strokeDasharray="5,3"
          markerEnd="url(#flush-arrowhead)"
          className="ps-flush-arrow"
          style={{ animation: 'ps-dashDraw 1.2s linear infinite' }}
        />
      </svg>
    );
  };

  return (
    <div className="pipeline-sim">
      <div className="ps-header">
        <h3 className="ps-title" style={{ color: 'var(--ps-white)' }} >Branch Misprediction</h3>
        <div className="ps-controls">
          <button className="ps-btn ps-btn--danger" onClick={togglePlay}>
            {isAnimating ? '⏸ Pause' : '▶ Play'}
          </button>
          <button className="ps-btn" onClick={handleStepPrev} disabled={currentCycle <= -1}>
            ◀ Step Back
          </button>
          <button className="ps-btn" onClick={handleStepNext} disabled={currentCycle >= totalCycles - 1}>
            Step Forward ▶
          </button>
          <button className="ps-btn ps-btn--danger" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="ps-steps">
        <div className={`ps-step-dot ${currentCycle >= 0 ? 'ps-step-dot--done' : ''}`} />
        <div className={`ps-step-dot ${currentCycle >= 2 ? 'ps-step-dot--active' : ''}`} />
        <div className={`ps-step-dot ${currentCycle >= 3 ? 'ps-step-dot--done' : ''}`} />
        <span className="ps-step-label">
          {currentCycle === 2 ? '🚨 ALU DETECTS ZF==1' : currentCycle === 3 ? '🌊 FLUSH ACTIVE' : 'MONITORING'}
        </span>
      </div>

      <div className="ps-grid-wrapper" style={{ position: 'relative' }}>
        <PipelineGrid
          timeCycles={timeCycles}
          rows={rows}
          activeCycle={currentCycle}
          overlays={renderSVGOverlay()}
        />

        {currentCycle === 2 && (
          <div
            className="ps-annotation"
            style={{
              top: '80px',
              left: '200px',
              border: '1px solid var(--ps-red)',
              background: '#03071E',
              color: '#FF5555',
              boxShadow: '0 0 10px rgba(255, 85, 85, 0.4)',
            }}
          >
            Zero Flag Checked!
          </div>
        )}

        {currentCycle === 3 && (
          <div
            className="ps-annotation"
            style={{
              top: '120px',
              left: '140px',
              border: '1px solid var(--ps-cyan)',
              background: '#03071E',
              color: '#55FFFF',
              boxShadow: '0 0 10px rgba(85, 255, 255, 0.4)',
            }}
          >
            Wrong instructions NOP'd!
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.85rem', color: '#CCCCCC', marginTop: '1rem', minHeight: '2.5rem' }}>
        <strong>Description:</strong> {explanation}
      </p>

      <div className="ps-stats">
        <div className="ps-stat">
          <span className="ps-stat__label">Scenario Status</span>
          <span className="ps-stat__value ps-stat__value--cyan">
            {currentCycle === -1 ? 'INITIAL' : currentCycle >= 3 ? 'FLUSH COMPLETED' : 'SPECULATIVE FETCH'}
          </span>
        </div>
        <div className="ps-stat">
          <span className="ps-stat__label">Flush Penalty</span>
          <span className="ps-stat__value ps-stat__value--danger">
            {currentCycle >= 3 ? '2 Cycles Wasted' : 'Checking...'}
          </span>
        </div>
        <div className="ps-stat" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <span className={`ps-badge ${currentCycle >= 2 && currentCycle <= 3 ? 'ps-badge--warning' : ''}`}>
            {currentCycle === 2 ? '⚠️ E-Stage Detects Jump' : 'Branch Hazard Demo'}
          </span>
        </div>
      </div>
    </div>
  );
}