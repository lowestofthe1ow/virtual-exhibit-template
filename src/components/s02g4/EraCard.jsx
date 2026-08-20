import React, { useState } from 'react';

export default function EraCard({ 
  stage, 
  era, 
  title, 
  description, 
  renderType, 
  color, 
  children
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = React.useRef(null);
  const stageNum = parseInt(stage, 10);
  const floatDelay = `${stageNum * 0.7}s`;
  const isUp = stageNum % 2 !== 0;
  
  // Increase offset to spread them out vertically more
  const yOffset = isUp ? '-translate-y-40' : 'translate-y-40';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;

    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
        cardRef.current.style.transition = 'transform 0.1s ease-out';
      }
    });
  };

  const handleMouseLeave = () => {
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        cardRef.current.style.transition = 'transform 0.5s ease-out';
      }
    });
  };

  return (
    <>
      <div 
        className={`era-container snap-center animate-float ${yOffset} relative flex flex-col items-center justify-center`}
        style={{ animationDelay: floatDelay }}
        data-era-color={color}
      >
        {/* Data attribute for footer era tracking */}
        <span data-era-name={`Exhibit ${stage} — ${era}`} className="hidden"></span>

        {/* Exhibit Tether Line */}
        <svg className={`absolute left-1/2 -translate-x-1/2 w-32 opacity-60 z-0 pointer-events-none ${isUp ? 'top-1/2 h-[calc(50vh)]' : 'bottom-1/2 h-[calc(50vh)]'}`} 
             style={{ [isUp ? 'transform' : 'transform']: isUp ? '' : 'scaleY(-1)' }} 
             viewBox="0 0 100 200" preserveAspectRatio="none">
           <path d="M50,0 C50,100 50,100 50,200" stroke={`url(#gradient-line-${stage})`} strokeWidth="3" fill="none" className="transition-all duration-1000"/>
           <defs>
             <linearGradient id={`gradient-line-${stage}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="100%" stopColor={color} stopOpacity="1" />
             </linearGradient>
           </defs>
        </svg>
        
        {/* Anchor point on the timeline axis */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 w-8 h-2 rounded-full z-0 opacity-80 ${isUp ? 'top-[calc(50vh)]' : 'bottom-[calc(50vh)]'}`}
          style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }}
        ></div>

        {/* The Planet Node */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsExpanded(true)}
          className="w-32 h-32 md:w-56 md:h-56 rounded-full flex items-center justify-center relative group cursor-pointer z-10 will-change-transform"
        >
          {/* Orbit Ring */}
          <div 
            className="absolute inset-[-12px] md:inset-[-16px] rounded-full border border-dashed opacity-0 group-hover:opacity-40 transition-opacity duration-700 animate-orbit pointer-events-none"
            style={{ borderColor: color }}
          ></div>

          {/* Second orbit ring (offset) */}
          <div 
            className="absolute inset-[-20px] md:inset-[-28px] rounded-full border border-dotted opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
            style={{ 
              borderColor: color,
              animation: 'orbit 20s linear infinite reverse'
            }}
          ></div>

          {/* Glowing Atmosphere */}
          <div 
            className="absolute inset-0 rounded-full opacity-40 blur-xl group-hover:opacity-80 transition-opacity duration-500 will-change-[opacity]" 
            style={{ backgroundColor: color }}
          ></div>
          
          {/* Core Planet Surface */}
          <div className="relative z-10 w-full h-full rounded-full border-4 border-white/10 bg-[#0A0D14] flex items-center justify-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] group-hover:border-white/30 transition-colors duration-500">
            {/* Increased graphic scale inside the planet */}
            <div data-era-view="preview" className="scale-[0.8] md:scale-100 pointer-events-none transition-transform duration-500 group-hover:scale-[1.2]">
              {children}
            </div>
          </div>

          {/* Hover Explore Hint */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-10 pointer-events-none whitespace-nowrap">
            <span className="museum-label text-[8px] px-3 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm" style={{ color: color }}>
              Click to Explore →
            </span>
          </div>
        </div>


        {/* Museum Plaque Label */}
        <div 
          onClick={() => setIsExpanded(true)}
          className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-50 cursor-pointer flex flex-col items-center hover:scale-105 transition-transform duration-300
            ${isUp ? 'top-[calc(50%+11.5rem)]' : 'bottom-[calc(50%+11.5rem)]'}`}
        >
          <div className="exhibit-plaque flex flex-col items-center gap-1.5">
            <span 
              className="museum-label text-[9px]"
              style={{ color: `${color}99` }}
            >
              Exhibit {stage}
            </span>
            <span 
              className="text-lg font-display font-bold tracking-widest text-white"
            >
              {era}
            </span>
            <div 
              className="w-8 h-[1px] mt-0.5"
              style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
            ></div>
          </div>
        </div>
      </div>

      {/* The Expanded Modal (Museum Readable View) */}
      {isExpanded && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 animate-[fadeIn_0.3s_ease-out]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-lg cursor-pointer"
            onClick={() => setIsExpanded(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl bg-[#0B0F19] border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Exhibit Header Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-md border-b border-white/5">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full animate-breathe" 
                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                ></div>
                <span className="museum-label text-[10px]" style={{ color }}>Exhibit {stage} — {era}</span>
                <div className="w-[1px] h-3 bg-white/10"></div>
                <span className="museum-label text-[10px] text-zinc-600">{renderType}</span>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Left Graphic Area */}
            <div className="w-full md:w-1/2 bg-[#05070A] p-12 pt-16 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-20 blur-3xl" style={{ backgroundColor: color }}></div>
              {/* Decorative accent line */}
              <div className="hidden md:block absolute top-16 bottom-8 right-0 w-[1px]" style={{ background: `linear-gradient(to bottom, transparent, ${color}40, transparent)` }}></div>
              <div data-era-view="expanded" className="relative z-10 transform scale-150">
                {children}
              </div>
            </div>

            {/* Right Text Area */}
            <div className="w-full md:w-1/2 p-12 pt-16 flex flex-col justify-center relative">
              <h2 className="text-3xl md:text-4xl text-white font-display font-bold mb-6 leading-tight tracking-tight">
                {title}
              </h2>
              
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light mb-8">
                {description}
              </p>

              <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="museum-label text-[10px] text-zinc-500">
                    Render Type: <span className="text-white">{renderType}</span>
                  </span>
                </div>
                <span className="museum-label text-[10px] text-zinc-600">
                  Stage {stage}/07
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
