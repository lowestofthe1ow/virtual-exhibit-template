/**
 * HeartbleedSimulation.jsx
 *
 * Interactive Heartbleed (CVE-2014-0160) simulation. Renders one of three
 * stages depending on the `stage` prop:
 *   - "healthy"   Stage 1: a normal heartbeat request/response
 *   - "attack"    Stage 2: a malformed heartbeat leaking server memory
 *   - "aftermath" Stage 3: the fallout across the wider web
 */

import { useMemo, useRef, useState } from "react";
import HeartWireframe from "./HeartWireframe.jsx";
import WireframeGlobe from "./WireframeGlobe.jsx";
import DraggablePopup from "./PopupBoxes.jsx";

// (w-56 = 224px wide).
const POPUP_W = 224;
const POPUP_H = 90;
const MIN_GAP = 50; // minimum px gap enforced between popup top-left corners

// randomize popup positions based on coordinates
function findNonOverlappingPosition(containerW, containerH, existingPopups, maxAttempts = 30) {
  const margin = 16;
  const maxX = Math.max(containerW - POPUP_W - margin, margin);
  const maxY = Math.max(containerH - POPUP_H - margin, margin);

  let bestCandidate = { x: margin, y: margin };
  let bestMinDist = -Infinity;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);

    if (existingPopups.length === 0) {
      return { x, y };
    }

    let minDist = Infinity;
    for (const p of existingPopups) {
      const dx = x - p.x;
      const dy = y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) minDist = dist;
    }

    if (minDist >= MIN_GAP) {
      return { x, y };
    }

    if (minDist > bestMinDist) {
      bestMinDist = minDist;
      bestCandidate = { x, y };
    }
  }

  // No fully-clear spot found within maxAttempts; use the least-overlapping one.
  return bestCandidate;
}

function DigitBurst({ triggerKey }) {
  const digits = useMemo(() => {
    const count = 10;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const distance = 30 + Math.random() * 20;
      return {
        id: i,
        char: Math.random() < 0.5 ? "0" : "1",
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        delay: (Math.random() * 0.15).toFixed(2),
      };
    });
  }, [triggerKey]);

  if (triggerKey === 0) return null;

  return (
    <g key={triggerKey}>
      <style>{`
        @keyframes digit-burst {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.6); }
        }
        .digit-burst {
          animation: digit-burst 0.7s ease-out forwards;
        }
      `}</style>
      {digits.map((d) => (
        <text
          key={d.id}
          x="0"
          y="0"
          fontSize="6"
          fill="#ff3131"
          textAnchor="middle"
          className="digit-burst"
          style={{
            "--tx": `${d.tx}px`,
            "--ty": `${d.ty}px`,
            animationDelay: `${d.delay}s`,
          }}
        >
          {d.char}
        </text>
      ))}
    </g>
  );
}

function LeakDrip({ active, count = 16, colorClass = "text-s03g1-hb-red" }) {
  if (!active) return null;
  // Emanate from a narrow point near the center (the heart's tip) and drift
  // outward slightly as each drop falls, so it reads as spraying/leaking out
  // of the heart rather than a flat row of static text.
  const drops = Array.from({ length: count }, (_, i) => {
    const spread = i / (count - 1) - 0.5; // -0.5..0.5
    return {
      id: i,
      left: 50 + spread * 30 + ((i % 3) - 1) * 2,
      drift: (spread * 34).toFixed(1),
      delay: ((i * 0.37) % 2).toFixed(2),
      duration: (1.6 + ((i * 0.53) % 1.4)).toFixed(2),
      char: i % 2 === 0 ? "1" : "0",
    };
  });

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden"
      aria-hidden="true"
    >
      {drops.map((d) => (
        <span
          key={d.id}
          className={`animate-s03g1-drip absolute top-0 font-s03g1-heading text-xs ${colorClass}`}
          style={{
            left: `${d.left}%`,
            "--drip-drift": `${d.drift}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        >
          {d.char}
        </span>
      ))}
    </div>
  );
}

function TypewriterText({ text, delay = "0s" }) {
  const chars = text.length;
  return (
    <span
      className="inline-block overflow-hidden whitespace-nowrap border-r-2 pr-0.5 align-bottom"
      style={{
        width: 0,
        "--tw-final-width": `${chars}ch`,
        animation: `typewriter 0.6s steps(${chars}, end) ${delay} forwards, blink-caret 0.8s step-end ${delay} infinite`,
      }}
    >
      {text}
    </span>
  );
}

function StageHealthy() {
  const [pulseKey, setPulseKey] = useState(0);
  const send = () => setPulseKey((k) => k + 1);
  const sent = pulseKey > 0;

  return (
    <div className="relative rounded-lg border border-s03g1-hb-primary/30 bg-s03g1-hb-bg p-6 font-s03g1-body text-white sm:p-10">
      <p className="mb-6 font-s03g1-heading text-xs uppercase tracking-widest text-s03g1-hb-secondary">
        Stage 01 — Healthy Server
      </p>

      <button
        type="button"
        onClick={send}
        className="absolute right-4 top-4 flex items-center gap-2 rounded-md border border-s03g1-hb-primary px-3 py-1.5 font-s03g1-heading text-xs text-s03g1-hb-primary transition-colors hover:bg-s03g1-hb-primary/10 sm:right-6 sm:top-6"
      >
        <span aria-hidden="true">♡</span> Send Heartbeat
      </button>

      <div className="flex justify-center py-6">
        <HeartWireframe key={pulseKey} color="#ff279e" pulse="normal" />
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 font-s03g1-heading text-xs sm:flex-row sm:gap-6 sm:text-sm">
        <div className="text-center">
          <div className="text-s03g1-hb-cyan">CLIENT →</div>
          <div className="whitespace-nowrap text-white/90">heartbeat(payload=3, &quot;HEY&quot;)</div>
        </div>

        <div className="text-s03g1-hb-secondary" aria-hidden="true">
          ───────▶
        </div>

        <div className="min-h-[2.5rem] text-center">
          <div className="text-s03g1-hb-secondary">SERVER →</div>
          {sent ? (
            <div key={pulseKey} className="animate-s03g1-reveal whitespace-nowrap text-white/90">
              &quot;HEY&quot; ✓ (3 bytes)
            </div>
          ) : (
            <div className="text-white/30">awaiting request…</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StageAttack() {
  const [clickCount, setClickCount] = useState(0);
  const [popups, setPopups] = useState([]);
  const nextZ = useRef(1);
  const containerRef = useRef(null);

  const boxPool = [
    {
      title: "what went wrong",
      accent: "primary",
      text: "Client claims payload = 64,000 bytes but sends only 3. OpenSSL trusts the claimed length.",
    },
    {
      title: "the bleed",
      accent: "secondary",
      text: "Server allocates a 64KB response buffer, copying adjacent process memory to fill the gap.",
    },
    {
      title: "what leaks",
      accent: "cyan",
      text: "session tokens · private keys · passwords · cookies",
    },
    {
      title: "the fix",
      accent: "primary",
      text: "OpenSSL 1.0.1g added a bounds check that rejects payload lengths larger than the actual data sent.",
    },
    {
      title: "who found it",
      accent: "secondary",
      text: "Discovered independently by Google Security and Codenomicon in early 2014.",
    },
    {
      title: "primary key material",
      accent: "primary",
      text: "Encryption keys themselves were stolen. Stolen keys let an attacker decrypt past and future traffic and impersonate the server entirely.",
    },
    {
      title: "secondary key material",
      accent: "secondary",
      text: "Usernames and passwords for the vulnerable service. Recovery means invalidating every session cookie and forcing a full password reset.",
    },
    {
      title: "protected content",
      accent: "cyan",
      text: "The actual data being protected — private messages, financial info, business documents. Only the service owner can know for sure what was exposed.",
    },
    {
      title: "Zero detection markers",
      accent: "primary",
      text: "Exploiting this bug leaves nothing unusual in server logs. A victim had no way to know they were attacked after the fact.",
    },
    {
      title: "Unlimited/Capless data",
      accent: "secondary",
      text: "There's no hard cap on total data stolen. An attacker could repeat the request endlessly, pulling a fresh 64KB chunk of memory each time.",
    },
  ];

  const trigger = () => {
    setClickCount((c) => c + 1);

    const template = boxPool[Math.floor(Math.random() * boxPool.length)];
    const id = Date.now() + Math.random();

    const el = containerRef.current;
    const containerW = el ? el.clientWidth : 400;
    const containerH = el ? el.clientHeight : 400;
    const { x, y } = findNonOverlappingPosition(containerW, containerH, popups);

    nextZ.current += 1;

    setPopups((prev) => [...prev, { id, ...template, x, y, z: nextZ.current }]);
  };

  const focusPopup = (id) => {
    nextZ.current += 1;
    setPopups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, z: nextZ.current } : p))
    );
  };

  const movePopup = (id, x, y) => {
    setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  };

  const closePopup = (id) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  const leaking = clickCount > 0;

  const leaks = [
    { label: "user:admin", delay: "0.2s" },
    { label: "pk: -----BE", delay: "0.8s" },
    { label: "tok:a9f3c...", delay: "1.4s" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg border border-s03g1-hb-red/30 bg-s03g1-hb-bg p-6 font-s03g1-body text-white sm:p-10"
      style={{ minHeight: 420 }}
    >
      <style>{`
        @keyframes heart-pop {
          0% { transform: scale(1) translateY(0); }
          35% { transform: scale(1.25) translateY(-10px); }
          60% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        .heart-pop {
          animation: heart-pop 0.45s ease-out;
        }
      `}</style>

      <p className="mb-6 font-s03g1-heading text-xs uppercase tracking-widest text-s03g1-hb-secondary">
        Stage 02 — Under Attack
      </p>

      <div className="relative flex flex-col items-center justify-start">
        <div key={clickCount} className={clickCount > 0 ? "heart-pop" : ""}>
          <HeartWireframe color="#ff3131" pulse="normal" onClick={trigger}>
            <DigitBurst triggerKey={clickCount} />
          </HeartWireframe>
        </div>

        <div className="relative mx-auto mt-2 h-32 w-48">
          <LeakDrip key={`drip-${clickCount}`} active={leaking} />
          {leaking && (
            <div
              key={`leaks-${clickCount}`}
              className="flex flex-col items-center gap-1 pt-12 font-s03g1-heading text-xs text-s03g1-hb-red"
            >
              {leaks.map((leak) => (
                <TypewriterText key={leak.label} text={leak.label} delay={leak.delay} />
              ))}
            </div>
          )}
        </div>
      </div>

      {popups.map((p) => (
        <DraggablePopup
          key={p.id}
          id={p.id}
          title={p.title}
          accent={p.accent}
          x={p.x}
          y={p.y}
          zIndex={p.z}
          onFocus={focusPopup}
          onMove={movePopup}
          onClose={closePopup}
        >
          {p.text}
        </DraggablePopup>
      ))}
    </div>
  );
}

function StageAftermath() {
  const [heartClicks, setHeartClicks] = useState(0);
  const [popups, setPopups] = useState([]);
  // Starts above the heart's z-20 wrapper so popups always render on top of it
  // and the globe, regardless of click order.
  const nextZ = useRef(50);
  const stageRef = useRef(null);

  const markers = useMemo(
    () => ({
      imgur: {
        label: "Imgur",
        theta: -1.15,
        phi: (Math.PI / 2) * 0.82,
        title: "Imgur",
        accent: "primary",
        text: "Patched same day OpenSSL 1.0.1g shipped; no confirmed data loss reported.",
      },
      lastpass: {
        label: "LastPass",
        theta: -0.1,
        phi: (Math.PI / 2) * 0.82,
        title: "LastPass",
        accent: "secondary",
        text: "Prompted users to rotate their master passwords as a precaution.",
      },
      yahoo: {
      label: "Yahoo",
      theta: 1.3,
      phi: (Math.PI / 2) * 0.82,
      title: "Yahoo",
      accent: "cyan",
      text: "500M+ accounts · patched: Apr 8, 2014",
      warn: true,
      },
      codenomicon: {
        label: "Codenomicon",
        theta: -1.75,
        phi: (Math.PI / 2) * 0.78,
        title: "Who found it",
        accent: "primary",
        text: "Independently discovered by a Codenomicon security team and Neel Mehta of Google Security, both reporting it around the same time in early April 2014.",
      },
      openssl: {
        label: "OpenSSL",
        theta: 0.45,
        phi: (Math.PI / 2) * 0.79,
        title: "The fix",
        accent: "secondary",
        text: "OpenSSL 1.0.1g, released April 7 2014, patched the bug. Versions 1.0.1 through 1.0.1f were vulnerable; 1.0.0 and 0.9.8 branches never were.",
      },
      apache_nginx: {
        label: "Apache/nginx",
        theta: 2.4,
        phi: (Math.PI / 2) * 0.6,
        title: "How widespread",
        accent: "primary",
        text: "Apache and nginx alone made up over 66% of active web servers at the time, and both commonly relied on OpenSSL for encryption.",
      },
      twoyears: {
        label: "2 years exposed",
        theta: -2.2,
        phi: (Math.PI / 2) * 0.6,
        title: "How long it existed",
        accent: "cyan",
        text: "The bug was introduced to OpenSSL in December 2011 and remained live in the wild for over two years before it was discovered and fixed.",
      },
    }),
    []
  );

  const triggerHeart = () => {
    setHeartClicks((c) => c + 1);
  };

  const handleMarkerClick = (key) => {
    const marker = markers[key];

    setPopups((prev) => {
      const existing = prev.find((p) => p.key === key);
      nextZ.current += 1;

      if (existing) {
        return prev.map((p) => (p.key === key ? { ...p, z: nextZ.current } : p));
      }

      const el = stageRef.current;
      const containerW = el ? el.clientWidth : 400;
      const containerH = el ? el.clientHeight : 400;
      const { x, y } = findNonOverlappingPosition(containerW, containerH, prev);

      return [
        ...prev,
        {
          id: `${key}-${Date.now()}`,
          key,
          title: marker.title,
          accent: marker.accent,
          text: marker.text,
          x,
          y,
          z: nextZ.current,
        },
      ];
    });
  };

  const focusPopup = (id) => {
    nextZ.current += 1;
    setPopups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, z: nextZ.current } : p))
    );
  };

  const movePopup = (id, x, y) => {
    setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  };

  const closePopup = (id) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  const activeKeys = popups.map((p) => p.key);

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-s03g1-hb-secondary/30 bg-s03g1-hb-bg p-6 font-s03g1-body text-white sm:p-10"
      style={{ minHeight: 500 }}
    >
      <p className="mb-4 font-s03g1-heading text-xs uppercase tracking-widest text-s03g1-hb-secondary">
        Stage 03 — The Aftermath
      </p>

      <div ref={stageRef} className="relative" style={{ height: 400 }}>
        {/* Holo-table floor - fills the container; markers are real 3D points
            on the globe, projected to screen space every frame so they track
            the camera's orbit like they're attached to the rotating surface. */}
        <div className="absolute inset-0 -m-6 sm:-m-10">
          <WireframeGlobe markers={markers} activeKeys={activeKeys} onSelect={handleMarkerClick} />
        </div>

        {/* Heart floats above the globe, leaking binary down into it */}
        <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 flex-col items-center pointer-events-none sm:top-6">
          <div key={heartClicks} className={heartClicks > 0 ? "heart-pop" : ""}>
            <HeartWireframe
              color="#ff279e"
              size={110}
              pulse="normal"
              onClick={triggerHeart}
              className="pointer-events-auto"
            />
          </div>
          <div className="relative h-28 w-24">
            <LeakDrip active count={10} colorClass="text-s03g1-hb-primary" />
          </div>
        </div>

        {popups.map((p) => (
          <DraggablePopup
            key={p.id}
            id={p.id}
            title={p.title}
            accent={p.accent}
            x={p.x}
            y={p.y}
            zIndex={p.z}
            onFocus={focusPopup}
            onMove={movePopup}
            onClose={closePopup}
          >
            {p.text}
          </DraggablePopup>
        ))}
      </div>

      <style>{`
        @keyframes heart-pop {
          0% { transform: scale(1) translateY(0); }
          35% { transform: scale(1.25) translateY(-10px); }
          60% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        .heart-pop {
          animation: heart-pop 0.45s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function HeartbleedSimulation({ stage = "healthy" }) {
  if (stage === "attack") return <StageAttack />;
  if (stage === "aftermath") return <StageAftermath />;
  return <StageHealthy />;
}
