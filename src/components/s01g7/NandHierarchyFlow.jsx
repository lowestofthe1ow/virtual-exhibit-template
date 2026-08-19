import { useEffect, useRef, useState } from 'react';

const TIERS = [
  { key: 'package', name: 'PACKAGE', meta: 'multiple dies', width: 100 },
  { key: 'die', name: 'DIE \u2192 PLANE', meta: 'one silicon die', width: 58 },
  { key: 'block', name: 'BLOCK', meta: 'erase unit, ~128\u2013256 pages', width: 22 },
  { key: 'page', name: 'PAGE', meta: 'write unit, 4\u201316 KB', width: 9 },
  { key: 'cell', name: 'CELL', meta: 'floating-gate transistor', width: 2 },
];

const CYCLE_MS = 1300;

export default function NandHierarchyFlow() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !intervalRef.current) {
          setActiveIndex(0);
          intervalRef.current = setInterval(() => {
            setActiveIndex((i) => (i + 1) % TIERS.length);
          }, CYCLE_MS);
        } else if (!entry.isIntersecting && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setActiveIndex(-1);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="nand-hierarchy" ref={containerRef}>
      {TIERS.map((tier, i) => {
        const isActive = i === activeIndex;
        const filled = activeIndex >= 0 && i <= activeIndex;
        return (
          <div key={tier.key} className={`nand-tier tier-${tier.key}${isActive ? ' is-active' : ''}`}>
            <div className="nand-tier-name">{tier.name}</div>
            <div className="nand-tier-bar-wrap">
              <div
                className="nand-tier-bar"
                style={{ width: filled ? `${tier.width}%` : '0%' }}
              />
            </div>
            <div className="nand-tier-meta">{tier.meta}</div>
          </div>
        );
      })}
    </div>
  );
}
