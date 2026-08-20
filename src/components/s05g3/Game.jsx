import { useState } from 'react'; 
export default function Game(){
  console.log("Game component loaded!");
  const [step, setStep] = useState('terminal'); // 'terminal', 'web', 'success'
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'ARPANET Terminal v1.0.6 (1983)',
    'Type "help" to see available commands.',
    ''
  ]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim().toLowerCase();
      let response = '';

      if (command === 'help') {
        response = 'Available commands: ls (list files), cd <dir> (change directory), cat <file> (read file)';
      } else if (command === 'ls') {
        response = 'Directories found: [cern_records]  [private_files]';
      } else if (command === 'cd private_files'){
        response = 'Access Denied!'
      } else if (command === 'cd cern_records') {
        response = 'Entered directory: cern_records. Files: proposal_1989.txt';
      } else if (command === 'cat proposal_1989.txt') {
        response = 'SUCCESS: "Information Management: A Proposal" opened...';
        setTimeout(() => setStep('web'), 3000);
      } else {
        response = `Command not recognized: "${command}". Try "help".`;
      }

      setHistory([...history, `> ${input}`, response, '']);
      setInput('');
    }
  };

  return (
    <div className="m-20 p-6 max-w-2xl mx-auto rounded-xl font-sans">
      {step === 'terminal' && (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Mini-Activity</h2>
          <h3 className="text-xl font-bold mb-2 text-white">Phase 1: The Pre-Web Era (Command Line)</h3>
          <p className="mb-4 text-sm text-gray-400">Task: Find and open "proposal_1989.txt". Use commands like 'ls' or 'cd'.</p>
          <div className="bg-black text-green-400 font-mono p-4 rounded h-100 overflow-y-auto border-2 border-green-600">
            {history.map((line, idx) => <div key={idx}>{line}</div>)}
            <div className="flex">
              <span>{'> '} </span>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="bg-transparent outline-none flex-1 text-green-400"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {step === 'web' && (
        <div className="mt-25 bg-white p-6 border-2 border-gray-400 rounded shadow-md">
          <h3 className="text-xl font-bold text-blue-900 border-b pb-2 mb-4">Phase 2: The World Wide Web Era (Hypertext)</h3>
          <p className="mb-4 text-sm text-gray-600">Task: Achieve the exact same goal using Tim Berners-Lee's WWW model.</p>
          <div className="space-y-2 font-serif">
            <p className="text-gray-500">Root / Documents /</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-gray-400">public_files/</span></li>
              <li>
                <span className="text-gray-700 font-bold">cern_records/</span>
                <ul className="list-circle pl-6 mt-1">
                  <li>
                    <button 
                      onClick={() => setStep('success')} 
                      className="text-blue-600 underline hover:text-blue-800 font-medium cursor-pointer"
                    >
                      proposal_1989.txt (Information Management: A Proposal)
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="mt-20 text-center p-8 bg-green-50 border border-green-200 rounded">
          <h3 className="text-2xl font-bold text-green-700 mb-2">Goal Accomplished!</h3>
          <p className="text-gray-700">
            Notice the difference? Hypertext eliminated the need to remember exact directory structural paths and machine syntax, opening the Internet to billions of everyday users.
          </p>
          <button onClick={() => setStep('terminal')} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}