import { useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import Noise from '../reactbits/Noise.jsx';
import { useExhibit } from './ExhibitState.jsx';

// The single global grain instance, used as a health-of-system gauge. Alpha is
// quantized so the underlying canvas only re-inits on meaningful change, not per
// frame. specs/screens/exhibit.md: ~6-20 calm/mid film grain, reserving the loud
// ~70-90 only for the actual overflow spike (instability near 1), then 0 at calm.
function alphaFor(inst) {
  if (inst < 0.04) return 0;
  let a;
  if (inst <= 0.6) a = 6 + (inst / 0.6) * 14; // 6..20 gentle film grain
  else if (inst <= 0.85) a = 20 + ((inst - 0.6) / 0.25) * 22; // 20..42
  else a = 42 + ((inst - 0.85) / 0.15) * 48; // 42..90 spike
  return Math.round(a / 4) * 4; // quantize to steps of 4
}

export default function SystemNoise() {
  const { instability, reducedMotion } = useExhibit();
  const [alpha, setAlpha] = useState(reducedMotion ? 8 : 6);

  useMotionValueEvent(instability, 'change', (v) => {
    if (reducedMotion) return; // frozen calm grain
    const a = alphaFor(v);
    setAlpha((prev) => (prev === a ? prev : a));
  });

  // Faster-moving grain during the spike, slow film grain when calm.
  const refresh = reducedMotion ? 1000 : alpha >= 60 ? 1 : 3;
  const wrap = { position: 'fixed', inset: 0, pointerEvents: 'none' };

  if (reducedMotion) {
    return (
      <div style={wrap}>
        <Noise patternAlpha={8} patternRefreshInterval={1000} />
      </div>
    );
  }

  return (
    <div style={wrap}>
      <Noise patternAlpha={alpha} patternRefreshInterval={refresh} />
    </div>
  );
}
