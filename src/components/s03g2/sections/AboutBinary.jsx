import { useState } from 'react';
import clsx from 'clsx';
import Scene, { sceneStyles } from './Scene.jsx';
import styles from './AboutBinary.module.css';

const TOPICS = [
  {
    id: 'origin',
    label: 'Who created it?',
    eyebrow: 'Origins',
    title: 'Binary code began as a mathematical idea, then became the language of machines.',
    body: (
      <>
        The idea of using only two states was introduced by{' '}
        <strong>Gottfried Wilhelm Leibniz</strong> in <strong>1679</strong>. Over time,
        it became the foundation of modern computing because digital computers work with
        only two possible values: <strong>0</strong> and <strong>1</strong>.
        In this system, each decimal number can be represented by binary digits, or
        bits. For example, <strong>9</strong> is written as <strong>1001</strong> in binary.
      </>
    ),
    highlights: ['Introduced in 1679', 'Two states only', 'Foundation of modern computing'],
  },
  {
    id: 'why',
    label: 'Why use it?',
    eyebrow: 'Why it matters',
    title: 'It is simple, reliable, and perfect for digital electronics.',
    body: (
      <>
        Computers are built from tiny switches that can only be <strong>on</strong> or{' '}
        <strong>off</strong>, so binary is the natural language for electronic circuits.
        It is used in <strong>calculations</strong>, where values are converted between
        binary and decimal; in <strong>file compression and decompression</strong> to save
        space; in <strong>security</strong> through encryption and decryption; and in{' '}
        <strong>media processing</strong>, where binary data is decoded into signals for
        playback. To write text in binary, computers use the{' '}
        <strong>ASCII</strong> table to map letters to their binary values.
      </>
    ),
    highlights: ['Calculations', 'Compression', 'Security', 'Media Processing', 'ASCII'],
  },
  {
    id: 'how',
    label: 'How does it work?',
    eyebrow: 'How it works',
    title: 'Bits combine into patterns that represent numbers, text, and instructions.',
    body: (
      <>
        Binary uses <strong>place value</strong>, just like decimal, but the base is 2.
        In <code>1011</code>₂, the positions mean 8 + 0 + 2 + 1 = <strong>11</strong>.
        It also uses complement systems for signed numbers: <strong>1’s complement</strong>{' '}
        flips every bit, while <strong>2’s complement</strong> flips the bits and adds 1.
        In this system, the <strong>Most Significant Bit</strong> often represents the sign,
        while the remaining bits show the magnitude. For example, <strong>+8</strong>{' '}
        is <code>0000 1000</code>, its 1’s complement is <code>1111 0111</code>, and its
        2’s complement is <code>1111 1000</code>.
      </>
    ),
    highlights: ['Place value in base 2', '1’s complement', '2’s complement', 'Sign and magnitude'],
  },
];

export default function AboutBinary() {
  const [activeTopic, setActiveTopic] = useState('origin');
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]); // 0x41 = 65
  const toggle = (i) => setBits((b) => b.map((x, j) => (j === i ? (x ? 0 : 1) : x)));

  const unsigned = bits.reduce((a, b, i) => a + b * 2 ** (7 - i), 0);
  const signed = bits[0] ? unsigned - 256 : unsigned;
  const hex = '0x' + unsigned.toString(16).toUpperCase().padStart(2, '0');
  const activeContent = TOPICS.find((topic) => topic.id === activeTopic) ?? TOPICS[0];

  return (
    <Scene id="about-binary">
      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          <div className={styles.intro}>
            <h2 className={sceneStyles.title}>Binary Code: The Language of Machines</h2>
            <p className={sceneStyles.lede}>
              Binary is the simple system that turns electrical signals into information.
              It powers the logic behind computers, from the first electronic machines to
              the spacecraft and devices we use today.
            </p>
          </div>

          <div className={styles.topicSection}>
            <div className={styles.topicSwitcher} role="tablist" aria-label="Binary code topics">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={clsx(styles.topicButton, activeTopic === topic.id && styles.active)}
                  onClick={() => setActiveTopic(topic.id)}
                  aria-pressed={activeTopic === topic.id}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <div className={styles.topicPanel}>
              <span className={styles.topicEyebrow}>{activeContent.eyebrow}</span>
              <h3 className={styles.topicTitle}>{activeContent.title}</h3>
              <div className={styles.topicBody}>{activeContent.body}</div>
              <div className={styles.topicHighlights}>
                {activeContent.highlights.map((item) => (
                  <span key={item} className={styles.topicChip}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.lab}>
            <div className={styles.labHead}>
              <span className={styles.labTitle}>Try it — an 8-bit register</span>
              <span className={styles.labHint}>Click any bit. The top bit is the sign.</span>
            </div>

            <div className={styles.bits}>
              {bits.map((b, i) => (
                <div key={i} className={styles.bitCol}>
                  <span className={styles.place}>{i === 0 ? '−128' : 2 ** (7 - i)}</span>
                  <button
                    type="button"
                    className={clsx(
                      styles.bit,
                      i === 0 && styles.signBit,
                      b === 1 && (i === 0 ? styles.signOn : styles.on)
                    )}
                    onClick={() => toggle(i)}
                    aria-pressed={b === 1}
                    aria-label={`Bit ${7 - i}, weight ${i === 0 ? -128 : 2 ** (7 - i)}, currently ${b}`}
                  >
                    {b}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.readouts}>
              <div className={styles.ro}>
                <span className={styles.roK}>Unsigned</span>
                <span className={styles.roV}>{unsigned}</span>
              </div>
              <div className={styles.ro}>
                <span className={styles.roK}>Signed (two's complement)</span>
                <span className={clsx(styles.roV, signed < 0 ? styles.neg : styles.pos)}>
                  {signed}
                </span>
              </div>
              <div className={styles.ro}>
                <span className={styles.roK}>Hex</span>
                <span className={styles.roV}>{hex}</span>
              </div>
            </div>

            <p className={styles.foot}>
              Flip only the top bit and the unsigned value barely changes — but the{' '}
              <span className={styles.signedWord}>signed</span> reading leaps past zero
              into the negatives. That is the same logic that makes numeric data behave in
              surprising ways inside computers.
            </p>
          </div>
        </div>
      </div>
    </Scene>
  );
}
