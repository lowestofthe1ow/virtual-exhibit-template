export const STAGES = ['F', 'D', 'E', 'M', 'WB'] as const;

export type StageName = typeof STAGES[number];

export interface CellData {
  type: 'stage' | 'stall' | 'empty';
  label: string;
  stageName?: StageName;
  cellCycle: number;
  isFaded?: boolean;
  isFlushing?: boolean;
  isHighlighted?: boolean;
}

export interface InstructionRow {
  label: string;
  cells: CellData[];
}

export function generateSequentialGrid(count: number, currentCycle: number): InstructionRow[] {
  const rows: InstructionRow[] = [];
  const totalCycles = count * 5;

  for (let i = 0; i < count; i++) {
    const cells: CellData[] = [];
    const startCycle = i * 5;

    for (let c = 0; c < totalCycles; c++) {
      if (c >= startCycle && c < startCycle + 5) {
        const stageIndex = c - startCycle;
        const stageName = STAGES[stageIndex];
        cells.push({
          type: 'stage',
          label: stageName,
          stageName,
          cellCycle: c,
          isHighlighted: c === currentCycle,
        });
      } else {
        cells.push({
          type: 'empty',
          label: '',
          cellCycle: c,
        });
      }
    }

    rows.push({
      label: `Instruction ${i + 1}`,
      cells,
    });
  }

  return rows;
}

export function generatePipelinedGrid(count: number, currentCycle: number): InstructionRow[] {
  const rows: InstructionRow[] = [];
  const totalCycles = 4 + count;

  for (let i = 0; i < count; i++) {
    const cells: CellData[] = [];
    const startCycle = i;

    for (let c = 0; c < totalCycles; c++) {
      if (c >= startCycle && c < startCycle + 5) {
        const stageIndex = c - startCycle;
        const stageName = STAGES[stageIndex];
        cells.push({
          type: 'stage',
          label: stageName,
          stageName,
          cellCycle: c,
          isHighlighted: c === currentCycle,
        });
      } else {
        cells.push({
          type: 'empty',
          label: '',
          cellCycle: c,
        });
      }
    }

    rows.push({
      label: `Instruction ${i + 1}`,
      cells,
    });
  }

  return rows;
}
