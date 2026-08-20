export default function Breadcrumb({ currentView, setCurrentView }) {
  const steps = [
    { key: 'start', label: 'Home' },
    { key: 'foundation', label: 'Foundations' },
    { key: 'structure', label: 'Structure' },
    { key: 'birth', label: 'Birth' },
    { key: 'game', label: 'Game' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentView);
  if (currentIndex === -1) return null; // hidden on the start screen

  return (
    <div className="flex items-center justify-center gap-2 pt-10 pb-2 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView(step.key)}
            className={`text-xs md:text-sm tracking-wide uppercase transition-colors ${
              i === currentIndex
                ? 'text-white font-semibold'
                : i < currentIndex
                ? 'text-white/50 hover:text-white/80'
                : 'text-white/25 hover:text-white/50'
            }`}
          >
            {step.label}
          </button>
          {i < steps.length - 1 && <span className="text-white/20">—</span>}
        </div>
      ))}
    </div>
  );
}