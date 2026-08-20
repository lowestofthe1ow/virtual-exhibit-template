import React from 'react';

interface NavigationArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const NavigationArrow: React.FC<NavigationArrowProps> = ({ direction, onClick }) => {
  return (
    <button type="button" className={`tour-nav-arrow tour-nav-arrow--${direction}`} onClick={onClick} aria-label={`${direction} navigation`}>
      {direction === 'left' ? '←' : '→'}
    </button>
  );
};

export default NavigationArrow;
