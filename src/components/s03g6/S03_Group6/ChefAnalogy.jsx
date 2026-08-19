import { useState, useEffect } from "react";
import ramsay from "../../../assets/s03g6/S03_Group6_Ramsay.webp";

export default function ChefAnalogy() {
    const [tick, setTick] = useState(0);
    const [tickMultiple, setTickMultiple] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prev) => (prev + 1) % 17);
        }, 160);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tick === 0) {
            setTickMultiple(0);
        }
    }, [tick]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTickMultiple((prev) => (prev + 1) % 17);
        }, 300);
        return () => clearInterval(interval);
    }, []);

    const singleCoreOrders = tick;
    const multiCoreOrders = Math.min(tickMultiple, 4);

    return (
        <div style={styles.container}>
            <div style={styles.kitchen}>
                <div style={{ ...styles.header, borderBottom: "1px dashed #ff4d4d" }}>
                    <div style={{ color: "#ff4d4d", fontFamily: "monospace", fontSize: "1.3rem", fontWeight: "bold" }}>Single-Core</div>
                </div>
                <div style={styles.chefContainer}>
                    <div style={{ ...styles.chef, ...styles.sweatingChef }}>
                        <img src={ramsay.src} alt="Stressed Chef" style={{ height: "70px" }} />
                    </div>
                </div>
                <div style={styles.orderQueue}>
                    {Array(16).fill('🥪').map((sandwich, i) => (
                        <span key={i} style={{ opacity: i < singleCoreOrders ? 1 : 0.2, transition: "0.2s" }}>{sandwich}</span>
                    ))}
                </div>
            </div>

            <div style={styles.kitchen}>
                <div style={{ ...styles.header, borderBottom: "1px dashed #3cd66a" }}>
                    <div style={{ color: "#3cd66a", fontFamily: "monospace", fontSize: "1.3rem", fontWeight: "bold" }}>Multi-Core</div>
                </div>
                <div style={styles.multiChefContainer}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={styles.multiChefColumn}>
                            <div style={{ ...styles.chef, ...styles.chillChef }}>
                                <img src={ramsay.src} alt="Chill Chef" style={{ height: "70px" }} />
                            </div>
                            <div style={styles.multiOrderQueue}>
                                {Array(4).fill('🥪').map((sandwich, index) => (
                                    <span key={index} style={{ opacity: index < multiCoreOrders ? 1 : 0.2, transition: "0.2s" }}>{sandwich}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        gap: "2rem",
        background: "#16191b",
        padding: "1rem 2rem",
        borderRadius: "16px",
        border: "1px solid var(--borderS)",
        margin: "2rem 0",
        flexWrap: "wrap",
    },
    kitchen: {
        flex: "1 1 300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    header: {
        textAlign: "center",
        fontFamily: "monospace",
        width: "100%",
        paddingBottom: "10px",
        marginBottom: "12px",
    },
    chefContainer: {
        display: "flex",
        alignItems: "center",
    },
    multiChefContainer: {
        columnGap: "4rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "center",
    },
    multiChefColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    chef: {
        height: "1.5em",
        width: "1em",
        fontSize: "3rem",
        position: "relative",
        background: "rgba(255,255,255,0.05)",
        padding: "5px",
        borderRadius: "10%",
        border: "1px solid rgba(255,255,255,0.1)",
    },
    sweatingChef: {
        background: "rgba(255, 77, 77, 0.2)",
        border: "1px solid #ff4d4d",
        boxShadow: "0 0 15px rgba(255, 77, 77, 0.4)",
    },
    chillChef: {
        background: "rgba(77, 255, 160, 0.2)",
        border: "1px solid #71f594",
        boxShadow: "0 0 15px #1fa64b",
    },
    orderQueue: {
        marginTop: "8px",
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: "5px",
        fontSize: "1.5rem",
        background: "#0a0a0a",
        padding: "10px",
        borderRadius: "8px",
    },
    multiOrderQueue: {
        margin: "8px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 2fr)",
        gap: "5px",
        fontSize: "1.5rem",
        background: "#0a0a0a",
        padding: "10px",
        borderRadius: "8px",
    }
};