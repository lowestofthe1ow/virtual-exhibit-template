import { animate } from 'animejs';
import { useMemo, useRef, useState } from 'react';

type Question = {
  prompt: string;
  setup: string;
  answer: number;
  unit: string;
};

const questions: Question[] = [
  {
    prompt: 'Velocity 10,000 mi/h for 0.5 h',
    setup: 'Distance = velocity x time',
    answer: 5000,
    unit: 'mi',
  },
  {
    prompt: 'Burn correction 42 m/s for 12 s',
    setup: 'Delta distance = rate x time',
    answer: 504,
    unit: 'm',
  },
  {
    prompt: 'Signal delay 1.28 s at 300,000 km/s',
    setup: 'Range = signal speed x delay',
    answer: 384000,
    unit: 'km',
  },
  {
    prompt: 'Computer cycle 85,000 ops/s for 2 s',
    setup: 'Operations = rate x time',
    answer: 170000,
    unit: 'ops',
  },
];

export default function TrajectoryComputer() {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Awaiting manual verification.');
  const [statusKind, setStatusKind] = useState<'idle' | 'success' | 'error'>('idle');
  const [complete, setComplete] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);

  const current = questions[Math.min(step, questions.length - 1)];
  const progress = useMemo(() => Math.round((step / questions.length) * 100), [step]);

  const runFeedback = (selector: string) => {
    const target = moduleRef.current?.querySelector(selector);
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    animate(target, {
      scale: [0.98, 1],
      opacity: [0.7, 1],
      duration: 420,
      ease: 'outExpo',
    });
  };

  const handleSubmit = () => {
    const numeric = Number(value.replace(/,/g, '').trim());

    if (!Number.isFinite(numeric)) {
      setStatus('Enter a number before transmitting this checkpoint.');
      setStatusKind('error');
      runFeedback('.trajectory-status');
      return;
    }

    if (numeric <= 0) {
      setStatus('Trajectory values must be greater than zero. Recheck the prompt and try again.');
      setStatusKind('error');
      runFeedback('.trajectory-status');
      return;
    }

    const tolerance = Math.max(1, current.answer * 0.005);
    const isCorrect = Math.abs(numeric - current.answer) <= tolerance;

    if (!isCorrect) {
      setStatus(
        `Checkpoint outside tolerance. Recalculate ${current.setup.toLowerCase()} and transmit again.`
      );
      setStatusKind('error');
      runFeedback('.trajectory-status');
      return;
    }

    const nextStep = step + 1;
    setValue('');
    setStep(nextStep);
    setComplete(nextStep >= questions.length);
    setStatus(
      nextStep >= questions.length
        ? 'Trajectory verified. Manual computation and machine guidance agree.'
        : 'Point accepted. The next correction is ready.'
    );
    setStatusKind('success');
    runFeedback('.trajectory-progress-fill');
  };

  const handleReset = () => {
    setStep(0);
    setValue('');
    setComplete(false);
    setStatus('Awaiting manual verification.');
    setStatusKind('idle');
  };

  return (
    <div className="interactive-module trajectory-module" ref={moduleRef}>
      <div className="module-copy">
        <h3>Manual trajectory computation</h3>
        <p>
          Apollo relied on people and machines checking each other. Solve each compact calculation
          to move the spacecraft along the plotted path.
        </p>
      </div>

      <div className="trajectory-map" aria-hidden="true">
        <svg viewBox="0 0 720 220" role="img">
          <path
            className="trajectory-grid"
            d="M30 180 H690 M30 120 H690 M30 60 H690 M90 20 V200 M210 20 V200 M330 20 V200 M450 20 V200 M570 20 V200"
          />
          <path
            className="trajectory-line"
            d="M45 178 C170 145 235 105 330 105 C455 105 520 55 675 34"
          />
          <circle className="earth-mark" cx="45" cy="178" r="14" />
          <circle className="moon-mark" cx="675" cy="34" r="18" />
          <circle
            className="craft-mark"
            cx={45 + progress * 6.3}
            cy={178 - progress * 1.44}
            r="7"
          />
        </svg>
      </div>

      <div
        className="trajectory-progress"
        role="progressbar"
        aria-label="Trajectory verification progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span
          className="trajectory-progress-fill"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      <form
        className="mission-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label htmlFor="trajectory-answer">
            Compute point {Math.min(step + 1, questions.length)} of {questions.length}
          </label>
          <p className="data-line">{complete ? 'All plotted points verified' : current.prompt}</p>
          <p className="formula-line">{complete ? 'Mission path stable' : current.setup}</p>
          <p className="mission-hint" id="trajectory-hint">
            {complete
              ? 'Reset the check to run the trajectory again.'
              : 'Commas are accepted. Values must be positive.'}
          </p>
        </div>

        <div className="input-row">
          <input
            id="trajectory-answer"
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={complete}
            placeholder={complete ? 'complete' : 'enter result'}
            aria-invalid={statusKind === 'error'}
            aria-describedby="trajectory-hint trajectory-status"
          />
          <button type="submit" disabled={complete}>
            Transmit
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <p
        className="trajectory-status"
        id="trajectory-status"
        data-status={statusKind}
        aria-live="polite"
      >
        {status}
      </p>
    </div>
  );
}
