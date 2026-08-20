import { useState, useEffect, useRef } from "react";
import TerminalPanel from "./TerminalPanel.tsx";
import CpuGauge from "./CpuGauge.tsx";
import PowerMeter from "./PowerMeter.tsx";
import ProgressBar from "./ProgressBar.tsx";

interface CommandEntry {
  name: string;
  description: string;
}

interface OSPanelProps {
  host: string;
  user: string;
  score: number;
  command: string;
  commands: CommandEntry[];
  // injected by SimDashboard only when sim is active
  simState?: ServerState;
  simPhase?: SimPhase;
}

export default function OSPanel({ host, user, score, command, commands, simState, simPhase }: OSPanelProps) {
  const isSim = simPhase && simPhase !== "idle";
  return (
    <div className="flex flex-col items-stretch gap-4 w-full">
      {isSim && simState && (
        <div className="w-full rounded-md border border-red-600/40 bg-black/80 px-5 py-4 flex items-end justify-between gap-4 shadow-[0_0_25px_-5px_rgba(239,68,68,0.3)]">
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <ProgressBar value={simState.progress} done={simState.done} />
            <p className="font-mono text-xs mt-1">
              {simState.done
                ? <span className="text-green-400">✓ TRANSFER COMPLETE</span>
                : <span className="animate-pulse text-amber-400">▶ STREAMING...</span>
              }
            </p>
          </div>
          <div className="flex items-end gap-3 shrink-0">
            <PowerMeter value={simState.power} />
            <CpuGauge value={simState.cpu} />
          </div>
        </div>
      )}
      <TerminalPanel user={user} host={host} command={command} commands={commands} />
    </div>
  );
}


// placing this here because I don't want to create a lib folder

type SimPhase = "idle" | "running" | "done";

interface ServerState {
  cpu: number;       // 0–100
  power: number;     // 0–100
  progress: number;  // 0–100
  done: boolean;
}

interface SimState {
  phase: SimPhase;
  elapsed: number;   // seconds since start
  linux: ServerState;
  freebsd: ServerState;
}

const LINUX_DURATION = 12;   // seconds to reach 100% progress
const FREEBSD_DURATION = 3;

const TICK_MS = 80;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function linuxCpu(t: number): number {
  // Spikes to 98% within first 0.5s, stays there
  return t < 0.5 ? lerp(0, 98, t / 0.5) : 98;
}

function freebsdCpu(t: number): number {
  // Rises to 4% quickly, stays flat
  return t < 0.3 ? lerp(0, 4, t / 0.3) : 4;
}

function linuxPower(t: number): number {
  return t < 0.6 ? lerp(0, 90, t / 0.6) : 90;
}

function freebsdPower(t: number): number {
  return t < 0.3 ? lerp(0, 15, t / 0.3) : 15;
}

const IDLE: ServerState = { cpu: 0, power: 0, progress: 0, done: false };

export function useSimulation() {
  const [state, setState] = useState<SimState>({
    phase: "idle",
    elapsed: 0,
    linux: { ...IDLE },
    freebsd: { ...IDLE },
  });

  const startRef = useRef<number | null>(null);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    if (state.phase === "running") return;
    startRef.current = performance.now();

    setState({ phase: "running", elapsed: 0, linux: { ...IDLE }, freebsd: { ...IDLE } });

    rafRef.current = setInterval(() => {
      const elapsed = (performance.now() - startRef.current!) / 1000;

      const lt = elapsed / LINUX_DURATION;
      const ft = elapsed / FREEBSD_DURATION;

      const linuxDone = elapsed >= LINUX_DURATION;
      const freebsdDone = elapsed >= FREEBSD_DURATION;

      const linux: ServerState = {
        cpu: linuxDone ? 0 : linuxCpu(elapsed),
        power: linuxDone ? 0 : linuxPower(elapsed),
        progress: Math.min(1, lt) * 100,
        done: linuxDone,
      };

      const freebsd: ServerState = {
        cpu: freebsdDone ? 0 : freebsdCpu(elapsed),
        power: freebsdDone ? 0 : freebsdPower(elapsed),
        progress: Math.min(1, ft) * 100,
        done: freebsdDone,
      };

      const allDone = linuxDone && freebsdDone;

      setState({
        phase: allDone ? "done" : "running",
        elapsed,
        linux,
        freebsd,
      });

      if (allDone && rafRef.current) {
        clearInterval(rafRef.current);
        rafRef.current = null;
      }
    }, TICK_MS);
  }

  function reset() {
    if (rafRef.current) clearInterval(rafRef.current);
    startRef.current = null;
    setState({ phase: "idle", elapsed: 0, linux: { ...IDLE }, freebsd: { ...IDLE } });
  }

  useEffect(() => () => { if (rafRef.current) clearInterval(rafRef.current); }, []);

  return { state, start, reset };
}
