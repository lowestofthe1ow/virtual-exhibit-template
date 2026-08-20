import React, { useMemo, useState } from 'react';

type ConceptKey = 'logic' | 'binary' | 'memory' | 'sequential' | 'parallel';

type NodeDefinition = {
  id: string;
  label: string;
  description: string;
  exhibitKey: string;
  title: string;
};

const concepts = [
  {
    id: 'logic' as ConceptKey,
    title: 'Boolean Logic',
    summary: 'Switches and circuits make decisions.',
    description: 'The basic operations AND, OR, and NOT became the grammar of electronic computation. Colossus and later machines used these simple rules to test many possibilities quickly.',
    connection: 'Connected to Colossus and early electronic logic.'
  },
  {
    id: 'binary' as ConceptKey,
    title: 'Binary Representation',
    summary: 'Bits turn information into on/off states.',
    description: 'Modern computing uses binary because electronic circuits can naturally represent two states: on and off. That idea made it practical to represent letters, numbers, and instructions as simple patterns.',
    connection: 'Connected to ENIAC and later digital machines.'
  },
  {
    id: 'memory' as ConceptKey,
    title: 'Memory & Registers',
    summary: 'Short-term storage makes calculation possible.',
    description: 'Registers and memory hold values while a machine is processing them. Once computers had to process larger datasets, they needed more reliable storage and better data movement.',
    connection: 'Connected to Mark I, ENIAC, and UNIVAC.'
  },
  {
    id: 'sequential' as ConceptKey,
    title: 'Sequential Processing',
    summary: 'Instructions are performed one after another.',
    description: 'Many early machines handled tasks by running a sequence of steps. This is the foundation of stored programs and the everyday notion of “running a program”.',
    connection: 'Connected to the Harvard Mark I and later stored-program systems.'
  },
  {
    id: 'parallel' as ConceptKey,
    title: 'Parallel Processing',
    summary: 'Multiple operations can be examined at once.',
    description: 'The ambitious search tasks of wartime codebreaking encouraged designers to think about doing many checks at the same time. This eventually helped shape parallel systems and modern high-performance processors.',
    connection: 'Connected to Bombe and Colossus ideas of rapid search.'
  }
];

const dependencyNodes: NodeDefinition[] = [
  { id: 'caesar', label: 'Caesar', description: 'Rule-based transformation', exhibitKey: 'caesar', title: 'Caesar Cipher' },
  { id: 'vigenere', label: 'Vigenère', description: 'Stateful encryption', exhibitKey: 'vigenere', title: 'Vigenère Cipher' },
  { id: 'rotor', label: 'Rotor', description: 'Mechanical state changes', exhibitKey: 'rotor', title: 'Rotor Machines' },
  { id: 'bombe', label: 'Bombe', description: 'Automated search', exhibitKey: 'bombe', title: 'Bombe' },
  { id: 'colossus', label: 'Colossus', description: 'Electronic logic', exhibitKey: 'colossus', title: 'Colossus' },
  { id: 'mark1', label: 'Mark I', description: 'Sequential computation', exhibitKey: 'mark1', title: 'Harvard Mark I' },
  { id: 'eniac', label: 'ENIAC', description: 'Programmable arithmetic', exhibitKey: 'eniac', title: 'ENIAC' },
  { id: 'univac', label: 'UNIVAC', description: 'Commercial data processing', exhibitKey: 'univac', title: 'UNIVAC I' }
];

const ComputingConceptsGallery: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptKey>('logic');
  const [selectedNode, setSelectedNode] = useState<NodeDefinition>(dependencyNodes[0]);
  const [logicA, setLogicA] = useState(false);
  const [logicB, setLogicB] = useState(true);
  const [logicMode, setLogicMode] = useState<'AND' | 'OR' | 'NOT'>('AND');
  const [binaryValue, setBinaryValue] = useState(13);

  const currentConcept = useMemo(() => concepts.find((item) => item.id === selectedConcept) ?? concepts[0], [selectedConcept]);

  const computeLogic = () => {
    if (logicMode === 'AND') return logicA && logicB;
    if (logicMode === 'OR') return logicA || logicB;
    return !logicA;
  };

  const openExhibit = (exhibitKey: string, title: string) => {
    window.dispatchEvent(new CustomEvent('museum-open-exhibit', { detail: { exhibitKey, title } }));
  };

  return (
    <div className="simulator-container">
      <div className="rotor-explainer">
        <h3 className="rotor-explainer-title">Computing Concepts Gallery</h3>
        <p className="rotor-explainer-text">These ideas were not invented in a vacuum. They emerged as cryptography became harder to solve by hand and machines were needed to search, compare, and transform data.</p>
        <p className="rotor-explainer-text">Use the interactive demonstrations below to connect the concepts of logic, memory, and sequencing to the machines in this museum.</p>
      </div>

      <div className="museum-innovation-card">
        <h4>How this gallery fits the story</h4>
        <p>Each concept here is tied to the same problem that drove early machines: the need to process information faster than people could do it by hand.</p>
      </div>

      <div className="concept-grid">
        {concepts.map((concept) => (
          <button
            key={concept.id}
            type="button"
            className={`concept-card ${selectedConcept === concept.id ? 'active' : ''}`}
            onClick={() => setSelectedConcept(concept.id)}
          >
            <strong>{concept.title}</strong>
            <span>{concept.summary}</span>
          </button>
        ))}
      </div>

      <div className="concept-detail-card">
        <div className="concept-detail-card__header">
          <h4>{currentConcept.title}</h4>
          <p>{currentConcept.description}</p>
        </div>

        {selectedConcept === 'logic' && (
          <div className="concept-demo-stack">
            <div className="concept-demo-card">
              <label className="input-label">Logic Mode</label>
              <select value={logicMode} onChange={(e) => setLogicMode(e.target.value as 'AND' | 'OR' | 'NOT')} className="rotor-input">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
                <option value="NOT">NOT</option>
              </select>
              <div className="concept-toggle-row">
                <label>
                  <input type="checkbox" checked={logicA} onChange={(e) => setLogicA(e.target.checked)} />
                  Input A
                </label>
                <label>
                  <input type="checkbox" checked={logicB} onChange={(e) => setLogicB(e.target.checked)} />
                  Input B
                </label>
              </div>
              <div className="concept-badge">Output: {String(computeLogic())}</div>
            </div>
            <div className="concept-demo-card">
              <p>{currentConcept.connection}</p>
              <button className="btn btn-secondary" type="button" onClick={() => openExhibit('colossus', 'Colossus')}>Open Colossus exhibit</button>
            </div>
          </div>
        )}

        {selectedConcept === 'binary' && (
          <div className="concept-demo-stack">
            <div className="concept-demo-card">
              <label className="input-label">Enter a number</label>
              <input type="range" min={0} max={31} value={binaryValue} onChange={(e) => setBinaryValue(Number(e.target.value))} />
              <div className="concept-badge">Decimal: {binaryValue} · Binary: {binaryValue.toString(2)}</div>
            </div>
            <div className="concept-demo-card">
              <p>{currentConcept.connection}</p>
              <button className="btn btn-secondary" type="button" onClick={() => openExhibit('eniac', 'ENIAC')}>Open ENIAC exhibit</button>
            </div>
          </div>
        )}

        {selectedConcept === 'memory' && (
          <div className="concept-demo-stack">
            <div className="concept-demo-card">
              <div className="memory-grid">
                {['R1', 'R2', 'R3', 'R4'].map((slot, index) => (
                  <div key={slot} className="memory-cell">{slot}: {index + 5}</div>
                ))}
              </div>
            </div>
            <div className="concept-demo-card">
              <p>{currentConcept.connection}</p>
              <button className="btn btn-secondary" type="button" onClick={() => openExhibit('mark1', 'Harvard Mark I')}>Open Mark I exhibit</button>
            </div>
          </div>
        )}

        {selectedConcept === 'sequential' && (
          <div className="concept-demo-stack">
            <div className="concept-demo-card">
              <div className="process-track">
                {['Load', 'Decode', 'Execute', 'Store'].map((step, index) => (
                  <div key={step} className={`process-step ${index <= 2 ? 'active' : ''}`}>{step}</div>
                ))}
              </div>
            </div>
            <div className="concept-demo-card">
              <p>{currentConcept.connection}</p>
              <button className="btn btn-secondary" type="button" onClick={() => openExhibit('mark1', 'Harvard Mark I')}>Open Mark I exhibit</button>
            </div>
          </div>
        )}

        {selectedConcept === 'parallel' && (
          <div className="concept-demo-stack">
            <div className="concept-demo-card">
              <div className="parallel-band">
                {['Search A', 'Search B', 'Search C', 'Search D'].map((task) => (
                  <div key={task} className="parallel-pill">{task}</div>
                ))}
              </div>
            </div>
            <div className="concept-demo-card">
              <p>{currentConcept.connection}</p>
              <button className="btn btn-secondary" type="button" onClick={() => openExhibit('bombe', 'Bombe')}>Open Bombe exhibit</button>
            </div>
          </div>
        )}
      </div>

      <div className="concept-detail-card">
        <h4>Computing dependency tree</h4>
        <div className="dependency-tree">
          {dependencyNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`dependency-node ${selectedNode.id === node.id ? 'active' : ''}`}
              onClick={() => setSelectedNode(node)}
            >
              <span>{node.label}</span>
              <small>{node.description}</small>
            </button>
          ))}
        </div>
        <div className="concept-demo-card">
          <h5>{selectedNode.label}</h5>
          <p>{selectedNode.description}</p>
          <button className="btn btn-secondary" type="button" onClick={() => openExhibit(selectedNode.exhibitKey, selectedNode.title)}>Open related exhibit</button>
        </div>
      </div>
    </div>
  );
};

export default ComputingConceptsGallery;
