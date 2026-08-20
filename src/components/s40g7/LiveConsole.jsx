import { useState } from 'react';

export default function LiveConsole() {
  const [logs, setLogs] = useState([
    { id: 1, message: '💻 Console initialized', type: 'info' },
    { id: 2, message: 'Type "help" for available commands', type: 'info' },
  ]);
  const [input, setInput] = useState('');

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const cmd = input.trim().toLowerCase();
      
      if (cmd === 'help') {
        addLog('Available: help, clear, hello, date', 'info');
      } else if (cmd === 'clear') {
        setLogs([]);
      } else if (cmd === 'hello') {
        addLog('Hello, user! 👋', 'success');
      } else if (cmd === 'date') {
        addLog(`Current time: ${new Date().toLocaleTimeString()}`, 'info');
      } else {
        addLog(`Unknown: "${cmd}"`, 'error');
      }
      setInput('');
    }
  };

  return (
    <div className="console-container">
      <div className="console-header">
        <div className="console-dots">
          <span className="console-dot red"></span>
          <span className="console-dot yellow"></span>
          <span className="console-dot green"></span>
        </div>
        <span className="console-title">live-console</span>
        <button className="console-clear-btn" onClick={() => setLogs([])}>
          Clear
        </button>
      </div>
      <div className="console-body">
        {logs.map((log) => (
          <div key={log.id} className="console-line">
            <span className="prefix">$</span>
            <span className={`message ${log.type}`}>{log.message}</span>
          </div>
        ))}
      </div>
      <form className="console-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}