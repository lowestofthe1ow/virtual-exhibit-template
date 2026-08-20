import { motion } from 'framer-motion';
import FuzzyText from '../reactbits/FuzzyText.jsx';
import { useExhibit } from '../exhibit/ExhibitState.jsx';
import styles from './Launch.module.css';

export default function Launch() {
  const { reducedMotion } = useExhibit();

  return (
    <section id="launch" className={styles.launch}>
      <h1 className="sr-only">
        FATAL CONVERSION — The Ariane Flight V88 Catastrophe
      </h1>

      <p className={styles.eyebrow}>
        Guiana Space Centre · Kourou · 04 June 1996
      </p>

      <div className={styles.titleWrap}>
        {reducedMotion ? (
          <div className={styles.titleStatic} aria-hidden="true">
            FATAL CONVERS<span className={styles.bit}>10</span>N
          </div>
        ) : (
          <FuzzyText
            fontFamily='"Chakra Petch", sans-serif'
            fontSize="clamp(2rem, 9vw, 6.5rem)"
            fontWeight={700}
            baseIntensity={0.14}
            hoverIntensity={0.42}
            enableHover
            clickEffect
            gradient={['#22D3EE', '#F59E0B']}
            className={styles.fuzzTitle}
          >
            FATAL CONVERS10N
          </FuzzyText>
        )}
      </div>

      <p className={styles.subtitle}>The Ariane Flight V88 Catastrophe</p>
      <p className={styles.tagline}>
        Thirty-seven seconds. One integer. Half a billion dollars.
      </p>

      <a href="#mission-briefing" className={styles.cta}>
        Begin descent
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <p className={styles.intro}>
        On 4 June 1996, the maiden flight of Ariane 5 ended 37 seconds after
        liftoff. Not a faulty sensor, not a structural failure, not weather — a
        64-bit velocity that no longer fit in a 16-bit register, and a machine
        that did exactly what it was told.
      </p>

      <p className={styles.byline}>
        Campo · Garcia · Limpin · Morgan · Suarez &nbsp;·&nbsp; 67 min exhibit
      </p>

      <motion.div
        className={styles.cue}
        aria-hidden="true"
        animate={reducedMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>descend</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
