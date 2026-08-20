// src/components/StatusLog.jsx
import React from 'react';
import { useCacheStore } from '../../store/s40g1/cacheStore.js';

const StatusLog = () => {
  const { log } = useCacheStore();

  return (
    <div className="log-container">
      <h4>Cheshire Cat's Log</h4>
      {log.map((entry, index) => (
        <div key={index} className="log-entry">{entry}</div>
      ))}
    </div>
  );
};

export default StatusLog;