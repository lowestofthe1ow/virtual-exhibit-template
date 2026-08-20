// src/components/ExplanationPanel.jsx
import React from 'react';
import { useCacheStore } from '../../store/s40g1/cacheStore.js';

const ExplanationPanel = () => {
  const { explanation } = useCacheStore();
  
  // SAFETY: Use defaults if explanation is undefined
  const safeExplanation = explanation || { 
    alice: 'Click a slot, then "Remember" to load a memory.',
    hardware: 'All cache lines are Invalid (I).'
  };

  return (
    <div className="explanation-panel">
      <h4>What Just Happened?</h4>
      <div className="explanation-content">
        <div className="explanation-alice">
          <p><strong>Alice says:</strong> {safeExplanation.alice || 'No explanation available.'}</p>
        </div>
        <div className="explanation-hardware">
          <p><strong>In Hardware:</strong> {safeExplanation.hardware || 'No hardware explanation available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;