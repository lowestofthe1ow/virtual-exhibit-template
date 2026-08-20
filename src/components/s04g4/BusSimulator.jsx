import { useState, useEffect } from "react";
import BusSimulatorDiagram from "./BusSimulatorDiagram.jsx";
import '../../styles/s04g4/BusSimulator.css';

/*
FIXED PRIORITY
Has a 'fixed priority order', cpu goes before dma, dma goes before disk
Runs through the PRIORITY_ORDER array, selects the first one they find (it's of higher priority)
*/
const PRIORITY_ORDER = ["cpu", "dma", "disk"];
function resolveFixedPriority(requestingIds) {
	return PRIORITY_ORDER.find((id) => requestingIds.includes(id)) ?? null;
}

/*
ROUND ROBIN
*/
function resolveRoundRobin(requestingIds, lastGrantedIndex) {
	for (let i = 1; i <= PRIORITY_ORDER.length; i++){
		const candidate = PRIORITY_ORDER[(lastGrantedIndex + i) % PRIORITY_ORDER.length];
		if (requestingIds.includes(candidate)){
			return candidate;
		}
	}
	return null;
}

/*
DAISY CHAIN
Same logic as fixed priority.
daisy chains priority order is determined by physical chain connection, just so happens its the same order as fixed
*/
function resolveDaisyChain(requestingIds) {
  return PRIORITY_ORDER.find((id) => requestingIds.includes(id)) ?? null;
}

export default function BusSimulator() {
	// Whats the current mode being used. defaults to fixed priority
	const [mode, setMode] = useState("fixed");

	// statuses of each device: idle, requesting, granted, denied
	const [devices, setDevices] = useState({
		cpu: "idle",
		dma: "idle",
		disk: "idle",
	});

	// Record the last winner for Round Robin
	const [lastGrantedIndex, setLastGrantedIndex] = useState(-1);

	// log at the bottom that notes all taken actions
	const [log, setLog] = useState([]);

	// increments on each action to restart SVG packet animations
	const [animTick, setAnimTick] = useState(0);

	// Adds messages to log
	function addLog(message) {
		setLog((currLog) => [...currLog, message]);
	}

	// clears log
	function handleClearLog() {
		setLog([]);
	}

	// Sets device state to requesting if request button is pressed
	function handleRequest(id) {
		setDevices((currDevices) => ({ ...currDevices, [id]: "requesting" }));
		setAnimTick((t) => t + 1);
		addLog(`${id.toUpperCase()} requested the bus.`);
	}

	// handles arbitrate button, changes statuses to grant/denied, uses arbbus algos to determine winner
	function handleArbitrate() {
		// gets all requesting devices, determines winner
		const requestingIds = Object.keys(devices).filter((id) => devices[id] === "requesting");

		let winner = null;

		if (mode === "fixed") {
			winner = resolveFixedPriority(requestingIds);
		} else if (mode === "roundrobin") {
			winner = resolveRoundRobin(requestingIds, lastGrantedIndex);
		} else if (mode === "daisychain") {
			winner = resolveDaisyChain(requestingIds);
		}

		if (!winner){
			addLog("Arbitrate pressed, but no devices are requesting.");
			return;
		}

		// Record the last device to be granted
		setLastGrantedIndex(PRIORITY_ORDER.indexOf(winner));

		// if device won, give it granted status, ortherwise denied
		setDevices((currDevices) => {
			const updDevices = { ...currDevices };
			Object.keys(updDevices).forEach((id) => {
				if (id === winner) updDevices[id] = "granted";
				else if (updDevices[id] === "requesting") updDevices[id] = "denied";
			});
			return updDevices;
		});

		setAnimTick((t) => t + 1);
		addLog(`${winner.toUpperCase()} granted the bus.`);
	}

	// implements useEffect, when the devices are granted they have a 2 second timer then go back to idle
	useEffect(() => {
		const grantedId = Object.keys(devices).find((id) => devices[id] === "granted");
		const deniedIds = Object.keys(devices).filter((id) => devices[id] === "denied");

		// no devices with granted or denied status, nothing to do
		if (!grantedId && deniedIds.length === 0) return;

		const timer = setTimeout(() => {
			setDevices((currDevices) => {
				const updDevices = { ...currDevices };
				if (grantedId) updDevices[grantedId] = "idle";
				deniedIds.forEach((id) => {
					updDevices[id] = "idle";
				});
				return updDevices;
			});
			addLog(`${grantedId.toUpperCase()} released the bus.`);
		}, 2000);

		return () => clearTimeout(timer);
	}, [devices]);

	return (
		<div className="simulator">
			<div className="simulator__header">
				<h2>Bus Simulator</h2>
				<div className="simulator__modes">
					<p><strong>Fixed Priority:</strong> one device is always first in line, no matter what.</p>
					<p><strong>Round-Robin:</strong> everyone takes turns, one after another.</p>
					<p><strong>Daisy Chain:</strong> whoever is closest to the front of the wire gets it first.</p>
				</div>
			</div>

			<div className="simulator__workspace">
				<div className="simulator__controls">
					<select
					className="simulator__select"
					value={mode}
					onChange={(e) => setMode(e.target.value)}
					>
						<option value="fixed">Fixed Priority</option>
						<option value="roundrobin">Round Robin</option>
						<option value="daisychain">Daisy Chain</option>
					</select>

					<button className="simulator__arbitrate" onClick={handleArbitrate}>
						Arbitrate
					</button>
				</div>

				<div className="simulator__diagram-area">
					<BusSimulatorDiagram
						devices={devices}
						mode={mode}
						lastGrantedIndex={lastGrantedIndex}
						animTick={animTick}
					/>
				</div>

				<div className="simulator__interactive">
					<div className="simulator__devices">
						<div className="device-card">
							<p className={`status-${devices.cpu}`}>CPU: {devices.cpu}</p>
							<button
							className="simulator__button"
							onClick={() => handleRequest("cpu")}
							disabled={devices.cpu !== "idle"}
							>
								Request Bus
							</button>
						</div>

						<div className="device-card">
							<p className={`status-${devices.dma}`}>DMA: {devices.dma}</p>
							<button
							className="simulator__button"
							onClick={() => handleRequest("dma")}
							disabled={devices.dma !== "idle"}
							>
								Request Bus
							</button>
						</div>

						<div className="device-card">
							<p className={`status-${devices.disk}`}>Disk I/O: {devices.disk}</p>
							<button
							className="simulator__button"
							onClick={() => handleRequest("disk")}
							disabled={devices.disk !== "idle"}
							>
								Request Bus
							</button>
						</div>
					</div>

					<div className="simulator__log-panel">
						<div className="simulator__log-header">
							<h4>Transaction Log</h4>
							<button className="simulator__button" onClick={handleClearLog}>
								Clear Log
							</button>
						</div>
						<div className="simulator__log">
							{log.length === 0 && <p>No activity yet.</p>}
							{log.map((message, i) => (
							<p key={i}>{message}</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
