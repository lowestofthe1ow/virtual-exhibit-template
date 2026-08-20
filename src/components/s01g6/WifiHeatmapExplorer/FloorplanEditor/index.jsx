import { useRef, useEffect, useState } from 'react';
import { CELL_TYPE, CELL_CONFIGS } from '../lib/CellTypes.js';
import { signalToColor, LEGEND } from '../lib/SignalColor.js';
import MaterialToolbar from './MaterialToolbar.jsx';
import RouterMarker from './RouterMarker.jsx';
import GenerationSelector from './GenerationSelector.jsx';
import { drawOuterBorder, drawRouter } from '../lib/CanvasUtils.js';

const ROUTER_COLOR    = '#38bdf8';
const ROUTER_OUTLINE  = '#0f172a';
const GRID_LINE_COLOR = '#1e293b';

function drawCanvas(ctx, state, cellSize, heatmap, showOverlay) {
    const { grid, gridWidth, gridHeight, router } = state;
    const W = gridWidth  * cellSize;
    const H = gridHeight * cellSize;
    const overlayActive = showOverlay && !!heatmap;

    ctx.clearRect(0, 0, W, H);

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const idx = y * gridWidth + x;
            ctx.fillStyle = overlayActive
                ? signalToColor(heatmap[idx])
                : CELL_CONFIGS[grid[idx]].color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    if (overlayActive) {
        // walls get drawn translucent + outlined on top so they don't disappear into the heatmap
        ctx.save();
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const cellType = grid[y * gridWidth + x];
                if (cellType === CELL_TYPE.EMPTY) continue;
                const config = CELL_CONFIGS[cellType];
                ctx.globalAlpha = 0.55;
                ctx.fillStyle   = config.color;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.globalAlpha = 1;
                ctx.strokeStyle = config.edgeColor;
                ctx.lineWidth   = 0.5;
                ctx.strokeRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize - 1, cellSize - 1);
            }
        }
        ctx.restore();
    } else {
        ctx.beginPath();
        for (let x = 0; x <= gridWidth; x++) {
            ctx.moveTo(x * cellSize + 0.5, 0);
            ctx.lineTo(x * cellSize + 0.5, H);
        }
        for (let y = 0; y <= gridHeight; y++) {
            ctx.moveTo(0,  y * cellSize + 0.5);
            ctx.lineTo(W, y * cellSize + 0.5);
        }
        ctx.strokeStyle = GRID_LINE_COLOR;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
    }

    drawOuterBorder(ctx, W, H);
    drawRouter(ctx, router, cellSize, ROUTER_COLOR, ROUTER_OUTLINE);
}

export default function FloorplanEditor({ state, dispatch, cellSize, generations }) {
    const canvasRef         = useRef(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const isDragging        = useRef(false);
    const isDraggingRouter  = useRef(false);

    const handleStartRef = useRef(null);
    const handleMoveRef  = useRef(null);
    const handleEndRef   = useRef(null);

    const heatmap    = state.heatmaps[state.activeGeneration];
    const generation = generations[state.activeGeneration];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        drawCanvas(canvas.getContext('2d'), state, cellSize, heatmap, showOverlay);
    }, [state, cellSize, heatmap, showOverlay]);

    function getCellCoords(e) {
        const canvas = canvasRef.current;
        if (!canvas) return { x: -1, y: -1 };

        const rect    = canvas.getBoundingClientRect();
        const clientX = e.touches?.length > 0 ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches?.length > 0 ? e.touches[0].clientY : e.clientY;
        const scaleX  = canvas.width  / rect.width;
        const scaleY  = canvas.height / rect.height;

        return {
            x: Math.floor((clientX - rect.left) * scaleX / cellSize),
            y: Math.floor((clientY - rect.top)  * scaleY / cellSize),
        };
    }

    function inBounds(x, y) {
        return x >= 0 && x < state.gridWidth && y >= 0 && y < state.gridHeight;
    }

    function handleStart(e) {
        e.preventDefault();
        const { x, y } = getCellCoords(e);
        if (!inBounds(x, y)) return;

        const onRouter = x === state.router.x && y === state.router.y;
        if (onRouter) {
            isDraggingRouter.current = true;
            return;
        }

        isDragging.current = true;
        dispatch({ type: 'PAINT_CELL', x, y });
    }

    function handleMove(e) {
        e.preventDefault();
        const { x, y } = getCellCoords(e);

        if (canvasRef.current && !e.touches) {
            const overRouter = x === state.router.x && y === state.router.y;
            canvasRef.current.style.cursor = (overRouter || isDraggingRouter.current) ? 'grab' : 'crosshair';
        }

        if (isDraggingRouter.current) {
            if (!inBounds(x, y)) return;
            dispatch({ type: 'MOVE_ROUTER', x, y });
            return;
        }

        if (!isDragging.current) return;
        if (!inBounds(x, y)) return;
        dispatch({ type: 'PAINT_CELL', x, y });
    }

    function handleEnd(e) {
        e?.preventDefault();
        const wasEditing = isDragging.current || isDraggingRouter.current;
        isDragging.current       = false;
        isDraggingRouter.current = false;
        if (wasEditing) dispatch({ type: 'COMMIT_EDIT' });
    }

    handleStartRef.current = handleStart;
    handleMoveRef.current  = handleMove;
    handleEndRef.current   = handleEnd;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onStart = (e) => handleStartRef.current?.(e);
        const onMove  = (e) => handleMoveRef.current?.(e);
        const onEnd   = (e) => handleEndRef.current?.(e);

        const opts = { passive: false };
        canvas.addEventListener('touchstart',  onStart, opts);
        canvas.addEventListener('touchmove',   onMove,  opts);
        canvas.addEventListener('touchend',    onEnd,   opts);
        canvas.addEventListener('touchcancel', onEnd,   opts);

        return () => {
            canvas.removeEventListener('touchstart',  onStart, opts);
            canvas.removeEventListener('touchmove',   onMove,  opts);
            canvas.removeEventListener('touchend',    onEnd,   opts);
            canvas.removeEventListener('touchcancel', onEnd,   opts);
        };
    }, []);

    return (
        <div className="flex flex-col gap-3 w-full min-w-0 max-w-full">
            <MaterialToolbar
                state={state}
                dispatch={dispatch}
                onClearAll={() => dispatch({ type: 'CLEAR_GRID' })}
                showOverlay={showOverlay}
                onToggleOverlay={() => setShowOverlay(v => !v)}
            />

            <GenerationSelector
                activeIndex={state.activeGeneration}
                generations={generations}
                onSelect={(index) => dispatch({ type: 'SET_GENERATION', index })}
            />

            <canvas
                ref={canvasRef}
                width={state.gridWidth  * cellSize}
                height={state.gridHeight * cellSize}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                className="block border border-s01g6-border rounded-s01g6-sm select-none w-full h-auto touch-none"
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', aspectRatio: '4/3' }}
            />

            <RouterMarker router={state.router} />

            {showOverlay && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {LEGEND.map(({ label, color, border }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-s01g6-muted-foreground">
                            <span
                                className="inline-block w-3 h-3 rounded-s01g6-sm shrink-0"
                                style={{
                                    backgroundColor: color,
                                    border: border ? '1px solid #1e293b' : '1px solid transparent',
                                }}
                            />
                            {label}
                        </div>
                    ))}
                </div>
            )}

            {showOverlay && generation?.description && (
                <p className="text-sm text-s01g6-muted-foreground border-l-2 border-s01g6-border pl-3 leading-relaxed">
                    {generation.description}
                </p>
            )}
        </div>
    );
}
