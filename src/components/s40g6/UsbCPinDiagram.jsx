import { useState } from "react";

const PINS = [
  { id: "A1",  color: "#888780", name: "GND",   desc: "Ground — return path for current. Four GND pins distribute high current safely.", x: 10,   row: "A" },
  { id: "A2",  color: "#378ADD", name: "TX1+",  desc: "SuperSpeed transmit lane 1 positive — high-speed data from host to device.", x: 17,   row: "A" },
  { id: "A3",  color: "#378ADD", name: "TX1−",  desc: "SuperSpeed transmit lane 1 negative — differential pair with TX1+.", x: 24.5, row: "A" },
  { id: "A4",  color: "#1D9E75", name: "VBUS",  desc: "Bus power — 5V default, up to 20V / 5A with USB Power Delivery. Four VBUS pins handle high wattage.", x: 31.5, row: "A" },
  { id: "A5",  color: "#EFB800", name: "CC1",   desc: "Configuration Channel 1 — detects plug orientation, assigns host/device roles, runs Power Delivery negotiation.", x: 38.5, row: "A" },
  { id: "A6",  color: "#B59FE8", name: "D+",    desc: "USB 2.0 data positive (480 Mbps). Used during enumeration even on fast USB4 devices.", x: 46.5, row: "A" },
  { id: "A7",  color: "#B59FE8", name: "D−",    desc: "USB 2.0 data negative — differential pair with D+. Both rows bridged inside the cable.", x: 53.5, row: "A" },
  { id: "A8",  color: "#D85A30", name: "SBU1",  desc: "Sideband Use 1 — carries Alt Mode signals (DisplayPort AUX, HDMI) or analog audio.", x: 60.5, row: "A" },
  { id: "A9",  color: "#1D9E75", name: "VBUS",  desc: "Bus power — second VBUS pin for higher current capacity.", x: 68.5, row: "A" },
  { id: "A10", color: "#378ADD", name: "RX2−",  desc: "SuperSpeed receive lane 2 negative — receives high-speed data from the device.", x: 75.5, row: "A" },
  { id: "A11", color: "#378ADD", name: "RX2+",  desc: "SuperSpeed receive lane 2 positive — differential pair with RX2−.", x: 82.5, row: "A" },
  { id: "A12", color: "#888780", name: "GND",   desc: "Ground — return path on the A-row edge.", x: 89.5, row: "A" },

  // Row B mirrors Row A x values exactly, left to right = B12..B1
  { id: "B12", color: "#888780", name: "GND",   desc: "Ground — mirrors A12 on the B row.", x: 10,   row: "B" },
  { id: "B11", color: "#378ADD", name: "RX1+",  desc: "SuperSpeed receive lane 1 positive — first RX pair on B row.", x: 17,   row: "B" },
  { id: "B10", color: "#378ADD", name: "RX1−",  desc: "SuperSpeed receive lane 1 negative — differential pair with RX1+.", x: 24.5, row: "B" },
  { id: "B9",  color: "#1D9E75", name: "VBUS",  desc: "Bus power — third VBUS pin, critical for high-wattage charging.", x: 31.5, row: "B" },
  { id: "B8",  color: "#D85A30", name: "SBU2",  desc: "Sideband Use 2 — second sideband channel for Alt Mode or analog audio.", x: 38.5, row: "B" },
  { id: "B7",  color: "#B59FE8", name: "D−",    desc: "USB 2.0 data negative (B row) — bridged to A7 inside the cable.", x: 46.5, row: "B" },
  { id: "B6",  color: "#B59FE8", name: "D+",    desc: "USB 2.0 data positive (B row) — bridged to A6 inside the cable.", x: 53.5, row: "B" },
  { id: "B5",  color: "#EFB800", name: "CC2",   desc: "Config Channel 2 — becomes VCONN when CC1 is active, powering the e-marker chip in active cables.", x: 60.5, row: "B" },
  { id: "B4",  color: "#1D9E75", name: "VBUS",  desc: "Bus power — fourth VBUS pin for symmetric current distribution.", x: 68.5, row: "B" },
  { id: "B3",  color: "#378ADD", name: "TX2−",  desc: "SuperSpeed transmit lane 2 negative — second TX pair, doubles bandwidth in USB4 / Thunderbolt.", x: 75.5, row: "B" },
  { id: "B2",  color: "#378ADD", name: "TX2+",  desc: "SuperSpeed transmit lane 2 positive — differential pair with TX2−.", x: 82.5, row: "B" },
  { id: "B1",  color: "#888780", name: "GND",   desc: "Ground — mirrors A1 on the B row.", x: 89.5, row: "B" },
];

const LEGEND = [
  { color: "#1D9E75", label: "Power" },
  { color: "#378ADD", label: "SuperSpeed" },
  { color: "#B59FE8", label: "USB 2.0" },
  { color: "#EFB800", label: "Config / CC" },
  { color: "#D85A30", label: "Sideband" },
  { color: "#888780", label: "Ground" },
];

const rowAY = 36;
const rowBY = 49; // s

export default function UsbCPinDiagram({ imageSrc }) {
  const [hovered, setHovered] = useState(null);
  const resolvedSrc = typeof imageSrc === "string" ? imageSrc : (imageSrc?.src ?? String(imageSrc));

  const tooltipLeft = (x) => {
    if (x < 20) return "0%";
    if (x > 80) return "auto";
    return `${x - 10}%`;
  };
  const tooltipRight = (x) => (x > 80 ? "0%" : "auto");

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#111116", borderRadius: "16px", padding: "24px" }}>
      <div style={{ position: "relative", display: "block", width: "100%" }}>
        <img
          src={resolvedSrc}
          alt="USB-C connector pin assignment diagram"
          style={{ width: "100%", display: "block", borderRadius: "8px" }}
          draggable={false}
        />

        {PINS.map((pin) => {
          const yPct = pin.row === "A" ? rowAY : rowBY;
          const isHovered = hovered?.id === pin.id;
          return (
            <div
              key={pin.id}
              onMouseEnter={() => setHovered(pin)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute",
                left: `${pin.x}%`,
                top: `${yPct}%`,
                transform: "translate(-50%, -50%)",
                width: "7%",
                height: "16%",
                cursor: "pointer",
                borderRadius: "4px",
                border: isHovered ? `2px solid ${pin.color}` : "2px solid transparent",
                background: isHovered ? `${pin.color}44` : "transparent",
                transition: "border-color 0.1s, background 0.1s",
                zIndex: 2,
              }}
            >
              {isHovered && (
                <div style={{
                  position: "absolute",
                  ...(pin.row === "A"
                    ? { top: "110%", marginTop: "6px" }
                    : { bottom: "110%", marginBottom: "6px" }),
                  left: tooltipLeft(pin.x),
                  right: tooltipRight(pin.x),
                  width: "200px",
                  background: "#1e1e2a",
                  border: `1.5px solid ${pin.color}`,
                  borderRadius: "10px",
                  padding: "10px 12px",
                  zIndex: 20,
                  pointerEvents: "none",
                  boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
                }}>
                  <div style={{
                    position: "absolute",
                    ...(pin.row === "A"
                      ? { top: "-6px", borderBottom: `6px solid ${pin.color}`, borderTop: "none" }
                      : { bottom: "-6px", borderTop: `6px solid ${pin.color}`, borderBottom: "none" }),
                    left: "16px",
                    width: 0, height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                  }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                    <span style={{
                      background: pin.color,
                      color: ["#EFB800", "#B59FE8"].includes(pin.color) ? "#1a1200" : "#fff",
                      fontSize: "10px", fontWeight: "600",
                      padding: "1px 8px", borderRadius: "99px", whiteSpace: "nowrap",
                    }}>{pin.id}</span>
                    <span style={{ fontSize: "12px", fontWeight: "500", color: "#fff", whiteSpace: "nowrap" }}>{pin.name}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.5" }}>{pin.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "14px" }}>
        {LEGEND.map((l) => (
          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            <span style={{ width: "10px", height: "10px", background: l.color, borderRadius: "2px", display: "inline-block" }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}