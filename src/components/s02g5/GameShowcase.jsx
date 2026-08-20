import React from 'react';
import styles from './GameShowcase.module.css';

export default function GameShowcase({ title, items }) {
  return (
    <div className={styles.showcase}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.listItem}>{item}</li>
        ))}
      </ul>
    </div>
  );
}