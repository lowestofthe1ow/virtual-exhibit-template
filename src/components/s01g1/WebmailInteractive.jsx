/**
 * WebmailInteractive.jsx — Internet Era Webmail Transmission Visualizer
 * Font: Arial (UI/Form text), Courier New (Status Bar / Transmission Console).
 * Theme: Win98 window chrome with classic bevels, blue gradient title bar,
 *        and generic 1990s web browser controls.
 */

import { useState, useRef, useEffect } from "react";

const css = `
  @keyframes webmail-fade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes webmail-spin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function WebmailSendVisualizer() {
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "delivered"
  const [toAddress, setToAddress] = useState("keiko@tokyo-net.or.jp");
  const [fromAddress, setFromAddress] = useState("alex@sf-bay-online.net");
  const [subject, setSubject] = useState("Greetings from across the ocean!");
  const [body, setBody] = useState(
    "Hello Keiko!\n\nSending you this message using our new webmail interface. It travels over fiber backbone cables across the Pacific. Let me know when it arrives!"
  );

  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [consoleLog, setConsoleLog] = useState("Ready to send message.");

  const timerRef = useRef(null);

  function handleSend() {
    if (status === "sending") return;

    setStatus("sending");
    setElapsedTime(0);
    setProgress(0);
    setConsoleLog("Resolving MX host for tokyo-net.or.jp...");

    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const seconds = (now - startTime) / 1000;
      setElapsedTime(seconds);

      // Progress advances up to 100% over ~4.2 seconds
      const currentProgress = Math.min(100, Math.round((seconds / 4.2) * 100));
      setProgress(currentProgress);

      if (currentProgress < 25) {
        setConsoleLog("Connecting to SMTP gateway (sf-bay-online.net:25)...");
      } else if (currentProgress < 60) {
        setConsoleLog("Transmitting IP datagrams via Pacific Undersea Backbone...");
      } else if (currentProgress < 90) {
        setConsoleLog("Handshaking with mail.tokyo-net.or.jp...");
      } else if (currentProgress >= 100) {
        clearInterval(timerRef.current);
        setStatus("delivered");
        setConsoleLog("250 2.0.0 OK Message accepted for delivery");
      }
    }, 50);
  }

  function handleReset() {
    clearInterval(timerRef.current);
    setStatus("idle");
    setElapsedTime(0);
    setProgress(0);
    setConsoleLog("Ready to send message.");
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Compute position along SVG network line (San Francisco -> Honolulu -> Tokyo)
  // Path segment 1: SF (40, 50) -> Hawaii (170, 75)
  // Path segment 2: Hawaii (170, 75) -> Tokyo (300, 45)
  let packetX = 40;
  let packetY = 50;

  if (progress <= 50) {
    const t = progress / 50;
    packetX = 40 + t * (170 - 40);
    packetY = 50 + t * (75 - 50);
  } else {
    const t = (progress - 50) / 50;
    packetX = 170 + t * (300 - 170);
    packetY = 75 + t * (45 - 75);
  }

  return (
    <div style={outerWindowStyle}>
      <style>{css}</style>

      {/* Title Bar */}
      <div style={titleBarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.85rem" }}>&#128231;</span>
          <span style={{ fontWeight: "bold" }}>Webmail Browser v2.0 (1997)</span>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {["_", "[]", "X"].map((btn) => (
            <div key={btn} style={titleBtnStyle}>
              {btn}
            </div>
          ))}
        </div>
      </div>

      {/* Retro Browser Toolbar Chrome */}
      <div style={toolbarBarStyle}>
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
          <button style={toolbarBtnStyle} title="Back">&lt; Back</button>
          <button style={toolbarBtnStyle} title="Forward">Forward &gt;</button>
          <button style={{ ...toolbarBtnStyle, color: status === "sending" ? "#880000" : "#555" }} title="Stop">
            Stop
          </button>
          <button style={toolbarBtnStyle} title="Reload">Reload</button>
          <button style={toolbarBtnStyle} title="Home">Home</button>
        </div>

        {/* Browser Throbber / Loading Indicator */}
        <div style={throbberBoxStyle}>
          {status === "sending" ? (
            <div style={spinnerStyle} />
          ) : (
            <div style={{ fontSize: "0.65rem", color: "#666", fontWeight: "bold" }}>WEB</div>
          )}
        </div>
      </div>

      {/* Address Bar */}
      <div style={addressBarStyle}>
        <span style={{ fontSize: "0.75rem", color: "#444", fontWeight: "bold" }}>Location:</span>
        <div style={sunkenAddressField}>
          http://www.netmail97.com/mail/compose.cgi?id=7842
        </div>
      </div>

      {/* Main Webmail Application Window */}
      <div style={{ padding: "0.85rem 0.9rem", background: "#d4d0c8" }}>
        
        {/* Email Header Fields */}
        <div style={webmailFrameStyle}>
          <div style={headerRowStyle}>
            <label style={labelStyle}>To:</label>
            <input
              type="text"
              value={toAddress}
              disabled={status !== "idle"}
              onChange={(e) => setToAddress(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={headerRowStyle}>
            <label style={labelStyle}>From:</label>
            <input
              type="text"
              value={fromAddress}
              disabled={status !== "idle"}
              onChange={(e) => setFromAddress(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={headerRowStyle}>
            <label style={labelStyle}>Subject:</label>
            <input
              type="text"
              value={subject}
              disabled={status !== "idle"}
              onChange={(e) => setSubject(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <textarea
              rows={3}
              value={body}
              disabled={status !== "idle"}
              onChange={(e) => setBody(e.target.value)}
              style={{ ...inputStyle, resize: "none", fontFamily: "Arial, sans-serif" }}
            />
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.6rem" }}>
            {status === "idle" && (
              <button onClick={handleSend} style={winSendBtn}>
                &#128231; Send Message Now
              </button>
            )}
            {status === "sending" && (
              <span style={{ fontSize: "0.75rem", color: "#000080", fontWeight: "bold" }}>
                Transmitting datagrams...
              </span>
            )}
            {status === "delivered" && (
              <button onClick={handleReset} style={winBtn}>
                Compose Another Message
              </button>
            )}

            <div style={{ fontSize: "0.75rem", color: "#444", fontFamily: "'Courier New', monospace" }}>
              Elapsed Time: <strong>{elapsedTime.toFixed(1)}s</strong>
            </div>
          </div>
        </div>

        {/* Network Backbone Map Visualizer */}
        <div style={mapContainerStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#555", marginBottom: "4px" }}>
            <span><strong>ORIGIN:</strong> San Francisco, USA</span>
            <span><strong>TRANSIT:</strong> Pacific Fiber Line</span>
            <span><strong>DESTINATION:</strong> Tokyo, Japan</span>
          </div>

          <svg viewBox="0 0 340 100" style={{ width: "100%", height: "100px", background: "#101820", border: "1px solid #808080" }}>
            {/* Grid background lines */}
            <line x1="0" y1="25" x2="340" y2="25" stroke="#1c2a38" strokeWidth="1" />
            <line x1="0" y1="50" x2="340" y2="50" stroke="#1c2a38" strokeWidth="1" />
            <line x1="0" y1="75" x2="340" y2="75" stroke="#1c2a38" strokeWidth="1" />

            {/* Backbone route lines */}
            <polyline
              points="40,50 170,75 300,45"
              fill="none"
              stroke="#2a5c8a"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Active connection highlight */}
            <polyline
              points="40,50 170,75 300,45"
              fill="none"
              stroke={status !== "idle" ? "#00ffcc" : "#2a5c8a"}
              strokeWidth="1.5"
              opacity={status !== "idle" ? 0.6 : 0.2}
            />

            {/* Nodes */}
            {/* San Francisco */}
            <circle cx="40" cy="50" r="5" fill="#d4d0c8" stroke="#000080" strokeWidth="2" />
            <text x="15" y="38" fill="#a0c0e0" fontSize="8" fontFamily="Arial">SF Gateway</text>

            {/* Honolulu Relay */}
            <circle cx="170" cy="75" r="4" fill="#808080" stroke="#404040" strokeWidth="1" />
            <text x="145" y="92" fill="#7090b0" fontSize="7" fontFamily="Arial">Pacific Relay</text>

            {/* Tokyo */}
            <circle cx="300" cy="45" r="5" fill="#d4d0c8" stroke="#2a5c2a" strokeWidth="2" />
            <text x="275" y="33" fill="#a0e0a0" fontSize="8" fontFamily="Arial">Tokyo Node</text>

            {/* Traveling Datagram Packet */}
            {status !== "idle" && (
              <g transform={`translate(${packetX}, ${packetY})`}>
                <circle r="6" fill="#ffff00" stroke="#ff0000" strokeWidth="1" />
                <text x="-4" y="3" fill="#000" fontSize="8" fontWeight="bold">&#9993;</text>
              </g>
            )}
          </svg>

          {/* Progress Bar */}
          <div style={{ marginTop: "6px" }}>
            <div style={progressTrackStyle}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: status === "delivered" ? "#2a5c2a" : "#000080",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* Delivery Comparison Note */}
        {status === "delivered" && (
          <div style={comparisonNoteStyle}>
            <div style={{ fontWeight: "bold", fontSize: "0.8rem", color: "#1b4d1b", marginBottom: "4px" }}>
              &#10004; Transmission Complete
            </div>
            <p style={{ margin: 0, fontSize: "0.76rem", lineHeight: "1.45", color: "#222" }}>
              This electronic mail message traveled approximately <strong>5,150 miles (8,280 km)</strong> across 
              undersea fiber cables and router hops in <strong>{elapsedTime.toFixed(1)} seconds</strong>. 
              In the preceding Mail Era, an international physical letter via airmail took <strong>5 to 10 days</strong>, 
              or up to <strong>3 weeks</strong> by ocean steamer.
            </p>
          </div>
        )}

        {/* Console / Status Bar Output */}
        <div style={consoleBoxStyle}>
          &gt; {consoleLog}
        </div>
      </div>
    </div>
  );
}

const outerWindowStyle = {
  background: "#d4d0c8",
  border: "2px solid",
  borderTopColor: "#ffffff",
  borderLeftColor: "#ffffff",
  borderBottomColor: "#808080",
  borderRightColor: "#808080",
  margin: "1.5rem 0",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const titleBarStyle = {
  background: "linear-gradient(to right, #000080, #1060b8)",
  color: "#fff",
  padding: "3px 8px",
  fontSize: "0.78rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleBtnStyle = {
  width: "18px",
  height: "14px",
  background: "#d4d0c8",
  border: "2px solid",
  borderTopColor: "#fff",
  borderLeftColor: "#fff",
  borderBottomColor: "#808080",
  borderRightColor: "#808080",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.5rem",
  color: "#000",
  cursor: "default",
};

const toolbarBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 8px",
  borderBottom: "1px solid #808080",
  background: "#d4d0c8",
};

const toolbarBtnStyle = {
  background: "#d4d0c8",
  border: "1px solid",
  borderTopColor: "#ffffff",
  borderLeftColor: "#ffffff",
  borderBottomColor: "#808080",
  borderRightColor: "#808080",
  padding: "2px 6px",
  fontSize: "0.7rem",
  cursor: "pointer",
  color: "#222",
  fontFamily: "Arial, sans-serif",
};

const throbberBoxStyle = {
  width: "24px",
  height: "22px",
  background: "#fff",
  border: "2px solid",
  borderTopColor: "#808080",
  borderLeftColor: "#808080",
  borderBottomColor: "#ffffff",
  borderRightColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const spinnerStyle = {
  width: "10px",
  height: "10px",
  border: "2px solid #000080",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: "webmail-spin 0.6s linear infinite",
};

const addressBarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "4px 8px",
  background: "#d4d0c8",
  borderBottom: "2px solid #808080",
};

const sunkenAddressField = {
  flex: 1,
  background: "#ffffff",
  border: "2px solid",
  borderTopColor: "#808080",
  borderLeftColor: "#808080",
  borderBottomColor: "#ffffff",
  borderRightColor: "#ffffff",
  padding: "2px 6px",
  fontSize: "0.73rem",
  fontFamily: "'Courier New', monospace",
  color: "#222",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const webmailFrameStyle = {
  background: "#ffffff",
  border: "2px solid",
  borderTopColor: "#808080",
  borderLeftColor: "#808080",
  borderBottomColor: "#ffffff",
  borderRightColor: "#ffffff",
  padding: "0.75rem",
  marginBottom: "0.75rem",
};

const headerRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "6px",
};

const labelStyle = {
  width: "55px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  color: "#444",
  textAlign: "right",
};

const inputStyle = {
  flex: 1,
  border: "1px solid #808080",
  padding: "3px 6px",
  fontSize: "0.75rem",
  fontFamily: "Arial, sans-serif",
  background: "#fafafa",
  color: "#111",
};

const winBtn = {
  background: "#d4d0c8",
  border: "2px solid",
  borderTopColor: "#ffffff",
  borderLeftColor: "#ffffff",
  borderBottomColor: "#808080",
  borderRightColor: "#808080",
  padding: "3px 12px",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "0.78rem",
  cursor: "pointer",
  color: "#111",
};

const winSendBtn = {
  ...winBtn,
  fontWeight: "bold",
  background: "#e2ded6",
  color: "#000080",
};

const mapContainerStyle = {
  background: "#e8e4dc",
  border: "2px solid",
  borderTopColor: "#808080",
  borderLeftColor: "#808080",
  borderBottomColor: "#ffffff",
  borderRightColor: "#ffffff",
  padding: "0.6rem",
  marginBottom: "0.75rem",
};

const progressTrackStyle = {
  height: "10px",
  background: "#ffffff",
  border: "2px solid",
  borderTopColor: "#808080",
  borderLeftColor: "#808080",
  borderBottomColor: "#ffffff",
  borderRightColor: "#ffffff",
};

const comparisonNoteStyle = {
  background: "#f0f8f0",
  border: "1px solid #a0caa0",
  padding: "0.65rem 0.8rem",
  marginBottom: "0.75rem",
  animation: "webmail-fade 0.3s ease-out",
};

const consoleBoxStyle = {
  background: "#000000",
  color: "#00ff00",
  padding: "0.45rem 0.65rem",
  fontSize: "0.72rem",
  fontFamily: "'Courier New', monospace",
  border: "2px solid",
  borderTopColor: "#808080",
  borderLeftColor: "#808080",
  borderBottomColor: "#ffffff",
  borderRightColor: "#ffffff",
  minHeight: "1.4rem",
};