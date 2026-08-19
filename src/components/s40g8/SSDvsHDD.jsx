/**
 * SSDvsHDD.jsx
 *
 * An interactive side-by-side visualization of why an SSD reads scattered data
 * faster than a mechanical HDD. The viewer presses "Run" and watches both drives
 * fetch the same set of randomly scattered data blocks: the HDD must move its head
 * and wait for the platter to spin to each block (slow, one at a time), while the
 * SSD accesses every block electronically with almost no delay.
 *
 * ## Learning Notes
 * This component demonstrates several key React concepts:
 * - State with useState: `running`, plus how many blocks each drive has fetched
 *   (`ssdDone`, `hddDone`) and the elapsed times.
 *
 * - Side effects with useEffect + timers: setInterval drives the animation; the
 *   cleanup function clears the timers so they don't leak when the component
 *   unmounts or the run restarts.
 *
 * - Derived UI: the progress bars and "winner" banner are computed from state on
 *   every render — no extra state needed.
 *
 * The timings here are illustrative (scaled so the animation is watchable), but the
 * ratio reflects reality: random-access latency on an HDD is measured in
 * milliseconds, while an SSD's is measured in microseconds.
 *
 * ## Props
 *   None.
 *
 * ## Usage Example
 *   <SSDvsHDD />
 */

import { useState, useEffect, useRef } from "react";
import "../../styles/s40g8/component-tokens.css";

const TOTAL_BLOCKS = 8;

// Illustrative per-block access time in milliseconds of animation time.
// The HDD pays a big, variable "seek + rotate" cost for each scattered block;
// the SSD pays a tiny, near-constant electronic access cost.
const HDD_MS_PER_BLOCK = 420;
const SSD_MS_PER_BLOCK = 45;

const styles = {
  root: {
    fontFamily: "var(--font-sans)",
    maxWidth: 760,
    margin: "0 auto",
    padding: "1rem 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginBottom: "1.25rem",
  },
  card: (accent) => ({
    border: `0.5px solid var(--color-border-secondary)`,
    borderTop: `3px solid ${accent}`,
    borderRadius: "var(--border-radius-md)",
    padding: "14px 16px",
    background: "var(--color-background-primary)",
  }),
  title: { fontSize: 16, fontWeight: 600, margin: "0 0 2px" },
  sub: {
    fontSize: 12,
    color: "var(--color-text-secondary)",
    margin: "0 0 14px",
  },
  track: {
    display: "grid",
    gridTemplateColumns: `repeat(${TOTAL_BLOCKS}, 1fr)`,
    gap: 4,
    marginBottom: 12,
  },
  block: (filled, accent) => ({
    height: 22,
    borderRadius: 3,
    background: filled ? accent : "var(--color-border-tertiary)",
    transition: "background 0.15s",
  }),
  stat: { fontSize: 13, color: "var(--color-text-secondary)" },
  time: (accent) => ({
    fontSize: 26,
    fontWeight: 600,
    color: accent,
    fontVariantNumeric: "tabular-nums",
  }),
  btn: (enabled) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: 14,
    padding: "8px 18px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-secondary)",
    background: "transparent",
    color: "var(--color-text-primary)",
    opacity: enabled ? 1 : 0.4,
    fontFamily: "var(--font-sans)",
  }),
  banner: {
    marginTop: "1rem",
    padding: "12px 14px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderLeft: "3px solid var(--color-border-info)",
    background: "var(--color-background-secondary)",
    fontSize: 14,
    lineHeight: 1.6,
    color: "var(--color-text-primary)",
  },
};

const SSD_ACCENT = "#1971c2";
const HDD_ACCENT = "#e8590c";

export default function SSDvsHDD() {
  const [running, setRunning] = useState(false);
  const [ssdDone, setSsdDone] = useState(0);
  const [hddDone, setHddDone] = useState(0);
  const [ssdTime, setSsdTime] = useState(0);
  const [hddTime, setHddTime] = useState(0);

  // useRef holds the interval ids without triggering re-renders when they change.
  const timers = useRef([]);

  // Clear any running timers. Called on restart and on unmount (via useEffect cleanup).
  function clearTimers() {
    timers.current.forEach((t) => clearInterval(t));
    timers.current = [];
  }

  useEffect(() => clearTimers, []); // cleanup when the component unmounts

  function run() {
    clearTimers();
    setRunning(true);
    setSsdDone(0);
    setHddDone(0);
    setSsdTime(0);
    setHddTime(0);

    // Each drive advances on its own interval, at its own pace. When a drive
    // finishes all its blocks, its interval clears itself.
    const ssdTimer = setInterval(() => {
      setSsdDone((n) => {
        if (n + 1 >= TOTAL_BLOCKS) clearInterval(ssdTimer);
        return Math.min(n + 1, TOTAL_BLOCKS);
      });
      setSsdTime((t) => t + SSD_MS_PER_BLOCK);
    }, SSD_MS_PER_BLOCK);

    const hddTimer = setInterval(() => {
      setHddDone((n) => {
        if (n + 1 >= TOTAL_BLOCKS) {
          clearInterval(hddTimer);
          setRunning(false); // HDD is always the slower one; run ends when it's done
        }
        return Math.min(n + 1, TOTAL_BLOCKS);
      });
      setHddTime((t) => t + HDD_MS_PER_BLOCK);
    }, HDD_MS_PER_BLOCK);

    timers.current = [ssdTimer, hddTimer];
  }

  const finished = !running && (ssdDone === TOTAL_BLOCKS || hddDone === TOTAL_BLOCKS);

  return (
    <div style={styles.root}>
      <div style={styles.grid}>
        {/* SSD card */}
        <div style={styles.card(SSD_ACCENT)}>
          <p style={styles.title}>SSD</p>
          <p style={styles.sub}>Electronic access — no moving parts</p>
          <div style={styles.track}>
            {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
              <div key={i} style={styles.block(i < ssdDone, SSD_ACCENT)} />
            ))}
          </div>
          <div style={styles.stat}>
            {ssdDone} / {TOTAL_BLOCKS} blocks read
          </div>
          <div style={styles.time(SSD_ACCENT)}>{ssdTime} “ms”</div>
        </div>

        {/* HDD card */}
        <div style={styles.card(HDD_ACCENT)}>
          <p style={styles.title}>HDD</p>
          <p style={styles.sub}>Head must seek + platter must spin</p>
          <div style={styles.track}>
            {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
              <div key={i} style={styles.block(i < hddDone, HDD_ACCENT)} />
            ))}
          </div>
          <div style={styles.stat}>
            {hddDone} / {TOTAL_BLOCKS} blocks read
          </div>
          <div style={styles.time(HDD_ACCENT)}>{hddTime} “ms”</div>
        </div>
      </div>

      <button style={styles.btn(!running)} disabled={running} onClick={run}>
        {finished ? "↺ Run again" : running ? "Running…" : "▶ Run the race"}
      </button>

      {finished && (
        <div style={styles.banner}>
          The SSD finished reading all {TOTAL_BLOCKS} scattered blocks about{" "}
          <strong>
            {(HDD_MS_PER_BLOCK / SSD_MS_PER_BLOCK).toFixed(0)}× faster
          </strong>
          . Because an HDD must physically move its read/write head and wait for
          the platter to rotate to each block, random reads are slow. An SSD
          reaches any block electronically, so scattered data is nearly as fast
          as sequential data.
        </div>
      )}
    </div>
  );
}
