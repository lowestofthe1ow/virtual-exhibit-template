import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface FlashCard {
  front: React.ReactNode;
  back: React.ReactNode;
}

// ─── Chip Pins ────────────────────────────────────────────────────────────────

function ChipPins({ accentColor }: { accentColor: string }) {
  return (
    <div className="flex gap-[3px] px-6 py-2">
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="flex-1 h-[2px] rounded-full" style={{ backgroundColor: `${accentColor}18` }} />
      ))}
    </div>
  );
}

// ─── Card Shell ───────────────────────────────────────────────────────────────

function CardShell({
  accentColor,
  categoryLabel,
  children,
}: {
  accentColor: string;
  categoryLabel: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ChipPins accentColor={accentColor} />
      <div
        className="mx-5 rounded-xl overflow-hidden"
        style={{ backgroundColor: "#0F1117", border: `1px solid ${accentColor}12` }}
      >
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: accentColor, opacity: 0.45 }}
          />
          <div className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
          <span className="text-lg font-bold text-white font-s01g9-mono tracking-wide">{categoryLabel}</span>
        </div>
        <div className="mx-6 mb-1 h-px" style={{ backgroundColor: `${accentColor}15` }} />
        <div className="px-6 py-4 min-h-[720px] flex flex-col justify-center text-gray-300 text-sm flashcard-content">
          {children}
        </div>
      </div>
      <ChipPins accentColor={accentColor} />
    </>
  );
}

// ─── Flashcard ────────────────────────────────────────────────────────────────

function Flashcard({
  card,
  isFlipped,
  onFlip,
  accentColor,
  categoryLabel,
}: {
  card: FlashCard;
  isFlipped: boolean;
  onFlip: () => void;
  accentColor: string;
  categoryLabel: string;
}) {
  return (
    <div
      className="w-full rounded-xl cursor-pointer select-none"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <motion.div
        className="rounded-xl relative"
        style={{
          border: `1px solid ${accentColor}25`,
          backgroundColor: `${accentColor}06`,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div
          className="rounded-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardShell accentColor={accentColor} categoryLabel={categoryLabel}>
            {card.front}
          </CardShell>
        </div>

        <div
          className="rounded-xl absolute inset-0 flashcard-content"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardShell accentColor={accentColor} categoryLabel={categoryLabel}>
            {card.back}
          </CardShell>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Single Flashcard ─────────────────────────────────────────────────────────

interface SingleFlashcardProps {
  card: FlashCard;
  accentColor: string;
  categoryLabel: string;
  initiallyFlipped?: boolean;
}

function SingleFlashcard({ card, accentColor, categoryLabel, initiallyFlipped }: SingleFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(initiallyFlipped ?? false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <Flashcard
        card={card}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((f) => !f)}
        accentColor={accentColor}
        categoryLabel={categoryLabel}
      />

      {!isFlipped && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-s01g9-mono tracking-wider"
          style={{ color: `${accentColor}55` }}
        >
          Click card or press Space to flip
        </motion.p>
      )}
    </div>
  );
}

export default SingleFlashcard;
