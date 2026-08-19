export default function TrendGraph() {
    const data = {
        transistors: [
            { year: 1971.8, val: 2.3 }, { year: 1979.5, val: 29.1 }, { year: 1989.4, val: 1207.9 },
            { year: 1999.4, val: 21673.9 }, { year: 2005.7, val: 232909.6 }, { year: 2010.1, val: 410469.8 },
            { year: 2014.8, val: 5700000.0 }
        ],
        specint: [
            { year: 1988.6, val: 83.5 }, { year: 1995.4, val: 1027.3 }, { year: 2000.6, val: 4782.8 },
            { year: 2005.7, val: 17000.7 }, { year: 2010.3, val: 42000.0 }, { year: 2014.8, val: 66000.4 }
        ],
        frequency: [
            { year: 1971.8, val: 0.7 }, { year: 1982.3, val: 6.0 }, { year: 1993.0, val: 198.0 },
            { year: 2000.6, val: 1000.0 }, { year: 2005.7, val: 3190.8 }, { year: 2010.1, val: 2308.2 },
            { year: 2014.8, val: 3700.0 }
        ],
        watts: [
            { year: 1971.8, val: 0.4 }, { year: 1988.6, val: 3.9 }, { year: 1995.4, val: 50.0 },
            { year: 2000.6, val: 48.6 }, { year: 2005.7, val: 128.6 }, { year: 2010.3, val: 168.4 },
            { year: 2014.8, val: 140.0 }
        ],
        cores: [
            { year: 1971.8, val: 1 }, { year: 1995.4, val: 1 }, { year: 2004.8, val: 2 },
            { year: 2007.6, val: 4 }, { year: 2010.1, val: 16 }, { year: 2014.8, val: 64 }
        ]
    };

    const seriesMeta = [
        { id: "transistors", label: "Transistors (thousands)", color: "#b782cc" },
        { id: "specint", label: "Single-Thread Performance", color: "#7a95c2" },
        { id: "frequency", label: "Frequency (MHz)", color: "#61be84" },
        { id: "watts", label: "Typical Power (Watts)", color: "#c97373" },
        { id: "cores", label: "Logical Cores", color: "#ffbf00", highlighted: true }
    ];

    const width = 720;
    const height = 380;
    const padding = { left: 45, right: 35, top: 25, bottom: 45 };

    const getX = (year) => padding.left + ((year - 1970) / 50) * (width - padding.left - padding.right);
    const getY = (val) => {
        const logVal = Math.max(0, Math.log10(Math.max(1, val)));
        const logMax = 7;
        return (height - padding.bottom) - (logVal / logMax) * (height - padding.top - padding.bottom);
    };

    const wallX = getX(2005);

    const formatYLabel = (exp) => {
        const labels = ["", "10", "100", "1K", "10K", "100K", "1M", "10M"];
        return labels[exp] || "";
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>40 Years of Microprocessor Trend Data</h3>

            <div style={styles.chartWrapper}>
                <svg viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((exp) => {
                        const y = getY(Math.pow(10, exp));
                        return (
                            <g key={exp}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={padding.left - 10}
                                    y={y + 4}
                                    fill="var(--mutedS)"
                                    fontSize="11"
                                    textAnchor="end"
                                    fontFamily="monospace"
                                >
                                    {formatYLabel(exp)}
                                </text>
                            </g>
                        );
                    })}

                    {[1970, 1980, 1990, 2000, 2010, 2020].map((year) => {
                        const x = getX(year);
                        return (
                            <g key={year}>
                                <line
                                    x1={x}
                                    y1={padding.top}
                                    x2={x}
                                    y2={height - padding.bottom}
                                    stroke="rgba(255,255,255,0.08)"
                                />
                                <text
                                    x={x}
                                    y={height - padding.bottom + 20}
                                    fill="var(--mutedS)"
                                    fontSize="11"
                                    textAnchor="middle"
                                    fontFamily="monospace"
                                >
                                    {year}
                                </text>
                            </g>
                        );
                    })}

                    <line
                        x1={wallX}
                        y1={padding.top}
                        x2={wallX}
                        y2={height - padding.bottom}
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        strokeOpacity="0.8"
                    />

                    <g transform={`translate(${wallX - 8}, ${padding.top + 10})`}>
                        <rect
                            x="-115"
                            y="0"
                            width="110"
                            height="42"
                            fill="#16191b"
                            stroke="rgba(239, 68, 68, 0.4)"
                            strokeWidth="1"
                            rx="4"
                        />
                        <text
                            x="-60"
                            y="15"
                            fill="#f87171"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="monospace"
                        >
                            POWER WALL
                        </text>
                        <text
                            x="-60"
                            y="30"
                            fill="var(--textS)"
                            fontSize="8"
                            textAnchor="middle"
                            fontFamily="monospace"
                        >
                            Dennard Scaling Ends
                        </text>
                    </g>

                    {seriesMeta.map((s) => {
                        const pts = data[s.id];
                        const pointsString = pts.map((p) => `${getX(p.year)},${getY(p.val)}`).join(" ");
                        const isTarget = s.highlighted;

                        return (
                            <g key={s.id}>
                                <polyline
                                    points={pointsString}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={isTarget ? "3.5" : "2"}
                                    strokeOpacity={isTarget ? 1 : 0.75}
                                    style={{
                                        filter: isTarget
                                            ? "drop-shadow(0 0 3px rgba(255,191,0,0.4))"
                                            : "none"
                                    }}
                                />
                                {pts.map((p, idx) => (
                                    <circle
                                        key={idx}
                                        cx={getX(p.year)}
                                        cy={getY(p.val)}
                                        r={isTarget ? "4.5" : "3"}
                                        fill={s.color}
                                        fillOpacity={isTarget ? 1 : 0.85}
                                    />
                                ))}
                            </g>
                        );
                    })}
                </svg>

                <div style={styles.legend}>
                    {seriesMeta.map((s) => (
                        <div key={s.id} style={styles.legendItem}>
                            <span style={{ ...styles.legendDot, backgroundColor: s.color }} />
                            <span
                                style={{
                                    color: s.highlighted ? "#ffbf00" : "#e2e8f0",
                                    fontWeight: s.highlighted ? "700" : "400"
                                }}
                            >
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: "var(--bg1S)",
        padding: "1.25rem 1.5rem",
        borderRadius: "16px",
        border: "1px solid var(--borderS)",
        fontFamily: "monospace",
        margin: "1.5rem 0",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
    },
    title: {
        textAlign: "center",
        color: "#ffffff",
        margin: "0 0 0.75rem 0",
        fontSize: "1.1rem",
        letterSpacing: "1px",
        textTransform: "uppercase"
    },
    chartWrapper: {
        width: "100%",
        position: "relative"
    },
    svg: {
        width: "100%",
        height: "auto",
        display: "block"
    },
    legend: {
        display: "flex",
        justifyContent: "center",
        gap: "1.25rem",
        flexWrap: "wrap",
        marginTop: "0.75rem",
        paddingTop: "0.75rem",
        borderTop: "1px dashed rgba(255, 255, 255, 0.1)"
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        fontSize: "0.8rem",
        fontFamily: "monospace"
    },
    legendDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        display: "inline-block"
    }
};