import { useState, useEffect, useRef } from "react";

  const Slider = ({ label, value, min, max, step, onChange }) => (
    <div className="shader-slider-group">
      <div className="shader-slider-label">
        <span>{label}</span>
        <span className="shader-slider-value">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="shader-range-input"
      />
    </div>
  );
  
export default function S01_Group8_ShaderLab() {
  const canvasRef = useRef(null);
  const [ambient, setAmbient] = useState(0.3);
  const [diffuse, setDiffuse] = useState(0.7);
  const [specular, setSpecular] = useState(0.5);
  const [shininess, setShininess] = useState(32);
  const [lightX, setLightX] = useState(0.5);
  const [lightY, setLightY] = useState(0.3);
  const [colorR, setColorR] = useState(0.2);
  const [colorG, setColorG] = useState(0.7);
  const [colorB, setColorB] = useState(0.3);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) * 0.38;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // Dark background
      ctx.fillStyle = "#06090e";
      ctx.fillRect(0, 0, W, H);

      const imgData = ctx.createImageData(W, H);
      const data = imgData.data;

      // Light vector calculations
      const lx = lightX * 2 - 1;
      const ly = -(lightY * 2 - 1);
      const lz = 0.8;
      const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
      const Lx = lx / lLen, Ly = ly / lLen, Lz = lz / lLen;

      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const dx = px - cx;
          const dy = py - cy;
          const d2 = dx * dx + dy * dy;
          if (d2 > R * R) continue;

          // Sphere normal vector at this pixel
          const z = Math.sqrt(R * R - d2) / R;
          const nx = dx / R, ny = dy / R, nz = z;

          // Diffuse term
          const dot = Math.max(0, nx * Lx + ny * Ly + nz * Lz);

          // Specular term (Phong model)
          const rx = 2 * dot * nx - Lx;
          const ry = 2 * dot * ny - Ly;
          const rz = 2 * dot * nz - Lz;
          const spec = Math.pow(
            Math.max(0, rz / Math.sqrt(rx * rx + ry * ry + rz * rz)),
            shininess
          );

          // Final lighting sum
          const ao = ambient;
          const diff = diffuse * dot;
          const sp = specular * spec;

          const r = Math.min(255, Math.floor((ao * colorR + diff * colorR + sp) * 255));
          const g = Math.min(255, Math.floor((ao * colorG + diff * colorG * 0.9 + sp) * 255));
          const b = Math.min(255, Math.floor((ao * colorB + diff * colorB + sp) * 255));

          const idx = (py * W + px) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Wireframe overlay lines for a sci-fi look
      ctx.strokeStyle = "rgba(141,196,124,0.15)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R, R * Math.abs(Math.cos(angle)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw light source indicator and vector line
      const lScreenX = cx + lx * R * 0.7;
      const lScreenY = cy - ly * R * 0.7;
      ctx.beginPath();
      ctx.arc(lScreenX, lScreenY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#c8a830";
      ctx.fill();
      ctx.strokeStyle = "rgba(200,168,48,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lScreenX, lScreenY);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, [ambient, diffuse, specular, shininess, lightX, lightY, colorR, colorG, colorB]);

  return (
    <div className="shader-lab-grid">
      {/* Simulation Screen */}
      <div className="shader-canvas-container">
        <canvas ref={canvasRef} width={320} height={320} className="shader-canvas" />
        <p style={{ fontSize: "0.75rem", color: "#5a8a5a", marginTop: "1rem", letterSpacing: "0.1em" }}>
          &gt; DRAG SLIDERS TO ADJUST LIGHTING &lt;
        </p>
      </div>

      {/* Control Panels */}
      <div className="shader-controls-sidebar">
        <div className="shader-control-panel">
          <p className="shader-panel-title">LIGHTING MODEL</p>
          <Slider label="AMBIENT" value={ambient} min={0} max={1} step={0.01} onChange={setAmbient} />
          <Slider label="DIFFUSE" value={diffuse} min={0} max={1} step={0.01} onChange={setDiffuse} />
          <Slider label="SPECULAR" value={specular} min={0} max={1} step={0.01} onChange={setSpecular} />
          <Slider label="SHININESS" value={shininess} min={1} max={128} step={1} onChange={setShininess} />
        </div>

        <div className="shader-control-panel">
          <p className="shader-panel-title">LIGHT SOURCE</p>
          <Slider label="LIGHT X" value={lightX} min={0} max={1} step={0.01} onChange={setLightX} />
          <Slider label="LIGHT Y" value={lightY} min={0} max={1} step={0.01} onChange={setLightY} />
        </div>

        <div className="shader-control-panel">
          <p className="shader-panel-title">SURFACE COLOR</p>
          <Slider label="RED" value={colorR} min={0} max={1} step={0.01} onChange={setColorR} />
          <Slider label="GREEN" value={colorG} min={0} max={1} step={0.01} onChange={setColorG} />
          <Slider label="BLUE" value={colorB} min={0} max={1} step={0.01} onChange={setColorB} />
          <div
            className="shader-color-preview"
            style={{
              background: `rgb(${Math.floor(colorR * 255)}, ${Math.floor(colorG * 255)}, ${Math.floor(colorB * 255)})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
