import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ExhibitProvider, useExhibit } from './exhibit/ExhibitState.jsx';
import Backdrop from './exhibit/Backdrop.jsx';
import { MetalFilters } from './exhibit/MetalSurface.jsx';
import TelemetryHUD from './exhibit/TelemetryHUD.jsx';
import { SCENES } from './exhibit/scenes.js';
import Launch from './sections/Launch.jsx';
import MissionBriefing from './sections/MissionBriefing.jsx';
import AboutBinary from './sections/AboutBinary.jsx';
import RegisterRoom from './sections/RegisterRoom.jsx';
import DualSRIFailure from './sections/DualSRIFailure.jsx';
import Postmortem from './sections/Postmortem.jsx';
import styles from './FatalConversion.module.css';

// The deck (specs/behaviors/scene-deck.md): six full-viewport scenes advanced one
// step per gesture. Order must match SCENES.
const SCENE_COMPONENTS = [
  Launch,
  MissionBriefing,
  AboutBinary,
  RegisterRoom,
  DualSRIFailure,
  Postmortem,
];
const LAST = SCENES.length - 1;

// Default burn stage per scene: Launch(0)=1, MissionBriefing(1)=1,
// AboutBinary(2)=1, RegisterRoom(3)=1, DualSRI(4)=1, Postmortem(5)=1.
// Interactive sections override this from within.
const DEFAULT_BURN_STAGE = [1, 1, 1, 1, 1, 1];

const WHEEL_THRESHOLD = 28; // accumulated deltaY before a wheel gesture steps
const LOCK_MS = 820; // safety unlock ≥ transition duration

// Directional slide + fade. Forward (dir=1): new scene rises from below, old exits up.
const variants = {
  enter: (dir) => ({ y: dir >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { y: '0%', opacity: 1 },
  exit: (dir) => ({ y: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
};

// Inner component that can access ExhibitContext (needs to be inside ExhibitProvider)
function ExhibitStage({ active, direction, lockRef, step, goTo, stageRef, onStageClick }) {
  const reduced = useReducedMotion();
  const { burnStageMV, setBurnStage } = useExhibit();
  const [burnStage, setBurnStageLocal] = useState(1);

  // Set default burn stage on scene change
  useEffect(() => {
    const defaultStage = DEFAULT_BURN_STAGE[active] ?? 1;
    setBurnStage(defaultStage);
  }, [active, setBurnStage]);

  // Subscribe to burnStageMV to sync to local state for passing to Backdrop
  useEffect(() => {
    const unsub = burnStageMV.on('change', (v) => {
      setBurnStageLocal(Math.round(v));
    });
    return unsub;
  }, [burnStageMV]);

  const Active = SCENE_COMPONENTS[active];

  return (
    <>
      <Backdrop activeIndex={active} burnStage={burnStage} />
      <MetalFilters />
      <div ref={stageRef} className={styles.stage} onClick={onStageClick}>
        <AnimatePresence
          custom={direction}
          mode="sync"
          initial={false}
          onExitComplete={() => {
            lockRef.current = false;
          }}
        >
          <motion.div
            key={active}
            className={styles.pane}
            data-active-pane
            custom={direction}
            variants={reduced ? undefined : variants}
            initial={reduced ? false : 'enter'}
            animate={reduced ? {} : 'center'}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : 'exit'}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Active />
          </motion.div>
        </AnimatePresence>
      </div>
      <TelemetryHUD activeIndex={active} onNavigate={goTo} />
    </>
  );
}

export default function FatalConversion() {
  const reduced = useReducedMotion();
  const [[active, direction], setActive] = useState([0, 0]);
  const lockRef = useRef(false);
  const stageRef = useRef(null);

  // Guarded transitions: one gesture = one step; input is locked mid-transition so a
  // fast flick never skips a scene.
  const step = useCallback((d) => {
    setActive(([cur]) => {
      if (lockRef.current) return [cur, 0];
      const next = Math.max(0, Math.min(LAST, cur + d));
      if (next === cur) return [cur, 0];
      lockRef.current = true;
      return [next, d > 0 ? 1 : -1];
    });
  }, []);

  const goTo = useCallback((idx) => {
    setActive(([cur]) => {
      if (lockRef.current) return [cur, 0];
      const next = Math.max(0, Math.min(LAST, idx));
      if (next === cur) return [cur, 0];
      lockRef.current = true;
      return [next, next > cur ? 1 : -1];
    });
  }, []);

  // Safety net: always release the lock shortly after a scene change even if
  // onExitComplete is missed (e.g. reduced-motion instant swaps).
  useEffect(() => {
    if (!lockRef.current) return undefined;
    const id = setTimeout(() => {
      lockRef.current = false;
    }, LOCK_MS);
    return () => clearTimeout(id);
  }, [active]);

  // Wheel → step, but only at the active pane's scroll boundary so a scene taller
  // than the viewport (small phones) keeps its own inner scroll first.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    let accum = 0;
    const onWheel = (e) => {
      const pane = el.querySelector('[data-active-pane]');
      const dir = Math.sign(e.deltaY);
      if (pane && dir !== 0) {
        const atTop = pane.scrollTop <= 0;
        const atBottom =
          pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 1;
        if ((dir > 0 && !atBottom) || (dir < 0 && !atTop)) {
          accum = 0;
          return; // let the pane scroll its own overflow
        }
      }
      e.preventDefault();
      if (lockRef.current) return;
      accum += e.deltaY;
      if (Math.abs(accum) >= WHEEL_THRESHOLD) {
        const d = Math.sign(accum);
        accum = 0;
        step(d);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [step]);

  // Keyboard. Vertical keys drive the deck; arrows/Home/End yield to a focused
  // control (the scrubber slider, the register range input) so they aren't hijacked.
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const inControl =
        t &&
        t.closest &&
        t.closest('input, textarea, select, [role="slider"], [contenteditable="true"]');
      switch (e.key) {
        case 'PageDown':
          e.preventDefault();
          step(1);
          break;
        case 'PageUp':
          e.preventDefault();
          step(-1);
          break;
        case 'ArrowDown':
          if (!inControl) {
            e.preventDefault();
            step(1);
          }
          break;
        case 'ArrowUp':
          if (!inControl) {
            e.preventDefault();
            step(-1);
          }
          break;
        case 'Home':
          if (!inControl) {
            e.preventDefault();
            goTo(0);
          }
          break;
        case 'End':
          if (!inControl) {
            e.preventDefault();
            goTo(LAST);
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, goTo]);

  // Touch swipe (vertical). Kept simple; the boundary nuance of wheel isn't needed
  // because scenes fit the viewport on the common phone sizes.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    let startY = null;
    const onStart = (e) => {
      startY = e.touches[0]?.clientY ?? null;
    };
    const onEnd = (e) => {
      if (startY == null) return;
      const dy = startY - (e.changedTouches[0]?.clientY ?? startY);
      if (Math.abs(dy) > 60 && !lockRef.current) step(Math.sign(dy));
      startY = null;
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [step]);

  // In-scene anchor links (e.g. Launch's "Begin descent") advance the deck instead
  // of trying to scroll to an id that no longer sits in the flow.
  const onStageClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const idx = SCENES.findIndex((s) => s.id === id);
    if (idx >= 0) {
      e.preventDefault();
      goTo(idx);
    }
  };

  return (
    <ExhibitProvider activeIndex={active}>
      <ExhibitStage
        active={active}
        direction={direction}
        lockRef={lockRef}
        step={step}
        goTo={goTo}
        stageRef={stageRef}
        onStageClick={onStageClick}
      />
    </ExhibitProvider>
  );
}
