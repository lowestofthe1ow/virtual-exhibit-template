/**
 * ExhibitViewer.jsx
 *
 * Center panel component that displays the selected timeline node's
 * OS screenshot image and description. Shows a placeholder when no
 * node is selected.
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ExhibitViewer({ node }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);
  if (!node) {
    return (
      <div className="exhibit-placeholder">
        <div className="exhibit-placeholder__icon">🖥️</div>
        <div className="exhibit-placeholder__text">Tap a node to start</div>
        <div className="exhibit-placeholder__sub">
          Select a Windows version from the timeline to view its details
        </div>
      </div>
    );
  }

  return (
    <div className="exhibit-viewer__content" key={node.id}>
      {node.screenshotSrc && (
        <div className="exhibit-viewer__image-wrap">
          <img
            src={node.screenshotSrc}
            alt={`${node.title} screenshot`}
            className="exhibit-viewer__image exhibit-viewer__image--clickable"
            onClick={() => setIsFullscreen(true)}
            title="Click to view full screen"
          />
        </div>
      )}
      {node.screenshotSrc && (
        <div className="exhibit-viewer__fullscreen-hint">Tap to fullscreen.</div>
      )}
      <h3 className="exhibit-viewer__node-title">{node.title}</h3>
      <p className="exhibit-viewer__description">{node.content}</p>

      {isFullscreen && node.screenshotSrc && typeof document !== "undefined" && createPortal(
        <div 
          className="exhibit-viewer__fullscreen-overlay"
          onClick={() => setIsFullscreen(false)}
        >
          <button 
            className="exhibit-viewer__fullscreen-close"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            ×
          </button>
          <img
            src={node.screenshotSrc}
            alt={`${node.title} fullscreen`}
            className="exhibit-viewer__fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
