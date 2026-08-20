import React from 'react';

interface Props {
  hotspot?: any;
}

/**
 * UnivacExhibit
 *
 * Placeholder exhibit for UNIVAC I with overview, specs and a professional placeholder
 * area describing future interactive work.
 */
const UnivacExhibit: React.FC<Props> = ({ hotspot }) => {
  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono, Courier Prime), monospace', color: '#111' }}>
      <h3 style={{ marginTop: 0 }}>UNIVAC I</h3>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 220px' }}>
          {hotspot?.image ? (
            <img
              src={hotspot.image}
              alt={hotspot.title ?? 'UNIVAC I image'}
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
            UNIVAC I (Universal Automatic Computer) was the first commercially produced computer in the United States,
            bringing computing into business and government use with a complete hardware/software ecosystem.
          </p>

          <h4 style={{ marginBottom: 6 }}>Key specifications</h4>
          <ul style={{ marginTop: 6, color: '#444' }}>
            <li>Year: 1951 (first deliveries)</li>
            <li>Technology: Vacuum tubes, magnetic tape for storage</li>
            <li>Market: Business, government data processing</li>
            <li>Significance: Commercialization of computing</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ marginBottom: 6 }}>Historical significance</h4>
        <p style={{ color: '#444', lineHeight: 1.5 }}>
          UNIVAC I helped demonstrate the business value of automated data processing and helped seed early computer
          services industries. Its public demonstrations brought computing into the public eye.
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
            For now, explore the ENIAC and Mark I galleries to understand the technological lineage.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnivacExhibit;