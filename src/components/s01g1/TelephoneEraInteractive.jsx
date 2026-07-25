/**
 * TelephoneEraInteractive.jsx — Telephone Era Interactive
 * Font: "Libre Baskerville" (headings) + "Source Code Pro" (labels).
 * Style: copper switchboard panel — warm dark olive, amber copper tones,
 *         bakelite brown. Absolutely no grayscale.
 */

import { useState, useEffect, useRef } from "react";

/* ── palette ── */
const BG      = "#1c1a14"; // dark olive bakelite
const SURFACE = "#252318"; // raised panel
const PANEL   = "#2e2b1e"; // inset area
const COPPER  = "#b07030"; // copper wire
const AMBER   = "#e8a030"; // lit indicator
const DIM     = "#5a5440"; // unlit indicator
const CREAM   = "#f0e8d0"; // ivory label
const IVORY   = "#c8b880"; // aged label
const RUST    = "#8b3c1e"; // decline / warning
const LINE    = "#3a3620"; // border lines
const GREEN   = "#4a7a50"; // connected state

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;500&display=swap');

  @keyframes tel-ring {
    0%   { transform: rotate(-6deg); }
    20%  { transform: rotate(6deg); }
    40%  { transform: rotate(-5deg); }
    60%  { transform: rotate(5deg); }
    80%  { transform: rotate(-3deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes tel-glow {
    0%, 100% { box-shadow: 0 0 4px 1px rgba(232,160,48,0.5); }
    50%       { box-shadow: 0 0 10px 3px rgba(232,160,48,0.9); }
  }
  @keyframes tel-cord {
    from { stroke-dashoffset: 200; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes tel-fade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes tel-pulse-ring {
    0%   { opacity: 0.2; transform: scale(1); }
    100% { opacity: 0; transform: scale(2.2); }
  }
`;

/* ── sub-components ── */

function Indicator({ lit, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <div style={{
        width: "10px", height: "10px", borderRadius: "50%",
        background: lit ? AMBER : DIM,
        boxShadow: lit ? "0 0 6px 2px rgba(232,160,48,0.7)" : "none",
        transition: "all 0.3s",
      }} />
      <span style={{
        fontFamily: "'Source Code Pro', monospace",
        fontSize: "0.5rem", letterSpacing: "0.08em",
        textTransform: "uppercase", color: IVORY,
      }}>{label}</span>
    </div>
  );
}

function RingerDisplay({ ringing }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {ringing && (
        <>
          <div style={{
            position: "absolute", width: "32px", height: "32px", borderRadius: "50%",
            border: `1px solid ${AMBER}`, animation: "tel-pulse-ring 1s ease-out infinite",
          }} />
          <div style={{
            position: "absolute", width: "32px", height: "32px", borderRadius: "50%",
            border: `1px solid ${AMBER}`, animation: "tel-pulse-ring 1s ease-out 0.4s infinite",
          }} />
        </>
      )}
      <div style={{
        fontSize: "1.5rem", lineHeight: 1, userSelect: "none",
        animation: ringing ? "tel-ring 0.5s ease-in-out infinite" : "none",
        display: "inline-block",
      }}>
        ☎
      </div>
    </div>
  );
}

function CordDiagram() {
  return (
    <div style={{ margin: "0.75rem 0" }}>
      <div style={{
        fontFamily: "'Source Code Pro', monospace",
        fontSize: "0.55rem", textTransform: "uppercase",
        letterSpacing: "0.09em", color: IVORY, marginBottom: "6px",
      }}>
        Patch cord — copper circuit
      </div>
      <svg viewBox="0 0 280 44" style={{ width: "100%", height: "44px", display: "block" }}>
        {/* Jack sockets */}
        <rect x="0" y="14" width="20" height="16" rx="3" fill={SURFACE} stroke={COPPER} strokeWidth="1.5" />
        <text x="10" y="26" textAnchor="middle" fill={IVORY} fontSize="5" fontFamily="Source Code Pro, monospace">YOU</text>
        <rect x="260" y="14" width="20" height="16" rx="3" fill={SURFACE} stroke={COPPER} strokeWidth="1.5" />
        <text x="270" y="26" textAnchor="middle" fill={IVORY} fontSize="5" fontFamily="Source Code Pro, monospace">WAT</text>
        {/* Wire path */}
        <path
          d="M 20 22 C 80 8, 200 8, 260 22"
          fill="none" stroke={COPPER} strokeWidth="2.5"
          strokeDasharray="200" strokeDashoffset="0"
          style={{ animation: "tel-cord 0.9s ease-out forwards" }}
        />
        <path d="M 20 22 C 80 36, 200 36, 260 22" fill="none" stroke="#7a4820" strokeWidth="1.5"
          strokeDasharray="200"
          style={{ animation: "tel-cord 0.9s ease-out 0.1s forwards", strokeDashoffset: 200 }}
        />
        {/* Jack plugs */}
        <circle cx="20" cy="22" r="3.5" fill={AMBER} />
        <circle cx="260" cy="22" r="3.5" fill={AMBER} />
        {/* Switchboard operator indicator */}
        <rect x="125" y="16" width="30" height="12" rx="2" fill={PANEL} stroke={LINE} strokeWidth="1" />
        <text x="140" y="25" textAnchor="middle" fill={GREEN} fontSize="5.5" fontFamily="Source Code Pro, monospace">LIVE</text>
      </svg>
    </div>
  );
}

/* ── table util ── */
function DataTable({ rows }) {
  return (
    <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "0.75rem" }}>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <td style={{
              fontFamily: "'Source Code Pro', monospace",
              fontSize: "0.65rem", color: IVORY, paddingRight: "1.1rem",
              paddingBottom: "0.3rem", whiteSpace: "nowrap", verticalAlign: "top",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{k}</td>
            <td style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "0.78rem", color: CREAM, paddingBottom: "0.3rem", lineHeight: "1.5",
            }}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── root ── */

export default function TelephoneEraInteractive() {
  const [choice, setChoice] = useState(null);
  const [ringing, setRinging] = useState(true);
  const ringRef = useRef(null);

  // Stop ring animation once a choice is made
  useEffect(() => {
    if (choice) setRinging(false);
    else {
      setRinging(true);
    }
  }, [choice]);

  const isAccepted = choice === "accept";
  const isDeclined = choice === "decline";

  return (
    <div style={{
      background: BG,
      border: `1px solid ${LINE}`,
      margin: "1.5rem 0",
      fontFamily: "'Libre Baskerville', Georgia, serif",
      color: CREAM,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{CSS}</style>

      {/* Top status rail */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.5rem 1rem",
        borderBottom: `1px solid ${LINE}`,
        background: SURFACE,
      }}>
        <Indicator lit={!choice} label="Incoming" />
        <Indicator lit={isAccepted} label="Active" />
        <Indicator lit={isDeclined} label="Missed" />

      </div>

      <div style={{ padding: "1.25rem 1.1rem" }}>

        {/* Incoming call block */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1.1rem",
          padding: "0.9rem 1rem",
          background: SURFACE,
          border: `1px solid ${LINE}`,
          borderLeft: `3px solid ${ringing ? AMBER : isAccepted ? GREEN : RUST}`,
          marginBottom: "1rem",
          transition: "border-color 0.3s",
        }}>
          <RingerDisplay ringing={ringing} />
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: "700", color: CREAM, marginBottom: "3px", fontFamily: "'Libre Baskerville', serif" }}>
              {isAccepted ? "Circuit connected" : isDeclined ? "No answer" : "Incoming call, Mr. Watson, Line 2"}
            </div>
            <div style={{ fontSize: "0.72rem", color: IVORY, fontFamily: "'Source Code Pro', monospace", letterSpacing: "0.03em" }}>
              {isAccepted
                ? "A dedicated copper path is now held open."
                : isDeclined
                ? "The moment has passed. No record exists."
                : "The operator is waiting for your instruction."}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {!choice && (
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.1rem" }}>
            <button onClick={() => setChoice("accept")} style={{
              padding: "0.5rem 1.2rem",
              background: GREEN,
              color: "#fff",
              border: `1px solid #3a6040`,
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "0.82rem",
              letterSpacing: "0.02em",
              transition: "filter 0.15s",
            }}>Accept</button>
            <button onClick={() => setChoice("decline")} style={{
              padding: "0.5rem 1.2rem",
              background: "transparent",
              color: "#c08070",
              border: `1px solid ${RUST}`,
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "0.82rem",
              letterSpacing: "0.02em",
            }}>Decline</button>
          </div>
        )}

        {/* Accept: cord diagram + facts */}
        {isAccepted && (
          <div style={{ animation: "tel-fade 0.3s ease-out" }}>
            <CordDiagram />

            <p style={{
              fontSize: "0.82rem",
              lineHeight: "1.75",
              color: CREAM,
              borderLeft: `2px solid ${COPPER}`,
              paddingLeft: "0.85rem",
              margin: "0 0 0.85rem",
              fontFamily: "'Libre Baskerville', serif",
            }}>
              <strong style={{ color: AMBER }}>Circuit Switching:</strong> one unbroken copper wire now
              connects both phones. No other caller can use this line. The path is held open for the
              entire call, whether or not anyone speaks. When both parties hang up, the operator unplugs
              the cord and the circuit is released.
            </p>

            <DataTable rows={[
              ["Connection type", "Dedicated copper wire, 3 kHz voice channel"],
              ["Line availability", "Blocked. No other call can share this wire."],
              ["Released when", "Both parties hang up simultaneously"],
            ]} />

            <button onClick={() => setChoice(null)} style={{
              background: "none", border: "none", color: DIM,
              fontSize: "0.72rem", cursor: "pointer",
              fontFamily: "'Source Code Pro', monospace",
              textDecoration: "underline", padding: 0, letterSpacing: "0.04em",
            }}>Hang up</button>
          </div>
        )}

        {/* Decline: lost call facts */}
        {isDeclined && (
          <div style={{ animation: "tel-fade 0.3s ease-out" }}>
            <div style={{
              background: "#1a1008",
              border: `1px solid ${RUST}`,
              borderLeft: `3px solid ${RUST}`,
              padding: "0.85rem 1rem",
              marginBottom: "0.85rem",
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "0.82rem",
              lineHeight: "1.75",
              color: "#c09878",
            }}>
              The line goes silent. In 1910 there is no voicemail, no missed-call log, no way to
              leave a message. Mr. Watson called at a specific moment in time and that moment is
              permanently gone. Both parties had to be present at exactly the same instant.
              Unlike a letter, which could wait.
            </div>

            <DataTable rows={[
              ["Voicemail", "Not invented until the 1970s"],
              ["Missed-call record", "None. No system exists."],
              ["Message recovery", "Impossible"],
            ]} />

            <button onClick={() => setChoice(null)} style={{
              background: "none", border: "none", color: DIM,
              fontSize: "0.72rem", cursor: "pointer",
              fontFamily: "'Source Code Pro', monospace",
              textDecoration: "underline", padding: 0, letterSpacing: "0.04em",
            }}>Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
