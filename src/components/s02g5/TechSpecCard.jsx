import React from 'react';
import styles from './TechSpecCard.module.css';

export default function TechSpecCard({ label, value }) {
  return (
    <div className={styles.card}>
      <h4 className={styles.label}>{label}</h4>
      <p className={styles.value}>{value}</p>
    </div>
  );
}