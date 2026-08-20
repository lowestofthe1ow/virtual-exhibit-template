/**
 * propagation.js
 * Signal computation for the WiFi heatmap.
 *
 * Model:
 *   signal(cell) = maxStrength
 *                - stepCost * pathDistance
 *                - sum(wallAttenuation * wallPenetration) along best path
 *
 * Uses a max-heap Dijkstra so signal always takes the path of least resistance
 * (e.g. routes around a metal wall if a longer empty-space path yields higher signal).
 *
 * After the main pass, 2 diffusion rounds let signal bleed slightly around corners,
 * which prevents the hard shadow artifacts that pure line-of-sight BFS produces.
 *
 * Output is a Float32Array of normalized values 0.0–1.0, one per cell.
 */

import { CELL_CONFIGS } from './CellTypes.js';

/**
 * Distance falloff cost per unit distance for each frequency band.
 * Lower = signal travels further.
 * 5 GHz loses power faster with distance; 2.4 GHz is gentler.
 *
 * Approximate open-space range = maxStrength / distanceCost (in grid cells).
 */
const DISTANCE_COST = {
    '2.4GHz': 2.0,
    '5GHz':   3.5,
    'dual':   2.5,
};

const DIFFUSION_STEP_COST = 9;
const DIFFUSION_PASSES = 2;

const DIRS = [
    [-1,  0, 1],
    [ 1,  0, 1],
    [ 0, -1, 1],
    [ 0,  1, 1],
    [-1, -1, Math.SQRT2],
    [ 1, -1, Math.SQRT2],
    [-1,  1, Math.SQRT2],
    [ 1,  1, Math.SQRT2],
];

class MaxHeap {
    constructor() {
        /** @type {[number, number, number][]} */
        this.data = [];
    }

    get size() {
        return this.data.length;
    }

    /** @param {[number, number, number]} item */
    push(item) {
        this.data.push(item);
        this._bubbleUp(this.data.length - 1);
    }

    /** @returns {[number, number, number]} */
    pop() {
        const top = this.data[0];
        const last = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = last;
            this._sinkDown(0);
        }
        return top;
    }

    _bubbleUp(i) {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.data[parent][0] >= this.data[i][0]) break;
            [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
            i = parent;
        }
    }

    _sinkDown(i) {
        const n = this.data.length;
        while (true) {
            let largest = i;
            const l = 2 * i + 1;
            const r = 2 * i + 2;
            if (l < n && this.data[l][0] > this.data[largest][0]) largest = l;
            if (r < n && this.data[r][0] > this.data[largest][0]) largest = r;
            if (largest === i) break;
            [this.data[largest], this.data[i]] = [this.data[i], this.data[largest]];
            i = largest;
        }
    }
}

// ---------------------------------------------------------------------------
// Core computation
// ---------------------------------------------------------------------------

/**
 * Compute a signal heatmap for a single WiFi generation.
 *
 * @param {Uint8Array} grid           - Flat row-major grid of CellType indices
 * @param {number}     gridWidth
 * @param {number}     gridHeight
 * @param {{ x: number, y: number }} router
 * @param {import('./Generations.js').Generation} generation
 * @returns {Float32Array} Normalized signal 0.0–1.0 per cell
 */
export function computeHeatmap(grid, gridWidth, gridHeight, router, generation) {
    const { maxStrength, frequencyBand, wallPenetration } = generation;
    const stepCostBase = DISTANCE_COST[frequencyBand] ?? DISTANCE_COST['dual'];
    const size = gridWidth * gridHeight;

    // Raw signal values — -Infinity means the cell hasn't been reached yet
    const raw = new Float32Array(size).fill(-Infinity);

    const { x: rx, y: ry } = router;
    raw[ry * gridWidth + rx] = maxStrength;

    const heap = new MaxHeap();
    heap.push([maxStrength, rx, ry]);

    // Dijkstra — always expand the cell with the highest current signal
    while (heap.size > 0) {
        const [sig, x, y] = heap.pop();

        // Stale entry — a better path to this cell was already processed
        if (sig < raw[y * gridWidth + x] - 0.001) continue;

        for (const [dx, dy, dist] of DIRS) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx < 0 || nx >= gridWidth || ny < 0 || ny >= gridHeight) continue;

            const nIdx = ny * gridWidth + nx;
            const attenuation = CELL_CONFIGS[grid[nIdx]].attenuation;
            const wallPenalty = attenuation * wallPenetration;
            const stepCost = stepCostBase * dist;

            const newSig = sig - stepCost - wallPenalty;

            if (newSig > raw[nIdx]) {
                raw[nIdx] = newSig;
                // Only enqueue if the signal is still positive — dead signal won't spread further
                if (newSig > 0) {
                    heap.push([newSig, nx, ny]);
                }
            }
        }
    }

    for (let pass = 0; pass < DIFFUSION_PASSES; pass++) {
        const fw = pass % 2 === 0;
        const y0 = fw ? 0 : gridHeight - 1;
        const y1 = fw ? gridHeight : -1;
        const yd = fw ? 1 : -1;
        const x0 = fw ? 0 : gridWidth - 1;
        const x1 = fw ? gridWidth : -1;
        const xd = fw ? 1 : -1;

        for (let y = y0; y !== y1; y += yd) {
            for (let x = x0; x !== x1; x += xd) {
                const idx = y * gridWidth + x;
                if (raw[idx] <= 0) continue;

                for (const [ddx, ddy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                    const nx = x + ddx;
                    const ny = y + ddy;
                    if (nx < 0 || nx >= gridWidth || ny < 0 || ny >= gridHeight) continue;
                    const nIdx = ny * gridWidth + nx;
                    const leaked = raw[idx] - DIFFUSION_STEP_COST;
                    if (leaked > raw[nIdx]) {
                        raw[nIdx] = leaked;
                    }
                }
            }
        }
    }

    // Normalize — clamp to [0, 1] using maxStrength as the ceiling
    const result = new Float32Array(size);
    for (let i = 0; i < size; i++) {
        result[i] = Math.max(0, Math.min(1, raw[i] / maxStrength));
    }

    return result;
}