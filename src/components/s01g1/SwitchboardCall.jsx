/**
 * SwitchboardCall.jsx
 *
 * Interactive element for the Telephone Era.
 * Simulates an incoming switchboard call. The user accepts or declines
 * and sees what happens to the circuit — teaching circuit switching concepts.
 */

import { useState } from "react";

const OUTCOMES = {
  accept: {
    label: "Call Connected",
    icon: "Test",
    heading: "Circuit Established",
    stats: [
      { key: "Connection type", val: "Dedicated copper circuit" },
      { key: "Bandwidth reserved", val: "Full line (3 kHz voice channel)" },
      { key: "Other callers blocked", val: "Yes line is occupied" },
      { key: "Call released on", val: "Both parties hang up" },
    ],
    color: "var(--accent)",
  },
  decline: {
    label: "Call Declined",
    icon: "Test",
    heading: "No Connection, No Record",
    stats: [
      { key: "Voicemail", val: "Does not exist yet" },
      { key: "Missed-call log", val: "Not available" },
      { key: "Caller notification", val: "None" },
      { key: "Message recovery", val: "Impossible" },
    ],
    color: "#c0392b",
  },
};

const s = {
  root: {
    borderTop: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    margin: "1.5rem 0",
  },
  label: {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--muted)",
    marginBottom: "0.75rem",
  },
  prompt: {
    fontSize: "0.9rem",
    marginBottom: "0.75rem",
    color: "var(--text)",
  },
  phoneBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.85rem 1rem",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    background: "var(--bg1)",
    marginBottom: "0.75rem",
  },
  phoneIcon: {
    fontSize: "1.6rem",
    animation: "ring 0.6s ease-in-out infinite alternate",
  },
  phoneText: {
    fontSize: "0.9rem",
    color: "var(--text)",
    flex: 1,
  },
  phoneSub: {
    fontSize: "0.75rem",
    color: "var(--muted)",
    marginTop: "0.15rem",
  },
  btnRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  btn: (color) => ({
    padding: "0.55rem 1.1rem",
    border: `1px solid ${color}`,
    borderRadius: "4px",
    background: "transparent",
    color: color,
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  }),
  result: {
    marginTop: "1rem",
    borderTop: "1px solid var(--border)",
    paddingTop: "0.75rem",
  },
  resultHeading: {
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "0.4rem",
    color: "var(--text)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    marginBottom: "0.75rem",
  },
  tdKey: {
    color: "var(--muted)",
    paddingRight: "1rem",
    paddingBottom: "0.2rem",
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "160px",
  },
  tdVal: {
    color: "var(--text)",
    paddingBottom: "0.2rem",
  },
  body: {
    fontSize: "0.85rem",
    color: "var(--text)",
    lineHeight: "1.6",
    borderLeft: "2px solid var(--border)",
    paddingLeft: "0.75rem",
    margin: "0.5rem 0 0.75rem",
  },
  reset: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    fontSize: "0.8rem",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
    textDecorationStyle: "dotted",
  },
};

export default function SwitchboardCall() {
  const [choice, setChoice] = useState(null);
  const outcome = choice ? OUTCOMES[choice] : null;

  return (
    <div style={s.root}>
      {/* Keyframe animation */}
      <style>{`
        @keyframes ring {
          from { transform: rotate(-10deg); }
          to   { transform: rotate(10deg); }
        }
      `}</style>

      <div style={s.label}> WIP Placeholder </div>
      <p style={s.prompt}>Do you pick up?</p>

      <div style={s.phoneBox}>
        <span style={choice ? {} : s.phoneIcon}> Placeholder :) </span>
        <div>
          <div style={s.phoneText}>
            {choice ? `Call ${outcome.label}` : "Incoming call line ringing…"}
          </div>
          <div style={s.phoneSub}>
            {choice
              ? ` "${choice === "accept" ? "Connecting line now." : "No answer disconnecting."}"`
              : "Call Incoming"}
          </div>
        </div>
      </div>

      {!choice && (
        <div style={s.btnRow}>
          <button
            style={s.btn("var(--accent)")}
            onClick={() => setChoice("accept")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--accent)";
            }}
          >
            ✔ Accept
          </button>
          <button
            style={s.btn("#c0392b")}
            onClick={() => setChoice("decline")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#c0392b";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#c0392b";
            }}
          >
            ✘ Decline
          </button>
        </div>
      )}

      {outcome && (
        <div style={s.result}>
          <div style={{ ...s.resultHeading, color: outcome.color }}>
            {outcome.icon} {outcome.heading}
          </div>
          <table style={s.table}>
            <tbody>
              {outcome.stats.map(({ key, val }) => (
                <tr key={key}>
                  <td style={s.tdKey}>{key}</td>
                  <td style={s.tdVal}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={s.body}>{outcome.body}</p>
          <button style={s.reset} onClick={() => setChoice(null)}>
            Reset call
          </button>
        </div>
      )}
    </div>
  );
}
