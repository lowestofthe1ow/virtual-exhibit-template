import clsx from 'clsx';
import styles from './Scene.module.css';

// Shared scene shell. `kicker` is optional and reserved for the two sections that are
// genuinely a sequence (the launch timeline, the failure cascade); concept sections let
// their H2 lead. It reads as a quiet station-log line, deliberately NOT a tracked-caps
// eyebrow repeated over every heading.
export default function Scene({ id, kicker, className, innerClassName, children }) {
  return (
    <section id={id} className={clsx(styles.scene, className)}>
      <div className={clsx(styles.inner, innerClassName)}>
        {kicker && (
          <div className={styles.kicker}>
            <span>{kicker}</span>
            <span className={styles.rule} />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export { styles as sceneStyles };
