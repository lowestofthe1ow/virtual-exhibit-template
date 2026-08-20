import React from 'react';

interface Props {
  hotspot?: any;
}

/**
 * Mark1Exhibit
 *
 * Informational exhibit for the Harvard Mark I (IBM Automatic Sequence Controlled Calculator).
 * Designed as a professional placeholder until an interactive experience is available.
 */
const Mark1Exhibit: React.FC<Props> = ({ hotspot }) => {
  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono, Courier Prime), monospace', color: '#111' }}>
      <h3 style={{ marginTop: 0 }}>Harvard Mark I</h3>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 220px' }}>
          {hotspot?.image ? (
            <img
              src={hotspot.image}
              alt={hotspot.title ?? 'Harvard Mark I image'}
              style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid #e6e6e6' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: 140,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 8,
                background: 'linear-gradient(180deg,#fff,#f6f6f6)',
                border: '1px dashed #e6e6e6',
                color: '#666'
              }}
            >
              Historical image
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ marginTop: 0, color: '#444', lineHeight: 1.5 }}>
            The Harvard Mark I was an early electromechanical computer used for scientific and ballistic calculations
            during World War II. It combined mechanical and electrical components to execute long sequences of
            arithmetic operations under program control.
          </p>

          <h4 style={{ marginBottom: 6 }}>Key specifications</h4>
          <ul style={{ marginTop: 6, color: '#444' }}>
            <li>Year: 1944 (completed)</li>
            <li>Type: Electromechanical (relays, shafts, and clutches)</li>
            <li>Programming: Punched paper tape and decimal arithmetic</li>
            <li>Purpose: Scientific computation, ballistic tables</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ marginBottom: 6 }}>Historical significance</h4>
        <p style={{ color: '#444', lineHeight: 1.5 }}>
          The Mark I demonstrated the engineering possibilities of automating extended numerical sequences and helped
          establish practices for early computing programs and numerical libraries that influenced later digital machines.
        </p>

        <h4 style={{ marginTop: 12 }}>Interactive simulation</h4>
        <div
          style={{
            marginTop: 8,
            padding: 12,
            background: '#fafafa',
            border: '1px solid #eee',
            borderRadius: 8,
            color: '#555'
          }}
        >
          <strong>Interactive simulation for this machine will be added in a future update.</strong>
          <div style={{ marginTop: 8, fontSize: 13, color: '#7a7a7a' }}>
            Explore the ENIAC gallery next to learn how purely electronic machines replaced electromechanical designs.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mark1Exhibit;