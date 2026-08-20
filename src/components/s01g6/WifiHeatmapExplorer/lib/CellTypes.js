/**
 * cellTypes.js
 * CellType index constants, attenuation values, and display config.
 * The grid (Uint8Array) stores these indices — 1 byte per cell.
 */

/** @typedef {0|1|2|3} CellTypeIndex */

export const CELL_TYPE = {
    EMPTY:    0,
    DRYWALL:  1,
    CONCRETE: 2,
    METAL:    3,
};

/**
 * One entry per cell type, ordered by index so CELL_CONFIGS[cellTypeIndex] works directly.
 *
 * attenuation: signal loss in dB when a signal path crosses this material.
 *              Empty cells have no intrinsic loss — only distance falloff applies.
 * color:       Canvas fill color used in floor plan mode.
 * edgeColor:   Outline drawn on top of the fill (wall cells get a distinct border).
 */
export const CELL_CONFIGS = [
    {
        type:        CELL_TYPE.EMPTY,
        key:         'empty',
        label:       'Empty',
        attenuation: 0,
        color:       '#0d1b2e',
        edgeColor:   '#1e293b',
    },
    {
        type:        CELL_TYPE.DRYWALL,
        key:         'drywall',
        label:       'Drywall',
        attenuation: 3,
        color:       '#78350f',
        edgeColor:   '#92400e',
    },
    {
        type:        CELL_TYPE.CONCRETE,
        key:         'concrete',
        label:       'Concrete',
        attenuation: 12,
        color:       '#374151',
        edgeColor:   '#4b5563',
    },
    {
        type:        CELL_TYPE.METAL,
        key:         'metal',
        label:       'Metal',
        attenuation: 20,
        color:       '#0c4a6e',
        edgeColor:   '#075985',
    },
];