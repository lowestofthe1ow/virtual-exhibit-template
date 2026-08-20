import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SingleFlashcard from "./FlashcardDeck.tsx";
import type { FlashCard } from "./FlashcardDeck.tsx";
import AnimatedBars from "./AnimatedBars.tsx";
import { armData, x86Data } from "./data.ts";

const categories = ["Overview", "Performance", "Use Cases", "Key Devices", "Pros and Cons", "Comparison Table"];

// ─── Skeleton Helpers ──────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className ?? ""}`} />;
}

function CategoryPageSkeleton() {
  return (
    <div className="w-full max-w-2xl px-4 mx-auto">
      <SkeletonBlock className="h-5 w-24 mb-8" />
      <div className="rounded-2xl p-6 mb-8 bg-[#121620] border border-white/5 shadow-xl">
        <SkeletonBlock className="h-9 w-48 mb-3" />
        <SkeletonBlock className="h-4 w-64 mb-4" />
        <SkeletonBlock className="h-6 w-16 rounded-md" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/5 bg-[#0F1117] p-1">
            <div className="flex gap-[3px] px-3 py-1.5 opacity-40">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="flex-1 h-[2px] rounded-full bg-white/20" />
              ))}
            </div>
            <div className="mx-2 rounded-xl bg-[#07080c] min-h-[80px] flex items-center justify-center">
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <div className="flex gap-[3px] px-3 py-1.5 opacity-40">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="flex-1 h-[2px] rounded-full bg-white/20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chip Pins ────────────────────────────────────────────────────────────────

function ChipPins({ accentColor, active }: { accentColor: string; active: boolean }) {
  return (
    <div className="flex gap-[3px] px-4 py-1.5 justify-between">
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="w-[3px] h-[3px] rounded-full transition-all duration-300" 
          style={{ 
            backgroundColor: active ? accentColor : `${accentColor}30`,
            boxShadow: active ? `0 0 6px ${accentColor}` : 'none'
          }} 
        />
      ))}
    </div>
  );
}

// ─── ChipButton ──────────────────────────────────────────────────────────────

function ChipButton({ label, accentColor, onClick }: { label: string; accentColor: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  const traceStyle: React.CSSProperties = hovered
    ? { strokeDasharray: "0.2 1", strokeDashoffset: "0", animation: "card-trace 1.5s linear infinite", opacity: 1 }
    : { strokeDasharray: "0.2 1", strokeDashoffset: "1", opacity: 0, transition: "opacity 0.3s ease" };

  return (
    <motion.div
      layout
      className="rounded-2xl cursor-pointer relative overflow-hidden group select-none"
      style={{
        border: `1px solid ${hovered ? accentColor : `${accentColor}20`}`,
        backgroundColor: hovered ? `${accentColor}0C` : `${accentColor}03`,
        boxShadow: hovered ? `0 12px 40px -12px ${accentColor}50` : "0 4px 20px -5px rgba(0,0,0,0.3)",
        transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.98 }}
    >
      <svg className="absolute inset-0 w-full h-full rounded-2xl overflow-visible pointer-events-none" style={{ zIndex: 2 }}>
        <rect
          x="1" y="1"
          width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx="15" ry="15"
          fill="none"
          stroke={hovered ? "#ffffff" : "transparent"}
          strokeWidth="1.5"
          pathLength="1"
          style={{ filter: hovered ? `drop-shadow(0 0 4px ${accentColor})` : "none", ...traceStyle }}
        />
      </svg>

      <ChipPins accentColor={accentColor} active={hovered} />

      <div
        className="mx-2 mb-1 rounded-xl overflow-hidden relative transition-all duration-300"
        style={{
          backgroundColor: "#090B11",
          border: `1px solid ${hovered ? `${accentColor}40` : "rgba(255,255,255,0.03)"}`,
          minHeight: 85,
          backgroundImage: hovered
            ? `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`
            : `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full px-3 py-4 relative z-10 min-h-[85px]">
          <div
            className="w-1.5 h-1.5 rounded-full mb-2 shrink-0 transition-all duration-300"
            style={{
              backgroundColor: hovered ? "#ffffff" : accentColor,
              opacity: hovered ? 1 : 0.4,
              boxShadow: hovered ? `0 0 8px 2px ${accentColor}` : "none",
            }}
          />
          <span
            className="text-xs font-s01g9-mono font-bold tracking-wider text-center transition-colors duration-300"
            style={{ color: hovered ? '#ffffff' : `${accentColor}EE` }}
          >
            {label}
          </span>
        </div>
      </div>

      <ChipPins accentColor={accentColor} active={hovered} />
    </motion.div>
  );
}

// ─── Hoverable List Item ──────────────────────────────────────────────────────

function HoverItem({
  accentColor, children, className = "",
}: {
  accentColor: string; children: React.ReactNode; className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`rounded-xl transition-all duration-300 border border-white/5 ${className}`}
      style={{
        backgroundColor: hovered ? `${accentColor}0A` : "rgba(13,16,23,0.6)",
        backdropFilter: "blur(8px)",
        borderLeft: `3px solid ${hovered ? accentColor : "rgba(255,255,255,0.1)"}`,
        boxShadow: hovered ? `0 8px 30px -10px ${accentColor}33` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

// ─── Pros / Cons ──────────────────────────────────────────────────────────────

function ProsConsItem({ text, icon, iconColor, accentColor }: { text: string; icon: string; iconColor: string; accentColor: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li className="flex gap-3 rounded-xl p-3.5 border border-white/5 transition-all duration-300" style={{
      backgroundColor: hovered ? `${accentColor}0A` : "rgba(13,16,23,0.6)",
      backdropFilter: "blur(8px)",
      borderLeft: `3px solid ${hovered ? accentColor : "rgba(255,255,255,0.1)"}`,
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="shrink-0 font-bold font-s01g9-mono" style={{
        color: iconColor,
        textShadow: hovered ? `0 0 8px ${iconColor}` : "none",
        transition: "all 0.3s ease",
      }}>
        {icon}
      </span>
      <span className="text-sm text-gray-300 leading-relaxed">{text}</span>
    </li>
  );
}

function ProsCons({ pros, cons, accentColor }: { pros: string[]; cons: string[]; accentColor: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
      <div>
        <h4 className="text-sm font-s01g9-mono font-bold tracking-wider mb-4 flex items-center gap-2 text-[#00C2D1]">
          <span className="w-1.5 h-3.5 rounded-full bg-[#00C2D1] shadow-[0_0_8px_#00C2D1]" />
          PROS
        </h4>
        <ul className="space-y-3">
          {pros.map((p, i) => <ProsConsItem key={i} text={p} icon="✓" iconColor="#00C2D1" accentColor={accentColor} />)}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-s01g9-mono font-bold tracking-wider mb-4 flex items-center gap-2 text-[#FF8C42]">
          <span className="w-1.5 h-3.5 rounded-full bg-[#FF8C42] shadow-[0_0_8px_#FF8C42]" />
          CONS
        </h4>
        <ul className="space-y-3">
          {cons.map((c, i) => <ProsConsItem key={i} text={c} icon="✕" iconColor="#FF8C42" accentColor={accentColor} />)}
        </ul>
      </div>
    </div>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTableRow({ row, accentColor }: { row: { attribute: string; arm: string; x86: string }; accentColor: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      className="border-b border-white/5 last:border-0 transition-colors duration-200"
      style={{ backgroundColor: hovered ? `${accentColor}06` : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="p-4 font-s01g9-mono font-medium text-xs transition-colors duration-200" style={{ color: hovered ? "#ffffff" : "#8e96a3" }}>
        {row.attribute}
      </td>
      <td className="p-4 text-xs text-gray-300 leading-relaxed">{row.arm}</td>
      <td className="p-4 text-xs text-gray-300 leading-relaxed">{row.x86}</td>
    </tr>
  );
}

function ComparisonTable({ data, accentColor }: { data: typeof armData; accentColor: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#090B11]/80 backdrop-blur-md shadow-2xl">
      <table className="w-full text-left border-collapse min-w-[450px]">
        <thead>
          <tr className="bg-white/[0.02] border-b border-white/5">
            <th className="p-4 font-s01g9-mono text-xs text-gray-400 font-semibold tracking-wider uppercase">Attribute</th>
            <th className="p-4 font-s01g9-mono text-xs font-semibold tracking-wider uppercase text-[#00C2D1]">ARM</th>
            <th className="p-4 font-s01g9-mono text-xs font-semibold tracking-wider uppercase text-[#FF8C42]">x86</th>
          </tr>
        </thead>
        <tbody>
          {data.comparisonTable.map((row, i) => <ComparisonTableRow key={i} row={row} accentColor={accentColor} />)}
        </tbody>
      </table>
    </div>
  );
}

// ─── Flashcard Content Generator ─────────────────────────────────────────────

export function getFlashcard(category: string, data: typeof armData, accentColor: string): FlashCard {
  const baseFront = (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 select-none">
      <span className="text-3xl md:text-4xl font-s01g9-mono font-black tracking-widest uppercase transition-all duration-300" 
        style={{ 
          color: accentColor,
          textShadow: `0 0 30px ${accentColor}33`
        }}>
        {data.name}
      </span>
    </div>
  );

  switch (category) {
    case "overview":
      return {
        front: baseFront,
        back: (
          <div className="flex flex-col justify-center h-full px-4 py-2">
            <p className="text-sm md:text-base leading-relaxed tracking-wide text-gray-300 font-s01g9-sans opacity-95 text-center md:text-left">
              {data.overview}
            </p>
          </div>
        ),
      };
    case "performance":
      return {
        front: baseFront,
        back: <div className="p-2"><AnimatedBars data={data.performance} /></div>,
      };
    case "useCases":
      return {
        front: baseFront,
        back: (
          <ul className="space-y-3 p-1">
            {data.useCases.map((item, i) => <HoverItem key={i} accentColor={accentColor} className="p-3.5 text-sm text-gray-300">{item}</HoverItem>)}
          </ul>
        ),
      };
    case "keyDevices":
      return {
        front: baseFront,
        back: (
          <div className="space-y-3 p-1">
            {data.keyDevices.map((device, i) => (
              <HoverItem key={i} accentColor={accentColor} className="p-4">
                <h4 className="text-white text-sm font-semibold tracking-wide">{device.name}</h4>
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{device.description}</p>
              </HoverItem>
            ))}
          </div>
        ),
      };
    case "prosAndCons":
      return {
        front: baseFront,
        back: <ProsCons pros={data.pros} cons={data.cons} accentColor={accentColor} />,
      };
    case "comparison":
      return {
        front: baseFront,
        back: <ComparisonTable data={data} accentColor={accentColor} />,
      };
    default:
      return { front: null, back: null };
  }
}

// ─── Category Page ────────────────────────────────────────────────────────────

function CategoryPage({ arch, onBack }: { arch: "arm" | "x86"; onBack?: () => void }) {
  const data = arch === "arm" ? armData : x86Data;
  const accentColor = arch === "arm" ? "#00C2D1" : "#FF8C42";

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(timer);
  }, []);

  const categoryLabel = selectedCategory === "useCases" ? "Use Cases"
    : selectedCategory === "keyDevices" ? "Key Devices"
    : selectedCategory === "prosAndCons" ? "Pros and Cons"
    : selectedCategory === "comparison" ? "Comparison Table"
    : selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : "";

  const card = selectedCategory ? getFlashcard(selectedCategory, data, accentColor) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-pcb flex flex-col items-center py-12 px-4 sm:px-6 relative selection:bg-white/10"
    >
      <AnimatePresence mode="wait">
        {!mounted ? (
          <motion.div
            key="skeleton"
            className="w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryPageSkeleton />
          </motion.div>
        ) : selectedCategory && card ? (
          <motion.div
            key="flashcard"
            className="w-full max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-white transition-all rounded-lg px-3 py-1.5 mb-4 flex items-center gap-2 text-xs font-s01g9-mono tracking-wide shadow-md backdrop-blur-sm"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span> BACK TO CATEGORIES
            </button>

            <SingleFlashcard
              key={selectedCategory}
              card={card}
              initiallyFlipped
              accentColor={accentColor}
              categoryLabel={categoryLabel}
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden backdrop-blur-md shadow-2xl"
              style={{ 
                backgroundColor: `${accentColor}04`, 
                border: `1px solid ${accentColor}20`,
                boxShadow: `0 20px 50px -15px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.05)`
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[60px] opacity-20 pointer-events-none" style={{ backgroundColor: accentColor }} />
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{data.name}</h2>
              <p className="text-gray-400 text-[10px] sm:text-xs mt-2 font-s01g9-mono tracking-widest uppercase opacity-80">{data.tagline}</p>
              
              <span
                className="inline-block mt-4 text-[10px] font-s01g9-mono px-2.5 py-1 rounded-md tracking-wider font-semibold uppercase bg-black/40"
                style={{ border: `1px solid ${accentColor}35`, color: accentColor }}
              >
                {data.isa}
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {categories.map((label) => {
                const key = label === "Use Cases" ? "useCases"
                  : label === "Key Devices" ? "keyDevices"
                  : label === "Pros and Cons" ? "prosAndCons"
                  : label === "Comparison Table" ? "comparison"
                  : label.toLowerCase();
                return (
                  <ChipButton
                    key={key}
                    label={label}
                    accentColor={accentColor}
                    onClick={() => setSelectedCategory(key)}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CategoryPage;