import CpuCore from './CpuCore.jsx';

export default function CpuContainer({ throttle=false, activeCount=0 }) {
    const MAX_CORES = 8;
    const coresList = [];

    for (let j = 0; j < MAX_CORES; j ++) {
        coresList.push(<CpuCore key={j} id={j} throttle={throttle} active={j < activeCount}/>)
    }

    return (
        <div style={styles.container}>
            <div style={styles.cores}>
                { coresList }
            </div>
        </div>
    );
}

const styles = {
    container: {
        position: "relative",
    },
    cores: {
        fontFamily: 'Courier New, monospace',
        width: "100%",
        boxSizing: "border-box",
        padding: '16px 24px',
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: "10px",
        justifyItems: "center",
        background: "linear-gradient(135deg, #2d3238 0%, #1a1d20 100%)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        boxShadow: `
            inset 0 4px 10px rgba(0, 0, 0, 0.8),
            inset 0 -2px 6px rgba(255, 255, 255, 0.1),
            0 10px 30px rgba(0, 0, 0, 0.5)
        `,
    }
};