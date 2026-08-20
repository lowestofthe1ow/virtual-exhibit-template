import { useEffect, useState } from "react";
import background from "../../assets/s04g9/ADEOS_Group9_GarbageCollectionBG.svg";

const initialBlockA = [
  { id: "page-1", status: "valid" },
  { id: "page-2", status: "invalid" },
  { id: "page-3", status: "valid" },
  { id: "page-4", status: "invalid" },
];

const initialBlockB = [
  { id: "new-1", status: "empty" },
  { id: "new-2", status: "empty" },
  { id: "new-3", status: "empty" },
  { id: "new-4", status: "empty" },
];

function assetSrc(asset) {
  return asset.src ?? asset;
}

function pageClass(page, index) {
  return [
    "gc-page",
    `gc-page--${page.status}`,
    page.isActive ? "gc-page--active" : "",
    page.status === "erased" ? "gc-page--erased" : "",
    `gc-page--step-${index + 1}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function pageLabel(page) {
  if (page.status === "erased") return "Erased";
  if (page.status === "empty") return "Empty";
  return page.status === "valid" ? "Valid" : "Invalid";
}

export default function GarbageCollection() {
  const [blockA, setBlockA] = useState(initialBlockA.map((page) => ({ ...page })));
  const [blockB, setBlockB] = useState(initialBlockB.map((page) => ({ ...page })));
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState("highlight");

  useEffect(() => {
    setBlockA((prev) =>
      prev.map((page, index) => ({
        ...page,
        isActive: index === activeIndex && page.status !== "erased",
      }))
    );
  }, [activeIndex]);

  useEffect(() => {
    const activePage = blockA[activeIndex];
    let timer;

    if (!activePage) {
      setActiveIndex(0);
      setPhase("highlight");
      return;
    }

    if (phase === "highlight") {
      timer = window.setTimeout(
        () => setPhase("transfer"),
        activePage.status === "valid" ? 1500 : 1000
      );
    } else if (phase === "transfer") {
      timer = window.setTimeout(() => {
        if (activePage.status === "valid") {
          setBlockB((prev) =>
            prev.map((page, index) =>
              index === activeIndex ? { ...page, status: "valid" } : page
            )
          );
        }
        setPhase("erase");
      }, 500);
    } else if (phase === "erase") {
      timer = window.setTimeout(() => {
        setBlockA((prev) =>
          prev.map((page, index) =>
            index === activeIndex
              ? { ...page, status: "erased", isActive: false }
              : page
          )
        );
        setPhase("next");
      }, 700);
    } else if (phase === "next") {
      timer = window.setTimeout(() => {
        const nextIndex = activeIndex + 1;
        if (nextIndex >= initialBlockA.length) {
          setBlockA(initialBlockA.map((page) => ({ ...page })));
          setBlockB(initialBlockB.map((page) => ({ ...page })));
          setActiveIndex(0);
        } else {
          setActiveIndex(nextIndex);
        }
        setPhase("highlight");
      }, 1200);
    }

    return () => window.clearTimeout(timer);
  }, [activeIndex, blockA, phase]);

  const validPages = blockA.filter((page) => page.status === "valid");
  const arrowActive = phase === "transfer";

  return (
    <>
      <section className="adeos-g9-component garbage-collection" aria-labelledby="garbage-collection-title">
        <img
          className="adeos-g9-component__bg"
          src={assetSrc(background)}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
        />

        <header className="garbage-collection__header">
          <h4 id="garbage-collection-title">Garbage Collection in SSD</h4>
        </header>

        <div className="garbage-collection__stage" aria-hidden="true">
          <div className="garbage-collection__layout">
            <div className="garbage-collection__block garbage-collection__block--old">
              <span className="gc-block__label">Block A (old)</span>
              <div className="gc-pages">
                {blockA.map((page, index) => (
                  <span key={page.id} className={pageClass(page, index)}>
                    {pageLabel(page)}
                  </span>
                ))}
              </div>
            </div>

            <div className="garbage-collection__transition" aria-hidden="true">
              <div className={`gc-arrow-line ${arrowActive ? "gc-arrow-line--active" : ""}`} />
              <div className="gc-arrow-head" />
            </div>

            <div className="garbage-collection__block garbage-collection__block--new">
              <span className="gc-block__label">Block B (new)</span>
              <div className="gc-pages">
                {blockB.map((page, index) => (
                  <span key={page.id} className={`gc-page gc-page--new gc-page--${page.status} gc-page--step-${index + 1}`}>
                    {pageLabel(page)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style suppressHydrationWarning>{`
          .garbage-collection {
            position: relative;
            min-height: 52vh;
            overflow: hidden;
          }

          .garbage-collection .adeos-g9-component__bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.94;
            pointer-events: none;
          }

          .garbage-collection__header {
            position: absolute;
            inset: 4% auto auto 50%;
            transform: translateX(-50%);
            z-index: 2;
            width: min(92%, 800px);
            text-align: center;
          }

          .garbage-collection__header h4 {
            margin: 0;
            font-family: "Tomorrow", "Noto Sans Variable", sans-serif;
            font-size: clamp(1.5rem, 2.5vw, 2.4rem);
            letter-spacing: 0;
            line-height: 1.02;
            text-shadow: 0 0 18px rgba(101, 251, 255, 0.22);
          }

          .garbage-collection__header p {
            margin: 1rem auto 0;
            max-width: 700px;
            color: rgba(255, 255, 255, 0.88);
            font-size: clamp(0.92rem, 1.1vw, 1.1rem);
            line-height: 1.7;
          }

          .garbage-collection__stage {
            position: absolute;
            inset: 0;
            display: grid;
            place-items: start center;
            padding: 8% 1rem 1rem;
            z-index: 2;
          }

          .garbage-collection__layout {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            gap: 1.5rem;
            width: min(92%, 960px);
            max-width: 100%;
          }

          .garbage-collection__block {
            width: min(280px, 100%);
            padding: 1rem;
            border-radius: 24px;
            background: rgba(4, 9, 22, 0.72);
            border: 1px solid rgba(101, 251, 255, 0.14);
            box-shadow: inset 0 0 24px rgba(0, 255, 200, 0.08);
            display: grid;
            gap: 0.95rem;
            z-index: 2;
          }

          .garbage-collection__block--old {
            animation: gc-block-pulse 4s ease-in-out infinite;
          }

          .garbage-collection__block--new {
            animation: gc-block-glow 4s ease-in-out infinite;
          }

          .gc-block__label {
            color: #72f7ff;
            font: 700 0.95rem "Space Mono", monospace;
            text-align: center;
            letter-spacing: 0.12em;
          }

          .gc-pages {
            display: grid;
            gap: 0.8rem;
            margin-top: 0.4rem;
          }

          .gc-page {
            position: relative;
            overflow: hidden;
            min-height: 2.4rem;
            border-radius: 999px;
            padding: 0.85rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font: 0.78rem "Space Mono", monospace;
            color: rgba(255, 255, 255, 0.88);
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1;
            transition: transform 0.35s ease, background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
          }

          .gc-page--active {
            transform: scale(1.02);
            background: rgba(102, 255, 255, 0.12);
            border-color: rgba(102, 255, 255, 0.32);
            color: #e8ffff;
            box-shadow: 0 0 24px rgba(101, 251, 255, 0.18);
          }

          .gc-page--erased {
            color: rgba(220, 220, 220, 0.9);
            background: rgba(95, 95, 110, 0.3);
            border-color: rgba(165, 165, 175, 0.34);
          }

          .gc-page--empty {
            color: rgba(170, 255, 226, 0.78);
            background: rgba(0, 255, 170, 0.08);
            border-color: rgba(0, 255, 170, 0.18);
          }

          .gc-page::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: rgba(101, 251, 255, 0.18);
            transform-origin: left;
            transform: scaleX(0);
            opacity: 0;
            z-index: -1;
          }

          .gc-page--valid::after {
            animation: gc-page-fill 4s ease-in-out infinite;
          }

          .gc-page--invalid {
            color: rgba(255, 132, 142, 0.96);
          }

          .gc-page--invalid::after {
            background: rgba(255, 84, 112, 0.2);
            animation: gc-page-invalid 4s ease-in-out infinite;
          }

          .gc-page--new.gc-page--valid::after {
            animation: gc-page-new 4s ease-in-out infinite;
          }

          .gc-page--new.gc-page--empty::after {
            opacity: 0.08;
            transform: scaleX(1);
          }

          .gc-page--step-1::after {
            animation-delay: 0.2s;
          }
          .gc-page--step-2::after {
            animation-delay: 0.55s;
          }
          .gc-page--step-3::after {
            animation-delay: 0.9s;
          }
          .gc-page--step-4::after {
            animation-delay: 1.2s;
          }

          .garbage-collection__transition {
            display: grid;
            place-items: center;
            gap: 0.7rem;
          }

          .gc-arrow-line {
            width: 2px;
            height: 7rem;
            background: linear-gradient(180deg, rgba(101, 251, 255, 0), rgba(101, 251, 255, 0.75), rgba(101, 251, 255, 0));
            opacity: 0.25;
            transition: opacity 0.35s ease;
          }

          .gc-arrow-line--active {
            opacity: 1;
          }

          .gc-arrow-head {
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 14px solid rgba(0, 255, 200, 0.96);
          }

          @keyframes gc-page-fill {
            0%, 18% { transform: scaleX(0); opacity: 0; }
            28%, 62% { transform: scaleX(1); opacity: 1; }
            70%, 100% { transform: scaleX(1); opacity: 1; }
          }

          @keyframes gc-page-invalid {
            0%, 24% { transform: scaleX(0); opacity: 0.12; }
            30%, 44% { transform: scaleX(1); opacity: 0.28; }
            50%, 100% { transform: scaleX(0); opacity: 0.08; }
          }

          @keyframes gc-page-new {
            0%, 30% { transform: scaleX(0); opacity: 0; }
            40%, 80% { transform: scaleX(1); opacity: 1; }
            90%, 100% { transform: scaleX(1); opacity: 1; }
          }

          @keyframes gc-arrow-flow {
            0% { transform: translateY(0); }
            50% { transform: translateY(14px); }
            100% { transform: translateY(0); }
          }

          @keyframes gc-block-pulse {
            0%, 100% { box-shadow: inset 0 0 18px rgba(0, 255, 200, 0.08); }
            50% { box-shadow: inset 0 0 38px rgba(0, 255, 200, 0.24); }
          }

          @keyframes gc-block-glow {
            0%, 100% { box-shadow: inset 0 0 22px rgba(0, 255, 180, 0.08); }
            55% { box-shadow: inset 0 0 48px rgba(0, 255, 180, 0.2); }
          }

          @media (max-width: 860px) {
            .garbage-collection__layout {
              flex-direction: column;
              align-items: center;
            }

            .gc-arrow-line {
              height: 4.5rem;
            }
          }

          @media (max-width: 620px) {
            .garbage-collection__header h4 {
              font-size: 2rem;
            }

            .garbage-collection__stage {
              padding: 18% 1rem 1rem;
            }

            .gc-arrow-line {
              height: 3.8rem;
            }
          }
        `}</style>
      </section>
    </>
  );
}
