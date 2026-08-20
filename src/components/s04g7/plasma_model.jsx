import React from "react";

const TAGS = {
    substrates: "Glass Substrates",
    sustain: "Sustain Electrodes",
    mgo: "MgO Protective Layer",
    gas: "Neon & Xenon Gas Cells",
    phosphor: "RGB Phosphor Coating",
    address: "Address Electrodes",
};

export default function PlasmaModel({ selectedPart, setSelectedPart, animate }) {
    const isOn = (id) => selectedPart === id;
    const tagText = TAGS[selectedPart] ?? TAGS.gas;

    const cells = [
        { x: 120, color: "#e0483e" },
        { x: 340, color: "#3fae52" },
        { x: 560, color: "#3f7fbf" },
    ];

    return (
        <div className="plasma-stage">
            <svg viewBox="0 0 800 360" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">

                {/* Front Glass Substrate */}
                <g className={`part ${isOn("substrates") ? "part-active" : ""}`} onClick={() => setSelectedPart("substrates")}>
                    <rect x="60" y="52" width="680" height="16" rx="8" className="layer layer-glass" />
                </g>

                {/* Sustain Electrodes */}
                <g className={`part ${isOn("sustain") ? "part-active" : ""}`} onClick={() => setSelectedPart("sustain")}>
                    <rect x="80" y="78" width="640" height="7" rx="3.5" className="layer layer-electrode" />
                    <rect x="80" y="90" width="640" height="7" rx="3.5" className="layer layer-electrode" />
                </g>

                {/* MgO Protective Layer */}
                <g className={`part ${isOn("mgo") ? "part-active" : ""}`} onClick={() => setSelectedPart("mgo")}>
                    <rect x="80" y="110" width="640" height="10" rx="5" className="layer layer-mgo" />
                </g>

                {/* Neon & Xenon Gas Cells */}
                {cells.map((cell) => (
                    <g key={cell.x} className={`part ${isOn("gas") ? "part-active" : ""}`} onClick={() => setSelectedPart("gas")}>
                        <rect x={cell.x} y="150" width="150" height="108" rx="30" className="layer layer-chamber" />
                        <circle cx={cell.x + 75} cy="204" r="0" className={`shock ${animate ? "shock-animate" : ""}`} stroke={cell.color} />
                        <circle cx={cell.x + 75} cy="204" r="26" fill={cell.color} className={`cell-glow ${animate ? "cell-glow-animate" : ""}`} />
                    </g>
                ))}

                {/* RGB Phosphor Coating */}
                {cells.map((cell) => (
                    <g key={`p-${cell.x}`} className={`part ${isOn("phosphor") ? "part-active" : ""}`} onClick={() => setSelectedPart("phosphor")}>
                        <rect x={cell.x} y="268" width="150" height="14" rx="7" fill={cell.color} opacity="0.85" className={`phosphor-flash ${animate ? "phosphor-flash-animate" : ""}`} />
                    </g>
                ))}

                {/* Address Electrodes */}
                {cells.map((cell) => (
                    <g key={`a-${cell.x}`} className={`part ${isOn("address") ? "part-active" : ""}`} onClick={() => setSelectedPart("address")}>
                        <rect x={cell.x + 55} y="290" width="40" height="14" rx="7" className="layer layer-electrode" />
                    </g>
                ))}

                {/* Back Glass Substrate */}
                <g className={`part ${isOn("substrates") ? "part-active" : ""}`} onClick={() => setSelectedPart("substrates")}>
                    <rect x="60" y="316" width="680" height="16" rx="8" className="layer layer-glass" />
                </g>

                {/* Floating tag */}
                <g className="tag" transform="translate(400, 16)">
                    <rect x="-100" y="-10" width="200" height="24" rx="12" className="tag-pill" />
                    <text x="0" y="7" textAnchor="middle" className="tag-text">{tagText}</text>
                </g>

            </svg>
        </div>
    );
}
