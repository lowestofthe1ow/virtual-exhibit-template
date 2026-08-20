import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import type { RoomHotspot } from '../../data/s02g9/rooms.ts';
import Hotspot from './Hotspot.tsx';

interface PanoramaViewerProps {
  panorama: string;
  hotspots: RoomHotspot[];
  onHotspotSelect: (hotspot: RoomHotspot) => void;
  onBackToMap: () => void;
  roomName: string;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ panorama, hotspots, onHotspotSelect, onBackToMap, roomName }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    setIsVisible(false);
    const viewer = new Viewer({
      container: containerRef.current,
      panorama,
      navbar: ['zoom', 'fullscreen'],
      mousewheel: true,
      touchmoveTwoFingers: true,
      caption: roomName,
      loadingTxt: 'Loading panorama…',
      plugins: []
    });

    viewerRef.current = viewer;

    const timer = window.setTimeout(() => setIsVisible(true), 180);

    return () => {
      window.clearTimeout(timer);
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [panorama, roomName]);

  return (
    <div className={`panorama-viewer ${isVisible ? 'panorama-viewer--visible' : ''}`}>
      <div className="panorama-viewer__topbar">
        <div className="panorama-viewer__room-name">{roomName}</div>
        <button type="button" className="panorama-viewer__map-button" onClick={onBackToMap}>
          Museum Map
        </button>
      </div>

      <div ref={containerRef} className="panorama-viewer__sphere" />

      <div className="panorama-viewer__hotspots">
        {hotspots.map((hotspot) => (
          <Hotspot key={hotspot.id} hotspot={hotspot} onSelect={onHotspotSelect} />
        ))}
      </div>

      <div className="panorama-viewer__controls">
        <button type="button" className="tour-control" onClick={() => onHotspotSelect(hotspots[0])}>
          Explore Room
        </button>
      </div>
    </div>
  );
};

export default PanoramaViewer;
