// Fully self-contained: inline styles + one embedded <style> tag for the
// travel keyframes. No external stylesheet dependency.

const SATA_COLOR = '#00FFFF';
const NVME_COLOR = '#39FF14';

const NVME_LANE_COUNT = 5;
const NVME_DELAYS = [0, 0.22, 0.44, 0.66, 0.88];

function EndpointIcon({ icon, color, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          background: 'rgba(0,0,0,0.35)',
          border: `1px solid ${color}88`,
          boxShadow: `0 0 12px ${color}33`,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.4px', color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

export default function InterfacePathDiagram() {
  return (
    <div
      style={{
        position: 'relative',
        margin: '1.75rem 0',
        padding: '1.75rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.05), transparent 60%), rgba(10,0,20,0.85)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '10px',
      }}
    >
      <style>{`
        @keyframes pathTravel {
          0%   { left: -6%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-head)',
          fontSize: '0.68rem',
          letterSpacing: '2.5px',
          color: 'rgba(170,170,204,0.6)',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}
      >
        The Road to the CPU
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* --- SATA panel --- */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '0.8rem',
            }}
          >
            <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.78rem', color: SATA_COLOR, letterSpacing: '0.5px' }}>
              SATA III &middot; 2003
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                color: 'rgba(200,200,220,0.7)',
                border: `1px solid ${SATA_COLOR}33`,
                background: `${SATA_COLOR}0d`,
                borderRadius: '20px',
                padding: '0.15rem 0.5rem',
              }}
            >
              AHCI &middot; 1 queue &times; 32
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <EndpointIcon icon={'\uD83D\uDCBB'} color={SATA_COLOR} label="CPU" />

            <div
              style={{
                position: 'relative',
                flex: 1,
                height: '28px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${SATA_COLOR}33`,
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  transform: 'translateY(-50%)',
                  background: SATA_COLOR,
                  boxShadow: `0 0 8px ${SATA_COLOR}`,
                  animation: 'pathTravel 1.6s linear infinite',
                }}
              />
            </div>

            <EndpointIcon icon={'\uD83D\uDCBE'} color={SATA_COLOR} label="SATA SSD" />
          </div>

          <p style={{ fontSize: '0.68rem', color: 'rgba(170,170,204,0.55)', marginTop: '0.8rem', lineHeight: 1.6 }}>
            One cable, one queue &mdash; every request lines up single-file through a
            controller layer built for spinning platters.
          </p>
        </div>

        {/* --- NVMe panel --- */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '0.8rem',
            }}
          >
            <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.78rem', color: NVME_COLOR, letterSpacing: '0.5px' }}>
              NVMe &middot; PCIe
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                color: 'rgba(200,200,220,0.7)',
                border: `1px solid ${NVME_COLOR}33`,
                background: `${NVME_COLOR}0d`,
                borderRadius: '20px',
                padding: '0.15rem 0.5rem',
              }}
            >
              65,535 queues &times; 65,536
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <EndpointIcon icon={'\uD83D\uDCBB'} color={NVME_COLOR} label="CPU" />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Array.from({ length: NVME_LANE_COUNT }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    height: '10px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${NVME_COLOR}22`,
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      transform: 'translateY(-50%)',
                      background: NVME_COLOR,
                      boxShadow: `0 0 6px ${NVME_COLOR}`,
                      animation: `pathTravel 0.9s linear infinite`,
                      animationDelay: `${NVME_DELAYS[i]}s`,
                    }}
                  />
                </div>
              ))}
            </div>

            <EndpointIcon icon={'\u26A1'} color={NVME_COLOR} label="NVMe SSD" />
          </div>

          <p style={{ fontSize: '0.68rem', color: 'rgba(170,170,204,0.55)', marginTop: '0.8rem', lineHeight: 1.6 }}>
            No controller detour &mdash; requests travel straight over PCIe lanes,
            thousands of them in flight at once.
          </p>
        </div>
      </div>
    </div>
  );
}
