import React, { useState } from 'react';

type CaseData = {
  answer: string;
  hint: string;
};

const initialData: Record<number, CaseData> = {
  1: { answer: 'HELLO WORLD', hint: 'Simple substitution cipher. Each letter shifts by 3 positions.' },
  2: { answer: 'HELLO THERE', hint: 'Caesar cipher with shift of 5.' },
  3: { answer: 'THE QUICK BROWN FOX', hint: 'ROT13 cipher - rotate each letter by 13 positions.' },
  4: { answer: 'SECRET CODE', hint: 'Atbash cipher - A=Z, B=Y, etc.' },
  5: { answer: 'CODE BREAKER', hint: 'A1Z26 number cipher where A=1, B=2, ..., Z=26.' },
  6: { answer: 'COLOSSUS', hint: 'Reverse-text cipher. Read the encrypted word from right to left.' }
};

const Challenge: React.FC = () => {
  const [attempts, setAttempts] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [answers, setAnswers] = useState<Record<number, string>>({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
  const [results, setResults] = useState<Record<number, { message: string; ok: boolean | null }>>({});

  const checkAnswer = (caseNum: number) => {
    const user = (answers[caseNum] || '').toUpperCase().trim();
    const correct = initialData[caseNum].answer;
    const nextAttempts = { ...attempts, [caseNum]: attempts[caseNum] + 1 };
    setAttempts(nextAttempts);

    if (user === correct) {
      setResults(prev => ({ ...prev, [caseNum]: { message: '✓ CORRECT! You successfully decrypted the message.', ok: true } }));
    } else {
      setResults(prev => ({ ...prev, [caseNum]: { message: `✗ INCORRECT. Try again. (${nextAttempts[caseNum]} attempt${nextAttempts[caseNum] > 1 ? 's' : ''})`, ok: false } }));
    }
  };

  return (
    <section id="challenge" className="active">
      <h2 className="section-title">Cryptography Practice Challenge</h2>
      <p className="section-description">Practice classic cipher methods that represent different stages of cryptography history, from simple substitution to structured encoding.</p>

      <div className="challenge-container">
        <div className="challenge-info">
          <div className="info-title">Challenge Instructions</div>
          <div className="info-text">
            Decode each message and connect each method to its historical era. Enter your answer below each case and submit to check if it's correct.
          </div>
        </div>

        <div className="challenge-board" id="challengeBoard">
          <div className="dossier" id="dossier1">
            <div className="dossier-title">CASE #1</div>
            <div className="clue-text"><strong>Clue:</strong> Simple substitution cipher. Each letter shifts by 3 positions.</div>
            <div className="clue-text"><strong>How it works:</strong> Move each encrypted letter 3 steps backward in the alphabet.</div>
            <div className="encrypted-message">KHOOR ZRUOG</div>
            <input type="text" className="answer-input" id="answer1" placeholder="Enter decrypted message..." value={answers[1]} onChange={(e) => setAnswers(a => ({ ...a, 1: e.target.value }))} />
            <button className="submit-answer" onClick={() => checkAnswer(1)}>Submit Answer</button>
            <div className={`result-message ${results[1]?.ok ? 'correct' : results[1]?.ok === false ? 'incorrect' : ''}`} id="result1">{results[1]?.message}</div>
          </div>

          <div className="dossier" id="dossier2">
            <div className="dossier-title">CASE #2</div>
            <div className="clue-text"><strong>Clue:</strong> Caesar cipher with shift of 5.</div>
            <div className="clue-text"><strong>How it works:</strong> Move each encrypted letter 5 steps backward in the alphabet.</div>
            <div className="encrypted-message">MJQQT YMJWJ</div>
            <input type="text" className="answer-input" id="answer2" placeholder="Enter decrypted message..." value={answers[2]} onChange={(e) => setAnswers(a => ({ ...a, 2: e.target.value }))} />
            <button className="submit-answer" onClick={() => checkAnswer(2)}>Submit Answer</button>
            <div className={`result-message ${results[2]?.ok ? 'correct' : results[2]?.ok === false ? 'incorrect' : ''}`} id="result2">{results[2]?.message}</div>
          </div>

          <div className="dossier" id="dossier3">
            <div className="dossier-title">CASE #3</div>
            <div className="clue-text"><strong>Clue:</strong> ROT13 cipher - rotate each letter by 13 positions.</div>
            <div className="clue-text"><strong>How it works:</strong> ROT13 swaps letters halfway across the alphabet (A↔N, B↔O).</div>
            <div className="encrypted-message">GUR DHVPX OEBJA SBK</div>
            <input type="text" className="answer-input" id="answer3" placeholder="Enter decrypted message..." value={answers[3]} onChange={(e) => setAnswers(a => ({ ...a, 3: e.target.value }))} />
            <button className="submit-answer" onClick={() => checkAnswer(3)}>Submit Answer</button>
            <div className={`result-message ${results[3]?.ok ? 'correct' : results[3]?.ok === false ? 'incorrect' : ''}`} id="result3">{results[3]?.message}</div>
          </div>

          <div className="dossier" id="dossier4">
            <div className="dossier-title">CASE #4</div>
            <div className="clue-text"><strong>Clue:</strong> Atbash cipher - A=Z, B=Y, C=X, etc. (Reverse alphabet)</div>
            <div className="clue-text"><strong>How it works:</strong> Replace each letter with its opposite partner in the alphabet.</div>
            <div className="encrypted-message">HVXIVG XLWV</div>
            <input type="text" className="answer-input" id="answer4" placeholder="Enter decrypted message..." value={answers[4]} onChange={(e) => setAnswers(a => ({ ...a, 4: e.target.value }))} />
            <button className="submit-answer" onClick={() => checkAnswer(4)}>Submit Answer</button>
            <div className={`result-message ${results[4]?.ok ? 'correct' : results[4]?.ok === false ? 'incorrect' : ''}`} id="result4">{results[4]?.message}</div>
          </div>

          <div className="dossier" id="dossier5">
            <div className="dossier-title">CASE #5</div>
            <div className="clue-text"><strong>Clue:</strong> A1Z26 number cipher where A=1, B=2, ..., Z=26.</div>
            <div className="clue-text"><strong>How it works:</strong> Convert each number back into its matching letter.</div>
            <div className="encrypted-message">3-15-4-5 2-18-5-1-11-5-18</div>
            <input type="text" className="answer-input" id="answer5" placeholder="Enter decrypted message..." value={answers[5]} onChange={(e) => setAnswers(a => ({ ...a, 5: e.target.value }))} />
            <button className="submit-answer" onClick={() => checkAnswer(5)}>Submit Answer</button>
            <div className={`result-message ${results[5]?.ok ? 'correct' : results[5]?.ok === false ? 'incorrect' : ''}`} id="result5">{results[5]?.message}</div>
          </div>

          <div className="dossier" id="dossier6">
            <div className="dossier-title">CASE #6</div>
            <div className="clue-text"><strong>Clue:</strong> Reverse-text cipher.</div>
            <div className="clue-text"><strong>How it works:</strong> Read the encrypted word from right to left.</div>
            <div className="encrypted-message">SUSSOLOC</div>
            <input type="text" className="answer-input" id="answer6" placeholder="Enter decrypted message..." value={answers[6]} onChange={(e) => setAnswers(a => ({ ...a, 6: e.target.value }))} />
            <button className="submit-answer" onClick={() => checkAnswer(6)}>Submit Answer</button>
            <div className={`result-message ${results[6]?.ok ? 'correct' : results[6]?.ok === false ? 'incorrect' : ''}`} id="result6">{results[6]?.message}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Challenge;