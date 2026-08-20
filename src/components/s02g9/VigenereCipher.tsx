import React, { useState } from 'react';
import { vigenereEncrypt, vigenereDecrypt } from '../../lib/s02g9/crypto.ts';

const VigenereCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [keyword, setKeyword] = useState('');
  const [repeated, setRepeated] = useState('Keyword repeats here...');
  const [output, setOutput] = useState('Output appears here...');
  const [transformLines, setTransformLines] = useState<string[]>([]);

  const encrypt = () => {
    if (!keyword.trim()) {
      alert('Please enter a keyword.');
      return;
    }
    const result = vigenereEncrypt(plaintext, keyword);
    setRepeated(result.repeated);
    setOutput(result.text);
    setTransformLines(result.map);
  };

  const decrypt = () => {
    if (!keyword.trim()) {
      alert('Please enter a keyword.');
      return;
    }
    const result = vigenereDecrypt(plaintext, keyword);
    setRepeated(result.repeated);
    setOutput(result.text);
    setTransformLines(result.map);
  };

  const reset = () => {
    setPlaintext('');
    setKeyword('');
    setRepeated('Keyword repeats here...');
    setOutput('Output appears here...');
    setTransformLines([]);
  };

  return (
    <div className="lab-subtab-panel active" id="subtab-vigenere">
      <div className="simulator-container">
        <div className="rotor-explainer">
          <h3 className="rotor-explainer-title">Vigenère Cipher</h3>
          <p className="rotor-explainer-text">The Vigenère cipher uses a repeated keyword to change the shift for each letter, making simple frequency analysis much harder.</p>
          <p className="rotor-explainer-text">Use the tabula recta concept to see how a keyword controls each letter's encryption step.</p>
        </div>

        <div className="cipher-educational-card">
          <div className="cipher-edu-title">Keyword-based encryption</div>
          <p className="cipher-edu-text">Each plaintext letter is paired with a letter from the keyword, so the shift changes across the message instead of staying fixed.</p>
          <div className="cipher-diagram">
            <div className="cipher-diagram-label">Tabula recta concept</div>
            <div className="cipher-row">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                <span key={letter} className="cipher-letter">{letter}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="input-area">
          <div className="input-group">
            <label className="input-label">Plaintext</label>
            <textarea id="vigenerePlaintext" value={plaintext} onChange={(e) => setPlaintext(e.target.value)} placeholder="Enter a message..." />
            <label className="input-label">Keyword</label>
            <input type="text" id="vigenereKeyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter a keyword" />
          </div>
          <div className="input-group">
            <label className="input-label">Repeated keyword</label>
            <div className="output-display vigenere-keyword-display" id="vigenereRepeatedKeyword">{repeated}</div>
            <label className="input-label">Ciphertext</label>
            <div className="output-display" id="vigenereOutput">{output}</div>
            <div className="cipher-transform" id="vigenereTransform">
              {transformLines.map((t, i) => <div key={i} dangerouslySetInnerHTML={{ __html: t }} />)}
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={encrypt}>Encrypt</button>
          <button className="btn btn-secondary" onClick={decrypt}>Decrypt</button>
          <button className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default VigenereCipher;