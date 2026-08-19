import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MAX_CHARS = 3;
const TRACK_Y = 75;
const TRACK_H = 50;
const BIT_LABEL_Y = 60;
const REFLECT_Y = 155;
const H_CSS = 200;
const W_MIN = 280;
const W_MAX = 672;
const L0 = 1; // NRZI reference level before the first cell (1 = land)

function OpticalEncoderContent() {
  const holderRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const widthRef = useRef(W_MAX);
  const bitsRef = useRef([]); // logical data bits (for labels)
  const cellsRef = useRef([]); // physical pit/land levels drawn on the track
  const nrziRef = useRef(false); // encoding mode the current track was built with
  const viewRef = useRef({ mode: 'clear', highlight: -1 });
  const scanAnimRef = useRef(null);
  const isScanningRef = useRef(false);

  const [inputValue, setInputValue] = useState('');
  const [nrzi, setNrzi] = useState(false);
  const [binaryHtml, setBinaryHtml] = useState('');
  const [output, setOutput] = useState('');
  const [scanDisabled, setScanDisabled] = useState(true);
  const [scanning, setScanning] = useState(false);

  function W() {
    return widthRef.current;
  }

  function cellWidth() {
    const cells = cellsRef.current;
    return cells.length > 0 ? Math.floor(W() / cells.length) : 28;
  }

  // Turn logical data bits into the physical levels drawn on the track.
  function toCells(dataBits, useNrzi) {
    if (!useNrzi) return dataBits.slice();
    const cells = [];
    let level = L0;
    for (const b of dataBits) {
      level = level ^ b; // a 1 flips the level (transition); a 0 stays
      cells.push(level);
    }
    return cells;
  }

  // Recover the logical data bits back from the physical levels read off the track.
  function fromCells(cells, useNrzi) {
    if (!useNrzi) return cells.slice();
    const bits = [];
    let prev = L0;
    for (const level of cells) {
      bits.push(level ^ prev); // a change means 1, no change means 0
      prev = level;
    }
    return bits;
  }

  function bitsToText(bits) {
    let text = '';
    for (let b = 0; b + 7 < bits.length; b += 8) {
      text += String.fromCharCode(parseInt(bits.slice(b, b + 8).join(''), 2));
    }
    return text;
  }

  function clearCanvas() {
    const ctx = ctxRef.current;
    const w = W();
    ctx.clearRect(0, 0, w, H_CSS);
    ctx.fillStyle = '#050010';
    ctx.fillRect(0, 0, w, H_CSS);
    ctx.strokeStyle = 'rgba(128,0,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, TRACK_Y - 20);
    ctx.lineTo(w, TRACK_Y - 20);
    ctx.stroke();
    ctx.fillStyle = 'rgba(170,170,204,0.2)';
    ctx.font = '11px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TYPE TEXT AND CLICK ENCODE TO SEE THE DISC TRACK', w / 2, H_CSS / 2);
    viewRef.current = { mode: 'clear', highlight: -1 };
  }

  function drawTrack(highlightIdx) {
    const ctx = ctxRef.current;
    const bits = bitsRef.current;
    const cells = cellsRef.current;
    const w = W();
    viewRef.current = { mode: 'track', highlight: highlightIdx };
    ctx.clearRect(0, 0, w, H_CSS);

    const cw = cellWidth();
    const totalW = cells.length * cw;
    const offsetX = Math.floor((w - totalW) / 2);

    ctx.fillStyle = '#050010';
    ctx.fillRect(0, 0, w, H_CSS);

    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(offsetX - 2, TRACK_Y - 2, totalW + 4, TRACK_H + 4);

    cells.forEach((level, i) => {
      const x = offsetX + i * cw;

      if (level === 1) {
        ctx.fillStyle = '#8888c0';
        ctx.fillRect(x + 1, TRACK_Y, cw - 1, TRACK_H);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(x + 2, TRACK_Y + 2, cw - 4, 6);
      } else {
        ctx.fillStyle = '#111128';
        ctx.fillRect(x + 1, TRACK_Y, cw - 1, TRACK_H);
        ctx.fillStyle = '#07070f';
        ctx.fillRect(x + 3, TRACK_Y + 6, cw - 6, TRACK_H - 12);
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, TRACK_Y, cw, TRACK_H);

      // label shows the LOGICAL data bit, not the physical level
      const isActive = i === highlightIdx;
      ctx.font = `bold ${cw < 22 ? 9 : 11}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.fillStyle = isActive ? '#39FF14' : bits[i] === 1 ? '#6060aa' : '#444466';
      ctx.fillText(bits[i].toString(), x + cw / 2, BIT_LABEL_Y);

      if (i > 0 && i % 8 === 0) {
        ctx.strokeStyle = 'rgba(255,0,255,0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(x, TRACK_Y - 18);
        ctx.lineTo(x, TRACK_Y + TRACK_H + 18);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    if (highlightIdx >= 0 && highlightIdx < cells.length) {
      const laserX = offsetX + highlightIdx * cw + cw / 2;
      const currentLevel = cells[highlightIdx];

      ctx.strokeStyle = 'rgba(255,60,60,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(laserX, 20);
      ctx.lineTo(laserX, TRACK_Y + TRACK_H + 30);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(laserX, TRACK_Y + TRACK_H / 2, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ff4444';
      ctx.shadowColor = '#ff6666';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (currentLevel === 1) {
        ctx.strokeStyle = 'rgba(180,180,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(laserX - 4, TRACK_Y);
        ctx.lineTo(laserX - 12, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(laserX + 4, TRACK_Y);
        ctx.lineTo(laserX + 12, 10);
        ctx.stroke();
      }

      ctx.font = '10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = currentLevel === 1 ? '#8888cc' : '#333355';
      ctx.fillText(currentLevel === 1 ? 'LAND — REFLECTS' : 'PIT — ABSORBS', laserX, REFLECT_Y);

      ctx.font = 'bold 12px "Space Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#39FF14';
      ctx.fillText('bit[' + highlightIdx + '] = ' + bitsRef.current[highlightIdx], w - 10, H_CSS - 8);
    }
  }

  function redrawCurrentView() {
    const view = viewRef.current;
    if (view.mode === 'track' && cellsRef.current.length > 0) {
      drawTrack(view.highlight);
    } else {
      clearCanvas();
    }
  }

  function setupCanvas(width) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    widthRef.current = width;

    const DPR = window.devicePixelRatio || 1;
    canvas.width = width * DPR;
    canvas.height = H_CSS * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = H_CSS + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function measuredWidth() {
    const holder = holderRef.current;
    const avail = holder ? holder.clientWidth : W_MAX;
    return Math.max(W_MIN, Math.min(W_MAX, Math.floor(avail)));
  }

  useEffect(() => {
    setupCanvas(measuredWidth());
    clearCanvas();

    let resizeRaf = null;
    function onResize() {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const next = measuredWidth();
        if (next !== widthRef.current) {
          setupCanvas(next);
          redrawCurrentView();
        }
      });
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (scanAnimRef.current) cancelAnimationFrame(scanAnimRef.current);
    };
  }, []);

  function resetSim() {
    if (scanAnimRef.current) cancelAnimationFrame(scanAnimRef.current);
    isScanningRef.current = false;
    setScanning(false);
    bitsRef.current = [];
    cellsRef.current = [];
    setBinaryHtml('');
    setOutput('');
    setScanDisabled(true);
    clearCanvas();
  }

  function handleReset() {
    setInputValue('');
    resetSim();
  }

  function encode(text, useNrzi) {
    const trimmed = text.slice(0, MAX_CHARS);
    if (!trimmed.trim()) {
      setBinaryHtml('<span style="color:var(--accent-magenta)">Please type something first.</span>');
      return;
    }

    if (scanAnimRef.current) cancelAnimationFrame(scanAnimRef.current);
    isScanningRef.current = false;
    setScanning(false);

    const bits = [];
    const byteGroups = [];
    for (const ch of trimmed) {
      const b = ch.charCodeAt(0).toString(2).padStart(8, '0');
      byteGroups.push(b);
      for (const bit of b) bits.push(parseInt(bit, 10));
    }
    bitsRef.current = bits;
    cellsRef.current = toCells(bits, useNrzi);
    nrziRef.current = useNrzi;

    const displayHTML = byteGroups
      .map((g, i) => {
        const char = trimmed[i];
        return `<span style="color:var(--accent-cyan)">${g}</span><span style="color:rgba(170,170,204,0.4)"> (${char})</span>`;
      })
      .join(' ');

    setBinaryHtml('Binary: ' + displayHTML);
    setOutput('');
    setScanDisabled(false);

    drawTrack(-1);
  }

  function encodeInput() {
    encode(inputValue, nrziRef.current);
  }

  function toggleNrzi() {
    const next = !nrzi;
    setNrzi(next);
    nrziRef.current = next;
    // re-encode the current text so the track reflects the new mode immediately
    if (bitsRef.current.length > 0 && inputValue.trim()) {
      encode(inputValue, next);
    }
  }

  function startScan() {
    const cells = cellsRef.current;
    if (isScanningRef.current || cells.length === 0) return;
    isScanningRef.current = true;
    setScanning(true);
    setScanDisabled(true);
    setOutput('');

    const useNrzi = nrziRef.current;
    const readCells = [];
    let idx = 0;
    let lastTime = null;
    const MS_PER_BIT = 130;

    function step(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed >= MS_PER_BIT) {
        drawTrack(idx);
        readCells.push(cells[idx]);

        const partial = bitsToText(fromCells(readCells, useNrzi));
        if (partial) setOutput('Reading: "' + partial + '"');

        idx++;
        lastTime = timestamp;
      }

      if (idx < cells.length) {
        scanAnimRef.current = requestAnimationFrame(step);
      } else {
        drawTrack(-1);
        const decoded = bitsToText(fromCells(readCells, useNrzi));
        setOutput('✓ Decoded: "' + decoded + '"');
        setScanDisabled(false);
        isScanningRef.current = false;
        setScanning(false);
      }
    }

    scanAnimRef.current = requestAnimationFrame(step);
  }

  return (
    <div className="sim-wrap">
      <div className="sim-controls">
        <input
          type="text"
          className="sim-input"
          maxLength={MAX_CHARS}
          placeholder="Type up to 3 chars..."
          autoComplete="off"
          spellCheck="false"
          value={inputValue}
          onInput={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') encodeInput();
          }}
        />
        <button className="btn btn-primary btn-sm" onClick={encodeInput}>Encode to Disc</button>
        <label className="sim-toggle">
          <input type="checkbox" checked={nrzi} onChange={toggleNrzi} />
          <span>NRZI mode <em>(transition = 1)</em></span>
        </label>
      </div>

      <div className="sim-binary" dangerouslySetInnerHTML={{ __html: binaryHtml }} />

      <div ref={holderRef} className="sim-canvas-holder">
        <canvas ref={canvasRef} aria-label="Optical disc track visualization" />
      </div>

      <div className="sim-actions">
        <button className="btn btn-primary btn-sm" disabled={scanDisabled} onClick={startScan}>&#9654; Scan with Laser</button>
        <button className="btn btn-outline btn-sm" onClick={handleReset}>Reset</button>
        {scanning && <span className="sim-spinner">SCANNING...</span>}
      </div>

      <div className="sim-output" aria-live="polite">{output}</div>

      <div className="sim-legend">
        <div className="sim-legend-item">
          <div className="legend-swatch" style={{ background: '#9090c8', border: '1px solid #aaa' }} />
          <span>Land — reflects laser</span>
        </div>
        <div className="sim-legend-item">
          <div className="legend-swatch" style={{ background: '#111128', border: '1px solid #333' }} />
          <span>Pit — absorbs laser</span>
        </div>
        <div className="sim-legend-item">
          <div className="legend-swatch" style={{ background: '#ff4444', border: '1px solid #ff6666', borderRadius: '50%' }} />
          <span>Laser beam</span>
        </div>
      </div>

      {nrzi ? (
        <p className="sim-note">
          <strong>NRZI mode:</strong> the cell colours no longer map 1-to-1 to the bits above them.
          A data <code>1</code> <em>flips</em> the surface (pit&nbsp;&harr;&nbsp;land) and a <code>0</code>
          keeps it the same — so the laser reads <em>transitions</em>, not the pits themselves. Notice how
          the same character can produce a different pit/land pattern than in simple mode. Real CDs still
          add EFM on top of this, which the sim skips.
        </p>
      ) : (
        <p className="sim-note">
          <strong>Simplified model:</strong> here each pit is a 0 and each land is a 1, one-to-one. Real
          CDs use NRZI &mdash; it's the <em>transitions</em> between pit and land that equal 1, not the pit
          itself. Flip on <strong>NRZI mode</strong> above to see the real encoding.
        </p>
      )}
    </div>
  );
}

export default function OpticalEncoder() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('sim-locked');
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('sim-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <div className="sim-launch-card">
        <div className="sim-launch-icon">💿</div>
        <h3>Encode, Scan, Decode</h3>
        <p>
          Type up to 3 characters, encode them into a disc track of pits and lands, then
          watch a laser scan the surface and decode your text back one bit at a time —
          with an NRZI toggle that switches to how real CDs actually store the data.
        </p>
        <button className="sim-launch-btn" onClick={() => setOpen(true)}>▶ Launch Simulator</button>
        <div className="sim-launch-tags">
          <span className="sim-launch-tag">🔴 Laser pickup</span>
          <span className="sim-launch-tag">🕳️ Pits &amp; lands</span>
          <span className="sim-launch-tag">🔀 NRZI encoding</span>
          <span className="sim-launch-tag">🔤 Binary decode</span>
        </div>
      </div>

      {mounted && createPortal(
        <div
          className={`sim-overlay${open ? ' is-open' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="sim-modal" role="dialog" aria-modal="true" aria-label="Optical Pit &amp; Land Encoder">
            <div className="sim-modal-header">
              <div className="sim-modal-title">
                <span className="sim-modal-title-icon">💿</span> Optical Pit &amp; Land Encoder
              </div>
              <button className="sim-modal-close" onClick={() => setOpen(false)} aria-label="Close simulator">✕</button>
            </div>

            <div className="sim-modal-body">
              {open && <OpticalEncoderContent />}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
