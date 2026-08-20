import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from './BurnBackdrop.module.css';

/* Four-stage weathered rocket-hull backdrop, ported from the Burn Background
 * design comp (plans/Burn Background.dc.html). Receives `stage` (1–4) and
 * conditionally renders the corresponding visual layers.
 *
 * Stage 1: Pristine — clean metallic hull with subtle sheen
 * Stage 2: Heating — heat shimmer, soot, discoloration, warning lights
 * Stage 3: Burning — fire overlay, char, exposed electrical, torn holes
 * Stage 4: Destroyed — glowing cracks, buckled panels, wreckage, debris
 */

// ── Ember particle system (ported from design comp) ─────────────────────────

function useEmberCanvas(canvasRef, stage, reduced) {
  const embersRef = useRef([]);
  const rafRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const embers = embersRef.current;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    resizeRef.current = resize;
    window.addEventListener('resize', resize);

    const spawn = () => {
      const n = stage;
      const minY = n >= 4 ? 0.1 : n >= 3 ? 0.3 : 0.58;
      const y = H * (minY + Math.random() * (1 - minY));
      embers.push({
        x: Math.random() * W,
        y,
        r: 0.6 + Math.random() * 2.2,
        vy: -(0.15 + Math.random() * 0.85),
        vx: (Math.random() - 0.5) * 0.35,
        life: 0,
        max: 120 + Math.random() * 200,
        hue: 20 + Math.random() * 22,
      });
    };

    const rate = () => {
      if (reduced) return 0;
      return [0, 0, 0.06, 0.35, 0.6][stage] || 0;
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const r = rate();
      if (r > 0 && embers.length < 140 && Math.random() < r) spawn();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;
        e.x += e.vx;
        e.y += e.vy;
        e.vx += (Math.random() - 0.5) * 0.04;
        e.vy -= 0.002;
        const t = e.life / e.max;
        if (t >= 1 || e.y < -20) {
          embers.splice(i, 1);
          continue;
        }
        const a = Math.sin(t * Math.PI) * 0.9;
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        g.addColorStop(0, `hsla(${e.hue}, 100%, 68%, ${a})`);
        g.addColorStop(0.4, `hsla(${e.hue - 6}, 100%, 52%, ${a * 0.6})`);
        g.addColorStop(1, 'hsla(20,100%,45%,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeRef.current);
      embers.length = 0;
    };
  }, [canvasRef, stage, reduced]);
}

// ── Sub-components for complex stage layers ─────────────────────────────────

function RocketSkinDetail({ stage }) {
  const s12 = stage <= 2;
  const s3p = stage >= 3;

  return (
    <div className={styles.skinDetail}>
      {/* Segment rings */}
      <div className={styles.segmentRings} />
      <div className={styles.segmentHighlights} />

      {/* Rivet rows */}
      {[9, 20, 31, 42].map((top, i) => (
        <div
          key={`rivet-${i}`}
          style={{
            position: 'absolute', left: 0, right: 0, top: `${top}%`, height: 4,
            opacity: 0.45 - i * 0.03, mixBlendMode: 'multiply',
            backgroundImage: 'radial-gradient(circle, rgba(40,30,20,0.8) 0 1px, transparent 1.4px)',
            backgroundSize: `${i < 2 ? 26 : 30}px 4px`,
          }}
        />
      ))}

      {/* Upper panels + hatches (always-on, static) */}
      <div style={{ position: 'absolute', left: '10%', top: '11%', width: '8vw', maxWidth: 120, aspectRatio: '3/4', border: '1px solid rgba(60,48,34,0.5)', borderRadius: 3, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.12), inset 0 6px 10px rgba(0,0,0,0.08)' }} />
      <div style={{ position: 'absolute', right: '12%', top: '14%', width: '7vw', maxWidth: 100, aspectRatio: '1/1.3', border: '1px solid rgba(60,48,34,0.5)', borderRadius: 3, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '7%', translate: '-50% 0', width: '10vw', maxWidth: 150, aspectRatio: '4/3', border: '1px solid rgba(60,48,34,0.45)', borderRadius: 4, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', left: '56%', top: '20%', width: '2vw', maxWidth: 26, aspectRatio: '1', borderRadius: '50%', border: '2px solid rgba(60,48,34,0.45)' }} />

      {/* Panels/hatches: crisp in states 1-2, melting in 3+ */}
      {s12 && <StaticPanels />}
      {s3p && <MeltingPanels />}

      {/* Booster vertical seams */}
      <div style={{ position: 'absolute', left: '6%', top: '8%', bottom: '12%', width: 2, background: 'linear-gradient(180deg, rgba(70,55,40,0.4), rgba(70,55,40,0.1))', opacity: 0.5 }} />
      <div style={{ position: 'absolute', right: '6%', top: '8%', bottom: '12%', width: 2, background: 'linear-gradient(180deg, rgba(70,55,40,0.4), rgba(70,55,40,0.1))', opacity: 0.5 }} />

      {/* Markings (both sides) */}
      <Markings side="left" />
      <Markings side="right" />
      <div style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translateX(-50%)', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 'clamp(10px, 2vw, 26px)', letterSpacing: '0.5px', color: 'rgba(30,60,120,0.55)' }}>
        arianespace
      </div>
    </div>
  );
}

function StaticPanels() {
  return (
    <>
      <div className={styles.panelStatic} style={{ left: '15%', top: '35%', width: '9vw', maxWidth: 130, aspectRatio: '3/2', border: '1px solid rgba(50,38,28,0.55)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)' }} />
      <div className={styles.panelStatic} style={{ right: '17%', top: '39%', width: '8vw', maxWidth: 120, aspectRatio: '2/3', border: '1px solid rgba(50,38,28,0.55)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.07)' }} />
      <div className={styles.hatchStatic} style={{ left: '31%', top: '24%', width: '3.4vw', maxWidth: 46, aspectRatio: '1', border: '2px solid rgba(60,48,34,0.5)', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(255,255,255,0.25)' }} />
      <div className={styles.hatchStatic} style={{ right: '31%', top: '29%', width: '2.6vw', maxWidth: 34, aspectRatio: '1', border: '2px solid rgba(60,48,34,0.5)', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(255,255,255,0.2)' }} />
      <div className={styles.panelStatic} style={{ left: '24%', top: '58%', width: '10vw', maxWidth: 150, aspectRatio: '4/3', border: '1px solid rgba(55,42,30,0.5)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.09)' }} />
      <div className={styles.panelStatic} style={{ right: '22%', top: '63%', width: '8vw', maxWidth: 120, aspectRatio: '3/2', border: '1px solid rgba(55,42,30,0.5)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)' }} />
      <div className={styles.hatchStatic} style={{ left: '50%', top: '74%', translate: '-50% 0', width: '3vw', maxWidth: 40, aspectRatio: '1', border: '2px solid rgba(55,42,30,0.5)', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.12), inset 0 -2px 4px rgba(255,255,255,0.2)' }} />
      <div className={styles.panelStatic} style={{ left: '12%', top: '80%', width: '9vw', maxWidth: 130, aspectRatio: '3/2', border: '1px solid rgba(55,42,30,0.45)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.07)' }} />
      <div className={styles.panelStatic} style={{ right: '14%', top: '82%', width: '7vw', maxWidth: 105, aspectRatio: '1/1.2', border: '1px solid rgba(55,42,30,0.45)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.07)' }} />
    </>
  );
}

function MeltingPanels() {
  return (
    <>
      <div className={styles.panelMeltA} style={{ left: '15%', top: '35%', width: '9vw', maxWidth: 130, aspectRatio: '3/2', border: '1px solid rgba(50,38,28,0.55)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)' }} />
      <div className={styles.panelMeltB} style={{ right: '17%', top: '39%', width: '8vw', maxWidth: 120, aspectRatio: '2/3', border: '1px solid rgba(50,38,28,0.55)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.07)' }} />
      <div className={styles.hatchMelt} style={{ left: '31%', top: '24%', width: '3.4vw', maxWidth: 46, aspectRatio: '1', border: '2px solid rgba(60,48,34,0.5)', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(255,255,255,0.25)', animationDelay: '-6s' }} />
      <div className={styles.hatchMelt} style={{ right: '31%', top: '29%', width: '2.6vw', maxWidth: 34, aspectRatio: '1', border: '2px solid rgba(60,48,34,0.5)', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(255,255,255,0.2)', animationDelay: '-8s' }} />
    </>
  );
}

const FLAGS = [
  { bg: 'linear-gradient(90deg,#000 33%,#c00 33% 66%,#fc0 66%)', o: 0.75 },
  { bg: 'linear-gradient(90deg,#002395 33%,#fff 33% 66%,#ED2939 66%)', o: 0.75 },
  { bg: 'linear-gradient(180deg,#009246 33%,#fff 33% 66%,#CE2B37 66%)', o: 0.75 },
  { bg: 'linear-gradient(90deg,#AA151B 25%,#F1BF00 25% 75%,#AA151B 75%)', o: 0.75 },
  { bg: 'linear-gradient(180deg,#21468B 33%,#fff 33% 66%,#AE1C28 66%)', o: 0.7 },
  { bg: 'linear-gradient(180deg,#00247D 50%,#EF3340 50%)', o: 0.7 },
  { bg: 'linear-gradient(90deg,#006AA7 40%,#FECC00 40% 60%,#006AA7 60%)', o: 0.7 },
  { bg: 'linear-gradient(180deg,#D52B1E 30%,#fff 30% 70%,#D52B1E 70%)', o: 0.7 },
];

function Markings({ side }) {
  const isLeft = side === 'left';
  return (
    <div className={styles.markingsWrap} style={{
      [isLeft ? 'left' : 'right']: '8%', top: '18%', width: '6vw', maxWidth: 84,
      alignItems: isLeft ? 'flex-start' : 'flex-end',
    }}>
      <div className={styles.flagGrid}>
        {FLAGS.map((f, i) => (
          <div key={i} className={styles.flagCell} style={{ background: f.bg, opacity: f.o }} />
        ))}
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: 'clamp(12px, 2.6vw, 34px)', letterSpacing: -1, color: 'rgba(30,60,120,0.62)', fontStyle: 'italic', lineHeight: 1 }}>
        esa
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 'clamp(9px, 1.9vw, 24px)', letterSpacing: 1, color: 'rgba(30,60,120,0.5)', lineHeight: 1 }}>
        cnes
      </div>
    </div>
  );
}

// ── Stage 2+ warning lights / scorch / stress cracks ────────────────────────

function Stage2PlusLayers() {
  return (
    <>
      {/* Warning lights */}
      <div className={styles.warnLight} style={{ left: '17%', top: '12%', width: 7, height: 7, background: '#ffb020' }} />
      <div className={styles.warnLight} style={{ right: '14%', top: '16%', width: 6, height: 6, background: '#ffb020', boxShadow: '0 0 6px 2px rgba(255,176,32,0.6)', animationDuration: '1.8s', animationDelay: '-0.5s' }} />
      <div className={styles.warnLight} style={{ left: '17%', top: '36.5%', width: 8, height: 8, background: '#ffb020', boxShadow: '0 0 8px 2px rgba(255,176,32,0.8)', animationDuration: '1.6s' }} />
      <div className={styles.warnLightRed} style={{ right: '19%', top: '41%', width: 8, height: 8, animationDuration: '1.1s', animationDelay: '-0.4s' }} />
      <div className={styles.warnLight} style={{ left: '26%', top: '60%', width: 7, height: 7, background: '#ffb020', animationDelay: '-0.9s' }} />
      <div className={styles.warnLightRed} style={{ right: '28%', top: '55%', width: 6, height: 6, background: '#ff3020', boxShadow: '0 0 8px 3px rgba(255,48,32,0.7)', animationDuration: '0.9s', animationDelay: '-0.6s' }} />
      <div className={styles.warnLight} style={{ left: '42%', top: '72%', width: 7, height: 7, background: '#ffb020', boxShadow: '0 0 7px 2px rgba(255,176,32,0.6)', animationDuration: '1.8s', animationDelay: '-1.2s' }} />

      {/* Scorch marks */}
      <div className={styles.scorchMark} style={{ left: '20%', top: '22%', width: '18vw', maxWidth: 260, aspectRatio: '3/1', opacity: 0.35, background: 'radial-gradient(50% 50% at 50% 50%, rgba(140,90,40,0.35) 0%, rgba(0,0,0,0) 100%)' }} />
      <div className={styles.scorchMark} style={{ right: '15%', top: '35%', width: '14vw', maxWidth: 200, aspectRatio: '2.5/1', opacity: 0.3, background: 'radial-gradient(50% 50% at 50% 50%, rgba(130,80,35,0.3) 0%, rgba(0,0,0,0) 100%)' }} />
      <div className={styles.scorchMark} style={{ left: '36%', top: '68%', width: '20vw', maxWidth: 300, aspectRatio: '3/1', opacity: 0.5, background: 'radial-gradient(50% 50% at 50% 50%, rgba(160,110,50,0.4) 0%, rgba(0,0,0,0) 100%)' }} />

      {/* Stress cracks */}
      <div className={styles.stressCrack} style={{ left: '12%', top: '18%', width: '10vw', maxWidth: 150, opacity: 0.25, transform: 'rotate(-3deg)', background: 'linear-gradient(90deg, transparent, rgba(80,50,25,0.5), transparent)' }} />
      <div className={styles.stressCrack} style={{ right: '20%', top: '32%', width: '12vw', maxWidth: 180, opacity: 0.3, transform: 'rotate(4deg)', background: 'linear-gradient(90deg, transparent, rgba(80,50,25,0.6), transparent)' }} />
      <div className={styles.stressCrack} style={{ left: '20%', top: '70%', width: '12vw', maxWidth: 180, opacity: 0.3, transform: 'rotate(-5deg)', background: 'linear-gradient(90deg, transparent, rgba(80,50,25,0.6), transparent)' }} />
      <div className={styles.stressCrack} style={{ right: '25%', top: '75%', width: '10vw', maxWidth: 150, opacity: 0.25, transform: 'rotate(3deg)', background: 'linear-gradient(90deg, transparent, rgba(80,50,25,0.5), transparent)' }} />
    </>
  );
}

// ── Stage 3+ exposed electrical / RSI damage ────────────────────────────────

function Stage3PlusLayers() {
  return (
    <>
      {/* Upper junction box */}
      <div className={styles.junctionBox} style={{ left: '12%', top: '14%', width: '6vw', maxWidth: 85, aspectRatio: '4/3' }}>
        <div className={styles.junctionInner} />
        <div style={{ position: 'absolute', left: '12%', top: '30%', width: '76%', height: 3, background: '#7a2a1a', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: '12%', top: '52%', width: '60%', height: 3, background: '#23406e', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: '12%', top: '72%', width: '68%', height: 3, background: '#6e6620', borderRadius: 2 }} />
        <div className={styles.spark} style={{ right: '6%', top: '22%', width: 10, height: 10, background: '#fff3c0', boxShadow: '0 0 14px 5px rgba(255,220,120,0.9)' }} />
      </div>

      {/* Mid-right sparking unit */}
      <div className={styles.junctionBox} style={{ right: '15%', top: '32%', width: '5vw', maxWidth: 72, aspectRatio: '1' }}>
        <div className={styles.junctionInner} style={{ background: 'linear-gradient(180deg, #141009, #201509)' }} />
        <div style={{ position: 'absolute', left: '15%', top: '40%', width: '70%', height: 3, background: '#7a2a1a', borderRadius: 2, transform: 'rotate(-8deg)' }} />
        <div style={{ position: 'absolute', left: '20%', top: '62%', width: '55%', height: 3, background: '#23406e', borderRadius: 2, transform: 'rotate(5deg)' }} />
        <div className={styles.spark} style={{ left: '8%', bottom: '8%', width: 9, height: 9, background: '#d9ecff', boxShadow: '0 0 14px 5px rgba(150,200,255,0.9)', animationDuration: '3.1s', animationDelay: '-1.2s' }} />
      </div>

      {/* Mid-left wire bundle */}
      <div style={{ position: 'absolute', left: '38%', top: '42%', width: '5vw', maxWidth: 70, aspectRatio: '1/2' }}>
        <div className={styles.wire} style={{ left: '15%', top: 0, height: '65%', background: 'linear-gradient(180deg, #7a2a1a, #4a1510)', transform: 'rotate(5deg)', animation: 'wireSwing 6s ease-in-out infinite' }} />
        <div className={styles.wire} style={{ left: '45%', top: 0, height: '80%', background: 'linear-gradient(180deg, #23406e, #152840)', transform: 'rotate(-3deg)', animation: 'wireSwing 7.5s ease-in-out infinite', animationDelay: '-2s' }} />
        <div className={styles.wire} style={{ left: '70%', top: 0, height: '55%', background: 'linear-gradient(180deg, #6e6620, #3a3510)', transform: 'rotate(7deg)', animation: 'wireSwing 5.5s ease-in-out infinite', animationDelay: '-4s' }} />
        <div className={styles.spark} style={{ left: '12%', top: '63%', width: 7, height: 7, background: '#eaf4ff', boxShadow: '0 0 10px 4px rgba(160,210,255,0.9)', animationDuration: '1.7s', animationDelay: '-0.6s' }} />
      </div>

      {/* Lower-left junction box */}
      <div className={styles.junctionBox} style={{ left: '18%', top: '60%', width: '7vw', maxWidth: 100, aspectRatio: '4/3' }}>
        <div className={styles.junctionInner} />
        <div style={{ position: 'absolute', left: '12%', top: '35%', width: '76%', height: 3, background: '#7a2a1a', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: '12%', top: '58%', width: '60%', height: 3, background: '#23406e', borderRadius: 2 }} />
        <div className={styles.spark} style={{ right: '6%', top: '22%', width: 10, height: 10, background: '#fff3c0', boxShadow: '0 0 14px 5px rgba(255,220,120,0.9)', animationDuration: '2.8s', animationDelay: '-0.8s' }} />
      </div>

      {/* Lower-right wire bundle */}
      <div style={{ position: 'absolute', right: '20%', top: '62%', width: '5vw', maxWidth: 70, aspectRatio: '1/1.8' }}>
        <div className={styles.wire} style={{ left: '20%', top: 0, height: '70%', background: 'linear-gradient(180deg, #7a2a1a, #4a1510)', transform: 'rotate(-4deg)', animation: 'wireSwing 6.5s ease-in-out infinite', animationDelay: '-1s' }} />
        <div className={styles.wire} style={{ left: '55%', top: 0, height: '85%', background: 'linear-gradient(180deg, #2a5530, #152a18)', transform: 'rotate(6deg)', animation: 'wireSwing 8s ease-in-out infinite', animationDelay: '-3s' }} />
        <div className={styles.wire} style={{ left: '80%', top: 0, height: '60%', background: 'linear-gradient(180deg, #6e6620, #3a3510)', transform: 'rotate(-6deg)', animation: 'wireSwing 5s ease-in-out infinite', animationDelay: '-5s' }} />
        <div className={styles.spark} style={{ left: '50%', top: '83%', width: 6, height: 6, background: '#ffe8a0', boxShadow: '0 0 8px 3px rgba(255,220,120,0.85)', animationDuration: '2.4s', animationDelay: '-1.1s' }} />
      </div>

      {/* Dents */}
      <div className={styles.dent} style={{ left: '20%', top: '18%', width: '9vw', maxWidth: 130, aspectRatio: '2/1', background: 'radial-gradient(60% 60% at 42% 38%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 55%, rgba(255,200,140,0.1) 78%, rgba(0,0,0,0) 100%)' }} />
      <div className={styles.dent} style={{ right: '24%', top: '38%', width: '11vw', maxWidth: 160, aspectRatio: '2/1', background: 'radial-gradient(60% 60% at 42% 38%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 55%, rgba(255,200,140,0.14) 78%, rgba(0,0,0,0) 100%)' }} />
      <div className={styles.dent} style={{ left: '44%', top: '50%', width: '8vw', maxWidth: 120, aspectRatio: '2/1', background: 'radial-gradient(60% 60% at 55% 40%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 55%, rgba(255,200,140,0.12) 78%, rgba(0,0,0,0) 100%)' }} />

      {/* Upper torn hole */}
      <div className={styles.tornGlow} style={{ right: '10%', top: '8%', width: '12vw', maxWidth: 170, aspectRatio: '4/3', filter: 'blur(3px)', background: 'rgba(255,120,30,0.4)', clipPath: 'polygon(10% 30%, 28% 8%, 50% 18%, 70% 0%, 88% 22%, 100% 50%, 80% 70%, 60% 60%, 40% 80%, 20% 60%, 0% 48%)' }} />
      <div className={styles.tornInner} style={{ right: '10.3%', top: '8.5%', width: '11.5vw', maxWidth: 164, aspectRatio: '4/3', background: 'repeating-linear-gradient(90deg, rgba(70,45,28,0.55) 0 3px, rgba(10,5,3,0) 3px 18px), linear-gradient(180deg, #0a0503 0%, #170c06 60%, #22110a 100%)', clipPath: 'polygon(12% 32%, 28% 10%, 50% 20%, 70% 2%, 86% 24%, 98% 52%, 78% 68%, 60% 60%, 40% 78%, 22% 60%, 2% 48%)' }} />

      {/* Lower torn hole */}
      <div className={styles.tornGlow} style={{ left: '54%', top: '58%', width: '15vw', maxWidth: 220, aspectRatio: '4/3', filter: 'blur(3px)', background: 'rgba(255,120,30,0.5)', clipPath: 'polygon(6% 36%, 22% 10%, 43% 20%, 58% 0%, 74% 24%, 97% 32%, 84% 58%, 98% 80%, 66% 90%, 48% 72%, 30% 96%, 12% 66%, 0% 52%)' }} />
      <div className={styles.tornInner} style={{ left: '54.3%', top: '58.5%', width: '14.4vw', maxWidth: 212, aspectRatio: '4/3', background: 'repeating-linear-gradient(90deg, rgba(70,45,28,0.55) 0 3px, rgba(10,5,3,0) 3px 18px), linear-gradient(180deg, #0a0503 0%, #170c06 60%, #22110a 100%)', clipPath: 'polygon(8% 38%, 22% 12%, 43% 22%, 58% 2%, 72% 26%, 95% 34%, 82% 58%, 96% 78%, 66% 88%, 48% 72%, 30% 94%, 14% 66%, 0% 52%)' }} />

      {/* RSI circuit board */}
      <div style={{ position: 'absolute', left: '55%', top: '24%', width: '5vw', maxWidth: 70, aspectRatio: '1' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #18110a, #241810)', border: '1px solid rgba(30,18,10,0.8)', borderRadius: 2, boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.7)' }} />
        <div style={{ position: 'absolute', left: '10%', top: '25%', width: '80%', height: 2, background: '#2a5530', borderRadius: 1 }} />
        <div style={{ position: 'absolute', left: '10%', top: '50%', width: '65%', height: 2, background: '#2a5530', borderRadius: 1 }} />
        <div style={{ position: 'absolute', left: '10%', top: '75%', width: '50%', height: 2, background: '#553025', borderRadius: 1 }} />
        <div style={{ position: 'absolute', left: '55%', top: '35%', width: '30%', height: '20%', background: '#0d0d0d', border: '1px solid rgba(80,80,80,0.4)' }} />
        <div className={styles.spark} style={{ right: '8%', top: '12%', width: 8, height: 8, background: '#d0f0ff', boxShadow: '0 0 12px 4px rgba(140,200,255,0.85)', animationDuration: '1.4s' }} />
      </div>

      {/* Electrical arcs */}
      <div className={styles.arc} style={{ left: '30%', top: '26%', height: '2.5vh', background: 'linear-gradient(180deg, rgba(160,210,255,0.9), rgba(100,160,255,0.4))', boxShadow: '0 0 6px 2px rgba(140,200,255,0.5)' }} />
      <div className={styles.arc} style={{ right: '25%', top: '48%', height: '2vh', transform: 'rotate(15deg)', background: 'linear-gradient(180deg, rgba(255,200,100,0.9), rgba(255,160,60,0.4))', boxShadow: '0 0 6px 2px rgba(255,200,100,0.5)', animationDuration: '2.6s', animationDelay: '-1.4s' }} />
      <div className={styles.arc} style={{ left: '48%', top: '76%', height: '3vh', background: 'linear-gradient(180deg, rgba(160,210,255,0.9), rgba(100,160,255,0.4))', boxShadow: '0 0 6px 2px rgba(140,200,255,0.5)', animationDuration: '2.9s', animationDelay: '-0.8s' }} />

      {/* Warning display panel */}
      <div className={styles.warnPanel} style={{ right: '10%', top: '52%', width: '4vw', maxWidth: 55, aspectRatio: '3/2' }}>
        <div className={styles.warnPanelOuter} />
        <div className={styles.warnPanelFlash} />
        <div style={{ position: 'absolute', left: '15%', top: '30%', width: '70%', height: 2, background: 'rgba(255,60,30,0.5)', animation: 'warnBlink 1.2s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', left: '15%', top: '55%', width: '50%', height: 2, background: 'rgba(255,60,30,0.4)', animation: 'warnBlink 1.5s ease-in-out infinite', animationDelay: '-0.3s' }} />
      </div>
    </>
  );
}

// ── Stage 4 total wreckage ──────────────────────────────────────────────────

function Stage4Layers() {
  return (
    <>
      {/* Upper buckled panel */}
      <div className={styles.buckledHole} style={{ left: '8%', top: '6%', width: '8vw', maxWidth: 110, aspectRatio: '3/2', background: 'linear-gradient(180deg, #0d0705, #1c0f08)' }} />
      <div className={styles.buckledFlap} style={{ left: '6%', top: '4%', width: '9vw', maxWidth: 125, aspectRatio: '3/2', transform: 'rotate(-6deg) skewX(-4deg)', background: 'linear-gradient(155deg, rgba(150,105,60,0.9) 0%, rgba(95,60,32,0.95) 55%, rgba(45,26,14,1) 100%)', border: '1px solid rgba(25,15,8,0.85)' }} />

      {/* Mid buckled panel */}
      <div className={styles.buckledHole} style={{ left: '23.5%', top: '44%', width: '8vw', maxWidth: 115, aspectRatio: '3/2', background: 'linear-gradient(180deg, #0d0705, #1c0f08)' }} />
      <div className={styles.buckledFlap} style={{ left: '21%', top: '42%', width: '9vw', maxWidth: 130, aspectRatio: '3/2', transform: 'rotate(-8deg) skewX(-5deg)', background: 'linear-gradient(155deg, rgba(150,105,60,0.9) 0%, rgba(95,60,32,0.95) 55%, rgba(45,26,14,1) 100%)', border: '1px solid rgba(25,15,8,0.85)' }} />

      {/* Huge torn-away sections — upper left */}
      <div className={styles.tornSection} style={{ left: '-2%', top: '20%', width: '28vw', maxWidth: 400, aspectRatio: '5/3', filter: 'blur(4px)', background: 'rgba(255,100,25,0.35)', clipPath: 'polygon(0% 100%, 0% 40%, 12% 52%, 22% 28%, 36% 48%, 50% 34%, 62% 58%, 76% 50%, 90% 70%, 100% 100%)' }} />
      <div className={styles.tornSection} style={{ left: '-2%', top: '21%', width: '28vw', maxWidth: 400, aspectRatio: '5/3', background: 'repeating-linear-gradient(90deg, rgba(70,45,28,0.4) 0 3px, rgba(10,5,3,0) 3px 22px), linear-gradient(180deg, #120906 0%, #0a0504 70%, #060302 100%)', clipPath: 'polygon(0% 100%, 0% 42%, 12% 54%, 22% 30%, 36% 50%, 50% 36%, 62% 60%, 76% 52%, 90% 72%, 100% 100%)' }} />

      {/* Huge torn-away sections — lower */}
      <div className={styles.tornSection} style={{ left: '-2%', top: '74%', width: '34vw', maxWidth: 480, aspectRatio: '5/3', filter: 'blur(4px)', background: 'rgba(255,100,25,0.4)', clipPath: 'polygon(0% 100%, 0% 30%, 14% 44%, 26% 18%, 40% 40%, 55% 26%, 68% 52%, 84% 44%, 100% 70%, 100% 100%)' }} />
      <div className={styles.tornSection} style={{ left: '-2%', top: '75%', width: '34vw', maxWidth: 480, aspectRatio: '5/3', background: 'repeating-linear-gradient(90deg, rgba(70,45,28,0.4) 0 3px, rgba(10,5,3,0) 3px 22px), linear-gradient(180deg, #120906 0%, #0a0504 70%, #060302 100%)', clipPath: 'polygon(0% 100%, 0% 32%, 14% 46%, 26% 20%, 40% 42%, 55% 28%, 68% 54%, 84% 46%, 100% 72%, 100% 100%)' }} />

      {/* Right torn-away section */}
      <div className={styles.tornSection} style={{ right: '-2%', top: '60%', width: '30vw', maxWidth: 430, aspectRatio: '5/3', filter: 'blur(4px)', background: 'rgba(255,110,30,0.38)', clipPath: 'polygon(100% 100%, 100% 24%, 86% 40%, 72% 16%, 58% 44%, 44% 30%, 30% 58%, 16% 48%, 0% 76%, 0% 100%)' }} />
      <div className={styles.tornSection} style={{ right: '-2%', top: '61%', width: '30vw', maxWidth: 430, aspectRatio: '5/3', background: 'repeating-linear-gradient(90deg, rgba(70,45,28,0.4) 0 3px, rgba(10,5,3,0) 3px 24px), linear-gradient(180deg, #140a06 0%, #0b0504 70%, #060302 100%)', clipPath: 'polygon(100% 100%, 100% 26%, 86% 42%, 72% 18%, 58% 46%, 44% 32%, 30% 60%, 16% 50%, 0% 78%, 0% 100%)' }} />

      {/* Curled metal flaps */}
      <div className={styles.metalFlap} style={{ right: '22%', top: '18%', width: '5vw', maxWidth: 72, aspectRatio: '1', transform: 'rotate(18deg)', background: 'linear-gradient(135deg, rgba(200,150,95,0.85) 0%, rgba(90,55,28,0.95) 60%, rgba(30,16,9,1) 100%)', clipPath: 'polygon(0% 0%, 100% 18%, 78% 62%, 92% 100%, 34% 82%, 12% 44%)' }} />
      <div className={styles.metalFlap} style={{ left: '30%', top: '72%', width: '6vw', maxWidth: 90, aspectRatio: '1', transform: 'rotate(24deg)', background: 'linear-gradient(135deg, rgba(200,150,95,0.85) 0%, rgba(90,55,28,0.95) 60%, rgba(30,16,9,1) 100%)', clipPath: 'polygon(0% 0%, 100% 18%, 78% 62%, 92% 100%, 34% 82%, 12% 44%)' }} />
      <div className={styles.metalFlap} style={{ right: '34%', top: '76%', width: '5vw', maxWidth: 76, aspectRatio: '1', transform: 'rotate(-31deg)', background: 'linear-gradient(155deg, rgba(190,140,88,0.8) 0%, rgba(80,48,25,0.95) 55%, rgba(25,13,8,1) 100%)', clipPath: 'polygon(12% 0%, 88% 10%, 100% 54%, 66% 100%, 22% 88%, 0% 38%)' }} />

      {/* Scuff marks */}
      <div className={styles.scuff} style={{ left: '15%', top: '12%', width: '16vw', maxWidth: 230, opacity: 0.45, transform: 'rotate(-4deg)', background: 'linear-gradient(90deg, transparent, rgba(40,25,15,0.7) 20%, rgba(60,35,18,0.5) 60%, rgba(40,25,15,0.3) 80%, transparent)' }} />
      <div className={styles.scuff} style={{ right: '18%', top: '28%', width: '12vw', maxWidth: 180, opacity: 0.5, transform: 'rotate(3deg)', background: 'linear-gradient(90deg, transparent, rgba(35,22,12,0.7) 30%, rgba(55,35,18,0.4) 70%, transparent)' }} />
      <div className={styles.scuff} style={{ left: '28%', top: '50%', width: '18vw', maxWidth: 260, opacity: 0.5, transform: 'rotate(-3deg)', background: 'linear-gradient(90deg, transparent, rgba(40,25,15,0.7) 20%, rgba(60,35,18,0.5) 60%, rgba(40,25,15,0.3) 80%, transparent)' }} />
      <div className={styles.scuff} style={{ left: '10%', top: '65%', width: '10vw', maxWidth: 150, height: 1, opacity: 0.35, transform: 'rotate(4deg)', background: 'linear-gradient(90deg, transparent, rgba(45,28,14,0.6) 25%, rgba(50,30,15,0.5) 75%, transparent)' }} />
      <div className={styles.scuff} style={{ right: '16%', top: '56%', width: '8vw', maxWidth: 120, opacity: 0.4, transform: 'rotate(-8deg)', background: 'linear-gradient(90deg, transparent, rgba(40,25,12,0.65), transparent)' }} />

      {/* Internal framing */}
      <div className={styles.framing} style={{ left: '55%', top: '15%', width: '20vw', maxWidth: 280, aspectRatio: '5/2', opacity: 0.5 }} />
      <div className={styles.framing} style={{ left: '38%', top: '78%', width: '24vw', maxWidth: 340, aspectRatio: '5/2', opacity: 0.6 }} />

      {/* Sparking electrical */}
      <div className={styles.spark} style={{ left: '10%', top: '30%', width: 8, height: 8, background: '#ffe9b0', boxShadow: '0 0 14px 6px rgba(255,210,110,0.9)', animationDuration: '2.7s', animationDelay: '-1.8s' }} />
      <div className={styles.spark} style={{ right: '12%', top: '22%', width: 7, height: 7, background: '#dcecff', boxShadow: '0 0 13px 5px rgba(160,205,255,0.9)', animationDuration: '2.1s', animationDelay: '-0.5s' }} />
      <div className={styles.spark} style={{ left: '44%', top: '82%', width: 7, height: 7, background: '#fff0c0', boxShadow: '0 0 10px 4px rgba(255,230,140,0.85)', animationDuration: '3.4s', animationDelay: '-2.1s' }} />
      <div className={styles.spark} style={{ left: '10%', top: '84%', width: 9, height: 9, background: '#ffe9b0', boxShadow: '0 0 14px 6px rgba(255,210,110,0.9)', animationDuration: '2.5s', animationDelay: '-0.3s' }} />
      <div className={styles.spark} style={{ right: '15%', top: '75%', width: 8, height: 8, background: '#dcecff', boxShadow: '0 0 13px 5px rgba(160,205,255,0.9)', animationDuration: '1.9s', animationDelay: '-1.2s' }} />

      {/* Debris */}
      <div className={styles.debris} style={{ left: '8%', top: '38%', width: '2.4vw', maxWidth: 34, aspectRatio: '1', transform: 'rotate(35deg)', background: '#1a0e08', clipPath: 'polygon(0 20%, 70% 0, 100% 60%, 40% 100%)' }} />
      <div className={styles.debris} style={{ right: '10%', top: '45%', width: '2vw', maxWidth: 28, aspectRatio: '1', transform: 'rotate(70deg)', background: '#1e100a', clipPath: 'polygon(0 0, 100% 30%, 60% 100%)' }} />
      <div className={styles.debris} style={{ left: '12%', top: '88%', width: '2.6vw', maxWidth: 36, aspectRatio: '1', transform: 'rotate(40deg)', background: '#1a0e08', clipPath: 'polygon(0 20%, 70% 0, 100% 60%, 40% 100%)' }} />
      <div className={styles.debris} style={{ left: '40%', top: '91%', width: '3.4vw', maxWidth: 48, aspectRatio: '1.4', transform: 'rotate(-18deg)', background: '#150b06', clipPath: 'polygon(10% 0, 100% 24%, 76% 100%, 0 70%)' }} />
      <div className={styles.debris} style={{ left: '58%', top: '86%', width: '2vw', maxWidth: 28, aspectRatio: '1', transform: 'rotate(70deg)', background: '#1e100a', clipPath: 'polygon(0 0, 100% 30%, 60% 100%)' }} />
      <div className={styles.debris} style={{ right: '18%', top: '90%', width: '3vw', maxWidth: 42, aspectRatio: '1.2', transform: 'rotate(12deg)', background: '#170c07', clipPath: 'polygon(0 30%, 60% 0, 100% 50%, 70% 100%, 10% 90%)' }} />
      <div className={styles.debris} style={{ right: '40%', top: '94%', width: '2.4vw', maxWidth: 34, aspectRatio: '1', transform: 'rotate(-52deg)', background: '#130a06', clipPath: 'polygon(20% 0, 100% 40%, 50% 100%, 0 60%)' }} />
    </>
  );
}

// ── Main BurnBackdrop component ─────────────────────────────────────────────

export default function BurnBackdrop({ stage = 1 }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef(null);
  useEmberCanvas(canvasRef, stage, reduced);

  const s = stage; // shorthand
  const s2p = s >= 2;
  const s3p = s >= 3;
  const isS4 = s === 4;

  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* Base wash — exactly one per stage */}
      {s === 1 && <div className={styles.baseS1} />}
      {s === 2 && <div className={styles.baseS2} />}
      {s === 3 && <div className={styles.baseS3} />}
      {s === 4 && <div className={styles.baseS4} />}

      {/* Stage 1: pristine metallic sheen */}
      {s === 1 && (
        <>
          <div className={styles.s1Sheen} />
          <div className={styles.s1Lines} />
        </>
      )}

      {/* Stage 2+: heat shimmer + scorch */}
      {s2p && (
        <>
          <div className={styles.heatShimmer} />
          <div className={styles.sootStreaks} />
          <div className={styles.heatDiscolor} />
          <div className={styles.heatGlow} />
        </>
      )}

      {/* Stage 3+: intense fire overlay + char */}
      {s3p && (
        <>
          <div className={styles.fireOverlay} />
          <div className={styles.charTexture} />
        </>
      )}

      {/* Stage 4: glowing crack seams */}
      {isS4 && <div className={styles.crackSeams} />}

      {/* Fine grain (all states) */}
      <div className={styles.grain} />

      {/* Rocket skin detail (all states) */}
      <RocketSkinDetail stage={stage} />

      {/* Stage 2+: warning lights, scorch marks, stress cracks */}
      {s2p && <Stage2PlusLayers />}

      {/* Stage 3+: exposed electrical, torn holes, dents */}
      {s3p && <Stage3PlusLayers />}

      {/* Stage 4: total wreckage */}
      {isS4 && <Stage4Layers />}

      {/* Ember canvas */}
      <canvas ref={canvasRef} className={styles.emberCanvas} />

      {/* Vignette — intensity scales with stage */}
      {s === 1 && <div className={styles.vignetteS1} />}
      {s === 2 && <div className={styles.vignetteS2} />}
      {s3p && <div className={styles.vignetteS3Plus} />}
    </div>
  );
}
