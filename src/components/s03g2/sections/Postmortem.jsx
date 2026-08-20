import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import BorderGlow from '../reactbits/BorderGlow.jsx';
import Scene, { sceneStyles } from './Scene.jsx';
import { useExhibit } from '../exhibit/ExhibitState.jsx';
import styles from './Postmortem.module.css';

const CARDS = [
  { n: '01', title: 'Reuse of code', front: 'Alignment code from Ariane 4 ran unchanged on Ariane 5.',
    back: 'Old code isn\'t automatically safe code. It was never tested against Ariane 5\'s faster flight path because the experts didn\'t expect that it needed to.' },
  { n: '02', title: 'The number that didn\'t fit', front: 'Arian 5 flew faster than Ariane 4 ever had. Its velocity number grew too big for the slot built to hold it.',
    back: 'A 16-bit slot maxes out at 32,767. Go one number over and the computer breaks instead of rounding, because velocity can\'t be negative.' },
  { n: '03', title: 'Why did it just.. stop working?', front: 'The computer failed to warn anyone and shut itself off completely.',
    back: 'No instruction existed for "number too big," so the safest thing that the computer knew to do was quit.' },
  { n: '04', title: 'Identical redundancy', front: 'Two SRIs, identical software, identical fault, 50 ms apart.',
    back: 'Redundancy only defends against independent failures. A shared bug takes both channels at once.' },
  { n: '05', title: 'Specification vs. testing', front: "Ariane 5's steeper, faster trajectory was never tested against this code.",
    back: 'Test against the real operating envelope, not the inherited one. The safe limit was an assumption, never a measurement.' },
  { n: '06', title: 'The cost', front: '$370M. Four Cluster satellites. ~37 seconds of flight.',
    back: 'The most expensive integer overflow in history — and one range check would have prevented all of it.' },
];

function FlipCard({ card, reducedMotion }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${card.title}. ${flipped ? card.back : card.front} Activate to flip.`}
    >
      <motion.div
        className={styles.flip}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={clsx(styles.face, styles.front)}>
          <span className={styles.num}>{card.n}</span>
          <h3 className={styles.frontTitle}>{card.title}</h3>
          <p className={styles.frontText}>{card.front}</p>
          <span className={styles.hint}>lesson ↻</span>
        </div>
        <div className={clsx(styles.face, styles.back)}>
          <span className={styles.backKicker}>Lesson</span>
          <p className={styles.backText}>{card.back}</p>
        </div>
      </motion.div>
    </button>
  );
}

export default function Postmortem() {
  const { reducedMotion } = useExhibit();
  return (
    <Scene id="postmortem">
      <div className={styles.intro}>
        <h2 className={sceneStyles.title}>Six lessons from 37 seconds</h2>
        <p className={sceneStyles.lede}>
          The board of inquiry found no villain — only a chain of reasonable decisions
          that each made sense alone. The machine did exactly what it was built to do.
          Tap a card for the lesson.
        </p>
      </div>

      <div className={styles.grid}>
        {CARDS.map((c, i) => (
          <BorderGlow
            key={c.n}
            colors={['#22D3EE', '#F59E0B', '#EF4444']}
            backgroundColor="#33363c"
            glowColor="187 83 53"
            borderRadius={18}
            glowIntensity={0.9}
            edgeSensitivity={34}
            animated={i === 0 && !reducedMotion}
          >
            <FlipCard card={c} reducedMotion={reducedMotion} />
          </BorderGlow>
        ))}
      </div>

      <p className={styles.epitaph}>
        Computer architecture is not abstract. Sixteen bits, one sign, and a value
        that no longer fit — that is the whole distance between a mission and a
        fireball. <span className={styles.epitaphMono}>0x7FFF + 1 = 0x8000.</span>
      </p>
    </Scene>
  );
}
