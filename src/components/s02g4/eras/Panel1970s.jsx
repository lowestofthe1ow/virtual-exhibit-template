import React from 'react';

export default function Panel1970s({ children }) {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[#1a1525] border-2 border-[#b026ff]/30 overflow-hidden">
      {/* Raster effect background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#b026ff_1px,_transparent_1px)] bg-[size:10px_10px] opacity-20"></div>
      
      <div className="z-10 text-center bg-[#1a1525]/80 p-12 rounded-3xl backdrop-blur-sm border border-[#b026ff]/50 shadow-[0_0_50px_rgba(176,38,255,0.2)]">
        <h1 className="text-6xl md:text-8xl font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#B026FF] font-black tracking-tight mb-4">
          1970s
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 font-light">Raster Graphics & Bitmaps</p>
      </div>

      {children}
    </div>
  );
}
