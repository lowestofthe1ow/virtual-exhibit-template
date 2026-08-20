interface PayoffPanelProps {
  visible: boolean;
}

const POINTS = [
  {
    label: "FreeBSD finishes 4x faster",
    detail:
      "The sendfile(2) syscall ships file data directly from disk to the network socket and the CPU barely wakes up. Linux's equivalent path involves extra kernel copies, burning cycles that show up as that 98% spike.",
  },
  {
    label: "98% CPU vs 4% CPU",
    detail:
      "That 94-point difference means a FreeBSD box serving the same stream can handle ~24x more concurrent users before needing another server or it can run on a fraction of the hardware.",
  },
  {
    label: "Why Netflix chose FreeBSD",
    detail:
      "Netflix's Open Connect CDN nodes (the boxes inside ISPs worldwide) run FreeBSD specifically for this reason. At peak they serve ~800 Gbps of traffic with remarkably low per-bit CPU cost.",
  },
  {
    label: "Power = money & heat",
    detail:
      "A data center full of servers at 90% CPU burns significantly more power and requires heavier cooling. FreeBSD's efficiency translates directly into lower electricity bills and a smaller carbon footprint.",
  },
];

/** Slide-in explanation panel that appears after the simulation finishes. */
export default function PayoffPanel({ visible }: PayoffPanelProps) {
  return (
    <div
      className={`overflow-hidden transition-all duration-700 ease-in-out ${
        visible ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
      }`}
    >
      <div className="rounded-md border border-zinc-700 bg-zinc-900/80 p-6 font-mono">
        <h2 className="mb-5 text-sm tracking-widest text-red-400 uppercase">
          // What just happened
        </h2>
        <ul className="space-y-4">
          {POINTS.map((p) => (
            <li key={p.label} className="grid grid-cols-[auto_1fr] gap-3 text-sm">
              <span className="text-red-500 mt-0.5">▸</span>
              <span>
                <span className="text-white font-semibold">{p.label}. </span>
                <span className="text-zinc-400">{p.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}