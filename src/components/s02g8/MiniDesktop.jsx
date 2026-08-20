import { useState, useRef, useCallback, useEffect } from "react";


// different kinds of apps
const APPS = [
  {
    id: "notepad",
    icon: "📝",
    label: "Notepad",
    title: "Notepad - README.txt",
    content: (
      <NotepadContent />
    ),
  },
  {
    id: "paint",
    icon: "🎨",
    label: "Paint",
    title: "Untitled - Paint",
    content: <PaintContent />,
  },
  {
    id: "explorer",
    icon: "📁",
    label: "My Files",
    title: "My Files",
    content: <ExplorerContent />,
  },
  {
    id: "calculator",
    icon: "🧮",
    label: "Calculator",
    title: "Calculator",
    content: <CalculatorContent />,
  },
];

// notepad
function NotepadContent() {
  const [text, setText] = useState(
    "Welcome to the GUI Era!"
  );
  return (
    <textarea
      className="gui-notepad-area"
      value={text}
      onChange={(e) => setText(e.target.value)}
      spellCheck={false}
      aria-label="Notepad text area"
    />
  );
}

// makeshift paint
const PALETTE = [
  "#000000", "#ffffff", "#ff0000", "#00aa00",
  "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
  "#ff8800", "#8800ff", "#00ff88", "#884400",
];
const GRID = 20; // cells per row/col
const CELL = 16; // px per cell

function PaintContent() {
  const [cells, setCells] = useState(() => Array(GRID * GRID).fill("#ffffff"));
  const [color, setColor] = useState("#000000");
  const [painting, setPainting] = useState(false);

  function paint(idx) {
    setCells((prev) => {
      const next = [...prev];
      next[idx] = color;
      return next;
    });
  }

  function clear() {
    setCells(Array(GRID * GRID).fill("#ffffff"));
  }

  return (
    <div className="gui-paint-wrap">
      <div className="gui-paint-toolbar">
        <div className="gui-palette">
          {PALETTE.map((c) => (
            <button
              key={c}
              className={`gui-swatch${color === c ? " gui-swatch-active" : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
        <button className="gui-paint-clear-btn" onClick={clear}>
          Clear
        </button>
      </div>
      <div
        className="gui-canvas"
        style={{ gridTemplateColumns: `repeat(${GRID}, ${CELL}px)` }}
        onMouseLeave={() => setPainting(false)}
      >
        {cells.map((bg, i) => (
          <div
            key={i}
            className="gui-cell"
            style={{ background: bg, width: CELL, height: CELL }}
            onMouseDown={() => { setPainting(true); paint(i); }}
            onMouseEnter={() => { if (painting) paint(i); }}
            onMouseUp={() => setPainting(false)}
          />
        ))}
      </div>
    </div>
  );
}

// file exp
const FILES = [
  { icon: "📄", name: "README.txt", size: "2 KB" },
  { icon: "📄", name: "system.log", size: "14 KB" },
  { icon: "📁", name: "Programs", size: "—" },
  { icon: "📁", name: "Documents", size: "—" },
  { icon: "🖼️", name: "wallpaper.bmp", size: "128 KB" },
  { icon: "⚙️", name: "config.sys", size: "1 KB" },
];

function ExplorerContent() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="gui-explorer">
      <div className="gui-explorer-toolbar">
        <span>📂 C:\Users\Guest</span>
      </div>
      <div className="gui-file-list">
        {FILES.map((f, i) => (
          <div
            key={i}
            className={`gui-file-row${selected === i ? " gui-file-selected" : ""}`}
            onClick={() => setSelected(i)}
          >
            <span className="gui-file-icon">{f.icon}</span>
            <span className="gui-file-name">{f.name}</span>
            <span className="gui-file-size">{f.size}</span>
          </div>
        ))}
      </div>
      <div className="gui-explorer-status">
        {selected !== null
          ? `Selected: ${FILES[selected].name}`
          : `${FILES.length} objects`}
      </div>
    </div>
  );
}

// calculator
function CalculatorContent() {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState(null);
  const [fresh, setFresh] = useState(true);

  function handleDigit(d) {
    setDisplay((prev) => (fresh || prev === "0" ? String(d) : prev + d));
    setFresh(false);
  }

  function handleOp(op) {
    const val = parseFloat(display);
    setPending({ value: val, op });
    setFresh(true);
  }

  function handleEquals() {
    if (!pending) return;
    const cur = parseFloat(display);
    let result;
    if (pending.op === "+") result = pending.value + cur;
    else if (pending.op === "−") result = pending.value - cur;
    else if (pending.op === "×") result = pending.value * cur;
    else if (pending.op === "÷") result = cur === 0 ? "ERR" : pending.value / cur;
    setDisplay(result === "ERR" ? "ERR" : String(parseFloat(result.toFixed(8))));
    setPending(null);
    setFresh(true);
  }

  function handleClear() {
    setDisplay("0");
    setPending(null);
    setFresh(true);
  }

  function handleDot() {
    if (fresh) { setDisplay("0."); setFresh(false); return; }
    if (!display.includes(".")) setDisplay((p) => p + ".");
  }

  const btnRows = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "−"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="gui-calc-wrap">
      <div className="gui-calc-display" aria-live="polite">{display}</div>
      <div className="gui-calc-btn-grid">
        <button className="gui-calc-btn gui-calc-clear" onClick={handleClear}>C</button>
        {btnRows.map((row) =>
          row.map((k) => (
            <button
              key={k}
              className={`gui-calc-btn${["÷", "×", "−", "+"].includes(k) ? " gui-calc-op" : k === "=" ? " gui-calc-eq" : ""}`}
              onClick={() => {
                if (!isNaN(k)) handleDigit(k);
                else if (k === ".") handleDot();
                else if (k === "=") handleEquals();
                else handleOp(k);
              }}
            >
              {k}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// app window
function AppWindow({ app, zIndex, isMinimized, onFocus, onClose, onMinimize, initialPos }) {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const onMouseDown = useCallback((e) => {
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    onFocus();
    e.preventDefault();
  }, [pos, onFocus]);

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return;
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
    function onUp() { dragging.current = false; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div
      ref={windowRef}
      className="gui-window"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex,
        display: isMinimized ? "none" : "flex",
      }}
      onMouseDown={onFocus}
    >
      <div
        className="gui-titlebar"
        onMouseDown={onMouseDown}
        style={{ cursor: "grab" }}
      >
        <span className="gui-window-title">{app.icon} {app.title}</span>
        <div className="gui-window-btns">
          <button
            className="gui-wbtn gui-wbtn-min"
            onClick={onMinimize}
            aria-label="Minimize window"
          >─</button>
          <button
            className="gui-wbtn gui-wbtn-close"
            onClick={onClose}
            aria-label="Close window"
          >✕</button>
        </div>
      </div>
      <div className="gui-window-body">{app.content}</div>
    </div>
  );
}


export default function GUISimulator() {
  const [openWindows, setOpenWindows] = useState([]);
  const [zCounter, setZCounter] = useState(10);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  function openApp(appId) {
    setStartMenuOpen(false);
    const exists = openWindows.find((w) => w.appId === appId);
    if (exists) {
      bringToFront(appId);
      setOpenWindows((prev) =>
        prev.map((w) => w.appId === appId ? { ...w, minimized: false } : w)
      );
      return;
    }
    const idx = APPS.findIndex((a) => a.id === appId);
    setZCounter((z) => z + 1);
    setOpenWindows((prev) => [
      ...prev,
      {
        appId,
        zIndex: zCounter + 1,
        minimized: false,
        pos: { x: 40 + idx * 28, y: 24 + idx * 22 },
      },
    ]);
  }

  function bringToFront(appId) {
    setZCounter((z) => {
      const next = z + 1;
      setOpenWindows((prev) =>
        prev.map((w) => w.appId === appId ? { ...w, zIndex: next } : w)
      );
      return next;
    });
  }

  function closeApp(appId) {
    setOpenWindows((prev) => prev.filter((w) => w.appId !== appId));
  }

  function minimizeApp(appId) {
    setOpenWindows((prev) =>
      prev.map((w) => w.appId === appId ? { ...w, minimized: true } : w)
    );
  }

  const openIds = openWindows.map((w) => w.appId);

  return (
    <div
      className="gui-desktop"
      onClick={() => setStartMenuOpen(false)}
    >
      <div className="gui-desktop-icons">
        {APPS.map((app) => (
          <button
            key={app.id}
            className="gui-icon-btn"
            onDoubleClick={() => openApp(app.id)}
            aria-label={`Open ${app.label}`}
          >
            <span className="gui-icon-emoji">{app.icon}</span>
            <span className="gui-icon-label">{app.label}</span>
          </button>
        ))}
        <button
          className="gui-icon-btn"
          onDoubleClick={() => { }}
          aria-label="Recycle Bin"
        >
          <span className="gui-icon-emoji">🗑️</span>
          <span className="gui-icon-label">Recycle Bin</span>
        </button>
      </div>

      <p className="gui-hint">Double-click icons to open apps</p>

      {openWindows.map((win) => {
        const app = APPS.find((a) => a.id === win.appId);
        if (!app) return null;
        return (
          <AppWindow
            key={win.appId}
            app={app}
            zIndex={win.zIndex}
            isMinimized={win.minimized}
            initialPos={win.pos}
            onFocus={() => bringToFront(win.appId)}
            onClose={() => closeApp(win.appId)}
            onMinimize={() => minimizeApp(win.appId)}
          />
        );
      })}

      <div className="gui-taskbar" onClick={(e) => e.stopPropagation()}>
        <button
          className={`gui-start-btn${startMenuOpen ? " gui-start-active" : ""}`}
          onClick={(e) => { e.stopPropagation(); setStartMenuOpen((o) => !o); }}
          aria-expanded={startMenuOpen}
          aria-haspopup="menu"
        >
          🪟 Start
        </button>

        {startMenuOpen && (
          <div className="gui-start-menu" role="menu">

            {APPS.map((app) => (
              <button
                key={app.id}
                className="gui-start-item"
                onClick={() => openApp(app.id)}
                role="menuitem"
              >
                {app.icon} {app.label}
              </button>
            ))}
            <div className="gui-start-divider" />
            <button className="gui-start-item gui-start-shutdown">
              ⏻ Shut Down…
            </button>
          </div>
        )}

        <div className="gui-taskbar-apps">
          {APPS.filter((a) => openIds.includes(a.id)).map((app) => {
            const win = openWindows.find((w) => w.appId === app.id);
            return (
              <button
                key={app.id}
                className={`gui-taskbar-chip${win && !win.minimized ? " gui-chip-active" : ""}`}
                onClick={() => {
                  if (win?.minimized) {
                    setOpenWindows((prev) =>
                      prev.map((w) => w.appId === app.id ? { ...w, minimized: false } : w)
                    );
                    bringToFront(app.id);
                  } else {
                    minimizeApp(app.id);
                  }
                }}
              >
                {app.icon} {app.label}
              </button>
            );
          })}
        </div>

        <div className="gui-clock">{time}</div>
      </div>

      <style>{`
        /*  Desktop shell  */
        .gui-desktop {
          position: relative;
          width: 100%;
          min-height: 480px;
          background: linear-gradient(135deg, #008080 0%, #005f5f 100%);
          overflow: hidden;
          border-radius: 12px;
          font-family: "Segoe UI", Arial, sans-serif;
          user-select: none;
          padding-bottom: 46px; /* room for taskbar */
        }

        /*  Desktop icons */
        .gui-desktop-icons {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding: 16px 12px;
        }

        .gui-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 4px;
          transition: background 0.15s;
          color: #fff;
          min-width: 68px;
        }

        .gui-icon-btn:hover {
          background: rgba(255,255,255,0.18);
        }

        .gui-icon-btn:focus {
          outline: 2px dotted #fff;
        }

        .gui-icon-emoji {
          font-size: 2rem;
          display: block;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));
        }

        .gui-icon-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
          text-align: center;
        }

        .gui-hint {
          position: absolute;
          top: 12px;
          right: 14px;
          margin: 0;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
          text-align: right;
          pointer-events: none;
        }

        /* Window  */
        .gui-window {
          position: absolute;
          display: flex;
          flex-direction: column;
          min-width: 280px;
          max-width: min(460px, calc(100% - 20px));
          background: #c0c0c0;
          border: 2px solid #fff;
          border-right-color: #555;
          border-bottom-color: #555;
          box-shadow: 3px 3px 0 #000;
          border-radius: 2px;
          overflow: hidden;
        }

        .gui-titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
          color: #fff;
          padding: 3px 4px 3px 8px;
          font-size: 0.78rem;
          font-weight: 700;
          gap: 6px;
          flex-shrink: 0;
        }

        .gui-window-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gui-window-btns {
          display: flex;
          gap: 3px;
          flex-shrink: 0;
        }

        .gui-wbtn {
          width: 18px;
          height: 18px;
          border: 1.5px solid #fff;
          border-right-color: #555;
          border-bottom-color: #555;
          background: #c0c0c0;
          color: #000;
          font-size: 0.65rem;
          display: grid;
          place-items: center;
          cursor: pointer;
          padding: 0;
          font-weight: 900;
          line-height: 1;
        }

        .gui-wbtn:hover {
          background: #d4d4d4;
        }

        .gui-wbtn-close:hover {
          background: #ff5555;
          color: #fff;
        }

        .gui-window-body {
          flex: 1;
          overflow: auto;
          background: #fff;
        }

        /*  Notepad  */
        .gui-notepad-area {
          width: 100%;
          height: 220px;
          background: #fff;
          color: #000;
          border: none;
          outline: none;
          padding: 10px;
          font-family: "Courier New", monospace;
          font-size: 0.82rem;
          resize: none;
          box-sizing: border-box;
          line-height: 1.5;
        }

        /* Paint */
        .gui-paint-wrap {
          background: #c0c0c0;
          padding: 6px;
        }

        .gui-paint-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .gui-palette {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          max-width: 200px;
        }

        .gui-swatch {
          width: 16px;
          height: 16px;
          border: 2px solid #555;
          border-right-color: #fff;
          border-bottom-color: #fff;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }

        .gui-swatch-active {
          border: 3px solid #000080;
          transform: scale(1.2);
        }

        .gui-paint-clear-btn {
          padding: 2px 8px;
          font-size: 0.75rem;
          background: #c0c0c0;
          border: 1.5px solid #fff;
          border-right-color: #555;
          border-bottom-color: #555;
          cursor: pointer;
          font-weight: 700;
        }

        .gui-paint-clear-btn:hover {
          background: #d4d4d4;
        }

        .gui-canvas {
          display: grid;
          border: 2px inset #888;
          cursor: crosshair;
          width: fit-content;
          overflow: hidden;
        }

        .gui-cell {
          border: none;
          outline: none;
          box-sizing: border-box;
          display: block;
        }

        /* File Explorer */
        .gui-explorer {
          display: flex;
          flex-direction: column;
          font-size: 0.82rem;
          background: #fff;
          min-height: 220px;
        }

        .gui-explorer-toolbar {
          background: #c0c0c0;
          padding: 4px 8px;
          font-weight: 700;
          font-size: 0.78rem;
          border-bottom: 1px solid #888;
        }

        .gui-file-list {
          flex: 1;
          overflow-y: auto;
        }

        .gui-file-row {
          display: grid;
          grid-template-columns: 28px 1fr 70px;
          align-items: center;
          padding: 4px 8px;
          cursor: default;
          color: #000;
        }

        .gui-file-row:hover {
          background: #d9e5ff;
        }

        .gui-file-selected {
          background: #000080 !important;
          color: #fff !important;
        }

        .gui-file-icon {
          font-size: 1rem;
        }

        .gui-file-name {
          font-weight: 500;
        }

        .gui-file-size {
          text-align: right;
          color: #666;
          font-size: 0.75rem;
        }

        .gui-file-selected .gui-file-size {
          color: #aac;
        }

        .gui-explorer-status {
          background: #c0c0c0;
          border-top: 1px solid #888;
          padding: 3px 8px;
          font-size: 0.75rem;
          color: #333;
        }

        /*  Calculator  */
        .gui-calc-wrap {
          background: #c0c0c0;
          padding: 10px;
          width: 180px;
        }

        .gui-calc-display {
          background: #d4edba;
          border: 2px inset #888;
          text-align: right;
          padding: 6px 10px;
          font-family: "Courier New", monospace;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 8px;
          min-height: 2rem;
          letter-spacing: 1px;
          word-break: break-all;
        }

        .gui-calc-btn-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
        }

        .gui-calc-btn {
          padding: 8px 4px;
          background: #c0c0c0;
          border: 1.5px solid #fff;
          border-right-color: #555;
          border-bottom-color: #555;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .gui-calc-btn:hover {
          background: #d4d4d4;
        }

        .gui-calc-btn:active {
          border-color: #555;
          border-right-color: #fff;
          border-bottom-color: #fff;
        }

        .gui-calc-op {
          color: #000080;
          background: #d4d4e8;
        }

        .gui-calc-eq {
          background: #000080;
          color: #fff;
        }

        .gui-calc-eq:hover {
          background: #0000aa;
        }

        .gui-calc-clear {
          grid-column: 1 / -1;
          background: #c06060;
          color: #fff;
        }

        .gui-calc-clear:hover {
          background: #d07070;
        }

        /*  Taskbar  */
        .gui-taskbar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: #c0c0c0;
          border-top: 2px solid #fff;
          border-bottom: 2px solid #555;
          display: flex;
          align-items: center;
          padding: 0 6px;
          gap: 6px;
          z-index: 9999;
        }

        .gui-start-btn {
          padding: 3px 12px;
          background: #c0c0c0;
          border: 1.5px solid #fff;
          border-right-color: #555;
          border-bottom-color: #555;
          font-weight: 900;
          font-size: 0.82rem;
          cursor: pointer;
          letter-spacing: 0.3px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .gui-start-btn:hover,
        .gui-start-active {
          background: #d4d4d4;
          border-color: #555;
          border-right-color: #fff;
          border-bottom-color: #fff;
        }

        .gui-taskbar-apps {
          display: flex;
          flex: 1;
          gap: 4px;
          overflow-x: auto;
          align-items: center;
        }

        .gui-taskbar-chip {
          padding: 3px 10px;
          background: #b0b0b0;
          border: 1.5px solid #fff;
          border-right-color: #555;
          border-bottom-color: #555;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gui-chip-active {
          background: #d4d4d4;
          border-color: #555;
          border-right-color: #fff;
          border-bottom-color: #fff;
        }

        .gui-clock {
          background: #b0b0b0;
          border: 1.5px inset #888;
          padding: 3px 10px;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
          font-family: "Courier New", monospace;
        }

        /*  Start menu  */
        .gui-start-menu {
          position: absolute;
          bottom: 44px;
          left: 6px;
          background: #c0c0c0;
          border: 2px solid #fff;
          border-right-color: #555;
          border-bottom-color: #555;
          box-shadow: 3px 3px 0 #000;
          min-width: 180px;
          z-index: 99999;
          display: flex;
          flex-direction: column;
        }

        .gui-start-item {
          background: transparent;
          border: none;
          text-align: left;
          padding: 8px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          white-space: nowrap;
        }

        .gui-start-item:hover {
          background: #000080;
          color: #fff;
        }

        .gui-start-divider {
          height: 1px;
          background: #888;
          margin: 4px 0;
        }

        .gui-start-shutdown {
          color: #600;
        }

        .gui-start-shutdown:hover {
          color: #fff;
        }

        /* Responsive  */
        @media (max-width: 540px) {
          .gui-desktop {
            min-height: 420px;
          }
          .gui-window {
            min-width: 240px;
            max-width: calc(100% - 12px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gui-icon-btn,
          .gui-wbtn,
          .gui-calc-btn,
          .gui-swatch {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
