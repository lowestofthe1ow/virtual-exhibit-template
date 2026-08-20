import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Scene, { sceneStyles } from './Scene.jsx';
import { useExhibit } from '../exhibit/ExhibitState.jsx';
import styles from './MissionBriefing.module.css';

const T_END = 39.1;

const TICKS = [
  { t: 0, tag: 'T+0.0s', title: 'Liftoff', sev: 'ok', sig: 0.05,
    alt: '0 km', vel: '0 m/s', reg: '0x0000',
    detail: 'It was June 4, 1996, in Kourou, French Guiana, when the Ariane 5 was set to take flight. At exactly 12:33:59 UTC, the Vulcain main cryogenic engine and two solid rocket boosters ignited in sequence. Thrust built up smoothly, the rocket successfully lifted off the pad, and started climbing along its planned trajectory.' },
  /*{ t: 7, tag: 'T+7.0s', title: 'SRI alignment still running', sev: 'ok', sig: 0.08,
    alt: '~0.2 km', vel: 'rising', reg: '0x0AF0',
    detail: 'A leftover Ariane 4 alignment routine keeps computing horizontal bias BH — needed before launch, useless after, but still running "just in case".' },*/
  { t: 30, tag: 'T+30.0s', title: 'Nominal Ascent Continues', sev: 'ok', sig: 0.14,
    alt: '~3.5 km', vel: 'high', reg: '0x5C21',
    detail: 'Thirty seconds after liftoff, the rocket was ascending steadily, traveling at approximately 1,700 km/h. Both Inertial Reference Systems (SRI 1 and 2) were active and sending correct data. No warnings or abnormal readings appeared, and the flight continued as normal.' },
  { t: 36.7, tag: 'T+36.7s', title: 'Primary Guidance System Failure', sev: 'warn', sig: 0.66,
    alt: '~3.7 km', vel: 'exceeds 32,767', reg: '0x8000',
    detail: 'At this point, horizontal velocity reached 36,356 reference units, which was too large to fit in a 16-bit signed integer that could only fit a maximum of 32,767 units. Converting this value caused a software overflow error. The primary SRI 2 had no error handling, causing it to shut down and send only error codes instead of position and altitude data.' },
  /*{ t: 36.75, tag: 'T+36.75s', title: 'Diagnostics on the bus', sev: 'warn', sig: 0.75,
    alt: '~3.7 km', vel: '—', reg: 'diag',
    detail: 'The failure diagnostic word is written onto the databus — the same channel the OBC reads flight values from. Data and diagnostics now look alike.' },*/
  { t: 36.8, tag: 'T+36.8s', title: 'Backup Guidance System Failure', sev: 'bad', sig: 0.86,
    alt: '~3.7 km', vel: '—', reg: '0x8000',
    detail: 'The identical backup SRI 1 system suffered the same overflow error and shut down just a few milliseconds later. Both guidance units were now dead. The main flight computer received the diagnostic data and mistook it for real flight measurements.' },
  /*{ t: 37.0, tag: 'T+37.0s', title: 'Nozzles hard over', sev: 'bad', sig: 0.93,
    alt: '~4 km', vel: '—', reg: '0x8000',
    detail: 'The OBC interprets the diagnostic word as a real attitude angle and commands full nozzle deflection. The boosters swivel to the stops.' },*/
  { t: 39.0, tag: 'T+39.0s', title: 'Extreme Attitude & Structural Stress', sev: 'bad', sig: 0.97,
    alt: '~4 km', vel: '—', reg: '0x8000',
    detail: 'Believing that the rocket was dangerously tilted, the computer instructed the solid booster nozzles to swivel to their maximum mechanical limits. Structural integrity slowly deteriorated as the rocket began bending and twisting.' },
  { t: 39.1, tag: 'T+39.1s', title: 'Vehicle Destroyed', sev: 'bad', sig: 1.0,
    alt: '—', vel: '—', reg: '—',
    detail: 'The aerodynamic and bending loads became too great. Essential mechanical parts started to separate from the core stage; electrical and hydraulic connections were torn apart. This triggered the built-in Flight Termination System and resulted in the Ariane 5’s demise — all because of one integer conversion.' },
];

const SEV_LABEL = { ok: 'Nominal', warn: 'Fault', bad: 'Critical' };

export default function MissionBriefing() {
  const { easeEventTo, releaseEvent, setBurnStage } = useExhibit();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);

  const tick = TICKS[active];
  const pct = (tick.t / T_END) * 100;
  const atStart = active === 0;
  const atEnd = active === TICKS.length - 1;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView) easeEventTo(TICKS[active].sig);
    else releaseEvent();
  }, [active, inView, easeEventTo, releaseEvent]);

  // Map tick time to burn stage
  useEffect(() => {
    const t = TICKS[active].t;
    const stage = t < 7 ? 1 : t < 36.7 ? 2 : t < 39.0 ? 3 : 4;
    setBurnStage(stage);
  }, [active, setBurnStage]);

  const select = (i) => setActive(Math.max(0, Math.min(TICKS.length - 1, i)));

  const nearestFromClientX = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const time = frac * T_END;
    let best = 0;
    let bestD = Infinity;
    TICKS.forEach((tk, i) => {
      const d = Math.abs(tk.t - time);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    select(best);
  };

  const onPointerDown = (e) => {
    setDragging(true);
    trackRef.current?.setPointerCapture?.(e.pointerId);
    nearestFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (dragging) nearestFromClientX(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      select(active + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      select(active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(TICKS.length - 1);
    }
  };

  return (
    <Scene id="mission-briefing" kicker="Flight V88 — the last thirty-nine seconds">
      <div ref={wrapRef}>
        {/* Legibility card: keeps the grey lede readable when this section's noise
            peaks at the late timeline (specs/screens/exhibit.md ②). */}
        <div className={styles.intro}>
          <h2 className={sceneStyles.title}>Thirty-nine seconds</h2>
          <p className={sceneStyles.lede}>
            Step through the launch timeline. Nothing looks wrong until T+36.7s — then
            the same fault takes both computers in fifty milliseconds. Move past the
            fault and the whole instrument starts to come apart with you.
          </p>
        </div>

        <div className={styles.scrubber}>
          <div
            ref={trackRef}
            className={styles.track}
            role="slider"
            tabIndex={0}
            aria-label="Launch timeline"
            aria-valuemin={0}
            aria-valuemax={TICKS.length - 1}
            aria-valuenow={active}
            aria-valuetext={`${tick.tag} — ${tick.title}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onKeyDown={onKeyDown}
          >
            <div className={styles.trackBase} />
            <div
              className={clsx(styles.progress, styles[`sev_${tick.sev}`])}
              style={{ transform: `scaleX(${pct / 100})` }}
            />
            {TICKS.map((tk, i) => (
              <span
                key={tk.t}
                className={clsx(styles.notch, styles[`notch_${tk.sev}`])}
                style={{ left: `${(tk.t / T_END) * 100}%` }}
                aria-hidden="true"
              />
            ))}
            <div
              className={clsx(styles.playhead, styles[`play_${tick.sev}`])}
              style={{ left: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
          <div className={styles.axis}>
            <span>T+0s</span>
            <span>self-destruct · T+39.1s</span>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => select(active - 1)}
              disabled={atStart}
              aria-label="Previous event"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Prev</span>
            </button>
            <span className={styles.count}>
              {String(active + 1).padStart(2, '0')}
              <span className={styles.countSep}> / </span>
              {String(TICKS.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => select(active + 1)}
              disabled={atEnd}
              aria-label="Next event"
            >
              <span>Next</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={clsx(styles.card, styles[`card_${tick.sev}`])}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <div className={styles.cardHead}>
              <span className={styles.cardTag}>{tick.tag}</span>
              <span className={clsx(styles.sevBadge, styles[`badge_${tick.sev}`])}>
                {SEV_LABEL[tick.sev]}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{tick.title}</h3>
            <p className={styles.cardDetail}>{tick.detail}</p>
            <div className={styles.telemetry}>
              <div className={styles.tItem}>
                <span className={styles.tK}>Altitude</span>
                <span className={styles.tV}>{tick.alt}</span>
              </div>
              <div className={styles.tItem}>
                <span className={styles.tK}>H-Velocity</span>
                <span className={styles.tV}>{tick.vel}</span>
              </div>
              <div className={styles.tItem}>
                <span className={styles.tK}>Register</span>
                <span className={clsx(styles.tV, styles.tMono)}>{tick.reg}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Scene>
  );
}
