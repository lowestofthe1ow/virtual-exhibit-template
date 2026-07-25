/**
 * InternetEraInteractive.jsx — Internet / Dial-Up Era Interactive
 * Font: Arial (outer UI), Courier New (terminal only).
 * Style: flat Win98 chrome. Terminal text is light gray on black, not neon.
 */

import { useState, useRef } from "react";

const MODEM_SEQUENCE = [
  "ATZ",
  "OK",
  "ATDT 555-1234",
  "CONNECT 48000/ARQ",
];

const css = `
  @keyframes ie-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  @keyframes ie-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export default function InternetEraInteractive() {
  const [phase, setPhase] = useState("idle");
  const [termLines, setTermLines] = useState([]);
  const [downloadPct, setDownloadPct] = useState(0);
  const timerRef = useRef(null);
  const dlRef = useRef(null);

  function dial() {
    if (phase !== "idle") return;
    setPhase("dialing");
    setTermLines([]);
    setDownloadPct(0);
    let i = 0;
    function addLine() {
      if (i >= MODEM_SEQUENCE.length) { setPhase("connected"); return; }
      setTermLines((prev) => [...prev, MODEM_SEQUENCE[i]]);
      i++;
      timerRef.current = setTimeout(addLine, i === 1 ? 350 : i === 3 ? 800 : 450);
    }
    timerRef.current = setTimeout(addLine, 150);
  }

  function download() {
    if (phase !== "connected") return;
    setPhase("downloading");
    let pct = 0;
    dlRef.current = setInterval(() => {
      pct += Math.random() * 2 + 0.4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(dlRef.current);
        setPhase("done");
      }
      setDownloadPct(Math.round(pct));
    }, 150);
  }

  function pickUpPhone() {
    clearInterval(dlRef.current);
    clearTimeout(timerRef.current);
    setPhase("interrupted");
    setTermLines((prev) => [...prev, "NO CARRIER"]);
  }

  function reset() {
    clearInterval(dlRef.current);
    clearTimeout(timerRef.current);
    setPhase("idle");
    setTermLines([]);
    setDownloadPct(0);
  }

  const statusMap = {
    idle:        { color: "#666",    text: "Modem idle" },
    dialing:     { color: "#885500", text: "Negotiating handshake..." },
    connected:   { color: "#2a5c2a", text: "CONNECTED  48000 bps" },
    downloading: { color: "#2a5c2a", text: "Downloading..." },
    done:        { color: "#2a5c2a", text: "Download complete" },
    interrupted: { color: "#882222", text: "NO CARRIER: phone was picked up" },
  };
  const { color: statusColor, text: statusText } = statusMap[phase];

  return (
    <div style={{
      background: "#d4d0c8",
      border: "2px solid",
      borderTopColor: "#ffffff",
      borderLeftColor: "#ffffff",
      borderBottomColor: "#808080",
      borderRightColor: "#808080",
      margin: "1.5rem 0",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}>
      <style>{css}</style>

      {/* Title bar */}
      <div style={{
        background: "linear-gradient(to right, #000080, #1060b8)",
        color: "#fff",
        padding: "3px 8px",
        fontSize: "0.78rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}>
        <span>Dial-Up Connection Manager  1998</span>
        <div style={{ display: "flex", gap: "2px" }}>
          {["_", "[]", "X"].map((c) => (
            <div key={c} style={{
              width: "18px", height: "14px",
              background: "#d4d0c8",
              border: "2px solid",
              borderTopColor: "#fff",
              borderLeftColor: "#fff",
              borderBottomColor: "#808080",
              borderRightColor: "#808080",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.5rem", color: "#000", cursor: "default",
              fontFamily: "Arial, sans-serif",
            }}>{c}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0.85rem 1rem" }}>

        {/* Terminal */}
        <div style={{
          background: "#0a0a0a",
          color: "#c8c8c8",
          padding: "0.6rem 0.75rem",
          fontSize: "0.82rem",
          lineHeight: "1.6",
          minHeight: "5.5rem",
          marginBottom: "0.6rem",
          border: "2px solid #808080",
          borderTopColor: "#404040",
          borderLeftColor: "#404040",
          fontFamily: "'Courier New', Courier, monospace",
        }}>
          {termLines.length === 0 && phase === "idle" && (
            <span style={{ color: "#555" }}>AT: Ready</span>
          )}
          {termLines.map((line, i) => (
            <div key={i} style={{ animation: "ie-fade 0.15s ease-out" }}>{line}</div>
          ))}
          {(phase === "dialing" || phase === "connected" || phase === "downloading") && (
            <span style={{ animation: "ie-blink 0.9s infinite" }}>_</span>
          )}
          {phase === "done" && (
            <div style={{ animation: "ie-fade 0.2s ease-out" }}>
              Transfer complete. page.html saved.
            </div>
          )}
        </div>

        {/* Status */}
        <div style={{ fontSize: "0.75rem", color: statusColor, marginBottom: "0.5rem" }}>
          {statusText}
        </div>

        {/* Progress bar */}
        {(phase === "downloading" || phase === "done") && (
          <div style={{ marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#444", marginBottom: "3px" }}>
              page.html  {downloadPct}%  approx.&nbsp;
              {Math.max(0, Math.round((1 - downloadPct / 100) * 45))} sec remaining
            </div>
            <div style={{
              height: "13px",
              background: "#808080",
              border: "2px solid #808080",
              borderTopColor: "#404040",
              borderLeftColor: "#404040",
            }}>
              <div style={{ height: "100%", width: `${downloadPct}%`, background: "#000080", transition: "width 0.1s linear" }} />
            </div>
          </div>
        )}

        {/* Interrupt notice */}
        {phase === "interrupted" && (
          <div style={{ background: "#fff8f8", border: "1px solid #c08080", padding: "0.5rem 0.65rem", fontSize: "0.78rem", color: "#661111", marginBottom: "0.5rem", animation: "ie-fade 0.2s" }}>
            Someone picked up the house phone. Dial-up shared the same copper wire as the telephone
            line: any incoming call or off-hook handset immediately severed the data connection.
          </div>
        )}

        {/* Completion note */}
        {phase === "done" && (
          <div style={{ fontSize: "0.72rem", color: "#555", marginBottom: "0.5rem", borderTop: "1px solid #bbb", paddingTop: "0.5rem" }}>
            A 256 KB page took roughly 45 seconds at 48,000 bps. On modern fibre, the same
            transfer completes in under one millisecond.
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {phase === "idle" && (
            <button onClick={dial} style={winBtn}>Connect</button>
          )}
          {phase === "connected" && (
            <>
              <button onClick={download} style={winBtn}>Download a page</button>
              <button onClick={pickUpPhone} style={{ ...winBtn, color: "#660000" }}>Pick up phone</button>
            </>
          )}
          {phase === "downloading" && (
            <button onClick={pickUpPhone} style={{ ...winBtn, color: "#660000" }}>Pick up phone</button>
          )}
          {(phase === "done" || phase === "interrupted") && (
            <button onClick={reset} style={winBtn}>Reset</button>
          )}
        </div>
      </div>
    </div>
  );
}

const winBtn = {
  background: "#d4d0c8",
  border: "2px solid",
  borderTopColor: "#ffffff",
  borderLeftColor: "#ffffff",
  borderBottomColor: "#808080",
  borderRightColor: "#808080",
  padding: "3px 14px",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "0.8rem",
  cursor: "pointer",
  color: "#111",
};
