import React from 'react';

interface Props {
  hotspot?: any;
}

/**
 * ColossusExhibit
 *
 * Polished informational placeholder for the Colossus exhibit.
 * If an interactive simulation is added later, replace the "interactive" panel
 * below with the simulator component while keeping the surrounding layout.
 */
const ColossusExhibit: React.FC<Props> = ({ hotspot }) => {
  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono, Courier Prime), monospace', color: '#111' }}>
      <h3 style={{ marginTop: 0 }}>Colossus</h3>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 220px' }}>
          {hotspot?.image ? (
            <img
              src={hotspot.image}
              alt={hotspot.title ?? 'Colossus image'}
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
            Colossus was one of the first programmable electronic computers. Developed at Bletchley Park during World
            War II, Colossus automated the computationally intensive work of attacking Lorenz-encrypted messages,
            dramatically accelerating Allied signals intelligence.
          </p>

          <h4 style={{ marginBottom: 6 }}>Key specifications</h4>
          <ul style={{ marginTop: 6, color: '#444' }}>
            <li>Year: 1943 (first operational models)</li>
            <li>Technology: Electronic valves (vacuum tubes)</li>
            <li>Purpose: Cryptanalytic processing of teleprinter streams</li>
            <li>Programming: Re-wirable plug panels and switch settings</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ marginBottom: 6 }}>Historical significance</h4>
        <p style={{ color: '#444', lineHeight: 1.5 }}>
          Colossus represents a key step from electromechanical to electronic computing. Though purpose-built for
          cryptanalysis, its electronic logic foreshadowed general-purpose digital computing and influenced post-war
          computer development.
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
            For now, explore related rotor and frequency-analysis exhibits to see how Colossus automated specific
            codebreaking tasks.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColossusExhibit;