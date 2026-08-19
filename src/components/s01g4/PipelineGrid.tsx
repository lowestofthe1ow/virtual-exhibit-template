import React from 'react';
import type { InstructionRow, CellData } from './pipelineUtils';

interface PipelineGridProps {
  timeCycles: number[];
  rows: InstructionRow[];
  activeCycle?: number;
  overlays?: React.ReactNode;
}

export default function PipelineGrid({
  timeCycles,
  rows,
  activeCycle,
  overlays,
}: PipelineGridProps) {
  return (
    <div className="ps-grid-scroll">
      <div style={{ position: 'relative', width: 'max-content' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '6px' }}>
          <thead>
            <tr>
              {/* Empty corner cell for instruction labels column */}
              <th style={{ minWidth: '80px' }}></th>
              {timeCycles.map((c) => (
                <th key={c}>
                  <div
                    className={`ps-time-pill ${
                      activeCycle === c ? 'ps-time-pill--active' : ''
                    }`}
                  >
                    t{c}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <div className="ps-instr-label">{row.label}</div>
                </td>
                {row.cells.map((cell, cellIndex) => {
                  const isStage = cell.type === 'stage';
                  const isStall = cell.type === 'stall';
                  const isHighlighted = cell.isHighlighted;
                  const isFaded = cell.isFaded;
                  const isFlushing = cell.isFlushing;

                  let cellClass = 'ps-cell ps-cell--empty';
                  if (isStage && cell.stageName) {
                    cellClass = `ps-cell ps-cell--${cell.stageName}`;
                  } else if (isStall) {
                    cellClass = 'ps-cell ps-cell--stall';
                  }

                  if (isHighlighted) cellClass += ' ps-cell--highlighted';
                  if (isFaded) cellClass += ' ps-cell--faded';
                  if (isFlushing) cellClass += ' ps-cell--flushing';

                  // We add data attributes to help with SVG positioning if needed
                  return (
                    <td
                      key={cellIndex}
                      data-row={rowIndex}
                      data-cycle={cell.cellCycle}
                      style={{ padding: 0 }}
                    >
                      <div className={cellClass}>
                        {cell.label}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {overlays}
      </div>
    </div>
  );
}
