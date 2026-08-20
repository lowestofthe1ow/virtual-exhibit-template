import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Howl } from "howler";

// maps node sizes to CSS values
const nodeSizes = {
  large: "timeline-node--large",
  medium: "timeline-node--medium",
  small: "timeline-node--small",
};

export default function Timeline({ nodes = [], onNodeSelect, activeNodeId }) {
  const soundRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });

  // useEffect to clean up the sound when the component unmounts, stops and unloads
  useEffect(
    () => () => {
      soundRef.current?.stop();
      soundRef.current?.unload();
      soundRef.current = null;
    },
    [],
  );

  // function to play the sound of a node
  // stops and unloads any previous sound before playing the new one
  function playNodeSound(src) {
    if (!src) return;

    soundRef.current?.stop();
    soundRef.current?.unload();

    // creates a new howl instance for the new sound
    const sound = new Howl({
      src: [src],
      html5: true,  
      preload: true, // preloads the sound to reduce latency
      onend: () => { // unloads sound when it ends
        sound.unload();
        if (soundRef.current === sound) { // clears reference to sound if current sound
          soundRef.current = null;
        }
      },
      onstop: () => { // unloads sound when it stops
        sound.unload();
        if (soundRef.current === sound) {
          soundRef.current = null;
        }
      },
      onloaderror: () => { // unloads sound if error when loading
        if (soundRef.current === sound) {
          soundRef.current = null;
        }
      },
      onplayerror: () => { // unloads sound if error when playing
        if (soundRef.current === sound) {
          soundRef.current = null;
        }
      },
    });

    soundRef.current = sound;
    sound.play();
  }

  // Tooltip mouse handlers
  const handleMouseEnter = useCallback((e, node) => {
    setTooltip({ visible: true, text: node.title, x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);


  // renders the actual timeline + nodes
  return (
    <section className="timeline-shell" aria-label="timeline">
      <div className="timeline-track">
        {/* renders each node in the timeline. */}
        {nodes.map((node, index) => {
          // determines the size of the node based on its size property
          const sizeClass = nodeSizes[node.size] ?? nodeSizes.medium;
          const isActive = activeNodeId === node.id;

          return (
            // renders a single node in the timeline
            <div key={node.id} className={`timeline-item ${isActive ? "timeline-item--active" : ""}`}>
              <button
                type="button"
                className={`timeline-node ${sizeClass}`}
                onClick={() => {
                  playNodeSound(node.soundSrc);
                  if (onNodeSelect) onNodeSelect(node);
                }}
                onMouseEnter={(e) => handleMouseEnter(e, node)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                // below are accessibility attributes for nodes
                aria-label={`View details for ${node.title}`}
                aria-pressed={isActive}
              >
                <span
                  className={`timeline-node__dot ${node.imageSrc ? "timeline-node__dot--with-image" : ""}`}
                  aria-hidden="true"
                >
                  {/* renders the image inside the node, if provided */}
                  {node.imageSrc && (
                    <img
                      src={node.imageSrc}
                      alt={node.imageAlt ?? `${node.title} preview image`}
                      className="timeline-node__img"
                    />
                  )}
                </span>
              </button>
              <span className="timeline-node__title">{node.title}</span>
            </div>
          );
        })}
      </div>

      {/* Cursor-following tooltip */}
      <div
        className={`timeline-tooltip ${tooltip.visible ? "is-visible" : ""}`}
        style={{ left: tooltip.x, top: tooltip.y }}
      >
        {tooltip.text}
      </div>
    </section>
  );
}
