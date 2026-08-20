import React, { useState, useMemo, useEffect } from 'react';

const WAFER_COST = 17000;
const USABLE_WAFER_AREA_MM2 = 60000;
const RETICLE_LIMIT_MM2 = 800;
const AREA_PER_CORE_MM2 = 15;
const CHIPLET_CORES = 8;
const YIELD_ALPHA = 3;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Math.round(value));

export default function ChipSim() {
  const [architecture, setArchitecture] = useState('monolithic');
  const [coreCount, setCoreCount] = useState(64);
  const [defectDensity, setDefectDensity] = useState(0.5);

  const stats = useMemo(() => {
    const chipletsNeeded = architecture === 'chiplet' ? Math.ceil(coreCount / CHIPLET_CORES) : 1;
    const areaPerDie = architecture === 'monolithic'
      ? coreCount * AREA_PER_CORE_MM2
      : CHIPLET_CORES * AREA_PER_CORE_MM2;
    const yieldRatio = Math.pow(
      1 + (defectDensity * (areaPerDie / 100)) / YIELD_ALPHA,
      -YIELD_ALPHA
    );

    const isOverLimit = architecture === 'monolithic' && areaPerDie > RETICLE_LIMIT_MM2;
    const finalYieldRatio = isOverLimit ? 0 : yieldRatio;
    const finalYield = finalYieldRatio * 100;

    // Approximate chips per 300mm wafer (usable area roughly 60,000mm²)
    const knownGoodDies = isOverLimit
      ? 0
      : Math.floor((USABLE_WAFER_AREA_MM2 * finalYieldRatio) / areaPerDie);
    const chipsPerWafer = architecture === 'chiplet'
      ? Math.floor(knownGoodDies / chipletsNeeded)
      : knownGoodDies;
    const wastedCost = WAFER_COST * (1 - finalYieldRatio);
    const costPerProcessor = chipsPerWafer > 0 ? WAFER_COST / chipsPerWafer : null;

    let grade = 'A';
    if (finalYield < 20) grade = 'F';
    else if (finalYield < 40) grade = 'D';
    else if (finalYield < 60) grade = 'C';
    else if (finalYield < 80) grade = 'B';

    return {
      yield: finalYield.toFixed(1),
      chips: chipsPerWafer,
      knownGoodDies,
      dieArea: areaPerDie,
      chipletsNeeded,
      wastedCost,
      wastedCostLabel: formatCurrency(wastedCost),
      costPerProcessorLabel: costPerProcessor ? formatCurrency(costPerProcessor) : 'SCRAP',
      grade: isOverLimit ? 'F' : grade,
      isOverLimit
    };
  }, [architecture, coreCount, defectDensity]);

  const [defects, setDefects] = useState([]);

  useEffect(() => {
    // Generate random defect dots for the visualizer
    const numDefects = Math.floor(defectDensity * 300);
    const newDefects = [];
    for (let i = 0; i < numDefects; i++) {
      newDefects.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`
      });
    }
    setDefects(newDefects);
  }, [defectDensity, architecture]);

  return (
    <div className="chip-sim-root">
      <div className="sim-wrapper">

        {/* LEFT SIDEBAR */}
        <div className="sim-sidebar">
          <div className="sim-header">SIM_CONTROL_PANEL</div>

          <div className="sim-toggle-group">
            <button
              className={`sim-toggle ${architecture === 'monolithic' ? 'active' : ''}`}
              onClick={() => setArchitecture('monolithic')}
            >
              MONOLITHIC
            </button>
            <button
              className={`sim-toggle ${architecture === 'chiplet' ? 'active' : ''}`}
              onClick={() => setArchitecture('chiplet')}
            >
              CHIPLET
            </button>
          </div>

          <div className="sim-controls">
            <div className="sim-control-item">
              <div className="sim-label">
                <span>TARGET_CORES</span>
                <span className="sim-value">{coreCount}</span>
              </div>
              <input
                type="range" min="4" max="64" step="4"
                value={coreCount}
                onChange={(e) => setCoreCount(Number(e.target.value))}
              />
            </div>

            <div className="sim-control-item">
              <div className="sim-label">
                <span>DEFECT_DENSITY (cm²)</span>
                <span className="sim-value">{defectDensity.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0.1" max="2.0" step="0.1"
                value={defectDensity}
                onChange={(e) => setDefectDensity(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="sim-model-note">
            <span>DIE_MODEL</span>
            <strong>
              {architecture === 'chiplet'
                ? `${stats.chipletsNeeded} x ${stats.dieArea}mm² dies`
                : `${stats.dieArea}mm² die`}
            </strong>
          </div>

          {stats.isOverLimit && (
            <div className="sim-warning-banner">
              ⚠ RETICLE LIMIT EXCEEDED — Die area ({stats.dieArea}mm²) exceeds the 800mm² maximum. This design cannot be manufactured.
            </div>
          )}

          <div className="sim-telemetry">
            <h4 className="sim-telemetry-title">TELEMETRY</h4>

            <div className="sim-stats-grid">
              <div className="sim-stat-box">
                <span className="stat-label">YIELD</span>
                <span className={`stat-value ${Number(stats.yield) < 50 ? 'danger' : 'safe'}`}>
                  {stats.yield}%
                </span>
              </div>
              <div className="sim-stat-box">
                <span className="stat-label">CHIPS/WFR</span>
                <span className="stat-value text-white">{stats.chips}</span>
              </div>
              <div className="sim-stat-box">
                <span className="stat-label">DIE_AREA</span>
                <span className="stat-value text-white">{stats.dieArea}mm²</span>
              </div>
              <div className="sim-stat-box sim-stat-box--wide">
                <span className="stat-label">WASTED_SILICON_COST</span>
                <span className={`stat-value ${stats.wastedCost > WAFER_COST / 2 ? 'danger' : 'safe'}`}>
                  {stats.wastedCostLabel}
                </span>
              </div>
              <div className="sim-stat-box sim-stat-box--wide">
                <span className="stat-label">EST_COST/CPU</span>
                <span className="stat-value text-white">{stats.costPerProcessorLabel}</span>
              </div>
            </div>

            <div className="sim-grade-box">
              <span className="stat-label">GRADE</span>
              <span className={`grade-value ${stats.grade === 'D' || stats.grade === 'F' ? 'danger' : ''}`}>{stats.grade}</span>
            </div>
          </div>
        </div>

        {/* RIGHT VISUALIZER */}
        <div className="sim-visualizer">
          <div className="wafer-container">
            <div className={`wafer-grid ${architecture}`}>
              {defects.map(defect => (
                <div
                  key={defect.id}
                  className="defect-dot"
                  style={{ top: defect.top, left: defect.left }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
        <div className="explanation">
          <p>
            The model uses the <strong>Negative Binomial yield formula</strong>:{' '}
            <code>Y = (1 + (D₀ × A) / α)^(−α)</code>, where D₀ is defect density,
            A is total die area (core count × {AREA_PER_CORE_MM2}mm² per core),
            and α = {YIELD_ALPHA} (clustering factor).
            Wafer cost is fixed at {formatCurrency(WAFER_COST)} and wasted silicon capital
            is <strong>wastedCost = waferCost × (1 − yield)</strong>.
          </p>

          <p>
            Monolithic mode grows one die with the target core count, so defect exposure
            rises sharply and the reticle limit can force total scrap. Chiplet mode keeps
            the simulated compute die at {CHIPLET_CORES} cores, then combines known-good
            dies into the requested processor.
          </p>

          <p><strong>Grade Legend:</strong></p>
          <ul className="grade-legend">
            <li><strong>A</strong> — Yield ≥ 80%. Highly profitable, efficient use of silicon.</li>
            <li><strong>B</strong> — Yield 60–79%. Acceptable for most products.</li>
            <li><strong>C</strong> — Yield 40–59%. Marginal. Cost per chip is elevated.</li>
            <li><strong>D</strong> — Yield 20–39%. Poor economics. Most wafer value is lost.</li>
            <li><strong>F</strong> — Yield &lt; 20% or reticle exceeded. Manufacturing is not viable.</li>
          </ul>

          <p className="sim-hint">
            💡 <strong>Try it:</strong> Set cores to 64 in Monolithic mode and watch yield collapse.
            Then switch to Chiplet mode to see the difference.
          </p>
        </div>
    </div>

  );
}