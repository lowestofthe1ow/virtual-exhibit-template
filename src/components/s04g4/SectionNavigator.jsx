import { useEffect, useMemo, useState } from "react";

const SECTIONS = [
  { id: "shared-bus-problem", label: "Shared Bus Problem" },
  { id: "design-tradeoffs", label: "Design Trade-offs" },
  { id: "arbitration-modes", label: "Arbitration Modes" },
  { id: "simulator", label: "Simulator" },
];

const STORAGE_KEY = "bus-arb-last-section";

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SectionNavigator() {
  const [open, setOpen] = useState(false);
  const [lastSection, setLastSection] = useState(SECTIONS[0].id);

  const sectionMap = useMemo(
    () => Object.fromEntries(SECTIONS.map((section) => [section.id, section.label])),
    []
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && sectionMap[saved]) {
      setLastSection(saved);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionMap[entry.target.id]) {
            localStorage.setItem(STORAGE_KEY, entry.target.id);
            setLastSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionMap]);

  return (
    <div className="title-nav" role="navigation" aria-label="Section navigation">
      <button
        className="title-nav__primary"
        onClick={() => scrollToSection(SECTIONS[0].id)}
      >
        Get Started
      </button>

      <div className="title-nav__continue-wrap">
        <button
          className="title-nav__secondary"
          onClick={() => scrollToSection(lastSection)}
        >
          Continue where you left off
        </button>
        <button
          className="title-nav__menu-toggle"
          aria-expanded={open}
          aria-label="Open section picker"
          onClick={() => setOpen((prev) => !prev)}
        >
          ▲
        </button>

        {open && (
          <div className="title-nav__menu">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                className={`title-nav__menu-item${section.id === lastSection ? " is-current" : ""}`}
                onClick={() => {
                  scrollToSection(section.id);
                  setOpen(false);
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
