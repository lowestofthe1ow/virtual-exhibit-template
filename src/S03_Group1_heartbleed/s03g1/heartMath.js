/**
 * heartMath.js
 *
 * Pure geometry helpers used to draw the wireframe heart (Stages 1-2) and the
 * wireframe globe (Stage 3) as plain SVG paths -- no charting/3D library needed.
 *
 * The heart boundary uses the classic parametric "heart curve":
 *   x(t) = 16 sin^3(t)
 *   y(t) = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
 *
 * "Meridian" lines are the same boundary scaled horizontally by cos(phi), which
 * keeps the top-cleft/bottom-tip points fixed (x=0 there) so every meridian
 * still converges at those points, same as longitude lines converge at a pole.
 *
 * "Parallel" lines are horizontal chords through the shape at a given y, found
 * by scanning the sampled boundary for sign changes, then bowed slightly with
 * a quadratic curve so they read as wrapping around a rounded volume.
 */

export function sampleHeartBoundary(steps = 720) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y =
      13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push([x, -y]); // flip y: SVG's axis points down, heart curve assumes y-up
  }
  return pts;
}

export function sampleDomeBoundary(steps = 360, radius = 16) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI;
    const x = radius * Math.cos(t);
    const y = -radius * Math.sin(t);
    pts.push([x, y]);
  }
  return pts; // open arc from (radius, 0) over the top to (-radius, 0)
}

export function pointsToPath(points) {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

export function meridianPath(boundary, phi) {
  const c = Math.cos(phi);
  return pointsToPath(boundary.map(([x, y]) => [x * c, y]));
}

function crossingsAtY(boundary, yLevel) {
  const xs = [];
  for (let i = 0; i < boundary.length - 1; i++) {
    const [x1, y1] = boundary[i];
    const [x2, y2] = boundary[i + 1];
    if ((y1 - yLevel) * (y2 - yLevel) <= 0 && y1 !== y2) {
      const t = (yLevel - y1) / (y2 - y1);
      xs.push(x1 + t * (x2 - x1));
    }
  }
  return xs.sort((a, b) => a - b);
}

export function parallelPaths(boundary, levels, bow = 1.4) {
  const paths = [];
  for (const y of levels) {
    const xs = crossingsAtY(boundary, y);
    for (let i = 0; i < xs.length - 1; i += 2) {
      const x0 = xs[i];
      const x1 = xs[i + 1];
      const midX = (x0 + x1) / 2;
      paths.push(
        `M${x0.toFixed(2)},${y.toFixed(2)} Q${midX.toFixed(2)},${(y + bow).toFixed(2)} ${x1.toFixed(2)},${y.toFixed(2)}`
      );
    }
  }
  return paths;
}

export function boundsOf(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

export function evenLevels(minY, maxY, count) {
  const levels = [];
  for (let i = 1; i < count; i++) {
    levels.push(minY + ((maxY - minY) * i) / count);
  }
  return levels;
}
