import React from 'react';

interface Props {
  hotspot?: any;
}

const BombeExhibit: React.FC<Props> = ({ hotspot }) => {
  return (
    <div style={{ padding: 8, fontFamily: 'var(--font-mono)' }}>
      <h3 style={{ marginTop: 0 }}>Bombe</h3>
      <p>
        The Bombe accelerated the search for Enigma machine settings by testing many candidate keys automatically.
      </p>
      <h4>Historical significance</h4>
      <p style={{ color: '#444' }}>
        The Bombe, developed by Turing and collaborators, was essential to Allied codebreaking during WWII.
      </p>
      <h4>Interactive simulation</h4>
      <div style={{
        marginTop: 12,
        padding: 12,
        background: '#fbfbfb',
        border: '1px solid #e6e6e6',
        borderRadius: 8,
      }}>
        <strong>Interactive simulation for this machine will be added in a future update.</strong>
        <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
          For now, explore the historical documents and related rotor exhibits.
        </div>
      </div>
    </div>
  );
};

export default BombeExhibit;