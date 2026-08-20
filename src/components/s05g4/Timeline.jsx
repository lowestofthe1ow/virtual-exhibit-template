// Timeline.jsx
// Interactive scrollable/clickable timeline for "Mga Nanguna: Filipino Pioneers".
// Usage in Astro: <Timeline client:load />
// Requires: timelineData.js in the same directory (or adjust the import path below).

import { useState } from "react";
import { timelineNodes, eras } from "./timelineData.js";
import "../../styles/s05g4/tailwind-entry.css";

const COLORS = {
  navy: "#0B1220",
  card: "#141C2E",
  gold: "#F2C744",
  scarlet: "#B3141C",
  border: "#374151",
  textMuted: "#9CA3AF",
  textFaint: "#6B7280",
};

const TRACK_MAX_WIDTH = 720; // comfortable reading width for the centered column

export default function Timeline() {
  const [activeEra, setActiveEra] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filteredNodes =
    activeEra === "All"
      ? timelineNodes
      : timelineNodes.filter((n) => n.era === activeEra);

  const filterButtonStyle = (isActive) => ({
    padding: "4px 14px",
    borderRadius: "9999px",
    fontSize: "0.85rem",
    border: `1px solid ${isActive ? COLORS.gold : "#6B7280"}`,
    backgroundColor: isActive ? COLORS.gold : "transparent",
    color: isActive ? COLORS.navy : "#D1D5DB",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: COLORS.navy,
        color: "white",
        padding: "40px 16px",
        borderRadius: "12px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "8px",
          color: COLORS.gold,
        }}
      >
        Mga Nanguna: A Timeline
      </h2>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.95rem",
          color: "#D1D5DB",
          marginBottom: "24px",
          maxWidth: TRACK_MAX_WIDTH,
        }}
      >
        Click a card to reveal each pioneer's story. Filter by era below.
      </p>

      {/* Era filter */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "32px",
          maxWidth: TRACK_MAX_WIDTH,
        }}
      >
        <button style={filterButtonStyle(activeEra === "All")} onClick={() => setActiveEra("All")}>
          All Eras
        </button>
        {eras.map((era) => (
          <button
            key={era}
            style={filterButtonStyle(activeEra === era)}
            onClick={() => setActiveEra(era)}
          >
            {era}
          </button>
        ))}
      </div>

      {/* Timeline track: single centered column at all screen sizes */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "100%",
          maxWidth: TRACK_MAX_WIDTH,
        }}
      >
        {filteredNodes.map((node) => (
          <TimelineCard
            key={node.id}
            node={node}
            expanded={expandedId === node.id}
            onToggle={() =>
              setExpandedId(expandedId === node.id ? null : node.id)
            }
          />
        ))}
      </div>
    </section>
  );
}

function TimelineCard({ node, expanded, onToggle }) {
  const [imgError, setImgError] = useState(false);

  if (node.type === "era") {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: COLORS.scarlet,
            margin: "0 auto 8px",
          }}
        />
        <span
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: COLORS.textMuted,
            display: "block",
          }}
        >
          {node.chapter}
        </span>
        <span style={{ fontSize: "1.1rem", fontWeight: 600, color: COLORS.gold }}>
          {node.era}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        textAlign: "left",
        backgroundColor: COLORS.card,
        border: `1px solid ${expanded ? COLORS.gold : COLORS.border}`,
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        color: "white",
        fontFamily: "inherit",
        transition: "border-color 0.3s ease",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            minWidth: "56px",
            borderRadius: "50%",
            backgroundColor: "#374151",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!imgError ? (
            <img
              src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/${node.photo}`}
              alt={node.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <span style={{ fontSize: "0.65rem", color: COLORS.textMuted }}>Photo</span>
          )}
        </div>
        <div>
          <p style={{ fontWeight: 600, margin: 0, fontSize: "1.05rem" }}>{node.name}</p>
          <p style={{ fontSize: "0.8rem", color: COLORS.textMuted, margin: 0 }}>
            {node.years}
          </p>
        </div>
      </div>

      <p style={{ fontSize: "0.95rem", color: "#D1D5DB", margin: 0, lineHeight: 1.5 }}>
        {node.contribution}
      </p>

      {expanded && (
        <div
          style={{
            marginTop: "14px",
            paddingTop: "14px",
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <p style={{ fontSize: "0.95rem", color: "#E5E7EB", margin: 0, lineHeight: 1.7 }}>
            {node.impact}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: COLORS.textFaint,
              marginTop: "10px",
              fontStyle: "italic",
            }}
          >
            {node.citation}
          </p>
        </div>
      )}
    </button>
  );
}
