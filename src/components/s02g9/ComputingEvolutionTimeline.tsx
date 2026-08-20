import React, { useMemo, useState } from 'react';

type TimelineMode = 'history' | 'computing' | 'both';

type EvolutionEvent = {
  title: string;
  description: string;
  mode: 'history' | 'computing';
};

const historyEvents: EvolutionEvent[] = [
  { title: 'Caesar Cipher', description: 'Rule-based transformation and algorithmic thinking.', mode: 'history' },
  { title: 'Vigenère Cipher', description: 'More complex stateful encryption and repeated-key logic.', mode: 'history' },
  { title: 'Rotor Machines', description: 'Mechanical state changes and repeated transformations.', mode: 'history' },
  { title: 'Bombe', description: 'Automated search and logical elimination.', mode: 'history' },
  { title: 'Colossus', description: 'Electronic logic and high-speed digital testing.', mode: 'history' },
  { title: 'Harvard Mark I', description: 'Sequential computation and automatic control.', mode: 'history' },
  { title: 'ENIAC', description: 'General-purpose arithmetic and electronic programming.', mode: 'history' },
  { title: 'UNIVAC', description: 'Business data processing and practical computation.', mode: 'history' }
];

const computingEvents: EvolutionEvent[] = [
  { title: 'Algorithms', description: 'Cryptographic methods introduced repeatable, rule-based procedures.', mode: 'computing' },
  { title: 'Automation', description: 'Rotor and codebreaking systems replaced manual trial and error.', mode: 'computing' },
  { title: 'Automated Search', description: 'The Bombe made machine-driven search practical.', mode: 'computing' },
  { title: 'Electronic Logic', description: 'Colossus demonstrated fast digital circuits.', mode: 'computing' },
  { title: 'Automatic Computation', description: 'The Mark I made sequence control real.', mode: 'computing' },
  { title: 'Programmability', description: 'ENIAC introduced flexible problem-solving through configuration.', mode: 'computing' },
  { title: 'Commercial Computing', description: 'UNIVAC moved computers into business workflows.', mode: 'computing' },
  { title: 'Modern Computing', description: 'Modern systems inherit these ideas through processors, memory, and software.', mode: 'computing' }
];

const ComputingEvolutionTimeline: React.FC = () => {
  const [mode, setMode] = useState<TimelineMode>('both');

  const visibleEvents = useMemo(() => {
    if (mode === 'history') return historyEvents;
    if (mode === 'computing') return computingEvents;
    return [...historyEvents, ...computingEvents];
  }, [mode]);

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">Computing Evolution Timeline</h3>
        <p className="rotor-explainer-text">This optional layer runs beside the historical timeline and shows how each cryptographic breakthrough contributed to computing ideas like automation, logic, storage, and programmability.</p>
      </div>

      <div className="button-group">
        <button className={`btn btn-secondary ${mode === 'history' ? 'active' : ''}`} onClick={() => setMode('history')}>Historical Events</button>
        <button className={`btn btn-secondary ${mode === 'computing' ? 'active' : ''}`} onClick={() => setMode('computing')}>Computing Evolution</button>
        <button className={`btn btn-secondary ${mode === 'both' ? 'active' : ''}`} onClick={() => setMode('both')}>Both Combined</button>
      </div>

      <div className="timeline-rail">
        {visibleEvents.map((event, index) => (
          <div key={`${event.title}-${index}`} className="timeline-rail__item">
            <div className="timeline-rail__dot" />
            <div className="timeline-rail__card">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComputingEvolutionTimeline;
