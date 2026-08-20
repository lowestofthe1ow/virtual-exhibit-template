import React, { useState } from 'react';

export default function SpeedComparison() {
  const [hoveredBar, setHoveredBar] = useState(null);

  const speedData = [
    { year: '1994', label: '1994 64kbps', speedText: '64 kbps', height: '12%' },
    { year: '2000', label: '2000 Dial-up', speedText: '56 kbps', height: '10%' },
    { year: '2005', label: '2005 ADSL', speedText: '1-2 Mbps', height: '32%' },
    { year: '2010', label: '2010 Cable', speedText: '5-10 Mbps', height: '48%' },
    { year: '2016', label: '2016 LTE', speedText: '42 Mbps', height: '56%' },
    { year: '2020', label: '2020 Fiber', speedText: '100 Mbps', height: '72%' },
    { year: '2024', label: '2024 5G/Fiber', speedText: '1 Gbps', height: '88%' }
  ];

  const yAxisLabels = ['10G', '1G', '100M', '10M', '1M', '100k', '10k'];

  return (
    <div className="exhibit-chart-root">
      <style>{`
        .exhibit-chart-root {
          background-color: var(--cream);
          border: 2px solid var(--teal);
          border-radius: 6px;
          padding: 24px;
          color: var(--text-secondary);
          font-family: 'IBM Plex Mono', monospace;
          margin-top: 10px;
        }
        .chart-title {
          text-align: center;
          color: var(--orange);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 2px;
          margin-bottom: 6px;
          text-shadow: 0 0 8px rgba(210, 140, 75, 0.2);
        }
        .chart-subtitle {
          text-align: center;
          color: var(--text-secondary);
          font-size: 13px;
          margin-bottom: 25px;
          line-height: 1.65;
          font-weight: 500;
        }
        .chart-frame {
          border: 2px solid rgba(109, 61, 61, 0.15);
          background-color: rgba(254, 251, 244, 0.5);
          border-radius: 6px;
          padding: 35px 20px 45px 20px; /* Enhanced bottom padding padding workspace */
          position: relative;
          margin-bottom: 20px;
        }
        .chart-relative-wrapper {
          position: relative;
          height: 220px;
          width: 100%;
        }
        /* Grid Lines and Y-Axis Layout */
        .y-axis-guides {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
        }
        .axis-line {
          display: flex;
          align-items: center;
          width: 100%;
          height: 0;
        }
        .axis-label {
          width: 45px;
          font-size: 10px;
          color: var(--teal);
          opacity: 0.7;
          text-align: left;
          flex-shrink: 0;
        }
        .axis-dashed-line {
          flex-grow: 1;
          border-bottom: 1px dashed rgba(109, 61, 61, 0.15);
        }
        /* Bars Content Display Layout */
        .chart-height-container {
          position: absolute;
          top: 0;
          right: 0;
          /* Adjusted bottom segment offset calculation to seat bars precisely onto the 10k baseline dashed marker */
          height: 100%;
          left: 45px; 
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
        }
        .bar-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 11%;
          height: 100%;
          justify-content: flex-end;
          position: relative;
        }
        .graphic-bar {
          width: 100%;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          background-color: rgba(109, 61, 61, 0.3);
          border: 2px solid var(--teal);
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          z-index: 20;
          /* Forces anchor convergence to prevent unaligned bottom tracking floating anomalies */
          margin-bottom: 0px; 
        }
        .graphic-bar:hover, .graphic-bar.highlighted {
          background-color: var(--orange);
          border-color: rgba(109, 61, 61, 0.7);
          box-shadow: 0 0 10px rgba(210, 140, 75, 0.4);
        }
        .bar-year-lbl {
          position: absolute;
          bottom: -24px; /* Flushed cleanly beneath graph threshold */
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: var(--text-secondary);
          white-space: nowrap;
          z-index: 10;
        }
        .chart-tooltip {
          position: absolute;
          top: -45px;
          background-color: var(--cream);
          border: 2px solid var(--orange);
          padding: 4px 10px;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.08);
          pointer-events: none;
          white-space: nowrap;
          z-index: 50;
        }
        .tooltip-speed {
          color: var(--orange);
          font-weight: bold;
          font-size: 11px;
        }
        .tooltip-year {
          color: var(--text-secondary);
          font-size: 9px;
        }
        .multiplier-card {
          border: 2px solid var(--teal);
          background-color: rgba(210, 140, 75, 0.05);
          border-radius: 6px;
          padding: 20px;
          text-align: center;
        }
        .multiplier-title {
          color: var(--teal);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
        }
        .multiplier-value {
          font-size: 36px;
          font-family: 'Bebas Neue', sans-serif;
          color: var(--orange);
          letter-spacing: 1px;
          margin: 6px 0;
        }
        .multiplier-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(109, 61, 61, 0.1);
        }
        .speed-span-old { color: var(--text-secondary); font-weight: bold; }
        .speed-span-new { color: var(--orange); font-weight: bold; }
      `}</style>

      <h2 className="chart-title">SPEED THROUGH THE YEARS</h2>
      <p className="chart-subtitle">From 64 kbps to 1 Gbps — Philippine Internet speeds over 30 years</p>

      <div className="chart-frame">
        <div className="chart-relative-wrapper">
          
          {/* Y-Axis Grid Lines Container */}
          <div className="y-axis-guides">
            {yAxisLabels.map((label, idx) => (
              <div key={idx} className="axis-line">
                <span className="axis-label">{label}</span>
                <div className="axis-dashed-line"></div>
              </div>
            ))}
          </div>

          {/* Bars Container - shifted past the labels */}
          <div className="chart-height-container">
            {speedData.map((item, idx) => (
              <div key={idx} className="bar-wrapper">
                {hoveredBar === item.year && (
                  <div className="chart-tooltip">
                    <div className="tooltip-speed">{item.speedText}</div>
                    <div className="tooltip-year">{item.year} speed</div>
                  </div>
                )}
                <div 
                  className={`graphic-bar ${hoveredBar === item.year ? 'highlighted' : ''}`}
                  style={{ height: item.height }}
                  onMouseEnter={() => setHoveredBar(item.year)}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <div className="bar-year-lbl">{item.year}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Multiplier Dashboard Card */}
      <div className="multiplier-card">
        <div className="multiplier-title">Today's connection is</div>
        <div className="multiplier-value">15,625x</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
          faster than March 29, 1994
        </div>
        
        <div className="multiplier-footer">
          <div>
            <span className="speed-span-old">64 kbps</span>
            <div style={{ fontSize: '10px', marginTop: '2px', color: 'var(--teal)' }}>1994 speed</div>
          </div>
          <div style={{ color: 'var(--teal)', fontWeight: 'bold' }}>→</div>
          <div>
            <span className="speed-span-new">1 Gbps</span>
            <div style={{ fontSize: '10px', marginTop: '2px', color: 'var(--teal)' }}>2024 speed</div>
          </div>
        </div>
      </div>

    </div>
  );
}