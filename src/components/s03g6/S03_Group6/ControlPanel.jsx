import { useState } from "react";

const TDP_OPTIONS = [
    { label: "65W", value: 65 },
    { label: "100W", value: 100 },
    { label: "150W", value: 150 },
];

export default function ControlPanel({onChange, defaultCores = 4, defaultClock = 4.0, defaultTdp = 65, onClick, selectedTerm }) {
    const [cores, setCores] = useState(defaultCores);
    const [clock, setClock] = useState(defaultClock);
    const [tdp, setTdp] = useState(defaultTdp);

    const emit = (next) => {
        if (onChange) onChange(next);
    };

    const handleCores = (e) => {
        const val = Number(e.target.value);
        setCores(val);
        emit({ cores: val, clock, tdp });
    };

    const handleClock = (e) => {
        const val = Number(e.target.value);
        setClock(val);
        emit({ cores, clock: val, tdp });
    };

    const handleTdp = (val) => {
        setTdp(val);
        emit({ cores, clock, tdp: val });
    };

    const handleToggle = (term) => {
        onClick(selectedTerm === term ? "default" : term);
    };

    return (
        <div style={styles.panel}>
            <Row label="Active Cores" clickKey="Active Cores" onClick={handleToggle} isActive={selectedTerm === "Active Cores"}>
                <Slider
                    min={1}
                    max={8}
                    step={1}
                    value={cores}
                    onChange={handleCores}
                    display={cores}
                />
            </Row>

            <Row label="Clock Speed (GHz)" clickKey="Clock Speed" onClick={handleToggle} isActive={selectedTerm === "Clock Speed"}>
                <Slider
                    min={1.0}
                    max={4.5}
                    step={0.1}
                    value={clock}
                    onChange={handleClock}
                    display={clock.toFixed(1)}
                />
            </Row>

            <Row label="Cooling Solution (TDP)" clickKey="TDP" onClick={handleToggle} isActive={selectedTerm === "TDP"}>
                <div style={styles.segmentGroup}>
                    <div
                        style={{
                            ...styles.slidingPill,
                            left: `calc(${(TDP_OPTIONS.findIndex(opt => opt.value === tdp) / TDP_OPTIONS.length) * 100}% + 3px)`
                        }}
                    />
                    {TDP_OPTIONS.map((opt) => {
                        const selected = tdp === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleTdp(opt.value)}
                                aria-pressed={selected}
                                style={{
                                    ...styles.segmentButton,
                                    color: selected ? "#ffffff" : "#686868",
                                }}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </Row>
        </div>
    );
}

function Row({ label, children, clickKey, onClick, isActive }) {
    return (
        <div style={styles.row}>
            <div
                style={{
                    ...styles.labelBtn,
                    color: isActive ? "var(--accentS)" : "#a0a5aa",
                    background: isActive ? "rgba(0, 180, 216, 0.1)" : "transparent",
                    borderColor: isActive ? "var(--accentS)" : "transparent"
                }}
                onClick={() => onClick(clickKey)}
                title="Click for info"
            >
				<span style={{
                    borderBottom: isActive ? "1px solid var(--accentS)" : "1px dashed #a0a5aa",
                    paddingBottom: "2px"
                }}>
					{label}
				</span>
            </div>
            <div style={styles.control}>{children}</div>
        </div>
    );
}

function Slider({ min, max, step, value, onChange, display }) {
    const percentage = Math.max(0, Math.min(100, ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100));

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
                    background: `linear-gradient(90deg, 
						rgba(60, 175, 214, 0.25) 0%, 
						rgba(60, 175, 214, 0.1) ${percentage}%, 
						#16191b ${percentage}%, 
						#16191b 100%)`
                }}
            />
            <span style={styles.valueTag}>{display}</span>
        </div>
    );
}

const styles = {
    panel: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "Noto Sans Variable, sans-serif",
        fontWeight: "600",
        width: "100%",
        boxSizing: "border-box",
        contain: "inline-size",
        background: "linear-gradient(135deg, #373c43 0%, #22262a 100%)",
        padding: "16px",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
    },
    labelBtn: {
        fontSize: "0.95rem",
        minWidth: 180,
        flexShrink: 0,
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: "8px",
        border: "1px solid transparent",
        transition: "all 0.2s ease",
        userSelect: "none",
    },
    control: {
        flex: "1 1 240px",
        minWidth: 0,
    },
    sliderGroup: {
        display: "flex",
        alignItems: "center",
        gap: 16,
    },
    valueTag: {
        minWidth: 44,
        textAlign: "center",
        background: "linear-gradient(180deg, #4a5056 0%, #2d3238 100%)",
        border: "1px solid rgba(0, 0, 0, 0.4)",
        borderRadius: 14,
        padding: "6px 14px",
        fontSize: "0.95rem",
        color: "#ffffff",
        textShadow: "0 -1px 0 rgba(0, 0, 0, 0.8), 0 1px 1px rgba(255, 255, 255, 0.2)",
        flexShrink: 0,
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 6px rgba(0,0,0,0.3)",
    },
    slider: {
        flex: 1,
        minWidth: 0,
        height: 8,
        accentColor: "#3cafd6",
        cursor: "pointer",
        borderRadius: 999,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.05)",
        appearance: "none",
    },
    segmentGroup: {
        display: "flex",
        position: "relative",
        width: "100%",
        background: "#16191b",
        borderRadius: 14,
        padding: "3px",
        boxShadow: "inset 0 3px 6px rgba(0,0,0,0.7), 0 1px 1px rgba(255,255,255,0.05)",
        isolation: "isolate",
    },
    slidingPill: {
        position: "absolute",
        top: 3,
        bottom: 3,
        width: "calc(33% - 6px)",
        borderRadius: 11,
        zIndex: 0,
        background: "linear-gradient(180deg, #535a61 0%, #363b40 100%)",
        border: "1px solid rgba(0,0,0,0.3)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 3px 6px rgba(0,0,0,0.4), 0 0 10px rgba(60, 214, 106, 0.15)",
        transition: "left 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
    },
    segmentButton: {
        flex: 1,
        border: "none",
        background: "transparent",
        padding: "6px 0",
        fontSize: "0.9rem",
        fontWeight: "700",
        cursor: "pointer",
        zIndex: 1,
        transition: "color 0.2s ease",
    },
};