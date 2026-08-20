import React from "react";

export default function MicroLEDModel({ selectedPart, setSelectedPart, animate }) {
    const isOn = (id) => selectedPart === id;

    return (
        <div className="microled-stage">
            <svg viewBox="0 0 480 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">

                {/* Cover Glass */}
                <g className={`part ${isOn("cover") ? "part-active" : ""}`} onClick={() => setSelectedPart("cover")}>
                    <rect x="60" y="40" width="260" height="40" rx="4" fill="#cfe9fb" fillOpacity="0.55" stroke="#333" strokeWidth="1" />
                </g>

                {/* Micro-LED Chips */}
                <g className={`part ${isOn("chips") ? "part-active" : ""}`} onClick={() => setSelectedPart("chips")}>
                    <rect x="65" y="96" width="70" height="40" rx="4" fill="#E24B4A" />
                    <text x="100" y="121" textAnchor="middle" fill="#fff" fontSize="14">R</text>
                    <rect x="155" y="96" width="70" height="40" rx="4" fill="#639922" />
                    <text x="190" y="121" textAnchor="middle" fill="#fff" fontSize="14">G</text>
                    <rect x="245" y="96" width="70" height="40" rx="4" fill="#378ADD" />
                    <text x="280" y="121" textAnchor="middle" fill="#fff" fontSize="14">B</text>
                </g>

                {/* Common Electrode */}
                <g className={`part ${isOn("electrode") ? "part-active" : ""}`} onClick={() => setSelectedPart("electrode")}>
                    <rect x="60" y="152" width="260" height="18" rx="2" fill="#c9c9c9" stroke="#333" strokeWidth="1" />
                </g>

                {/* TFT Backplane */}
                <g className={`part ${isOn("backplane") ? "part-active" : ""}`} onClick={() => setSelectedPart("backplane")}>
                    <rect x="60" y="186" width="260" height="50" rx="4" fill="#0f6e56" stroke="#333" strokeWidth="1" />
                </g>

                {/* Light Rays — exit upward from each chip, through the cover glass */}
                <line className={`ray ray-r ${animate ? "ray-animate" : ""}`} x1="100" y1="96" x2="100" y2="10" stroke="#E24B4A" strokeWidth="2" />
                <line className={`ray ray-g ${animate ? "ray-animate" : ""}`} x1="190" y1="96" x2="190" y2="10" stroke="#639922" strokeWidth="2" />
                <line className={`ray ray-b ${animate ? "ray-animate" : ""}`} x1="280" y1="96" x2="280" y2="10" stroke="#378ADD" strokeWidth="2" />

                {/* Labels */}
                <line x1="320" y1="60" x2="330" y2="60" stroke="#999" />
                <text x="335" y="64" className="part-label" textAnchor="start">Cover Glass</text>

                <line x1="320" y1="116" x2="330" y2="116" stroke="#999" />
                <text x="335" y="120" className="part-label" textAnchor="start">Micro-LED Chips</text>

                <line x1="320" y1="161" x2="330" y2="161" stroke="#999" />
                <text x="335" y="165" className="part-label" textAnchor="start">Electrode</text>

                <line x1="320" y1="211" x2="330" y2="211" stroke="#999" />
                <text x="335" y="215" className="part-label" textAnchor="start">TFT Backplane</text>
            </svg>
        </div>
    );
}