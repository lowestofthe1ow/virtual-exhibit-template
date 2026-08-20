import React, { useEffect, useState } from 'react';
import eraData from '../data/eraDetails.json';
import styles from './InteractiveTimeline.module.css';

export default function InteractiveTimeline() {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Read the current URL to highlight the active node
    setCurrentPath(window.location.pathname.replace(/\//g, ''));
  }, []);

  return (
    <nav className={styles.timelineContainer} aria-label="Era Timeline">
      <ul className={styles.timelineList}>
        {eraData.map((era) => {
          const isActive = currentPath === era.id;
          return (
            <li key={era.id} className={styles.timelineItem}>
              <a
                href={`/${era.id}`}
                className={`${styles.nodeButton} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
                style={{ textDecoration: 'none' }}
              >
                {era.id}
              </a>
              <div className={styles.connector}></div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}