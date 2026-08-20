import { useState, useEffect } from 'react';

export default function Gallery({ title, subtitle, milestones, accent = '#f59e0b' }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex !== null ? milestones[selectedIndex] : null;

  const close = () => setSelectedIndex(null);
  const next = () => setSelectedIndex((i) => (i + 1) % milestones.length);
  const prev = () => setSelectedIndex((i) => (i - 1 + milestones.length) % milestones.length);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIndex, milestones.length]);

  return (
    <>
      <div className="py-20">
        <div className="text-center mb-14 px-6 md:px-16">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: accent, opacity: 0.85 }}>
            {subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>

        <div className="w-full overflow-x-auto pb-6 px-6 md:px-16">
          <div className="flex items-center gap-10 w-max mx-auto">
            {milestones.map((m, i) => (
              <button
                key={m.year + m.title}
                onClick={() => setSelectedIndex(i)}
                className="group flex flex-col items-center flex-none focus:outline-none opacity-0"
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <h3 className="font-semibold text-center mb-3 w-64 text-white/90 text-sm md:text-base">
                  {m.title}
                </h3>

                <div
                  className="relative w-64 h-64 md:w-72 md:h-72 rounded-lg overflow-hidden border transition-shadow duration-300"
                  style={{ borderColor: `${accent}40` }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 30px ${accent}55`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <img
                    src={m.img.src}
                    alt={m.title}
                    className="w-full h-full object-cover grayscale-[20%] transition-all duration-500 ease-out group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <span
                      className="text-white text-xs tracking-wide uppercase px-3 py-1 rounded-full"
                      style={{ background: `${accent}dd` }}
                    >
                      View details
                    </span>
                  </div>
                </div>

                <p
                  className="mt-3 text-base font-mono text-black rounded-full px-6 py-1 group-hover:scale-105 transition-transform"
                  style={{ background: accent }}
                >
                  {m.year}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
          onClick={close}
        >
          <div
            className="relative bg-white rounded-xl p-6 md:p-8 w-[700px] max-w-[90%] max-h-[85vh] overflow-y-auto"
            style={{ animation: 'scaleIn 0.2s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            {milestones.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous milestone"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black transition"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Next milestone"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black transition"
                >
                  ›
                </button>
              </>
            )}

            <span className="font-mono text-sm font-semibold" style={{ color: accent }}>
              {selected.year}
            </span>
            <h2 className="text-2xl font-bold mb-4 mt-1">{selected.title}</h2>

            <div className="mb-4">
              <img
                src={selected.img.src}
                alt={selected.title}
                className="w-full max-h-[400px] object-contain rounded-lg"
              />
            </div>

            <p className="text-gray-700 leading-relaxed">{selected.desc}</p>

            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-gray-400">
                {selectedIndex + 1} / {milestones.length}
              </span>
              <button
                onClick={close}
                className="text-white px-5 py-2 rounded hover:opacity-90 transition"
                style={{ background: accent }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}