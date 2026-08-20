import "../../styles/s04g4/BusSimulator.css";

const PRIORITY_ORDER = ["cpu", "dma", "disk"];

const DEVICES = {
	cpu: {
		label: "CPU",
		sublabel: "Priority 1 (Highest)",
		slot: "Slot 0",
		chainPos: "1st in chain",
		color: "#7fa8ff",
		subColor: "#a9c6ff",
		brY: 30,
		bgY: 50,
		boxY: 15,
		chainX: 185,
		pointerY: 118,
	},
	dma: {
		label: "DMA Controller",
		sublabel: "Priority 2",
		slot: "Slot 1",
		chainPos: "2nd in chain",
		color: "#8fd6a0",
		subColor: "#a9e6b8",
		brY: 120,
		bgY: 132,
		boxY: 95,
		chainX: 305,
		pointerY: 144,
	},
	disk: {
		label: "Disk Controller",
		sublabel: "Priority 3 (Lowest)",
		slot: "Slot 2",
		chainPos: "3rd in chain",
		color: "#e0b86b",
		subColor: "#e6cfa1",
		brY: 200,
		bgY: 212,
		boxY: 175,
		chainX: 425,
		pointerY: 170,
	},
};

function brLabel(status) {
	if (status === "requesting") return "BR — requesting";
	if (status === "granted") return "BR — active";
	if (status === "denied") return "BR — denied";
	return "BR";
}

function deviceClass(status) {
	if (status === "granted") return "sim-device sim-device--granted";
	if (status === "requesting") return "sim-device sim-device--requesting";
	if (status === "denied") return "sim-device sim-device--denied";
	return "sim-device";
}

function VerticalDiagram({ devices, mode, lastGrantedIndex, animTick }) {
	const nextDevice = PRIORITY_ORDER[(lastGrantedIndex + 1) % PRIORITY_ORDER.length];
	const arbiterTitle =
		mode === "roundrobin"
			? ["Round-Robin", "Arbiter"]
			: mode === "daisychain"
				? ["Daisy Chain", "Arbiter"]
				: ["Priority", "Encoder"];

	return (
		<svg className="sim-diagram signal-diagram-svg" viewBox="0 0 500 240" width="100%">
			<defs>
				{PRIORITY_ORDER.map((id) => (
					<marker
						key={id}
						id={`sim-arrow-br-${id}`}
						viewBox="0 0 10 10"
						refX="8"
						refY="5"
						markerWidth="6"
						markerHeight="6"
						orient="auto"
					>
						<path d="M1 1L9 5L1 9" fill="none" stroke={DEVICES[id].color} strokeWidth="1.5" />
					</marker>
				))}
				<marker id="sim-arrow-bg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
					<path d="M9 1L1 5L9 9" fill="none" stroke="#66ff99" strokeWidth="1.5" />
				</marker>
			</defs>

			<rect x="340" y="15" width="150" height="210" rx="8" fill="#243447" stroke="cyan" strokeWidth="1.5" className="sim-arbiter-box" />
			<text x="415" y={mode === "roundrobin" ? 42 : 110} textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">
				{arbiterTitle[0]}
			</text>
			<text x="415" y={mode === "roundrobin" ? 58 : 126} textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">
				{arbiterTitle[1]}
			</text>
			{mode === "fixed" && (
				<>
					<text x="415" y="148" textAnchor="middle" fontSize="9" fill="#94a2c8">
						Grants highest
					</text>
					<text x="415" y="160" textAnchor="middle" fontSize="9" fill="#94a2c8">
						priority request
					</text>
				</>
			)}
			{mode === "roundrobin" && (
				<>
					<text x="415" y="92" textAnchor="middle" fontSize="9" fill="#94a2c8">
						Next to serve:
					</text>
					{PRIORITY_ORDER.map((id) => (
						<text
							key={id}
							x="415"
							y={DEVICES[id].pointerY}
							textAnchor="middle"
							fontSize="10"
							fontWeight="600"
							fill={DEVICES[id].subColor}
							opacity={id === nextDevice ? 1 : 0.45}
						>
							{DEVICES[id].label.replace(" Controller", "")}
						</text>
					))}
					<path
						d={`M383 ${DEVICES[nextDevice].pointerY - 9} L391 ${DEVICES[nextDevice].pointerY - 4} L383 ${DEVICES[nextDevice].pointerY + 1} Z`}
						fill="#39ffb6"
						className="sim-rr-pointer"
					/>
				</>
			)}

			{PRIORITY_ORDER.map((id) => {
				const info = DEVICES[id];
				const status = devices[id];
				const isRequesting = status === "requesting";
				const isGranted = status === "granted";
				const isDenied = status === "denied";
				const showBr = status !== "idle";
				const showBg = isGranted;

				return (
					<g key={id} className={deviceClass(status)}>
						<rect x="10" y={info.boxY} width="150" height="50" rx="8" fill="#1e3a5f" stroke={info.color} strokeWidth="1.5" />
						<text x="85" y={info.boxY + 23} textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">
							{info.label}
						</text>
						<text x="85" y={info.boxY + 38} textAnchor="middle" fontSize="9" fill={info.subColor}>
							{mode === "roundrobin" ? info.slot : info.sublabel}
						</text>

						{showBr && (
							<line
								x1="160"
								y1={info.brY}
								x2="336"
								y2={info.brY}
								stroke={isDenied ? "#ff5c78" : info.color}
								strokeWidth={isRequesting ? 2.5 : 1.5}
								markerEnd={`url(#sim-arrow-br-${id})`}
								className={isRequesting ? "sim-br-line sim-br-line--pulse" : undefined}
							/>
						)}
						{showBr && (
							<text
								x="248"
								y={info.brY - 6}
								textAnchor="middle"
								fontSize="9"
								fill={isDenied ? "#ff8fa3" : info.subColor}
								fontWeight="600"
							>
								{brLabel(status)}
							</text>
						)}

						{showBg && (
							<>
								<line
									x1="336"
									y1={info.bgY}
									x2="160"
									y2={info.bgY}
									stroke="#66ff99"
									strokeWidth="2"
									markerEnd="url(#sim-arrow-bg)"
									className="sim-bg-line"
								/>
								<text x="248" y={info.bgY - 4} textAnchor="middle" fontSize="9" fill="#a9e6b8" fontWeight="600">
									BG — GRANTED
								</text>
							</>
						)}

						{isGranted && (
							<rect
								x="10"
								y={info.boxY}
								width="150"
								height="50"
								rx="8"
								fill="none"
								stroke={info.color}
								className="sim-winner-ring"
							/>
						)}

						{isRequesting && (
							<circle
								key={`req-${id}-${animTick}`}
								r="5"
								fill={info.color}
								className="sim-packet sim-packet--request"
								style={{ opacity: 0 }}
							>
								<animateMotion dur="0.7s" fill="freeze" path={`M160 ${info.brY} L336 ${info.brY}`} />
								<animate attributeName="opacity" dur="0.7s" values="0;1;1;0" keyTimes="0;0.05;0.85;1" fill="freeze" />
							</circle>
						)}

						{isGranted && (
							<circle
								key={`grant-${id}-${animTick}`}
								r="6"
								fill="#39ffb6"
								className="sim-packet sim-packet--grant"
								style={{ opacity: 0, filter: "drop-shadow(0 0 6px #39ffb6)" }}
							>
								<animateMotion dur="0.7s" fill="freeze" path={`M336 ${info.bgY} L160 ${info.bgY}`} />
								<animate attributeName="opacity" dur="0.7s" values="0;1;1;0" keyTimes="0;0.05;0.85;1" fill="freeze" />
							</circle>
						)}
					</g>
				);
			})}
		</svg>
	);
}

function DaisyChainDiagram({ devices, animTick }) {
	const chainIds = ["cpu", "dma", "disk"];
	const grantedId = chainIds.find((id) => devices[id] === "granted");
	const requestingIds = chainIds.filter((id) => devices[id] === "requesting");

	const chainPositions = { cpu: 0.2297, dma: 0.5541, disk: 0.8784 };
	const grantTarget = grantedId ? chainPositions[grantedId] : null;

	return (
		<svg className="sim-diagram signal-diagram-svg" viewBox="0 0 500 150" width="100%">
			<defs>
				<marker id="sim-arrow-chain" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
					<path d="M1 1L9 5L1 9" fill="none" stroke="#94a2c8" strokeWidth="1.5" />
				</marker>
			</defs>

			<rect x="10" y="45" width="90" height="50" rx="8" fill="#243447" stroke="cyan" strokeWidth="1.5" className="sim-arbiter-box" />
			<text x="55" y="66" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ffffff">
				Arbiter
			</text>
			<text x="55" y="80" textAnchor="middle" fontSize="8" fill="#94a2c8">
				Grant OUT
			</text>

			<line x1="100" y1="70" x2="470" y2="70" stroke="#94a2c8" strokeWidth="1.5" markerEnd="url(#sim-arrow-chain)" />

			{chainIds.map((id, i) => {
				const info = DEVICES[id];
				const status = devices[id];
				const boxX = 140 + i * 120;
				const isGranted = status === "granted";
				const isRequesting = status === "requesting";
				const isDenied = status === "denied";

				return (
					<g key={id} className={deviceClass(status)}>
						<rect x={boxX} y="45" width="90" height="50" rx="8" fill="#1e3a5f" stroke={info.color} strokeWidth="1.5" />
						<text x={boxX + 45} y="64" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff">
							{info.label.replace(" Controller", "")}
						</text>
						<text x={boxX + 45} y="78" textAnchor="middle" fontSize="8" fill={info.subColor}>
							{info.chainPos}
						</text>

						{isRequesting && (
							<text x={boxX + 45} y="102" textAnchor="middle" fontSize="8" fill="#ffcf5c" fontWeight="600">
								Requesting
							</text>
						)}
						{isGranted && (
							<text x={boxX + 45} y="102" textAnchor="middle" fontSize="8" fill="#39ffb6" fontWeight="600">
								GRANTED
							</text>
						)}
						{isDenied && (
							<text x={boxX + 45} y="102" textAnchor="middle" fontSize="8" fill="#ff5c78" fontWeight="600">
								Denied
							</text>
						)}

						{isGranted && (
							<rect x={boxX} y="45" width="90" height="50" rx="8" fill="none" stroke={info.color} className="sim-winner-ring" />
						)}
					</g>
				);
			})}

			{requestingIds.map((id) => (
				<circle
					key={`chain-req-${id}-${animTick}`}
					r="5"
					fill={DEVICES[id].color}
					className="sim-packet sim-packet--request"
					style={{ opacity: 0 }}
				>
					<animateMotion dur="0.6s" fill="freeze" path={`M${DEVICES[id].chainX} 95 L${DEVICES[id].chainX} 70`} />
					<animate attributeName="opacity" dur="0.6s" values="0;1;1;0" keyTimes="0;0.1;0.9;1" fill="freeze" />
				</circle>
			))}

			{grantTarget !== null && (
				<circle
					key={`chain-grant-${grantedId}-${animTick}`}
					r="7"
					fill="#39ffb6"
					style={{ opacity: 0, filter: "drop-shadow(0 0 8px #39ffb6)" }}
				>
					<animateMotion
						dur="1.2s"
						fill="freeze"
						calcMode="linear"
						keyTimes={`0;0.15;${grantTarget};1`}
						keyPoints={`0;0;${grantTarget};${grantTarget}`}
						path="M100 70 L470 70"
					/>
					<animate attributeName="opacity" dur="1.2s" values="0;0;1;1;0" keyTimes="0;0.05;0.1;0.9;1" fill="freeze" />
				</circle>
			)}
		</svg>
	);
}

export default function BusSimulatorDiagram({ devices, mode, lastGrantedIndex, animTick }) {
	return (
		<div className="sim-diagram-wrap">
			{mode === "daisychain" ? (
				<DaisyChainDiagram devices={devices} animTick={animTick} />
			) : (
				<VerticalDiagram devices={devices} mode={mode} lastGrantedIndex={lastGrantedIndex} animTick={animTick} />
			)}
		</div>
	);
}
