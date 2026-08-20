import { useState } from 'react';

export default function MagnifierSlider() {
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="magnifier-container">
      <h3>🔍 Magnifier Slider</h3>
      <label>
        Zoom: <span className="slider-value">{zoomLevel}x</span>
      </label>
      <input
        type="range"
        min="0.5"
        max="2.5"
        step="0.25"
        value={zoomLevel}
        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
      />
      <div className="magnifier-preview">
        <span style={{ fontSize: `${zoomLevel * 20}px` }}>
          🔍 Zoom: {zoomLevel}x
        </span>
      </div>
    </div>
  );
}
