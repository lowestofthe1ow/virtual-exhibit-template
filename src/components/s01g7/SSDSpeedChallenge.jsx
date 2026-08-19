import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Small inline icon components — no external icon package needed.
function CpuIcon({ size = 20, color, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  );
}

function HardDriveIcon({ size = 20, color, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <line x1="22" y1="12" x2="2" y2="12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" y1="16" x2="6.01" y2="16" />
      <line x1="10" y1="16" x2="10.01" y2="16" />
    </svg>
  );
}

function ZapIcon({ size = 20, color, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// --- Device profiles, sourced from the article's own numbers ---
const DEVICES = {
  hdd: {
    label: 'HDD', sub: '7,200 RPM', icon: HardDriveIcon, accent: '#FF0080',
    concurrency: 1, stepMs: 480,
    latency: '~6 ms', iops: '~150', throughput: '~150 MB/s',
    barPct: { speed: 12, latency: 95, iops: 4 },
    blurb: 'One request at a time — the arm has to physically seek before each read.',
    legend: 'One request serviced at a time (physical seek).',
  },
  sata: {
    label: 'SATA SSD', sub: 'AHCI · 1 queue × 32', icon: ZapIcon, accent: '#00FFFF',
    concurrency: 6, stepMs: 140,
    latency: '~100 µs', iops: '~50,000', throughput: '~550 MB/s',
    barPct: { speed: 55, latency: 15, iops: 45 },
    blurb: 'No seek time, but AHCI still caps the drive to a single command queue.',
    legend: 'No seek time, but capped to one AHCI queue, 32 commands deep.',
  },
  nvme: {
    label: 'NVMe SSD', sub: 'PCIe · 65,535 queues', icon: CpuIcon, accent: '#39FF14',
    concurrency: 8, stepMs: 70,
    latency: '~20 µs', iops: '1,000,000+', throughput: '~7,000 MB/s',
    barPct: { speed: 100, latency: 3, iops: 100 },
    blurb: 'Thousands of queues in flight at once — requests barely wait at all.',
    legend: 'Talks directly over PCIe with up to 65,535 parallel queues.',
  },
};

const ORDER = ['hdd', 'sata', 'nvme'];
const QUEUE_SIZE = 16;
const READY_MSG = 'Press "Send Requests" to send 16 read requests.';

function randomAddr() {
  const n = Math.floor(Math.random() * 0xffff);
  return '0x' + n.toString(16).padStart(4, '0').toUpperCase();
}

function makeQueue() {
  return Array.from({ length: QUEUE_SIZE }, (_, i) => ({
    id: i,
    addr: randomAddr(),
    status: 'queued', // queued | active | done
  }));
}

export default function SSDSpeedChallenge() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [deviceKey, setDeviceKey] = useState('nvme');
  const [queue, setQueue] = useState(makeQueue);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [runStats, setRunStats] = useState(READY_MSG);
  const timers = useRef([]);

  const device = DEVICES[deviceKey];
  const Icon = device.icon;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => { setMounted(true); }, []);

  // Same lifecycle pattern as the horizon simulator: lock body scroll
  // and wire Escape-to-close while open; stop any in-flight run when
  // the modal closes (including on unmount).
  useEffect(() => {
    if (!open) {
      clearTimers();
      setRunning(false);
      return;
    }
    document.body.classList.add('sim-locked');
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('sim-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  const selectDevice = (key) => {
    if (running) return;
    setDeviceKey(key);
    setQueue(makeQueue());
    setCycles(0);
    setRunStats(READY_MSG);
  };

  const reset = () => {
    clearTimers();
    setRunning(false);
    setDeviceKey('nvme');
    setQueue(makeQueue());
    setCycles(0);
    setRunStats(READY_MSG);
  };

  const runQueue = useCallback(() => {
    if (running) return;
    clearTimers();
    const fresh = makeQueue();
    setQueue(fresh);
    setRunning(true);
    setCycles(0);

    const { concurrency, stepMs } = DEVICES[deviceKey];
    const totalBatches = Math.ceil(QUEUE_SIZE / concurrency);
    let pending = fresh.map((r) => r.id);
    let batchIndex = 0;
    let elapsed = 0;
    const startTime = Date.now();

    setRunStats(`Batch 1 of ${totalBatches} · 0ms elapsed`);

    const runBatch = () => {
      if (pending.length === 0) {
        setRunning(false);
        const total = Date.now() - startTime;
        setRunStats(
          `✓ Completed in ${total}ms across ${totalBatches} batch${totalBatches === 1 ? '' : 'es'} of up to ${concurrency} request${concurrency === 1 ? '' : 's'} each`
        );
        return;
      }
      const batch = pending.slice(0, concurrency);
      pending = pending.slice(concurrency);
      batchIndex += 1;
      setCycles(batchIndex);
      setRunStats(`Batch ${batchIndex} of ${totalBatches} · ${elapsed}ms elapsed`);

      setQueue((prev) =>
        prev.map((r) => (batch.includes(r.id) ? { ...r, status: 'active' } : r))
      );

      const t1 = setTimeout(() => {
        setQueue((prev) =>
          prev.map((r) => (batch.includes(r.id) ? { ...r, status: 'done' } : r))
        );
        elapsed += stepMs + 90;
        const t2 = setTimeout(runBatch, 90);
        timers.current.push(t2);
      }, stepMs);
      timers.current.push(t1);
    };

    runBatch();
  }, [deviceKey, running]);

  return (
    <>
      <div className="sim-launch-card">
        <div className="sim-launch-icon">⚡</div>
        <h3>Race the Read Queue</h3>
        <p>
          Send 16 read requests at once and watch an HDD's mechanical arm crawl through
          them one at a time while an NVMe SSD pulls several at once. Fewer batches and
          less total time both mean a faster drive.
        </p>
        <button className="sim-launch-btn" onClick={() => setOpen(true)}>▶ Launch Simulator</button>
        <div className="sim-launch-tags">
          <span className="sim-launch-tag">💽 HDD</span>
          <span className="sim-launch-tag">🔷 SATA SSD</span>
          <span className="sim-launch-tag">⚡ NVMe SSD</span>
        </div>
      </div>

      {mounted && createPortal(
        <div
          className={`sim-overlay${open ? ' is-open' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="sim-modal" role="dialog" aria-modal="true" aria-label="SSD Speed Challenge">
            <div className="sim-modal-header">
              <div className="sim-modal-title">
                <span className="sim-modal-title-icon">⚡</span> SSD Speed Challenge
              </div>
              <button className="sim-modal-close" onClick={() => setOpen(false)} aria-label="Close simulator">✕</button>
            </div>

            <div className="sim-modal-body">
              <div className="ssdsim-body">
                <div className="ssdsim-devices" role="group" aria-label="Storage device selector">
                  {ORDER.map((key) => {
                    const d = DEVICES[key];
                    const DIcon = d.icon;
                    const selected = key === deviceKey;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={'ssdsim-device-btn' + (selected ? ' active' : '')}
                        disabled={running}
                        aria-pressed={selected}
                        style={{
                          borderColor: selected ? d.accent : 'rgba(170,170,204,0.25)',
                          color: selected ? d.accent : '#888',
                        }}
                        onClick={() => selectDevice(key)}
                      >
                        <DIcon size={20} />
                        <span className="dname">{d.label}</span>
                        <span className="dsub">{d.sub}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <div className="ssdsim-path">
                    <div className="ssdsim-path-node">
                      <div className="ssdsim-path-box">
                        <CpuIcon size={20} color="rgba(200,200,220,0.8)" />
                      </div>
                      <span className="ssdsim-path-label">CPU</span>
                    </div>
                    <div className="ssdsim-path-line" style={{ background: `${device.accent}44` }}>
                      <div
                        className={'ssdsim-path-dot' + (running ? ' on' : '')}
                        style={{ background: device.accent, left: `${(cycles * 37) % 90}%` }}
                      />
                    </div>
                    <div className="ssdsim-path-node">
                      <div className="ssdsim-path-box" style={{ borderColor: device.accent, color: device.accent }}>
                        <Icon size={20} />
                      </div>
                      <span className="ssdsim-path-label" style={{ color: device.accent }}>{device.label}</span>
                    </div>
                  </div>

                  <div className="ssdsim-queue-head">
                    <span className="ssdsim-queue-label">
                      {QUEUE_SIZE} requests &mdash; {device.label} reads {device.concurrency === 1 ? '1 at a time' : `${device.concurrency} at a time`}
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      id="fireBtn"
                      disabled={running}
                      style={{ borderColor: device.accent, color: running ? '#666' : device.accent }}
                      onClick={runQueue}
                    >
                      {running ? 'Sending…' : 'Send Requests'}
                    </button>
                  </div>

                  <div className="ssdsim-cell-legend">
                    <span className="cell-legend-item"><span className="cell-swatch cell-waiting" /> Waiting its turn</span>
                    <span className="cell-legend-item"><span className="cell-swatch cell-reading" /> Being read right now</span>
                    <span className="cell-legend-item"><span className="cell-swatch cell-done" /> Done</span>
                  </div>

                  <div
                    className="ssdsim-queue-grid"
                    role="img"
                    aria-label={`${QUEUE_SIZE} pending read requests, ${device.concurrency === 1 ? 'serviced one at a time' : `serviced ${device.concurrency} at a time`}`}
                  >
                    {queue.map((r) => (
                      <div
                        key={r.id}
                        className="ssdsim-queue-cell"
                        title={r.addr}
                        style={{
                          background: r.status === 'done' ? `${device.accent}33` : r.status === 'active' ? device.accent : '',
                          borderColor: r.status === 'done' || r.status === 'active' ? device.accent : '',
                          color: r.status === 'active' ? '#000' : '',
                        }}
                      >
                        {r.status === 'active' ? '●' : ''}
                      </div>
                    ))}
                  </div>

                  <p className="ssdsim-runstats" aria-live="polite">{runStats}</p>

                  <p className="ssdsim-stats-caption">These numbers summarize why, in three ways:</p>
                  <div className="ssdsim-stats">
                    {[
                      { label: 'Access Speed', pct: device.barPct.speed, value: device.throughput },
                      { label: 'Latency', pct: device.barPct.latency, value: device.latency },
                      { label: 'IOPS', pct: device.barPct.iops, value: device.iops },
                    ].map((stat) => (
                      <div className="ssdsim-stat" key={stat.label}>
                        <div className="ssdsim-stat-track">
                          <div
                            className="ssdsim-stat-fill"
                            style={{ height: `${Math.max(stat.pct, 4)}%`, background: device.accent }}
                          />
                        </div>
                        <span className="ssdsim-stat-name">{stat.label}</span>
                        <span className="ssdsim-stat-value" style={{ color: device.accent }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="ssdsim-blurb">{device.blurb}</p>

                  <div className="ssdsim-legend">
                    {ORDER.map((key) => {
                      const d = DEVICES[key];
                      return (
                        <div className="ssdsim-legend-item" key={key}>
                          <span className="ssdsim-legend-swatch" style={{ background: d.accent }} />
                          <span><span className="ssdsim-legend-name" style={{ color: d.accent }}>{d.label}</span> — {d.legend}</span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="ssdsim-caveat">
                    <strong>Simplified model:</strong> concurrency and per-request timing above are
                    illustrative, scaled from each interface&rsquo;s real queue depth and typical
                    latency — not a cycle-accurate simulation of controller firmware.
                  </p>
                </div>
              </div>

              <div className="sim-actions">
                <button type="button" className="btn btn-outline btn-sm" id="simReset" aria-label="Reset simulator to NVMe SSD" onClick={reset}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}