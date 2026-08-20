import background from "../../assets/s04g9/ADEOS_Group9_IntroductionBackground.svg";
import leftBorder from "../../assets/s04g9/ADEOS_Group9_IntroductionLeftBorder.svg";
import rightBorder from "../../assets/s04g9/ADEOS_Group9_IntroductionRightBorder.svg";

const parts = [
    {
        id: "left",
        text: "Solid-State Drives, or SSDs, are storage devices used in computers, laptops, consoles, and other digital systems. Unlike hard disk drives, SSDs do not use spinning magnetic platters or moving read/write heads. Instead, they store data electronically using NAND flash memory.",
        border: leftBorder,
    },
    {
        id: "right",
        text: "The main idea of this exhibit is simple: files are encoded as binary data, and an SSD controller maps that data across NAND flash memory cells. Stored charge changes each cell's threshold voltage, allowing sensing circuitry to recover the represented bit values.",
        border: rightBorder,
    }
]

function assetSrc(asset) {
  return asset.src ?? asset;
}

export default function Introduction() {
    return (
        <>
            <section className="adeos-g9-component adeos-g9-introduction" aria-labelledby="adeos-g9-introduction-title">
                <img 
                    className="adeos-g9-component__bg"
                    src={assetSrc(background)}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    loading="lazy"
                />
                <header className="adeos-g9-introduction__header">
                    <h4 id="adeos-g9-introduction-title">
                        Flash Memory: <br /> How SSDs Store Data
                    </h4>
                </header>
                <div className="adeos-g9-introduction__text">
                    {parts.map((part) => (
                        <div
                            key={part.id}
                            className={`adeos-g9-introduction__panel adeos-g9-introduction__panel--${part.id}`}
                        >
                            <div className={`adeos-g9-introduction__frame adeos-g9-introduction__frame--${part.id}`}>
                                <img
                                    src={assetSrc(part.border)}
                                    className={`adeos-g9-introduction__text-bg--${part.id}`}
                                    alt=""
                                    aria-hidden="true"
                                    decoding="async"
                                />
                                <span className={`adeos-g9-introduction__text--${part.id}`}>{part.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <style suppressHydrationWarning> {`
                .adeos-g9-introduction__header {
                    position: absolute;
                    inset: 20% 24px auto;
                    text-align: center;
                    pointer-events: none;
                    animation: adeos-g9-introduction-rise 600ms ease-out 180ms both;
                }

                .adeos-g9-introduction__header h4 {
                    margin: 0;
                    color: #ffffff;
                    font-family: "Tomorrow", "Noto Sans Variable", sans-serif;
                    font-size: clamp(1.5rem, 5cqw, 4rem);
                    font-weight: 500;
                    letter-spacing: 0;
                    line-height: 1.08;
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.88), 0 0 22px rgba(255, 255, 255, 0.62);
                }

                .adeos-g9-introduction__text {
                    position: absolute;
                    z-index: 2;
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    justify-content: center;
                    font-family: "Space Mono", "Noto Sans Variable", sans-serif;
                    font-size: clamp(0.4rem, 1.4cqw, 1rem);
                    line-height: 1.25;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }

                .adeos-g9-introduction .adeos-g9-component__bg {
                    animation: adeos-g9-introduction-background 700ms ease-out both;
                }
                
                .adeos-g9-introduction__panel {
                    position: relative;
                    margin-top: 60%;
                    animation: adeos-g9-introduction-rise 600ms ease-out both;
                }

                .adeos-g9-introduction__panel--left {
                    animation-delay: 420ms;
                }

                .adeos-g9-introduction__panel--right {
                    animation-delay: 620ms;
                }

                .adeos-g9-introduction__frame {
                    position: absolute;
                    top: 0;
                    width: 80%;
                    aspect-ratio: 1.805 / 1;
                }

                .adeos-g9-introduction__frame--left {
                    right: 0;
                }

                .adeos-g9-introduction__frame--right {
                    left: 0;
                }

                .adeos-g9-introduction__text-bg--left,
                .adeos-g9-introduction__text-bg--right {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    object-fit: fill;
                }

                .adeos-g9-introduction__text--left,
                .adeos-g9-introduction__text--right {
                    position: absolute;
                    z-index: 3;
                    top: 23.5%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    width: 91.8%;
                    height: 73.5%;
                    color: #ffffff;
                    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    padding: 0.5rem 1rem;
                }

                .adeos-g9-introduction__text--left {
                    left: 0.6%;
                }

                .adeos-g9-introduction__text--right {
                    left: 7.3%;
                }

                @keyframes adeos-g9-introduction-background {
                    from {
                        opacity: 0.35;
                    }
                    to {
                        opacity: 0.96;
                    }
                }

                @keyframes adeos-g9-introduction-rise {
                    from {
                        opacity: 0;
                        transform: translateY(14px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 650px) {
                    body .adeos-g9-component.adeos-g9-introduction {
                        display: grid;
                        gap: 1rem;
                        min-height: 0;
                        padding: 1.5rem 0.75rem 1rem;
                        aspect-ratio: auto;
                    }

                    body .adeos-g9-component.adeos-g9-introduction .adeos-g9-component__bg {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .adeos-g9-introduction__header {
                        position: relative;
                        inset: auto;
                        z-index: 2;
                        padding: 0.5rem;
                    }

                    .adeos-g9-introduction__header h4 {
                        font-size: 2rem;
                    }

                    .adeos-g9-introduction__text {
                        position: relative;
                        display: grid;
                        grid-template-columns: 1fr;
                        width: 100%;
                        height: auto;
                        padding: 0;
                        gap: 0.75rem;
                    }

                    .adeos-g9-introduction__panel {
                        position: relative;
                        display: grid;
                        place-items: center;
                        min-height: 240px;
                        margin: 0;
                        width: 100%;
                    }

                    .adeos-g9-introduction__frame {
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        aspect-ratio: auto;
                    }

                    .adeos-g9-introduction__text-bg--left,
                    .adeos-g9-introduction__text-bg--right {
                        position: absolute;
                        inset: 0;
                        display: block;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        transform: none;
                        object-fit: fill;
                    }

                    .adeos-g9-introduction__text--left,
                    .adeos-g9-introduction__text--right {
                        transform: none;
                        max-width: none;
                        margin: 0;
                        font-size: 0.75rem;
                        line-height: 1.4;
                        padding: 0.75rem 1.25rem;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .adeos-g9-introduction .adeos-g9-component__bg,
                    .adeos-g9-introduction__header,
                    .adeos-g9-introduction__panel {
                        animation: none;
                    }
                }
            `}
            </style>
        </>
    )
}