export default function ComparisonTable() {
    return (
        <div style={styles.container}>
            <div style={styles.panel}>
                <div style={styles.singleCoreHeader}>
                    Single-core Processor
                </div>
                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        <span style={styles.bold}>Sequential Execution</span>
                        <span style={styles.text}>• Executes instructions step-by-step on a single core.</span>
                    </li>
                    <li style={styles.listItem}>
                        <span style={styles.bold}>Thermal Wall</span>
                        <span style={styles.text}>• Pushing higher clock speeds causes exponential heat increases.</span>
                    </li>
                    <li style={styles.listItem}>
                        <span style={styles.bold}>Time-Sharing</span>
                        <span style={styles.text}>• Simulates multitasking by rapidly alternating focus between tasks.</span>
                    </li>
                </ul>
            </div>

            <div style={styles.panel}>
                <div style={styles.multiCoreHeader}>
                    Multicore Processor
                </div>
                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        <span style={styles.bold}>Parallel Execution</span>
                        <span style={styles.text}>• Distributes workloads across multiple physical cores simultaneously.</span>
                    </li>
                    <li style={styles.listItem}>
                        <span style={styles.bold}>Thread Concurrency</span>
                        <span style={styles.text}>• The operating system schedules independent execution paths concurrently.</span>
                    </li>
                    <li style={styles.listItem}>
                        <span style={styles.bold}>Thermal Efficiency</span>
                        <span style={styles.text}>• Achieves high throughput without exceeding cooling limits.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        width: "100%",
        margin: "24px 0",
    },
    panel: {
        flex: "1 1 300px",
        background: "rgba(0, 0, 0, 0.2)",
        border: "1px dashed rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        padding: "16px 20px",
        boxSizing: "border-box",
    },
    singleCoreHeader: {
        fontSize: "1.05rem",
        fontWeight: "bold",
        color: "#ff6b6b",
        borderBottom: "1px dashed #ff6b6b",
        paddingBottom: "8px",
        marginBottom: "12px",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontFamily: "monospace",
    },
    multiCoreHeader: {
        fontSize: "1.05rem",
        fontWeight: "bold",
        color: "#3cd66a",
        borderBottom: "1px dashed #3cd66a",
        paddingBottom: "8px",
        marginBottom: "12px",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontFamily: "monospace",
    },
    list: {
        margin: 0,
        padding: 0,
        listStyle: "none",
        color: "var(--mutedS, #a0a5aa)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    listItem: {
        fontSize: "0.95rem",
        lineHeight: "1.4",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    bold: {
        color: "#ffffff",
        fontWeight: "600",
    },
    text: {
        display: "block",
        paddingLeft: "16px",
    }
};