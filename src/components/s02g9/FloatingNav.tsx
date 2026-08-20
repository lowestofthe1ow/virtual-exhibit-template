import React from 'react';

interface FloatingNavProps {
  onPrevious: () => void;
  onNext: () => void;
  onHome: () => void;
  currentIndex: number;
  totalRooms: number;
}

const FloatingNav: React.FC<FloatingNavProps> = ({
  onPrevious,
  onNext,
  onHome,
  currentIndex,
  totalRooms,
}) => {
  return (
    <div className="floating-ui floating-nav glass-panel">
      <button onClick={onPrevious} aria-label="Previous room">
        ← Prev
      </button>
      <span className="room-counter">
        {currentIndex + 1} / {totalRooms}
      </span>
      <button onClick={onNext} aria-label="Next room">
        Next →
      </button>
      <button onClick={onHome} aria-label="Home">
        ⌂ Home
      </button>
    </div>
  );
};

export default FloatingNav;