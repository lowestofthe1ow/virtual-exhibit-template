import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from 'framer-motion';

/**
 * One instability value drives everything (specs/principles.md).
 * The master `instability` in [0,1] = max(ambient scene-driven, event-driven).
 * Consumers subscribe to motion values directly, so rapid changes (slider, scrub)
 * never re-render the section canvases.
 */
const ExhibitContext = createContext(null);

// Ambient instability per scene index — the deck (specs/behaviors/scene-deck.md) is
// now the ambient driver, replacing the old scroll map. Same curve *shape*: calm
// intro, rising into Register Room / SRI, back to 0 (clean black calm) at Postmortem.
// The big spike at the wrap and the timeline scrub are event-driven, layered on top.
// Order matches SCENES: Launch, Mission Briefing, About Binary, Register Room,
// Dual-SRI, Postmortem.
const SCENE_INSTABILITY = [0.04, 0.1, 0.16, 0.55, 0.62, 0.0];

export function ExhibitProvider({ activeIndex = 0, children }) {
  const prefersReduced = useReducedMotion();

  // Ambient channel: a motion value eased toward the active scene's target on each
  // scene change (snapped under reduced motion).
  const sceneInstability = useMotionValue(SCENE_INSTABILITY[0]);
  const eventInstability = useMotionValue(0);
  const instability = useTransform(
    [sceneInstability, eventInstability],
    ([a, b]) => Math.max(a, b)
  );

  const ambientAnim = useRef(null);
  useEffect(() => {
    const target = SCENE_INSTABILITY[activeIndex] ?? 0;
    if (ambientAnim.current) {
      ambientAnim.current.stop();
      ambientAnim.current = null;
    }
    if (prefersReduced) {
      // Designed reduced-motion path: snap ambient, no eased escalation.
      sceneInstability.set(target);
      return undefined;
    }
    ambientAnim.current = animate(sceneInstability, target, {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
    });
    return () => {
      ambientAnim.current?.stop();
      ambientAnim.current = null;
    };
  }, [activeIndex, prefersReduced, sceneInstability]);

  // Live register snapshot as a motion value (velocity 0..65535). The HUD subscribes
  // without forcing provider re-renders.
  const velocityMV = useMotionValue(0);

  // Burn stage (1–4) driven by each section's interactive state. The BurnBackdrop
  // subscribes to this without forcing provider re-renders.
  const burnStageMV = useMotionValue(1);

  const eventAnim = useRef(null);

  const value = useMemo(() => {
    const stopEventAnim = () => {
      if (eventAnim.current) {
        eventAnim.current.stop();
        eventAnim.current = null;
      }
    };

    return {
      instability,
      // Kept under the old name so subscribers (HUD, sections) are unchanged; it is
      // now the scene-driven ambient channel, not a scroll transform.
      scrollInstability: sceneInstability,
      eventInstability,
      velocityMV,
      burnStageMV,
      reducedMotion: !!prefersReduced,

      /** Set the burn stage (1–4) for the BurnBackdrop. */
      setBurnStage(n) {
        burnStageMV.set(Math.max(1, Math.min(4, Math.round(n))));
      },

      /** Transient overflow spike: jump to `peak`, decay to 0 over `duration` s. */
      spike(peak = 1, duration = 0.8) {
        stopEventAnim();
        if (prefersReduced) {
          // Designed reduced-motion path: a brief flat flash, no decay animation.
          eventInstability.set(peak);
          eventAnim.current = animate(eventInstability, 0, {
            duration: 0.24,
            delay: 0.18,
            ease: 'linear',
          });
          return;
        }
        eventInstability.set(peak);
        eventAnim.current = animate(eventInstability, 0, {
          duration,
          ease: [0.2, 0.7, 0.3, 1],
        });
      },

      /** Hold the event channel at a level (immediate). */
      setEvent(v) {
        stopEventAnim();
        eventInstability.set(Math.max(0, Math.min(1, v)));
      },

      /** Ease the event channel to a level (the timeline scrubber uses this). */
      easeEventTo(v, duration = 0.45) {
        stopEventAnim();
        const target = Math.max(0, Math.min(1, v));
        eventAnim.current = animate(eventInstability, target, {
          duration: prefersReduced ? 0 : duration,
          ease: 'easeOut',
        });
      },

      /** Ease the event channel back to 0 (scrubber release). */
      releaseEvent(duration = 0.6) {
        stopEventAnim();
        eventAnim.current = animate(eventInstability, 0, {
          duration: prefersReduced ? 0 : duration,
          ease: 'easeOut',
        });
      },
    };
  }, [instability, sceneInstability, eventInstability, velocityMV, burnStageMV, prefersReduced]);

  return (
    <ExhibitContext.Provider value={value}>{children}</ExhibitContext.Provider>
  );
}

export function useExhibit() {
  const ctx = useContext(ExhibitContext);
  if (!ctx) {
    throw new Error('useExhibit must be used within <ExhibitProvider>');
  }
  return ctx;
}
