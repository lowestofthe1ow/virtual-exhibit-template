import React, { useRef } from "react";

export default function CrtModel({ selectedPart, setSelectedPart, animate }) {
    const beamRef = useRef(null);
    const isOn = (id) => selectedPart === id;

    return (
        <div className="crt-stage">
            <svg viewBox="0 0 800 360" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                
                {/* Vacuum Tube Outer Glass Envelope */}
                <g className={`part vacuum ${isOn("vacuum") ? "part-active" : ""}`} onClick={() => setSelectedPart("vacuum")}>
                    <path d="M 170 120 L 520 120 L 670 30 L 670 320 L 520 240 L 170 240 Z" fill="#2c2c2c" stroke="#444" strokeWidth="4" strokeLinejoin="round" />
                    <text x="420" y="275" className="part-label" textAnchor="middle">Vacuum Tube</text>
                </g>

                {/* Base & Pins */}
                <g>
                    {/* Base */}
                    <rect x="150" y="120" width="20" height="120" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    {/* 4 Connected Pins */}
                    <rect x="110" y="130" width="40" height="10" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <rect x="110" y="160" width="40" height="10" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <rect x="110" y="190" width="40" height="10" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <rect x="110" y="220" width="40" height="10" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <text x="140" y="95" className="part-label" textAnchor="middle">Pins & Base</text>
                </g>

                {/* Electron Gun */}
                <g className={`part ${isOn("gun") ? "part-active" : ""}`} onClick={() => setSelectedPart("gun")}>
                    <rect x="170" y="170" width="40" height="20" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <text x="190" y="275" className="part-label" textAnchor="middle">Electron Gun</text>
                </g>

                {/* Control Grid */}
                <g className={`part ${isOn("grid") ? "part-active" : ""}`} onClick={() => setSelectedPart("grid")}>
                    {/* Top Assembly */}
                    <path d="M 240 150 L 300 150 L 300 170 L 290 170 L 290 160 L 250 160 L 250 170 L 240 170 Z" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    {/* Bottom Assembly */}
                    <path d="M 240 210 L 300 210 L 300 190 L 290 190 L 290 200 L 250 200 L 250 190 L 240 190 Z" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <text x="270" y="95" className="part-label" textAnchor="middle">Control Grid</text>
                </g>

                {/* Deflection System (X-Deflect and Y-Deflect Arrays) */}
                <g className={`part ${isOn("deflection") ? "part-active" : ""}`} onClick={() => setSelectedPart("deflection")}>
                    {/* X Deflection Plates */}
                    <path d="M 350 160 L 390 160 L 390 190 L 350 190 Z" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <path d="M 340 170 L 380 170 L 380 200 L 340 200 Z" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    
                    {/* Y Deflection Plates */}
                    <polygon points="430,160 470,160 480,150 440,150" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    <polygon points="430,200 470,200 480,190 440,190" fill="#2c2c2c" stroke="#cfd6de" strokeWidth="2" />
                    
                    <text x="410" y="95" className="part-label" textAnchor="middle">Deflection Plates</text>
                </g>

                {/* Phosphorescent Screen */}
                <g className={`part screen ${isOn("screen") ? "part-active" : ""}`} onClick={() => setSelectedPart("screen")}>
                    <ellipse cx="670" cy="180" rx="20" ry="145" fill="#1a1a1a" stroke="#cfd6de" strokeWidth="2" />
                    <text x="670" y="350" className="part-label" textAnchor="middle">Phosphorescent Screen</text>
                </g>

                {/* Electron Beam */}
                <line
                    ref={beamRef}
                    x1="210" y1="180" x2="655" y2="180"
                    pathLength="445"
                    className={`beam ${animate ? "beam-animate" : ""}`}
                />
                {animate && <circle cx="655" cy="180" r="10" className="beam-glow" />}
            </svg>
        </div>
    );
}