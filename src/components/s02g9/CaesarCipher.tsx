import React, { useState } from 'react';
import { caesarEncrypt, caesarDecrypt } from '../../lib/s02g9/crypto.ts';

const CaesarCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [shift, setShift] = useState(3);
  const [output, setOutput] = useState('Output appears here...');
  const [transformLines, setTransformLines] = useState<string[]>([]);
  const [alphabetVis, setAlphabetVis] = useState<{ plain: string; shift: string } | null>(null);
  const [shiftPulse, setShiftPulse] = useState(0);

  const updateResult = (result: { text: string; map: string[]; plain: string; shift: string }) => {
    setOutput(result.text);
    setTransformLines(result.map);
    setAlphabetVis({ plain: result.plain, shift: result.shift });
    setShiftPulse((prev) => prev + 1);
  };

  const handleEncrypt = () => {
    updateResult(caesarEncrypt(plaintext, shift));
  };

  const handleDecrypt = () => {
    updateResult(caesarDecrypt(plaintext, shift));
  };

  const handleShiftChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      setShift(1);
      return;
    }
    setShift(Math.min(25, Math.max(1, parsed)));
  };

  const reset = () => {
    setPlaintext('');
    setShift(3);
    setOutput('Output appears here...');
    setTransformLines([]);
    setAlphabetVis(null);
    setShiftPulse(0);
  };

  return (
    <div className="lab-subtab-panel active" id="subtab-caesar">
      <div className="simulator-container">
        <div className="rotor-explainer">
          <h3 className="rotor-explainer-title">Caesar Cipher</h3>
          <p className="rotor-explainer-text">The Caesar cipher is one of the earliest recorded encryption methods. By shifting each letter a fixed amount, ancient writers could transform messages into a simple secret code.</p>
          <p className="rotor-explainer-text">This exhibit shows how every letter moves along the alphabet and how a single numeric shift creates a predictable but useful substitution.</p>
        </div>

        <div className="cipher-educational-card">
          <div className="cipher-edu-title">How the shift works</div>
          <ul className="cipher-list">
            <li>Each letter moves forward by the chosen shift value.</li>
            <li>After Z, the sequence wraps back to A.</li>
            <li>The same shift applies to every letter in the message.</li>
          </ul>
        </div>

        <div className="input-area">
          <div className="input-group">
            <label className="input-label">Plaintext</label>
            <textarea id="caesarPlaintext" value={plaintext} onChange={(e) => setPlaintext(e.target.value)} placeholder="Enter a message..." />
            <label className="input-label">Shift value</label>
            <input type="number" min={1} max={25} value={shift} className="rotor-input" id="caesarShift" onChange={(e) => handleShiftChange(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Ciphertext</label>
            <div className="output-display" id="caesarOutput">{output}</div>
            <div className="cipher-transform" id="caesarTransform">
              {transformLines.map((line, i) => <div key={i} dangerouslySetInnerHTML={{ __html: line }} />)}
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleEncrypt}>Encrypt</button>
          <button className="btn btn-secondary" onClick={handleDecrypt}>Decrypt</button>
          <button className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>

        <div className="alphabet-visualization" id="caesarAlphabetVis">
          {alphabetVis ? (
            <>
              <div className="alphabet-row"><span>Plain:</span> {alphabetVis.plain}</div>
              <div className="alphabet-row"><span>Shift:</span> {alphabetVis.shift}</div>
              <div className="cipher-diagram">
                <div className="cipher-diagram-label">Animated alphabet shift</div>
                <div className="cipher-row">
                  {alphabetVis.plain.split('').map((letter, index) => (
                    <span key={`${letter}-${index}`} className={`cipher-letter ${shiftPulse ? 'active' : ''}`}>{letter}</span>
                  ))}
                </div>
                <div className="cipher-row">
                  {alphabetVis.shift.split('').map((letter, index) => (
                    <span key={`${letter}-${index}`} className={`cipher-letter ${shiftPulse ? 'active' : ''}`}>{letter}</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="cipher-diagram">
              <div className="cipher-diagram-label">Animated alphabet shift</div>
              <div className="cipher-row">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                  <span key={letter} className="cipher-letter">{letter}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaesarCipher;