import React, { useState, useEffect, useRef } from 'react';

// Distance helper
const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

// Point-in-polygon helper for shadow occlusion check
function isPointInPolygon(p, polygon) {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > p.y) !== (yj > p.y))
        && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
}

// Normalize angle helper to prevent wrap-around anomalies
function normalizeAngle(angle) {
  while (angle < -Math.PI) angle += 2 * Math.PI;
  while (angle > Math.PI) angle -= 2 * Math.PI;
  return angle;
}

// Normalized vector projection extension to cast infinite shadows
const extendVector = (from, to, length = 300) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return { x: to.x, y: to.y };
  return {
    x: to.x + (dx / dist) * length,
    y: to.y + (dy / dist) * length
  };
};

function VolumetricPreview() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Initialize background drift particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 15 }, () => ({
      x: Math.random() * 150,
      y: Math.random() * 150,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 1.5 + 0.5
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;
      
      // Clear canvas with pitch black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 150, 150);

      // Auto-sweep the spotlight position horizontally
      const lightX = 75 + Math.sin(time * 1.3) * 35;
      const lightY = 20;
      const lightSource = { x: lightX, y: lightY };

      // Set a static down-center angle (90 degrees / Math.PI / 2)
      const alpha = Math.PI / 2;
      const aperture = 0.7; // ~40 degrees

      // Draw volumetric spotlight beam
      ctx.save();
      const beamGrad = ctx.createRadialGradient(
        lightSource.x, lightSource.y, 0,
        lightSource.x, lightSource.y, 140
      );
      beamGrad.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
      beamGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
      beamGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

      ctx.beginPath();
      ctx.moveTo(lightSource.x, lightSource.y);
      ctx.arc(
        lightSource.x, lightSource.y,
        140,
        alpha - aperture / 2,
        alpha + aperture / 2
      );
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      // Stationed Sphere occluder
      const occluder = { x: 75, y: 80 };
      const radius = 11;

      // Cast shadow wedge
      const dx = occluder.x - lightSource.x;
      const dy = occluder.y - lightSource.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ux = -dy / dist;
      const uy = dx / dist;

      // Boundary tangents
      const pLeft = { x: occluder.x + ux * radius, y: occluder.y + uy * radius };
      const pRight = { x: occluder.x - ux * radius, y: occluder.y - uy * radius };

      // Extend shadows off-screen using normalized projections
      const rayLeftEnd = extendVector(lightSource, pLeft, 300);
      const rayRightEnd = extendVector(lightSource, pRight, 300);

      const shadowPoly = [pLeft, rayLeftEnd, rayRightEnd, pRight];

      // Draw occlusion shadow in pitch black
      ctx.beginPath();
      ctx.moveTo(pLeft.x, pLeft.y);
      ctx.lineTo(rayLeftEnd.x, rayLeftEnd.y);
      ctx.lineTo(rayRightEnd.x, rayRightEnd.y);
      ctx.lineTo(pRight.x, pRight.y);
      ctx.closePath();
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Check if occluder center is in spotlight beam angle
      const angleToOccluder = Math.atan2(occluder.y - lightSource.y, occluder.x - lightSource.x);
      const diffOccluderAngle = Math.abs(normalizeAngle(angleToOccluder - alpha));
      const isOccluderIlluminated = diffOccluderAngle <= aperture / 2;

      // Draw occluder
      ctx.save();
      ctx.beginPath();
      ctx.arc(occluder.x, occluder.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#05070a';
      ctx.strokeStyle = isOccluderIlluminated ? '#10b981' : '#344154';
      ctx.lineWidth = 1.2;
      if (isOccluderIlluminated) {
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 4;
      }
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Draw light bulb housing
      ctx.save();
      ctx.beginPath();
      ctx.arc(lightSource.x, lightSource.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = 150;
        if (p.x > 150) p.x = 0;
        if (p.y < 0) p.y = 150;
        if (p.y > 150) p.y = 0;

        const distToLight = Math.sqrt((p.x - lightSource.x) ** 2 + (p.y - lightSource.y) ** 2);
        const angleToLight = Math.atan2(p.y - lightSource.y, p.x - lightSource.x);
        const diffAngle = Math.abs(normalizeAngle(angleToLight - alpha));

        const insideBeam = distToLight < 140 && diffAngle <= aperture / 2;
        const insideShadow = isPointInPolygon(p, shadowPoly);

        // Particle is illuminated only if inside the spotlight cone and not in shadow
        const isIlluminated = insideBeam && !insideShadow;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isIlluminated ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      <div className="relative w-16 h-16 bg-black/60 border border-[#10b981]/30 rounded overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none z-20 opacity-15 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.85)_2px,_rgba(0,0,0,0.85)_3px)]" />
        <canvas
          ref={canvasRef}
          width={150}
          height={150}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function VolumetricConsole() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const dragRef = useRef({ isDragging: false, target: null });

  // Dashboard parameters
  const [density, setDensity] = useState(65);
  const [aperture, setAperture] = useState(45);
  const [lightAngle, setLightAngle] = useState(90); // default: 90 degrees (pointing straight down)
  const [shape, setShape] = useState('CUBE'); // CUBE, SPHERE, TRIANGLE, NONE

  // Draggable positions
  const [lightPos, setLightPos] = useState({ x: 75, y: 22 });
  const [occluderPos, setOccluderPos] = useState({ x: 75, y: 85 });

  // Initialize background drift particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 45 }, () => ({
      x: Math.random() * 150,
      y: Math.random() * 150,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.3 - 0.1,
      size: Math.random() * 1.5 + 0.5
    }));
  }, []);

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const apertureRad = (aperture * Math.PI) / 180;
    const alpha = (lightAngle * Math.PI) / 180;

    const render = () => {
      // Clear with absolute pitch black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 150, 150);

      // Particle update
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = 150;
        if (p.x > 150) p.x = 0;
        if (p.y < 0) p.y = 150;
        if (p.y > 150) p.y = 0;
      });

      // Draw light beam
      const beamGrad = ctx.createRadialGradient(
        lightPos.x, lightPos.y, 0,
        lightPos.x, lightPos.y, 160
      );
      const intensity = density / 100;
      beamGrad.addColorStop(0, `rgba(16, 185, 129, ${intensity * 0.6})`);
      beamGrad.addColorStop(0.5, `rgba(16, 185, 129, ${intensity * 0.25})`);
      beamGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lightPos.x, lightPos.y);
      ctx.arc(
        lightPos.x, lightPos.y,
        160,
        alpha - apertureRad / 2,
        alpha + apertureRad / 2
      );
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      // Cast shadow wedge
      let shadowPoly = [];
      if (shape !== 'NONE') {
        if (shape === 'SPHERE') {
          const radius = 12;
          const dx = occluderPos.x - lightPos.x;
          const dy = occluderPos.y - lightPos.y;
          const len = Math.sqrt(dx * dx + dy * dy);

          if (len > 0) {
            const ux = -dy / len;
            const uy = dx / len;

            const pLeft = { x: occluderPos.x + ux * radius, y: occluderPos.y + uy * radius };
            const pRight = { x: occluderPos.x - ux * radius, y: occluderPos.y - uy * radius };

            const rayLeftEnd = extendVector(lightPos, pLeft, 300);
            const rayRightEnd = extendVector(lightPos, pRight, 300);

            shadowPoly = [pLeft, rayLeftEnd, rayRightEnd, pRight];

            ctx.beginPath();
            ctx.moveTo(pLeft.x, pLeft.y);
            ctx.lineTo(rayLeftEnd.x, rayLeftEnd.y);
            ctx.lineTo(rayRightEnd.x, rayRightEnd.y);
            ctx.lineTo(pRight.x, pRight.y);
            ctx.closePath();
            ctx.fillStyle = '#000000';
            ctx.fill();
          }
        } else {
          // Polygon shadow casting (Triangle or Cube vertices)
          let vertices = [];
          if (shape === 'TRIANGLE') {
            vertices = [
              { x: occluderPos.x, y: occluderPos.y - 12 },
              { x: occluderPos.x - 11, y: occluderPos.y + 10 },
              { x: occluderPos.x + 11, y: occluderPos.y + 10 }
            ];
          } else if (shape === 'CUBE') {
            vertices = [
              { x: occluderPos.x - 10, y: occluderPos.y - 10 },
              { x: occluderPos.x + 10, y: occluderPos.y - 10 },
              { x: occluderPos.x + 10, y: occluderPos.y + 10 },
              { x: occluderPos.x - 10, y: occluderPos.y + 10 }
            ];
          }

          const centerAngle = Math.atan2(occluderPos.y - lightPos.y, occluderPos.x - lightPos.x);
          let minRelAngle = Infinity;
          let maxRelAngle = -Infinity;
          let pLeft = null;
          let pRight = null;

          vertices.forEach((v) => {
            const angle = Math.atan2(v.y - lightPos.y, v.x - lightPos.x);
            const relAngle = normalizeAngle(angle - centerAngle);
            if (relAngle < minRelAngle) {
              minRelAngle = relAngle;
              pLeft = v;
            }
            if (relAngle > maxRelAngle) {
              maxRelAngle = relAngle;
              pRight = v;
            }
          });

          if (pLeft && pRight) {
            const rayLeftEnd = extendVector(lightPos, pLeft, 300);
            const rayRightEnd = extendVector(lightPos, pRight, 300);

            shadowPoly = [pLeft, rayLeftEnd, rayRightEnd, pRight];

            ctx.beginPath();
            ctx.moveTo(pLeft.x, pLeft.y);
            ctx.lineTo(rayLeftEnd.x, rayLeftEnd.y);
            ctx.lineTo(rayRightEnd.x, rayRightEnd.y);
            ctx.lineTo(pRight.x, pRight.y);
            ctx.closePath();
            ctx.fillStyle = '#000000';
            ctx.fill();
          }
        }
      }

      // Check if occluder center is illuminated by the spotlight cone
      let isOccluderIlluminated = false;
      if (shape !== 'NONE') {
        const angleToOccluder = Math.atan2(occluderPos.y - lightPos.y, occluderPos.x - lightPos.x);
        const diffOccluderAngle = Math.abs(normalizeAngle(angleToOccluder - alpha));
        const distToOccluder = distance(lightPos, occluderPos);
        isOccluderIlluminated = distToOccluder < 160 && diffOccluderAngle <= apertureRad / 2;
      }

      // Draw occluder geometry
      if (shape !== 'NONE') {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#05070a';
        ctx.strokeStyle = isOccluderIlluminated ? '#10b981' : '#344154';
        ctx.lineWidth = 1.2;
        if (isOccluderIlluminated) {
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 5;
        }

        if (shape === 'SPHERE') {
          ctx.arc(occluderPos.x, occluderPos.y, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (shape === 'CUBE') {
          ctx.rect(occluderPos.x - 10, occluderPos.y - 10, 20, 20);
          ctx.fill();
          ctx.stroke();
        } else if (shape === 'TRIANGLE') {
          ctx.moveTo(occluderPos.x, occluderPos.y - 12);
          ctx.lineTo(occluderPos.x - 11, occluderPos.y + 10);
          ctx.lineTo(occluderPos.x + 11, occluderPos.y + 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw light bulb source
      ctx.save();
      ctx.beginPath();
      ctx.arc(lightPos.x, lightPos.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Render drifting particles
      particlesRef.current.forEach((p) => {
        const distToLight = Math.sqrt((p.x - lightPos.x) ** 2 + (p.y - lightPos.y) ** 2);
        const angleToLight = Math.atan2(p.y - lightPos.y, p.x - lightPos.x);
        const diffAngle = Math.abs(normalizeAngle(angleToLight - alpha));

        const insideBeam = distToLight < 160 && diffAngle <= apertureRad / 2;
        const insideShadow = shape !== 'NONE' && isPointInPolygon(p, shadowPoly);
        const isIlluminated = insideBeam && !insideShadow;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Non-illuminated particles inside shadow are completely hidden (opacity 0) 
        // to ensure the shadow region is completely black, and faint when in the outer dark.
        ctx.fillStyle = isIlluminated 
          ? `rgba(16, 185, 129, ${0.4 + (density / 100) * 0.5})` 
          : insideShadow 
            ? 'rgba(0, 0, 0, 0)' 
            : 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
      });

      // Draw dashed drag helper rings to clarify dragging interaction
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 2]);

      // Light drag ring
      ctx.beginPath();
      ctx.arc(lightPos.x, lightPos.y, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Occluder drag ring
      if (shape !== 'NONE') {
        ctx.beginPath();
        ctx.arc(occluderPos.x, occluderPos.y, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [lightPos, occluderPos, density, aperture, lightAngle, shape]);

  // Handle pointer down events
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 150;
    const clickY = ((e.clientY - rect.top) / rect.height) * 150;

    const clickedPoint = { x: clickX, y: clickY };

    const distToLight = distance(clickedPoint, lightPos);
    const distToOccluder = distance(clickedPoint, occluderPos);

    if (distToLight < 16) {
      dragRef.current = { isDragging: true, target: 'light' };
    } else if (shape !== 'NONE' && distToOccluder < 20) {
      dragRef.current = { isDragging: true, target: 'occluder' };
    }
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!dragRef.current.isDragging) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 150;
      const clickY = ((e.clientY - rect.top) / rect.height) * 150;

      // Clamp drag targets inside logical viewport
      const clampedX = Math.max(10, Math.min(140, clickX));
      const clampedY = Math.max(10, Math.min(140, clickY));

      if (dragRef.current.target === 'light') {
        setLightPos({ x: clampedX, y: clampedY });
      } else if (dragRef.current.target === 'occluder') {
        setOccluderPos({ x: clampedX, y: clampedY });
      }
    };

    const handlePointerUp = () => {
      dragRef.current = { isDragging: false, target: null };
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 p-1">

      {/* ── Volumetric Simulator Console Bezel ── */}
      <div className="relative">
        <div className="relative bg-[#151a22] rounded-xl p-2 border-2 border-slate-700 shadow-lg flex flex-col items-center">
          
          {/* Main Bezel Monitor screen */}
          <div
            className="relative bg-black rounded p-1 border border-[#090d14] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ width: '140px', height: '140px' }}
            onPointerDown={handlePointerDown}
          >
            {/* Scanline CRT overlay */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-15 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.85)_2px,_rgba(0,0,0,0.85)_3px)]" />
            
            <canvas
              ref={canvasRef}
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />

            {/* Scale coordinates/telemetry */}
            <div className="absolute bottom-1 left-1.5 font-mono text-[5px] text-[#10b981]/50 flex flex-col leading-none pointer-events-none">
              <span>RAY DEPTH: MARCHING</span>
              <span>L_POS: [{Math.round(lightPos.x)}, {Math.round(lightPos.y)}]</span>
              <span>O_POS: {shape !== 'NONE' ? `[${Math.round(occluderPos.x)}, ${Math.round(occluderPos.y)}]` : 'DISB'}</span>
            </div>

            {/* HUD mode indicators */}
            <div className="absolute top-1 right-1.5 font-mono text-[5px] text-[#10b981]/60 flex items-center gap-1 pointer-events-none">
              <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
              <span>ANGLE: {lightAngle}°</span>
            </div>

          </div>

          {/* Console LED Status bar */}
          <div className="w-full flex items-center justify-between mt-1 px-0.5 font-mono text-[7px] text-[#10b981]/80 pointer-events-none">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded bg-[#10b981] animate-pulse shadow-[0_0_4px_#10b981]" />
              <span>VOLUMETRIC SHADER READY</span>
            </div>
            <span>HD: NATIVE</span>
          </div>

        </div>
      </div>

      {/* ── Dashboard Parameters Panel ── */}
      <div className="w-[172px] bg-black/40 border border-white/5 rounded-lg p-2 flex flex-col gap-2 font-mono text-[8px] text-zinc-300">
        
        {/* Occluder Shapes Selector */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">Atmospheric Obstacle</span>
          <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
            {['CUBE', 'SPHERE', 'TRIANGLE', 'NONE'].map((opt) => (
              <button
                key={opt}
                onClick={() => setShape(opt)}
                className={`flex-1 py-0.5 rounded text-[6px] font-bold cursor-pointer transition-colors ${shape === opt
                  ? 'bg-[#10b981] text-white font-black'
                  : 'hover:text-white text-zinc-400'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sliders */}
        <div className="flex flex-col gap-1.5 border-t border-white/5 pt-1.5">
          {/* Fog Density */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[7px]">
              <span className="text-zinc-500 uppercase font-bold">Fog Density</span>
              <span className="text-[#10b981] font-bold">{density}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={density}
              onChange={(e) => setDensity(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#10b981] border border-white/10"
            />
          </div>

          {/* Spotlight Pointing Direction (Light Angle) */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[7px]">
              <span className="text-zinc-500 uppercase font-bold">Light Angle (Rotation)</span>
              <span className="text-[#10b981] font-bold">{lightAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={lightAngle}
              onChange={(e) => setLightAngle(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#10b981] border border-white/10"
            />
          </div>

          {/* Aperture (Beam Spread) */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[7px]">
              <span className="text-zinc-500 uppercase font-bold">Beam Aperture</span>
              <span className="text-[#10b981] font-bold">{aperture}°</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={aperture}
              onChange={(e) => setAperture(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#10b981] border border-white/10"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Volumetric2010s() {
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
      {view === 'expanded' ? <VolumetricConsole /> : <VolumetricPreview />}
    </div>
  );
}
