import React, { useState, useEffect, useRef } from 'react';
import { useEraView } from '../EraViewContext.jsx';

// Polar coordinate targets for preview radar
const RADAR_TARGETS = [
  { r: 20, theta: 45 },
  { r: 35, theta: 120 },
  { r: 25, theta: 220 },
  { r: 40, theta: 300 }
];

// Preview Radar Component
function VisionPreview() {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    let handle;
    const animate = () => {
      setSweepAngle((prev) => (prev + 3) % 360);
      handle = requestAnimationFrame(animate);
    };
    handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div
        className="relative w-16 h-16 bg-black/60 border border-[#06b6d4]/30 rounded-full flex items-center justify-center overflow-hidden select-none"
        style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.15)' }}
      >
        {/* Radar concentric circles */}
        <div className="absolute w-12 h-12 rounded-full border border-[#06b6d4]/10" />
        <div className="absolute w-8 h-8 rounded-full border border-[#06b6d4]/10" />
        <div className="absolute w-4 h-4 rounded-full border border-[#06b6d4]/10" />

        {/* Crosshair grid lines */}
        <div className="absolute w-full h-[1px] bg-[#06b6d4]/10" />
        <div className="absolute h-full w-[1px] bg-[#06b6d4]/10" />

        {/* Sweep line */}
        <div
          className="absolute origin-center w-8 h-[1.5px] bg-gradient-to-r from-transparent to-[#06b6d4] z-10"
          style={{
            transform: `rotate(${sweepAngle}deg)`,
            left: '50%',
            transformOrigin: 'left center'
          }}
        />

        {/* Radar targets */}
        {RADAR_TARGETS.map((target, idx) => {
          const rad = (target.theta * Math.PI) / 180;
          const x = 32 + target.r * Math.cos(rad);
          const y = 32 + target.r * Math.sin(rad);

          // Calculate angle difference for sweep illumination
          const diff = Math.abs(((sweepAngle - target.theta + 180) % 360) - 180);
          const isIlluminated = diff < 20;

          return (
            <div
              key={idx}
              className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                backgroundColor: isIlluminated ? '#06b6d4' : '#083344',
                boxShadow: isIlluminated ? '0 0 6px #06b6d4' : 'none',
                opacity: isIlluminated ? 1 : 0.4
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// 3D Cube vertex list
const VERTICES = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
];

// Cube edge mapping
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0], // back face
  [4, 5], [5, 6], [6, 7], [7, 4], // front face
  [0, 4], [1, 5], [2, 6], [3, 7]  // connectors
];

// Cube face mapping for solid/flat rendering
const FACES = [
  [0, 1, 2, 3], // back
  [4, 5, 6, 7], // front
  [0, 1, 5, 4], // bottom
  [2, 3, 7, 6], // top
  [0, 3, 7, 4], // left
  [1, 2, 6, 5]  // right
];

// Main Interactive Computer Vision console component inside Modal
function VisionCRT() {
  const [algoMode, setAlgoMode] = useState('SOBEL'); // RAW, SOBEL, HARRIS, VECTOR
  const [sensitivity, setSensitivity] = useState(60); // 0 - 100
  const [lockedNode, setLockedNode] = useState(null); // Locked vertex index
  const [noiseNodes, setNoiseNodes] = useState([]); // Simulated noise dots
  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(35);
  const [isDragging, setIsDragging] = useState(false);

  const screenRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });

  // Project 3D cube coordinates to 2D screen space
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;

  const projected = VERTICES.map(([x, y, z]) => {
    const scaleFactor = 26;
    let px = x * scaleFactor;
    let py = y * scaleFactor;
    let pz = z * scaleFactor;

    // Y Rotation
    let ry_x = px * Math.cos(radY) + pz * Math.sin(radY);
    let ry_y = py;
    let ry_z = -px * Math.sin(radY) + pz * Math.cos(radY);

    // X Rotation
    let rx_x = ry_x;
    let rx_y = ry_y * Math.cos(radX) - ry_z * Math.sin(radX);
    let rx_z = ry_y * Math.sin(radX) + ry_z * Math.cos(radX);

    // Perspective Projection
    const dist = 90;
    const fov = 110;
    const scale = fov / (dist + rx_z);

    // Centered in 140x140 viewport
    return {
      x: 70 + rx_x * scale,
      y: 70 + rx_y * scale,
      z: rx_z
    };
  });

  // Determine which vertices are detected based on depth (z) and threshold settings
  const getVisibleVertices = () => {
    return projected.map((node, idx) => {
      // High threshold requires node to be closer to front (positive z)
      const isVisible = sensitivity >= 80 ? node.z > -5 : sensitivity >= 40 ? true : true;
      return { ...node, isVisible, idx };
    });
  };

  const visibleNodes = getVisibleVertices();

  // Rotation frame tick
  useEffect(() => {
    if (isDragging) return;
    let handle;
    const animate = () => {
      setRotY((prev) => (prev + 1.2) % 360);
      handle = requestAnimationFrame(animate);
    };
    handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [isDragging]);

  // Generate random coordinate noise when sensitivity is low (under 40)
  useEffect(() => {
    if (sensitivity >= 40) {
      setNoiseNodes([]);
      return;
    }

    const count = Math.ceil((40 - sensitivity) / 5);
    const interval = setInterval(() => {
      const noise = Array(count).fill(null).map(() => ({
        x: 20 + Math.random() * 100,
        y: 20 + Math.random() * 100,
        id: Math.random()
      }));
      setNoiseNodes(noise);
    }, 150);

    return () => clearInterval(interval);
  }, [sensitivity]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotX,
      rotY: rotY,
      hasMoved: false
    };
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        dragStart.current.hasMoved = true;
      }
      
      const sensitivityFactor = 0.8;

      setRotX(Math.max(-80, Math.min(80, dragStart.current.rotX - deltaY * sensitivityFactor)));
      setRotY((dragStart.current.rotY + deltaX * sensitivityFactor) % 360);
    };

    const handlePointerUp = (e) => {
      setIsDragging(false);

      // If click was clean without drag, lock-on to the nearest vertex
      if (!dragStart.current.hasMoved) {
        if (!screenRef.current) return;
        const rect = screenRef.current.getBoundingClientRect();
        
        // Scale coordinates into 140x140 viewBox
        const clickX = ((e.clientX - rect.left) / rect.width) * 140;
        const clickY = ((e.clientY - rect.top) / rect.height) * 140;

        // Find nearest projected vertex
        let minDistance = Infinity;
        let nearestIndex = null;

        projected.forEach((node, idx) => {
          const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2);
          if (dist < minDistance) {
            minDistance = dist;
            nearestIndex = idx;
          }
        });

        if (nearestIndex !== null && minDistance < 35) {
          setLockedNode(nearestIndex);
        } else {
          setLockedNode(null);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, projected]);

  return (
    <div className="flex flex-col items-center gap-3 p-1">

      {/* ── Computer Vision CRT Display Bezel ── */}
      <div className="relative">
        <div className="relative bg-[#1a202c] rounded-xl p-2 border-2 border-slate-700 shadow-lg flex flex-col items-center">

          <div
            ref={screenRef}
            onPointerDown={handlePointerDown}
            className="relative bg-black rounded p-1 border border-[#0f172a] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ width: '140px', height: '140px' }}
          >
            {/* Scanline CRT layout */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-15 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.85)_2px,_rgba(0,0,0,0.85)_3px)]" />

            <svg
              viewBox="0 0 140 140"
              className="w-full h-full"
            >
              {/* Scope circle grid lines */}
              <circle cx="70" cy="70" r="65" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="2 3" className="opacity-30" />
              <circle cx="70" cy="70" r="40" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="1 4" className="opacity-20" />
              <line x1="5" y1="70" x2="135" y2="70" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-25" />
              <line x1="70" y1="5" x2="70" y2="135" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-25" />

              {/* RAW mode: Filled semi-transparent polygons */}
              {algoMode === 'RAW' && FACES.map((face, idx) => {
                const points = face.map((vIdx) => `${projected[vIdx].x},${projected[vIdx].y}`).join(' ');
                return (
                  <polygon
                    key={idx}
                    points={points}
                    fill="rgba(6, 182, 212, 0.15)"
                    stroke="#0891b2"
                    strokeWidth="1"
                    className="transition-all duration-75"
                  />
                );
              })}

              {/* SOBEL, HARRIS, VECTOR mode: outline edge connections */}
              {algoMode !== 'RAW' && EDGES.map(([start, end], idx) => {
                const startNode = visibleNodes[start];
                const endNode = visibleNodes[end];

                // Edge is visible only if both vertices are active
                if (!startNode.isVisible || !endNode.isVisible) return null;

                return (
                  <line
                    key={idx}
                    x1={startNode.x}
                    y1={startNode.y}
                    x2={endNode.x}
                    y2={endNode.y}
                    stroke="#06b6d4"
                    strokeWidth="1.2"
                    style={{ filter: 'drop-shadow(0 0 1.5px rgba(6,182,212,0.8))' }}
                    className="transition-all duration-75"
                  />
                );
              })}

              {/* HARRIS Corner Indicators */}
              {algoMode === 'HARRIS' && visibleNodes.map((node, idx) => {
                if (!node.isVisible) return null;
                return (
                  <g key={idx} className="opacity-80">
                    <circle cx={node.x} cy={node.y} r="2.5" fill="none" stroke="#eab308" strokeWidth="0.8" />
                    <line x1={node.x - 4} y1={node.y} x2={node.x + 4} y2={node.y} stroke="#eab308" strokeWidth="0.6" />
                    <line x1={node.x} y1={node.y - 4} x2={node.x} y2={node.y + 4} stroke="#eab308" strokeWidth="0.6" />
                  </g>
                );
              })}

              {/* VECTOR wireframe mapping text annotations */}
              {algoMode === 'VECTOR' && visibleNodes.map((node, idx) => {
                if (!node.isVisible) return null;
                return (
                  <g key={idx}>
                    <circle cx={node.x} cy={node.y} r="2" fill="#06b6d4" />
                    <text
                      x={node.x + 4}
                      y={node.y - 3}
                      fill="#06b6d4"
                      fontSize="4.5"
                      fontFamily="monospace"
                      className="font-bold opacity-75"
                    >
                      {`V${idx}[${Math.round(node.x)},${Math.round(node.y)}]`}
                    </text>
                  </g>
                );
              })}

              {/* Lock-On Node Tracker overlay */}
              {lockedNode !== null && projected[lockedNode] && visibleNodes[lockedNode] && visibleNodes[lockedNode].isVisible && (
                <g className="transition-all duration-75">
                  <circle cx={projected[lockedNode].x} cy={projected[lockedNode].y} r="6.5" fill="none" stroke="#22c55e" strokeWidth="0.8" className="animate-[pulse_1s_infinite]" />
                  <circle cx={projected[lockedNode].x} cy={projected[lockedNode].y} r="1" fill="#22c55e" />
                  {/* Outer cross brackets */}
                  <path
                    d={`M ${projected[lockedNode].x - 9} ${projected[lockedNode].y} L ${projected[lockedNode].x - 6} ${projected[lockedNode].y} 
                       M ${projected[lockedNode].x + 6} ${projected[lockedNode].y} L ${projected[lockedNode].x + 9} ${projected[lockedNode].y}
                       M ${projected[lockedNode].x} ${projected[lockedNode].y - 9} L ${projected[lockedNode].x} ${projected[lockedNode].y - 6}
                       M ${projected[lockedNode].x} ${projected[lockedNode].y + 6} L ${projected[lockedNode].x} ${projected[lockedNode].y + 9}`}
                    stroke="#22c55e"
                    strokeWidth="0.8"
                  />
                  <text
                    x={projected[lockedNode].x + 8}
                    y={projected[lockedNode].y + 9}
                    fill="#22c55e"
                    fontSize="4"
                    fontFamily="monospace"
                    className="font-bold tracking-tighter"
                  >
                    LOCK ACTIVE
                  </text>
                </g>
              )}

              {/* Noise tracking dots for low threshold */}
              {noiseNodes.map((noise) => (
                <g key={noise.id}>
                  <circle cx={noise.x} cy={noise.y} r="1" fill="#ef4444" opacity="0.8" />
                  <line x1={noise.x - 3} y1={noise.y} x2={noise.x + 3} y2={noise.y} stroke="#ef4444" strokeWidth="0.4" opacity="0.6" />
                  <line x1={noise.x} y1={noise.y - 3} x2={noise.x} y2={noise.y + 3} stroke="#ef4444" strokeWidth="0.4" opacity="0.6" />
                </g>
              ))}
            </svg>

            {/* Watermark telemetry overlay */}
            <div className="absolute bottom-1 left-1.5 font-mono text-[5px] text-[#06b6d4]/40 flex flex-col leading-none pointer-events-none">
              <span>SCANNER FPS: 60.00</span>
              <span>LOCK: {lockedNode !== null ? `V${lockedNode}` : 'NONE'}</span>
            </div>

          </div>

          {/* Console LED status indicator */}
          <div className="w-full flex items-center justify-between mt-1 px-0.5 font-mono text-[7px] text-[#06b6d4]/70 pointer-events-none">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse shadow-[0_0_4px_#06b6d4]" />
              <span>ROBO VISION ONLINE</span>
            </div>
            <span>ALG: {algoMode}</span>
          </div>

        </div>
      </div>

      {/* ── Compact Interactive Controls Dashboard ── */}
      <div className="w-[172px] bg-black/40 border border-white/5 rounded-lg p-2 flex flex-col gap-2 font-mono text-[8px] text-zinc-300">

        {/* Vision Algorithm Selector */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">Detection Filter</span>
          <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
            {['RAW', 'SOB', 'HAR', 'VEC'].map((lbl, idx) => {
              const modes = ['RAW', 'SOBEL', 'HARRIS', 'VECTOR'];
              const target = modes[idx];
              return (
                <button
                  key={target}
                  onClick={() => setAlgoMode(target)}
                  className={`flex-1 py-0.5 rounded text-[6.5px] font-bold cursor-pointer transition-colors ${algoMode === target
                    ? 'bg-[#06b6d4] text-white font-black'
                    : 'hover:text-white text-zinc-400'
                    }`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sensitivity/Contrast Threshold Slider */}
        <div className="flex flex-col gap-0.5 border-t border-white/5 pt-1.5">
          <div className="flex justify-between text-[7px]">
            <span className="text-zinc-500 uppercase font-bold">Contrast Sensitivity</span>
            <span className="text-[#06b6d4] font-bold">{sensitivity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#06b6d4] border border-white/10"
          />
          <div className="flex justify-between text-[5px] text-zinc-600 mt-0.5">
            <span>LOW (NOISE)</span>
            <span>HIGH (STRICT)</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Main Era 2000s Entry Node
export default function Vision2000s() {
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
      {view === 'expanded' ? <VisionCRT /> : <VisionPreview />}
    </div>
  );
}
