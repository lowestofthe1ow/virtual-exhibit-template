/**
 * FiberOpticsInteractive.jsx — Fiber Optics Era Interactive
 * Font: Arial. Style: light blue-gray, flat, editorial. No dark mode, no neon.
 * Aquarium reference kept through a cool slate-blue palette on a light background.
 */

import { useState } from "react";

const WAVELENGTHS = [
  { id: "w1", color: "#b04458", label: "L1  1530 nm", data: "Video stream: Tokyo to London" },
  { id: "w2", color: "#a07030", label: "L2  1550 nm", data: "Financial data: NYSE to LSE" },
  { id: "w3", color: "#3a7a96", label: "L3  1570 nm", data: "Voice calls: 8,000 channels" },
  { id: "w4", color: "#3a7a58", label: "L4  1590 nm", data: "CDN cache: streaming data" },
];

const COMPARE = [
  { label: "Medium",      copper: "Copper coaxial cable",  fiber: "Ultra-pure silica glass" },
  { label: "Bandwidth",   copper: "Up to 10 Gbps",         fiber: "160+ Tbps per strand" },
  { label: "Signal loss", copper: "3 dB per 100 m",        fiber: "0.2 dB per km" },
  { label: "Max span",    copper: "~100 m",                 fiber: "80 km before repeater" },
];

const css = `
  @keyframes fo-travel {
    from { stroke-dashoffset: 500; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes fo-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes race-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  `;

export default function FiberOpticsInteractive() {
  const [activeWl, setActiveWl] = useState(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [view, setView] = useState("wdm");
  const [fiberOffset, setFiberOffset] = useState(0);
  const [copperOffset, setCopperOffset] = useState(0);
  const [winner, setWinner] = useState("");

  function sendPulse(id) {
    setActiveWl(id);
    setPulseKey((k) => k + 1);
  }

  const active = WAVELENGTHS.find((w) => w.id === activeWl);

  return (
    <div style={{
      background: "#f0f4f7",
      border: "1px solid #c4d0da",
      margin: "1.5rem 0",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}>
      <style>{css}</style>


      {/* Tab strip */}
      <div style={{ display: "flex", borderBottom: "1px solid #c4d0da", background: "#f0f4f7" }}>
        {[
          { id: "wdm",     label: "Wavelength Multiplexing" },
          { id: "compare", label: "Copper vs. Fiber" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              padding: "0.5rem 1rem",
              background: view === t.id ? "#fff" : "transparent",
              border: "none",
              borderBottom: view === t.id ? "2px solid #3a7a96" : "2px solid transparent",
              borderRight: "1px solid #c4d0da",
              color: view === t.id ? "#1a4a60" : "#6a8a9a",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
              transition: "color 0.1s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "1.25rem 1rem" }}>

        {/* WDM Tab */}
        {view === "wdm" && (
          <div>
            <p style={{ fontSize: "0.8rem", color: "#4a6878", lineHeight: "1.65", marginBottom: "1rem", margin: "0 0 1rem" }}>
              A single glass fiber carries many independent data streams simultaneously by assigning
              each a different wavelength of light. Select a wavelength to send a pulse:
            </p>

            {/* Wavelength list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" }}>
              {WAVELENGTHS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => sendPulse(w.id)}
                  style={{
                    background: activeWl === w.id ? "#fff" : "transparent",
                    border: "1px solid",
                    borderColor: activeWl === w.id ? "#c4d0da" : "#dce8f0",
                    padding: "0.4rem 0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    textAlign: "left",
                    transition: "background 0.1s",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: w.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.72rem", color: w.color, fontFamily: "'Courier New', monospace", minWidth: "90px" }}>
                    {w.label}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#6a8a9a" }}>{w.data}</span>
                </button>
              ))}
            </div>

            {/* Fiber diagram */}
            <div style={{ background: "#fff", border: "1px solid #c4d0da", padding: "0.75rem", marginBottom: "0.75rem" }}>
              <svg viewBox="0 0 500 50" style={{ width: "100%", height: "50px" }}>
                {/* Cladding */}
                <rect x="28" y="15" width="444" height="20" rx="10" fill="#e8f0f8" stroke="#c4d0da" strokeWidth="1" />
                {/* Ambient lanes */}
                {WAVELENGTHS.map((w, i) => (
                  <line
                    key={w.id}
                    x1="32" y1={21 + i * 3}
                    x2="468" y2={21 + i * 3}
                    stroke={w.color}
                    strokeWidth="0.8"
                    opacity="0.2"
                  />
                ))}
                {/* Active pulse */}
                {active && (
                  <line
                    key={`${active.id}-${pulseKey}`}
                    x1="32"
                    y1={21 + WAVELENGTHS.findIndex((w) => w.id === active.id) * 3}
                    x2="468"
                    y2={21 + WAVELENGTHS.findIndex((w) => w.id === active.id) * 3}
                    stroke={active.color}
                    strokeWidth="1.8"
                    strokeDasharray="500"
                    strokeDashoffset="500"
                    style={{ animation: "fo-travel 1.1s ease-out forwards" }}
                  />
                )}
                {/* Labels */}
                <text x="14" y="28" textAnchor="middle" fontSize="7" fill="#6a8a9a" fontFamily="Arial, sans-serif">MUX</text>
                <text x="486" y="28" textAnchor="middle" fontSize="7" fill="#6a8a9a" fontFamily="Arial, sans-serif">DEMUX</text>
              </svg>
              <div style={{ fontSize: "0.65rem", color: "#9aaabb", marginTop: "4px", textAlign: "center" }}>
                Single glass fiber strand - all wavelengths travel simultaneously
              </div>
            </div>

            {/* Active info */}
            {active ? (
              <div style={{ fontSize: "0.78rem", color: "#4a6878", animation: "fo-fade 0.2s ease-out", borderLeft: "2px solid #c4d0da", paddingLeft: "0.75rem" }}>
                <span style={{ color: active.color, fontFamily: "'Courier New', monospace" }}>{active.label}</span>
                {" "}- {active.data}
                <br />
                <span style={{ color: "#8aaabb" }}>Traveling at approximately 200,000 km/s through silica glass.</span>
              </div>
            ) : (
              <div style={{ fontSize: "0.77rem", color: "#9aaabb" }}>
                Select a wavelength above to send a pulse through the fiber.
              </div>
            )}
          </div>
        )}

        {/* Compare Tab */}
        {view === "compare" && (
          <div style={{ animation: "fo-fade 0.2s ease-out" }}>
            <p style={{ fontSize: "0.8rem", color: "#4a6878", lineHeight: "1.65", margin: "0 0 1rem" }}>
              Fiber's decisive advantage over copper is attenuation: how much signal is lost
              per distance. Copper loses 3 dB every 100 m. Fiber loses just 0.2 dB per kilometer,
              allowing spans of 80 km without a repeater.
            </p>

            <button onClick={() => {
                  setWinner("");
                  setFiberOffset(0);
                  setCopperOffset(0);

                  requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                          setFiberOffset(400);
                          setCopperOffset(400);
                      });
                  });

                  setTimeout(() => {setWinner("Fiber reached the destination first.");}, 700);
                  }}

                  style={{
                      padding:"0.45rem .9rem",
                      border:"1px solid #c4d0da",
                      background:"#fff",
                      color:"#3a7a96",
                      cursor:"pointer",
                      fontSize:"0.75rem",
                      marginBottom:"1rem"
                  }}

            >
              Send Data
            </button>

            <div style={{background: "#fff", border: "1px solid #c4d0da", padding: "1rem", marginBottom: "1rem",}}>
                <svg viewBox="0 0 500 80" style={{ width: "100%" }}>

                  {/* Copper */}
                  <text x="0" y="22" fontSize="10" fill="#7a5030">
                    Copper
                  </text>

                  <line x1="70" y1="18" x2="470" y2="18" stroke="#bfa27a" strokeWidth="3"/>
                  <g
                      style={{transform: `translateX(${copperOffset}px)`, transition: "transform 3s linear",}}
                  >
                      <circle cx="70" cy="18"r="5" fill="#7a5030"/>
                  </g>



                  {/* Fiber */}
                  <text x="0" y="58" fontSize="10" fill="#3a7a96">
                    Fiber
                  </text>

                  <line x1="70" y1="54" x2="470" y2="54" stroke="#8cc8e8" strokeWidth="3"/>
                  <g
                      style={{transform: `translateX(${fiberOffset}px)`, transition: "transform 0.7s linear",}}
                  >
                      <circle cx="70" cy="54" r="5" fill="#3a7a96"/>
                  </g>



                </svg>

               {winner && (
                <div style={{marginTop: "0.75rem", color: "#3a7a96", fontSize: "0.75rem", animation: "race-fade .2s ease",}}>
                  ✓ {winner}
                </div>)}
              </div>


            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", background: "#fff", border: "1px solid #c4d0da" }}>
              <thead>
                <tr style={{ background: "#e4ecf2", borderBottom: "1px solid #c4d0da" }}>
                  <th style={{ ...th, textAlign: "left", color: "#4a6878" }}></th>
                  <th style={{ ...th, color: "#7a5030" }}>Copper</th>
                  <th style={{ ...th, color: "#3a7a96" }}>Fiber</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.label} style={{ borderTop: "1px solid #dce8f0", background: i % 2 === 0 ? "#fff" : "#f8fbfc" }}>
                    <td style={{ ...td, color: "#6a8a9a", textAlign: "left" }}>{row.label}</td>
                    <td style={{ ...td, color: "#7a5030" }}>{row.copper}</td>
                    <td style={{ ...td, color: "#3a7a96" }}>{row.fiber}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ fontSize: "0.73rem", color: "#6a8a9a", marginTop: "0.75rem", lineHeight: "1.6" }}>
              A copper repeater is needed every 100 m. A single fiber repeater can span 80 km
              of ocean floor (the distance from London to Oxford).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const th = {
  padding: "0.45rem 0.75rem",
  fontWeight: "bold",
  fontSize: "0.72rem",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
};

const td = {
  padding: "0.4rem 0.75rem",
  textAlign: "center",
  lineHeight: "1.5",
};
