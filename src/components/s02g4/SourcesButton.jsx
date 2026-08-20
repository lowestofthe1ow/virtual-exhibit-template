import React, { useState } from 'react';

export default function SourcesButton() {
  const [isOpen, setIsOpen] = useState(false);

  const sources = [
    {
      id: "01",
      stage: "01",
      eraName: "1960s",
      eraTitle: "Keyboard ASCII Character Art",
      color: "#22c55e",
      author: "Sutherland, I. E. (1963)",
      title: "Sketchpad: A Man-Machine Graphical Communication System",
      publication: "Proceedings of the AFIPS Spring Joint Computer Conference, Vol. 23, 329–346",
      doiUrl: "https://dl.acm.org/doi/10.1145/1461551.1461591"
    },
    {
      id: "01b",
      stage: "01",
      eraName: "1960s",
      eraTitle: "Keyboard ASCII Character Art",
      color: "#22c55e",
      author: "Bueno, J. S. de O. (2023)",
      title: "Pixels Beyond Colors: Exploring Attributes and Representations of Text-Art Images",
      publication: "Anais do XX Congresso Latino-Americano de Software Livre e Tecnologias Abertas (Latinoware 2023), 75–82",
      doiUrl: "https://doi.org/10.5753/latinoware.2023.236505"
    },
    {
      id: "02",
      stage: "02",
      eraName: "1970s",
      eraTitle: "Early Bitmaps & Rasterization",
      color: "#ef4444",
      author: "Phong, B. T. (1975)",
      title: "Illumination for Computer Generated Pictures",
      publication: "Communications of the ACM, 18(6), 311–317",
      doiUrl: "https://dl.acm.org/doi/10.1145/360825.360839"
    },
    {
      id: "02b",
      stage: "02",
      eraName: "1970s",
      eraTitle: "Early Bitmaps & Rasterization",
      color: "#ef4444",
      author: "Novedge (2025)",
      title: "Design Software History: Evolution of Vector and Raster Graphics",
      publication: "NOVEDGE Blog",
      doiUrl: "https://novedge.com/blogs/design-news/design-software-history-evolution-of-vector-and-raster-graphics-in-design-software-history-a-journey-through-technology-and-creative-process-transformation"
    },
    {
      id: "03",
      stage: "03",
      eraName: "1980s",
      eraTitle: "Sprites, Arcades & 3D Workstations",
      color: "#f59e0b",
      author: "Baum, D. (1998)",
      title: "3D Graphics Hardware",
      publication: "ACM SIGGRAPH Computer Graphics, 32(1), 65–66",
      doiUrl: "https://doi.org/10.1145/279389.279478"
    },
    {
      id: "04",
      stage: "04",
      eraName: "1990s",
      eraTitle: "The GPU & Real-Time 3D",
      color: "#3b82f6",
      author: "Blythe, D. (2008)",
      title: "Rise of the Graphics Processor",
      publication: "Proceedings of the IEEE, 96(5), 761–778",
      doiUrl: "https://doi.org/10.1109/JPROC.2008.917718"
    },
    {
      id: "04b",
      stage: "04",
      eraName: "1990s",
      eraTitle: "The GPU & Real-Time 3D",
      color: "#3b82f6",
      author: "Sanglard, F. (2012)",
      title: "Quake Source Code Review",
      publication: "Fabien Sanglard's Website — Technical Analysis",
      doiUrl: "https://fabiensanglard.net/quakeSource/"
    },
    {
      id: "05",
      stage: "05",
      eraName: "2000s",
      eraTitle: "Programmable Shaders & Normal Mapping",
      color: "#06b6d4",
      author: "Habel, R., & Wimmer, M. (2010)",
      title: "Efficient Irradiance Normal Mapping",
      publication: "Proceedings of the 2010 ACM SIGGRAPH Symposium on Interactive 3D Graphics and Games, 189–195",
      doiUrl: "https://doi.org/10.1145/1730804.1730835"
    },
    {
      id: "06",
      stage: "06",
      eraName: "2010s",
      eraTitle: "PBR, Volumetric Lighting & VR",
      color: "#10b981",
      author: "Xu, C., Cheng, H., et al. (2025)",
      title: "Interactive Realistic Volume Rendering with Dynamic Illumination",
      publication: "IEEE Transactions on Visualization and Computer Graphics, 31(9), 5288",
      doiUrl: "https://doi.org/10.1109/TVCG.2024.3445339"
    },
    {
      id: "06b",
      stage: "06",
      eraName: "2010s",
      eraTitle: "PBR, Volumetric Lighting & VR",
      color: "#10b981",
      author: "Karis, B. & Epic Games (2013)",
      title: "Real Shading in Unreal Engine 4",
      publication: "SIGGRAPH 2013 Physically Based Shading Course",
      doiUrl: "https://blog.selfshadow.com/publications/s2013-shading-course/"
    },
    {
      id: "07",
      stage: "07",
      eraName: "2020s",
      eraTitle: "Flawless Photorealism & Neural Graphics",
      color: "#a855f7",
      author: "Mildenhall, B., Srinivasan, P. P., et al. (2020)",
      title: "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis",
      publication: "ECCV 2020 — European Conference on Computer Vision",
      doiUrl: "https://arxiv.org/abs/2003.08934"
    },
    {
      id: "07b",
      stage: "07",
      eraName: "2020s",
      eraTitle: "Flawless Photorealism & Neural Graphics",
      color: "#a855f7",
      author: "Liu, L., Chang, W., et al. (2021)",
      title: "Intersection Prediction for Accelerated GPU Ray Tracing",
      publication: "MICRO-54: 54th Annual IEEE/ACM International Symposium on Microarchitecture, 709–723",
      doiUrl: "https://doi.org/10.1145/3466752.3480097"
    }
  ];

  return (
    <>
      {/* Floating Action Button at bottom center */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[100] group">
        {/* Hover label */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-black/90 border border-[#39FF14]/30 text-[#39FF14] text-[9px] font-mono tracking-[0.2em] px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(57,255,20,0.15)] uppercase">
          BIBLIOGRAPHY.SYS
        </div>
        
        {/* Simple Icon Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-black/70 border border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14] hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] cursor-pointer"
          aria-label="View bibliography sources"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </button>
      </div>

      {/* Retro Cyberpunk Sources Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.2s_ease-out]">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* CRT Terminal Style Modal Container */}
          <div className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-[#020802] border border-[#39FF14]/40 rounded-lg shadow-[0_0_80px_rgba(57,255,20,0.2)] flex flex-col overflow-hidden animate-[scaleUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.275)]">
            {/* Holographic grid scanline overlays */}
            <div className="absolute inset-0 pointer-events-none z-20" style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0, 0, 0, 0.4) 3px)'
            }}></div>
            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.95)]"></div>

            {/* Header bar */}
            <div className="w-full bg-[#39FF14]/10 border-b border-[#39FF14]/20 px-5 py-4 flex justify-between items-center z-30 font-mono text-[#39FF14] text-xs tracking-wider select-none">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-[#39FF14] rounded-sm animate-pulse shadow-[0_0_8px_#39FF14]"></span>
                <span>SYSTEM_BIBLIOGRAPHY.EXE</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-[#39FF14] hover:text-black px-3 py-1 transition-all duration-200 border border-[#39FF14]/30 hover:border-transparent rounded text-[10px] font-bold"
              >
                [X] DISCONNECT
              </button>
            </div>

            {/* Content Container */}
            <div className="p-6 md:p-10 z-30 overflow-y-auto font-mono text-[#39FF14] drop-shadow-[0_0_4px_rgba(57,255,20,0.6)] flex-1 space-y-8 select-text bibliography-scrollbar">
              <div className="border-b border-[#39FF14]/20 pb-4">
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">
                  &gt; ACADEMIC CITATIONS
                </h2>
                <p className="text-[11px] text-[#39FF14]/60 tracking-wider">
                  SOURCE RESEARCH DATA FOR THE EVOLUTION OF GRAPHICAL COMPUTATION
                </p>
              </div>

              {/* Citations Grid / List */}
              <div className="space-y-6">
                {sources.map((src) => (
                  <div 
                    key={src.id}
                    className="border border-[#39FF14]/20 bg-[#39FF14]/3 p-5 rounded-lg hover:border-[#39FF14]/60 transition-all duration-300 flex flex-col md:flex-row gap-4"
                  >
                    {/* Stage Info Tag */}
                    <div className="md:w-1/4 flex flex-col justify-start">
                      <div 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-widest w-fit mb-2 md:mb-3"
                        style={{ 
                          borderColor: `${src.color}40`,
                          backgroundColor: `${src.color}15`,
                          color: src.color,
                          boxShadow: `0 0 10px ${src.color}20`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: src.color }}></span>
                        STAGE {src.stage} — {src.eraName}
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden md:inline leading-normal">
                        {src.eraTitle}
                      </span>
                    </div>

                    {/* Reference Details */}
                    <div className="md:w-3/4 flex flex-col justify-between">
                      <div>
                        <div className="text-white font-sans text-sm font-semibold tracking-wide mb-1 leading-snug">
                          {src.title}
                        </div>
                        <div className="text-[#39FF14]/80 text-xs leading-relaxed mb-3">
                          <span className="text-[#39FF14] font-bold">{src.author}</span>. {src.publication}.
                        </div>
                      </div>

                      {/* DOI Action Link */}
                      <a 
                        href={src.doiUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-[#39FF14] hover:underline w-fit mt-1 border border-[#39FF14]/10 hover:border-[#39FF14]/30 px-2 py-1 rounded bg-black/40 transition-colors"
                      >
                        <span>ACCESS DOCUMENT</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h6v6"/>
                          <path d="M10 14 21 3"/>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Message Footer */}
              <div className="pt-6 border-t border-[#39FF14]/20 flex items-center justify-between text-[10px] text-[#39FF14]/50">
                <span>BUFFER STATUS: 100% ONLINE</span>
                <span className="animate-pulse">AWAITING CONNECTION STATE...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
