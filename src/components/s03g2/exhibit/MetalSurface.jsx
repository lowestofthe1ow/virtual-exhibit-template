import styles from './MetalSurface.module.css';

/* Brushed / reflective metal surface (specs/behaviors/metallic-surface.md).
 * A self-contained background layer (no webcam, no getUserMedia): a brushed metal
 * base, an SVG specular-lit sheen, fractal-noise grain, a diagonal highlight, and a
 * frosted back (backdrop-blur of the hull behind). Content is NEVER displaced — this
 * sits behind it at z-index:-1, so drop it as the first child of a panel that is
 * `position:relative; isolation:isolate` with a transparent background.
 *
 * Tunables via CSS vars (pass through `style`): --metal-grain, --metal-sheen,
 * --metal-metalness, --metal-back-blur, --metal-radius. */

export default function MetalSurface({ className = '', style }) {
  return (
    <div className={`${styles.metal} ${className}`} style={style} aria-hidden="true">
      <div className={styles.base} />
      <div className={styles.specular} />
      <div className={styles.grain} />
      <div className={styles.sheen} />
    </div>
  );
}

/* Mount ONCE (e.g. in FatalConversion) so every MetalSurface can reference the
 * specular filter without duplicating the <defs>. */
export function MetalFilters() {
  return (
    <svg className={styles.filterHost} aria-hidden="true" focusable="false">
      <defs>
        {/* Anisotropic fractal noise -> luminance bump -> specular highlight, clipped
            to the source. Reads as light raking across a brushed-metal panel. */}
        <filter id="metal-specular" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.028"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feColorMatrix in="noise" type="luminanceToAlpha" result="bump" />
          <feSpecularLighting
            in="bump"
            surfaceScale="5"
            specularConstant="1.1"
            specularExponent="18"
            lightingColor="#cdd4dc"
            result="spec"
          >
            <fePointLight x="-60" y="-90" z="190" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
