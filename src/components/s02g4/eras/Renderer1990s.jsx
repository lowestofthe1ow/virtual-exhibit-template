import React, { useState, useEffect, useRef } from 'react';
import { useEraView } from '../EraViewContext.jsx';

// 3D Cube Component
function CSS3DCube({ renderMode, rotX, rotY }) {
  // Shading styles
  const getFaceStyle = (faceName) => {
    const base = "absolute w-12 h-12 border border-[#3b82f6] transition-all duration-300";

    if (renderMode === 'WIRE') {
      return `${base} bg-transparent border-[#3b82f6]/80 shadow-[inset_0_0_8px_rgba(59,130,246,0.3)]`;
    }

    if (renderMode === 'FLAT') {
      const colors = {
        front: 'bg-[#2563eb]',
        back: 'bg-[#1d4ed8]',
        left: 'bg-[#1e40af]',
        right: 'bg-[#1e3a8a]',
        top: 'bg-[#3b82f6]',
        bottom: 'bg-[#172554]'
      };
      return `${base} ${colors[faceName]}`;
    }

    // Textured mode (retro grid pattern)
    return `${base} bg-[#1d4ed8] bg-[repeating-conic-gradient(#1e3a8a_0%_25%,#60a5fa_0%_50%)] bg-[size:8px_8px]`;
  };

  return (
    <div
      className="relative w-12 h-12 transition-transform duration-75"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`
      }}
    >
      {/* 6 Cube Faces */}
      <div className={getFaceStyle('front')} style={{ transform: 'rotateY(0deg) translateZ(24px)' }} />
      <div className={getFaceStyle('back')} style={{ transform: 'rotateY(180deg) translateZ(24px)' }} />
      <div className={getFaceStyle('left')} style={{ transform: 'rotateY(-90deg) translateZ(24px)' }} />
      <div className={getFaceStyle('right')} style={{ transform: 'rotateY(90deg) translateZ(24px)' }} />
      <div className={getFaceStyle('top')} style={{ transform: 'rotateX(90deg) translateZ(24px)' }} />
      <div className={getFaceStyle('bottom')} style={{ transform: 'rotateX(-90deg) translateZ(24px)' }} />
    </div>
  );
}

// 3D Pyramid (Square base) Component
function CSS3DPyramid({ renderMode, rotX, rotY }) {
  const colors = {
    front: 'bg-[#2563eb]',
    back: 'bg-[#1d4ed8]',
    left: 'bg-[#1e40af]',
    right: 'bg-[#1e3a8a]',
    base: 'bg-[#172554]'
  };

  const getFaceStyle = (faceName) => {
    const base = "absolute w-12 h-12 transition-all duration-300";

    if (faceName === 'base') {
      if (renderMode === 'WIRE') {
        return `${base} bg-transparent border border-[#3b82f6]/80 shadow-[inset_0_0_8px_rgba(59,130,246,0.3)]`;
      }
      if (renderMode === 'FLAT') {
        return `${base} ${colors.base}`;
      }
      return `${base} bg-[#1d4ed8] bg-[repeating-conic-gradient(#1e3a8a_0%_25%,#60a5fa_0%_50%)] bg-[size:8px_8px]`;
    }

    // Sides
    const sideBase = `${base} origin-bottom`;
    if (renderMode === 'WIRE') {
      return `${sideBase} bg-transparent`;
    }
    if (renderMode === 'FLAT') {
      return `${sideBase} ${colors[faceName]}`;
    }
    return `${sideBase} bg-[#1d4ed8] bg-[repeating-conic-gradient(#1e3a8a_0%_25%,#60a5fa_0%_50%)] bg-[size:8px_8px]`;
  };

  const renderSideContent = () => {
    if (renderMode === 'WIRE') {
      return (
        <svg className="w-full h-full overflow-visible" viewBox="0 0 48 48">
          <polygon
            points="24,0 0,48 48,48"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.8))' }}
          />
        </svg>
      );
    }
    return null;
  };

  const sideStyle = renderMode === 'WIRE'
    ? {}
    : { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };

  return (
    <div
      className="relative w-12 h-12"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`
      }}
    >
      {/* Base Face */}
      <div className={getFaceStyle('base')} style={{ transform: 'rotateX(90deg) translateZ(-24px)' }} />

      {/* 4 Triangular Sides (angled inward by 30deg to meet at top apex, translated by 24px) */}
      <div className={getFaceStyle('front')} style={{ ...sideStyle, transform: 'translateZ(24px) rotateX(30deg)' }}>
        {renderSideContent()}
      </div>
      <div className={getFaceStyle('back')} style={{ ...sideStyle, transform: 'rotateY(180deg) translateZ(24px) rotateX(30deg)' }}>
        {renderSideContent()}
      </div>
      <div className={getFaceStyle('left')} style={{ ...sideStyle, transform: 'rotateY(-90deg) translateZ(24px) rotateX(30deg)' }}>
        {renderSideContent()}
      </div>
      <div className={getFaceStyle('right')} style={{ ...sideStyle, transform: 'rotateY(90deg) translateZ(24px) rotateX(30deg)' }}>
        {renderSideContent()}
      </div>
    </div>
  );
}

// Preview Component in horizontal timeline
function RendererPreview() {
  const [rot, setRot] = useState(0);

  useEffect(() => {
    const handle = requestAnimationFrame(function animate(t) {
      setRot((t / 20) % 360);
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div
        className="relative w-16 h-16 bg-black/60 border border-[#3b82f6]/30 rounded flex items-center justify-center overflow-hidden select-none"
        style={{ perspective: '300px' }}
      >
        <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.8)_2px,_rgba(0,0,0,0.8)_3px)]" />
        <CSS3DCube renderMode="WIRE" rotX={25} rotY={rot} />
      </div>
    </div>
  );
}

// Expanded GPU Renderer Console inside Modal
function RendererCRT() {
  const [shape, setShape] = useState('CUBE'); // CUBE or PYRAMID
  const [renderMode, setRenderMode] = useState('WIRE'); // WIRE, FLAT, TEXTURE
  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(35);
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });

  // Rotation frame tick
  useEffect(() => {
    if (isDragging) return;
    let handle;
    const animate = () => {
      setRotY((prev) => (prev + 0.8) % 360);
      handle = requestAnimationFrame(animate);
    };
    handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [isDragging]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotX,
      rotY: rotY
    };
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      const sensitivity = 0.8;

      setRotX(Math.max(-80, Math.min(80, dragStart.current.rotX - deltaY * sensitivity)));
      setRotY((dragStart.current.rotY + deltaX * sensitivity) % 360);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center gap-3 p-1">

      {/* ── Retro 3D CRT monitor ── */}
      <div className="relative">
        <div className="relative bg-[#1c1e22] rounded-xl p-2 border-2 border-zinc-700 shadow-lg flex flex-col items-center">

          <div
            className="relative bg-black rounded p-1 border border-[#111] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ width: '140px', height: '140px', perspective: '200px' }}
            onPointerDown={handlePointerDown}
          >
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-15 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.85)_2px,_rgba(0,0,0,0.85)_3px)]" />

            {/* Shapes */}
            {shape === 'CUBE' ? (
              <CSS3DCube renderMode={renderMode} rotX={rotX} rotY={rotY} />
            ) : (
              <CSS3DPyramid renderMode={renderMode} rotX={rotX} rotY={rotY} />
            )}
          </div>

          {/* Console LED status */}
          <div className="w-full flex items-center justify-between mt-1 px-0.5 font-mono text-[7px] text-[#3b82f6]/70">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded bg-[#3b82f6] animate-pulse shadow-[0_0_4px_#3b82f6]" />
              <span>GPU ENGINE ON</span>
            </div>
            <span>MODE: {renderMode}</span>
          </div>
        </div>
      </div>

      {/* ── Dashboard Buttons ── */}
      <div className="w-[172px] bg-black/40 border border-white/5 rounded-lg p-2 flex flex-col gap-2 font-mono text-[8px] text-zinc-300">

        {/* Shape Selector */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">3D Geometry</span>
          <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
            {['CUB', 'PYR'].map((lbl, idx) => {
              const shapes = ['CUBE', 'PYRAMID'];
              const target = shapes[idx];
              return (
                <button
                  key={target}
                  onClick={() => setShape(target)}
                  className={`flex-1 py-0.5 rounded text-[7px] font-bold cursor-pointer transition-colors ${shape === target
                      ? 'bg-[#3b82f6] text-white font-black'
                      : 'hover:text-white text-zinc-400'
                    }`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shading Renderer Mode */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">Render Mode</span>
          <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
            {['WIRE', 'FLAT', 'TEX'].map((lbl, idx) => {
              const modes = ['WIRE', 'FLAT', 'TEXTURE'];
              const target = modes[idx];
              return (
                <button
                  key={target}
                  onClick={() => setRenderMode(target)}
                  className={`flex-1 py-0.5 rounded text-[7px] font-bold cursor-pointer transition-colors ${renderMode === target
                      ? 'bg-[#3b82f6] text-white font-black'
                      : 'hover:text-white text-zinc-400'
                    }`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

// Entry component
export default function Renderer1990s() {
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
      {view === 'expanded' ? <RendererCRT /> : <RendererPreview />}
    </div>
  );
}
