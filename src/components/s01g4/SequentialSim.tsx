import React, { useState, useEffect } from 'react';
import { generateSequentialGrid } from './pipelineUtils';
import PipelineGrid from './PipelineGrid';

const MAX_INSTRUCTIONS = 4;
const MAX_CYCLES = MAX_INSTRUCTIONS * 5; // 20

export default function SequentialSim() {
  const [instructionCount, setInstructionCount] = useState<number>(4);
  const [currentCycle, setCurrentCycle] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const totalCycles = instructionCount * 5;

  // Sync instruction count change
  useEffect(() => {
    setCurrentCycle(-1);
    setIsAnimating(false);
  }, [instructionCount]);

  // Handle animation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setInterval(() => {
        setCurrentCycle((prev) => {
          if (prev >= totalCycles - 1) {
            setIsAnimating(false);
            return -1; // reset/stop at end
          }
          return prev + 1;
        });
      }, 800);
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

  // Always generate the grid at MAX size so table dimensions never change.
  // Use the real instruction count for active rows, but pass MAX to the generator.
  const fullRows = generateSequentialGrid(MAX_INSTRUCTIONS, currentCycle);
  const timeCycles = Array.from({ length: MAX_CYCLES }, (_, i) => i);

  // Mark rows beyond the selected count as inactive (faded)
  const rows = fullRows.map((row, idx) => {
    if (idx >= instructionCount) {
      return {
        ...row,
        label: '—',
        cells: row.cells.map((cell) => ({
          ...cell,
          type: 'empty' as const,
          label: '',
          stageName: undefined,
          isHighlighted: false,
          isFaded: false,
        })),
      };
    }
    // For active rows, blank out cells beyond the active totalCycles
    return {
      ...row,
      cells: row.cells.map((cell) => {
        if (cell.cellCycle >= totalCycles) {
          return {
            ...cell,
            type: 'empty' as const,
            label: '',
            stageName: undefined,
            isHighlighted: false,
          };
        }
        return cell;
      }),
    };
  });

  // Utilization calculation
  const activePercent = currentCycle >= 0 && currentCycle < totalCycles ? 20 : 0;

  return (
    <div className="pipeline-sim">
      <div className="ps-header">
        <h3 className="ps-title" style={{ color: 'var(--ps-white)' }} >Sequential Execution (No Pipelining)</h3>
        <div className="ps-controls">
          <button className="ps-btn" onClick={togglePlay}>
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

      <div className="ps-grid-wrapper">
        <PipelineGrid
          timeCycles={timeCycles}
          rows={rows}
          activeCycle={currentCycle}
        />
      </div>

      <div className="ps-slider-bar">
        <span className="ps-slider-label">Instructions</span>
        <input
          type="range"
          min="1"
          max="4"
          step="1"
          value={instructionCount}
          onChange={(e) => setInstructionCount(parseInt(e.target.value))}
          className="ps-slider-input"
        />
        <span className="ps-slider-value">{instructionCount}</span>
      </div>

      <div className="ps-stats">
        <div className="ps-stat">
          <span className="ps-stat__label">Execution Cycle</span>
          <span className="ps-stat__value ps-stat__value--cyan">
            {currentCycle === -1 ? 'IDLE' : `${currentCycle + 1} / ${totalCycles}`}
          </span>
        </div>
        <div className="ps-stat">
          <span className="ps-stat__label">Total Cycles Needed</span>
          <span className="ps-stat__value ps-stat__value--highlight">
            {totalCycles}
          </span>
        </div>
        <div className="ps-stat">
          <span className="ps-stat__label">Hardware Stage Utilization</span>
          <span className="ps-stat__value">
            {activePercent}%
          </span>
        </div>
        <div className="ps-stat" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <span className="ps-badge ps-badge--warning">
            Sequential Bottleneck
          </span>
        </div>
      </div>
    </div>
  );
}

