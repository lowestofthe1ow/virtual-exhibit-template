import React, { useState, useEffect, useRef } from 'react';
import { useEraView } from '../EraViewContext.jsx';

// Pre-defined shapes on 8x8 and 16x16 grids
const SHAPES = {
  8: {
    LINE: [
      [1,0,0,0,0,0,0,1],
      [0,1,0,0,0,0,1,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,1,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,1]
    ],
    TRIANGLE: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0]
    ],
    CIRCLE: [
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,0,0]
    ]
  },
  16: {
    LINE: [
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0],
      [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
    ],
    TRIANGLE: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    CIRCLE: [
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0]
    ]
  }
};

// Preview Component inside the planet node
function RasterizerPreview() {
  const [scanlineRow, setScanlineRow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanlineRow((prev) => (prev + 1) % 8);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const triangle = SHAPES[8].TRIANGLE;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-16 h-16 bg-black/60 border border-[#ef4444]/30 rounded overflow-hidden flex flex-col justify-between p-0.5">
        {triangle.map((row, y) => (
          <div key={y} className="flex justify-between w-full h-[7px]">
            {row.map((pixel, x) => {
              const isScanline = y === scanlineRow;
              return (
                <div
                  key={x}
                  className="w-[7px] h-full transition-all duration-200"
                  style={{
                    backgroundColor: pixel ? '#ef4444' : 'transparent',
                    opacity: isScanline ? 1 : pixel ? 0.4 : 0,
                    boxShadow: pixel && isScanline ? '0 0 4px #ef4444' : 'none'
                  }}
                />
              );
            })}
          </div>
        ))}
        {/* Glow sweeping scanline indicator */}
        <div
          className="absolute left-0 w-full h-[1px] bg-[#ef4444] opacity-50 shadow-[0_0_8px_#ef4444] transition-all duration-150 pointer-events-none"
          style={{ top: `${(scanlineRow / 8) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Expanded Interactive Component inside the Modal (compact for scale-150 wrapper)
function RasterizerCRT() {
  const [gridSize, setGridSize] = useState(16);
  const [selectedShape, setSelectedShape] = useState('TRIANGLE');
  const [gridData, setGridData] = useState([]);
  const [scanIndex, setScanIndex] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);

  const MONO_COLOR = '#ef4444';

  // Triggers drawing and scans immediately whenever shape or resolution is initialized or updated
  useEffect(() => {
    if (selectedShape === 'CUSTOM') {
      setGridData(Array(gridSize).fill(null).map(() => Array(gridSize).fill(0)));
      setScanIndex(gridSize); // Fully visible initially for custom drawing
      setIsScanning(false);
    } else {
      const template = SHAPES[gridSize][selectedShape];
      setGridData(template);
      setScanIndex(0); // Start scanning from the top row
      setIsScanning(true);
    }
  }, [gridSize, selectedShape]);

  // Scan progression timer
  useEffect(() => {
    if (!isScanning) return;
    if (scanIndex >= gridSize) {
      setIsScanning(false);
      return;
    }

    const timer = setTimeout(() => {
      setScanIndex((prev) => prev + 1);
    }, 80);

    return () => clearTimeout(timer);
  }, [isScanning, scanIndex, gridSize]);

  const startScan = () => {
    setScanIndex(0);
    setIsScanning(true);
  };

  const isMouseDownRef = useRef(false);
  const drawModeRef = useRef(1); // 1 = draw, 0 = erase

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isMouseDownRef.current = false;
    };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, []);

  const handleMouseDown = (e, y, x) => {
    if (e.button !== 0) return; // Only trigger for primary click
    if (selectedShape !== 'CUSTOM') {
      setSelectedShape('CUSTOM');
    }
    isMouseDownRef.current = true;
    const nextVal = gridData[y][x] ? 0 : 1;
    drawModeRef.current = nextVal;

    setGridData((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[y][x] = nextVal;
      return copy;
    });
  };

  const handleMouseEnter = (y, x) => {
    if (!isMouseDownRef.current) return;
    setGridData((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[y][x] = drawModeRef.current;
      return copy;
    });
  };

  const getPixelColor = (pixelActive, y) => {
    if (!pixelActive) return 'transparent';
    if (isScanning && y > scanIndex) return 'transparent';
    return MONO_COLOR;
  };

  return (
    <div className="flex flex-col items-center gap-3 p-1">
      
      {/* ── CRT Display Bezel ── */}
      <div className="relative">
        <div className="relative bg-[#1e1c1e] rounded-xl p-2 border-2 border-[#3a353a] shadow-lg flex flex-col items-center">
          
          {/* Glass screen mask (scaled down from 260px to 140px) */}
          <div className="relative bg-black rounded p-1 border border-black overflow-hidden" style={{ width: '140px', height: '140px' }}>
            
            {/* Scanlines layer */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.85)_2px,_rgba(0,0,0,0.85)_3px)]" />
            
            {/* Screen Inner Framebuffer Grid */}
            <div 
              className="w-full h-full flex flex-col justify-between select-none"
              onDragStart={(e) => e.preventDefault()}
            >
              {gridData.map((row, y) => (
                <div key={y} className="flex justify-between w-full h-[5%]">
                  {row.map((pixel, x) => {
                    const isCurrentScanline = y === scanIndex;
                    const color = getPixelColor(pixel, y);
                    return (
                      <div
                        key={x}
                        onMouseDown={(e) => handleMouseDown(e, y, x)}
                        onMouseEnter={() => handleMouseEnter(y, x)}
                        className="cursor-crosshair flex-1 mx-[0.2px] border border-white/[0.01]"
                        style={{
                          backgroundColor: color,
                          opacity: isCurrentScanline ? 1 : pixel ? 0.95 : 0.04,
                          boxShadow: pixel && (isCurrentScanline || true) 
                            ? `0 0 4px ${color}` 
                            : 'none'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Sweep laser line for scanning */}
            {isScanning && scanIndex < gridSize && (
              <div 
                className="absolute left-0 w-full h-[1.5px] bg-[#ef4444] opacity-80 shadow-[0_0_6px_#ef4444] pointer-events-none transition-all duration-100"
                style={{ top: `${(scanIndex / gridSize) * 100}%` }}
              />
            )}
          </div>
          
          {/* Bezel frame end */}
        </div>
      </div>

      {/* ── Compact Interactive Controls ── */}
      <div className="w-[172px] bg-black/40 border border-white/5 rounded-lg p-2 flex flex-col gap-2 font-mono text-[8px] text-zinc-300">
        
        {/* Shape & Grid Controls */}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">Primitive Shape</span>
            <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
              {['LINE', 'TRI', 'CIRC', 'EDIT'].map((shapeLabel, idx) => {
                const shapesMap = ['LINE', 'TRIANGLE', 'CIRCLE', 'CUSTOM'];
                const targetShape = shapesMap[idx];
                return (
                  <button
                    key={targetShape}
                    onClick={() => setSelectedShape(targetShape)}
                    className={`flex-1 py-0.5 rounded text-[7px] font-bold cursor-pointer transition-colors ${
                      selectedShape === targetShape 
                        ? 'bg-[#ef4444] text-white font-black' 
                        : 'hover:text-white text-zinc-400'
                    }`}
                  >
                    {shapeLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">Grid Res</span>
            <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
              {[8, 16].map((res) => (
                <button
                  key={res}
                  onClick={() => {
                    setGridSize(res);
                    if (selectedShape === 'CUSTOM') {
                      setSelectedShape('LINE');
                    }
                  }}
                  className={`flex-1 py-0.5 rounded text-[7px] font-bold cursor-pointer transition-colors ${
                    gridSize === res 
                      ? 'bg-[#ef4444] text-white font-black' 
                      : 'hover:text-white text-zinc-400'
                  }`}
                >
                  {res}x{res}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedShape === 'CUSTOM' && (
          <div className="text-[6.5px] text-zinc-500 italic mt-0.5 border-t border-white/5 pt-1 text-center">
            NOTE: Draw by clicking pixels on screen
          </div>
        )}

      </div>
    </div>
  );
}

// Main 1970s entry node
export default function Rasterizer1970s() {
  const ref = useRef(null);
  const [view, setView] = useState('preview');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const container = el.closest('[data-era-view]');
    if (container) {
      setView(container.getAttribute('data-era-view'));
    }
  }, []);

  return (
    <div ref={ref}>
      {view === 'expanded' ? <RasterizerCRT /> : <RasterizerPreview />}
    </div>
  );
}
