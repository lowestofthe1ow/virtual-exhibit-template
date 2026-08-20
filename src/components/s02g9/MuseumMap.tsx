import React, { useEffect, useRef } from 'react';
import Room from './Room.tsx';
import Hallway from './Hallway.tsx';
import '../../styles/s02g9/museum.css';

interface MuseumMapProps {
  onRoomSelect?: (roomId: string) => void;
}

type MuseumRoomConfig = {
  title: string;
  roomId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type MuseumHallwayConfig = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const museumRooms: MuseumRoomConfig[] = [
  { title: 'Entrance Lobby', roomId: 'lobby', x: 20, y: 40, width: 140, height: 90 },
  { title: 'Classical Ciphers', roomId: 'classical', x: 210, y: 40, width: 140, height: 90 },
  { title: 'Timeline of Cryptography', roomId: 'timeline', x: 400, y: 40, width: 140, height: 90 },
  { title: 'Enigma Machine Gallery', roomId: 'enigma', x: 590, y: 40, width: 140, height: 90 },
  { title: 'Rotor Machines Gallery', roomId: 'rotor', x: 780, y: 40, width: 140, height: 90 },
  { title: 'Modern Cryptography', roomId: 'modern', x: 970, y: 40, width: 140, height: 90 },
  { title: 'Bombe Gallery', roomId: 'bombe', x: 1160, y: 40, width: 140, height: 90 },
  { title: 'Colossus Gallery', roomId: 'colossus', x: 20, y: 160, width: 140, height: 90 },
  { title: 'Harvard Mark I Gallery', roomId: 'mark1', x: 210, y: 160, width: 140, height: 90 },
  { title: 'ENIAC Gallery', roomId: 'eniac', x: 400, y: 160, width: 140, height: 90 },
  { title: 'UNIVAC I Gallery', roomId: 'univac', x: 590, y: 160, width: 140, height: 90 },
  { title: 'Computing Concepts Gallery', roomId: 'concepts', x: 780, y: 160, width: 140, height: 90 },
  { title: 'Machine Comparison Center', roomId: 'comparison', x: 970, y: 160, width: 140, height: 90 },
  { title: 'Finale: Cipher to Silicon', roomId: 'finale', x: 1160, y: 160, width: 140, height: 90 },
];

const museumHallways: MuseumHallwayConfig[] = [
  { id: 'row-1', x: 210, y: 120, width: 20, height: 40 },
  { id: 'row-2', x: 210, y: 240, width: 20, height: 40 },
  { id: 'row-3', x: 210, y: 360, width: 20, height: 40 },
  { id: 'row-4', x: 420, y: 120, width: 20, height: 40 },
  { id: 'row-5', x: 420, y: 240, width: 20, height: 40 },
  { id: 'row-6', x: 420, y: 360, width: 20, height: 40 },
  { id: 'row-7', x: 630, y: 120, width: 20, height: 40 },
  { id: 'row-8', x: 630, y: 240, width: 20, height: 40 },
  { id: 'row-9', x: 630, y: 360, width: 20, height: 40 },
];

const MuseumMap: React.FC<MuseumMapProps> = ({ onRoomSelect }) => {
  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shellRef.current) {
      shellRef.current.scrollLeft = 0;
    }
  }, []);

  const handleRoomClick = (roomId: string) => {
    const matchingRoom = museumRooms.find((room) => room.roomId === roomId);
    const title = matchingRoom?.title ?? roomId;
    console.log(`Entering ${title}`);
    onRoomSelect?.(roomId);
  };

  return (
    <section className="museum-map-page active">
      <div className="museum-map-page__intro">
        <p className="museum-map-page__eyebrow">Interactive museum navigation</p>
        <h2 className="section-title">Museum Floor Plan</h2>
        <p className="section-description">
          Explore the museum from a top-down orientation before stepping into the 360° experience.
        </p>
      </div>

      <div className="museum-map-shell" ref={shellRef}>
        <div className="museum-floorplan" role="img" aria-label="Museum floor plan with connected exhibit rooms">
          {museumHallways.map((hallway) => (
            <Hallway key={hallway.id} x={hallway.x} y={hallway.y} width={hallway.width} height={hallway.height} />
          ))}

          {museumRooms.map((room) => (
            <Room
              key={room.roomId}
              title={room.title}
              roomId={room.roomId}
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              onRoomClick={handleRoomClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MuseumMap;
