import React from 'react';
import '../../styles/s02g9/navigation.css';

type Props = {
  activeSection: string;
  onChange: (section: 'simulator' | 'timeline' | 'challenge') => void;
};

/**
 * Navigation (static)
 *
 * Replaced the AutoHidePanel-based version with a simple, always-visible navigation.
 * This keeps the UI predictable and removes hover/edge-reveal behavior entirely.
 *
 * - Accessible buttons
 * - ARIA attributes for clarity
 * - Keeps the same API as before (activeSection + onChange)
 */
const Navigation: React.FC<Props> = ({ activeSection, onChange }) => {
  return (
    <nav aria-label="Primary museum navigation" className="museum-navigation">
      <button
        className={`nav-btn ${activeSection === 'simulator' ? 'active' : ''}`}
        data-section="simulator"
        onClick={() => onChange('simulator')}
        aria-pressed={activeSection === 'simulator'}
      >
        Cipher Lab
      </button>

      <button
        className={`nav-btn ${activeSection === 'timeline' ? 'active' : ''}`}
        data-section="timeline"
        onClick={() => onChange('timeline')}
        aria-pressed={activeSection === 'timeline'}
      >
        Historical Timeline
      </button>

      <button
        className={`nav-btn ${activeSection === 'challenge' ? 'active' : ''}`}
        data-section="challenge"
        onClick={() => onChange('challenge')}
        aria-pressed={activeSection === 'challenge'}
      >
        Practice Challenge
      </button>
    </nav>
  );
};

export default Navigation;