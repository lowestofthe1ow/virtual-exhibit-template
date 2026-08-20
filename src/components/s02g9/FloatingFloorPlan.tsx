import React, { useState } from 'react';
import { rooms } from '../../data/s02g9/rooms.ts';

interface FloatingFloorPlanProps {
  currentRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

const FloatingFloorPlan: React.FC<FloatingFloorPlanProps> = ({
  currentRoomId,
  onSelectRoom,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-ui floating-floorplan glass-panel">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕ Close' : '▦ Floor Plan'}
      </button>

      {isOpen && (
        <div className="floorplan-content animate-fade-in-up">
          <div className="floorplan-grid">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onSelectRoom(room.id);
                  setIsOpen(false);
                }}
                className={`room-tile ${room.id === currentRoomId ? 'active' : ''}`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingFloorPlan;