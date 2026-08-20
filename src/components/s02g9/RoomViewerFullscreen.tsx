import React, { useEffect, useMemo, useState } from 'react';
import PanoramaViewer from './PanoramaViewer.tsx';
import InfoPanel from './InfoPanel.tsx';
import NavigationArrow from './NavigationArrow.tsx';
import FloatingHeader from './FloatingHeader.tsx';
import FloatingNav from './FloatingNav.tsx';
import FloatingFloorPlan from './FloatingFloorPlan.tsx';
import ExhibitModal from './ExhibitModal.tsx';
import { getRoomById, rooms, type RoomHotspot } from '../../data/s02g9/rooms.ts';

interface RoomViewerFullscreenProps {
  roomId?: string;
  onReturnToMap?: () => void;
  onOpenSection?: (section: 'simulator' | 'timeline' | 'challenge') => void;
}

const RoomViewerFullscreen: React.FC<RoomViewerFullscreenProps> = ({
  roomId = 'lobby',
  onReturnToMap,
  onOpenSection,
}) => {
  const [currentRoomId, setCurrentRoomId] = useState(roomId);
  const [activeHotspot, setActiveHotspot] = useState<RoomHotspot | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const currentRoom = useMemo(() => getRoomById(currentRoomId), [currentRoomId]);
  const currentIndex = rooms.findIndex((r) => r.id === currentRoomId);

  useEffect(() => {
    setCurrentRoomId(roomId);
    setActiveHotspot(null);
  }, [roomId]);

  useEffect(() => {
    const handleOpenExhibit = (event: Event) => {
      const customEvent = event as CustomEvent<{ exhibitKey?: string; title?: string }>; 
      const exhibitKey = customEvent.detail?.exhibitKey;
      if (!exhibitKey) return;

      setActiveHotspot({
        id: `event-${exhibitKey}`,
        type: 'info',
        title: customEvent.detail?.title ?? exhibitKey,
        description: `Open the ${customEvent.detail?.title ?? exhibitKey} experience.`,
        exhibitKey,
      });
    };

    window.addEventListener('museum-open-exhibit', handleOpenExhibit);
    return () => window.removeEventListener('museum-open-exhibit', handleOpenExhibit);
  }, []);

  const transitionToRoom = (newRoomId: string) => {
    setTransitioning(true);
    window.setTimeout(() => {
      setCurrentRoomId(newRoomId);
      setActiveHotspot(null);
      setTransitioning(false);
    }, 600);
  };

  const handleHotspotSelect = (hotspot: RoomHotspot) => {
    if (hotspot.type === 'navigation' && hotspot.target) {
      transitionToRoom(hotspot.target);
      return;
    }

    if (hotspot.type === 'info' && hotspot.exhibitKey === 'timeline') {
      onOpenSection?.('timeline');
      return;
    }

    // For info / simulator hotspots: open the modal overlay
    setActiveHotspot(hotspot);
  };

  const goToPreviousRoom = () => {
    const previousIndex = (currentIndex - 1 + rooms.length) % rooms.length;
    transitionToRoom(rooms[previousIndex].id);
  };

  const goToNextRoom = () => {
    const nextIndex = (currentIndex + 1) % rooms.length;
    transitionToRoom(rooms[nextIndex].id);
  };

  const goHome = () => {
    transitionToRoom('lobby');
  };

  return (
    <>
      <FloatingHeader
        roomName={currentRoom.name}
        roomDescription={`Room ${currentIndex + 1} of ${rooms.length}`}
        onReturnToMap={() => onReturnToMap?.()}
      />

      <div className={`room-viewer ${transitioning ? 'room-viewer--transitioning' : ''}`}>
        <PanoramaViewer
          panorama={currentRoom.panorama}
          hotspots={currentRoom.hotspots}
          onHotspotSelect={handleHotspotSelect}
          onBackToMap={() => onReturnToMap?.()}
          roomName={currentRoom.name}
        />
      </div>

      <FloatingNav
        onPrevious={goToPreviousRoom}
        onNext={goToNextRoom}
        onHome={goHome}
        currentIndex={currentIndex}
        totalRooms={rooms.length}
      />

      <FloatingFloorPlan currentRoomId={currentRoomId} onSelectRoom={(id) => transitionToRoom(id)} />

      {/* Exhibit modal overlays the panorama when an info hotspot is selected */}
      {activeHotspot && activeHotspot.type === 'info' && (
        <ExhibitModal
          hotspot={activeHotspot}
          onClose={() => {
            // Close modal and return focus to panorama. Camera state remains unchanged.
            setActiveHotspot(null);
          }}
        />
      )}

      {/* Navigation / panels (CipherLab, Timeline, Challenge) are no longer mounted here as auto-hide overlays.
          The Navigation component provides the single AutoHidePanel for menu access. */}
    </>
  );
};

export default RoomViewerFullscreen;