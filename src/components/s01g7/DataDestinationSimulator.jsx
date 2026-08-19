import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DATA_TYPES = {
  photos: {
    name: 'Photos', icon: '🖼️', sizeLabel: '5 MB – 50 GB', sizePct: 30,
    accessLabel: 'Frequent', accessPct: 70,
    retentionLabel: 'Medium-term', retentionPct: 45,
    securityLabel: 'Low', securityPct: 25,
  },
  videos: {
    name: 'Videos', icon: '🎬', sizeLabel: '1 GB – 5 TB', sizePct: 90,
    accessLabel: 'High', accessPct: 65,
    retentionLabel: 'Long-term', retentionPct: 70,
    securityLabel: 'Medium', securityPct: 40,
  },
  documents: {
    name: 'Documents', icon: '📄', sizeLabel: '1 KB – 10 MB', sizePct: 10,
    accessLabel: 'Very Frequent', accessPct: 85,
    retentionLabel: 'Ongoing', retentionPct: 55,
    securityLabel: 'High', securityPct: 80,
  },
  backups: {
    name: 'Backups', icon: '🗄️', sizeLabel: '10 GB – 10 TB', sizePct: 75,
    accessLabel: 'Rare', accessPct: 20,
    retentionLabel: 'Long-term', retentionPct: 80,
    securityLabel: 'High', securityPct: 85,
  },
  archives: {
    name: 'Archives', icon: '📦', sizeLabel: '100 GB – 100 TB+', sizePct: 100,
    accessLabel: 'Very Rare', accessPct: 10,
    retentionLabel: 'Permanent', retentionPct: 100,
    securityLabel: 'Very High', securityPct: 95,
  },
};

const TECHS = {
  ssd: {
    name: 'SSD Storage', icon: '💾',
    bullets: ['Very fast access', 'Limited capacity', 'Higher cost / GB'],
    bestFor: 'Best for: active files, apps, high-performance work',
    how: 'SSD storage keeps data on flash memory chips located inside the device itself. Because there is no physical read/write arm and no network hop involved, files load almost instantly.',
    ratings: { accessibility: 'medium', scalability: 'low', reliability: 'medium', cost: 'medium', security: 'medium' },
    stars: { speed: 5, capacity: 3, reliability: 4, accessibility: 3, cost: 3, longevity: 1 },
    journey: [
      { icon: '💻', label: 'Your Device' },
      { icon: '💾', label: 'Local SSD', sub: 'On-device flash memory' },
      { icon: '✅', label: 'Instantly Available' },
    ],
  },
  cloud: {
    name: 'Cloud Storage', icon: '☁️',
    bullets: ['Access anywhere', 'Highly scalable', 'Needs internet'],
    bestFor: 'Best for: personal files, sharing, collaboration',
    how: 'Cloud storage sends your data over the internet to a provider’s remote servers. The provider automatically replicates it across multiple machines and, often, multiple locations so it stays available.',
    ratings: { accessibility: 'high', scalability: 'high', reliability: 'high', cost: 'good', security: 'good' },
    stars: { speed: 4, capacity: 5, reliability: 5, accessibility: 5, cost: 4, longevity: 3 },
    journey: [
      { icon: '💻', label: 'Your Device' },
      { icon: '🌐', label: 'Internet' },
      { icon: '☁️', label: 'Cloud Server', sub: 'Primary storage' },
      { icon: '🗄️', label: 'Backup Servers', sub: 'Multiple locations' },
      { icon: '🛡️', label: 'Data Protected', sub: 'Secure & redundant' },
    ],
  },
  distributed: {
    name: 'Distributed Storage', icon: '🕸️',
    bullets: ['Multiple nodes', 'High reliability', 'Massive scalability'],
    bestFor: 'Best for: enterprises, big data, streaming',
    how: 'Distributed storage splits your data into shards and/or replicated copies, then spreads those pieces across many independent servers and locations so no single failure can take it offline.',
    ratings: { accessibility: 'high', scalability: 'high', reliability: 'high', cost: 'medium', security: 'good' },
    stars: { speed: 4, capacity: 5, reliability: 5, accessibility: 4, cost: 3, longevity: 4 },
    journey: [
      { icon: '💻', label: 'Your Device' },
      { icon: '🌐', label: 'Internet' },
      { icon: '🔀', label: 'Shard / Replicate' },
      { icon: '🖥️', label: 'Node Cluster', sub: 'Many servers, many sites' },
      { icon: '🛡️', label: 'Fault-Tolerant' },
    ],
  },
  dna: {
    name: 'DNA Storage', icon: '🧬',
    bullets: ['Experimental tech', 'Ultra-high density', 'Very long lifespan'],
    bestFor: 'Best for: archives, long-term preservation',
    how: 'DNA storage encodes your data as sequences of the four DNA bases (A, T, C, G), synthesizes real DNA strands from that code, and preserves them in a sealed capsule until they need to be sequenced back into digital form.',
    ratings: { accessibility: 'low', scalability: 'high', reliability: 'medium', cost: 'low', security: 'good' },
    stars: { speed: 1, capacity: 5, reliability: 4, accessibility: 1, cost: 1, longevity: 5 },
    journey: [
      { icon: '💻', label: 'Digital Data' },
      { icon: '🧬', label: 'DNA Synthesis', sub: 'Encoded into A T C G' },
      { icon: '🧪', label: 'Sealed Capsule', sub: 'Long-term vault' },
      { icon: '🔬', label: 'Sequenced on Demand' },
    ],
  },
};

const SUITABILITY = {
  photos: { ssd: 78, cloud: 90, distributed: 70, dna: 35 },
  videos: { ssd: 62, cloud: 87, distributed: 82, dna: 40 },
  documents: { ssd: 92, cloud: 80, distributed: 58, dna: 30 },
  backups: { ssd: 55, cloud: 85, distributed: 88, dna: 60 },
  archives: { ssd: 38, cloud: 68, distributed: 76, dna: 95 },
};

const RATING_LABEL = { high: 'High', medium: 'Medium', good: 'Good', low: 'Low' };

const SCAN_PHRASES = [
  'Reading data profile…',
  'Matching storage technology…',
  'Calculating compatibility…',
  'Finalizing results…',
];

const SCAN_DURATION = 1000;
const RING_CIRCUMFERENCE = 345.6;

function Stars({ count }) {
  return (
    <span className="sim-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? 'star-on' : ''}>★</span>
      ))}
    </span>
  );
}

function verdictFor(score) {
  if (score >= 85) return { text: 'Excellent Choice!', color: 'var(--accent-green)' };
  if (score >= 70) return { text: 'Good Choice', color: 'var(--accent-cyan)' };
  if (score >= 50) return { text: 'Workable — consider alternatives', color: '#ffd23f' };
  return { text: 'Not Recommended', color: 'var(--accent-magenta)' };
}

export default function DataDestinationSimulator() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dataType, setDataType] = useState('photos');
  const [tech, setTech] = useState('cloud');
  const [phase, setPhase] = useState('idle');
  const [loadingText, setLoadingText] = useState(SCAN_PHRASES[0]);

  const fillRef = useRef(null);
  const resultRef = useRef(null);
  const scanTimer = useRef(null);
  const scanInterval = useRef(null);

  const clearTimers = () => {
    clearTimeout(scanTimer.current);
    clearInterval(scanInterval.current);
    scanTimer.current = null;
    scanInterval.current = null;
  };

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('sim-locked');
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('sim-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => { setMounted(true); }, []);

  const resetToUnrun = () => {
    clearTimers();
    setPhase('idle');
  };

  const changeDataType = (key) => {
    setDataType(key);
    if (phase !== 'idle') resetToUnrun();
  };

  const changeTech = (key) => {
    setTech(key);
    if (phase !== 'idle') resetToUnrun();
  };

  const runSimulation = () => {
    if (phase === 'running') return;
    clearTimers();
    setPhase('running');

    const fill = fillRef.current;
    if (fill) {
      fill.style.transition = 'none';
      fill.style.width = '0%';
      void fill.offsetWidth;
      fill.style.transition = `width ${SCAN_DURATION}ms linear`;
      requestAnimationFrame(() => { fill.style.width = '100%'; });
    }

    let phraseIndex = 0;
    setLoadingText(SCAN_PHRASES[0]);
    scanInterval.current = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % SCAN_PHRASES.length;
      setLoadingText(SCAN_PHRASES[phraseIndex]);
    }, SCAN_DURATION / SCAN_PHRASES.length);

    scanTimer.current = setTimeout(() => {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
      setPhase('revealed');

      const resultWrap = resultRef.current;
      if (resultWrap) {
        let hasScrolled = false;
        const scrollToResult = (e) => {
          if (e && e.propertyName !== 'max-height') return;
          if (hasScrolled) return;
          hasScrolled = true;
          resultWrap.removeEventListener('transitionend', scrollToResult);
          resultWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        resultWrap.addEventListener('transitionend', scrollToResult);
        setTimeout(scrollToResult, 700);
      }
    }, SCAN_DURATION);
  };

  const dt = DATA_TYPES[dataType];
  const t = TECHS[tech];
  const score = SUITABILITY[dataType][tech];
  const verdict = verdictFor(score);
  const ringOffset = RING_CIRCUMFERENCE * (1 - score / 100);
  const ringColor = score >= 70 ? 'var(--accent-green)' : score >= 50 ? '#ffd23f' : 'var(--accent-magenta)';

  const profileRows = [
    { icon: '📏', label: 'Size', value: dt.sizeLabel, pct: dt.sizePct },
    { icon: '⏱️', label: 'Access Frequency', value: dt.accessLabel, pct: dt.accessPct },
    { icon: '📅', label: 'Retention Period', value: dt.retentionLabel, pct: dt.retentionPct },
    { icon: '🛡️', label: 'Security Need', value: dt.securityLabel, pct: dt.securityPct },
  ];

  const ratingEntries = [
    ['Accessibility', t.ratings.accessibility],
    ['Scalability', t.ratings.scalability],
    ['Reliability', t.ratings.reliability],
    ['Cost Efficiency', t.ratings.cost],
    ['Security', t.ratings.security],
  ];

  return (
    <>
      <div className="sim-launch-card">
        <div className="sim-launch-icon">📡</div>
        <h3>Where Would Your Data Live?</h3>
        <p>
          Pick a data type, choose a storage technology, and watch where it travels —
          from your device to SSDs, the cloud, distributed server clusters, or even
          synthetic DNA. Compare trade-offs and see which option fits best.
        </p>
        <button className="sim-launch-btn" onClick={() => setOpen(true)}>▶ Launch Simulator</button>
        <div className="sim-launch-tags">
          <span className="sim-launch-tag">💾 SSD</span>
          <span className="sim-launch-tag">☁️ Cloud</span>
          <span className="sim-launch-tag">🕸️ Distributed</span>
          <span className="sim-launch-tag">🧬 DNA</span>
        </div>
      </div>

      {mounted && createPortal(
        <div
          className={`sim-overlay${open ? ' is-open' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
        <div className="sim-modal" role="dialog" aria-modal="true" aria-label="Data Storage Destination Simulator">
          <div className="sim-modal-header">
            <div className="sim-modal-title">
              <span className="sim-modal-title-icon">📡</span> Data Storage Destination Simulator
            </div>
            <button className="sim-modal-close" onClick={() => setOpen(false)} aria-label="Close simulator">✕</button>
          </div>

          <div className="sim-modal-body">
            <section>
              <div className="sim-step">
                <span className="sim-step-num">1</span>
                <span className="sim-step-title">SELECT DATA TYPE</span>
                <span className="sim-step-sub">Choose the type of data you want to store</span>
              </div>
              <div className="sim-datatype-grid">
                {Object.entries(DATA_TYPES).map(([key, d]) => (
                  <div
                    key={key}
                    className={`sim-datatype-card${key === dataType ? ' is-selected' : ''}`}
                    onClick={() => changeDataType(key)}
                  >
                    <span className="dt-icon">{d.icon}</span>
                    <div className="dt-name">{d.name}</div>
                    <div className="dt-size">{d.sizeLabel}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="sim-step">
                <span className="sim-step-num">2</span>
                <span className="sim-step-title">DATA PROFILE</span>
                <span className="sim-step-sub">Understanding your data</span>
              </div>
              <div className="sim-profile-grid">
                {profileRows.map((row) => (
                  <div className="sim-profile-row" key={row.label}>
                    <div className="pr-top">
                      <span>{row.icon} {row.label}</span>
                      <span className="pr-value">{row.value}</span>
                    </div>
                    <div className="pr-track"><div className="pr-fill" style={{ width: `${row.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="sim-step">
                <span className="sim-step-num">3</span>
                <span className="sim-step-title">CHOOSE STORAGE TECHNOLOGY</span>
                <span className="sim-step-sub">Select where you want to store your data</span>
              </div>
              <div className="sim-tech-grid">
                {Object.entries(TECHS).map(([key, tk]) => (
                  <div
                    key={key}
                    className={`sim-tech-card${key === tech ? ' is-selected' : ''}`}
                    onClick={() => changeTech(key)}
                  >
                    <span className="tc-icon">{tk.icon}</span>
                    <div className="tc-name">{tk.name.toUpperCase()}</div>
                    <ul className="tc-bullets">
                      {tk.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                    <div className="tc-bestfor">{tk.bestFor}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="sim-run-section">
              <div className={`sim-run-wrap${phase === 'running' ? ' is-hidden' : ''}`}>
                <button className="sim-run-btn" onClick={runSimulation}>
                  <span className="sim-run-btn-icon">▶</span>
                  <span>{phase === 'revealed' ? '↻ Re-run Simulation' : 'Run Simulation'}</span>
                </button>
                <p className="sim-run-hint">
                  {phase === 'revealed'
                    ? 'Change a selection above to try a different combination'
                    : 'See where your data goes and how well it fits'}
                </p>
              </div>

              <div className={`sim-loading${phase === 'running' ? ' is-active' : ''}`}>
                <div className="sim-loading-ring" />
                <div className="sim-loading-text">{loadingText}</div>
                <div className="sim-loading-track"><div className="sim-loading-fill" ref={fillRef} /></div>
              </div>
            </section>

            <div className={`sim-result-wrap${phase === 'revealed' ? ' is-revealed' : ''}`} ref={resultRef}>
              <section>
                <div className="sim-step">
                  <span className="sim-step-num">4</span>
                  <span className="sim-step-title">STORAGE JOURNEY</span>
                  <span className="sim-step-sub">See where your data will go</span>
                </div>
                <div className="sim-journey-row">
                  {t.journey.map((step, i) => (
                    <Fragment key={i}>
                      {i > 0 && <span className="sim-journey-arrow">→</span>}
                      <div className="sim-journey-step">
                        <span className="js-icon">{step.icon}</span>
                        <div className="js-label">{step.label}</div>
                        {step.sub && <div className="js-sub">{step.sub}</div>}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </section>

              <section>
                <div className="sim-step">
                  <span className="sim-step-num">5</span>
                  <span className="sim-step-title">STORAGE STATS</span>
                  <span className="sim-step-sub">Based on your selection</span>
                </div>
                <div className="sim-stats-wrap">
                  <div className="sim-score-gauge">
                    <svg viewBox="0 0 130 130" width="130" height="130">
                      <circle className="ring-bg" cx="65" cy="65" r="55" />
                      <circle
                        className="ring-fill"
                        cx="65" cy="65" r="55"
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={ringOffset}
                        style={{ stroke: ringColor }}
                      />
                    </svg>
                    <div className="sim-score-center">
                      <div className="sim-score-num">{score}%</div>
                      <div className="sim-score-caption">SUITABILITY<br />SCORE</div>
                    </div>
                  </div>
                  <div className="sim-stats-right">
                    <div className="sim-verdict" style={{ color: verdict.color }}>{verdict.text}</div>
                    <ul className="sim-checklist">
                      {ratingEntries.map(([label, rating]) => (
                        <li key={label}>
                          <span>{label}</span>
                          <span className={`cl-tag tag-${rating}`}>{RATING_LABEL[rating]}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="sim-verdict-note">
                      {t.name} for {dt.name.toLowerCase()}: {t.how}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="sim-step">
                  <span className="sim-step-num">6</span>
                  <span className="sim-step-title">COMPARE TECHNOLOGIES</span>
                  <span className="sim-step-sub">See how different storage options compare</span>
                </div>
                <table className="sim-compare-table">
                  <thead>
                    <tr>
                      <th></th><th>Speed</th><th>Capacity</th><th>Reliability</th>
                      <th>Accessibility</th><th>Cost</th><th>Longevity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(TECHS).map(([key, tk]) => (
                      <tr key={key} className={key === tech ? 'is-current' : ''}>
                        <td>{tk.icon} {tk.name}</td>
                        <td><Stars count={tk.stars.speed} /></td>
                        <td><Stars count={tk.stars.capacity} /></td>
                        <td><Stars count={tk.stars.reliability} /></td>
                        <td><Stars count={tk.stars.accessibility} /></td>
                        <td><Stars count={tk.stars.cost} /></td>
                        <td><Stars count={tk.stars.longevity} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </div>
        </div>,
        document.body
      )}
    </>
  );
}
