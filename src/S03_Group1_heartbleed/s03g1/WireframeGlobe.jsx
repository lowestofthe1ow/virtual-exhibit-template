import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function WireframeGlobe({ markers = {}, activeKeys = [], onSelect, className = "" }) {
  const mountRef = useRef(null);
  const markerElRefs = useRef({});

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera - positioned to see the whole curved floor. Aspect/size are set
    // for real by the ResizeObserver below once the container has a layout.
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 1.8, 2.8);
    camera.lookAt(0, -0.2, 0);

    // Renderer - sized to fill whatever the parent container actually is,
    // instead of a fixed pixel square, so the globe encompasses the full area.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // ----- CURVED GLOBE-TOP GRID (larger to fill the box) -----
    const radius = 3.2; // Increased radius
    const latSegments = 20;
    const lonSegments = 20;
    const gridLines = [];

    // Latitude lines (horizontal rings at different heights)
    for (let lat = 0; lat <= latSegments; lat++) {
      const phi = (lat / latSegments) * Math.PI / 2;
      const y = radius * Math.cos(phi) - radius;
      const r = radius * Math.sin(phi);

      const points = [];
      for (let lon = 0; lon <= lonSegments; lon++) {
        const theta = (lon / lonSegments) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            r * Math.cos(theta),
            y,
            r * Math.sin(theta)
          )
        );
      }
      gridLines.push(points);
    }

    // Longitude lines (vertical curves from center to edge)
    for (let lon = 0; lon < lonSegments; lon++) {
      const theta = (lon / lonSegments) * Math.PI * 2;
      const points = [];
      for (let lat = 0; lat <= latSegments; lat++) {
        const phi = (lat / latSegments) * Math.PI / 2;
        const y = radius * Math.cos(phi) - radius;
        const r = radius * Math.sin(phi);
        points.push(
          new THREE.Vector3(
            r * Math.cos(theta),
            y,
            r * Math.sin(theta)
          )
        );
      }
      gridLines.push(points);
    }

    // Convert grid lines to LineSegments
    const allPoints = [];
    gridLines.forEach(line => {
      for (let i = 0; i < line.length - 1; i++) {
        allPoints.push(line[i], line[i + 1]);
      }
    });

    const gridGeo = new THREE.BufferGeometry().setFromPoints(allPoints);
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x76c6d7,
      transparent: true,
      opacity: 0.15,
    });
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    scene.add(grid);

    // ----- GLOWING RINGS (concentric on the curved surface) -----
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x76c6d7,
      transparent: true,
      opacity: 0.12,
    });

    for (let lat = 2; lat <= latSegments; lat += 3) {
      const phi = (lat / latSegments) * Math.PI / 2;
      const y = radius * Math.cos(phi) - radius;
      const r = radius * Math.sin(phi);

      const points = [];
      const segments = 48;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            r * Math.cos(theta),
            y,
            r * Math.sin(theta)
          )
        );
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.Line(ringGeo, ringMat);
      scene.add(ring);
    }

    // ----- GLOWING CENTER POINT -----
    const glowPoints = [];
    for (let i = 0; i <= 48; i++) {
      const theta = (i / 48) * Math.PI * 2;
      const radius2 = 0.1 + (i / 48) * 0.4;
      const y = -radius * (1 - Math.cos(radius2 / radius * Math.PI / 2));
      glowPoints.push(
        new THREE.Vector3(
          radius2 * Math.cos(theta),
          y,
          radius2 * Math.sin(theta)
        )
      );
    }
    const glowGeo = new THREE.BufferGeometry().setFromPoints(glowPoints);
    const glowMat = new THREE.LineBasicMaterial({
      color: 0x7ee787,
      transparent: true,
      opacity: 0.5,
    });
    const glow = new THREE.Line(glowGeo, glowMat);
    scene.add(glow);

    // ----- ACCENT MERIDIANS: same longitude curves as the base grid, traced
    // on the globe's actual surface (not flying off past it), with colors that
    // cycle over time like a chasing LED strip. -----
    const accentCount = 7;
    const accentLines = [];

    for (let i = 0; i < accentCount; i++) {
      const theta = (i / accentCount) * Math.PI * 2;
      const points = [];
      for (let lat = 0; lat <= latSegments; lat++) {
        const phi = (lat / latSegments) * Math.PI / 2;
        const y = radius * Math.cos(phi) - radius;
        const r = radius * Math.sin(phi);
        points.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
      }

      const accentGeo = new THREE.BufferGeometry().setFromPoints(points);
      const accentMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(accentGeo, accentMat);
      scene.add(line);
      accentLines.push({ geo: accentGeo, mat: accentMat, phase: i / accentCount });
    }

    // ----- BREACH MARKERS: real 3D points on the dome's surface. Each frame
    // we project these into screen space so the HTML labels/dots track the
    // camera's orbit exactly like they're sitting on the rotating globe.
    // (Just world positions -- the dot itself is the HTML overlay below, so
    // there's no separate mesh here to avoid a doubled-up dot.) -----
    const markerEntries = Object.entries(markers);
    const markerWorldPositions = {};

    markerEntries.forEach(([key, marker], i) => {
      const theta = marker.theta ?? -1.1 + i * 1.1;
      const phi = marker.phi ?? (Math.PI / 2) * 0.82;
      const r = radius * Math.sin(phi);
      const y = radius * Math.cos(phi) - radius;
      const vec = new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta));
      markerWorldPositions[key] = vec;
    });

    // ----- CONTROLS - click-and-drag to spin, no forced auto-rotation -----
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2.2; // Lock vertical rotation
    controls.maxPolarAngle = Math.PI / 2.2; // Lock vertical rotation
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.rotateSpeed = 0.6;
    controls.target.set(0, -0.2, 0);

    // Animation
    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      controls.update();

      const elapsed = clock.getElapsedTime();
      accentLines.forEach(({ mat, phase }) => {
        const hue = (elapsed * 0.06 + phase) % 1;
        mat.color.setHSL(hue, 0.9, 0.6);
      });

      renderer.render(scene, camera);

      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      const tmp = new THREE.Vector3();
      for (const [key, vec] of Object.entries(markerWorldPositions)) {
        const el = markerElRefs.current[key];
        if (!el) continue;
        tmp.copy(vec).project(camera);
        const x = (tmp.x * 0.5 + 0.5) * w;
        const y = (-tmp.y * 0.5 + 0.5) * h;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      }

      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      accentLines.forEach(({ geo, mat }) => {
        geo.dispose();
        mat.dispose();
      });
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [markers]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div
        ref={mountRef}
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
      />

      {Object.entries(markers).map(([key, marker]) => {
        const active = activeKeys.includes(key);
        return (
          <button
            key={key}
            type="button"
            ref={(el) => {
              markerElRefs.current[key] = el;
            }}
            onClick={() => onSelect?.(key)}
            style={{ left: "-100px", top: "-100px" }}
            className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 font-s03g1-heading text-[11px] transition-transform ${
              marker.warn ? "text-s03g1-hb-red" : "text-white/70"
            } ${active ? "scale-110" : ""}`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full border transition-all ${
                active
                  ? "border-white bg-s03g1-hb-red shadow-lg shadow-s03g1-hb-red/50"
                  : "border-white/50 bg-black/40"
              }`}
              aria-hidden="true"
            />
            {marker.label}
          </button>
        );
      })}
    </div>
  );
}
