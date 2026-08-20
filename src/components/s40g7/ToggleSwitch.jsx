import { useState } from 'react';

export default function ToggleSwitch() {
  const [isOn, setIsOn] = useState(true);

  return (
    <div className="toggle-container">
      <span className="toggle-label">🔘 Feature Enabled</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => setIsOn(!isOn)}
        />
        <span className="slider"></span>
      </label>
      <span className="toggle-status">
        {isOn ? (
          <span className="on">● ON</span>
        ) : (
          <span className="off">○ OFF</span>
        )}
      </span>
    </div>
  );
}