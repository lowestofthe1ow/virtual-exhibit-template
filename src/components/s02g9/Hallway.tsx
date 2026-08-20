import React from 'react';

export interface HallwayProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Hallway: React.FC<HallwayProps> = ({ x, y, width, height }) => {
  return (
    <div
      className="museum-hallway"
      style={{ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` }}
      aria-hidden="true"
    />
  );
};

export default Hallway;
