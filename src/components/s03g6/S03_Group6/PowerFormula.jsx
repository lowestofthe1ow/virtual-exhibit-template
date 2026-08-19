import { useState } from "react";

export default function PowerFormula() {
	const [voltage, setVoltage] = useState(1.2);
	const [frequency, setFrequency] = useState(3.0);
	const [capacitance, setCapacitance] = useState(15);
	const power = (capacitance * voltage ** 2 * frequency).toFixed(2);
	const maxPower = 25 * 1.5 ** 2 * 5.0;
	const powerPercent = (Number(power) / maxPower) * 100;

	return (
		<div style={styles.container}>
			<div style={styles.formulaBox}>
				<span style={{ color:"#a0a5aa"}}>Total Power = </span>
				<span style={{ color:"white"}}>Capacitance × </span>
				<span style={{color:"#ff4d4d",fontWeight:"bold",textShadow:"0 0 8px rgba(255,77,77,.6)"}}>Voltage²</span>
				<span style={{color:"white"}}> × </span>
				<span style={{color:"#3cd66a",textShadow:"0 0 6px rgba(60,214,106,.4)"}}>Frequency</span>
			</div>

			<details style={styles.accordion}>
				<summary style={styles.accordionSummary}>
					What do these variables mean?
				</summary>
				<div style={styles.accordionContent}>
					<div style={styles.accordionRow}>
						<span style={{...styles.accordionLabel, color: "#ffffff"}}>Capacitance (C):</span>
						<span style={styles.accordionDesc}>The CPU's ability to store electrical charge. It is determined by the physical geometry and total number of transistors.</span>
					</div>
					<div style={styles.accordionRow}>
						<span style={{...styles.accordionLabel, color: "#ff4d4d"}}>Voltage (V):</span>
						<span style={styles.accordionDesc}>Power scales quadratically (V²) with voltage, so slight increases result in drastically higher power consumption and heat.</span>
					</div>
					<div style={styles.accordionRow}>
						<span style={{...styles.accordionLabel, color: "#3cd66a"}}>Frequency (f):</span>
						<span style={styles.accordionDesc}>The processor's clock speed. Power scales linearly with frequency, yielding a proportional increase in power draw.</span>
					</div>
				</div>
			</details>

			<div style={styles.controls}>
				<div style={styles.controlGroup}>
					<div style={styles.labelRow}>
						<label style={styles.label}>Capacitance (C): <span style={{color:"#ffffff"}}>{capacitance.toFixed(1)}</span></label>
					</div>
					<Slider min={5} max={25} step={0.1} value={capacitance}
					        onChange={e=>setCapacitance(Number(e.target.value))}
					        display={`${capacitance.toFixed(1)}`} accentColor="#ffffff"/>
				</div>

				<div style={styles.controlGroup}>
					<div style={styles.labelRow}>
						<label style={styles.label}>Voltage (V): <span style={{color:"#ff4d4d"}}>{voltage.toFixed(2)}V</span></label>
					</div>
					<Slider min={0.8} max={1.5} step={0.01} value={voltage}
					        onChange={e=>setVoltage(Number(e.target.value))}
					        display={`${voltage.toFixed(2)}V`} accentColor="#ff4d4d"/>
				</div>

				<div style={styles.controlGroup}>
					<div style={styles.labelRow}>
						<label style={styles.label}>Frequency (f): <span style={{color:"#3cd66a"}}>{frequency.toFixed(2)}GHz</span></label>
					</div>
					<Slider min={1} max={5} step={0.01} value={frequency}
					        onChange={e=>setFrequency(Number(e.target.value))}
					        display={`${frequency.toFixed(2)} GHz`} accentColor="#3cd66a"/>
				</div>
			</div>

			<div style={styles.resultBox}>
				<h4 style={styles.resultLabel}>Resulting Power Output</h4>
				<div style={styles.barRow}>
					<div style={styles.barBackground}>
						<div style={{
							...styles.barFill,
							width: `${powerPercent}%`,
							background: powerPercent > 75 ? "#ff4d4d" : powerPercent > 40 ? "#eab308" : "#3cd66a",
							boxShadow: powerPercent > 75 ? "0 0 20px rgba(255,77,77,.6)" : "none",
						}} />
					</div>
					<span style={styles.barValue}>{power}W</span>
				</div>
			</div>
		</div>
	);
}

function Slider({min, max, step, value, onChange, display, accentColor="#3cafd6"}) {
	const p = Math.max(0, Math.min(100, ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100));

	return (
		<div style={styles.sliderGroup}>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={String(value)}
				onChange={onChange}
				autoComplete="off"
				style={{
					...styles.slider,
					accentColor,
					background: `linear-gradient(90deg, ${accentColor}40 0%, ${accentColor}20 ${p}%, #16191b ${p}%, #16191b 100%)`
				}}
			/>
			<span style={styles.valueTag}>{display}</span>
		</div>
	);
}

const styles={
	container:{
		display:"flex",
		flexDirection:"column",
		gap: 18,
		fontFamily:"Noto Sans Variable,sans-serif",
		fontWeight:600,
		background:"linear-gradient(135deg,#373c43,#22262a)",
		padding: 24,
		borderRadius:16,
		border:"1px solid rgba(255,255,255,.05)",
		boxShadow:"0 15px 30px rgba(0,0,0,.4), inset 0 1px 1px rgba(255,255,255,.1)"
	},
	formulaBox: {
		fontSize: "1.4rem",
		textAlign:"center",
		fontFamily:"monospace",
		padding: "0.75rem",
		background:"#16191b",
		borderRadius:8,
		border:"1px solid var(--borderS)",
		marginBottom: "-6px"
	},
	accordion: {
		background: "rgba(0, 0, 0, 0.2)",
		border: "1px solid rgba(255, 255, 255, 0.05)",
		borderRadius: "8px",
		overflow: "hidden",
	},
	accordionSummary: {
		padding: "10px 16px",
		cursor: "pointer",
		color: "#a0a5aa",
		fontSize: "0.9rem",
		fontWeight: 600,
		userSelect: "none",
	},
	accordionContent: {
		padding: "0 16px 12px 16px",
		display: "flex",
		flexDirection: "column",
		gap: "8px",
	},
	accordionRow: {
		display: "flex",
		gap: "8px",
		alignItems: "baseline",
	},
	accordionLabel: {
		fontWeight: "bold",
		fontSize: "0.85rem",
		whiteSpace: "nowrap",
	},
	accordionDesc: {
		margin: 0,
		color: "var(--textS)",
		fontSize: "0.85rem",
		fontWeight: 400,
		lineHeight: "1.4",
		flex: 1,
		textAlign: "left",
	},
	controls: {
		display:"flex",
		gap:"1.5rem",
		flexWrap:"wrap"
	},
	controlGroup: {
		flex:"1 1 200px",
		display:"flex",
		flexDirection:"column",
		gap: 10
	},
	labelRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
	},
	label: {
		fontWeight:600,
		fontSize:"0.95rem",
		color:"#a0a5aa"
	},
	sliderGroup: {
		display:"flex",
		alignItems:"center",
		gap: 12
	},
	valueTag: {
		minWidth:60,
		textAlign:"center",
		background:"linear-gradient(180deg,#4a5056,#2d3238)",
		border:"1px solid rgba(0,0,0,.4)",
		borderRadius:12,
		padding:"4px 10px",
		color:"#fff",
		fontSize: "0.9rem",
		boxShadow:"inset 0 1px 1px rgba(255,255,255,.15),0 4px 6px rgba(0,0,0,.3)"
	},
	slider: {
		flex:1,
		height:6,
		appearance:"none",
		borderRadius:999,
		cursor:"pointer",
		boxShadow:"inset 0 2px 4px rgba(0,0,0,.6),0 1px 1px rgba(255,255,255,.05)"
	},
	resultBox: {
		marginTop: 8
	},
	resultLabel: {
		margin: "0 0 8px 0",
		color: "var(--textS)",
		textTransform: "uppercase",
		fontSize: "0.85rem",
		letterSpacing: "1px"
	},
	barBackground: {
		width:"100%",
		height: 24,
		background:"#16191b",
		borderRadius:12,
		overflow:"hidden",
		border:"1px solid rgba(255,255,255,.1)"
	},
	barFill: {
		height: "100%",
		display: "flex",
		transition: "all .3s cubic-bezier(.4,0,.2,1)"
	},
	barRow: {
		display: "flex",
		alignItems: "center",
		gap: 12,
	},
	barValue: {
		minWidth: 80,
		textAlign: "center",
		background: "linear-gradient(180deg, #4a5056, #2d3238)",
		border: "1px solid rgba(0, 0, 0, .4)",
		borderRadius: 12,
		padding: "4px 10px",
		color: "#fff",
		boxShadow: "inset 0 1px 1px rgba(255,255,255,.15), 0 4px 6px rgba(0,0,0,.3)",
		fontWeight: "bold",
		fontSize: "0.95rem",
	}
}