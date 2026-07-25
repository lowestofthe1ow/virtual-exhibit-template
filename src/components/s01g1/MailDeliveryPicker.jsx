/**
 * MailDeliveryPicker.jsx — Mail Era Interactive
 * Font: "Playfair Display" (headings) + "EB Garamond" (body). No Arial, no system fonts.
 * Style: aged parchment, sepia ink, wax-seal aesthetic. Hand-written feel.
 */

import { useState } from "react";

const METHODS = [
  {
    id: "pigeon",
    label: "Homing Pigeon",
    speed: "Up to 60 mph",
    time: "Hours to 1 day",
    range: "~600 miles",
    note: "One-way only. The bird always flies home. The sender had to physically carry it to the destination first. Fast over short distances, but strictly one-directional and weather-dependent.",
    flavor: "\"Released at dawn, it was gone before the ink was dry.\"",
    limitation: "Cannot reply the same way",
  },
  {
    id: "ship",
    label: "Sailing Ship",
    speed: "~9 mph",
    time: "4 to 6 weeks",
    range: "Transoceanic",
    note: "The only method for crossing oceans. Mail bags traveled alongside cargo. London to New York took four to six weeks. If the ship sank, the letter was permanently lost.",
    flavor: "\"Each letter was a small act of faith in wind and timber.\"",
    limitation: "No recovery if lost at sea",
  },
  {
    id: "carriage",
    label: "Horse & Carriage",
    speed: "~10 mph average",
    time: "Days to weeks",
    range: "Continental",
    note: "Fixed relay stations every 10 to 15 miles let riders swap horses. Slower than pigeons but reliable and capable of carrying large volumes across established road networks.",
    flavor: "\"The hoofbeats faded into the distance, carrying everything.\"",
    limitation: "Dependent on road conditions",
  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

  @keyframes md-unfold {
    from { opacity: 0; transform: translateY(-6px) scaleY(0.97); }
    to   { opacity: 1; transform: translateY(0) scaleY(1); }
  }
  @keyframes md-stamp {
    0%   { transform: scale(1.4) rotate(-8deg); opacity: 0; }
    60%  { transform: scale(0.95) rotate(2deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes md-seal-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(139, 60, 30, 0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(139, 60, 30, 0); }
  }
  @keyframes md-quill {
    0%, 100% { transform: rotate(-2deg) translateY(0); }
    50%       { transform: rotate(2deg) translateY(-2px); }
  }
  @keyframes md-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .md-method-btn {
    position: relative;
    padding: 0.7rem 1rem;
    background: #fdf8f0;
    border: 1px solid #c9b99a;
    color: #3a2710;
    font-family: 'EB Garamond', serif;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.18s ease;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    letter-spacing: 0.01em;
  }
  .md-method-btn:hover {
    background: #f5ede0;
    border-color: #a0865a;
    transform: translateX(2px);
  }
  .md-method-btn.active {
    background: #3a2710;
    border-color: #3a2710;
    color: #f5ede0;
    transform: translateX(4px);
  }

`;

const PARCHMENT  = "#fdf6e8";
const INK        = "#2a1a08";
const SEPIA_MID  = "#7a5c3a";
const SEPIA_LIGHT= "#c9b99a";
const RUST       = "#8b3c1e";
const CREAM_DARK = "#f0e6d2";

export default function MailDeliveryPicker() {
  const [chosen, setChosen] = useState(null);
  const method = METHODS.find((m) => m.id === chosen);

  return (
    <div style={{
      background: PARCHMENT,
      border: `1px solid ${SEPIA_LIGHT}`,
      margin: "1.5rem 0",
      fontFamily: "'EB Garamond', Georgia, serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{CSS}</style>

      {/* Decorative top corner rule */}
      <div style={{
        height: "3px",
        background: `linear-gradient(to right, ${RUST}, #c0844a, ${RUST})`,
      }} />

      {/* Paper texture overlay via CSS gradient */}
      <div style={{ padding: "1.5rem 1.4rem" }}>

        {/* Letter header */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
          }}>
            {/* Dateline */}
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: SEPIA_MID,
              letterSpacing: "0.03em",
            }}>
              London, England · 1820
            </div>
            {/* Wax seal */}
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: `radial-gradient(circle at 38% 35%, #c04030, ${RUST} 60%, #5a1e10)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f0c8b0",
              fontSize: "0.85rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: "700",
              boxShadow: "0 2px 8px rgba(90,30,16,0.35), inset 0 1px 2px rgba(255,180,140,0.25)",
              animation: "md-seal-pulse 3s ease-in-out infinite",
              userSelect: "none",
              flexShrink: 0,
            }}>
              ✳
            </div>
          </div>

          {/* Letter body */}
          <div style={{
            borderLeft: `2px solid ${SEPIA_LIGHT}`,
            paddingLeft: "0.9rem",
            color: INK,
            fontSize: "0.9rem",
            lineHeight: "1.8",
            fontStyle: "italic",
          }}>
            "Dearest friend, I write to inform you of my safe arrival. The roads were
            treacherous but passable. I trust this letter finds you in good health…"
          </div>


        </div>

        {/* Divider rule */}
        <div style={{
          borderTop: `1px solid ${SEPIA_LIGHT}`,
          marginBottom: "1.1rem",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "-0.55rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: PARCHMENT,
            padding: "0 0.5rem",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.7rem",
            color: SEPIA_LIGHT,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Choose your carrier
          </div>
        </div>

        {/* Method selector */}
        <div style={{
          color: SEPIA_MID,
          fontSize: "0.82rem",
          marginBottom: "0.75rem",
          fontStyle: "italic",
        }}>
          You are this letter. How do you reach your destination?
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.1rem" }}>
          {METHODS.map((m) => (
            <button
              key={m.id}
              className={`md-method-btn${chosen === m.id ? " active" : ""}`}
              onClick={() => setChosen(chosen === m.id ? null : m.id)}
            >
              <span>{m.label}</span>
              {chosen === m.id && (
                <span style={{
                  marginLeft: "auto",
                  fontSize: "0.7rem",
                  fontFamily: "'EB Garamond', serif",
                  opacity: 0.7,
                  fontStyle: "italic",
                }}>
                  selected
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Result panel */}
        {method && (
          <div style={{
            background: CREAM_DARK,
            border: `1px solid ${SEPIA_LIGHT}`,
            borderLeft: `4px solid ${RUST}`,
            padding: "1rem 1.1rem",
            animation: "md-unfold 0.25s ease-out",
          }}>


            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1rem",
              fontWeight: "700",
              color: INK,
              marginBottom: "0.5rem",
            }}>
              {method.label}
            </div>

            {/* Spec rows */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "0.15rem 1.1rem",
              fontSize: "0.82rem",
              marginBottom: "0.75rem",
            }}>
              {[["Speed", method.speed], ["Delivery", method.time], ["Range", method.range]].map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <span style={{ color: SEPIA_MID, fontStyle: "italic" }}>{k}</span>
                  <span style={{ color: INK }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Note */}
            <p style={{
              fontSize: "0.85rem",
              color: INK,
              lineHeight: "1.75",
              margin: "0 0 0.6rem",
              clear: "both",
            }}>
              {method.note}
            </p>

            {/* Flavor quote */}
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "0.78rem",
              color: SEPIA_MID,
              borderTop: `1px solid ${SEPIA_LIGHT}`,
              paddingTop: "0.5rem",
              marginBottom: "0.6rem",
            }}>
              {method.flavor}
            </div>

            {/* Limitation tag */}
            <div style={{
              display: "inline-block",
              background: "#fff",
              border: `1px solid ${SEPIA_LIGHT}`,
              padding: "0.15rem 0.5rem",
              fontSize: "0.72rem",
              color: RUST,
              fontFamily: "'EB Garamond', serif",
              letterSpacing: "0.03em",
              marginBottom: "0.65rem",
            }}>
              {method.limitation}
            </div>
            <br />

            <button
              onClick={() => setChosen(null)}
              style={{
                background: "none",
                border: "none",
                color: SEPIA_MID,
                fontSize: "0.78rem",
                cursor: "pointer",
                fontFamily: "'EB Garamond', serif",
                textDecoration: "underline",
                fontStyle: "italic",
                padding: 0,
              }}
            >
              ← Return to selection
            </button>
          </div>
        )}
      </div>

      {/* Decorative bottom rule */}
      <div style={{
        height: "3px",
        background: `linear-gradient(to right, ${RUST}, #c0844a, ${RUST})`,
      }} />
    </div>
  );
}
