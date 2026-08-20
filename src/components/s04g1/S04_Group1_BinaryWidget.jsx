import React, { useState } from 'react';

const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

export default function BinaryWidget() {
  // Default to 10110110 (decimal 182)
  const [bits, setBits] = useState([1, 0, 1, 1, 0, 1, 1, 0]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Toggle bit between 0 and 1
  const toggleBit = (index) => {
    setBits((prev) => {
      const next = [...prev];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
  };

  // Calculate total decimal value dynamically
  const decimalValue = bits.reduce(
    (acc, bit, idx) => acc + (bit ? BIT_WEIGHTS[idx] : 0),
    0
  );

  return (
    <div className="binary-widget">
      <p className="widget-header">
        BINARY REPRESENTATION &mdash; CLICK TO TOGGLE BITS
      </p>

      <div className="bits-row">
        {bits.map((bit, idx) => (
          <div
            key={idx}
            className={`bit-col ${hoveredIndex === idx ? 'is-hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => toggleBit(idx)}
            style={{ cursor: 'pointer' }}
          >
            <span className="weight">{BIT_WEIGHTS[idx]}</span>
            <div className={`bit ${bit === 1 ? 'on' : 'off'}`}>{bit}</div>
          </div>
        ))}
      </div>

      <div className="widget-result">
        <span className="equals">= </span>
        <span className="decimal">{decimalValue}</span>{' '}
        <span className="label">in decimal</span>
      </div>
    </div>
  );
}