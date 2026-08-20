import React, { useEffect, useState } from 'react';
import Navigation from './Navigation.tsx';
import CipherLab from './CipherLab.tsx';
import Timeline from './Timeline.tsx';
import Challenge from './Challenge.tsx';
import MuseumMap from './MuseumMap.tsx';
import RoomViewerFullscreen from './RoomViewerFullscreen.tsx';
import ExhibitModal from './ExhibitModal.tsx';
import LoadingScreen from './LoadingScreen.tsx';
import type { RoomHotspot } from '../../data/s02g9/rooms.ts';

const App: React.FC = () => {
  // section state used as "intent" to open panels (not to navigate away)
  const [activeSection, setActiveSection] = useState<'panorama' | 'map' | 'simulator' | 'timeline' | 'challenge'>('panorama');
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isLoadingPanorama, setIsLoadingPanorama] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState<RoomHotspot | null>(null);

  // Controlled visibility state for panels so nav tabs can open them
  const [mapVisible, setMapVisible] = useState(false);
  const [cipherVisible, setCipherVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [challengeVisible, setChallengeVisible] = useState(false);

  const closeAllPanels = () => {
    setMapVisible(false);
    setCipherVisible(false);
    setTimelineVisible(false);
    setChallengeVisible(false);
  };

  const openPanel = (section: 'simulator' | 'timeline' | 'challenge' | 'map') => {
    setActiveSection(section);
    setMapVisible(section === 'map');
    setCipherVisible(section === 'simulator');
    setTimelineVisible(section === 'timeline');
    setChallengeVisible(section === 'challenge');
  };

  const handleOpenPanorama = (roomId?: string) => {
    closeAllPanels();
    setIsLoadingPanorama(true);
    setTimeout(() => {
      setActiveSection('panorama');
      if (roomId) setActiveRoom(roomId);
      setIsLoadingPanorama(false);
    }, 600);
  };

  const handleNavChange = (section: 'simulator' | 'timeline' | 'challenge') => {
    openPanel(section);
  };

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
    closeAllPanels();
    setActiveSection('panorama');
  };

  const goBackToPanorama = () => {
    closeAllPanels();
    setActiveSection('panorama');
  };

  // The path this receives is always a bare filename living directly in
  // this exhibit's own public/s02g9/ (see CipherLab.tsx's museum-open-exhibit
  // dispatches) - never a full site-relative URL, so the merged site's own
  // base plus this exhibit's slug always need to be spliced in ahead of it.
  // (Merge note: this literal-filename shape is invisible to the automated
  // integration rewriter, unlike the /-prefixed literals in data/rooms.ts,
  // which the rewriter does rewrite correctly.)
  const resolveAssetPath = (path?: string) => {
    if (!path) return undefined;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

    return `${base}/s02g9${normalizedPath}`;
  };

  useEffect(() => {
    const handleOpenExhibit = (event: Event) => {
      const customEvent = event as CustomEvent<{ exhibitKey?: string; title?: string; image?: string }>;
      const exhibitKey = customEvent.detail?.exhibitKey;

      if (!exhibitKey) return;

      setActiveExhibit({
        id: `app-${exhibitKey}`,
        type: 'info',
        title: customEvent.detail?.title ?? exhibitKey,
        description: `Open the ${customEvent.detail?.title ?? exhibitKey} experience.`,
        exhibitKey,
        image: resolveAssetPath(customEvent.detail?.image),
      });
    };

    window.addEventListener('museum-open-exhibit', handleOpenExhibit);
    return () => window.removeEventListener('museum-open-exhibit', handleOpenExhibit);
  }, []);

  const showPanelShell = mapVisible || cipherVisible || timelineVisible || challengeVisible;

  return (
    <>
      <LoadingScreen isVisible={isLoadingPanorama} />

      {activeSection === 'panorama' && (
        <RoomViewerFullscreen
          roomId={activeRoom ?? 'lobby'}
          onReturnToMap={() => openPanel('map')}
          onOpenSection={(section) => openPanel(section)}
        />
      )}

      <Navigation
        activeSection={activeSection}
        onChange={(section) => {
          if (section === 'simulator' || section === 'timeline' || section === 'challenge') {
            handleNavChange(section);
          }
        }}
      />

      {showPanelShell && (
        <div className="panel-shell" role="dialog" aria-label="Museum content panel">
          <div className="panel-shell__topbar">
            <button type="button" className="panel-shell__back" onClick={goBackToPanorama}>
              ← Back to exhibit
            </button>
          </div>

          <div className="panel-shell__content">
            {mapVisible && <MuseumMap onRoomSelect={handleRoomSelect} />}
            {cipherVisible && <CipherLab />}
            {timelineVisible && <Timeline />}
            {challengeVisible && <Challenge />}
          </div>
        </div>
      )}

      {activeExhibit && (
        <ExhibitModal
          hotspot={activeExhibit}
          onClose={() => setActiveExhibit(null)}
        />
      )}
    </>
  );
};

export default App;

// hi