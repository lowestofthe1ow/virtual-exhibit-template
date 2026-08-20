import "../../styles/s04g4/ArbitrationModesAnimation.css";

export default function FixedPriorityAnimation() {
  return (
    <svg className="signal-diagram signal-diagram-svg" viewBox="0 0 500 240" width="100%">
      <defs>
        <marker id="arrow-fp-cpu" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#7fa8ff" strokeWidth="1.5" />
        </marker>
        <marker id="arrow-fp-dma" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#8fd6a0" strokeWidth="1.5" />
        </marker>
        <marker id="arrow-fp-disk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#e0b86b" strokeWidth="1.5" />
        </marker>
        <marker id="arrow-fp-bg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M9 1L1 5L9 9" fill="none" stroke="#66ff99" strokeWidth="1.5" />
        </marker>
      </defs>

      <rect x="340" y="15" width="150" height="210" rx="8" fill="#243447" stroke="cyan" strokeWidth="1.5" />
      <text x="415" y="110" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">Priority</text>
      <text x="415" y="126" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">Encoder</text>
      <text x="415" y="148" textAnchor="middle" fontSize="9" fill="#94a2c8">Grants highest</text>
      <text x="415" y="160" textAnchor="middle" fontSize="9" fill="#94a2c8">priority request</text>

      <g className="fp-cpu">
        <rect x="10" y="15" width="150" height="50" rx="8" fill="#1e3a5f" stroke="#7fa8ff" strokeWidth="1.5" />
        <text x="85" y="38" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">CPU</text>
        <text x="85" y="53" textAnchor="middle" fontSize="9" fill="#a9c6ff">Priority 1 (Highest)</text>
        <line x1="160" y1="30" x2="336" y2="30" stroke="#7fa8ff" strokeWidth="1.5" markerEnd="url(#arrow-fp-cpu)" />
        <text x="248" y="24" textAnchor="middle" fontSize="9" fill="#a9c6ff" fontWeight="600">BR</text>
        <line x1="336" y1="50" x2="160" y2="50" stroke="#66ff99" strokeWidth="1.5" markerEnd="url(#arrow-fp-bg)" />
        <text x="248" y="46" textAnchor="middle" fontSize="9" fill="#a9e6b8" fontWeight="600">BG — GRANTED</text>
      </g>

      <g className="fp-dma">
        <rect x="10" y="95" width="150" height="50" rx="8" fill="#1e3a5f" stroke="#8fd6a0" strokeWidth="1.5" />
        <text x="85" y="118" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">DMA Controller</text>
        <text x="85" y="133" textAnchor="middle" fontSize="9" fill="#a9e6b8">Priority 2</text>
        <line x1="160" y1="120" x2="336" y2="120" stroke="#8fd6a0" strokeWidth="1.5" markerEnd="url(#arrow-fp-dma)" />
        <text x="248" y="114" textAnchor="middle" fontSize="9" fill="#a9e6b8" fontWeight="600">BR — waiting</text>
      </g>

      <g className="fp-disk">
        <rect x="10" y="175" width="150" height="50" rx="8" fill="#1e3a5f" stroke="#e0b86b" strokeWidth="1.5" />
        <text x="85" y="198" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">Disk Controller</text>
        <text x="85" y="213" textAnchor="middle" fontSize="9" fill="#e6cfa1">Priority 3 (Lowest)</text>
        <line x1="160" y1="200" x2="336" y2="200" stroke="#e0b86b" strokeWidth="1.5" markerEnd="url(#arrow-fp-disk)" />
        <text x="248" y="194" textAnchor="middle" fontSize="9" fill="#e6cfa1" fontWeight="600">BR — waiting</text>
      </g>
    </svg>
  );
}
