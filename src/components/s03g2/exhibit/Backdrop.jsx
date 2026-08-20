import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from 'framer-motion';
import BurnBackdrop from './BurnBackdrop.jsx';
import SystemNoise from './SystemNoise.jsx';
import StarField from '../background/StarField.jsx';
import { useExhibit } from './ExhibitState.jsx';
import styles from './Backdrop.module.css';

// All ambient layers, fixed behind content, subscribing to the one instability value.
// Two-phase backdrop (specs/behaviors/hull-backdrop.md): the space void + StarField is
// the Launch phase; on descent (leaving Launch, activeIndex ≥ 1) it crossfades to the
// burn backdrop, which holds for scenes 1–5. The burn backdrop renders a stage (1–4)
// driven by each section's interactive state.
export default function Backdrop({ activeIndex = 0, burnStage = 1 }) {
  const { instability } = useExhibit();
  const reduced = useReducedMotion();

  // descent: 0 on Launch (space), 1 past Launch (hull). Crossfade driven by the deck's
  // active scene — not a scroll offset.
  const pastLaunch = activeIndex >= 1;
  const descent = useMotionValue(pastLaunch ? 1 : 0);
  const spaceOpacity = useTransform(descent, (v) => 1 - v);

  useEffect(() => {
    const target = pastLaunch ? 1 : 0;
    if (reduced) {
      descent.set(target); // instant swap at the Launch boundary
      return undefined;
    }
    const anim = animate(descent, target, {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
    });
    return () => anim.stop();
  }, [pastLaunch, reduced, descent]);

  // Keep the twinkling StarField mounted only through the Launch phase + the crossfade
  // out, so it costs nothing on scenes 1–5 (specs/behaviors/hull-backdrop.md).
  const [starsMounted, setStarsMounted] = useState(!pastLaunch);
  useEffect(() => {
    if (!pastLaunch) {
      setStarsMounted(true);
      return undefined;
    }
    const id = setTimeout(() => setStarsMounted(false), reduced ? 0 : 750);
    return () => clearTimeout(id);
  }, [pastLaunch, reduced]);

  const amber = useTransform(instability, [0.15, 0.55, 0.9], [0, 0.32, 0.18]);
  const red = useTransform(instability, [0.55, 1], [0, 0.8]);
  const wash = useTransform(instability, [0.6, 0.85, 1], [0, 0.3, 0.5]);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <motion.div className={styles.hullWrap} style={{ opacity: descent }}>
        <BurnBackdrop stage={burnStage} />
      </motion.div>
      <motion.div className={`${styles.layer} ${styles.space}`} style={{ opacity: spaceOpacity }}>
        {starsMounted && <StarField count={70} />}
      </motion.div>
      <motion.div className={`${styles.layer} ${styles.amber}`} style={{ opacity: amber }} />
      <motion.div className={`${styles.layer} ${styles.red}`} style={{ opacity: red }} />
      <SystemNoise />
      <motion.div className={`${styles.layer} ${styles.wash}`} style={{ opacity: wash }} />
    </div>
  );
}
