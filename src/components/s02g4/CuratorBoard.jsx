import React, { useEffect, useRef } from 'react';

export default function CuratorBoard({ onExpand }) {
  const textRef = useRef(null);
  const fullText = "SYSTEM INITIALIZED.\nWELCOME TO THE LIVING TERMINAL.\n\nEXPLORE THE EVOLUTION OF\nCOMPUTATIONAL VISION.\n\n> SCROLL TO NAVIGATE_";

  // Typing effect for the small card using ref for performance (prevents React re-renders which cause 3D lag)
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (textRef.current) {
        textRef.current.textContent = fullText.substring(0, index);
      }
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* The Physical Retro Terminal Computer (Unexpanded) */}
      <div 
        className="snap-center relative flex flex-col items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-110 -translate-y-8"
        onClick={onExpand}
      >
        {/* Terminal Case (Dark Cyberpunk/Subtle) - Increased size for better aesthetics */}
        <div className="relative w-64 h-52 bg-[#050505]/80 backdrop-blur-md rounded-xl border border-white/5 shadow-[0_0_30px_rgba(57,255,20,0.1)] p-3 flex flex-col items-center z-10 group-hover:border-[#39FF14]/40 transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(57,255,20,0.3)]">
          
          {/* Power LED */}
          <div className="absolute bottom-3 left-4 w-2 h-2 bg-[#39FF14] rounded-full shadow-[0_0_8px_#39FF14] animate-pulse"></div>

          {/* CRT Bezel */}
          <div className="w-full h-full bg-[#0a0c10] rounded-lg border border-white/5 p-1.5 flex items-center justify-center overflow-hidden">
            
            {/* Actual Screen Area */}
            <div className="relative w-full h-full bg-[#020502] rounded shadow-[inset_0_0_40px_rgba(0,0,0,1)] overflow-hidden p-4 border border-[#39FF14]/10">
              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-40" style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 1px, rgba(0,0,0,0.9) 2px)'
              }}></div>
              {/* Glare */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent z-10 pointer-events-none opacity-50"></div>
              
              {/* Terminal Text - Added whitespace-pre-wrap for correct line breaks */}
              <div className="relative z-0 font-mono text-[#39FF14] text-[9px] leading-[1.6] opacity-90 whitespace-pre-wrap text-left w-full h-full">
                <span className="block text-[#39FF14]/50 mb-2 border-b border-[#39FF14]/20 pb-1">INIT_SEQUENCE</span>
                <span ref={textRef}></span>
                <span className="animate-pulse bg-[#39FF14] w-1.5 h-2.5 inline-block ml-0.5 align-middle"></span>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Stand (Cyberpunk Tether) */}
        <div className="relative w-16 h-5 bg-gradient-to-b from-black/80 to-transparent border-l border-r border-white/5 z-0"></div>
        <div className="relative w-32 h-1.5 bg-[#39FF14]/20 rounded-full blur-[2px] z-0"></div>
        
        {/* Connection to Timeline */}
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#39FF14]/40 to-transparent mt-1"></div>
        <div className="absolute bottom-[-5rem] w-6 h-1.5 rounded-full bg-[#39FF14]/60 shadow-[0_0_15px_#39FF14]"></div>
        
        {/* Hover Hint */}
        <div className="absolute -top-12 bg-black/90 text-[#39FF14] font-mono text-[10px] px-4 py-2 rounded border border-[#39FF14]/30 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest backdrop-blur-md shadow-[0_0_10px_rgba(57,255,20,0.2)]">
          ACCESS_TERMINAL
        </div>
      </div>
    </>
  );
}
