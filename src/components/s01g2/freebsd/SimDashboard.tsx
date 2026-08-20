import { useState, useEffect, useRef } from "react";
import OSPanel from "./OSPanel.tsx";
import CommandInput from "./CommandInput.tsx";
import PayoffPanel from "./PayoffPanel.tsx";

const HELP_COMMANDS = [
  { name: "ls",   description: "list directory contents" },
  { name: "echo", description: "print text to the terminal" },
  { name: "cat",  description: "print file contents" },
];
 
const OS_CONFIGS = [
  { host: "freebsd", user: "user67", score: 38, simKey: "freebsd" as const },
  { host: "ubuntu",  user: "user67", score: 72, simKey: "linux"   as const },
];
 
const SIM_COMMAND = "network-stream --file=movie_4k.mp4 --target=global-cdn";
 
export default function SimDashboard() {
  const [command, setCommand] = useState("help");
  const [inject, setInject]   = useState<string | undefined>(undefined);
  const { state: sim, start, reset } = useSimulation();
 
  function handleSubmit(value: string) {
    setCommand(value);
    setInject(undefined); // clear inject after submission so future typing is free
    if (value.trim() === SIM_COMMAND) {
      reset();
      setTimeout(start, 50);
    }
  }
 
  function handleHintClick() {
    setInject(SIM_COMMAND); // pastes into the input field
  }
 
  useEffect(() => {
    if (command.trim() !== SIM_COMMAND && sim.phase !== "idle") reset();
  }, [command]);
 
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-12">
      <div className="relative flex w-full flex-col items-center gap-10">
 
        {sim.phase === "idle" && (
          <p className="rounded-full border border-red-500/25 bg-black/75 px-4 py-2 text-center font-mono text-xs text-zinc-200 shadow-[0_0_18px_rgba(0,0,0,0.45)] backdrop-blur-sm">
            Try:{" "}
            <button
              onClick={handleHintClick}
              className="font-semibold text-red-300 underline underline-offset-2 decoration-red-400/70 transition-colors hover:text-red-200 hover:decoration-red-200"
            >
              {SIM_COMMAND}
            </button>
          </p>
        )}
 
        <CommandInput defaultValue={command} onSubmit={handleSubmit} inject={inject} />
 
        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2">
          {OS_CONFIGS.map((os) => (
            <OSPanel
              key={os.host}
              host={os.host}
              user={os.user}
              score={os.score}
              command={command}
              commands={HELP_COMMANDS}
              simState={sim[os.simKey]}
              simPhase={sim.phase}
            />
          ))}
        </div>
 
        <div className="w-full">
          <PayoffPanel visible={sim.phase === "done"} />
        </div>
 
      </div>
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
