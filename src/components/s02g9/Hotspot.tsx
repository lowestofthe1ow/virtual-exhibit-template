import React from 'react';
import type { RoomHotspot } from '../../data/s02g9/rooms.ts';

interface HotspotProps {
  hotspot: RoomHotspot;
  onSelect: (hotspot: RoomHotspot) => void;
}

const Hotspot: React.FC<HotspotProps> = ({ hotspot, onSelect }) => {
  const left = Math.min(92, Math.max(8, hotspot.x ?? 50));
  const top = Math.min(92, Math.max(8, hotspot.y ?? 50));

  return (
    <div
      className="panorama-hotspot-wrapper"
      style={{
        left: `${left}%`,
        top: `${top}%`,
      }}
    >
      <button
        type="button"
        className="panorama-hotspot"
        onClick={() => onSelect(hotspot)}
        aria-label={hotspot.title ?? 'Exhibit hotspot'}
        title={hotspot.title ?? 'Exhibit hotspot'}
      >
        <span>+</span>
      </button>
      {hotspot.title ? <span className="panorama-hotspot__label">{hotspot.title}</span> : null}
    </div>
  );
};

export default Hotspot;
