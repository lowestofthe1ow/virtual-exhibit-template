import React, { useState, useEffect } from 'react';
import type { InstructionRow, CellData } from './pipelineUtils';
import PipelineGrid from './PipelineGrid';

export default function HazardForwardingSim() {
  const [currentCycle, setCurrentCycle] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const totalCycles = 8; // 8 cycles to finish all 4 instructions with ZERO stalls

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setInterval(() => {
        setCurrentCycle((prev) => {
          if (prev >= totalCycles - 1) {
            setIsAnimating(false);
            return prev; // Freezes at the end
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
      if (currentCycle === -1) setCurrentCycle(0);
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

  const generateGridData = (cycle: number): InstructionRow[] => {
    const rows: InstructionRow[] = [];

    // Row 0: MOV AX, 10
    const r0Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 0 && c < 5) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        r0Cells.push({ type: 'stage', label: stages[c], stageName: stages[c], cellCycle: c, isHighlighted: cycle === c && cycle !== totalCycles - 1 });
      } else {
        r0Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'MOV AX, 10', cells: r0Cells });

    // Row 1: MOV BX, 20
    const r1Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 1 && c < 6) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        r1Cells.push({ type: 'stage', label: stages[c - 1], stageName: stages[c - 1], cellCycle: c, isHighlighted: cycle === c && cycle !== totalCycles - 1 });
      } else {
        r1Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'MOV BX, 20', cells: r1Cells });

    // Row 2: ADD AX, BX (Data forwarded directly to Execute, NO stalls!)
    const r2Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 2 && c < 7) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        r2Cells.push({ type: 'stage', label: stages[c - 2], stageName: stages[c - 2], cellCycle: c, isHighlighted: cycle === c && cycle !== totalCycles - 1 });
      } else {
        r2Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'ADD AX, BX', cells: r2Cells });

    // Row 3: SUB CX, 5 (Flows perfectly, no cascading jam!)
    const r3Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 3 && c < 8) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        r3Cells.push({ type: 'stage', label: stages[c - 3], stageName: stages[c - 3], cellCycle: c, isHighlighted: cycle === c && cycle !== totalCycles - 1 });
      } else {
        r3Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'SUB CX, 5', cells: r3Cells });

    return rows;
  };

  const timeCycles = Array.from({ length: totalCycles }, (_, i) => i);
  const rows = generateGridData(currentCycle);

  // Show overlay arrows ONLY at t4
  const showOverlay = currentCycle === 4;

  const renderSVGOverlay = () => {
    if (!showOverlay) return null;

    return (
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
      >
        <defs>
          <marker id="fwd-arrowhead" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto-start-reverse">
            <path d="M0,1 L10,5 L0,9 Z" fill="#55FFFF" />
          </marker>
        </defs>
        <path d="M 345,80 L 375,140" fill="none" stroke="#55FFFF" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#fwd-arrowhead)" style={{ animation: 'ps-dashDraw 1.2s linear infinite', opacity: 0.7 }} />
        <path d="M 345,130 L 371.5,143" fill="none" stroke="#55FFFF" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#fwd-arrowhead)" style={{ animation: 'ps-dashDraw 1.2s linear infinite' }} />
      </svg>
    );
  };

  // Dynamic description logic
  let explanation = 'Press Play to trace the pipeline with Forwarding enabled.';
  if (currentCycle >= 0 && currentCycle <= 3) {
    explanation = 'Instructions are flowing through the pipeline stages normally.';
  } else if (currentCycle === 4) {
    explanation = 'Cycle 5 (t4): Forwarding unit detects a dependency. Data is routed directly to the ALU, skipping the stall!';
  } else if (currentCycle >= 5) {
    explanation = 'The ADD instruction completes its execution successfully, and the pipeline continues without any bubbles.';
  }

  return (
    <div className="pipeline-sim">
      <div className="ps-header">
        <h3 className="ps-title" style={{ color: 'var(--ps-white)' }} >With Forwarding (Internal Data Routing)</h3>
        <div className="ps-controls">
          <button className="ps-btn ps-btn--danger" onClick={togglePlay}>{isAnimating ? '⏸ Pause' : '▶ Play'}</button>
          <button className="ps-btn" onClick={handleStepPrev} disabled={currentCycle <= -1}>◀ Step Back</button>
          <button className="ps-btn" onClick={handleStepNext} disabled={currentCycle >= totalCycles - 1}>Step Forward ▶</button>
          <button className="ps-btn ps-btn--danger" onClick={handleReset}>↺ Reset</button>
        </div>
      </div>
      <div className="ps-grid-wrapper" style={{ position: 'relative' }}>
        <PipelineGrid timeCycles={timeCycles} rows={rows} activeCycle={currentCycle} overlays={renderSVGOverlay()} />
        {currentCycle === 4 && (
          <div className="ps-annotation" style={{ top: '165px', left: '345px', border: '1px solid var(--ps-cyan)', background: '#03071E', color: '#55FFFF', boxShadow: '0 0 10px rgba(85, 255, 255, 0.4)', zIndex: 20 }}>
            AX & BX Forwarded!
          </div>
        )}
      </div>
      <p style={{ fontSize: '0.85rem', color: '#CCCCCC', marginTop: '1rem', minHeight: '2.5rem' }}>
        <strong>Description:</strong> {explanation}
      </p>
      <div className="ps-stats">
        <div className="ps-stat">
          <span className="ps-stat__label">Stall Penalty</span>
          <span className="ps-stat__value ps-stat__value--cyan">0 Cycles Wasted</span>
        </div>
      </div>
    </div>
  );
}