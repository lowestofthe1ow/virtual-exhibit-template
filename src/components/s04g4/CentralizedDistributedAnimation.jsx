import { useMemo, useState } from "react";
import "../../styles/s04g4/centralizedDistributedAnimation.css";

// Shared device lanes for the centralized diagram (y positions).
const CENTRAL_Y = { 1: 60, 2: 130, 3: 200 };

// Device columns for the distributed diagram (x centers).
const DIST_CX = { 1: 130, 2: 300, 3: 470 };

// Priority order: index 0 is the highest-priority device. All three devices
// request the bus every cycle, so the winner is simply the highest-priority
// device. Shuffling this order changes who wins.
const DEFAULT_ORDER = [1, 2, 3];

function shuffledOrder(prev) {
  const arr = [...prev];
  // Fisher-Yates, retried once if it lands on the same order.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.join() !== prev.join()) break;
  }
  return arr;
}

function CentralizedDiagram({ rankOf, winner }) {
  const winnerY = CENTRAL_Y[winner];
  return (
    <svg viewBox="0 0 600 260" className="diagram" role="img" aria-label="Centralized arbitration diagram">
      {/* Request wires (device -> arbiter) and the grant wire (arbiter -> winner) */}
      <line x1="150" y1="60" x2="360" y2="60" className="wire" />
      <line x1="150" y1="130" x2="360" y2="130" className="wire" />
      <line x1="150" y1="200" x2="360" y2="200" className="wire" />
      <line x1="360" y1={winnerY} x2="150" y2={winnerY} className="grant" />

      {/* BR labels — every device sends a request */}
      {[1, 2, 3].map((n) => (
        <text
          key={`br-label-${n}`}
          x="255"
          y={CENTRAL_Y[n] - 8}
          textAnchor="middle"
          className="wire-label wire-label--br"
        >
          BR →
        </text>
      ))}
      {/* BG label — only the winner receives a grant */}
      <text x="255" y={winnerY + 20} textAnchor="middle" className="wire-label wire-label--bg">← BG</text>

      {/* Bus request (BR) packets — every device requests */}
      {[1, 2, 3].map((n) => {
        const y = CENTRAL_Y[n];
        return (
          <circle key={`br-${n}`} r="5" className="packet" style={{ opacity: 0 }}>
            <animateMotion
              dur="9s"
              repeatCount="indefinite"
              calcMode="linear"
              keyTimes="0;0.125;0.3125;1"
              keyPoints="0;0;1;1"
              path={`M150 ${y} L360 ${y}`}
            />
            <animate
              attributeName="opacity"
              dur="9s"
              repeatCount="indefinite"
              keyTimes="0;0.124;0.125;0.3125;0.326;1"
              values="0;0;1;1;0;0"
            />
          </circle>
        );
      })}

      {/* Bus grant (BG) packet — travels back only to the highest-priority device */}
      <circle r="5" className="grantPacket" style={{ opacity: 0 }}>
        <animateMotion
          dur="9s"
          repeatCount="indefinite"
          calcMode="linear"
          keyTimes="0;0.5;0.6875;1"
          keyPoints="0;0;1;1"
          path={`M360 ${winnerY} L150 ${winnerY}`}
        />
        <animate
          attributeName="opacity"
          dur="9s"
          repeatCount="indefinite"
          keyTimes="0;0.499;0.5;0.6875;0.6885;1"
          values="0;0;1;1;0;0"
        />
      </circle>

      {[1, 2, 3].map((n) => {
        const rank = rankOf(n);
        const isWinner = n === winner;
        return (
          <g key={n} className={isWinner ? "device active" : "device"}>
            {isWinner && (
              <text x="75" y={CENTRAL_Y[n] - 32} textAnchor="middle" className="device-crown">
                ★ HIGHEST PRIORITY
              </text>
            )}
            <rect x="20" y={CENTRAL_Y[n] - 24} width="110" height="48" rx="8" className="device-box" />
            <text x="75" y={CENTRAL_Y[n] - 3} textAnchor="middle" className="device-label">
              Device {n}
            </text>
            <text x="75" y={CENTRAL_Y[n] + 14} textAnchor="middle" className="device-sub">
              {rank === 1 ? "Priority 1 (Highest)" : `Priority ${rank}`}
            </text>
          </g>
        );
      })}

      <g className="arbiter">
        <rect x="380" y="65" width="180" height="130" rx="12" className="arbiter-box" />
        <text x="470" y="122" textAnchor="middle" className="arbiter-label">ARBITER</text>
        <text x="470" y="142" textAnchor="middle" className="arbiter-sub">one shared unit</text>
        <text x="470" y="160" textAnchor="middle" className="arbiter-sub">picks highest priority</text>
      </g>
    </svg>
  );
}

function DistributedDiagram({ rankOf, winner }) {
  const busY = 60;
  const deviceTop = 200;
  return (
    <svg viewBox="0 0 600 300" className="diagram" role="img" aria-label="Distributed arbitration diagram">
      {/* Shared arbitration bus */}
      <text x="300" y="34" textAnchor="middle" className="cd-bus-label">Shared Arbitration Lines</text>
      <line x1="60" y1={busY} x2="540" y2={busY} className="cd-bus" />

      {/* Compare pulse on the shared bus (phase 2) */}
      <line x1="60" y1={busY} x2="540" y2={busY} className="cd-bus-glow">
        <animate
          attributeName="opacity"
          dur="9s"
          repeatCount="indefinite"
          keyTimes="0;0.22;0.24;0.44;0.46;1"
          values="0;0;1;1;0;0"
        />
        <animate
          attributeName="stroke-width"
          dur="9s"
          repeatCount="indefinite"
          keyTimes="0;0.22;0.33;0.44;1"
          values="4;4;9;4;4"
        />
      </line>

      {[1, 2, 3].map((n) => {
        const cx = DIST_CX[n];
        const rank = rankOf(n);
        const isWinner = n === winner;

        return (
          <g key={n}>
            {/* Connector from device up to the shared bus */}
            <line
              x1={cx}
              y1={deviceTop}
              x2={cx}
              y2={busY}
              className={isWinner ? "cd-connector cd-connector--win" : "cd-connector"}
            >
              {!isWinner && (
                <animate
                  attributeName="opacity"
                  dur="9s"
                  repeatCount="indefinite"
                  keyTimes="0;0.44;0.66;1"
                  values="0.9;0.9;0.2;0.2"
                />
              )}
            </line>

            {/* Priority code asserted onto the shared lines (phase 1) */}
            <circle r="6" className="req-packet" style={{ opacity: 0 }}>
              <animateMotion
                dur="9s"
                repeatCount="indefinite"
                calcMode="linear"
                keyTimes="0;0.2;1"
                keyPoints="0;1;1"
                path={`M${cx} ${deviceTop} L${cx} ${busY}`}
              />
              <animate
                attributeName="opacity"
                dur="9s"
                repeatCount="indefinite"
                keyTimes="0;0.01;0.2;0.24;1"
                values="0;1;1;0;0"
              />
            </circle>

            {/* Winner keeps the bus — grant pulse travels back down (phase 3) */}
            {isWinner && (
              <circle r="6" className="cd-own-packet" style={{ opacity: 0 }}>
                <animateMotion
                  dur="9s"
                  repeatCount="indefinite"
                  calcMode="linear"
                  keyTimes="0;0.66;0.82;1"
                  keyPoints="0;0;1;1"
                  path={`M${cx} ${busY} L${cx} ${deviceTop}`}
                />
                <animate
                  attributeName="opacity"
                  dur="9s"
                  repeatCount="indefinite"
                  keyTimes="0;0.659;0.66;0.82;0.83;1"
                  values="0;0;1;1;0;0"
                />
              </circle>
            )}

            {/* Highest-priority badge */}
            {isWinner && (
              <text x={cx} y={deviceTop - 30} textAnchor="middle" className="device-crown">
                ★ HIGHEST PRIORITY
              </text>
            )}

            {/* Device with its own arbitration logic */}
            <g className={isWinner ? "node dist-node active" : "node dist-node"}>
              <rect x={cx - 60} y={deviceTop} width="120" height="70" rx="10" className="node-box">
                {!isWinner && (
                  <animate
                    attributeName="opacity"
                    dur="9s"
                    repeatCount="indefinite"
                    keyTimes="0;0.44;0.66;1"
                    values="1;1;0.35;0.35"
                  />
                )}
              </rect>
              <text x={cx} y={deviceTop + 26} textAnchor="middle" className="node-label">Device {n}</text>
              <text x={cx} y={deviceTop + 44} textAnchor="middle" className="node-sub">
                {rank === 1 ? "Priority 1 (Highest)" : `Priority ${rank}`}
              </text>
              <text x={cx} y={deviceTop + 60} textAnchor="middle" className="node-logic">own arbiter logic</text>
            </g>

            {/* Winner / withdraw status tag */}
            <text
              x={cx}
              y={deviceTop - 12}
              textAnchor="middle"
              className={isWinner ? "dist-status dist-status--win" : "dist-status dist-status--out"}
            >
              <animate
                attributeName="opacity"
                dur="9s"
                repeatCount="indefinite"
                keyTimes="0;0.66;0.68;1"
                values="0;0;1;1"
              />
              {isWinner ? "WINS BUS" : "withdraws"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function CentralizedDistributedAnimation() {
  const [mode, setMode] = useState("centralized");
  const [order, setOrder] = useState(DEFAULT_ORDER);

  const winner = order[0];
  const rankOf = useMemo(() => (n) => order.indexOf(n) + 1, [order]);
  const cycleKey = order.join("-");

  const steps = {
    centralized: [
      "All three devices send a bus request (BR) to one central arbiter.",
      `The arbiter compares the requests in one place and picks Device ${winner}, which currently has the highest priority.`,
      `It returns a grant (BG) to Device ${winner}; the other devices keep waiting.`,
    ],
    distributed: [
      "Each device places its own priority code onto the shared arbitration lines.",
      "Every device compares the lines with its own priority — there is no central unit.",
      `Lower-priority devices withdraw; Device ${winner} wins the bus because it currently has the highest priority.`,
    ],
  };

  return (
    <div className="cd-container">
      <div className="cd-toggle" role="tablist" aria-label="Arbitration architecture">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "centralized"}
          className={mode === "centralized" ? "cd-toggle__btn is-active" : "cd-toggle__btn"}
          onClick={() => setMode("centralized")}
        >
          Centralized
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "distributed"}
          className={mode === "distributed" ? "cd-toggle__btn is-active" : "cd-toggle__btn"}
          onClick={() => setMode("distributed")}
        >
          Distributed
        </button>
      </div>

      <h3 className="cd-title">
        {mode === "centralized" ? "Centralized Arbitration" : "Distributed Arbitration"}
      </h3>
      <p className="cd-subtitle">
        {mode === "centralized"
          ? "One dedicated arbiter decides for everyone."
          : "No central arbiter — the devices decide among themselves."}
      </p>

      <div className="cd-controls">
        <button type="button" className="cd-shuffle" onClick={() => setOrder((prev) => shuffledOrder(prev))}>
          Shuffle priority
        </button>
        <span className="cd-priority-readout">
          Priority order: {order.map((n, i) => `Device ${n}${i < order.length - 1 ? " > " : ""}`).join("")}
        </span>
      </div>

      <div className="cd-stage">
        {mode === "centralized" ? (
          <CentralizedDiagram key={cycleKey} rankOf={rankOf} winner={winner} />
        ) : (
          <DistributedDiagram key={cycleKey} rankOf={rankOf} winner={winner} />
        )}
      </div>

      <div className="cd-legend">
        <span className="cd-legend__item">
          <span className="cd-legend__swatch cd-legend__swatch--req" /> Request / ID asserted
        </span>
        <span className="cd-legend__item">
          <span className="cd-legend__swatch cd-legend__swatch--grant" /> Bus granted (winner)
        </span>
      </div>

      <ol className="cd-steps">
        {steps[mode].map((stepText, i) => (
          <li key={i} className="cd-step">{stepText}</li>
        ))}
      </ol>
    </div>
  );
}
