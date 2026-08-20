import "../../styles/s04g4/ArbitrationModesAnimation.css";

export default function DaisyChainAnimation() {
  return (
    <svg className="signal-diagram signal-diagram-svg" viewBox="0 0 500 150" width="100%">
      <defs>
        <marker id="arrow-chain" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#94a2c8" strokeWidth="1.5" />
        </marker>
      </defs>

      <rect x="10" y="45" width="90" height="50" rx="8" fill="#243447" stroke="cyan" strokeWidth="1.5" />
      <text x="55" y="66" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ffffff">Arbiter</text>
      <text x="55" y="80" textAnchor="middle" fontSize="8" fill="#94a2c8">Grant IN</text>

      <line x1="100" y1="70" x2="470" y2="70" stroke="#94a2c8" strokeWidth="1.5" markerEnd="url(#arrow-chain)" />

      <rect x="140" y="45" width="90" height="50" rx="8" fill="#1e3a5f" stroke="#7fa8ff" strokeWidth="1.5" />
      <text x="185" y="64" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">Device 1</text>
      <text x="185" y="78" textAnchor="middle" fontSize="8" fill="#a9c6ff">1st in chain</text>

      <rect x="260" y="45" width="90" height="50" rx="8" fill="#1e3a5f" stroke="#8fd6a0" strokeWidth="1.5" />
      <text x="305" y="64" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">Device 2</text>
      <text x="305" y="78" textAnchor="middle" fontSize="8" fill="#a9e6b8">2nd in chain</text>

      <rect x="380" y="45" width="90" height="50" rx="8" fill="#1e3a5f" stroke="#e0b86b" strokeWidth="1.5" />
      <text x="425" y="64" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">Device 3</text>
      <text x="425" y="78" textAnchor="middle" fontSize="8" fill="#e6cfa1">3rd in chain</text>

      {/* Grant pulse — one dot physically travels the wire, pausing at
          each device to "check" before moving on to the next, then
          resets. Same animateMotion technique as the Centralized
          Arbitration diagram on Design Trade-offs. */}
      <circle r="7" fill="#39ffb6" style={{ opacity: 0, filter: "drop-shadow(0 0 8px #39ffb6)" }}>
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          calcMode="linear"
          keyTimes="0;0.05;0.20;0.35;0.50;0.65;0.80;0.95;1"
          keyPoints="0;0;0.2297;0.2297;0.5541;0.5541;0.8784;0.8784;0.8784"
          path="M100 70 L470 70"
        />
        <animate
          attributeName="opacity"
          dur="6s"
          repeatCount="indefinite"
          keyTimes="0;0.04;0.05;0.94;0.95;1"
          values="0;0;1;1;0;0"
        />
      </circle>

      <rect x="140" y="45" width="90" height="50" rx="8" fill="none" stroke="#7fa8ff">
        <animate
          attributeName="stroke-width"
          dur="6s"
          repeatCount="indefinite"
          keyTimes="0;0.19;0.20;0.35;0.36;1"
          values="1.5;1.5;4;4;1.5;1.5"
        />
      </rect>
      <rect x="260" y="45" width="90" height="50" rx="8" fill="none" stroke="#8fd6a0">
        <animate
          attributeName="stroke-width"
          dur="6s"
          repeatCount="indefinite"
          keyTimes="0;0.49;0.50;0.65;0.66;1"
          values="1.5;1.5;4;4;1.5;1.5"
        />
      </rect>
      <rect x="380" y="45" width="90" height="50" rx="8" fill="none" stroke="#e0b86b">
        <animate
          attributeName="stroke-width"
          dur="6s"
          repeatCount="indefinite"
          keyTimes="0;0.79;0.80;0.95;0.96;1"
          values="1.5;1.5;4;4;1.5;1.5"
        />
      </rect>
    </svg>
  );
}
