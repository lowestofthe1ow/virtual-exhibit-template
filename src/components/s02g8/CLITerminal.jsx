import { useState, useRef, useEffect } from "react";

const BOOT_LINES = [
  "MUSEUM TERMINAL EMULATOR v1.0",
  "BOOTING...",
  "SYSTEM READY.",
  "Type 'help' to see available commands.",
];

const README_TEXT =
  "In the 1960s-70s, the Command Line Interface let users " +
  "type text commands instead of wiring machines or punching cards. " +
  "It was faster and more direct, but you had to know the exact " +
  "command and syntax to get anything done.";

function getResponse(rawInput, commandLog) {
  const input = rawInput.trim();
  const command = input.split(" ")[0].toLowerCase();
  const args = input.split(" ").slice(1).join(" ").trim();

  if (input === "") {
    return "";
  } else if (command === "help") {
    return [
      "Available commands:",
      "  help          - show this list",
      "  about         - what is a CLI?",
      "  whoami        - display current user",
      "  date          - show current date and time",
      "  ls            - list files in this directory",
      "  cat <file>    - print contents of a file",
      "  echo <text>   - repeat text back",
      "  history       - show commands you've typed",
      "  clear         - clear the screen",
      "  exit          - try to leave the terminal",
    ].join("\n");
  } else if (command === "about") {
    return README_TEXT;
  } else if (command === "whoami") {
    return "guest@museum-terminal";
  } else if (command === "date") {
    return new Date().toString();
  } else if (command === "ls") {
    return "readme.txt   unix.log   staff.txt";
  } else if (command === "cat") {
    if (args.toLowerCase() === "readme.txt") {
      return README_TEXT;
    } else if (args.toLowerCase() === "unix.log") {
      return "Early Unix (1969) ran on the CLI, using short commands like ls, cd, and rm - many of which are still used today.";
    } else if (args.toLowerCase() === "staff.txt") {
      return "Access denied: insufficient privileges.";
    } else if (args === "") {
      return "usage: cat <file>";
    } else {
      return `cat: ${args}: No such file or directory`;
    }
  } else if (command === "echo") {
    return args === "" ? "" : args;
  } else if (command === "history") {
    return commandLog.length === 0
      ? "No commands yet."
      : commandLog.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n");
  } else if (command === "clear") {
    return "__CLEAR__";
  } else if (command === "exit") {
    return "This terminal is a museum piece - it doesn't actually exit!";
  } else {
    return `'${command}': command not recognized. Type 'help' for a list of commands.`;
  }
}

export default function CLITerminal() {
  const [lines, setLines] = useState(
    BOOT_LINES.map((text) => ({ type: "output", text }))
  );
  const [inputValue, setInputValue] = useState("");
  const [commandLog, setCommandLog] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(null);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function focusInput() {
    inputRef.current?.focus();
  }

  function runCommand(raw) {
    const response = getResponse(raw, commandLog);

    if (raw.trim() !== "") {
      setCommandLog((prev) => [...prev, raw.trim()]);
    }

    if (response === "__CLEAR__") {
      setLines([]);
      return;
    }

    setLines((prev) => [
      ...prev,
      { type: "input", text: raw },
      ...(response ? [{ type: "output", text: response }] : []),
    ]);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      runCommand(inputValue);
      setInputValue("");
      setHistoryPointer(null);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandLog.length === 0) return;
      const nextPointer =
        historyPointer === null
          ? commandLog.length - 1
          : Math.max(historyPointer - 1, 0);
      setHistoryPointer(nextPointer);
      setInputValue(commandLog[nextPointer]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyPointer === null) return;
      const nextPointer = historyPointer + 1;
      if (nextPointer >= commandLog.length) {
        setHistoryPointer(null);
        setInputValue("");
      } else {
        setHistoryPointer(nextPointer);
        setInputValue(commandLog[nextPointer]);
      }
    }
  }

  return (
    <div className="cli-terminal" onClick={focusInput}>
      <div className="cli-titlebar">
        <span className="cli-dot cli-dot-red" />
        <span className="cli-dot cli-dot-yellow" />
        <span className="cli-dot cli-dot-green" />
        <span className="cli-titletext">terminal - 1970</span>
      </div>

      <div className="cli-screen">
        {lines.map((line, index) => (
          <div
            key={index}
            className={
              line.type === "input" ? "cli-line cli-input-line" : "cli-line"
            }
          >
            {line.type === "input" ? (
              <>
                <span className="cli-prompt">guest@museum:~$</span>{" "}
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}

        <div className="cli-line cli-input-line">
          <span className="cli-prompt">guest@museum:~$</span>
          <input
            ref={inputRef}
            className="cli-input"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command input"
          />
          <span className="cli-cursor" aria-hidden="true">
            &#9608;
          </span>
        </div>

        <div ref={bottomRef} />
      </div>

      <style>{`
        .cli-terminal {
          max-width: 720px;
          margin: 0 auto;
          background: #0c0c0c;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          font-family: Consolas, "Courier New", monospace;
          cursor: text;
        }

        .cli-titlebar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.6rem 0.9rem;
          background: #2b2b2b;
        }

        .cli-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .cli-dot-red {
          background: #ff5f56;
        }

        .cli-dot-yellow {
          background: #ffbd2e;
        }

        .cli-dot-green {
          background: #27c93f;
        }

        .cli-titletext {
          margin-left: 0.5rem;
          color: #9ca3af;
          font-size: 0.78rem;
          letter-spacing: 0.5px;
        }

        .cli-screen {
          background: #000;
          color: #00ff37;
          padding: 1rem 1.1rem 1.2rem;
          min-height: 320px;
          max-height: 420px;
          overflow-y: auto;
          font-size: 0.95rem;
          line-height: 1.55;
        }

        .cli-line {
          white-space: pre-wrap;
          word-break: break-word;
        }

        .cli-input-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cli-prompt {
          color: #4ade80;
          font-weight: 700;
          flex-shrink: 0;
        }

        .cli-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #00ff37;
          font-family: inherit;
          font-size: 0.95rem;
          caret-color: transparent;
        }

        .cli-cursor {
          color: #00ff37;
          animation: cli-blink 1s steps(2, start) infinite;
        }

        @keyframes cli-blink {
          50% {
            opacity: 0;
          }
        }

        @media (max-width: 600px) {
          .cli-screen {
            font-size: 0.85rem;
            min-height: 260px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cli-cursor {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
