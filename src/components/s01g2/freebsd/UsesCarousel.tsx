import { useState, useEffect, useCallback } from 'react';

interface CardData {
  logoSrc: string;
  logoAlt: string;
  description: string;
}

interface UsesCarouselProps {
  cards: CardData[];
}

export default function UsesCarousel({ cards }: UsesCarouselProps) {
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCard(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Track is duplicated so the CSS animation loops seamlessly
  const items = [...cards, ...cards];

  return (
    <>
      {/* ── Marquee ── */}
      <div className="marquee-container">
        <div className="marquee-track">
          {items.map((card, i) => (
            <button
              key={i}
              className="marquee-item"
              onClick={() => setActiveCard(card)}
              aria-label={`Learn more about ${card.logoAlt.replace(' Logo', '')}`}
            >
              <img src={card.logoSrc} alt={card.logoAlt} draggable={false} />
            </button>
          ))}
        </div>
      </div>

      <p className="marquee-hint">Click a logo to learn more</p>

      {/* ── Modal ── */}
      {activeCard && (
        <div className="uses-modal-overlay" onClick={() => setActiveCard(null)}>
          <div className="uses-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="uses-modal-close"
              onClick={() => setActiveCard(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="uses-modal-logo">
              <img src={activeCard.logoSrc} alt={activeCard.logoAlt} />
            </div>
            <p className="uses-modal-text">{activeCard.description}</p>
          </div>
        </div>
      )}
    </>
  );
}
