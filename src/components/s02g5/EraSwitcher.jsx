import React from 'react';
import styles from './EraSwitcher.module.css';

const allEras = [
  { id: '1970s', label: '70s: TTL Logic', color: '#FF8C00' },
  { id: '1980s', label: '80s: 8-Bit', color: '#E60012' },
  { id: '1990s', label: '90s: 3D Polygons', color: '#00E6C3' },
  { id: '2000s', label: '00s: 6th Gen', color: '#39FF14' },
  { id: '2010s', label: '10s: Modern GPU', color: '#00C3FF' },
  { id: '2020s', label: '20s: Next-Gen', color: '#D400FF' }
];

export default function EraSwitcher({ currentEra }) {
  const rawBase = import.meta.env.BASE_URL || '/';
  const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  return (
    <div className={styles.switcherContainer}>
      <div className={styles.switcherHeader}>
        <span className={styles.hudLabel}>⚡ CARTRIDGE SLOT / TIME-WARP SELECTOR ⚡</span>
      </div>
      <div className={styles.cartridgeRow}>
        {allEras.map((era) => {
          const isActive = currentEra === era.id;

          return (
            <a
              key={era.id}
              href={`${baseUrl}s02g5/${era.id}/`}
              className={`${styles.cartridgeBtn} ${isActive ? styles.activeCartridge : ''}`}
              style={{ '--cart-color': era.color }}
            >
              <span className={styles.ledIndicator} />
              <span className={styles.cartLabel}>{era.label}</span>
              {isActive && <span className={styles.loadedTag}>[LOADED]</span>}
            </a>
          );
        })}
      </div>
    </div>
  );
}