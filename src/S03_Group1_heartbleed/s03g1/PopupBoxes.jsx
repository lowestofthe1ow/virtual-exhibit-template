import { useRef } from "react";

const ACCENT_CLASSES = {
  primary: "border-s03g1-hb-primary text-s03g1-hb-primary",
  cyan: "border-s03g1-hb-cyan text-s03g1-hb-cyan",
  secondary: "border-s03g1-hb-secondary text-s03g1-hb-secondary",
};

export default function DraggablePopup({
  id,
  title,
  accent = "primary",
  zIndex,
  x,
  y,
  onFocus,
  onMove,
  onClose,
  children,
}) {
  const accentClass = ACCENT_CLASSES[accent];
  const dragRef = useRef(null);

  const handlePointerDown = (e) => {
    onFocus(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = x;
    const originY = y;

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onMove(id, originX + dx, originY + dy);
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div
      ref={dragRef}
      style={{ left: x, top: y, zIndex, position: "absolute" }}
      className="w-56 animate-popup-fade rounded-md border bg-s03g1-hb-bg/95 font-s03g1-body text-xs shadow-lg shadow-black/40"
      onPointerDown={() => onFocus(id)}
    >
      <style>{`
        @keyframes popup-fade {
          0% { opacity: 0; transform: scale(0.85) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popup-fade {
          animation: popup-fade 0.25s ease-out;
        }
      `}</style>

      <div
        onPointerDown={handlePointerDown}
        className={`flex cursor-move items-center justify-between gap-1.5 border-b px-3 py-1.5 font-s03g1-heading text-[10px] uppercase tracking-wide ${accentClass}`}
      >
        <span className="flex items-center gap-1.5 truncate">{title}</span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onClose(id)}
          aria-label="Close popup"
          className="shrink-0 rounded px-1 leading-none hover:bg-white/10"
        >
          ✕
        </button>
      </div>
      <div className={`px-3 py-2 leading-relaxed text-white/85 ${accentClass}`}>
        {children}
      </div>
    </div>
  );
}