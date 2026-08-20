/**
 * Draws a clean outer border around the canvas area.
 */
export function drawOuterBorder(ctx, width, height, color = '#cbd5e1') {
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
}

/**
 * Draws the router marker node on the canvas.
 */
export function drawRouter(ctx, router, cellSize, fillColor = '#ffffff', strokeColor = '#0f172a') {
    const cx = router.x * cellSize + cellSize / 2;
    const cy = router.y * cellSize + cellSize / 2;
    const r  = cellSize * 0.36;

    ctx.fillStyle   = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}