import "../../styles/s04g4/ArbitrationModesAnimation.css";

export default function RoundRobinAnimation() {
  return (

    <svg className="signal-diagram signal-diagram-svg" viewBox="0 0 500 240" width="100%">
      <defs>
        <marker id="arrow-rr-cpu" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#7fa8ff" strokeWidth="1.5" />
        </marker>
        <marker id="arrow-rr-dma" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#8fd6a0" strokeWidth="1.5" />
        </marker>
        <marker id="arrow-rr-disk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#e0b86b" strokeWidth="1.5" />
        </marker>
        <marker id="arrow-rr-bg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M9 1L1 5L9 9" fill="none" stroke="#66ff99" strokeWidth="1.5" />
        </marker>
      </defs>

      <rect x="340" y="15" width="150" height="210" rx="8" fill="#243447" stroke="cyan" strokeWidth="1.5" />
      <text x="415" y="42" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">Round-Robin</text>
      <text x="415" y="58" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">Arbiter</text>


      <text x="415" y="92" textAnchor="middle" fontSize="9" fill="#94a2c8">Next to serve:</text>
      <text x="415" y="118" textAnchor="middle" fontSize="10" fontWeight="600" fill="#a9c6ff">CPU</text>
      <text x="415" y="144" textAnchor="middle" fontSize="10" fontWeight="600" fill="#a9e6b8">DMA</text>
      <text x="415" y="170" textAnchor="middle" fontSize="10" fontWeight="600" fill="#e6cfa1">Disk</text>

      <path d="M383 109 L391 114 L383 119 Z" fill="#39ffb6">
        <animate attributeName="opacity" dur="9s" repeatCount="indefinite" keyTimes="0;0.65;0.66;1" values="0;0;1;1" />
      </path>

      <path d="M383 135 L391 140 L383 145 Z" fill="#39ffb6">
        <animate attributeName="opacity" dur="9s" repeatCount="indefinite" keyTimes="0;0.32;0.33;1" values="1;1;0;0" />
      </path>

      <path d="M383 161 L391 166 L383 171 Z" fill="#39ffb6">
        <animate attributeName="opacity" dur="9s" repeatCount="indefinite" keyTimes="0;0.32;0.33;0.65;0.66;1" values="0;0;1;1;0;0" />
      </path>

      <text x="415" y="198" textAnchor="middle" fontSize="8" fill="#94a2c8">Pointer advances</text>
      <text x="415" y="210" textAnchor="middle" fontSize="8" fill="#94a2c8">after every grant</text>

      <g>
        <rect x="10" y="15" width="150" height="50" rx="8" fill="#1e3a5f" stroke="#7fa8ff" strokeWidth="1.5" />
        <text x="85" y="38" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">CPU</text>
        <text x="85" y="53" textAnchor="middle" fontSize="9" fill="#a9c6ff">Slot 0</text>
        <line x1="160" y1="30" x2="336" y2="30" stroke="#7fa8ff" strokeWidth="1.5" markerEnd="url(#arrow-rr-cpu)" />
        <text x="248" y="24" textAnchor="middle" fontSize="9" fill="#a9c6ff" fontWeight="600">BR — requesting</text>
        <g>
          <animate attributeName="opacity" dur="9s" repeatCount="indefinite" keyTimes="0;0.32;0.33;1" values="1;1;0;0" />
          <line x1="336" y1="52" x2="160" y2="52" stroke="#66ff99" strokeWidth="1.5" markerEnd="url(#arrow-rr-bg)" />
          <text x="248" y="48" textAnchor="middle" fontSize="9" fill="#a9e6b8" fontWeight="600">BG — GRANTED</text>
        </g>
        <rect x="10" y="15" width="150" height="50" rx="8" fill="none" stroke="#7fa8ff">
          <animate attributeName="stroke-width" dur="9s" repeatCount="indefinite" keyTimes="0;0.32;0.33;1" values="4;4;1.5;1.5" />
        </rect>
      </g>

      <g>
        <rect x="10" y="95" width="150" height="50" rx="8" fill="#1e3a5f" stroke="#8fd6a0" strokeWidth="1.5" />
        <text x="85" y="118" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">DMA Controller</text>
        <text x="85" y="133" textAnchor="middle" fontSize="9" fill="#a9e6b8">Slot 1</text>
        <line x1="160" y1="110" x2="336" y2="110" stroke="#8fd6a0" strokeWidth="1.5" markerEnd="url(#arrow-rr-dma)" />
        <text x="248" y="104" textAnchor="middle" fontSize="9" fill="#a9e6b8" fontWeight="600">BR — requesting</text>
        <g>
          <animate attributeName="opacity" dur="9s" repeatCount="indefinite" keyTimes="0;0.32;0.33;0.65;0.66;1" values="0;0;1;1;0;0" />
          <line x1="336" y1="132" x2="160" y2="132" stroke="#66ff99" strokeWidth="1.5" markerEnd="url(#arrow-rr-bg)" />
          <text x="248" y="128" textAnchor="middle" fontSize="9" fill="#a9e6b8" fontWeight="600">BG — GRANTED</text>
        </g>
        <rect x="10" y="95" width="150" height="50" rx="8" fill="none" stroke="#8fd6a0">
          <animate attributeName="stroke-width" dur="9s" repeatCount="indefinite" keyTimes="0;0.32;0.33;0.65;0.66;1" values="1.5;1.5;4;4;1.5;1.5" />
        </rect>
      </g>

      <g>
        <rect x="10" y="175" width="150" height="50" rx="8" fill="#1e3a5f" stroke="#e0b86b" strokeWidth="1.5" />
        <text x="85" y="198" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">Disk Controller</text>
        <text x="85" y="213" textAnchor="middle" fontSize="9" fill="#e6cfa1">Slot 2</text>
        <line x1="160" y1="190" x2="336" y2="190" stroke="#e0b86b" strokeWidth="1.5" markerEnd="url(#arrow-rr-disk)" />
        <text x="248" y="184" textAnchor="middle" fontSize="9" fill="#e6cfa1" fontWeight="600">BR — requesting</text>
        <g>
          <animate attributeName="opacity" dur="9s" repeatCount="indefinite" keyTimes="0;0.65;0.66;1" values="0;0;1;1" />
          <line x1="336" y1="212" x2="160" y2="212" stroke="#66ff99" strokeWidth="1.5" markerEnd="url(#arrow-rr-bg)" />
          <text x="248" y="208" textAnchor="middle" fontSize="9" fill="#a9e6b8" fontWeight="600">BG — GRANTED</text>
        </g>
        <rect x="10" y="175" width="150" height="50" rx="8" fill="none" stroke="#e0b86b">
          <animate attributeName="stroke-width" dur="9s" repeatCount="indefinite" keyTimes="0;0.65;0.66;1" values="1.5;1.5;4;4" />
        </rect>
      </g>
    </svg>
  );
}