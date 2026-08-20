import React, { useState } from 'react';

type FinaleStage = {
  title: string;
  era: string;
  story: string;
  cryptographyLink: string;
  impact: string;
  signal: string;
};

const stages: FinaleStage[] = [
  {
    title: 'Mechanical Gears',
    era: 'Early rule-following machinery',
    story: 'Mechanized calculators and simple automata made it possible to repeat a procedure without relying on a human hand at every step.',
    cryptographyLink: 'Cipher work demanded repeatable procedures, which encouraged the idea of machines that could follow instructions reliably.',
    impact: 'The first step toward programmable thinking was the belief that a sequence of actions could be delegated to a mechanism.',
    signal: 'Procedure',
  },
  {
    title: 'Relays',
    era: 'Switch-based logic',
    story: 'Relays introduced electrical switching, allowing machines to make decisions and route information through a circuit.',
    cryptographyLink: 'Secret writing and codebreaking required rapid comparisons and branching logic, which relays made practical.',
    impact: 'Computers became more than calculators; they became systems capable of controlled decision-making.',
    signal: 'Logic',
  },
  {
    title: 'Vacuum Tubes',
    era: 'High-speed electronic processing',
    story: 'Vacuum tubes made it possible to process information much faster than mechanical systems, opening the door to large-scale electronic computation.',
    cryptographyLink: 'The pressure to test many cipher possibilities at once drove engineers toward faster electronic searches.',
    impact: 'Speed became a strategic advantage, and the search for better machines accelerated dramatically.',
    signal: 'Speed',
  },
  {
    title: 'Transistors',
    era: 'Miniaturized switching',
    story: 'Transistors replaced bulky tubes with small, reliable switches that made computers smaller, cheaper, and more dependable.',
    cryptographyLink: 'More reliable machines meant more sustained, large-scale cryptanalytic work and more practical computing infrastructure.',
    impact: 'Computing became a practical technology rather than a fragile experimental machine.',
    signal: 'Reliability',
  },
  {
    title: 'Integrated Circuits',
    era: 'Many functions on one chip',
    story: 'Integrated circuits packed many components together, making it easier to build complex processors and memory systems.',
    cryptographyLink: 'The need to handle large volumes of data and repeated transformations pushed computer design toward dense, reusable circuits.',
    impact: 'Engineering could now scale complexity without building every component by hand.',
    signal: 'Scale',
  },
  {
    title: 'Microprocessors',
    era: 'Compact computing cores',
    story: 'A microprocessor placed the core of a computer on a single chip, turning computing into a general-purpose architecture.',
    cryptographyLink: 'Modern cryptographic systems and secure communications depend on the same programmable processors that emerged from this era.',
    impact: 'The computer became a universal tool for both secret communication and everyday information processing.',
    signal: 'Programmability',
  },
  {
    title: 'Modern CPUs',
    era: 'Parallel and optimized processing',
    story: 'Modern central processors combine pipelines, caches, and parallel execution to handle sophisticated tasks with remarkable efficiency.',
    cryptographyLink: 'Encryption, hashing, and secure protocols now rely on these optimized processors in real time.',
    impact: 'The logic of cryptography became an everyday part of modern digital life.',
    signal: 'Optimization',
  },
  {
    title: 'Cloud Computing',
    era: 'Distributed digital infrastructure',
    story: 'Cloud systems spread computation across networks of machines, allowing enormous workloads to be shared and coordinated.',
    cryptographyLink: 'Secure distributed systems and encrypted data transfer are essential to modern cloud services.',
    impact: 'The same networked computation that once served military codebreaking now powers the global digital economy.',
    signal: 'Networks',
  },
  {
    title: 'Artificial Intelligence',
    era: 'Machine learning and adaptive systems',
    story: 'AI systems now learn patterns, make predictions, and automate complex decisions from massive amounts of data.',
    cryptographyLink: 'Cipher analysis, anomaly detection, and secure automation all rely on pattern recognition and adaptive computation.',
    impact: 'The story reaches its modern endpoint: computing systems are now able to discover patterns that humans once had to search for manually.',
    signal: 'Pattern finding',
  },
];

const CipherToSiliconFinale: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = stages[activeIndex];

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">From Cipher to Silicon</h3>
        <p className="rotor-explainer-text">
          The same pressures that made encryption harder also pushed engineers to build machines that could automate search, process data, and execute instructions.
        </p>
      </div>

      <div className="finale-hero">
        <div className="finale-hero__copy">
          <h4>The long arc of invention</h4>
          <p>
            Each new cryptographic challenge asked for more speed, more logic, and more reliable processing. That demand helped shape the computing machines that followed.
          </p>
        </div>
        <div className="finale-hero__stats">
          <div className="finale-stat">
            <span>Challenge</span>
            <strong>Complexity</strong>
          </div>
          <div className="finale-stat">
            <span>Response</span>
            <strong>Automation</strong>
          </div>
          <div className="finale-stat">
            <span>Outcome</span>
            <strong>Modern computing</strong>
          </div>
        </div>
      </div>

      <div className="finale-stack" role="list" aria-label="Computing milestones">
        {stages.map((stage, index) => (
          <button
            key={stage.title}
            type="button"
            className={`finale-step ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-pressed={index === activeIndex}
          >
            <span>{stage.title}</span>
          </button>
        ))}
      </div>

      <div className="finale-detail">
        <div className="finale-detail__main">
          <p className="finale-detail__eyebrow">{activeStage.era}</p>
          <h4>{activeStage.title}</h4>
          <p>{activeStage.story}</p>
          <div className="finale-detail__pill-row">
            <span className="finale-pill">{activeStage.signal}</span>
            <span className="finale-pill">Cryptography-driven</span>
          </div>
        </div>

        <div className="finale-detail__side">
          <h5>How cryptography shaped it</h5>
          <p>{activeStage.cryptographyLink}</p>
          <h5>Why it mattered</h5>
          <p>{activeStage.impact}</p>
        </div>
      </div>

      <div className="museum-innovation-card">
        <h4>The central claim</h4>
        <p>
          Modern computing did not evolve separately from cryptography. Many of its most important breakthroughs were driven by the need to encrypt, decrypt, and process information more efficiently.
        </p>
        <ul>
          <li>Cryptography made complexity visible.</li>
          <li>Complexity demanded machines that could repeat, compare, and decide.</li>
          <li>Those machines became the foundation of modern computing.</li>
        </ul>
      </div>
    </div>
  );
};

export default CipherToSiliconFinale;
