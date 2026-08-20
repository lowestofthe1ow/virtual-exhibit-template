import { useReducer } from 'react';

import { CELL_TYPE } from './lib/CellTypes.js';
import { GENERATIONS } from './lib/Generations.js';
import { computeHeatmap } from './lib/Propagation.js';

import FloorplanEditor from './FloorplanEditor/index.jsx';

// ---------------------------------------------------------------------------
// Grid config
// ---------------------------------------------------------------------------

const GRID_WIDTH  = 40;
const GRID_HEIGHT = 30;
const CELL_SIZE   = 16;// 640 — max desktop constraint

// ---------------------------------------------------------------------------
// Preset floor plan
// Gives new users something interesting to look at immediately.
// ---------------------------------------------------------------------------

function createPresetGrid(gridWidth, gridHeight) {
    const grid = new Uint8Array(gridWidth * gridHeight);

    const set = (x, y, type) => {
        if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight)
            grid[y * gridWidth + x] = type;
    };
    const hLine = (y, x1, x2, type) => { for (let x = x1; x <= x2; x++) set(x, y, type); };
    const vLine = (x, y1, y2, type) => { for (let y = y1; y <= y2; y++) set(x, y, type); };

    hLine(0,              0, gridWidth - 1,  CELL_TYPE.CONCRETE);
    hLine(gridHeight - 1, 0, gridWidth - 1,  CELL_TYPE.CONCRETE);
    vLine(0,              0, gridHeight - 1, CELL_TYPE.CONCRETE);
    vLine(gridWidth - 1,  0, gridHeight - 1, CELL_TYPE.CONCRETE);

    hLine(14, 1, 4,   CELL_TYPE.CONCRETE);
    hLine(14, 7, 11,  CELL_TYPE.CONCRETE);
    hLine(14, 12, 17, CELL_TYPE.DRYWALL);

    hLine(14, 20, 31, CELL_TYPE.DRYWALL);

    hLine(14, 34, gridWidth - 2, CELL_TYPE.DRYWALL);

    vLine(11, 1, 13, CELL_TYPE.CONCRETE);

    vLine(3, 3, 10, CELL_TYPE.METAL);
    vLine(5, 3, 10, CELL_TYPE.METAL);
    vLine(7, 3, 10, CELL_TYPE.METAL);
    vLine(9, 3, 10, CELL_TYPE.METAL);

    vLine(25, 1, 13, CELL_TYPE.DRYWALL);

    set(25, 5, 0);
    set(25, 6, 0);

    hLine(7, 15, 21, CELL_TYPE.METAL);
    hLine(8, 15, 21, CELL_TYPE.METAL);

    hLine(6, 26, gridWidth - 2, CELL_TYPE.DRYWALL);

    set(30, 6, 0);
    set(31, 6, 0);

    set(36, 2, CELL_TYPE.METAL);
    set(37, 2, CELL_TYPE.METAL);
    set(37, 3, CELL_TYPE.METAL);

    vLine(18, 15, gridHeight - 2, CELL_TYPE.DRYWALL);

    set(18, 19, 0);
    set(18, 20, 0);

    hLine(26, 2, 8, CELL_TYPE.METAL);
    vLine(2, 21, 25, CELL_TYPE.METAL);

    set(6,  17, CELL_TYPE.METAL);
    set(12, 17, CELL_TYPE.METAL);
    set(12, 22, CELL_TYPE.METAL);

    hLine(17, 21, 24, CELL_TYPE.METAL);
    hLine(17, 29, 34, CELL_TYPE.METAL);

    hLine(21, 26, gridWidth - 2, CELL_TYPE.CONCRETE);
    vLine(26, 21, gridHeight - 2, CELL_TYPE.CONCRETE);

    set(26, 24, 0);
    set(26, 25, 0);

    hLine(24, 30, 34, CELL_TYPE.METAL);
    hLine(25, 30, 34, CELL_TYPE.METAL);
    hLine(26, 30, 34, CELL_TYPE.METAL);

    return grid;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function recompute(grid, gridWidth, gridHeight, router, activeGeneration) {
    return computeHeatmap(grid, gridWidth, gridHeight, router, GENERATIONS[activeGeneration]);
}

function createInitialState() {
    const gridWidth        = GRID_WIDTH;
    const gridHeight       = GRID_HEIGHT;
    const grid              = createPresetGrid(gridWidth, gridHeight);
    const router            = { x: 10, y: 7 };
    const activeGeneration  = 0;

    return {
        gridWidth,
        gridHeight,
        grid,
        router,
        activeMaterial:   CELL_TYPE.DRYWALL,
        activeGeneration,
        // sparse cache keyed by generation index, only computes the ones you've actually looked at
        heatmaps: { [activeGeneration]: recompute(grid, gridWidth, gridHeight, router, activeGeneration) },
    };
}

function reducer(state, action) {
    switch (action.type) {

        case 'PAINT_CELL': {
            const { x, y } = action;
            if (x === state.router.x && y === state.router.y) return state;
            const idx = y * state.gridWidth + x;
            if (state.grid[idx] === state.activeMaterial) return state;
            const newGrid = state.grid.slice();
            newGrid[idx] = state.activeMaterial;
            return { ...state, grid: newGrid };
        }

        case 'SET_MATERIAL':
            return { ...state, activeMaterial: action.material };

        case 'MOVE_ROUTER': {
            const { x, y } = action;
            if (state.grid[y * state.gridWidth + x] !== CELL_TYPE.EMPTY) return state;
            if (x === state.router.x && y === state.router.y) return state;
            return { ...state, router: { x, y } };
        }

        // fires once when a stroke or router drag ends
        case 'COMMIT_EDIT': {
            const heatmap = recompute(state.grid, state.gridWidth, state.gridHeight, state.router, state.activeGeneration);
            // grid/router changed, so whatever else was cached is stale now
            return { ...state, heatmaps: { [state.activeGeneration]: heatmap } };
        }

        case 'SET_GENERATION': {
            if (state.heatmaps[action.index]) {
                return { ...state, activeGeneration: action.index };
            }
            const heatmap = recompute(state.grid, state.gridWidth, state.gridHeight, state.router, action.index);
            return { ...state, activeGeneration: action.index, heatmaps: { ...state.heatmaps, [action.index]: heatmap } };
        }

        case 'CLEAR_GRID': {
            const newGrid = new Uint8Array(state.gridWidth * state.gridHeight);
            const heatmap = recompute(newGrid, state.gridWidth, state.gridHeight, state.router, state.activeGeneration);
            return { ...state, grid: newGrid, heatmaps: { [state.activeGeneration]: heatmap } };
        }

        default:
            return state;
    }
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function WifiHeatmapExplorer() {
    const [state, dispatch] = useReducer(reducer, null, createInitialState);

    return (
        /* Added min-w-0 and px-2 to ensure the 640px wrapper never overflows small phone viewports */
        <div className="wifi-explorer flex flex-col gap-3 w-full max-w-[640px] min-w-0 mx-auto px-2 sm:px-0">
            <FloorplanEditor
                state={state}
                dispatch={dispatch}
                cellSize={CELL_SIZE}
                generations={GENERATIONS}
            />
        </div>
    );
}