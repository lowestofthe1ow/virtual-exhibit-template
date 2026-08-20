import { useState, useRef, useEffect } from "react";

import backgroundElements from "../../assets/s04g9/ADEOS_Group9_BackgroundElements.svg";
import blockAsset from "../../assets/s04g9/ADEOS_Group9_Block.svg";
import blockBorder from "../../assets/s04g9/ADEOS_Group9_BlockBorder.svg";
import cellAsset from "../../assets/s04g9/ADEOS_Group9_Cell.svg";
import cellBorder from "../../assets/s04g9/ADEOS_Group9_CellBorder.svg";
import chipAsset from "../../assets/s04g9/ADEOS_Group9_Chip.svg";
import chipBorder from "../../assets/s04g9/ADEOS_Group9_ChipBorder.svg";
import dieAsset from "../../assets/s04g9/ADEOS_Group9_Die.svg";
import dieBorder from "../../assets/s04g9/ADEOS_Group9_DieBorder.svg";
import pageAsset from "../../assets/s04g9/ADEOS_Group9_Page.svg";
import pageBorder from "../../assets/s04g9/ADEOS_Group9_PageBorder.svg";
import planeAsset from "../../assets/s04g9/ADEOS_Group9_Plane.svg";
import planeBorder from "../../assets/s04g9/ADEOS_Group9_PlaneBorder.svg";

const hierarchyParts = {
  chip: {
    title: "Chip",
    text: "Here, Chip represents a packaged NAND component mounted inside a storage device such as an SSD. A package can contain one or more silicon dies.",
    border: chipBorder,
    line: "M 492 246 L 418 246 L 371 226",
    dot: [492, 246],
    target: [371, 226],
  },
  die: {
    title: "Die",
    text: "A die is a piece of silicon inside the NAND package. Each die contains memory planes, and multiple dies can allow the controller to perform some operations in parallel.",
    border: dieBorder,
    line: "M 948 260 L 1020 199 L 1054 199",
    dot: [948, 260],
    target: [1054, 199],
  },
  planes: {
    title: "Planes",
    text: "A die contains one or more planes. Each plane contains blocks and supporting circuitry, and some NAND operations can occur across planes in parallel.",
    border: planeBorder,
    line: "M 500 395 L 435 395 L 416 403",
    dot: [500, 395],
    target: [416, 403],
  },
  blocks: {
    title: "Blocks",
    text: "Inside each plane are blocks, and each block contains multiple pages. A block is important because it is the smallest unit that can be erased in NAND flash memory.",
    border: blockBorder,
    line: "M 898 474 L 976 474 L 1038 454",
    dot: [898, 474],
    target: [1038, 454],
  },
  pages: {
    title: "Pages",
    text: "A page is a group of memory cells within a block. NAND is commonly read and programmed in page-sized units.",
    border: pageBorder,
    line: "M 548 554 L 462 594 L 416 594",
    dot: [548, 554],
    target: [416, 594],
  },
  cell: {
    title: "Cell",
    text: "Cells are the storage elements at the lowest level of this simplified hierarchy. Stored charge changes each cell's threshold voltage, which represents data.",
    border: cellBorder,
    line: "M 856 606 L 920 606 L 944 607",
    dot: [856, 606],
    target: [944, 607],
  },
};

const stackLayers = [
  {
    id: "chip",
    asset: chipAsset,
    zIndex: 6,
    placement: { left: "32.2%", top: "20.0%", width: "36.6%" },
    hotspot: { left: "34.0%", top: "21.8%", width: "33.0%", height: "12.4%" },
    compressY: "160%",
  },
  {
    id: "die",
    asset: dieAsset,
    zIndex: 5,
    placement: { left: "34.4%", top: "32.2%", width: "32.4%" },
    hotspot: { left: "36.4%", top: "33.6%", width: "28.4%", height: "11.0%" },
    compressY: "110%",
  },
  {
    id: "planes",
    asset: planeAsset,
    zIndex: 4,
    placement: { left: "35.5%", top: "43.0%", width: "29.8%" },
    hotspot: { left: "37.6%", top: "44.3%", width: "25.6%", height: "10.2%" },
    compressY: "60%",
  },
  {
    id: "blocks",
    asset: blockAsset,
    zIndex: 3,
    placement: { left: "37.6%", top: "53.0%", width: "25.6%" },
    hotspot: { left: "39.4%", top: "54.1%", width: "22.0%", height: "9.4%" },
    compressY: "0%",
  },
  {
    id: "pages",
    asset: pageAsset,
    zIndex: 2,
    placement: { left: "39.2%", top: "62.5%", width: "22.6%" },
    hotspot: { left: "41.0%", top: "63.6%", width: "19.0%", height: "8.7%" },
    compressY: "-60%",
  },
  {
    id: "cell",
    asset: cellAsset,
    zIndex: 1,
    placement: { left: "41.0%", top: "72.0%", width: "18.7%" },
    hotspot: { left: "42.5%", top: "72.9%", width: "15.8%", height: "7.9%" },
    compressY: "-170%",
  },
];

function assetSrc(asset) {
  return asset.src ?? asset;
}

export default function NandHierarchy() {
  const sectionRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);     
  const [selected, setSelected] = useState(null);
  const [hasStacked, setHasStacked] = useState(false);
  const [closing, setClosing] = useState(null);

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

  function selectPart(key) {
    if (selected === key) {
      setClosing(key);
      setSelected(null);
      setTimeout(() => setClosing((current) => (current === key ? null : current)), 500);
    } else {
      setClosing(null);
      setSelected(key);
    }
  }

  const activeKey = selected ?? closing;
  const activePart = activeKey ? hierarchyParts[activeKey] : null;
  const isClosing = !selected && Boolean(closing);
  const highlightedKey = selected;

  return (
    <section 
      ref={sectionRef}
      className={`adeos-g9-component adeos-g9-nand-hierarchy${hasEntered ? " adeos-g9-nand-hierarchy--entered" : ""}`}
      aria-labelledby="adeos-g9-nand-hierarchy-title">
      <img
        className="adeos-g9-component__bg adeos-g9-nand-hierarchy__background-elements"
        src={assetSrc(backgroundElements)}
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
        width="1440"
        height="810"
      />

      <header className="adeos-g9-nand-hierarchy__header">
        <h4 id="adeos-g9-nand-hierarchy-title">Inside NAND Flash: The Storage Hierarchy</h4>
      </header>

      <div className="adeos-g9-nand-hierarchy__stage">
        <div className="adeos-g9-nand-hierarchy__stack-art" aria-hidden="true">
          {stackLayers.map((layer) => (
            <img
              key={layer.id}
              className={`adeos-g9-nand-hierarchy__asset-layer ${highlightedKey === layer.id ? "adeos-g9-is-highlighted" : ""} ${!hasStacked ? "adeos-g9-is-stacking" : ""}`}
              onAnimationEnd={() => setHasStacked(true)}
              src={assetSrc(layer.asset)}
              decoding="async"
              style={{
                left: layer.placement.left,
                top: layer.placement.top,
                width: layer.placement.width,
                zIndex: layer.zIndex,
                "--compress-y": layer.compressY,
              }}
              alt=""
            />
          ))}
        </div>

        <svg className="adeos-g9-nand-hierarchy__connectors" viewBox="0 0 1440 810" preserveAspectRatio="none" aria-hidden="true">
          {activePart && (
            <g key={activeKey} className={`adeos-g9-is-active ${isClosing ? "adeos-g9-is-closing" : "adeos-g9-is-selected"}`}>
              <path d={activePart.line} />
              <circle cx={activePart.dot[0]} cy={activePart.dot[1]} r="7" />
              <circle cx={activePart.target[0]} cy={activePart.target[1]} r="6" />
            </g>
          )}
        </svg>

        <div className="adeos-g9-nand-hierarchy__hotspots" aria-label="NAND flash hierarchy layer selectors">
          {stackLayers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              className="adeos-g9-nand-hierarchy__hotspot"
              style={{
                left: layer.hotspot.left,
                top: layer.hotspot.top,
                width: layer.hotspot.width,
                height: layer.hotspot.height,
              }}
              onClick={() => selectPart(layer.id)}
              aria-label={`Toggle ${hierarchyParts[layer.id].title} description`}
              aria-pressed={selected === layer.id}
            />
          ))}
        </div>

        {activePart && (
            <button
              key={activeKey}
              type="button"
              className={`adeos-g9-nand-hierarchy__tile adeos-g9-nand-hierarchy__tile--${activeKey} adeos-g9-is-active ${isClosing ? "adeos-g9-is-closing" : "adeos-g9-is-selected"}`}
              onClick={() => selectPart(activeKey)}
              aria-pressed={!isClosing}
            >
              <img className="adeos-g9-nand-hierarchy__tile-border" src={assetSrc(activePart.border)} alt="" decoding="async" />
              <span className="adeos-g9-nand-hierarchy__tile-title">{activePart.title}</span>
              <span className="adeos-g9-nand-hierarchy__tile-body">{activePart.text}</span>
            </button>
        )}
      </div>

      {activePart && (
        <aside
          key={activeKey}
          className={`adeos-g9-nand-hierarchy__readout ${isClosing ? "adeos-g9-is-closing" : "adeos-g9-is-selected"}`}
          aria-live="polite"
        >
          <span>Selected layer</span>
          <strong>{activePart.title}</strong>
          <p>{activePart.text}</p>
        </aside>
      )}

      <style suppressHydrationWarning>{`
        .adeos-g9-component.adeos-g9-nand-hierarchy .adeos-g9-component__bg.adeos-g9-nand-hierarchy__background-elements {
          left: -16%;
          top: -10%;
          width: 150%;
          height: 128%;
          max-width: none;
          object-fit: fill;
        }

        .adeos-g9-nand-hierarchy__header {
          position: absolute;
          inset: 36px 24px auto;
          z-index: 6;
          text-align: center;
          pointer-events: none;
        }

        .adeos-g9-nand-hierarchy__header h4 {
          margin: 0;
          border: 0;
          color: #ffffff;
          font-family: "Tomorrow", "Noto Sans Variable", sans-serif;
          font-size: clamp(1.5rem, 5cqw, 2.5rem);
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1.08;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.88), 0 0 22px rgba(255, 255, 255, 0.62);
        }

        .adeos-g9-nand-hierarchy__stage {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
        }

        .adeos-g9-nand-hierarchy__stack-art,
        .adeos-g9-nand-hierarchy__connectors,
        .adeos-g9-nand-hierarchy__hotspots {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .adeos-g9-nand-hierarchy__stack-art {
          z-index: 1;
          pointer-events: none;
        }

        .adeos-g9-nand-hierarchy__asset-layer {
          position: absolute;
          height: auto;
          pointer-events: none;
          user-select: none;
          transition: opacity 0.12s ease, transform 0.12s ease;
        }

        .adeos-g9-nand-hierarchy__asset-layer.adeos-g9-is-highlighted {
          transform: translateY(-2px);
        }

        .adeos-g9-nand-hierarchy__connectors {
          z-index: 4;
          pointer-events: none;
          overflow: visible;
        }

        .adeos-g9-nand-hierarchy__connectors path {
          fill: none;
          stroke: var(--line);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .adeos-g9-nand-hierarchy__connectors circle {
          fill: #0b0d22;
          stroke: var(--line);
          stroke-width: 3;
          opacity: 0;
        }

        .adeos-g9-nand-hierarchy__connectors g:not(.adeos-g9-is-active) {
          opacity: 0;
        }

        .adeos-g9-nand-hierarchy__connectors g.adeos-g9-is-active circle {
          opacity: 1;
        }

        .adeos-g9-nand-hierarchy__hotspots {
          z-index: 7;
        }

        .adeos-g9-nand-hierarchy__hotspot {
          position: absolute;
          border: 0;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          transform: skewY(-10deg);
        }

        .adeos-g9-nand-hierarchy__hotspot:focus-visible {
          outline: 2px solid var(--green);
          outline-offset: 4px;
        }

        .adeos-g9-nand-hierarchy__tile {
          position: absolute;
          z-index: 3;
          border: 0;
          padding: 18px 18px 16px;
          color: var(--text);
          background: transparent;
          text-align: left;
          cursor: default;
          font-family: "Space Mono", "Noto Sans Variable", monospace;
          opacity: 0;
          pointer-events: none;
          transform: translateY(8px);
          transition: opacity 0.12s ease 0.18s, transform 0.12s ease 0.18s;
        }

        .adeos-g9-nand-hierarchy__tile::before {
          content: "";
          position: absolute;
          inset: 10px 10px 14px;
          z-index: 0;
          background: rgba(7, 18, 38, 0.72);
          clip-path: polygon(4% 12%, 10% 4%, 89% 4%, 96% 14%, 96% 86%, 89% 96%, 12% 96%, 4% 84%);
          pointer-events: none;
        }

        .adeos-g9-nand-hierarchy__tile.adeos-g9-is-active {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
          filter: none;
        }

        .adeos-g9-nand-hierarchy__tile-border {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          opacity: 0.98;
          filter: none;
          pointer-events: none;
          user-select: none;
        }

        .adeos-g9-nand-hierarchy__tile-title,
        .adeos-g9-nand-hierarchy__tile-body {
          position: relative;
          z-index: 2;
          display: block;
          margin-left: 4%;
        }

        .adeos-g9-nand-hierarchy__tile-title {
          margin-bottom: 10px;
          color: #ffffff;
          font-family: "Space Mono", "Noto Sans Variable", monospace;
          font-size: clamp(0.4rem, 2.2cqw, 1.4rem);
          font-weight: 500;
          line-height: 1;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.45);
        }

        .adeos-g9-nand-hierarchy__tile-body {
          color: var(--text);
          font-family: "Space Mono", "Noto Sans Variable", monospace;
          font-size: clamp(0.4rem, 1.2cqw, 1rem);
          letter-spacing: 0.5px;
          line-height: 1.12;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .adeos-g9-nand-hierarchy__tile.adeos-g9-is-active .adeos-g9-nand-hierarchy__tile-body {
          opacity: 1;
          transition-delay: 0.22s;
        }

        .adeos-g9-nand-hierarchy__tile--chip {
          left: 5.2%;
          top: 15.6%;
          width: 20%;
          min-height: 190px;
          padding: 20px 18px 18px;
        }

        .adeos-g9-nand-hierarchy__tile--die {
          right: 5.1%;
          top: 16.0%;
          width: 20.2%;
          min-height: 190px;
          padding: 22px 19px 18px;
        }

        .adeos-g9-nand-hierarchy__tile--planes {
          left: 3.0%;
          top: 43.5%;
          width: 25.4%;
          min-height: 155px;
          padding: 17px 20px 16px;
        }

        .adeos-g9-nand-hierarchy__tile--blocks {
          right: 4.6%;
          top: 44.9%;
          width: 23.2%;
          min-height: 172px;
          padding: 18px 20px 16px;
        }

        .adeos-g9-nand-hierarchy__tile--pages {
          left: 4.2%;
          top: 68.8%;
          width: 24.0%;
          min-height: 145px;
          padding: 17px 21px 30px;
        }

        .adeos-g9-nand-hierarchy__tile--cell {
          right: 5.2%;
          top: 72.0%;
          width: 28.6%;
          min-height: 159px;
          padding: 17px 22px 40px;
        }

        .adeos-g9-nand-hierarchy__readout {
          display: none;
          margin: 0 18px 18px;
          padding: 14px 16px;
          border: 1px solid rgba(101, 251, 255, 0.58);
          background: rgba(3, 10, 24, 0.78);
          box-shadow: 0 0 18px rgba(101, 251, 255, 0.16);
        }

        .adeos-g9-nand-hierarchy__readout span {
          display: block;
          color: var(--muted);
          font-size: 0.72rem;
          text-transform: uppercase;
        }

        .adeos-g9-nand-hierarchy__readout strong {
          display: block;
          margin-top: 2px;
          color: #ffffff;
          font-family: "Space Mono", "Noto Sans Variable", monospace;
          font-size: 18.6px;
        }

        .adeos-g9-nand-hierarchy__readout p {
          margin: 8px 0 0;
          color: var(--text);
          font-family: "Space Mono", "Noto Sans Variable", monospace;
          font-size: 10.5px;
          line-height: 1.45;
        }

        @media (max-width: 900px) {
          body:has(.adeos-g9-flash-memory-page) .adeos-g9-component.adeos-g9-nand-hierarchy {
            display: flex;
            flex-direction: column;
            aspect-ratio: auto;
            min-height: 0;
          }

          .adeos-g9-nand-hierarchy__stage {
            position: relative;
            inset: auto;
            flex: 0 0 clamp(460px, 62vw, 560px);
            height: clamp(460px, 62vw, 560px);
          }

          .adeos-g9-nand-hierarchy__header {
            inset: 28px 16px auto;
          }

          .adeos-g9-nand-hierarchy__header h4 {
            font-size: 28px;
          }

          .adeos-g9-nand-hierarchy__stack-art,
          .adeos-g9-nand-hierarchy__hotspots {
            top: 82px;
            height: 360px;
          }

          .adeos-g9-nand-hierarchy__connectors {
            display: none;
          }

          .adeos-g9-nand-hierarchy__tile {
            display: none;
          }

          .adeos-g9-nand-hierarchy__readout {
            display: block;
            position: relative;
            z-index: 8;
            width: auto;
            margin: 0 18px 18px;
            padding: 16px 18px 18px;
            border: 1px solid rgba(101, 251, 255, 0.58);
            background: rgba(3, 10, 24, 0.9);
            box-shadow: 0 0 18px rgba(101, 251, 255, 0.16);
          }

          .adeos-g9-nand-hierarchy__readout.adeos-g9-is-selected {
            animation: adeos-g9-readout-in 0.22s ease-out both;
          }

          .adeos-g9-nand-hierarchy__readout.adeos-g9-is-closing {
            animation: adeos-g9-fade-out 0.2s ease-out forwards;
          }

          .adeos-g9-nand-hierarchy__readout span {
            letter-spacing: 0;
          }

          .adeos-g9-nand-hierarchy__readout strong {
            font-size: 1.1rem;
          }

          .adeos-g9-nand-hierarchy__readout p {
            font-size: 0.82rem;
            line-height: 1.55;
          }
        }

        @media (max-width: 560px) {
          body:has(.adeos-g9-flash-memory-page) .adeos-g9-component.adeos-g9-nand-hierarchy {
            min-height: 0;
          }

          .adeos-g9-nand-hierarchy__stage {
            flex-basis: 420px;
            height: 420px;
          }

          .adeos-g9-nand-hierarchy__header {
            inset: 26px 14px auto;
          }

          .adeos-g9-nand-hierarchy__header h4 {
            font-size: 24px;
          }

          .adeos-g9-nand-hierarchy__stack-art,
          .adeos-g9-nand-hierarchy__hotspots {
            top: 88px;
            height: 295px;
          }

          .adeos-g9-nand-hierarchy__readout {
            margin: 0 12px 12px;
            padding: 14px 15px 16px;
          }
        }

        /*--- ANIMATIONS ---*/
        /*stack in animation*/
        @keyframes stack-in {
          0% {
            transform: translateY(var(--compress-y)) scale(0.7);
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .adeos-g9-nand-hierarchy--entered .adeos-g9-nand-hierarchy__asset-layer.adeos-g9-is-stacking {
          animation: stack-in 5s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: 0.3s;
        }

        /* hover animations */
        .adeos-g9-nand-hierarchy__stage {
          --lerp-0: 1;
          --lerp-1: 0.5625;
          --lerp-2: 0.25;
        }

        .adeos-g9-nand-hierarchy__asset-layer {
          transition: transform 0.2s;
        }

        /* hovered layer */
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(1):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(1),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(2):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(2),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(3):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(3),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(4):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(4),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(5):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(5),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(6):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(6) {
          transform: scale(calc(1 + var(--lerp-0) * 0.25));
          z-index: 10;
        }

        /* neighbor layers */
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(1):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(2),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(2):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(1),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(2):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(3),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(3):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(2),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(3):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(4),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(4):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(3),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(4):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(5),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(5):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(4),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(5):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(6),
        .adeos-g9-nand-hierarchy__stage:has(.adeos-g9-nand-hierarchy__hotspot:nth-child(6):hover) .adeos-g9-nand-hierarchy__asset-layer:nth-child(5) {
          transform: scale(calc(1 + var(--lerp-1) * 0.15));
          z-index: 9;
        }

        @keyframes adeos-g9-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes adeos-g9-fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes adeos-g9-readout-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .adeos-g9-nand-hierarchy__tile.adeos-g9-is-selected,
        .adeos-g9-nand-hierarchy__connectors g.adeos-g9-is-selected {
          animation: adeos-g9-fade-in 0.5s ease-out forwards;
        }

        .adeos-g9-nand-hierarchy__tile.adeos-g9-is-closing,
        .adeos-g9-nand-hierarchy__connectors g.adeos-g9-is-closing {
          animation: adeos-g9-fade-out 0.5s ease-out forwards;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .adeos-g9-nand-hierarchy__readout {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}