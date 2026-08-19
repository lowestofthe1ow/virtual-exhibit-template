import React, { useState, useEffect } from 'react';
import type { InstructionRow, CellData } from './pipelineUtils';
import PipelineGrid from './PipelineGrid';

export default function HazardLoadUseSim() {
  const [currentCycle, setCurrentCycle] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const totalCycles = 8; 

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setInterval(() => {
        setCurrentCycle((prev) => {
          if (prev >= totalCycles - 1) {
            setIsAnimating(false);
            return prev;
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

    // Row 0: MOV AX, [ALPHA]
    const r0Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 0 && c < 5) {
        const stages = ['F', 'D', 'E', 'M', 'WB'] as const;
        r0Cells.push({ 
          type: 'stage', 
          label: stages[c], 
          stageName: stages[c], 
          cellCycle: c, 
          isHighlighted: cycle === c && cycle !== totalCycles - 1 
        });
      } else {
        r0Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'MOV AX, [ALPHA]', cells: r0Cells });

    // Row 1: ADD BX, AX (Stall)
    const r1Cells: CellData[] = [];
    for (let c = 0; c < totalCycles; c++) {
      if (c >= 1 && c < 7) {
        let stageLabel = '';
        let stageType = '';
        if (c === 1) { stageLabel = 'F'; stageType = 'F'; }
        else if (c === 2) { stageLabel = 'D'; stageType = 'D'; }
        else if (c === 3) { stageLabel = 'stall'; stageType = 'stall'; }
        else if (c === 4) { stageLabel = 'E'; stageType = 'E'; }
        else if (c === 5) { stageLabel = 'M'; stageType = 'M'; }
        else if (c === 6) { stageLabel = 'WB'; stageType = 'WB'; }
        
        r1Cells.push({ 
          type: 'stage', 
          label: stageLabel, 
          stageName: stageType as any, 
          cellCycle: c, 
          isHighlighted: cycle === c && cycle !== totalCycles - 1 
        });
      } else {
        r1Cells.push({ type: 'empty', label: '', cellCycle: c });
      }
    }
    rows.push({ label: 'ADD BX, AX', cells: r1Cells });

    return rows;
  };

  const timeCycles = Array.from({ length: totalCycles }, (_, i) => i);
  const rows = generateGridData(currentCycle);

  const showOverlay = currentCycle === 4;

  const renderSVGOverlay = () => {
    if (!showOverlay) return null;
    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        <defs>
          <marker id="load-arrowhead" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto-start-reverse">
            <path d="M0,1 L10,5 L0,9 Z" fill="#55FFFF" />
          </marker>
        </defs>
        <path d="M 360,60 L 390,95" fill="none" stroke="#55FFFF" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#load-arrowhead)" style={{ animation: 'ps-dashDraw 1.2s linear infinite' }} />
      </svg>
    );
  };

  // Dynamic Description
  let explanation = 'Press Play to trace the Load-Use Hazard.';
  if (currentCycle >= 0 && currentCycle <= 2) {
    explanation = 'MOV fetches data from memory. ADD is fetched and begins decoding.';
  } else if (currentCycle === 3) {
    explanation = 'Cycle 4 (t3): The pipeline stalls! ADD cannot proceed because the data from memory is not yet available.';
  } else if (currentCycle === 4) {
    explanation = 'Cycle 5 (t4): Data is now available in the Memory stage and is forwarded directly to the Execute stage.';
  } else if (currentCycle >= 5) {
    explanation = 'The ADD instruction completes execution with the forwarded data.';
  }

  return (
    <div className="pipeline-sim">
      <div className="ps-header">
        <h3 className="ps-title" style={{ color: 'var(--ps-white)' }} >Load-Use Hazard (Mandatory Stall)</h3>
        <div className="ps-controls">
          <button className="ps-btn ps-btn--danger" onClick={togglePlay}>{isAnimating ? '⏸ Pause' : '▶ Play'}</button>
          <button className="ps-btn" onClick={handleStepPrev} disabled={currentCycle <= -1}>◀ Step Back</button>
          <button className="ps-btn" onClick={handleStepNext} disabled={currentCycle >= totalCycles - 1}>Step Forward ▶</button>
          <button className="ps-btn ps-btn--danger" onClick={handleReset}>↺ Reset</button>
        </div>
      </div>
      <div className="ps-grid-wrapper" style={{ position: 'relative' }}>
        <PipelineGrid timeCycles={timeCycles} rows={rows} activeCycle={currentCycle} overlays={renderSVGOverlay()} />
        
        {currentCycle === 3 && (
          <div className="ps-annotation" style={{ top: '90px', left: '260px', border: '1px solid var(--ps-red)', background: '#03071E', color: '#FF5555', boxShadow: '0 0 10px rgba(255, 85, 85, 0.4)', zIndex: 20 }}>
            Forced to Stall!
          </div>
        )}
        {currentCycle === 4 && (
          <div className="ps-annotation" style={{ top: '110px', left: '320px', border: '1px solid var(--ps-cyan)', background: '#03071E', color: '#55FFFF', boxShadow: '0 0 10px rgba(85, 255, 255, 0.4)', zIndex: 20 }}>
            Memory Data Forwarded!
          </div>
        )}
      </div>
      
      <p style={{ fontSize: '0.85rem', color: '#CCCCCC', marginTop: '1rem', minHeight: '2.5rem' }}>
        <strong>Description:</strong> {explanation}
      </p>

      <div className="ps-stats">
        <div className="ps-stat">
          <span className="ps-stat__label">Stall Penalty</span>
          <span className="ps-stat__value ps-stat__value--warning">1 Cycle Wasted</span>
        </div>
      </div>
    </div>
  );
}