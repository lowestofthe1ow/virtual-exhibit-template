import React, { useState } from 'react';
import CaesarCipher from './CaesarCipher.tsx';
import VigenereCipher from './VigenereCipher.tsx';
import EnigmaMachine from './EnigmaMachine.tsx';
import BombeMachine from './BombeMachine.tsx';
import ColossusMachine from './ColossusMachine.tsx';
import Mark1Machine from './Mark1Machine.tsx';
import EniacMachine from './EniacMachine.tsx';
import UnivacMachine from './UnivacMachine.tsx';

const CipherLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classical' | 'enigma' | 'bombe' | 'colossus' | 'mark1' | 'eniac' | 'univac'>('classical');
  const [activeSubtab, setActiveSubtab] = useState<'caesar' | 'vigenere'>('caesar');

  return (
    <section id="simulator" className="active">
      <h2 className="section-title">Cipher Lab: Interactive Museum Exhibit</h2>
      <p className="section-description">
        Follow the story from secret writing to machine-assisted computation: each new cryptographic challenge pushed engineers to build faster, more automated machines.
      </p>

      <div className="museum-narrative-card">
        <h3 className="museum-narrative-card__title">Why computing was needed</h3>
        <p>
          As ciphers became more complex, humans could no longer test every possible key by hand. The need to search, compare, and verify patterns quickly led to the invention of machines that could automate logic, memory, and calculation.
        </p>
        <div className="museum-narrative-card__flow">
          <span>Caesar</span>
          <span>→</span>
          <span>Vigenère</span>
          <span>→</span>
          <span>Rotor machines</span>
          <span>→</span>
          <span>Bombe</span>
          <span>→</span>
          <span>Colossus</span>
          <span>→</span>
          <span>Modern computers</span>
        </div>
      </div>

      <div className="museum-innovation-card">
        <h4>Computing through cryptography</h4>
        <p>The museum now includes a second layer that explains how each cryptographic breakthrough introduced computational ideas such as automation, logic, memory, sequential processing, and programmability.</p>
        <div className="button-group">
          <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('museum-open-exhibit', { detail: { exhibitKey: 'concepts', title: 'Computing Concepts Gallery', image: 'Command.webp' } }))}>Open concepts gallery</button>
          <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('museum-open-exhibit', { detail: { exhibitKey: 'comparison', title: 'Machine Comparison Center', image: 'compare.webp' } }))}>Open comparison center</button>
          <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('museum-open-exhibit', { detail: { exhibitKey: 'evolution', title: 'Computing Evolution Timeline', image: 'evolve.webp' } }))}>Open evolution timeline</button>
          <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('museum-open-exhibit', { detail: { exhibitKey: 'finale', title: 'From Cipher to Silicon', image: 'final.webp' } }))}>Open finale</button>
        </div>
      </div>

      <div className="lab-tabs" role="tablist">
        <button className={`lab-tab ${activeTab === 'classical' ? 'active' : ''}`} onClick={() => setActiveTab('classical')}>Classical Ciphers</button>
        <button className={`lab-tab ${activeTab === 'enigma' ? 'active' : ''}`} onClick={() => setActiveTab('enigma')}>Enigma Machine</button>
        <button className={`lab-tab ${activeTab === 'bombe' ? 'active' : ''}`} onClick={() => setActiveTab('bombe')}>Bombe</button>
        <button className={`lab-tab ${activeTab === 'colossus' ? 'active' : ''}`} onClick={() => setActiveTab('colossus')}>Colossus</button>
        <button className={`lab-tab ${activeTab === 'mark1' ? 'active' : ''}`} onClick={() => setActiveTab('mark1')}>Harvard Mark I</button>
        <button className={`lab-tab ${activeTab === 'eniac' ? 'active' : ''}`} onClick={() => setActiveTab('eniac')}>ENIAC</button>
        <button className={`lab-tab ${activeTab === 'univac' ? 'active' : ''}`} onClick={() => setActiveTab('univac')}>UNIVAC I</button>
      </div>

      <div className="lab-tab-panels">
        {activeTab === 'classical' && (
          <div className="lab-tab-panel active" id="tab-classical">
            <div className="classical-subtabs" role="tablist">
              <button className={`lab-subtab ${activeSubtab === 'caesar' ? 'active' : ''}`} onClick={() => setActiveSubtab('caesar')}>Caesar Cipher</button>
              <button className={`lab-subtab ${activeSubtab === 'vigenere' ? 'active' : ''}`} onClick={() => setActiveSubtab('vigenere')}>Vigenère Cipher</button>
            </div>

            <div className="lab-subtab-panels">
              {activeSubtab === 'caesar' && <CaesarCipher />}
              {activeSubtab === 'vigenere' && <VigenereCipher />}
            </div>
          </div>
        )}

        {activeTab === 'enigma' && (
          <div className="lab-tab-panel active" id="tab-enigma">
            <EnigmaMachine />
          </div>
        )}

        {activeTab === 'bombe' && (
          <div className="lab-tab-panel active" id="tab-bombe">
            <BombeMachine />
          </div>
        )}

        {activeTab === 'colossus' && (
          <div className="lab-tab-panel active" id="tab-colossus">
            <ColossusMachine />
          </div>
        )}

        {activeTab === 'mark1' && (
          <div className="lab-tab-panel active" id="tab-mark1">
            <Mark1Machine />
          </div>
        )}

        {activeTab === 'eniac' && (
          <div className="lab-tab-panel active" id="tab-eniac">
            <EniacMachine />
          </div>
        )}

        {activeTab === 'univac' && (
          <div className="lab-tab-panel active" id="tab-univac">
            <UnivacMachine />
          </div>
        )}
      </div>
    </section>
  );
};

export default CipherLab;