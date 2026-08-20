import { useRef, useState, useCallback, useEffect } from "react";

const STEPS = [
  {
    id: "tap",
    label: "Tap",
    instruction: "Tap the Photos icon to open it.",
    hint: "A single, quick touch.",
  },
  {
    id: "double-tap",
    label: "Double Tap",
    instruction: "Double tap the photo to like it.",
    hint: "Two quick taps in the same spot.",
  },
  {
    id: "long-press",
    label: "Long Press",
    instruction: "Press and hold the photo to open sharing options.",
    hint: "Hold your touch for about a second without moving.",
  },
  {
    id: "swipe-left",
    label: "Swipe Left",
    instruction: "Swipe left to view the next photo.",
    hint: "Drag your touch quickly to the left.",
  },
  {
    id: "swipe-right",
    label: "Swipe Right",
    instruction: "Swipe right to view the previous photo.",
    hint: "Drag your touch quickly to the right.",
  },
  {
    id: "pinch-out",
    label: "Pinch Out",
    instruction: "Pinch outward on the photo to zoom in.",
    hint: "On touch: spread two fingers apart. On desktop: scroll up.",
  },
  {
    id: "pinch-in",
    label: "Pinch In",
    instruction: "Pinch inward on the photo to zoom back out.",
    hint: "On touch: bring two fingers together. On desktop: scroll down.",
  },
];

const PHOTOS = [
  { id: "mountains", label: "Mountains", gradient: "linear-gradient(135deg,#8fc9a3 0%,#cfe8d8 100%)" },
  { id: "sunset", label: "Sunset", gradient: "linear-gradient(135deg,#f97316 0%,#fbbf24 100%)" },
  { id: "ocean", label: "Ocean", gradient: "linear-gradient(135deg,#0ea5e9 0%,#67e8f9 100%)" },
];

const HOME_APPS = [
  { id: "photos", icon: "🖼️", label: "Photos", bg: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id: "notes", icon: "📝", label: "Notes", bg: "linear-gradient(135deg,#fde68a,#f59e0b)" },
  { id: "calculator", icon: "🧮", label: "Calculator", bg: "linear-gradient(135deg,#374151,#111827)" },
  { id: "camera", icon: "📷", label: "Camera", bg: "linear-gradient(135deg,#4b5563,#111827)" },
  { id: "messages", icon: "💬", label: "Messages", bg: "linear-gradient(135deg,#34d399,#059669)" },
  { id: "settings", icon: "⚙️", label: "Settings", bg: "linear-gradient(135deg,#9ca3af,#6b7280)" },
];

const LONG_PRESS_MS = 600;
const DOUBLE_TAP_MS = 320;
const TAP_MOVE_TOLERANCE = 10;
const SWIPE_MIN_DISTANCE = 45;
const PINCH_MIN_DELTA = 30;

function isTutorialScreen(screen) {
  return screen === "home" || screen === "photos";
}

const KBD_ROW1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const KBD_ROW2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const KBD_ROW3 = ["z", "x", "c", "v", "b", "n", "m"];

const KBD_NUM_ROW1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const KBD_NUM_ROW2 = ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'];
const KBD_NUM_ROW3 = [".", ",", "?", "!", "'"];

function PhoneKeyboard({ onChar, onBackspace, onSpace, onReturn, returnLabel = "return", returnEnabled = true }) {
  const [shift, setShift] = useState(true);
  const [numMode, setNumMode] = useState(false);

  const row1 = numMode ? KBD_NUM_ROW1 : KBD_ROW1;
  const row2 = numMode ? KBD_NUM_ROW2 : KBD_ROW2;
  const row3 = numMode ? KBD_NUM_ROW3 : KBD_ROW3;

  function pressKey(k) {
    if (numMode) {
      onChar(k);
      return;
    }
    onChar(shift ? k.toUpperCase() : k);
    if (shift) setShift(false);
  }

  return (
    <div className="sgs-kbd" onPointerDown={(e) => e.stopPropagation()}>
      <div className="sgs-kbd-row">
        {row1.map((k) => (
          <button key={k} className="sgs-key" onClick={() => pressKey(k)}>
            {numMode ? k : shift ? k.toUpperCase() : k}
          </button>
        ))}
      </div>
      <div className="sgs-kbd-row sgs-kbd-row-indent">
        {row2.map((k) => (
          <button key={k} className="sgs-key" onClick={() => pressKey(k)}>
            {numMode ? k : shift ? k.toUpperCase() : k}
          </button>
        ))}
      </div>
      <div className="sgs-kbd-row">
        {!numMode && (
          <button
            className={"sgs-key sgs-key-fn sgs-key-shift" + (shift ? " active" : "")}
            onClick={() => setShift((s) => !s)}
            aria-label="Shift"
          >
            ⇧
          </button>
        )}
        {row3.map((k) => (
          <button key={k} className="sgs-key" onClick={() => pressKey(k)}>
            {numMode ? k : shift ? k.toUpperCase() : k}
          </button>
        ))}
        <button className="sgs-key sgs-key-fn sgs-key-back" onClick={onBackspace} aria-label="Backspace">
          ⌫
        </button>
      </div>
      <div className="sgs-kbd-row sgs-kbd-bottom-row">
        <button className="sgs-key sgs-key-fn sgs-key-123" onClick={() => setNumMode((m) => !m)}>
          {numMode ? "ABC" : "123"}
        </button>
        <button className="sgs-key sgs-key-space" onClick={onSpace}>
          space
        </button>
        <button
          className={"sgs-key sgs-key-fn sgs-key-return" + (returnEnabled ? " enabled" : "")}
          onClick={onReturn}
          disabled={!returnEnabled}
        >
          {returnLabel}
        </button>
      </div>
    </div>
  );
}

function NotesApp() {
  const [text, setText] = useState("");

  return (
    <div className="sgs-notes-wrap">
      <div className="sgs-notes-display" aria-label="Notes content">
        {text ? text : <span className="sgs-placeholder">Tap the keyboard to start typing…</span>}
        <span className="sgs-caret" />
      </div>
      <PhoneKeyboard
        onChar={(c) => setText((t) => t + c)}
        onBackspace={() => setText((t) => t.slice(0, -1))}
        onSpace={() => setText((t) => t + " ")}
        onReturn={() => setText((t) => t + "\n")}
        returnLabel="return"
        returnEnabled={true}
      />
    </div>
  );
}

function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState(null);
  const [fresh, setFresh] = useState(true);

  function handleDigit(d) {
    setDisplay((prev) => (fresh || prev === "0" ? String(d) : prev + d));
    setFresh(false);
  }
  function handleOp(op) {
    setPending({ value: parseFloat(display), op });
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

  const rows = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "−"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="sgs-calc-wrap">
      <div className="sgs-calc-display" aria-live="polite">{display}</div>
      <div className="sgs-calc-grid">
        <button className="sgs-calc-btn sgs-calc-clear" onClick={handleClear}>C</button>
        {rows.map((row) =>
          row.map((k) => (
            <button
              key={k}
              className={
                "sgs-calc-btn" +
                (["÷", "×", "−", "+"].includes(k) ? " sgs-calc-op" : k === "=" ? " sgs-calc-eq" : "")
              }
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

function CameraApp() {
  const [flash, setFlash] = useState(false);
  const [count, setCount] = useState(0);

  function shoot() {
    setFlash(true);
    setCount((c) => c + 1);
    setTimeout(() => setFlash(false), 160);
  }

  return (
    <div className="sgs-camera-wrap">
      <div className="sgs-viewfinder">
        <div className="sgs-viewfinder-grid" />
        {flash && <div className="sgs-camera-flash" />}
        <span className="sgs-camera-counter">{count} photo{count === 1 ? "" : "s"} taken</span>
      </div>
      <button className="sgs-shutter-btn" onClick={shoot} aria-label="Take photo" />
    </div>
  );
}

function MessagesApp() {
  const [thread, setThread] = useState([
    { from: "them", text: "Hey! Have you tried the museum's touch exhibit yet?" },
    { from: "me", text: "Just opening it now 👀" },
  ]);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    setThread((prev) => [...prev, { from: "me", text: draft.trim() }]);
    setDraft("");
  }

  return (
    <div className="sgs-messages-wrap">
      <div className="sgs-messages-list">
        {thread.map((m, i) => (
          <div key={i} className={"sgs-bubble-row " + (m.from === "me" ? "me" : "them")}>
            <span className="sgs-bubble">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="sgs-messages-draft-row">
        <span className="sgs-messages-draft">
          {draft ? draft : <span className="sgs-placeholder">Message</span>}
          <span className="sgs-caret" />
        </span>
      </div>
      <PhoneKeyboard
        onChar={(c) => setDraft((d) => d + c)}
        onBackspace={() => setDraft((d) => d.slice(0, -1))}
        onSpace={() => setDraft((d) => d + " ")}
        onReturn={send}
        returnLabel="send"
        returnEnabled={draft.trim().length > 0}
      />
    </div>
  );
}

function SettingsApp() {
  const [toggles, setToggles] = useState({
    wifi: true,
    bluetooth: false,
    airplane: false,
    dnd: false,
  });

  const rows = [
    { key: "wifi", label: "Wi-Fi" },
    { key: "bluetooth", label: "Bluetooth" },
    { key: "airplane", label: "Airplane Mode" },
    { key: "dnd", label: "Do Not Disturb" },
  ];

  return (
    <div className="sgs-settings-wrap">
      {rows.map((r) => (
        <div key={r.key} className="sgs-settings-row">
          <span>{r.label}</span>
          <button
            className={"sgs-toggle" + (toggles[r.key] ? " on" : "")}
            onClick={() => setToggles((t) => ({ ...t, [r.key]: !t[r.key] }))}
            role="switch"
            aria-checked={toggles[r.key]}
            aria-label={r.label}
          >
            <span className="sgs-toggle-knob" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function SmartphoneGesture() {
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [missShake, setMissShake] = useState(false);
  const [pressingIcon, setPressingIcon] = useState(false);

  const [screenState, setScreenState] = useState("home");
  const [photos, setPhotos] = useState(PHOTOS);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [slideDir, setSlideDir] = useState(null);
  const [zoom, setZoom] = useState(1);

  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
      10000
    );
    return () => clearInterval(id);
  }, []);

  const phoneRef = useRef(null);
  const iconRefs = useRef({});
  const pointers = useRef(new Map());
  const longPressTimer = useRef(null);
  const tapTimer = useRef(null);
  const lastTapTime = useRef(0);
  const dragStart = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef(0);
  const gestureLocked = useRef(false);

  const currentGesture = STEPS[stepIndex];

  const flashFeedback = useCallback((text, success) => {
    setFeedback(text);
    if (!success) {
      setMissShake(true);
      setTimeout(() => setMissShake(false), 350);
    }
    window.clearTimeout(flashFeedback._t);
    flashFeedback._t = window.setTimeout(() => setFeedback(""), 1600);
  }, []);

  const advance = useCallback(
    (gestureId) => {
      if (gestureId !== currentGesture.id) {
        flashFeedback(`Not quite — try: ${currentGesture.instruction}`, false);
        return;
      }
      flashFeedback("Nice — gesture recognized!", true);
      if (stepIndex + 1 >= STEPS.length) {
        setCompleted(true);
        return;
      }
      setStepIndex((i) => i + 1);
    },
    [currentGesture, stepIndex, flashFeedback]
  );

  function openApp(appId) {
    setScreenState(appId);
    if (appId === "photos") {
      setPhotoIndex(0);
      setLiked(false);
      setZoom(1);
      setSheetOpen(false);
    }
  }

  function goHome() {
    setScreenState("home");
    setSheetOpen(false);
  }

  function nextPhoto() {
    setPhotoIndex((i) => (i + 1) % photos.length);
    setLiked(false);
    setZoom(1);
  }
  function prevPhoto() {
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
    setLiked(false);
    setZoom(1);
  }

  function handleShare() {
    setSheetOpen(false);
    flashFeedback("Shared! (demo only)", true);
  }
  function handleSaveToFiles() {
    setSheetOpen(false);
    flashFeedback("Saved to Files! (demo only)", true);
  }
  function handleDeletePhoto() {
    if (photos.length <= 1) {
      flashFeedback("Can't delete the last photo", false);
      return;
    }
    setPhotos((prev) => prev.filter((_, i) => i !== photoIndex));
    setPhotoIndex(0);
    setLiked(false);
    setZoom(1);
    setSheetOpen(false);
    flashFeedback("Photo deleted", true);
  }

  useEffect(() => {
    if (!sheetOpen) return;
    const id = setTimeout(() => setSheetOpen(false), 5000);
    return () => clearTimeout(id);
  }, [sheetOpen]);

  function resetAll() {
    setStepIndex(0);
    setCompleted(false);
    setFeedback("");
    setScreenState("home");
    setPhotos(PHOTOS);
    setPhotoIndex(0);
    setLiked(false);
    setHeartBurst(false);
    setSheetOpen(false);
    setSlideDir(null);
    setZoom(1);
    gestureLocked.current = false;
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  function clearLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }
  function hitTestIcon(clientX, clientY) {
    for (const app of HOME_APPS) {
      const el = iconRefs.current[app.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        return app.id;
      }
    }
    return null;
  }

  function isRealInteractiveTarget(target) {
    const el = target.closest && target.closest("button, input, textarea");
    if (!el) return false;
    return !el.classList.contains("sgs-app-icon");
  }

  function handlePointerDown(e) {
    if (!isTutorialScreen(screenState)) return;
    if (isRealInteractiveTarget(e.target)) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY };
      setPressingIcon(true);
      clearLongPress();

      if (screenState === "photos" && !sheetOpen) {
        longPressTimer.current = setTimeout(() => {
          if (pointers.current.size === 1) {
            setPressingIcon(false);
            setSheetOpen(true);
            advance("long-press");
          }
        }, LONG_PRESS_MS);
      }
    }

    if (pointers.current.size === 2 && screenState === "photos") {
      clearLongPress();
      gestureLocked.current = true;
      const [p1, p2] = [...pointers.current.values()];
      pinchStartDist.current = dist(p1, p2);
    }
  }

  function handlePointerMove(e) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && screenState === "photos") {
      const [p1, p2] = [...pointers.current.values()];
      const currentDist = dist(p1, p2);
      const delta = currentDist - pinchStartDist.current;

      if (delta > PINCH_MIN_DELTA) {
        setZoom((z) => Math.min(2, z + 0.25));
        advance("pinch-out");
        pinchStartDist.current = currentDist;
      } else if (delta < -PINCH_MIN_DELTA) {
        setZoom((z) => Math.max(0.6, z - 0.25));
        advance("pinch-in");
        pinchStartDist.current = currentDist;
      }
      return;
    }

    const start = dragStart.current;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_MOVE_TOLERANCE) {
      clearLongPress();
      setPressingIcon(false);
    }
  }

  function handlePointerUp(e) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    setPressingIcon(false);

    if (gestureLocked.current) {
      if (pointers.current.size === 0) gestureLocked.current = false;
      return;
    }
    clearLongPress();

    const start = dragStart.current;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (screenState === "photos" && absDx > SWIPE_MIN_DISTANCE && absDx > absDy * 1.5) {
      setSheetOpen(false);
      if (dx < 0) {
        nextPhoto();
        setSlideDir("left");
        advance("swipe-left");
      } else {
        prevPhoto();
        setSlideDir("right");
        advance("swipe-right");
      }
      setTimeout(() => setSlideDir(null), 260);
      return;
    }

    if (absDx <= TAP_MOVE_TOLERANCE && absDy <= TAP_MOVE_TOLERANCE) {
      if (screenState === "home") {
        const tappedId = hitTestIcon(e.clientX, e.clientY);
        if (tappedId === "photos") {
          openApp("photos");
          if (currentGesture.id === "tap") advance("tap");
        } else if (tappedId) {
          openApp(tappedId);
        }
        return;
      }

      if (screenState === "photos" && !sheetOpen) {
        const now = Date.now();
        if (now - lastTapTime.current < DOUBLE_TAP_MS) {
          clearTimeout(tapTimer.current);
          lastTapTime.current = 0;
          setLiked((v) => !v);
          setHeartBurst(true);
          setTimeout(() => setHeartBurst(false), 550);
          advance("double-tap");
          return;
        }
        lastTapTime.current = now;
        tapTimer.current = setTimeout(() => {}, DOUBLE_TAP_MS);
      }
    }
  }

  // Non-passive wheel listener so scrolling to "pinch" never scrolls the page
  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return;

    function onWheel(e) {
      if (screenState !== "photos") return;
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom((z) => Math.min(2, z + 0.2));
        advance("pinch-out");
      } else {
        setZoom((z) => Math.max(0.6, z - 0.2));
        advance("pinch-in");
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [screenState, advance]);

  const activeApp = HOME_APPS.find((a) => a.id === screenState);

  return (
    <div className="sgs-wrapper">
      <div className="sgs-header">
        {!completed ? (
          <p className="sgs-instruction">{currentGesture.instruction}</p>
        ) : (
          <p className="sgs-instruction">All gestures completed — nice work!</p>
        )}
        {!completed && <p className="sgs-hint">{currentGesture.hint}</p>}
      </div>

      <div className="sgs-progress-row" aria-label="Gesture progress">
        {STEPS.map((g, i) => (
          <span
            key={g.id}
            className={"sgs-dot" + (i < stepIndex || completed ? " done" : i === stepIndex ? " active" : "")}
            title={g.label}
          />
        ))}
      </div>

      <div className="sgs-stage">
        <div
          ref={phoneRef}
          className={"sgs-phone" + (missShake ? " shake" : "") + (pressingIcon ? " pressing" : "")}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="application"
          aria-label="Virtual smartphone"
        >
          <div className="sgs-notch" />

          <div className="sgs-status-bar">
            <span className="sgs-status-time">{time}</span>
            <span className="sgs-status-icons">📶 🔋</span>
          </div>

          <div className={"sgs-screen slide-" + (slideDir || "none")}>
            {screenState === "home" && (
              <div className="sgs-home">
                <div className="sgs-app-grid">
                  {HOME_APPS.map((app) => (
                    <button
                      key={app.id}
                      ref={(el) => (iconRefs.current[app.id] = el)}
                      className={"sgs-app-icon" + (app.id === "photos" && currentGesture.id === "tap" ? " target" : "")}
                      style={{ "--icon-bg": app.bg }}
                      tabIndex={-1}
                    >
                      <span className="sgs-icon-glyph">{app.icon}</span>
                      <span className="sgs-icon-label">{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {screenState === "photos" && (
              <div className="sgs-app-screen">
                <div className="sgs-app-topbar">
                  <button className="sgs-back-btn" onClick={goHome} aria-label="Back to home">‹</button>
                  <span>Photos</span>
                  <span className="sgs-app-topbar-spacer" />
                </div>
                <div className="sgs-photo" style={{ transform: `scale(${zoom})` }}>
                  <div className="sgs-photo-fill" style={{ background: photos[photoIndex]?.gradient }} />
                  {heartBurst && <div className="sgs-heart-burst">❤</div>}
                  {liked && <div className="sgs-liked-badge">❤ Liked</div>}
                  <span className="sgs-photo-caption">{photos[photoIndex]?.label}</span>
                </div>
                <div className="sgs-photo-dots">
                  {photos.map((p, i) => (
                    <span key={p.id} className={"sgs-photo-dot" + (i === photoIndex ? " active" : "")} />
                  ))}
                </div>

                {sheetOpen && (
                  <div className="sgs-sheet-backdrop" onClick={() => setSheetOpen(false)}>
                    <div className="sgs-sheet" onClick={(e) => e.stopPropagation()}>
                      <div className="sgs-sheet-handle" />
                      <button className="sgs-sheet-item" onClick={handleShare}>Share</button>
                      <button className="sgs-sheet-item" onClick={handleSaveToFiles}>Save to Files</button>
                      <button className="sgs-sheet-item sgs-sheet-danger" onClick={handleDeletePhoto}>Delete</button>
                      <button className="sgs-sheet-item sgs-sheet-cancel" onClick={() => setSheetOpen(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {screenState === "notes" && (
              <div className="sgs-app-screen">
                <div className="sgs-app-topbar">
                  <button className="sgs-back-btn" onClick={goHome} aria-label="Back to home">‹</button>
                  <span>Notes</span>
                  <span className="sgs-app-topbar-spacer" />
                </div>
                <NotesApp />
              </div>
            )}

            {screenState === "calculator" && (
              <div className="sgs-app-screen">
                <div className="sgs-app-topbar">
                  <button className="sgs-back-btn" onClick={goHome} aria-label="Back to home">‹</button>
                  <span>Calculator</span>
                  <span className="sgs-app-topbar-spacer" />
                </div>
                <CalculatorApp />
              </div>
            )}

            {screenState === "camera" && (
              <div className="sgs-app-screen">
                <div className="sgs-app-topbar sgs-app-topbar-dark">
                  <button className="sgs-back-btn" onClick={goHome} aria-label="Back to home">‹</button>
                  <span>Camera</span>
                  <span className="sgs-app-topbar-spacer" />
                </div>
                <CameraApp />
              </div>
            )}

            {screenState === "messages" && (
              <div className="sgs-app-screen">
                <div className="sgs-app-topbar">
                  <button className="sgs-back-btn" onClick={goHome} aria-label="Back to home">‹</button>
                  <span>Messages</span>
                  <span className="sgs-app-topbar-spacer" />
                </div>
                <MessagesApp />
              </div>
            )}

            {screenState === "settings" && (
              <div className="sgs-app-screen">
                <div className="sgs-app-topbar">
                  <button className="sgs-back-btn" onClick={goHome} aria-label="Back to home">‹</button>
                  <span>Settings</span>
                  <span className="sgs-app-topbar-spacer" />
                </div>
                <SettingsApp />
              </div>
            )}
          </div>

          {screenState !== "home" ? (
            <button className="sgs-home-bar sgs-home-bar-btn" onClick={goHome} aria-label="Go home" />
          ) : (
            <div className="sgs-home-bar" />
          )}
        </div>

        {feedback && (
          <div className={"sgs-toast" + (missShake ? " miss" : " hit")}>{feedback}</div>
        )}
      </div>

      {completed && (
        <button className="sgs-replay-btn" onClick={resetAll}>
          Restart Simulator
        </button>
      )}

      <style>{`
        .sgs-wrapper {
          font-family: "Segoe UI", Arial, Helvetica, sans-serif;
          color: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 0.25rem;
        }

        .sgs-header {
          text-align: center;
          max-width: 420px;
        }

        .sgs-instruction {
          margin: 0;
          font-weight: 700;
          font-size: 0.98rem;
        }

        .sgs-hint {
          margin: 0.25rem 0 0;
          font-size: 0.82rem;
          color: #555;
        }

        .sgs-progress-row {
          display: flex;
          gap: 0.4rem;
        }

        .sgs-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d9dce1;
          border: 2px solid #b7bcc4;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .sgs-dot.active {
          background: #eab308;
          border-color: #eab308;
          transform: scale(1.25);
        }

        .sgs-dot.done {
          background: #111;
          border-color: #111;
        }

        .sgs-stage {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sgs-phone {
          width: 240px;
          height: 460px;
          background: #111;
          border-radius: 36px;
          padding: 10px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
          position: relative;
          touch-action: none;
          user-select: none;
          transition: transform 0.15s ease;
          display: flex;
          flex-direction: column;
        }

        .sgs-phone.pressing {
          transform: scale(0.985);
        }

        .sgs-phone.shake {
          animation: sgs-shake 0.35s ease;
        }

        @keyframes sgs-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .sgs-notch {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 16px;
          background: #111;
          border-radius: 0 0 12px 12px;
          z-index: 5;
        }

        .sgs-status-bar {
          display: flex;
          justify-content: space-between;
          padding: 6px 18px 2px;
          font-size: 0.68rem;
          font-weight: 900;
          color: #333;
          background: #f4f4f5;
          border-radius: 24px 24px 0 0;
        }

        .sgs-screen {
          flex: 1;
          width: 100%;
          background: #f4f4f5;
          border-radius: 0 0 24px 24px;
          overflow: hidden;
          position: relative;
          transition: transform 0.25s ease;
        }

        .sgs-screen.slide-left { animation: sgs-slide-left 0.26s ease; }
        .sgs-screen.slide-right { animation: sgs-slide-right 0.26s ease; }

        @keyframes sgs-slide-left {
          0% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-18px); opacity: 0.6; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes sgs-slide-right {
          0% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(18px); opacity: 0.6; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .sgs-home {
          height: 100%;
        }

        .sgs-app-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          padding: 26px 18px;
        }

        .sgs-app-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #333;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .sgs-icon-glyph {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: var(--icon-bg, #d9dce1);
          display: grid;
          place-items: center;
          font-size: 1.35rem;
          box-shadow: 0 3px 6px rgba(0,0,0,0.25);
        }

        .sgs-app-icon.target .sgs-icon-glyph {
          box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.55), 0 3px 6px rgba(0,0,0,0.25);
        }

        .sgs-app-topbar {
          display: grid;
          grid-template-columns: 32px 1fr 32px;
          align-items: center;
          padding: 8px 10px;
          font-size: 0.85rem;
          font-weight: 800;
          text-align: center;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
        }

        .sgs-app-topbar-dark {
          background: #111;
          color: #fff;
          border-bottom: 1px solid #000;
        }

        .sgs-back-btn {
          background: none;
          border: none;
          font-size: 1.3rem;
          font-weight: 900;
          cursor: pointer;
          color: inherit;
          line-height: 1;
        }

        .sgs-app-topbar-spacer {
          width: 32px;
        }

        .sgs-app-screen {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* Photos */
        .sgs-photo {
          margin: 14px;
          flex: 1;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .sgs-photo-fill {
          position: absolute;
          inset: 0;
        }

        .sgs-photo-caption {
          position: relative;
          z-index: 1;
          color: #fff;
          font-weight: 900;
          text-shadow: 0 2px 6px rgba(0,0,0,0.4);
          font-size: 0.95rem;
        }

        .sgs-photo-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          padding-bottom: 10px;
        }

        .sgs-photo-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #cbd5e1;
        }
        .sgs-photo-dot.active {
          background: #111;
        }

        .sgs-heart-burst {
          position: absolute;
          font-size: 3rem;
          color: #ef4444;
          animation: sgs-heart-pop 0.55s ease forwards;
          z-index: 2;
        }

        @keyframes sgs-heart-pop {
          0% { transform: scale(0.4); opacity: 0; }
          40% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .sgs-liked-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #111;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 999px;
          z-index: 2;
        }

        .sgs-sheet-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: flex-end;
        }

        .sgs-sheet {
          width: 100%;
          background: #fff;
          border-radius: 18px 18px 0 0;
          padding: 10px 14px 16px;
          animation: sgs-sheet-up 0.22s ease;
        }

        @keyframes sgs-sheet-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }

        .sgs-sheet-handle {
          width: 36px;
          height: 4px;
          background: #d9dce1;
          border-radius: 999px;
          margin: 0 auto 10px;
        }

        .sgs-sheet-item {
          display: block;
          width: 100%;
          background: none;
          border: none;
          border-top: 1px solid #eee;
          padding: 10px 4px;
          font-weight: 700;
          font-size: 0.88rem;
          text-align: center;
          cursor: pointer;
        }

        .sgs-sheet-danger { color: #dc2626; }
        .sgs-sheet-cancel { border-top: none; margin-top: 6px; color: #666; }

        /* Notes */
        .sgs-notes-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fff;
          min-height: 0;
        }

        .sgs-notes-display {
          flex: 1;
          padding: 12px;
          font-family: "Courier New", monospace;
          font-size: 0.8rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-y: auto;
          touch-action: pan-y;
        }

        .sgs-placeholder {
          color: #9ca3af;
        }

        .sgs-caret {
          display: inline-block;
          width: 2px;
          height: 0.9em;
          background: #111;
          margin-left: 1px;
          vertical-align: text-bottom;
          animation: sgs-caret-blink 1s step-start infinite;
        }

        @keyframes sgs-caret-blink {
          50% { opacity: 0; }
        }

        /* On-screen keyboard */
        .sgs-kbd {
          flex-shrink: 0;
          background: #d1d5db;
          padding: 6px 4px 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sgs-kbd-row {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .sgs-kbd-row-indent {
          padding: 0 8px;
        }

        .sgs-key {
          flex: 1;
          min-width: 0;
          max-width: 24px;
          height: 30px;
          background: #fff;
          border: none;
          border-radius: 5px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.25);
          font-size: 0.68rem;
          font-weight: 600;
          color: #111;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sgs-key:active {
          background: #e5e7eb;
        }

        .sgs-key-fn {
          background: #9ca3af;
          color: #fff;
          font-size: 0.72rem;
        }

        .sgs-key-fn:active {
          background: #868e9c;
        }

        .sgs-key-shift.active {
          background: #fff;
          color: #111;
        }

        .sgs-key-back,
        .sgs-key-123 {
          max-width: 34px;
        }

        .sgs-kbd-bottom-row {
          align-items: center;
        }

        .sgs-key-space {
          flex: 5;
          max-width: none;
          background: #fff;
        }

        .sgs-key-return {
          max-width: 60px;
          background: #9ca3af;
        }

        .sgs-key-return.enabled {
          background: #2563eb;
        }

        .sgs-key-return:disabled {
          opacity: 0.6;
          cursor: default;
        }

        /* Calculator */
        .sgs-calc-wrap {
          flex: 1;
          padding: 14px;
          display: flex;
          flex-direction: column;
        }

        .sgs-calc-display {
          background: #d4edba;
          border: 2px inset #888;
          text-align: right;
          padding: 8px 10px;
          font-family: "Courier New", monospace;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 10px;
          min-height: 2rem;
          word-break: break-all;
          border-radius: 4px;
        }

        .sgs-calc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .sgs-calc-btn {
          padding: 12px 4px;
          background: #e5e7eb;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
        }

        .sgs-calc-btn:hover { background: #d1d5db; }
        .sgs-calc-op { color: #1e3a8a; background: #dbeafe; }
        .sgs-calc-eq { background: #111; color: #fff; grid-row: span 1; }
        .sgs-calc-clear { grid-column: 1 / -1; background: #fca5a5; color: #7f1d1d; }

        /* Camera */
        .sgs-camera-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          background: #111;
          padding: 14px;
        }

        .sgs-viewfinder {
          flex: 1;
          width: 100%;
          background: #1f2937;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 10px;
        }

        .sgs-viewfinder-grid {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px) 0 0/33% 100%,
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px) 0 0/100% 33%;
        }

        .sgs-camera-flash {
          position: absolute;
          inset: 0;
          background: #fff;
        }

        .sgs-camera-counter {
          position: relative;
          z-index: 1;
          color: #d1d5db;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .sgs-shutter-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid #9ca3af;
          margin-top: 12px;
          cursor: pointer;
        }

        .sgs-shutter-btn:active {
          background: #e5e7eb;
        }

        /* Messages */
        .sgs-messages-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fff;
        }

        .sgs-messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          touch-action: pan-y;
        }

        .sgs-bubble-row {
          display: flex;
        }
        .sgs-bubble-row.me { justify-content: flex-end; }
        .sgs-bubble-row.them { justify-content: flex-start; }

        .sgs-bubble {
          max-width: 75%;
          padding: 8px 12px;
          border-radius: 16px;
          font-size: 0.8rem;
          line-height: 1.35;
        }

        .sgs-bubble-row.me .sgs-bubble {
          background: #3b82f6;
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .sgs-bubble-row.them .sgs-bubble {
          background: #e5e7eb;
          color: #111;
          border-bottom-left-radius: 4px;
        }

        .sgs-messages-draft-row {
          display: flex;
          align-items: center;
          padding: 8px;
          border-top: 1px solid #e5e7eb;
        }

        .sgs-messages-draft {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 0.8rem;
          min-height: 1.4em;
          display: block;
        }

        /* Settings */
        .sgs-settings-wrap {
          flex: 1;
          padding: 10px 14px;
          background: #fff;
        }

        .sgs-settings-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 4px;
          border-bottom: 1px solid #eee;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .sgs-toggle {
          width: 42px;
          height: 24px;
          border-radius: 999px;
          background: #d1d5db;
          border: none;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .sgs-toggle.on { background: #22c55e; }

        .sgs-toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s ease;
          display: block;
        }
        .sgs-toggle.on .sgs-toggle-knob {
          transform: translateX(18px);
        }

        /* Home indicator */
        .sgs-home-bar {
          position: relative;
          margin: 8px auto 2px;
          width: 90px;
          height: 5px;
          background: #444;
          border-radius: 999px;
        }

        .sgs-home-bar-btn {
          border: none;
          cursor: pointer;
        }

        .sgs-toast {
          margin-top: 0.8rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 800;
          text-align: center;
          max-width: 280px;
        }

        .sgs-toast.hit { background: #111; color: #fff; }
        .sgs-toast.miss { background: #fee2e2; color: #991b1b; }

        .sgs-replay-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .sgs-replay-btn:hover {
          background: #2c2c2c;
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .sgs-phone, .sgs-screen, .sgs-photo, .sgs-heart-burst, .sgs-sheet {
            animation: none !important;
            transition: none !important;
          }
        }

        @media (max-width: 480px) {
          .sgs-phone {
            width: 210px;
            height: 410px;
          }
        }
      `}</style>
    </div>
  );
}