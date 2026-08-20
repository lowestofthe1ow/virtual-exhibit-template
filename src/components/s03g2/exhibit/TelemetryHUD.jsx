import { useState } from 'react';
import { motion, useTransform, useMotionValueEvent } from 'framer-motion';
import { useExhibit } from './ExhibitState.jsx';
import { SCENES } from './scenes.js';
import { toSigned16, hex16 } from './registerMath.js';
import MetalSurface from './MetalSurface.jsx';
import styles from './TelemetryHUD.module.css';

// Persistent instrument console: scene + mission clock, live register snapshot, and
// a SYSTEM INTEGRITY meter fed by the one instability value (specs/screens/exhibit.md).
export default function TelemetryHUD({ activeIndex = 0, onNavigate }) {
  const { velocityMV } = useExhibit();

  const [vel, setVel] = useState(0);

  useMotionValueEvent(velocityMV, 'change', (v) =>
    setVel((prev) => (prev === Math.round(v) ? prev : Math.round(v)))
  );

  const signed = toSigned16(vel);
  const scene = SCENES[activeIndex] ?? SCENES[0];

  // Nav dots transition the deck to a scene (specs/behaviors/scene-deck.md).
  const go = (i) => onNavigate?.(i);

  return (
    <div className={styles.hud} role="region" aria-label="Mission telemetry">
      <MetalSurface style={{ '--metal-grain': 0.24, '--metal-sheen': 0.4, '--metal-back-blur': '10px' }} />
      <div className={styles.cell}>
        <span className={styles.k}>Scene {String(activeIndex + 1).padStart(2, '0')}</span>
        <span className={styles.scene}>{scene.name}</span>
      </div>

      <div className={`${styles.cell} ${styles.center}`}>
        <div className={styles.register}>
          <span className={styles.k}>SRI H-Vel</span>
          <span className={styles.hex}>{hex16(vel)}</span>
          <span className={`${styles.dec} ${signed < 0 ? styles.neg : styles.pos}`}>
            {signed >= 0 ? '+' : ''}
            {signed}
          </span>
        </div>
      </div>

      <div className={`${styles.cell} ${styles.right}`}>
        <div className={styles.dots}>
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => go(i)}
              aria-label={`Go to ${s.name}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
