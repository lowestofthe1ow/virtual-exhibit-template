/**
 * WifiEraInteractive.jsx - Wi-Fi Era Interactive
 * Font: "DM Mono" (labels) + "DM Sans" (body). No Arial, no Inter, no Roboto.
 * Style: warm off-white (#f7f4ef), amber signal arcs, instrument-panel aesthetic.
 * Tabs: Signal Strength Simulator | Channel Congestion | Packet Path
 */

import { useState, useRef } from "react";

/* data */

const OBSTACLES = [
  { id: "none",     label: "Open air",          penalty: 0 },
  { id: "wall",     label: "+ Drywall wall",     penalty: 1 },
  { id: "concrete", label: "+ Concrete wall",    penalty: 2 },
  { id: "micro",    label: "+ Microwave oven",   penalty: 2 },
  { id: "neighbor", label: "+ Neighbor Wi-Fi",   penalty: 1 },
];

const CHANNELS = [
  { ch: 1,   band: "2.4 GHz", nets: 4 },
  { ch: 6,   band: "2.4 GHz", nets: 7 },
  { ch: 11,  band: "2.4 GHz", nets: 3 },
  { ch: 36,  band: "5 GHz",   nets: 1 },
  { ch: 40,  band: "5 GHz",   nets: 2 },
  { ch: 100, band: "5 GHz",   nets: 0 },
];

const HOPS = [
  { id: "device", label: "Your Device",   sub: "802.11 radio frame",  note: "Your laptop breaks data into 802.11 frames and transmits on the 5 GHz band." },
  { id: "router", label: "Wi-Fi Router",  sub: "IP packet via NAT",   note: "The router decapsulates the 802.11 frame, applies NAT to replace your private IP with the public IP, and forwards an IP packet upstream." },
  { id: "isp",    label: "ISP Gateway",   sub: "BGP routing table",   note: "Your ISP looks up the destination IP in its BGP routing table and selects the best autonomous system path across the internet backbone." },
  { id: "cdn",    label: "CDN Edge Node", sub: "Cached response",     note: "A content delivery node geographically close to you responds with a cached copy, avoiding a full round-trip to the origin server entirely." },
  { id: "server", label: "Origin Server", sub: "HTTP/3 over QUIC",    note: "If no CDN cache hit exists, the origin server processes the request and replies via HTTP/3 over QUIC (UDP-based) for minimal latency." },
];

/* style tokens */

const BG     = "#f7f4ef";
const BORDER = "#ddd8cf";
const AMBER  = "#c0622a";
const GREEN  = "#3a7a6a";
const MUTED  = "#8a8278";
const TEXT   = "#2a2520";
const SUB    = "#5a5450";
const MONO   = "'DM Mono','Courier New',monospace";
const SANS   = "'DM Sans','Segoe UI',sans-serif";

/* keyframes injected once */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes wf-fade { from{opacity:0} to{opacity:1} }
  @keyframes wf-hop  { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
  @keyframes wf-arc  { 0%{opacity:0;transform:scale(.6)} 40%{opacity:1} 100%{opacity:.15;transform:scale(1)} }
  @keyframes wf-bar  { from{transform:scaleY(0)} to{transform:scaleY(1)} }
`;

/* shared button style */

function tabBtn(active) {
  return {
    padding: "0.5rem 0.85rem",
    background: active ? "#fff" : "transparent",
    border: "none",
    borderBottom: active ? `2px solid ${AMBER}` : "2px solid transparent",
    borderRight: `1px solid ${BORDER}`,
    color: active ? TEXT : MUTED,
    fontSize: "0.72rem",
    fontFamily: MONO,
    letterSpacing: "0.04em",
    cursor: "pointer",
    transition: "color 0.1s",
    whiteSpace: "nowrap",
  };
}

/* ---- Signal Tab ---- */

function SignalTab() {
  const [bars, setBars] = useState(3);
  const [obstacle, setObstacle] = useState("none");
  const obs = OBSTACLES.find((o) => o.id === obstacle);
  const eff = Math.max(0, bars - obs.penalty);
  const rssi     = [-90, -75, -65, -55, -45][eff];
  const speedMap = ["<1 Mbps", "~5 Mbps", "~25 Mbps", "~150 Mbps", "~600 Mbps"];
  const qualMap  = ["No signal", "Weak", "Fair", "Good", "Excellent"];
  const qualCol  = ["#999", "#c07a2a", "#9a8a2a", GREEN, "#2a6a5a"];
  const distMap  = ["0 m", "3 m", "8 m", "15 m", "30+ m"];

  return (
    <div style={{ animation: "wf-fade .2s" }}>
      <p style={{ fontSize: ".8rem", color: SUB, lineHeight: "1.65", margin: "0 0 1rem", fontFamily: SANS }}>
        Wi-Fi uses unlicensed radio spectrum. Signal strength degrades with distance and physical
        obstructions. Adjust the router distance and add obstacles to observe throughput changes.
      </p>

      {/* Arc SVG */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "1.25rem 1rem .75rem", marginBottom: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg viewBox="0 0 120 72" style={{ width: "120px", height: "72px", overflow: "visible" }}>
          {[1,2,3,4].map((i) => {
            const r = 14 + i * 14;
            const active = i <= eff;
            return (
              <path
                key={i}
                d={`M ${60 - r*.707} ${70 - r*.707} A ${r} ${r} 0 0 1 ${60 + r*.707} ${70 - r*.707}`}
                fill="none"
                stroke={active ? AMBER : BORDER}
                strokeWidth="4"
                strokeLinecap="round"
                style={active ? { animation: `wf-arc ${.5 + i*.15}s ease-out ${i*.08}s both` } : {}}
              />
            );
          })}
          <circle cx="60" cy="68" r="4" fill={eff > 0 ? AMBER : BORDER} />
        </svg>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: ".5rem" }}>
          <span style={{ fontFamily: MONO, fontSize: ".72rem", color: qualCol[eff] }}>{qualMap[eff]}</span>
          <span style={{ fontFamily: MONO, fontSize: ".72rem", color: MUTED }}>{rssi} dBm</span>
          <span style={{ fontFamily: MONO, fontSize: ".72rem", color: SUB }}>{speedMap[eff]}</span>
        </div>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: ".85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontFamily: MONO, fontSize: ".65rem", color: MUTED, textTransform: "uppercase", letterSpacing: ".06em" }}>Router distance</span>
          <span style={{ fontFamily: MONO, fontSize: ".65rem", color: AMBER }}>{distMap[4 - bars]}</span>
        </div>
        <input type="range" min={0} max={4} value={bars} onChange={(e) => setBars(+e.target.value)}
          style={{ width: "100%", accentColor: AMBER, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: ".6rem", color: MUTED }}>
          <span>Excellent</span><span>Weak</span>
        </div>
      </div>

      {/* Obstacle chips */}
      <div style={{ marginBottom: ".75rem" }}>
        <div style={{ fontFamily: MONO, fontSize: ".65rem", color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".4rem" }}>Obstacle / interference</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem" }}>
          {OBSTACLES.map((o) => (
            <button key={o.id} onClick={() => setObstacle(o.id)} style={{
              padding: ".3rem .6rem",
              background: obstacle === o.id ? AMBER : "transparent",
              color: obstacle === o.id ? "#fff" : SUB,
              border: `1px solid ${obstacle === o.id ? AMBER : BORDER}`,
              fontFamily: MONO, fontSize: ".65rem", cursor: "pointer", transition: "all .12s",
            }}>{o.label}</button>
          ))}
        </div>
      </div>

      {eff < bars && (
        <div style={{ fontSize: ".75rem", fontFamily: SANS, color: SUB, borderLeft: `2px solid ${AMBER}`, paddingLeft: ".65rem", lineHeight: "1.6", animation: "wf-fade .2s" }}>
          Signal reduced by <strong style={{ color: AMBER }}>{obs.penalty} bar{obs.penalty > 1 ? "s" : ""}</strong> due to{" "}
          <em>{obs.label.replace("+ ", "").toLowerCase()}</em>. Unlike fiber, radio energy disperses
          through matter and interferes with competing devices on the same unlicensed band.
        </div>
      )}
    </div>
  );
}

/* ---- Channel Tab ---- */

function ChannelTab() {
  const [selected, setSelected] = useState(null);
  const maxNets = Math.max(...CHANNELS.map((c) => c.nets), 1);

  return (
    <div style={{ animation: "wf-fade .2s" }}>
      <p style={{ fontSize: ".8rem", color: SUB, lineHeight: "1.65", margin: "0 0 1rem", fontFamily: SANS }}>
        Wi-Fi operates on shared, unlicensed radio channels. Every nearby router on the same channel
        competes for airtime, lowering throughput for everyone. The 5 GHz band offers more channels
        and less congestion, but shorter range.
      </p>

      {/* Bar chart */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "1rem 1rem .5rem", marginBottom: ".85rem" }}>
        <div style={{ fontFamily: MONO, fontSize: ".6rem", color: MUTED, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: ".75rem" }}>
          Competing networks per channel (your neighbourhood)
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: ".4rem", height: "80px" }}>
          {CHANNELS.map((c) => {
            const h = c.nets === 0 ? 4 : Math.round((c.nets / maxNets) * 72);
            const isSel = selected === c.ch;
            const col = c.band === "5 GHz" ? GREEN : AMBER;
            return (
              <div key={c.ch} onClick={() => setSelected(isSel ? null : c.ch)}
                title={`Ch ${c.ch} - ${c.band} - ${c.nets} networks`}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: "4px" }}>
                <div style={{
                  width: "100%", height: `${h}px`,
                  background: c.nets === 0 ? GREEN : col,
                  opacity: isSel ? 1 : 0.72,
                  outline: isSel ? `2px solid ${col}` : "none",
                  outlineOffset: "1px",
                  transition: "opacity .12s",
                  transformOrigin: "bottom",
                  animation: "wf-bar .4s ease-out both",
                }} />
                <span style={{ fontFamily: MONO, fontSize: ".55rem", color: MUTED }}>{c.ch}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: ".6rem", color: MUTED, marginTop: ".3rem" }}>
          <span>2.4 GHz channels</span><span>5 GHz channels</span>
        </div>
      </div>

      {selected !== null ? (() => {
        const c = CHANNELS.find((x) => x.ch === selected);
        const col = c.band === "5 GHz" ? GREEN : AMBER;
        return (
          <div style={{ fontSize: ".78rem", fontFamily: SANS, color: SUB, borderLeft: `2px solid ${col}`, paddingLeft: ".65rem", lineHeight: "1.65", animation: "wf-fade .15s" }}>
            <strong style={{ color: col }}>Channel {c.ch} ({c.band})</strong>
            {c.nets === 0
              ? " No competing networks detected. Ideal channel — your router owns the airtime."
              : ` ${c.nets} other network${c.nets > 1 ? "s" : ""} share this channel. Each one uses the same radio frequency in the same space, causing collisions that force all devices to back off and retry.`}
          </div>
        );
      })() : (
        <div style={{ fontSize: ".72rem", fontFamily: MONO, color: MUTED }}>Tap a bar to see congestion detail.</div>
      )}
    </div>
  );
}

/* ---- Packet Tab ---- */

function PacketTab() {
  const [step, setStep]       = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  function start() {
    if (running) return;
    setStep(-1);
    setRunning(true);
    let i = 0;
    function next() {
      if (i >= HOPS.length) { setRunning(false); return; }
      setStep(i); i++;
      timerRef.current = setTimeout(next, 620);
    }
    timerRef.current = setTimeout(next, 180);
  }

  function reset() {
    clearTimeout(timerRef.current);
    setStep(-1); setRunning(false);
  }

  return (
    <div style={{ animation: "wf-fade .2s" }}>
      <p style={{ fontSize: ".8rem", color: SUB, lineHeight: "1.65", margin: "0 0 1rem", fontFamily: SANS }}>
        Unlike dial-up, Wi-Fi needs no dedicated line. Each data packet finds its own route through
        shared internet infrastructure. Tap "Send packet" to trace a request from your device to
        a web server.
      </p>

      {/* Hop list */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: ".85rem" }}>
        {HOPS.map((h, i) => {
          const revealed = step >= i;
          const active   = step === i;
          return (
            <div key={h.id} style={{ display: "flex" }}>
              {/* Spine */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "28px", flexShrink: 0 }}>
                <div style={{
                  width: "10px", height: "10px", borderRadius: "50%", marginTop: "10px",
                  background: revealed ? AMBER : BORDER, transition: "background .2s", flexShrink: 0,
                }} />
                {i < HOPS.length - 1 && (
                  <div style={{ width: "2px", flex: 1, minHeight: "16px", background: step > i ? AMBER : BORDER, transition: "background .3s" }} />
                )}
              </div>
              {/* Content */}
              <div style={{ padding: ".55rem .5rem .55rem .4rem", flex: 1, animation: revealed ? "wf-hop .2s ease-out" : "none" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}>
                  <span style={{ fontFamily: SANS, fontSize: ".82rem", fontWeight: "600", color: revealed ? TEXT : BORDER, transition: "color .2s" }}>
                    {h.label}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: ".62rem", color: revealed ? AMBER : BORDER, transition: "color .2s" }}>
                    {h.sub}
                  </span>
                </div>
                {active && (
                  <div style={{ fontSize: ".73rem", fontFamily: SANS, color: SUB, marginTop: ".25rem", lineHeight: "1.55", animation: "wf-fade .2s" }}>
                    {h.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
        <button onClick={start} disabled={running} style={{
          padding: ".4rem .9rem",
          background: running ? BORDER : AMBER,
          color: running ? MUTED : "#fff",
          border: "none", fontFamily: MONO, fontSize: ".72rem", letterSpacing: ".04em",
          cursor: running ? "default" : "pointer", transition: "background .15s",
        }}>
          {running ? "Routing..." : step >= 0 ? "Send again" : "Send packet"}
        </button>
        {step >= 0 && !running && (
          <button onClick={reset} style={{ background: "none", border: "none", color: MUTED, fontFamily: MONO, fontSize: ".68rem", cursor: "pointer", textDecoration: "underline" }}>
            Reset
          </button>
        )}
        {step === HOPS.length - 1 && !running && (
          <span style={{ fontFamily: MONO, fontSize: ".65rem", color: GREEN, marginLeft: "auto" }}>Response received</span>
        )}
      </div>
    </div>
  );
}

/* ---- Root ---- */

const TABS = [
  { id: "signal",  label: "Signal Strength"    },
  { id: "channel", label: "Channel Congestion" },
  { id: "packet",  label: "Packet Path"        },
];

export default function WifiEraInteractive() {
  const [view, setView] = useState("signal");

  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, margin: "1.5rem 0", fontFamily: SANS }}>
      <style>{CSS}</style>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: BG, overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setView(t.id)} style={tabBtn(view === t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: "1.25rem 1rem" }}>
        {view === "signal"  && <SignalTab />}
        {view === "channel" && <ChannelTab />}
        {view === "packet"  && <PacketTab />}
      </div>
    </div>
  );
}
