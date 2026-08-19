/**
 * S40_Group3_demoLogo.js
 *
 * Builds the College of Computer Studies mark as a list of pen strokes for
 * the Drawing Tablet Simulator's demo mode: the tilted frame (outer and
 * inner outline, like the real mark) plus the wordmark "College of /
 * Computer Studies" rendered in a small single-stroke vector font.
 *
 * Why a stroke font? The simulator's output medium is a pen: everything on
 * the monitor is a polyline with pressure-based thickness. Filled serif
 * type cannot exist in that medium, so the wordmark is drawn the way a pen
 * plotter would draw it: one continuous line per stroke, one or more
 * strokes per glyph.
 *
 * Exports:
 *   buildDemoStrokes() -> [{ points: [{x, y}], pressure }]
 *     Coordinates are normalized pad coordinates (0..1 in both axes),
 *     already aspect-corrected for the pad's 400x220 active area so the
 *     mark renders square, not stretched.
 */

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;

/** Sample an elliptical arc (y-down coordinates) into a point list. */
function arc(cx, cy, rx, ry, a0deg, a1deg, n = 10) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0deg + ((a1deg - a0deg) * i) / n) * DEG;
    pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  }
  return pts;
}

// ---------------------------------------------------------------------------
// Single-stroke glyphs
//
// Each glyph is defined in a unit cell: x grows right (advance width in
// `adv`), y grows down with 0 = cap top, 0.44 = x-height top, 1 = baseline,
// 1.28 = descender depth. A glyph is a list of polylines (pen lifts between
// them).
// ---------------------------------------------------------------------------

const GLYPHS = {
  C: {
    adv: 0.66,
    strokes: [arc(0.34, 0.5, 0.28, 0.48, 55, 305, 14)],
  },
  S: {
    adv: 0.64,
    strokes: [
      [
        { x: 0.52, y: 0.14 },
        { x: 0.42, y: 0.05 },
        { x: 0.28, y: 0.02 },
        { x: 0.14, y: 0.08 },
        { x: 0.08, y: 0.2 },
        { x: 0.1, y: 0.33 },
        { x: 0.2, y: 0.42 },
        { x: 0.34, y: 0.48 },
        { x: 0.46, y: 0.55 },
        { x: 0.52, y: 0.66 },
        { x: 0.52, y: 0.8 },
        { x: 0.44, y: 0.92 },
        { x: 0.3, y: 0.98 },
        { x: 0.16, y: 0.95 },
        { x: 0.06, y: 0.86 },
      ],
    ],
  },
  o: {
    adv: 0.6,
    strokes: [arc(0.28, 0.72, 0.24, 0.28, 0, 360, 16)],
  },
  c: {
    adv: 0.56,
    strokes: [arc(0.28, 0.72, 0.24, 0.28, 50, 310, 12)],
  },
  e: {
    adv: 0.58,
    strokes: [
      [
        { x: 0.06, y: 0.7 },
        { x: 0.52, y: 0.7 },
        ...arc(0.29, 0.72, 0.23, 0.28, -5, -300, 14),
      ],
    ],
  },
  l: {
    adv: 0.3,
    strokes: [
      [
        { x: 0.14, y: 0.04 },
        { x: 0.14, y: 1.0 },
      ],
    ],
  },
  g: {
    adv: 0.6,
    strokes: [
      arc(0.27, 0.72, 0.22, 0.27, 0, 360, 14),
      [
        { x: 0.49, y: 0.45 },
        { x: 0.49, y: 1.1 },
        ...arc(0.29, 1.1, 0.2, 0.17, 0, 140, 7),
      ],
    ],
  },
  f: {
    adv: 0.42,
    strokes: [
      [
        { x: 0.42, y: 0.1 },
        { x: 0.32, y: 0.04 },
        { x: 0.2, y: 0.12 },
        { x: 0.2, y: 1.0 },
      ],
      [
        { x: 0.04, y: 0.45 },
        { x: 0.4, y: 0.45 },
      ],
    ],
  },
  m: {
    adv: 0.86,
    strokes: [
      [
        { x: 0.08, y: 0.45 },
        { x: 0.08, y: 1.0 },
      ],
      [{ x: 0.08, y: 0.66 }, ...arc(0.22, 0.66, 0.14, 0.2, 180, 360, 7), { x: 0.36, y: 1.0 }],
      [{ x: 0.36, y: 0.66 }, ...arc(0.5, 0.66, 0.14, 0.2, 180, 360, 7), { x: 0.64, y: 1.0 }],
    ],
  },
  p: {
    adv: 0.62,
    strokes: [
      [
        { x: 0.1, y: 0.45 },
        { x: 0.1, y: 1.28 },
      ],
      [{ x: 0.1, y: 0.62 }, ...arc(0.31, 0.72, 0.21, 0.27, 195, 165 - 360, 14)],
    ],
  },
  u: {
    adv: 0.62,
    strokes: [
      [
        { x: 0.1, y: 0.45 },
        { x: 0.1, y: 0.76 },
        ...arc(0.3, 0.76, 0.2, 0.23, 180, 90, 6),
        ...arc(0.3, 0.76, 0.2, 0.23, 90, 0, 6),
        { x: 0.5, y: 0.45 },
      ],
      [
        { x: 0.5, y: 0.45 },
        { x: 0.5, y: 1.0 },
      ],
    ],
  },
  t: {
    adv: 0.44,
    strokes: [
      [
        { x: 0.2, y: 0.14 },
        { x: 0.2, y: 0.86 },
        { x: 0.26, y: 1.0 },
        { x: 0.42, y: 1.0 },
      ],
      [
        { x: 0.04, y: 0.45 },
        { x: 0.4, y: 0.45 },
      ],
    ],
  },
  r: {
    adv: 0.44,
    strokes: [
      [
        { x: 0.1, y: 0.45 },
        { x: 0.1, y: 1.0 },
      ],
      [{ x: 0.1, y: 0.66 }, ...arc(0.26, 0.68, 0.16, 0.2, 180, 335, 8)],
    ],
  },
  d: {
    adv: 0.62,
    strokes: [
      arc(0.26, 0.72, 0.22, 0.27, 0, 360, 14),
      [
        { x: 0.48, y: 0.04 },
        { x: 0.48, y: 1.0 },
      ],
    ],
  },
  i: {
    adv: 0.26,
    strokes: [
      [
        { x: 0.12, y: 0.26 },
        { x: 0.12, y: 0.3 },
      ],
      [
        { x: 0.12, y: 0.45 },
        { x: 0.12, y: 1.0 },
      ],
    ],
  },
  s: {
    adv: 0.5,
    strokes: [
      [
        { x: 0.42, y: 0.5 },
        { x: 0.34, y: 0.44 },
        { x: 0.22, y: 0.45 },
        { x: 0.12, y: 0.52 },
        { x: 0.1, y: 0.6 },
        { x: 0.16, y: 0.67 },
        { x: 0.26, y: 0.71 },
        { x: 0.36, y: 0.75 },
        { x: 0.42, y: 0.82 },
        { x: 0.4, y: 0.92 },
        { x: 0.3, y: 0.99 },
        { x: 0.18, y: 0.98 },
        { x: 0.08, y: 0.91 },
      ],
    ],
  },
  " ": { adv: 0.42, strokes: [] },
};

/**
 * Lay out a line of text. Returns { strokes, width } where strokes are in
 * layout units (glyph cell units scaled by `size`, origin at pen start).
 */
function layoutLine(text, size) {
  const strokes = [];
  let cursor = 0;
  for (const ch of text) {
    const g = GLYPHS[ch];
    if (!g) continue; // unsupported char: skip
    for (const s of g.strokes) {
      strokes.push(s.map((p) => ({ x: cursor + p.x * size, y: p.y * size })));
    }
    cursor += g.adv * size;
  }
  return { strokes, width: cursor };
}

// ---------------------------------------------------------------------------
// The mark: tilted frame, outer + inner outline
// (corner coordinates measured from the CCS mark, in a 0..1 content square)
// ---------------------------------------------------------------------------

const FRAME_OUTER = [
  { x: 0.025, y: 0.29 }, // left
  { x: 0.375, y: 0.2 }, // top
  { x: 0.615, y: 0.475 }, // right
  { x: 0.235, y: 0.65 }, // bottom
  { x: 0.025, y: 0.29 },
];

const FRAME_INNER = [
  { x: 0.125, y: 0.325 },
  { x: 0.375, y: 0.26 },
  { x: 0.5, y: 0.455 },
  { x: 0.27, y: 0.555 },
  { x: 0.125, y: 0.325 },
];

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

// Pad active-area aspect (SVG units) from S40_Group3_HardwareMatrixSim.jsx:
const PAD_W = 400;
const PAD_H = 220;

/**
 * Build the full demo: frame outlines + wordmark, as pad-normalized strokes.
 */
export function buildDemoStrokes() {
  // Content square -> pad-normalized mapping (aspect-corrected: the content
  // square uses most of the pad's height and is centered horizontally).
  const fy = 0.92; // fraction of pad height used
  const fx = (fy * PAD_H) / PAD_W; // equal physical scale on x
  const x0 = 0.5 - fx / 2;
  const y0 = (1 - fy) / 2;
  const toPad = (p) => ({ x: x0 + p.x * fx, y: y0 + p.y * fy });

  const out = [];

  // 1) The frame: outer then inner outline, drawn bold
  out.push({ points: FRAME_OUTER.map(toPad), pressure: 0.85 });
  out.push({ points: FRAME_INNER.map(toPad), pressure: 0.8 });

  // 2) The wordmark: two lines, left-aligned under the mark
  const size = 0.088; // cap height in content units
  const lineGap = 0.052;
  const textX = 0.03;
  const line1Top = 0.72;

  const l1 = layoutLine("College of", size);
  const l2 = layoutLine("Computer Studies", size);

  for (const s of l1.strokes) {
    out.push({
      points: s.map((p) => toPad({ x: textX + p.x, y: line1Top + p.y })),
      pressure: 0.55,
    });
  }
  const line2Top = line1Top + size + lineGap;
  for (const s of l2.strokes) {
    out.push({
      points: s.map((p) => toPad({ x: textX + p.x, y: line2Top + p.y })),
      pressure: 0.55,
    });
  }

  return out;
}
