import { Fragment, useEffect, useRef, useState } from 'react';

const STEPS = [
  { label: ['Digital Data', '(0s & 1s)'] },
  { label: ['Encoding Algorithm'] },
  { bases: true },
  { label: ['DNA Synthesis'] },
  { label: ['Stored in DNA Capsule'] },
  { label: ['DNA Sequencing'] },
  { label: ['Retrieved Digital Data'] },
];

const INTERVAL = 1000;

export default function DnaProcessFlow() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timer = null;
    let i = 0;

    const tick = () => {
      setActive(i);
      i = (i + 1) % STEPS.length;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !timer) {
            i = 0;
            tick();
            timer = setInterval(tick, INTERVAL);
          } else if (!entry.isIntersecting && timer) {
            clearInterval(timer);
            timer = null;
            setActive(-1);
            i = 0;
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      if (timer) clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="dna-diagram" ref={containerRef}>
      {STEPS.map((step, idx) => (
        <Fragment key={idx}>
          {idx > 0 && <span className="dna-arrow">→</span>}
          <div className={`dna-step${active === idx ? ' is-active' : ''}`}>
            {step.bases ? (
              <div className="dna-bases">
                <span className="dna-base base-a">A</span>
                <span className="dna-base base-t">T</span>
                <span className="dna-base base-c">C</span>
                <span className="dna-base base-g">G</span>
              </div>
            ) : (
              step.label.map((line, li) => (
                <span key={li}>
                  {line}
                  {li < step.label.length - 1 && <br />}
                </span>
              ))
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
