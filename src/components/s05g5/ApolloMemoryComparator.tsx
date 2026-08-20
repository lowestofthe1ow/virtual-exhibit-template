import { animate } from 'animejs';
import { useMemo, useRef, useState } from 'react';

const exhibitAgcBudget = 32 * 1024;
const erasableWords = 2048;
const fixedWords = 36864;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
};

export default function MemoryComparator() {
  const [fileName, setFileName] = useState('No file selected');
  const [fileSize, setFileSize] = useState(0);
  const [hasFile, setHasFile] = useState(false);
  const [message, setMessage] = useState(
    'Choose a local file to compare its size against the exhibit AGC memory budget.'
  );
  const meterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const agcsNeeded = useMemo(
    () => (hasFile ? Math.max(1, Math.ceil(fileSize / exhibitAgcBudget)) : 0),
    [fileSize, hasFile]
  );
  const fill = useMemo(
    () => (hasFile ? Math.min(100, Math.round((fileSize / exhibitAgcBudget) * 100)) : 0),
    [fileSize, hasFile]
  );
  const overBudget = hasFile && fileSize > exhibitAgcBudget;

  const animateMeter = () => {
    if (!meterRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animate(meterRef.current, {
      opacity: [0.72, 1],
      duration: 520,
      ease: 'outExpo',
    });
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setHasFile(true);
    setMessage(
      file.size > exhibitAgcBudget
        ? `This file exceeds the 32 KiB exhibit budget. It would need ${Math.ceil(file.size / exhibitAgcBudget)} AGC-sized memory budgets.`
        : 'This file fits inside the 32 KiB exhibit budget.'
    );
    animateMeter();
  };

  const clearFile = () => {
    setFileName('No file selected');
    setFileSize(0);
    setHasFile(false);
    setMessage('Choose a local file to compare its size against the exhibit AGC memory budget.');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="interactive-module memory-module">
      <div className="module-copy">
        <h3>AGC memory comparison</h3>
        <p>
          The AGC stored mission software in fixed memory and used tiny erasable memory for working
          data. This local-only checker compares a file to a 32 KiB teaching budget inspired by that
          constraint.
        </p>
      </div>

      <div className="memory-readout">
        <div>
          <span className="readout-label">Erasable memory</span>
          <strong>{erasableWords.toLocaleString()} words</strong>
        </div>
        <div>
          <span className="readout-label">Fixed memory</span>
          <strong>{fixedWords.toLocaleString()} words</strong>
        </div>
        <div>
          <span className="readout-label">Exhibit budget</span>
          <strong>32 KiB</strong>
        </div>
      </div>

      <div className="memory-actions">
        <label className="file-drop" htmlFor="memory-file">
          <span>Select local file</span>
          <input
            ref={fileInputRef}
            id="memory-file"
            type="file"
            aria-describedby="memory-privacy memory-result"
            onChange={(event) => handleFile(event.currentTarget.files?.[0])}
          />
        </label>
        <button type="button" className="secondary-button" onClick={clearFile} disabled={!hasFile}>
          Clear file
        </button>
      </div>
      <p className="mission-hint" id="memory-privacy">
        The browser reads only the file size. Nothing is uploaded.
      </p>

      <div
        className="memory-meter"
        ref={meterRef}
        role="progressbar"
        aria-label="Memory budget used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fill}
      >
        <div
          className="memory-meter-fill"
          data-over={overBudget}
          style={{ transform: `scaleX(${fill / 100})` }}
        />
      </div>

      <div className="memory-result" id="memory-result" aria-live="polite">
        <p className="data-line">{fileName}</p>
        <p>
          {hasFile
            ? `${formatBytes(fileSize)} analyzed locally in this browser.`
            : 'No bytes analyzed yet.'}
        </p>
        <p
          className={`memory-status ${!hasFile ? 'status-idle' : overBudget ? 'status-error' : 'status-ok'}`}
        >
          {hasFile
            ? `${agcsNeeded} AGC-sized budget${agcsNeeded === 1 ? '' : 's'} required.`
            : message}
        </p>
        {hasFile && <p>{message}</p>}
      </div>
    </div>
  );
}
