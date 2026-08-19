import React, { useState, useEffect } from 'react';
import type { InstructionRow, CellData } from './pipelineUtils';
import PipelineGrid from './PipelineGrid';

export default function HazardNoForwardingSim() {
  const [currentCycle, setCurrentCycle] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const totalCycles = 10; // Increased to 10 cycles to fit the cascading stall

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

    // Row 2: ADD AX, BX (Stalls in Decode waiting for both MOVs to WB)
    const r2Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 2 && c < 9) {
        let stageLabel = '';
        let stageType = '';
        if (c === 2) { stageLabel = 'F'; stageType = 'F'; }
        else if (c === 3) { stageLabel = 'D'; stageType = 'D'; }
        else if (c === 4 || c === 5) { stageLabel = 'stall'; stageType = 'stall'; }
        else if (c === 6) { stageLabel = 'E'; stageType = 'E'; }
        else if (c === 7) { stageLabel = 'M'; stageType = 'M'; }
        else if (c === 8) { stageLabel = 'WB'; stageType = 'WB'; }
        
        r2Cells.push({ type: 'stage', label: stageLabel, stageName: stageType as any, cellCycle: c, isHighlighted: cycle === c && cycle !== totalCycles - 1 });
      } else {
        r2Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'ADD AX, BX', cells: r2Cells });

    // Row 3: SUB CX, 5 (Cascading traffic jam stall!)
    const r3Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 3 && c < 10) {
        let stageLabel = '';
        let stageType = '';
        if (c === 3) { stageLabel = 'F'; stageType = 'F'; }
        else if (c === 4 || c === 5) { stageLabel = 'stall'; stageType = 'stall'; } // Stuck because ADD is blocking D!
        else if (c === 6) { stageLabel = 'D'; stageType = 'D'; }
        else if (c === 7) { stageLabel = 'E'; stageType = 'E'; }
        else if (c === 8) { stageLabel = 'M'; stageType = 'M'; }
        else if (c === 9) { stageLabel = 'WB'; stageType = 'WB'; }
        
        r3Cells.push({ type: 'stage', label: stageLabel, stageName: stageType as any, cellCycle: c, isHighlighted: cycle === c && cycle !== totalCycles - 1 });
      } else {
        r3Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'SUB CX, 5', cells: r3Cells });

    return rows;
  };

  const timeCycles = Array.from({ length: totalCycles }, (_, i) => i);
  const rows = generateGridData(currentCycle);

  // Dynamic description generation
  let explanation = 'Press Play or Step Forward to trace the data hazard scenario without forwarding.';
  if (currentCycle === 0) {
    explanation = 'Cycle 1 (t0): MOV AX, 10 is fetched (F stage).';
  } else if (currentCycle === 1) {
    explanation = 'Cycle 2 (t1): MOV BX, 20 is fetched. The first MOV moves to Decode.';
  } else if (currentCycle === 2) {
    explanation = 'Cycle 3 (t2): ADD AX, BX is fetched. It will eventually need the values of AX and BX.';
  } else if (currentCycle === 3) {
    explanation = 'Cycle 4 (t3): ADD enters Decode but realizes AX and BX have not been written to the registers yet!';
  } else if (currentCycle === 4) {
    explanation = 'Cycle 5 (t4): STALL! ADD is stuck waiting. SUB CX, 5 is fetched but blocked from moving forward, creating a jam.';
  } else if (currentCycle === 5) {
    explanation = 'Cycle 6 (t5): STALL! The pipeline remains jammed as both MOV instructions finally complete their Write-Back (WB) stages.';
  } else if (currentCycle === 6) {
    explanation = 'Cycle 7 (t6): Registers are finally updated! ADD grabs the data and proceeds to Execute. The traffic jam clears.';
  } else if (currentCycle >= 7) {
    explanation = `Cycle ${currentCycle + 1} (t${currentCycle}): The remaining instructions complete their pipeline stages normally.`;
  }

  return (
    <div className="pipeline-sim">
      <div className="ps-header">
        <h3 className="ps-title" style={{ color: 'var(--ps-white)' }} >No Forwarding (Stall until Write-Back)</h3>
        <div className="ps-controls">
          <button className="ps-btn ps-btn--danger" onClick={togglePlay}>{isAnimating ? '⏸ Pause' : '▶ Play'}</button>
          <button className="ps-btn" onClick={handleStepPrev} disabled={currentCycle <= -1}>◀ Step Back</button>
          <button className="ps-btn" onClick={handleStepNext} disabled={currentCycle >= totalCycles - 1}>Step Forward ▶</button>
          <button className="ps-btn ps-btn--danger" onClick={handleReset}>↺ Reset</button>
        </div>
      </div>
      
      <div className="ps-grid-wrapper" style={{ position: 'relative' }}>
        <PipelineGrid timeCycles={timeCycles} rows={rows} activeCycle={currentCycle} />
      </div>

      <p style={{ fontSize: '0.85rem', color: '#CCCCCC', marginTop: '1rem', minHeight: '2.5rem' }}>
        <strong>Description:</strong> {explanation}
      </p>

      <div className="ps-stats">
        <div className="ps-stat">
          <span className="ps-stat__label">Stall Penalty</span>
          <span className="ps-stat__value ps-stat__value--danger">Pipeline Jammed!</span>
        </div>
      </div>
    </div>
  );
}