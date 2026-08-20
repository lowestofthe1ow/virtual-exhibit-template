import React from 'react';
import eraData from '../data/eraDetails.json';
import TechSpecCard from './TechSpecCard.jsx';
import GameShowcase from './GameShowcase.jsx';
import HolographicCard from './HolographicCard';
import styles from './DynamicEraDisplay.module.css';

export default function DynamicEraDisplay({ activeEra }) {
  const currentData = eraData.find(era => era.id === activeEra);

  if (!currentData) return <div>Era data not found.</div>;

  return (
    <div className={`crt-screen ${styles.displayContainer}`} role="region" aria-live="polite">
      <header className={styles.header}>
        <h2 className={`arcade-header ${styles.eraTitle}`}>{currentData.id} - {currentData.title}</h2>
        <p className={styles.description}>{currentData.description}</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.hardwareSection}>
          <h3 className={styles.sectionTitle}>Architectural Innovations</h3>
          
          {/* Wrapped in our 3D Holographic Tilt Component */}
          {currentData.techSpecs.map((spec, index) => (
            <HolographicCard key={index}>
              <TechSpecCard label={spec.label} value={spec.value} />
            </HolographicCard>
          ))}

          <div className={styles.caseStudy}>
            <h4 className={styles.caseStudyTitle}>Case Study</h4>
            <p>{currentData.caseStudy}</p>
          </div>
        </section>

        <section className={styles.softwareSection}>
          <GameShowcase title="Iconic Hardware" items={currentData.devices} />
          <GameShowcase title="Defining Games" items={currentData.games} />
        </section>
      </div>
    </div>
  );
}