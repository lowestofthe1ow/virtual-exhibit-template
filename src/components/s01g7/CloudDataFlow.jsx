import { Fragment, useEffect, useRef, useState } from 'react';

const STEPS = [
  { accent: 'cyan', icon: '💻', label: ['Request File', 'User Device'] },
  { accent: 'magenta', icon: '🌐', label: ['Internet'] },
  { accent: 'cyan', icon: '☁️', label: ['Cloud Platform'] },
  {
    accent: 'magenta',
    parallel: [
      { icon: '🗂️', label: 'Index' },
      { icon: '🏷️', label: 'Metadata' },
    ],
  },
  { accent: 'green', icon: '⚡', label: ['Cache'] },
  { accent: 'cyan', icon: '🖥️', label: ['Storage Servers'] },
  { accent: 'magenta', icon: '📄', label: ['Requested File'] },
  { accent: 'cyan', icon: '💻', label: ['User Device'] },
];

const INTERVAL = 1100;

export default function CloudDataFlow() {
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
    <div className="flow-diagram-wrap">
      <div className="flow-diagram" ref={containerRef}>
        {STEPS.map((step, idx) => (
          <Fragment key={idx}>
            {idx > 0 && (
              <div className={`flow-connector${active === idx ? ' is-active' : ''}`} />
            )}
            {step.parallel ? (
              <div
                className={`flow-step flow-parallel${active === idx ? ' is-active' : ''}`}
                data-accent={step.accent}
              >
                {step.parallel.map((p, pi) => (
                  <div className="flow-parallel-item" key={pi}>
                    <div className="flow-icon flow-icon-sm">{p.icon}</div>
                    <div className="flow-label">{p.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`flow-step${active === idx ? ' is-active' : ''}`}
                data-accent={step.accent}
              >
                <div className="flow-icon">{step.icon}</div>
                <div className="flow-label">
                  {step.label.map((line, li) => (
                    <span key={li}>
                      {line}
                      {li < step.label.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
