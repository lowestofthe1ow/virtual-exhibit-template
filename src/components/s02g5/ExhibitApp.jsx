import React, { useState } from 'react';
import InteractiveTimeline from './InteractiveTimeline.jsx';
import DynamicEraDisplay from './DynamicEraDisplay.jsx';

export default function ExhibitApp() {
  const [activeEra, setActiveEra] = useState('1970s');

  return (
    <div className="exhibit-app-container">
      <InteractiveTimeline activeEra={activeEra} setActiveEra={setActiveEra} />
      <DynamicEraDisplay activeEra={activeEra} />
    </div>
  );
}