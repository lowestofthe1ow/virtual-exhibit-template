import { useEffect, useRef, useState } from "react";
import SSDBackground from "../../assets/s04g9/ADEOS_Group9_SSD_BackgroundOnly.svg";
import SSDStandalone from "../../assets/s04g9/ADEOS_Group9_SSD_Standalone.svg";

const parts = [
    {
        id: "m2",
        label: "M.2 Connector",
        description: "The M.2 edge connector links the SSD to the computer.",
    },
    {
        id: "controller",
        label: "Controller",
        description: "The controller manages data placement, reads, programming, erasing, and error correction.",
    },
    {
        id: "nand",
        label: "NAND Flash",
        description: "The NAND flash packages contain the non-volatile memory cells that store data.",
    },
];

function assetSrc(asset) {
    return asset.src ?? asset;
}

export default function SSDDiagram() {
    const sectionRef = useRef(null);
    const [hasEntered, setHasEntered] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || hasEntered) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasEntered(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 },
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [hasEntered]);

    const togglePart = (partId) => {
        setSelectedPart((current) => current === partId ? null : partId);
    };

    const selectedDescription = parts.find((part) => part.id === selectedPart)?.description ?? "";

    return (
        <section
            ref={sectionRef}
            className={`adeos-g9-component adeos-g9-ssd${hasEntered ? " adeos-g9-ssd--entered" : ""}`}
            aria-labelledby="adeos-g9-ssd-diagram-title"
            data-selected={selectedPart ?? undefined}
        >
            <img
                className="adeos-g9-ssd__background"
                src={assetSrc(SSDBackground)}
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="lazy"
            />

            <header className="adeos-g9-ssd__header">
                <h4 id="adeos-g9-ssd-diagram-title">SSD Diagram</h4>
            </header>

            <div className="adeos-g9-ssd__board" aria-hidden="true">
                <svg className="adeos-g9-ssd__board-art" viewBox="18 87 1404 629" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <clipPath id="adeos-g9-ssd-m2-mask">
                            <polygon points="54,480 90,465 220,666 185,680" />
                        </clipPath>
                        <clipPath id="adeos-g9-ssd-controller-mask">
                            <polygon points="188,450 355,397 432,500 260,554" />
                        </clipPath>
                        <clipPath id="adeos-g9-ssd-nand-mask">
                            <polygon points="665,283 833,235 982,390 810,444" />
                            <polygon points="1013,184 1162,138 1322,282 1166,334" />
                        </clipPath>
                    </defs>
                    <image className="adeos-g9-ssd__board-image" href={assetSrc(SSDStandalone)} width="1440" height="810" />
                    <g className="adeos-g9-ssd__part-highlight adeos-g9-ssd__part-highlight--m2" clipPath="url(#adeos-g9-ssd-m2-mask)">
                        <image href={assetSrc(SSDStandalone)} width="1440" height="810" />
                    </g>
                    <g className="adeos-g9-ssd__part-highlight adeos-g9-ssd__part-highlight--controller" clipPath="url(#adeos-g9-ssd-controller-mask)">
                        <image href={assetSrc(SSDStandalone)} width="1440" height="810" />
                    </g>
                    <g className="adeos-g9-ssd__part-highlight adeos-g9-ssd__part-highlight--nand" clipPath="url(#adeos-g9-ssd-nand-mask)">
                        <image href={assetSrc(SSDStandalone)} width="1440" height="810" />
                        <rect className="adeos-g9-ssd__nand-tint" x="18" y="87" width="1404" height="629" />
                    </g>
                </svg>
            </div>

            <svg className="adeos-g9-ssd__connectors" viewBox="0 0 1000 562.5" aria-hidden="true">
                <g className="adeos-g9-ssd__connector adeos-g9-ssd__connector--m2">
                    <path d="M 279 373 L 294 373 L 309 373" />
                    <circle cx="279" cy="373" r="5" />
                </g>
                <g className="adeos-g9-ssd__connector adeos-g9-ssd__connector--controller">
                    <path d="M 330 300 L 350 318 L 380 341" />
                    <circle cx="330" cy="300" r="5" />
                </g>
                <g className="adeos-g9-ssd__connector adeos-g9-ssd__connector--nand">
                    <path d="M 540 195 L 540 225 L 580 286" />
                    <circle cx="540" cy="195" r="5" />
                    <path d="M 660 195 L 690 215 L 715 245" />
                    <circle cx="660" cy="195" r="5" />
                </g>
            </svg>

            <div className="adeos-g9-ssd__controls">
                {parts.map((part) => (
                    <button
                        key={part.id}
                        type="button"
                        className={`adeos-g9-ssd__control adeos-g9-ssd__control--${part.id}`}
                        aria-label={`Highlight ${part.label}`}
                        aria-pressed={selectedPart === part.id}
                        title={part.description}
                        onClick={() => togglePart(part.id)}
                    >
                        {part.label}
                    </button>
                ))}
            </div>

            <span className="adeos-g9-ssd__status" aria-live="polite">
                {selectedDescription}
            </span>

            <style>{`
                .adeos-g9-ssd {
                    background: #0b0d22;
                }

                .adeos-g9-ssd__background,
                .adeos-g9-ssd__connectors {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }

                .adeos-g9-ssd__background {
                    z-index: 0;
                    object-fit: fill;
                    pointer-events: none;
                    user-select: none;
                }

                .adeos-g9-ssd__header {
                    position: absolute;
                    z-index: 4;
                    inset: 10% 24px auto;
                    text-align: center;
                    pointer-events: none;
                }

                .adeos-g9-ssd__header h4 {
                    margin: 0;
                    border: 0;
                    color: #ffffff;
                    font-family: "Tomorrow", "Noto Sans Variable", sans-serif;
                    font-size: clamp(1.5rem, 7cqw, 3rem);
                    font-weight: 500;
                    letter-spacing: 0;
                    line-height: 1.08;
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.88), 0 0 22px rgba(255, 255, 255, 0.62);
                }

                .adeos-g9-ssd__board {
                    position: absolute;
                    z-index: 2;
                    top: 34.0148%;
                    left: 26.7%;
                    width: 54.6%;
                    aspect-ratio: 1404 / 629;
                    pointer-events: none;
                }

                .adeos-g9-ssd__board-art {
                    position: absolute;
                    inset: 0;
                    display: block;
                    width: 100%;
                    height: 100%;
                    overflow: visible;
                    filter: drop-shadow(0 0 9px rgba(40, 238, 255, 0.42));
                }

                .adeos-g9-ssd__part-highlight {
                    opacity: 0;
                    filter: brightness(1.45) saturate(1.55) drop-shadow(0 0 7px rgba(101, 251, 255, 0.9));
                    transition: opacity 220ms ease;
                }

                .adeos-g9-ssd__part-highlight--nand {
                    filter: brightness(1.35) saturate(1.5) drop-shadow(0 0 8px rgba(65, 156, 255, 0.95));
                }

                .adeos-g9-ssd__nand-tint {
                    fill: #278cff;
                    opacity: 0.48;
                    mix-blend-mode: screen;
                }

                .adeos-g9-ssd__connectors {
                    z-index: 3;
                    overflow: visible;
                    pointer-events: none;
                }

                .adeos-g9-ssd__connector path {
                    fill: none;
                    stroke: #dd79ff;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    vector-effect: non-scaling-stroke;
                }

                .adeos-g9-ssd__connector circle {
                    fill: #0b0d22;
                    stroke: #dd79ff;
                    stroke-width: 2;
                    vector-effect: non-scaling-stroke;
                }

                .adeos-g9-ssd__controls {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    pointer-events: none;
                }

                .adeos-g9-ssd__control {
                    position: absolute;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    background: rgba(11, 13, 34, 0.2);
                    color: #ffffff;
                    font-family: "Space Mono", "Noto Sans Variable", monospace;
                    font-size: clamp(0.7rem, 2.25cqw, 1.2rem);
                    line-height: 1.12;
                    letter-spacing: 0;
                    padding: 0.3rem 0.45rem;
                    text-align: center;
                    text-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    pointer-events: auto;
                    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
                }

                .adeos-g9-ssd__control:hover,
                .adeos-g9-ssd__control:focus-visible,
                .adeos-g9-ssd__control[aria-pressed="true"] {
                    border-color: rgba(101, 251, 255, 0.78);
                    background: rgba(17, 56, 82, 0.78);
                    color: #65fbff;
                    box-shadow: 0 0 14px rgba(101, 251, 255, 0.32);
                    outline: none;
                }

                .adeos-g9-ssd__control--m2 {
                    top: 64%;
                    left: 8.7%;
                    width: 18%;
                }

                .adeos-g9-ssd__control--controller {
                    top: 48%;
                    left: 15.8%;
                    width: 16%;
                }

                .adeos-g9-ssd__control--nand {
                    top: 25%;
                    left: 49%;
                    width: 20%;
                }

                .adeos-g9-ssd[data-selected="m2"] .adeos-g9-ssd__part-highlight--m2,
                .adeos-g9-ssd[data-selected="controller"] .adeos-g9-ssd__part-highlight--controller,
                .adeos-g9-ssd[data-selected="nand"] .adeos-g9-ssd__part-highlight--nand {
                    opacity: 1;
                }

                .adeos-g9-ssd[data-selected="m2"] .adeos-g9-ssd__connector--m2,
                .adeos-g9-ssd[data-selected="controller"] .adeos-g9-ssd__connector--controller,
                .adeos-g9-ssd[data-selected="nand"] .adeos-g9-ssd__connector--nand {
                    filter: drop-shadow(0 0 5px rgba(101, 251, 255, 0.95));
                }

                .adeos-g9-ssd[data-selected="m2"] .adeos-g9-ssd__connector--m2 path,
                .adeos-g9-ssd[data-selected="m2"] .adeos-g9-ssd__connector--m2 circle,
                .adeos-g9-ssd[data-selected="controller"] .adeos-g9-ssd__connector--controller path,
                .adeos-g9-ssd[data-selected="controller"] .adeos-g9-ssd__connector--controller circle,
                .adeos-g9-ssd[data-selected="nand"] .adeos-g9-ssd__connector--nand path,
                .adeos-g9-ssd[data-selected="nand"] .adeos-g9-ssd__connector--nand circle {
                    stroke: #65fbff;
                }

                .adeos-g9-ssd__status {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__background {
                    animation: adeos-g9-ssd-background-in 650ms ease-out both;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__header {
                    animation: adeos-g9-ssd-rise-in 520ms ease-out 140ms both;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__board {
                    animation: adeos-g9-ssd-board-in 700ms cubic-bezier(0.22, 1, 0.36, 1) 320ms both;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__connector path {
                    stroke-dasharray: 160;
                    stroke-dashoffset: 160;
                    animation: adeos-g9-ssd-line-in 440ms ease-out both;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__connector circle,
                .adeos-g9-ssd--entered .adeos-g9-ssd__control {
                    animation: adeos-g9-ssd-rise-in 360ms ease-out both;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__connector--m2 path,
                .adeos-g9-ssd--entered .adeos-g9-ssd__connector--m2 circle,
                .adeos-g9-ssd--entered .adeos-g9-ssd__control--m2 {
                    animation-delay: 820ms;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__connector--controller path,
                .adeos-g9-ssd--entered .adeos-g9-ssd__connector--controller circle,
                .adeos-g9-ssd--entered .adeos-g9-ssd__control--controller {
                    animation-delay: 1030ms;
                }

                .adeos-g9-ssd--entered .adeos-g9-ssd__connector--nand path,
                .adeos-g9-ssd--entered .adeos-g9-ssd__connector--nand circle,
                .adeos-g9-ssd--entered .adeos-g9-ssd__control--nand {
                    animation-delay: 1240ms;
                }

                @keyframes adeos-g9-ssd-background-in {
                    from { opacity: 0.25; }
                    to { opacity: 1; }
                }

                @keyframes adeos-g9-ssd-rise-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes adeos-g9-ssd-board-in {
                    from { opacity: 0; transform: translateY(20px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                @keyframes adeos-g9-ssd-line-in {
                    from { stroke-dashoffset: 160; }
                    to { stroke-dashoffset: 0; }
                }

                @media (max-width: 650px) {
                    .adeos-g9-ssd__header h4 {
                        font-size: 1.25rem;
                    }

                    .adeos-g9-ssd__control {
                        font-size: clamp(0.48rem, 2.5vw, 0.68rem);
                        padding: 0.2rem 0.25rem;
                    }

                }

                @media (prefers-reduced-motion: reduce) {
                    .adeos-g9-ssd--entered .adeos-g9-ssd__background,
                    .adeos-g9-ssd--entered .adeos-g9-ssd__header,
                    .adeos-g9-ssd--entered .adeos-g9-ssd__board,
                    .adeos-g9-ssd--entered .adeos-g9-ssd__connector path,
                    .adeos-g9-ssd--entered .adeos-g9-ssd__connector circle,
                    .adeos-g9-ssd--entered .adeos-g9-ssd__control {
                        animation: none;
                    }

                    .adeos-g9-ssd__part-highlight,
                    .adeos-g9-ssd__control {
                        transition: none;
                    }
                }
            `}</style>
        </section>
    );
}