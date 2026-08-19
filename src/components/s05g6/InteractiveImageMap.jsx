import React, { useRef, useState, useLayoutEffect, useCallback, useEffect } from "react";

/**
 * InteractiveImageMap
 * --------------------
 * A reusable "interactive datasheet" component: an image with hoverable
 * coordinates. Hovering a marker fades in a callout box connected to the
 * marker by an elbow (right-angle, rounded-corner) line — the same visual
 * language used in chip/board datasheets (e.g. an "ADDR" label pointing at
 * a bus on a die photo).
 *
 * USAGE
 * -----
 * <InteractiveImageMap
 *   src="/die-photo.png"
 *   hotspots={[
 *     {
 *       id: "addr",
 *       title: "ADDR",
 *       description: "16-bit address bus, rows 0–15",
 *       point: { x: 38, y: 55 },        // % position of the marker on the image
 *       box:   { x: 4,  y: 32, width: 190, side: "center", anchor: "bottom" },
 *       color: "#1b5e3a",
 *     },
 *   ]}
 * />
 *
 * PROPS
 * -----
 * src          string   image url (required for real use; demo default provided)
 * alt          string   alt text for the image
 * hotspots     array    see shape below
 * className    string   extra class on the root element
 * imageStyle   object   extra inline styles merged onto the <img>
 * maxWidth     number|string  caps the rendered width (default 640). Pass a
 *                        number for px (e.g. 900) or a string for any CSS
 *                        unit (e.g. "60%", "48rem")
 * textColor    string   default title text color for ALL boxes (default "#fff") —
 *                        overridden per-hotspot by that hotspot's own textColor
 * descColor    string   default description text color for ALL boxes (default "#dff0e6") —
 *                        overridden per-hotspot by that hotspot's own descColor
 * debug        boolean  when true, click anywhere on the image to log its
 *                        {x, y} percent coordinates (console + on-image readout) —
 *                        use this to find point/box values for a NEW image, then
 *                        delete the prop once your hotspots are dialed in
 * caption      string   optional short blurb rendered below the image
 *
 * hotspot shape:
 * {
 *   id:          string   unique key
 *   title:       string   bold label in the callout box
 *   description: string?  optional supporting line
 *   color:       string?  accent color for the marker, line, and box background (default "#1b5e3a")
 *   textColor:   string?  title text color (default "#fff")
 *   descColor:   string?  description text color (default "#dff0e6")
 *   point: { x, y }        percent (0–100) position of the marker on the image
 *   box:   {
 *     x, y:      percent (0–100) position of the callout box's top-left corner
 *     width:     px width of the box (default 180)
 *     side:      "left" | "center" | "right"  — which edge of the box the line leaves from (default "center")
 *     anchor:    "top" | "bottom"              — which edge of the box the line leaves from (default "bottom")
 *   }
 * }
 */

// ---------------------------------------------------------------------------
// geometry helper: right-angle connector with a rounded elbow, matching the
// "line drops from the box, then turns to meet the dot" datasheet look
// ---------------------------------------------------------------------------
function elbowPath(x1, y1, x2, y2, radius = 14) {
  const dxAbs = Math.abs(x2 - x1);
  const dyAbs = Math.abs(y2 - y1);
  if (dxAbs < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  if (dyAbs < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;

  const r = Math.min(radius, dxAbs, dyAbs);
  const vDir = y2 >= y1 ? 1 : -1;
  const hDir = x2 >= x1 ? 1 : -1;
  const cornerY = y2;

  return `M ${x1} ${y1} L ${x1} ${cornerY - vDir * r} Q ${x1} ${cornerY} ${x1 + hDir * r} ${cornerY} L ${x2} ${y2}`;
}

// five-pointed star outline, used for the connector's endpoint marker
function starPath(cx, cy, outerR, innerRatio = 0.45, points = 5) {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : outerR * innerRatio;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d + "Z";
}

const STAR_CLIP_PATH =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

// ---------------------------------------------------------------------------
// self-contained placeholder "die photo" so this file works standalone
// ---------------------------------------------------------------------------
const PLACEHOLDER_SRC =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <pattern id="grid" width="9" height="9" patternUnits="userSpaceOnUse">
      <rect width="9" height="9" fill="none" stroke="#3a4a42" stroke-width="0.4"/>
    </pattern>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#232f2a"/>
      <stop offset="0.5" stop-color="#182420"/>
      <stop offset="1" stop-color="#0f1613"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="#0b100e"/>
  <rect x="18" y="18" width="564" height="564" rx="10" fill="#101715"/>
  ${Array.from({ length: 21 })
    .map((_, i) => {
      const p = 34 + i * 25.4;
      return `<rect x="${p - 4}" y="4" width="8" height="16" fill="#d9c98a"/><rect x="${p - 4}" y="580" width="8" height="16" fill="#d9c98a"/><rect x="4" y="${p - 4}" width="16" height="8" fill="#d9c98a"/><rect x="580" y="${p - 4}" width="16" height="8" fill="#d9c98a"/>`;
    })
    .join("")}
  <rect x="34" y="34" width="532" height="532" rx="4" fill="url(#sheen)"/>
  <rect x="34" y="34" width="532" height="532" fill="url(#grid)"/>
  <rect x="34" y="70" width="532" height="90" fill="#26332c" opacity="0.6"/>
  <rect x="34" y="34" width="220" height="230" fill="#20291f" opacity="0.55"/>
  <rect x="290" y="180" width="270" height="180" fill="#1c2621" opacity="0.5"/>
  ${Array.from({ length: 26 })
    .map(
      (_, i) =>
        `<rect x="${300 + (i % 13) * 19}" y="${330 + Math.floor(i / 13) * 200}" width="10" height="150" fill="#222d27" opacity="0.6"/>`
    )
    .join("")}
</svg>`);

const DEFAULT_HOTSPOTS = [
  {
    id: "addr",
    title: "ADDR",
    description: "Address bus rows, decoded left-to-right across the array.",
    point: { x: 34, y: 63 },
    box: { x: 3, y: 34, width: 168, side: "center", anchor: "bottom" },
    color: "#1b5e3a",
  },
  {
    id: "ctrl",
    title: "CTRL",
    description: "Control logic block — read/write, chip select, clocking.",
    point: { x: 66, y: 30 },
    box: { x: 58, y: 4, width: 168, side: "center", anchor: "bottom" },
    color: "#1b5e3a",
  },
  {
    id: "io",
    title: "I/O PADS",
    description: "Peripheral bond pads ringing the die perimeter.",
    point: { x: 91, y: 50 },
    box: { x: 76, y: 68, width: 170, side: "center", anchor: "top" },
    color: "#1b5e3a",
  },
];

export default function InteractiveImageMap({
  src = PLACEHOLDER_SRC,
  alt = "Interactive map",
  hotspots = DEFAULT_HOTSPOTS,
  className = "",
  imageStyle,
  maxWidth = 640,
  textColor = "#382020",
  descColor = "#5d3838",
  caption,
  debug = false,
}) {
  const containerRef = useRef(null);
  const boxRefs = useRef({});
  const { width, height } = useContainerSize(containerRef);
  const [hoveredId, setHoveredId] = useState(null);
  const [connector, setConnector] = useState(null);
  const [pickedPoint, setPickedPoint] = useState(null);

  const handlePick = useCallback(
    (e) => {
      if (!debug || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = +(((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const y = +(((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      setPickedPoint({ x, y });
      // eslint-disable-next-line no-console
      console.log(`point: { x: ${x}, y: ${y} }`);
    },
    [debug]
  );

  const active = hotspots.find((h) => h.id === hoveredId) || null;

  const measure = useCallback(() => {
    if (!active || !containerRef.current) {
      setConnector(null);
      return;
    }
    const boxEl = boxRefs.current[active.id];
    if (!boxEl) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const boxRect = boxEl.getBoundingClientRect();
    const side = active.box.side || "center";
    const anchor = active.box.anchor || "bottom";

    let attachX;
    if (side === "left") attachX = boxRect.left - containerRect.left;
    else if (side === "right") attachX = boxRect.right - containerRect.left;
    else attachX = boxRect.left - containerRect.left + boxRect.width / 2;

    const attachY =
      anchor === "top" ? boxRect.top - containerRect.top : boxRect.bottom - containerRect.top;

    const dotX = (active.point.x / 100) * width;
    const dotY = (active.point.y / 100) * height;

    setConnector({ x1: attachX, y1: attachY, x2: dotX, y2: dotY, color: active.color || "#1b5e3a" });
  }, [active, width, height]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  return (
    <div
      ref={containerRef}
      className={`iim-root ${className}`}
      onClick={handlePick}
      style={{
        position: "relative",
        width: "100%",
        maxWidth,
        margin: "0 auto",
        userSelect: "none",
        cursor: debug ? "crosshair" : undefined,
        fontFamily:
          "'JetBrains Mono','IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: "100%",
          display: "block",
          borderRadius: 10,
          border: "1px solid #23302a",
          ...imageStyle,
        }}
      />

      {/* connector line layer */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
      >
        {connector && (
          <g style={{ transition: "opacity 160ms ease" }}>
            <path
              d={elbowPath(connector.x1, connector.y1, connector.x2, connector.y2)}
              fill="none"
              stroke={connector.color}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <path
              d={starPath(connector.x2, connector.y2, 8)}
              fill={connector.color}
              stroke="#fff"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* always-visible markers (hover targets) */}
      {hotspots.map((h) => {
        const isActive = hoveredId === h.id;
        const dotX = (h.point.x / 100) * 100;
        const dotY = (h.point.y / 100) * 100;
        const color = h.color || "#1b5e3a";
        return (
          <button
            key={h.id}
            aria-label={h.title}
            tabIndex={0}
            onMouseEnter={() => setHoveredId(h.id)}
            onMouseLeave={() => setHoveredId((cur) => (cur === h.id ? null : cur))}
            onFocus={() => setHoveredId(h.id)}
            onBlur={() => setHoveredId((cur) => (cur === h.id ? null : cur))}
            style={{
              position: "absolute",
              left: `${dotX}%`,
              top: `${dotY}%`,
              width: 26,
              height: 26,
              marginLeft: -13,
              marginTop: -13,
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: isActive ? 26 : 20,
                height: isActive ? 26 : 20,
                background: color,
                clipPath: STAR_CLIP_PATH,
                filter: isActive
                  ? `drop-shadow(0 0 0 2px #fff) drop-shadow(0 0 5px ${color}aa)`
                  : `drop-shadow(0 0 0 1.5px #fff)`,
                transition: "all 150ms ease",
              }}
            />
          </button>
        );
      })}

      {/* callout boxes (always mounted for measurement, opacity toggled) */}
      {hotspots.map((h) => {
        const isActive = hoveredId === h.id;
        const color = h.color || "#1b5e3a";
        return (
          <div
            key={h.id}
            ref={(el) => (boxRefs.current[h.id] = el)}
            style={{
              position: "absolute",
              left: `${h.box.x}%`,
              top: `${h.box.y}%`,
              width: h.box.width || 180,
              background: color,
              color: "#fff",
              borderRadius: 6,
              padding: "10px 14px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 160ms ease, transform 160ms ease",
              pointerEvents: "none",
              zIndex: isActive ? 5 : 1,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: h.textColor || textColor }}>
              {h.title}
            </div>
            {h.description && (
              <div style={{ fontSize: 11.5, marginTop: 4, lineHeight: 1.4, color: h.descColor || descColor }}>
                {h.description}
              </div>
            )}
          </div>
        );
      })}

      {/* debug: coordinate picker readout */}
      {debug && pickedPoint && (
        <>
          <div
            style={{
              position: "absolute",
              left: `${pickedPoint.x}%`,
              top: `${pickedPoint.y}%`,
              width: 14,
              height: 14,
              marginLeft: -7,
              marginTop: -7,
              borderRadius: "50%",
              border: "2px solid #ff5c5c",
              background: "rgba(255,92,92,0.25)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 8,
              bottom: 8,
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 4,
              pointerEvents: "none",
            }}
          >
            point: {"{"} x: {pickedPoint.x}, y: {pickedPoint.y} {"}"} — also logged to console
          </div>
        </>
      )}

      {caption && (
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: "#5b6b62",
            textAlign: "center",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}