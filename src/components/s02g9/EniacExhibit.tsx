import React from 'react';

interface Props {
  hotspot?: any;
}

/**
 * EniacExhibit
 *
 * Polished informational component for ENIAC. Provides overview, specs and a professional
 * placeholder area where an interactive demo can be plugged in later.
 */
const EniacExhibit: React.FC<Props> = ({ hotspot }) => {
  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono, Courier Prime), monospace', color: '#111' }}>
      <h3 style={{ marginTop: 0 }}>ENIAC</h3>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 220px' }}>
          {hotspot?.image ? (
            <img
              src={hotspot.image}
              alt={hotspot.title ?? 'ENIAC image'}
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
            ENIAC (Electronic Numerical Integrator and Computer) was one of the earliest large-scale electronic
            computers. It used vacuum tubes for computation and was programmed by setting plugs and switches.
          </p>

          <h4 style={{ marginBottom: 6 }}>Key specifications</h4>
          <ul style={{ marginTop: 6, color: '#444' }}>
            <li>Year: 1945 (completed)</li>
            <li>Technology: Vacuum tubes, decimal arithmetic</li>
            <li>Programming: Patch panels and switches</li>
            <li>Applications: Ballistics, numerical calculation, scientific research</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ marginBottom: 6 }}>Historical significance</h4>
        <p style={{ color: '#444', lineHeight: 1.5 }}>
          ENIAC demonstrated that large-scale, fast electronic computation was practical. Its architecture and
          programming model influenced next-generation designs and helped spur the post-war computing revolution.
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
            Want to see ENIAC in motion? Sign up at the exhibit desk (or check back after the next update).
          </div>
        </div>
      </div>
    </div>
  );
};

export default EniacExhibit;