import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Import existing content components
import CuratorBoard from './CuratorBoard.jsx';
import Ascii1960s from './eras/Ascii1960s.jsx';
import Rasterizer1970s from './eras/Rasterizer1970s.jsx';
import Sprite1980s from './eras/Sprite1980s.jsx';
import Renderer1990s from './eras/Renderer1990s.jsx';
import Vision2000s from './eras/Vision2000s.jsx';
import Volumetric2010s from './eras/Volumetric2010s.jsx';
import Raytracer2020s from './eras/Raytracer2020s.jsx';

const eras = [
  { 
    era: '1960s', title: 'Keyboard ASCII and Character Art', color: '#22c55e', Component: Ascii1960s, type: 'SYMBOLIC',
    details: `Before computers could draw a single line, they arranged characters. In the 1960s, raster graphics did not exist yet, meaning developers relied on impact printers and line printers to create images. The earliest interactions with digital computers did not involve graphical screens at all — the first human-readable output was printed via line printers. This hardware constraint is the reason ASCII art exists, where patterns of standard keyboard characters were carefully arranged to form recognizable images.

However, the 1960s also witnessed the birth of interactive computer graphics. In 1963, Ivan Sutherland presented "Sketchpad: A Man-Machine Graphical Communication System" as his PhD thesis at MIT. Sketchpad was the first program to feature a graphical user interface, allowing users to directly manipulate objects on a screen using a light pen. It pioneered concepts such as "master" and "instance" objects (a precursor to object-oriented programming), hierarchical structures, and real-time constraints — ideas that would take decades to fully mature. Sutherland's work earned him the Turing Award in 1988 and is universally regarded as the single most important work in the history of computer graphics.

Key Milestones:
• 1963 — Ivan Sutherland's Sketchpad at MIT Lincoln Laboratory using the TX-2 computer
• 1963 — First computer art exhibited at galleries, sparking the "computer art" movement
• 1968 — Sutherland and Bob Sproull create the first head-mounted display ("The Sword of Damocles")
• 1969 — Bell Labs produces one of the earliest computer-animated films`,
    citations: [
      `https://dl.acm.org/doi/10.1145/1461551.1461591`,
      `https://history-computer.com/the-history-of-ascii-art/`
    ]
  },
  { 
    era: '1970s', title: 'Early Bitmap and Rasterization', color: '#ef4444', Component: Rasterizer1970s, type: 'PIXELS',
    details: `The 1970s marked a fundamental shift in how computers learned to see with the adoption of raster graphics. With the introduction of semiconductor memory (specifically DRAM chips), vector display techniques gave way to raster techniques using a discretely sampled pixel representation. This transition transformed graphics — it simplified the leap from outlines to solid, filled images. Pixels evolved from a simple "set or not set" bitmap state to carrying independent color information, enabling color gradients and smooth shading for the first time.

A landmark project at Xerox PARC (1972–1973), called SuperPaint and led by Richard Shoup, created one of the first pixel-based framebuffer systems. It successfully combined digital computing with video technology, setting the stage for digital paint programs and computer animation. By 1974, Evans & Sutherland released the "Picture System," one of the first commercial framebuffers available to researchers and studios.

The decade also produced two of the most important rendering algorithms in history. In 1971, Henri Gouraud introduced a method to interpolate colors across polygon surfaces to simulate smooth shading. Then in 1975, Bui Tuong Phong published "Illumination for Computer Generated Pictures," which introduced Phong shading — a technique that interpolated surface normal vectors instead of just color, producing realistic specular highlights on curved surfaces. Phong shading remains a foundational concept taught in every computer graphics course today.

Key Milestones:
• 1971 — Gouraud shading algorithm for smooth polygon rendering
• 1972 — SuperPaint framebuffer system at Xerox PARC
• 1974 — Ed Catmull invents the Z-buffer for hidden surface removal
• 1975 — Phong shading model published
• 1974 — First SIGGRAPH conference, creating a vital venue for sharing graphics research`,
    citations: [
      `https://dl.acm.org/doi/10.1145/360825.360839`,
      `https://novedge.com/blogs/design-news/design-software-history-evolution-of-vector-and-raster-graphics-in-design-software-history-a-journey-through-technology-and-creative-process-transformation`
    ]
  },
  { 
    era: '1980s', title: 'Sprites, Arcades & 3D Workstations', color: '#f59e0b', Component: Sprite1980s, type: 'SPRITES',
    details: `The 1980s saw computer graphics split into two parallel revolutions. On the consumer side, the arcade and home console explosion was powered by sprite-based hardware — dedicated video chips that could composite 2D bitmap objects independently of the main framebuffer. This allowed fluid animation and independent character movement without taxing the CPU. Games like Pac-Man (1980), Donkey Kong (1981), and Super Mario Bros. (1985) captivated millions, while home systems like the Commodore 64, Atari 8-bit series, and the NES brought arcade-quality graphics into living rooms.

On the professional side, Silicon Graphics Inc. (SGI), founded in 1982 by Stanford professor James Clark, revolutionized 3D graphics with their "Geometry Engine" — a VLSI-based hardware implementation of a geometry pipeline that could perform transformation, clipping, and projection calculations in dedicated hardware. SGI workstations became the gold standard for 3D visualization, CAD, and Hollywood visual effects throughout the 1980s and 1990s, powering the creation of landmark films like Terminator 2 (1991), Jurassic Park (1993), and eventually the first fully computer-animated feature film, Toy Story (1995).

This era was also defined by "limitation-driven creativity" — 8-bit developers were forced to optimize code within extremely tight hardware constraints (often just 64KB of RAM), leading to ingenious techniques for squeezing maximum visual fidelity from minimal resources. The cultural impact was enormous: the 1980s established gaming as a mainstream entertainment medium and laid the architectural foundations for the modern GPU.

Key Milestones:
• 1980 — Pac-Man becomes the first gaming cultural phenomenon
• 1982 — Silicon Graphics Inc. founded, introducing the Geometry Engine
• 1983 — Nintendo releases the Famicom (NES) in Japan
• 1985 — Commodore Amiga launches with dedicated graphics and audio co-processors
• 1986 — Pixar's "Luxo Jr." becomes the first CGI film nominated for an Academy Award`,
    citations: [
      `https://dl.acm.org/doi/10.1145/279389.279478`,
      `https://en.wikipedia.org/wiki/Silicon_Graphics`,
      `https://computerhistory.org/blog/silicon-graphics/`
    ]
  },
  { 
    era: '1990s', title: 'The GPU & Real-Time 3D', color: '#3b82f6', Component: Renderer1990s, type: 'POLYGONS',
    details: `The 1990s witnessed the birth of the dedicated Graphics Processing Unit (GPU) and the transformation of 3D graphics from an academic curiosity into a mass-market technology. The decade began with all 3D rendering being done entirely in software by the CPU. id Software's Wolfenstein 3D (1992) and Doom (1993) pushed this approach to its limits, using clever software rendering tricks to create fast-paced, immersive pseudo-3D environments that captivated millions of players.

The hardware revolution arrived in 1996 with the 3dfx Voodoo Graphics card — the first consumer-grade 3D accelerator designed specifically for real-time rasterization. Unlike previous "Windows accelerator" cards that mainly handled 2D operations, the Voodoo offloaded complex 3D tasks (texture mapping, filtering, Z-buffering) from the CPU, enabling dramatically higher frame rates and visual quality. 3dfx introduced its proprietary Glide API, which became the de facto standard for early 3D games.

A watershed moment came with id Software's Quake (1996) and its subsequent GLQuake port (1997), which utilized the OpenGL standard. By using an open graphics API instead of a proprietary one, id Software effectively opened the market to competition between hardware manufacturers. This established the precedent for cross-vendor 3D acceleration and paved the way for the dominance of standardized APIs like OpenGL and Microsoft's Direct3D. Meanwhile, Pixar's Toy Story (1995) proved that computers could create an entire feature-length animated film, forever changing the entertainment industry.

Key Milestones:
• 1992 — Wolfenstein 3D pioneers the first-person shooter genre
• 1993 — Doom revolutionizes multiplayer gaming and modding culture
• 1995 — Toy Story becomes the first fully CGI feature film
• 1996 — 3dfx Voodoo launches, bringing hardware 3D acceleration to consumers
• 1996 — Quake introduces true real-time 3D with six degrees of freedom
• 1999 — NVIDIA releases the GeForce 256, the first chip marketed as a "GPU"`,
    citations: [
      `https://www.researchgate.net/publication/2998523_Rise_of_the_Graphics_Processor`,
      `https://doi.org/10.1109/JPROC.2008.917718`,
      `https://fabiensanglard.net/quakeSource/`
    ]
  },
  { 
    era: '2000s', title: 'Programmable Shaders & Normal Mapping', color: '#06b6d4', Component: Vision2000s, type: 'SHADERS',
    details: `The 2000s represented the transition from fixed-function graphics pipelines — where hardware behavior was hardcoded — to fully programmable pipelines that allowed developers to write custom code that ran directly on the GPU. This was a paradigm shift: instead of being limited to a pre-defined set of rendering operations, artists and engineers could now write "shaders" — small programs that controlled exactly how every vertex and pixel was processed.

DirectX 8 (2000) was the watershed moment, introducing Vertex Shaders (for geometry manipulation) and Pixel Shaders (for per-pixel color and lighting control) to consumer hardware. The NVIDIA GeForce 3 and ATI Radeon 8000 series were among the first GPUs to implement these capabilities. In 2004, OpenGL 2.0 introduced GLSL (OpenGL Shading Language), providing a high-level, C-like syntax that democratized shader programming and reduced reliance on complex assembly-level code.

Normal mapping (or Dot3 bump mapping) became the defining visual technique of the decade. While the theoretical concept existed since Jim Blinn's work in 1978, it became a mainstream standard around 2003–2004. By encoding surface normal directions into a texture map (where each pixel's RGB values represent XYZ normal coordinates), the GPU could simulate complex surface details — bumps, dents, scratches, and fabric weaves — on low-polygon models without the performance cost of high-polygon geometry. Games like Doom 3 (2004) and Half-Life 2 (2004) were definitive early adopters, using normal mapping alongside dynamic per-pixel lighting to achieve unprecedented visual fidelity.

Key Milestones:
• 2000 — DirectX 8 introduces programmable vertex and pixel shaders
• 2001 — NVIDIA GeForce 3 ships as one of the first programmable GPUs
• 2004 — Doom 3 and Half-Life 2 popularize normal mapping and per-pixel lighting
• 2004 — OpenGL 2.0 introduces GLSL (OpenGL Shading Language)
• 2006 — NVIDIA releases CUDA, enabling general-purpose GPU computing (GPGPU)
• 2007 — Crysis sets a new benchmark for real-time graphics, becoming the "Can it run Crysis?" meme`,
    citations: [
      `https://doi.org/10.1145/1730804.1730835`,
      `https://developer.nvidia.com/cuda-zone`
    ]
  },
  { 
    era: '2010s', title: 'PBR, Volumetric Lighting & VR', color: '#10b981', Component: Volumetric2010s, type: 'PBR',
    details: `The 2010s saw computer graphics achieve a level of realism that had previously been exclusive to pre-rendered film VFX, now running in real-time. Three converging technologies defined this decade: Physically Based Rendering (PBR), volumetric lighting, and the consumer VR revolution.

Physically Based Rendering shifted from a specialized film production technique to the industry standard for real-time applications. Influenced by the landmark "Physically Based Shading" courses at SIGGRAPH (starting in 2010), PBR defined materials using measurable physical properties — metalness, roughness, and albedo — that reacted consistently to any lighting environment. By the mid-2010s, PBR became the default rendering pipeline in both Unity and Unreal Engine 4. The rise of specialized tools like the Substance suite (later acquired by Adobe) made it accessible to artists worldwide.

Volumetric lighting transformed flat digital scenes into atmospheric, cinematic environments by calculating how light scatters through particulate matter — dust, fog, smoke, and god rays. While volumetric effects had long been staples of film VFX, the 2010s saw them become standard in real-time game engines, dramatically increasing the sense of depth and immersion.

The Oculus Rift Kickstarter in 2012 reignited the modern VR era. The consumer release (CV1) in 2016, followed by the HTC Vive, Valve Index, and PlayStation VR, proved that low-latency head tracking and stereoscopic rendering could create convincing "presence." VR's demand for stable 90+ FPS drove innovations in foveated rendering, mesh simplification, and rendering efficiency that benefited all of real-time graphics.

Key Milestones:
• 2010 — SIGGRAPH "Physically Based Shading" course begins influencing the industry
• 2012 — Oculus Rift Kickstarter launches the modern VR era
• 2014 — Unreal Engine 4 ships with PBR as the default rendering pipeline
• 2016 — Oculus Rift CV1, HTC Vive, and PlayStation VR launch for consumers
• 2018 — NVIDIA announces RTX Turing architecture with dedicated RT Cores`,
    citations: [
      `https://doi.org/10.1109/TVCG.2024.3445339`,
      `https://blog.selfshadow.com/publications/s2013-shading-course/`
    ]
  },
  { 
    era: '2020s', title: 'Flawless Photorealism & Neural Graphics', color: '#a855f7', Component: Raytracer2020s, type: 'NEURAL',
    details: `The 2020s have ushered in the era of flawless photorealism, driven by the mainstream integration of hardware-accelerated real-time ray tracing. Instead of approximating light interactions through traditional rasterization tricks, modern rendering engines physically simulate the path of light — enabling mathematically accurate reflections, refractions, caustics, and global illumination in real-time. NVIDIA's RTX platform, powered by dedicated RT Cores for ray-triangle intersection and Tensor Cores for AI acceleration, has made path tracing viable in consumer hardware for the first time.

Epic Games' Unreal Engine 5 (2022) addressed two of the biggest remaining bottlenecks in real-time rendering. Nanite is a virtualized micropolygon geometry system that allows artists to import film-quality assets with billions of polygons, dynamically streaming and rendering detail based on screen-space requirements — eliminating the need for manual Level of Detail (LOD) authoring. Lumen is a fully dynamic global illumination and reflections system that calculates indirect lighting in real-time using a hybrid of screen-space techniques, distance fields, and ray tracing, removing the traditional dependency on pre-baked lightmaps.

Perhaps the most disruptive development of the decade is the rise of Neural Rendering. In 2020, Ben Mildenhall et al. introduced Neural Radiance Fields (NeRF), which uses neural networks to represent 3D scenes as continuous volumetric functions. From just a handful of 2D photographs, NeRF can synthesize photorealistic novel views of a scene — a paradigm shift from explicit geometry to learned, data-driven representations. Subsequent research (Instant-NGP, 3D Gaussian Splatting) has pushed NeRF toward real-time performance.

NVIDIA's DLSS (Deep Learning Super Sampling) and AMD's FSR have become essential components of the modern rendering pipeline, using AI to reconstruct high-resolution frames from lower-resolution inputs. This allows games to maintain high frame rates while running complex ray-traced scenes — a trade-off that defines the current generation of graphics.

Key Milestones:
• 2020 — NeRF (Neural Radiance Fields) paper published, pioneering neural scene representation
• 2021 — Unreal Engine 5 early access with Nanite and Lumen
• 2022 — NVIDIA DLSS 3.0 introduces AI-generated frames
• 2023 — 3D Gaussian Splatting emerges as a faster alternative to NeRF
• 2024 — Full path tracing becomes standard in AAA titles (Cyberpunk 2077, Alan Wake 2)`,
    citations: [
      `https://arxiv.org/abs/2003.08934`,
      `https://doi.org/10.1145/3466752.3480097`,
      `https://www.unrealengine.com/en-US/blog/a-first-look-at-unreal-engine-5`
    ]
  },
];

const NODE_DISTANCE = 40;
const MAX_Z = -(eras.length + 1) * NODE_DISTANCE;

function ComputerNode({ data, index, onOpen, isModalOpen }) {
  const [hovered, setHovered] = useState(false);
  
  const zPosition = -(index + 1) * NODE_DISTANCE;
  const isRight = index % 2 === 0;
  const xPosition = isRight ? 4 : -4; 
  const yPosition = Math.sin(index) * 0.1;
  const yRotation = isRight ? -Math.PI / 6 : Math.PI / 6;

  const { color, era, title } = data;

  return (
    <group position={[xPosition, yPosition, zPosition]} rotation={[0, yRotation, 0]}>
      <Html center transform zIndexRange={[100, 0]}>
        <div 
          className={`flex flex-col items-center justify-center pointer-events-auto cursor-pointer select-none transition-all duration-500 group ${isModalOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => { e.stopPropagation(); setHovered(false); onOpen(data, index); }}
          style={{ 
            transform: hovered ? 'scale(1.15) translateY(-10px)' : 'scale(1) translateY(0px)',
            filter: hovered ? `drop-shadow(0 0 30px ${color}80)` : `drop-shadow(0 0 10px ${color}40)`
          }}
        >
          {/* The Glassmorphism Terminal Card */}
          <div 
            className="relative w-64 h-40 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 flex flex-col overflow-hidden transition-colors duration-500"
            style={{ borderColor: hovered ? color : 'rgba(255,255,255,0.1)' }}
          >
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-40 z-10" style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 1px, rgba(0,0,0,0.9) 2px)'
            }}></div>
            
            {/* Header Bar */}
            <div className="w-full h-7 border-b flex items-center px-3 z-20" style={{ borderColor: `${color}40`, backgroundColor: `${color}15` }}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                <div className="w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: color }}></div>
                <div className="w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: color }}></div>
              </div>
              <span className="ml-3 font-mono text-[9px] uppercase tracking-widest text-white/80">{era} // ARCHIVE</span>
            </div>
            
            {/* Body Content */}
            <div className="flex-1 p-5 flex flex-col items-center justify-center text-center z-20 relative">
              {/* Background Glow */}
              <div className="absolute inset-0 opacity-20 blur-2xl transition-opacity duration-500" style={{ backgroundColor: color, opacity: hovered ? 0.4 : 0.1 }}></div>
              
              <h3 className="text-xl font-display font-bold text-white drop-shadow-md mb-3 leading-tight relative z-30">
                {title}
              </h3>
              
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] bg-black/50 px-3 py-1 rounded-full border relative z-30 transition-colors duration-300" style={{ color: color, borderColor: hovered ? color : 'transparent' }}>
                {hovered ? '> ACCESS LOG_' : 'STANDBY'}
              </span>
            </div>
            
            {/* Bottom Decoration */}
            <div className="w-full h-1 transition-all duration-500" style={{ backgroundColor: color, opacity: hovered ? 1 : 0.5 }}></div>
          </div>
          
          {/* Tether line to timeline */}
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent mt-2"></div>
        </div>
      </Html>
    </group>
  );
}

/* Camera controller that reads from a shared ref — NO ScrollControls, NO native scrolling */
function CameraController({ targetZRef }) {
  const smoothZ = useRef(0);
  const gridRef = useRef();

  useFrame((state) => {
    // Smoothly interpolate toward the target Z position (damping)
    smoothZ.current = THREE.MathUtils.lerp(smoothZ.current, targetZRef.current, 0.08);

    state.camera.position.set(0, 0, smoothZ.current);
    state.camera.lookAt(0, 0, smoothZ.current - 10);

    // Move the grid with the camera
    if (gridRef.current) {
      gridRef.current.position.z = smoothZ.current - (smoothZ.current % 10);
    }
  });

  return (
    <>
      <color attach="background" args={['#020802']} />
      <fog attach="fog" args={['#020802', 10, 150]} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#39FF14" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#00aa00" />

      {/* Atmospheric Particles stretched across the whole Z depth */}
      <group position={[0, 0, MAX_Z / 2]}>
        <Stars radius={50} depth={Math.abs(MAX_Z) + 100} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={500} scale={[50, 50, Math.abs(MAX_Z) + 100]} size={4} speed={0.2} opacity={0.3} color="#39FF14" />
      </group>

      {/* Terminal Wireframe Floor Grid */}
      <gridHelper 
        ref={gridRef}
        args={[200, 100, '#00ff00', '#002200']} 
        position={[0, -5, 0]} 
      />

      {/* Glowing center path line */}
      <mesh position={[0, -4.95, MAX_Z / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, Math.abs(MAX_Z) + 200]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.2} />
      </mesh>
    </>
  );
}

export default function Exhibit3D() {
  const [activeEra, setActiveEra] = useState(null);
  const [showIntroModal, setShowIntroModal] = useState(true);
  
  // This ref holds the target camera Z position — updated directly by wheel events
  const targetZRef = useRef(0);
  const containerRef = useRef(null);

  const handleOpenModal = (data, index) => {
    if (data === 'intro') {
      setShowIntroModal(true);
    } else {
      setActiveEra({ data, index });
    }
  };

  const handleCloseModal = () => {
    setActiveEra(null);
  };

  const isModalOpen = showIntroModal || !!activeEra;

  // Capture wheel events and convert them to camera Z movement
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // Don't scroll timeline while modals are open (allows native scrolling in modal)
      if (showIntroModal || activeEra) return;

      e.preventDefault();
      e.stopPropagation();

      // deltaY > 0 = scroll down = move camera forward (negative Z)
      const speed = 0.15;
      targetZRef.current = Math.max(MAX_Z, Math.min(0, targetZRef.current - e.deltaY * speed));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [showIntroModal, activeEra]);

  // Lock body scroll to prevent native page scrolling, but allow wheel events for modals
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-screen h-screen bg-[#020802] z-[50] overflow-hidden">
      <style>{`
        html, body {
          overflow: hidden !important;
          height: 100% !important;
          margin: 0 !important;
        }
        @keyframes rwFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes rwSlideUp {
          from { opacity: 0; transform: scale(0.95) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-backdrop-anim {
          animation: rwFadeIn 0.3s ease-out forwards;
        }
        .modal-content-anim {
          animation: rwSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <Canvas camera={{ position: [0, 0, 0], fov: 60 }} className="absolute inset-0">
        <CameraController targetZRef={targetZRef} />
        {/* The 3D Era Nodes */}
        {eras.map((data, index) => (
          <ComputerNode key={data.era} data={data} index={index} onOpen={handleOpenModal} isModalOpen={isModalOpen} />
        ))}
      </Canvas>

      {/* 2D Overlay for the Era Modal */}
      {activeEra && (
        <div 
          className="absolute inset-0 z-[1000] flex items-center justify-center p-4 bg-[#020502]/90 backdrop-blur-md modal-backdrop-anim"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-pointer" onClick={handleCloseModal}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
          </div>
          
          <div className="relative w-[92vw] max-w-[1600px] h-[85vh] bg-[#020502] border border-[#39FF14]/30 rounded-xl shadow-[0_0_50px_rgba(57,255,20,0.15)] overflow-hidden flex flex-col md:flex-row modal-content-anim">
            
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-50 p-2 text-[#39FF14] hover:text-white bg-black/40 hover:bg-[#39FF14]/20 rounded-full transition-colors border border-transparent hover:border-[#39FF14]/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Left Graphic Area */}
            <div className="w-full md:w-2/5 p-10 bg-black flex flex-col items-center justify-center relative min-h-[40vh] border-r border-[#39FF14]/20">
              <div className="absolute inset-0 opacity-20 blur-3xl" style={{ backgroundColor: activeEra.data.color }}></div>
              
              {/* Era Badge */}
              <div className="absolute top-6 left-6 z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest" 
                  style={{ borderColor: `${activeEra.data.color}60`, backgroundColor: `${activeEra.data.color}15`, color: activeEra.data.color }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeEra.data.color }}></div>
                  {activeEra.data.era} ERA
                </div>
              </div>

              {/* Visual Component */}
              <div data-era-view="expanded" className="relative z-10 transform origin-center" style={{ transform: "scale(min(3.5, calc(75vh / 380px), calc(35vw / 200px)))" }}>
                 <activeEra.data.Component />
              </div>

              {/* Era type label */}
              <div className="absolute top-6 right-8 z-20 font-mono text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ color: activeEra.data.color }}>
                {activeEra.data.type} RENDERING
              </div>
            </div>

            {/* Right Content Area - Now with styled sections */}
            <div className="w-full md:w-3/5 flex flex-col bg-gradient-to-br from-[#020502] to-[#051005]">
              
              {/* Header */}
              <div className="p-8 pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full animate-breathe" style={{ backgroundColor: activeEra.data.color, boxShadow: `0 0 10px ${activeEra.data.color}` }}></div>
                  <span className="font-mono text-xs tracking-widest text-[#39FF14] uppercase">Exhibit 0{activeEra.index + 1} — {activeEra.data.type}</span>
                </div>
                <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 leading-tight drop-shadow-md">
                  {activeEra.data.title}
                </h2>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent mt-5" style={{ backgroundImage: `linear-gradient(to right, ${activeEra.data.color}40, transparent)` }}></div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 pt-5 space-y-6 custom-scrollbar">
                
                {/* Parse details into sections */}
                {(() => {
                  const fullText = activeEra.data.details;
                  const parts = fullText.split('Key Milestones:');
                  const narrativeParagraphs = parts[0].trim().split('\n\n').filter(p => p.trim());
                  const milestones = parts[1] ? parts[1].trim().split('\n').filter(l => l.startsWith('•')).map(l => {
                    const match = l.match(/^• (\d{4}) — (.+)$/);
                    return match ? { year: match[1], text: match[2] } : null;
                  }).filter(Boolean) : [];

                  return (
                    <>
                      {/* Narrative Section */}
                      <div className="space-y-4">
                        {narrativeParagraphs.map((para, i) => (
                          <p key={i} className="text-zinc-300 leading-relaxed font-sans text-[15px]">
                            {i === 0 && (
                              <span className="text-3xl font-display font-bold float-left mr-2 mt-1 leading-none" style={{ color: activeEra.data.color }}>
                                {para.charAt(0)}
                              </span>
                            )}
                            {i === 0 ? para.slice(1) : para}
                          </p>
                        ))}
                      </div>

                      {/* Key Milestones Timeline */}
                      {milestones.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-[2px]" style={{ backgroundColor: activeEra.data.color }}></div>
                            <h3 className="font-mono text-xs tracking-widest uppercase" style={{ color: activeEra.data.color }}>Key Milestones</h3>
                          </div>
                          <div className="relative ml-3 border-l-2 space-y-0" style={{ borderColor: `${activeEra.data.color}30` }}>
                            {milestones.map((m, i) => (
                              <div key={i} className="pl-6 pb-4 relative group">
                                {/* Timeline dot */}
                                <div className="absolute -left-[7px] top-[6px] w-3 h-3 rounded-full border-2 bg-[#020502] transition-colors group-hover:scale-125" 
                                  style={{ borderColor: activeEra.data.color, boxShadow: `0 0 6px ${activeEra.data.color}40` }}></div>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                  <span className="font-mono text-sm font-bold shrink-0" style={{ color: activeEra.data.color }}>{m.year}</span>
                                  <span className="text-zinc-400 text-sm leading-relaxed">{m.text}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Citations Section */}
                      {activeEra.data.citations && activeEra.data.citations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <h3 className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 mb-3">References & Sources</h3>
                          <div className="flex flex-wrap gap-2">
                            {activeEra.data.citations.map((url, i) => {
                              const domain = new URL(url).hostname.replace('www.', '');
                              return (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono transition-all hover:scale-105"
                                  style={{ borderColor: `${activeEra.data.color}30`, color: activeEra.data.color, backgroundColor: `${activeEra.data.color}08` }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                  {domain}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Intro Modal */}
      {showIntroModal && (
        <div 
          className="absolute inset-0 z-[1000] flex items-center justify-center p-8 modal-backdrop-anim"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowIntroModal(false)}
          ></div>
          
          {/* CRT Modal Window */}
          <div className="relative z-10 w-full max-w-5xl h-[80vh] bg-[#020a02] border border-[#39FF14]/30 rounded-lg shadow-[0_0_100px_rgba(57,255,20,0.15)] flex flex-col overflow-hidden modal-content-anim">
            
            {/* Modal Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-20" style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.4) 3px)'
            }}></div>
            
            {/* Modal Glare */}
            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_150px_rgba(0,0,0,1)]"></div>

            {/* Terminal Header Bar */}
            <div className="w-full bg-[#39FF14]/10 border-b border-[#39FF14]/20 p-3 flex justify-between items-center z-30 font-mono text-[#39FF14] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#39FF14] rounded-sm animate-pulse shadow-[0_0_10px_#39FF14]"></span>
                MAIN_TERMINAL.EXE
              </div>
              <button 
                onClick={() => setShowIntroModal(false)}
                className="hover:bg-[#39FF14] hover:text-black px-4 py-2 transition-colors border border-[#39FF14]/50 hover:border-transparent rounded font-bold cursor-pointer tracking-wider shadow-[0_0_15px_rgba(57,255,20,0.3)]"
              >
                [ INITIALIZE TIMELINE ]
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-12 z-30 overflow-y-auto font-mono text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase tracking-tighter">
                &gt; The Living Terminal_
              </h2>
              
              <div className="text-lg md:text-xl leading-relaxed space-y-6 max-w-3xl">
                <p>
                  &gt; Welcome, user. You have accessed the historical archives of computational vision.
                </p>
                <p>
                  &gt; This digital space tracks the structural evolution from symbolic character rendering to flawless synthetic photorealism.
                </p>
                <div className="border border-[#39FF14]/30 p-6 bg-[#39FF14]/5 rounded my-8">
                  <p className="text-sm uppercase tracking-widest text-[#39FF14]/70 mb-2">Instructions:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Scroll down to fly forward through the timeline.</li>
                    <li>Observe the tethered nodes representing key visual eras.</li>
                    <li>Click any floating node to expand its matrix and access detailed logs.</li>
                  </ul>
                </div>
                <p className="animate-pulse text-sm">
                  &gt; AWAITING USER INPUT...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
