export default function CpuStatus({throttle=false, executionTime=0, power=0, efficiency=0, effectiveClock=0, energyScore=0, onClick, selectedTerm}) {
    const safeMsg = "Running efficiently within thermal limits.";
    const badMsg = "CPU is overheating! Clock speeds reduced to stay within thermal limits.";
    const status = throttle ? badMsg : safeMsg;

    const messageStyle = {
        ...styles.message,
        ...(throttle ? styles.messageThrottled : styles.messageSafe)
    };

    const handleToggle = (term) => {
        onClick(selectedTerm === term ? "default" : term);
    };

    return (
        <div style={styles.container}>
            <style>{keyframes}</style>

            <div style={styles.metricsGrid}>
                <MetricBox label="Effective Clock" value={`${effectiveClock} GHz`} isActive={selectedTerm === "Effective Clock"} onClick={() => handleToggle("Effective Clock")} />
                <MetricBox label="Efficiency" value={`${efficiency}%`} isActive={selectedTerm === "Efficiency"} onClick={() => handleToggle("Efficiency")} />
                <MetricBox label="Execution Time" value={`${executionTime.toFixed(1)} s`} isActive={selectedTerm === "Execution Time"} onClick={() => handleToggle("Execution Time")} />
                <MetricBox label="Actual Power" value={`${power.toFixed(1)} W`} isActive={selectedTerm === "Actual Power"} onClick={() => handleToggle("Actual Power")} />
                <MetricBox label="Energy Score" value={`${energyScore} J`} isActive={selectedTerm === "Energy Score"} onClick={() => handleToggle("Energy Score")} />
            </div>

            <div style={messageStyle} className={throttle ? "status-text-blink" : undefined}>
                {status}
            </div>
        </div>
    );
}

function MetricBox({ label, value, onClick, isActive }) {
    return (
        <div
            style={{
                ...styles.metricBox,
                borderColor: isActive ? "var(--accentS)" : "rgba(255, 255, 255, 0.05)",
                boxShadow: isActive ? "0 0 10px rgba(0, 180, 216, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)" : "inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 6px rgba(0,0,0,0.3)"
            }}
            onClick={onClick}
            title="Click for info"
        >
            <div style={{
                ...styles.metricLabel,
                color: isActive ? "var(--accentS)" : "#a0a5aa",
                borderBottom: isActive ? "1px solid var(--accentS)" : "1px dashed #a0a5aa",
            }}>
                {label}
            </div>
            <div style={styles.metricValue}>{value}</div>
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "10px",
        width: "100%",
    },
    metricBox: {
        background: "linear-gradient(135deg, #373c43 0%, #22262a 100%)",
        borderRadius: "12px",
        padding: "12px 4px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        userSelect: "none",
    },
    metricLabel: {
        display: "inline-block",
        fontSize: "0.70rem",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "6px",
        paddingBottom: "2px",
        fontWeight: "700",
        transition: "color 0.2s ease",
    },
    metricValue: {
        fontSize: "1.1rem",
        color: "#ffffff",
        fontWeight: "800",
        fontFamily: "monospace",
    },
    message: {
        width: "100%",
        padding: "12px 24px",
        borderRadius: "12px",
        textAlign: "center",
        fontFamily: "monospace",
        fontSize: "0.95rem",
        border: "1px solid rgba(0, 0, 0, 0.4)",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
    },
    messageSafe: {
        background: "#16191b",
        color: "#3cd66a",
        textShadow: "0 0 6px rgba(60, 214, 106, 0.4)",
        boxShadow: "inset 0 3px 6px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.05)",
    },
    messageThrottled: {
        background: "#2a0d0d",
        color: "#ff4d4d",
        textShadow: "0 0 8px rgba(255, 77, 77, 0.6)",
        boxShadow: "inset 0 3px 6px rgba(0,0,0,0.9), 0 0 15px rgba(214, 48, 48, 0.3)",
    }
};

const keyframes = `
@keyframes critical-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
.status-text-blink {
    animation: critical-blink 1.5s ease-in-out infinite;
}
`;