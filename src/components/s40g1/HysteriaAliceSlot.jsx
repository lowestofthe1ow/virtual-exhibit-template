// src/components/HysteriaAliceSlot.jsx
import React from 'react';

// Use public paths (images directly in public folder)
const memoryImages = {
  'Teacup': '/Teacup.png',
  'Knife': '/Knife.png',
  'Broken Knife': '/Broken Knife.png',
  'Top-Hat': '/Top-Hat.png',
  'Broken Top-Hat': '/Broken Top-Hat.png',
  'Clock': '/Clock.png',
  'Broken Clock': '/Broken Clock.png',
  'Key': '/Key.png',
  'Broken Key': '/Broken Key.png',
  'Broken Mirror': '/Broken Mirror.png',
  'Broken Teacup': '/Broken Teacup.png',
};

const HysteriaAliceSlot = ({ slot, isSelected, onSelect }) => {
  const safeSlot = slot || { state: 'empty', data: null };

  const stateClass =
    safeSlot.state && safeSlot.state !== 'empty'
      ? `state-${safeSlot.state}`
      : 'state-empty';

  const getImageSrc = () => {
    if (!safeSlot.data || safeSlot.state === 'empty') {
      return null;
    }
    return memoryImages[safeSlot.data] || null;
  };

  const imageSrc = getImageSrc();

  const getStateLabel = () => {
    if (safeSlot.state === 'empty') return '—';
    if (safeSlot.state === 'e') return 'E';
    if (safeSlot.state === 's') return 'S';
    if (safeSlot.state === 'm') return 'M';
    if (safeSlot.state === 'i') return 'I';
    return '—';
  };

  return (
    <div
      className={`memory-slot ${stateClass} ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="slot-content">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={safeSlot.data || 'Memory'}
            className="memory-image"
          />
        ) : (
          <span className="slot-empty-text">?</span>
        )}
        <span className="slot-state">[{getStateLabel()}]</span>
      </div>
    </div>
  );
};

export default HysteriaAliceSlot;