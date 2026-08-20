import React from 'react';

export interface RoomProps {
  title: string;
  roomId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onRoomClick: (roomId: string) => void;
}

const Room: React.FC<RoomProps> = ({ title, roomId, x, y, width, height, onRoomClick }) => {
  return (
    <button
      type="button"
      className="museum-room"
      style={{ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` }}
      onClick={() => onRoomClick(roomId)}
      aria-label={`Open ${title}`}
    >
      <span className="museum-room__title">{title}</span>
    </button>
  );
};

export default Room;
