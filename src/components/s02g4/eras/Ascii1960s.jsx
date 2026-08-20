import React, { useState, useEffect, useRef } from 'react';

const ASCII_SCENES = [
  {
    label: 'Smiley',
    name: 'HAPPY',
    art: `   _______
  /       \\
 | (o) (o) |
 |    ^    |
 |  \\___/  |
  \\_______/`,
  },
  {
    label: 'Sad',
    name: 'SAD',
    art: `   _______
  /       \\
 | (o) (o) |
 |    ^    |
 |  /---\\  |
  \\_______/`,
  },
  {
    label: 'Angry',
    name: 'ANGRY',
    art: `   _______
  /       \\
 | \\o/ \\o/ |
 |    ^    |
 | [____]  |
  \\_______/`,
  },
  {
    label: 'Shocked',
    name: 'SHOCK',
    art: `   _______
  /       \\
 | (O) (O) |
 |    ^    |
 |   (o)   |
  \\_______/`,
  },
];

// Simple preview shown inside the planet node
function AsciiPreview() {
  return (
    <pre
      className="text-[#22c55e] font-mono text-xs leading-[10px] font-bold tracking-tighter mix-blend-screen select-none"
      style={{ textShadow: '0 0 6px #22c55e' }}
    >
      {ASCII_SCENES[0].art}
    </pre>
  );
}

// Full CRT TV shown inside the expanded modal
function AsciiCRT() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  const handleSwitch = (i) => {
    if (i === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(i);

    setTimeout(() => {
      setDisplayIndex(i);
    }, 150);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ── CRT Television Frame ── */}
      <div className="relative">
        {/* Outer casing */}
        <div
          className="relative bg-[#1a1a1a] rounded-xl p-[6px] border border-[#333]"
          style={{
            boxShadow:
              'inset 0 2px 4px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.6)',
          }}
        >
          {/* Inner bezel */}
          <div className="bg-[#0a0a0a] rounded-lg p-[4px] border border-[#222]">
            {/* CRT Screen */}
            <div
              className="relative overflow-hidden rounded-md"
              style={{
                width: '140px',
                height: '100px',
                background: '#020802',
                boxShadow:
                  'inset 0 0 30px rgba(0,0,0,0.9), inset 0 0 6px rgba(34,197,94,0.15)',
              }}
            >
              {/* Scanlines overlay */}
              <div
                className="absolute inset-0 z-20 pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 3px)',
                }}
              />

              {/* Screen glare */}
              <div
                className="absolute inset-0 z-20 pointer-events-none opacity-20"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)',
                }}
              />

              {/* CRT flicker / static transition overlay */}
              <div
                className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-100"
                style={{
                  opacity: isTransitioning ? 1 : 0,
                  background:
                    'repeating-linear-gradient(0deg, rgba(34,197,94,0.15) 0px, transparent 2px, transparent 4px)',
                  mixBlendMode: 'screen',
                }}
              />

              {/* White flash on channel switch */}
              <div
                className="absolute inset-0 z-30 pointer-events-none transition-opacity"
                style={{
                  opacity: isTransitioning ? 0.6 : 0,
                  background: 'white',
                  transitionDuration: isTransitioning ? '40ms' : '250ms',
                }}
              />

              {/* ASCII Art Content */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <pre
                  className="text-[#22c55e] font-mono font-bold tracking-tighter mix-blend-screen select-none transition-opacity duration-200"
                  style={{
                    fontSize: '7px',
                    lineHeight: '8px',
                    textShadow: '0 0 4px #22c55e, 0 0 8px rgba(34,197,94,0.3)',
                    opacity: isTransitioning ? 0 : 1,
                  }}
                >
                  {ASCII_SCENES[displayIndex].art}
                </pre>
              </div>

              {/* Phosphor edge vignette */}
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-md"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.95)',
                }}
              />
            </div>
          </div>

          {/* Power LED */}
          <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"
              style={{ boxShadow: '0 0 4px #22c55e' }}
            />
          </div>
        </div>

        {/* CRT Stand */}
        <div className="mx-auto w-10 h-2 bg-[#1a1a1a] border-x border-b border-[#333] rounded-b-sm" />
        <div className="mx-auto w-16 h-1 bg-[#1a1a1a] border-x border-b border-[#333] rounded-b-md" />
      </div>

      {/* ── Scene Selector Buttons ── */}
      <div className="flex gap-1.5">
        {ASCII_SCENES.map((scene, i) => (
          <button
            key={scene.name}
            onClick={(e) => {
              e.stopPropagation();
              handleSwitch(i);
            }}
            className={`
              w-9 h-6 rounded text-[8px] font-mono font-bold tracking-tight cursor-pointer
              border transition-all duration-200
              flex items-center justify-center
              ${activeIndex === i
                ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                : 'bg-black/40 border-[#22c55e]/30 text-[#22c55e]/60 hover:border-[#22c55e]/60 hover:text-[#22c55e]/90'
              }
            `}
            title={scene.name}
          >
            {scene.label}
          </button>
        ))}
      </div>

      {/* Active Scene Label */}
      <span className="text-[8px] font-mono tracking-[0.3em] text-[#22c55e]/50 uppercase -mt-3">
        CH: {ASCII_SCENES[activeIndex].name}
      </span>
    </div>
  );
}

// Main component — walks up the DOM to find data-era-view attribute set by EraCard
export default function Ascii1960s() {
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
      {view === 'expanded' ? <AsciiCRT /> : <AsciiPreview />}
    </div>
  );
}
