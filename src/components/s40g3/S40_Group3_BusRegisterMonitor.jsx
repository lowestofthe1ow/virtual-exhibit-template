/**
 * BusRegisterMonitor.jsx
 *
 * The "Live Architecture Data Feed" column of the Drawing Tablet Simulator
 * (right side of the Proposed Page Wireframe Layout in the README).
 *
 * Displays, in real time, the low-level view of what the hardware in the
 * left column is doing:
 *
 *   >> POLLING I/O DEVICE... / INTERRUPT REQUEST: ACTIVE
 *   [ X,Y MATRIX SENSOR DATA ]  hex + decimal memory-mapped register values
 *   [ Z-AXIS PRESSURE SENSOR ]  raw analog %, 13-bit ADC word, level / 8192
 *   [ DATA BUS STREAM ]         the 8-byte HID-style report packet in binary
 *
 * ## Learning Notes
 * - Purely presentational: every value shown is *derived* from props with
 *   plain arithmetic (scaling, rounding, base conversion). No state lives
 *   here, which keeps the single source of truth in InteractiveCanvas.jsx.
 * - Number formatting helpers (toHex / toBin) show how the same register
 *   value looks in the three bases programmers actually use.
 *
 * ## The quantization math (Interactive Element #2)
 *   level = round(analogFraction * (2^13 - 1))   // 0 .. 8191
 * i.e. a continuous force reading is snapped to one of 8,192 discrete
 * steps -- exactly what the pen's ADC does at 13-bit resolution.
 *
 * ## Props
 *   - pen            ({x,y} | null) normalized pen position
 *   - pressure       (number 0..1)  slider value = analog force fraction
 *   - isDrawing      (boolean)      pen contact -> interrupt request active
 *   - interruptCount (number)       total IRQs serviced this session
 *   - reportRate     (number)       report packets per second (Hz)
 */

// Logical device resolution (counts), sized like a real digitizer's
// coordinate space rather than screen pixels.
export const X_MAX = 0x3fff; // 16383 counts
export const Y_MAX = 0x27ff; // 10239 counts
export const PRESSURE_LEVELS = 8192; // 13-bit ADC

function toHex(n, digits) {
  return "0x" + n.toString(16).toUpperCase().padStart(digits, "0");
}

function toBin(n, bits) {
  return n.toString(2).padStart(bits, "0");
}

/** Build the 8-byte report packet: [ID, status, Xlo, Xhi, Ylo, Yhi, Plo, Phi] */
export function buildPacket(xCount, yCount, level, inContact) {
  return [
    0x02, // report ID: pen
    inContact ? 0b00000101 : 0b00000100, // bit0 tip switch, bit2 in-range
    xCount & 0xff,
    (xCount >> 8) & 0xff,
    yCount & 0xff,
    (yCount >> 8) & 0xff,
    level & 0xff,
    (level >> 8) & 0xff,
  ];
}

export default function BusRegisterMonitor({
  pen,
  pressure,
  isDrawing,
  interruptCount,
  reportRate,
}) {
  const inRange = pen !== null;
  const xCount = inRange ? Math.round(pen.x * X_MAX) : 0;
  const yCount = inRange ? Math.round(pen.y * Y_MAX) : 0;

  // ADC quantization: continuous 0..1 analog force -> discrete 13-bit level
  const level = Math.round(pressure * (PRESSURE_LEVELS - 1));
  const packet = buildPacket(xCount, yCount, level, isDrawing);

  return (
    <div className="tx-feed" aria-live="off">
      <details className="tx-legend">
        <summary>How to read this panel</summary>
        <ul>
          <li>
            <b>POLLING / INTERRUPT REQUEST:</b> while idle, the host checks in
            on the device (polling). The moment the pen tip touches down, the
            tablet raises an interrupt request (IRQ) so the CPU handles the
            data immediately.
          </li>
          <li>
            <b>X/Y-Coordinate:</b> the pen's position registers, shown in
            hexadecimal (0x...) and decimal. These are counts in the device's
            logical coordinate space, not screen pixels.
          </li>
          <li>
            <b>ADC Quantization:</b> the pen's analog force converted into a
            13-bit binary word, one of 8,192 possible pressure levels.
          </li>
          <li>
            <b>Data Bus Stream:</b> the 8-byte report packet the tablet sends
            the CPU: report ID, status bits (tip switch, in-range), then X, Y,
            and pressure, each split into low and high bytes.
          </li>
        </ul>
      </details>
      <span className="tx-status-line">
        {">> "}
        {isDrawing ? (
          <span className="tx-status-active">INTERRUPT REQUEST: ACTIVE</span>
        ) : (
          <span className="tx-status-idle">POLLING I/O DEVICE...</span>
        )}
      </span>
      <span className="tx-status-line tx-status-idle">
        {">> "}IRQs SERVICED: {interruptCount} | REPORT RATE: {reportRate} Hz
      </span>

      <h4>X,Y Matrix Sensor Data</h4>
      <table>
        <tbody>
          <tr>
            <td>X-Coordinate:</td>
            <td className="tx-val">
              {inRange ? `${toHex(xCount, 4)} (${xCount})` : "-- PEN OUT OF RANGE --"}
            </td>
          </tr>
          <tr>
            <td>Y-Coordinate:</td>
            <td className="tx-val">
              {inRange ? `${toHex(yCount, 4)} (${yCount})` : "-- PEN OUT OF RANGE --"}
            </td>
          </tr>
          <tr>
            <td>Resolution:</td>
            <td className="tx-val">
              {X_MAX + 1} x {Y_MAX + 1} counts
            </td>
          </tr>
        </tbody>
      </table>

      <h4>Z-Axis Pressure Sensor</h4>
      <table>
        <tbody>
          <tr>
            <td>Raw Analog Force:</td>
            <td className="tx-val">{Math.round(pressure * 100)}%</td>
          </tr>
          <tr>
            <td>ADC Quantization:</td>
            <td className="tx-val">{toBin(level, 13)}</td>
          </tr>
          <tr>
            <td>Discrete Level:</td>
            <td className="tx-val">
              {level} / {PRESSURE_LEVELS}
            </td>
          </tr>
        </tbody>
      </table>

      <h4>Data Bus Stream</h4>
      <div className="tx-busstream">
        {packet.map((b) => toBin(b, 8)).join(" ")}
        <br />
        {isDrawing ? "Sending to CPU buffer..." : "Bus idle. Awaiting tip switch..."}
        <span className="tx-cursor">&nbsp;</span>
      </div>
    </div>
  );
}
