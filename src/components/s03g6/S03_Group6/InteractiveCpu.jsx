import CpuContainer from './CpuContainer.jsx';
import CpuStatus from './CpuStatus.jsx';
import ControlPanel from './ControlPanel.jsx';
import { useState } from "react";

const INFO_DICT = {
    "default": {
        title: "Waiting for selection...",
        text: "Click on any dashed-underlined term (e.g., Active Cores, Clock Speed, Efficiency) to show more information about how it affects the processor."
    },
    "Active Cores": {
        title: "Active Cores",
        text: "Determines how many of the 8 processor cores are working. Using more cores splits the workload to process it faster (lowering Execution Time), but increases overall power consumption and heat output."
    },
    "Clock Speed": {
        title: "Clock Speed (GHz)",
        text: "Controls how fast each core runs. Higher speeds reduce Execution Time but exponentially increase power consumption, risking overheating."
    },
    "TDP": {
        title: "Cooling Solution (TDP)",
        text: "Thermal Design Power (TDP) represents the maximum heat (in watts) the system can dissipate. If the CPU generates more heat than this limit, it will throttle to save itself."
    },
    "Actual Power": {
        title: "Actual Power",
        text: "The current power consumption of the CPU based on active cores and clock speed. If this exceeds your Cooling Solution, thermal throttling occurs."
    },
    "Efficiency": {
        title: "Efficiency",
        text: "A measure of how well the CPU is operating. It remains at 100% unless the CPU overheats. Throttling heavily penalizes efficiency, wasting energy."
    },
    "Effective Clock": {
        title: "Effective Clock",
        text: "The actual frequency your CPU is running at. If thermal throttling triggers, this will automatically drop significantly below your target Clock Speed."
    },
    "Execution Time": {
        title: "Execution Time",
        text: "The estimated time required to process the workload. Your goal is to minimize this without causing thermal throttling (which forces the CPU to slow down and drastically increases this time)."
    },
    "Energy Score": {
        title: "Total Energy Score (J)",
        text: "Calculated as Actual Power × Execution Time. This represents the total energy consumed. A truly optimal configuration balances a low Energy Score with a fast Execution Time!"
    }
};

export default function InteractiveCpu() {
    const [cores, setCores] = useState(5);
    const [clock, setClock] = useState(3.0);
    const [tdp, setTdp] = useState(100);
    const [selectedTerm, setSelectedTerm] = useState("default");

    const WORKLOAD = 5000;
    const basePower = cores * clock**2 * 1.5 + cores * 5;
    const throttle = basePower > tdp;
    const effectiveClock = throttle ? clock * Math.sqrt(tdp / basePower) : clock;
    const actualPower = throttle ? tdp : basePower;
    const efficiency = throttle ? tdp / basePower : 1.0;
    const execTime = WORKLOAD / (cores * effectiveClock * efficiency);
    const energyScore = actualPower * execTime;

    const handlePanelChange = ({ cores, clock, tdp }) => {
        setCores(cores);
        setClock(clock);
        setTdp(tdp);
    };

    const activeInfo = INFO_DICT[selectedTerm] || INFO_DICT["default"];

    return (
        <div style={styles.container}>
            <div style={styles.topBoxesContainer}>
                <div style={styles.goalBox}>
                    <div style={styles.goalTitle}>YOUR GOAL</div>
                    <p style={styles.goalText}>Process the 5000-unit workload as quickly as possible (lowest Execution Time) while using the least amount of energy (lowest Energy Score). Avoid thermal throttling by balancing your Clock Speed and Active Cores with your Cooling Solution.</p>
                </div>
                <div style={styles.hintBox}>
                    <div style={styles.hintTitle}>PRO TIP</div>
                    <p style={styles.hintText}>The fastest configuration isn't always the most efficient. If you see red cores, you've hit the thermal limit and are wasting power. Try dropping your clock speed slightly to see efficiency gains!</p>
                </div>
            </div>

            <CpuContainer
                activeCount={cores}
                throttle={throttle}
            />

            <CpuStatus
                throttle={throttle}
                executionTime={execTime}
                power={actualPower}
                efficiency={Math.round(efficiency * 100)}
                effectiveClock={Math.round(effectiveClock * 100) / 100}
                energyScore={Math.round(energyScore)}
                onClick={setSelectedTerm}
                selectedTerm={selectedTerm}
            />

            <div style={{
                ...styles.infoConsole,
                borderColor: selectedTerm !== "default" ? "var(--accentS)" : "var(--borderS)",
                boxShadow: selectedTerm !== "default" ? "0 0 15px rgba(0, 180, 216, 0.2), inset 0 4px 10px rgba(0,0,0,0.5)" : "inset 0 4px 10px rgba(0,0,0,0.5)"
            }}>
                <div style={styles.consoleHeader}>
                    <span style={{ color: "var(--accentS)" }}>&gt; </span>
                    {activeInfo.title}
                </div>
                <div style={styles.consoleBody}>
                    {activeInfo.text}
                </div>
            </div>

            <ControlPanel
                defaultCores={cores}
                defaultClock={clock}
                defaultTdp={tdp}
                onChange={handlePanelChange}
                onClick={setSelectedTerm}
                selectedTerm={selectedTerm}
            />
        </div>
    );
}

const styles = {
    container: {
        minWidth: "700px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
    },
    topBoxesContainer: {
        display: "flex",
        gap: "16px",
        width: "100%",
    },
    goalBox: {
        flex: 1,
        background: "rgba(0, 180, 216, 0.05)",
        border: "1px dashed var(--accentS)",
        borderRadius: "12px",
        padding: "16px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    goalTitle: {
        color: "var(--accentS)",
        margin: "0 0 12px 0",
        paddingBottom: "8px",
        borderBottom: "1px dashed var(--accentS)",
        fontSize: "1rem",
        fontFamily: "monospace",
        fontWeight: "bold",
        letterSpacing: "1px",
    },
    goalText: {
        margin: 0,
        color: "var(--textS)",
        fontSize: "0.95rem",
        lineHeight: "1.4",
    },
    hintBox: {
        flex: 1,
        background: "rgba(255, 191, 0, 0.05)",
        border: "1px dashed rgba(255, 191, 0, 0.4)",
        borderRadius: "12px",
        padding: "16px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    hintTitle: {
        color: "#ffbf00",
        margin: "0 0 12px 0",
        paddingBottom: "8px",
        borderBottom: "1px dashed rgba(255, 191, 0, 0.4)",
        fontSize: "1rem",
        fontFamily: "monospace",
        fontWeight: "bold",
        letterSpacing: "1px",
    },
    hintText: {
        margin: 0,
        color: "var(--textS)",
        fontSize: "0.95rem",
        lineHeight: "1.4",
        fontStyle: "italic",
    },
    infoConsole: {
        background: "#0a0c10",
        border: "1px solid var(--borderS)",
        borderRadius: "12px",
        padding: "16px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        minHeight: "55px",
        transition: "all 0.3s ease-in-out",
    },
    consoleHeader: {
        fontFamily: "monospace",
        fontWeight: "800",
        color: "#ffffff",
        fontSize: "0.95rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
    consoleBody: {
        fontFamily: "monospace",
        color: "var(--mutedS)",
        fontSize: "0.9rem",
        lineHeight: "1.5",
        margin: 0,
    }
};