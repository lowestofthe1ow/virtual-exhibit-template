import React, { useState, useEffect, useRef } from 'react';
import { useEraView } from '../EraViewContext.jsx';

// 16x16 Sprites with 2 frames of animation (values: 0 = transparent, 1 = primary, 2 = secondary, 3 = tertiary)
const SPRITES = {
  INVADER: {
    frame1: [
      [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,2,2,1,1,1,1,2,2,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0],
      [0,1,1,0,1,1,0,0,0,0,1,1,0,1,1,0],
      [0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,1,2,2,1,1,1,0,0,0,0],
      [0,0,0,1,1,3,3,1,1,3,3,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
      [0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
      [0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    frame2: [
      [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,1,0,0,1,1,0,0,0,0,1,1,0,0,1,0],
      [0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0],
      [0,1,1,1,2,2,1,1,1,1,2,2,1,1,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0],
      [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
      [0,1,1,0,0,0,0,2,2,0,0,0,0,1,1,0],
      [0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,3,3,3,3,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],
      [0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
      [0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },
  GHOST: {
    frame1: [
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,2,2,1,1,1,1,2,2,1,1,1,1,0],
      [1,1,2,3,3,2,1,1,2,3,3,2,1,1,1,1],
      [1,1,2,3,3,2,1,1,2,3,3,2,1,1,1,1],
      [1,1,1,2,2,1,1,1,1,2,2,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0],
      [0,1,1,0,0,0,1,1,1,1,0,0,0,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    frame2: [
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,2,2,1,1,1,1,2,2,1,1,1,1,0],
      [1,1,2,3,3,2,1,1,2,3,3,2,1,1,1,1],
      [1,1,2,3,3,2,1,1,2,3,3,2,1,1,1,1],
      [1,1,1,2,2,1,1,1,1,2,2,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1],
      [1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },
  HEART: {
    frame1: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0],
      [0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0],
      [1,1,1,3,3,1,1,0,0,1,1,1,1,1,1,1],
      [1,1,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
      [1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,2,2,2,2,1,1,1,1,1,0],
      [0,0,1,1,1,1,2,2,2,2,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,2,2,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    frame2: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],
      [0,1,1,3,1,1,1,0,0,1,1,1,1,1,1,0],
      [0,1,3,3,3,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,3,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,2,2,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,2,2,2,2,1,1,1,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  }
};

// Unique background + palette designs for each character type
const SPRITE_DESIGNS = {
  INVADER: {
    bg: '#0a1005', // Matrix dark green
    palette: {
      0: 'transparent',
      1: '#22c55e', // Neon Green (Main body)
      2: '#eab308', // Retro Yellow (Eyes/Accents)
      3: '#15803d'  // Dark Forest Green (Underlayers)
    }
  },
  GHOST: {
    bg: '#170b0b', // Red-tinted black
    palette: {
      0: 'transparent',
      1: '#ef4444', // Pac-man Red (Main body)
      2: '#ffffff', // Eye whites
      3: '#3b82f6'  // Blue pupils
    }
  },
  HEART: {
    bg: '#1a0515', // Purple-tinted black
    palette: {
      0: 'transparent',
      1: '#ec4899', // Hot Pink (Body outline)
      2: '#f43f5e', // Rose Red (Interior fill)
      3: '#ffffff'  // White specular highlight
    }
  }
};

// Preview component showing basic alien frames loop in its custom green design
function SpritePreview() {
  const [frame, setFrame] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => !f);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  const activeGrid = frame ? SPRITES.INVADER.frame1 : SPRITES.INVADER.frame2;
  const design = SPRITE_DESIGNS.INVADER;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div 
        className="relative w-16 h-16 border border-[#f59e0b]/30 rounded overflow-hidden flex flex-col justify-between p-0.5 select-none transition-colors duration-300"
        style={{ backgroundColor: design.bg }}
      >
        <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.8)_2px,_rgba(0,0,0,0.8)_3px)]" />
        <div className="w-full h-full flex flex-col justify-between">
          {activeGrid.map((row, y) => (
            <div key={y} className="flex justify-between w-full h-[5%]">
              {row.map((pixel, x) => (
                <div
                  key={x}
                  className="flex-1 mx-[0.2px]"
                  style={{
                    backgroundColor: design.palette[pixel] || 'transparent',
                    opacity: pixel ? 0.95 : 0
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Expanded Interactive Retro Console inside the Modal (compact for scale-150 wrapper)
function SpriteCRT() {
  const [spriteName, setSpriteName] = useState('INVADER');
  const [frameToggle, setFrameToggle] = useState(true);

  // Constant loop animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameToggle((t) => !t);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  const design = SPRITE_DESIGNS[spriteName];
  const activeGrid = frameToggle ? SPRITES[spriteName].frame1 : SPRITES[spriteName].frame2;

  const getPixelColor = (colorIndex) => {
    return design.palette[colorIndex] || 'transparent';
  };

  return (
    <div className="flex flex-col items-center gap-3 p-1">
      
      {/* ── Retro Console CRT Monitor ── */}
      <div className="relative">
        <div 
          className="relative rounded-xl p-2 border-2 border-zinc-700 shadow-lg flex flex-col items-center transition-all duration-300"
          style={{ backgroundColor: design.bg }}
        >
          {/* Bezel details */}
          <div className="relative bg-black rounded p-1 border border-[#222] overflow-hidden" style={{ width: '140px', height: '140px' }}>
            {/* Horizontal scanlines */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_1.5px,_rgba(0,0,0,0.85)_2px,_rgba(0,0,0,0.85)_3px)]" />

            {/* Core 16x16 pixel grid */}
            <div className="w-full h-full flex flex-col justify-between select-none">
              {activeGrid.map((row, y) => (
                <div key={y} className="flex justify-between w-full h-[5%]">
                  {row.map((pixel, x) => (
                    <div
                      key={x}
                      className="flex-1 mx-[0.1px] transition-colors duration-75"
                      style={{
                        backgroundColor: getPixelColor(pixel),
                        opacity: pixel ? 0.95 : 0.03
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Console Buttons Dashboard (Extremely Clean) ── */}
      <div className="w-[172px] bg-black/40 border border-white/5 rounded-lg p-2 flex flex-col gap-1.5 font-mono text-[8px] text-zinc-300">
        
        {/* Sprite Type Selection */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">Sprite Type</span>
          <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
            {['INV', 'GHS', 'HRT'].map((lbl, idx) => {
              const types = ['INVADER', 'GHOST', 'HEART'];
              const target = types[idx];
              return (
                <button
                  key={target}
                  onClick={() => setSpriteName(target)}
                  className={`flex-1 py-0.5 rounded text-[7px] font-bold cursor-pointer transition-colors ${
                    spriteName === target 
                      ? 'bg-[#f59e0b] text-black font-black' 
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

// Main 1980s entry node
export default function Sprite1980s() {
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
      {view === 'expanded' ? <SpriteCRT /> : <SpritePreview />}
    </div>
  );
}
