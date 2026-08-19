// Fully self-contained (inline styles + one embedded <style> for the
// keyframes) — no dependency on any external stylesheet, no JS state
// beyond what's needed to render the badges, so nothing here can break
// the way the old separate-CSS-file components did.

const LANES = [
  {
    key: 'sata',
    label: 'SATA III SSD',
    icon: '\uD83D\uDC22',
    color: '#00FFFF',
    duration: '3.4s',
    throughput: '~550 MB/s',
    bus: 'SATA',
    protocol: 'AHCI',
    queues: '1 \u00D7 32',
    form: '2.5\u2033',
  },
  {
    key: 'nvme3',
    label: 'NVMe (PCIe 3.0 x4)',
    icon: '\uD83D\uDE97',
    color: '#39FF14',
    duration: '1.3s',
    throughput: '~3,500 MB/s',
    bus: 'PCIe 3.0',
    protocol: 'NVMe',
    queues: '65,535 \u00D7 65,536',
    form: 'M.2 / U.2',
  },
  {
    key: 'nvme4',
    label: 'NVMe (PCIe 4.0 x4)',
    icon: '\uD83D\uDE80',
    color: '#FF00FF',
    duration: '0.7s',
    throughput: '~7,000 MB/s',
    bus: 'PCIe 4.0',
    protocol: 'NVMe',
    queues: '65,535 \u00D7 65,536',
    form: 'M.2 / U.2',
  },
];

const wrapStyle = {
  position: 'relative',
  margin: '1.75rem 0',
  padding: '1.6rem 1.5rem 1.4rem',
  background:
    'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.06), transparent 60%), rgba(10,0,20,0.85)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '10px',
};

const headerStyle = {
  textAlign: 'center',
  fontFamily: 'var(--font-head)',
  fontSize: '0.68rem',
  letterSpacing: '2.5px',
  color: 'rgba(170,170,204,0.6)',
  textTransform: 'uppercase',
  marginBottom: '1.2rem',
};

function Badge({ label, value, color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.3rem',
        fontSize: '0.64rem',
        letterSpacing: '0.3px',
        padding: '0.2rem 0.55rem',
        borderRadius: '20px',
        border: `1px solid ${color}33`,
        background: `${color}0d`,
        color: 'rgba(200,200,220,0.8)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color, opacity: 0.85, fontFamily: 'var(--font-head)' }}>{label}</span>
      <span>{value}</span>
    </span>
  );
}

export default function BusSpeedRace() {
  return (
    <div style={wrapStyle}>
      <style>{`
        @keyframes busRaceRun {
          0%   { left: -8%; opacity: 0; }
          6%   { opacity: 1; }
          94%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

      <div style={headerStyle}>Same Request, Different Roads</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {LANES.map((lane) => (
          <div key={lane.key}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                letterSpacing: '0.4px',
                marginBottom: '0.4rem',
                color: lane.color,
                fontFamily: 'var(--font-head)',
              }}
            >
              <span>{lane.label}</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                {lane.throughput}
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                height: '32px',
                borderRadius: '16px',
                background:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 10px, transparent 10px 22px), rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  fontSize: '1.15rem',
                  transform: 'translateY(-50%)',
                  filter: `drop-shadow(0 0 6px ${lane.color})`,
                  animation: `busRaceRun ${lane.duration} linear infinite`,
                }}
              >
                {lane.icon}
              </span>

              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.9rem',
                  opacity: 0.6,
                }}
              >
                {'\uD83C\uDFC1'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
                marginTop: '0.55rem',
              }}
            >
              <Badge label="Bus" value={lane.bus} color={lane.color} />
              <Badge label="Protocol" value={lane.protocol} color={lane.color} />
              <Badge label="Queues" value={lane.queues} color={lane.color} />
              <Badge label="Form" value={lane.form} color={lane.color} />
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.3rem',
          fontSize: '0.68rem',
          color: 'rgba(170,170,204,0.45)',
          letterSpacing: '0.3px',
        }}
      >
        Illustrative — lap times are scaled for visibility, not a literal ratio of the MB/s figures.
      </p>
    </div>
  );
}