import React, { useMemo, useState } from 'react';

type MachineKey = 'bombe' | 'colossus' | 'mark1' | 'eniac' | 'univac';

type MachineProfile = {
  key: MachineKey;
  name: string;
  year: string;
  technology: string;
  purpose: string;
  programming: string;
  speed: string;
  electronic: string;
  memory: string;
  input: string;
  output: string;
  importance: string;
  contribution: string;
};

const machines: MachineProfile[] = [
  {
    key: 'bombe',
    name: 'Bombe',
    year: '1939',
    technology: 'Electromechanical',
    purpose: 'Search Enigma settings',
    programming: 'Set by wiring and rotor positions',
    speed: 'Very fast for the era',
    electronic: 'Mostly electromechanical',
    memory: 'No general memory; logical network',
    input: 'Rotor settings and crib guesses',
    output: 'Candidate keys',
    importance: 'Automated search',
    contribution: 'Large-scale logical elimination and search automation'
  },
  {
    key: 'colossus',
    name: 'Colossus',
    year: '1943',
    technology: 'Electronic',
    purpose: 'Analyze teleprinter traffic',
    programming: 'Programmed via switches and patching',
    speed: 'High-speed electronic processing',
    electronic: 'Electronic',
    memory: 'Limited, mostly working storage',
    input: 'Paper tape',
    output: 'Likely settings',
    importance: 'Electronic digital logic',
    contribution: 'Showed electronic logic could support computation'
  },
  {
    key: 'mark1',
    name: 'Harvard Mark I',
    year: '1944',
    technology: 'Electromechanical',
    purpose: 'Scientific calculation',
    programming: 'Sequenced instructions',
    speed: 'Slow but automatic',
    electronic: 'Mechanical and relay-based',
    memory: 'Registers and storage',
    input: 'Punch cards / paper tape',
    output: 'Printed results',
    importance: 'Automatic sequence control',
    contribution: 'Brought sequencing and stored instructions into practice'
  },
  {
    key: 'eniac',
    name: 'ENIAC',
    year: '1945',
    technology: 'Electronic',
    purpose: 'General arithmetic and scientific tasks',
    programming: 'Patch cables and switches',
    speed: 'Very fast for the time',
    electronic: 'Fully electronic',
    memory: 'Accumulator registers',
    input: 'Switches and patching',
    output: 'Display and printouts',
    importance: 'Flexible electronic computation',
    contribution: 'General-purpose programmable computing'
  },
  {
    key: 'univac',
    name: 'UNIVAC I',
    year: '1951',
    technology: 'Electronic',
    purpose: 'Business data processing',
    programming: 'Stored instructions and data workflows',
    speed: 'Fast commercial processing',
    electronic: 'Electronic',
    memory: 'Magnetic tape and internal storage',
    input: 'Magnetic tape and keyboard',
    output: 'Reports and printed output',
    importance: 'Commercial computing',
    contribution: 'Brought computing into business and administration'
  }
];

const MachineComparisonCenter: React.FC = () => {
  const [selected, setSelected] = useState<MachineKey>('bombe');

  const current = useMemo(() => machines.find((machine) => machine.key === selected) ?? machines[0], [selected]);

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">Machine Comparison Center</h3>
        <p className="rotor-explainer-text">Compare these machines to see how cryptographic problems drove different computer architectures, from logic networks to stored data processing.</p>
      </div>

      <div className="concept-grid">
        {machines.map((machine) => (
          <button key={machine.key} type="button" className={`concept-card ${selected === machine.key ? 'active' : ''}`} onClick={() => setSelected(machine.key)}>
            <strong>{machine.name}</strong>
            <span>{machine.year}</span>
          </button>
        ))}
      </div>

      <div className="concept-detail-card">
        <h4>{current.name}</h4>
        <div className="comparison-grid">
          <div><strong>Year</strong><p>{current.year}</p></div>
          <div><strong>Technology</strong><p>{current.technology}</p></div>
          <div><strong>Purpose</strong><p>{current.purpose}</p></div>
          <div><strong>Programming Method</strong><p>{current.programming}</p></div>
          <div><strong>Speed</strong><p>{current.speed}</p></div>
          <div><strong>Electronic vs Mechanical</strong><p>{current.electronic}</p></div>
          <div><strong>Memory Technology</strong><p>{current.memory}</p></div>
          <div><strong>Input Method</strong><p>{current.input}</p></div>
          <div><strong>Output Method</strong><p>{current.output}</p></div>
          <div><strong>Historical Importance</strong><p>{current.importance}</p></div>
          <div><strong>Contribution to Computing</strong><p>{current.contribution}</p></div>
        </div>
      </div>
    </div>
  );
};

export default MachineComparisonCenter;
