import { useState, useEffect, useRef } from 'react';

const MIN_HZ = 0.5;
const MAX_HZ = 10;

const INSTRUCTIONS = ['MOV', 'ADD', 'SHL', 'ROR'];
const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'];

export default function PipelineSimulator() {
  const [speed, setSpeed] = useState(2);

  return (
    <div style={{
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
      fontFamily: 'JetBrains Mono, monospace'
    }}>

      {/* HEADER BANNER - TOP MOST PART */}
      <div style={{ textAlign: 'center', borderBottom: '1px solid #1a2540', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', color: '#00ffc8', fontWeight: 'bold', fontSize: '1.6rem', letterSpacing: '2px' }}>
          <span style={{ fontSize: '1.8rem', textShadow: '0 0 10px rgba(0,255,200,0.5)' }}>❖</span> CLOCKWORK
        </div>
        <div style={{ color: '#8892b0', fontSize: '0.85rem', marginTop: '0.3rem', letterSpacing: '1px' }}>
          The Rhythm of the Processor
        </div>

        <h1 style={{ color: '#e8edf2', fontSize: '2.2rem', margin: '1.5rem 0 0.5rem 0', fontWeight: '700', letterSpacing: '1px' }}>
          TICK, TOCK, EXECUTE
        </h1>
        <p style={{ color: '#8892b0', fontSize: '1rem', margin: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
          Following the Clock through the CPU pipeline
        </p>
      </div>

      {/* SECTION 1: CLOCK SPEED SLIDER */}
      <ClockSlider speed={speed} onSpeedChange={setSpeed} />

      {/* SECTION 2: OSCILLOSCOPE + SQUARE WAVE */}
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Oscilloscope speed={speed} />
        <SquareWave speed={speed} />
      </div>

      {/* SECTION 3: INSTRUCTION DISPLAY */}
      <InstructionDisplay speed={speed} />

      {/* SECTION 4: GANTT PIPELINE TABLE */}
      <PipelineGantt speed={speed} />

    </div>
  );
}

function ClockSlider({ speed, onSpeedChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(14, 21, 36, 0.65)', backdropFilter: 'blur(6px)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0, 255, 200, 0.2)' }}>
      <style>{`
        input[type=range].custom-slider {
          -webkit-appearance: none;
          width: 100%;
          background: #1a2540;
          height: 6px;
          border-radius: 3px;
          outline: none;
        }
        input[type=range].custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00ffc8;
          cursor: pointer;
          box-shadow: 0 0 10px #00ffc8, 0 0 20px #00ffc8;
          transition: transform 0.1s;
        }
        input[type=range].custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#8892b0', fontSize: '0.9rem' }}>Clock Frequency Control</span>
        <span style={{ color: '#00ffc8', fontWeight: 'bold', textShadow: '0 0 8px rgba(0,255,200,0.3)' }}>
          {speed.toFixed(1)} GHz
        </span>
      </div>
      <input
        type="range"
        min={MIN_HZ}
        max={MAX_HZ}
        step={0.1}
        value={speed}
        onChange={e => onSpeedChange(parseFloat(e.target.value))}
        className="custom-slider"
      />
    </div>
  );
}

function Oscilloscope({ speed }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const trailRef = useRef([]);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const SIZE = 240;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    ctx.scale(DPR, DPR);
    const CX = SIZE / 2, CY = SIZE / 2, R = 80, DOT_R = 6, TRAIL = 35;

    function draw(ts) {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;

      angleRef.current += speedRef.current * 2 * Math.PI * dt;
      const lx = CX + R * Math.cos(angleRef.current);
      const ly = CY + R * Math.sin(angleRef.current);
      trailRef.current.push({ x: lx, y: ly });
      if (trailRef.current.length > TRAIL) trailRef.current.shift();

      ctx.clearRect(0, 0, SIZE, SIZE);
      // canvas background transparent to reveal parallax image

      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const isMajor = i % 3 === 0;
        const x1 = CX + (R + (isMajor ? 12 : 6)) * Math.cos(angle);
        const y1 = CY + (R + (isMajor ? 12 : 6)) * Math.sin(angle);
        const x2 = CX + (R + 2) * Math.cos(angle);
        const y2 = CY + (R + 2) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isMajor ? '#00ffc8' : '#1a2540';
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = '#1a2540';
      ctx.lineWidth = 2;
      ctx.stroke();

      const trail = trailRef.current;
      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = `rgba(0, 255, 200, ${t * 0.45})`;
        ctx.lineWidth = t * 4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffc8';
      ctx.beginPath();
      ctx.arc(lx, ly, DOT_R, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffc8';
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#e8edf2';
      ctx.font = '700 14px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(speedRef.current.toFixed(1) + ' GHz', CX, CY);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', border: '1px solid #1a2540', borderRadius: '8px', flexGrow: 1, maxWidth: '240px' }} />;
}

function SquareWave({ speed }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const W = 320, H = 240;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(DPR, DPR);

    function draw(ts) {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;

      offsetRef.current += speedRef.current * 75 * dt;

      ctx.clearRect(0, 0, W, H);
      // canvas background transparent to reveal parallax image

      ctx.strokeStyle = '#111a2e';
      ctx.lineWidth = 1;
      for (let g = 20; g < W; g += 20) {
        ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(g, H); ctx.stroke();
      }
      for (let g = 20; g < H; g += 20) {
        ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(W, g); ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.strokeStyle = '#1a2540';
      ctx.stroke();

      const period = W / (speedRef.current * 0.45);
      const amp = H * 0.25;
      const mid = H / 2;

      ctx.beginPath();
      ctx.strokeStyle = '#00ffc8';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00ffc8';

      let x = 0;
      while (x < W) {
        const phase = (x + offsetRef.current) % period;
        const high = phase < period / 2;
        const y = high ? mid - amp : mid + amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        const nextPhase = (x + 1 + offsetRef.current) % period;
        const nextHigh = nextPhase < period / 2;
        if (high !== nextHigh) {
          ctx.lineTo(x, nextHigh ? mid - amp : mid + amp);
        }
        x++;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', border: '1px solid #1a2540', borderRadius: '8px', flexGrow: 2, maxWidth: '600px' }} />;
}

function InstructionDisplay({ speed }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const delay = 1000 / speed;
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % INSTRUCTIONS.length);
    }, delay);
    return () => clearInterval(intervalRef.current);
  }, [speed]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(14, 21, 36, 0.65)', backdropFilter: 'blur(6px)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0, 255, 200, 0.2)' }}>
      <div style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Instruction Stream (IF Stage Focus)</div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {INSTRUCTIONS.map((instr, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={instr}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                border: `1px solid ${isActive ? '#00ffc8' : '#1a2540'}`,
                color: isActive ? '#00ffc8' : '#8892b0',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: isActive ? 'rgba(0, 255, 200, 0.08)' : '#0a0e17',
                boxShadow: isActive ? '0 0 15px rgba(0,255,200,0.15)' : 'none',
                transition: 'all 0.15s ease-in-out',
                flex: 1,
                minWidth: '80px',
                textAlign: 'center'
              }}
            >
              {instr}
              {isActive && <div style={{ fontSize: '0.65rem', color: '#00ffc8', marginTop: '3px', fontWeight: 'normal' }}>FETCHING</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineGantt({ speed }) {
  const TOTAL_CYCLES = INSTRUCTIONS.length + STAGES.length - 1;
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const delay = 1000 / speed;
    intervalRef.current = setInterval(() => {
      setCycle(prev => (prev + 1) % TOTAL_CYCLES);
    }, delay);
    return () => clearInterval(intervalRef.current);
  }, [speed]);

  function getStageLabel(instrIndex, cycleIndex) {
    const stageIndex = cycleIndex - instrIndex;
    if (stageIndex >= 0 && stageIndex < STAGES.length) {
      return STAGES[stageIndex];
    }
    return '';
  }

  return (
    <div style={{ background: 'rgba(14, 21, 36, 0.65)', backdropFilter: 'blur(6px)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0, 255, 200, 0.2)', overflowX: 'auto' }}>
      <div style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>5-Stage Execution Gantt Chart</div>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '4px', color: '#e8edf2', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.75rem', color: '#8892b0', textAlign: 'left', background: '#0a0e17', borderRadius: '4px', width: '120px' }}>Instr</th>
            {Array.from({ length: TOTAL_CYCLES }, (_, c) => {
              const isCurrent = c === cycle;
              return (
                <th
                  key={c}
                  style={{
                    padding: '0.75rem',
                    color: isCurrent ? '#00ffc8' : '#8892b0',
                    background: isCurrent ? 'rgba(0, 255, 200, 0.1)' : '#0a0e17',
                    border: isCurrent ? '1px solid #00ffc8' : '1px solid #1a2540',
                    borderRadius: '4px',
                    textAlign: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  C{c + 1}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {INSTRUCTIONS.map((instr, i) => (
            <tr key={instr}>
              <td style={{ padding: '0.75rem', color: '#e8edf2', background: '#0a0e17', borderRadius: '4px', fontWeight: 'bold' }}>{instr}</td>
              {Array.from({ length: TOTAL_CYCLES }, (_, c) => {
                const label = getStageLabel(i, c);
                const isActiveColumn = c === cycle;
                const hasData = label !== '';
                const isExecutingNow = isActiveColumn && hasData;

                return (
                  <td
                    key={c}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: isExecutingNow
                        ? '#00ffc8'
                        : hasData
                          ? '#141b2b'
                          : 'rgba(10,14,23,0.4)',
                      color: isExecutingNow
                        ? '#0a0e17'
                        : hasData
                          ? '#4ecdc4'
                          : 'transparent',
                      border: isExecutingNow
                        ? '1px solid #00ffc8'
                        : hasData
                          ? '1px solid #1a2540'
                          : '1px solid rgba(26,37,64,0.3)',
                      borderRadius: '4px',
                      minWidth: '55px',
                      boxShadow: isExecutingNow ? '0 0 12px rgba(0,255,200,0.4)' : 'none',
                      transition: 'all 0.12s'
                    }}
                  >
                    {label || '.'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}