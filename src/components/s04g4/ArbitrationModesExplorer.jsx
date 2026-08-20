import { useState } from "react";
import FixedPriorityAnimation from "./FixedPriorityAnimation.jsx";
import RoundRobinAnimation from "./RoundRobinAnimation.jsx";
import DaisyChainAnimation from "./DaisyChainAnimation.jsx";
import "../../styles/s04g4/ArbitrationModesAnimation.css";

const MODES = {
	fixed: {
		label: "Fixed Priority",
		Animation: FixedPriorityAnimation,
		body: (
			<>
				<p>
					The arbiter holds a simple priority encoder. When multiple BR signals are
					asserted simultaneously, the encoder selects the highest-priority line and
					asserts BG only for that device. Lower-priority devices receive no grant and
					must wait.
				</p>
				<p>
					<strong>Pros:</strong> deterministic and simple hardware; critical devices get
					immediate access. <strong>Cons:</strong> low-priority devices may starve (Stallings,
					2016).
				</p>
			</>
		),
	},
	roundrobin: {
		label: "Round-Robin",
		Animation: RoundRobinAnimation,
		body: (
			<>
				<p>
					The arbiter maintains a rotating pointer. After granting the bus to device N,
					the pointer advances to N+1, making N+1 highest priority for the next cycle.
					This guarantees each requester eventually gets access (Tanenbaum &amp; Austin, 2012).
				</p>
				<p>
					<strong>Pros:</strong> no starvation, fair and predictable access.
					<strong> Cons:</strong> more complex hardware and urgent devices may wait longer.
				</p>
			</>
		),
	},
	daisychain: {
		label: "Daisy Chain",
		Animation: DaisyChainAnimation,
		body: (
			<>
				<p>
					A single bus grant wire threads through all devices in sequence. The first
					requesting device in the chain captures the grant. If it has no request, it
					passes the grant downstream.
				</p>
				<p>
					<strong>Pros:</strong> very few wires and low hardware cost.
					<strong> Cons:</strong> priority depends on physical position, propagation delay
					grows with chain length, and a broken device can break the chain (Null &amp; Lobur,
					2014).
				</p>
			</>
		),
	},
};

export default function ArbitrationModesExplorer() {
	const [mode, setMode] = useState("fixed");
	const current = MODES[mode];
	const Animation = current.Animation;

	return (
		<div className="arb-explorer">
			<div className="arb-explorer__controls">
				<label className="arb-explorer__label" htmlFor="arb-mode-select">
					Arbitration mode
				</label>
				<select
					id="arb-mode-select"
					className="arb-explorer__select"
					value={mode}
					onChange={(e) => setMode(e.target.value)}
				>
					<option value="fixed">Fixed Priority</option>
					<option value="roundrobin">Round-Robin</option>
					<option value="daisychain">Daisy Chain</option>
				</select>
			</div>

			<div className="card arb-explorer__panel">
				<div className="arb-explorer__text">
					<h3>{current.label}</h3>
					{current.body}
				</div>
				<div className="arb-explorer__diagram">
					<Animation />
				</div>
			</div>
		</div>
	);
}
