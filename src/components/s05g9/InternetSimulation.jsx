import { useState, useRef, useEffect } from "react";
import InternetHistory from "./InternetHistory.jsx";
import simCss from "../../styles/s05g9/internet-simulation.css?inline";

// Styles
export const css = simCss;

// Terminal script lines
const TERMINAL_LINES = [
  { html: "> Initializing Cisco 7000 router...",           delay: 200  },
  { html: "> Configuring Sprint 64kbps leased line...",    delay: 600  },
  { html: "> Sending TCP/IP handshake packet...",          delay: 1100 },
  { html: "> Awaiting ACK from Sprint gateway...",         delay: 1700 },
  { html: "> ACK received from 204.59.0.1",               delay: 2200 },
  { html: "> BGP route established...",                    delay: 2600 },
  { html: "> IP address assigned: <span class='sim-term-accent'>202.57.0.1</span>", delay: 3000 },
  { html: "> <span class='sim-term-accent'>Connection ESTABLISHED ✓</span>",        delay: 3400 },
  { html: "> Philippines is now ONLINE.",                  delay: 3800 },
];

// Component
export default function InternetSimulation({ mapSrc = "/Metro_manila_map.png" }) {
  // steps: 'initial' | 'selecting' | 'ready' | 'connected'
  const [step,        setStep]        = useState("initial");
  const [pldtSel,     setPldtSel]     = useState(false);
  const [sprintSel,   setSprintSel]   = useState(false);
  const [isOnline,    setIsOnline]    = useState(false);
  const [termLines,   setTermLines]   = useState([]);
  const [bannerVis,   setBannerVis]   = useState(false);
  const [linkCoords,  setLinkCoords]  = useState(null);

  const canvasRef = useRef(null);
  const pldtRef   = useRef(null);
  const sprintRef = useRef(null);

  // Inject fonts/styles once
  useEffect(() => {
    if (document.getElementById("sim-injected-css")) return;
    const style = document.createElement("style");
    style.id = "sim-injected-css";
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  // Recalculate SVG line whenever selections change
  useEffect(() => {
    if ((!pldtSel && !sprintSel) || !canvasRef.current || !pldtRef.current || !sprintRef.current) return;
    const cb = canvasRef.current.getBoundingClientRect();
    const pb = pldtRef.current.getBoundingClientRect();
    const sb = sprintRef.current.getBoundingClientRect();
    setLinkCoords({
      x1: pb.left - cb.left + 7,
      y1: pb.top  - cb.top  + 7,
      x2: sb.left - cb.left + 20,
      y2: sb.top  - cb.top  + 20,
    });
  }, [pldtSel, sprintSel]);

  function handlePldtClick() {
    if (step === "initial") setStep("selecting");
    if (step === "selecting" || step === "initial") {
      setPldtSel(true);
      if (sprintSel) setStep("ready");
    }
  }

  function handleSprintClick() {
    if (step !== "selecting" && step !== "initial") return;
    setSprintSel(true);
    if (pldtSel) setStep("ready");
  }

  function handleConnect() {
    if (step !== "ready") return;
    setStep("connected");

    TERMINAL_LINES.forEach(({ html, delay }) => {
      setTimeout(() => {
        setTermLines(prev => [...prev, html]);
      }, delay);
    });

    setTimeout(() => {
      setIsOnline(true);
      setBannerVis(true);
    }, 4200);
  }

  function handleReset() {
    setStep("initial");
    setPldtSel(false);
    setSprintSel(false);
    setIsOnline(false);
    setTermLines([]);
    setBannerVis(false);
    setLinkCoords(null);
  }

  if (step === "impact") {
    return (
        <div style={{ position: "relative" }} className="sim-screen">
          <InternetHistory onReplay={handleReset} />
        </div>
    );
  }

  const tagClass      = step === "selecting" || step === "ready" ? "sim-tag selecting" : "sim-tag";
  const tagText       = step === "initial"  ? "SIMULATION • PRE-1994 PHILIPPINES"
                      : step === "selecting" || step === "ready" ? "SELECT CONNECTION ROUTE"
                      : "CONNECTION ESTABLISHED";
  const btnClass      = step === "ready" ? "sim-btn ready" : "sim-btn";
  const btnText       = step === "ready" ? "CONNECT TO THE WORLD →" : "Select Both Endpoints First";

  return (
    <div className="sim-root">
      {/* Header */}
      <header className="sim-header">
        <div className="sim-brand">
          <div className="sim-brand-title">Kumusta Mundo: Ang Kaarawan ng Lokal Networks sa Pilipinas</div>
          <div className="sim-brand-sub">The Birth of Philippine Internet — March 29, 1994</div>
        </div>
        <div className={`sim-status ${isOnline ? "sim-online" : "sim-offline"}`}>
          <span className="sim-status-dot" />
          <span>{isOnline ? "ONLINE ✓" : "OFFLINE"}</span>
        </div>
      </header>

      {/* Screen 1: Selection */}
      {step !== "connected" && (
        <div className="sim-screen">
          <section className="sim-hero">
            <div className={tagClass}>{tagText}</div>
            <h1 className="sim-title">
              {step === "initial" ? <>The Philippines, <span>Offline</span></> : "Select the Connection Route"}
            </h1>
            <div className="sim-desc">
              {step === "initial"
                ? "Before March 29, 1994, the Philippines had no direct connection to the global Internet. Universities and businesses operated isolated Bulletin Board Systems and UUCP networks — islands of data in a pre-connected archipelago."
                : "Choose PLDT Makati and the Sprint endpoint to establish the historic link."}
            </div>
            {step === "initial" && (
              <div className="sim-instruction">↓ Click the PLDT Makati node on the map to begin the simulation</div>
            )}
            {(step === "selecting" || step === "ready") && (
              <div className="sim-pills">
                <div className={`sim-pill${pldtSel ? " selected" : ""}`}>{pldtSel ? "✓ PLDT Makati" : "PLDT Makati"}</div>
                <div className={`sim-pill${sprintSel ? " selected" : ""}`}>{sprintSel ? "✓ Sprint USA" : "Sprint USA"}</div>
              </div>
            )}
          </section>

          <main className="sim-grid">
            {/* Map */}
            <section className="sim-map-card">
              <div className="sim-map-header">
                <span>NETWORK MAP</span>
                <span>ASIA-PACIFIC REGION</span>
              </div>
              <div className="sim-canvas" ref={canvasRef}>
                <div className="sim-ph-wrapper">
                  <img src={mapSrc} alt="Metro Manila Regional Map" className="sim-ph-img" loading="lazy" />
                  <div
                    className={`sim-node-pldt${pldtSel ? " selected" : ""}`}
                    ref={pldtRef}
                    onClick={handlePldtClick}
                    title="PLDT Makati — click to select"
                  />
                  <div className="sim-node-label">
                    PLDT Makati
                    <span>Sprint Gateway</span>
                  </div>
                </div>

                <div
                  className={`sim-us-box${sprintSel ? " selected" : ""}`}
                  ref={sprintRef}
                  onClick={handleSprintClick}
                  title="Sprint USA — click to select"
                >
                  <div className="us-title">UNITED STATES</div>
                  <div className="us-gw">Sprint Network</div>
                  <div className="us-sub">San Francisco, USA</div>
                  <div className="sim-us-icon" />
                </div>

                {/* SVG connection line */}
                <svg className="sim-svg">
                  {linkCoords && (
                    <line
                      className="sim-link"
                      x1={linkCoords.x1} y1={linkCoords.y1}
                      x2={linkCoords.x2} y2={linkCoords.y2}
                    />
                  )}
                </svg>

                <div
                  className="sim-map-footer"
                  style={step !== "initial" ? { color: "var(--connection-blue)" } : {}}
                >
                  {step === "initial" ? "ISOLATED NETWORKS — PRE-1994" : "SELECT PLDT MAKATI • SPRINT USA"}
                </div>
              </div>
            </section>

            {/* Info panel */}
            <section className="sim-info-panel">
              <div className="sim-status-card">
                <h2 className="sim-status-card-title">NETWORK STATUS</h2>
                <div className="sim-status-row"><span className="sim-status-lbl">Year</span><span className="sim-status-val">1993</span></div>
                <div className="sim-status-row"><span className="sim-status-lbl">Status</span><span className="sim-status-val-red">ISOLATED</span></div>
                <div className="sim-status-row"><span className="sim-status-lbl">Networks</span><span className="sim-status-val">BBS / UUCP only</span></div>
                <div className="sim-status-row"><span className="sim-status-lbl">International</span><span className="sim-status-val">No TCP/IP</span></div>
                <p className="sim-footer-txt">
                  E-mail required expensive international phone calls via UUCP — slow, unreliable, and inaccessible to most Filipinos.
                </p>
              </div>
              <button
                className={btnClass}
                disabled={step !== "ready"}
                onClick={handleConnect}
              >
                {btnText}
              </button>
            </section>
          </main>
        </div>
      )}

      {/* Screen 2: Connection established */}
      {step === "connected" && (
        <div className="sim-screen">
          <main className="sim-est-grid">
            {/* Terminal */}
            <section className="sim-terminal-card">
              <div className="sim-terminal-hdr-bar">
                <span className="sim-terminal-prompt">&gt;_</span> NETWORK TERMINAL — PLDT MAKATI NODE
              </div>
              <div className="sim-terminal-body">
                {termLines.map((html, i) => (
                  <div
                    key={i}
                    className="sim-term-line print"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </div>
            </section>

            {/* Historic moment */}
            <section
              className="sim-info-panel"
              style={{
                opacity: bannerVis ? 1 : 0,
                transform: bannerVis ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.5s",
              }}
            >
              <div className="sim-banner">
                <div className="sim-sun">☀️</div>
                <h2 className="sim-banner-title">PHILIPPINES ONLINE</h2>
                <div className="sim-banner-date">March 29, 1994 • 01:15 AM</div>
                <div className="sim-banner-txt">
                  The Philippines became the first Southeast Asian nation to establish a full TCP/IP connection
                  to the global Internet. A 64 kbps leased line via Sprint linked PLDT's facility in Makati to
                  the world — opening a new era for Filipino digital life.
                </div>
              </div>
            </section>
          </main>

          <div className="sim-metrics">
            <div className="sim-metric">
              <div className="sim-metric-val">64 kbps</div>
              <div className="sim-metric-lbl">Speed</div>
            </div>
            <div className="sim-metric">
              <div className="sim-metric-val">Cisco 7000</div>
              <div className="sim-metric-lbl">Router</div>
            </div>
            <div className="sim-metric">
              <div className="sim-metric-val">PLDT / Sprint</div>
              <div className="sim-metric-lbl">Provider</div>
            </div>
            <div className="sim-metric">
              <div className="sim-metric-val">TCP/IP</div>
              <div className="sim-metric-lbl">Protocol</div>
            </div>
          </div>

          <div className="sim-connected-actions">
            <button className="sim-btn green" onClick={() => setStep("impact")} disabled={!bannerVis}>
              Explore the impact ↺
            </button>
            <button className="sim-btn ready sim-restart-btn" onClick={handleReset}>
              Restart Simulation ↺
            </button>
          </div>
        </div>
      )}

      <footer className="sim-credits">
        Educational simulation • Based on historical records • PLDT • DOST • NTC Philippines
      </footer>
    </div>
  );
}