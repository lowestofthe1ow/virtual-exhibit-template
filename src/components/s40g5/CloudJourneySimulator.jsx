import { useMemo, useState } from 'react';
import styles from '../../styles/s40g5/CloudJourneySimulator.module.css';
import { simulatorStages } from '../../S40_Group5_data/s40g5/simulatorStages.js';

export default function CloudJourneySimulator() {
  const [currentStage, setCurrentStage] = useState(0);

  const stage = simulatorStages[currentStage];
  const progress = ((currentStage + 1) / simulatorStages.length) * 100;

  const stageClass = useMemo(() => {
    return `${styles.scene} ${styles[stage.sceneClass] || ''}`;
  }, [stage.sceneClass]);

  function nextStage() {
    setCurrentStage((prev) => Math.min(prev + 1, simulatorStages.length - 1));
  }

  function previousStage() {
    setCurrentStage((prev) => Math.max(prev - 1, 0));
  }

  function resetSimulator() {
    setCurrentStage(0);
  }

  return (
    <section className={styles.simulator} aria-labelledby="cloud-simulator-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Interactive Exhibit</p>
        <h2 id="cloud-simulator-title">Follow the File: Cloud Storage Journey</h2>
        <p>
          Step through what happens after a file leaves your device and enters cloud
          storage infrastructure.
        </p>
      </div>

      <div className={styles.progressArea}>
        <div className={styles.progressLabels}>
          <span>Stage {currentStage + 1} of {simulatorStages.length}</span>
          <span>{stage.title}</span>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.stageTabs} aria-label="Simulator stages">
        {simulatorStages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.stageTab} ${index === currentStage ? styles.activeTab : ''}`}
            onClick={() => setCurrentStage(index)}
            aria-label={`Go to ${item.title}`}
          >
            <span>{index + 1}</span>
            {item.shortTitle}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={stageClass}>
          <div className={styles.glowGrid} />

          <div className={styles.device}>
            <div className={styles.laptopScreen}>
              <div className={styles.fileIcon}>
                <span>FILE</span>
              </div>
            </div>
            <div className={styles.laptopBase} />
            <p>Your Device</p>
          </div>

          <div className={styles.networkPath}>
            <span className={styles.packetOne} />
            <span className={styles.packetTwo} />
            <span className={styles.packetThree} />
            <span className={styles.packetFour} />
          </div>

          <div className={styles.cloudServer}>
            <div className={styles.cloudTop}>Cloud Server</div>
            <div className={styles.serverRack}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.authBadge}>AUTH</div>
          </div>

          <div className={styles.storageCluster}>
            <div className={styles.storageNode}>
              <span />
              Primary
            </div>
            <div className={styles.storageNode}>
              <span />
              Replica A
            </div>
            <div className={styles.storageNode}>
              <span />
              Replica B
            </div>
          </div>

          <div className={styles.syncDevices}>
            <div className={styles.phone}>Phone</div>
            <div className={styles.tablet}>Tablet</div>
          </div>
        </div>

        <aside className={styles.infoCard}>
          <div className={styles.stageNumber}>0{currentStage + 1}</div>
          <h3>{stage.title}</h3>
          <p>{stage.description}</p>

          <div className={styles.tooltipBox}>
            <span>Key idea</span>
            <p>{stage.tooltip}</p>
          </div>

          <ul className={styles.details}>
            {stage.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </aside>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={previousStage} disabled={currentStage === 0}>
          Previous
        </button>

        <button type="button" className={styles.resetButton} onClick={resetSimulator}>
          Reset
        </button>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={nextStage}
          disabled={currentStage === simulatorStages.length - 1}
        >
          Next Stage
        </button>
      </div>
    </section>
  );
}