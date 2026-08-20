import { useState, useEffect, useRef, useCallback } from 'react';
import { useMotionValue, animate } from 'framer-motion';
import clsx from 'clsx';
import Counter from '../reactbits/Counter.jsx';
import FuzzyText from '../reactbits/FuzzyText.jsx';
import Scene, { sceneStyles } from './Scene.jsx';
import { useExhibit } from '../exhibit/ExhibitState.jsx';
import {
  pattern16,
  toSigned16,
  bits16,
  hex16,
  INT16_MAX,
} from '../exhibit/registerMath.js';
import styles from './RegisterRoom.module.css';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function BitCell({ bit, isSign, overflowed, reducedMotion }) {
  const [pulse, setPulse] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reducedMotion) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 220);
    return () => clearTimeout(t);
  }, [bit, reducedMotion]);

  return (
    <span
      className={clsx(
        styles.bit,
        isSign && styles.signBit,
        bit === '1' && styles.on,
        isSign && bit === '1' && overflowed && styles.signOn,
        pulse && styles.pulse
      )}
    >
      {bit}
    </span>
  );
}

export default function RegisterRoom() {
  const { velocityMV, spike, reducedMotion, setBurnStage } = useExhibit();
  const [velocity, setVelocity] = useState(0);
  const prevOverflow = useRef(false);
  const driver = useMotionValue(0);
  const replayRef = useRef(null);

  const pattern = pattern16(velocity);
  const signed = toSigned16(velocity);
  const bits = bits16(velocity);
  const hex = hex16(velocity);
  const overflowed = pattern >= 32768;
  const magnitude = Math.abs(signed);
  const atMax = pattern === INT16_MAX;

  const apply = useCallback(
    (v) => {
      const nv = clamp(Math.round(v), 0, 65535);
      setVelocity(nv);
      velocityMV.set(nv);
    },
    [velocityMV]
  );

  // Fire the overflow wrap exactly on the low->high sign-bit crossing. The wrap reads
  // through the red wash / Noise spike / colour flip — no panel shake (spec ①).
  useEffect(() => {
    const of = pattern16(velocity) >= 32768;
    if (of && !prevOverflow.current) {
      spike(1, 0.8);
    }
    prevOverflow.current = of;
  }, [velocity, spike]);

  // Map velocity to burn stage: 0–16383 → stage 1, 16384–32767 → stage 2,
  // overflow (≥32768) → stage 4 (no stage 3; the overflow IS the catastrophe).
  useEffect(() => {
    const p = pattern16(velocity);
    const stage = p <= 16383 ? 1 : p <= 32767 ? 2 : 4;
    setBurnStage(stage);
  }, [velocity, setBurnStage]);

  const stopReplay = useCallback(() => {
    if (replayRef.current) {
      replayRef.current.stop();
      replayRef.current = null;
    }
  }, []);

  useEffect(() => () => stopReplay(), [stopReplay]);

  const onSlider = (e) => {
    stopReplay();
    apply(Number(e.target.value));
  };

  const replay = () => {
    stopReplay();
    apply(32200);
    if (reducedMotion) {
      apply(32760);
      setTimeout(() => apply(40000), 260);
      return;
    }
    driver.set(32200);
    replayRef.current = animate(driver, 41000, {
      duration: 2.8,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => apply(v),
      onComplete: () => {
        replayRef.current = null;
      },
    });
  };

  const nibbles = [
    bits.slice(0, 4),
    bits.slice(4, 8),
    bits.slice(8, 12),
    bits.slice(12, 16),
  ];
  const pct = (velocity / 65535) * 100;

  return (
    <Scene id="register-room">
      <div className={styles.intro}>
        <h2 className={sceneStyles.title}>One register, two meanings</h2>
        <p className={sceneStyles.lede}>
          The SRI stored horizontal velocity as a 64-bit float, then cast it into a
          signed 16-bit integer for alignment code reused from Ariane 4. Drag the
          velocity up and watch the register fill. At{' '}
          <span className={styles.inlineMono}>32,767</span> there is exactly one bit of
          headroom left — the sign bit.
        </p>
      </div>

      <div
        className={clsx(styles.viz, overflowed && styles.vizBad)}
      >
        <div className={styles.readout}>
          <span
            className={clsx(styles.sign, overflowed ? styles.signNeg : styles.signPos)}
            aria-hidden="true"
          >
            {signed < 0 ? '−' : '+'}
          </span>
          <div className={styles.counterWrap}>
            <Counter
              value={magnitude}
              places={[10000, 1000, 100, 10, 1]}
              fontSize={64}
              gap={1}
              horizontalPadding={0}
              fontWeight={700}
              textColor={overflowed ? '#EF4444' : '#22C55E'}
              gradientFrom="transparent"
              gradientTo="transparent"
              gradientHeight={0}
            />
          </div>
          <span className="sr-only">Signed 16-bit value: {signed}</span>
          <div className={styles.readoutMeta}>
            <span className={styles.hex}>{hex}</span>
            {atMax && <span className={styles.maxBadge}>MAX POSITIVE</span>}
            {overflowed &&
              (reducedMotion ? (
                <span className={styles.overflowStatic}>OVERFLOW</span>
              ) : (
                <FuzzyText
                  fontFamily='"Chakra Petch", sans-serif'
                  fontSize="clamp(1.3rem, 3.4vw, 2rem)"
                  fontWeight={700}
                  color="#EF4444"
                  enableHover={false}
                  glitchMode
                  glitchInterval={560}
                  glitchDuration={150}
                  fuzzRange={22}
                  baseIntensity={0.32}
                  className={styles.overflowFuzz}
                >
                  OVERFLOW
                </FuzzyText>
              ))}
          </div>
        </div>

        <div
          className={styles.register}
          role="img"
          aria-label={`16-bit register ${bits}, sign bit ${bits[0]}`}
        >
          {nibbles.map((nib, ni) => (
            <span key={ni} className={styles.nibble}>
              {nib.split('').map((b, bi) => {
                const idx = ni * 4 + bi;
                return (
                  <BitCell
                    key={idx}
                    bit={b}
                    isSign={idx === 0}
                    overflowed={overflowed}
                    reducedMotion={reducedMotion}
                  />
                );
              })}
            </span>
          ))}
        </div>
        <div className={styles.bitLegend} aria-hidden="true">
          <span className={styles.legendSign}>▲ bit 15 — sign</span>
          <span>bit 0 — LSB ▲</span>
        </div>

        <div className={styles.cast}>
          <div className={styles.castBox}>
            <span className={styles.castLabel}>64-bit source · BH</span>
            <span className={styles.castValue}>{velocity.toLocaleString()}</span>
            <span className={styles.castType}>double — 64-bit float</span>
          </div>
          <div className={clsx(styles.castArrow, overflowed && styles.castArrowBad)}>
            <span className={styles.castOp}>
              {overflowed ? 'operand overflow' : 'cast → int16'}
            </span>
            <svg width="46" height="14" viewBox="0 0 46 14" fill="none" aria-hidden="true">
              <path d="M0 7h40m0 0l-6-5m6 5l-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={clsx(styles.castBox, overflowed && styles.castBoxBad)}>
            <span className={styles.castLabel}>16-bit destination</span>
            <span className={clsx(styles.castValue, styles.mono)}>
              {signed.toLocaleString()}
            </span>
            <span className={styles.castType}>int16_t — signed</span>
          </div>
        </div>

        <div className={styles.control}>
          <div className={styles.sliderWrap}>
            <input
              className={styles.slider}
              type="range"
              min="0"
              max="65535"
              step="1"
              value={velocity}
              onChange={onSlider}
              style={{ '--pct': `${pct}%`, '--sl-accent': overflowed ? '#ef4444' : '#22d3ee' }}
              aria-label="Horizontal velocity (feeds the 16-bit register)"
              aria-valuetext={`${velocity}, signed ${signed}`}
            />
            <span className={styles.threshold} aria-hidden="true">
              int16 limit · +32,767
            </span>
          </div>
          <div className={styles.controlRow}>
            <span className={styles.controlHint}>
              Horizontal velocity — {velocity.toLocaleString()}
            </span>
            <button type="button" className={styles.replay} onClick={replay}>
              ⟳ Replay the fault
            </button>
          </div>
        </div>
      </div>
    </Scene>
  );
}
